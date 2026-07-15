'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, useRef } from 'react';
import GoogleIcon from './icons/GoogleIcon';

type NotificationItem = {
  id: string;
  type: 'billing' | 'security' | 'onboarding';
  title: string;
  body: string;
  href?: string;
  createdAt: string;
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const bellRef = useRef<HTMLDivElement>(null);

  // 1. DYNAMIC BACKGROUND POLLING (Updates notifications in real-time)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications', { cache: 'no-store' });
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setItems(data.notifications || []);
      } catch (err) {
        console.error('Failed to fetch user notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 8000); // Polling every 8 seconds

    return () => clearInterval(interval);
  }, []);

  // 2. CLICK-OUTSIDE-TO-CLOSE (Improves responsiveness and accessibility)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = useMemo(() => items.length, [items.length]);

  return (
    <div ref={bellRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn btn-secondary"
        style={{ 
          padding: '0.45rem', 
          borderRadius: '50%', 
          width: '40px', 
          height: '40px', 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease-in-out'
        }}
        aria-label="Open notifications"
      >
        {unreadCount > 0 ? <GoogleIcon name="notifications_active" size={18} style={{ color: 'var(--accent)' }} /> : <GoogleIcon name="notifications" size={18} />}
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              background: '#ef4444',
              color: '#fff',
              borderRadius: '999px',
              minWidth: '18px',
              height: '18px',
              fontSize: '0.68rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 0.25rem',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.45)',
              animation: 'pulse 2s infinite'
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '48px',
            width: '340px',
            maxWidth: 'calc(100vw - 1rem)',
            maxHeight: '440px',
            overflowY: 'auto',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.25)',
            zIndex: 999,
            padding: '0.9rem',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
            <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, letterSpacing: '-0.01em' }}>Alert Notifications</h4>
            {unreadCount > 0 && (
              <span style={{ fontSize: '0.72rem', background: 'var(--accent-soft)', color: 'var(--accent)', padding: '0.15rem 0.45rem', borderRadius: '6px', fontWeight: 700 }}>
                {unreadCount} active
              </span>
            )}
          </div>

          {loading && <p style={{ color: 'var(--text-muted)', padding: '0.5rem', fontSize: '0.85rem' }}>Synchronizing updates...</p>}
          {!loading && items.length === 0 && (
            <p style={{ color: 'var(--text-muted)', padding: '0.8rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}>
              No notifications yet.
            </p>
          )}

          {!loading &&
            items.map((item) => {
              // Select category icons & theme colors
              let typeIcon = <GoogleIcon name="notifications" size={14} />;
              let typeColor = 'var(--accent)';
              let typeBg = 'var(--accent-soft)';

              if (item.type === 'billing') {
                typeIcon = <GoogleIcon name="credit_card" size={14} />;
                typeColor = '#eab308';
                typeBg = 'rgba(234, 179, 8, 0.12)';
              } else if (item.type === 'security') {
                typeIcon = <GoogleIcon name="shield" size={14} />;
                typeColor = '#a855f7';
                typeBg = 'rgba(168, 85, 247, 0.12)';
              } else if (item.type === 'onboarding') {
                typeIcon = <GoogleIcon name="bolt" size={14} />;
                typeColor = '#22c55e';
                typeBg = 'rgba(34, 197, 94, 0.12)';
              }

              // Dynamic formatted date string
              const relativeTime = new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              const card = (
                <div
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '0.7rem 0.8rem',
                    marginBottom: '0.5rem',
                    background: 'var(--bg)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    gap: '0.7rem',
                    cursor: item.href ? 'pointer' : 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ 
                    width: '28px', 
                    height: '28px', 
                    borderRadius: '8px', 
                    background: typeBg, 
                    color: typeColor, 
                    display: 'grid', 
                    placeItems: 'center',
                    flexShrink: 0
                  }}>
                    {typeIcon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.4rem', marginBottom: '0.15rem' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.84rem', margin: 0, color: 'var(--text-main)' }}>{item.title}</p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{relativeTime}</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.4, margin: 0 }}>{item.body}</p>
                  </div>
                </div>
              );

              if (!item.href) {
                return <div key={item.id}>{card}</div>;
              }

              return (
                <Link key={item.id} href={item.href} onClick={() => setOpen(false)} style={{ textDecoration: 'none' }}>
                  {card}
                </Link>
              );
            })}
        </div>
      )}
    </div>
  );
}
