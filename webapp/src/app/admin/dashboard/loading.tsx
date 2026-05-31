import { Shield } from 'lucide-react';

export default function AdminDashboardLoading() {
  return (
    <div className="container" style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.25; }
        }
      `}} />

      {/* Admin Header Skeleton */}
      <div style={{ 
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
        marginBottom: '1.4rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: '1 1 240px' }}>
          <div style={{ 
            background: 'var(--accent)', 
            padding: '0.6rem', 
            borderRadius: '12px',
            color: '#fff',
            opacity: 0.6,
            animation: 'pulse 1.5s infinite ease-in-out'
          }}>
            <Shield size={24} />
          </div>
          <div>
            <div style={{ background: 'var(--border)', height: '1.25rem', width: '220px', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            <div style={{ background: 'var(--border)', height: '0.8rem', width: '160px', borderRadius: '4px', marginTop: '0.4rem', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
          </div>
        </div>
      </div>

      {/* Stats Widgets Grid Skeleton */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '1.4rem'
      }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--border)', height: '90px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ background: 'var(--border)', height: '0.78rem', width: '70%', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
            <div style={{ background: 'var(--border)', height: '1.75rem', width: '40%', borderRadius: '4px', marginTop: '0.5rem', animation: 'pulse 1.5s infinite ease-in-out' }} />
          </div>
        ))}
      </div>

      {/* Unified Orders List Table Skeleton */}
      <div className="card" style={{ padding: '1.5rem', height: '400px' }}>
        <div style={{ background: 'var(--border)', height: '1.25rem', width: '260px', borderRadius: '4px', marginBottom: '1.5rem', animation: 'pulse 1.5s infinite ease-in-out' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.1rem 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ background: 'var(--border)', height: '1rem', width: '15%', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
              <div style={{ background: 'var(--border)', height: '1rem', width: '25%', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
              <div style={{ background: 'var(--border)', height: '1rem', width: '15%', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
              <div style={{ background: 'var(--border)', height: '1rem', width: '10%', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
