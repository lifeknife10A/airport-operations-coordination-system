import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Plane, Radio, Compass, Clock, Navigation } from 'lucide-react';
import './GlobalRouteCorridors.css';

interface RouteDestination {
  id: string;
  city: string;
  iata: string;
  country: string;
  flightTime: string;
  aircraft: string;
  frequency: string;
  distance: string;
  // Canvas coordinate percentage (x, y) relative to world radar box
  coords: { x: number; y: number };
}

const destinations: RouteDestination[] = [
  {
    id: 'lhr',
    city: 'London Heathrow',
    iata: 'LHR',
    country: 'United Kingdom',
    flightTime: '7h 45m',
    aircraft: 'Airbus A350-1000',
    frequency: '4x Daily Non-Stop',
    distance: '6,710 km',
    coords: { x: 28, y: 32 },
  },
  {
    id: 'dxb',
    city: 'Dubai International',
    iata: 'DXB',
    country: 'United Arab Emirates',
    flightTime: '3h 40m',
    aircraft: 'Boeing 777-300ER',
    frequency: '6x Daily Non-Stop',
    distance: '2,420 km',
    coords: { x: 42, y: 46 },
  },
  {
    id: 'hnd',
    city: 'Tokyo Haneda',
    iata: 'HND',
    country: 'Japan',
    flightTime: '8h 15m',
    aircraft: 'Boeing 787-9 Dreamliner',
    frequency: '2x Daily Non-Stop',
    distance: '5,840 km',
    coords: { x: 82, y: 36 },
  },
  {
    id: 'jfk',
    city: 'New York JFK',
    iata: 'JFK',
    country: 'United States',
    flightTime: '14h 20m',
    aircraft: 'Airbus A350-1000 ULR',
    frequency: '2x Daily Non-Stop',
    distance: '11,750 km',
    coords: { x: 14, y: 38 },
  },
  {
    id: 'sin',
    city: 'Singapore Changi',
    iata: 'SIN',
    country: 'Singapore',
    flightTime: '5h 30m',
    aircraft: 'Airbus A350-900',
    frequency: '3x Daily Non-Stop',
    distance: '3,890 km',
    coords: { x: 68, y: 64 },
  },
];

// Center Hub: Saphire (SPH)
const sphCoords = { x: 52, y: 48 };

export const GlobalRouteCorridors: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState<RouteDestination>(destinations[0]);

  return (
    <Box className="grc-container">
      {/* Header Bar */}
      <Box className="grc-header">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <span className="grc-radar-pulse" />
          <Typography className="grc-title-mono">
            GLOBAL CORRIDORS • SPH RADAR NETWORK
          </Typography>
        </Box>
        <Typography className="grc-active-badge">
          200+ WORLDWIDE DESTINATIONS
        </Typography>
      </Box>

      {/* Interactive Geodesic Radar Map Canvas */}
      <Box className="grc-radar-canvas">
        {/* Radar concentric sweep rings & grid */}
        <div className="grc-grid-overlay" />
        <div className="grc-sweep-beam" />

        <svg className="grc-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="inactiveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* Draw curved geodesic arc for each route */}
          {destinations.map((dest) => {
            const isSelected = activeRoute.id === dest.id;
            // Control point for smooth arc curvature
            const midX = (sphCoords.x + dest.coords.x) / 2;
            const midY = (sphCoords.y + dest.coords.y) / 2 - 12;
            const d = `M ${sphCoords.x} ${sphCoords.y} Q ${midX} ${midY} ${dest.coords.x} ${dest.coords.y}`;

            return (
              <g key={dest.id}>
                {/* Background glow path */}
                <path
                  d={d}
                  fill="none"
                  stroke={isSelected ? '#38BDF8' : 'rgba(56, 189, 248, 0.15)'}
                  strokeWidth={isSelected ? '1.2' : '0.4'}
                  strokeDasharray={isSelected ? 'none' : '1.5, 1.5'}
                  className={isSelected ? 'grc-active-path' : ''}
                />

                {/* Animated cruising particle along active arc */}
                {isSelected && (
                  <circle r="1" fill="#FFFFFF" className="grc-cruising-plane">
                    <animateMotion
                      path={d}
                      dur="3.2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Central Hub Node: SPH */}
        <div
          className="grc-hub-pin"
          style={{ left: `${sphCoords.x}%`, top: `${sphCoords.y}%` }}
        >
          <div className="grc-hub-ring" />
          <div className="grc-hub-center" />
          <div className="grc-hub-tag">
            <span className="grc-hub-iata">SPH</span>
            <span className="grc-hub-label">HUB BASE</span>
          </div>
        </div>

        {/* Destination Pins */}
        {destinations.map((dest) => {
          const isSelected = activeRoute.id === dest.id;
          return (
            <button
              key={dest.id}
              type="button"
              className={`grc-dest-pin ${isSelected ? 'selected' : ''}`}
              style={{ left: `${dest.coords.x}%`, top: `${dest.coords.y}%` }}
              onClick={() => setActiveRoute(dest)}
              onMouseEnter={() => setActiveRoute(dest)}
              aria-label={`Select route to ${dest.city}`}
            >
              <span className="grc-dest-dot" />
              <span className="grc-dest-iata">{dest.iata}</span>
            </button>
          );
        })}
      </Box>

      {/* Route Quick Switcher Pills */}
      <Box className="grc-pills-row">
        {destinations.map((dest) => (
          <button
            key={dest.id}
            type="button"
            className={`grc-pill-btn ${activeRoute.id === dest.id ? 'active' : ''}`}
            onClick={() => setActiveRoute(dest)}
          >
            <Plane size={11} className="grc-pill-icon" />
            <span>{dest.iata}</span>
          </button>
        ))}
      </Box>

      {/* Active Route Telemetry Readout Box */}
      <Box className="grc-telemetry-card">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box>
            <Typography className="grc-tel-dest">
              {activeRoute.city} ({activeRoute.iata})
            </Typography>
            <Typography className="grc-tel-country">
              {activeRoute.country} • {activeRoute.distance}
            </Typography>
          </Box>
          <Box className="grc-tel-time-box">
            <Clock size={12} color="#10B981" />
            <Typography className="grc-tel-time">{activeRoute.flightTime}</Typography>
          </Box>
        </Box>

        <Box className="grc-tel-stats-strip">
          <div className="grc-tel-stat">
            <span className="grc-tel-label">Assigned Fleet</span>
            <span className="grc-tel-value">{activeRoute.aircraft}</span>
          </div>
          <div className="grc-tel-divider" />
          <div className="grc-tel-stat">
            <span className="grc-tel-label">Scheduled Schedule</span>
            <span className="grc-tel-value">{activeRoute.frequency}</span>
          </div>
          <div className="grc-tel-divider" />
          <div className="grc-tel-stat">
            <span className="grc-tel-label">Airway Status</span>
            <span className="grc-tel-value status-clear">Clear (FL390)</span>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default GlobalRouteCorridors;
