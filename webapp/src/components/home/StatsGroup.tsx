'use client';

import { motion } from 'framer-motion';

const stats = [
  { label: 'Active Users', value: '1,200+' },
  { label: 'Renewals', value: '500+' },
  { label: 'Delivery Rate', value: '99%' },
];

export function StatsGroup() {
  return (
    <div className="stats-group">
      {stats.map((stat, index) => (
        <motion.div 
          key={stat.label}
          className="stat-item"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <span className="stat-value">{stat.value}</span>
          <span className="stat-label">{stat.label}</span>
          {index < stats.length - 1 && <div className="stat-divider" />}
        </motion.div>
      ))}

      <style jsx>{`
        .stats-group {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 0.75rem 1.25rem;
          background: var(--glass-bg);
          border: 1px dashed var(--border-strong);
          border-radius: 999px;
          width: fit-content;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          position: relative;
        }

        .stat-value {
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--accent);
          letter-spacing: -0.02em;
        }

        .stat-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-divider {
          width: 1px;
          height: 14px;
          background: var(--border);
          margin-left: 1.5rem;
        }

        @media (max-width: 640px) {
          .stats-group {
            flex-wrap: wrap;
            justify-content: center;
            border-radius: 20px;
            gap: 1rem;
          }
          .stat-divider {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
