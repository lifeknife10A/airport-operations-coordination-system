import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  List,
  Alert,
} from '@mui/material';
import {
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Fuel,
  Wrench,
  Utensils,
  UserCheck,
  Shield,
} from 'lucide-react';
import { flightApi } from '../api/flightApi';
import { taskApi } from '../api/taskApi';
import { Flight, TurnaroundTask, DelayLog } from '../types';
import { StatusChip } from '../components/StatusChip';

const milestoneSteps = [
  'SCHEDULED',
  'LANDED',
  'ON_BLOCK',
  'SERVICING',
  'READY',
  'BOARDING',
  'AIRBORNE',
  'DEPARTED',
];

export const FlightDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [flight, setFlight] = useState<Flight | null>(null);
  const [tasks, setTasks] = useState<TurnaroundTask[]>([]);
  const [delays, setDelays] = useState<DelayLog[]>([]);

  const mockFlight: Flight = {
    flightId: Number(id) || 1,
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
    actualTime: '14:28:10',
    status: 'SERVICING',
    gateCode: 'A1',
    standCode: 'S101',
  };

  const mockTasks: TurnaroundTask[] = [
    {
      taskId: 1,
      flightId: 1,
      flightNumber: 'SPH-402',
      taskType: 'CLEANING',
      taskName: 'Cabin Sweep & Lavatory Sanitization',
      status: 'COMPLETED',
      assignedUserName: 'Ramp Team Alpha',
      departmentName: 'GROUND_HANDLING',
      plannedStart: '14:35',
      plannedEnd: '14:50',
      actualStart: '14:35',
      actualEnd: '14:48',
    },
    {
      taskId: 2,
      flightId: 1,
      flightNumber: 'SPH-402',
      taskType: 'REFUELING',
      taskName: 'Fuel Tank Loading (Target: 8,500 kg)',
      status: 'IN_PROGRESS',
      assignedUserName: 'Fuel Chief Vikram',
      departmentName: 'GROUND_HANDLING',
      plannedStart: '14:40',
      plannedEnd: '15:00',
    },
    {
      taskId: 3,
      flightId: 1,
      flightNumber: 'SPH-402',
      taskType: 'CATERING',
      taskName: 'Galley Cart Replenishment',
      status: 'COMPLETED',
      assignedUserName: 'Catering Lead Sunita',
      departmentName: 'CATERING_SERVICES',
      plannedStart: '14:45',
      plannedEnd: '15:00',
      actualStart: '14:44',
      actualEnd: '14:58',
    },
    {
      taskId: 4,
      flightId: 1,
      flightNumber: 'SPH-402',
      taskType: 'MAINTENANCE',
      taskName: 'Avionics & Tire Check Sign-Off',
      status: 'COMPLETED',
      assignedUserName: 'Eng. Rajesh K',
      departmentName: 'MAINTENANCE',
      plannedStart: '14:35',
      plannedEnd: '14:55',
      actualStart: '14:36',
      actualEnd: '14:52',
    },
    {
      taskId: 5,
      flightId: 1,
      flightNumber: 'SPH-402',
      taskType: 'SECURITY',
      taskName: 'Ramp Security & Cabin Sweep',
      status: 'PENDING',
      assignedUserName: 'Security Officer Roy',
      departmentName: 'SECURITY',
      plannedStart: '15:00',
      plannedEnd: '15:10',
    },
    {
      taskId: 6,
      flightId: 1,
      flightNumber: 'SPH-402',
      taskType: 'BOARDING',
      taskName: 'Passenger Boarding Gate Open',
      status: 'PENDING',
      assignedUserName: 'Gate Agent Priya',
      departmentName: 'PASSENGER_SERVICES',
      plannedStart: '15:05',
      plannedEnd: '15:25',
    },
  ];

  const mockDelays: DelayLog[] = [
    {
      delayId: 1,
      flightId: 1,
      flightNumber: 'SPH-402',
      delayCode: 'DL-93',
      delayCategory: 'AIRCRAFT_ROTATION',
      durationMinutes: 8,
      remarks: 'Late inbound aircraft arrival from Mumbai ATC queue (+8 mins).',
      loggedAt: '14:30:00',
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        if (id) {
          const flt = await flightApi.getFlightById(Number(id));
          if (flt) setFlight(flt);
          else setFlight(mockFlight);

          const tsk = await taskApi.getTasksByFlight(Number(id));
          if (tsk && tsk.length > 0) setTasks(tsk);
          else setTasks(mockTasks);
        } else {
          setFlight(mockFlight);
          setTasks(mockTasks);
        }
      } catch {
        setFlight(mockFlight);
        setTasks(mockTasks);
      }
      setDelays(mockDelays);
    };
    loadData();
  }, [id]);

  const getTaskIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'CLEANING': return <Sparkles size={18} color="#34d399" />;
      case 'REFUELING': return <Fuel size={18} color="#fbbf24" />;
      case 'MAINTENANCE': return <Wrench size={18} color="#60a5fa" />;
      case 'CATERING': return <Utensils size={18} color="#f472b6" />;
      case 'BOARDING': return <UserCheck size={18} color="#a78bfa" />;
      case 'SECURITY': return <Shield size={18} color="#38bdf8" />;
      default: return <CheckCircle2 size={18} color="#94a3b8" />;
    }
  };

  const currentStepIndex = milestoneSteps.indexOf(flight?.status || 'SERVICING');

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Back Button & Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/flights')}
          sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
        >
          Back to FIDS
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff' }}>
          Flight Turnaround Command: {flight?.flightNumber || 'SPH-402'}
        </Typography>
        {flight && <StatusChip status={flight.status} size="medium" />}
      </Box>

      {/* Flight Detail Header Card */}
      <Card sx={{ p: 1 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Airline & Aircraft
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                {flight?.airlineName} ({flight?.airlineCode})
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono, monospace', color: '#60a5fa' }}>
                {flight?.aircraftType} • {flight?.aircraftRegistration}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Flight Route & Type
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                {flight?.originAirportCode} &rarr; {flight?.destinationAirportCode}
              </Typography>
              <Typography variant="body2" sx={{ color: '#2dd4bf', fontWeight: 600 }}>
                {flight?.flightType} Hub Flight
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Scheduled / Actual Time
              </Typography>
              <Typography variant="h6" sx={{ fontFamily: 'JetBrains Mono, monospace', color: '#38bdf8' }}>
                {flight?.scheduledTime}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Estimated: {flight?.estimatedTime || 'On-Time'}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Assigned Position
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                Gate {flight?.gateCode || 'A1'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#fbbf24', fontWeight: 600 }}>
                Stand {flight?.standCode || 'S101'} (Jetbridge)
              </Typography>
            </Grid>
          </Grid>

          {/* Turnaround Milestone Stepper */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 2, fontWeight: 700 }}>
              Turnaround Milestone Progress Sequence
            </Typography>
            <Stepper activeStep={currentStepIndex >= 0 ? currentStepIndex : 3} alternativeLabel>
              {milestoneSteps.map((label, index) => (
                <Step key={label} completed={index < (currentStepIndex >= 0 ? currentStepIndex : 3)}>
                  <StepLabel>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: index === currentStepIndex ? 800 : 500,
                        color: index === currentStepIndex ? '#fbbf24' : index < currentStepIndex ? '#34d399' : '#64748b',
                      }}
                    >
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </CardContent>
      </Card>

      {/* Grid: Turnaround Sub-Tasks & Delay Log Timeline */}
      <Grid container spacing={3}>
        {/* Sub-Task Checklist */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ p: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                  Turnaround Department Sub-Task Breakdown
                </Typography>
                <Button variant="outlined" size="small" onClick={() => navigate('/tasks')}>
                  Manage in Task Tracker &rarr;
                </Button>
              </Box>

              <List disablePadding>
                {tasks.map((t) => (
                  <Paper
                    key={t.taskId}
                    sx={{
                      p: 2,
                      mb: 1.5,
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        {getTaskIcon(t.taskType)}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ffffff' }}>
                          {t.taskName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          Assigned: {t.assignedUserName} • Planned Window: {t.plannedStart} - {t.plannedEnd}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="caption" sx={{ fontFamily: 'JetBrains Mono, monospace', color: '#64748b' }}>
                        {t.actualStart ? `${t.actualStart} - ${t.actualEnd || 'NOW'}` : 'Not Started'}
                      </Typography>
                      <StatusChip status={t.status} />
                    </Box>
                  </Paper>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Delay Log Timeline */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ p: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff', mb: 2 }}>
                Turnaround Delay Audit Log
              </Typography>

              {delays.length === 0 ? (
                <Alert severity="success">Zero logged delays for this turnaround cycle!</Alert>
              ) : (
                delays.map((d) => (
                  <Paper
                    key={d.delayId}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <StatusChip status="DELAYED" />
                      <Typography variant="caption" sx={{ color: '#f87171', fontWeight: 700 }}>
                        +{d.durationMinutes} mins
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 500, mb: 1 }}>
                      {d.remarks}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                      Logged at {d.loggedAt} by Ground Operations
                    </Typography>
                  </Paper>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
