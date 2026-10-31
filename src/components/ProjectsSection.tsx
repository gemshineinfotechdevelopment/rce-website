import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { ProjectItem } from '../services/api';
import { getSafeImageUrl } from '../services/api';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onOpenDonate: (cause?: string) => void;
  onOpenJoin?: (role?: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onOpenDonate,
  onOpenJoin: _onOpenJoin,
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
                  <div className="project-category-tag">{project.category}</div>
                </div>

                <div className="project-body">
                  <h3 className="project-title" title={project.title}>{project.title}</h3>

                  <p className="project-desc">{project.description || project.tagline}</p>

                  {/* Funding / Goal Progress Bar */}
                  <div className="project-progress-box">
                    <div className="progress-label-row">
                      <span className="progress-raised">
                        Raised: <strong>₹{project.raised.toLocaleString('en-IN')}</strong>
                      </span>
                      <span className="progress-goal">
                        Goal: ₹{project.goal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="progress-track" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
                      <div
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <button
                    type="button"
                    onClick={() => onOpenDonate(project.title)}
                    className="btn-card-donate-now"
                  >
                    <span>Donate Now</span>
                    <ArrowRight size={15} />
                  </button>
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
