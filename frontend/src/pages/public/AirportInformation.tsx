import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, TableContainer } from '@mui/material';
import { Building2, Car, Train, Compass, MapPin, Radio, ArrowUpRight, Shield, Globe } from 'lucide-react';
import { SpotlightCard } from '../../components/reactbits';
import bannerAirport from '../../assets/banners/banner-airport.jpg';
import GlobalRouteCorridors from '../../components/airport/GlobalRouteCorridors';
import AerodromeSchematic from '../../components/airport/AerodromeSchematic';

const parkingRates = [
  { type: 'P1 Central Terminal Express', rate: '₹150 / hr', maxDaily: '₹1,200 / day', notes: 'Direct climate-controlled skywalk into Central Terminal Departures.' },
  { type: 'P2 Multi-Level Long Term', rate: '₹100 / hr', maxDaily: '₹800 / day', notes: 'Covered 7-level structure with automated CCTV and rapid EV charging bays.' },
  { type: 'P3 VIP Concierge Valet', rate: '₹500 flat fee', maxDaily: '₹2,000 / day', notes: 'Curbside handoff at Central Terminal VIP Departure ramp.' },
  { type: 'Air Cargo Logistics Lot', rate: '₹80 / hr', maxDaily: '₹600 / day', notes: 'Heavy transport and logistics freight yard staging.' },
];

export const AirportInformation: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FAF9F6', color: '#0F2942' }}>
      <Navbar />

      {/* Header Banner: 1. Aerial Airport Runway Image, 2. Apple Liquid Glass, 3. Content */}
      <Box
        sx={{
          pt: { xs: 14, md: 17 },
          pb: { xs: 5, md: 7 },
          px: { xs: 2, md: 4 },
          position: 'relative',
          backgroundImage: `linear-gradient(180deg, rgba(15, 41, 66, 0.48) 0%, rgba(15, 41, 66, 0.72) 100%), url(${bannerAirport})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl">
          <Box
            className="apple-liquid-glass"
            sx={{
              p: { xs: 4, md: 5.5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h2" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, letterSpacing: '-0.025em', color: '#0F2942', mb: 2, fontSize: { xs: '2.2rem', md: '3.2rem' } }}>
              About SAPHIRE Airport
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#475569', maxWidth: '720px', fontSize: '1.05rem', lineHeight: 1.65 }}>
              Master aerodrome precinct, dual 4,000m CAT III B parallel runways, Unified Central Terminal concourses, and global civil aviation coordination.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Band 1: Strategic Aerodrome Metrics */}
      <Box sx={{ py: 8, background: '#FAF9F6', borderBottom: '1px solid rgba(15, 41, 66, 0.08)' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' }, gap: 5, alignItems: 'center' }}>
            <Box className="">
              <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', fontWeight: 600, color: '#0284C7', letterSpacing: '0.14em', textTransform: 'uppercase', mb: 1 }}>
                Engineering Core
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', mb: 2.5, letterSpacing: '-0.02em' }}>
                Next-Generation Aviation Precinct
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#475569', lineHeight: 1.7, mb: 2, fontSize: '0.95rem' }}>
                SAPHIRE International Airport (IATA: SPH, ICAO: VASP) operates a state-of-the-art civil aviation hub capable of coordinating up to 45 million passengers and 1.5 million metric tonnes of air cargo annually under a single unified terminal roof.
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#475569', lineHeight: 1.7, fontSize: '0.95rem' }}>
                Built around twin parallel instrument runways operating simultaneous independent approaches under zero-visibility CAT III B criteria, SPH achieves standard aircraft turnaround dispatch in under 42 minutes.
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2.5 }}>
              {[
                { value: '200', label: 'Airside Stands', sub: '120 Contact, 80 Remote' },
                { value: 'CAT III B', label: 'ILS Compliance', sub: 'Zero-Visibility Autoland' },
                { value: '45M', label: 'Annual PAX Capacity', sub: 'Expandable to 65M Phase II' },
                { value: '42 min', label: 'Average Turnaround', sub: 'AOCC Automated Dispatch' },
              ].map((stat, idx) => (
                <Paper
                  key={idx}
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(15, 41, 66, 0.04)',
                  }}
                >
                  <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '1.75rem', fontWeight: 800, color: '#1E3A5F', mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.92rem', fontWeight: 700, color: '#0F2942', mb: 0.5 }}>
                    {stat.label}
                  </Typography>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#64748B' }}>
                    {stat.sub}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Band 2: Unified Central Terminal Concourse Architecture (Deep Navy) */}
      <Box sx={{ py: 10, backgroundColor: '#0F2942', color: '#F8FAFC', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 5 }}>
            <Box>
              <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', fontWeight: 600, color: '#38BDF8', letterSpacing: '0.14em', textTransform: 'uppercase', mb: 0.5 }}>
                Single Unified Terminal
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>
                Central Terminal: Concourse Architecture
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', fontSize: '0.92rem', mt: 1, maxWidth: '780px' }}>
                Saphire International operates one unified mega-terminal building spanning 650,000 m², seamlessly interconnecting three high-capacity concourse piers under a continuous aerodynamic roof structure.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {/* Concourse A */}
            <Paper
              elevation={0}
              sx={{
                p: 3.8,
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Building2 size={22} color="#38BDF8" />
                    <Typography variant="h6" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>
                      Concourse A
                    </Typography>
                  </Box>
                  <Box sx={{ px: 1.4, py: 0.3, borderRadius: '6px', backgroundColor: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38BDF8', fontSize: '0.72rem', fontFamily: "'Geist Mono', monospace", fontWeight: 700 }}>
                    DOMESTIC PIER
                  </Box>
                </Box>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', mb: 3, lineHeight: 1.6, fontSize: '0.88rem' }}>
                  Gates A01 through A14. High-frequency national intercity routes with rapid 25-minute boarding turnarounds, bi-level arriving passenger separation, and direct Airport Express Metro connection.
                </Typography>
              </Box>
              <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', pt: 2, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                {[
                  '14 contact aerobridges with Safedock guidance',
                  'Direct underground connector to Express Metro',
                  '48 self-service biometric check-in kiosks',
                ].map((feature, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#E2E8F0', fontSize: '0.82rem' }}>
                    <Box sx={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#38BDF8' }} />
                    {feature}
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Concourse B */}
            <Paper
              elevation={0}
              sx={{
                p: 3.8,
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Building2 size={22} color="#38BDF8" />
                    <Typography variant="h6" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>
                      Concourse B
                    </Typography>
                  </Box>
                  <Box sx={{ px: 1.4, py: 0.3, borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10B981', fontSize: '0.72rem', fontFamily: "'Geist Mono', monospace", fontWeight: 700 }}>
                    TRANSCONTINENTAL
                  </Box>
                </Box>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', mb: 3, lineHeight: 1.6, fontSize: '0.88rem' }}>
                  Gates B01 through B16. Serves transcontinental cross-border services across the Middle East, Southeast Asia, and regional corridors. Integrated airside duty-free shopping galleria.
                </Typography>
              </Box>
              <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', pt: 2, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                {[
                  '16 contact stands accommodating Code D/E aircraft',
                  'Underground hydrant refueling at all positions',
                  'Executive transit airline lounges & quiet suites',
                ].map((feature, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#E2E8F0', fontSize: '0.82rem' }}>
                    <Box sx={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#10B981' }} />
                    {feature}
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Concourse C */}
            <Paper
              elevation={0}
              sx={{
                p: 3.8,
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Building2 size={22} color="#38BDF8" />
                    <Typography variant="h6" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>
                      Concourse C
                    </Typography>
                  </Box>
                  <Box sx={{ px: 1.4, py: 0.3, borderRadius: '6px', backgroundColor: 'rgba(217, 119, 6, 0.15)', border: '1px solid rgba(217, 119, 6, 0.3)', color: '#F59E0B', fontSize: '0.72rem', fontFamily: "'Geist Mono', monospace", fontWeight: 700 }}>
                    WIDEBODY FLAGSHIP
                  </Box>
                </Box>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', mb: 3, lineHeight: 1.6, fontSize: '0.88rem' }}>
                  Gates C01 through C18. Premier intercontinental long-haul flagship pier engineered for Code F widebody aircraft (A380, B777X, A350-1000). Automated e-Gates and luxury VIP sanctuaries.
                </Typography>
              </Box>
              <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', pt: 2, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                {[
                  '8 dual-deck upper aerobridges for Airbus A380-800',
                  'Automated biometric smart customs lanes',
                  'In-transit 5-star hotel & wellness spa sanctuary',
                ].map((feature, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#E2E8F0', fontSize: '0.82rem' }}>
                    <Box sx={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                    {feature}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* Band 3: Ground Transportation & Parking */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="xl">
          {/* Ground Transportation */}
          <Box sx={{ mb: 10 }}>
            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', fontWeight: 600, color: '#0284C7', letterSpacing: '0.14em', textTransform: 'uppercase', mb: 0.5 }}>
              Intermodal Access
            </Typography>
            <Typography variant="h4" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', mb: 4 }}>
              Ground Transportation
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2.5 }}>
              {[
                {
                  icon: <Train size={22} color="#0284C7" />,
                  title: 'Airport Express Metro',
                  desc: 'Line 3 direct rapid transit every 8 minutes linking Central Terminal to Financial District and City Center.',
                  spotlight: 'rgba(2, 132, 199, 0.18)',
                  accentClass: 'accent-blue',
                  iconBg: 'rgba(2, 132, 199, 0.08)',
                },
                {
                  icon: <Car size={22} color="#10B981" />,
                  title: 'Designated Ride Pick-up',
                  desc: 'App cab zones and prepaid government taxi booths located at Level 0 of Central Terminal arrivals plaza.',
                  spotlight: 'rgba(16, 185, 129, 0.18)',
                  accentClass: 'accent-green',
                  iconBg: 'rgba(16, 185, 129, 0.08)',
                },
                {
                  icon: <Compass size={22} color="#D97706" />,
                  title: 'Central People Mover',
                  desc: 'Complimentary automated airside electric people mover connecting Central Terminal, Long-Term Parking, and Car Rental.',
                  spotlight: 'rgba(217, 119, 6, 0.18)',
                  accentClass: 'accent-orange',
                  iconBg: 'rgba(217, 119, 6, 0.08)',
                },
                {
                  icon: <MapPin size={22} color="#6366F1" />,
                  title: 'Car Rental Concourse',
                  desc: 'Leading international rental agencies situated inside the ground transport arrivals plaza.',
                  spotlight: 'rgba(99, 102, 241, 0.18)',
                  accentClass: 'accent-purple',
                  iconBg: 'rgba(99, 102, 241, 0.08)',
                },
              ].map((item, idx) => (
                <SpotlightCard
                  key={idx}
                  spotlightColor={item.spotlight}
                  className={`spotlight-card ${item.accentClass}`}
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    borderRadius: '16px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Box sx={{ width: 44, height: 44, borderRadius: '10px', backgroundColor: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </Box>
                  <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', fontSize: '1rem', mt: 0.5 }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                    {item.desc}
                  </Typography>
                </SpotlightCard>
              ))}
            </Box>
          </Box>

          {/* Parking Structures & Tariff */}
          <Box>
            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', fontWeight: 600, color: '#0284C7', letterSpacing: '0.14em', textTransform: 'uppercase', mb: 0.5 }}>
              Automated Parking
            </Typography>
            <Typography variant="h4" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', mb: 4 }}>
              Parking Structures &amp; Tariffs
            </Typography>

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(15, 41, 66, 0.04)',
                overflow: 'hidden',
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', py: 2 }}>
                      Facility Zone
                    </TableCell>
                    <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', py: 2 }}>
                      Hourly Rate
                    </TableCell>
                    <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', py: 2 }}>
                      Daily Maximum
                    </TableCell>
                    <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', py: 2 }}>
                      Location &amp; Access Details
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parkingRates.map((row, idx) => (
                    <TableRow key={idx} sx={{ borderBottom: '1px solid #F1F5F9' }}>
                      <TableCell sx={{ color: '#0F2942', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.92rem' }}>
                        {row.type}
                      </TableCell>
                      <TableCell sx={{ color: '#0284C7', fontFamily: "'Geist Mono', monospace", fontWeight: 700, fontSize: '0.9rem' }}>
                        {row.rate}
                      </TableCell>
                      <TableCell sx={{ color: '#0F2942', fontFamily: "'Geist Mono', monospace", fontWeight: 600, fontSize: '0.88rem' }}>
                        {row.maxDaily}
                      </TableCell>
                      <TableCell sx={{ color: '#475569', fontFamily: "'Inter', sans-serif", fontSize: '0.86rem' }}>
                        {row.notes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </Box>

      {/* Band 4: Master Aerodrome Plan (Authentic 2D Runway & Taxiway Layout) */}
      <Box sx={{ py: 10, backgroundColor: '#0A192F', color: '#F8FAFC', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Radio size={18} color="#38BDF8" />
              <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', fontWeight: 600, color: '#38BDF8', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Master Aerodrome Plan
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#FFFFFF', mb: 1.5 }}>
              Airside &amp; Runway Layout Schematic
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', maxWidth: '820px', fontSize: '0.94rem', lineHeight: 1.65 }}>
              Precision 2D top-down aerodrome blueprint displaying dual 4,000m segregated parallel runways (09L/27R &amp; 09R/27L), high-speed rapid exit taxiways Alpha through Kilo, Central Terminal apron stands, and the 88m central ATC tower.
            </Typography>
          </Box>

          {/* Quick Specifications Strip */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <Box sx={{ px: 2, py: 1, backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Typography sx={{ fontSize: '0.70rem', color: '#94A3B8', fontFamily: "'Geist Mono', monospace" }}>NORTH RUNWAY</Typography>
              <Typography sx={{ fontFamily: "'Geist Mono', monospace", color: '#FFFFFF', fontWeight: 600, fontSize: '0.86rem' }}>09L / 27R (4,000m × 60m)</Typography>
            </Box>
            <Box sx={{ px: 2, py: 1, backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Typography sx={{ fontSize: '0.70rem', color: '#94A3B8', fontFamily: "'Geist Mono', monospace" }}>SOUTH RUNWAY</Typography>
              <Typography sx={{ fontFamily: "'Geist Mono', monospace", color: '#FFFFFF', fontWeight: 600, fontSize: '0.86rem' }}>09R / 27L (4,000m × 60m)</Typography>
            </Box>
            <Box sx={{ px: 2, py: 1, backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Typography sx={{ fontSize: '0.70rem', color: '#94A3B8', fontFamily: "'Geist Mono', monospace" }}>AERODROME ELEVATION</Typography>
              <Typography sx={{ fontFamily: "'Geist Mono', monospace", color: '#38BDF8', fontWeight: 600, fontSize: '0.86rem' }}>112m MSL (367 FT)</Typography>
            </Box>
            <Box sx={{ px: 2, py: 1, backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Typography sx={{ fontSize: '0.70rem', color: '#94A3B8', fontFamily: "'Geist Mono', monospace" }}>ILS AUTOLAND SPEC</Typography>
              <Typography sx={{ fontFamily: "'Geist Mono', monospace", color: '#10B981', fontWeight: 600, fontSize: '0.86rem' }}>ICAO CAT III B Dual Redundant</Typography>
            </Box>
          </Box>

          {/* Genuine 2D Aerodrome Schematic Component */}
          <AerodromeSchematic />
        </Container>
      </Box>

      {/* Band 5: Global Route Corridors (Dedicated Connectivity Section) */}
      <Box sx={{ py: 10, backgroundColor: '#071524', color: '#F8FAFC', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1.2fr' }, gap: 5, alignItems: 'center' }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Globe size={20} color="#38BDF8" />
                <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', fontWeight: 600, color: '#38BDF8', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Global Connectivity
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#FFFFFF', mb: 2.5 }}>
                Intercontinental Flight Corridors
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', lineHeight: 1.7, mb: 2.5, fontSize: '0.94rem' }}>
                Positioned at the nexus of major global air traffic highways, SAPHIRE Airport operates nonstop widebody connections to key financial capitals including London Heathrow, Dubai International, Tokyo Haneda, New York JFK, and Singapore Changi.
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', lineHeight: 1.7, fontSize: '0.94rem' }}>
                Equipped with automatic flight plan synchronization, digital ATC oceanic clearances, and real-time Upper Airspace ADS-B telemetry, SPH supports high-altitude cruise coordination at FL390.
              </Typography>
            </Box>

            <Box>
              <GlobalRouteCorridors />
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default AirportInformation;
