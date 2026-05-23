import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/db';
import AdminNotificationBell from '@/components/AdminNotificationBell';

export const metadata = {
  title: 'Admin Users',
  description: 'Inspect registered users, payments, and subscriptions in StreamSaaS.',
  robots: {
    index: false,
    follow: false,
  },
};

type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  _count: {
    payments: number;
    subscriptions: number;
  };
};

type AdminUserRawRow = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  paymentCount: number;
  subscriptionCount: number;
};

function hasUserDelegate(client: typeof prisma): client is typeof prisma & {
  user: {
    findMany: (args: {
      orderBy: { createdAt: 'desc' };
      select: {
        id: true;
        name: true;
        email: true;
        createdAt: true;
        _count: {
          select: {
            payments: true;
            subscriptions: true;
          };
        };
      };
    }) => Promise<AdminUserRow[]>;
  };
} {
  return Boolean((client as { user?: unknown }).user);
}

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('adminToken')?.value;

  if (!token) {
    redirect('/admin');
  }

  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'admin') {
    redirect('/admin');
  }

  const users = hasUserDelegate(prisma)
    ? await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          _count: {
            select: {
              payments: true,
              subscriptions: true,
            },
          },
        },
      })
    : await prisma.$queryRaw<AdminUserRawRow[]>`
        SELECT
          u."id",
          u."name",
          u."email",
          u."createdAt",
          CAST(COUNT(DISTINCT p."id") AS INTEGER) AS "paymentCount",
          CAST(COUNT(DISTINCT s."id") AS INTEGER) AS "subscriptionCount"
        FROM "User" u
        LEFT JOIN "Payment" p ON p."userId" = u."id"
        LEFT JOIN "Subscription" s ON s."userId" = u."id"
        GROUP BY u."id", u."name", u."email", u."createdAt"
        ORDER BY u."createdAt" DESC
      `.then((rows) =>
        rows.map((row) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          createdAt: row.createdAt,
          _count: {
            payments: row.paymentCount,
            subscriptions: row.subscriptionCount,
          },
        }))
      );

  return (
    <div className="container" style={{ padding: '2rem 0 3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
        <h1 style={{ fontSize: 'clamp(1.35rem, 5vw, 2rem)', margin: 0 }}>Users Table View</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <AdminNotificationBell />
          <Link href="/admin/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
        </div>
      </div>

      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>
        Monitor all registered users and their payment/subscription activity.
      </p>

      <div className="card admin-users-table-wrapper" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="admin-users-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ textAlign: 'left', padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Joined</th>
              <th style={{ textAlign: 'center', padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Payments</th>
              <th style={{ textAlign: 'center', padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subscriptions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{user.name || 'User'}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>{user.email}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>{new Date(user.createdAt).toLocaleString()}</td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700 }}>{user._count.payments}</td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700 }}>{user._count.subscriptions}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p style={{ color: 'var(--text-muted)', padding: '1rem' }}>No users found yet.</p>
        )}
      </div>

      <div className="admin-users-cards">
        {users.map((user) => (
          <article key={user.id} className="card" style={{ gap: '0.7rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.7rem' }}>
              <div>
                <p style={{ fontWeight: 800, marginBottom: '0.2rem' }}>{user.name || 'User'}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', wordBreak: 'break-word' }}>{user.email}</p>
              </div>
              <span className="section-kicker" style={{ fontSize: '0.64rem' }}>User</span>
            </div>

            <div className="grid-2" style={{ gap: '0.55rem' }}>
              <div className="stat-chip">
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Payments</p>
                <p style={{ fontWeight: 800, fontSize: '1.05rem' }}>{user._count.payments}</p>
              </div>
              <div className="stat-chip">
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subscriptions</p>
                <p style={{ fontWeight: 800, fontSize: '1.05rem' }}>{user._count.subscriptions}</p>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              Joined: {new Date(user.createdAt).toLocaleString()}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
