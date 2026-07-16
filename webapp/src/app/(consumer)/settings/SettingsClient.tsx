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
  const { checkAuth, logout } = useAuth();
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState("");
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [deleteMessage, setDeleteMessage] = useState("");

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

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmDeleteText.trim().toUpperCase() !== 'DELETE') return;

    setDeleteStatus('loading');
    setDeleteMessage('');

    try {
      const res = await fetch('/api/user/delete', {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      setDeleteStatus('idle');
      setShowDeleteModal(false);
      await logout();
    } catch (err: unknown) {
      setDeleteStatus('error');
      setDeleteMessage(err instanceof Error ? err.message : 'An error occurred while deleting your account.');
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

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <h4 style={{ color: '#ef4444', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GoogleIcon name="warning" size={18} /> Danger Zone
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Permanently delete your account and all associated subscriptions and payment records. This action cannot be undone.
          </p>
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={() => {
              setShowDeleteModal(true);
              setConfirmDeleteText("");
              setDeleteMessage("");
              setDeleteStatus("idle");
            }}
          >
            <GoogleIcon name="delete" size={16} /> Delete Account
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.5rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <GoogleIcon name="warning" size={24} /> Delete Account?
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
              Are you absolutely sure you want to delete your account? This action is <strong>permanent</strong> and will delete:
            </p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>Your profile details (Name, Phone, Email)</li>
              <li>All active and historical subscriptions</li>
              <li>All payment receipts and transaction records</li>
            </ul>
            
            <form onSubmit={handleDeleteAccount} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  To confirm, type <span style={{ color: '#ef4444', fontWeight: 700 }}>DELETE</span> below:
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Type DELETE"
                  value={confirmDeleteText}
                  onChange={(e) => setConfirmDeleteText(e.target.value)}
                  required
                  style={{ borderColor: confirmDeleteText.trim().toUpperCase() === 'DELETE' ? '#ef4444' : 'var(--border)' }}
                />
              </div>

              {deleteStatus === 'error' && (
                <div style={{ padding: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '0.85rem' }}>
                  {deleteMessage}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  style={{ flex: 1, padding: '0.8rem' }}
                  disabled={deleteStatus === 'loading'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-danger"
                  style={{ flex: 1, padding: '0.8rem' }}
                  disabled={confirmDeleteText.trim().toUpperCase() !== 'DELETE' || deleteStatus === 'loading'}
                >
                  {deleteStatus === 'loading' ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </FadeUp>
  );
}
