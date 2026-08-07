import React from 'react';
import './Footer.css';
import { Globe, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <img src="/saphire_logo_transparent.png" alt="Saphire Logo" className="footer-logo" />
            <span className="brand-name">SAPHIRE AOCS</span>
          </div>
          <p className="brand-tagline">
            Next-Generation Airport Operations Coordination System powering global air traffic hub synchronization.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Public Services</h4>
          <ul className="footer-links">
            <li><a href="/tracker">Flight Telemetry Tracker</a></li>
            <li><a href="/schedule">Schedules & Gates</a></li>
            <li><a href="/passenger-services">Passenger Assistance</a></li>
            <li><a href="/cargo">Air Cargo Express</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Operations Portal</h4>
          <ul className="footer-links">
            <li><a href="/login">Staff SSO Login</a></li>
            <li><a href="/gate-allocation">Gate & Apron Allocation</a></li>
            <li><a href="/refueling">Refueling Control</a></li>
            <li><a href="/audit-log">Security & Audit Logs</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Global Network</h4>
          <p className="footer-text">
            Operating across 14 international hub terminals worldwide with 24/7 dedicated dispatch support.
          </p>
          <div className="support-badge">
            <Globe size={16} />
            <span>24/7 Control Center Support</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Saphire International Airlines. All Rights Reserved. Airport Operations Coordination System.</p>
        <p className="credit">
          Crafted with <Heart size={14} color="#EF4444" style={{ display: 'inline', margin: '0 4px' }} /> for Software Engineering Operations
        </p>
      </div>
    </footer>
  );
};

export default Footer;
