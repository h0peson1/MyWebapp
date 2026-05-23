import type { Metadata } from 'next';
import OnboardingClient from '../OnboardingClient';

export const metadata: Metadata = {
  title: 'Onboarding',
  description: 'Complete the setup steps for your StreamSaaS account.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OnboardingPage() {
  return <OnboardingClient />;
}
