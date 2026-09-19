import React, { useState, useEffect } from 'react';
import { AircraftCanvas } from './AircraftCanvas';
import './Hero.css';

export const Hero: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

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
      window.location.href = `/tracker?flight=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <section className="ve-hero">
      {/* Soft, Warm Aerodrome Canvas with Touchdown Scrubbing */}
      <div className="ve-aircraft-stage">
        <AircraftCanvas
          scrollProgress={scrollProgress}
          tintMode="warm-day"
          cropShape="framed"
        />
      </div>

      {/* Hero Foreground Content - Clean Floating Typography Without Background Box */}
      <div className="ve-hero-container">
        <div className="ve-hero-content-left">
          <h1 className="ve-headline-italic">
            Saphire, mon doux refuge.
          </h1>

          <p className="ve-subheading-italic">
            Where calm luxury meets aviation precision. Effortless departures, real-time concourse guidance, and serene comfort across every terminal.
          </p>
        </div>
      </div>

      {/* Floating Seam Bridge positioned directly across the bottom border of the hero */}
      <div className="ve-seam-bridge">
        <div className="ve-seam-card">
          {/* Passenger Flight & Gate Finder */}
          <form className="ve-finder-card" onSubmit={handleSearch}>
            <div className="ve-finder-input-box">
              <span className="ve-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search flight number, carrier, or gate (e.g. SPH-240 or Gate A4)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ve-finder-input"
              />
            </div>
            <button type="submit" className="ve-btn-search">View Live Status</button>
          </form>

          {/* Passenger-First Stats Row (Stats that matter to travelers) */}
          <div className="ve-stats-row">
            <div className="ve-stat-box">
              <span className="ve-stat-number">98.8%</span>
              <span className="ve-stat-label">On-Time Flight Departures</span>
            </div>
            <div className="ve-stat-divider" />
            <div className="ve-stat-box">
              <span className="ve-stat-number">&lt; 12 min</span>
              <span className="ve-stat-label">Avg. Bag to Carousel</span>
            </div>
            <div className="ve-stat-divider" />
            <div className="ve-stat-box">
              <span className="ve-stat-number">&lt; 8 min</span>
              <span className="ve-stat-label">FastTrack Security Line</span>
            </div>
            <div className="ve-stat-divider" />
            <div className="ve-stat-box">
              <span className="ve-stat-number">200+</span>
              <span className="ve-stat-label">Worldwide Direct Destinations</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
