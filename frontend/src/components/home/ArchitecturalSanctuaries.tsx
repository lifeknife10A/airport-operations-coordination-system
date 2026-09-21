import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowUpRight, Sparkles, Compass, Shield, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ArchitecturalSanctuaries.css';

interface SanctuaryItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  architect: string;
  description: string;
  image: string;
  specs: { label: string; value: string }[];
  link: string;
}

const sanctuaries: SanctuaryItem[] = [
  {
    id: 'atrium',
    tag: 'CONCOURSE A • CENTRAL ROTUNDA',
    title: 'The Grand Atrium & Biophilic Canopy',
    subtitle: 'SOARING SKYLIGHT SPACE-FRAME & LIVING BOTANICAL GROVE',
    architect: 'Inspired by Foster + Partners & Singapore Jewel',
    description:
      'Engineered with a 40-meter curved structural glass dome, the Grand Atrium brings natural circadian daylight directly to transit passengers. Over 22,000 tropical palms and botanical ferns naturally oxygenate concourse air while indoor cascading water features temper terminal humidity.',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1200&auto=format&fit=crop',
    specs: [
      { label: 'Canopy Volume', value: '14,000 m²' },
      { label: 'Living Flora', value: '22,000+ Palms' },
      { label: 'Daylight Filter', value: 'UV 99.4% Shield' },
    ],
    link: '/passenger-services#facilities',
  },
  {
    id: 'water',
    tag: 'CONCOURSE C • EXECUTIVE TIER',
    title: 'The Alabaster Water Sanctuary',
    subtitle: 'INFINITY WATER MIRRORS & SOUND-ABSORPTIVE TRAVERTINE CABANAS',
    architect: 'Acoustic Sanctuary & Thermal Hydro-Suites',
    description:
      'A serene retreat isolated from concourse transit. Step into whisper-quiet private cabanas surrounded by reflective shallow travertine water mirrors, rain shower hydrotherapy suites, and bespoke barista service before long-haul departures.',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200&auto=format&fit=crop',
    specs: [
      { label: 'Ambient Sound', value: '< 28 dB Silent' },
      { label: 'Hydro Suites', value: '18 Rain Showers' },
      { label: 'Access', value: 'First & Business' },
    ],
    link: '/passenger-services#lounges',
  },
  {
    id: 'retail',
    tag: 'TERMINAL 1 & 2 • AIRSIDE PLAZA',
    title: 'The Haute Horlogerie & Duty-Free Boulevard',
    subtitle: 'CURATED SWISS TIMEPIECES & VINTAGE KRUG CHAMPAGNE BAR',
    architect: 'Tax-Free Luxury Pavilions & Private Tasting Salons',
    description:
      'An architectural retail avenue lined with international haute horlogerie flagships, bespoke perfumeries, and private salons. Connect with concourse sommeliers at the central elliptical marble bar featuring rare vintage champagne selections.',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1200&auto=format&fit=crop',
    specs: [
      { label: 'Flagship Boutiques', value: '38+ Luxury Houses' },
      { label: 'Pricing Model', value: '100% Tax-Free' },
      { label: 'Concierge Escort', value: 'Direct Gate Delivery' },
    ],
    link: '/passenger-services#facilities',
  },
  {
    id: 'apron',
    tag: 'PRIVATE AVIATION APRON • STAND G01-G12',
    title: 'Airside VIP Apron Concierge',
    subtitle: 'DIRECT TARMAC CHAUFFEUR TO PRIVATE JET & VIP WIDEBODIES',
    architect: 'FBO Executive Terminal & Tarmac Boarding',
    description:
      'Bypassing the public concourse altogether, our dedicated VIP apron terminal offers private border control, dedicated customs suites, and discreet curbside transfers in electric luxury sedans directly to aircraft boarding stairs.',
    image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1200&auto=format&fit=crop',
    specs: [
      { label: 'Transfer Vehicle', value: 'Maybach & EQS Fleet' },
      { label: 'Clearance Time', value: '< 90 Seconds' },
      { label: 'Privacy Tier', value: 'Zero-Terminal Contact' },
    ],
    link: '/airport#terminals',
  },
];

export const ArchitecturalSanctuaries: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const active = sanctuaries[selectedIdx];
  const navigate = useNavigate();

  return (
    <Box className="arch-container">
      {/* Navigation Switcher Tabs */}
      <Box className="arch-nav-bar">
        {sanctuaries.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            className={`arch-nav-tab ${selectedIdx === idx ? 'active' : ''}`}
            onClick={() => setSelectedIdx(idx)}
          >
            <span className="arch-tab-index">0{idx + 1}</span>
            <span className="arch-tab-title">{item.title.split('&')[0].trim()}</span>
          </button>
        ))}
      </Box>

      {/* Main Interactive Showcase Stage */}
      <Box className="arch-stage">
        {/* Left: Cinematic Photo Showcase */}
        <Box className="arch-visual-pane">
          <img
            key={active.id}
            src={active.image}
            alt={active.title}
            className="arch-img"
          />
          <div className="arch-img-scrim" />

          <div className="arch-img-tag-top">
            <span className="arch-tag-dot" />
            <span className="arch-tag-text">{active.tag}</span>
          </div>

          <div className="arch-img-footer">
            <Typography className="arch-img-caption">
              {active.architect}
            </Typography>
          </div>
        </Box>

        {/* Right: Editorial Information Architecture */}
        <Box className="arch-content-pane">
          <Typography className="arch-sub-mono">
            {active.subtitle}
          </Typography>

          <Typography className="arch-headline">
            {active.title}
          </Typography>

          <Typography className="arch-description">
            {active.description}
          </Typography>

          {/* Key Architectural Specs */}
          <Box className="arch-specs-grid">
            {active.specs.map((spec, i) => (
              <div key={i} className="arch-spec-card">
                <span className="arch-spec-label">{spec.label}</span>
                <span className="arch-spec-val">{spec.value}</span>
              </div>
            ))}
          </Box>

          <Box className="arch-cta-row">
            <Button
              variant="contained"
              className="arch-cta-btn"
              onClick={() => navigate(active.link)}
              endIcon={<ArrowUpRight size={16} />}
            >
              Explore Concourse Details
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ArchitecturalSanctuaries;
