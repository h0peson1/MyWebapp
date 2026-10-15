import Navbar from '@/components/Navbar';
import Link from 'next/link';
import OnboardingGate from '@/components/OnboardingGate';

export default function ConsumerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <OnboardingGate>{children}</OnboardingGate>
      </main>
      <footer className="footer" style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)', padding: '3.5rem 0 2.5rem' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', textAlign: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              <span className="brand-stream">Stream</span><span className="brand-saas">SaaS</span>
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto' }}>
              Simple, verified access to global premium subscriptions delivered straight to your personal dashboard.
            </p>
          </div>

          <div className="footer-links" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.4rem', margin: '0' }}>
            <Link href="/" style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.88rem' }}>Home</Link>
            <Link href="/pricing" style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.88rem' }}>Pricing Plans</Link>
            <Link href="/onboarding" style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.88rem' }}>How It Works</Link>
            <Link href="/contact" style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.88rem' }}>Contact & Support</Link>
            <Link href="/terms" style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.88rem' }}>Terms of Service</Link>
            <Link href="/privacy-policy" style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.88rem' }}>Privacy Policy</Link>
          </div>

          <div 
            style={{ 
              maxWidth: '680px', 
              margin: '0 auto', 
              padding: '0.85rem 1.25rem', 
              borderRadius: '12px', 
              background: 'var(--bg-elevated)', 
              border: '1px solid var(--border)',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5
            }}
          >
            <strong style={{ color: 'var(--accent)' }}>Support & Security:</strong> We never store your Mobile Money PIN or password. Payments are verified manually for your protection. Questions? WhatsApp <a href="https://wa.me/233203728932" style={{ color: 'var(--accent)', fontWeight: 700 }}>+233203728932</a> or email <a href="mailto:subs@streamsaas.live" style={{ color: 'var(--accent)', fontWeight: 700 }}>subs@streamsaas.live</a>.
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            © {new Date().getFullYear()} StreamSaaS. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
