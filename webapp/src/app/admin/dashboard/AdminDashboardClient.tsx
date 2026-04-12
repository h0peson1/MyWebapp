'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardClient({ initialSubscriptions }: { initialSubscriptions: any[] }) {
  const router = useRouter();
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [accessDetailsMap, setAccessDetailsMap] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<'all' | 'pending' | 'delivered'>('all');

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
    router.refresh();
  };

  const handleDeliver = async (subscriptionId: string) => {
    const details = accessDetailsMap[subscriptionId];
    if (!details) return alert('Please enter access details to deliver.');

    setLoadingIds(prev => ({ ...prev, [subscriptionId]: true }));
    try {
      // NOTE: Because we are using cookie based auth we don't need to pass the x-admin-secret header anymore
      const res = await fetch('/api/admin/delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId, accessDetails: details }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to deliver');
      }
      
      setAccessDetailsMap(prev => ({ ...prev, [subscriptionId]: '' }));
      router.refresh();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoadingIds(prev => ({ ...prev, [subscriptionId]: false }));
    }
  };

  const filteredSubs = initialSubscriptions.filter(sub => {
    const isDelivered = !!sub.accessDetails;
    if (filter === 'pending') return !isDelivered;
    if (filter === 'delivered') return isDelivered;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem', background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <button 
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: filter === 'all' ? 'var(--accent)' : 'transparent', color: filter === 'all' ? '#fff' : 'var(--text-muted)', fontWeight: 600, transition: '0.2s' }}
            onClick={() => setFilter('all')}
          >
            All Subscriptions
          </button>
          <button 
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: filter === 'pending' ? 'rgba(234, 179, 8, 0.2)' : 'transparent', color: filter === 'pending' ? '#eab308' : 'var(--text-muted)', fontWeight: 600, transition: '0.2s' }}
            onClick={() => setFilter('pending')}
          >
            Pending Delivery
          </button>
          <button 
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: filter === 'delivered' ? 'rgba(34, 197, 94, 0.2)' : 'transparent', color: filter === 'delivered' ? '#22c55e' : 'var(--text-muted)', fontWeight: 600, transition: '0.2s' }}
            onClick={() => setFilter('delivered')}
          >
            Delivered
          </button>
        </div>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Secure Logout
        </button>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid-2">
        {filteredSubs.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
            No subscriptions found for the selected filter.
          </div>
        ) : (
          filteredSubs.map(sub => {
            const isDelivered = !!sub.accessDetails;
            
            return (
              <div key={sub.id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: isDelivered ? '#22c55e' : '#eab308' }} />
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{sub.productName}</h3>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '99px', 
                      fontSize: '0.8rem', 
                      fontWeight: 600,
                      background: isDelivered ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                      color: isDelivered ? '#22c55e' : '#eab308',
                      border: `1px solid ${isDelivered ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)'}`
                    }}>
                      {isDelivered ? 'Delivered' : 'Awaiting Delivery'}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    <strong>User:</strong> {sub.user?.email || 'Unknown User'}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    <strong>Plan:</strong> {sub.plan}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <strong>Purchased:</strong> {new Date(sub.startDate).toLocaleDateString()}
                  </p>
                </div>

                {isDelivered ? (
                  <div style={{ background: 'rgba(34, 197, 94, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.1)', fontSize: '0.9rem' }}>
                    <div style={{ color: '#22c55e', fontWeight: 600, marginBottom: '0.5rem' }}>Current Delivery Details:</div>
                    <div style={{ color: 'var(--text-main)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{sub.accessDetails}</div>
                  </div>
                ) : null}

                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                  <label className="form-label">{isDelivered ? 'Update Delivery Details' : 'Assign Delivery Details'}</label>
                  <textarea 
                    className="form-input" 
                    rows={3} 
                    placeholder="E.g., Account: admin@...', 'Invite link: https://...'"
                    value={accessDetailsMap[sub.id] || ''}
                    onChange={(e) => setAccessDetailsMap(prev => ({ ...prev, [sub.id]: e.target.value }))}
                    style={{ resize: 'vertical', marginBottom: '1rem', fontFamily: 'monospace', fontSize: '0.85rem' }}
                  />
                  <button 
                    className="btn btn-primary btn-full" 
                    onClick={() => handleDeliver(sub.id)}
                    disabled={loadingIds[sub.id]}
                  >
                    {loadingIds[sub.id] ? 'Delivering...' : (isDelivered ? 'Update Delivery' : 'Dispatch Access')}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
