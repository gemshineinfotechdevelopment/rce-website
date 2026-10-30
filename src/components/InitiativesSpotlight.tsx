import React from 'react';
import { Heart, GraduationCap, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import type { ProjectItem, ClubEvent } from '../services/api';
import { getSafeImageUrl } from '../services/api';

interface InitiativesSpotlightProps {
  projects: ProjectItem[];
  events: ClubEvent[];
  onNavigateToProjects: () => void;
  onNavigateToEvents: () => void;
}

export const InitiativesSpotlight: React.FC<InitiativesSpotlightProps> = ({
  projects,
  events,
  onNavigateToProjects,
  onNavigateToEvents,
}) => {
  const featuredProject = projects[0];
  const featuredEvent = events[0] || events[1];

  return (
    <section className="initiatives-spotlight-section">
      <div className="container">
        {/* Section Header */}
        <div className="spotlight-header text-center max-w-3xl mx-auto mb-12">
          <span className="section-tag gold inline-flex items-center gap-1.5 mb-2.5">
            <Sparkles size={14} />
            <span>GRASSROOTS INITIATIVES & IMPACT</span>
          </span>
          <h2 className="section-title">
            Our Work: <span className="text-gradient">Projects & Educational Conclaves</span>
          </h2>
          <p className="section-subtitle">
            To give our drives and community causes the dedicated space they deserve, each has its own
            comprehensive page with full details, photos, and outcomes.
          </p>
        </div>

        {/* Dual Spotlight Cards Grid */}
        <div className="spotlight-grid">
          {/* Card 1: Flagship Projects */}
          <div className="spotlight-card project-spotlight">
            <div className="spotlight-card-badge">
              <Heart size={14} className="text-rose-600 inline mr-1" />
              <span>Flagship Causes & Drives</span>
            </div>

            <div className="spotlight-card-media">
              {featuredProject ? (
                <img
                  src={getSafeImageUrl(
                    featuredProject.image,
                    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'
                  )}
                  alt="RCE Flagship Projects"
                  className="spotlight-img"
                  loading="lazy"
                />
              ) : (
                <div className="spotlight-img-placeholder" />
              )}
              <div className="spotlight-overlay-stat">
                <strong>{projects.length || 6}+</strong>
                <span>Active Causes</span>
              </div>
            </div>

            <div className="spotlight-card-content">
              <h3 className="spotlight-title">Flagship Causes & Community Programs</h3>
              <p className="spotlight-desc">
                From daily ₹5 evening tutoring hubs and free school reopening bags, to native Miyawaki afforestation
                and health conclaves across rural hubs.
              </p>

              <div className="spotlight-highlights">
                <div className="spotlight-hl-item">
                  <CheckCircle2 size={14} className="text-amber-700" />
                  <span>₹5 Paadasaalai Evening Coaching Centers</span>
                </div>
                <div className="spotlight-hl-item">
                  <CheckCircle2 size={14} className="text-amber-700" />
                  <span>Free School Backpacks & Stationery Kits</span>
                </div>
                <div className="spotlight-hl-item">
                  <CheckCircle2 size={14} className="text-amber-700" />
                  <span>Rural Community Healthcare & Eye Checkup Drives</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onNavigateToProjects}
                className="btn-primary btn-spotlight"
              >
                <span>Explore All Projects Page</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Card 2: Educational Events */}
          <div className="spotlight-card event-spotlight">
            <div className="spotlight-card-badge emerald">
              <GraduationCap size={14} className="text-emerald-700 inline mr-1" />
              <span>Educational Conclaves</span>
            </div>

            <div className="spotlight-card-media">
              {featuredEvent ? (
                <img
                  src={getSafeImageUrl(
                    featuredEvent.image,
                    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
                  )}
                  alt="RCE Educational Conclaves"
                  className="spotlight-img"
                  loading="lazy"
                />
              ) : (
                <div className="spotlight-img-placeholder" />
              )}
              <div className="spotlight-overlay-stat emerald">
                <strong>{events.length || 14}+</strong>
                <span>Conclaves Conducted</span>
              </div>
            </div>

            <div className="spotlight-card-content">
              <h3 className="spotlight-title">Educational Conclaves & Student Drives</h3>
              <p className="spotlight-desc">
                14+ state and district-level student festivals, science exhibitions, White Marathon awareness rallies,
                and good teacher award ceremonies.
              </p>

              <div className="spotlight-highlights">
                <div className="spotlight-hl-item">
                  <CheckCircle2 size={14} className="text-emerald-700" />
                  <span>State-Level Kalvi Mela 2024 (16 Competitions)</span>
                </div>
                <div className="spotlight-hl-item">
                  <CheckCircle2 size={14} className="text-emerald-700" />
                  <span>5th Annual White Marathon 2025 (Clean Sivakasi)</span>
                </div>
                <div className="spotlight-hl-item">
                  <CheckCircle2 size={14} className="text-emerald-700" />
                  <span>Tamil Nadu Govt. Pazhavam Kurungadu Recognition</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onNavigateToEvents}
                className="btn-primary btn-spotlight emerald"
              >
                <span>View All 14+ Events Page</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
