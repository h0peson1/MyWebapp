import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// This Next.js proxy acts as our Auth Middleware
export async function proxy(request: NextRequest) {
  // 1. Check for JWT token in request cookies or headers
  let token = request.cookies.get('token')?.value;

  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/api/pay');

  // Protect matched endpoints
  if (isProtectedRoute) {
    // If no token -> bounce
    if (!token) {
      if (request.nextUrl.pathname.startsWith('/api/')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Decode token
    const decodedPayload = await verifyToken(token);

    if (!decodedPayload) {
      if (request.nextUrl.pathname.startsWith('/api/')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Attach user to request via headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decodedPayload.userId);
    requestHeaders.set('x-user-email', decodedPayload.email);

    // Continue the request and pass down the injected user headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/pay'
  ],
};
