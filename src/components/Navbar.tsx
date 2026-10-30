import React, { useState, useEffect } from 'react';
import { Heart, Users, Menu, X } from 'lucide-react';
import type { BrandContent } from '../services/api';
import { checkBackendHealth } from '../services/api';

interface NavbarProps {
  brand?: BrandContent;
  currentView?: 'home' | 'projects' | 'events' | 'admin';
  onNavigate?: (view: 'home' | 'projects' | 'events', sectionId?: string) => void;
  onOpenJoin: (role?: string) => void;
  onOpenDonate: (cause?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  brand,
  currentView = 'home',
  onNavigate,
  onOpenJoin,
  onOpenDonate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ping backend API periodically
  useEffect(() => {
    checkBackendHealth().then((status) => setBackendOnline(status));
    const interval = setInterval(() => {
      checkBackendHealth().then((status) => setBackendOnline(status));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    view: 'home' | 'projects' | 'events',
    sectionId?: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(view, sectionId);
    } else {
      if (view === 'projects') window.location.hash = '#projects';
      else if (view === 'events') window.location.hash = '#events';
      else if (sectionId) window.location.hash = sectionId;
      else window.location.hash = '#hero';
    }
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        {/* Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => handleLinkClick(e, 'home', '#hero')}
          className="brand-logo"
          aria-label="RCE Social Service Club Home"
        >
          <div className="brand-logo-frame">
            <img src="/Rce.logo.png" alt="RCE - Right Club for Education" className="brand-logo-img" />
          </div>
          <div className="logo-text-group">
            <span className="brand-title">{brand?.name || 'RCE'}</span>
            <span className="brand-subtitle">{brand?.subtitle || 'RIGHT CLUB FOR EDUCATION'}</span>
          </div>
        </a>

        {/* Desktop Navigation Pills */}
        <nav className="desktop-nav-pill">
          <a
            href="#hero"
            onClick={(e) => handleLinkClick(e, 'home', '#hero')}
            className={`nav-link ${currentView === 'home' && (!window.location.hash || window.location.hash === '#hero') ? 'active-pill' : ''}`}
          >
            Home
          </a>
          <a
            href="#videos"
            onClick={(e) => handleLinkClick(e, 'home', '#videos')}
            className="nav-link"
          >
            Videos
          </a>
          <a
            href="#about"
            onClick={(e) => handleLinkClick(e, 'home', '#about')}
            className="nav-link"
          >
            About Us
          </a>
          <a
            href="#projects"
            onClick={(e) => handleLinkClick(e, 'projects')}
            className={`nav-link ${currentView === 'projects' ? 'active-pill' : ''}`}
          >
            Projects
          </a>
          <a
            href="#events"
            onClick={(e) => handleLinkClick(e, 'events')}
            className={`nav-link ${currentView === 'events' ? 'active-pill' : ''}`}
          >
            Events (14+)
          </a>
          <a
            href="#stories"
            onClick={(e) => handleLinkClick(e, 'home', '#stories')}
            className="nav-link"
          >
            Stories
          </a>
          <a
            href="#gallery"
            onClick={(e) => handleLinkClick(e, 'home', '#gallery')}
            className="nav-link"
          >
            Gallery
          </a>
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, 'home', '#contact')}
            className="nav-link"
          >
            Contact
          </a>
        </nav>

        {/* Action Buttons & Status */}
        <div className="nav-actions">
          {/* Backend Status indicator */}
          <div
            className={`server-status-pill ${backendOnline ? 'online' : backendOnline === false ? 'offline' : 'checking'}`}
            title={backendOnline ? 'Backend API Connected (Port 5024)' : 'Backend Server Offline'}
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

          {/* Signature Join Us Button */}
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

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close mobile navigation"
        />
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <div className="mobile-nav-links">
            <a
              href="#hero"
              onClick={(e) => handleLinkClick(e, 'home', '#hero')}
              className="mobile-nav-link"
            >
              Home
            </a>
            <a
              href="#videos"
              onClick={(e) => handleLinkClick(e, 'home', '#videos')}
              className="mobile-nav-link"
            >
              YouTube Cinema
            </a>
            <a
              href="#about"
              onClick={(e) => handleLinkClick(e, 'home', '#about')}
              className="mobile-nav-link"
            >
              About Us
            </a>
            <a
              href="#projects"
              onClick={(e) => handleLinkClick(e, 'projects')}
              className={`mobile-nav-link ${currentView === 'projects' ? 'font-bold text-amber-700' : ''}`}
            >
              Projects & Causes
            </a>
            <a
              href="#events"
              onClick={(e) => handleLinkClick(e, 'events')}
              className={`mobile-nav-link ${currentView === 'events' ? 'font-bold text-amber-700' : ''}`}
            >
              Educational Events (14+)
            </a>
            <a
              href="#stories"
              onClick={(e) => handleLinkClick(e, 'home', '#stories')}
              className="mobile-nav-link"
            >
              Impact Stories
            </a>
            <a
              href="#gallery"
              onClick={(e) => handleLinkClick(e, 'home', '#gallery')}
              className="mobile-nav-link"
            >
              Photo Gallery
            </a>
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, 'home', '#contact')}
              className="mobile-nav-link"
            >
              Contact & Help
            </a>
          </div>
          <div className="mobile-menu-actions">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonate();
              }}
              className="btn-primary w-full"
            >
              <Heart size={18} fill="currentColor" /> Donate Now
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenJoin();
              }}
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
