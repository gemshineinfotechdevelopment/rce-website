import React, { useState } from 'react';
import { Camera, X, ZoomIn } from 'lucide-react';
import type { GalleryItem } from '../services/api';

interface GallerySectionProps {
  items?: GalleryItem[];
}

const defaultGalleryItems: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Miyawaki Urban Forest Drive',
    category: 'Environment',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    location: 'Kattivakkam Lake',
    year: '2026',
  },
  {
    id: 'g-2',
    title: 'Vidhya Connect Book Distribution',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    location: 'Govt Model High School',
    year: '2026',
  },
  {
    id: 'g-3',
    title: 'Free Community Eye Screening',
    category: 'Healthcare',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    location: 'Rural Health Center',
    year: '2026',
  },
  {
    id: 'g-4',
    title: 'Annapoorna Food Aid Distribution',
    category: 'Relief',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    location: 'GH Attendant Shelters',
    year: '2026',
  },
  {
    id: 'g-5',
    title: 'Youth Leadership & Sports Fest',
    category: 'Youth',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    location: 'District Stadium',
    year: '2026',
  },
  {
    id: 'g-6',
    title: 'Women Sewing Machine Donation',
    category: 'Empowerment',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
    location: 'Shakthi Skill Center',
    year: '2026',
  },
];

export const GallerySection: React.FC<GallerySectionProps> = ({ items }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [lightboxImg, setLightboxImg] = useState<GalleryItem | null>(null);

  const galleryItems = items && items.length > 0 ? items : defaultGalleryItems;

  // Extract unique categories from items
  const uniqueCats = Array.from(new Set(galleryItems.map((i) => i.category)));
  const categories = ['All', ...uniqueCats];

  const filtered =
    activeTab === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeTab);

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
        </div>

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
