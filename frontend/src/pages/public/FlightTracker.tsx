import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  Search,
  Plane,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ShieldAlert,
  RefreshCw,
  Luggage,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import LiveFlightMatrix from '../../components/home/LiveFlightMatrix';
import { SpotlightCard } from '../../components/reactbits';
import { aocsDataStore } from '../../services/aocsDataStore';
import { Flight, BagTag, BaggageScanEvent } from '../../types';
import bannerTracker from '../../assets/banners/banner-tracker.jpg';

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

const mapFlightToRecord = (f: Flight): FlightRecord => {
  let displayStatus: FlightRecord['status'] = 'SCHEDULED';
  if (f.status === 'BOARDING') displayStatus = 'BOARDING';
  else if (f.status === 'DELAYED') displayStatus = 'DELAYED';
  else if (f.status === 'LANDED' || f.status === 'ON_BLOCK') displayStatus = 'TAXING';
  else if (f.status === 'READY' || f.status === 'AIRBORNE' || f.status === 'DEPARTED') displayStatus = 'ON TIME';

  return {
    flightNo: f.flightNumber,
    airline: f.airlineName,
    route: `${f.originAirportCode} ➔ ${f.destinationAirportCode}`,
    origin: `${f.originAirportName} (${f.originAirportCode})`,
    destination: `${f.destinationAirportName} (${f.destinationAirportCode})`,
    gate: f.gateCode || 'TBD',
    terminal: f.gateCode?.startsWith('C') ? 'T2' : 'T1',
    scheduledTime: f.scheduledTime,
    estimatedTime: f.estimatedTime || f.scheduledTime,
    status: displayStatus,
    aircraft: `${f.aircraftType} (${f.aircraftRegistration})`,
  };
};

const mockAlerts = [
  { id: 1, type: 'warning', title: 'Runway 09R/27L Scheduled Maintenance', message: 'Runway 09R/27L routine maintenance scheduled from 02:00 to 05:00 UTC. Minor taxiway rerouting in effect.', time: '10 mins ago' },
  { id: 2, type: 'info', title: 'Terminal 2 Automated e-Gates Active', message: 'Gates C20 through C25 in Terminal 2 now operate with biometric facial matching clearance for international departures.', time: '1 hour ago' },
  { id: 3, type: 'caution', title: 'Low Visibility Approach Procedures (LVP)', message: 'Instrument Landing System (ILS Category III B) active across Runway 09L. Approach intervals adjusted to 5 nm.', time: '2 hours ago' },
];

export const FlightTracker: React.FC = () => {
  const [searchParams] = useSearchParams();
  const flightParam = searchParams.get('flight') || '';

  const [trackerTab, setTrackerTab] = useState<'FLIGHTS' | 'BAGGAGE'>('FLIGHTS');
  const [flights, setFlights] = useState<FlightRecord[]>(() =>
    aocsDataStore.getFlights().map(mapFlightToRecord)
  );
  const [searchQuery, setSearchQuery] = useState(flightParam);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedFlight, setSelectedFlight] = useState<FlightRecord | null>(null);

  // Sync flightParam with searchQuery whenever URL changes
  useEffect(() => {
    if (flightParam) {
      setSearchQuery(flightParam);
    }
  }, [flightParam]);

  // Baggage Tracker State
  const [bagQuery, setBagQuery] = useState('BAG-AI203-8821');
  const [trackedBag, setTrackedBag] = useState<BagTag | undefined>(undefined);
  const [bagScans, setBagScans] = useState<BaggageScanEvent[]>([]);

  useEffect(() => {
    const refreshData = () => {
      const allFlights = aocsDataStore.getFlights().map(mapFlightToRecord);
      setFlights(allFlights);
      setSelectedFlight((prev) => {
        const query = flightParam || searchQuery;
        if (query.trim()) {
          const match = allFlights.find((f) =>
            f.flightNo.toLowerCase().includes(query.toLowerCase()) ||
            f.airline.toLowerCase().includes(query.toLowerCase()) ||
            f.route.toLowerCase().includes(query.toLowerCase()) ||
            f.destination.toLowerCase().includes(query.toLowerCase()) ||
            f.gate.toLowerCase().includes(query.toLowerCase())
          );
          if (match) return match;
        }
        if (!prev && allFlights.length > 0) return allFlights[0];
        if (prev) {
          const updated = allFlights.find((f) => f.flightNo === prev.flightNo);
          if (updated) return updated;
        }
        return prev || allFlights[0] || null;
      });

      // Update baggage tracking
      const { bagTag, scanEvents } = aocsDataStore.trackBaggage(bagQuery);
      setTrackedBag(bagTag);
      setBagScans(scanEvents);
    };

    refreshData();

    const unsub = aocsDataStore.subscribe((event) => {
      if (
        event.type.includes('FLIGHT') ||
        event.type.includes('GATE') ||
        event.type.includes('BAGGAGE') ||
        event.type === 'REFRESH'
      ) {
        refreshData();
      }
    });

    return () => unsub();
  }, [bagQuery, flightParam, searchQuery]);

  const handleSelectBag = (tag: string) => {
    setBagQuery(tag);
    const { bagTag, scanEvents } = aocsDataStore.trackBaggage(tag);
    setTrackedBag(bagTag);
    setBagScans(scanEvents);
  };

  const filteredFlights = flights.filter((f) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      f.flightNo.toLowerCase().includes(q) ||
      f.airline.toLowerCase().includes(q) ||
      f.route.toLowerCase().includes(q) ||
      f.origin.toLowerCase().includes(q) ||
      f.destination.toLowerCase().includes(q) ||
      f.gate.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const getStatusBadge = (status: FlightRecord['status']) => {
    switch (status) {
      case 'BOARDING':
        return (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.4, borderRadius: '999px', background: '#FEF3C7', border: '1px solid #FDE68A', color: '#B45309', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 700 }}>
            <CheckCircle2 size={12} /> BOARDING
          </Box>
        );
      case 'TAXING':
        return (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.4, borderRadius: '999px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 700 }}>
            <Plane size={12} /> TAXING
          </Box>
        );
      case 'ON TIME':
        return (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.4, borderRadius: '999px', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 700 }}>
            <CheckCircle2 size={12} /> ON TIME
          </Box>
        );
      case 'SCHEDULED':
        return (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.4, borderRadius: '999px', background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#475569', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 700 }}>
            <Clock size={12} /> SCHEDULED
          </Box>
        );
      case 'DELAYED':
        return (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.4, borderRadius: '999px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 700 }}>
            <AlertTriangle size={12} /> DELAYED
          </Box>
        );
    }
  };

  const getBaggageStageLevel = (status?: BagTag['status']) => {
    switch (status) {
      case 'CHECKED_IN': return 1;
      case 'SCREENED': return 2;
      case 'TRANSIT': return 3;
      case 'LOADED': return 4;
      case 'ARRIVED': return 5;
      default: return 1;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FAF9F6', color: '#0F2942' }}>
      <Navbar />
      
      {/* Header Banner: 1. Aircraft Wing over Clouds Image, 2. Apple Liquid Glass, 3. Content */}
      <Box
        sx={{
          pt: { xs: 14, md: 17 },
          pb: { xs: 5, md: 7 },
          px: { xs: 2, md: 4 },
          position: 'relative',
          backgroundImage: `linear-gradient(180deg, rgba(15, 41, 66, 0.48) 0%, rgba(15, 41, 66, 0.72) 100%), url(${bannerTracker})`,
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
            <Typography
              variant="h3"
              sx={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                color: '#0F2942',
                mt: 0.5,
                mb: 1.5,
                fontSize: { xs: '2rem', md: '2.75rem' },
                letterSpacing: '-0.025em',
              }}
            >
              Flight Status &amp; Radar Telemetry
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#475569', maxWidth: '680px', lineHeight: 1.65, fontSize: '1rem' }}>
              Monitor live commercial arrivals, departures, stand allocations, and airside operational notices in dependable real time.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Search & Content Area */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        {/* Navigation Tabs: Flight Radar vs. Baggage Luggage Journey */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, borderBottom: '1px solid #E2E8F0', pb: 2, flexWrap: 'wrap' }}>
          <Button
            onClick={() => setTrackerTab('FLIGHTS')}
            variant={trackerTab === 'FLIGHTS' ? 'contained' : 'outlined'}
            startIcon={<Plane size={18} />}
            sx={{
              borderRadius: '10px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '0.9rem',
              textTransform: 'none',
              px: 3,
              py: 1.2,
              backgroundColor: trackerTab === 'FLIGHTS' ? '#1E3A5F' : '#FFFFFF',
              borderColor: trackerTab === 'FLIGHTS' ? '#1E3A5F' : '#E2E8F0',
              color: trackerTab === 'FLIGHTS' ? '#FFFFFF' : '#475569',
              boxShadow: trackerTab === 'FLIGHTS' ? '0 4px 12px rgba(30, 58, 95, 0.2)' : 'none',
              '&:hover': {
                backgroundColor: trackerTab === 'FLIGHTS' ? '#0F2942' : '#F8FAFC',
                borderColor: '#1E3A5F',
              },
            }}
          >
            Commercial Flight Radar &amp; Schedules
          </Button>

          <Button
            onClick={() => setTrackerTab('BAGGAGE')}
            variant={trackerTab === 'BAGGAGE' ? 'contained' : 'outlined'}
            startIcon={<Luggage size={18} />}
            sx={{
              borderRadius: '10px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '0.9rem',
              textTransform: 'none',
              px: 3,
              py: 1.2,
              backgroundColor: trackerTab === 'BAGGAGE' ? '#0284C7' : '#FFFFFF',
              borderColor: trackerTab === 'BAGGAGE' ? '#0284C7' : '#E2E8F0',
              color: trackerTab === 'BAGGAGE' ? '#FFFFFF' : '#475569',
              boxShadow: trackerTab === 'BAGGAGE' ? '0 4px 12px rgba(2, 132, 199, 0.2)' : 'none',
              '&:hover': {
                backgroundColor: trackerTab === 'BAGGAGE' ? '#0369A1' : '#F8FAFC',
                borderColor: '#0284C7',
              },
            }}
          >
            Luggage &amp; Baggage Journey Tracker
          </Button>
        </Box>

        {trackerTab === 'FLIGHTS' ? (
          <>
            {/* Search & Filter Console */}
            <Paper
              id="search"
              elevation={0}
              sx={{
                p: 3,
                mb: 5,
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                boxShadow: '0 10px 30px rgba(30, 58, 95, 0.03)',
                borderRadius: '16px',
              }}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' }, gap: 2.5, alignItems: 'center' }}>
                <Box>
                  <TextField
                    fullWidth
                    placeholder="Search by flight number (e.g. AI-203, SPH-102), city, or route..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search size={18} color="#64748B" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#0F2942',
                        backgroundColor: '#FAF9F6',
                        borderRadius: '10px',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.9rem',
                        '& fieldset': { borderColor: '#E5E7EB' },
                        '&:hover fieldset': { borderColor: '#CBD5E1' },
                        '&.Mui-focused fieldset': { borderColor: '#1E3A5F' },
                      },
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                  {['ALL', 'BOARDING', 'ON TIME', 'TAXING', 'DELAYED'].map((filter) => (
                    <Button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderRadius: '8px',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        textTransform: 'none',
                        backgroundColor: statusFilter === filter ? '#1E3A5F' : '#FAF9F6',
                        borderColor: statusFilter === filter ? '#1E3A5F' : '#E5E7EB',
                        color: statusFilter === filter ? '#FFFFFF' : '#475569',
                        boxShadow: statusFilter === filter ? '0 2px 8px rgba(30, 58, 95, 0.25)' : 'none',
                        '&:hover': {
                          backgroundColor: statusFilter === filter ? '#0F2942' : '#F1F5F9',
                          borderColor: statusFilter === filter ? '#0F2942' : '#CBD5E1',
                          color: statusFilter === filter ? '#FFFFFF' : '#0F2942',
                        },
                      }}
                    >
                      {filter}
                    </Button>
                  ))}
                </Box>
              </Box>
            </Paper>

            {/* Results & Selected Flight Detail Grid */}
            <Box id="results" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.8fr 1fr' }, gap: 4 }}>
              {/* Flight Table */}
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 10px 30px rgba(30, 58, 95, 0.03)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}
              >
                <Table>
                  <TableHead sx={{ background: '#F8FAFC' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em' }}>FLIGHT</TableCell>
                      <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em' }}>ROUTE</TableCell>
                      <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em' }}>GATE / TML</TableCell>
                      <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em' }}>TIME (UTC)</TableCell>
                      <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em' }}>STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredFlights.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#64748B' }}>
                          No commercial flights match your search query.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFlights.map((flight) => (
                        <TableRow
                          key={flight.flightNo}
                          hover
                          onClick={() => setSelectedFlight(flight)}
                          selected={selectedFlight?.flightNo === flight.flightNo}
                          sx={{
                            cursor: 'pointer',
                            '&.Mui-selected': { backgroundColor: 'rgba(30, 58, 95, 0.05) !important' },
                            '&:hover': { backgroundColor: '#FAF9F6' },
                          }}
                        >
                          <TableCell sx={{ color: '#0F2942', fontFamily: "'Geist Mono', monospace", fontWeight: 700 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Plane size={14} color="#1E3A5F" />
                              {flight.flightNo}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: '#0F2942', fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', fontWeight: 500 }}>{flight.route}</TableCell>
                          <TableCell sx={{ color: '#0F2942', fontFamily: "'Geist Mono', monospace", fontSize: '0.82rem' }}>
                            <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#F1F5F9', border: '1px solid #E2E8F0', fontWeight: 600 }}>
                              {flight.gate} ({flight.terminal})
                            </span>
                          </TableCell>
                          <TableCell sx={{ color: '#1E3A5F', fontFamily: "'Geist Mono', monospace", fontSize: '0.82rem', fontWeight: 600 }}>{flight.scheduledTime}</TableCell>
                          <TableCell>{getStatusBadge(flight.status)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Selected Flight Telemetry Card */}
              {selectedFlight ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 10px 30px rgba(30, 58, 95, 0.04)',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                    <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', fontWeight: 700, color: '#1E3A5F', letterSpacing: '0.14em' }}>
                      RADAR TELEMETRY
                    </Typography>
                    {getStatusBadge(selectedFlight.status)}
                  </Box>

                  <Typography variant="h4" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', mb: 0.5, letterSpacing: '-0.02em' }}>
                    {selectedFlight.flightNo}
                  </Typography>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#64748B', mb: 3 }}>
                    {selectedFlight.airline} • {selectedFlight.aircraft}
                  </Typography>

                  {/* Waypoint Route Arc */}
                  <Box sx={{ p: 2.5, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box>
                        <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.68rem', color: '#64748B' }}>ORIGIN</Typography>
                        <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', fontSize: '1rem' }}>{selectedFlight.origin}</Typography>
                      </Box>
                      <Plane size={18} color="#1E3A5F" style={{ transform: 'rotate(90deg)' }} />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.68rem', color: '#64748B' }}>DESTINATION</Typography>
                        <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', fontSize: '1rem' }}>{selectedFlight.destination}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                    <Box sx={{ p: 2, background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.7rem', color: '#64748B' }}>CONCOURSE GATE</Typography>
                      <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontWeight: 700, fontSize: '1.2rem', color: '#0F2942' }}>{selectedFlight.gate}</Typography>
                    </Box>
                    <Box sx={{ p: 2, background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.7rem', color: '#64748B' }}>TERMINAL COMPLEX</Typography>
                      <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontWeight: 700, fontSize: '1.2rem', color: '#0F2942' }}>{selectedFlight.terminal}</Typography>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<RefreshCw size={15} />}
                    onClick={() => {
                      setFlights(aocsDataStore.getFlights().map(mapFlightToRecord));
                    }}
                    sx={{
                      background: '#1E3A5F',
                      color: '#FFFFFF',
                      textTransform: 'none',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: '0.86rem',
                      borderRadius: '8px',
                      py: 1.2,
                      mt: 'auto',
                      boxShadow: 'none',
                      '&:hover': {
                        background: '#0F2942',
                        boxShadow: '0 4px 14px rgba(30, 58, 95, 0.25)',
                      },
                    }}
                  >
                    Refresh Radar Telemetry
                  </Button>
                </Paper>
              ) : (
                <Paper elevation={0} sx={{ p: 4, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ color: '#64748B' }}>Select a flight to view radar telemetry.</Typography>
                </Paper>
              )}
            </Box>
          </>
        ) : (
          /* ================================================================ */
          /* BAGGAGE JOURNEY TRACKER TAB                                       */
          /* ================================================================ */
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                mb: 4,
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                boxShadow: '0 10px 30px rgba(30, 58, 95, 0.03)',
                borderRadius: '16px',
              }}
            >
              <Typography variant="h6" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', mb: 1 }}>
                Real-Time Passenger Baggage Verification
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#64748B', fontSize: '0.88rem', mb: 3 }}>
                Enter the 10-digit barcode printed on your baggage claim tag or check-in receipt.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Enter Bag Tag Number (e.g. BAG-AI203-8821)..."
                  value={bagQuery}
                  onChange={(e) => setBagQuery(e.target.value)}
                  size="small"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <QrCode size={18} color="#0284C7" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#FAF9F6',
                      borderRadius: '8px',
                      '& fieldset': { borderColor: '#E5E7EB' },
                      '&.Mui-focused fieldset': { borderColor: '#0284C7' },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => handleSelectBag(bagQuery)}
                  sx={{
                    background: '#0284C7',
                    color: '#FFFFFF',
                    textTransform: 'none',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    px: 3,
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    '&:hover': { background: '#0369A1' },
                  }}
                >
                  Locate Luggage
                </Button>
              </Box>

              {/* Sample Test Tags */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                  QUICK CARRIER SAMPLES:
                </Typography>
                {['BAG-AI203-8821', 'BAG-AI203-8822', 'BAG-6E521-1049', 'BAG-UK901-5541'].map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    onClick={() => handleSelectBag(tag)}
                    sx={{
                      cursor: 'pointer',
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      backgroundColor: bagQuery === tag ? '#0284C7' : '#F1F5F9',
                      color: bagQuery === tag ? '#FFFFFF' : '#1E3A5F',
                      '&:hover': { backgroundColor: '#E2E8F0' },
                    }}
                  />
                ))}
              </Box>
            </Paper>

            {/* Tracked Bag Details & Stepper */}
            {trackedBag ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.4fr 1fr' }, gap: 4 }}>
                {/* Left Card: 5-Stage Journey Stepper */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(30, 58, 95, 0.03)',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                        <Typography variant="h5" sx={{ fontFamily: "'Geist Mono', monospace", fontWeight: 700, color: '#0F2942' }}>
                          {trackedBag.tagNumber}
                        </Typography>
                        {trackedBag.isPriority && (
                          <Chip label="Priority First/Business" size="small" sx={{ background: '#FEF3C7', color: '#92400E', fontWeight: 700, fontSize: '0.7rem' }} />
                        )}
                      </Box>
                      <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#64748B' }}>
                        Passenger: <strong>{trackedBag.passengerName}</strong> • Flight <strong>{trackedBag.flightNumber}</strong> • Weight: <strong>{trackedBag.weightKg} kg</strong>
                      </Typography>
                    </Box>

                    <Chip
                      label={trackedBag.status}
                      sx={{
                        fontFamily: "'Geist Mono', monospace",
                        fontWeight: 700,
                        fontSize: '0.76rem',
                        backgroundColor:
                          trackedBag.status === 'LOADED'
                            ? '#ECFDF5'
                            : trackedBag.status === 'ARRIVED'
                            ? '#EFF6FF'
                            : '#FEF3C7',
                        color:
                          trackedBag.status === 'LOADED'
                            ? '#065F46'
                            : trackedBag.status === 'ARRIVED'
                            ? '#1E40AF'
                            : '#92400E',
                      }}
                    />
                  </Box>

                  {/* 5-Step Visual Stepper */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
                    {[
                      { step: 1, title: 'Check-In & Automated Bag Drop', desc: 'Inducted into Terminal 2 High-Speed Baggage Sorter System', icon: <Luggage size={18} /> },
                      { step: 2, title: 'In-Line CTX Explosive Screening', desc: 'Level 1 Automated CT X-Ray clearance certified clean', icon: <ShieldCheck size={18} /> },
                      { step: 3, title: 'Ramp Cart Transfer & ULD Containerization', desc: 'Loaded into airside container & verified by handler', icon: <ArrowRight size={18} /> },
                      { step: 4, title: 'Aircraft Cargo Hold Stowed', desc: 'Locked securely inside aft cargo compartment', icon: <Plane size={18} /> },
                      { step: 5, title: 'Destination Baggage Reclaim Belt', desc: 'Dispatched to arrival carousel for passenger pickup', icon: <CheckCircle2 size={18} /> },
                    ].map((s) => {
                      const currentLevel = getBaggageStageLevel(trackedBag.status);
                      const isComplete = currentLevel >= s.step;
                      const isCurrent = currentLevel === s.step;

                      return (
                        <Box key={s.step} sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              backgroundColor: isComplete ? '#0284C7' : '#F1F5F9',
                              color: isComplete ? '#FFFFFF' : '#94A3B8',
                              border: isCurrent ? '2px solid #38BDF8' : 'none',
                              boxShadow: isCurrent ? '0 0 0 4px rgba(2, 132, 199, 0.15)' : 'none',
                            }}
                          >
                            {isComplete ? <Check size={18} /> : s.icon}
                          </Box>
                          <Box sx={{ pt: 0.5 }}>
                            <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: isComplete ? '#0F2942' : '#94A3B8' }}>
                              {s.title}
                            </Typography>
                            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.82rem', color: '#64748B' }}>
                              {s.desc}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Paper>

                {/* Right Card: Scan Event Audit Log */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(30, 58, 95, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography variant="h6" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', mb: 0.5 }}>
                    Optical Scan Milestones
                  </Typography>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.82rem', color: '#64748B', mb: 3 }}>
                    Cryptographically logged scans along the baggage handling system.
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {bagScans.length === 0 ? (
                      <Typography sx={{ color: '#94A3B8', fontSize: '0.84rem' }}>
                        No physical scans logged yet for this tag.
                      </Typography>
                    ) : (
                      bagScans.map((scan) => (
                        <Box key={scan.eventId} sx={{ p: 2, background: '#FAF9F6', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Chip label={scan.scanType} size="small" sx={{ background: '#EFF6FF', color: '#1E40AF', fontWeight: 700, fontSize: '0.68rem' }} />
                            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', color: '#64748B' }}>
                              {scan.timestamp}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.86rem', color: '#0F2942', fontWeight: 600 }}>
                            {scan.location}
                          </Typography>
                          <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', color: '#94A3B8' }}>
                            Reader: {scan.scannerId}
                          </Typography>
                        </Box>
                      ))
                    )}
                  </Box>
                </Paper>
              </Box>
            ) : (
              <Paper elevation={0} sx={{ p: 4, textAlign: 'center', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px' }}>
                <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: '#0F2942', mb: 1 }}>
                  No Active Bag Tag Found
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#64748B', fontSize: '0.88rem' }}>
                  Please verify your 10-digit luggage tag or click one of the carrier sample tags above.
                </Typography>
              </Paper>
            )}
          </Box>
        )}

        {/* Operational Notices */}
        <Box id="alerts" sx={{ mt: 10 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <ShieldAlert size={22} color="#1E3A5F" />
            <Typography variant="h5" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942' }}>
              Airport Operational Notices & NOTAMs
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {mockAlerts.map((alert) => (
              <SpotlightCard
                key={alert.id}
                className="apple-glass"
                spotlightColor="rgba(2, 132, 199, 0.14)"
                style={{
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ px: 1.2, py: 0.3, borderRadius: '6px', background: 'rgba(30, 58, 95, 0.08)', border: '1px solid rgba(30, 58, 95, 0.16)', color: '#1E3A5F', fontFamily: "'Geist Mono', monospace", fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.08em' }}>
                    OPERATIONAL ADVISORY
                  </Box>
                  <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', color: '#64748B' }}>{alert.time}</Typography>
                </Box>

                <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', fontSize: '1.08rem', mb: 1, letterSpacing: '-0.01em' }}>
                  {alert.title}
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, flexGrow: 1 }}>
                  {alert.message}
                </Typography>
              </SpotlightCard>
            ))}
          </Box>
        </Box>

        {/* Live Flight Matrix Component */}
        <Box sx={{ mt: 10 }}>
          <LiveFlightMatrix />
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default FlightTracker;
