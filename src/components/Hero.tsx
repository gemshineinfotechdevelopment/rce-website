import React from 'react';
import { Heart, Users, ArrowRight, ShieldCheck, Sparkles, Award } from 'lucide-react';
import type { ClubStats, HeroContent } from '../services/api';

interface HeroProps {
  stats: ClubStats;
  content?: HeroContent;
  onOpenJoin: () => void;
  onOpenDonate: () => void;
}

export const Hero: React.FC<HeroProps> = ({ stats, content, onOpenJoin, onOpenDonate }) => {
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
  const imageUrl = content?.imageUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80';
  const badgeTagline = content?.badgeTagline || '✨ Service Above Self • RCE Chapter';
  const statTreesLabel = content?.statTreesLabel || 'Saplings Planted';
  const statLivesLabel = content?.statLivesLabel || 'Lives Impacted';

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

          {/* Right Visual Composition */}
          <div className="hero-visual">
            <div className="hero-card-main">
              <img 
                src={imageUrl} 
                alt="RCE Volunteers helping children and communities"
                className="hero-main-img"
              />
              <div className="hero-img-overlay"></div>

              {/* Floating Glass Badges */}
              <div className="floating-stat-badge top-right">
                <div className="badge-icon-wrap gold">🌿</div>
                <div>
                  <div className="badge-stat-num">{stats.treesPlanted.toLocaleString()}+</div>
                  <div className="badge-stat-label">{statTreesLabel}</div>
                </div>
              </div>

              <div className="floating-stat-badge bottom-left">
                <div className="badge-icon-wrap brown">🎓</div>
                <div>
                  <div className="badge-stat-num">{stats.livesImpacted.toLocaleString()}+</div>
                  <div className="badge-stat-label">{statLivesLabel}</div>
                </div>
              </div>

              {badgeTagline && (
                <div className="hero-badge-tagline">
                  <span>{badgeTagline}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
