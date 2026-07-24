import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import prisma from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { resolveProductById } from '@/lib/products';

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

type PaymentRow = {
  id: string;
  userId: string;
  productId: string;
  status: string;
  subscriptionMonths: number;
};

function hasPaymentDelegate(client: typeof prisma): client is typeof prisma & {
  payment: {
    findUnique: (args: { where: { id: string } }) => Promise<PaymentRow | null>;
    update: (args: { where: { id: string }; data: { status: string; rejectionReason?: string | null } }) => Promise<unknown>;
  };
} {
  return Boolean((client as { payment?: unknown }).payment);
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('adminToken')?.value;

    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(adminToken);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentId, action, rejectionReason, accessDetails } = await req.json();

    if (!paymentId || !action || !['verify', 'start_processing', 'deliver', 'require_verification', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const currentStatus = payment.status;

    // Safety Rules & Enforcements
    if (action === 'verify') {
      if (currentStatus === 'Payment Verified') {
        return NextResponse.json({ message: 'Payment verified successfully.' });
      }
      if (currentStatus !== 'Payment Submitted') {
        return NextResponse.json({ 
          error: `Safety Violations: Cannot verify payment unless status is 'Payment Submitted'. Current: '${currentStatus}'` 
        }, { status: 400 });
      }

      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'Payment Verified', rejectionReason: null },
      });

      return NextResponse.json({ message: 'Payment verified successfully.' });
    }

    if (action === 'start_processing') {
      if (currentStatus === 'Processing') {
        return NextResponse.json({ message: 'Order status updated to Processing.' });
      }
      if (currentStatus !== 'Payment Verified') {
        return NextResponse.json({ 
          error: `Safety Violations: Cannot enter Processing unless status is 'Payment Verified'. Current: '${currentStatus}'` 
        }, { status: 400 });
      }

      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'Processing' },
      });

      return NextResponse.json({ message: 'Order status updated to Processing.' });
    }

    if (action === 'deliver') {
      if (currentStatus === 'Delivered') {
        return NextResponse.json({ message: 'Order successfully delivered and subscription activated.' });
      }
      if (currentStatus !== 'Processing') {
        return NextResponse.json({ 
          error: `Safety Violations: Cannot mark as Delivered unless status is 'Processing'. Current: '${currentStatus}'` 
        }, { status: 400 });
      }

      if (!accessDetails || String(accessDetails).trim() === '') {
        return NextResponse.json({ error: 'Access details are required to complete delivery.' }, { status: 400 });
      }

      const resolvedProduct = resolveProductById(payment.productId);
      if (!resolvedProduct) {
        return NextResponse.json({ error: 'Invalid order product' }, { status: 400 });
      }

      const months = payment.subscriptionMonths || 1;
      const startDate = new Date();
      const expiryDate = addDays(startDate, 30 * months);
      const accessDetailsStr = String(accessDetails).trim();

      // Transactionally:
      // 1. Update Payment status to Delivered and save accessDetails
      // 2. Create the customer Subscription record
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: 'Delivered',
            accessDetails: accessDetailsStr,
            rejectionReason: null,
          },
        }),
        prisma.subscription.create({
          data: {
            userId: payment.userId,
            productName: resolvedProduct.productName,
            plan: resolvedProduct.plan,
            status: 'active',
            startDate,
            expiryDate,
            accessDetails: accessDetailsStr,
          },
        }),
      ]);

      return NextResponse.json({ message: 'Order successfully delivered and subscription activated.' });
    }

    if (action === 'require_verification') {
      if (currentStatus === 'Verification Required') {
        return NextResponse.json({ message: 'Order flagged as Verification Required.' });
      }
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'Verification Required',
          rejectionReason: typeof rejectionReason === 'string' ? rejectionReason.trim() || null : null,
        },
      });

      return NextResponse.json({ message: 'Order flagged as Verification Required.' });
    }

    if (action === 'reject') {
      if (currentStatus === 'rejected') {
        return NextResponse.json({ message: 'Order rejected.' });
      }
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'rejected',
          rejectionReason: typeof rejectionReason === 'string' ? rejectionReason.trim() || null : null,
        },
      });

      return NextResponse.json({ message: 'Order rejected.' });
    }

    return NextResponse.json({ error: 'Action not supported' }, { status: 400 });
  } catch (error) {
    console.error('Admin payment update error:', error);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}
