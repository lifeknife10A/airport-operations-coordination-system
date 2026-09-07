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
  Plane,
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Radio,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { SpotlightCard } from '../../components/reactbits';

interface TurnaroundTask {
  id: string;
  flightNo: string;
  gate: string;
  type: 'REFUEL' | 'CLEAN' | 'BAGGAGE' | 'MAINTENANCE' | 'SECURITY';
  crew: string;
  status: 'IN PROGRESS' | 'COMPLETED' | 'PENDING';
  estCompletion: string;
}

const INITIAL_TASKS: TurnaroundTask[] = [
  { id: 'TSK-101', flightNo: 'SPH-102', gate: 'B12', type: 'CLEAN', crew: 'Cabin Hygiene Alpha', status: 'IN PROGRESS', estCompletion: '14:20 UTC' },
  { id: 'TSK-102', flightNo: 'SPH-102', gate: 'B12', type: 'REFUEL', crew: 'Jet Fuel Unit #3', status: 'COMPLETED', estCompletion: '14:05 UTC' },
  { id: 'TSK-103', flightNo: 'SPH-204', gate: 'A04', type: 'BAGGAGE', crew: 'Ramp Cargo Team Delta', status: 'IN PROGRESS', estCompletion: '14:40 UTC' },
  { id: 'TSK-104', flightNo: 'SPH-308', gate: 'C22', type: 'SECURITY', crew: 'Canine & Airside Security', status: 'PENDING', estCompletion: '15:00 UTC' },
  { id: 'TSK-105', flightNo: 'SPH-412', gate: 'B08', type: 'MAINTENANCE', crew: 'Avionics Pre-Flight Crew', status: 'IN PROGRESS', estCompletion: '15:15 UTC' },
];

export const GroundOpsSupervisorDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<TurnaroundTask[]>(INITIAL_TASKS);

  const completeTask = (id: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          toast.success(`Task ${t.id} (${t.type}) marked as COMPLETED.`);
          return { ...t, status: 'COMPLETED' };
        }
        return t;
      })
    );
  };

  return (
    <DashboardLayout activeRole="ground-ops">
      {/* Top Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <SpotlightCard spotlightColor="rgba(251, 191, 36, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#FBBF24', letterSpacing: '0.1em' }}>
              ACTIVE RAMP TEAMS
            </Typography>
            <Users size={18} color="#FBBF24" />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            8 Crews Deployed
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#34D399', mt: 0.5, fontWeight: 600 }}>
            ● 100% Shift Attendance
          </Typography>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(56, 189, 248, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.1em' }}>
              TURNAROUND PROGRESS
            </Typography>
            <Clock size={18} color="#38BDF8" />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            78% On-Schedule
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', mt: 0.5 }}>
            5 Turnarounds In-Flight
          </Typography>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(52, 211, 153, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#34D399', letterSpacing: '0.1em' }}>
              COMPLETED ACTIONS
            </Typography>
            <CheckCircle2 size={18} color="#34D399" />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            42 Tasks
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#34D399', mt: 0.5, fontWeight: 600 }}>
            Current Shift Benchmark Met
          </Typography>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(129, 140, 248, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(129, 140, 248, 0.3)', borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#818CF8', letterSpacing: '0.1em' }}>
              EQUIPMENT READINESS
            </Typography>
            <Briefcase size={18} color="#818CF8" />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            100% Tug & GSE
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', mt: 0.5 }}>
            All Belt Loaders & GPUs Online
          </Typography>
        </SpotlightCard>
      </Box>

      {/* Task Center Table */}
      <Paper id="tasks" elevation={0} sx={{ p: 3.5, mb: 4, background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '18px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
              Ground Turnaround Task Dispatch Center
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8' }}>
              Real-time monitoring and verification of ground turnaround tasks per active aircraft stand.
            </Typography>
          </Box>
        </Box>

        <TableContainer sx={{ borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'rgba(2, 6, 23, 0.8)' }}>
              <TableRow>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.8rem' }}>TASK ID / FLIGHT</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.8rem' }}>GATE</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.8rem' }}>SERVICE TYPE</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.8rem' }}>ASSIGNED CREW</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.8rem' }}>EST. COMPLETE</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.8rem' }}>STATUS</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.8rem' }}>ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.03)' } }}>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                    <Box>
                      <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.9rem' }}>{task.flightNo}</Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontFamily: "'Inter', monospace" }}>{task.id}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#38BDF8', fontWeight: 700 }}>{task.gate}</TableCell>
                  <TableCell>
                    <Chip label={task.type} size="small" sx={{ backgroundColor: 'rgba(251, 191, 36, 0.15)', color: '#FBBF24', fontWeight: 800, fontSize: '0.7rem' }} />
                  </TableCell>
                  <TableCell sx={{ color: '#CBD5E1', fontSize: '0.85rem' }}>{task.crew}</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontFamily: "'Inter', monospace", fontSize: '0.85rem' }}>{task.estCompletion}</TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      size="small"
                      sx={{
                        backgroundColor: task.status === 'COMPLETED' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                        color: task.status === 'COMPLETED' ? '#34D399' : '#38BDF8',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {task.status !== 'COMPLETED' && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => completeTask(task.id)}
                        sx={{
                          fontSize: '0.72rem',
                          background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                          fontWeight: 700,
                          borderRadius: '6px',
                        }}
                      >
                        Complete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </DashboardLayout>
  );
};

export default GroundOpsSupervisorDashboard;
