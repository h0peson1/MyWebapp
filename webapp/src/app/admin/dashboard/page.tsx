import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/db';
import AdminDashboardClient from './AdminDashboardClient';

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
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ color: 'var(--accent)' }}>✦</span> Admin Operations Center
      </h1>
      <AdminDashboardClient initialSubscriptions={subscriptions} />
    </div>
  );
}
