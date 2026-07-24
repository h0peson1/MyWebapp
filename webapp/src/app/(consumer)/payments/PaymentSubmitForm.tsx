'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { parseProductId } from '@/lib/products';
import GoogleIcon from '@/components/icons/GoogleIcon';

type Props = {
  productId: string;
  subscriptionMonths: number;
  totalAmount: number;
};

export default function PaymentSubmitForm({ productId, subscriptionMonths, totalAmount }: Props) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [copied, setCopied] = useState(false);

  // Resolve product info
  const parsed = parseProductId(productId);
  const productName = parsed?.productName || 'Subscription';
  const plan = parsed?.plan || '';
  const packageName = plan 
    ? `${productName} ${plan} (${subscriptionMonths} Month${subscriptionMonths > 1 ? 's' : ''})` 
    : `${productName} (${subscriptionMonths} Month${subscriptionMonths > 1 ? 's' : ''})`;

  // Determine if it is an Apple ecosystem product (Apple Music, Apple TV+, iCloud)
  const isAppleProduct = 
    productName.toLowerCase().includes('apple') || 
    productName.toLowerCase().includes('icloud');

  // Format a friendly Order ID
  const orderId = submittedOrderId ? `SS-${submittedOrderId.slice(0, 6).toUpperCase()}` : 'SS-PENDING';

  // Handle WhatsApp automatic redirect
  useEffect(() => {
    if (status !== 'success' || !isAppleProduct) return;

    if (countdown <= 0) {
      const waText = `Hello StreamSaaS,\n\nOrder ID: ${orderId}\n\nI have submitted my payment for verification and would like to complete my setup.\n\nPackage: ${packageName}\n\nPlease assist me.`;
      window.location.href = `https://wa.me/233203728932?text=${encodeURIComponent(waText)}`;
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [status, countdown, isAppleProduct, orderId, packageName]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setStatus('error');
      setMessage('Please upload a screenshot proof.');
      return;
    }

    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('proof', file);
    formData.append('transactionId', transactionId.trim());
    formData.append('subscriptionMonths', String(subscriptionMonths));

    setStatus('loading');
    setMessage('Submitting payment...');

    try {
      const res = await fetch('/api/payment/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit payment');
      }

      setSubmittedOrderId(data.paymentId);
      setStatus('success');
      setMessage(data.message || 'Payment submitted successfully.');
      setFile(null);
      setTransactionId('');
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Failed to submit payment');
    }
  };

  // SUCCESS STATE RENDER
  if (status === 'success') {
    return (
      <div 
        className="premium-panel" 
        style={{ 
          padding: '2rem 1.5rem', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center', 
          gap: '1.25rem',
          borderRadius: '16px',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          background: 'rgba(16, 185, 129, 0.04)',
        }}
      >
        <div style={{ color: '#10b981', display: 'grid', placeItems: 'center' }}>
          <GoogleIcon name="check_circle" size={54} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Payment Submitted Successfully
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            We have received your payment proof and initiated verification.
          </p>
        </div>

        <div 
          style={{ 
            width: '100%', 
            background: 'var(--bg)', 
            border: '1px solid var(--border)', 
            borderRadius: '12px', 
            padding: '1rem',
            display: 'grid',
            gap: '0.8rem',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Order ID</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.96rem', fontFamily: 'monospace' }}>{orderId}</span>
              <button 
                onClick={copyOrderId} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '0.2rem' }}
                title="Copy Order ID"
              >
                {copied ? <GoogleIcon name="check" size={14} style={{ color: '#10b981' }} /> : <GoogleIcon name="content_copy" size={14} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Package</span>
            <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{packageName}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Status</span>
            <span 
              style={{ 
                background: 'rgba(217, 119, 6, 0.12)', 
                color: '#d97706', 
                padding: '0.2rem 0.6rem', 
                borderRadius: '999px', 
                fontSize: '0.74rem', 
                fontWeight: 700,
                textTransform: 'uppercase'
              }}
            >
              Payment Submitted
            </span>
          </div>
        </div>

        {isAppleProduct ? (
          // APPLE PRODUCT SUCCESS LAYOUT (WHATSAPP REDIRECT)
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '0.4rem', 
                padding: '0.8rem', 
                background: 'var(--accent-soft)', 
                borderRadius: '10px',
                border: '1px solid rgba(220, 106, 31, 0.15)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)' }}>
                <span className="loader" style={{ width: '12px', height: '12px', border: '2px solid var(--accent)', borderBottomColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'rotation 1s linear infinite' }} />
                <span style={{ fontWeight: 700, fontSize: '0.86rem' }}>Redirecting to WhatsApp in {countdown}s...</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                We will request your activation Apple ID on WhatsApp to complete delivery.
              </p>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', background: '#25D366', borderColor: '#25D366' }}
              onClick={() => {
                const waText = `Hello StreamSaaS,\n\nOrder ID: ${orderId}\n\nI have submitted my payment for verification and would like to complete my setup.\n\nPackage: ${packageName}\n\nPlease assist me.`;
                window.location.href = `https://wa.me/233203728932?text=${encodeURIComponent(waText)}`;
              }}
            >
              <GoogleIcon name="chat" size={18} style={{ color: 'white' }} /> Open WhatsApp Now
            </button>
          </div>
        ) : (
          // NON-APPLE PRODUCT SUCCESS LAYOUT (WEBSITE WORKFLOW)
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.4 }}>
              Our team will verify your payment and process your order shortly. You can track this order in your dashboard command center.
            </p>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => router.push('/dashboard')}
            >
              <GoogleIcon name="shield" size={18} /> Track Order <GoogleIcon name="arrow_forward" size={16} />
            </button>
          </div>
        )}

        <style jsx global>{`
          @keyframes rotation {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // STANDARD FORM RENDER
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
      <div className="form-group">
        <label className="form-label" htmlFor="proof">Payment Screenshot</label>
        <input
          id="proof"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
          className="form-input"
          style={{ padding: '0.6rem' }}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="transactionId">Transaction ID (optional)</label>
        <input
          id="transactionId"
          className="form-input"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="e.g. MOMO1234567"
        />
      </div>

      <button className="btn btn-primary" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting...' : 'Submit Payment'}
      </button>

      {status === 'error' && (
        <p style={{ fontSize: '0.9rem', color: '#ef4444' }}>
          {message}
        </p>
      )}
    </form>
  );
}
