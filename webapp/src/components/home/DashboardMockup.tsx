'use client';

import { motion } from 'framer-motion';
import GoogleIcon from '../icons/GoogleIcon';

export function DashboardMockup() {
  return (
    <div className="dashboard-mockup-container">
      <motion.div 
        className="mockup-card"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="mockup-header">
          <div className="mockup-user">
            <div className="mockup-avatar">
              <GoogleIcon name="person" size={14} />
            </div>
            <span>j***@gmail.com</span>
          </div>
          <div className="mockup-badge active">
            <div className="pulse-dot" />
            Active
          </div>
        </div>

        <div className="mockup-content">
          <div className="mockup-stat">
            <GoogleIcon name="calendar_today" size={14} className="text-muted" />
            <div className="stat-info">
              <span className="stat-label">Expires in</span>
              <span className="stat-value">32 Days</span>
            </div>
          </div>
          <div className="mockup-stat">
            <GoogleIcon name="check_circle" size={14} className="text-muted" />
            <div className="stat-info">
              <span className="stat-label">Status</span>
              <span className="stat-value">Premium Verified</span>
            </div>
          </div>
        </div>

        <div className="mockup-footer">
          <div className="mockup-progress-bg">
            <motion.div 
              className="mockup-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
          </div>
        </div>

        {/* Blurred decorative element */}
        <div className="mockup-glow" />
      </motion.div>

      <style jsx>{`
        .dashboard-mockup-container {
          position: relative;
          width: 100%;
          max-width: 320px;
          perspective: 1000px;
        }

        .mockup-card {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 1.25rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
          transform: rotateY(-5deg) rotateX(5deg);
          position: relative;
          z-index: 2;
          overflow: hidden;
        }

        .mockup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .mockup-user {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .mockup-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--accent-soft);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mockup-badge {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.6rem;
          border-radius: 99px;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .mockup-badge.active {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }

        .mockup-content {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-bottom: 1.2rem;
        }

        .mockup-stat {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .stat-value {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .mockup-footer {
          margin-top: auto;
        }

        .mockup-progress-bg {
          width: 100%;
          height: 6px;
          background: var(--border);
          border-radius: 99px;
          overflow: hidden;
        }

        .mockup-progress-fill {
          height: 100%;
          background: linear-gradient(to right, var(--accent), #f28e2d);
          border-radius: 99px;
        }

        .mockup-glow {
          position: absolute;
          top: -20%;
          right: -20%;
          width: 100px;
          height: 100px;
          background: var(--accent);
          filter: blur(50px);
          opacity: 0.15;
          z-index: -1;
        }

        .text-muted {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
