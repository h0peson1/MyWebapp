import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/db';

type NotificationItem = {
  id: string;
  type: 'billing' | 'security' | 'onboarding';
  title: string;
  body: string;
  href?: string;
  createdAt: string;
};

export async function GET() {
  try {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
      take: 5,
      select: {
        id: true,
        status: true,
        productName: true,
        startDate: true,
        expiryDate: true,
      },
    });

    const notifications: NotificationItem[] = [];

    notifications.push({
      id: 'security-tip',
      type: 'security',
      title: 'Security reminder',
      body: 'Use a strong unique password and rotate it regularly in Settings.',
      href: '/settings',
      createdAt: new Date().toISOString(),
    });

    if (subscriptions.length === 0) {
      notifications.push({
        id: 'onboarding-start',
        type: 'onboarding',
        title: 'Finish your setup',
        body: 'Complete onboarding and pick your first plan to unlock all features.',
        href: '/onboarding',
        createdAt: new Date().toISOString(),
      });
    }

    for (const sub of subscriptions) {
      if (sub.status === 'active') {
        const daysLeft = Math.ceil((new Date(sub.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 5) {
          notifications.push({
            id: `renew-${sub.id}`,
            type: 'billing',
            title: `${sub.productName} renews soon`,
            body: `Your plan renews in ${Math.max(daysLeft, 0)} day(s).`,
            href: '/pricing',
            createdAt: new Date(sub.startDate).toISOString(),
          });
        }
      }

      if (sub.status !== 'active') {
        notifications.push({
          id: `expired-${sub.id}`,
          type: 'billing',
          title: `${sub.productName} expired`,
          body: 'Renew your plan to restore access.',
          href: '/pricing',
          createdAt: new Date(sub.expiryDate).toISOString(),
        });
      }
    }

    return NextResponse.json({ notifications: notifications.slice(0, 10) });
  } catch (error) {
    console.error('Notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
