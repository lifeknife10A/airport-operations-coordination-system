import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import {
  Radio,
  Layers,
  Plane,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Send,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { SpotlightCard } from '../../components/reactbits';

interface GateSlot {
  gate: string;
  terminal: string;
  flight: string | null;
  status: 'OCCUPIED' | 'AVAILABLE' | 'BOARDING' | 'MAINTENANCE';
  progress: number;
}

const GATES_DATA: GateSlot[] = [
  { gate: 'A01', terminal: 'T1', flight: 'SPH-102', status: 'BOARDING', progress: 85 },
  { gate: 'A02', terminal: 'T1', flight: null, status: 'AVAILABLE', progress: 0 },
  { gate: 'A04', terminal: 'T1', flight: 'SPH-204', status: 'OCCUPIED', progress: 40 },
  { gate: 'A15', terminal: 'T1', flight: 'SPH-518', status: 'OCCUPIED', progress: 20 },
  { gate: 'B08', terminal: 'T2', flight: 'SPH-412', status: 'OCCUPIED', progress: 60 },
  { gate: 'B12', terminal: 'T2', flight: null, status: 'AVAILABLE', progress: 0 },
  { gate: 'C20', terminal: 'T2', flight: 'SPH-308', status: 'BOARDING', progress: 90 },
  { gate: 'C22', terminal: 'T2', flight: null, status: 'MAINTENANCE', progress: 0 },
];

export const AOCCControllerDashboard: React.FC = () => {
  const [gates, setGates] = useState<GateSlot[]>(GATES_DATA);
  const [selectedTerminal, setSelectedTerminal] = useState<'ALL' | 'T1' | 'T2'>('ALL');

  const filteredGates = gates.filter((g) => selectedTerminal === 'ALL' || g.terminal === selectedTerminal);

  const handleBroadcastAlert = () => {
    toast.success('Dispatched operational telemetry update to all airside departments.');
  };

  return (
    <DashboardLayout activeRole="aocc">
      {/* Top Telemetry KPIs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <SpotlightCard spotlightColor="rgba(129, 140, 248, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(129, 140, 248, 0.3)', borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#818CF8', letterSpacing: '0.1em' }}>
              ACTIVE AIRBORNE ARRIVALS
            </Typography>
            <Plane size={18} color="#818CF8" />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            14 Inbound
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#34D399', mt: 0.5, fontWeight: 600 }}>
            ● Radar Holding Patterns Clear
          </Typography>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(56, 189, 248, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.1em' }}>
              GATE UTILIZATION
            </Typography>
            <Layers size={18} color="#38BDF8" />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            68.5%
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', mt: 0.5 }}>
            Terminal 1: 75% | Terminal 2: 62%
          </Typography>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(52, 211, 153, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#34D399', letterSpacing: '0.1em' }}>
              AVG TURNAROUND TIME
            </Typography>
            <Clock size={18} color="#34D399" />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            38 mins
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#34D399', mt: 0.5, fontWeight: 600 }}>
            -4 mins faster than baseline
          </Typography>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(239, 68, 68, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#F87171', letterSpacing: '0.1em' }}>
              LOGGED DELAYS
            </Typography>
            <AlertTriangle size={18} color="#F87171" />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            1 Minor (+15m)
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', mt: 0.5 }}>
            Flight SPH-518 (Weather En-Route)
          </Typography>
        </SpotlightCard>
      </Box>

      {/* Terminal Gate Occupancy Matrix */}
      <Paper id="gates" elevation={0} sx={{ p: 3.5, mb: 4, background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '18px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
              Interactive Gate Occupancy Matrix
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8' }}>
              Real-time monitoring of airbridge stands, boarding readiness, and ground turnaround status.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {(['ALL', 'T1', 'T2'] as const).map((t) => (
              <Button
                key={t}
                onClick={() => setSelectedTerminal(t)}
                variant={selectedTerminal === t ? 'contained' : 'outlined'}
                size="small"
                sx={{
                  backgroundColor: selectedTerminal === t ? '#818CF8' : 'transparent',
                  borderColor: selectedTerminal === t ? '#818CF8' : 'rgba(255,255,255,0.15)',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                }}
              >
                {t === 'ALL' ? 'All Terminals' : `Terminal ${t}`}
              </Button>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2.5 }}>
          {filteredGates.map((gate) => (
            <Box
              key={gate.gate}
              sx={{
                p: 2.5,
                borderRadius: '14px',
                background: 'rgba(2, 6, 23, 0.7)',
                border: '1px solid',
                borderColor:
                  gate.status === 'BOARDING'
                    ? 'rgba(52, 211, 153, 0.4)'
                    : gate.status === 'OCCUPIED'
                    ? 'rgba(56, 189, 248, 0.4)'
                    : gate.status === 'MAINTENANCE'
                    ? 'rgba(239, 68, 68, 0.4)'
                    : 'rgba(255, 255, 255, 0.08)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#FFFFFF' }}>
                  GATE {gate.gate}
                </Typography>
                <Chip label={gate.terminal} size="small" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#CBD5E1', fontWeight: 700, fontSize: '0.68rem' }} />
              </Box>

              <Typography sx={{ fontSize: '0.82rem', color: gate.flight ? '#38BDF8' : '#64748B', fontWeight: 700, mb: 1.5, fontFamily: "'Inter', monospace" }}>
                {gate.flight ? `✈ ${gate.flight}` : 'NO AIRCRAFT'}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Chip
                  label={gate.status}
                  size="small"
                  sx={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    backgroundColor:
                      gate.status === 'BOARDING'
                        ? 'rgba(52, 211, 153, 0.2)'
                        : gate.status === 'OCCUPIED'
                        ? 'rgba(56, 189, 248, 0.2)'
                        : gate.status === 'MAINTENANCE'
                        ? 'rgba(239, 68, 68, 0.2)'
                        : 'rgba(148, 163, 184, 0.1)',
                    color:
                      gate.status === 'BOARDING'
                        ? '#34D399'
                        : gate.status === 'OCCUPIED'
                        ? '#38BDF8'
                        : gate.status === 'MAINTENANCE'
                        ? '#EF4444'
                        : '#94A3B8',
                  }}
                />
                <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>{gate.progress}% Turnaround</Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={gate.progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: gate.status === 'BOARDING' ? '#34D399' : '#38BDF8',
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Turnaround Gantt & Dispatch Actions */}
      <Paper id="timeline" elevation={0} sx={{ p: 3.5, background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '18px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
              Turnaround Operations Command & Broadcast
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8' }}>
              Simultaneously coordinate catering, refueling, cabin disinfection, and baggage onload.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Send size={16} />}
            onClick={handleBroadcastAlert}
            sx={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)',
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif",
              borderRadius: '10px',
            }}
          >
            Dispatch AOCC Alert
          </Button>
        </Box>
      </Paper>
    </DashboardLayout>
  );
};

export default AOCCControllerDashboard;
