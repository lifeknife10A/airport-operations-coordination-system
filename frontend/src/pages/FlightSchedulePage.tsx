import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Grid,
} from '@mui/material';
import { Search, Plus, RefreshCw, Edit3, Eye } from 'lucide-react';
import { flightApi } from '../api/flightApi';
import { Flight, FlightCreatePayload } from '../types';
import { StatusChip } from '../components/StatusChip';
import { useNavigate } from 'react-router-dom';

export const FlightSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  // Dialogs state
  const [openCreate, setOpenCreate] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [newStatus, setNewStatus] = useState('LANDED');

  const [createForm, setCreateForm] = useState<FlightCreatePayload>({
    flightNumber: 'SPH-505',
    airlineCode: 'SPH',
    airlineName: 'Saphire Airways',
    flightType: 'ARRIVAL',
    originAirportId: 2, // BOM
    destinationAirportId: 1, // SPH
    aircraftRegistration: 'VT-SPC',
    aircraftType: 'A320neo',
    scheduledTime: new Date().toISOString(),
  });

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const data = await flightApi.getSaphireHubFlights();
      if (data && data.length > 0) setFlights(data);
      else setFlights(mockData);
    } catch {
      setFlights(mockData);
    } finally {
      setLoading(false);
    }
  };

  const mockData: Flight[] = [
    {
      flightId: 1,
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
      flightId: 2,
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
      flightId: 3,
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
      flightId: 4,
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

  useEffect(() => {
    fetchFlights();
  }, []);

  const handleCreate = async () => {
    try {
      await flightApi.createFlight(createForm);
      setOpenCreate(false);
      fetchFlights();
    } catch {
      const newFlt: Flight = {
        flightId: Date.now(),
        flightNumber: createForm.flightNumber,
        airlineCode: createForm.airlineCode,
        airlineName: createForm.airlineName,
        flightType: createForm.flightType,
        originAirportCode: createForm.flightType === 'ARRIVAL' ? 'BOM' : 'SPH',
        originAirportName: createForm.flightType === 'ARRIVAL' ? 'Mumbai CSMIA' : 'Saphire Intl',
        destinationAirportCode: createForm.flightType === 'ARRIVAL' ? 'SPH' : 'DEL',
        destinationAirportName: createForm.flightType === 'ARRIVAL' ? 'Saphire Intl' : 'Delhi IGI',
        aircraftRegistration: createForm.aircraftRegistration,
        aircraftType: createForm.aircraftType,
        scheduledTime: '17:00:00',
        status: 'SCHEDULED',
        gateCode: 'A2',
        standCode: 'S102',
      };
      setFlights([newFlt, ...flights]);
      setOpenCreate(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedFlight) return;
    try {
      await flightApi.updateFlightStatus(selectedFlight.flightId, newStatus);
      setOpenStatus(false);
      fetchFlights();
    } catch {
      setFlights(
        flights.map((f) =>
          f.flightId === selectedFlight.flightId ? { ...f, status: newStatus as any } : f
        )
      );
      setOpenStatus(false);
    }
  };

  const filteredFlights = flights.filter((f) => {
    const matchesSearch =
      f.flightNumber.toLowerCase().includes(search.toLowerCase()) ||
      f.airlineName.toLowerCase().includes(search.toLowerCase()) ||
      f.aircraftRegistration.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || f.flightType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff' }}>
            Live FIDS Flight Schedule Matrix
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Real-Time Flight Information Display System for Saphire Airport Hub (`SPH`)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={fetchFlights}
            disabled={loading}
            sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => setOpenCreate(true)}
            sx={{
              background: 'linear-gradient(90deg, #1e40af 0%, #0d9488 100%)',
              fontWeight: 700,
            }}
          >
            Create Flight Schedule
          </Button>
        </Box>
      </Box>

      {/* Filter and Search Bar */}
      <Card sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              placeholder="Search flight number, airline, tail #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} color="#94a3b8" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Flight Type</InputLabel>
              <Select
                value={typeFilter}
                label="Flight Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="ALL">All Flights</MenuItem>
                <MenuItem value="ARRIVAL">Inbound (Arrival)</MenuItem>
                <MenuItem value="DEPARTURE">Outbound (Departure)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="SCHEDULED">SCHEDULED</MenuItem>
                <MenuItem value="LANDED">LANDED</MenuItem>
                <MenuItem value="SERVICING">SERVICING</MenuItem>
                <MenuItem value="BOARDING">BOARDING</MenuItem>
                <MenuItem value="READY">READY</MenuItem>
                <MenuItem value="DELAYED">DELAYED</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
              Showing {filteredFlights.length} of {flights.length} flights
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* FIDS Flight Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Table>
              <TableHead sx={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                <TableRow>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Flight #</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Airline</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Type</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Origin &rarr; Destination</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Aircraft (Tail)</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Scheduled Time</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Gate / Stand</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFlights.map((f) => (
                  <TableRow key={f.flightId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 800, color: '#ffffff', fontSize: '0.95rem' }}>
                      {f.flightNumber}
                    </TableCell>
                    <TableCell sx={{ color: '#cbd5e1' }}>{f.airlineName}</TableCell>
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
                    <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>
                      {f.originAirportCode} &rarr; {f.destinationAirportCode}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'JetBrains Mono, monospace', color: '#94a3b8' }}>
                      {f.aircraftType} ({f.aircraftRegistration})
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'JetBrains Mono, monospace', color: '#38bdf8', fontWeight: 600 }}>
                      {f.scheduledTime}
                    </TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>
                      {f.gateCode ? `Gate ${f.gateCode}` : 'Unassigned'} ({f.standCode || 'S0'})
                    </TableCell>
                    <TableCell>
                      <StatusChip status={f.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/flights/${f.flightId}`)}
                          sx={{ color: '#60a5fa' }}
                          title="View Turnaround Detail"
                        >
                          <Eye size={18} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedFlight(f);
                            setNewStatus(f.status);
                            setOpenStatus(true);
                          }}
                          sx={{ color: '#f59e0b' }}
                          title="Update Flight Status"
                        >
                          <Edit3 size={18} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create Flight Modal */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create Saphire Hub Flight Schedule</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Flight Number"
            value={createForm.flightNumber}
            onChange={(e) => setCreateForm({ ...createForm, flightNumber: e.target.value })}
            fullWidth
          />
          <TextField
            label="Airline Name"
            value={createForm.airlineName}
            onChange={(e) => setCreateForm({ ...createForm, airlineName: e.target.value })}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Flight Type</InputLabel>
            <Select
              value={createForm.flightType}
              label="Flight Type"
              onChange={(e) => setCreateForm({ ...createForm, flightType: e.target.value as any })}
            >
              <MenuItem value="ARRIVAL">Inbound Arrival to SPH Hub</MenuItem>
              <MenuItem value="DEPARTURE">Outbound Departure from SPH Hub</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Aircraft Registration (Tail #)"
            value={createForm.aircraftRegistration}
            onChange={(e) => setCreateForm({ ...createForm, aircraftRegistration: e.target.value })}
            fullWidth
          />
          <TextField
            label="Aircraft Type"
            value={createForm.aircraftType}
            onChange={(e) => setCreateForm({ ...createForm, aircraftType: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create Schedule
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Modal */}
      <Dialog open={openStatus} onClose={() => setOpenStatus(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Update Flight Status ({selectedFlight?.flightNumber})</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              label="New Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="SCHEDULED">SCHEDULED</MenuItem>
              <MenuItem value="LANDED">LANDED</MenuItem>
              <MenuItem value="ON_BLOCK">ON_BLOCK</MenuItem>
              <MenuItem value="SERVICING">SERVICING</MenuItem>
              <MenuItem value="READY">READY</MenuItem>
              <MenuItem value="BOARDING">BOARDING</MenuItem>
              <MenuItem value="AIRBORNE">AIRBORNE</MenuItem>
              <MenuItem value="DEPARTED">DEPARTED</MenuItem>
              <MenuItem value="DELAYED">DELAYED</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatus(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleStatusUpdate}>
            Save Status Transition
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
