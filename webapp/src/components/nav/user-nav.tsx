'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import { useAuth } from '../AuthContext';
import { User, LayoutDashboard, Rocket, Settings, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function UserNav() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <DropdownMenu.Root onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button className="user-nav-trigger" aria-label="User menu">
          <div className="user-avatar">
            <User size={18} />
          </div>
          <span className="user-name">
            {user?.name?.split(' ')[0] || 'Account'}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} />
          </motion.div>
        </button>
      </DropdownMenu.Trigger>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content
              asChild
              align="end"
              sideOffset={8}
              className="user-nav-content"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="dropdown-header">
                  <p className="user-full-name">{user?.name}</p>
                  <p className="user-email">{user?.email}</p>
                </div>

                <DropdownMenu.Separator className="dropdown-separator" />

                <DropdownMenu.Item asChild>
                  <Link href="/dashboard" className="dropdown-item">
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenu.Item>

                <DropdownMenu.Item asChild>
                  <Link href="/onboarding" className="dropdown-item">
                    <Rocket size={16} />
                    <span>Onboarding</span>
                  </Link>
                </DropdownMenu.Item>

                <DropdownMenu.Item asChild>
                  <Link href="/settings" className="dropdown-item">
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="dropdown-separator" />

                <DropdownMenu.Item onSelect={handleLogout} className="dropdown-item logout">
                  <LogOut size={16} />
                  <span>Log out</span>
                </DropdownMenu.Item>
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .user-nav-trigger {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.4rem 0.8rem;
          background: var(--glass-bg);
          border: 1px solid var(--border);
          border-radius: 999px;
          cursor: pointer;
          color: var(--text-main);
          font-weight: 600;
          font-size: 0.88rem;
          transition: all 0.2s ease;
        }

        .user-nav-trigger:hover {
          background: var(--bg-card-hover);
          border-color: var(--accent);
          transform: translateY(-1px);
        }

        .user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--accent-soft);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-nav-content {
          min-width: 200px;
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 0.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          z-index: 100;
        }

        .dropdown-header {
          padding: 0.75rem 0.75rem 0.5rem;
        }

        .user-full-name {
          font-weight: 700;
          font-size: 0.95rem;
          margin: 0;
          color: var(--text-main);
        }

        .user-email {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin: 0;
        }

        .dropdown-separator {
          height: 1px;
          background: var(--border);
          margin: 0.4rem;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.75rem;
          border-radius: 10px;
          color: var(--text-main);
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
          text-decoration: none;
        }

        .dropdown-item:hover, .dropdown-item:focus {
          background: var(--accent-soft);
          color: var(--accent);
        }

        .dropdown-item.logout:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
      `}</style>
    </DropdownMenu.Root>
  );
}
