import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact StreamSaaS support via WhatsApp or email for quick help.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="container" style={{ maxWidth: '760px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <section className="premium-panel" style={{ padding: '1.6rem' }}>
        <h1 className="section-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', marginBottom: '0.4rem' }}>
          Contact Us
        </h1>
        <p className="section-subtitle">Need help or have questions?</p>
      </section>

      <section className="card" style={{ gap: '0.9rem' }}>
        <div className="stat-chip">
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>WhatsApp</p>
          <p style={{ fontWeight: 800, fontSize: '1.05rem' }}>
            <a href="https://wa.me/233203728932" style={{ color: 'var(--accent)' }}>
              +233203728932
            </a>
          </p>
        </div>

        <div className="stat-chip">
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email</p>
          <p style={{ fontWeight: 800, fontSize: '1.05rem' }}>
            <a href="mailto:subs@streamsaas.live" style={{ color: 'var(--accent)' }}>
              subs@streamsaas.live
            </a>
          </p>
        </div>

        <p style={{ color: 'var(--text-muted)' }}>We typically respond within minutes.</p>
      </section>
    </div>
  );
}
