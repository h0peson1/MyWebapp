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

    if (!payment) {
       // Since it's a photo, use editMessageCaption if possible, but editMessage (Text) might fail
       await editMessageCaption(chatId, messageId, "❌ Payment not found.");
       return NextResponse.json({ ok: true });
    }

    if (action === 'reject') {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'rejected', rejectionReason: 'Rejected via Telegram' },
      });
      await editMessageCaption(chatId, messageId, "❌ Payment Rejected");
      await logAdminAction('REJECT_PAYMENT', `Rejected: ${paymentId}`);
      return NextResponse.json({ ok: true });
    }

    if (action === 'approve') {
      // Telegram approval verifies the payment, moving it to 'Payment Verified' stage.
      // This complies with safety rules and leaves 'Dispatch & Deliver' (which takes accessDetails) to the web operations center.
      await prisma.payment.update({
        where: { id: paymentId },
        data: { 
          status: 'Payment Verified',
          rejectionReason: null
        }
      });

      await editMessageCaption(chatId, messageId, "✅ Payment Verified via Telegram! Please log in to the web panel to dispatch credentials.");
      await logAdminAction('VERIFY_PAYMENT_TELEGRAM', `Verified via Telegram: ${paymentId}`);
      return NextResponse.json({ ok: true });
    }
  } catch (err: any) {
    console.error('[telegram-webhook] Callback Action Error:', err.message);
    await answerCallbackQuery(callbackQuery.id, 'Error processing action');
  }

  return NextResponse.json({ ok: true });
}
