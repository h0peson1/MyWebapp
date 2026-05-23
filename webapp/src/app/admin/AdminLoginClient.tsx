'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';

export default function AdminLoginClient() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', paddingTop: '1rem', paddingBottom: '1rem' }}>
      <div className="auth-container" style={{ 
        width: '100%',
        maxWidth: '560px',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        backdropFilter: 'blur(32px)',
        boxShadow: '0 20px 80px rgba(0, 0, 0, 0.1)',
        padding: 'clamp(1.25rem, 4.5vw, 3rem)'
      }}>
        <h1 className="auth-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: 'clamp(1.4rem, 5.6vw, 2rem)' }}>
          <Shield size={30} className="text-accent" /> Admin Mode
        </h1>
        
        {error && (
          <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'center', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="form-group mb-8">
            <label className="form-label" htmlFor="password">Master Security Key</label>
            <input 
              className="form-input" 
              type="password" 
              id="password" 
              autoComplete="current-password"
              placeholder="••••••••••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              style={{ padding: '1rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full mt-4" disabled={loading} style={{ padding: '1rem', fontSize: '1rem' }}>
            {loading ? 'Verifying Credentials...' : 'Access Command Center'}
          </button>
        </form>
      </div>
    </div>
  );
}
