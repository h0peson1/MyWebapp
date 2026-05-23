import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { BadgeCheck, CircleDollarSign, ReceiptText, Smartphone, UploadCloud } from 'lucide-react';
import { formatAmount, resolveProductById } from '@/lib/products';
import { MOMO_PAYMENT_CONFIG } from '@/lib/paymentConfig';
import { verifyToken } from '@/lib/auth';
import PaymentSubmitForm from '../payments/PaymentSubmitForm';

export const metadata = {
  title: 'Payment',
  description: 'Submit payment proof for your chosen StreamSaaS plan.',
  robots: {
    index: false,
    follow: false,
  },
};

type SearchParams = {
  productId?: string;
};

export default async function PaymentPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const productId = resolvedSearchParams.productId;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!productId) {
    redirect('/pricing');
  }

  const session = token ? await verifyToken(token) : null;
  if (!session?.userId) {
    redirect(`/register?next=${encodeURIComponent(`/payment?productId=${productId}`)}`);
  }

  const resolved = resolveProductById(productId);
  if (!resolved) {
    redirect('/pricing');
  }

  const amountLabel = formatAmount(resolved.amount);

  return (
    <div className="container" style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '3rem' }}>
      <section className="premium-panel" style={{ padding: '1.5rem', display: 'grid', gap: '0.55rem' }}>
        <span className="section-kicker"><BadgeCheck size={14} /> Secure Manual Payment</span>
        <h1 style={{ fontSize: '1.95rem', lineHeight: 1.2 }}>Complete your subscription payment</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '70ch' }}>
          Follow the payment instructions below, upload your proof, and we will verify your submission.
        </p>
      </section>

      <section className="card" style={{ gap: '0.9rem' }}>
        <h2 className="card-title"><ReceiptText size={18} /> Plan Summary</h2>
        <div className="grid-3" style={{ gap: '0.8rem' }}>
          <div className="stat-chip">
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Product</p>
            <p style={{ fontSize: '1.06rem', fontWeight: 700 }}>{resolved.productName}</p>
          </div>
          <div className="stat-chip">
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duration</p>
            <p style={{ fontSize: '1.06rem', fontWeight: 700 }}>30 Days</p>
          </div>
          <div className="stat-chip" style={{ borderColor: 'rgba(22, 163, 74, 0.35)', background: 'rgba(22, 163, 74, 0.08)' }}>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Price</p>
            <p style={{ fontSize: '1.14rem', fontWeight: 800, color: '#15803d' }}>{MOMO_PAYMENT_CONFIG.currency} {amountLabel}</p>
          </div>
        </div>
      </section>

      <section className="card" style={{ gap: '0.8rem' }}>
        <h2 className="card-title"><Smartphone size={18} /> Payment Instructions</h2>
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
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount</p>
            <p style={{ fontSize: '1.08rem', fontWeight: 800 }}>{MOMO_PAYMENT_CONFIG.currency} {amountLabel}</p>
          </div>
        </div>
      </section>

      <section className="card" style={{ gap: '0.85rem' }}>
        <h2 className="card-title"><UploadCloud size={18} /> Upload Proof</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.93rem' }}>
          Upload an image screenshot only. Transaction ID is optional.
        </p>
        <PaymentSubmitForm productId={productId} />
      </section>

      <section className="card" style={{ gap: '0.75rem' }}>
        <h2 className="card-title"><CircleDollarSign size={18} /> Submission Status</h2>
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
