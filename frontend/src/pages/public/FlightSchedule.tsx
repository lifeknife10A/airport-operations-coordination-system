import React, { useState, useEffect } from 'react';
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
import { flightApi } from '../../api/flightApi';
import axiosClient from '../../api/axiosClient';
import type { Flight } from '../../types';
import bannerSchedule from '../../assets/banners/airport-digital-board.png';

interface WeatherReport {
  visibilityMeters: number;
  windSpeedKnots: number;
  temperatureCelsius: number;
  runwayCondition: string;
  observedAt: string;
}

const pad = (n: number) => String(n).padStart(2, '0');
const dayOf = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${pad(d.getUTCDate())} ${d.toLocaleString('en', { month: 'short', timeZone: 'UTC' })}`;
};
const timeOf = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
};

export const FlightSchedule: React.FC = () => {
  const [flightType, setFlightType] = useState<'DEPARTURE' | 'ARRIVAL'>('DEPARTURE');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<Flight[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [weather, setWeather] = useState<WeatherReport | null>(null);

  useEffect(() => {
    flightApi.getScheduleSummary().then(setSummary).catch(() => setSummary({}));
    axiosClient.get<WeatherReport>('/weather/latest').then((r) => setWeather(r.data || null)).catch(() => setWeather(null));
  }, []);

  // One server page at a time; search is run by the server (debounced).
  useEffect(() => {
    let cancelled = false;
    const handle = setTimeout(() => {
      setLoading(true);
      flightApi
        .getSchedule(flightType, searchQuery.trim(), page)
        .then((res) => {
          if (cancelled) return;
          setRows(res.content);
          setTotalPages(Math.max(1, res.totalPages));
          setTotalElements(res.totalElements);
          setLoadError(false);
        })
        .catch(() => !cancelled && setLoadError(true))
        .finally(() => !cancelled && setLoading(false));
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [flightType, searchQuery, page]);

  const getStatusBadge = (status: string) => {
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
      default:
        return (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.5, borderRadius: '6px', background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#475569', fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', fontWeight: 700 }}>
            {status}
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
              Real-time master timetable of commercial flight movements at Saphire International, with gate assignments and baggage carousels.
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
                TOTAL MOVEMENTS ON RECORD
              </Typography>
              <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#0F2942' }}>
                {((summary.DEPARTURE ?? 0) + (summary.ARRIVAL ?? 0)).toLocaleString()} Movements
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
                DEPARTURES
              </Typography>
              <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#0F2942' }}>
                {(summary.DEPARTURE ?? 0).toLocaleString()} Departures · {(summary.BOARDING ?? 0).toLocaleString()} Boarding
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
                ARRIVALS
              </Typography>
              <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#0F2942' }}>
                {(summary.ARRIVAL ?? 0).toLocaleString()} Arrivals · {(summary.DELAYED ?? 0).toLocaleString()} Delayed
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
                LATEST WEATHER REPORT
              </Typography>
              <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.94rem', fontWeight: 700, color: '#0F2942' }}>
                {weather ? `${weather.temperatureCelsius}°C • ${weather.windSpeedKnots} kt • vis ${weather.visibilityMeters} m` : 'No report'}
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
              onChange={(_, val) => { if (val) { setFlightType(val); setPage(0); } }}
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
                onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                placeholder="Search flight no, airline, city or airport code..."
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

            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', color: '#64748B' }}>
              {totalElements.toLocaleString()} {flightType === 'DEPARTURE' ? 'departures' : 'arrivals'}, newest first
            </Typography>
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
                  {flightType === 'DEPARTURE' ? 'GATE' : 'GATE / BAGGAGE'}
                </TableCell>
                <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em', py: 2 }}>STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6, color: '#64748B', fontFamily: "'Inter', sans-serif" }}>
                    {loading ? 'Loading flights…' : loadError ? 'The schedule could not be loaded. Please try again.' : 'No flight movements match your search.'}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => {
                  const departure = row.flightType === 'DEPARTURE';
                  const airport = departure ? `${row.destinationAirportName} (${row.destinationAirportCode})` : `${row.originAirportName} (${row.originAirportCode})`;
                  return (
                    <TableRow key={row.flightId} hover sx={{ borderBottom: '1px solid #F1F5F9' }}>
                      <TableCell sx={{ color: '#0F2942', fontFamily: "'Geist Mono', monospace", fontWeight: 700, fontSize: '0.88rem' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Plane size={14} color="#0284C7" />
                          {row.flightNumber}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: '#1E293B', fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', fontWeight: 600 }}>{row.airlineName}</Typography>
                        <Typography sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem' }}>{row.aircraftType}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: '#0F2942', fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '0.88rem' }}>{airport}</Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#475569', fontFamily: "'Geist Mono', monospace", fontSize: '0.84rem' }}>
                        {dayOf(row.scheduledAt)} {timeOf(row.scheduledAt)}
                      </TableCell>
                      <TableCell sx={{ color: row.status === 'DELAYED' ? '#B91C1C' : '#047857', fontFamily: "'Geist Mono', monospace", fontSize: '0.84rem', fontWeight: 600 }}>
                        {row.estimatedAt ? `${dayOf(row.estimatedAt)} ${timeOf(row.estimatedAt)}` : '—'}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#F1F5F9', border: '1px solid #E2E8F0', fontWeight: 700, color: '#1E3A5F', fontFamily: "'Geist Mono', monospace", fontSize: '0.78rem' }}>
                            {row.gateCode ? `Gate ${row.gateCode}` : 'Gate TBA'}
                          </span>
                          {!departure && row.carousel && (
                            <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(2, 132, 199, 0.08)', border: '1px solid rgba(2, 132, 199, 0.2)', fontWeight: 600, color: '#0284C7', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <Luggage size={11} /> {row.carousel}
                            </span>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{getStatusBadge(row.status)}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 3 }}>
          <Button disabled={page === 0 || loading} onClick={() => setPage((p) => p - 1)} sx={{ textTransform: 'none', fontWeight: 600 }}>Previous</Button>
          <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.8rem', color: '#64748B' }}>Page {page + 1} of {totalPages}</Typography>
          <Button disabled={page + 1 >= totalPages || loading} onClick={() => setPage((p) => p + 1)} sx={{ textTransform: 'none', fontWeight: 600 }}>Next</Button>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default FlightSchedule;
