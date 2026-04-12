import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (!process.env.ADMIN_SECRET || password !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    // Generate JWT token for admin
    const token = await signToken({ role: 'admin' });

    const response = NextResponse.json(
      { message: 'Admin login successful' },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'adminToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
