'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup to ensure we don't leave the body locked
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="nav-brand">
            <span className="text-accent">✦</span> StreamSaaS
          </Link>
          
          <div className="nav-links">
            <Link href="/" className="nav-item">Home</Link>
            <Link href="/pricing" className="nav-item">Pricing</Link>
          </div>

          <div className="nav-actions">
            <Link href="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Login</Link>
            <Link href="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Get Started</Link>
          </div>

          {/* Mobile Toggle Button */}
          <button 
            className="mobile-menu-btn" 
            onClick={toggleMenu} 
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
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
              <Link href="/" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link href="/pricing" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
              <hr className="mobile-divider" />
              <Link href="/login" className="btn btn-secondary btn-full" style={{ padding: '1rem', justifyContent: 'center' }} onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              <Link href="/register" className="btn btn-primary btn-full mt-2" style={{ padding: '1rem', justifyContent: 'center' }} onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
