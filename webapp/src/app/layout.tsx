import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import "./globals.css";
import { AuthProvider } from '@/components/AuthContext';
import { ThemeProvider } from '@/components/ThemeContext';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import InteractiveBackground from '@/components/InteractiveBackground';
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'production' ? 'https://streamsaas.live' : 'http://localhost:3000');

const displayFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800'],
});

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" />
      </head>
      <body suppressHydrationWarning className={`${displayFont.variable} ${bodyFont.variable}`}>
        <ThemeProvider>
          <InteractiveBackground />
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
