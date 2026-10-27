import React, { useState } from 'react';
import {
  Play,
  Tv,
  ExternalLink,
  MapPin,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import type { VideoItem } from '../services/api';
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from '../services/api';

interface VideoShowcaseProps {
  videos: VideoItem[];
}

export const VideoShowcase: React.FC<VideoShowcaseProps> = ({ videos }) => {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [autoPlayActive, setAutoPlayActive] = useState<boolean>(false);

  // If no videos provided, do not render or show empty state gracefully
  if (!videos || videos.length === 0) {
    return null;
  }

  // Determine current active video (default to featured or first video)
  const currentVideo =
    videos.find((v) => v.id === selectedVideoId) ||
    videos.find((v) => v.featured) ||
    videos[0];

  const handleSelectVideo = (video: VideoItem) => {
    setSelectedVideoId(video.id);
    setAutoPlayActive(true);
  };

  return (
    <section id="videos" className="video-showcase-section">
      <div className="container">
        {/* Section Header */}
        <div className="video-section-header">
          <div className="section-tag-gold-pill">
            <span className="live-dot-pulse"></span>
            <Tv size={14} className="text-amber-500" />
            <span>CINEMA & GROUND IMPACT MEDIA</span>
          </div>

          <h2 className="video-section-title">
            Witness Our Ground Drives <span className="title-gradient-gold">In Motion</span>
          </h2>
          <p className="video-section-subtitle">
            Watch passionate student volunteers transforming communities across environmental drives, school mentorship, and healthcare camps.
          </p>
        </div>

        {/* Cinema Theater Stage */}
        <div className="cinema-theater-stage">
          {/* Main Cinema Screen (Left) */}
          <div className="cinema-main-stage">
            <div className="cinema-screen-frame">
              <div className="cinema-screen-glow"></div>
              <div className="video-iframe-wrapper">
                <iframe
                  src={getYouTubeEmbedUrl(currentVideo.youtubeId, autoPlayActive)}
                  title={currentVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="youtube-cinema-iframe"
                />
              </div>
            </div>

            {/* Current Video Control Bar / Details */}
            <div className="cinema-meta-box">
              <div className="cinema-meta-top">
                <div className="flex items-center gap-2 flex-wrap">
                  {currentVideo.duration && (
                    <span className="cinema-pill-meta">
                      <Clock size={12} /> {currentVideo.duration}
                    </span>
                  )}
                  {currentVideo.location && (
                    <span className="cinema-pill-meta">
                      <MapPin size={12} /> {currentVideo.location}
                    </span>
                  )}
                  <span className="cinema-pill-meta active-pulse">
                    <span className="status-ping-dot green"></span>
                    <span>HD 1080p Stream</span>
                  </span>
                </div>

                <a
                  href={currentVideo.youtubeUrl || `https://www.youtube.com/watch?v=${currentVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-watch-youtube"
                  title="Watch on official YouTube channel"
                >
                  <span>Watch on YouTube</span>
                  <ExternalLink size={13} />
                </a>
              </div>

              <h3 className="cinema-video-title">{currentVideo.title}</h3>
              {currentVideo.description && (
                <p className="cinema-video-desc">{currentVideo.description}</p>
              )}
            </div>
          </div>

          {/* Side Playlist Reel ("side la run agura marii") */}
          <div className="cinema-side-reel">
            <div className="side-reel-header">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-amber-400" />
                <h4>Impact Reel Playlist</h4>
              </div>
              <span className="side-reel-count">{videos.length} Videos</span>
            </div>

            <div className="side-reel-list custom-cinema-scrollbar">
              {videos.map((video) => {
                const isSelected = video.id === currentVideo.id;
                const thumb = getYouTubeThumbnail(video.youtubeId);

                return (
                  <div
                    key={video.id}
                    className={`side-reel-card ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectVideo(video)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Play video: ${video.title}`}
                  >
                    {/* Thumbnail with overlay */}
                    <div className="side-reel-thumb-box">
                      <img
                        src={thumb}
                        alt={video.title}
                        className="side-reel-thumb-img"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to high quality or hero placeholder if thumbnail fails
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <div className="side-reel-overlay">
                        {isSelected ? (
                          <div className="cinema-playing-bars">
                            <span className="bar bar1"></span>
                            <span className="bar bar2"></span>
                            <span className="bar bar3"></span>
                          </div>
                        ) : (
                          <div className="side-reel-play-icon">
                            <Play size={14} fill="currentColor" />
                          </div>
                        )}
                      </div>
                      {video.duration && (
                        <span className="side-reel-duration">{video.duration}</span>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="side-reel-info">
                      <div className="flex items-center justify-between mb-1">
                        {video.location ? (
                          <span className="side-reel-location">📍 {video.location}</span>
                        ) : (
                          <span></span>
                        )}
                        {isSelected && <span className="now-playing-label">NOW PLAYING</span>}
                      </div>
                      <h5 className="side-reel-title">{video.title}</h5>
                    </div>

                    <div className="side-reel-arrow">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
