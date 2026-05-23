import type { Metadata } from 'next';
import LoginClient from '../LoginClient';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Log in to your StreamSaaS account to manage subscriptions and view delivery status.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
