import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, TableContainer } from '@mui/material';
import { Building2, Car, Train, Compass, MapPin, Radio, ArrowUpRight, Shield } from 'lucide-react';
import { SpotlightCard } from '../../components/reactbits';
import bannerAirport from '../../assets/banners/banner-airport.jpg';
import GlobalRouteCorridors from '../../components/airport/GlobalRouteCorridors';

const parkingRates = [
  { type: 'P1 Terminal Express', rate: '₹150 / hr', maxDaily: '₹1,200 / day', notes: 'Direct climate-controlled skywalk to T1 & T2 departures.' },
  { type: 'P2 Multi-Level Long Term', rate: '₹100 / hr', maxDaily: '₹800 / day', notes: 'Covered 7-level structure with CCTV and EV charging bays.' },
  { type: 'P3 VIP Concierge Valet', rate: '₹500 flat fee', maxDaily: '₹2,000 / day', notes: 'Curbside handoff at Terminal 2 Departure Concourse ramp.' },
  { type: 'Air Cargo Logistics Lot', rate: '₹80 / hr', maxDaily: '₹600 / day', notes: 'Heavy transport and logistics freight yard parking.' },
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
            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#475569', maxWidth: '680px', fontSize: '1.05rem', lineHeight: 1.65 }}>
              Master precinct overview, dual CAT III B runway architecture, multi-terminal ground connectivity, and passenger transit logistics.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Band 1: Strategic Aerodrome Metrics */}
      <Box sx={{ py: 8, background: '#FAF9F6', borderBottom: '1px solid rgba(15, 41, 66, 0.08)' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' }, gap: 5, alignItems: 'center' }}>
            <Box>
              <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', fontWeight: 600, color: '#0284C7', letterSpacing: '0.14em', textTransform: 'uppercase', mb: 1 }}>
                Engineering Core
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', mb: 2.5, letterSpacing: '-0.02em' }}>
                Next-Generation Aviation Precinct
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#475569', lineHeight: 1.7, mb: 2, fontSize: '0.95rem' }}>
                SAPHIRE International Airport (IATA: SPH, ICAO: VASP) serves as a primary civil aviation hub capable of coordinating up to 45 million passengers and 1.5 million metric tonnes of cargo annually.
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
                    transition: 'border-color 0.2s ease, transform 0.2s ease',
                    '&:hover': { borderColor: '#0284C7', transform: 'translateY(-2px)' },
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

      {/* Band 2: Terminal Precinct Overview (Deep Navy Architectural Section) */}
      <Box sx={{ py: 10, backgroundColor: '#0F2942', color: '#F8FAFC', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 5 }}>
            <Box>
              <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', fontWeight: 600, color: '#38BDF8', letterSpacing: '0.14em', textTransform: 'uppercase', mb: 0.5 }}>
                Passenger Concourses
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>
                Terminal Complexes
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3.5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4.5,
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: '#38BDF8', transform: 'translateY(-2px)' },
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Building2 size={24} color="#38BDF8" />
                    <Typography variant="h5" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>
                      Terminal 1 — Domestic Concourse
                    </Typography>
                  </Box>
                  <Box sx={{ px: 1.5, py: 0.4, borderRadius: '6px', backgroundColor: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38BDF8', fontSize: '0.75rem', fontFamily: "'Geist Mono', monospace", fontWeight: 700 }}>
                    T1-DOM
                  </Box>
                </Box>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', mb: 3, lineHeight: 1.65 }}>
                  Serves all regional and intercity national routes. Designed with bi-level passenger separation, automated bag-drop belts, and direct high-frequency metro line connection.
                </Typography>
              </Box>
              <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', pt: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                  'Gates A01 through B24 with aerobridge boarding',
                  'Direct underground connection to Airport Express Metro',
                  '60 self-service check-in kiosks and 24 bag-drop positions',
                ].map((feature, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#E2E8F0', fontSize: '0.88rem' }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#38BDF8' }} />
                    {feature}
                  </Box>
                ))}
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 4.5,
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: '#38BDF8', transform: 'translateY(-2px)' },
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Building2 size={24} color="#38BDF8" />
                    <Typography variant="h5" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>
                      Terminal 2 — International Concourse
                    </Typography>
                  </Box>
                  <Box sx={{ px: 1.5, py: 0.4, borderRadius: '6px', backgroundColor: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38BDF8', fontSize: '0.75rem', fontFamily: "'Geist Mono', monospace", fontWeight: 700 }}>
                    T2-INTL
                  </Box>
                </Box>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', mb: 3, lineHeight: 1.65 }}>
                  The flagship intercontinental gateway engineered for Code F widebody aircraft (A380, B777X). Features biometric automated border gates, premium lounges, and duty-free retail galleries.
                </Typography>
              </Box>
              <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', pt: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                  'Gates C01 through E48 equipped for dual-deck boarding',
                  'Automated biometric border clearance and smart customs lanes',
                  'Dedicated VIP terminal wing and in-transit luxury hotel',
                ].map((feature, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#E2E8F0', fontSize: '0.88rem' }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#38BDF8' }} />
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
                  desc: 'Line 3 direct rapid transit every 8 minutes linking T1 & T2 to Financial District and City Center.',
                  spotlight: 'rgba(2, 132, 199, 0.18)',
                  accentClass: 'accent-blue',
                  iconBg: 'rgba(2, 132, 199, 0.08)',
                },
                {
                  icon: <Car size={22} color="#10B981" />,
                  title: 'Designated Ride Pick-up',
                  desc: 'App cab zones and prepaid government taxi booths located at Level 0 of both arrival terminals.',
                  spotlight: 'rgba(16, 185, 129, 0.18)',
                  accentClass: 'accent-green',
                  iconBg: 'rgba(16, 185, 129, 0.08)',
                },
                {
                  icon: <Compass size={22} color="#D97706" />,
                  title: 'Inter-Terminal Monorail',
                  desc: 'Complimentary 24/7 automated people mover connecting T1, T2, Long-Term Parking, and Car Rental.',
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
                    <TableRow key={idx} sx={{ borderBottom: '1px solid #F1F5F9', '&:hover': { backgroundColor: 'rgba(30, 58, 95, 0.02)' } }}>
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

      {/* Band 4: Master Aerodrome Plan */}
      <Box sx={{ py: 10, backgroundColor: '#0F2942', color: '#F8FAFC', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Container maxWidth="xl">
          <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', fontWeight: 600, color: '#38BDF8', letterSpacing: '0.14em', textTransform: 'uppercase', mb: 0.5 }}>
            Master Aerodrome Plan
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#FFFFFF', mb: 4 }}>
            Airside &amp; Terminal Schematic
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 5,
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' }, gap: 4, alignItems: 'center' }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Radio size={20} color="#38BDF8" />
                  <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.85rem', color: '#38BDF8', fontWeight: 600 }}>
                    SPH / VASP • RUNWAY ORIENTATION: 09L/27R &amp; 09R/27L
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#FFFFFF', mb: 2 }}>
                  Parallel Runway Layout &amp; Taxiway Network
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', lineHeight: 1.65, mb: 3 }}>
                  Dual 4,000m x 60m runways aligned east-west enable segregated parallel operations with rapid-exit taxiways A through K. Both thresholds are fully equipped with Category III B instrument landing localizers and touchdown zone lighting.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ px: 2, py: 1, backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: "'Geist Mono', monospace" }}>NORTH RUNWAY</Typography>
                    <Typography sx={{ fontFamily: "'Geist Mono', monospace", color: '#FFFFFF', fontWeight: 600 }}>09L / 27R (4,000m)</Typography>
                  </Box>
                  <Box sx={{ px: 2, py: 1, backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: "'Geist Mono', monospace" }}>SOUTH RUNWAY</Typography>
                    <Typography sx={{ fontFamily: "'Geist Mono', monospace", color: '#FFFFFF', fontWeight: 600 }}>09R / 27L (4,000m)</Typography>
                  </Box>
                  <Box sx={{ px: 2, py: 1, backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: "'Geist Mono', monospace" }}>ELEVATION</Typography>
                    <Typography sx={{ fontFamily: "'Geist Mono', monospace", color: '#FFFFFF', fontWeight: 600 }}>112 MSL (367 FT)</Typography>
                  </Box>
                </Box>
              </Box>

              <Box>
                <GlobalRouteCorridors />
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default AirportInformation;
