import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Tooltip,
  IconButton,
  Avatar,
  Divider,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Plane,
  Radio,
  Sliders,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Send,
  Layers,
  Search,
  ArrowRight,
  RefreshCw,
  Plus,
  ShieldCheck,
  Fuel,
  Wrench,
  UserCheck,
  Bell,
  Eye,
  ArrowUpRight,
  Check,
  Filter,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  X,
  Users,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { aocsDataStore } from '../../services/aocsDataStore';
import { exportFlightMovementCSV, exportGateUtilizationPDF } from '../../utils/exportReports';
import { flightApi } from '../../api/flightApi';
import { gateApi } from '../../api/gateApi';
import { taskApi } from '../../api/taskApi';
import { airsideApi } from '../../api/airsideApi';
import { flightOpsApi, DelayEntry, DelayCode } from '../../api/flightOpsApi';
import { describeApiError } from '../../services/aocsDataStore';
import type { Gate, TurnaroundTask } from '../../types';
import { Flight as BackendFlight } from '../../types';
import { ChevronLeft } from 'lucide-react';

// Types
export interface OperationalFlight {
  id: string;
  flightId: number;
  flightNumber: string;
  airline: string;
  aircraft: string;
  route: string;
  origin: string;
  destination: string;
  gate: string;
  scheduledTime: string;
  estimatedTime: string;
  status: 'SCHEDULED' | 'BOARDING' | 'AIRBORNE' | 'ON_BLOCK' | 'DELAYED' | 'READY';
  turnaroundProgress: number; // 0 - 100, completed tasks / total tasks
  turnaroundStage: string;
  /** Boarding passes issued; only known once the flight's operations have been loaded. */
  boardingPasses?: number;
}

// Maps a backend Flight into the shape this dashboard renders. Turnaround progress is the share
// of the flight's turnaround tasks that are completed (the backend counts them per page).
const mapFlightDtoToOperational = (sf: BackendFlight): OperationalFlight => {
  const total = sf.tasksTotal ?? 0;
  const done = sf.tasksCompleted ?? 0;
  return {
    id: `FL-${sf.flightId}`,
    flightId: sf.flightId,
    flightNumber: sf.flightNumber,
    airline: sf.airlineName,
    aircraft: sf.aircraftType,
    route: `${sf.originAirportCode} → ${sf.destinationAirportCode}`,
    origin: sf.originAirportName,
    destination: sf.destinationAirportName,
    gate: sf.gateCode || 'Unassigned',
    scheduledTime: sf.scheduledTime,
    estimatedTime: sf.estimatedTime || sf.scheduledTime,
    status: (sf.status as OperationalFlight['status']) || 'SCHEDULED',
    turnaroundProgress: total ? Math.round((done / total) * 100) : 0,
    turnaroundStage: total ? `${done} of ${total} tasks done` : 'No turnaround tasks',
  };
};

const EMPTY_FLIGHT: OperationalFlight = {
  id: 'none', flightId: 0, flightNumber: '—', airline: '', aircraft: '', route: '', origin: '', destination: '', gate: '—',
  scheduledTime: '', estimatedTime: '', status: 'SCHEDULED', turnaroundProgress: 0, turnaroundStage: '',
};

export interface TurnaroundStep {
  id: string;
  title: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'BLOCKED';
  timestamp: string;
  notes: string;
  department: string;
}

export interface GateSlot {
  gateId: number;
  gate: string;
  concourse: string;
  flight: string | null;
  aircraftType?: string;
  status: 'OCCUPIED' | 'AVAILABLE' | 'BOARDING' | 'DELAYED' | 'MAINTENANCE';
}

export interface DelayLogItem {
  id: string;
  flightNumber: string;
  route: string;
  delayMinutes: number;
  reasonCategory: string;
  description: string;
  loggedAt: string;
  loggedBy: string;
  status: 'ACTIVE' | 'RESOLVED' | 'MITIGATED';
}

// ---------------------------------------------------------------------------------------------
// Live data mapping
// ---------------------------------------------------------------------------------------------
const clockOf = (iso?: string | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${d.toISOString().slice(11, 16)} UTC`;
};

const toTurnaroundStep = (t: TurnaroundTask): TurnaroundStep => ({
  id: `t${t.taskId}`,
  title: t.taskName,
  status: t.status as TurnaroundStep['status'],
  timestamp: t.actualEnd ? `Done ${t.actualEnd}` : t.actualStart ? `Running since ${t.actualStart}` : t.plannedEnd ? `Target: ${t.plannedEnd}` : '',
  notes: t.notes ?? '',
  department: t.assignedUserName ?? 'Unassigned',
});

const toGateSlot = (g: Gate, flights: OperationalFlight[]): GateSlot => {
  const occupant = g.assignedFlightNumber ? flights.find((f) => f.flightNumber === g.assignedFlightNumber) : undefined;
  return {
    gateId: g.gateId,
    gate: g.gateCode,
    concourse: g.concourse ?? '',
    flight: g.assignedFlightNumber ?? null,
    aircraftType: occupant?.aircraft,
    status: g.status === 'MAINTENANCE' ? 'MAINTENANCE' : g.status === 'OCCUPIED' ? (occupant?.status === 'DELAYED' ? 'DELAYED' : occupant?.status === 'BOARDING' ? 'BOARDING' : 'OCCUPIED') : 'AVAILABLE',
  };
};

const toDelayLogItem = (d: DelayEntry): DelayLogItem => ({
  id: `DLY-${d.flightId}-${d.seqNo}`,
  flightNumber: d.flightNumber,
  route: d.route,
  delayMinutes: d.delayMinutes,
  reasonCategory: d.category,
  description: d.description,
  loggedAt: '',
  loggedBy: d.delayCode,
  status: 'ACTIVE',
});

export const AOCCControllerDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Active hash-based sub-view
  const [activeTab, setActiveTab] = useState<'overview' | 'flights' | 'details' | 'gates' | 'turnaround' | 'delays' | 'notifications' | 'profile'>('overview');

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (['flights', 'details', 'gates', 'turnaround', 'delays', 'notifications', 'profile'].includes(hash)) {
      setActiveTab(hash as any);
    } else {
      setActiveTab('overview');
    }
  }, [location.hash]);

  const handleTabSelect = (tab: string) => {
    if (tab === 'overview') {
      navigate('/dashboard/aocc');
    } else {
      navigate(`/dashboard/aocc#${tab}`);
    }
  };

  // State -- everything is loaded from the backend.
  const [flights, setFlights] = useState<OperationalFlight[]>([]);
  const [gates, setGates] = useState<GateSlot[]>([]);
  const [delayLogs, setDelayLogs] = useState<DelayLogItem[]>([]);
  const [delayTotal, setDelayTotal] = useState(0);
  const [blockedTasks, setBlockedTasks] = useState<TurnaroundTask[]>([]);
  const [blockedTotal, setBlockedTotal] = useState(0);
  const [delayCodes, setDelayCodes] = useState<DelayCode[]>([]);
  const [flightSummary, setFlightSummary] = useState<Record<string, number>>({});
  const [selectedFlight, setSelectedFlight] = useState<OperationalFlight>(EMPTY_FLIGHT);
  const [selectedConcourse, setSelectedConcourse] = useState<'ALL' | 'Concourse A' | 'Concourse B' | 'Concourse C'>('ALL');
  const [flightSearch, setFlightSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [gateTabLimit, setGateTabLimit] = useState(48);

  // Flight Operations Board pagination: 10 rows per page, searched and paged on the server.
  const [tablePage, setTablePage] = useState(0);
  const [tablePageFlights, setTablePageFlights] = useState<OperationalFlight[]>([]);
  const [tableTotalPages, setTableTotalPages] = useState(1);
  const [tableTotalElements, setTableTotalElements] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);

  // Turnaround tasks of the selected flight (real tasks) and its boarding pass count
  const [turnaroundTasks, setTurnaroundTasks] = useState<TurnaroundStep[]>([]);
  const [rawSelectedTasks, setRawSelectedTasks] = useState<TurnaroundTask[]>([]);

  // Dialog States
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [modalFlight, setModalFlight] = useState<OperationalFlight | null>(null);

  const [logDelayOpen, setLogDelayOpen] = useState(false);
  const [delayFlightId, setDelayFlightId] = useState<number | ''>('');
  const [delayMinutesInput, setDelayMinutesInput] = useState('15');
  const [delayCodeInput, setDelayCodeInput] = useState('');

  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [reassignGateTarget, setReassignGateTarget] = useState<GateSlot | null>(null);
  const [reassignFlightChoice, setReassignFlightChoice] = useState<number | ''>('');

  const concourseByGate = useMemo(() => new Map(gates.map((g) => [g.gate, g.concourse])), [gates]);

  // Live and upcoming flights, gates, status counts and the delay log
  const loadBoard = useCallback(async () => {
    try {
      const [operational, gateData, summary, delays, blocked] = await Promise.all([
        flightApi.getOperationalFlights(60),
        gateApi.getAllGates(),
        airsideApi.getFlightStatusSummary(),
        flightOpsApi.getDelays(0, 50),
        taskApi.getPage({ status: 'BLOCKED', size: 3 }),
      ]);
      const mapped = operational.map(mapFlightDtoToOperational);
      setFlights(mapped);
      setGates(gateData.map((g) => toGateSlot(g, mapped)));
      setFlightSummary(summary);
      setDelayLogs(delays.content.map(toDelayLogItem));
      setDelayTotal(delays.totalElements);
      setBlockedTasks(blocked.content);
      setBlockedTotal(blocked.totalElements);
      setSelectedFlight((cur) => (cur.flightId === 0 && mapped.length ? mapped[0] : cur));
    } catch (e) {
      toast.error(`Could not load the operations board: ${describeApiError(e)}`);
    }
  }, []);
  useEffect(() => {
    loadBoard();
    flightOpsApi.getDelayCodes().then((codes) => {
      setDelayCodes(codes);
      setDelayCodeInput((cur) => cur || codes[0]?.delayCode || '');
    }).catch(() => setDelayCodes([]));
  }, [loadBoard]);

  // Selected flight: load its real turnaround tasks and boarding pass count
  const loadSelectedOperations = useCallback(async (flightId: number) => {
    if (!flightId) {
      setTurnaroundTasks([]);
      setRawSelectedTasks([]);
      return;
    }
    try {
      const ops = await flightOpsApi.getOperations(flightId);
      setRawSelectedTasks(ops.tasks);
      setTurnaroundTasks(ops.tasks.map(toTurnaroundStep));
      const done = ops.tasks.filter((t) => t.status === 'COMPLETED').length;
      setSelectedFlight((cur) =>
        cur.flightId === flightId
          ? {
              ...cur,
              boardingPasses: ops.boardingPasses,
              turnaroundProgress: ops.tasks.length ? Math.round((done / ops.tasks.length) * 100) : 0,
              turnaroundStage: ops.tasks.length ? `${done} of ${ops.tasks.length} tasks done` : 'No turnaround tasks',
            }
          : cur
      );
    } catch (e) {
      toast.error(`Could not load turnaround tasks: ${describeApiError(e)}`);
    }
  }, []);
  useEffect(() => {
    loadSelectedOperations(selectedFlight.flightId);
  }, [selectedFlight.flightId, loadSelectedOperations]);

  // Handlers
  const handleSelectFlightForTurnaround = (f: OperationalFlight) => setSelectedFlight(f);

  const handleOpenFlightDetails = (f: OperationalFlight) => {
    setModalFlight(f);
    setDetailsModalOpen(true);
    flightOpsApi
      .getOperations(f.flightId)
      .then((ops) => setModalFlight((cur) => (cur && cur.flightId === f.flightId ? { ...cur, boardingPasses: ops.boardingPasses } : cur)))
      .catch(() => undefined);
  };

  // Flight Operations Board: one server page, searched on the server (debounced).
  const loadTablePage = useCallback(() => {
    let cancelled = false;
    setTableLoading(true);
    flightApi
      .getSaphireHubFlightsPaged(tablePage, 10, flightSearch.trim())
      .then((res) => {
        if (cancelled) return;
        setTablePageFlights(res.content.map(mapFlightDtoToOperational));
        setTableTotalPages(Math.max(1, res.totalPages));
        setTableTotalElements(res.totalElements);
      })
      .catch(() => {
        if (!cancelled) toast.error('Could not load this page of flights from the server.');
      })
      .finally(() => {
        if (!cancelled) setTableLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tablePage, flightSearch]);
  useEffect(() => {
    const handle = setTimeout(() => loadTablePage(), 250);
    return () => clearTimeout(handle);
  }, [loadTablePage]);

  // Advance the selected flight's turnaround: finish the running task, or start the next pending one.
  const handleAdvanceTask = async () => {
    const running = rawSelectedTasks.find((t) => t.status === 'IN_PROGRESS');
    const next = running ?? rawSelectedTasks.find((t) => t.status === 'PENDING' || t.status === 'BLOCKED');
    if (!next) {
      toast('All turnaround tasks for this flight are already complete.', { icon: '✓' });
      return;
    }
    const target = running ? 'COMPLETED' : 'IN_PROGRESS';
    try {
      // A blocked task has to be resumed (BLOCKED -> IN_PROGRESS) before it can be completed.
      await taskApi.updateTaskStatus(next.taskId, target);
      toast.success(`${next.taskName} ${target === 'COMPLETED' ? 'completed' : 'started'} for ${selectedFlight.flightNumber}`);
      loadSelectedOperations(selectedFlight.flightId);
      loadBoard();
      loadTablePage();
    } catch (e) {
      toast.error(`${next.taskName} was NOT changed: ${describeApiError(e)}`);
    }
  };

  const handleSaveDelay = async () => {
    const minutes = parseInt(delayMinutesInput, 10);
    if (delayFlightId === '' || !delayCodeInput || !Number.isFinite(minutes) || minutes < 1) {
      toast.error('Choose a flight, a delay code and a duration of at least 1 minute.');
      return;
    }
    try {
      const entry = await flightOpsApi.logDelay(delayFlightId, delayCodeInput, minutes);
      aocsDataStore.logAuditEvent(
        'FLIGHT_DELAY_LOGGED',
        `Delay logged for ${entry.flightNumber} (+${entry.delayMinutes}m [${entry.delayCode} ${entry.category}])`,
        'AOCC Controller'
      );
      toast.success(`Delay of +${entry.delayMinutes}m (${entry.category.replace(/_/g, ' ')}) logged for ${entry.flightNumber}`);
      setLogDelayOpen(false);
      loadBoard();
      loadTablePage();
    } catch (e) {
      toast.error(`Delay was NOT logged: ${describeApiError(e)}`);
    }
  };

  const handleReassignGateSubmit = async () => {
    if (!reassignGateTarget) return;
    if (reassignFlightChoice === '') {
      toast.error('Choose the flight to put on this gate.');
      return;
    }
    try {
      await gateApi.assignGateToFlight({ flightId: reassignFlightChoice, gateId: reassignGateTarget.gateId });
      const flightNumber = flights.find((f) => f.flightId === reassignFlightChoice)?.flightNumber ?? '';
      aocsDataStore.logAuditEvent('GATE_ASSIGNMENT', `Gate ${reassignGateTarget.gate} assigned to Flight ${flightNumber}`, 'AOCC Controller');
      toast.success(`Gate ${reassignGateTarget.gate} assigned to ${flightNumber}`);
      setReassignModalOpen(false);
      loadBoard();
      loadTablePage();
    } catch (e) {
      toast.error(`Gate ${reassignGateTarget.gate} was NOT assigned: ${describeApiError(e)}`);
    }
  };

  const attentionItems = [
    ...blockedTasks.map((t) => ({
      id: `task-${t.taskId}`,
      blocked: true,
      title: `${t.flightNumber} · ${t.taskName}`,
      chip: 'BLOCKED',
      body: t.assignedUserName ? `Blocked task, assigned to ${t.assignedUserName}.` : 'Blocked task with nobody assigned.',
      flightId: t.flightId,
      flightNumber: t.flightNumber,
    })),
    ...flights
      .filter((f) => f.status === 'DELAYED')
      .slice(0, 3)
      .map((f) => ({
        id: `flt-${f.flightId}`,
        blocked: false,
        title: `${f.flightNumber} · ${f.route}`,
        chip: 'DELAYED',
        body: `Gate ${f.gate}. ${f.turnaroundStage}.`,
        flightId: f.flightId,
        flightNumber: f.flightNumber,
      })),
  ].slice(0, 4);

  const openTurnaroundFor = (flightId: number, flightNumber: string) => {
    const known = flights.find((f) => f.flightId === flightId);
    setSelectedFlight(known ?? { ...EMPTY_FLIGHT, id: `FL-${flightId}`, flightId, flightNumber });
    navigate('/dashboard/aocc#turnaround');
  };

  // Filtered flights -- filters the current server-fetched page only (10 rows), not the whole
  // aocs_db table. A flight on a different page won't show up here until you page to it.
  const filteredFlights = tablePageFlights.filter((f) => {
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    const matchesConcourse = selectedConcourse === 'ALL' || concourseByGate.get(f.gate) === selectedConcourse;
    return matchesStatus && matchesConcourse;
  });

  return (
    <DashboardLayout activeRole="aocc">
      {/* ========================================================================= */}
      {/* 1. OVERVIEW VIEW (CONTROLLER OPERATIONAL COMMAND)                         */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <Box>
          {/* COMMAND HEADER: Title + Context + Concourse Filter + Quick Actions */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { md: 'center' },
              gap: 2,
              mb: 3.5,
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', color: '#0284C7' }}>
                  AOCC OPERATIONS HUB
                </Typography>
                <Chip
                  label="LIVE AIRSIDE RADAR ●"
                  size="small"
                  sx={{
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: '0.66rem',
                    height: '20px',
                  }}
                />
              </Box>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', letterSpacing: '-0.02em' }}>
                Flight Operations Command
              </Typography>
              <Typography sx={{ fontSize: '0.86rem', color: '#64748B', mt: 0.2 }}>
                Controller: {user?.name || 'AOCC Controller'} · Saphire Air Operations Control Center (SPH)
              </Typography>
            </Box>

            {/* Controls: Concourse Selector Pills + Primary Action */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ display: 'flex', backgroundColor: '#FFFFFF', p: 0.5, borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                {(['ALL', 'Concourse A', 'Concourse B', 'Concourse C'] as const).map((concourse) => (
                  <Button
                    key={concourse}
                    size="small"
                    onClick={() => setSelectedConcourse(concourse)}
                    sx={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      px: 1.5,
                      py: 0.4,
                      minWidth: 'auto',
                      borderRadius: '7px',
                      textTransform: 'none',
                      backgroundColor: selectedConcourse === concourse ? '#0F2942' : 'transparent',
                      color: selectedConcourse === concourse ? '#FFFFFF' : '#64748B',
                      '&:hover': {
                        backgroundColor: selectedConcourse === concourse ? '#1E3A5F' : '#F1F5F9',
                      },
                    }}
                  >
                    {concourse === 'ALL' ? 'All Concourses' : concourse}
                  </Button>
                ))}
              </Box>

              <Button
                variant="outlined"
                startIcon={<FileText size={15} />}
                onClick={exportFlightMovementCSV}
                sx={{
                  borderColor: '#CBD5E1',
                  color: '#0F2942',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textTransform: 'none',
                  borderRadius: '10px',
                  px: 1.8,
                  py: 0.85,
                  '&:hover': { borderColor: '#0284C7', bgcolor: '#F0F9FF' },
                }}
              >
                Export Flights CSV
              </Button>

              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                onClick={() => setLogDelayOpen(true)}
                sx={{
                  backgroundColor: '#0F2942',
                  color: '#FFFFFF',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  textTransform: 'none',
                  borderRadius: '10px',
                  px: 2.2,
                  py: 0.9,
                  boxShadow: '0 2px 8px rgba(15, 41, 66, 0.15)',
                  '&:hover': { backgroundColor: '#1E3A5F' },
                }}
              >
                Log Delay
              </Button>
            </Box>
          </Box>

          {/* ========================================================================= */}
          {/* COMPONENT 1: OPERATIONAL KPI STRIP (ONLY NUMBERS THAT MATTER RIGHT NOW)    */}
          {/* ========================================================================= */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 2.5,
              mb: 3.5,
            }}
          >
            {/* Card 1: Active Flights */}
            <Card
              elevation={0}
              onClick={() => setStatusFilter('ALL')}
              sx={{
                p: 2.5,
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: statusFilter === 'ALL' ? '2px solid #0284C7' : '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  borderColor: '#0284C7',
                  boxShadow: '0 8px 24px rgba(2, 132, 199, 0.12)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    backgroundColor: '#E0F2FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plane size={22} color="#0284C7" />
                </Box>
                <Chip
                  icon={<ArrowUpRight size={13} color="#15803D" />}
                  label="Show All"
                  size="small"
                  sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '0.68rem', height: '22px' }}
                />
              </Box>
              <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', lineHeight: 1.1 }}>
                {Object.values(flightSummary).reduce((a, b) => a + b, 0).toLocaleString()}
              </Typography>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.84rem', fontWeight: 700, color: '#475569', mt: 0.5 }}>
                Active Flights
              </Typography>
              <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
                {flightSummary.AIRBORNE ?? 0} Airborne · {flightSummary.BOARDING ?? 0} Boarding · {flightSummary.ON_BLOCK ?? 0} On Block
              </Typography>
            </Card>

            {/* Card 2: Boarding */}
            <Card
              elevation={0}
              onClick={() => setStatusFilter(statusFilter === 'BOARDING' ? 'ALL' : 'BOARDING')}
              sx={{
                p: 2.5,
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: statusFilter === 'BOARDING' ? '2px solid #10B981' : '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  borderColor: '#10B981',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.12)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    backgroundColor: '#DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Users size={22} color="#10B981" />
                </Box>
                <Chip
                  label={statusFilter === 'BOARDING' ? 'Filtering Active' : 'Filter Boarding'}
                  size="small"
                  sx={{ bgcolor: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', fontWeight: 700, fontSize: '0.68rem', height: '22px' }}
                />
              </Box>
              <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', lineHeight: 1.1 }}>
                {flightSummary.BOARDING ?? 0}
              </Typography>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.84rem', fontWeight: 700, color: '#475569', mt: 0.5 }}>
                Boarding Now
              </Typography>
              <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
                Click card to filter table view
              </Typography>
            </Card>

            {/* Card 3: Delayed */}
            <Card
              elevation={0}
              onClick={() => setStatusFilter(statusFilter === 'DELAYED' ? 'ALL' : 'DELAYED')}
              sx={{
                p: 2.5,
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: statusFilter === 'DELAYED' ? '2px solid #D97706' : '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  borderColor: '#D97706',
                  boxShadow: '0 8px 24px rgba(217, 119, 6, 0.12)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Clock size={22} color="#D97706" />
                </Box>
                <Chip
                  label={statusFilter === 'DELAYED' ? 'Filtering Active' : 'Filter Delayed'}
                  size="small"
                  sx={{ bgcolor: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A', fontWeight: 700, fontSize: '0.68rem', height: '22px' }}
                />
              </Box>
              <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#D97706', lineHeight: 1.1 }}>
                {flightSummary.DELAYED ?? 0}
              </Typography>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.84rem', fontWeight: 700, color: '#475569', mt: 0.5 }}>
                Delayed Flights
              </Typography>
              <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
                Click card to filter table view
              </Typography>
            </Card>

            {/* Card 4: Attention Required */}
            <Card
              elevation={0}
              onClick={() => handleTabSelect('delays')}
              sx={{
                p: 2.5,
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  borderColor: '#DC2626',
                  boxShadow: '0 8px 24px rgba(220, 38, 38, 0.12)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    backgroundColor: '#FEF2F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AlertTriangle size={22} color="#DC2626" />
                </Box>
                <Chip
                  label="View Log"
                  size="small"
                  sx={{ bgcolor: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', fontWeight: 800, fontSize: '0.68rem', height: '22px' }}
                />
              </Box>
              <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#DC2626', lineHeight: 1.1 }}>
                {delayTotal.toLocaleString()}
              </Typography>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.84rem', fontWeight: 700, color: '#475569', mt: 0.5 }}>
                Attention Required
              </Typography>
              <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
                {delayTotal.toLocaleString()} Logged Delays · Click to triage
              </Typography>
            </Card>
          </Box>

          {/* ========================================================================= */}
          {/* COMPONENT 2: FLIGHT OPERATIONS BOARD (MAIN CENTERPIECE COMPONENT)         */}
          {/* ========================================================================= */}
          <Card
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              mb: 3.5,
            }}
          >
            {/* Table Header & Search Filter Bar */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { sm: 'center' },
                gap: 2,
                mb: 2.5,
              }}
            >
              <Box>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#0F2942' }}>
                  Flight Operations Board
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#64748B' }}>
                  Click a flight to inspect its real-time Turnaround Progress below · search runs on the server; the status and concourse filters apply to the current page
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <TextField
                  size="small"
                  placeholder="Filter flight, route, gate..."
                  value={flightSearch}
                  onChange={(e) => setFlightSearch(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search size={16} color="#64748B" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: '8px', fontSize: '0.84rem', backgroundColor: '#F8FAFC', width: { xs: '100%', sm: 220 } },
                    },
                  }}
                />

                <Select
                  size="small"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ borderRadius: '8px', fontSize: '0.82rem', backgroundColor: '#F8FAFC', height: '36px' }}
                >
                  <MenuItem value="ALL">All Statuses</MenuItem>
                  <MenuItem value="BOARDING">Boarding</MenuItem>
                  <MenuItem value="DELAYED">Delayed</MenuItem>
                  <MenuItem value="READY">Ready</MenuItem>
                  <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                  <MenuItem value="AIRBORNE">Airborne</MenuItem>
                </Select>
              </Box>
            </Box>

            {/* Flight Operations Table */}
            <TableContainer sx={{ border: '1px solid #E2E8F0', borderRadius: '12px' }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.74rem' }}>FLIGHT</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.74rem' }}>ROUTE</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.74rem' }}>GATE</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.74rem' }}>STATUS</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.74rem', width: '28%' }}>TURNAROUND PROGRESS</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.74rem', textAlign: 'right' }}>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredFlights.map((f) => {
                    const isSelected = selectedFlight.id === f.id;
                    const statusColor =
                      f.status === 'READY'
                        ? '#10B981'
                        : f.status === 'BOARDING'
                        ? '#0284C7'
                        : f.status === 'DELAYED'
                        ? '#EF4444'
                        : f.status === 'AIRBORNE'
                        ? '#6366F1'
                        : '#64748B';

                    return (
                      <TableRow
                        key={f.id}
                        hover
                        onClick={() => handleSelectFlightForTurnaround(f)}
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'rgba(2, 132, 199, 0.05)' : 'inherit',
                          transition: 'background-color 0.15s ease',
                          '&:hover': { backgroundColor: isSelected ? 'rgba(2, 132, 199, 0.08)' : '#F8FAFC' },
                        }}
                      >
                        {/* Flight */}
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 34,
                                height: 34,
                                borderRadius: '8px',
                                bgcolor: isSelected ? '#0284C7' : '#F1F5F9',
                                color: isSelected ? '#FFFFFF' : '#0284C7',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <Plane size={16} />
                            </Box>
                            <Box>
                              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.92rem', color: '#0F2942' }}>
                                {f.flightNumber}
                              </Typography>
                              <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>
                                {f.aircraft}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        {/* Route */}
                        <TableCell sx={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                          {f.route}
                        </TableCell>

                        {/* Gate */}
                        <TableCell>
                          <Chip
                            label={f.gate}
                            size="small"
                            sx={{
                              bgcolor: '#F8FAFC',
                              border: '1px solid #CBD5E1',
                              fontWeight: 800,
                              fontSize: '0.74rem',
                              color: '#0F2942',
                            }}
                          />
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Chip
                            label={f.status}
                            size="small"
                            sx={{
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              backgroundColor: `${statusColor}15`,
                              color: statusColor,
                              border: `1px solid ${statusColor}40`,
                            }}
                          />
                        </TableCell>

                        {/* Turnaround Progress Bar */}
                        <TableCell>
                          <Box sx={{ width: '100%', pr: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.6 }}>
                              <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                                {f.turnaroundStage}
                              </Typography>
                              <Typography sx={{ fontFamily: "'Inter', monospace", fontSize: '0.74rem', fontWeight: 800, color: '#0F2942' }}>
                                {f.turnaroundProgress}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={f.turnaroundProgress}
                              sx={{
                                height: 7,
                                borderRadius: 4,
                                backgroundColor: '#E2E8F0',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: f.turnaroundProgress === 100 ? '#10B981' : f.status === 'DELAYED' ? '#EF4444' : '#0284C7',
                                  borderRadius: 4,
                                },
                              }}
                            />
                          </Box>
                        </TableCell>

                        {/* Action */}
                        <TableCell sx={{ textAlign: 'right' }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenFlightDetails(f);
                            }}
                            sx={{
                              fontFamily: "'Outfit', sans-serif",
                              fontWeight: 700,
                              fontSize: '0.74rem',
                              textTransform: 'none',
                              borderRadius: '7px',
                              borderColor: '#CBD5E1',
                              color: '#334155',
                              py: 0.3,
                              px: 1.2,
                              '&:hover': { borderColor: '#0284C7', color: '#0284C7', backgroundColor: '#F0F9FF' },
                            }}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination: 10 rows/page fetched from the server, never the whole flights table */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 1.5,
                px: 0.5,
              }}
            >
              <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
                {tableLoading
                  ? 'Loading…'
                  : tableTotalElements > 0
                  ? `Page ${tablePage + 1} of ${tableTotalPages} · ${tableTotalElements.toLocaleString()} flights total`
                  : 'No flights found'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <IconButton
                  size="small"
                  disabled={tablePage === 0 || tableLoading}
                  onClick={() => setTablePage((p) => Math.max(0, p - 1))}
                  aria-label="Previous page"
                  sx={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    color: '#334155',
                    '&:hover': { borderColor: '#0284C7', color: '#0284C7', backgroundColor: '#F0F9FF' },
                  }}
                >
                  <ChevronLeft size={18} />
                </IconButton>
                <IconButton
                  size="small"
                  disabled={tablePage + 1 >= tableTotalPages || tableLoading}
                  onClick={() => setTablePage((p) => Math.min(tableTotalPages - 1, p + 1))}
                  aria-label="Next page"
                  sx={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    color: '#334155',
                    '&:hover': { borderColor: '#0284C7', color: '#0284C7', backgroundColor: '#F0F9FF' },
                  }}
                >
                  <ChevronRight size={18} />
                </IconButton>
              </Box>
            </Box>
          </Card>

          {/* ========================================================================= */}
          {/* LOWER SECTION: TURNAROUND PROGRESS TIMELINE (LEFT) + ATTENTION (RIGHT)    */}
          {/* ========================================================================= */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '7fr 5fr' },
              gap: 3,
              mb: 3.5,
            }}
          >
            {/* Component 3: Turnaround Progress (For selected/critical flight) */}
            <Card
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5, pb: 2, borderBottom: '1px solid #F1F5F9' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.05rem', color: '#0F2942' }}>
                      Turnaround Timeline: {selectedFlight.flightNumber}
                    </Typography>
                    <Chip
                      label={selectedFlight.gate}
                      size="small"
                      sx={{ bgcolor: '#F1F5F9', fontWeight: 800, fontSize: '0.72rem', color: '#0F2942' }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: '0.78rem', color: '#64748B', mt: 0.3 }}>
                    {selectedFlight.route} · {selectedFlight.aircraft} · Target Pushback: {selectedFlight.scheduledTime}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#0284C7', lineHeight: 1 }}>
                    {selectedFlight.turnaroundProgress}%
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                    Turnaround Complete
                  </Typography>
                </Box>
              </Box>

              {/* Visual Step Timeline */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8, mb: 3 }}>
                {turnaroundTasks.map((step, idx) => {
                  const isDone = step.status === 'COMPLETED';
                  const isProgress = step.status === 'IN_PROGRESS';

                  return (
                    <Box key={step.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      {/* Status Icon Indicator */}
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: isDone ? '#DCFCE7' : isProgress ? '#E0F2FE' : '#F1F5F9',
                          color: isDone ? '#166534' : isProgress ? '#0284C7' : '#94A3B8',
                          border: isProgress ? '2px solid #0284C7' : 'none',
                          flexShrink: 0,
                          mt: 0.2,
                        }}
                      >
                        {isDone ? (
                          <Check size={15} strokeWidth={3} />
                        ) : isProgress ? (
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#0284C7' }} />
                        ) : (
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#CBD5E1' }} />
                        )}
                      </Box>

                      {/* Step Content */}
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography
                            sx={{
                              fontFamily: "'Outfit', sans-serif",
                              fontSize: '0.88rem',
                              fontWeight: isProgress ? 800 : isDone ? 700 : 500,
                              color: isDone ? '#0F2942' : isProgress ? '#0284C7' : '#64748B',
                            }}
                          >
                            {step.title}
                          </Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: isProgress ? '#0284C7' : '#94A3B8', fontWeight: isProgress ? 700 : 500 }}>
                            {step.timestamp}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.74rem', color: '#64748B', mt: 0.2 }}>
                          {step.notes} <span style={{ color: '#94A3B8' }}>({step.department})</span>
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              {/* Turnaround Quick Controls */}
              <Box sx={{ display: 'flex', gap: 1.5, pt: 2, borderTop: '1px solid #F1F5F9' }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAdvanceTask}
                  startIcon={<CheckCircle2 size={16} />}
                  sx={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    textTransform: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#0F2942',
                    '&:hover': { backgroundColor: '#1E3A5F' },
                  }}
                >
                  Advance Current Task
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setDelayFlightId(selectedFlight.flightId || '');
                    setLogDelayOpen(true);
                  }}
                  startIcon={<Send size={15} />}
                  sx={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    textTransform: 'none',
                    borderRadius: '8px',
                    borderColor: '#CBD5E1',
                    color: '#334155',
                    '&:hover': { borderColor: '#0284C7', color: '#0284C7' },
                  }}
                >
                  Log Delay for This Flight
                </Button>
              </Box>
            </Card>

            {/* Component 4: Needs Attention Panel */}
            <Card
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                  <Box>
                    <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.05rem', color: '#DC2626' }}>
                      NEEDS ATTENTION
                    </Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
                      Real-time bottlenecks from tasks, delay logs & gates
                    </Typography>
                  </Box>
                  <Chip
                    label={`${blockedTotal + (flightSummary.DELAYED ?? 0)} ACTIVE`}
                    size="small"
                    sx={{ bgcolor: '#FEF2F2', color: '#DC2626', fontWeight: 800, fontSize: '0.68rem', border: '1px solid #FECACA' }}
                  />
                </Box>

                {/* Attention Items: blocked turnaround tasks first, then delayed flights */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {attentionItems.length === 0 && (
                    <Typography sx={{ fontSize: '0.84rem', color: '#64748B' }}>
                      Nothing needs attention: no blocked turnaround tasks and no delayed flights on the live board.
                    </Typography>
                  )}
                  {attentionItems.map((item) => (
                    <Box
                      key={item.id}
                      sx={{ p: 2, borderRadius: '12px', bgcolor: item.blocked ? '#FEF2F2' : '#FFFBEB', border: '1px solid', borderColor: item.blocked ? '#FECACA' : '#FDE68A' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.blocked ? '#DC2626' : '#D97706' }} />
                          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.88rem', color: item.blocked ? '#991B1B' : '#92400E' }}>
                            {item.title}
                          </Typography>
                        </Box>
                        <Chip label={item.chip} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#FFFFFF', color: item.blocked ? '#DC2626' : '#D97706' }} />
                      </Box>
                      <Typography sx={{ fontSize: '0.76rem', color: item.blocked ? '#7F1D1D' : '#78350F', mb: 1.5 }}>{item.body}</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          onClick={() => openTurnaroundFor(item.flightId, item.flightNumber)}
                          sx={{ fontSize: '0.72rem', fontFamily: "'Outfit', sans-serif", fontWeight: 700, backgroundColor: item.blocked ? '#DC2626' : '#D97706', color: '#FFF', py: 0.3, textTransform: 'none', borderRadius: '6px', '&:hover': { backgroundColor: item.blocked ? '#B91C1C' : '#B45309' } }}
                        >
                          Open Turnaround
                        </Button>
                        <Button
                          size="small"
                          onClick={() => {
                            setDelayFlightId(item.flightId);
                            setLogDelayOpen(true);
                          }}
                          sx={{ fontSize: '0.72rem', fontFamily: "'Outfit', sans-serif", fontWeight: 700, backgroundColor: '#FFFFFF', color: item.blocked ? '#991B1B' : '#92400E', border: '1px solid', borderColor: item.blocked ? '#FCA5A5' : '#FCD34D', py: 0.3, textTransform: 'none', borderRadius: '6px' }}
                        >
                          Log Delay
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Card>
          </Box>

          {/* ========================================================================= */}
          {/* COMPONENT 5: GATE STATUS STRIP (AIRPORT-STYLE VISUALIZATION)              */}
          {/* ========================================================================= */}
          <Card
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.05rem', color: '#0F2942' }}>
                  Terminal Gate Status Strip
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Click any gate to reassign stand or inspect assigned flight
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#0284C7' }} />
                  <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Occupied</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981' }} />
                  <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Boarding</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#94A3B8' }} />
                  <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Available</Typography>
                </Box>
              </Box>
            </Box>

            {/* Grid of Gates */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(4, 1fr)',
                  lg: 'repeat(6, 1fr)',
                  xl: 'repeat(12, 1fr)',
                },
                gap: 1.5,
              }}
            >
              {gates.slice(0, 48).map((g) => {
                const isOccupied = g.status === 'OCCUPIED';
                const isBoarding = g.status === 'BOARDING';
                const isDelayed = g.status === 'DELAYED';
                const isAvail = g.status === 'AVAILABLE';

                const dotColor = isBoarding ? '#10B981' : isOccupied ? '#0284C7' : isDelayed ? '#EF4444' : '#94A3B8';
                const bgColor = isBoarding ? '#F0FDF4' : isOccupied ? '#F0F9FF' : isDelayed ? '#FEF2F2' : '#F8FAFC';
                const borderColor = isBoarding ? '#BBF7D0' : isOccupied ? '#BAE6FD' : isDelayed ? '#FECACA' : '#E2E8F0';

                return (
                  <Box
                    key={g.gate}
                    onClick={() => {
                      setReassignGateTarget(g);
                      setReassignFlightChoice(flights.find((f) => f.flightNumber === g.flight)?.flightId ?? '');
                      setReassignModalOpen(true);
                    }}
                    sx={{
                      p: 1.5,
                      borderRadius: '10px',
                      backgroundColor: bgColor,
                      border: `1px solid ${borderColor}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(15, 41, 66, 0.08)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.6 }}>
                      <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.88rem', color: '#0F2942' }}>
                        {g.gate}
                      </Typography>
                      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: dotColor }} />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        color: dotColor,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {g.status}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: g.flight ? '#0F2942' : '#94A3B8',
                        fontFamily: "'Inter', monospace",
                        mt: 0.4,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {g.flight || '—'}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Box>
      )}

      {/* ========================================================================= */}
      {/* 2. LIVE FLIGHT MONITOR SUB-VIEW (#flights)                                */}
      {/* ========================================================================= */}
      {activeTab === 'flights' && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                Live Flight Monitor
              </Typography>
              <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
                Operational flight telemetry, aircraft manifests and departure scheduling
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => handleTabSelect('overview')}
              sx={{ textTransform: 'none', borderRadius: '8px', color: '#475569', borderColor: '#CBD5E1' }}
            >
              Back to Overview
            </Button>
          </Box>

          <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>FLIGHT</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>AIRLINE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>ROUTE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>GATE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>SCHEDULED</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>PASSENGERS</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B', textAlign: 'right' }}>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {flights.map((f) => (
                    <TableRow key={f.id} hover>
                      <TableCell sx={{ fontWeight: 800, color: '#0F2942' }}>{f.flightNumber}</TableCell>
                      <TableCell sx={{ color: '#475569', fontWeight: 600 }}>{f.airline}</TableCell>
                      <TableCell sx={{ color: '#0F2942', fontWeight: 700 }}>{f.route}</TableCell>
                      <TableCell>
                        <Chip label={f.gate} size="small" sx={{ fontWeight: 700, bgcolor: '#F1F5F9' }} />
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'Inter', monospace", fontSize: '0.84rem' }}>{f.scheduledTime}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>{f.turnaroundStage}</TableCell>
                      <TableCell>
                        <Chip
                          label={f.status}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            bgcolor: f.status === 'READY' ? '#DCFCE7' : f.status === 'BOARDING' ? '#E0F2FE' : f.status === 'DELAYED' ? '#FEF2F2' : '#F1F5F9',
                            color: f.status === 'READY' ? '#15803D' : f.status === 'BOARDING' ? '#0284C7' : f.status === 'DELAYED' ? '#DC2626' : '#475569',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleOpenFlightDetails(f)}
                          sx={{ textTransform: 'none', borderRadius: '6px', fontSize: '0.75rem' }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      )}

      {/* ========================================================================= */}
      {/* 3. FLIGHT DETAILS SUB-VIEW (#details)                                     */}
      {/* ========================================================================= */}
      {activeTab === 'details' && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                Operational Flight Details: {selectedFlight.flightNumber}
              </Typography>
              <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
                Full aircraft telemetry, payload, assigned stand, and ground turnaround checklist
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => handleTabSelect('overview')}
              sx={{ textTransform: 'none', borderRadius: '8px', color: '#475569', borderColor: '#CBD5E1' }}
            >
              Back to Overview
            </Button>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {/* Card 1: Aircraft & Route Info */}
            <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#0F2942', mb: 2 }}>
                Flight Manifest
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                  <Typography sx={{ color: '#64748B', fontSize: '0.84rem' }}>Flight Number</Typography>
                  <Typography sx={{ fontWeight: 800, color: '#0F2942' }}>{selectedFlight.flightNumber}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                  <Typography sx={{ color: '#64748B', fontSize: '0.84rem' }}>Airline Carrier</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#0F2942' }}>{selectedFlight.airline}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                  <Typography sx={{ color: '#64748B', fontSize: '0.84rem' }}>Aircraft Type</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#0F2942' }}>{selectedFlight.aircraft}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                  <Typography sx={{ color: '#64748B', fontSize: '0.84rem' }}>Assigned Gate / Stand</Typography>
                  <Chip label={selectedFlight.gate} size="small" sx={{ fontWeight: 800, bgcolor: '#F1F5F9' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                  <Typography sx={{ color: '#64748B', fontSize: '0.84rem' }}>Route Manifest</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#0284C7' }}>{selectedFlight.origin} ➔ {selectedFlight.destination}</Typography>
                </Box>
              </Box>
            </Card>

            {/* Card 2: Ground Payload & Status */}
            <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#0F2942', mb: 2 }}>
                Payload & Operational State
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                  <Typography sx={{ color: '#64748B', fontSize: '0.84rem' }}>Boarding Passes Issued</Typography>
                  <Typography sx={{ fontWeight: 800, color: '#0F2942' }}>{selectedFlight.boardingPasses ?? '—'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                  <Typography sx={{ color: '#64748B', fontSize: '0.84rem' }}>Target Pushback</Typography>
                  <Typography sx={{ fontFamily: "'Inter', monospace", fontWeight: 700, color: '#0F2942' }}>{selectedFlight.scheduledTime}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                  <Typography sx={{ color: '#64748B', fontSize: '0.84rem' }}>Current Status</Typography>
                  <Chip label={selectedFlight.status} size="small" sx={{ fontWeight: 800, bgcolor: '#E0F2FE', color: '#0284C7' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                  <Typography sx={{ color: '#64748B', fontSize: '0.84rem' }}>Turnaround Stage</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#10B981' }}>{selectedFlight.turnaroundStage}</Typography>
                </Box>
                {delayLogs
                  .filter((d) => d.flightNumber === selectedFlight.flightNumber)
                  .slice(0, 2)
                  .map((d) => (
                    <Box key={d.id} sx={{ p: 1.5, borderRadius: '8px', bgcolor: '#FEF2F2', border: '1px solid #FECACA', mt: 1 }}>
                      <Typography sx={{ fontSize: '0.76rem', color: '#991B1B', fontWeight: 700 }}>
                        Delay {d.loggedBy}: {d.reasonCategory.replace(/_/g, ' ')} (+{d.delayMinutes}m)
                      </Typography>
                    </Box>
                  ))}
              </Box>
            </Card>
          </Box>
        </Box>
      )}

      {/* ========================================================================= */}
      {/* 4. GATE OCCUPANCY SUB-VIEW (#gates)                                      */}
      {/* ========================================================================= */}
      {activeTab === 'gates' && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                Terminal Gate Occupancy Matrix
              </Typography>
              <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
                Real-time stand telemetry for Concourse A, B & C
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => handleTabSelect('overview')}
              sx={{ textTransform: 'none', borderRadius: '8px', color: '#475569', borderColor: '#CBD5E1' }}
            >
              Back to Overview
            </Button>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5 }}>
            {gates.slice(0, gateTabLimit).map((g) => (
              <Card
                key={g.gate}
                sx={{
                  p: 2.5,
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  '&:hover': { borderColor: '#0284C7', transform: 'translateY(-2px)' },
                  transition: 'all 0.15s ease',
                }}
                onClick={() => {
                  setReassignGateTarget(g);
                  setReassignFlightChoice(flights.find((f) => f.flightNumber === g.flight)?.flightId ?? '');
                  setReassignModalOpen(true);
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#0F2942' }}>
                    STAND {g.gate}
                  </Typography>
                  <Chip label={g.concourse} size="small" sx={{ fontWeight: 700, bgcolor: '#F1F5F9' }} />
                </Box>
                <Typography sx={{ fontSize: '0.78rem', color: '#64748B', mb: 1 }}>
                  Status: <b>{g.status}</b>
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', monospace", fontWeight: 800, color: g.flight ? '#0284C7' : '#94A3B8', fontSize: '0.95rem' }}>
                  {g.flight ? `✈ ${g.flight}` : 'NO AIRCRAFT'}
                </Typography>
                {g.aircraftType && (
                  <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', mt: 0.3 }}>
                    {g.aircraftType}
                  </Typography>
                )}
                <Button size="small" sx={{ mt: 1.5, fontSize: '0.72rem', textTransform: 'none', color: '#0284C7', p: 0 }}>
                  Reassign Stand ➔
                </Button>
              </Card>
            ))}
          </Box>
          {gates.length > gateTabLimit && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button onClick={() => setGateTabLimit((n) => n + 48)} sx={{ textTransform: 'none', fontWeight: 700 }}>
                Show more gates ({gates.length - gateTabLimit} remaining)
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* ========================================================================= */}
      {/* 5. TURNAROUND TIMELINE SUB-VIEW (#turnaround)                            */}
      {/* ========================================================================= */}
      {activeTab === 'turnaround' && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                Turnaround Critical Path Tracker
              </Typography>
              <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
                Multi-department ground turnaround milestones for active hub flights
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => handleTabSelect('overview')}
              sx={{ textTransform: 'none', borderRadius: '8px', color: '#475569', borderColor: '#CBD5E1' }}
            >
              Back to Overview
            </Button>
          </Box>

          <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#0F2942', mb: 2 }}>
              Active Ground Turnaround Operations
            </Typography>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>FLIGHT</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>GATE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>CURRENT MILESTONE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>PROGRESS</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B', textAlign: 'right' }}>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {flights.map((f) => (
                    <TableRow key={f.id} hover>
                      <TableCell sx={{ fontWeight: 800, color: '#0F2942' }}>{f.flightNumber}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{f.gate}</TableCell>
                      <TableCell sx={{ color: '#475569', fontSize: '0.84rem' }}>{f.turnaroundStage}</TableCell>
                      <TableCell sx={{ width: '25%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <LinearProgress
                            variant="determinate"
                            value={f.turnaroundProgress}
                            sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                          />
                          <Typography sx={{ fontSize: '0.76rem', fontWeight: 800 }}>{f.turnaroundProgress}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={f.status} size="small" sx={{ fontWeight: 800, fontSize: '0.7rem' }} />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Button
                          size="small"
                          onClick={() => {
                            handleSelectFlightForTurnaround(f);
                            handleTabSelect('overview');
                          }}
                          sx={{ textTransform: 'none', fontSize: '0.74rem' }}
                        >
                          Inspect Timeline
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      )}

      {/* ========================================================================= */}
      {/* 6. DELAY LOGS SUB-VIEW (#delays)                                         */}
      {/* ========================================================================= */}
      {activeTab === 'delays' && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                Operational Delay Logs
              </Typography>
              <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
                Documented airside delay incidents, duration, root reasons, and operational mitigations
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                onClick={() => setLogDelayOpen(true)}
                sx={{
                  backgroundColor: '#0F2942',
                  textTransform: 'none',
                  borderRadius: '8px',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                }}
              >
                Log New Delay
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleTabSelect('overview')}
                sx={{ textTransform: 'none', borderRadius: '8px', color: '#475569', borderColor: '#CBD5E1' }}
              >
                Back to Overview
              </Button>
            </Box>
          </Box>

          <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>INCIDENT ID</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>FLIGHT</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>ROUTE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>DURATION</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>CATEGORY</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>DESCRIPTION</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>LOGGED BY</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {delayLogs.map((d) => (
                    <TableRow key={d.id} hover>
                      <TableCell sx={{ fontFamily: "'Inter', monospace", fontWeight: 800, color: '#0284C7' }}>{d.id}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#0F2942' }}>{d.flightNumber}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>{d.route}</TableCell>
                      <TableCell>
                        <Chip label={`+${d.delayMinutes} min`} size="small" sx={{ fontWeight: 800, bgcolor: '#FEF2F2', color: '#DC2626' }} />
                      </TableCell>
                      <TableCell>
                        <Chip label={d.reasonCategory.replace(/_/g, ' ')} size="small" sx={{ fontWeight: 700, fontSize: '0.68rem', bgcolor: '#F1F5F9' }} />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', color: '#334155' }}>{d.description}</TableCell>
                      <TableCell sx={{ fontSize: '0.74rem', color: '#64748B' }}>{d.loggedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      )}

      {/* ========================================================================= */}
      {/* 7. NOTIFICATIONS SUB-VIEW (#notifications)                                */}
      {/* ========================================================================= */}
      {activeTab === 'notifications' && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                Operational Alerts & Broadcasts
              </Typography>
              <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
                Blocked turnaround tasks and delayed flights, computed live
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => handleTabSelect('overview')}
              sx={{ textTransform: 'none', borderRadius: '8px', color: '#475569', borderColor: '#CBD5E1' }}
            >
              Back to Overview
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {attentionItems.length === 0 && (
              <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>No alerts: nothing is blocked or delayed on the live board.</Typography>
            )}
            {attentionItems.map((item) => (
              <Card
                key={item.id}
                sx={{ p: 2.5, borderRadius: '14px', border: '1px solid', borderColor: item.blocked ? '#FECACA' : '#FDE68A', bgcolor: item.blocked ? '#FEF2F2' : '#FFFBEB' }}
              >
                <Typography sx={{ fontWeight: 800, color: item.blocked ? '#991B1B' : '#92400E', fontSize: '0.95rem', mb: 0.5 }}>
                  {item.blocked ? 'BLOCKED' : 'DELAYED'}: {item.title}
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: item.blocked ? '#7F1D1D' : '#78350F' }}>{item.body}</Typography>
              </Card>
            ))}
            {blockedTotal > blockedTasks.length && (
              <Typography sx={{ fontSize: '0.8rem', color: '#64748B' }}>
                {blockedTotal - blockedTasks.length} more blocked task(s) across the airport. Open the Ground Ops task center to see them all.
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {/* ========================================================================= */}
      {/* 8. PROFILE SUB-VIEW (#profile)                                            */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                Controller Station & Clearance Profile
              </Typography>
              <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
                AOCC Operator credentials, operational sector, and airside telemetry authorization
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => handleTabSelect('overview')}
              sx={{ textTransform: 'none', borderRadius: '8px', color: '#475569', borderColor: '#CBD5E1' }}
            >
              Back to Overview
            </Button>
          </Box>

          <Card sx={{ p: 3.5, borderRadius: '16px', border: '1px solid #E2E8F0', maxWidth: 640 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3, pb: 2.5, borderBottom: '1px solid #F1F5F9' }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: '#0284C7', fontSize: '1.4rem', fontWeight: 800 }}>
                {(user?.name || 'AO').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                  {user?.name || 'AOCC Controller'}
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#0284C7', fontWeight: 700 }}>
                  Airport Operations Manager
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mt: 0.2 }}>
                  Username: {user?.username} · Department: {user?.departmentName?.replace(/_/g, ' ')}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                <Typography sx={{ color: '#64748B', fontSize: '0.84rem' }}>Operational Email</Typography>
                <Typography sx={{ fontWeight: 700, color: '#0F2942' }}>{user?.email || '—'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                <Typography sx={{ color: '#64748B', fontSize: '0.84rem' }}>Assigned Airfield Hub</Typography>
                <Typography sx={{ fontWeight: 700, color: '#0F2942' }}>Saphire International Airport (SPH)</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                <Typography sx={{ color: '#64748B', fontSize: '0.84rem' }}>Assigned Concourse</Typography>
                <Typography sx={{ fontWeight: 700, color: '#0F2942' }}>All terminal gates</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                <Typography sx={{ color: '#64748B', fontSize: '0.84rem' }}>Active Session Security</Typography>
                <Chip label="RBAC ENFORCED · TLS 1.3" size="small" sx={{ fontWeight: 800, fontSize: '0.68rem', bgcolor: '#DCFCE7', color: '#15803D' }} />
              </Box>
            </Box>
          </Card>
        </Box>
      )}

      {/* ========================================================================= */}
      {/* DIALOG 1: FLIGHT DETAILS MODAL                                            */}
      {/* ========================================================================= */}
      <Dialog
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: '16px', p: 1 },
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', pb: 1 }}>
          Operational Flight Manifest
        </DialogTitle>
        <DialogContent dividers>
          {modalFlight && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0284C7' }}>
                  {modalFlight.flightNumber}
                </Typography>
                <Chip label={modalFlight.status} sx={{ fontWeight: 800 }} />
              </Box>

              <Typography sx={{ fontSize: '0.9rem', color: '#334155', fontWeight: 700 }}>
                {modalFlight.route} ({modalFlight.origin} ➔ {modalFlight.destination})
              </Typography>

              <Divider />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>AIRLINE</Typography>
                  <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F2942' }}>{modalFlight.airline}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>AIRCRAFT</Typography>
                  <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F2942' }}>{modalFlight.aircraft}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>STAND / GATE</Typography>
                  <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F2942' }}>{modalFlight.gate}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>SCHEDULED UTC</Typography>
                  <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F2942' }}>{modalFlight.scheduledTime}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>BOARDING PASSES</Typography>
                  <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F2942' }}>{modalFlight.boardingPasses ?? '—'}</Typography>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography sx={{ fontSize: '0.72rem', color: '#64748B', mb: 0.5 }}>TURNAROUND PROGRESS</Typography>
                <LinearProgress variant="determinate" value={modalFlight.turnaroundProgress} sx={{ height: 8, borderRadius: 4, mb: 0.5 }} />
                <Typography sx={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>
                  {modalFlight.turnaroundProgress}% · {modalFlight.turnaroundStage}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDetailsModalOpen(false)} sx={{ textTransform: 'none', color: '#64748B' }}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (modalFlight) handleSelectFlightForTurnaround(modalFlight);
              setDetailsModalOpen(false);
              toast.success(`Selected ${modalFlight?.flightNumber} in Turnaround Timeline.`);
            }}
            sx={{ backgroundColor: '#0F2942', textTransform: 'none', fontWeight: 700 }}
          >
            Track in Timeline
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG 2: LOG OPERATIONAL DELAY MODAL                                     */}
      {/* ========================================================================= */}
      <Dialog
        open={logDelayOpen}
        onClose={() => setLogDelayOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: '16px', p: 1 },
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
          Log Operational Delay
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Flight</InputLabel>
              <Select
                value={delayFlightId}
                label="Flight"
                onChange={(e) => setDelayFlightId(Number(e.target.value))}
              >
                {flights.map((f) => (
                  <MenuItem key={f.id} value={f.flightId}>
                    {f.flightNumber} ({f.route}) — {f.gate}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2 }}>
              <TextField
                label="Delay Duration (Minutes)"
                type="number"
                size="small"
                value={delayMinutesInput}
                onChange={(e) => setDelayMinutesInput(e.target.value)}
              />

              <FormControl fullWidth size="small">
                <InputLabel>Delay code</InputLabel>
                <Select value={delayCodeInput} label="Delay code" onChange={(e) => setDelayCodeInput(e.target.value)}>
                  {delayCodes.map((c) => (
                    <MenuItem key={c.delayCode} value={c.delayCode}>
                      {c.delayCode} · {c.category.replace(/_/g, ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
              Saving moves the flight to DELAYED (when its status allows it) and pushes its estimated departure back by this many minutes.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setLogDelayOpen(false)} sx={{ textTransform: 'none', color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveDelay}
            sx={{ backgroundColor: '#0F2942', textTransform: 'none', fontWeight: 700 }}
          >
            Save Delay Log
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG 3: REASSIGN GATE STAND MODAL                                       */}
      {/* ========================================================================= */}
      <Dialog
        open={reassignModalOpen}
        onClose={() => setReassignModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: '16px', p: 1 },
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
          Stand {reassignGateTarget?.gate} Assignment
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Typography sx={{ fontSize: '0.84rem', color: '#64748B' }}>
              Put a flight on this gate. The server rejects it if the aircraft is too wide or the ground time overlaps another flight.
            </Typography>

            <FormControl fullWidth size="small">
              <InputLabel>Flight</InputLabel>
              <Select
                value={reassignFlightChoice}
                label="Flight"
                onChange={(e) => setReassignFlightChoice(Number(e.target.value))}
              >
                {flights.map((f) => (
                  <MenuItem key={f.id} value={f.flightId}>
                    {f.flightNumber} — {f.route}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setReassignModalOpen(false)} sx={{ textTransform: 'none', color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleReassignGateSubmit}
            sx={{ backgroundColor: '#0F2942', textTransform: 'none', fontWeight: 700 }}
          >
            Assign Gate
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

// Helper component for Users icon
function UsersIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default AOCCControllerDashboard;
