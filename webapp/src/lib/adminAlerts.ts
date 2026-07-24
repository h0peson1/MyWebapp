import { formatAmount } from '@/lib/products';

export type NewOrderAlertPayload = {
  paymentId?: string;
  proofImageUrl?: string;
  userId: string;
  userEmail?: string;
  productId: string;
  productName: string;
  plan: string;
  amount: number;
  transactionId?: string | null;
  createdAtIso: string;
  subscriptionMonths?: number;
};

type AlertChannelResult = {
  channel: 'email' | 'sms' | 'telegram';
  sent: boolean;
  reason?: string;
};

const DEFAULT_APP_BASE_URL = 'http://localhost:3000';

function getAppBaseUrl() {
  return process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_APP_BASE_URL;
}

function splitCsv(value: string | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function buildOrderAlertText(payload: NewOrderAlertPayload) {
  const createdAt = new Date(payload.createdAtIso).toLocaleString();
  const amount = formatAmount(payload.amount);
  const paymentQueueUrl = `${getAppBaseUrl().replace(/\/$/, '')}/admin/payments`;

  return [
    'New order received',
    `Product: ${payload.productName} (${payload.plan})`,
    `Product ID: ${payload.productId}`,
    `Duration: ${payload.subscriptionMonths || 1} Month(s)`,
    `Amount: ${amount}`,
    `Customer ID: ${payload.userId}`,
    `Customer Email: ${payload.userEmail || 'unknown'}`,
    `Transaction ID: ${payload.transactionId || 'not provided'}`,
    `Created At: ${createdAt}`,
    `Review Queue: ${paymentQueueUrl}`,
  ].join('\n');
}

async function sendAdminEmailAlert(payload: NewOrderAlertPayload): Promise<AlertChannelResult> {
  const host = process.env.SMTP_HOST;
  const portValue = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.ADMIN_ALERT_EMAIL_FROM;
  const toList = splitCsv(process.env.ADMIN_ALERT_EMAIL_TO);

  if (!host || !portValue || !user || !pass || !from || toList.length === 0) {
    return { channel: 'email', sent: false, reason: 'email config missing' };
  }

  const port = Number(portValue);
  if (!Number.isFinite(port)) {
    return { channel: 'email', sent: false, reason: 'invalid SMTP_PORT' };
  }

  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const nodemailerModule = await import('nodemailer');
  const transporter = nodemailerModule.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from,
    to: toList,
    subject: `[StreamSaaS] New order: ${payload.productName} (${payload.plan})`,
    text: buildOrderAlertText(payload),
  });

  return { channel: 'email', sent: true };
}

async function sendAdminSmsAlert(payload: NewOrderAlertPayload): Promise<AlertChannelResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_SMS_FROM;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const to = process.env.ADMIN_SMS_TO;

  if (!accountSid || !authToken || !to || (!from && !messagingServiceSid)) {
    return { channel: 'sms', sent: false, reason: 'sms config missing' };
  }

  const twilioModule = await import('twilio');
  const createTwilioClient = twilioModule.default;
  const client = createTwilioClient(accountSid, authToken);

  const messageOptions: {
    to: string;
    body: string;
    from?: string;
    messagingServiceSid?: string;
  } = {
    to,
    body: buildOrderAlertText(payload),
  };

  if (messagingServiceSid) {
    messageOptions.messagingServiceSid = messagingServiceSid;
  } else if (from) {
    messageOptions.from = from;
  }

  await client.messages.create(messageOptions);

  return { channel: 'sms', sent: true };
}

async function sendAdminTelegramAlert(payload: NewOrderAlertPayload): Promise<AlertChannelResult> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing in env');
    return { channel: 'telegram', sent: false, reason: 'TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing' }; 
  }

  const amount = formatAmount(payload.amount);
  
  const text = `[ORDER] New Order Received!\n\n` +
               `Product: ${payload.productName} (${payload.plan})\n` +
               `Duration: ${payload.subscriptionMonths || 1} Month(s)\n` +
               `Amount: ${amount}\n` +
               `Customer: ${payload.userEmail || payload.userId}`;

  try {
    const isPhoto = !!payload.proofImageUrl;
    const telegramApiMethod = isPhoto ? 'sendPhoto' : 'sendMessage';
    
    // Construct the payload mapping based on whether we are sending a photo or just text
    const requestBody: any = {
      chat_id: chatId,
    };
    
    if (isPhoto) {
      requestBody.photo = payload.proofImageUrl;
      requestBody.caption = text;
    } else {
      requestBody.text = text;
    }

    // Attach Inline Keyboard Buttons
    if (payload.paymentId) {
      requestBody.reply_markup = {
        inline_keyboard: [
          [
            { text: 'Approve', callback_data: `approve_${payload.paymentId}` },
            { text: 'Reject', callback_data: `reject_${payload.paymentId}` }
          ]
        ]
      };
    }

    const res = await fetch(`https://api.telegram.org/bot${botToken}/${telegramApiMethod}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    if (!res.ok) {
        const errorText = await res.text();
        console.error(`Telegram API err response:`, errorText);
        throw new Error(`Telegram API responded with ${res.status}`);
    }
    
    console.log("Telegram alert sent successfully.");
    return { channel: 'telegram', sent: true }; 
  } catch (error) {
    console.error('Telegram fetch block threw:', error);
    return { channel: 'telegram', sent: false, reason: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function notifyAdminNewOrder(payload: NewOrderAlertPayload) {
  const [emailResult, smsResult, telegramResult] = await Promise.allSettled([
    sendAdminEmailAlert(payload),
    sendAdminSmsAlert(payload),
    sendAdminTelegramAlert(payload),
  ]);

  if (emailResult.status === 'rejected') {
    console.error('Admin email alert failed:', emailResult.reason);
  }

  if (smsResult.status === 'rejected') {
    console.error('Admin SMS alert failed:', smsResult.reason);
  }

  if (telegramResult.status === 'rejected') {
    console.error('Admin Telegram alert failed:', telegramResult.reason);
  }

  if (emailResult.status === 'fulfilled' && !emailResult.value.sent && emailResult.value.reason) {
    console.info(`Admin email alert skipped: ${emailResult.value.reason}`);
  }

  if (smsResult.status === 'fulfilled' && !smsResult.value.sent && smsResult.value.reason) {
    console.info(`Admin SMS alert skipped: ${smsResult.value.reason}`);
  }

  if (telegramResult.status === 'fulfilled' && !telegramResult.value.sent && telegramResult.value.reason) {
    console.info(`Admin Telegram alert skipped: ${telegramResult.value.reason}`);
  }
}
