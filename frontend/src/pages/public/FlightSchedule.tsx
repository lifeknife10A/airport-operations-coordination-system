import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Box, Container, Typography, Paper, ToggleButtonGroup, ToggleButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { PlaneLanding, PlaneTakeoff, Calendar, CheckCircle2, Clock, AlertTriangle, Plane } from 'lucide-react';
import bannerSchedule from '../../assets/banners/airport-digital-board.png';

interface ScheduleFlight {
  id: string;
  type: 'DEPARTURE' | 'ARRIVAL';
  flightNo: string;
  airline: string;
  airport: string;
  time: string;
  estimatedTime: string;
  gate: string;
  terminal: string;
  status: 'ON TIME' | 'BOARDING' | 'LANDED' | 'DELAYED' | 'SCHEDULED';
}

const mockScheduleData: ScheduleFlight[] = [
  { id: '1', type: 'DEPARTURE', flightNo: 'SPH-102', airline: 'Saphire Air', airport: 'London Heathrow (LHR)', time: '14:45 UTC', estimatedTime: '14:45 UTC', gate: 'B12', terminal: 'T2', status: 'BOARDING' },
  { id: '2', type: 'DEPARTURE', flightNo: 'SPH-204', airline: 'Singapore Airlines', airport: 'Dubai International (DXB)', time: '15:10 UTC', estimatedTime: '15:10 UTC', gate: 'A04', terminal: 'T1', status: 'ON TIME' },
  { id: '3', type: 'DEPARTURE', flightNo: 'SPH-308', airline: 'ANA Japan', airport: 'Los Angeles (LAX)', time: '15:30 UTC', estimatedTime: '15:30 UTC', gate: 'C22', terminal: 'T2', status: 'SCHEDULED' },
  { id: '4', type: 'ARRIVAL', flightNo: 'SPH-701', airline: 'Emirates', airport: 'Paris Charles de Gaulle (CDG)', time: '14:20 UTC', estimatedTime: '14:15 UTC', gate: 'B02', terminal: 'T2', status: 'LANDED' },
  { id: '5', type: 'ARRIVAL', flightNo: 'SPH-809', airline: 'British Airways', airport: 'New York (JFK)', time: '14:55 UTC', estimatedTime: '15:15 UTC', gate: 'A10', terminal: 'T1', status: 'DELAYED' },
  { id: '6', type: 'DEPARTURE', flightNo: 'SPH-518', airline: 'Lufthansa', airport: 'Frankfurt (FRA)', time: '16:25 UTC', estimatedTime: '16:45 UTC', gate: 'A15', terminal: 'T1', status: 'DELAYED' },
];

export const FlightSchedule: React.FC = () => {
  const [flightType, setFlightType] = useState<'DEPARTURE' | 'ARRIVAL'>('DEPARTURE');
  const [selectedDate, setSelectedDate] = useState<'TODAY' | 'TOMORROW'>('TODAY');

  const filteredSchedule = mockScheduleData.filter((item) => item.type === flightType);

  const getStatusBadge = (status: ScheduleFlight['status']) => {
    switch (status) {
      case 'BOARDING':
        return (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.5, borderRadius: '6px', background: '#FEF3C7', border: '1px solid #FDE68A', color: '#B45309', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600 }}>
            <CheckCircle2 size={12} /> BOARDING
          </Box>
        );
      case 'ON TIME':
        return (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.5, borderRadius: '6px', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600 }}>
            <CheckCircle2 size={12} /> ON TIME
          </Box>
        );
      case 'LANDED':
        return (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.5, borderRadius: '6px', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600 }}>
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
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.5, borderRadius: '6px', background: '#FEE2E2', border: '1px solid #FECACA', color: '#B91C1C', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600 }}>
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
          pb: { xs: 5, md: 7 },
          px: { xs: 2, md: 4 },
          position: 'relative',
          backgroundImage: `linear-gradient(180deg, rgba(15, 41, 66, 0.42) 0%, rgba(15, 41, 66, 0.65) 100%), url(${bannerSchedule})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
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
              Airport Flight Schedules
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#475569', maxWidth: '680px', lineHeight: 1.65, fontSize: '1rem' }}>
              Synchronized master schedule of all arriving and departing commercial flights across Terminal 1 &amp; Terminal 2 concourses.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Toggle & Date Selector Bar */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 4,
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 20px rgba(15, 41, 66, 0.04)',
            borderRadius: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Departures / Arrivals Toggle */}
          <ToggleButtonGroup
            id="departures"
            value={flightType}
            exclusive
            onChange={(_, val) => val && setFlightType(val)}
            sx={{ background: '#FAF9F6', p: 0.5, borderRadius: '10px', border: '1px solid #E2E8F0' }}
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
              }}
            >
              <PlaneTakeoff size={16} />
              Departures
            </ToggleButton>
            <ToggleButton
              id="arrivals"
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
              }}
            >
              <PlaneLanding size={16} />
              Arrivals
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Date Picker Buttons */}
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Calendar size={16} color="#64748B" />
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
                boxShadow: selectedDate === 'TODAY' ? '0 2px 8px rgba(30, 58, 95, 0.2)' : 'none',
                '&:hover': {
                  backgroundColor: selectedDate === 'TODAY' ? '#162C46' : '#F1F5F9',
                  borderColor: selectedDate === 'TODAY' ? '#162C46' : '#94A3B8',
                },
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
                boxShadow: selectedDate === 'TOMORROW' ? '0 2px 8px rgba(30, 58, 95, 0.2)' : 'none',
                '&:hover': {
                  backgroundColor: selectedDate === 'TOMORROW' ? '#162C46' : '#F1F5F9',
                  borderColor: selectedDate === 'TOMORROW' ? '#162C46' : '#94A3B8',
                },
              }}
            >
              Tomorrow
            </Button>
          </Box>
        </Paper>

        {/* Schedule FIDS Table */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 8px 30px rgba(15, 41, 66, 0.04)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          <Table>
            <TableHead sx={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <TableRow>
                <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em', py: 2 }}>FLIGHT NO</TableCell>
                <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em', py: 2 }}>AIRLINE</TableCell>
                <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em', py: 2 }}>{flightType === 'DEPARTURE' ? 'DESTINATION AIRPORT' : 'ORIGIN AIRPORT'}</TableCell>
                <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em', py: 2 }}>SCHEDULED (UTC)</TableCell>
                <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em', py: 2 }}>GATE / TML</TableCell>
                <TableCell sx={{ color: '#64748B', fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em', py: 2 }}>STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSchedule.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:hover': { backgroundColor: 'rgba(30, 58, 95, 0.02)' }, borderBottom: '1px solid #F1F5F9' }}>
                  <TableCell sx={{ color: '#0F2942', fontFamily: "'Geist Mono', monospace", fontWeight: 700, fontSize: '0.88rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Plane size={14} color="#0284C7" />
                      {row.flightNo}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#334155', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', fontWeight: 500 }}>{row.airline}</TableCell>
                  <TableCell sx={{ color: '#0F2942', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '0.9rem' }}>{row.airport}</TableCell>
                  <TableCell sx={{ color: '#475569', fontFamily: "'Geist Mono', monospace", fontSize: '0.84rem' }}>{row.time}</TableCell>
                  <TableCell sx={{ color: '#0F2942', fontFamily: "'Geist Mono', monospace", fontSize: '0.82rem' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '6px', background: '#F8FAFC', border: '1px solid #E2E8F0', fontWeight: 600, color: '#1E3A5F' }}>
                      {row.gate} ({row.terminal})
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(row.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Footer />
    </Box>
  );
};

export default FlightSchedule;
