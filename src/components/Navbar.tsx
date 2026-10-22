import React, { useState, useEffect } from 'react';
import { Heart, Users, Menu, X } from 'lucide-react';
import { checkBackendHealth } from '../services/api';

interface NavbarProps {
  onOpenJoin: (role?: string) => void;
  onOpenDonate: (cause?: string) => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenJoin, onOpenDonate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    checkBackendHealth().then((status) => setBackendOnline(status));
    const interval = setInterval(() => {
      checkBackendHealth().then((status) => setBackendOnline(status));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        {/* Brand Logo */}
        <a href="#hero" className="brand-logo" aria-label="RCE Social Service Club Home">
          <div className="logo-emblem">
            <span className="logo-icon">🤝</span>
          </div>
          <div className="logo-text-group">
            <span className="brand-title">RCE CLUB</span>
            <span className="brand-subtitle">SERVICE &bull; CULTURE &bull; YOUTH</span>
          </div>
        </a>

        {/* Desktop Navigation Pills (Inspired by MyKutumb pill-navbar) */}
        <nav className="desktop-nav-pill">
          <a href="#hero" className="nav-link">Home</a>
          <a href="#about" className="nav-link">About Us</a>
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#events" className="nav-link">Events</a>
          <a href="#stories" className="nav-link">Stories</a>
          <a href="#gallery" className="nav-link">Gallery</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>

        {/* Action Buttons & Status */}
        <div className="nav-actions">
          {/* Backend Status indicator */}
          <div 
            className={`server-status-pill ${backendOnline ? 'online' : backendOnline === false ? 'offline' : 'checking'}`} 
            title={backendOnline ? 'Backend API Connected (Port 5000)' : 'Backend Server Offline'}
          >
            {backendOnline ? (
              <>
                <span className="status-ping-dot green"></span>
                <span className="status-text">API Live</span>
              </>
            ) : backendOnline === false ? (
              <>
                <span className="status-ping-dot red"></span>
                <span className="status-text">Offline</span>
              </>
            ) : (
              <>
                <span className="status-ping-dot yellow"></span>
                <span className="status-text">Checking</span>
              </>
            )}
          </div>

          {/* Quick Donate Button */}
          <button 
            type="button" 
            onClick={() => onOpenDonate()} 
            className="btn-primary btn-nav-donate"
            aria-label="Open donation modal"
          >
            <Heart size={16} fill="currentColor" />
            <span>Donate</span>
          </button>

          {/* Signature Join Us Button (MyKutumb style emerald button) */}
          <button 
            type="button" 
            onClick={() => onOpenJoin()} 
            className="btn-secondary btn-nav-join"
            aria-label="Open join us modal"
          >
            <Users size={16} />
            <span>Join Us</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button 
            type="button" 
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <div className="mobile-nav-links">
            <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Home</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">About Us</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Projects & Drives</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Upcoming Events</a>
            <a href="#stories" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Impact Stories</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Photo Gallery</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Contact & Help</a>
          </div>
          <div className="mobile-menu-actions">
            <button 
              type="button" 
              onClick={() => { setMobileMenuOpen(false); onOpenDonate(); }} 
              className="btn-primary w-full"
            >
              <Heart size={18} fill="currentColor" /> Donate Now
            </button>
            <button 
              type="button" 
              onClick={() => { setMobileMenuOpen(false); onOpenJoin(); }} 
              className="btn-secondary w-full"
            >
              <Users size={18} /> Join RCE Family
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
