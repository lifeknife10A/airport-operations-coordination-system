import React from 'react';
import './Services.css';
import { SpotlightCard } from '../reactbits';
import { LayoutGrid, Fuel, Sparkles, Utensils, Shield, Cpu, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: LayoutGrid,
    title: 'Smart Gate & Stand Allocation',
    desc: 'Dynamic apron conflict prevention algorithm with live gate occupancy telemetry.',
    badge: 'AUTOMATED',
    link: '/gate-allocation',
  },
  {
    icon: Fuel,
    title: 'Refueling & Hydrant Dispatch',
    desc: 'Precision fuel flow rate telemetry, mass balancing, and safety clearance sync.',
    badge: 'REAL-TIME',
    link: '/refueling',
  },
  {
    icon: Sparkles,
    title: 'Cabin Turnaround & Sanitization',
    desc: 'Milestone tracking for aircraft cabin cleaning, security audit, and provisioning.',
    badge: 'LIVE TELEMETRY',
    link: '/cabin-cleaning',
  },
  {
    icon: Utensils,
    title: 'Catering & Provisioning Control',
    desc: 'Galleys loading validation, special meal tracking, and departure readiness locks.',
    badge: 'INTEGRATED',
    link: '/catering',
  },
  {
    icon: Shield,
    title: 'Security Clearance & Manifest',
    desc: 'Passenger biometric verification, no-fly crosscheck, and baggage reconciliation.',
    badge: 'SECURE',
    link: '/security',
  },
  {
    icon: Cpu,
    title: 'Audit Logs & Fleet Analytics',
    desc: 'Immutable operation logs, turn time breakdown, and historical AI telemetry reports.',
    badge: 'ANALYTICS',
    link: '/audit-log',
  },
];

export const Services: React.FC = () => {
  return (
    <section className="services-section">
      <div className="services-header">
        <span className="services-tag">AOCS PLATFORM MODULES</span>
        <h2 className="services-title">Unified Ground & Flight Control</h2>
        <p className="services-subtitle">
          Engineered for seamless coordination across air traffic control, ground crew, and terminal management.
        </p>
      </div>

      <div className="services-grid">
        {services.map((svc, idx) => {
          const Icon = svc.icon;
          return (
            <SpotlightCard
              key={idx}
              spotlightColor="rgba(76, 81, 226, 0.35)"
              className="service-card"
            >
              <div className="service-top">
                <div className="service-icon">
                  <Icon size={22} />
                </div>
                <span className="service-badge">{svc.badge}</span>
              </div>
              <h3 className="service-card-title">{svc.title}</h3>
              <p className="service-card-desc">{svc.desc}</p>
              <a href={svc.link} className="service-link">
                Explore Module <ArrowRight size={16} />
              </a>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
};

export default Services;
