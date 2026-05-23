'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { CheckCircle2, Cloud, ShieldCheck } from 'lucide-react';
import FadeUp from '@/components/motion/FadeUp';
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerGroup';
import { trackEvent } from '@/lib/analytics';
import { createProductId } from '@/lib/products';

type Plan = {
  product: string;
  plan: string;
  price: string;
  tagline: string;
  featured?: boolean;
  perks: string[];
};

const streamingPlans: Plan[] = [
  {
    product: 'Netflix',
    plan: 'Premium',
    price: '₵40',
    tagline: 'Unlimited movies and TV shows in 4K quality.',
    perks: ['4K streaming', '4 simultaneous devices', 'Offline downloads'],
    featured: true,
  },
  {
    product: 'Amazon Prime Video',
    plan: 'Standard',
    price: '₵70',
    tagline: 'Amazon Originals and a deep catalog of shows and films.',
    perks: ['Original series', 'Fast availability', 'Multi-device access'],
  },
  {
    product: 'Apple Music',
    plan: 'Standard',
    price: '₵30',
    tagline: 'Lossless audio with millions of songs ad-free.',
    perks: ['Lossless quality', 'Curated playlists', 'Cross-device sync'],
  },
  {
    product: 'Apple TV+',
    plan: 'Standard',
    price: '₵60',
    tagline: 'Award-winning original series and films.',
    perks: ['Original content', 'Family sharing ready', 'HD streaming'],
  },
  {
    product: 'DStv Premium',
    plan: 'Premium',
    price: '₵150',
    tagline: 'Live channels and premium television packages.',
    perks: ['Premium channels', 'Live sports', 'Multi-screen access'],
  },
  {
    product: 'Snapchat+',
    plan: 'Premium',
    price: '₵35',
    tagline: 'Experimental and exclusive Snapchat features.',
    perks: ['Early features', 'Badge access', 'Priority experiments'],
  },
];

const icloudPlans: Plan[] = [
  {
    product: 'iCloud',
    plan: '50GB',
    price: '₵40',
    tagline: 'Best for essentials and quick backups.',
    perks: ['Photo backups', 'Simple storage expansion', 'Device sync'],
  },
  {
    product: 'iCloud',
    plan: '200GB',
    price: '₵80',
    tagline: 'Balanced plan for families and creators.',
    perks: ['Family sharing', 'Auto backups', 'End-to-end encryption'],
    featured: true,
  },
  {
    product: 'iCloud',
    plan: '1TB',
    price: '₵150',
    tagline: 'Maximum room for heavy media workflows.',
    perks: ['Huge library support', 'Shared folders', 'Cross-device restore'],
  },
];

export default function PricingClient() {
  const { isLoggedIn, loading } = useAuth();

  const getSubscribeHref = (productName: string, plan: string) => {
    const productId = createProductId(productName, plan);
    const paymentHref = `/payment?productId=${encodeURIComponent(productId)}`;
    return isLoggedIn ? paymentHref : `/register?next=${encodeURIComponent(paymentHref)}`;
  };

  const renderPlan = (plan: Plan) => {
    const id = `${plan.product}-${plan.plan}`;
    const href = getSubscribeHref(plan.product, plan.plan);

    return (
      <StaggerItem key={id}>
        <article
          className="card"
          style={{
            borderColor: plan.featured ? 'var(--border-strong)' : 'var(--border)',
            boxShadow: plan.featured ? '0 18px 38px rgba(220, 106, 31, 0.18)' : undefined,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.8rem' }}>
            <div>
              <h3 className="card-title">{plan.product} {plan.product === 'iCloud' ? plan.plan : plan.plan}</h3>
              <p className="card-desc" style={{ marginBottom: '0.8rem' }}>{plan.tagline}</p>
            </div>
            {plan.featured && (
              <span className="section-kicker" style={{ padding: '0.25rem 0.55rem', fontSize: '0.68rem' }}>Featured</span>
            )}
          </div>

          <p className="card-price">{plan.price}<span>/month</span></p>

          <ul className="feature-list" style={{ marginBottom: '0.4rem' }}>
            {plan.perks.map((perk) => (
              <li key={perk}>
                <CheckCircle2 size={14} color="#16a34a" /> {perk}
              </li>
            ))}
          </ul>

          <Link
            href={href}
            aria-disabled={loading}
            onClick={() => {
              if (loading) {
                return;
              }
              void trackEvent('pricing_select_plan', { productName: plan.product, plan: plan.plan });
            }}
            className={plan.featured ? 'btn btn-primary btn-full' : 'btn btn-secondary btn-full'}
          >
            Subscribe
          </Link>
        </article>
      </StaggerItem>
    );
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
      <FadeUp duration={0.4}>
        <section className="premium-panel" style={{ padding: '1.8rem', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.7rem' }}>
            <span className="section-kicker"><ShieldCheck size={14} /> Verified Plans</span>
          </div>
          <h1 className="section-title" style={{ marginTop: '0.7rem' }}>Pricing built for speed and clarity</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Pick a plan, complete checkout, and track everything inside your dashboard.
          </p>
        </section>
      </FadeUp>

      <StaggerContainer className="grid-3">
        {streamingPlans.map((plan) => renderPlan(plan))}
      </StaggerContainer>

      <FadeUp delay={0.2} duration={0.5}>
        <section className="premium-panel" style={{ padding: '1.3rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span className="section-kicker"><Cloud size={14} /> iCloud Storage</span>
            <h2 style={{ fontSize: '1.7rem', marginTop: '0.6rem' }}>Storage tiers for every workflow</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Choose your preferred iCloud capacity and keep all your devices in sync.
            </p>
          </div>
          <StaggerContainer className="grid-3">
            {icloudPlans.map((plan) => renderPlan(plan))}
          </StaggerContainer>
        </section>
      </FadeUp>
    </div>
  );
}
