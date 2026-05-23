'use client';

import { motion } from 'framer-motion';
import { NetflixIcon, AppleIcon, SnapchatIcon } from '../icons/BrandIcons';
import { Share2, Music, Video, Tv } from 'lucide-react';

const services = [
  { id: 'netflix', name: 'Netflix', icon: <NetflixIcon /> },
  { id: 'apple', name: 'Apple Music', icon: <AppleIcon /> },
  { id: 'snapchat', name: 'Snapchat+', icon: <SnapchatIcon /> },
  { id: 'prime', name: 'Prime Video', icon: <Video size={24} /> },
  { id: 'dstv', name: 'DSTV', icon: <Tv size={24} /> },
  { id: 'custom', name: 'Other Services', icon: <Share2 size={24} /> },
];

export function ServiceSelector() {
  return (
    <div className="service-selector">
      <h3 className="selector-title">Select Your Service</h3>
      <div className="service-grid">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            className="service-card"
            whileHover={{ scale: 1.05, borderColor: 'var(--dashboard-blue)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="service-icon-wrapper">
              {service.icon}
            </div>
            <span className="service-name">{service.name}</span>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .service-selector {
          margin-top: 2rem;
          width: 100%;
          max-width: 500px;
        }

        .selector-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
          text-align: center;
        }

        .service-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .service-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }

        .service-card:hover {
          background: var(--bg-card-hover);
        }

        .service-icon-wrapper {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .placeholder-icon {
          width: 32px;
          height: 32px;
          background: var(--accent-soft);
          color: var(--accent);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }

        .service-name {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-main);
          text-align: center;
        }

        @media (max-width: 480px) {
          .service-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
