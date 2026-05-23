'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('Sending reset link...');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Unable to process request');
      }

      setStatus('success');
      setMessage(data.message || 'If an account exists for that email, a reset link has been sent.');
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Unable to process request');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-container">
        <h1 className="auth-title">Forgot Password</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1rem', textAlign: 'center' }}>
          Enter your account email and we will send a reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={status === 'loading'}>
            {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {status !== 'idle' && (
          <div
            className="text-center mt-4"
            style={{ fontSize: '0.9rem', color: status === 'success' ? '#4ade80' : status === 'error' ? '#f87171' : 'var(--text-muted)' }}
          >
            {message}
          </div>
        )}

        <div className="auth-footer">
          <p>Remembered your password? <Link href="/login">Back to login</Link></p>
        </div>
      </div>
    </div>
  );
}