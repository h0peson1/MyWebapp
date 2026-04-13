import Link from "next/link";
import FadeUp from '@/components/motion/FadeUp';
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerGroup';

export default function HomePage() {
  return (
    <div className="container">
      {/* 🟢 HERO SECTION */}
      <FadeUp duration={0.6}>
        <section className="hero" style={{ animation: 'none', opacity: 1, transform: 'none' }}>
          <h1>Premium Subscriptions at Affordable Prices</h1>
          <p>Get instant access to Netflix, Prime Video, Snapchat+ and more.</p>
          <div className="hero-btns">
            <Link href="/register" className="btn btn-primary">Get Started</Link>
            <Link href="/pricing" className="btn btn-secondary">View Pricing</Link>
          </div>
        </section>
      </FadeUp>

      {/* ⭐ FEATURED PRODUCTS */}
      <section className="mb-8">
        <h2 className="text-center mb-4" style={{ fontSize: '2rem' }}>Featured Products</h2>
        <StaggerContainer className="grid-3">
          {/* NETFLIX */}
          <StaggerItem>
            <div className="card">
              <div>
                <div className="card-header">
                  <h3 className="card-title">Netflix Premium</h3>
                </div>
                <p className="card-desc">Watch unlimited movies & series in stunning 4K Ultra HD on multiple devices.</p>
                <div className="card-price">$4.99<span>/month</span></div>
              </div>
              <Link href="/pricing" className="btn btn-primary btn-full">Subscribe</Link>
            </div>
          </StaggerItem>

          {/* PRIME VIDEO */}
          <StaggerItem>
            <div className="card">
              <div>
                <div className="card-header">
                  <h3 className="card-title">Amazon Prime Video</h3>
                </div>
                <p className="card-desc">Enjoy exclusive Amazon Originals, popular movies, and hit TV shows anytime.</p>
                <div className="card-price">$3.99<span>/month</span></div>
              </div>
              <Link href="/pricing" className="btn btn-primary btn-full">Subscribe</Link>
            </div>
          </StaggerItem>

          {/* SNAPCHAT+ */}
          <StaggerItem>
            <div className="card">
              <div>
                <div className="card-header">
                  <h3 className="card-title">Snapchat+</h3>
                </div>
                <p className="card-desc">Unlock exclusive pre-release features and custom app icons for your profile.</p>
                <div className="card-price">$1.99<span>/month</span></div>
              </div>
              <Link href="/pricing" className="btn btn-primary btn-full">Subscribe</Link>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* 💰 VIEW ALL PLANS PREVIEW */}
      <FadeUp duration={0.5} delay={0.2}>
        <section className="text-center mt-8 mb-8" style={{ padding: '4rem 0', background: 'var(--bg-card)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>More Subscriptions Available</h2>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <span style={{ padding: '0.5rem 1rem', background: 'var(--bg)', borderRadius: '4px', color: 'var(--text-muted)' }}>Apple Music</span>
            <span style={{ padding: '0.5rem 1rem', background: 'var(--bg)', borderRadius: '4px', color: 'var(--text-muted)' }}>iCloud Storage</span>
            <span style={{ padding: '0.5rem 1rem', background: 'var(--bg)', borderRadius: '4px', color: 'var(--text-muted)' }}>DStv Premium</span>
            <span style={{ padding: '0.5rem 1rem', background: 'var(--bg)', borderRadius: '4px', color: 'var(--text-muted)' }}>Apple TV+</span>
          </div>
          <Link href="/pricing" className="btn btn-secondary">👉 View All Plans</Link>
        </section>
      </FadeUp>

      {/* 🧠 TRUST SECTION */}
      <StaggerContainer className="trust-grid">
        <StaggerItem className="trust-item">
          <div className="trust-icon">⚡</div>
          <h3>Instant Delivery</h3>
          <p>Get access to your subscription credentials within seconds of purchase.</p>
        </StaggerItem>
        <StaggerItem className="trust-item">
          <div className="trust-icon">🔒</div>
          <h3>Secure Payments</h3>
          <p>Your transactions are encrypted and securely processed.</p>
        </StaggerItem>
        <StaggerItem className="trust-item">
          <div className="trust-icon">💸</div>
          <h3>Affordable Pricing</h3>
          <p>We source the best bulk deals so you pay a fraction of the cost.</p>
        </StaggerItem>
        <StaggerItem className="trust-item">
          <div className="trust-icon">🎧</div>
          <h3>24/7 Support</h3>
          <p>Our dedicated team is ready to assist you around the clock.</p>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}
