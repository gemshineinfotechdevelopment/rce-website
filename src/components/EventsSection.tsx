import React, { useState } from 'react';
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
  Clock,
  Users,
  Share2,
  Check,
  Images,
  Camera,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Video,
  Play,
} from 'lucide-react';
import type { ClubEvent } from '../services/api';
import { getSafeImageUrl, getEventImages, extractYouTubeId } from '../services/api';

interface EventsSectionProps {
  events: ClubEvent[];
  onOpenJoin: (role?: string) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ events, onOpenJoin }) => {
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);
  const [modalPhotoIndex, setModalPhotoIndex] = useState(0);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const modalContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (selectedEvent || lightboxPhoto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedEvent, lightboxPhoto]);

  React.useEffect(() => {
    if (selectedEvent && modalContainerRef.current) {
      modalContainerRef.current.scrollTop = 0;
    }
  }, [selectedEvent]);

  const handleSelectEvent = (ev: ClubEvent) => {
    setSelectedEvent(ev);
    setModalPhotoIndex(0);
  };

  const handleCopyShare = (event: ClubEvent) => {
    const shareUrl = `${window.location.origin}/#events?event=${event.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedEventId(event.id);
        setTimeout(() => setCopiedEventId(null), 2500);
      }).catch(() => {});
    }
  };

  const isScheduleOver = (ev: ClubEvent) => {
    if (!ev) return false;
    const status = (ev.status || '').toLowerCase().trim();
    if (status === 'conducted' || status === 'completed') return true;
    if (status === 'ongoing flagship') return false;
    if (!ev.date) return false;
    try {
      const parts = ev.date.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const eventEnd = new Date(year, month, day, 23, 59, 59, 999).getTime();
        return eventEnd < Date.now();
      }
      const d = new Date(ev.date).getTime();
      return !isNaN(d) && d < Date.now();
    } catch {
      return false;
    }
  };

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

  const getEventDateParts = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { month: 'EVENT', day: '•', year: dateStr };
      return {
        month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        day: d.toLocaleDateString('en-US', { day: 'numeric' }),
        year: d.toLocaleDateString('en-US', { year: 'numeric' }),
      };
    } catch {
      return { month: 'EVENT', day: '•', year: dateStr };
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
        </div>

        {/* Events Cards Grid */}
        <div className="events-impact-grid">
          {events.map((ev, index) => {
            const displayDate = formatEventDate(ev.date);
            const dateParts = getEventDateParts(ev.date);
            const statusLabel = ev.status || 'Conducted';
            const impactMetric =
              ev.studentsImpacted ||
              ev.beneficiaries ||
              (ev.slotsTotal ? `${ev.slotsTotal}+ Students Benefited` : 'Rural Children Empowered');

            const eventPhotos = getEventImages(ev);
            const defaultPhoto = getSafeImageUrl(eventPhotos[0] || ev.image, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80');

            return (
              <div key={ev.id} className="event-impact-card card-hover">
                {/* Event Photo with Overlays */}
                <div
                  className="event-card-media cursor-pointer"
                  onClick={() => handleSelectEvent(ev)}
                  title="Click to view details & all photographs"
                >
                  <img
                    src={defaultPhoto}
                    alt={ev.title}
                    className="event-card-img"
                    loading={index < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  {/* Floating Date Tile */}
                  <div className="event-date-tile" title={displayDate}>
                    <span className="date-tile-month">{dateParts.month}</span>
                    <span className="date-tile-day">{dateParts.day}</span>
                    <span className="date-tile-year">{dateParts.year}</span>
                  </div>

                  {/* Top-Right Status Badge */}
                  <div className="event-card-top-status">
                    {(ev.youtubeUrl || ev.youtubeId) && (
                      <span className="event-card-video-pill" title="Event video coverage available">
                        <Play size={10} fill="currentColor" />
                        <span>Video</span>
                      </span>
                    )}
                    {ev.formUrl && ev.formUrl.trim() ? (
                      isScheduleOver(ev) ? (
                        <span className="event-card-form-closed-badge" title="Event schedule is completed">
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

                  {/* Category Pill Tag (Bottom-Left) */}
                  <div className={`event-photo-category-tag ${getCategoryBadgeClass(ev.category)}`}>
                    {ev.category}
                  </div>

                  {/* Multi-Photo Count Pill */}
                  {eventPhotos.length > 1 && (
                    <div className="event-photo-count-pill" title={`${eventPhotos.length} photographs from this drive`}>
                      <Images size={12} />
                      <span>{eventPhotos.length} Photos</span>
                    </div>
                  )}
                </div>

                {/* Event Card Content */}
                <div className="event-card-content">
                  {/* Meta Bar: Location & Mobile Date */}
                  <div className="event-card-meta">
                    <span className="meta-item location">
                      <MapPin size={13} className="text-amber-700 flex-shrink-0" />
                      <span className="line-clamp-1">{ev.location}</span>
                    </span>
                    <span className="meta-item mobile-date">
                      <Calendar size={13} className="text-amber-700 flex-shrink-0" />
                      <span>{displayDate}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="event-card-title">{ev.title}</h3>

                  {/* Impact Metric Pill */}
                  <div className="event-impact-pill">
                    <GraduationCap size={15} className="text-amber-800 flex-shrink-0" />
                    <span className="impact-pill-text">{impactMetric}</span>
                  </div>

                  {/* Short Description */}
                  <p className="event-card-desc">{ev.description}</p>

                  {/* Card Footer: Organizer & Action Button */}
                  <div className="event-card-footer">
                    <div className="event-card-organizer">
                      <span className="organizer-label">Organized by</span>
                      <strong className="organizer-name">{ev.leader || 'RCE Initiative Team'}</strong>
                    </div>

                    <div className="event-card-actions">
                      {ev.formUrl && ev.formUrl.trim() && (
                        isScheduleOver(ev) ? (
                          <button
                            type="button"
                            onClick={() => handleSelectEvent(ev)}
                            className="btn-event-form-closed"
                            title="Schedule already completed - Registration closed (Click to view details)"
                          >
                            <Lock size={12} />
                            <span>Form Closed</span>
                          </button>
                        ) : (
                          <a
                            href={ev.formUrl.startsWith('http') ? ev.formUrl : `https://${ev.formUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-event-form"
                            title="Open Online Form / Registration"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FileText size={13} />
                            <span>Fill Form</span>
                            <ExternalLink size={12} />
                          </a>
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => handleSelectEvent(ev)}
                        className="btn-event-view"
                      >
                        <span>View Highlights</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {events.length === 0 && (
          <div className="text-center py-16 text-stone-500 bg-amber-50/40 rounded-2xl border border-amber-200/60 p-8 my-6">
            <BookOpen size={42} className="mx-auto text-amber-700 mb-3 opacity-60" />
            <h4 className="text-lg font-bold text-amber-950 mb-1">No educational programs available</h4>
            <p className="text-sm text-stone-600 max-w-md mx-auto mb-4">
              Check back soon as we update our past and completed drives.
            </p>
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
          MODAL: ADVANCED CONCLAVE & EVENT IMPACT DOSSIER
         ============================================================== */}
      {selectedEvent && (
        <div
          className="modal-overlay event-details-modal-overlay"
          onClick={() => setSelectedEvent(null)}
          role="dialog"
          aria-modal="true"
        >
          <div ref={modalContainerRef} className="modal-container event-details-modal" onClick={(e) => e.stopPropagation()}>
            {/* Floating Close Button */}
            <button
              type="button"
              className="event-modal-close-pill"
              onClick={() => setSelectedEvent(null)}
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            {/* Modal Image Banner with Multi-Photo Carousel */}
            {(() => {
              const selectedEventPhotos = selectedEvent ? getEventImages(selectedEvent) : [];
              return (
                <>
                  <div className="event-modal-media relative group">
                    <img
                      src={getSafeImageUrl(
                        selectedEventPhotos[modalPhotoIndex] || selectedEvent.image,
                        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80'
                      )}
                      alt={selectedEvent.title}
                      className="event-modal-img cursor-pointer"
                      onClick={() => setLightboxPhoto(selectedEventPhotos[modalPhotoIndex] || selectedEvent.image || '')}
                      title="Click to view full screen"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />

                    {/* Carousel Navigation Arrows */}
                    {selectedEventPhotos.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalPhotoIndex((prev) => (prev > 0 ? prev - 1 : selectedEventPhotos.length - 1));
                          }}
                          className="event-modal-nav-btn prev"
                          title="Previous photo"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalPhotoIndex((prev) => (prev < selectedEventPhotos.length - 1 ? prev + 1 : 0));
                          }}
                          className="event-modal-nav-btn next"
                          title="Next photo"
                        >
                          <ChevronRight size={20} />
                        </button>
                        <div className="event-modal-photo-counter">
                          <Camera size={13} />
                          <span>{modalPhotoIndex + 1} / {selectedEventPhotos.length}</span>
                        </div>
                      </>
                    )}

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

                  </>
              );
            })()}

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
                    href={selectedEvent.formUrl.startsWith('http') ? selectedEvent.formUrl : `https://${selectedEvent.formUrl}`}
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

              {/* YouTube Video Coverage Section */}
              {(() => {
                const yId = selectedEvent.youtubeId || (selectedEvent.youtubeUrl ? extractYouTubeId(selectedEvent.youtubeUrl) : '');
                if (!yId) return null;
                return (
                  <div className="event-modal-video-section mt-6 pt-5 border-t border-amber-200/50">
                    <div className="highlights-header-bar mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="highlights-sparkle-pill bg-red-100 text-red-600 border border-red-200">
                          <Video size={16} />
                        </div>
                        <h4 className="highlights-title">Event Video Coverage & Highlights</h4>
                      </div>
                      <a
                        href={selectedEvent.youtubeUrl || `https://www.youtube.com/watch?v=${yId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 hover:underline"
                        title="Open on YouTube in new tab"
                      >
                        <span>Watch on YouTube</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <div className="event-video-frame-wrap">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${yId}?rel=0`}
                        title={`Video coverage: ${selectedEvent.title}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                );
              })()}

              {/* Event Photo Gallery Grid */}
              {(() => {
                const galleryPhotos = selectedEvent ? getEventImages(selectedEvent) : [];
                if (galleryPhotos.length === 0) return null;
                return (
                  <div className="event-modal-gallery-container mt-6 pt-5 border-t border-amber-200/50">
                    <div className="highlights-header-bar mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="highlights-sparkle-pill">
                          <Camera size={16} />
                        </div>
                        <h4 className="highlights-title">Event Moments & Photo Gallery ({galleryPhotos.length} {galleryPhotos.length === 1 ? 'Photo' : 'Photos'})</h4>
                      </div>
                      <span className="highlights-count-badge">
                        Click photo to enlarge
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {galleryPhotos.map((photoUrl, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => {
                            setModalPhotoIndex(pIdx);
                            setLightboxPhoto(photoUrl);
                          }}
                          className={`relative rounded-xl overflow-hidden cursor-pointer group aspect-[4/3] bg-stone-100 border transition-all ${
                            pIdx === modalPhotoIndex ? 'ring-2 ring-amber-600 border-amber-600 shadow-md' : 'border-stone-200 hover:border-amber-400'
                          }`}
                          title="Click to view full photo"
                        >
                          <img
                            src={getSafeImageUrl(photoUrl)}
                            alt={`Event Moment ${pIdx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading={pIdx < 8 ? 'eager' : 'lazy'}
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <ZoomIn size={20} />
                          </div>
                          <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                            #{pIdx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

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
                      const subject = `Inquiry regarding: ${selectedEvent.title}`;
                      setSelectedEvent(null);
                      onOpenJoin(subject);
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

      {/* Lightbox Fullscreen Viewer */}
      {lightboxPhoto && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxPhoto(null)}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setLightboxPhoto(null)}
              title="Close full view"
            >
              <X size={22} />
            </button>
            <img
              src={getSafeImageUrl(lightboxPhoto)}
              alt="Enlarged event moment"
              className="lightbox-img"
            />
          </div>
        </div>
      )}
    </section>
  );
};
