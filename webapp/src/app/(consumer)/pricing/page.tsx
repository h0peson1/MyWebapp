import type { Metadata } from 'next';
import PricingClient from '../PricingClient';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Compare streaming, storage, and premium subscription plans with clear monthly pricing.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Pricing | StreamSaaS',
    description: 'Compare streaming, storage, and premium subscription plans with clear monthly pricing.',
    url: '/pricing',
  },
};

export default function PricingPage() {
  return <PricingClient />;
}
