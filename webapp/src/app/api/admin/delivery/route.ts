import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('adminToken')?.value;

    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Admin Credentials' }, { status: 401 });
    }

    const payload = await verifyToken(adminToken);
    if (!payload || payload.role !== 'admin') {
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
