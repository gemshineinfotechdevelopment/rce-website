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

  // Active Section / Segment state for live ScrollSpy
  const [activeSegment, setActiveSegment] = useState<string>(() => {
    if (currentView === 'projects') return 'projects';
    if (currentView === 'events') return 'events';
    const hash = window.location.hash.replace('#', '');
    return hash || 'hero';
  });

  // Scroll Listener for Navbar shadow and blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ping backend API periodically
  useEffect(() => {
    checkBackendHealth().then((status) => setBackendOnline(status));
    const interval = setInterval(() => {
      checkBackendHealth().then((status) => setBackendOnline(status));
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Live ScrollSpy: Updates active segment smoothly as user scrolls through every section
  useEffect(() => {
    if (currentView === 'projects') {
      setActiveSegment('projects');
      return;
    }
    if (currentView === 'events') {
      setActiveSegment('events');
      return;
    }

    const segments = ['contact', 'gallery', 'stories', 'about', 'videos', 'hero'];

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY;
      const navOffset = 140; // navbar height + activation threshold

      // If at the very top of the page, default to hero
      if (scrollPosition < 120) {
        setActiveSegment('hero');
        return;
      }

      // Check sections from bottom to top
      for (const segId of segments) {
        const el = document.getElementById(segId);
        if (el) {
          const top = el.offsetTop - navOffset;
          if (scrollPosition >= top) {
            setActiveSegment(segId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [currentView]);

  // Smooth scroll handler
  const scrollToSection = (sectionId?: string) => {
    const id = sectionId ? sectionId.replace('#', '') : 'hero';
    setActiveSegment(id);

    const el = document.getElementById(id);
    if (el) {
      const navHeight = 74;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      history.pushState(null, '', `#${id}`);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.pushState(null, '', '#hero');
    }
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    view: 'home' | 'projects' | 'events',
    sectionId?: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (view === 'projects') {
      setActiveSegment('projects');
      if (onNavigate) onNavigate('projects');
      else window.location.hash = '#projects';
      return;
    }

    if (view === 'events') {
      setActiveSegment('events');
      if (onNavigate) onNavigate('events');
      else window.location.hash = '#events';
      return;
    }

    // Home view navigation
    if (currentView !== 'home') {
      if (onNavigate) onNavigate('home', sectionId);
      else {
        window.location.hash = sectionId || '#hero';
      }
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 80);
    } else {
      scrollToSection(sectionId);
    }
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        {/* Brand Logo Lockup */}
        <a
          href="#hero"
          onClick={(e) => handleLinkClick(e, 'home', '#hero')}
          className="brand-logo"
          aria-label="RCE Social Service Club Home"
        >
          <div className="brand-logo-frame">
            <img src="/Rce.logo.png" alt="RCE - Right Club for Education" className="brand-logo-img" />
            {backendOnline && (
              <span
                className="brand-online-dot"
                title="RCE Community Platform Online"
              />
            )}
          </div>
          <div className="logo-text-group">
            <span className="brand-title">{brand?.name || 'RCE'}</span>
            <span className="brand-subtitle">{brand?.subtitle || 'RIGHT CLUB FOR EDUCATION'}</span>
          </div>
        </a>

        {/* Desktop Navigation Pills with ScrollSpy Segments */}
        <nav className="desktop-nav-pill" aria-label="Main Navigation">
          <a
            href="#hero"
            onClick={(e) => handleLinkClick(e, 'home', '#hero')}
            className={`nav-link ${activeSegment === 'hero' ? 'active-pill' : ''}`}
          >
            Home
          </a>
          <a
            href="#videos"
            onClick={(e) => handleLinkClick(e, 'home', '#videos')}
            className={`nav-link ${activeSegment === 'videos' ? 'active-pill' : ''}`}
          >
            Videos
          </a>
          <a
            href="#about"
            onClick={(e) => handleLinkClick(e, 'home', '#about')}
            className={`nav-link ${activeSegment === 'about' ? 'active-pill' : ''}`}
          >
            About Us
          </a>
          <a
            href="#projects"
            onClick={(e) => handleLinkClick(e, 'projects')}
            className={`nav-link ${activeSegment === 'projects' ? 'active-pill' : ''}`}
          >
            Projects
          </a>
          <a
            href="#events"
            onClick={(e) => handleLinkClick(e, 'events')}
            className={`nav-link ${activeSegment === 'events' ? 'active-pill' : ''}`}
          >
            Events (14+)
          </a>
          <a
            href="#stories"
            onClick={(e) => handleLinkClick(e, 'home', '#stories')}
            className={`nav-link ${activeSegment === 'stories' ? 'active-pill' : ''}`}
          >
            Stories
          </a>
          <a
            href="#gallery"
            onClick={(e) => handleLinkClick(e, 'home', '#gallery')}
            className={`nav-link ${activeSegment === 'gallery' ? 'active-pill' : ''}`}
          >
            Gallery
          </a>
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, 'home', '#contact')}
            className={`nav-link ${activeSegment === 'contact' ? 'active-pill' : ''}`}
          >
            Contact
          </a>
        </nav>

        {/* Action Buttons: Clean symmetrical alignment */}
        <div className="nav-actions">
          {/* Quick Donate Button */}
          <button
            type="button"
            onClick={() => onOpenDonate()}
            className="btn-primary btn-nav-donate"
            aria-label="Open donation modal"
          >
            <Heart size={15} fill="currentColor" />
            <span>Donate</span>
          </button>

          {/* Signature Join Us Button */}
          <button
            type="button"
            onClick={() => onOpenJoin()}
            className="btn-secondary btn-nav-join"
            aria-label="Open join us modal"
          >
            <Users size={15} />
            <span>Join Us</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
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
              className={`mobile-nav-link ${activeSegment === 'hero' ? 'active' : ''}`}
            >
              Home
            </a>
            <a
              href="#videos"
              onClick={(e) => handleLinkClick(e, 'home', '#videos')}
              className={`mobile-nav-link ${activeSegment === 'videos' ? 'active' : ''}`}
            >
              YouTube Cinema
            </a>
            <a
              href="#about"
              onClick={(e) => handleLinkClick(e, 'home', '#about')}
              className={`mobile-nav-link ${activeSegment === 'about' ? 'active' : ''}`}
            >
              About Us
            </a>
            <a
              href="#projects"
              onClick={(e) => handleLinkClick(e, 'projects')}
              className={`mobile-nav-link ${activeSegment === 'projects' ? 'active' : ''}`}
            >
              Projects & Causes
            </a>
            <a
              href="#events"
              onClick={(e) => handleLinkClick(e, 'events')}
              className={`mobile-nav-link ${activeSegment === 'events' ? 'active' : ''}`}
            >
              Educational Events (14+)
            </a>
            <a
              href="#stories"
              onClick={(e) => handleLinkClick(e, 'home', '#stories')}
              className={`mobile-nav-link ${activeSegment === 'stories' ? 'active' : ''}`}
            >
              Impact Stories
            </a>
            <a
              href="#gallery"
              onClick={(e) => handleLinkClick(e, 'home', '#gallery')}
              className={`mobile-nav-link ${activeSegment === 'gallery' ? 'active' : ''}`}
            >
              Photo Gallery
            </a>
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, 'home', '#contact')}
              className={`mobile-nav-link ${activeSegment === 'contact' ? 'active' : ''}`}
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
              <Heart size={16} fill="currentColor" /> Donate Now
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenJoin();
              }}
              className="btn-secondary w-full"
            >
              <Users size={16} /> Join RCE Family
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
