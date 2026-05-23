import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { signPasswordResetToken } from '@/lib/auth';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const GENERIC_RESPONSE = {
  message: 'If an account exists for that email, a reset link has been sent.',
};

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

async function trySendResetEmail(to: string, resetUrl: string) {
  // We read the dynamic API key pushed to .env (SMTP_PASS) safely 
  const apiKey = process.env.SMTP_PASS;
  const fromEmail = process.env.PASSWORD_RESET_FROM || 'onboarding@resend.dev';

  const resend = new Resend(apiKey);
  console.log(`[password-reset] Attempting to send via Resend to: ${to} from: ${fromEmail}`);

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: to,
    subject: 'Reset your password - StreamSaaS',
    html: `
      <h2>We received a password reset request for your account.</h2>
      <p>Open this link to securely continue:</p>
      <a href="${resetUrl}" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <br/><br/>
      <p>This secure link expires in <strong>20 minutes</strong>.</p>
      <p>If you did not request this, you can proactively ignore this alert.</p>
    `,
  });

  if (error) {
    console.error('[password-reset] Resend API Error:', error);
    return { success: false, error: JSON.stringify(error) };
  }
  
  console.log('[password-reset] Resend API Success:', data);
  return { success: true };
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const normalizedEmail = String(email || '').toLowerCase().trim();

    if (!normalizedEmail) {
      return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true, password: true },
    });

    console.log(`[password-reset] Lookup for ${normalizedEmail}: ${user ? 'FOUND' : 'NOT FOUND'}`);

    if (!user) {
      return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
    }

    const token = await signPasswordResetToken({
      userId: user.id,
      email: user.email,
      // Tie token to current password hash revision to invalidate old links after a password change.
      pwdv: user.password.slice(-12),
    });

    const resetUrl = `${getBaseUrl().replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`;

    const sendResult = await trySendResetEmail(user.email, resetUrl);
    if (sendResult && sendResult.success === false) {
      // Temporarily exposing the error details to the UI so the user can read the EXACT failure reason
      return NextResponse.json({ 
        message: "Delivery failed", 
        details: sendResult.error 
      }, { status: 500 });
    }

    return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
  }
}