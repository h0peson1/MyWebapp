'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

export default function RegisterClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);



  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedPolicies) {
      setMessage('Please accept the Terms and Privacy Policy to continue.');
      return;
    }

    setIsLoading(true);
    setMessage('Processing...');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, acceptedPolicies: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      await trackEvent('register_success', { email });

      setMessage('Registration successful! Redirecting...');
      
      // Auto login after email/password registration so they don't have to sign in manually
      await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const requestedNext = searchParams.get('next');
      const nextPath = requestedNext && requestedNext.startsWith('/') ? requestedNext : '/dashboard';
      setTimeout(() => router.push(nextPath), 1000);
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-container" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)' }}>
        <h1 className="auth-title">Create Account</h1>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Your Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-input"
              placeholder="e.g. +233203728932"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.4rem' }}>
              Use at least 8 characters with uppercase, lowercase, and a number.
            </p>
          </div>
          <div className="form-group" style={{ marginBottom: '0.8rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              <input
                type="checkbox"
                checked={acceptedPolicies}
                onChange={(e) => setAcceptedPolicies(e.target.checked)}
                required
                style={{ marginTop: '0.2rem' }}
              />
              <span>
                I agree to the <Link href="/terms" style={{ color: 'var(--accent)', fontWeight: 700 }}>Terms and Conditions</Link> and{' '}
                <Link href="/privacy-policy" style={{ color: 'var(--accent)', fontWeight: 700 }}>Privacy Policy</Link>.
              </span>
            </label>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>



        {message && (
          <div className="text-center mt-4" style={{ fontSize: '0.9rem', color: message.includes('success') || message.includes('Registered') || message.includes('exists') ? '#4ade80' : '#f87171' }}>
            {message}
          </div>
        )}
        <div className="auth-footer">
          <p>Already have an account? <Link href="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}
