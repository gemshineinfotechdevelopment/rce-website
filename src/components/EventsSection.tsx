import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import type { ClubEvent } from '../services/api';

interface EventsSectionProps {
  events: ClubEvent[];
  onOpenJoin: (role?: string) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ events, onOpenJoin }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);

  // Derive unique categories for filtering
  const categories = [
    'All',
    '₹5 Paadasaalai',
    'Kalvi Mela',
    'Teachers Award',
    'Kit Distribution',
    'Education Awareness',
    'Career Guidance',
  ];

  const filteredEvents =
    activeCategory === 'All'
      ? events
      : events.filter(
          (ev) =>
            ev.category?.toLowerCase() === activeCategory.toLowerCase() ||
            (activeCategory === 'Teachers Award' && ev.category?.toLowerCase().includes('teacher')) ||
            (activeCategory === '₹5 Paadasaalai' && (ev.category?.includes('5') || ev.title?.includes('5')))
        );

  const getCategoryBadgeClass = (category = '') => {
    const c = category.toLowerCase();
    if (c.includes('5') || c.includes('paadasaalai')) return 'cat-paadasaalai';
    if (c.includes('mela') || c.includes('fair') || c.includes('science')) return 'cat-kalvimela';
    if (c.includes('teacher') || c.includes('award')) return 'cat-award';
    if (c.includes('kit') || c.includes('bag') || c.includes('book')) return 'cat-distribution';
    if (c.includes('marathon') || c.includes('awareness')) return 'cat-awareness';
    if (c.includes('career') || c.includes('guidance')) return 'cat-career';
    return 'cat-default';
  };

  const formatEventDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="events" className="events-section">
      <div className="container">
        {/* Section Header */}
        <div className="events-header text-center">
          <span className="section-tag gold">
            <Sparkles size={14} className="inline mr-1" />
            நடைபெற்ற கல்விப் பணிகள் • Our Educational Impact
          </span>
          <h2 className="section-title">
            Conducted Educational Initiatives & <span className="text-gradient">Impact Programs</span>
          </h2>
          <p className="section-subtitle">
            Explore the transformative educational milestones accomplished by Right Club for Education (RCE) — 
            from daily ₹5 Paadasaalai evening centers and statewide Kalvi Melas, to honoring dedicated teachers 
            and distributing study kits to rural government school children.
          </p>

          {/* Category Filter Pills */}
          <div className="event-filters-row">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`event-filter-pill ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat === 'All' && 'All Programs'}
                {cat === '₹5 Paadasaalai' && '₹5 Paadasaalai Centers'}
                {cat === 'Kalvi Mela' && 'Kalvi Mela & Science Expo'}
                {cat === 'Teachers Award' && 'Good Teacher Awards'}
                {cat === 'Kit Distribution' && 'School Kits & Aid'}
                {cat === 'Education Awareness' && 'Marathons & Rallies'}
                {cat === 'Career Guidance' && 'Higher Education Guidance'}
              </button>
            ))}
          </div>
        </div>

        {/* Events Cards Grid */}
        <div className="events-impact-grid">
          {filteredEvents.map((ev) => {
            const displayDate = formatEventDate(ev.date);
            const statusLabel = ev.status || 'Conducted';
            const impactMetric =
              ev.studentsImpacted ||
              ev.beneficiaries ||
              (ev.slotsTotal ? `${ev.slotsTotal}+ Students Benefited` : 'Rural Children Empowered');

            const defaultPhoto =
              ev.image ||
              'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80';

            return (
              <div key={ev.id} className="event-impact-card card-hover">
                {/* Event Photo with Overlays */}
                <div className="event-card-media">
                  <img
                    src={defaultPhoto}
                    alt={ev.title}
                    className="event-card-img"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="event-card-overlay">
                    <span className={`event-card-cat-badge ${getCategoryBadgeClass(ev.category)}`}>
                      {ev.category}
                    </span>
                    <span className="event-card-status-badge">
                      <CheckCircle2 size={13} className="inline mr-1 text-emerald-400" />
                      {statusLabel}
                    </span>
                  </div>
                </div>

                {/* Event Card Content */}
                <div className="event-card-content">
                  {/* Meta Bar: Date & Location */}
                  <div className="event-card-meta">
                    <span className="meta-item">
                      <Calendar size={14} className="text-amber-700" />
                      {displayDate}
                    </span>
                    <span className="meta-item">
                      <MapPin size={14} className="text-amber-700" />
                      <span className="line-clamp-1">{ev.location}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="event-card-title">{ev.title}</h3>

                  {/* Impact Metric Banner */}
                  <div className="event-impact-metric-box">
                    <GraduationCap size={16} className="text-amber-800 flex-shrink-0" />
                    <span className="event-impact-metric-text">{impactMetric}</span>
                  </div>

                  {/* Short Description */}
                  <p className="event-card-desc">{ev.description}</p>

                  {/* Highlights Bullet Tags */}
                  {ev.highlights && ev.highlights.length > 0 && (
                    <div className="event-card-highlights">
                      {ev.highlights.slice(0, 3).map((hl, idx) => (
                        <div key={idx} className="highlight-pill">
                          <CheckCircle2 size={12} className="text-amber-600 flex-shrink-0" />
                          <span className="line-clamp-1">{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Card Footer: Organizer & Action Button */}
                  <div className="event-card-footer">
                    <div className="event-card-organizer">
                      <span className="text-stone-400 text-xs block">Organized by</span>
                      <strong className="text-stone-700 text-xs">{ev.leader || 'RCE Initiative Team'}</strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedEvent(ev)}
                      className="btn-event-view"
                    >
                      <span>View Highlights</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16 text-stone-500 bg-amber-50/40 rounded-2xl border border-amber-200/60 p-8 my-6">
            <BookOpen size={42} className="mx-auto text-amber-700 mb-3 opacity-60" />
            <h4 className="text-lg font-bold text-amber-950 mb-1">No programs found under "{activeCategory}"</h4>
            <p className="text-sm text-stone-600 max-w-md mx-auto mb-4">
              Select another educational category or check back as we update our past and completed drives.
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className="btn-secondary text-sm px-4 py-2"
            >
              View All Programs
            </button>
          </div>
        )}

        {/* Bottom Banner: Call to Collaborate / Invite RCE */}
        <div className="events-collaborate-banner mt-14">
          <div className="collaborate-banner-content">
            <div className="collaborate-banner-text">
              <span className="collaborate-tag">Connect With RCE</span>
              <h3 className="collaborate-title">Want to Conduct an Educational Program or ₹5 Paadasaalai in Your Village?</h3>
              <p className="collaborate-desc">
                Right Club for Education partners with government schools, village panchayats, and volunteer youth 
                to set up evening study hubs, career guidance seminars, and book exhibitions.
              </p>
            </div>
            <div className="collaborate-banner-action">
              <button
                type="button"
                onClick={() => onOpenJoin('Educational Program Collaboration / School Request')}
                className="btn-primary btn-collaborate"
              >
                <span>Request Program for Your School</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          MODAL: FULL EVENT DETAILS & REPORT
         ============================================================== */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div
            className="modal-content event-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setSelectedEvent(null)}
              aria-label="Close Modal"
            >
              <X size={20} />
            </button>

            {/* Modal Image Banner */}
            <div className="event-modal-media">
              <img
                src={
                  selectedEvent.image ||
                  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80'
                }
                alt={selectedEvent.title}
                className="event-modal-img"
              />
              <div className="event-modal-img-overlay">
                <span className={`event-card-cat-badge ${getCategoryBadgeClass(selectedEvent.category)}`}>
                  {selectedEvent.category}
                </span>
                <span className="event-card-status-badge">
                  <CheckCircle2 size={14} className="inline mr-1 text-emerald-400" />
                  {selectedEvent.status || 'Conducted'}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="event-modal-body">
              {/* Meta Grid */}
              <div className="event-modal-meta-grid">
                <div className="modal-meta-cell">
                  <span className="meta-cell-label">Date</span>
                  <span className="meta-cell-value">
                    <Calendar size={14} className="text-amber-700 inline mr-1.5" />
                    {formatEventDate(selectedEvent.date)}
                  </span>
                </div>
                {selectedEvent.time && (
                  <div className="modal-meta-cell">
                    <span className="meta-cell-label">Timing</span>
                    <span className="meta-cell-value">{selectedEvent.time}</span>
                  </div>
                )}
                <div className="modal-meta-cell">
                  <span className="meta-cell-label">Location / Venue</span>
                  <span className="meta-cell-value">
                    <MapPin size={14} className="text-amber-700 inline mr-1.5" />
                    {selectedEvent.location}
                  </span>
                </div>
                <div className="modal-meta-cell">
                  <span className="meta-cell-label">Coordinator</span>
                  <span className="meta-cell-value">{selectedEvent.leader || 'RCE Team'}</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="event-modal-title">{selectedEvent.title}</h2>

              {/* Impact Banner */}
              <div className="event-modal-impact-banner">
                <div className="impact-icon-circle">
                  <GraduationCap size={22} className="text-amber-800" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-extrabold text-amber-800 block">
                    Total Educational Impact
                  </span>
                  <span className="text-lg font-black text-amber-950">
                    {selectedEvent.studentsImpacted ||
                      selectedEvent.beneficiaries ||
                      '1,000+ Students Benefited'}
                  </span>
                </div>
              </div>

              {/* Full Description */}
              <div className="event-modal-desc-box">
                <h4 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Program Overview & Achievements
                </h4>
                <p className="text-stone-700 leading-relaxed text-sm md:text-base">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Chief Guest / Dignitaries if available */}
              {selectedEvent.chiefGuest && (
                <div className="event-modal-guest-box">
                  <Award size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">Special Dignitaries / Chief Guest:</span>
                    <span className="text-sm text-stone-800 font-semibold">{selectedEvent.chiefGuest}</span>
                  </div>
                </div>
              )}

              {/* Key Highlights List */}
              {selectedEvent.highlights && selectedEvent.highlights.length > 0 && (
                <div className="event-modal-highlights-section">
                  <h4 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-600" />
                    Key Milestones & Deliverables
                  </h4>
                  <div className="event-modal-highlights-grid">
                    {selectedEvent.highlights.map((hl, i) => (
                      <div key={i} className="modal-highlight-item">
                        <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-stone-700 font-medium">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="event-modal-footer">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="btn-outline text-sm py-2.5 px-5"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const subject = `Inquiry regarding: ${selectedEvent.title}`;
                    setSelectedEvent(null);
                    onOpenJoin(subject);
                  }}
                  className="btn-primary text-sm py-2.5 px-6"
                >
                  <span>Connect Regarding This Initiative</span>
                  <ExternalLink size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
