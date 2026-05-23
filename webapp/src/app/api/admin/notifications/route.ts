import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyToken } from '@/lib/auth';

type AdminNotification = {
  id: string;
  type: 'order';
  title: string;
  body: string;
  href: string;
  createdAt: string;
  status: 'pending';
};

type PaymentRow = {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  status: string;
  createdAt: Date;
  user?: {
    name: string;
    email: string;
  } | null;
};

type PaymentRawRow = {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  status: string;
  createdAt: Date;
  userName: string | null;
  userEmail: string | null;
};

function hasPaymentDelegate(client: typeof prisma): client is typeof prisma & {
  payment: {
    findMany: (args: {
      where: { status: string };
      orderBy: { createdAt: 'desc' };
      take: number;
      include: { user: { select: { name: true; email: true } } };
    }) => Promise<PaymentRow[]>;
  };
} {
  return Boolean((client as { payment?: unknown }).payment);
}

export async function GET() {
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

    const recentPendingPayments = hasPaymentDelegate(prisma)
      ? await prisma.payment.findMany({
          where: { status: 'pending' },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        })
      : await prisma.$queryRaw<PaymentRawRow[]>`
          SELECT
            p."id",
            p."userId",
            p."productId",
            p."amount",
            p."status",
            p."createdAt",
            u."name" AS "userName",
            u."email" AS "userEmail"
          FROM "Payment" p
          LEFT JOIN "User" u ON u."id" = p."userId"
          WHERE p."status" = 'pending'
          ORDER BY p."createdAt" DESC
          LIMIT 10
        `.then((rows) =>
          rows.map((row) => ({
            id: row.id,
            userId: row.userId,
            productId: row.productId,
            amount: row.amount,
            status: row.status,
            createdAt: row.createdAt,
            user: {
              name: row.userName || '',
              email: row.userEmail || '',
            },
          }))
        );

    const notifications: AdminNotification[] = recentPendingPayments.map((payment) => ({
      id: payment.id,
      type: 'order',
      title: 'New order received',
      body: `${payment.user?.name || payment.user?.email || 'A customer'} submitted ${payment.productId} for review.`,
      href: '/admin/payments',
      createdAt: payment.createdAt.toISOString(),
      status: 'pending',
    }));

    return NextResponse.json({ notifications, unreadCount: notifications.length });
  } catch (error) {
    console.error('Admin notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
