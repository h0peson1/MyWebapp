import type { Metadata } from 'next';
import { Suspense } from 'react';
import ResetPasswordClient from './ResetPasswordClient';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your StreamSaaS account.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="auth-container">
            <h1 className="auth-title">Reset Password</h1>
            <p style={{ color: 'var(--text-muted)' }}>Loading reset form...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}