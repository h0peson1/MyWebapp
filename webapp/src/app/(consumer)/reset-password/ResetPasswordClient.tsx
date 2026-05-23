'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setStatus('error');
      setMessage('This reset link is invalid or incomplete.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    setStatus('loading');
    setMessage('Updating password...');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Could not reset password');
      }

      setStatus('success');
      setMessage('Password updated successfully. You can now log in.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Could not reset password');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-container">
        <h1 className="auth-title">Reset Password</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1rem', textAlign: 'center' }}>
          Choose a new password for your account.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.4rem' }}>
              Must include uppercase, lowercase, and a number.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={status === 'loading'}>
            {status === 'loading' ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        {status !== 'idle' && (
          <div
            className="text-center mt-4"
            style={{ fontSize: '0.9rem', color: status === 'success' ? '#4ade80' : '#f87171' }}
          >
            {message}
          </div>
        )}

        <div className="auth-footer">
          <p>Back to <Link href="/login">login</Link></p>
        </div>
      </div>
    </div>
  );
}