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

    const { paymentId, action, rejectionReason } = await req.json();

    if (!paymentId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    const payment = hasPaymentDelegate(prisma)
      ? await prisma.payment.findUnique({
          where: { id: paymentId },
        })
      : await prisma.$queryRaw<PaymentRow[]>`
          SELECT "id", "userId", "productId", "status"
          FROM "Payment"
          WHERE "id" = ${paymentId}
          LIMIT 1
        `.then((rows) => rows[0] ?? null);

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    if (!['pending', 'error'].includes(payment.status)) {
      return NextResponse.json({ error: 'Payment already reviewed' }, { status: 409 });
    }

    if (action === 'reject') {
      if (hasPaymentDelegate(prisma)) {
        await prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: 'rejected',
            rejectionReason: typeof rejectionReason === 'string' ? rejectionReason.trim() || null : null,
          },
        });
      } else {
        await prisma.$executeRaw`
          UPDATE "Payment"
          SET "status" = 'rejected',
              "rejectionReason" = ${typeof rejectionReason === 'string' ? rejectionReason.trim() || null : null},
              "updatedAt" = ${new Date()}
          WHERE "id" = ${paymentId}
        `;
      }

      return NextResponse.json({ message: 'Payment rejected' });
    }

    const resolvedProduct = resolveProductById(payment.productId);
    if (!resolvedProduct) {
      return NextResponse.json({ error: 'Invalid payment product' }, { status: 400 });
    }

    const startDate = new Date();
    const expiryDate = addDays(startDate, 30);

    if (hasPaymentDelegate(prisma)) {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: 'approved',
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
            accessDetails: 'Payment approved. Your access has been activated.',
          },
        }),
      ]);
    } else {
      const subscriptionId = randomUUID();

      await prisma.$executeRaw`
        UPDATE "Payment"
        SET "status" = 'approved',
            "rejectionReason" = NULL,
            "updatedAt" = ${new Date()}
        WHERE "id" = ${paymentId}
      `;

      await prisma.$executeRaw`
        INSERT INTO "Subscription" (
          "id",
          "userId",
          "productName",
          "plan",
          "status",
          "startDate",
          "expiryDate",
          "accessDetails"
        ) VALUES (
          ${subscriptionId},
          ${payment.userId},
          ${resolvedProduct.productName},
          ${resolvedProduct.plan},
          'active',
          ${startDate},
          ${expiryDate},
          'Payment approved. Your access has been activated.'
        )
      `;
    }

    return NextResponse.json({ message: 'Payment approved and subscription activated' });
  } catch (error) {
    console.error('Admin payment update error:', error);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}
