import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from 'next/font/google';
import "./globals.css";
import { AuthProvider } from '@/components/AuthContext';
import { ThemeProvider } from '@/components/ThemeContext';
import { Analytics } from "@vercel/analytics/react";
import InteractiveBackground from '@/components/InteractiveBackground';
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '700'],
});

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'StreamSaaS',
    template: '%s | StreamSaaS',
  },
  metadataBase: new URL(siteUrl),
  description: 'StreamSaaS helps you buy premium subscriptions, upload payment proof, and manage access from one secure dashboard.',
  keywords: ['saas', 'subscriptions', 'dashboard', 'account settings', 'streaming plans'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'StreamSaaS',
    description: 'Buy premium plans, upload proof, and manage subscriptions in one place.',
    type: 'website',
    url: siteUrl,
    siteName: 'StreamSaaS',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StreamSaaS',
    description: 'Buy premium plans, upload proof, and manage subscriptions in one place.',
    images: ['/twitter-image'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${displayFont.variable} ${bodyFont.variable}`}>
        <ThemeProvider>
          <InteractiveBackground />
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
