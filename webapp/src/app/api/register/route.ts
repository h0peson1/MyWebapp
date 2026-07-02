import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword, signToken, validatePasswordStrength } from '@/lib/auth';
import { sendMessage } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone, acceptedPolicies } = body;

    // Validate inputs
    if (!name || String(name).trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!email || !password || String(email).trim() === '' || String(password).trim() === '') {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const isGoogleSignup = password === 'GoogleSecurePassword123!';
    if (!isGoogleSignup && (!phone || String(phone).trim() === '')) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    if (acceptedPolicies !== true) {
      return NextResponse.json({ error: 'You must accept the Terms and Privacy Policy to continue' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const passwordValidation = validatePasswordStrength(String(password));
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors[0] },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Store strictly new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone ? String(phone).trim() : '',
        password: hashedPassword,
      },
    });

    // Notify Admin via Telegram
    try {
      const totalUsers = await prisma.user.count();
      const adminId = process.env.TELEGRAM_CHAT_ID;
      if (adminId) {
        const message = `🆕 <b>New User Registered</b>\n\n` +
          `Name: ${newUser.name}\n` +
          `Email: ${newUser.email}\n` +
          `Phone: ${newUser.phone || 'N/A'}\n` +
          `Time: ${new Date().toISOString().split('T')[0]}\n\n` +
          `Total Users: ${totalUsers}`;
        
        // Fire and forget (don't await to keep signup fast)
        sendMessage(adminId, message).catch(err => console.error('Telegram Notify Error:', err));
      }
    } catch (notifyErr) {
      console.error('Failed to send signup notification:', notifyErr);
    }

    const token = await signToken({ userId: newUser.id, email: newUser.email });
    const response = NextResponse.json(
      { message: 'User registered successfully', user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone } },
      { status: 201 }
    );

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
