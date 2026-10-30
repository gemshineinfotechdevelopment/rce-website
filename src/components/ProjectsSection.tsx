import React, { useState } from 'react';
import { Heart, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import type { ProjectItem } from '../services/api';
import { getSafeImageUrl } from '../services/api';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onOpenDonate: (cause?: string) => void;
  onOpenJoin: (role?: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onOpenDonate,
  onOpenJoin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const dynamicCategories = Array.from(
    new Set(projects.map((p) => p.category?.trim()).filter(Boolean))
  ) as string[];

  const categories = ['All', ...dynamicCategories];

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter(
          (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <div className="projects-header text-center">
          <span className="section-tag gold">Impactful Initiatives</span>
          <h2 className="section-title">
            Our Flagship <span className="text-gradient">Projects & Drives</span>
          </h2>
          <p className="section-subtitle">
            Every initiative addresses a critical community necessity. Explore our ongoing projects and choose how you would like to contribute.
          </p>

          {/* Category Filter Pills (Like MyKutumb modern filter UI) */}
          <div className="category-filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => {
            const percentage = Math.min(
              100,
              Math.round((project.raised / project.goal) * 100)
            );

            return (
              <div key={project.id} className="project-card card-hover">
                <div className="project-img-box">
                  <img
                    src={getSafeImageUrl(project.image, 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80')}
                    alt={project.title}
                    className="project-img"
                    loading="lazy"
                  />
                  <div className="project-badge-pill">{project.badge}</div>
                  <div className="project-category-tag">{project.category}</div>
                </div>

                <div className="project-body">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-tagline">{project.tagline}</p>

                  <p className="project-desc">{project.description}</p>

                  {/* Highlights */}
                  <div className="project-highlights">
                    {project.highlights.map((h, i) => (
                      <div key={i} className="highlight-pill">
                        <CheckCircle2 size={13} color="#b45309" className="flex-shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Funding / Goal Progress Bar */}
                  <div className="project-progress-box">
                    <div className="progress-label-row">
                      <span className="progress-raised">
                        <strong>₹{project.raised.toLocaleString()}</strong> raised
                      </span>
                      <span className="progress-percent">{percentage}%</span>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>

                    <div className="progress-meta-row">
                      <span className="progress-goal">Goal: ₹{project.goal.toLocaleString()}</span>
                      <span className="progress-volunteers">
                        <Users size={12} className="inline mr-1" />
                        {project.volunteersEnrolled} Volunteers
                      </span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="project-card-actions">
                    <button
                      type="button"
                      onClick={() => onOpenDonate(project.title)}
                      className="btn-primary flex-1 btn-card-donate"
                    >
                      <Heart size={16} fill="currentColor" />
                      <span>Donate</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenJoin('Volunteer')}
                      className="btn-outline flex-1 btn-card-volunteer"
                    >
                      <span>Volunteer</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 text-stone-500">
            <p>No projects currently under this category. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};
