import React, { useState, useMemo } from 'react';
import {
  Heart,
  Users,
  Search,
  ArrowLeft,
  Target,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  X,
} from 'lucide-react';
import type { ProjectItem } from '../services/api';
import { getSafeImageUrl } from '../services/api';

interface ProjectsPageProps {
  projects: ProjectItem[];
  onOpenDonate: (cause?: string) => void;
  onOpenJoin: (role?: string) => void;
  onBackToHome: () => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  onOpenDonate,
  onOpenJoin,
  onBackToHome,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically derive categories
  const categories = useMemo(() => {
    const dynamicCategories = Array.from(
      new Set(projects.map((p) => p.category?.trim()).filter(Boolean))
    ) as string[];
    return ['All', ...dynamicCategories];
  }, [projects]);

  // Filter projects by category and search query
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.tagline && p.tagline.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  // Calculate totals
  const totalRaised = useMemo(() => {
    return projects.reduce((acc, p) => acc + (p.raised || 0), 0);
  }, [projects]);

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
              <span className="breadcrumb-current">Projects & Causes</span>
            </div>
          </div>

          <div className="dedicated-hero-content text-center max-w-3xl mx-auto">
            <span className="section-tag gold inline-flex items-center gap-1.5 mb-3">
              <Sparkles size={14} />
              <span>COMMUNITY INITIATIVES & GRASSROOTS CAUSES</span>
            </span>
            <h1 className="dedicated-page-title">
              Our Flagship <span className="text-gradient">Projects & Drives</span>
            </h1>
            <p className="dedicated-page-subtitle">
              Every initiative addresses an urgent community necessity across education, healthcare,
              environmental restoration, and rural skill development. Choose how you would like to contribute.
            </p>

            {/* Quick Metrics Ribbon */}
            <div className="page-metrics-ribbon">
              <div className="page-metric-pill">
                <Target size={16} className="text-amber-700" />
                <span>
                  <strong>{projects.length}</strong> Flagship Causes
                </span>
              </div>
              <div className="page-metric-pill">
                <Heart size={16} className="text-rose-600" />
                <span>
                  <strong>₹{totalRaised.toLocaleString('en-IN')}</strong> Community Contributions
                </span>
              </div>
              <div className="page-metric-pill">
                <ShieldCheck size={16} className="text-emerald-700" />
                <span>
                  <strong>80G</strong> Tax Exemption Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="dedicated-content-section">
        <div className="container">
          {/* Filter & Search Toolbar */}
          <div className="dedicated-toolbar-wrap">
            {/* Category Filter Pills */}
            <div className="category-filter-bar flex-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat === 'All' ? 'All Causes' : cat}
                </button>
              ))}
            </div>

            {/* Search Input Box */}
            <div className="dedicated-search-box">
              <Search size={16} className="text-stone-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search projects by title, category, keyword..."
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

          {/* Results Summary Bar */}
          <div className="dedicated-results-meta">
            <span className="results-count-text">
              Showing <strong>{filteredProjects.length}</strong> of {projects.length} initiatives
              {selectedCategory !== 'All' && ` under "${selectedCategory}"`}
              {searchQuery && ` matching "${searchQuery}"`}
            </span>
            {(selectedCategory !== 'All' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="clear-all-filters-btn"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Projects Cards Grid */}
          {filteredProjects.length > 0 ? (
            <div className="projects-grid">
              {filteredProjects.map((project) => {
                const percent = Math.min(
                  100,
                  Math.round(((project.raised || 0) / (project.goal || 1)) * 100)
                );
                return (
                  <article key={project.id} className="project-card card-hover">
                    <div className="project-media">
                      <img
                        src={getSafeImageUrl(
                          project.image,
                          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'
                        )}
                        alt={project.title}
                        className="project-img"
                        loading="lazy"
                      />
                      <span className="project-category-badge">{project.category}</span>
                      {project.badge && (
                        <span className="project-highlight-badge">{project.badge}</span>
                      )}
                    </div>

                    <div className="project-content">
                      <h3 className="project-title">{project.title}</h3>
                      <p className="project-tagline">{project.tagline}</p>

                      {project.description && (
                        <p className="project-desc line-clamp-3 text-xs text-stone-600 mb-3">
                          {project.description}
                        </p>
                      )}

                      {/* Fund Progress Bar */}
                      <div className="project-progress-wrap">
                        <div className="progress-labels">
                          <span className="raised-label">
                            Raised: <strong>₹{(project.raised || 0).toLocaleString('en-IN')}</strong>
                          </span>
                          <span className="percent-label">{percent}%</span>
                        </div>
                        <div className="progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
                          <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                        </div>
                        <div className="goal-label">
                          Goal: ₹{(project.goal || 0).toLocaleString('en-IN')}
                        </div>
                      </div>

                      {/* Beneficiaries & Volunteers Meta */}
                      <div className="project-meta-strip">
                        <span className="meta-pill" title="Target beneficiaries">
                          <CheckCircle2 size={13} className="text-emerald-600" />
                          <span>{project.beneficiaries || 'Rural Community'}</span>
                        </span>
                        <span className="meta-pill" title="Volunteers currently enrolled">
                          <Users size={13} className="text-amber-700" />
                          <span>{project.volunteersEnrolled || 24} Enrolled</span>
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="project-actions">
                        <button
                          type="button"
                          onClick={() => onOpenDonate(project.title)}
                          className="btn-primary btn-project-donate flex-1"
                          title={`Contribute to ${project.title}`}
                        >
                          <Heart size={15} fill="currentColor" />
                          <span>Support This Cause</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenJoin('Volunteer')}
                          className="btn-outline btn-project-join"
                          title="Join this initiative as a volunteer"
                        >
                          <Users size={15} />
                          <span>Join Drive</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state-card text-center py-16">
              <Heart size={44} className="mx-auto text-amber-700 mb-3 opacity-60" />
              <h3 className="text-lg font-bold text-stone-900 mb-1">No Projects Found</h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto mb-4">
                We couldn't find any initiatives matching your selected filters. Try searching with different keywords.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="btn-primary text-sm px-5 py-2.5"
              >
                View All Projects
              </button>
            </div>
          )}

          {/* Bottom Back Button & CTA */}
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
    </div>
  );
};
