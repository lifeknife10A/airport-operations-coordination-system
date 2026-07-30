import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Plane,
  AlertTriangle,
  Activity,
  Layers,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { reportApi } from '../api/reportApi';
import { flightApi } from '../api/flightApi';
import { ReportSummary, Flight } from '../types';
import { StatusChip } from '../components/StatusChip';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<ReportSummary>({
    totalFlightsToday: 48,
    activeHubFlights: 14,
    landedCount: 18,
    delayedCount: 3,
    onTimeDepartureRate: 94.2,
    pendingTasksCount: 8,
    activeGateOccupancyRate: 85.0,
  });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);

  const mockFlights: Flight[] = [
    {
      flightId: 101,
      flightNumber: 'SPH-402',
      airlineCode: 'SPH',
      airlineName: 'Saphire Airways',
      flightType: 'ARRIVAL',
      originAirportCode: 'BOM',
      originAirportName: 'Mumbai CSMIA',
      destinationAirportCode: 'SPH',
      destinationAirportName: 'Saphire Intl',
      aircraftRegistration: 'VT-SPA',
      aircraftType: 'A320neo',
      scheduledTime: '14:30:00',
      estimatedTime: '14:28:00',
      status: 'LANDED',
      gateCode: 'A1',
      standCode: 'S101',
    },
    {
      flightId: 102,
      flightNumber: 'SPH-718',
      airlineCode: 'SPH',
      airlineName: 'Saphire Airways',
      flightType: 'DEPARTURE',
      originAirportCode: 'SPH',
      originAirportName: 'Saphire Intl',
      destinationAirportCode: 'DEL',
      destinationAirportName: 'Delhi IGI',
      aircraftRegistration: 'VT-SPB',
      aircraftType: 'B737-MAX',
      scheduledTime: '15:15:00',
      estimatedTime: '15:15:00',
      status: 'SERVICING',
      gateCode: 'B4',
      standCode: 'S104',
    },
    {
      flightId: 103,
      flightNumber: 'AI-631',
      airlineCode: 'AI',
      airlineName: 'Air India',
      flightType: 'ARRIVAL',
      originAirportCode: 'DXB',
      originAirportName: 'Dubai Intl',
      destinationAirportCode: 'SPH',
      destinationAirportName: 'Saphire Intl',
      aircraftRegistration: 'VT-ALN',
      aircraftType: 'B787-9',
      scheduledTime: '15:45:00',
      estimatedTime: '16:10:00',
      status: 'DELAYED',
      gateCode: 'C2',
      standCode: 'S202',
    },
    {
      flightId: 104,
      flightNumber: '6E-204',
      airlineCode: '6E',
      airlineName: 'IndiGo',
      flightType: 'DEPARTURE',
      originAirportCode: 'SPH',
      originAirportName: 'Saphire Intl',
      destinationAirportCode: 'BLR',
      destinationAirportName: 'Bengaluru',
      aircraftRegistration: 'VT-IZC',
      aircraftType: 'A321neo',
      scheduledTime: '16:00:00',
      estimatedTime: '16:00:00',
      status: 'BOARDING',
      gateCode: 'A3',
      standCode: 'S103',
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const sumData = await reportApi.getSummary();
      if (sumData) setSummary(sumData);
      const fltData = await flightApi.getSaphireHubFlights();
      if (fltData && fltData.length > 0) setFlights(fltData);
      else setFlights(mockFlights);
    } catch {
      setFlights(mockFlights);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
            Central Operations Control Unit
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            CSMIA Hub Inspired Operations Matrix • Saphire Hub (`SPH / VASP`)
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshCw size={16} />}
          onClick={fetchData}
          disabled={loading}
          sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
        >
          {loading ? 'Refreshing...' : 'Refresh Live Feeds'}
        </Button>
      </Box>

      {/* Metric Cards Row */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 1,
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                  Active Hub Flights
                </Typography>
                <Plane size={20} color="#38bdf8" />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#ffffff' }}>
                {summary.activeHubFlights}
              </Typography>
              <Typography variant="caption" sx={{ color: '#34d399', display: 'flex', alignItems: 'center', mt: 0.5, fontWeight: 700 }}>
                <ArrowUpRight size={14} /> +4 inbound in next 60m
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 1,
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                  On-Time Departure Rate
                </Typography>
                <Activity size={20} color="#34d399" />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#34d399' }}>
                {summary.onTimeDepartureRate}%
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', mt: 0.5, display: 'block' }}>
                Target guard: &ge; 92.0%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 1,
              background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                  Active Delays (&gt;15m)
                </Typography>
                <AlertTriangle size={20} color="#fb7185" />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#fb7185' }}>
                {summary.delayedCount}
              </Typography>
              <Typography variant="caption" sx={{ color: '#fb7185', mt: 0.5, display: 'block', fontWeight: 700 }}>
                1 Critical Late Aircraft
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 1,
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                  Pending Turnaround Tasks
                </Typography>
                <Layers size={20} color="#fbbf24" />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#fbbf24' }}>
                {summary.pendingTasksCount}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', mt: 0.5, display: 'block' }}>
                Refueling & Cleaning active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column: Live FIDS Ticker Table */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ p: 1 }}>
            <CardContent sx={{ pb: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                  Live SPH Hub Operations Stream
                </Typography>
                <Button size="small" onClick={() => navigate('/flights')}>
                  View Full FIDS Table &rarr;
                </Button>
              </Box>

              <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Flight #</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Type</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Route</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Schedule</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Gate / Stand</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {flights.map((f) => (
                      <TableRow
                        key={f.flightId}
                        hover
                        onClick={() => navigate(`/flights/${f.flightId}`)}
                        sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell sx={{ fontWeight: 700, color: '#ffffff' }}>{f.flightNumber}</TableCell>
                        <TableCell>
                          <Chip
                            label={f.flightType}
                            size="small"
                            sx={{
                              fontSize: '0.68rem',
                              backgroundColor: f.flightType === 'ARRIVAL' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(13, 148, 136, 0.15)',
                              color: f.flightType === 'ARRIVAL' ? '#60a5fa' : '#2dd4bf',
                              fontWeight: 700,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#cbd5e1' }}>
                          {f.originAirportCode} &rarr; {f.destinationAirportCode}
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'JetBrains Mono, monospace', color: '#38bdf8' }}>
                          {f.scheduledTime}
                        </TableCell>
                        <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>
                          {f.gateCode ? `Gate ${f.gateCode}` : 'Unassigned'} ({f.standCode || 'S0'})
                        </TableCell>
                        <TableCell>
                          <StatusChip status={f.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Gate & Stand Occupancy Mini-Map & Delay Alerts */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Active Delay Alert Banner */}
            <Card sx={{ borderLeft: '4px solid #f43f5e', backgroundColor: 'rgba(244, 63, 94, 0.05)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <AlertTriangle color="#f43f5e" size={22} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f43f5e' }}>
                    Active Delay Alert (AI-631)
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 1.5 }}>
                  Air India AI-631 delayed by +25 minutes due to Dubai ATC congestion. Turnaround team alerted for rapid 35-min recovery.
                </Typography>
                <Button variant="outlined" color="error" size="small" fullWidth onClick={() => navigate('/tasks')}>
                  Manage Turnaround Tasks
                </Button>
              </CardContent>
            </Card>

            {/* Terminal Gate Occupancy Mini-Map */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                    Terminal Gate Map (SPH)
                  </Typography>
                  <Chip label="85% Occupied" size="small" color="primary" sx={{ fontWeight: 700 }} />
                </Box>

                <Grid container spacing={1.5}>
                  {['A1 (VT-SPA)', 'A2 (FREE)', 'A3 (VT-IZC)', 'B1 (FREE)', 'B4 (VT-SPB)', 'C2 (AI-631)'].map((g, idx) => {
                    const isOccupied = !g.includes('FREE');
                    return (
                      <Grid size={6} key={idx}>
                        <Paper
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            textAlign: 'center',
                            backgroundColor: isOccupied ? 'rgba(30, 64, 175, 0.25)' : 'rgba(16, 185, 129, 0.15)',
                            border: isOccupied ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
                          }}
                        >
                          <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontWeight: 600 }}>
                            Gate {g.split(' ')[0]}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: isOccupied ? '#60a5fa' : '#34d399' }}>
                            {g.split(' ')[1] || 'AVAILABLE'}
                          </Typography>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>

                <Button fullWidth sx={{ mt: 2 }} variant="text" onClick={() => navigate('/gates')}>
                  Open Interactive Gate Allocator &rarr;
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
