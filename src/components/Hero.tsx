import React from 'react';
import { Heart, Users, ArrowRight, ShieldCheck, Sparkles, Award } from 'lucide-react';
import type { ClubStats } from '../services/api';

interface HeroProps {
  stats: ClubStats;
  onOpenJoin: () => void;
  onOpenDonate: () => void;
}

export const Hero: React.FC<HeroProps> = ({ stats, onOpenJoin, onOpenDonate }) => {
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
              <span>A People-Driven Social Movement</span>
            </div>

            <h1 className="hero-heading">
              Dedicated to <span className="text-gradient">Culture, Service</span> & Community Upliftment
            </h1>

            <p className="hero-description">
              RCE Social Service Club unites passionate youth, students, and mentors to bring 
              tangible grassroots change. From educating underprivileged children and organizing 
              mega medical camps, to restoring water bodies and planting native urban forests.
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
                <span>Join As Volunteer</span>
              </button>

              <button 
                type="button" 
                onClick={onOpenDonate}
                className="btn-primary btn-hero"
                id="hero-donate-btn"
              >
                <Heart size={18} fill="currentColor" />
                <span>Support A Cause</span>
              </button>

              <a href="#projects" className="btn-outline btn-hero">
                <span>Active Drives</span>
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Trust Badges */}
            <div className="hero-trust-badges">
              <div className="trust-badge-item">
                <ShieldCheck size={18} color="#b45309" className="trust-icon" />
                <span>80G Tax Exemption</span>
              </div>
              <div className="trust-badge-divider"></div>
              <div className="trust-badge-item">
                <Award size={18} color="#d97706" className="trust-icon" />
                <span>Govt. Registered NGO</span>
              </div>
              <div className="trust-badge-divider"></div>
              <div className="trust-badge-item">
                <Sparkles size={18} color="#b45309" className="trust-icon" />
                <span>100% Volunteer Driven</span>
              </div>
            </div>
          </div>

          {/* Right Visual Composition */}
          <div className="hero-visual">
            <div className="hero-card-main">
              <img 
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80" 
                alt="RCE Volunteers helping children and communities"
                className="hero-main-img"
              />
              <div className="hero-img-overlay"></div>

              {/* Floating Glass Badges */}
              <div className="floating-stat-badge top-right">
                <div className="badge-icon-wrap gold">🌿</div>
                <div>
                  <div className="badge-stat-num">{stats.treesPlanted.toLocaleString()}+</div>
                  <div className="badge-stat-label">Saplings Planted</div>
                </div>
              </div>

              <div className="floating-stat-badge bottom-left">
                <div className="badge-icon-wrap brown">🎓</div>
                <div>
                  <div className="badge-stat-num">{stats.livesImpacted.toLocaleString()}+</div>
                  <div className="badge-stat-label">Lives Impacted</div>
                </div>
              </div>

              <div className="hero-badge-tagline">
                <span>✨ Service Above Self &bull; RCE Chapter</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
