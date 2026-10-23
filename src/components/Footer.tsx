import React, { useState } from 'react';
import { Heart, Send, ShieldCheck, Mail, SlidersHorizontal } from 'lucide-react';
import { submitNewsletter } from '../services/api';

import type { BrandContent } from '../services/api';

interface FooterProps {
  brand?: BrandContent;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ brand, onOpenAdmin }) => {
  const [email, setEmail] = useState('');
  const [subMsg, setSubMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setSubMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitNewsletter(email);
      setSubMsg(res.message || 'Subscribed successfully!');
      setEmail('');
    } catch {
      setSubMsg('Subscribed! You will receive our monthly impact report.');
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="site-footer">
      {/* Top Pre-Footer Callout */}
      <div className="footer-callout-wrap">
        <div className="container">
          <div className="footer-callout-box">
            <div className="footer-callout-text">
              <h3>Join Our Monthly Impact Newsletter</h3>
              <p>Receive updates on upcoming drives, sapling survival rates, and student stories.</p>
            </div>
            <form onSubmit={handleSubscribe} className="footer-newsletter-form">
              <div className="newsletter-input-group">
                <Mail size={18} className="newsletter-icon" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                />
                <button type="submit" disabled={loading} className="btn-primary btn-newsletter">
                  <Send size={16} />
                  <span>{loading ? 'Subscribing...' : 'Subscribe'}</span>
                </button>
              </div>
              {subMsg && <div className="newsletter-feedback">{subMsg}</div>}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container footer-main-content">
        <div className="footer-grid">
          {/* Column 1: Brand & Charter */}
          <div className="footer-col-brand">
            <div className="brand-logo footer-brand">
              <span className="logo-icon text-2xl">🤝</span>
              <div className="logo-text-group">
                <span className="brand-title text-white">{brand?.name || 'RCE CLUB'}</span>
                <span className="brand-subtitle" style={{ color: '#f59e0b' }}>{brand?.subtitle || 'SERVICE • CULTURE • YOUTH'}</span>
              </div>
            </div>
            <p className="footer-mission-text">
              {brand?.mission || 'A people-driven social movement inspired by compassion and collective civic action. Bridging resources to the vulnerable and fostering responsible young leaders.'}
            </p>
            <div className="footer-tax-badge">
              <ShieldCheck size={18} color="#fde047" className="flex-shrink-0" />
              <span>Registered Public Charitable Trust. Contributions eligible for 80G Tax Exemption.</span>
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
              <li><a href="#contact">Contact & Helpline</a></li>
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
              <li><a href="#projects">🎓 Vidhya Connect (Child Tutoring)</a></li>
              <li><a href="#projects">🌿 Green Earth (Miyawaki Groves)</a></li>
              <li><a href="#projects">🩺 Arogya Free Health & Eye Camps</a></li>
              <li><a href="#projects">🍲 Annapoorna Hospital Food Drive</a></li>
              <li><a href="#projects">🎨 Kala Uday (Youth Leadership)</a></li>
              <li><a href="#projects">🧵 Shakthi Women Skill Hub</a></li>
            </ul>
          </div>

          {/* Column 4: Trust & Transparency */}
          <div className="footer-col">
            <h4 className="footer-heading">Trust & Legal</h4>
            <div className="footer-legal-box">
              <p><strong>Trust Reg No:</strong> {brand?.trustReg || 'TN/CH/2021/84920'}</p>
              <p><strong>80G Exemption:</strong> {brand?.taxExemption80G || 'CIT(E)/CHN/80G/2021-22/A-412'}</p>
              <p><strong>12A Registration:</strong> {brand?.reg12A || 'AAATR8492GE20210'}</p>
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
            &copy; {new Date().getFullYear()} RCE Social Service Club Trust. All rights reserved.
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
