import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import prisma from '@/lib/db';
import { resolveProductById } from '@/lib/products';
import { 
  sendMessage, 
  editMessage, 
  editMessageCaption,
  answerCallbackQuery, 
  deleteMessage 
} from '@/lib/telegram';

const ADMIN_ID = process.env.TELEGRAM_CHAT_ID;

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

type PaymentRow = {
  id: string;
  userId: string;
  productId: string;
  status: string;
};

function hasPaymentDelegate(client: typeof prisma): client is typeof prisma & {
  payment: {
    findUnique: (args: { where: { id: string } }) => Promise<PaymentRow | null>;
    update: (args: { where: { id: string }; data: { status: string; rejectionReason?: string | null } }) => Promise<unknown>;
  };
} {
  return Boolean((client as { payment?: unknown }).payment);
}

async function logAdminAction(action: string, details: string) {
  try {
    await prisma.adminLog.create({
      data: {
        action,
        details,
        adminId: ADMIN_ID || 'unknown',
      }
    });
  } catch (err) {
    console.error('Failed to log admin action:', err);
  }
}

async function deliverOrderFromTelegram(paymentId: string, accessDetails: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    return { success: false, error: 'Payment record not found.' };
  }

  if (payment.status === 'Delivered') {
    return { success: false, error: 'Order has already been delivered.' };
  }

  const resolvedProduct = resolveProductById(payment.productId);
  if (!resolvedProduct) {
    return { success: false, error: 'Invalid product registered for this payment.' };
  }

  const startDate = new Date();
  const expiryDate = addDays(startDate, 30);
  const accessDetailsStr = accessDetails.trim();

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'Delivered',
        accessDetails: accessDetailsStr,
        rejectionReason: null,
      },
    }),
    prisma.subscription.create({
      data: {
        userId: payment.userId,
        productName: resolvedProduct.productName,
        plan: resolvedProduct.plan,
        status: 'active',
        startDate,
        expiryDate,
        accessDetails: accessDetailsStr,
      },
    }),
  ]);

  await logAdminAction('DELIVER_PAYMENT_TELEGRAM', `Delivered via Telegram: ${paymentId}`);

  return { 
    success: true, 
    productName: resolvedProduct.productName, 
    plan: resolvedProduct.plan 
  };
}


export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // Security: Check sender ID
    const fromId = payload.message?.from?.id?.toString() || payload.callback_query?.from?.id?.toString();
    console.log(`[telegram-webhook] Incoming update from ID: ${fromId}`);

    if (fromId !== ADMIN_ID) {
      console.warn(`[telegram-webhook] Security Alert: Unauthorized access from ${fromId}. Expected ${ADMIN_ID}`);
      return NextResponse.json({ ok: true });
    }

    if (payload.callback_query) {
      console.log(`[telegram-webhook] Handling Callback: ${payload.callback_query.data}`);
      return await handleCallback(payload.callback_query);
    }

    if (payload.message) {
      console.log(`[telegram-webhook] Handling Message: ${payload.message.text}`);
      return await handleMessage(payload.message);
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('[telegram-webhook] Global Error:', error.message);
    return NextResponse.json({ ok: true });
  }
}

async function handleMessage(message: any) {
  const chatId = message.chat.id;
  const rawText = message.text || '';
  const text = rawText.trim();

  // 1. Intercept replies to order verification messages
  const replyTo = message.reply_to_message;
  if (replyTo) {
    const originalText = replyTo.text || replyTo.caption || '';
    const match = originalText.match(/Order ID:\s*([a-f0-9\-]+)/i);
    if (match) {
      const paymentId = match[1];
      const accessDetails = text;

      if (!accessDetails) {
        await sendMessage(chatId, "⚠️ Please provide the access details text in your reply.");
        return NextResponse.json({ ok: true });
      }

      try {
        const result = await deliverOrderFromTelegram(paymentId, accessDetails);
        if (result.success) {
          await sendMessage(chatId, `🎉 <b>Subscription Activated!</b>\n\n` +
                                     `Order ID: <code>${paymentId}</code>\n` +
                                     `Product: <b>${result.productName}</b> (${result.plan})\n` +
                                     `Access Details:\n<code>${accessDetails}</code>\n\n` +
                                     `Credentials successfully dispatched to user dashboard.`);
        } else {
          await sendMessage(chatId, `❌ <b>Delivery Failed:</b> ${result.error}`);
        }
      } catch (err: any) {
        console.error('[telegram-webhook] Delivery exception:', err);
        await sendMessage(chatId, `❌ <b>Delivery Error:</b> ${err.message}`);
      }
      return NextResponse.json({ ok: true });
    }
  }

  // 2. Intercept direct deliver commands
  if (text.startsWith('/deliver')) {
    let paymentId = '';
    let accessDetails = '';

    if (text.startsWith('/deliver_')) {
      const spaceIndex = text.indexOf(' ');
      const commandPart = spaceIndex === -1 ? text : text.substring(0, spaceIndex);
      paymentId = commandPart.replace('/deliver_', '').trim();
      accessDetails = spaceIndex === -1 ? '' : text.substring(spaceIndex + 1).trim();
    } else if (text.startsWith('/deliver ')) {
      const parts = text.substring(9).trim().split(/\s+/);
      paymentId = parts[0] || '';
      accessDetails = text.substring(9 + paymentId.length).trim();
    }

    if (!paymentId) {
      await sendMessage(chatId, "⚠️ Invalid command format. Use <code>/deliver &lt;paymentId&gt; &lt;details&gt;</code> or <code>/deliver_&lt;paymentId&gt; &lt;details&gt;</code>");
      return NextResponse.json({ ok: true });
    }

    if (!accessDetails) {
      await sendMessage(chatId, `⚠️ Please provide access details. Format: <code>/deliver_${paymentId} &lt;credentials&gt;</code>`);
      return NextResponse.json({ ok: true });
    }

    try {
      const result = await deliverOrderFromTelegram(paymentId, accessDetails);
      if (result.success) {
        await sendMessage(chatId, `🎉 <b>Subscription Activated!</b>\n\n` +
                                   `Order ID: <code>${paymentId}</code>\n` +
                                   `Product: <b>${result.productName}</b> (${result.plan})\n` +
                                   `Access Details:\n<code>${accessDetails}</code>\n\n` +
                                   `Credentials successfully dispatched to user dashboard.`);
      } else {
        await sendMessage(chatId, `❌ <b>Delivery Failed:</b> ${result.error}`);
      }
    } catch (err: any) {
      console.error('[telegram-webhook] Direct delivery exception:', err);
      await sendMessage(chatId, `❌ <b>Delivery Error:</b> ${err.message}`);
    }
    return NextResponse.json({ ok: true });
  }

  // DASHBOARD / START
  if (text === '/start') {
    const welcomeMsg = `🚀 <b>Admin Dashboard</b>\n\nWelcome back, Administrator. Use the menu buttons below to manage your platform.`;
    await sendMessage(chatId, welcomeMsg, {
      reply_markup: {
        keyboard: [
          [{ text: "📊 Stats" }, { text: "👥 Users" }],
          [{ text: "❌ Remove User" }]
        ],
        resize_keyboard: true,
        persistent: true
      }
    });
    return NextResponse.json({ ok: true });
  }

  // STATISTICS
  if (text === '/stats' || text === '📊 Stats') {
    try {
      const totalUsers = await prisma.user.count();
      const activeSubs = await prisma.subscription.count({
        where: { status: 'active', expiryDate: { gt: new Date() } }
      });
      const pendingPayments = await prisma.payment.count({
        where: { status: 'Payment Submitted' }
      });

      const statsMsg = `📊 <b>System Statistics</b>\n\n` +
        `👥 Total Users: ${totalUsers}\n` +
        `✅ Active Subscriptions: ${activeSubs}\n` +
        `⏳ Pending Verification: ${pendingPayments}`;
      
      await sendMessage(chatId, statsMsg);
      await logAdminAction('FETCH_STATS', 'Stats requested');
    } catch (err: any) {
      console.error('[telegram-webhook] Stats Error:', err.message);
      await sendMessage(chatId, "❌ Failed to fetch statistics. Check server logs.");
    }
    return NextResponse.json({ ok: true });
  }

  // USER LIST
  if (text === '/users' || text === '👥 Users') {
    try {
      const users = await prisma.user.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        select: { email: true, name: true }
      });

      let usersMsg = `👥 <b>Latest Users (Last 20)</b>\n\n`;
      if (users.length === 0) usersMsg += "No users found.";
      else users.forEach((u, i) => { usersMsg += `${i + 1}. ${u.name} (${u.email})\n`; });

      await sendMessage(chatId, usersMsg);
      await logAdminAction('FETCH_USERS', 'User list requested');
    } catch (err: any) {
      console.error('[telegram-webhook] Users Error:', err.message);
      await sendMessage(chatId, "❌ Failed to fetch users.");
    }
    return NextResponse.json({ ok: true });
  }

  // REMOVE USER HELP
  if (text === '❌ Remove User') {
    await sendMessage(chatId, "⚠️ To remove a user, please type:\n<code>/remove user@email.com</code>");
    return NextResponse.json({ ok: true });
  }

  // REMOVE USER COMMAND
  if (text.startsWith('/remove ')) {
    const email = text.split(' ')[1]?.trim()?.toLowerCase();
    if (!email) {
      await sendMessage(chatId, "⚠️ Usage: <code>/remove user@email.com</code>");
      return NextResponse.json({ ok: true });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, email: true }
      });

      if (!user) {
        await sendMessage(chatId, `❌ User with email <b>${email}</b> not found.`);
        return NextResponse.json({ ok: true });
      }

      await sendMessage(chatId, `⚠️ <b>CONFIRMATION REQUIRED</b>\n\nAre you sure you want to remove user <b>${user.name}</b> (${user.email})?\n\nThis will also delete their subscriptions and payments.`, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ Yes, Delete", callback_data: `confirm_remove_${user.id}` },
              { text: "❌ Cancel", callback_data: `cancel_remove` }
            ]
          ]
        }
      });
    } catch (err: any) {
      console.error('[telegram-webhook] Remove Command Error:', err.message);
      await sendMessage(chatId, "❌ Error looking up user.");
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}

async function handleCallback(callbackQuery: any) {
  const data = callbackQuery.data;
  const chatId = callbackQuery.message?.chat?.id;
  const messageId = callbackQuery.message?.message_id;

  // Confirm Removal
  if (data.startsWith('confirm_remove_')) {
    const userId = data.replace('confirm_remove_', '');
    try {
      const user = await prisma.user.findUnique({ where: { id: userId }});
      
      if (!user) {
        await answerCallbackQuery(callbackQuery.id, 'User not found');
        await editMessage(chatId, messageId, '❌ User already removed or missing.');
        return NextResponse.json({ ok: true });
      }

      await prisma.$transaction([
        prisma.subscription.deleteMany({ where: { userId } }),
        prisma.payment.deleteMany({ where: { userId } }),
        prisma.user.delete({ where: { id: userId } }),
      ]);

      await answerCallbackQuery(callbackQuery.id, 'User removed successfully');
      // For text messages, use editMessage (editMessageText)
      await editMessage(chatId, messageId, `✅ User <b>${user.email}</b> has been permanently removed.`);
      await logAdminAction('REMOVE_USER', `Removed user: ${user.email}`);
    } catch (err: any) {
      console.error('[telegram-webhook] Callback Remove Error:', err.message);
      await answerCallbackQuery(callbackQuery.id, 'Critical deletion error');
      await editMessage(chatId, messageId, "❌ Deletion failed. Check server logs.");
    }
    return NextResponse.json({ ok: true });
  }

  // Cancel Removal
  if (data === 'cancel_remove') {
    await answerCallbackQuery(callbackQuery.id, 'Action cancelled');
    await deleteMessage(chatId, messageId);
    return NextResponse.json({ ok: true });
  }

  // Existing Approve/Reject logic
  const [action, ...rest] = data.split('_');
  const paymentId = rest.join('_');

  if (!['approve', 'reject'].includes(action) || !paymentId) {
     await answerCallbackQuery(callbackQuery.id, 'Invalid instruction');
     return NextResponse.json({ ok: true });
  }

  await answerCallbackQuery(callbackQuery.id, 'Processing...');

  try {
    const payment = hasPaymentDelegate(prisma)
      ? await prisma.payment.findUnique({ where: { id: paymentId } })
      : null;

    const isPhoto = !!callbackQuery.message?.photo;

    if (!payment) {
       const responseText = "❌ Payment not found.";
       if (isPhoto) {
         await editMessageCaption(chatId, messageId, responseText);
       } else {
         await editMessage(chatId, messageId, responseText);
       }
       return NextResponse.json({ ok: true });
    }

    if (action === 'reject') {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'rejected', rejectionReason: 'Rejected via Telegram' },
      });

      const responseText = `❌ <b>Payment Rejected</b>\nOrder ID: <code>${paymentId}</code>`;
      if (isPhoto) {
        await editMessageCaption(chatId, messageId, responseText);
      } else {
        await editMessage(chatId, messageId, responseText);
      }

      await logAdminAction('REJECT_PAYMENT', `Rejected: ${paymentId}`);
      return NextResponse.json({ ok: true });
    }

    if (action === 'approve') {
      // Telegram approval verifies the payment, moving it to 'Payment Verified' stage.
      await prisma.payment.update({
        where: { id: paymentId },
        data: { 
          status: 'Payment Verified',
          rejectionReason: null
        }
      });

      const responseText = `✅ <b>Payment Verified!</b>\n` +
                           `Order ID: <code>${paymentId}</code>\n\n` +
                           `To deliver the credentials directly, <b>reply to this message</b> with the access details.`;

      if (isPhoto) {
        await editMessageCaption(chatId, messageId, responseText);
      } else {
        await editMessage(chatId, messageId, responseText);
      }

      await logAdminAction('VERIFY_PAYMENT_TELEGRAM', `Verified via Telegram: ${paymentId}`);
      return NextResponse.json({ ok: true });
    }
  } catch (err: any) {
    console.error('[telegram-webhook] Callback Action Error:', err.message);
    await answerCallbackQuery(callbackQuery.id, 'Error processing action');
  }

  return NextResponse.json({ ok: true });
}
