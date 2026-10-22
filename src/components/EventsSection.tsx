import React from 'react';
import { Clock, MapPin, UserCheck, ArrowRight } from 'lucide-react';
import type { ClubEvent } from '../services/api';

interface EventsSectionProps {
  events: ClubEvent[];
  onOpenJoin: (role?: string) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ events, onOpenJoin }) => {
  return (
    <section id="events" className="events-section">
      <div className="container">
        <div className="events-header text-center">
          <span className="section-tag gold">On-Ground Action</span>
          <h2 className="section-title">
            Upcoming Drives & <span className="text-gradient">Volunteer Events</span>
          </h2>
          <p className="section-subtitle">
            Spend your weekends where it counts most. Join our passionate field teams, meet incredible volunteers, and touch real lives.
          </p>
        </div>

        <div className="events-grid">
          {events.map((ev) => {
            const eventDate = new Date(ev.date);
            const monthStr = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
            const dayStr = eventDate.getDate();

            return (
              <div key={ev.id} className="event-card card-hover">
                <div className="event-date-box">
                  <span className="event-month">{monthStr}</span>
                  <span className="event-day">{dayStr}</span>
                </div>

                <div className="event-details">
                  <div className="event-meta-top">
                    <span className="event-category-badge">{ev.category}</span>
                    <span className="event-slots-left">
                      {ev.slotsTotal - ev.slotsBooked} slots remaining
                    </span>
                  </div>

                  <h3 className="event-title">{ev.title}</h3>

                  <div className="event-info-rows">
                    <div className="event-info-item">
                      <Clock size={15} color="#b45309" />
                      <span>{ev.time}</span>
                    </div>
                    <div className="event-info-item">
                      <MapPin size={15} color="#78350f" />
                      <span>{ev.location}</span>
                    </div>
                  </div>

                  <p className="event-desc">{ev.description}</p>

                  <div className="event-footer">
                    <span className="event-lead">
                      <UserCheck size={14} className="inline mr-1 text-stone-500" />
                      Coordinator: <strong>{ev.leader}</strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => onOpenJoin(`Event RSVP: ${ev.title}`)}
                      className="btn-secondary btn-event-rsvp"
                    >
                      <span>RSVP / Join Drive</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
