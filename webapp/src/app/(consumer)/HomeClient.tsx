'use client';

import Link from 'next/link';
import GoogleIcon from '@/components/icons/GoogleIcon';
import FadeUp from '@/components/motion/FadeUp';
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerGroup';
import { useAuth } from '@/components/AuthContext';

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
  'Admin and user workflows separated cleanly',
  'Fast onboarding from signup to first plan',
];

const howItWorksSteps = [
  {
    title: 'Choose Your Subscription',
    body: 'Select the service you want (Netflix, Apple Music, Snapchat+, etc.)',
  },
  {
    title: 'Make Payment',
    body: 'Send payment using the provided Mobile Money details.',
  },
  {
    title: 'Upload Proof',
    body: 'Upload your payment screenshot for verification.',
  },
  {
    title: 'Get Instant Access',
    body: 'Once verified, your subscription is activated on your dashboard.',
  },
];

export default function HomeClient() {
  const { isLoggedIn, loading } = useAuth();

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <FadeUp duration={0.45}>
        <section className="premium-panel" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-90px', top: '-80px', width: '250px', height: '250px', borderRadius: '999px', background: 'var(--accent-soft)', filter: 'blur(10px)' }} />
          <span className="section-kicker"><GoogleIcon name="sparkles" size={14} style={{ marginRight: '4px' }} /> Streamlined Subscription Control</span>
          <h1 className="section-title" style={{ maxWidth: '860px' }}>
            Premium plans, clean delivery, and a dashboard that actually makes sense.
          </h1>
          <p className="section-subtitle" style={{ marginBottom: '1.4rem' }}>
            StreamSaaS helps you discover plans, pay securely, and manage every subscription in one polished command center.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
            <Link href="/pricing" className="btn btn-primary">
              Explore Pricing <GoogleIcon name="arrow_forward" size={16} style={{ marginLeft: '4px' }} />
            </Link>
            <Link href="/dashboard" className="btn btn-secondary">Open Dashboard</Link>
          </div>
          <div className="grid-3" style={{ marginTop: '1.5rem' }}>
            <div className="stat-chip">
              <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>7+</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Premium services available</p>
            </div>
            <div className="stat-chip">
              <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>24/7</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Access and status visibility</p>
            </div>
            <div className="stat-chip">
              <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>1</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unified account center</p>
            </div>
          </div>
        </section>
      </FadeUp>
      
      <FadeUp delay={0.05}>
        <section className="premium-panel" style={{ padding: '1.25rem', borderStyle: 'dashed' }}>
          <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', justifyItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', fontWeight: 600 }}>
            <GoogleIcon name="bolt" size={18} className="text-accent" /> Instant Delivery
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', fontWeight: 600 }}>
            <div style={{ display: 'flex', marginLeft: '4px' }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--bg)', marginLeft: '-8px', display: 'grid', placeItems: 'center', fontSize: '10px', color: 'white' }}>{i}</div>
              ))}
            </div>
            100+ Satisfied Users
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', fontWeight: 600 }}>
            <GoogleIcon name="check_circle" size={18} style={{ color: '#10b981' }} /> Secure Payment
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', fontWeight: 600 }}>
            <GoogleIcon name="sparkles" size={18} className="text-accent" /> Fast Support
          </div>
        </div>
      </section>
      </FadeUp>

      <StaggerContainer className="grid-3">
        {highlights.map((item) => (
          <StaggerItem key={item.title}>
            <article className="card">
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'grid', placeItems: 'center' }}>
                {item.icon}
              </div>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-desc">{item.body}</p>
            </article>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeUp delay={0.1}>
        <section className="premium-panel" style={{ padding: '1.6rem' }}>
          <span className="section-kicker">How It Works</span>
          <h2 style={{ fontSize: '1.55rem', marginBottom: '0.4rem' }}>Simple steps from payment to access</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Choose a plan, submit proof, and get activated after quick verification.
          </p>

          <div className="grid-4" style={{ gap: '0.8rem' }}>
            {howItWorksSteps.map((step, index) => (
              <article key={step.title} className="card" style={{ gap: '0.55rem' }}>
                <span className="section-kicker" style={{ width: 'fit-content', fontSize: '0.66rem' }}>Step {index + 1}</span>
                <h3 className="card-title" style={{ fontSize: '1rem' }}>{step.title}</h3>
                <p className="card-desc" style={{ fontSize: '0.9rem' }}>{step.body}</p>
              </article>
            ))}
          </div>
        </section>
      </FadeUp>

      <FadeUp delay={0.2}>
        <section className="premium-panel" style={{ padding: '1.6rem' }}>
          <h2 style={{ fontSize: '1.55rem', marginBottom: '0.8rem' }}>What you get from day one</h2>
          <ul className="feature-list" style={{ columns: 2 }}>
            {outcomes.map((point) => (
              <li key={point}>
                <GoogleIcon name="check_circle" size={15} style={{ color: '#10b981' }} /> {point}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '1.1rem', display: 'flex', flexWrap: 'wrap', gap: '0.7rem' }}>
            {!loading && !isLoggedIn && (
              <Link href="/register" className="btn btn-primary">Create Account</Link>
            )}
            <Link href={isLoggedIn ? '/dashboard' : '/onboarding'} className="btn btn-secondary">
              {isLoggedIn ? 'Open Dashboard' : 'View Onboarding'}
            </Link>
          </div>
        </section>
      </FadeUp>

      <FadeUp delay={0.25}>
        <section className="premium-panel" style={{ padding: '1.25rem' }}>
          <span className="section-kicker">Testimonials</span>
          <h2 style={{ fontSize: '1.7rem', marginBottom: '1.5rem' }}>What Our Users Say</h2>
          <div className="grid-3" style={{ gap: '1.2rem' }}>
            <article className="card" style={{ padding: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.04)' }}>
              <p style={{ fontStyle: 'italic', color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1rem' }}>
                "Got my Netflix access in minutes. Very reliable!"
              </p>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--accent)' }}>— Kwame A.</div>
            </article>
            <article className="card" style={{ padding: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.04)' }}>
              <p style={{ fontStyle: 'italic', color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1rem' }}>
                "Smooth process and fast support. Highly recommend."
              </p>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--accent)' }}>— Ama K.</div>
            </article>
            <article className="card" style={{ padding: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.04)' }}>
              <p style={{ fontStyle: 'italic', color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1rem' }}>
                "Best place to get cheap subscriptions. Works perfectly."
              </p>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--accent)' }}>— Daniel T.</div>
            </article>
          </div>
        </section>
      </FadeUp>

      <FadeUp delay={0.28}>
        <section className="premium-panel" style={{ padding: '1.4rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>Contact Us</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.85rem' }}>Need help or have questions?</p>
          <p style={{ marginBottom: '0.35rem' }}>WhatsApp: <a href="https://wa.me/233203728932" style={{ color: 'var(--accent)', fontWeight: 700 }}>+233203728932</a></p>
          <p style={{ marginBottom: '0.7rem' }}>Email: <a href="mailto:subs@streamsaas.live" style={{ color: 'var(--accent)', fontWeight: 700 }}>subs@streamsaas.live</a></p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>We typically respond within minutes.</p>
        </section>
      </FadeUp>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/233203728932?text=Hello, I need help with a subscription" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 100,
          background: '#25D366',
          color: 'white',
          padding: '0.7rem 1.2rem',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontWeight: 700,
          boxShadow: '0 8px 20px rgba(37, 211, 102, 0.35)',
          textDecoration: 'none',
          fontSize: '0.88rem'
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 10.106-9.885 10.102m8.445-18.547A11.03 11.03 0 0012.024 0c-6.108 0-11.074 4.966-11.077 11.074 0 1.953.51 3.858 1.478 5.54L0 23.94l7.306-1.917A11.033 11.033 0 0012.02 22.126h.005c6.107 0 11.074-4.968 11.077-11.076 0-2.959-1.152-5.74-3.24-7.83z"/>
        </svg>
        Chat on WhatsApp
      </a>
    </div>
  );
}
