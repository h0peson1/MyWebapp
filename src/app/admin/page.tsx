'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="auth-container" style={{ 
        width: '100%',
        border: '1px solid rgba(59, 130, 246, 0.3)', 
        boxShadow: '0 0 40px rgba(59, 130, 246, 0.1)',
        backdropFilter: 'blur(20px)',
        background: 'rgba(24, 24, 27, 0.8)'
      }}>
        <h2 className="auth-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--accent)' }}>✦</span> Admin Control Panel
        </h2>
        
        {error && (
          <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Master Password</label>
            <input 
              className="form-input" 
              type="password" 
              id="password" 
              placeholder="Enter your top-secret key..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              style={{ background: 'rgba(9, 9, 11, 0.8)' }}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full mt-4" disabled={loading}>
            {loading ? 'Authenticating securely...' : 'Enter System'}
          </button>
        </form>
      </div>
    </div>
  );
}
