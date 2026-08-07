import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Box, Container, Typography, Paper, ToggleButtonGroup, ToggleButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { PlaneLanding, PlaneTakeoff, Calendar, CheckCircle2, Clock, AlertTriangle, Plane } from 'lucide-react';

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
        return <Chip icon={<CheckCircle2 size={13} />} label="BOARDING" color="success" size="small" sx={{ fontWeight: 700 }} />;
      case 'ON TIME':
        return <Chip icon={<CheckCircle2 size={13} />} label="ON TIME" color="success" size="small" sx={{ fontWeight: 700 }} />;
      case 'LANDED':
        return <Chip icon={<PlaneLanding size={13} />} label="LANDED" color="info" size="small" sx={{ fontWeight: 700 }} />;
      case 'SCHEDULED':
        return <Chip icon={<Clock size={13} />} label="SCHEDULED" color="default" size="small" sx={{ fontWeight: 700 }} />;
      case 'DELAYED':
        return <Chip icon={<AlertTriangle size={13} />} label="DELAYED" color="error" size="small" sx={{ fontWeight: 700 }} />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0B1020', color: '#F4F4F4' }}>
      <Navbar />

      {/* Header Banner */}
      <Box sx={{ pt: 14, pb: 6, background: 'linear-gradient(180deg, #1E1B4B 0%, #0B1020 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth="xl">
          <Typography component="span" sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.15em', color: '#38BDF8', textTransform: 'uppercase' }}>
            MASTER TERMINAL TIMETABLE
          </Typography>
          <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mt: 1, mb: 1 }}>
            Airport Flight Schedule
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', maxWidth: '650px' }}>
            Comprehensive real-time schedule of all arriving and departing flights across Terminal 1 & Terminal 2.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Toggle & Date Selector Bar */}
        <Paper elevation={0} sx={{ p: 2.5, mb: 4, background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          {/* Departures / Arrivals Toggle */}
          <ToggleButtonGroup
            id="departures"
            value={flightType}
            exclusive
            onChange={(_, val) => val && setFlightType(val)}
            sx={{ background: 'rgba(2, 6, 23, 0.8)', p: 0.5, borderRadius: '12px' }}
          >
            <ToggleButton
              value="DEPARTURE"
              sx={{
                px: 3,
                py: 1,
                borderRadius: '8px !important',
                color: flightType === 'DEPARTURE' ? '#FFFFFF' : '#94A3B8',
                backgroundColor: flightType === 'DEPARTURE' ? '#2563EB !important' : 'transparent',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                textTransform: 'none',
                gap: 1,
              }}
            >
              <PlaneTakeoff size={18} />
              Departures
            </ToggleButton>
            <ToggleButton
              id="arrivals"
              value="ARRIVAL"
              sx={{
                px: 3,
                py: 1,
                borderRadius: '8px !important',
                color: flightType === 'ARRIVAL' ? '#FFFFFF' : '#94A3B8',
                backgroundColor: flightType === 'ARRIVAL' ? '#059669 !important' : 'transparent',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                textTransform: 'none',
                gap: 1,
              }}
            >
              <PlaneLanding size={18} />
              Arrivals
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Date Picker Buttons */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Calendar size={18} color="#94A3B8" />
            <Button
              onClick={() => setSelectedDate('TODAY')}
              variant={selectedDate === 'TODAY' ? 'contained' : 'outlined'}
              size="small"
              sx={{ borderRadius: '8px', fontFamily: "'Outfit', sans-serif", fontWeight: 600, textTransform: 'none' }}
            >
              Today (07 Aug)
            </Button>
            <Button
              onClick={() => setSelectedDate('TOMORROW')}
              variant={selectedDate === 'TOMORROW' ? 'contained' : 'outlined'}
              size="small"
              sx={{ borderRadius: '8px', fontFamily: "'Outfit', sans-serif", fontWeight: 600, textTransform: 'none' }}
            >
              Tomorrow (08 Aug)
            </Button>
          </Box>
        </Paper>

        {/* Schedule Table */}
        <TableContainer component={Paper} elevation={0} sx={{ background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '16px', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ background: 'rgba(2, 6, 23, 0.7)' }}>
              <TableRow>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>FLIGHT NO</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>AIRLINE</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>{flightType === 'DEPARTURE' ? 'DESTINATION AIRPORT' : 'ORIGIN AIRPORT'}</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>SCHEDULED</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>GATE / TML</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSchedule.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.04)' } }}>
                  <TableCell sx={{ color: '#FFFFFF', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Plane size={15} color="#38BDF8" />
                      {row.flightNo}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#CBD5E1', fontFamily: "'Inter', sans-serif" }}>{row.airline}</TableCell>
                  <TableCell sx={{ color: '#F8FAFC', fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>{row.airport}</TableCell>
                  <TableCell sx={{ color: '#CBD5E1', fontFamily: "'Inter', sans-serif" }}>{row.time}</TableCell>
                  <TableCell sx={{ color: '#38BDF8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>{row.gate} ({row.terminal})</TableCell>
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
