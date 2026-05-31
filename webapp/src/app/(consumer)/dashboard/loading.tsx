import { ShieldCheck, Zap, Clock } from "lucide-react";

export default function CustomerDashboardLoading() {
  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.25; }
        }
      `}} />

      {/* Premium Panel Skeleton */}
      <section className="premium-panel" style={{ padding: '1.5rem', animation: 'pulse 1.5s infinite ease-in-out' }}>
        <span className="section-kicker" style={{ opacity: 0.7 }}><ShieldCheck size={14} /> Account Command Center</span>
        <div style={{ background: 'var(--border)', height: '2.25rem', width: '320px', borderRadius: '6px', margin: '0.8rem 0 0.45rem' }} />
        <div style={{ background: 'var(--border)', height: '1rem', width: '480px', borderRadius: '4px' }} />
      </section>

      {/* Grid-3 Stats Cards Skeleton */}
      <div className="grid-3">
        <article className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--accent-soft)', color: 'var(--accent)', borderRadius: '10px', display: 'grid', placeItems: 'center', opacity: 0.6, animation: 'pulse 1.5s infinite ease-in-out' }}>
              <Zap size={24} />
            </div>
            <div style={{ background: 'var(--border)', height: '1.2rem', width: '90px', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
          </div>
          <div style={{ background: 'var(--border)', height: '2rem', width: '50px', borderRadius: '4px', marginTop: '1rem', animation: 'pulse 1.5s infinite ease-in-out' }} />
        </article>

        <article className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', borderRadius: '10px', display: 'grid', placeItems: 'center', opacity: 0.6, animation: 'pulse 1.5s infinite ease-in-out' }}>
              <Clock size={24} />
            </div>
            <div style={{ background: 'var(--border)', height: '1.2rem', width: '90px', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
          </div>
          <div style={{ background: 'var(--border)', height: '2rem', width: '50px', borderRadius: '4px', marginTop: '1rem', animation: 'pulse 1.5s infinite ease-in-out' }} />
        </article>

        <article className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', borderRadius: '10px', display: 'grid', placeItems: 'center', opacity: 0.6, animation: 'pulse 1.5s infinite ease-in-out' }}>
              <ShieldCheck size={24} />
            </div>
            <div style={{ background: 'var(--border)', height: '1.2rem', width: '110px', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
          </div>
          <div style={{ background: 'var(--border)', height: '1.5rem', width: '100px', borderRadius: '4px', marginTop: '1rem', animation: 'pulse 1.5s infinite ease-in-out' }} />
        </article>
      </div>

      {/* Recent Submissions Skeleton */}
      <section className="card" style={{ padding: '1.75rem' }}>
        <div style={{ background: 'var(--border)', height: '1.5rem', width: '240px', borderRadius: '4px', marginBottom: '1.25rem', animation: 'pulse 1.5s infinite ease-in-out' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {[1, 2].map(i => (
            <div key={i} style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '0.75rem 0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '50%' }}>
                <div style={{ background: 'var(--border)', height: '0.9rem', width: '70%', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
                <div style={{ background: 'var(--border)', height: '0.8rem', width: '40%', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
              </div>
              <div style={{ background: 'var(--border)', height: '0.9rem', width: '80px', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
