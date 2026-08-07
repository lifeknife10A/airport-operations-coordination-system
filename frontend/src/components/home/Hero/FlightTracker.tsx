import React, { useState } from 'react';
import './FlightTracker.css';
import { SpotlightCard } from '../../reactbits';
import { Search, Plane, MapPin, Package, ArrowRight } from 'lucide-react';

export const FlightTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flight' | 'route' | 'cargo'>('flight');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setResult(`Live Status for ${query.toUpperCase()}: ON TIME — Gate B12 (Scheduled Departure 14:45 UTC)`);
  };

  return (
    <div id="flight-tracker" className="tracker-positioner">
      <SpotlightCard
        spotlightColor="rgba(76, 81, 226, 0.25)"
        className="tracker-card dark-theme"
      >
        <div className="tracker-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'flight' ? 'active' : ''}`}
            onClick={() => setActiveTab('flight')}
          >
            <Plane size={16} />
            Flight Status
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'route' ? 'active' : ''}`}
            onClick={() => setActiveTab('route')}
          >
            <MapPin size={16} />
            Gate & Terminal
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'cargo' ? 'active' : ''}`}
            onClick={() => setActiveTab('cargo')}
          >
            <Package size={16} />
            Cargo AWB
          </button>
        </div>

        <form className="tracker-form" onSubmit={handleSearch}>
          <div className="input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="tracker-input"
              placeholder={
                activeTab === 'flight'
                  ? 'Enter flight number (e.g. SPH-102, SPH-409)...'
                  : activeTab === 'route'
                  ? 'Enter origin/destination airport code (e.g. JFK, LHR, SIN)...'
                  : 'Enter 11-digit Air Waybill number (e.g. 016-8940129)...'
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="tracker-button">
            Search Telemetry
            <ArrowRight size={18} />
          </button>
        </form>

        {result && (
          <div className="tracker-result-chip">
            <span className="result-dot"></span>
            {result}
          </div>
        )}
      </SpotlightCard>
    </div>
  );
};

export default FlightTracker;
