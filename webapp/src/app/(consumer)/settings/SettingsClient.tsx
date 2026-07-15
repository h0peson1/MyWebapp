'use client';

import { useState } from "react";
import GoogleIcon from "@/components/icons/GoogleIcon";
import FadeUp from "@/components/motion/FadeUp";
import { useAuth } from "@/components/AuthContext";

interface SettingsClientProps {
  initialUser: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function SettingsClient({ initialUser }: SettingsClientProps) {
  const { checkAuth } = useAuth();
  const [name, setName] = useState(initialUser.name);
  const [phone, setPhone] = useState(initialUser.phone || '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");
  const [timezone, setTimezone] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('pref-timezone') || 'UTC' : 'UTC'
  );
  const [marketingEmails, setMarketingEmails] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('pref-marketing') === 'true' : false
  );
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [passwordMessage, setPasswordMessage] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === initialUser.name && phone.trim() === (initialUser.phone || '') && status !== 'success') return; // No change

    setStatus('loading');
    setMessage("");

    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setStatus('success');
      setMessage("Profile updated successfully!");
      localStorage.setItem('pref-timezone', timezone);
      localStorage.setItem('pref-marketing', String(marketingEmails));
      // Refresh AuthContext
      await checkAuth();

      // Reset success message after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage("");
      }, 3000);

    } catch (err: unknown) {
      console.error(err);
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus('loading');
    setPasswordMessage('');

    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setPasswordStatus('success');
      setPasswordMessage('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: unknown) {
      setPasswordStatus('error');
      setPasswordMessage(err instanceof Error ? err.message : 'Failed to change password');
    }
  };

  return (
    <FadeUp delay={0.1}>
      <div className="card" style={{ padding: '2.5rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(12px)', transition: 'all 0.3s' }}>
        <h3 className="mb-8" style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', color: 'var(--text-main)' }}>Profile Information</h3>
        
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GoogleIcon name="person" size={16} /> Display Name
            </label>
            <input 
              type="text" 
              className="form-input" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              minLength={2}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GoogleIcon name="phone" size={16} /> Phone Number
            </label>
            <input 
              type="tel" 
              className="form-input" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +233203728932"
              required
              minLength={9}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GoogleIcon name="mail" size={16} /> Email Address (Read-only)
            </label>
            <div style={{ padding: '0.8rem 1rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px dashed var(--border)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {initialUser.email}
              <span style={{ marginLeft: 'auto', fontSize: '0.7rem', background: 'var(--border)', color: 'var(--text-muted)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>VERIFIED</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GoogleIcon name="shield" size={16} /> Password Management
            </label>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Set your timezone and notification preferences below.</p>
          </div>

          <div className="form-group">
            <label className="form-label">Timezone</label>
            <select
              className="form-input"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option value="UTC">UTC</option>
              <option value="WAT">WAT</option>
              <option value="EST">EST</option>
              <option value="PST">PST</option>
            </select>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <input
              id="marketing-emails"
              type="checkbox"
              checked={marketingEmails}
              onChange={(e) => setMarketingEmails(e.target.checked)}
            />
            <label htmlFor="marketing-emails" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Receive product updates and onboarding tips by email
            </label>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button 
              type="submit" 
              className={`btn btn-primary ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={status === 'loading' || (name.trim() === initialUser.name && phone.trim() === (initialUser.phone || ''))}
              style={{ width: '100%', padding: '1rem' }}
            >
              {status === 'loading' ? (
                <>
                  <GoogleIcon name="sync" size={18} className="animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <GoogleIcon name="save" size={18} /> Save Changes
                </>
              )}
            </button>
          </div>

          {status === 'success' && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GoogleIcon name="check_circle" size={18} /> {message}
            </div>
          )}

          {status === 'error' && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GoogleIcon name="error" size={18} /> {message}
            </div>
          )}
        </form>

        <form onSubmit={handlePasswordChange} style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <h4 style={{ marginBottom: '1rem' }}>Change Password</h4>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
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
          <button type="submit" className="btn btn-secondary" disabled={passwordStatus === 'loading'}>
            {passwordStatus === 'loading' ? 'Updating Password...' : 'Update Password'}
          </button>
          {passwordStatus === 'success' && (
            <p style={{ color: '#10b981', marginTop: '0.8rem', fontSize: '0.85rem' }}>{passwordMessage}</p>
          )}
          {passwordStatus === 'error' && (
            <p style={{ color: '#ef4444', marginTop: '0.8rem', fontSize: '0.85rem' }}>{passwordMessage}</p>
          )}
        </form>
      </div>
    </FadeUp>
  );
}
