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

    // Fetch payments to construct dynamic status transition notification alerts
    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });

    for (const payment of payments) {
      const orderShortId = payment.id.slice(0, 6).toUpperCase();
      const timeStr = payment.updatedAt.toISOString();

      if (payment.status === 'Payment Submitted') {
        notifications.push({
          id: `payment-submitted-${payment.id}`,
          type: 'billing',
          title: 'Payment Proof Submitted',
          body: `Payment proof for Order SS-${orderShortId} is successfully submitted and pending verification.`,
          href: '/dashboard',
          createdAt: timeStr,
        });
      } else if (payment.status === 'Payment Verified') {
        notifications.push({
          id: `payment-verified-${payment.id}`,
          type: 'billing',
          title: 'Payment Confirmed',
          body: `Your payment for Order SS-${orderShortId} has been successfully verified!`,
          href: '/dashboard',
          createdAt: timeStr,
        });
      } else if (payment.status === 'Processing') {
        notifications.push({
          id: `payment-processing-${payment.id}`,
          type: 'onboarding',
          title: 'Activation In Progress',
          body: `We are currently setting up your subscription for Order SS-${orderShortId}.`,
          href: '/dashboard',
          createdAt: timeStr,
        });
      } else if (payment.status === 'Delivered') {
        notifications.push({
          id: `payment-delivered-${payment.id}`,
          type: 'onboarding',
          title: 'Activation Complete',
          body: `Your subscription for Order SS-${orderShortId} is active! Access details are available on your dashboard.`,
          href: '/dashboard',
          createdAt: timeStr,
        });
      } else if (payment.status === 'Verification Required') {
        notifications.push({
          id: `payment-verification-required-${payment.id}`,
          type: 'billing',
          title: 'Verification Action Required',
          body: `Order SS-${orderShortId} requires payment re-verification: ${payment.rejectionReason || 'Please check your screenshot or try again.'}`,
          href: '/dashboard',
          createdAt: timeStr,
        });
      } else if (payment.status === 'rejected') {
        notifications.push({
          id: `payment-rejected-${payment.id}`,
          type: 'billing',
          title: 'Order Rejected',
          body: `Your order SS-${orderShortId} has been rejected. Reason: ${payment.rejectionReason || 'No details provided.'}`,
          href: '/dashboard',
          createdAt: timeStr,
        });
      }
    }

    notifications.push({
      id: 'security-tip',
      type: 'security',
      title: 'Security reminder',
      body: 'Use a strong unique password and rotate it regularly in Settings.',
      href: '/settings',
      createdAt: new Date().toISOString(),
    });

    if (subscriptions.length === 0 && payments.length === 0) {
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

    // Sort notifications so that recent ones appear first
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ notifications: notifications.slice(0, 10) });
  } catch (error) {
    console.error('Notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
