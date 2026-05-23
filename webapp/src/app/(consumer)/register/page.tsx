import type { Metadata } from 'next';
import { Suspense } from 'react';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a StreamSaaS account to subscribe, submit proof, and manage your plans.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="auth-container">
            <h1 className="auth-title">Create Account</h1>
            <p style={{ color: 'var(--text-muted)' }}>Loading signup form...</p>
          </div>
        </div>
      }
    >
      <RegisterClient />
    </Suspense>
  );
}
