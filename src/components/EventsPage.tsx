import React, { useState, useMemo } from 'react';
import {
  Calendar,
  FileText,
  Lock,
  MapPin,
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Search,
  ChevronRight,
  School,
  Flame,
  Clock,
  Users,
  Share2,
  Check,
} from 'lucide-react';
import type { ClubEvent } from '../services/api';
import { getSafeImageUrl } from '../services/api';

interface EventsPageProps {
  events: ClubEvent[];
  onOpenJoin: (role?: string) => void;
  onBackToHome: () => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  events,
  onOpenJoin,
  onBackToHome,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);

  const handleCopyShare = (event: ClubEvent) => {
    const shareUrl = `${window.location.origin}/#events?event=${event.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedEventId(event.id);
        setTimeout(() => setCopiedEventId(null), 2500);
      }).catch(() => {});
    }
  };

  // Search query filter logic
  const filteredEvents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return events;
    return events.filter((ev) => {
      return (
        ev.title.toLowerCase().includes(q) ||
        (ev.description && ev.description.toLowerCase().includes(q)) ||
        (ev.location && ev.location.toLowerCase().includes(q)) ||
        (ev.chiefGuest && ev.chiefGuest.toLowerCase().includes(q)) ||
        (ev.leader && ev.leader.toLowerCase().includes(q)) ||
        (ev.category && ev.category.toLowerCase().includes(q)) ||
        (ev.highlights && ev.highlights.some((h) => h.toLowerCase().includes(q)))
      );
    });
  }, [events, searchQuery]);

  const isScheduleOver = (ev: ClubEvent) => {
    if (!ev) return false;
    const status = (ev.status || '').toLowerCase().trim();
    if (status === 'conducted' || status === 'completed') return true;
    if (status === 'ongoing flagship') return false;
    if (!ev.date) return false;
    try {
      const eventDate = new Date(ev.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate < today;
    } catch {
      return false;
    }
  };

  const formatEventDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getCategoryBadgeClass = (cat?: string) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('5') || c.includes('paada')) return 'badge-cat-paada';
    if (c.includes('mela') || c.includes('science')) return 'badge-cat-mela';
    if (c.includes('teacher') || c.includes('award')) return 'badge-cat-award';
    if (c.includes('kit') || c.includes('bag')) return 'badge-cat-kit';
    if (c.includes('guidance') || c.includes('career')) return 'badge-cat-career';
    if (c.includes('forest') || c.includes('green')) return 'badge-cat-forest';
    return 'badge-cat-default';
  };

  return (
    <div className="dedicated-page-view">
      {/* Page Hero Header Banner */}
      <section className="dedicated-page-hero">
        <div className="container">
          {/* Breadcrumbs & Back Navigation */}
          <div className="page-breadcrumb-nav">
            <button
              type="button"
              onClick={onBackToHome}
              className="page-back-btn"
              title="Return to Home Page"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </button>
            <div className="page-breadcrumbs">
              <span className="breadcrumb-link" onClick={onBackToHome}>
                Home
              </span>
              <ChevronRight size={14} className="breadcrumb-separator" />
              <span className="breadcrumb-current">Events & Conclaves</span>
            </div>
          </div>

          <div className="dedicated-hero-content text-center max-w-3xl mx-auto">
            <span className="section-tag gold inline-flex items-center gap-1.5 mb-3">
              <Sparkles size={14} />
              <span>EDUCATIONAL INITIATIVES & GRASSROOTS DRIVES</span>
            </span>
            <h1 className="dedicated-page-title">
              Educational Events <span className="text-gradient">& Conclaves</span>
            </h1>
            <p className="dedicated-page-subtitle">
              Browse all {events.length}+ educational conclaves, student competitions, awareness campaigns,
              and community milestone events organized by Right Club for Education (₹5 Paadasaalai).
            </p>

            {/* Quick Metrics Ribbon */}
            <div className="page-metrics-ribbon">
              <div className="page-metric-pill">
                <Flame size={16} className="text-amber-700" />
                <span>
                  <strong>{events.length}</strong> Flagship Conclaves
                </span>
              </div>
              <div className="page-metric-pill">
                <GraduationCap size={16} className="text-emerald-700" />
                <span>
                  <strong>12,000+</strong> Students Empowered
                </span>
              </div>
              <div className="page-metric-pill">
                <School size={16} className="text-blue-700" />
                <span>
                  <strong>16+</strong> Schools & Colleges Partnered
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="dedicated-content-section">
        <div className="container">
          {/* Search Toolbar */}
          <div className="dedicated-toolbar-wrap" style={{ justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <span className="results-count-text">
              Showing <strong>{filteredEvents.length}</strong> of {events.length} conclaves & drives
              {searchQuery && ` matching "${searchQuery}"`}
            </span>

            {/* Search Input Box */}
            <div className="dedicated-search-box" style={{ maxWidth: '380px', width: '100%' }}>
              <Search size={16} className="text-stone-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search events by title, location, topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dedicated-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="search-clear-btn"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Events Cards Grid */}
          {filteredEvents.length > 0 ? (
            <div className="events-impact-grid">
              {filteredEvents.map((ev) => {
                const displayDate = formatEventDate(ev.date);
                const statusLabel = ev.status || 'Conducted';
                const impactMetric =
                  ev.studentsImpacted ||
                  ev.beneficiaries ||
                  (ev.slotsTotal ? `${ev.slotsTotal}+ Students Benefited` : 'Rural Children Empowered');

                const defaultPhoto = getSafeImageUrl(
                  ev.image,
                  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
                );

                return (
                  <article key={ev.id} className="event-impact-card card-hover">
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
                        {ev.formUrl && ev.formUrl.trim() ? (
                          isScheduleOver(ev) ? (
                            <span
                              className="event-card-form-closed-badge"
                              title="Event schedule is completed"
                            >
                              <Lock size={11} className="inline mr-1" />
                              Form Closed
                            </span>
                          ) : (
                            <span className="event-card-form-badge">
                              <FileText size={12} className="inline mr-1" />
                              Form Open
                            </span>
                          )
                        ) : (
                          <span className="event-card-status-badge">
                            <CheckCircle2 size={13} className="inline mr-1 text-emerald-400" />
                            {statusLabel}
                          </span>
                        )}
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
                        {ev.location && (
                          <span className="meta-item" title={ev.location}>
                            <MapPin size={14} className="text-amber-700" />
                            <span className="truncate max-w-[170px]">{ev.location}</span>
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="event-card-title">{ev.title}</h3>

                      {/* Impact Metric Banner */}
                      <div className="event-impact-metric-box">
                        <GraduationCap size={16} className="text-amber-800 flex-shrink-0" />
                        <span className="impact-metric-text">{impactMetric}</span>
                      </div>

                      {/* Short Description */}
                      <p className="event-card-desc">{ev.description}</p>

                      {/* Highlights Bullet Tags */}
                      {ev.highlights && ev.highlights.length > 0 && (
                        <div className="event-card-highlights">
                          {ev.highlights.slice(0, 3).map((hl, idx) => (
                            <div key={idx} className="event-hl-item">
                              <span className="hl-bullet">✓</span>
                              <span className="hl-text line-clamp-1">{hl}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Card Footer: Action Buttons */}
                      <div className="event-card-footer">
                        {ev.chiefGuest ? (
                          <span className="event-card-lead truncate max-w-[160px]" title={ev.chiefGuest}>
                            <Award size={13} className="inline mr-1 text-amber-700" />
                            {ev.chiefGuest}
                          </span>
                        ) : (
                          <span className="event-card-lead">
                            {ev.leader ? `Lead: ${ev.leader}` : 'RCE Youth Movement'}
                          </span>
                        )}

                        <div className="event-card-actions">
                          {ev.formUrl && ev.formUrl.trim() && (
                            isScheduleOver(ev) ? (
                              <button
                                type="button"
                                disabled
                                className="btn-event-form-closed"
                                title="Registration closed: The event date has completed"
                              >
                                <Lock size={12} />
                                <span>Closed</span>
                              </button>
                            ) : (
                              <a
                                href={ev.formUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-event-form"
                                title="Open Online Form / Registration"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FileText size={13} />
                                <span>Online Form</span>
                              </a>
                            )
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedEvent(ev)}
                            className="btn-event-view"
                          >
                            <span>Highlights</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state-card text-center py-16">
              <BookOpen size={44} className="mx-auto text-amber-700 mb-3 opacity-60" />
              <h3 className="text-lg font-bold text-stone-900 mb-1">No Events Found</h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto mb-4">
                We couldn't find any initiatives matching your search. Try searching with different keywords.
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="btn-primary text-sm px-5 py-2.5"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* Bottom Collaboration CTA Banner */}
          <div className="event-school-collab-banner mt-12">
            <div className="collab-banner-content">
              <div className="collab-icon-box">
                <School size={28} />
              </div>
              <div className="collab-text">
                <h3>Request an Educational Conclave for Your School or College</h3>
                <p>
                  Right Club for Education (₹5 Paadasaalai) conducts free student motivation sessions, career
                  guidance summits, and science exhibitions for government and rural matriculation institutions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenJoin('Educational Program Collaboration / School Request')}
                className="btn-primary btn-collaborate"
              >
                <span>Request Program</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Bottom Back Button */}
          <div className="dedicated-bottom-nav">
            <button
              type="button"
              onClick={onBackToHome}
              className="btn-outline inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              <span>Back to Home Page</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==============================================================
          FULL EVENT DETAILS MODAL / ADVANCED IMPACT DOSSIER
         ============================================================== */}
      {selectedEvent && (
        <div
          className="modal-overlay event-details-modal-overlay"
          onClick={() => setSelectedEvent(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-container event-details-modal" onClick={(e) => e.stopPropagation()}>
            {/* Floating Close Button */}
            <button
              type="button"
              className="event-modal-close-pill"
              onClick={() => setSelectedEvent(null)}
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            {/* Modal Image Banner */}
            <div className="event-modal-media">
              <img
                src={getSafeImageUrl(
                  selectedEvent.image,
                  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80'
                )}
                alt={selectedEvent.title}
                className="event-modal-img"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div className="event-modal-img-overlay">
                <div className="event-modal-badge-group">
                  <span className="event-modal-cat-pill">
                    {selectedEvent.category || 'General Cause'}
                  </span>
                  <span className="event-modal-status-pill">
                    <span className="status-pulse-dot"></span>
                    <span>{selectedEvent.status || 'Conducted & Honored'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="event-modal-body">
              {/* Meta Grid (4 Interactive Metric Cards) */}
              <div className="event-modal-meta-grid">
                <div className="modal-meta-card meta-card-date">
                  <div className="meta-icon-bubble">
                    <Calendar size={18} />
                  </div>
                  <div className="meta-info">
                    <span className="meta-card-label">Conclave Date</span>
                    <strong className="meta-card-value">{formatEventDate(selectedEvent.date)}</strong>
                  </div>
                </div>

                <div className="modal-meta-card meta-card-time">
                  <div className="meta-icon-bubble">
                    <Clock size={18} />
                  </div>
                  <div className="meta-info">
                    <span className="meta-card-label">Timing</span>
                    <strong className="meta-card-value">{selectedEvent.time || '10:00 AM - 01:00 PM'}</strong>
                  </div>
                </div>

                <div className="modal-meta-card meta-card-venue">
                  <div className="meta-icon-bubble">
                    <MapPin size={18} />
                  </div>
                  <div className="meta-info">
                    <span className="meta-card-label">Venue / Location</span>
                    <strong className="meta-card-value" title={selectedEvent.location || 'Tamil Nadu'}>
                      {selectedEvent.location || 'Tamil Nadu'}
                    </strong>
                  </div>
                </div>

                <div className="modal-meta-card meta-card-reach">
                  <div className="meta-icon-bubble">
                    <GraduationCap size={18} />
                  </div>
                  <div className="meta-info">
                    <span className="meta-card-label">Community Reach</span>
                    <strong className="meta-card-value text-emerald-800">
                      {selectedEvent.studentsImpacted || selectedEvent.beneficiaries || '1,200+ Students Benefited'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Title Section */}
              <div className="event-modal-header-section">
                <div className="modal-pre-title-tag">
                  <span className="dot-indicator"></span>
                  <span>RCE OFFICIAL CONCLAVE DOSSIER</span>
                </div>
                <h2 className="event-modal-title">{selectedEvent.title}</h2>
                <div className="event-modal-title-divider"></div>
              </div>

              {/* Dignitaries & Leadership Cards */}
              {(selectedEvent.chiefGuest || selectedEvent.leader) && (
                <div className="event-modal-dignitaries-grid">
                  {selectedEvent.leader && (
                    <div className="luxury-dignitary-card conclave-leader">
                      <div className="dignitary-avatar-wrap">
                        <Users size={20} className="text-emerald-700" />
                      </div>
                      <div className="dignitary-details">
                        <span className="dignitary-role-badge">CONCLAVE LEADERSHIP & EXECUTION</span>
                        <strong className="dignitary-full-name">{selectedEvent.leader}</strong>
                      </div>
                    </div>
                  )}
                  {selectedEvent.chiefGuest && (
                    <div className="luxury-dignitary-card chief-guest">
                      <div className="dignitary-avatar-wrap">
                        <Award size={20} className="text-amber-700" />
                      </div>
                      <div className="dignitary-details">
                        <span className="dignitary-role-badge">HONORED CHIEF GUEST / DIGNITARY</span>
                        <strong className="dignitary-full-name">{selectedEvent.chiefGuest}</strong>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Online Form Banner if Schedule is Over */}
              {selectedEvent.formUrl && isScheduleOver(selectedEvent) && (
                <div className="event-form-completed-alert">
                  <div className="flex items-center gap-2 font-bold text-stone-800 text-sm">
                    <Lock size={16} className="text-stone-500" />
                    <span>Registration Form is Closed (பதிவு நிறைவடைந்தது)</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    This conclave / drive was successfully conducted on {formatEventDate(selectedEvent.date)}.
                    Online applications and registrations for this drive are now concluded.
                  </p>
                </div>
              )}

              {/* Online Form Banner if Form is Open */}
              {selectedEvent.formUrl && !isScheduleOver(selectedEvent) && (
                <div className="event-form-open-card">
                  <div className="flex items-center gap-3">
                    <div className="form-icon-circle">
                      <FileText size={20} className="text-emerald-800" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">Online Participant Registration Open</h4>
                      <p className="text-xs text-stone-600">
                        Submit student names, school category, or competition entries directly via the official portal.
                      </p>
                    </div>
                  </div>
                  <a
                    href={selectedEvent.formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm py-2 px-5 whitespace-nowrap bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-2 rounded-lg"
                  >
                    <span>Fill Form / படிவம் நிரப்ப</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}

              {/* Conclave Description */}
              <div className="event-modal-desc-container">
                <div className="modal-section-headline">
                  <div className="section-icon-pill">
                    <BookOpen size={16} />
                  </div>
                  <h4>About This Conclave & Impact</h4>
                </div>
                <div className="modal-editorial-body">
                  <p>{selectedEvent.description}</p>
                </div>
              </div>

              {/* Highlights & Achievements */}
              {selectedEvent.highlights && selectedEvent.highlights.length > 0 && (
                <div className="event-modal-highlights-container">
                  <div className="highlights-header-bar">
                    <div className="flex items-center gap-2.5">
                      <div className="highlights-sparkle-pill">
                        <Sparkles size={16} />
                      </div>
                      <h4 className="highlights-title">Conclave Highlights & Milestone Outcomes</h4>
                    </div>
                    <span className="highlights-count-badge">
                      {selectedEvent.highlights.length} Milestones
                    </span>
                  </div>
                  <div className="highlights-interactive-list">
                    {selectedEvent.highlights.map((hl, i) => (
                      <div key={i} className="highlight-pill-row">
                        <div className="highlight-check-icon">
                          <CheckCircle2 size={16} />
                        </div>
                        <span className="highlight-text">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="event-modal-floating-footer">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="btn-modal-dismiss"
                >
                  Close Dossier
                </button>
                <div className="footer-right-actions">
                  <button
                    type="button"
                    onClick={() => handleCopyShare(selectedEvent)}
                    className="btn-modal-share"
                    title="Copy share link"
                  >
                    {copiedEventId === selectedEvent.id ? (
                      <>
                        <Check size={16} className="text-emerald-700" />
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={16} />
                        <span>Share Conclave</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const title = selectedEvent.title;
                      setSelectedEvent(null);
                      onOpenJoin(`Regarding Conclave: ${title}`);
                    }}
                    className="btn-modal-connect"
                  >
                    <span>Connect Regarding This Initiative</span>
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
