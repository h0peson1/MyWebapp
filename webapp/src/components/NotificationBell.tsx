'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Bell, BellDot } from 'lucide-react';

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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setItems(data.notifications || []);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = useMemo(() => items.length, [items.length]);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn btn-secondary"
        style={{ padding: '0.45rem', borderRadius: '50%', width: '40px', height: '40px', position: 'relative' }}
        aria-label="Open notifications"
      >
        {unreadCount > 0 ? <BellDot size={18} /> : <Bell size={18} />}
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
              fontSize: '0.7rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 0.25rem',
            }}
          >
            {Math.min(unreadCount, 9)}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '48px',
            width: '320px',
            maxHeight: '420px',
            overflowY: 'auto',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12)',
            zIndex: 80,
            padding: '0.75rem',
          }}
        >
          <h4 style={{ margin: '0.35rem 0.5rem 0.75rem', fontSize: '0.95rem' }}>Notifications</h4>
          {loading && <p style={{ color: 'var(--text-muted)', padding: '0.5rem' }}>Loading...</p>}
          {!loading && items.length === 0 && (
            <p style={{ color: 'var(--text-muted)', padding: '0.5rem' }}>No new notifications.</p>
          )}
          {!loading &&
            items.map((item) => {
              const card = (
                <div
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '0.6rem 0.7rem',
                    marginBottom: '0.5rem',
                    background: 'var(--bg)',
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>{item.title}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.4 }}>{item.body}</p>
                </div>
              );

              if (!item.href) {
                return <div key={item.id}>{card}</div>;
              }

              return (
                <Link key={item.id} href={item.href} onClick={() => setOpen(false)}>
                  {card}
                </Link>
              );
            })}
        </div>
      )}
    </div>
  );
}
