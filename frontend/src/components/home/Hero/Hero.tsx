import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpRight } from 'lucide-react';
import { AircraftCanvas } from './AircraftCanvas';
import './Hero.css';

export const Hero: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = Math.max(500, window.innerHeight * 0.9);
      const progress = Math.min(1, Math.max(0, scrollY / docHeight));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tracker?flight=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="ve-hero">
      {/* Soft, Warm Aerodrome Canvas with Touchdown Scrubbing */}
      <div className="ve-aircraft-stage">
        <AircraftCanvas
          scrollProgress={scrollProgress}
          tintMode="warm-day"
          cropShape="full"
        />
      </div>

      {/* Top-Left Corner: Primary Luxury Brand Headline (Hardcoded, Un-selectable) */}
      <div className="ve-hero-top-left">
        <h1 className="ve-headline-italic">
          Saphire, mon doux refuge.
        </h1>
      </div>

      {/* Bottom-Right Corner: Editorial Manifesto (Hardcoded, Un-selectable) */}
      <div className="ve-hero-bottom-right">
        <p className="ve-subheading-italic">
          Where calm luxury meets aviation precision. Effortless departures, real-time concourse guidance, and serene comfort across every terminal.
        </p>
      </div>

      {/* Floating Seam Bridge: Minimalist Apple macOS Style Bottom Dock */}
      <div className="ve-seam-bridge">
        <div className="ve-macos-dock apple-liquid-glass">
          {/* 1. Live Telemetry Beacon */}
          <div className="ve-dock-live">
            <span className="ve-pulse-dot" />
            <span className="ve-dock-live-text">LIVE</span>
          </div>

          <div className="ve-dock-divider" />

          {/* 2. Unified Search Field */}
          <form className="ve-dock-search" onSubmit={handleSearch}>
            <Search className="ve-dock-search-icon" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ve-dock-input"
              aria-label="Search flight or gate"
            />
            <button type="submit" className="ve-dock-btn" aria-label="Track Flight">
              <span>Track</span>
              <ArrowUpRight size={14} />
            </button>
          </form>

          <div className="ve-dock-divider ve-dock-desktop-only" />

          {/* 3. Live Quick Telemetry Glance (macOS Status Item) */}
          <div className="ve-dock-metrics ve-dock-desktop-only">
            <div className="ve-dock-metric">
              <span className="ve-metric-val">98.8%</span>
              <span className="ve-metric-lbl">On-Time</span>
            </div>
            <span className="ve-metric-dot">•</span>
            <div className="ve-dock-metric">
              <span className="ve-metric-val">&lt; 12m</span>
              <span className="ve-metric-lbl">Carousel</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
