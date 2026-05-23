import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/db';
import AdminDashboardClient from './AdminDashboardClient';
import AdminNotificationBell from '@/components/AdminNotificationBell';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Monitor users, subscriptions, and payment review activity in the StreamSaaS admin dashboard.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('adminToken')?.value;

  if (!token) {
    redirect('/admin');
  }

  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'admin') {
    redirect('/admin');
  }

  // Fetch subscriptions with user details
  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
    orderBy: {
      startDate: 'desc',
    },
  });

  return (
    <div className="container" style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: 'clamp(1.35rem, 5vw, 2rem)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: 'var(--accent)' }}>✦</span> Admin Operations Center
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <AdminNotificationBell />
          <Link href="/admin/users" className="btn btn-secondary" style={{ width: '100%', maxWidth: '220px' }}>Users Table View</Link>
          <Link href="/admin/payments" className="btn btn-secondary" style={{ width: '100%', maxWidth: '260px' }}>Review Payment Queue</Link>
        </div>
      </div>
      <AdminDashboardClient initialSubscriptions={subscriptions} />
    </div>
  );
}
