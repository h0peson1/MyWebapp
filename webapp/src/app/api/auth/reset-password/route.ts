import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import {
  hashPassword,
  validatePasswordStrength,
  verifyPasswordResetToken,
} from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    const payload = await verifyPasswordResetToken(String(token));
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    const passwordValidation = validatePasswordStrength(String(newPassword));
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.errors[0] }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, password: true },
    });

    if (!user || user.email.toLowerCase() !== payload.email.toLowerCase()) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    if (!user.password.endsWith(payload.pwdv)) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(String(newPassword));

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}