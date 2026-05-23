import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/db';
import AdminPaymentsClient from './AdminPaymentsClient';
import AdminNotificationBell from '@/components/AdminNotificationBell';

export const metadata = {
  title: 'Admin Payments',
  description: 'Review submitted payment proofs and handle approvals in StreamSaaS.',
  robots: {
    index: false,
    follow: false,
  },
};

type AdminPaymentRow = {
  id: string;
  productId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string | null;
  proofImageUrl: string;
  status: string;
  rejectionReason: string | null;
  createdAt: Date;
  user: {
    email: string;
    name: string;
  };
};

type AdminPaymentRawRow = {
  id: string;
  productId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string | null;
  proofImageUrl: string;
  status: string;
  rejectionReason: string | null;
  createdAt: Date;
  userEmail: string;
  userName: string;
};

function hasPaymentDelegate(client: typeof prisma): client is typeof prisma & {
  payment: {
    findMany: (args: {
      include: {
        user: {
          select: { email: true; name: true };
        };
      };
      orderBy: { createdAt: 'desc' };
    }) => Promise<AdminPaymentRow[]>;
  };
} {
  return Boolean((client as { payment?: unknown }).payment);
}

export default async function AdminPaymentsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('adminToken')?.value;

  if (!token) {
    redirect('/admin');
  }

  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'admin') {
    redirect('/admin');
  }

  const payments = hasPaymentDelegate(prisma)
    ? await prisma.payment.findMany({
        include: {
          user: {
            select: { email: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    : await prisma.$queryRaw<AdminPaymentRawRow[]>`
        SELECT
          p."id",
          p."productId",
          p."amount",
          p."paymentMethod",
          p."transactionId",
          p."proofImageUrl",
          p."status",
          p."rejectionReason",
          p."createdAt",
          u."email" AS "userEmail",
          u."name" AS "userName"
        FROM "Payment" p
        INNER JOIN "User" u ON u."id" = p."userId"
        ORDER BY p."createdAt" DESC
      `.then((rows) =>
        rows.map((row) => ({
          id: row.id,
          productId: row.productId,
          amount: row.amount,
          paymentMethod: row.paymentMethod,
          transactionId: row.transactionId,
          proofImageUrl: row.proofImageUrl,
          status: row.status,
          rejectionReason: row.rejectionReason,
          createdAt: row.createdAt,
          user: {
            email: row.userEmail,
            name: row.userName,
          },
        }))
      );

  return (
    <div className="container" style={{ padding: '2rem 0 3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.7rem' }}>
        <h1 style={{ fontSize: 'clamp(1.35rem, 5vw, 2rem)', margin: 0 }}>Manual Payments Queue</h1>
        <AdminNotificationBell />
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>
        Approve or reject submitted Mobile Money proofs.
      </p>
      <AdminPaymentsClient initialPayments={payments} />
    </div>
  );
}
