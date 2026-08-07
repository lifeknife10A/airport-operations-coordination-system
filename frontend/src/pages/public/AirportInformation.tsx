import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, TableContainer } from '@mui/material';
import { Building2, Car, Train, Compass, MapPin } from 'lucide-react';

const parkingRates = [
  { type: 'Short-Term Parking (P1)', rate: '₹150 / hr', maxDaily: '₹1,200 / day', notes: 'Direct skywalk access to T1 & T2 Departure gates.' },
  { type: 'Long-Term Multi-Level (P2)', rate: '₹100 / hr', maxDaily: '₹800 / day', notes: 'Covered multi-level structure with 24/7 security CCTV.' },
  { type: 'Premium Valet Parking', rate: '₹500 flat fee', maxDaily: '₹2,000 / day', notes: 'Drop-off directly at Terminal 2 VIP Departure ramp.' },
];

export const AirportInformation: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0B1020', color: '#F4F4F4' }}>
      <Navbar />

      {/* Hero Banner */}
      <Box sx={{ pt: 14, pb: 6, background: 'linear-gradient(180deg, #1E1B4B 0%, #0B1020 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth="xl">
          <Typography component="span" sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.15em', color: '#38BDF8', textTransform: 'uppercase' }}>
            GATEWAY TO INTERNATIONAL AVIATION
          </Typography>
          <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mt: 1, mb: 1 }}>
            About SAPHIRE International Airport
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', maxWidth: '650px' }}>
            Master terminal overview, ground transportation connections, parking structures, and terminal precinct navigation.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Section 1: About the Airport */}
        <Box id="about" sx={{ mb: 8 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 2 }}>
                Grade 9.9 Enterprise Production Hub
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', lineHeight: 1.65, mb: 2 }}>
                SAPHIRE International Airport (IATA: SPH, ICAO: VASP) is a state-of-the-art multi-terminal aviation precinct built to handle over 45 million passengers and 1.5 million tonnes of air freight annually.
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', lineHeight: 1.65 }}>
                Equipped with dual parallel CAT-III Instrument Landing System (ILS) runways, 200 aircraft gates, 200 parking stands, and bidirectional automated turnaround scheduling.
              </Typography>
            </Box>
            
            <Paper elevation={0} sx={{ p: 4, background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '16px' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <Box>
                  <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#38BDF8' }}>
                    200
                  </Typography>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.9rem', color: '#CBD5E1', fontWeight: 600 }}>
                    Active Airside Gates
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#38BDF8' }}>
                    38
                  </Typography>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.9rem', color: '#CBD5E1', fontWeight: 600 }}>
                    Normalized DB Tables
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#38BDF8' }}>
                    2
                  </Typography>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.9rem', color: '#CBD5E1', fontWeight: 600 }}>
                    Passenger Terminals
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#38BDF8' }}>
                    24/7
                  </Typography>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.9rem', color: '#CBD5E1', fontWeight: 600 }}>
                    Continuous Operations
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Section 2: Terminal Information */}
        <Box id="terminals" sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 3 }}>
            Terminal Precinct Overview
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <Paper elevation={0} sx={{ p: 4, background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '16px', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Building2 size={24} color="#38BDF8" />
                <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
                  Terminal 1 (Domestic)
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', mb: 3, lineHeight: 1.6 }}>
                Handles all domestic regional and national flights with 60 departure gates, automated self-baggage drop, and seamless metro access.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ color: '#CBD5E1', fontSize: '0.88rem' }}>• Gates A01 to B20 (Domestic Concourse)</Box>
                <Box sx={{ color: '#CBD5E1', fontSize: '0.88rem' }}>• Direct Metro Line 3 Connection</Box>
                <Box sx={{ color: '#CBD5E1', fontSize: '0.88rem' }}>• Express Check-in Counters 1 to 45</Box>
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ p: 4, background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '16px', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Building2 size={24} color="#38BDF8" />
                <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
                  Terminal 2 (International)
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', mb: 3, lineHeight: 1.6 }}>
                Flagship international concourse equipped for widebody A380/B777 aircraft, 140 gates, duty-free world, and VIP executive suites.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ color: '#CBD5E1', fontSize: '0.88rem' }}>• Gates C01 to D40 (International Concourse)</Box>
                <Box sx={{ color: '#CBD5E1', fontSize: '0.88rem' }}>• Biometric Immigration E-Gates</Box>
                <Box sx={{ color: '#CBD5E1', fontSize: '0.88rem' }}>• Integrated Transit Hotel & Luxury Spa</Box>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Section 3: Ground Transportation */}
        <Box id="transport" sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 3 }}>
            Ground Transportation Connections
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            <Paper elevation={0} sx={{ p: 3, background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px' }}>
              <Train size={24} color="#38BDF8" style={{ marginBottom: '12px' }} />
              <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF', mb: 1 }}>
                Airport Express Metro
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#94A3B8' }}>
                Direct high-speed train connection every 8 minutes linking T1 & T2 to downtown city center.
              </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px' }}>
              <Car size={24} color="#38BDF8" style={{ marginBottom: '12px' }} />
              <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF', mb: 1 }}>
                Pre-Paid Taxi & App Cabs
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#94A3B8' }}>
                Designated taxi pick-up lanes at Arrival Level 0 with 24/7 fixed fare counters.
              </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px' }}>
              <Compass size={24} color="#38BDF8" style={{ marginBottom: '12px' }} />
              <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF', mb: 1 }}>
                Inter-Terminal Shuttle
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#94A3B8' }}>
                Complimentary 24/7 airside and landside monorail shuttle between T1 & T2.
              </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px' }}>
              <MapPin size={24} color="#38BDF8" style={{ marginBottom: '12px' }} />
              <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF', mb: 1 }}>
                Car Rental Desks
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#94A3B8' }}>
                International car rental agencies located in the main arrival halls of both terminals.
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* Section 4: Parking Rates */}
        <Box id="parking" sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 3 }}>
            Parking Structures & Tariff Rates
          </Typography>
          <TableContainer component={Paper} elevation={0} sx={{ background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '16px' }}>
            <Table>
              <TableHead sx={{ background: 'rgba(2, 6, 23, 0.7)' }}>
                <TableRow>
                  <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>PARKING ZONE</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>HOURLY RATE</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>MAX DAILY CAP</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>LOCATION & ACCESS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parkingRates.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ color: '#FFFFFF', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>{row.type}</TableCell>
                    <TableCell sx={{ color: '#38BDF8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>{row.rate}</TableCell>
                    <TableCell sx={{ color: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>{row.maxDaily}</TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontFamily: "'Inter', sans-serif" }}>{row.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Section 5: Terminal Map View */}
        <Box id="map">
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 3 }}>
            Interactive Terminal Precinct Map
          </Typography>
          <Paper elevation={0} sx={{ p: 4, height: '360px', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <Compass size={48} color="#38BDF8" style={{ marginBottom: '16px' }} />
            <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 1 }}>
              SAPHIRE Interactive 2D/3D Master Precinct Plan
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', maxWidth: '550px' }}>
              Detailed interactive gate layout map showing Terminal 1, Terminal 2, Airside Taxiways, Runway 09L/27R, and Cargo Handling Hub.
            </Typography>
          </Paper>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default AirportInformation;
