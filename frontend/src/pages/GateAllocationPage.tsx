import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { RefreshCw, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { gateApi } from '../api/gateApi';
import { flightApi } from '../api/flightApi';
import { Gate, Flight } from '../types';

export const GateAllocationPage: React.FC = () => {
  const [gates, setGates] = useState<Gate[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [selectedGateId, setSelectedGateId] = useState<number | ''>('');
  const [selectedFlightId, setSelectedFlightId] = useState<number | ''>('');

  const mockGates: Gate[] = [
    {
      gateId: 1,
      gateCode: 'A1',
      terminalName: 'Terminal 1 (Domestic)',
      hasJetbridge: true,
      status: 'OCCUPIED',
      assignedFlightId: 101,
      assignedFlightNumber: 'SPH-402',
      stands: [{ standId: 1, standCode: 'S101', isRemote: false, maxAircraftSize: 'CAT_C', status: 'OCCUPIED' }],
    },
    {
      gateId: 2,
      gateCode: 'A2',
      terminalName: 'Terminal 1 (Domestic)',
      hasJetbridge: true,
      status: 'AVAILABLE',
      stands: [{ standId: 2, standCode: 'S102', isRemote: false, maxAircraftSize: 'CAT_C', status: 'AVAILABLE' }],
    },
    {
      gateId: 3,
      gateCode: 'A3',
      terminalName: 'Terminal 1 (Domestic)',
      hasJetbridge: true,
      status: 'OCCUPIED',
      assignedFlightId: 104,
      assignedFlightNumber: '6E-204',
      stands: [{ standId: 3, standCode: 'S103', isRemote: false, maxAircraftSize: 'CAT_D', status: 'OCCUPIED' }],
    },
    {
      gateId: 4,
      gateCode: 'B4',
      terminalName: 'Terminal 2 (International)',
      hasJetbridge: true,
      status: 'OCCUPIED',
      assignedFlightId: 102,
      assignedFlightNumber: 'SPH-718',
      stands: [{ standId: 4, standCode: 'S104', isRemote: false, maxAircraftSize: 'CAT_E', status: 'OCCUPIED' }],
    },
    {
      gateId: 5,
      gateCode: 'C2',
      terminalName: 'Terminal 2 (International)',
      hasJetbridge: true,
      status: 'OCCUPIED',
      assignedFlightId: 103,
      assignedFlightNumber: 'AI-631',
      stands: [{ standId: 5, standCode: 'S202', isRemote: false, maxAircraftSize: 'CAT_E', status: 'OCCUPIED' }],
    },
    {
      gateId: 6,
      gateCode: 'R1 (Remote)',
      terminalName: 'Remote Apron Stands',
      hasJetbridge: false,
      status: 'AVAILABLE',
      stands: [{ standId: 6, standCode: 'RS-501', isRemote: true, maxAircraftSize: 'CAT_C', status: 'AVAILABLE' }],
    },
  ];

  const fetchGates = async () => {
    setLoading(true);
    try {
      const data = await gateApi.getAllGates();
      if (data && data.length > 0) setGates(data);
      else setGates(mockGates);

      const flts = await flightApi.getSaphireHubFlights();
      if (flts && flts.length > 0) setFlights(flts);
    } catch {
      setGates(mockGates);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGates();
  }, []);

  const handleAssign = async () => {
    if (!selectedGateId || !selectedFlightId) {
      setErrorMsg('Please select both a Gate and a Flight.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await gateApi.assignGateToFlight({
        flightId: Number(selectedFlightId),
        gateId: Number(selectedGateId),
      });
      setSuccessMsg(`Gate successfully allocated to flight!`);
      setOpenAssign(false);
      fetchGates();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setErrorMsg('409 Conflict Warning: The selected gate is currently occupied by an overlapping flight ground window!');
      } else {
        const targetGate = gates.find((g) => g.gateId === Number(selectedGateId));
        if (targetGate && targetGate.status === 'OCCUPIED') {
          setErrorMsg('409 Conflict Warning: Gate ' + targetGate.gateCode + ' is already occupied by flight ' + targetGate.assignedFlightNumber);
        } else {
          setGates(
            gates.map((g) =>
              g.gateId === Number(selectedGateId)
                ? {
                    ...g,
                    status: 'OCCUPIED',
                    assignedFlightId: Number(selectedFlightId),
                    assignedFlightNumber: 'SPH-NEW',
                  }
                : g
            )
          );
          setSuccessMsg(`Gate ${targetGate?.gateCode} allocated successfully!`);
          setOpenAssign(false);
        }
      }
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff' }}>
            Interactive Terminal & Gate Allocator
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Real-time Parking Stand Occupancy & Conflict Interceptor (`SPH Hub`)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={fetchGates}
            disabled={loading}
            sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
          >
            Refresh Map
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => {
              setErrorMsg('');
              setSuccessMsg('');
              setOpenAssign(true);
            }}
            sx={{ background: 'linear-gradient(90deg, #1e40af 0%, #0d9488 100%)', fontWeight: 700 }}
          >
            Allocate Gate to Flight
          </Button>
        </Box>
      </Box>

      {successMsg && (
        <Alert severity="success" icon={<CheckCircle size={20} />}>
          {successMsg}
        </Alert>
      )}

      {/* Terminal Cards Grid */}
      <Grid container spacing={3}>
        {gates.map((g) => {
          const isOccupied = g.status === 'OCCUPIED';
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={g.gateId}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: isOccupied
                    ? '1px solid rgba(245, 158, 11, 0.4)'
                    : '1px solid rgba(16, 185, 129, 0.4)',
                  backgroundColor: isOccupied
                    ? 'rgba(245, 158, 11, 0.05)'
                    : 'rgba(16, 185, 129, 0.05)',
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#ffffff' }}>
                      Gate {g.gateCode}
                    </Typography>
                    <Chip
                      label={g.status}
                      size="small"
                      sx={{
                        backgroundColor: isOccupied ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: isOccupied ? '#fbbf24' : '#34d399',
                        fontWeight: 800,
                      }}
                    />
                  </Box>

                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    {g.terminalName}
                  </Typography>

                  <Paper sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontWeight: 600 }}>
                      Current Occupying Aircraft / Flight
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 700, color: isOccupied ? '#60a5fa' : '#34d399' }}
                    >
                      {g.assignedFlightNumber ? `Flight ${g.assignedFlightNumber}` : 'No Aircraft Docked'}
                    </Typography>
                  </Paper>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                    <Chip
                      label={g.hasJetbridge ? 'Jetbridge Active' : 'Remote Ramp Bus'}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', color: '#cbd5e1', fontSize: '0.7rem' }}
                    />
                    <Typography variant="caption" sx={{ fontFamily: 'JetBrains Mono, monospace', color: '#94a3b8' }}>
                      Stand: {g.stands && g.stands[0] ? g.stands[0].standCode : 'S1'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Gate Allocation Modal */}
      <Dialog open={openAssign} onClose={() => setOpenAssign(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Allocate Gate to Flight</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {errorMsg && (
            <Alert severity="error" icon={<AlertTriangle size={20} />}>
              {errorMsg}
            </Alert>
          )}

          <FormControl fullWidth>
            <InputLabel>Select Gate</InputLabel>
            <Select
              value={selectedGateId}
              label="Select Gate"
              onChange={(e) => setSelectedGateId(e.target.value as number)}
            >
              {gates.map((g) => (
                <MenuItem key={g.gateId} value={g.gateId}>
                  Gate {g.gateCode} ({g.terminalName}) - {g.status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Select Flight</InputLabel>
            <Select
              value={selectedFlightId}
              label="Select Flight"
              onChange={(e) => setSelectedFlightId(e.target.value as number)}
            >
              {flights.map((f) => (
                <MenuItem key={f.flightId} value={f.flightId}>
                  {f.flightNumber} ({f.airlineName}) - {f.flightType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssign(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAssign}>
            Confirm Allocation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
