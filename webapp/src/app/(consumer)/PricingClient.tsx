'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import GoogleIcon from '@/components/icons/GoogleIcon';
import { getServiceIcon } from '@/components/icons/BrandIcons';
import FadeUp from '@/components/motion/FadeUp';
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerGroup';
import { trackEvent } from '@/lib/analytics';
import { createProductId, getProductPrice } from '@/lib/products';

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
    perks: ['4K Ultra HD streaming', '4 simultaneous devices', 'Offline downloads'],
    featured: true,
  },
  {
    product: 'Amazon Prime Video',
    plan: 'Standard',
    price: '₵70',
    tagline: 'Amazon Originals and a deep catalog of shows and films.',
    perks: ['Amazon Originals access', 'Fast availability', 'Multi-device access'],
  },
  {
    product: 'Apple Music',
    plan: 'Standard',
    price: '₵25',
    tagline: 'Lossless audio with millions of songs ad-free.',
    perks: ['Lossless & Spatial Audio', 'Curated playlists', 'Cross-device sync'],
  },
  {
    product: 'Apple TV+',
    plan: 'Standard',
    price: '₵60',
    tagline: 'Award-winning original series and films.',
    perks: ['Apple Original content', 'Family sharing ready', '4K HDR streaming'],
  },
  {
    product: 'DStv Premium',
    plan: 'Premium',
    price: '₵150',
    tagline: 'Live channels and premium television packages.',
    perks: ['Premium TV channels', 'Live sports & events', 'Multi-screen access'],
  },
  {
    product: 'Snapchat+',
    plan: 'Premium',
    price: '₵35',
    tagline: 'Experimental and exclusive Snapchat features.',
    perks: ['Early experimental features', 'Exclusive badge access', 'Priority story boost'],
  },
];

const icloudPlans: Plan[] = [
  {
    product: 'iCloud',
    plan: '50GB',
    price: '₵40',
    tagline: 'Best for essentials, photo storage and quick backups.',
    perks: ['Photo & video backups', 'Simple storage expansion', 'Seamless device sync'],
  },
  {
    product: 'iCloud',
    plan: '200GB',
    price: '₵80',
    tagline: 'Balanced plan for families, creators and heavy phone usage.',
    perks: ['Family sharing up to 5', 'Auto iCloud backups', 'Private Relay & encryption'],
    featured: true,
  },
  {
    product: 'iCloud',
    plan: '1TB',
    price: '₵150',
    tagline: 'Maximum room for heavy media workflows and creator libraries.',
    perks: ['Huge photo/video library', 'Shared team folders', 'Full device restore backup'],
  },
];

export default function PricingClient() {
  const { isLoggedIn, loading } = useAuth();
  const [planMonths, setPlanMonths] = useState<Record<string, number>>({});

  const getSubscribeHref = (productName: string, plan: string, months: number) => {
    const productId = createProductId(productName, plan);
    const paymentHref = `/payment?productId=${encodeURIComponent(productId)}&months=${months}`;
    return isLoggedIn ? paymentHref : `/register?next=${encodeURIComponent(paymentHref)}`;
  };

  const renderPlan = (plan: Plan) => {
    const id = `${plan.product}-${plan.plan}`;
    const months = planMonths[id] || 1;
    const href = getSubscribeHref(plan.product, plan.plan, months);
    const basePriceMinor = getProductPrice(plan.product, plan.plan) || 0;
    const monthlyPriceFormatted = `₵${(basePriceMinor / 100).toFixed(0)}`;
    const totalPriceMinor = basePriceMinor * months;
    const totalPriceFormatted = `₵${(totalPriceMinor / 100).toFixed(0)}`;

    return (
      <StaggerItem key={id}>
        <article className={`card ${plan.featured ? 'pricing-card-featured' : ''}`}>
          {/* Card Top: Logo + Title + Featured Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div 
                style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '12px', 
                  background: 'var(--bg-elevated)', 
                  border: '1px solid var(--border)', 
                  display: 'grid', 
                  placeItems: 'center', 
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(11, 37, 44, 0.05)'
                }}
              >
                {getServiceIcon(plan.product, 28)}
              </div>
              <div>
                <h3 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '0.15rem' }}>
                  {plan.product}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {plan.plan} Plan
                </span>
              </div>
            </div>
            {plan.featured && (
              <span className="badge-featured">
                <GoogleIcon name="star" size={13} /> Featured
              </span>
            )}
          </div>

          <p className="card-desc" style={{ fontSize: '0.88rem', margin: '0.3rem 0 0.6rem', minHeight: '2.5rem' }}>
            {plan.tagline}
          </p>

          {/* Pricing Section with Enhanced Visual Hierarchy */}
          <div style={{ padding: '0.75rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {monthlyPriceFormatted}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                / month
              </span>
            </div>
            {months > 1 && (
              <p style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 700, marginTop: '0.35rem' }}>
                Total for {months} Months: {totalPriceFormatted}
              </p>
            )}
          </div>

          {/* Interactive Duration Selector */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Select Duration
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700 }}>
                {months} Month{months > 1 ? 's' : ''}
              </span>
            </div>
            <div className="duration-selector" role="group" aria-label="Subscription duration">
              {[1, 3, 6, 12].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`duration-pill ${months === opt ? 'active' : ''}`}
                  onClick={() => setPlanMonths((prev) => ({ ...prev, [id]: opt }))}
                  aria-pressed={months === opt}
                >
                  {opt}M
                </button>
              ))}
            </div>
          </div>

          {/* Scannable Feature List */}
          <ul className="feature-list" style={{ marginTop: '0.2rem', marginBottom: '0.6rem', flexGrow: 1 }}>
            {plan.perks.map((perk) => (
              <li key={perk} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.86rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--primary)', display: 'flex', flexShrink: 0 }}>
                  <GoogleIcon name="check_circle" size={15} />
                </span>
                <span>{perk}</span>
              </li>
            ))}
          </ul>

          <Link
            href={href}
            aria-disabled={loading}
            onClick={() => {
              if (loading) return;
              void trackEvent('pricing_select_plan', { productName: plan.product, plan: plan.plan });
            }}
            className={plan.featured ? 'btn btn-accent btn-full' : 'btn btn-primary btn-full'}
            style={{ marginTop: 'auto', padding: '0.8rem', fontSize: '0.92rem' }}
          >
            Subscribe Now
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
            <span className="section-kicker"><GoogleIcon name="shield" size={14} /> Verified Plans</span>
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
            <span className="section-kicker"><GoogleIcon name="cloud" size={14} /> iCloud Storage</span>
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
