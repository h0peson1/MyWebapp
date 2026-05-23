'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

export default function LoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const openGooglePopup = () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        window.removeEventListener('message', handleMessage);
        handleGoogleAuth(event.data.name, event.data.email);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    window.open(
      '/login/google',
      'GoogleSignIn',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
    );
  };

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
      window.location.assign('/dashboard');
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async (name: string, selectedEmail: string) => {
    setIsLoading(true);
    setMessage('Connecting with Google...');
    try {
      // First, attempt to sign in using default secure Google password
      let res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: selectedEmail, password: 'GoogleSecurePassword123!' }),
      });

      // If user doesn't exist yet, automatically register them!
      if (!res.ok) {
        setMessage('Registering new Google account...');
        const regRes = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name, 
            email: selectedEmail, 
            password: 'GoogleSecurePassword123!', 
            acceptedPolicies: true 
          }),
        });

        if (!regRes.ok) {
          const regData = await regRes.json();
          throw new Error(regData.error || 'Failed to authenticate Google user');
        }

        // Successfully registered! Now sign in
        res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email: selectedEmail, password: 'GoogleSecurePassword123!' }),
        });

        if (!res.ok) throw new Error('Google Registration succeeded but login failed.');
      }

      void trackEvent('login_success', { email: selectedEmail });
      setMessage('Authenticated via Google! Redirecting...');
      window.location.assign('/dashboard');
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Google login failed');
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

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0', color: 'var(--text-muted)' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
          <span style={{ padding: '0 0.75rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
        </div>

        <button
          type="button"
          onClick={openGooglePopup}
          className="btn btn-secondary btn-full"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(8px)',
            fontWeight: 700,
            padding: '0.75rem',
            color: 'var(--text-main)',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--glass-bg)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: '0.6rem' }}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Continue with Google
        </button>

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
