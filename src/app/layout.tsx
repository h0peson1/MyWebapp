import type { Metadata } from "next";
import "./globals.css";
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Analytics } from '@vercel/analytics/next';

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
        <Navbar />

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
        <Analytics />
      </body>
    </html>
  );
}
