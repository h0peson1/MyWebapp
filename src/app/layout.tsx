import type { Metadata } from "next";
import "./globals.css";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Premium SaaS",
  description: "Premium Subscriptions at Affordable Prices",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="container">
            <Link href="/" className="nav-brand">
              <span className="text-accent">✦</span> StreamSaaS
            </Link>
            
            <div className="nav-links">
              <Link href="/" className="nav-item">Home</Link>
              <Link href="/pricing" className="nav-item">Pricing</Link>
            </div>

            <div className="nav-actions">
              <Link href="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Login</Link>
              <Link href="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Get Started</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          {children}
        </main>

        <footer className="footer">
          <div className="container">
            <h3>StreamSaaS Inc.</h3>
            <div className="footer-links">
              <Link href="/">Contact</Link>
              <Link href="/">Terms</Link>
              <Link href="/">Support</Link>
            </div>
            <p className="mt-4" style={{ fontSize: '0.85rem' }}>© 2026 StreamSaaS. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
