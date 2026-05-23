import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyPassword, signToken } from '@/lib/auth';

type AttemptState = {
  count: number;
  blockedUntil?: number;
};

const MAX_ATTEMPTS = 5;
const BLOCK_WINDOW_MS = 15 * 60 * 1000;
const loginAttempts = new Map<string, AttemptState>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    const key = String(email || '').toLowerCase().trim();

    const currentAttempt = loginAttempts.get(key);
    if (currentAttempt?.blockedUntil && currentAttempt.blockedUntil > Date.now()) {
      return NextResponse.json(
        { error: 'Too many failed attempts. Try again in a few minutes.' },
        { status: 429 }
      );
    }

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if user exists
    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      const nextCount = (currentAttempt?.count || 0) + 1;
      loginAttempts.set(key, {
        count: nextCount,
        blockedUntil: nextCount >= MAX_ATTEMPTS ? Date.now() + BLOCK_WINDOW_MS : undefined,
      });
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Compare password with hashed version
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      const nextCount = (currentAttempt?.count || 0) + 1;
      loginAttempts.set(key, {
        count: nextCount,
        blockedUntil: nextCount >= MAX_ATTEMPTS ? Date.now() + BLOCK_WINDOW_MS : undefined,
      });
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    loginAttempts.delete(key);

    // Generate JWT token
    const token = await signToken({ userId: user.id, email: user.email });

    // Create response returning token and user info
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        token, 
        user: { id: user.id, name: user.name, email: user.email } 
      },
      { status: 200 }
    );

    // Additionally secure the session with an HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
