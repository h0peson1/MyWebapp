import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { sendMessage } from "@/lib/telegram";

export async function POST() {
  try {
    const headersList = await headers();
    const userId = headersList.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Verify user exists before deleting
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Cascade delete subscriptions, payments, and the user in a database transaction
    await prisma.$transaction([
      prisma.subscription.deleteMany({
        where: { userId },
      }),
      prisma.payment.deleteMany({
        where: { userId },
      }),
      prisma.user.delete({
        where: { id: userId },
      }),
    ]);

    // Notify Admin via Telegram
    try {
      const adminId = process.env.TELEGRAM_CHAT_ID;
      if (adminId) {
        const totalUsers = await prisma.user.count();
        const message = `<b>[User Account Deleted]</b>\n\n` +
          `Name: ${user.name}\n` +
          `Email: ${user.email}\n` +
          `Phone: ${user.phone || 'N/A'}\n` +
          `Time: ${new Date().toISOString().split('T')[0]}\n\n` +
          `Remaining Users: ${totalUsers}`;

        // Fire and forget (don't await to keep deletion response fast)
        sendMessage(adminId, message).catch(err => console.error('Telegram Delete Notify Error:', err));
      }
    } catch (notifyErr) {
      console.error('Failed to send deletion notification:', notifyErr);
    }

    // 3. Clear the cookie by setting the response cookie to expire
    const response = NextResponse.json({ success: true, message: "Account deleted successfully" });
    
    response.cookies.set({
      name: "token",
      value: "",
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    console.error("Delete Account Error:", err);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
