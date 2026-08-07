import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Box, Container, Typography, Paper, TextField, InputAdornment, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Search, Plane, AlertTriangle, Clock, CheckCircle2, ShieldAlert, RefreshCw } from 'lucide-react';
import LiveFlightMatrix from '../../components/home/LiveFlightMatrix';

interface FlightRecord {
  flightNo: string;
  airline: string;
  route: string;
  origin: string;
  destination: string;
  gate: string;
  terminal: string;
  scheduledTime: string;
  estimatedTime: string;
  status: 'ON TIME' | 'BOARDING' | 'TAXING' | 'SCHEDULED' | 'DELAYED';
  aircraft: string;
}

const mockTrackerFlights: FlightRecord[] = [
  { flightNo: 'SPH-102', airline: 'Saphire Air', route: 'JFK ➔ LHR', origin: 'New York (JFK)', destination: 'London (LHR)', gate: 'B12', terminal: 'T2', scheduledTime: '14:45 UTC', estimatedTime: '14:45 UTC', status: 'BOARDING', aircraft: 'Boeing 787-9' },
  { flightNo: 'SPH-204', airline: 'Singapore Trans', route: 'SIN ➔ DXB', origin: 'Singapore (SIN)', destination: 'Dubai (DXB)', gate: 'A04', terminal: 'T1', scheduledTime: '15:10 UTC', estimatedTime: '15:10 UTC', status: 'TAXING', aircraft: 'Airbus A350-900' },
  { flightNo: 'SPH-308', airline: 'Pacific Global', route: 'HND ➔ LAX', origin: 'Tokyo (HND)', destination: 'Los Angeles (LAX)', gate: 'C22', terminal: 'T2', scheduledTime: '15:30 UTC', estimatedTime: '15:30 UTC', status: 'ON TIME', aircraft: 'Boeing 777-300ER' },
  { flightNo: 'SPH-412', airline: 'Air Europe', route: 'CDG ➔ SFO', origin: 'Paris (CDG)', destination: 'San Francisco (SFO)', gate: 'B08', terminal: 'T2', scheduledTime: '16:00 UTC', estimatedTime: '16:00 UTC', status: 'SCHEDULED', aircraft: 'Airbus A330neo' },
  { flightNo: 'SPH-518', airline: 'Lufthansa Express', route: 'FRA ➔ ORD', origin: 'Frankfurt (FRA)', destination: 'Chicago (ORD)', gate: 'A15', terminal: 'T1', scheduledTime: '16:25 UTC', estimatedTime: '16:45 UTC', status: 'DELAYED', aircraft: 'Boeing 787-10' },
];

const mockAlerts = [
  { id: 1, type: 'warning', title: 'Runway 09R/27L Scheduled Maintenance', message: 'Runway 09R/27L will undergo routine maintenance from 02:00 to 05:00 UTC. Minor taxiway rerouting in effect.', time: '10 mins ago' },
  { id: 2, type: 'info', title: 'Terminal 2 Gate Expansion Active', message: 'Gates C20 through C25 in Terminal 2 are now operating with enhanced automated biometric boarding gates.', time: '1 hour ago' },
  { id: 3, type: 'caution', title: 'Weather Advisory: Low Visibility Fog', message: 'VFR landing procedures active due to early morning fog. Instrument Landing Systems (ILS Category III) fully operational.', time: '2 hours ago' },
];

export const FlightTracker: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedFlight, setSelectedFlight] = useState<FlightRecord>(mockTrackerFlights[0]);

  const filteredFlights = mockTrackerFlights.filter((f) => {
    const matchesQuery = f.flightNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         f.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         f.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const getStatusChip = (status: FlightRecord['status']) => {
    switch (status) {
      case 'BOARDING':
        return <Chip icon={<CheckCircle2 size={14} />} label="BOARDING" color="success" size="small" sx={{ fontWeight: 700 }} />;
      case 'TAXING':
        return <Chip icon={<Plane size={14} />} label="TAXING" color="info" size="small" sx={{ fontWeight: 700 }} />;
      case 'ON TIME':
        return <Chip icon={<CheckCircle2 size={14} />} label="ON TIME" color="success" size="small" sx={{ fontWeight: 700 }} />;
      case 'SCHEDULED':
        return <Chip icon={<Clock size={14} />} label="SCHEDULED" color="default" size="small" sx={{ fontWeight: 700 }} />;
      case 'DELAYED':
        return <Chip icon={<AlertTriangle size={14} />} label="DELAYED" color="error" size="small" sx={{ fontWeight: 700 }} />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0B1020', color: '#F4F4F4' }}>
      <Navbar />
      
      {/* Header Banner */}
      <Box sx={{ pt: 14, pb: 6, background: 'linear-gradient(180deg, #1E1B4B 0%, #0B1020 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth="xl">
          <Typography component="span" sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.15em', color: '#38BDF8', textTransform: 'uppercase' }}>
            REAL-TIME FLIGHT TELEMETRY
          </Typography>
          <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mt: 1, mb: 1 }}>
            Flight Status & Radar Tracker
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', maxWidth: '650px' }}>
            Look up live flight departures, terminal gate assignments, arrival timelines, and airside operational notices.
          </Typography>
        </Container>
      </Box>

      {/* Main Search & Content Area */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Search & Filter Bar */}
        <Paper id="search" elevation={0} sx={{ p: 3, mb: 4, background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '16px', backdropFilter: 'blur(16px)' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, alignItems: 'center' }}>
            <Box>
              <TextField
                fullWidth
                placeholder="Search by flight number (e.g. SPH-102), city, or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} color="#64748B" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(2, 6, 23, 0.8)',
                    borderRadius: '10px',
                    fontFamily: "'Inter', sans-serif",
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                    '&:hover fieldset': { borderColor: '#38BDF8' },
                  },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              {['ALL', 'BOARDING', 'ON TIME', 'TAXING', 'DELAYED'].map((filter) => (
                <Button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  variant={statusFilter === filter ? 'contained' : 'outlined'}
                  size="small"
                  sx={{
                    borderRadius: '8px',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 600,
                    textTransform: 'none',
                    backgroundColor: statusFilter === filter ? '#2563EB' : 'transparent',
                    borderColor: statusFilter === filter ? '#2563EB' : 'rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                    '&:hover': { backgroundColor: statusFilter === filter ? '#1D4ED8' : 'rgba(255, 255, 255, 0.08)' },
                  }}
                >
                  {filter}
                </Button>
              ))}
            </Box>
          </Box>
        </Paper>

        {/* Results & Selected Card Grid */}
        <Box id="results" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
          {/* Flight Table */}
          <TableContainer component={Paper} elevation={0} sx={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '16px', overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ background: 'rgba(2, 6, 23, 0.6)' }}>
                <TableRow>
                  <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>FLIGHT</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>ROUTE</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>GATE / TML</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>SCHEDULE</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>STATUS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFlights.map((flight) => (
                  <TableRow
                    key={flight.flightNo}
                    hover
                    onClick={() => setSelectedFlight(flight)}
                    selected={selectedFlight.flightNo === flight.flightNo}
                    sx={{
                      cursor: 'pointer',
                      '&.Mui-selected': { backgroundColor: 'rgba(56, 189, 248, 0.12) !important' },
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.04)' },
                    }}
                  >
                    <TableCell sx={{ color: '#FFFFFF', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Plane size={16} color="#38BDF8" />
                        {flight.flightNo}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#CBD5E1', fontFamily: "'Inter', sans-serif" }}>{flight.route}</TableCell>
                    <TableCell sx={{ color: '#38BDF8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>{flight.gate} ({flight.terminal})</TableCell>
                    <TableCell sx={{ color: '#CBD5E1', fontFamily: "'Inter', sans-serif" }}>{flight.scheduledTime}</TableCell>
                    <TableCell>{getStatusChip(flight.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Detailed Selected Flight Status Card */}
          <Paper elevation={0} sx={{ p: 3.5, background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', backdropFilter: 'blur(16px)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.8rem', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.1em' }}>
                SELECTED TELEMETRY
              </Typography>
              {getStatusChip(selectedFlight.status)}
            </Box>

            <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 0.5 }}>
              {selectedFlight.flightNo}
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', mb: 3 }}>
              {selectedFlight.airline} • {selectedFlight.aircraft}
            </Typography>

            <Box sx={{ p: 2, background: 'rgba(2, 6, 23, 0.8)', borderRadius: '12px', mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>ORIGIN</Typography>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#F8FAFC' }}>{selectedFlight.origin}</Typography>
                </Box>
                <Plane size={20} color="#38BDF8" style={{ transform: 'rotate(90deg)', marginTop: '8px' }} />
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>DESTINATION</Typography>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#F8FAFC' }}>{selectedFlight.destination}</Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
              <Box sx={{ p: 1.5, background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>GATE</Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#38BDF8' }}>{selectedFlight.gate}</Typography>
              </Box>
              <Box sx={{ p: 1.5, background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>TERMINAL</Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#FFFFFF' }}>{selectedFlight.terminal}</Typography>
              </Box>
            </Box>

            <Button fullWidth variant="contained" startIcon={<RefreshCw size={16} />} sx={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)', textTransform: 'none', fontFamily: "'Outfit', sans-serif", fontWeight: 600, borderRadius: '8px' }}>
              Refresh Flight Telemetry
            </Button>
          </Paper>
        </Box>

        {/* AIRPORT ALERTS SECTION (Moved here below search results) */}
        <Box id="alerts" sx={{ mt: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <ShieldAlert size={26} color="#F59E0B" />
            <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
              Airport Operational Notices & Alerts
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {mockAlerts.map((alert) => (
              <Paper key={alert.id} elevation={0} sx={{ p: 3, background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '14px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Chip label="OPERATIONAL ADVISORY" size="small" sx={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.7rem' }} />
                  <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8' }}>{alert.time}</Typography>
                </Box>

                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF', fontSize: '1.05rem', mb: 1 }}>
                  {alert.title}
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.5, flexGrow: 1 }}>
                  {alert.message}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Live Flight Matrix Section */}
        <Box sx={{ mt: 8 }}>
          <LiveFlightMatrix />
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default FlightTracker;
