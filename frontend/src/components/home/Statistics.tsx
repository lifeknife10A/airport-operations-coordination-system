import React from 'react';
import './Statistics.css';
import { SpotlightCard } from '../reactbits';
import { Plane, Clock, ShieldCheck, Layers } from 'lucide-react';

const statsData = [
  {
    icon: Plane,
    value: '1,420+',
    label: 'Daily Flights Coordinated',
    subtext: '99.4% On-time dispatch rate',
    accent: 'rgba(59, 130, 246, 0.3)',
  },
  {
    icon: Clock,
    value: '28 min',
    label: 'Average Aircraft Turnaround',
    subtext: '-14% faster than industry benchmark',
    accent: 'rgba(52, 211, 153, 0.3)',
  },
  {
    icon: Layers,
    value: '98.8%',
    label: 'Gate Allocation Efficiency',
    subtext: 'Automated AI conflict resolution',
    accent: 'rgba(168, 85, 247, 0.3)',
  },
  {
    icon: ShieldCheck,
    value: '45,000+',
    label: 'Baggage Items Tracked Live',
    subtext: 'Zero-loss RFID telemetry sync',
    accent: 'rgba(245, 158, 11, 0.3)',
  },
];

export const Statistics: React.FC = () => {
  return (
    <section className="stats-section">
      <div className="stats-header">
        <span className="stats-tag">SYSTEM TELEMETRY</span>
        <h2 className="stats-title">Real-Time Operational Impact</h2>
        <p className="stats-subtitle">
          Driven by Saphire AOCS real-time data orchestration engine across 14 hubs worldwide.
        </p>
      </div>

      <div className="stats-grid">
        {statsData.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <SpotlightCard
              key={idx}
              spotlightColor={stat.accent}
              className="stat-card"
            >
              <div className="stat-icon-wrapper">
                <Icon size={24} />
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-subtext">{stat.subtext}</div>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
};

export default Statistics;
