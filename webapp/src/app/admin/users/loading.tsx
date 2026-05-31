export default function AdminUsersLoading() {
  return (
    <div className="container" style={{ padding: '2rem 0 3rem', minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.25; }
        }
      `}} />

      {/* Header and description skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
        <div style={{ background: 'var(--border)', height: '2rem', width: '220px', borderRadius: '6px', animation: 'pulse 1.5s infinite ease-in-out' }} />
      </div>
      <div style={{ background: 'var(--border)', height: '1rem', width: '420px', borderRadius: '4px', marginBottom: '1.8rem', animation: 'pulse 1.5s infinite ease-in-out' }} />

      {/* Table skeleton */}
      <div className="card" style={{ padding: '1.5rem', height: '400px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.1rem 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ background: 'var(--border)', height: '1rem', width: '15%', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
              <div style={{ background: 'var(--border)', height: '1rem', width: '25%', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
              <div style={{ background: 'var(--border)', height: '1rem', width: '20%', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
              <div style={{ background: 'var(--border)', height: '1rem', width: '8%', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
              <div style={{ background: 'var(--border)', height: '8%', width: '8%', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
