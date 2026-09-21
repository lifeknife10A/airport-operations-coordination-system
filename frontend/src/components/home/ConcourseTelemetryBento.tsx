import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Volume2, VolumeX, Wind, Compass, Luggage, ShieldCheck, Clock, Zap, ArrowRight } from 'lucide-react';
import './ConcourseTelemetryBento.css';

export const ConcourseTelemetryBento: React.FC = () => {
  // Acoustic slider state (28 dB to 74 dB)
  const [decibels, setDecibels] = useState<number>(28);

  // Baggage pipeline active step (0 to 4)
  const [activeBaggageStep, setActiveBaggageStep] = useState<number>(4);

  const baggageSteps = [
    { title: 'Curbside Drop', time: '0m', detail: 'Smart Bag-Drop with auto RFID bag tag print' },
    { title: '3D Laser CT Sort', time: '2m', detail: 'Automated explosive detection & high-speed tilt tray' },
    { title: 'Apron Tug Transport', time: '5m', detail: 'GPS-guided electric tug transit to aircraft stand' },
    { title: 'Belly Hold Load', time: '8m', detail: 'Reconciled loading into containerized ULD holds' },
    { title: 'Carousel Delivery', time: '11m', detail: 'Touchdown to Carousel 04 in under 12 minutes' },
  ];

  return (
    <Box className="ctb-grid">
      {/* 1. Acoustic Decibel Sound Isolation Card */}
      <Box className="ctb-card ctb-acoustic-card">
        <Box className="ctb-card-header">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {decibels <= 35 ? <VolumeX size={17} color="#10B981" /> : <Volume2 size={17} color="#F59E0B" />}
            <Typography className="ctb-card-mono-title">
              ACOUSTIC SANCTUARY • SOUND DAMPING
            </Typography>
          </Box>
          <span className={`ctb-pill-tag ${decibels <= 35 ? 'tranquil' : 'active'}`}>
            {decibels <= 35 ? 'WHISPER TRANQUILITY' : decibels <= 55 ? 'MODERATE LOUNGE' : 'TERMINAL NOISE'}
          </span>
        </Box>

        <Typography className="ctb-card-heading">
          {decibels <= 35
            ? 'Whisper-Quiet Sanctuary Repose'
            : decibels <= 55
            ? 'Ambient Executive Brasserie'
            : 'Unshielded Concourse Gate Terminal'}
        </Typography>

        <Typography className="ctb-card-desc">
          Double-glazed acoustic argon glass and sound-absorbing Calacatta travertine dampen terminal noise by up to 46 dB.
        </Typography>

        {/* Dynamic Interactive Sound Wave Canvas */}
        <Box className="ctb-wave-box">
          <svg className="ctb-wave-svg" viewBox="0 0 400 60" preserveAspectRatio="none">
            <path
              d={
                decibels <= 35
                  ? "M 0 30 Q 50 28, 100 30 T 200 30 T 300 30 T 400 30"
                  : decibels <= 55
                  ? "M 0 30 Q 25 18, 50 30 T 100 30 T 150 20 T 200 30 T 250 22 T 300 30 T 350 24 T 400 30"
                  : "M 0 30 Q 15 5, 30 30 T 60 55 T 90 8 T 120 52 T 150 6 T 180 54 T 210 5 T 240 55 T 270 6 T 300 52 T 330 8 T 360 54 T 400 30"
              }
              fill="none"
              stroke={decibels <= 35 ? '#10B981' : decibels <= 55 ? '#38BDF8' : '#F43F5E'}
              strokeWidth="2.5"
              className="ctb-soundwave-path"
            />
          </svg>
          <div className="ctb-wave-metric">
            <span className="ctb-wave-number" style={{ color: decibels <= 35 ? '#10B981' : decibels <= 55 ? '#0284C7' : '#E11D48' }}>
              {decibels}
            </span>
            <span className="ctb-wave-unit">dB(A)</span>
          </div>
        </Box>

        {/* Interactive Slider & Presets */}
        <Box sx={{ mt: 2 }}>
          <input
            type="range"
            min={28}
            max={74}
            value={decibels}
            onChange={(e) => setDecibels(Number(e.target.value))}
            className="ctb-range-slider"
            aria-label="Adjust acoustic decibel level"
          />
          <Box className="ctb-preset-row">
            <button
              type="button"
              className={`ctb-preset-btn ${decibels === 28 ? 'active' : ''}`}
              onClick={() => setDecibels(28)}
            >
              28 dB Suite
            </button>
            <button
              type="button"
              className={`ctb-preset-btn ${decibels === 48 ? 'active' : ''}`}
              onClick={() => setDecibels(48)}
            >
              48 dB Lounge
            </button>
            <button
              type="button"
              className={`ctb-preset-btn ${decibels === 74 ? 'active' : ''}`}
              onClick={() => setDecibels(74)}
            >
              74 dB Concourse
            </button>
          </Box>
        </Box>
      </Box>

      {/* 2. Real-Time Aerodrome METAR & Runway Status Card */}
      <Box className="ctb-card ctb-metar-card">
        <Box className="ctb-card-header">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Compass size={17} color="#0284C7" />
            <Typography className="ctb-card-mono-title">
              LIVE METAR &amp; RUNWAYS
            </Typography>
          </Box>
          <span className="ctb-pill-tag autoland">
            ICAO CAT III B
          </span>
        </Box>

        <Typography className="ctb-card-heading">
          Active Parallel Runways: 09L &amp; 09R
        </Typography>

        {/* Simulated Runway Lights Schematic */}
        <Box className="ctb-runway-schematic">
          <div className="ctb-runway-strip">
            <span className="ctb-threshold-green" />
            <div className="ctb-centerline-lights" />
            <span className="ctb-runway-designator">09L</span>
            <span className="ctb-plane-marker">✈</span>
          </div>
          <div className="ctb-runway-strip secondary">
            <span className="ctb-threshold-green" />
            <div className="ctb-centerline-lights" />
            <span className="ctb-runway-designator">09R</span>
          </div>
        </Box>

        {/* METAR Parameter Grid */}
        <Box className="ctb-metar-grid">
          <div className="ctb-metar-item">
            <span className="ctb-metar-lbl">Wind Vector</span>
            <span className="ctb-metar-val">240° @ 08 KTS</span>
          </div>
          <div className="ctb-metar-item">
            <span className="ctb-metar-lbl">Visibility</span>
            <span className="ctb-metar-val">&gt; 10 km (CAVOK)</span>
          </div>
          <div className="ctb-metar-item">
            <span className="ctb-metar-lbl">Temperature</span>
            <span className="ctb-metar-val">24°C / 75°F</span>
          </div>
          <div className="ctb-metar-item">
            <span className="ctb-metar-lbl">QNH Altimeter</span>
            <span className="ctb-metar-val">1013.2 hPa</span>
          </div>
        </Box>
      </Box>

      {/* 3. 5-Point Smart Baggage RFID Trajectory Card */}
      <Box className="ctb-card ctb-baggage-card">
        <Box className="ctb-card-header">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Luggage size={17} color="#10B981" />
            <Typography className="ctb-card-mono-title">
              BAGGAGE RECONCILIATION • 5-POINT BRS
            </Typography>
          </Box>
          <span className="ctb-pill-tag tag-speed">
            &lt; 11.4 MIN AVG
          </span>
        </Box>

        <Typography className="ctb-card-heading">
          Automated Laser Tracking to Carousel
        </Typography>

        <Typography className="ctb-card-desc">
          Ultra-high-frequency RFID scanning tracks your luggage from curbside check-in directly to reclaim carousel.
        </Typography>

        {/* Interactive Step Bar */}
        <Box className="ctb-bag-steps">
          {baggageSteps.map((step, idx) => (
            <button
              key={idx}
              type="button"
              className={`ctb-bag-step-btn ${activeBaggageStep === idx ? 'active' : ''} ${activeBaggageStep > idx ? 'completed' : ''}`}
              onClick={() => setActiveBaggageStep(idx)}
            >
              <span className="ctb-bag-step-num">0{idx + 1}</span>
              <span className="ctb-bag-step-title">{step.title}</span>
              <span className="ctb-bag-step-time">{step.time}</span>
            </button>
          ))}
        </Box>

        {/* Active Step Explainer Pill */}
        <Box className="ctb-bag-detail-pill">
          <Zap size={13} color="#10B981" />
          <Typography className="ctb-bag-detail-text">
            <strong>Stage 0{activeBaggageStep + 1}: {baggageSteps[activeBaggageStep].title}</strong> — {baggageSteps[activeBaggageStep].detail}
          </Typography>
        </Box>
      </Box>

      {/* 4. Concourse Transit & Biometric Flow Card */}
      <Box className="ctb-card ctb-flow-card">
        <Box className="ctb-card-header">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShieldCheck size={17} color="#6366F1" />
            <Typography className="ctb-card-mono-title">
              CONCOURSE TRANSIT FLOW
            </Typography>
          </Box>
          <span className="ctb-pill-tag tag-purple">
            99.8% ON-TIME
          </span>
        </Box>

        <Typography className="ctb-card-heading">
          Biometric Security &amp; Concourse Flow
        </Typography>

        <Box className="ctb-flow-metrics">
          <div className="ctb-flow-box">
            <span className="ctb-flow-stat">&lt; 3.5 min</span>
            <span className="ctb-flow-label">FastTrack Security Line</span>
          </div>
          <div className="ctb-flow-box">
            <span className="ctb-flow-stat">100%</span>
            <span className="ctb-flow-label">Automated Iris E-Gates</span>
          </div>
          <div className="ctb-flow-box">
            <span className="ctb-flow-stat">90 sec</span>
            <span className="ctb-flow-label">SkyTrain T1 ⇄ T2 Shuttle</span>
          </div>
          <div className="ctb-flow-box">
            <span className="ctb-flow-stat">&lt; 5 min</span>
            <span className="ctb-flow-label">Walk to Any Boarding Gate</span>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default ConcourseTelemetryBento;
