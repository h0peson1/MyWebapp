'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import GoogleIcon from './icons/GoogleIcon';

type AdminNotification = {
  id: string;
  type: 'order';
  title: string;
  body: string;
  href: string;
  createdAt: string;
  status: 'pending';
};

const STORAGE_KEY = 'admin-notifications-seen:v1';

function loadSeenIds() {
  if (typeof window === 'undefined') return new Set<string>();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set<string>();
    return new Set<string>(JSON.parse(raw) as string[]);
  } catch {
    return new Set<string>();
  }
}

function saveSeenIds(seenIds: Set<string>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(seenIds)));
  } catch {
    // Ignore storage failures.
  }
}

export default function AdminNotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const seenIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    seenIdsRef.current = loadSeenIds();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const notifyAboutNewItems = (items: AdminNotification[]) => {
      if (typeof window === 'undefined' || !('Notification' in window)) {
        return;
      }

      const hasPermission = Notification.permission === 'granted';
      if (!hasPermission) {
        return;
      }

      for (const item of items) {
        if (seenIdsRef.current.has(item.id)) {
          continue;
        }

        const notification = new Notification('New order received', {
          body: item.body,
          tag: item.id,
        });

        notification.onclick = () => {
          window.focus();
          window.location.href = item.href;
        };
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/admin/notifications', { cache: 'no-store' });
        if (!res.ok) {
          return;
        }

        const data = await res.json();
        const nextNotifications: AdminNotification[] = data.notifications || [];

        if (!mounted) {
          return;
        }

        setNotifications(nextNotifications);
        notifyAboutNewItems(nextNotifications);

        const nextSeen = new Set(seenIdsRef.current);
        let changed = false;
        for (const item of nextNotifications) {
          if (!nextSeen.has(item.id)) {
            nextSeen.add(item.id);
            changed = true;
          }
        }

        if (changed) {
          seenIdsRef.current = nextSeen;
          saveSeenIds(nextSeen);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchNotifications();
    const interval = window.setInterval(fetchNotifications, 30000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const unreadCount = useMemo(() => {
    // Pending orders from backend are actionable and should stay visible.
    return notifications.length;
  }, [notifications]);

  const requestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  return (
    <div className="admin-notification-root" style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((value) => !value)}
        className="btn btn-secondary admin-notification-trigger"
        style={{ padding: '0.45rem', borderRadius: '50%', width: '40px', height: '40px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        aria-label="Open admin notifications"
      >
        {unreadCount > 0 ? <GoogleIcon name="notifications_active" size={18} /> : <GoogleIcon name="notifications" size={18} />}
        {unreadCount > 0 && (
          <span className="admin-notification-badge" style={{ position: 'absolute', top: '-3px', right: '-3px', background: '#ef4444', color: '#fff', borderRadius: '999px', minWidth: '18px', height: '18px', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.25rem' }}>
            {Math.min(unreadCount, 9)}
          </span>
        )}
      </button>

      {open && (
        <div className="admin-notification-panel" style={{ position: 'absolute', right: 0, top: '48px', width: '340px', maxWidth: 'min(340px, calc(100vw - 1rem))', maxHeight: '440px', overflowY: 'auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12)', zIndex: 80, padding: '0.75rem' }}>
          <div className="admin-notification-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.65rem' }}>
            <h4 style={{ margin: '0.35rem 0.5rem 0', fontSize: '0.95rem' }}>Order Alerts</h4>
            {(permission !== 'granted') && (
              <button className="btn btn-secondary admin-notification-enable-btn" style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }} onClick={requestPermission}>
                Enable device alerts
              </button>
            )}
          </div>
          {loading && <p style={{ color: 'var(--text-muted)', padding: '0.5rem' }}>Loading...</p>}
          {!loading && notifications.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '0.5rem' }}>No new orders yet.</p>}
          {!loading && notifications.map((item) => {
            const card = (
              <div style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '0.6rem 0.7rem', marginBottom: '0.5rem', background: 'var(--bg)' }}>
                <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>{item.title}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.4 }}>{item.body}</p>
              </div>
            );

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
