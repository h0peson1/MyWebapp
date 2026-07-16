import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// This Next.js proxy acts as our Auth Middleware
export default async function authProxy(request: NextRequest) {
  // 1. Check for JWT token in request cookies or headers
  let token = request.cookies.get('token')?.value;
  const adminToken = request.cookies.get('adminToken')?.value;

  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/dashboard') || 
    request.nextUrl.pathname.startsWith('/settings') || 
    request.nextUrl.pathname.startsWith('/onboarding') ||
    request.nextUrl.pathname.startsWith('/api/pay') ||
    request.nextUrl.pathname.startsWith('/api/payment/submit') ||
    request.nextUrl.pathname.startsWith('/api/notifications') ||
    request.nextUrl.pathname.startsWith('/api/user/update') ||
    request.nextUrl.pathname.startsWith('/api/user/delete') ||
    request.nextUrl.pathname.startsWith('/api/user/change-password');

  const isAdminRoute =
    request.nextUrl.pathname.startsWith('/admin/dashboard') ||
    request.nextUrl.pathname.startsWith('/admin/payments') ||
    request.nextUrl.pathname.startsWith('/admin/users') ||
    request.nextUrl.pathname.startsWith('/api/admin/notifications') ||
    request.nextUrl.pathname.startsWith('/api/admin/delivery') ||
    request.nextUrl.pathname.startsWith('/api/admin/payments/update') ||
    request.nextUrl.pathname.startsWith('/api/admin/payments/proof');

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

    if (!decodedPayload.userId || !decodedPayload.email) {
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
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

  if (isAdminRoute) {
    if (!adminToken) {
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    const decodedAdmin = await verifyToken(adminToken);
    if (!decodedAdmin || decodedAdmin.role !== 'admin') {
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/onboarding/:path*',
    '/api/payment/submit',
    '/api/notifications',
    '/api/pay',
    '/api/user/update',
    '/api/user/delete',
    '/api/user/change-password',
    '/admin/dashboard/:path*',
    '/admin/payments/:path*',
    '/admin/users/:path*',
    '/api/admin/notifications',
    '/api/admin/delivery',
    '/api/admin/payments/update',
    '/api/admin/payments/proof/:path*'
  ],
};
