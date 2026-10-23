import React, { useState } from 'react';
import { Camera, X, ZoomIn } from 'lucide-react';
import type { GalleryItem } from '../services/api';

interface GallerySectionProps {
  items?: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items = [] }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [lightboxImg, setLightboxImg] = useState<GalleryItem | null>(null);

  // Extract unique categories directly from backend items
  const uniqueCats = Array.from(new Set(items.map((i) => i.category))).filter(Boolean);
  const categories = ['All', ...uniqueCats];

  const filtered =
    activeTab === 'All'
      ? items
      : items.filter((item) => item.category === activeTab);

  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <div className="gallery-header text-center">
          <span className="section-tag gold">
            <Camera size={14} color="#b45309" />
            Visual Evidence of Impact
          </span>
          <h2 className="section-title">
            Moments That <span className="text-gradient">Define Our Journey</span>
          </h2>
          <p className="section-subtitle">
            Smiles on young faces, green canopies rising from barren soil, and communities standing together in solidarity.
          </p>

          {categories.length > 1 && (
            <div className="category-filter-bar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveTab(cat)}
                  className={`filter-pill ${activeTab === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 text-stone-500">
            <p>No photos added yet. Use the Admin Portal to upload gallery photos.</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="gallery-item card-hover"
                onClick={() => setLightboxImg(item)}
                role="button"
                tabIndex={0}
                aria-label={`View photo ${item.title}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="gallery-img"
                  loading="lazy"
                />
                <div className="gallery-overlay">
                  <span className="gallery-zoom-icon">
                    <ZoomIn size={20} />
                  </span>
                  <div className="gallery-item-meta">
                    <span className="gallery-item-cat">{item.category}</span>
                    <h4 className="gallery-item-title">{item.title}</h4>
                    <span className="gallery-item-loc">{item.location} &bull; {item.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {lightboxImg && (
          <div className="modal-overlay" onClick={() => setLightboxImg(null)}>
            <div
              className="lightbox-box"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="lightbox-close"
                onClick={() => setLightboxImg(null)}
                aria-label="Close photo view"
              >
                <X size={24} />
              </button>
              <img
                src={lightboxImg.image}
                alt={lightboxImg.title}
                className="lightbox-img"
              />
              <div className="lightbox-caption">
                <span className="section-tag gold">{lightboxImg.category}</span>
                <h3>{lightboxImg.title}</h3>
                <p>{lightboxImg.location} &bull; {lightboxImg.year}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
