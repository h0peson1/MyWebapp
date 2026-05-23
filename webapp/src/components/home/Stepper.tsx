'use client';

import { motion } from 'framer-motion';
import { Search, CreditCard, Upload, Rocket } from 'lucide-react';
import { MoMoIcon } from '../icons/BrandIcons';

const steps = [
  {
    title: 'Choose Subscription',
    body: 'Select Netflix, Apple Music, or Snapchat+.',
    icon: <Search size={22} />,
  },
  {
    title: 'Secure Payment',
    body: 'Pay via Mobile Money (MoMo) instantly.',
    icon: <MoMoIcon />,
  },
  {
    title: 'Upload Proof',
    body: 'Snap a screenshot of your MoMo receipt.',
    icon: <Upload size={22} />,
  },
  {
    title: 'Instant Access',
    body: 'Get your account details in minutes.',
    icon: <Rocket size={22} />,
  },
];

export function Stepper() {
  return (
    <div className="stepper-container">
      {/* Desktop Version */}
      <div className="stepper-horizontal">
        {steps.map((step, index) => (
          <div key={step.title} className="step-wrapper">
            <motion.div
              className="step-circle"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {step.icon}
              <div className="step-number">{index + 1}</div>
            </motion.div>
            
            <div className="step-info text-center">
              <h4 className="step-title">{step.title}</h4>
              <p className="step-body">{step.body}</p>
            </div>

            {index < steps.length - 1 && (
              <div className="step-line-horizontal" />
            )}
          </div>
        ))}
      </div>

      {/* Mobile Version */}
      <div className="stepper-vertical">
        {steps.map((step, index) => (
          <div key={step.title} className="step-wrapper-v">
            <div className="step-left">
              <motion.div
                className="step-circle"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {step.icon}
              </motion.div>
              {index < steps.length - 1 && (
                <div className="step-line-vertical" />
              )}
            </div>
            
            <div className="step-info">
              <span className="step-number-v">Step {index + 1}</span>
              <h4 className="step-title">{step.title}</h4>
              <p className="step-body">{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .stepper-container {
          width: 100%;
          padding: 2rem 0;
        }

        /* Horizontal Layout */
        .stepper-horizontal {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .step-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .step-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--bg-card);
          border: 2px solid var(--border-strong);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          position: relative;
          z-index: 2;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
        }

        .step-number {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 20px;
          height: 20px;
          background: var(--accent);
          color: white;
          border-radius: 50%;
          font-size: 10px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg);
        }

        .step-line-horizontal {
          position: absolute;
          top: 28px;
          left: calc(50% + 28px);
          width: calc(100% - 56px);
          height: 2px;
          background: repeating-linear-gradient(
            to right,
            var(--border-strong),
            var(--border-strong) 4px,
            transparent 4px,
            transparent 8px
          );
          z-index: 1;
        }

        .step-title {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.4rem;
          color: var(--text-main);
        }

        .step-body {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        /* Vertical Layout */
        .stepper-vertical {
          display: none;
          flex-direction: column;
          gap: 1.5rem;
        }

        .step-wrapper-v {
          display: flex;
          gap: 1.25rem;
        }

        .step-left {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .step-line-vertical {
          flex: 1;
          width: 2px;
          background: repeating-linear-gradient(
            to bottom,
            var(--border-strong),
            var(--border-strong) 4px,
            transparent 4px,
            transparent 8px
          );
          margin-top: 0.5rem;
        }

        .step-number-v {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 0.2rem;
        }

        @media (max-width: 900px) {
          .stepper-horizontal {
            display: none;
          }
          .stepper-vertical {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
}
