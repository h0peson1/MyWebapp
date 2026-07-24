'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type PaymentItem = {
  id: string;
  productId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string | null;
  proofImageUrl: string;
  status: string;
  rejectionReason: string | null;
  createdAt: string | Date;
  user: {
    email: string;
    name: string;
  };
  subscriptionMonths?: number;
  monthlyPrice?: number;
};

export default function AdminPaymentsClient({ initialPayments }: { initialPayments: PaymentItem[] }) {
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const getDisplayStatus = (status: string) => (status === 'error' ? 'pending' : status);
  const getProofHrefCandidates = (proofImageUrl: string) => {
    if (proofImageUrl.startsWith('data:')) {
      return [proofImageUrl];
    }

    if (proofImageUrl.startsWith('http://') || proofImageUrl.startsWith('https://')) {
      return [proofImageUrl];
    }

    const filename = proofImageUrl.split('/').pop();
    const candidates = new Set<string>();

    if (proofImageUrl) {
      candidates.add(proofImageUrl);
    }

    if (filename) {
      candidates.add(`/uploads/payments/${filename}`);
      candidates.add(`/api/payment/proof/${filename}`);
    }

    return Array.from(candidates);
  };

  const updateStatus = async (paymentId: string, action: 'approve' | 'reject') => {
    const rejectionReason = action === 'reject'
      ? window.prompt('Optional rejection reason:') || ''
      : '';

    setProcessingId(paymentId);

    try {
      const res = await fetch('/api/admin/payments/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, action, rejectionReason }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update payment');
      }

      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update payment');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="grid-2">
      {initialPayments.map((payment) => (
        <div key={payment.id} className="card" style={{ gap: '0.8rem' }}>
          {(() => {
            const displayStatus = getDisplayStatus(payment.status);

            return (
              <>
          <div>
            <p style={{ fontWeight: 700, wordBreak: 'break-word' }}>{payment.user.name} ({payment.user.email})</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Product: {payment.productId}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Duration: {payment.subscriptionMonths || 1} Month{(payment.subscriptionMonths || 1) > 1 ? 's' : ''}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Amount: GH₵{(payment.amount / 100).toFixed(2)} {payment.monthlyPrice ? `(GH₵ ${(payment.monthlyPrice / 100).toFixed(2)}/mo)` : ''}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Transaction ID: {payment.transactionId || 'N/A'}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Status: <strong>{displayStatus === 'pending' ? 'PENDING REVIEW' : displayStatus.toUpperCase()}</strong>
            </p>
            {payment.rejectionReason && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>Reason: {payment.rejectionReason}</p>
            )}
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%' }}
            onClick={() => {
              setPreviewError(null);
              setPreviewUrls(getProofHrefCandidates(payment.proofImageUrl));
              setPreviewIndex(0);
            }}
          >
            View Screenshot
          </button>

          {displayStatus === 'pending' && (
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                style={{ flex: '1 1 130px' }}
                disabled={processingId === payment.id}
                onClick={() => updateStatus(payment.id, 'approve')}
              >
                Approve
              </button>
              <button
                className="btn btn-secondary"
                style={{ flex: '1 1 130px' }}
                disabled={processingId === payment.id}
                onClick={() => updateStatus(payment.id, 'reject')}
              >
                Reject
              </button>
            </div>
          )}
              </>
            );
          })()}
        </div>
      ))}

      {initialPayments.length === 0 && (
        <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
          No payment submissions yet.
        </div>
      )}

      {previewUrls.length > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => {
            setPreviewUrls([]);
            setPreviewIndex(0);
            setPreviewError(null);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.72)',
            display: 'grid',
            placeItems: 'center',
            padding: '1rem',
            zIndex: 1000,
          }}
        >
          <div
            className="premium-panel"
            onClick={(event) => event.stopPropagation()}
            style={{
              width: 'min(960px, 96vw)',
              maxHeight: '92vh',
              overflow: 'auto',
              padding: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.8rem', marginBottom: '0.9rem', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0 }}>Screenshot Preview</h3>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%' }}
                onClick={() => {
                  setPreviewUrls([]);
                  setPreviewIndex(0);
                  setPreviewError(null);
                }}
              >
                Close
              </button>
            </div>

            {previewError ? (
              <p style={{ color: '#ef4444' }}>{previewError}</p>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={previewUrls[previewIndex]}
                alt="Payment proof screenshot"
                style={{ width: '100%', height: 'auto', borderRadius: '14px', border: '1px solid var(--border)' }}
                onError={() => {
                  if (previewIndex < previewUrls.length - 1) {
                    setPreviewIndex((current) => current + 1);
                    return;
                  }

                  setPreviewError('Screenshot could not be loaded.');
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
