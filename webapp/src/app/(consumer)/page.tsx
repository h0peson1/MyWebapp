import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Subscription Delivery and Account Control',
  description: 'Browse premium plans, pay securely, and manage delivery details from a single polished dashboard.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'StreamSaaS',
    description: 'Browse premium plans, pay securely, and manage delivery details from a single polished dashboard.',
    url: '/',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
