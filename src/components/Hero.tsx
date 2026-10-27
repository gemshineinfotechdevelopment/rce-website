import React, { useState, useEffect } from 'react';
import { Heart, Users, ArrowRight, ShieldCheck, Sparkles, Award, Maximize2, X } from 'lucide-react';
import type { ClubStats, HeroContent } from '../services/api';
import defaultHeroBanner from '../assets/Screenshot_27-10-2026_13299_www.instagram.com.jpeg';

interface HeroProps {
  stats: ClubStats;
  content?: HeroContent;
  onOpenJoin: () => void;
  onOpenDonate: () => void;
}

export const Hero: React.FC<HeroProps> = ({ content, onOpenJoin, onOpenDonate }) => {
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);

  const tag = content?.tag || 'A People-Driven Social Movement';
  const titlePrefix = content?.titlePrefix ?? 'Dedicated to ';
  const titleGradient = content?.titleGradient || 'Culture, Service';
  const titleSuffix = content?.titleSuffix ?? ' & Community Upliftment';
  const description = content?.description || 
    'RCE Social Service Club unites passionate youth, students, and mentors to bring tangible grassroots change. From educating underprivileged children and organizing mega medical camps, to restoring water bodies and planting native urban forests.';
  const primaryCta = content?.primaryCta || 'Join As Volunteer';
  const secondaryCta = content?.secondaryCta || 'Support A Cause';
  const tertiaryCta = content?.tertiaryCta || 'Active Drives';
  const trustBadge1 = content?.trustBadge1 || '80G Tax Exemption';
  const trustBadge2 = content?.trustBadge2 || 'Govt. Registered NGO';
  const trustBadge3 = content?.trustBadge3 || '100% Volunteer Driven';
  const imageUrl = (content?.imageUrl && !content.imageUrl.includes('unsplash.com/photo-1488521787991'))
    ? content.imageUrl
    : defaultHeroBanner;

  // Handle ESC key to close full-screen modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullViewOpen) {
        setIsFullViewOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullViewOpen]);

  return (
    <section id="hero" className="hero-section">
      {/* Background ambient lighting orbs */}
      <div className="bg-glow-orb bg-glow-gold hero-orb-1"></div>
      <div className="bg-glow-orb bg-glow-brown hero-orb-2"></div>

      <div className="container hero-container">
        <div className="hero-grid">
          {/* Left Text Column */}
          <div className="hero-content">
            <div className="section-tag gold">
              <Sparkles size={14} color="#d97706" />
              <span>{tag}</span>
            </div>

            <h1 className="hero-heading">
              {titlePrefix}<span className="text-gradient">{titleGradient}</span>{titleSuffix}
            </h1>

            <p className="hero-description">
              {description}
            </p>

            {/* Action Buttons */}
            <div className="hero-cta-group">
              <button 
                type="button" 
                onClick={onOpenJoin}
                className="btn-secondary btn-hero"
                id="hero-join-btn"
              >
                <Users size={18} />
                <span>{primaryCta}</span>
              </button>

              <button 
                type="button" 
                onClick={onOpenDonate}
                className="btn-primary btn-hero"
                id="hero-donate-btn"
              >
                <Heart size={18} fill="currentColor" />
                <span>{secondaryCta}</span>
              </button>

              <a href="#projects" className="btn-outline btn-hero">
                <span>{tertiaryCta}</span>
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Trust Badges */}
            <div className="hero-trust-badges">
              {trustBadge1 && (
                <div className="trust-badge-item">
                  <ShieldCheck size={18} color="#b45309" className="trust-icon" />
                  <span>{trustBadge1}</span>
                </div>
              )}
              {trustBadge1 && trustBadge2 && <div className="trust-badge-divider"></div>}
              {trustBadge2 && (
                <div className="trust-badge-item">
                  <Award size={18} color="#d97706" className="trust-icon" />
                  <span>{trustBadge2}</span>
                </div>
              )}
              {trustBadge2 && trustBadge3 && <div className="trust-badge-divider"></div>}
              {trustBadge3 && (
                <div className="trust-badge-item">
                  <Sparkles size={18} color="#b45309" className="trust-icon" />
                  <span>{trustBadge3}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Visual Composition - Clean Banner Image */}
          <div className="hero-visual">
            <div 
              className="hero-card-main hero-clickable-card"
              onClick={() => setIsFullViewOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsFullViewOpen(true);
                }
              }}
              title="Click to view full photo"
              aria-label="View full banner photo"
            >
              <img 
                src={imageUrl} 
                alt="RCE Social Service Club Banner"
                className="hero-main-img"
              />

              {/* Discreet view full photo badge */}
              <div className="hero-expand-badge">
                <Maximize2 size={13} />
                <span>View Full Photo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-view Lightbox Modal for Hero Banner */}
      {isFullViewOpen && (
        <div 
          className="modal-overlay hero-banner-lightbox-overlay" 
          onClick={() => setIsFullViewOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Full size banner preview"
        >
          <div 
            className="hero-banner-lightbox-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="hero-lightbox-close-btn"
              onClick={() => setIsFullViewOpen(false)}
              aria-label="Close full view"
            >
              <X size={22} />
            </button>
            <img 
              src={imageUrl} 
              alt="RCE Official Banner Full View" 
              className="hero-banner-full-img"
            />
          </div>
        </div>
      )}
    </section>
  );
};
