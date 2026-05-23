import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read how StreamSaaS collects, uses, and protects your personal information.',
  alternates: {
    canonical: '/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container" style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <section className="premium-panel" style={{ padding: '1.6rem' }}>
        <h1 className="section-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', marginBottom: '0.25rem' }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Last Updated: April 18, 2026</p>
      </section>

      <section className="card" style={{ gap: '0.95rem' }}>
        <p>We value your privacy and are committed to protecting your personal information.</p>

        <div>
          <h2 className="card-title" style={{ fontSize: '1.05rem' }}>1. Information We Collect</h2>
          <p className="card-desc">We may collect the following information when you use our platform:</p>
          <p className="card-desc">Name</p>
          <p className="card-desc">Email address</p>
          <p className="card-desc">Payment details (such as transaction proof screenshots)</p>
          <p className="card-desc">Usage data (how you interact with the website)</p>
        </div>

        <div>
          <h2 className="card-title" style={{ fontSize: '1.05rem' }}>2. How We Use Your Information</h2>
          <p className="card-desc">We use your information to:</p>
          <p className="card-desc">Provide and manage your subscriptions</p>
          <p className="card-desc">Verify payments</p>
          <p className="card-desc">Communicate with you (support, updates)</p>
          <p className="card-desc">Improve our services</p>
        </div>

        <div>
          <h2 className="card-title" style={{ fontSize: '1.05rem' }}>3. Payment Information</h2>
          <p className="card-desc">Payments are made through external methods such as Mobile Money.</p>
          <p className="card-desc">We do NOT store sensitive financial details like PINs or passwords.</p>
        </div>

        <div>
          <h2 className="card-title" style={{ fontSize: '1.05rem' }}>4. Data Storage</h2>
          <p className="card-desc">Your data is stored securely</p>
          <p className="card-desc">Payment proof images may be stored using third-party services (e.g., Cloudinary)</p>
        </div>

        <div>
          <h2 className="card-title" style={{ fontSize: '1.05rem' }}>5. Data Sharing</h2>
          <p className="card-desc">We do NOT sell or share your personal information with third parties, except:</p>
          <p className="card-desc">When required by law</p>
          <p className="card-desc">When necessary to provide our services</p>
        </div>

        <div>
          <h2 className="card-title" style={{ fontSize: '1.05rem' }}>6. Security</h2>
          <p className="card-desc">We take reasonable steps to protect your data. However, no system is 100% secure.</p>
        </div>

        <div>
          <h2 className="card-title" style={{ fontSize: '1.05rem' }}>7. User Responsibility</h2>
          <p className="card-desc">Users are responsible for keeping their login details secure.</p>
        </div>

        <div>
          <h2 className="card-title" style={{ fontSize: '1.05rem' }}>8. Cookies and Analytics</h2>
          <p className="card-desc">We may use analytics tools to understand how users interact with our site and improve performance.</p>
        </div>

        <div>
          <h2 className="card-title" style={{ fontSize: '1.05rem' }}>9. Your Rights</h2>
          <p className="card-desc">You may request to:</p>
          <p className="card-desc">Access your data</p>
          <p className="card-desc">Correct your information</p>
          <p className="card-desc">Delete your account</p>
        </div>

        <div>
          <h2 className="card-title" style={{ fontSize: '1.05rem' }}>10. Changes to This Policy</h2>
          <p className="card-desc">We may update this Privacy Policy at any time. Continued use of the platform means you accept the changes.</p>
        </div>

        <p style={{ fontWeight: 700 }}>By using our platform, you agree to this Privacy Policy.</p>
      </section>
    </div>
  );
}