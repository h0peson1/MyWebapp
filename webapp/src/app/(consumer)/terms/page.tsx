import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Read the terms and conditions for using StreamSaaS subscription services.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="container" style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <section className="premium-panel" style={{ padding: '1.6rem' }}>
        <h1 className="section-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', marginBottom: '0.25rem' }}>
          Terms and Conditions
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Last Updated: April 18, 2026</p>
      </section>

      <section className="card" style={{ gap: '0.95rem' }}>
        <p>By using our platform, you agree to the following:</p>

        <div>
          <h2 className="card-title" style={{ fontSize: '1.05rem' }}>1. Services</h2>
          <p className="card-desc">We provide access to digital subscription services such as Netflix, Apple Music, Snapchat+, Amazon Prime Video, and others.</p>
        </div>

        <div>
          <h2 className="card-title" style={{ fontSize: '1.05rem' }}>2. Account Usage</h2>
          <p className="card-desc">Do not change account details (email/password).</p>
          <p className="card-desc">Do not share or resell access.</p>
          <p className="card-desc">Violations may lead to termination without refund.</p>
        </div>

        <div>
          <h2 className="card-title" style={{ fontSize: '1.05rem' }}>3. Payments</h2>
          <p className="card-desc">Payments are made via Mobile Money.</p>
          <p className="card-desc">All payments are verified manually.</p>
          <p className="card-desc">Access is granted only after confirmation.</p>
        </div>

        <div>
          <h2 className="card-title" style={{ fontSize: '1.05rem' }}>4. Refund Policy</h2>
          <p className="card-desc">Payments are non-refundable once access is granted.</p>
          <p className="card-desc">Invalid or failed payments will not be processed.</p>
        </div>

        <div>
          <h2 className="card-title" style={{ fontSize: '1.05rem' }}>5. Access Duration</h2>
          <p className="card-desc">Subscriptions are valid for the selected duration only.</p>
          <p className="card-desc">Access expires automatically.</p>
        </div>

        <div>
          <h2 className="card-title" style={{ fontSize: '1.05rem' }}>6. Service Availability</h2>
          <p className="card-desc">We aim to provide uninterrupted service but do not guarantee 100% uptime.</p>
        </div>

        <div>
          <h2 className="card-title" style={{ fontSize: '1.05rem' }}>7. Termination</h2>
          <p className="card-desc">We reserve the right to suspend accounts that violate our terms.</p>
        </div>

        <div>
          <h2 className="card-title" style={{ fontSize: '1.05rem' }}>8. Updates</h2>
          <p className="card-desc">We may update these terms at any time.</p>
        </div>

        <div>
          <h2 className="card-title" style={{ fontSize: '1.05rem' }}>9. Contact</h2>
          <p className="card-desc">For support, use the contact section on our website.</p>
        </div>

        <p style={{ fontWeight: 700 }}>By using this service, you agree to these terms.</p>
      </section>
    </div>
  );
}
