'use client';

import { motion } from 'framer-motion';
import GoogleIcon from '../icons/GoogleIcon';
import { NetflixIcon, AppleMusicIcon } from '../icons/BrandIcons';

export function DashboardMockup() {
  return (
    <div className="dashboard-mockup-wrapper">
      <motion.div 
        className="mockup-window"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {/* Window Chrome Header */}
        <div className="mockup-chrome">
          <div className="traffic-dots">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <div className="mockup-window-title">
            <GoogleIcon name="lock" size={12} /> app.streamsaas.live/dashboard
          </div>
          <div className="mockup-user-pill">
            <span className="status-live-dot" />
            <span>Kwame A.</span>
          </div>
        </div>

        {/* Dashboard Body Preview */}
        <div className="mockup-body">
          <div className="mockup-top-row">
            <div>
              <p className="greeting-label">Welcome back,</p>
              <h4 className="greeting-name">Active Subscriptions</h4>
            </div>
            <div className="mockup-sync-badge">
              <GoogleIcon name="verified_user" size={13} />
              <span>Verified Account</span>
            </div>
          </div>

          {/* Subscription Item 1 */}
          <div className="mockup-sub-item">
            <div className="sub-logo-box">
              <NetflixIcon size={24} />
            </div>
            <div className="sub-info">
              <div className="sub-title-row">
                <span className="sub-name">Netflix Premium (4K)</span>
                <span className="sub-badge active">Active</span>
              </div>
              <p className="sub-meta">Expires in 28 days • 4 Screens</p>
              <div className="sub-progress-bar">
                <div className="sub-progress-fill" style={{ width: '74%' }} />
              </div>
            </div>
          </div>

          {/* Subscription Item 2 */}
          <div className="mockup-sub-item">
            <div className="sub-logo-box">
              <AppleMusicIcon size={24} />
            </div>
            <div className="sub-info">
              <div className="sub-title-row">
                <span className="sub-name">Apple Music</span>
                <span className="sub-badge active">Active</span>
              </div>
              <p className="sub-meta">Expires in 16 days • Lossless Audio</p>
              <div className="sub-progress-bar">
                <div className="sub-progress-fill accent-fill" style={{ width: '52%' }} />
              </div>
            </div>
          </div>

          {/* Bottom Security Banner */}
          <div className="mockup-sec-note">
            <GoogleIcon name="shield" size={14} style={{ color: 'var(--accent)' }} />
            <span>Private delivery credentials managed securely</span>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .dashboard-mockup-wrapper {
          width: 100%;
          max-width: 440px;
          margin: 0 auto;
        }

        .mockup-window {
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          border-radius: 18px;
          box-shadow: 0 20px 45px rgba(11, 37, 44, 0.12), 0 0 0 1px rgba(24, 183, 190, 0.25);
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .mockup-window:hover {
          transform: translateY(-4px);
        }

        .mockup-chrome {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 0.9rem;
          background: var(--bg-elevated);
          border-bottom: 1px solid var(--border);
        }

        .traffic-dots {
          display: flex;
          gap: 5px;
        }

        .dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }

        .dot.red { background: #ef4444; }
        .dot.yellow { background: #f59e0b; }
        .dot.green { background: #10b981; }

        .mockup-window-title {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .mockup-user-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .status-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
        }

        .mockup-body {
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .mockup-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .greeting-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.1rem;
        }

        .greeting-name {
          font-size: 0.98rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0;
        }

        .mockup-sync-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          font-weight: 700;
          color: #178CA4;
          background: rgba(23, 140, 164, 0.12);
          padding: 0.25rem 0.55rem;
          border-radius: 999px;
          border: 1px solid rgba(23, 140, 164, 0.25);
        }

        [data-theme='dark'] .mockup-sync-badge {
          color: #18B7BE;
          background: rgba(24, 183, 190, 0.15);
          border-color: rgba(24, 183, 190, 0.3);
        }

        .mockup-sub-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg-elevated);
          padding: 0.75rem;
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .sub-logo-box {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .sub-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .sub-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sub-name {
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .sub-badge {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          padding: 0.15rem 0.45rem;
          border-radius: 6px;
        }

        .sub-badge.active {
          background: rgba(23, 140, 164, 0.14);
          color: #178CA4;
        }

        [data-theme='dark'] .sub-badge.active {
          background: rgba(24, 183, 190, 0.2);
          color: #18B7BE;
        }

        .sub-meta {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin: 0;
        }

        .sub-progress-bar {
          width: 100%;
          height: 4px;
          background: var(--border);
          border-radius: 999px;
          overflow: hidden;
          margin-top: 0.2rem;
        }

        .sub-progress-fill {
          height: 100%;
          background: #178CA4;
          border-radius: 999px;
        }

        .sub-progress-fill.accent-fill {
          background: #18B7BE;
        }

        .mockup-sec-note {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.73rem;
          color: var(--text-muted);
          padding-top: 0.35rem;
          border-top: 1px dashed var(--border);
        }
      `}</style>
    </div>
  );
}
