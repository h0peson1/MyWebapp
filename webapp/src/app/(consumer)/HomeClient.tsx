'use client';

import Link from 'next/link';
import GoogleIcon from '@/components/icons/GoogleIcon';
import FadeUp from '@/components/motion/FadeUp';
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerGroup';
import { useAuth } from '@/components/AuthContext';
import { DashboardMockup } from '@/components/home/DashboardMockup';
import {
  NetflixIcon,
  AppleMusicIcon,
  AppleTvIcon,
  PrimeVideoIcon,
  DstvIcon,
  SnapchatIcon,
  ICloudIcon,
} from '@/components/icons/BrandIcons';

const highlights = [
  {
    title: 'Instant Access Delivery',
    body: 'Buy once and get private delivery details directly in your dashboard in minutes.',
    icon: <GoogleIcon name="bolt" size={18} />,
  },
  {
    title: 'Secure Account Controls',
    body: 'Hardened login, password policies, and protected route checks by default.',
    icon: <GoogleIcon name="lock" size={18} />,
  },
  {
    title: 'Simple Renewal Flow',
    body: 'Track active and expired subscriptions in one place and renew quickly.',
    icon: <GoogleIcon name="timer" size={18} />,
  },
];

const outcomes = [
  'No manual back-and-forth for account access',
  'Transparent status updates and expiry visibility',
  'Private credential delivery inside your secured dashboard',
  'Fast onboarding from signup to first subscription plan',
];

const howItWorksSteps = [
  {
    step: 1,
    title: 'Choose Subscription',
    body: 'Pick Netflix, Apple Music, Prime, DStv, iCloud or Snapchat+ and select 1, 3, 6, or 12 months.',
    icon: 'subscriptions',
  },
  {
    step: 2,
    title: 'Send Mobile Money',
    body: 'Send the exact amount via your preferred Mobile Money provider to our designated merchant account.',
    icon: 'phone_android',
  },
  {
    step: 3,
    title: 'Upload Payment Proof',
    body: 'Submit your transaction ID or upload a screenshot for fast human verification.',
    icon: 'receipt_long',
  },
  {
    step: 4,
    title: 'Get Immediate Access',
    body: 'Your subscription credentials and renewal dates are delivered directly to your dashboard.',
    icon: 'verified',
  },
];

const testimonials = [
  {
    quote: 'Got my Netflix 4K access within 5 minutes of submitting proof. The dashboard makes renewals totally painless.',
    author: 'Kwame A.',
    plan: 'Netflix Premium Subscriber',
    initials: 'KA',
  },
  {
    quote: 'Customer support is super responsive on WhatsApp. My Apple Music was activated immediately. Best prices in Ghana.',
    author: 'Ama K.',
    plan: 'Apple Music Subscriber',
    initials: 'AK',
  },
  {
    quote: 'I use the iCloud 200GB plan for all my photo backups. Safe, reliable, and verified with zero hassle.',
    author: 'Daniel T.',
    plan: 'iCloud 200GB Subscriber',
    initials: 'DT',
  },
];

export default function HomeClient() {
  const { isLoggedIn, loading } = useAuth();

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Section */}
      <FadeUp duration={0.45}>
        <section 
          className="premium-panel" 
          style={{ 
            padding: '2.5rem 1.8rem', 
            position: 'relative', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          <div 
            style={{ 
              position: 'absolute', 
              right: '-80px', 
              top: '-80px', 
              width: '280px', 
              height: '280px', 
              borderRadius: '999px', 
              background: 'var(--accent-soft)', 
              filter: 'blur(30px)',
              pointerEvents: 'none'
            }} 
          />
          
          <h1 className="section-title" style={{ maxWidth: '880px', margin: 0 }}>
            Premium plans, clean delivery, and a dashboard that actually makes sense.
          </h1>

          <p className="section-subtitle" style={{ margin: 0, maxWidth: '680px' }}>
            StreamSaaS helps you discover verified streaming and cloud subscriptions, pay securely with Mobile Money, and manage every plan from one polished command center.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginTop: '0.4rem' }}>
            <Link href="/pricing" className="btn btn-primary" style={{ padding: '0.85rem 1.6rem', fontSize: '0.95rem' }}>
              Explore Pricing <GoogleIcon name="arrow_forward" size={16} style={{ marginLeft: '4px' }} />
            </Link>
            <Link href={isLoggedIn ? '/dashboard' : '/pricing'} className="btn btn-secondary" style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}>
              {isLoggedIn ? 'Open Dashboard' : 'View Verified Plans'}
            </Link>
          </div>

          {/* Service Logos Strip */}
          <div style={{ marginTop: '0.8rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.85rem' }}>
              Supported Subscriptions & Instant Activation
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
              {[
                { name: 'Netflix', icon: <NetflixIcon size={20} /> },
                { name: 'Apple Music', icon: <AppleMusicIcon size={20} /> },
                { name: 'Apple TV+', icon: <AppleTvIcon size={20} /> },
                { name: 'Prime Video', icon: <PrimeVideoIcon size={20} /> },
                { name: 'DStv', icon: <DstvIcon size={20} /> },
                { name: 'Snapchat+', icon: <SnapchatIcon size={20} /> },
                { name: 'iCloud', icon: <ICloudIcon size={20} /> },
              ].map((brand) => (
                <div 
                  key={brand.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '10px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    boxShadow: '0 2px 6px rgba(11, 37, 44, 0.04)'
                  }}
                >
                  {brand.icon}
                  <span>{brand.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid-3" style={{ marginTop: '0.6rem' }}>
            <div className="stat-chip" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>7+ Services</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Entertainment & cloud storage</p>
            </div>
            <div className="stat-chip" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)', margin: 0 }}>100% Verified</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Human-verified manual security</p>
            </div>
            <div className="stat-chip" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>24/7 Access</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Unified subscriber command center</p>
            </div>
          </div>
        </section>
      </FadeUp>
      
      {/* Trust & Guarantee Bar */}
      <FadeUp delay={0.05}>
        <section 
          className="premium-panel" 
          style={{ 
            padding: '1.1rem 1.4rem', 
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)' 
          }}
        >
          <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', justifyItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.86rem', fontWeight: 700 }}>
              <span style={{ color: 'var(--accent)', display: 'flex' }}><GoogleIcon name="bolt" size={18} /></span>
              <span>Fast Dashboard Delivery</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.86rem', fontWeight: 700 }}>
              <div style={{ display: 'flex', marginLeft: '6px' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--bg)', marginLeft: '-6px', display: 'grid', placeItems: 'center', fontSize: '10px', color: 'white', fontWeight: 800 }}>
                    {i}
                  </div>
                ))}
              </div>
              <span>100+ Satisfied Subscribers</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.86rem', fontWeight: 700 }}>
              <span style={{ color: 'var(--primary)', display: 'flex' }}><GoogleIcon name="lock" size={18} /></span>
              <span>Protected Mobile Money</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.86rem', fontWeight: 700 }}>
              <span style={{ color: 'var(--accent)', display: 'flex' }}><GoogleIcon name="support_agent" size={18} /></span>
              <span>Fast WhatsApp Support</span>
            </div>
          </div>
        </section>
      </FadeUp>

      {/* Feature Highlights */}
      <StaggerContainer className="grid-3">
        {highlights.map((item) => (
          <StaggerItem key={item.title}>
            <article className="card">
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'grid', placeItems: 'center' }}>
                {item.icon}
              </div>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-desc">{item.body}</p>
            </article>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* How It Works Section with Reassurance Banner */}
      <FadeUp delay={0.1}>
        <section className="premium-panel" style={{ padding: '2rem 1.8rem', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          <div>
            <span className="section-kicker">Payment & Activation Flow</span>
            <h2 style={{ fontSize: '1.75rem', marginTop: '0.4rem', marginBottom: '0.35rem' }}>
              Simple steps from payment to access
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
              Choose a subscription plan, send payment via Mobile Money, and get activated after swift verification.
            </p>
          </div>

          <div className="grid-4" style={{ gap: '1rem' }}>
            {howItWorksSteps.map((step) => (
              <article key={step.title} className="card" style={{ gap: '0.65rem', padding: '1.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span 
                    style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%', 
                      background: 'var(--primary)', 
                      color: '#ffffff', 
                      display: 'grid', 
                      placeItems: 'center', 
                      fontSize: '0.82rem', 
                      fontWeight: 800 
                    }}
                  >
                    {step.step}
                  </span>
                  <span style={{ color: 'var(--accent)', display: 'flex' }}>
                    <GoogleIcon name={step.icon} size={20} />
                  </span>
                </div>
                <h3 className="card-title" style={{ fontSize: '1.05rem', margin: 0 }}>{step.title}</h3>
                <p className="card-desc" style={{ fontSize: '0.88rem', margin: 0 }}>{step.body}</p>
              </article>
            ))}
          </div>

          {/* Trust & Security Reassurance Note */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.85rem', 
              padding: '1.1rem 1.4rem', 
              borderRadius: '14px', 
              background: 'var(--bg-elevated)', 
              border: '1px solid var(--border)',
              boxShadow: '0 4px 16px rgba(11, 37, 44, 0.04)'
            }}
          >
            <div 
              style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '50%', 
                background: 'rgba(23, 140, 164, 0.12)', 
                color: '#178CA4', 
                display: 'grid', 
                placeItems: 'center', 
                flexShrink: 0 
              }}
            >
              <GoogleIcon name="shield" size={20} />
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
              <strong style={{ color: 'var(--accent)' }}>Security Reassurance:</strong> We never store your Mobile Money PIN or password. Payments are verified manually for security.
            </p>
          </div>
        </section>
      </FadeUp>

      {/* What You Get From Day One + Live Dashboard Mockup */}
      <FadeUp delay={0.2}>
        <section className="premium-panel" style={{ padding: '2.2rem 1.8rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            <div>
              <span className="section-kicker">Subscriber Experience</span>
              <h2 style={{ fontSize: '1.8rem', marginTop: '0.45rem', marginBottom: '0.75rem' }}>
                What you get from day one
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                Every subscription comes with clear timeline management, dedicated support, and automated reminders before your plan expires.
              </p>
              
              <ul className="feature-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
                {outcomes.map((point) => (
                  <li key={point} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                    <span style={{ color: 'var(--primary)', display: 'flex', marginTop: '2px', flexShrink: 0 }}>
                      <GoogleIcon name="check_circle" size={17} />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                {!loading && !isLoggedIn && (
                  <Link href="/register" className="btn btn-primary" style={{ padding: '0.8rem 1.4rem' }}>
                    Create Account
                  </Link>
                )}
                <Link href={isLoggedIn ? '/dashboard' : '/onboarding'} className="btn btn-secondary" style={{ padding: '0.8rem 1.4rem' }}>
                  {isLoggedIn ? 'Open Dashboard' : 'View Onboarding Guide'}
                </Link>
              </div>
            </div>

            {/* Embedded Live Dashboard Mockup Preview */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <DashboardMockup />
            </div>
          </div>
        </section>
      </FadeUp>

      {/* Testimonials Section */}
      <FadeUp delay={0.25}>
        <section className="premium-panel" style={{ padding: '2.2rem 1.8rem', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          <div>
            <span className="section-kicker">Verified Feedback</span>
            <h2 style={{ fontSize: '1.75rem', marginTop: '0.4rem', marginBottom: '0.35rem' }}>
              What Our Subscribers Say
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
              Real feedback from customers using StreamSaaS for daily entertainment and storage.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '1.2rem' }}>
            {testimonials.map((t) => (
              <article 
                key={t.author} 
                className="card" 
                style={{ 
                  padding: '1.6rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.9rem' 
                }}
              >
                {/* 5 Stars Rating */}
                <div style={{ display: 'flex', gap: '3px', color: 'var(--accent)' }}>
                  {[...Array(5)].map((_, i) => (
                    <GoogleIcon key={i} name="star" size={17} />
                  ))}
                </div>

                <p style={{ color: 'var(--text-main)', fontSize: '0.94rem', lineHeight: 1.55, fontStyle: 'italic', flexGrow: 1, margin: 0 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                  <div 
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%', 
                      background: 'var(--accent-soft)', 
                      color: 'var(--accent)', 
                      display: 'grid', 
                      placeItems: 'center', 
                      fontWeight: 800, 
                      fontSize: '0.82rem' 
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {t.author}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {t.plan}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </FadeUp>

      {/* Contact Section */}
      <FadeUp delay={0.28}>
        <section className="premium-panel" style={{ padding: '1.8rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <span className="section-kicker">Direct Contact</span>
            <h2 style={{ fontSize: '1.5rem', marginTop: '0.4rem', marginBottom: '0.35rem' }}>Need assistance with a plan?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
              Our team operates 24/7 to answer questions, guide payments, and verify deliveries.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
            <a 
              href="https://wa.me/233203728932?text=Hello,%20I%20have%20a%20question%20about%20StreamSaaS" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.4rem' }}
            >
              <GoogleIcon name="chat" size={16} /> WhatsApp: +233203728932
            </a>
            <a 
              href="mailto:subs@streamsaas.live" 
              className="btn btn-secondary"
              style={{ padding: '0.75rem 1.4rem' }}
            >
              <GoogleIcon name="mail" size={16} /> subs@streamsaas.live
            </a>
          </div>
        </section>
      </FadeUp>

      {/* Floating WhatsApp Quick Action Button */}
      <a 
        href="https://wa.me/233203728932?text=Hello,%20I%20need%20help%20with%20a%20subscription" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 100,
          background: 'linear-gradient(135deg, #178CA4 0%, #127285 100%)',
          color: 'white',
          padding: '0.75rem 1.35rem',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontWeight: 700,
          boxShadow: '0 8px 24px rgba(23, 140, 164, 0.35), 0 0 0 1px rgba(24, 183, 190, 0.3)',
          textDecoration: 'none',
          fontSize: '0.88rem',
          transition: 'transform 0.2s ease',
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 10.106-9.885 10.102m8.445-18.547A11.03 11.03 0 0012.024 0c-6.108 0-11.074 4.966-11.077 11.074 0 1.953.51 3.858 1.478 5.54L0 23.94l7.306-1.917A11.033 11.033 0 0012.02 22.126h.005c6.107 0 11.074-4.968 11.077-11.076 0-2.959-1.152-5.74-3.24-7.83z"/>
        </svg>
        WhatsApp Support
      </a>
    </div>
  );
}
