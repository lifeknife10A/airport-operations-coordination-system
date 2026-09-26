import React, { useState, useMemo } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import {
  Box,
  Container,
  Typography,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  PlaneLanding,
  PlaneTakeoff,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plane,
  Search,
  Wind,
  Luggage,
  Sparkles,
} from 'lucide-react';
import bannerSchedule from '../../assets/banners/airport-digital-board.png';

interface ScheduleFlight {
  id: string;
  type: 'DEPARTURE' | 'ARRIVAL';
  flightNo: string;
  airline: string;
  airport: string;
  city: string;
  scheduledTime: string;
  estimatedTime: string;
  gate: string;
  concourse: 'Concourse A' | 'Concourse B' | 'Concourse C';
  aircraft: string;
  carousel?: string;
  status: 'ON TIME' | 'BOARDING' | 'FINAL CALL' | 'GATE OPEN' | 'LANDED' | 'DELAYED' | 'SCHEDULED';
}

const mockScheduleData: ScheduleFlight[] = [
  // Departures
  { id: 'd1', type: 'DEPARTURE', flightNo: 'SPH-102', airline: 'Saphire Air', airport: 'London Heathrow (LHR)', city: 'London', scheduledTime: '14:45 UTC', estimatedTime: '14:45 UTC', gate: 'C04', concourse: 'Concourse C', aircraft: 'Airbus A350-1000', status: 'BOARDING' },
  { id: 'd2', type: 'DEPARTURE', flightNo: 'EK-501', airline: 'Emirates', airport: 'Dubai International (DXB)', city: 'Dubai', scheduledTime: '15:10 UTC', estimatedTime: '15:10 UTC', gate: 'C12', concourse: 'Concourse C', aircraft: 'Boeing 777-300ER', status: 'GATE OPEN' },
  { id: 'd3', type: 'DEPARTURE', flightNo: 'BA-138', airline: 'British Airways', airport: 'London Heathrow (LHR)', city: 'London', scheduledTime: '15:25 UTC', estimatedTime: '15:25 UTC', gate: 'C08', concourse: 'Concourse C', aircraft: 'Boeing 787-9', status: 'ON TIME' },
  { id: 'd4', type: 'DEPARTURE', flightNo: 'SQ-402', airline: 'Singapore Airlines', airport: 'Singapore Changi (SIN)', city: 'Singapore', scheduledTime: '15:40 UTC', estimatedTime: '15:40 UTC', gate: 'B06', concourse: 'Concourse B', aircraft: 'Airbus A350-900', status: 'ON TIME' },
  { id: 'd5', type: 'DEPARTURE', flightNo: 'SPH-204', airline: 'Saphire Air', airport: 'Mumbai Chhatrapati Shivaji (BOM)', city: 'Mumbai', scheduledTime: '15:50 UTC', estimatedTime: '15:50 UTC', gate: 'A03', concourse: 'Concourse A', aircraft: 'Airbus A321neo', status: 'FINAL CALL' },
  { id: 'd6', type: 'DEPARTURE', flightNo: 'QR-570', airline: 'Qatar Airways', airport: 'Doha Hamad (DOH)', city: 'Doha', scheduledTime: '16:05 UTC', estimatedTime: '16:05 UTC', gate: 'B12', concourse: 'Concourse B', aircraft: 'Boeing 777-300ER', status: 'ON TIME' },
  { id: 'd7', type: 'DEPARTURE', flightNo: 'LH-760', airline: 'Lufthansa', airport: 'Frankfurt am Main (FRA)', city: 'Frankfurt', scheduledTime: '16:20 UTC', estimatedTime: '16:45 UTC', gate: 'C01', concourse: 'Concourse C', aircraft: 'Airbus A340-300', status: 'DELAYED' },
  { id: 'd8', type: 'DEPARTURE', flightNo: 'AI-101', airline: 'Air India', airport: 'New York JFK (JFK)', city: 'New York', scheduledTime: '16:40 UTC', estimatedTime: '16:40 UTC', gate: 'C16', concourse: 'Concourse C', aircraft: 'Boeing 777-200LR', status: 'SCHEDULED' },
  { id: 'd9', type: 'DEPARTURE', flightNo: 'NH-828', airline: 'ANA All Nippon', airport: 'Tokyo Haneda (HND)', city: 'Tokyo', scheduledTime: '17:00 UTC', estimatedTime: '17:00 UTC', gate: 'B02', concourse: 'Concourse B', aircraft: 'Boeing 787-9', status: 'SCHEDULED' },
  { id: 'd10', type: 'DEPARTURE', flightNo: 'SPH-312', airline: 'Saphire Air', airport: 'Bengaluru Kempegowda (BLR)', city: 'Bengaluru', scheduledTime: '17:15 UTC', estimatedTime: '17:15 UTC', gate: 'A08', concourse: 'Concourse A', aircraft: 'Airbus A320neo', status: 'SCHEDULED' },
  { id: 'd11', type: 'DEPARTURE', flightNo: 'AF-218', airline: 'Air France', airport: 'Paris Charles de Gaulle (CDG)', city: 'Paris', scheduledTime: '17:35 UTC', estimatedTime: '17:35 UTC', gate: 'C10', concourse: 'Concourse C', aircraft: 'Airbus A350-900', status: 'SCHEDULED' },
  { id: 'd12', type: 'DEPARTURE', flightNo: 'CX-660', airline: 'Cathay Pacific', airport: 'Hong Kong International (HKG)', city: 'Hong Kong', scheduledTime: '18:00 UTC', estimatedTime: '18:00 UTC', gate: 'B14', concourse: 'Concourse B', aircraft: 'Airbus A350-1000', status: 'SCHEDULED' },
  { id: 'd13', type: 'DEPARTURE', flightNo: 'SPH-404', airline: 'Saphire Air', airport: 'Delhi Indira Gandhi (DEL)', city: 'Delhi', scheduledTime: '18:20 UTC', estimatedTime: '18:20 UTC', gate: 'A11', concourse: 'Concourse A', aircraft: 'Airbus A321neo', status: 'SCHEDULED' },
  { id: 'd14', type: 'DEPARTURE', flightNo: 'EY-206', airline: 'Etihad Airways', airport: 'Abu Dhabi (AUH)', city: 'Abu Dhabi', scheduledTime: '18:45 UTC', estimatedTime: '18:45 UTC', gate: 'B08', concourse: 'Concourse B', aircraft: 'Boeing 787-10', status: 'SCHEDULED' },

  // Arrivals
  { id: 'a1', type: 'ARRIVAL', flightNo: 'SPH-701', airline: 'Saphire Air', airport: 'Paris Charles de Gaulle (CDG)', city: 'Paris', scheduledTime: '14:20 UTC', estimatedTime: '14:15 UTC', gate: 'C05', concourse: 'Concourse C', aircraft: 'Airbus A350-1000', carousel: 'Belt 06', status: 'LANDED' },
  { id: 'a2', type: 'ARRIVAL', flightNo: 'SQ-401', airline: 'Singapore Airlines', airport: 'Singapore Changi (SIN)', city: 'Singapore', scheduledTime: '14:35 UTC', estimatedTime: '14:30 UTC', gate: 'B04', concourse: 'Concourse B', aircraft: 'Airbus A350-900', carousel: 'Belt 04', status: 'LANDED' },
  { id: 'a3', type: 'ARRIVAL', flightNo: 'EK-500', airline: 'Emirates', airport: 'Dubai International (DXB)', city: 'Dubai', scheduledTime: '14:50 UTC', estimatedTime: '14:50 UTC', gate: 'C14', concourse: 'Concourse C', aircraft: 'Airbus A380-800', carousel: 'Belt 08', status: 'ON TIME' },
  { id: 'a4', type: 'ARRIVAL', flightNo: 'SPH-809', airline: 'Saphire Air', airport: 'New York JFK (JFK)', city: 'New York', scheduledTime: '14:55 UTC', estimatedTime: '15:15 UTC', gate: 'C02', concourse: 'Concourse C', aircraft: 'Airbus A350-1000', carousel: 'Belt 07', status: 'DELAYED' },
  { id: 'a5', type: 'ARRIVAL', flightNo: 'AI-304', airline: 'Air India', airport: 'Delhi Indira Gandhi (DEL)', city: 'Delhi', scheduledTime: '15:15 UTC', estimatedTime: '15:15 UTC', gate: 'A05', concourse: 'Concourse A', aircraft: 'Airbus A321neo', carousel: 'Belt 01', status: 'ON TIME' },
  { id: 'a6', type: 'ARRIVAL', flightNo: 'QR-569', airline: 'Qatar Airways', airport: 'Doha Hamad (DOH)', city: 'Doha', scheduledTime: '15:30 UTC', estimatedTime: '15:30 UTC', gate: 'B10', concourse: 'Concourse B', aircraft: 'Boeing 777-300ER', carousel: 'Belt 05', status: 'ON TIME' },
  { id: 'a7', type: 'ARRIVAL', flightNo: 'LH-759', airline: 'Lufthansa', airport: 'Munich (MUC)', city: 'Munich', scheduledTime: '15:45 UTC', estimatedTime: '15:45 UTC', gate: 'C09', concourse: 'Concourse C', aircraft: 'Airbus A350-900', carousel: 'Belt 06', status: 'ON TIME' },
  { id: 'a8', type: 'ARRIVAL', flightNo: 'SPH-602', airline: 'Saphire Air', airport: 'Hyderabad Rajiv Gandhi (HYD)', city: 'Hyderabad', scheduledTime: '16:00 UTC', estimatedTime: '16:00 UTC', gate: 'A12', concourse: 'Concourse A', aircraft: 'Airbus A320neo', carousel: 'Belt 02', status: 'SCHEDULED' },
  { id: 'a9', type: 'ARRIVAL', flightNo: 'BA-137', airline: 'British Airways', airport: 'London Heathrow (LHR)', city: 'London', scheduledTime: '16:25 UTC', estimatedTime: '16:25 UTC', gate: 'C07', concourse: 'Concourse C', aircraft: 'Boeing 787-9', carousel: 'Belt 08', status: 'SCHEDULED' },
  { id: 'a10', type: 'ARRIVAL', flightNo: 'CX-659', airline: 'Cathay Pacific', airport: 'Hong Kong International (HKG)', city: 'Hong Kong', scheduledTime: '16:50 UTC', estimatedTime: '16:50 UTC', gate: 'B15', concourse: 'Concourse B', aircraft: 'Airbus A350-1000', carousel: 'Belt 04', status: 'SCHEDULED' },
  { id: 'a11', type: 'ARRIVAL', flightNo: 'NH-827', airline: 'ANA All Nippon', airport: 'Tokyo Haneda (HND)', city: 'Tokyo', scheduledTime: '17:10 UTC', estimatedTime: '17:10 UTC', gate: 'B01', concourse: 'Concourse B', aircraft: 'Boeing 787-9', carousel: 'Belt 05', status: 'SCHEDULED' },
  { id: 'a12', type: 'ARRIVAL', flightNo: 'SPH-515', airline: 'Saphire Air', airport: 'Chennai International (MAA)', city: 'Chennai', scheduledTime: '17:30 UTC', estimatedTime: '17:30 UTC', gate: 'A02', concourse: 'Concourse A', aircraft: 'Airbus A321neo', carousel: 'Belt 03', status: 'SCHEDULED' },
];

export const FlightSchedule: React.FC = () => {
  const [flightType, setFlightType] = useState<'DEPARTURE' | 'ARRIVAL'>('DEPARTURE');
  const [selectedDate, setSelectedDate] = useState<'TODAY' | 'TOMORROW'>('TODAY');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConcourse, setSelectedConcourse] = useState<string>('ALL');

  const filteredSchedule = useMemo(() => {
    return mockScheduleData.filter((flight) => {
      if (flight.type !== flightType) return false;
      if (selectedConcourse !== 'ALL' && flight.concourse !== selectedConcourse) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesFlightNo = flight.flightNo.toLowerCase().includes(query);
        const matchesAirline = flight.airline.toLowerCase().includes(query);
        const matchesAirport = flight.airport.toLowerCase().includes(query);
        const matchesCity = flight.city.toLowerCase().includes(query);
        return matchesFlightNo || matchesAirline || matchesAirport || matchesCity;
      }
      return true;
    });
  }, [flightType, selectedConcourse, searchQuery]);

  const getStatusBadge = (status: ScheduleFlight['status']) => {
    switch (status) {
      case 'BOARDING':
        return (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.5, borderRadius: '6px', background: '#FEF3C7', border: '1px solid #FDE68A', color: '#B45309', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 700 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#D97706', animation: 'pulseGlow 1.5s infinite' }} />
            BOARDING
          </Box>
        );
      case 'FINAL CALL':
        return (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.5, borderRadius: '6px', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 800 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#DC2626', animation: 'pulseGlow 1s infinite' }} />
            FINAL CALL
          </Box>
        );
      case 'GATE OPEN':
        return (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.5, borderRadius: '6px', background: '#E0F2FE', border: '1px solid #BAE6FD', color: '#0369A1', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 700 }}>
            <PlaneTakeoff size={12} /> GATE OPEN
          </Box>
        );
      case 'ON TIME':
        return (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.5, borderRadius: '6px', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 700 }}>
            <CheckCircle2 size={12} /> ON TIME
          </Box>
        );
      case 'LANDED':
        return (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.5, borderRadius: '6px', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 700 }}>
            <PlaneLanding size={12} /> LANDED
          </Box>
        );
      case 'SCHEDULED':
        return (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.5, borderRadius: '6px', background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#475569', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600 }}>
            <Clock size={12} /> SCHEDULED
          </Box>
        );
      case 'DELAYED':
        return (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.5, borderRadius: '6px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 700 }}>
            <AlertTriangle size={12} /> DELAYED
          </Box>
        );
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FAF9F6', color: '#0F2942' }}>
      <Navbar />

      {/* Header Banner: 1. Digital Timetable Board Image, 2. Apple Liquid Glass, 3. Content */}
      <Box
        sx={{
          pt: { xs: 14, md: 17 },
          pb: { xs: 5, md: 6 },
          px: { xs: 2, md: 4 },
          position: 'relative',
          backgroundImage: `linear-gradient(180deg, rgba(15, 41, 66, 0.42) 0%, rgba(15, 41, 66, 0.68) 100%), url(${bannerSchedule})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl">
          <Box
            className="apple-liquid-glass"
            sx={{
              p: { xs: 4, md: 5 },
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
                mb: 1.2,
                fontSize: { xs: '2rem', md: '2.75rem' },
                letterSpacing: '-0.025em',
              }}
            >
              Airport Flight Schedules
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#475569', maxWidth: '720px', lineHeight: 1.65, fontSize: '1rem' }}>
              Real-time master timetable of commercial flight movements across Central Terminal Concourses A, B, and C with live gate assignment and baggage claim telemetry.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Meaningful Airside Operations KPI Strip */}
      <Container maxWidth="xl" sx={{ mt: -3, mb: 4, position: 'relative', zIndex: 5 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
          <Paper
            elevation={0}
            className=""
            sx={{
              p: 2.2,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              boxShadow: '0 4px 16px rgba(15, 41, 66, 0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.8,
            }}
          >
            <Box sx={{ width: 42, height: 42, borderRadius: '10px', backgroundColor: 'rgba(2, 132, 199, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plane size={20} color="#0284C7" />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.68rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.06em' }}>
                TOTAL MOVEMENTS
              </Typography>
              <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#0F2942' }}>
                54 Scheduled
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            className=""
            sx={{
              p: 2.2,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              boxShadow: '0 4px 16px rgba(15, 41, 66, 0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.8,
            }}
          >
            <Box sx={{ width: 42, height: 42, borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlaneTakeoff size={20} color="#10B981" />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.68rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.06em' }}>
                DEPARTURES ACTIVE
              </Typography>
              <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#0F2942' }}>
                28 Flights (96.4% On-Time)
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2.2,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              boxShadow: '0 4px 16px rgba(15, 41, 66, 0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.8,
            }}
          >
            <Box sx={{ width: 42, height: 42, borderRadius: '10px', backgroundColor: 'rgba(217, 119, 6, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlaneLanding size={20} color="#D97706" />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.68rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.06em' }}>
                INBOUND ARRIVALS
              </Typography>
              <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#0F2942' }}>
                26 Expected Today
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            className=""
            sx={{
              p: 2.2,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              boxShadow: '0 4px 16px rgba(15, 41, 66, 0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.8,
            }}
          >
            <Box sx={{ width: 42, height: 42, borderRadius: '10px', backgroundColor: 'rgba(99, 102, 241, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wind size={20} color="#6366F1" />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.68rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.06em' }}>
                SPH METAR CONDITIONS
              </Typography>
              <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.94rem', fontWeight: 700, color: '#0F2942' }}>
                28°C • Wind 080°/11kt
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>

      {/* Main Interactive Schedule Table Section */}
      <Container maxWidth="xl" sx={{ pb: 8 }}>
        {/* Filter, Search & Concourse Navigation Bar */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 2.5 },
            mb: 3,
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 20px rgba(15, 41, 66, 0.04)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* Top Row: Toggle Buttons + Search + Date */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            {/* Departures / Arrivals Toggle */}
            <ToggleButtonGroup
              id="flight-direction-toggle"
              value={flightType}
              exclusive
              onChange={(_, val) => val && setFlightType(val)}
              sx={{ background: '#FAF9F6', p: 0.4, borderRadius: '10px', border: '1px solid #E2E8F0' }}
            >
              <ToggleButton
                value="DEPARTURE"
                sx={{
                  px: 2.8,
                  py: 0.9,
                  borderRadius: '8px !important',
                  color: flightType === 'DEPARTURE' ? '#FFFFFF !important' : '#475569',
                  backgroundColor: flightType === 'DEPARTURE' ? '#1E3A5F !important' : 'transparent',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  textTransform: 'none',
                  gap: 1,
                  border: 'none',
                  boxShadow: flightType === 'DEPARTURE' ? '0 2px 10px rgba(30, 58, 95, 0.25)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <PlaneTakeoff size={16} />
                Departures
              </ToggleButton>
              <ToggleButton
                value="ARRIVAL"
                sx={{
                  px: 2.8,
                  py: 0.9,
                  borderRadius: '8px !important',
                  color: flightType === 'ARRIVAL' ? '#FFFFFF !important' : '#475569',
                  backgroundColor: flightType === 'ARRIVAL' ? '#1E3A5F !important' : 'transparent',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  textTransform: 'none',
                  gap: 1,
                  border: 'none',
                  boxShadow: flightType === 'ARRIVAL' ? '0 2px 10px rgba(30, 58, 95, 0.25)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <PlaneLanding size={16} />
                Arrivals
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Live Search Input Field */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 auto' }, maxWidth: { md: '420px' } }}>
              <TextField
                fullWidth
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search flight no, airline, or city (e.g. SPH-102, London)..."
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={16} color="#64748B" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    backgroundColor: '#FAF9F6',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.86rem',
                    '& fieldset': { borderColor: '#E2E8F0' },
                    '&:hover fieldset': { borderColor: '#CBD5E1' },
                    '&.Mui-focused fieldset': { borderColor: '#0284C7' },
                  },
                }}
              />
            </Box>

            {/* Date Picker Toggle */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Calendar size={15} color="#64748B" />
              <Button
                onClick={() => setSelectedDate('TODAY')}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: '8px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  textTransform: 'none',
                  backgroundColor: selectedDate === 'TODAY' ? '#1E3A5F' : '#FFFFFF',
                  color: selectedDate === 'TODAY' ? '#FFFFFF' : '#475569',
                  borderColor: selectedDate === 'TODAY' ? '#1E3A5F' : '#CBD5E1',
                }}
              >
                Today
              </Button>
              <Button
                onClick={() => setSelectedDate('TOMORROW')}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: '8px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  textTransform: 'none',
                  backgroundColor: selectedDate === 'TOMORROW' ? '#1E3A5F' : '#FFFFFF',
                  color: selectedDate === 'TOMORROW' ? '#FFFFFF' : '#475569',
                  borderColor: selectedDate === 'TOMORROW' ? '#1E3A5F' : '#CBD5E1',
                }}
              >
                Tomorrow
              </Button>
            </Box>
          </Box>

          {/* Concourse Filter Tabs Bar (Single Terminal Model) */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', pt: 1, borderTop: '1px solid #F1F5F9' }}>
            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', color: '#64748B', fontWeight: 600, alignSelf: 'center', mr: 1 }}>
              CONCOURSE FILTER:
            </Typography>
            {[
              { id: 'ALL', label: 'All Concourses' },
              { id: 'Concourse A', label: 'Concourse A (Domestic)' },
              { id: 'Concourse B', label: 'Concourse B (Transcontinental)' },
              { id: 'Concourse C', label: 'Concourse C (Widebody Flagship)' },
            ].map((concourse) => {
              const isSelected = selectedConcourse === concourse.id;
              return (
                <button
                  key={concourse.id}
                  type="button"
                  onClick={() => setSelectedConcourse(concourse.id)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: isSelected ? '1px solid #0284C7' : '1px solid #E2E8F0',
                    backgroundColor: isSelected ? 'rgba(2, 132, 199, 0.08)' : '#FFFFFF',
                    color: isSelected ? '#0284C7' : '#475569',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.80rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                >
                  {concourse.label}
                </button>
              );
            })}
          </Box>
        </Paper>

        {/* Schedule FIDS Data Table */}
        <TableContainer
          component={Paper}
          elevation={0}
          className=""
          sx={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 8px 30px rgba(15, 41, 66, 0.04)',
            borderRadius: '16px',
            overflow: 'hidden',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          <Table>
            <TableHead sx={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <TableRow>
                <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em', py: 2 }}>FLIGHT NO</TableCell>
                <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em', py: 2 }}>AIRLINE / AIRCRAFT</TableCell>
                <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em', py: 2 }}>
                  {flightType === 'DEPARTURE' ? 'DESTINATION AIRPORT' : 'ORIGIN AIRPORT'}
                </TableCell>
                <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em', py: 2 }}>SCHEDULED (UTC)</TableCell>
                <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em', py: 2 }}>ESTIMATED</TableCell>
                <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em', py: 2 }}>
                  {flightType === 'DEPARTURE' ? 'GATE / CONCOURSE' : 'GATE / BAGGAGE'}
                </TableCell>
                <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em', py: 2 }}>STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSchedule.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6, color: '#64748B', fontFamily: "'Inter', sans-serif" }}>
                    No scheduled flight movements found matching your search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSchedule.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      borderBottom: '1px solid #F1F5F9',
                    }}
                  >
                    <TableCell sx={{ color: '#0F2942', fontFamily: "'Geist Mono', monospace", fontWeight: 700, fontSize: '0.88rem' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Plane size={14} color="#0284C7" />
                        {row.flightNo}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: '#1E293B', fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', fontWeight: 600 }}>
                        {row.airline}
                      </Typography>
                      <Typography sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem' }}>
                        {row.aircraft}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: '#0F2942', fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '0.88rem' }}>
                        {row.airport}
                      </Typography>
                      <Typography sx={{ color: '#64748B', fontFamily: "'Inter', sans-serif", fontSize: '0.75rem' }}>
                        Non-stop • Central Terminal
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontFamily: "'Geist Mono', monospace", fontSize: '0.84rem' }}>
                      {row.scheduledTime}
                    </TableCell>
                    <TableCell sx={{ color: row.status === 'DELAYED' ? '#B91C1C' : '#047857', fontFamily: "'Geist Mono', monospace", fontSize: '0.84rem', fontWeight: 600 }}>
                      {row.estimatedTime}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#F1F5F9', border: '1px solid #E2E8F0', fontWeight: 700, color: '#1E3A5F', fontFamily: "'Geist Mono', monospace", fontSize: '0.78rem' }}>
                          Gate {row.gate}
                        </span>
                        {flightType === 'ARRIVAL' && row.carousel && (
                          <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(2, 132, 199, 0.08)', border: '1px solid rgba(2, 132, 199, 0.2)', fontWeight: 600, color: '#0284C7', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Luggage size={11} /> {row.carousel}
                          </span>
                        )}
                        {flightType === 'DEPARTURE' && (
                          <span style={{ color: '#64748B', fontFamily: "'Inter', sans-serif", fontSize: '0.75rem' }}>
                            {row.concourse}
                          </span>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{getStatusBadge(row.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Footer />
    </Box>
  );
};

export default FlightSchedule;
