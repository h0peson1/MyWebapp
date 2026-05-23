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
      <footer className="footer">
        <div className="container">
          <h3>StreamSaaS Inc.</h3>
          <div className="footer-links">
            <Link href="/contact">Contact</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy-policy">Privacy</Link>
          </div>
          <p className="mt-4" style={{ fontSize: '0.85rem' }}>© 2026 StreamSaaS. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
