import React from 'react';
import { Users, TreePine, Award, RefreshCw } from 'lucide-react';
import type { ClubStats } from '../services/api';

interface StatsRibbonProps {
  stats: ClubStats;
  onRefreshStats: () => void;
  isLoading: boolean;
}

export const StatsRibbon: React.FC<StatsRibbonProps> = ({ stats, onRefreshStats, isLoading }) => {
  const statCards = [
    {
      label: 'Active Volunteers',
      value: stats.activeVolunteers.toLocaleString() + '+',
      desc: 'Youth & community mentors',
      icon: <Users size={24} color="#78350f" />,
      colorClass: 'card-green',
    },
    {
      label: 'Completed Drives',
      value: stats.projectsCompleted + '+',
      desc: 'Educational & social programs',
      icon: <Award size={24} color="#d97706" />,
      colorClass: 'card-purple',
    },
    {
      label: 'Saplings Planted',
      value: stats.treesPlanted.toLocaleString() + '+',
      desc: 'Native Miyawaki groves',
      icon: <TreePine size={24} color="#92400e" />,
      colorClass: 'card-emerald',
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
