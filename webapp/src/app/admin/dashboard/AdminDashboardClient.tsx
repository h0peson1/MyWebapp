'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  ExternalLink, 
  LogOut, 
  Filter, 
  CheckCircle, 
  Clock, 
  List, 
  FileText, 
  AlertTriangle, 
  Check, 
  Play, 
  Send, 
  XCircle,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { formatAmount, resolveProductById } from '@/lib/products';

type PaymentRow = {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string | null;
  proofImageUrl: string;
  status: string;
  rejectionReason: string | null;
  accessDetails: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  user: {
    email: string;
    name: string;
  };
};

export default function AdminDashboardClient({ initialPayments }: { initialPayments: PaymentRow[] }) {
  const router = useRouter();
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const activeRequests = useRef<Set<string>>(new Set());
  const [accessDetailsMap, setAccessDetailsMap] = useState<Record<string, string>>({});
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<'all' | 'submitted' | 'verified' | 'processing' | 'delivered' | 'verification_required'>('all');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
    router.refresh();
  };

  const handleUpdateStatus = async (
    paymentId: string, 
    action: 'verify' | 'start_processing' | 'deliver' | 'require_verification' | 'reject'
  ) => {
    const requestKey = `${paymentId}-${action}`;
    if (activeRequests.current.has(requestKey)) {
      return;
    }
    activeRequests.current.add(requestKey);

    const accessDetails = accessDetailsMap[paymentId] || '';
    const rejectionReason = rejectionReasons[paymentId] || '';

    if (action === 'deliver' && !accessDetails.trim()) {
      alert('Safety Rules: Access Details are required to mark an order as Delivered.');
      activeRequests.current.delete(requestKey);
      return;
    }

    if ((action === 'require_verification' || action === 'reject') && !rejectionReason.trim()) {
      alert('Please specify a rejection or clarification reason.');
      activeRequests.current.delete(requestKey);
      return;
    }

    setLoadingIds(prev => ({ ...prev, [paymentId]: true }));
    try {
      const res = await fetch('/api/admin/payments/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId,
          action,
          accessDetails: action === 'deliver' ? accessDetails : undefined,
          rejectionReason: ['require_verification', 'reject'].includes(action) ? rejectionReason : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update order status');
      }

      // Reset inputs on success
      setAccessDetailsMap(prev => ({ ...prev, [paymentId]: '' }));
      setRejectionReasons(prev => ({ ...prev, [paymentId]: '' }));
      router.refresh();
    } catch (err: unknown) {
      alert(`Error: ${err instanceof Error ? err.message : 'Action failed'}`);
    } finally {
      activeRequests.current.delete(requestKey);
      setLoadingIds(prev => ({ ...prev, [paymentId]: false }));
    }
  };

  // Stats Card Calculations
  const countSubmitted = initialPayments.filter(p => p.status === 'Payment Submitted').length;
  const countVerificationRequired = initialPayments.filter(p => p.status === 'Verification Required').length;
  const countProcessing = initialPayments.filter(p => p.status === 'Processing').length;
  const countDelivered = initialPayments.filter(p => p.status === 'Delivered').length;
  
  const totalRevenue = initialPayments
    .filter(p => p.status === 'Delivered')
    .reduce((sum, p) => sum + p.amount, 0) / 100;

  const countNeedsAction = countSubmitted + countVerificationRequired;

  const filteredPayments = initialPayments.filter(p => {
    if (filter === 'submitted') return p.status === 'Payment Submitted';
    if (filter === 'verified') return p.status === 'Payment Verified';
    if (filter === 'processing') return p.status === 'Processing';
    if (filter === 'delivered') return p.status === 'Delivered';
    if (filter === 'verification_required') return p.status === 'Verification Required';
    return true; // 'all'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
      {/* Admin Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.9rem',
        padding: '1rem 1.1rem',
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        backdropFilter: 'blur(10px)',
        marginBottom: '0.3rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: '1 1 240px', minWidth: 0 }}>
          <div style={{ 
            background: 'var(--accent)', 
            padding: '0.6rem', 
            borderRadius: '12px',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(var(--accent-rgb), 0.3)'
          }}>
            <Shield size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Admin Operations Center</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Unified Order Management & Fulfillment Flow</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end', flex: '1 1 260px' }}>
          <Link 
            href="/" 
            target="_blank" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontSize: '0.9rem', 
              color: 'var(--text-muted)',
              textDecoration: 'none',
              fontWeight: 500,
              whiteSpace: 'nowrap'
            }}
          >
            <ExternalLink size={16} /> View Website
          </Link>
          <button 
            onClick={handleLogout} 
            className="btn btn-secondary" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.58rem 1rem',
              borderRadius: '10px',
              whiteSpace: 'nowrap'
            }}
          >
            <LogOut size={18} /> Secure Logout
          </button>
        </div>
      </header>

      {/* Stats Widgets Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '0.2rem'
      }}>
        {/* Card 1: Pending Verification */}
        <div className="card" style={{ padding: '1.25rem', position: 'relative', borderLeft: '4px solid #eab308' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Verification</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: '#eab308' }}>{countSubmitted}</div>
        </div>

        {/* Card 2: Verification Required */}
        <div className="card" style={{ padding: '1.25rem', position: 'relative', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verification Required</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: '#ef4444' }}>{countVerificationRequired}</div>
        </div>

        {/* Card 3: Processing */}
        <div className="card" style={{ padding: '1.25rem', position: 'relative', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Processing</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: '#3b82f6' }}>{countProcessing}</div>
        </div>

        {/* Card 4: Delivered */}
        <div className="card" style={{ padding: '1.25rem', position: 'relative', borderLeft: '4px solid #22c55e' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delivered</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: '#22c55e' }}>{countDelivered}</div>
        </div>

        {/* Card 5: Revenue */}
        <div className="card" style={{ padding: '1.25rem', position: 'relative', borderLeft: '4px solid #a855f7' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: '#a855f7' }}>GH₵{totalRevenue.toFixed(2)}</div>
        </div>

        {/* Card 6: Needs Action */}
        <div className="card" style={{ padding: '1.25rem', position: 'relative', borderLeft: '4px solid #f97316' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Needs Action</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: '#f97316' }}>{countNeedsAction}</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        background: 'rgba(var(--text-main-rgb), 0.03)',
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 600 }}>
          <Filter size={16} />
          <span>Status Filters:</span>
        </div>
        
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', flex: '1 1 auto', justifyContent: 'flex-start' }}>
          <button 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem', 
              borderRadius: '8px', 
              border: 'none', 
              cursor: 'pointer', 
              background: filter === 'all' ? 'var(--accent)' : 'transparent', 
              color: filter === 'all' ? '#fff' : 'var(--text-muted)', 
              fontWeight: 600, 
              transition: '0.2s',
              fontSize: '0.82rem'
            }}
            onClick={() => setFilter('all')}
          >
            <List size={14} /> All
          </button>
          <button 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem', 
              borderRadius: '8px', 
              border: 'none', 
              cursor: 'pointer', 
              background: filter === 'submitted' ? 'rgba(234, 179, 8, 0.2)' : 'transparent', 
              color: filter === 'submitted' ? '#eab308' : 'var(--text-muted)', 
              fontWeight: 600, 
              transition: '0.2s',
              fontSize: '0.82rem'
            }}
            onClick={() => setFilter('submitted')}
          >
            <Clock size={14} /> Submitted
          </button>
          <button 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem', 
              borderRadius: '8px', 
              border: 'none', 
              cursor: 'pointer', 
              background: filter === 'verified' ? 'rgba(16, 185, 129, 0.2)' : 'transparent', 
              color: filter === 'verified' ? '#10b981' : 'var(--text-muted)', 
              fontWeight: 600, 
              transition: '0.2s',
              fontSize: '0.82rem'
            }}
            onClick={() => setFilter('verified')}
          >
            <Check size={14} /> Verified
          </button>
          <button 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem', 
              borderRadius: '8px', 
              border: 'none', 
              cursor: 'pointer', 
              background: filter === 'processing' ? 'rgba(59, 130, 246, 0.2)' : 'transparent', 
              color: filter === 'processing' ? '#3b82f6' : 'var(--text-muted)', 
              fontWeight: 600, 
              transition: '0.2s',
              fontSize: '0.82rem'
            }}
            onClick={() => setFilter('processing')}
          >
            <Play size={14} /> Processing
          </button>
          <button 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem', 
              borderRadius: '8px', 
              border: 'none', 
              cursor: 'pointer', 
              background: filter === 'delivered' ? 'rgba(34, 197, 94, 0.2)' : 'transparent', 
              color: filter === 'delivered' ? '#22c55e' : 'var(--text-muted)', 
              fontWeight: 600, 
              transition: '0.2s',
              fontSize: '0.82rem'
            }}
            onClick={() => setFilter('delivered')}
          >
            <CheckCircle size={14} /> Delivered
          </button>
          <button 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem', 
              borderRadius: '8px', 
              border: 'none', 
              cursor: 'pointer', 
              background: filter === 'verification_required' ? 'rgba(239, 68, 68, 0.2)' : 'transparent', 
              color: filter === 'verification_required' ? '#ef4444' : 'var(--text-muted)', 
              fontWeight: 600, 
              transition: '0.2s',
              fontSize: '0.82rem'
            }}
            onClick={() => setFilter('verification_required')}
          >
            <AlertTriangle size={14} /> Verification Required
          </button>
        </div>
      </div>

      {/* Unified Orders List */}
      <div className="card" style={{ padding: '1.5rem', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={20} style={{ color: 'var(--accent)' }} /> Consolidated Orders Management
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                <th style={{ padding: '1rem 0.75rem' }}>Order ID</th>
                <th style={{ padding: '1rem 0.75rem' }}>Customer</th>
                <th style={{ padding: '1rem 0.75rem' }}>Product & Plan</th>
                <th style={{ padding: '1rem 0.75rem' }}>Amount</th>
                <th style={{ padding: '1rem 0.75rem' }}>Status</th>
                <th style={{ padding: '1rem 0.75rem' }}>Proof</th>
                <th style={{ padding: '1rem 0.75rem' }}>Submitted At</th>
                <th style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    No orders found for the selected filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(payment => {
                  const orderShortId = payment.id.slice(0, 6).toUpperCase();
                  const resolvedProduct = resolveProductById(payment.productId);
                  const productName = resolvedProduct?.productName || payment.productId;
                  const planName = resolvedProduct?.plan || 'Standard';

                  // Dynamic badge styles
                  let badgeBg = 'rgba(255, 255, 255, 0.05)';
                  let badgeColor = 'var(--text-muted)';
                  let badgeBorder = 'rgba(255, 255, 255, 0.1)';

                  if (payment.status === 'Payment Submitted') {
                    badgeBg = 'rgba(234, 179, 8, 0.1)';
                    badgeColor = '#eab308';
                    badgeBorder = 'rgba(234, 179, 8, 0.2)';
                  } else if (payment.status === 'Payment Verified') {
                    badgeBg = 'rgba(16, 185, 129, 0.1)';
                    badgeColor = '#10b981';
                    badgeBorder = 'rgba(16, 185, 129, 0.2)';
                  } else if (payment.status === 'Processing') {
                    badgeBg = 'rgba(59, 130, 246, 0.1)';
                    badgeColor = '#3b82f6';
                    badgeBorder = 'rgba(59, 130, 246, 0.2)';
                  } else if (payment.status === 'Delivered') {
                    badgeBg = 'rgba(34, 197, 94, 0.1)';
                    badgeColor = '#22c55e';
                    badgeBorder = 'rgba(34, 197, 94, 0.2)';
                  } else if (payment.status === 'Verification Required') {
                    badgeBg = 'rgba(239, 68, 68, 0.1)';
                    badgeColor = '#ef4444';
                    badgeBorder = 'rgba(239, 68, 68, 0.2)';
                  } else if (payment.status === 'rejected') {
                    badgeBg = 'rgba(225, 29, 72, 0.1)';
                    badgeColor = '#e11d48';
                    badgeBorder = 'rgba(225, 29, 72, 0.2)';
                  }

                  return (
                    <tr key={payment.id} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.9rem', transition: 'background 0.2s' }}>
                      <td style={{ padding: '1rem 0.75rem', fontWeight: 700 }}>
                        SS-{orderShortId}
                      </td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600 }}>{payment.user?.name || 'Customer'}</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{payment.user?.email || 'Unknown Email'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>{productName}</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Plan: {planName}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 0.75rem', fontWeight: 600 }}>
                        GH₵{(payment.amount / 100).toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.6rem', 
                          borderRadius: '99px', 
                          fontSize: '0.75rem', 
                          fontWeight: 700,
                          background: badgeBg,
                          color: badgeColor,
                          border: `1px solid ${badgeBorder}`,
                          whiteSpace: 'nowrap'
                        }}>
                          {payment.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        {payment.proofImageUrl ? (
                          <button 
                            onClick={() => setSelectedScreenshot(payment.proofImageUrl)}
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '0.25rem',
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid var(--border)',
                              borderRadius: '6px',
                              padding: '0.35rem 0.6rem',
                              color: 'var(--accent)',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'var(--accent)';
                              e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                              e.currentTarget.style.color = 'var(--accent)';
                            }}
                          >
                            <Eye size={12} /> View Proof
                          </button>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>None</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(payment.createdAt).toLocaleDateString()} {new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                          
                          {/* Payment Submitted Transitions */}
                          {payment.status === 'Payment Submitted' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%', maxWidth: '280px' }}>
                              <button 
                                className="btn btn-primary"
                                style={{ 
                                  padding: '0.4rem 0.75rem', 
                                  fontSize: '0.8rem', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center', 
                                  gap: '0.3rem' 
                                }}
                                onClick={() => handleUpdateStatus(payment.id, 'verify')}
                                disabled={loadingIds[payment.id]}
                              >
                                <Check size={14} /> Verify Payment
                              </button>
                              
                              <div style={{ display: 'flex', gap: '0.3rem' }}>
                                <input 
                                  type="text" 
                                  className="form-input"
                                  placeholder="Action Reason / Details..."
                                  value={rejectionReasons[payment.id] || ''}
                                  onChange={(e) => setRejectionReasons(prev => ({ ...prev, [payment.id]: e.target.value }))}
                                  style={{ padding: '0.3rem 0.5rem', fontSize: '0.78rem', margin: 0 }}
                                />
                                <button 
                                  className="btn btn-secondary"
                                  style={{ 
                                    padding: '0.3rem 0.6rem', 
                                    fontSize: '0.78rem', 
                                    whiteSpace: 'nowrap',
                                    borderColor: 'rgba(239, 68, 68, 0.3)',
                                    color: '#ef4444'
                                  }}
                                  onClick={() => handleUpdateStatus(payment.id, 'require_verification')}
                                  disabled={loadingIds[payment.id]}
                                >
                                  Flag Action
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Payment Verified Transitions */}
                          {payment.status === 'Payment Verified' && (
                            <button 
                              className="btn btn-primary"
                              style={{ 
                                padding: '0.4rem 0.75rem', 
                                fontSize: '0.8rem', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.3rem',
                                background: '#3b82f6'
                              }}
                              onClick={() => handleUpdateStatus(payment.id, 'start_processing')}
                              disabled={loadingIds[payment.id]}
                            >
                              <Play size={14} /> Start Processing
                            </button>
                          )}

                          {/* Processing Transitions */}
                          {payment.status === 'Processing' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%', maxWidth: '280px' }}>
                              <textarea 
                                className="form-input"
                                placeholder="Access credentials / details (REQUIRED)..."
                                rows={2}
                                value={accessDetailsMap[payment.id] || ''}
                                onChange={(e) => setAccessDetailsMap(prev => ({ ...prev, [payment.id]: e.target.value }))}
                                style={{ padding: '0.4rem', fontSize: '0.8rem', resize: 'vertical', margin: 0, fontFamily: 'monospace' }}
                              />
                              <button 
                                className="btn btn-primary"
                                style={{ 
                                  padding: '0.4rem 0.75rem', 
                                  fontSize: '0.8rem', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center', 
                                  gap: '0.3rem',
                                  background: '#22c55e'
                                }}
                                onClick={() => handleUpdateStatus(payment.id, 'deliver')}
                                disabled={loadingIds[payment.id]}
                              >
                                <Send size={14} /> Dispatch & Deliver
                              </button>
                            </div>
                          )}

                          {/* Delivered State Display */}
                          {payment.status === 'Delivered' && (
                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                                <CheckCircle size={14} /> Delivered & Active
                              </span>
                              {payment.accessDetails && (
                                <div style={{ 
                                  background: 'rgba(34, 197, 94, 0.05)', 
                                  border: '1px solid rgba(34, 197, 94, 0.1)', 
                                  padding: '0.4rem 0.6rem', 
                                  borderRadius: '6px', 
                                  fontSize: '0.78rem',
                                  fontFamily: 'monospace',
                                  whiteSpace: 'pre-wrap',
                                  textAlign: 'left',
                                  maxWidth: '220px',
                                  display: 'inline-block'
                                }}>
                                  {payment.accessDetails}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Verification Required Display */}
                          {payment.status === 'Verification Required' && (
                            <div style={{ textAlign: 'right', color: '#ef4444', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                                <AlertTriangle size={14} /> Awaiting Clarification
                              </span>
                              {payment.rejectionReason && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  Reason: {payment.rejectionReason}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Rejected Display */}
                          {payment.status === 'rejected' && (
                            <div style={{ textAlign: 'right', color: '#e11d48', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                                <XCircle size={14} /> Rejected
                              </span>
                              {payment.rejectionReason && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  Reason: {payment.rejectionReason}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screenshot Preview Modal */}
      {selectedScreenshot && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '1.5rem',
            backdropFilter: 'blur(8px)'
          }}
          onClick={() => setSelectedScreenshot(null)}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '90%',
              maxHeight: '90%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              padding: '1rem', 
              borderBottom: '1px solid var(--border)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.02)'
            }}>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>Payment Proof Screenshot</span>
              <button 
                onClick={() => setSelectedScreenshot(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 0.5rem',
                  borderRadius: '6px'
                }}
              >
                &times;
              </button>
            </div>
            <div style={{ overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', background: '#0a0a0c' }}>
              <img 
                src={selectedScreenshot} 
                alt="Payment Proof Screenshot" 
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
