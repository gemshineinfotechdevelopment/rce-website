import React from 'react';
import { Users, Heart, TreePine, Award, Stethoscope, Utensils, RefreshCw } from 'lucide-react';
import type { ClubStats } from '../services/api';

interface StatsRibbonProps {
  stats: ClubStats;
  onRefreshStats: () => void;
  isLoading: boolean;
}

export const StatsRibbon: React.FC<StatsRibbonProps> = ({ stats, onRefreshStats, isLoading }) => {
  const statCards = [
    {
      label: 'Lives Impacted',
      value: stats.livesImpacted.toLocaleString() + '+',
      desc: 'Through education & relief',
      icon: <Heart size={24} color="#b45309" fill="#fef3c7" />,
      colorClass: 'card-orange',
    },
    {
      label: 'Active Volunteers',
      value: stats.activeVolunteers.toLocaleString() + '+',
      desc: 'Youth & community mentors',
      icon: <Users size={24} color="#78350f" />,
      colorClass: 'card-green',
    },
    {
      label: 'Saplings Planted',
      value: stats.treesPlanted.toLocaleString() + '+',
      desc: 'Native Miyawaki groves',
      icon: <TreePine size={24} color="#92400e" />,
      colorClass: 'card-emerald',
    },
    {
      label: 'Free Health Camps',
      value: stats.medicalCamps + '+',
      desc: 'Eye screenings & diagnostics',
      icon: <Stethoscope size={24} color="#d97706" />,
      colorClass: 'card-blue',
    },
    {
      label: 'Nutritious Meals',
      value: stats.mealsServed.toLocaleString() + '+',
      desc: 'Zero-hunger weekend drives',
      icon: <Utensils size={24} color="#b45309" />,
      colorClass: 'card-amber',
    },
    {
      label: 'Completed Drives',
      value: stats.projectsCompleted + '+',
      desc: 'Across 14 cities & towns',
      icon: <Award size={24} color="#d97706" />,
      colorClass: 'card-purple',
    },
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-header-bar">
          <div>
            <span className="section-tag gold">Real-Time Impact Metrics</span>
            <h2 className="stats-title">Our Collective Footprint on Society</h2>
          </div>
          <button 
            type="button" 
            onClick={onRefreshStats} 
            className="btn-outline btn-refresh"
            title="Sync with backend database"
            disabled={isLoading}
          >
            <RefreshCw size={14} className={isLoading ? 'spin-icon' : ''} />
            <span>{isLoading ? 'Syncing...' : 'Live Sync'}</span>
          </button>
        </div>

        <div className="stats-grid">
          {statCards.map((card, idx) => (
            <div key={idx} className={`stat-card ${card.colorClass}`}>
              <div className="stat-card-icon-wrap">
                {card.icon}
              </div>
              <div className="stat-card-content">
                <div className="stat-card-val">{card.value}</div>
                <div className="stat-card-label">{card.label}</div>
                <div className="stat-card-desc">{card.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
