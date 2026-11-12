import React from 'react';
import { Heart, ShieldCheck, SlidersHorizontal } from 'lucide-react';

import type { BrandContent, ProjectItem } from '../services/api';

interface FooterProps {
  brand?: BrandContent;
  projects?: ProjectItem[];
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ brand, projects = [], onOpenAdmin }) => {
  return (
    <footer className="site-footer">
      {/* Main Footer Links */}
      <div className="container footer-main-content">
        <div className="footer-grid">
          {/* Column 1: Brand & Charter */}
          <div className="footer-col-brand">
            <div className="brand-logo footer-brand">
              <div className="brand-logo-frame">
                <img src="/Rce.logo.png" alt="RCE - Right Club for Education" className="footer-logo-img" />
              </div>
              <div className="logo-text-group">
                <span className="brand-title text-white">{brand?.name || 'RCE'}</span>
                <span className="brand-subtitle footer-brand-subtitle">{brand?.subtitle || 'RIGHT CLUB FOR EDUCATION'}</span>
              </div>
            </div>
            <p className="footer-mission-text">
              {brand?.mission || 'A people-driven social movement inspired by compassion and collective civic action. Bridging resources to the vulnerable and fostering responsible young leaders.'}
            </p>
            <div className="footer-tax-badge">
              <ShieldCheck size={18} color="#fde047" className="flex-shrink-0" />
              <span>Registered Public Charitable Trust. Dedicated to Education & Social Service.</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-nav-list">
              <li><a href="#hero">Home</a></li>
              <li><a href="#about">About Our Mission</a></li>
              <li><a href="#projects">Flagship Projects</a></li>
              <li><a href="#events">Upcoming Drives</a></li>
              <li><a href="#stories">Voices of Change</a></li>
              <li><a href="#gallery">Impact Gallery</a></li>
              <li><a href="#contact">Contact Us</a></li>
              {onOpenAdmin && (
                <li style={{ marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#f59e0b',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                    }}
                  >
                    <SlidersHorizontal size={14} />
                    <span>Admin Portal</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Flagship Causes */}
          <div className="footer-col">
            <h4 className="footer-heading">Key Causes</h4>
            <ul className="footer-nav-list">
              {projects.length > 0 ? (
                projects.slice(0, 6).map((p) => (
                  <li key={p.id}>
                    <a href="#projects">{p.title}</a>
                  </li>
                ))
              ) : (
                <>
                  <li><a href="#projects">Vidhya Connect (Child Tutoring)</a></li>
                  <li><a href="#projects">Green Earth (Miyawaki Groves)</a></li>
                  <li><a href="#projects">Arogya Free Health & Eye Camps</a></li>
                  <li><a href="#projects">Annapoorna Hospital Food Drive</a></li>
                </>
              )}
            </ul>
          </div>

          {/* Column 4: Trust & Transparency */}
          <div className="footer-col">
            <h4 className="footer-heading">Trust & Legal</h4>
            <div className="footer-legal-box">
              <p><strong>Trust Reg No:</strong> {brand?.trustReg || 'TN/CH/2021/84920'}</p>
              <p><strong>PAN:</strong> {brand?.pan || 'AAATR8492G'}</p>
              <p className="mt-2 text-xs text-stone-400">
                Audited statements are published annually for complete public scrutiny.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} {brand?.subtitle || brand?.name || 'Right Club for Education'}. All rights reserved.
          </p>
          {onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              style={{
                background: 'none',
                border: 'none',
                color: '#a89485',
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f59e0b')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#a89485')}
              title="Restricted Staff & Admin Management Portal"
            >
              <SlidersHorizontal size={13} />
              <span>Admin Portal 🔒</span>
            </button>
          )}
          <div className="footer-made-with">
            <span>Crafted with</span>
            <Heart size={14} className="text-red-500 fill-current inline mx-1" />
            <span>for Social Transformation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
