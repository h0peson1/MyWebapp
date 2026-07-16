'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { trackEvent } from '@/lib/analytics';

export default function LoginClient() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('Processing...');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      void trackEvent('login_success', { email });

      setMessage('Login successful! Redirecting...');
      await checkAuth();
      router.push('/dashboard');
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-container" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)' }}>
        <h1 className="auth-title">Welcome Back</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              autoComplete="email"
              placeholder="name@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              required
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.55rem' }}>
              <Link
                href="/forgot-password"
                style={{ color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '2px' }}
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>



        {message && (
          <div className="text-center mt-4" style={{ fontSize: '0.9rem', color: message.includes('success') || message.includes('Authenticated') ? '#4ade80' : '#f87171' }}>
            {message}
          </div>
        )}
        <div className="auth-footer">
          <p>Don&apos;t have an account? <Link href="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
}
