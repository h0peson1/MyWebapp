'use client';

import { useState } from 'react';
import Link from 'next/link';
import GoogleIcon from '@/components/icons/GoogleIcon';
import { formatAmount } from '@/lib/products';
import { MOMO_PAYMENT_CONFIG } from '@/lib/paymentConfig';
import PaymentSubmitForm from '../payments/PaymentSubmitForm';

type Props = {
  productId: string;
  resolvedProduct: {
    productName: string;
    plan: string;
    amount: number; // monthly price in cents/kobo
  };
  initialMonths: number;
};

export default function PaymentCheckoutClient({ productId, resolvedProduct, initialMonths }: Props) {
  const [subscriptionMonths, setSubscriptionMonths] = useState(() => {
    // Validate initialMonths to be between 1 and 12, fallback to 1
    if (isNaN(initialMonths) || initialMonths < 1 || initialMonths > 12) {
      return 1;
    }
    return initialMonths;
  });

  const monthlyAmountLabel = formatAmount(resolvedProduct.amount);
  const totalAmount = resolvedProduct.amount * subscriptionMonths;
  const totalAmountLabel = formatAmount(totalAmount);

  return (
    <div className="container" style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '3rem' }}>
      <section className="premium-panel" style={{ padding: '1.5rem', display: 'grid', gap: '0.55rem' }}>
        <span className="section-kicker"><GoogleIcon name="verified" size={14} /> Secure Manual Payment</span>
        <h1 style={{ fontSize: '1.95rem', lineHeight: 1.2 }}>Complete your subscription payment</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '70ch' }}>
          Follow the payment instructions below, upload your proof, and we will verify your submission.
        </p>
      </section>

      {/* Plan Summary Card */}
      <section className="card" style={{ gap: '0.9rem' }}>
        <h2 className="card-title"><GoogleIcon name="receipt" size={18} /> Plan Summary</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
          <div className="stat-chip">
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Product</p>
            <p style={{ fontSize: '1.06rem', fontWeight: 700 }}>{resolvedProduct.productName} {resolvedProduct.plan}</p>
          </div>

          <div className="stat-chip" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <label htmlFor="duration-select" style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', cursor: 'pointer' }}>
              Duration
            </label>
            <select
              id="duration-select"
              className="form-input"
              value={subscriptionMonths}
              onChange={(e) => setSubscriptionMonths(parseInt(e.target.value, 10))}
              style={{
                padding: '0.15rem 0.4rem',
                fontSize: '1rem',
                fontWeight: 700,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                cursor: 'pointer',
                outline: 'none',
                width: '100%',
                margin: 0
              }}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1} style={{ background: 'var(--bg-elevated)', color: 'var(--text-main)' }}>
                  {i + 1} Month{i > 0 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="stat-chip" style={{ borderColor: 'rgba(22, 163, 74, 0.35)', background: 'rgba(22, 163, 74, 0.08)' }}>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Monthly Price</p>
            <p style={{ fontSize: '1.06rem', fontWeight: 700, color: '#15803d' }}>
              {MOMO_PAYMENT_CONFIG.currency} {monthlyAmountLabel} / mo
            </p>
          </div>
        </div>

        {/* Dynamic Price Calculation display */}
        <div style={{ 
          marginTop: '0.5rem', 
          padding: '0.9rem 1.1rem', 
          background: 'var(--accent-soft)', 
          borderRadius: '12px',
          border: '1px solid rgba(99, 102, 241, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.8rem'
        }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Selected Duration</p>
            <p style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{subscriptionMonths} Month{subscriptionMonths > 1 ? 's' : ''}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Total Due</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)', margin: 0 }}>
              {MOMO_PAYMENT_CONFIG.currency} {totalAmountLabel}
            </p>
          </div>
        </div>
      </section>

      {/* Payment Instructions Card */}
      <section className="card" style={{ gap: '0.8rem' }}>
        <h2 className="card-title"><GoogleIcon name="smartphone" size={18} /> Payment Instructions</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.93rem' }}>Send payment to:</p>
        <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          <div className="stat-chip">
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Provider</p>
            <p style={{ fontSize: '1.05rem', fontWeight: 700 }}>{MOMO_PAYMENT_CONFIG.provider}</p>
          </div>
          <div className="stat-chip">
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>MoMo Number</p>
            <p style={{ fontSize: '1.05rem', fontWeight: 700 }}>{MOMO_PAYMENT_CONFIG.number}</p>
          </div>
          <div className="stat-chip">
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Account Name</p>
            <p style={{ fontSize: '1.05rem', fontWeight: 700 }}>{MOMO_PAYMENT_CONFIG.accountName}</p>
          </div>
          <div className="stat-chip" style={{ borderColor: 'rgba(220, 106, 31, 0.35)' }}>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount to Pay</p>
            <p style={{ fontSize: '1.08rem', fontWeight: 800 }}>{MOMO_PAYMENT_CONFIG.currency} {totalAmountLabel}</p>
          </div>
        </div>
      </section>

      {/* Proof Upload Card */}
      <section className="card" style={{ gap: '0.85rem' }}>
        <h2 className="card-title"><GoogleIcon name="cloud_upload" size={18} /> Upload Proof</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.93rem' }}>
          Upload an image screenshot only. Transaction ID is optional.
        </p>
        <PaymentSubmitForm 
          productId={productId} 
          subscriptionMonths={subscriptionMonths} 
          totalAmount={totalAmount} 
        />
      </section>

      <section className="card" style={{ gap: '0.75rem' }}>
        <h2 className="card-title"><GoogleIcon name="monetization_on" size={18} /> Submission Status</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          After submission: <strong>Payment submitted successfully. Your access will be activated after verification.</strong>
        </p>
      </section>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', textAlign: 'center' }}>
        Need another plan? <Link href="/pricing" style={{ color: 'var(--accent)', fontWeight: 700 }}>Back to pricing</Link>
      </p>
    </div>
  );
}
