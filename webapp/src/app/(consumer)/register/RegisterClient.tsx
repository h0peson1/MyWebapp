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
  const [password, setPassword] = useState('');
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGoogleMock, setShowGoogleMock] = useState(false);

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
        body: JSON.stringify({ name, email, password, acceptedPolicies: true }),
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

  const handleGoogleAuth = async (googleName: string, selectedEmail: string) => {
    setShowGoogleMock(false);
    setIsLoading(true);
    setMessage('Connecting with Google...');
    try {
      // Attempt to register first
      let res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: googleName, 
          email: selectedEmail, 
          password: 'GoogleSecurePassword123!', 
          acceptedPolicies: true 
        }),
      });

      // If registration fails because user already exists, just log them in directly!
      if (!res.ok) {
        const data = await res.json();
        if (data.error && (data.error.includes('already exists') || data.error.includes('registered'))) {
          setMessage('Account already exists. Logging you in...');
        } else {
          throw new Error(data.error || 'Failed to register with Google');
        }
      }

      // Automatically sign the user in so they are redirected seamlessly
      const loginRes = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: selectedEmail, password: 'GoogleSecurePassword123!' }),
      });

      if (!loginRes.ok) {
        throw new Error('Google Registration completed, but auto-login failed. Please proceed to login page.');
      }

      await trackEvent('register_success', { email: selectedEmail });
      setMessage('Registered with Google! Redirecting...');
      const requestedNext = searchParams.get('next');
      const nextPath = requestedNext && requestedNext.startsWith('/') ? requestedNext : '/dashboard';
      setTimeout(() => router.push(nextPath), 1000);
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Google authentication failed');
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

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0', color: 'var(--text-muted)' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
          <span style={{ padding: '0 0.75rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
        </div>

        <button
          type="button"
          onClick={() => setShowGoogleMock(true)}
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
          <div className="text-center mt-4" style={{ fontSize: '0.9rem', color: message.includes('success') || message.includes('Registered') || message.includes('exists') ? '#4ade80' : '#f87171' }}>
            {message}
          </div>
        )}
        <div className="auth-footer">
          <p>Already have an account? <Link href="/login">Login here</Link></p>
        </div>
      </div>

      {/* Google Account Selector Overlay Modal (Glassmorphic Space Indigo Theme) */}
      {showGoogleMock && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(5, 5, 8, 0.75)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '1.5rem',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '400px',
            background: 'rgba(20, 20, 28, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
            padding: '2.5rem 2rem',
            color: 'var(--text-main)',
            backdropFilter: 'blur(20px)',
            textAlign: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {/* Google Logo Container */}
            <div style={{ 
              width: '54px', 
              height: '54px', 
              borderRadius: '14px', 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <svg viewBox="0 0 24 24" width="28" height="28">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.4rem', letterSpacing: '-0.02em', color: '#fff' }}>Choose an account</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0 0 2rem' }}>to connect securely to StreamSaaS</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', textAlign: 'left', marginBottom: '1.75rem', background: 'rgba(255,255,255,0.06)', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              
              {/* Account 1 */}
              <button 
                onClick={() => handleGoogleAuth('Hw055', 'hw055277@gmail.com')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  width: '100%',
                  padding: '1rem 1.25rem',
                  background: 'rgba(255, 255, 255, 0.01)',
                  border: 'none',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  outline: 'none',
                  transition: 'background 0.2s',
                  color: 'var(--text-main)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
              >
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #6366f1, #818cf8)', 
                  color: '#fff', 
                  display: 'grid', 
                  placeItems: 'center', 
                  fontWeight: 700, 
                  fontSize: '0.9rem',
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
                }}>H</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>Hw055</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>hw055277@gmail.com</div>
                </div>
              </button>

              {/* Account 2 */}
              <button 
                onClick={() => handleGoogleAuth('hopeson', 'hopeson@gmail.com')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  width: '100%',
                  padding: '1rem 1.25rem',
                  background: 'rgba(255, 255, 255, 0.01)',
                  border: 'none',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  outline: 'none',
                  transition: 'background 0.2s',
                  color: 'var(--text-main)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
              >
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #10b981, #34d399)', 
                  color: '#fff', 
                  display: 'grid', 
                  placeItems: 'center', 
                  fontWeight: 700, 
                  fontSize: '0.9rem',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                }}>H</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>hopeson</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>hopeson@gmail.com</div>
                </div>
              </button>

              {/* Custom Selector option */}
              <div style={{ padding: '1.1rem 1.25rem', background: 'rgba(0, 0, 0, 0.15)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Or use another Google email:</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="email"
                    placeholder="email@gmail.com"
                    id="google-custom-email"
                    style={{
                      flex: 1,
                      padding: '0.55rem 0.75rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      outline: 'none',
                      color: '#fff',
                      transition: 'border-color 0.2s'
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const emailVal = (e.target as HTMLInputElement).value;
                        if (emailVal.trim() && emailVal.includes('@')) {
                          handleGoogleAuth(emailVal.split('@')[0], emailVal.trim());
                        }
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      const input = document.getElementById('google-custom-email') as HTMLInputElement;
                      if (input && input.value.trim() && input.value.includes('@')) {
                        handleGoogleAuth(input.value.split('@')[0], input.value.trim());
                      }
                    }}
                    style={{
                      background: 'var(--accent)',
                      color: '#fff',
                      border: 'none',
                      padding: '0.55rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowGoogleMock(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
