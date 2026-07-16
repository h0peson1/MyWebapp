'use client';

import Link from 'next/link';
import { useState, useEffect, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthContext';
import GoogleIcon from './icons/GoogleIcon';
import { useTheme } from './ThemeContext';
import NotificationBell from './NotificationBell';
import { UserNav } from './nav/user-nav';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isClient = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="nav-brand">
            <span className="text-accent"><GoogleIcon name="auto_awesome" size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /></span> StreamSaaS
          </Link>
          
          <div className="nav-links">
            <Link href="/" className="nav-item">Home</Link>
            <Link href="/pricing" className="nav-item">Pricing</Link>
            {!isLoggedIn && (
              <>
                <Link href="/terms" className="nav-item">Terms</Link>
                <Link href="/privacy-policy" className="nav-item">Privacy</Link>
              </>
            )}
            <Link href="/contact" className="nav-item">Contact</Link>
          </div>

          <div className="nav-actions">
            <button 
              onClick={toggleTheme} 
              className="btn btn-secondary" 
              style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px' }}
              aria-label="Toggle Theme"
            >
              {!isClient ? <GoogleIcon name="light_mode" size={20} /> : theme === 'light' ? <GoogleIcon name="dark_mode" size={20} /> : <GoogleIcon name="light_mode" size={20} />}
            </button>
            {!loading && (
              <>
                {isLoggedIn ? (
                  <>
                    <NotificationBell />
                    <UserNav />
                  </>
                ) : (
                  <>
                    <Link href="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Login</Link>
                    <Link href="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Get Started</Link>
                  </>
                )}
              </>
            )}
          </div>

          <button 
            className="mobile-menu-btn" 
            onClick={toggleMenu} 
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <GoogleIcon name="close" size={24} /> : <GoogleIcon name="menu" size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="mobile-menu-content">
              <div className="mobile-menu-header px-4 mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {isLoggedIn && (
                  <p className="font-bold text-accent" style={{ letterSpacing: '0.05em', margin: 0 }}>
                    HELLO {user?.name?.toUpperCase()}
                  </p>
                )}
                <button 
                  onClick={toggleTheme} 
                  className="btn btn-secondary mobile-theme-toggle" 
                  aria-label="Toggle Theme"
                  style={{ padding: '0.6rem', borderRadius: '50%', width: '42px', height: '42px', marginLeft: isLoggedIn ? 'auto' : '0' }}
                >
                  {!isClient ? <GoogleIcon name="light_mode" size={20} /> : theme === 'light' ? <GoogleIcon name="dark_mode" size={20} /> : <GoogleIcon name="light_mode" size={20} />}
                </button>
              </div>
              
              <Link href="/" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link href="/pricing" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
              {isLoggedIn && (
                <>
                  <Link href="/dashboard" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                  <Link href="/onboarding" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>Onboarding</Link>
                  <Link href="/settings" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>Settings</Link>
                </>
              )}
              {!isLoggedIn && (
                <>
                  <Link href="/terms" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>Terms</Link>
                  <Link href="/privacy-policy" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>Privacy</Link>
                </>
              )}
              <Link href="/contact" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
              
              <hr className="mobile-divider" />
              
              {!loading && (
                <>
                  {isLoggedIn ? (
                    <button 
                      onClick={handleLogout} 
                      className="btn btn-secondary btn-full" 
                      style={{ padding: '1rem', justifyContent: 'center' }}
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link href="/login" className="btn btn-secondary btn-full" style={{ padding: '1rem', justifyContent: 'center' }} onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                      <Link href="/register" className="btn btn-primary btn-full mt-2" style={{ padding: '1rem', justifyContent: 'center' }} onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
