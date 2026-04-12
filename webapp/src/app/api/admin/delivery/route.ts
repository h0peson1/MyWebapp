import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const adminSecret = req.headers.get('x-admin-secret');
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('adminToken')?.value;

    let isAuthenticatedAdmin = false;

    // Check header authentication
    if (adminSecret && process.env.ADMIN_SECRET && adminSecret === process.env.ADMIN_SECRET) {
      isAuthenticatedAdmin = true;
    }

    // Check cookie authentication
    if (!isAuthenticatedAdmin && adminToken) {
      const payload = await verifyToken(adminToken);
      if (payload && payload.role === 'admin') {
        isAuthenticatedAdmin = true;
      }
    }

    if (!isAuthenticatedAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Admin Credentials' }, { status: 401 });
    }

    const { subscriptionId, accessDetails } = await req.json();

    if (!subscriptionId || !accessDetails) {
      return NextResponse.json({ error: 'Missing required parameters: subscriptionId, accessDetails' }, { status: 400 });
    }

    // Direct Database Override
    const updatedSub = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { accessDetails }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Access details seamlessly securely updated on the user dashboard', 
      subscriptionId: updatedSub.id 
    }, { status: 200 });

  } catch (error) {
    console.error('Admin Delivery API error:', error);
    return NextResponse.json({ error: 'Internal server error processing admin override' }, { status: 500 });
  }
}
