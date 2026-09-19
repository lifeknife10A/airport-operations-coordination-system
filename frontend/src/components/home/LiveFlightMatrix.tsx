import React, { useState, useEffect } from 'react';
import './LiveFlightMatrix.css';
import { SpotlightCard } from '../reactbits';
import { Plane, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { aocsDataStore } from '../../services/aocsDataStore';
import { Flight } from '../../types';

interface FlightRow {
  flightNo: string;
  route: string;
  aircraft: string;
  gate: string;
  schedule: string;
  status: 'ON TIME' | 'BOARDING' | 'TAXING' | 'SCHEDULED' | 'DELAYED';
}

const mapStoreFlightToRow = (f: Flight): FlightRow => {
  let displayStatus: FlightRow['status'] = 'SCHEDULED';
  if (f.status === 'BOARDING') displayStatus = 'BOARDING';
  else if (f.status === 'DELAYED') displayStatus = 'DELAYED';
  else if (f.status === 'LANDED' || f.status === 'ON_BLOCK') displayStatus = 'TAXING';
  else if (f.status === 'READY' || f.status === 'AIRBORNE' || f.status === 'DEPARTED') displayStatus = 'ON TIME';

  return {
    flightNo: f.flightNumber,
    route: `${f.originAirportCode} (${f.originAirportName.split(' ')[0]}) ➔ ${f.destinationAirportCode} (${f.destinationAirportName.split(' ')[0]})`,
    aircraft: f.aircraftType,
    gate: f.gateCode || 'TBD',
    schedule: f.scheduledTime,
    status: displayStatus,
  };
};

export const LiveFlightMatrix: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE'>('ALL');
  const [flights, setFlights] = useState<FlightRow[]>(() =>
    aocsDataStore.getFlights().map(mapStoreFlightToRow)
  );

  useEffect(() => {
    const update = () => {
      setFlights(aocsDataStore.getFlights().map(mapStoreFlightToRow));
    };
    update();
    const unsub = aocsDataStore.subscribe((event) => {
      if (event.type.includes('FLIGHT') || event.type.includes('GATE') || event.type === 'REFRESH') {
        update();
      }
    });
    return () => unsub();
  }, []);

  const activeCount = flights.filter((f) => f.status === 'BOARDING' || f.status === 'TAXING').length;

  const filteredFlights = filter === 'ACTIVE'
    ? flights.filter((f) => f.status === 'BOARDING' || f.status === 'TAXING')
    : flights;

  const getStatusBadge = (status: FlightRow['status']) => {
    switch (status) {
      case 'BOARDING':
        return <span className="status-badge boarding"><CheckCircle2 size={12} /> BOARDING</span>;
      case 'TAXING':
        return <span className="status-badge taxing"><Plane size={12} /> TAXING</span>;
      case 'ON TIME':
        return <span className="status-badge on-time"><CheckCircle2 size={12} /> ON TIME</span>;
      case 'SCHEDULED':
        return <span className="status-badge scheduled"><Clock size={12} /> SCHEDULED</span>;
      case 'DELAYED':
        return <span className="status-badge delayed"><AlertTriangle size={12} /> DELAYED +15m</span>;
    }
  };

  return (
    <section className="matrix-section">
      <SpotlightCard spotlightColor="rgba(30, 58, 95, 0.08)" className="matrix-card">
        <div className="matrix-top">
          <div>
            <span className="matrix-tag">AIRPORT INFORMATION DISPLAY SYSTEM</span>
            <h2 className="matrix-title">Live Terminal Departures</h2>
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
              ● Active Movements ({activeCount})
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="flight-table">
            <thead>
              <tr>
                <th>Flight No</th>
                <th>Route Destination</th>
                <th>Aircraft</th>
                <th>Gate</th>
                <th>Time (UTC)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredFlights.map((flight) => (
                <tr key={flight.flightNo}>
                  <td className="flight-number-cell">
                    <Plane size={14} className="plane-icon" />
                    <strong>{flight.flightNo}</strong>
                  </td>
                  <td className="route-cell">{flight.route}</td>
                  <td className="aircraft-cell">{flight.aircraft}</td>
                  <td><span className="gate-chip">{flight.gate}</span></td>
                  <td className="time-cell">{flight.schedule}</td>
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
