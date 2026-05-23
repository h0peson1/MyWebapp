'use client';

import { useState } from 'react';

export default function GoogleSignInPage() {
  const [view, setView] = useState<'chooser' | 'custom'>('chooser');
  const [customEmail, setCustomEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');

  const handleSelectAccount = (name: string, email: string) => {
    if (window.opener) {
      window.opener.postMessage(
        { type: 'GOOGLE_AUTH_SUCCESS', name, email },
        window.location.origin
      );
      window.close();
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) {
      setError('Enter a valid email address');
      return;
    }
    const name = customEmail.split('@')[0];
    handleSelectAccount(name, customEmail.trim());
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#131314',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        color: '#e3e3e3',
        fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
        userSelect: 'none',
      }}
    >
      {/* Central Google Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '450px',
          background: '#1b1b1f',
          border: '1px solid #303134',
          borderRadius: '28px',
          padding: '40px',
          boxSizing: 'border-box',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Google Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <svg viewBox="0 0 24 24" width="32" height="32" style={{ display: 'inline-block' }}>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        </div>

        {/* View 1: Chooser Screen */}
        {view === 'chooser' ? (
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 400,
                color: '#e3e3e3',
                margin: '0 0 8px 0',
                textAlign: 'center',
              }}
            >
              Choose an account
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: '#c4c7c5',
                margin: '0 0 24px 0',
                textAlign: 'center',
              }}
            >
              to continue to <span style={{ color: '#a8b2ff', fontWeight: 600 }}>StreamSaaS</span>
            </p>

            {/* Accounts List */}
            <div
              style={{
                border: '1px solid #444746',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '1.5rem',
              }}
            >
              {/* Account 1 */}
              <div
                onClick={() => handleSelectAccount('Hw055', 'hw055277@gmail.com')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #444746',
                  transition: 'background-color 0.2s',
                }}
                className="google-list-item"
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#6366f1',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    marginRight: '16px',
                  }}
                >
                  H
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#e3e3e3' }}>Hw055</div>
                  <div style={{ fontSize: '12px', color: '#c4c7c5' }}>hw055277@gmail.com</div>
                </div>
              </div>

              {/* Account 2 */}
              <div
                onClick={() => handleSelectAccount('hopeson', 'hopeson@gmail.com')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #444746',
                  transition: 'background-color 0.2s',
                }}
                className="google-list-item"
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#10b981',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    marginRight: '16px',
                  }}
                >
                  H
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#e3e3e3' }}>hopeson</div>
                  <div style={{ fontSize: '12px', color: '#c4c7c5' }}>hopeson@gmail.com</div>
                </div>
              </div>

              {/* Use Another Account Button */}
              <div
                onClick={() => setView('custom')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                className="google-list-item"
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'transparent',
                    border: '1px dashed #c4c7c5',
                    color: '#c4c7c5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px',
                  }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#a8b2ff' }}>
                    Use another account
                  </div>
                </div>
              </div>
            </div>

            {/* Cancel Footer */}
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button
                onClick={() => window.close()}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#c4c7c5',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  outline: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#c4c7c5')}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* View 2: Custom Account Screen */
          <form onSubmit={handleCustomSubmit}>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 400,
                color: '#e3e3e3',
                margin: '0 0 8px 0',
                textAlign: 'center',
              }}
            >
              Sign in
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: '#c4c7c5',
                margin: '0 0 32px 0',
                textAlign: 'center',
              }}
            >
              with your Google Account to continue
            </p>

            {/* Floating Label Input Group */}
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
              <input
                type="email"
                value={customEmail}
                onChange={(e) => {
                  setCustomEmail(e.target.value);
                  setError('');
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={{
                  width: '100%',
                  padding: '16px 14px',
                  background: 'transparent',
                  border: error
                    ? '2px solid #f2b8b5'
                    : isFocused
                    ? '2px solid #8ab4f8'
                    : '1px solid #8e918f',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  fontSize: '16px',
                  color: '#e3e3e3',
                  outline: 'none',
                  transition: 'all 0.15s ease-out',
                }}
                placeholder=""
                autoFocus
              />
              <label
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: customEmail || isFocused ? '0' : '50%',
                  transform: customEmail || isFocused ? 'translateY(-50%) scale(0.75)' : 'translateY(-50%)',
                  transformOrigin: 'top left',
                  background: '#1b1b1f',
                  padding: '0 6px',
                  color: error ? '#f2b8b5' : isFocused ? '#8ab4f8' : '#c4c7c5',
                  fontSize: '16px',
                  pointerEvents: 'none',
                  transition: 'all 0.15s ease-out',
                }}
              >
                Email or phone
              </label>

              {error && (
                <div
                  style={{
                    color: '#f2b8b5',
                    fontSize: '12px',
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  {error}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '2rem',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setView('chooser');
                  setCustomEmail('');
                  setError('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8ab4f8',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0',
                }}
              >
                Back
              </button>

              <button
                type="submit"
                style={{
                  background: '#8ab4f8',
                  color: '#1b1b1f',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '100px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }}
              >
                Next
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Styled class name styles injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        .google-list-item:hover {
          background-color: rgba(255, 255, 255, 0.04) !important;
        }
      ` }} />
    </div>
  );
}
