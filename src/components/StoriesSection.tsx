import React from 'react';
import { Quote, Sparkles } from 'lucide-react';
import type { StoryItem } from '../services/api';

interface StoriesSectionProps {
  stories: StoryItem[];
}

export const StoriesSection: React.FC<StoriesSectionProps> = ({ stories }) => {
  return (
    <section id="stories" className="stories-section">
      <div className="container">
        <div className="stories-header text-center">
          <span className="section-tag gold">
            <Sparkles size={14} color="#d97706" />
            Voices of Change
          </span>
          <h2 className="section-title">
            Stories that <span className="text-gradient">Fuel Our Purpose</span>
          </h2>
          <p className="section-subtitle">
            Every notebook given, sapling planted, and meal served creates ripples across families and neighborhoods.
          </p>
        </div>

        <div className="stories-grid">
          {stories.map((story) => (
            <div key={story.id} className="story-card card-hover">
              <div className="story-quote-icon">
                <Quote size={32} color="#edd9c5" />
              </div>

              <p className="story-quote-text">"{story.quote}"</p>

              <div className="story-user-row">
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="story-avatar"
                  loading="lazy"
                />
                <div className="story-user-meta">
                  <h4 className="story-user-name">{story.name}</h4>
                  <p className="story-user-role">{story.role}</p>
                  <span className="story-location-tag">{story.location}</span>
                </div>
                <div className="story-impact-badge">
                  <span>{story.impactTag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {stories.length === 0 && (
          <div className="text-center py-12 text-stone-500">
            <p>No testimonials published yet. Publish new stories from the Admin Portal.</p>
          </div>
        )}
      </div>
    </section>
  );
};
