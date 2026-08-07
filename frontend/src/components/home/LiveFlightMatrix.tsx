import React, { useState } from 'react';
import './LiveFlightMatrix.css';
import { SpotlightCard } from '../reactbits';
import { Plane, ArrowUpRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface FlightRow {
  flightNo: string;
  route: string;
  aircraft: string;
  gate: string;
  schedule: string;
  status: 'ON TIME' | 'BOARDING' | 'TAXING' | 'SCHEDULED' | 'DELAYED';
}

const mockFlights: FlightRow[] = [
  { flightNo: 'SPH-102', route: 'JFK (New York) ➔ LHR (London)', aircraft: 'Boeing 787-9', gate: 'B12', schedule: '14:45 UTC', status: 'BOARDING' },
  { flightNo: 'SPH-204', route: 'SIN (Singapore) ➔ DXB (Dubai)', aircraft: 'Airbus A350-900', gate: 'A04', schedule: '15:10 UTC', status: 'TAXING' },
  { flightNo: 'SPH-308', route: 'HND (Tokyo) ➔ LAX (Los Angeles)', aircraft: 'Boeing 777-300ER', gate: 'C22', schedule: '15:30 UTC', status: 'ON TIME' },
  { flightNo: 'SPH-412', route: 'CDG (Paris) ➔ SFO (San Francisco)', aircraft: 'Airbus A330neo', gate: 'B08', schedule: '16:00 UTC', status: 'SCHEDULED' },
  { flightNo: 'SPH-518', route: 'FRA (Frankfurt) ➔ ORD (Chicago)', aircraft: 'Boeing 787-10', gate: 'A15', schedule: '16:25 UTC', status: 'DELAYED' },
];

export const LiveFlightMatrix: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE'>('ALL');

  const filteredFlights = filter === 'ACTIVE'
    ? mockFlights.filter((f) => f.status === 'BOARDING' || f.status === 'TAXING')
    : mockFlights;

  const getStatusBadge = (status: FlightRow['status']) => {
    switch (status) {
      case 'BOARDING':
        return <span className="status-badge boarding"><CheckCircle2 size={13} /> BOARDING</span>;
      case 'TAXING':
        return <span className="status-badge taxing"><Plane size={13} /> TAXING</span>;
      case 'ON TIME':
        return <span className="status-badge on-time"><CheckCircle2 size={13} /> ON TIME</span>;
      case 'SCHEDULED':
        return <span className="status-badge scheduled"><Clock size={13} /> SCHEDULED</span>;
      case 'DELAYED':
        return <span className="status-badge delayed"><AlertTriangle size={13} /> DELAYED +15m</span>;
    }
  };

  return (
    <section className="matrix-section">
      <SpotlightCard spotlightColor="rgba(59, 130, 246, 0.2)" className="matrix-card">
        <div className="matrix-top">
          <div>
            <span className="matrix-tag">LIVE TELEMETRY MATRIX</span>
            <h2 className="matrix-title">Current Terminal & Flight Schedule</h2>
          </div>
          <div className="matrix-filter-buttons">
            <button
              className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilter('ALL')}
            >
              All Departures
            </button>
            <button
              className={`filter-btn ${filter === 'ACTIVE' ? 'active' : ''}`}
              onClick={() => setFilter('ACTIVE')}
            >
              ● Active Boarding (2)
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="flight-table">
            <thead>
              <tr>
                <th>Flight No</th>
                <th>Route</th>
                <th>Aircraft</th>
                <th>Gate</th>
                <th>Departure Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredFlights.map((flight) => (
                <tr key={flight.flightNo}>
                  <td className="flight-number-cell">
                    <Plane size={15} className="plane-icon" />
                    <strong>{flight.flightNo}</strong>
                  </td>
                  <td className="route-cell">{flight.route}</td>
                  <td>{flight.aircraft}</td>
                  <td><span className="gate-chip">{flight.gate}</span></td>
                  <td>{flight.schedule}</td>
                  <td>{getStatusBadge(flight.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SpotlightCard>
    </section>
  );
};

export default LiveFlightMatrix;
