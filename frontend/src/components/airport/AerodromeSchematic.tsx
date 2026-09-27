import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Compass, Radio, Shield, Wind, CheckCircle2, Info, Layers } from 'lucide-react';

interface ZoneTelemetry {
  id: string;
  name: string;
  category: 'RUNWAY' | 'TAXIWAY' | 'CONCOURSE' | 'APRON' | 'ATC';
  dimensions: string;
  surface: string;
  ilsStatus: string;
  currentOps: string;
  capacity: string;
  details: string;
}

const zones: Record<string, ZoneTelemetry> = {
  '09L': {
    id: '09L',
    name: 'Runway 09L / 27R (North Main)',
    category: 'RUNWAY',
    dimensions: '4,000m × 60m (13,123 ft × 197 ft)',
    surface: 'High-Friction Grooved Porous Asphalt (PCN 110/F/A/W/T)',
    ilsStatus: 'ICAO CAT III B Dual Redundant (Localizer 110.30 MHz)',
    currentOps: 'Active Primary Departure Runway • Segregated Flow',
    capacity: 'Up to 48 movements/hr',
    details: 'Equipped with centerline inset lights at 15m intervals and high-intensity approach lighting system (ALSF-2).',
  },
  '09R': {
    id: '09R',
    name: 'Runway 09R / 27L (South Main)',
    category: 'RUNWAY',
    dimensions: '4,000m × 60m (13,123 ft × 197 ft)',
    surface: 'High-Friction Grooved Porous Asphalt (PCN 110/F/A/W/T)',
    ilsStatus: 'ICAO CAT III B Dual Redundant (Localizer 109.50 MHz)',
    currentOps: 'Active Primary Arrival Runway • Continuous Descent',
    capacity: 'Up to 52 movements/hr',
    details: 'Rapid-exit taxiways Bravo, Charlie, and Delta allow immediate vacation in under 45 seconds at 50 kts ground speed.',
  },
  'TAXI_A': {
    id: 'TAXI_A',
    name: 'Taxiway Alpha & High-Speed Turnoffs (A, B, C, D)',
    category: 'TAXIWAY',
    dimensions: '30m width with 10.5m paved shoulders (Code F compliant)',
    surface: 'Polymer Modified Bitumen with Green Centerline Guidance',
    ilsStatus: 'A-SMGCS Level 4 Advanced Guidance & Stop Bars',
    currentOps: 'Continuous Unimpeded Ground Taxi Flow',
    capacity: 'Handles A380-800 and Boeing 777-9 wingspans (80m)',
    details: 'Automated microwave sensor stop-bars prevent runway incursion, integrated into AOCC ground radar surveillance.',
  },
  'CONCOURSE_A': {
    id: 'CONCOURSE_A',
    name: 'Concourse A — Domestic & Regional Pier',
    category: 'CONCOURSE',
    dimensions: '14 Contact Gates (A01–A14) • 420m Pier Length',
    surface: 'Reinforced Concrete Apron with Dual Jetbridges',
    ilsStatus: 'Visual Docking Guidance System (Safedock T1-24)',
    currentOps: '12 / 14 Gates Berthed • High Frequency Intercity',
    capacity: 'Narrowbody (A320/A321neo, B737 MAX) & Regional Jets',
    details: 'Direct climate-controlled airside connector to the Airport Express Metro concourse and central rotunda.',
  },
  'CONCOURSE_B': {
    id: 'CONCOURSE_B',
    name: 'Concourse B — Transcontinental & South Asia Pier',
    category: 'CONCOURSE',
    dimensions: '16 Contact Gates (B01–B16) • 510m Pier Length',
    surface: 'High-Strength Concrete Pavement (PCN 105)',
    ilsStatus: 'Automated Laser Apron Docking & Pre-Conditioned Air',
    currentOps: '15 / 16 Gates Berthed • Transcontinental Flights',
    capacity: 'Code D & Code E Aircraft (A330neo, B787-9/10, B777)',
    details: 'Equipped with 400Hz ground power units, underground hydrant refueling, and dedicated transfer security checkpoints.',
  },
  'CONCOURSE_C': {
    id: 'CONCOURSE_C',
    name: 'Concourse C — Intercontinental Flagship Widebody Pier',
    category: 'CONCOURSE',
    dimensions: '18 Contact Gates (C01–C18) • 640m Pier Length',
    surface: 'Heavy Duty Post-Tensioned Concrete (PCN 120)',
    ilsStatus: 'Dual-Deck A380 Telescopic Aerobridges on 8 Stands',
    currentOps: '16 / 18 Gates Berthed • Intercontinental Non-Stops',
    capacity: 'Code F Superjumbo (A380-800, B777X, A350-1000)',
    details: 'Flagship international terminal pier featuring biometric border clearance, dedicated VIP concierges, and direct First/Business lounges.',
  },
  'TOWER': {
    id: 'TOWER',
    name: 'Central Aerodrome Control Tower (SPH TWR)',
    category: 'ATC',
    dimensions: '88m Height Above Ground Level • 360° Visual Cab',
    surface: 'Pressurized Structural Steel & Acoustic Glare Glass',
    ilsStatus: 'Primary SMR (Surface Movement Radar) + Multilateration',
    currentOps: 'Tower Frequency: 118.75 MHz • Ground: 121.90 MHz',
    capacity: 'Full Aerodrome Surface & 50NM Terminal Control',
    details: 'Operated by Airports Authority & Senior Watch Supervisors coordinating simultaneous parallel independent approaches.',
  },
};

export const AerodromeSchematic: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<ZoneTelemetry>(zones['09L']);

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#09192A',
        borderRadius: '16px',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        overflow: 'hidden',
        color: '#F8FAFC',
        boxShadow: '0 12px 36px rgba(10, 25, 47, 0.35)',
      }}
    >
      {/* Aerodrome Top Status Bar */}
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 2,
          backgroundColor: 'rgba(15, 41, 66, 0.65)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 10px #10B981',
              animation: 'pulseGlow 2s infinite',
            }}
          />
          <Typography
            sx={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#38BDF8',
              letterSpacing: '0.08em',
            }}
          >
            AERODROME SURFACE STATUS: ALL RUNWAYS OPERATIONAL
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Wind size={14} color="#94A3B8" />
            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.76rem', color: '#CBD5E1' }}>
              WIND: 080° / 11 KTS
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Compass size={14} color="#94A3B8" />
            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.76rem', color: '#CBD5E1' }}>
              MAG VAR: 1.2° W
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Shield size={14} color="#10B981" />
            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.76rem', color: '#10B981', fontWeight: 600 }}>
              CAT III B ACTIVE
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Interactive 2D Top-Down Runway / Taxiway / Terminal SVG Blueprint */}
      <Box sx={{ position: 'relative', width: '100%', height: { xs: '380px', md: '460px' }, backgroundColor: '#071524', overflow: 'hidden' }}>
        {/* Subtle coordinate grid lines */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.15 }}
        >
          <defs>
            <pattern id="aerodromeGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38BDF8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#aerodromeGrid)" />
        </svg>

        <svg
          viewBox="0 0 1000 500"
          style={{ width: '100%', height: '100%', display: 'block' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Compass Rose / North Indicator */}
          <g transform="translate(60, 60)" opacity="0.65">
            <circle r="22" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2, 2" />
            <line x1="0" y1="-26" x2="0" y2="26" stroke="#38BDF8" strokeWidth="1.5" />
            <line x1="-26" y1="0" x2="26" y2="0" stroke="#38BDF8" strokeWidth="1" />
            <polygon points="0,-26 4,-16 -4,-16" fill="#38BDF8" />
            <text x="0" y="-30" fill="#38BDF8" fontSize="11" fontFamily="'Geist Mono', monospace" textAnchor="middle" fontWeight="700">N</text>
            <text x="0" y="38" fill="#64748B" fontSize="9" fontFamily="'Geist Mono', monospace" textAnchor="middle">080°</text>
          </g>

          {/* Taxiway Network - Dark Grey Pavement Background */}
          {/* Parallel Taxiway Alpha (North) */}
          <rect x="70" y="115" width="860" height="12" fill="#1E293B" stroke="#334155" strokeWidth="1" />
          {/* Parallel Taxiway Kilo (South) */}
          <rect x="70" y="375" width="860" height="12" fill="#1E293B" stroke="#334155" strokeWidth="1" />

          {/* High-speed exit turnoffs connecting runways and apron */}
          {/* North connectors (Alpha to 09L/27R) */}
          <line x1="180" y1="85" x2="220" y2="115" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
          <line x1="380" y1="85" x2="420" y2="115" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
          <line x1="620" y1="85" x2="580" y2="115" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
          <line x1="820" y1="85" x2="780" y2="115" stroke="#334155" strokeWidth="10" strokeLinecap="round" />

          {/* South connectors (Kilo to 09R/27L) */}
          <line x1="180" y1="415" x2="220" y2="385" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
          <line x1="380" y1="415" x2="420" y2="385" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
          <line x1="620" y1="415" x2="580" y2="385" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
          <line x1="820" y1="415" x2="780" y2="385" stroke="#334155" strokeWidth="10" strokeLinecap="round" />

          {/* Connectors from Taxiway Alpha & Kilo to Central Apron */}
          <line x1="260" y1="127" x2="260" y2="185" stroke="#334155" strokeWidth="12" />
          <line x1="500" y1="127" x2="500" y2="185" stroke="#334155" strokeWidth="12" />
          <line x1="740" y1="127" x2="740" y2="185" stroke="#334155" strokeWidth="12" />

          <line x1="260" y1="315" x2="260" y2="375" stroke="#334155" strokeWidth="12" />
          <line x1="500" y1="315" x2="500" y2="375" stroke="#334155" strokeWidth="12" />
          <line x1="740" y1="315" x2="740" y2="375" stroke="#334155" strokeWidth="12" />

          {/* Taxiway Green Centerline Guideway (interactive zone) */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedZone(zones['TAXI_A'])}
            className="aerodrome-zone"
          >
            <line x1="70" y1="121" x2="930" y2="121" stroke="#10B981" strokeWidth="1.5" strokeDasharray="10, 4" opacity="0.8" />
            <line x1="70" y1="381" x2="930" y2="381" stroke="#10B981" strokeWidth="1.5" strokeDasharray="10, 4" opacity="0.8" />
            <text x="500" y="138" fill="#10B981" fontSize="9" fontFamily="'Geist Mono', monospace" textAnchor="middle">TAXIWAY ALPHA (A) • CODE F</text>
            <text x="500" y="370" fill="#10B981" fontSize="9" fontFamily="'Geist Mono', monospace" textAnchor="middle">TAXIWAY KILO (K) • CODE F</text>
          </g>

          {/* ======================================================== */}
          {/* RUNWAY 09L / 27R (NORTH MAIN) */}
          {/* ======================================================== */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedZone(zones['09L'])}
            className="aerodrome-zone"
          >
            {/* Runway Asphalt Surface */}
            <rect
              x="50"
              y="68"
              width="900"
              height="28"
              fill={selectedZone.id === '09L' ? '#1E3A5F' : '#0F172A'}
              stroke={selectedZone.id === '09L' ? '#38BDF8' : '#475569'}
              strokeWidth={selectedZone.id === '09L' ? '2' : '1'}
              rx="2"
            />

            {/* Piano keys / Threshold Stripes (09L) */}
            {[...Array(8)].map((_, i) => (
              <rect key={`09l-pk-${i}`} x={62 + i * 4} y="71" width="2" height="22" fill="#FFFFFF" opacity="0.9" />
            ))}
            {/* Designator Text */}
            <text x="106" y="86" fill="#FFFFFF" fontSize="12" fontFamily="'Geist Mono', monospace" fontWeight="800" textAnchor="middle">
              09L
            </text>

            {/* Centerline White Dashes */}
            <line x1="130" y1="82" x2="870" y2="82" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="14, 14" opacity="0.85" />

            {/* Designator Text (27R) */}
            <text x="894" y="86" fill="#FFFFFF" fontSize="12" fontFamily="'Geist Mono', monospace" fontWeight="800" textAnchor="middle">
              27R
            </text>
            {/* Piano keys / Threshold Stripes (27R) */}
            {[...Array(8)].map((_, i) => (
              <rect key={`27r-pk-${i}`} x={910 + i * 4} y="71" width="2" height="22" fill="#FFFFFF" opacity="0.9" />
            ))}

            {/* Runway Edge Lighting subtle dots */}
            <circle cx="50" cy="82" r="3" fill="#10B981" />
            <circle cx="950" cy="82" r="3" fill="#EF4444" />
          </g>

          {/* ======================================================== */}
          {/* RUNWAY 09R / 27L (SOUTH MAIN) */}
          {/* ======================================================== */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedZone(zones['09R'])}
            className="aerodrome-zone"
          >
            {/* Runway Asphalt Surface */}
            <rect
              x="50"
              y="404"
              width="900"
              height="28"
              fill={selectedZone.id === '09R' ? '#1E3A5F' : '#0F172A'}
              stroke={selectedZone.id === '09R' ? '#38BDF8' : '#475569'}
              strokeWidth={selectedZone.id === '09R' ? '2' : '1'}
              rx="2"
            />

            {/* Piano keys / Threshold Stripes (09R) */}
            {[...Array(8)].map((_, i) => (
              <rect key={`09r-pk-${i}`} x={62 + i * 4} y="407" width="2" height="22" fill="#FFFFFF" opacity="0.9" />
            ))}
            {/* Designator Text */}
            <text x="106" y="422" fill="#FFFFFF" fontSize="12" fontFamily="'Geist Mono', monospace" fontWeight="800" textAnchor="middle">
              09R
            </text>

            {/* Centerline White Dashes */}
            <line x1="130" y1="418" x2="870" y2="418" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="14, 14" opacity="0.85" />

            {/* Designator Text (27L) */}
            <text x="894" y="422" fill="#FFFFFF" fontSize="12" fontFamily="'Geist Mono', monospace" fontWeight="800" textAnchor="middle">
              27L
            </text>
            {/* Piano keys / Threshold Stripes (27L) */}
            {[...Array(8)].map((_, i) => (
              <rect key={`27l-pk-${i}`} x={910 + i * 4} y="407" width="2" height="22" fill="#FFFFFF" opacity="0.9" />
            ))}

            {/* Runway Edge Lighting subtle dots */}
            <circle cx="50" cy="418" r="3" fill="#10B981" />
            <circle cx="950" cy="418" r="3" fill="#EF4444" />
          </g>

          {/* ======================================================== */}
          {/* CENTRAL TERMINAL & CONCOURSE PIERS (CONCOURSE A, B, C) */}
          {/* ======================================================== */}
          {/* Apron Concrete Ground Slab */}
          <rect x="190" y="180" width="620" height="140" fill="#152238" stroke="#1E293B" strokeWidth="1.5" rx="6" />

          {/* Main Central Terminal Spine Building */}
          <rect x="360" y="225" width="280" height="50" fill="#1E3A5F" stroke="#38BDF8" strokeWidth="1.5" rx="4" />
          <text x="500" y="247" fill="#FFFFFF" fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" textAnchor="middle">
            UNIFIED CENTRAL TERMINAL
          </text>
          <text x="500" y="262" fill="#94A3B8" fontSize="8" fontFamily="'Geist Mono', monospace" textAnchor="middle">
            MAIN PASSENGER ROTUNDA &amp; BAGGAGE RECLAIM
          </text>

          {/* Concourse A Pier (Left / Domestic) */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedZone(zones['CONCOURSE_A'])}
            className="aerodrome-zone"
          >
            <rect
              x="210"
              y="210"
              width="140"
              height="80"
              fill={selectedZone.id === 'CONCOURSE_A' ? '#0284C7' : '#0F2942'}
              stroke={selectedZone.id === 'CONCOURSE_A' ? '#38BDF8' : 'rgba(56, 189, 248, 0.4)'}
              strokeWidth={selectedZone.id === 'CONCOURSE_A' ? '2' : '1'}
              rx="4"
            />
            <text x="280" y="242" fill="#FFFFFF" fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" textAnchor="middle">
              CONCOURSE A
            </text>
            <text x="280" y="258" fill="#38BDF8" fontSize="8" fontFamily="'Geist Mono', monospace" fontWeight="600" textAnchor="middle">
              GATES A01 - A14
            </text>
            <text x="280" y="272" fill="#CBD5E1" fontSize="7" fontFamily="'Inter', sans-serif" textAnchor="middle">
              Domestic &amp; Regional
            </text>
            {/* Aerobridge finger nodes */}
            <circle cx="210" cy="225" r="4" fill="#38BDF8" />
            <circle cx="210" cy="250" r="4" fill="#38BDF8" />
            <circle cx="210" cy="275" r="4" fill="#38BDF8" />
          </g>

          {/* Concourse B Pier (Center Top / Transcontinental) */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedZone(zones['CONCOURSE_B'])}
            className="aerodrome-zone"
          >
            <rect
              x="440"
              y="155"
              width="120"
              height="65"
              fill={selectedZone.id === 'CONCOURSE_B' ? '#0284C7' : '#0F2942'}
              stroke={selectedZone.id === 'CONCOURSE_B' ? '#38BDF8' : 'rgba(56, 189, 248, 0.4)'}
              strokeWidth={selectedZone.id === 'CONCOURSE_B' ? '2' : '1'}
              rx="4"
            />
            <text x="500" y="180" fill="#FFFFFF" fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" textAnchor="middle">
              CONCOURSE B
            </text>
            <text x="500" y="195" fill="#38BDF8" fontSize="8" fontFamily="'Geist Mono', monospace" fontWeight="600" textAnchor="middle">
              GATES B01 - B16
            </text>
            <text x="500" y="208" fill="#CBD5E1" fontSize="7" fontFamily="'Inter', sans-serif" textAnchor="middle">
              Transcontinental Hub
            </text>
            {/* Aerobridges */}
            <circle cx="460" cy="155" r="4" fill="#38BDF8" />
            <circle cx="500" cy="155" r="4" fill="#38BDF8" />
            <circle cx="540" cy="155" r="4" fill="#38BDF8" />
          </g>

          {/* Concourse C Pier (Right / International Widebody) */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedZone(zones['CONCOURSE_C'])}
            className="aerodrome-zone"
          >
            <rect
              x="650"
              y="210"
              width="150"
              height="80"
              fill={selectedZone.id === 'CONCOURSE_C' ? '#0284C7' : '#0F2942'}
              stroke={selectedZone.id === 'CONCOURSE_C' ? '#38BDF8' : 'rgba(56, 189, 248, 0.4)'}
              strokeWidth={selectedZone.id === 'CONCOURSE_C' ? '2' : '1'}
              rx="4"
            />
            <text x="725" y="242" fill="#FFFFFF" fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" textAnchor="middle">
              CONCOURSE C
            </text>
            <text x="725" y="258" fill="#38BDF8" fontSize="8" fontFamily="'Geist Mono', monospace" fontWeight="600" textAnchor="middle">
              GATES C01 - C18
            </text>
            <text x="725" y="272" fill="#CBD5E1" fontSize="7" fontFamily="'Inter', sans-serif" textAnchor="middle">
              Intercontinental Code F (A380)
            </text>
            {/* Dual Aerobridges for Widebody */}
            <circle cx="800" cy="225" r="5" fill="#10B981" />
            <circle cx="800" cy="250" r="5" fill="#10B981" />
            <circle cx="800" cy="275" r="5" fill="#10B981" />
          </g>

          {/* Air Traffic Control (ATC) Tower */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedZone(zones['TOWER'])}
            className="aerodrome-zone"
          >
            <circle
              cx="500"
              cy="285"
              r="14"
              fill={selectedZone.id === 'TOWER' ? '#0284C7' : '#1E293B'}
              stroke="#38BDF8"
              strokeWidth="2"
            />
            <circle cx="500" cy="285" r="6" fill="#FFFFFF" />
            <circle cx="500" cy="285" r="22" fill="none" stroke="#38BDF8" strokeWidth="0.8" strokeDasharray="2, 2" />
            <text x="500" y="312" fill="#38BDF8" fontSize="8" fontFamily="'Geist Mono', monospace" textAnchor="middle" fontWeight="700">
              ATC TOWER (88M)
            </text>
          </g>
        </svg>

        {/* Hover / Click Prompt Hint */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 16,
            px: 1.5,
            py: 0.6,
            borderRadius: '6px',
            backgroundColor: 'rgba(15, 41, 66, 0.85)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Info size={12} color="#38BDF8" />
          <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', color: '#94A3B8' }}>
            Click or tap any runway, concourse, or tower to inspect airside specs
          </Typography>
        </Box>
      </Box>

      {/* Real-Time Telemetry Specification Card (Flattened Clean Blueprint Surface) */}
      <Box
        sx={{
          p: { xs: 2.5, md: 3 },
          backgroundColor: '#0A192F',
          borderTop: '1px solid rgba(56, 189, 248, 0.2)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Radio size={16} color="#38BDF8" />
            <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
              {selectedZone.name}
            </Typography>
          </Box>
          <Box
            sx={{
              px: 1.5,
              py: 0.3,
              borderRadius: '4px',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38BDF8',
              fontSize: '0.72rem',
              fontFamily: "'Geist Mono', monospace",
              fontWeight: 700,
            }}
          >
            {selectedZone.category} SPECIFICATION
          </Box>
        </Box>

        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.86rem', color: '#CBD5E1', mb: 2.5, lineHeight: 1.6 }}>
          {selectedZone.details}
        </Typography>

        {/* 4 Telemetry Metrics Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
          <Box sx={{ p: 1.8, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.68rem', color: '#94A3B8', mb: 0.5 }}>
              PHYSICAL DIMENSIONS
            </Typography>
            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.84rem', fontWeight: 600, color: '#FFFFFF' }}>
              {selectedZone.dimensions}
            </Typography>
          </Box>

          <Box sx={{ p: 1.8, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.68rem', color: '#94A3B8', mb: 0.5 }}>
              SURFACE &amp; PAVEMENT RATING
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.84rem', fontWeight: 600, color: '#FFFFFF' }}>
              {selectedZone.surface}
            </Typography>
          </Box>

          <Box sx={{ p: 1.8, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.68rem', color: '#94A3B8', mb: 0.5 }}>
              ILS / AVIONICS GUIDANCE
            </Typography>
            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.84rem', fontWeight: 600, color: '#38BDF8' }}>
              {selectedZone.ilsStatus}
            </Typography>
          </Box>

          <Box sx={{ p: 1.8, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.68rem', color: '#94A3B8', mb: 0.5 }}>
              ACTIVE DISPATCH CADENCE
            </Typography>
            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.84rem', fontWeight: 600, color: '#10B981' }}>
              {selectedZone.currentOps}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AerodromeSchematic;
