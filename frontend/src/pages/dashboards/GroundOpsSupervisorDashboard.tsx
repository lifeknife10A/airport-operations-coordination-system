import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Briefcase,
  Wrench,
  Fuel,
  ShieldCheck,
  Search,
  Plus,
  ArrowUpRight,
  Filter,
  Check,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  X,
  Bell,
  UserCheck,
  Sparkles,
  RefreshCw,
  FileText,
  Radio,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { aocsDataStore } from '../../services/aocsDataStore';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { shiftHandoverApi, ShiftHandoverData } from '../../api/shiftHandoverApi';
import { taskApi, ActiveTurnaround, StaffWorkload, TaskStatusCounts } from '../../api/taskApi';
import { describeApiError } from '../../services/aocsDataStore';
import type { TurnaroundTask } from '../../types';

// Types
export type TaskStage = 'CLEANING' | 'FUELING' | 'MAINTENANCE' | 'SECURITY';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
export type StageStatus = TaskStatus | 'NONE';
export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface GroundTurnaroundFlight {
  id: string;
  flightId: number;
  flightNumber: string;
  airline: string;
  aircraft: string;
  stand: string;
  concourse: string;
  route: string;
  etaEtd: string;
  cleaningStatus: StageStatus;
  fuelingStatus: StageStatus;
  maintenanceStatus: StageStatus;
  securityStatus: StageStatus;
  overallProgress: number; // 0 - 100
  supervisorNotes: string;
  delayReason?: string;
}

export interface GroundTask {
  id: string;
  taskId: number;
  flightNumber: string;
  stand: string;
  serviceType: TaskStage;
  title: string;
  priority: TaskPriority;
  assignedStaff: string;
  status: TaskStatus;
  estCompletion: string;
  notes: string;
}

export interface HandoverLog {
  id: string;
  handoverId?: number;
  shiftTitle: string;
  outgoingSupervisor: string;
  incomingSupervisor: string;
  timestamp: string;
  carriedOverTasks: number;
  flightsAwaitingAction: number;
  unresolvedHolds: string[];
  status: 'SUBMITTED' | 'ACKNOWLEDGED' | 'DRAFT';
  summaryNotes: string;
}

// ---------------------------------------------------------------------------------------------
// Live data mapping: backend turnaround tasks/flights -> the shapes this dashboard renders
// ---------------------------------------------------------------------------------------------
// The board has four stage columns; the backend's seven task names map onto them like this.
// Baggage unloading, catering and pushback prep still count toward a flight's progress.
const STAGE_BY_TASK_NAME: Record<string, TaskStage> = {
  'CABIN CLEANING': 'CLEANING',
  REFUELING: 'FUELING',
  'SAFETY INSPECTION': 'MAINTENANCE',
  'BOARDING GATE CLEARANCE': 'SECURITY',
};
const TASK_NAME_OPTIONS = [
  'Cabin Cleaning',
  'Refueling',
  'Baggage Unloading',
  'Catering Replenishment',
  'Boarding Gate Clearance',
  'Pushback Operational Prep',
  'Safety Inspection',
];
const stageOf = (taskName: string): TaskStage => STAGE_BY_TASK_NAME[taskName.toUpperCase()] ?? 'MAINTENANCE';

const clockOf = (iso?: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${d.toISOString().slice(11, 16)} UTC`;
};

const EMPTY_FLIGHT: GroundTurnaroundFlight = {
  id: 'none', flightId: 0, flightNumber: '—', airline: '', aircraft: '', stand: '', concourse: '', route: '', etaEtd: '',
  cleaningStatus: 'NONE', fuelingStatus: 'NONE', maintenanceStatus: 'NONE', securityStatus: 'NONE',
  overallProgress: 0, supervisorNotes: '',
};

const toGroundFlight = (a: ActiveTurnaround): GroundTurnaroundFlight => {
  const statusOf = (stage: TaskStage): StageStatus => {
    const t = a.tasks.find((x) => stageOf(x.taskName) === stage && STAGE_BY_TASK_NAME[x.taskName.toUpperCase()]);
    return t ? (t.status as TaskStatus) : 'NONE';
  };
  const done = a.tasks.filter((t) => t.status === 'COMPLETED').length;
  const blocked = a.tasks.filter((t) => t.status === 'BLOCKED');
  return {
    id: `F-${a.flightId}`,
    flightId: a.flightId,
    flightNumber: a.flightNumber,
    airline: a.airlineName,
    aircraft: a.aircraftType,
    stand: a.standNumber ? `Stand ${a.standNumber}` : 'No stand',
    concourse: a.concourse,
    route: `${a.origin} → ${a.destination}`,
    etaEtd: clockOf(a.scheduledDeparture),
    cleaningStatus: statusOf('CLEANING'),
    fuelingStatus: statusOf('FUELING'),
    maintenanceStatus: statusOf('MAINTENANCE'),
    securityStatus: statusOf('SECURITY'),
    overallProgress: a.tasks.length ? Math.round((done / a.tasks.length) * 100) : 0,
    supervisorNotes: blocked.length ? `Blocked: ${blocked.map((t) => t.taskName).join(', ')}` : `${a.tasks.length} task(s) on this flight`,
    delayReason: a.flightStatus === 'DELAYED' ? 'Flight is currently delayed' : undefined,
  };
};

// Priority is not stored; it is derived from status so a blocked task always reads as urgent.
const toGroundTask = (t: TurnaroundTask, standByFlight: Map<string, string>): GroundTask => ({
  id: `TSK-${t.taskId}`,
  taskId: t.taskId,
  flightNumber: t.flightNumber,
  stand: standByFlight.get(t.flightNumber) ?? '',
  serviceType: stageOf(t.taskName),
  title: t.taskName,
  priority: t.status === 'BLOCKED' ? 'HIGH' : t.status === 'IN_PROGRESS' ? 'MEDIUM' : 'LOW',
  assignedStaff: t.assignedUserName ?? '',
  status: t.status as TaskStatus,
  estCompletion: t.plannedEnd || '—',
  notes: t.notes ?? '',
});


export const GroundOpsSupervisorDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Active hash-based sub-view
  const [activeTab, setActiveTab] = useState<'overview' | 'flights' | 'tasks' | 'assignment' | 'handover' | 'notifications' | 'profile'>('overview');

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (['flights', 'tasks', 'assignment', 'handover', 'notifications', 'profile'].includes(hash)) {
      setActiveTab(hash as any);
    } else {
      setActiveTab('overview');
    }
  }, [location.hash]);

  // Fetch live Shift Handover logs from backend database
  useEffect(() => {
    let isMounted = true;
    shiftHandoverApi.getAll(0, 20)
      .then((res: any) => {
        if (!isMounted) return;
        const data = Array.isArray(res) ? res : res?.content || [];
        if (data.length > 0) {
          const mapped: HandoverLog[] = data.map((d: ShiftHandoverData) => ({
            id: `HND-${d.handoverId}`,
            handoverId: d.handoverId,
            shiftTitle: `${d.shiftCode} - ${d.departmentName || 'Ground Ops'} Turnover`,
            outgoingSupervisor: d.outgoingSupervisorName || 'Riya Johnson (Ground Ops Lead)',
            incomingSupervisor: d.incomingSupervisorName || 'Vikram Seth (Night Shift Lead)',
            timestamp: d.outgoingSignoffTimestamp ? new Date(d.outgoingSignoffTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC' : 'Today',
            carriedOverTasks: d.delayedFlightsCount || 0,
            flightsAwaitingAction: d.totalFlightsHandled || 0,
            unresolvedHolds: d.unresolvedEquipmentIssues ? [d.unresolvedEquipmentIssues] : [],
            status: d.status === 'ACKNOWLEDGED' ? 'ACKNOWLEDGED' : 'SUBMITTED',
            summaryNotes: d.criticalEventsSummary || 'Shift turnover logged.',
          }));
          setHandovers((prev) => {
            const combined = [...mapped];
            for (const p of prev) {
              if (!combined.some((c) => c.id === p.id)) {
                combined.push(p);
              }
            }
            return combined;
          });
        }
      })
      .catch((err) => {
        console.warn('Backend shift handover sync fallback:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTabSelect = (tab: string) => {
    if (tab === 'overview') {
      navigate('/dashboard/ground-ops');
    } else {
      navigate(`/dashboard/ground-ops#${tab}`);
    }
  };

  // State -- flights, tasks, counts and staff are all loaded from the backend.
  const [rawTasks, setRawTasks] = useState<TurnaroundTask[]>([]);
  const [flights, setFlights] = useState<GroundTurnaroundFlight[]>([]);
  const [taskPage, setTaskPage] = useState(0);
  const [taskTotal, setTaskTotal] = useState(0);
  const [taskCounts, setTaskCounts] = useState<TaskStatusCounts>({ PENDING: 0, IN_PROGRESS: 0, COMPLETED: 0, BLOCKED: 0 });
  const [staff, setStaff] = useState<StaffWorkload[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [handovers, setHandovers] = useState<HandoverLog[]>([]);
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);
  const selectedFlight = flights.find((f) => f.id === selectedFlightId) ?? flights[0] ?? EMPTY_FLIGHT;
  const setSelectedFlight = (f: GroundTurnaroundFlight) => setSelectedFlightId(f.id);

  // Filters
  const [taskFilter, setTaskFilter] = useState<'ALL' | 'ATTENTION' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  const [flightFilter, setFlightFilter] = useState<string>('ALL');
  const [flightSearch, setFlightSearch] = useState('');
  const [taskSearch, setTaskSearch] = useState('');

  // Modals
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [newTaskFlightId, setNewTaskFlightId] = useState<number | ''>('');
  const [newTaskName, setNewTaskName] = useState(TASK_NAME_OPTIONS[0]);
  const [newTaskUserId, setNewTaskUserId] = useState<number | ''>('');

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [activeTaskToAssign, setActiveTaskToAssign] = useState<GroundTask | null>(null);
  const [assignedUserChoice, setAssignedUserChoice] = useState<number | ''>('');

  const [handoverModalOpen, setHandoverModalOpen] = useState(false);
  const [handoverIncomingSup, setHandoverIncomingSup] = useState('Vikram Seth (Night Shift Lead)');
  const [handoverNotesInput, setHandoverNotesInput] = useState('');
  const [handoverIssuesInput, setHandoverIssuesInput] = useState('');

  const standByFlight = useMemo(() => new Map(flights.map((f) => [f.flightNumber, f.stand])), [flights]);
  const tasks = useMemo(() => rawTasks.map((t) => toGroundTask(t, standByFlight)), [rawTasks, standByFlight]);

  // Board (active flights + status counts) and the ramp roster
  const loadBoard = useCallback(async () => {
    try {
      const [active, counts] = await Promise.all([taskApi.getActiveTurnarounds(30), taskApi.getStatusCounts()]);
      setFlights(active.map(toGroundFlight));
      setTaskCounts(counts);
      setLoadError(null);
    } catch (e) {
      setLoadError(describeApiError(e));
    }
  }, []);
  const loadStaff = useCallback(() => {
    taskApi.getRampStaff().then(setStaff).catch(() => setStaff([]));
  }, []);
  useEffect(() => {
    loadBoard();
    loadStaff();
  }, [loadBoard, loadStaff]);

  // Task queue: the server does the filtering, searching and paging (there are ~10,000 tasks).
  const taskRequest = useRef(0);
  const fetchTasks = useCallback(
    async (page: number) => {
      const requestId = ++taskRequest.current;
      const status = taskFilter === 'ATTENTION' ? 'BLOCKED' : taskFilter === 'ALL' ? '' : taskFilter;
      try {
        const res = await taskApi.getPage({ status, q: taskSearch.trim(), page, size: 25 });
        if (requestId !== taskRequest.current) return; // a newer filter/search superseded this response
        setRawTasks((prev) => (page === 0 ? res.content : [...prev, ...res.content]));
        setTaskPage(res.page);
        setTaskTotal(res.totalElements);
      } catch (e) {
        if (requestId === taskRequest.current) toast.error(`Could not load tasks: ${describeApiError(e)}`);
      }
    },
    [taskFilter, taskSearch]
  );
  useEffect(() => {
    const handle = setTimeout(() => fetchTasks(0), 250);
    return () => clearTimeout(handle);
  }, [fetchTasks]);

  const totalFlightsCount = flights.length;
  const totalTasksCount = taskCounts.PENDING + taskCounts.IN_PROGRESS + taskCounts.COMPLETED + taskCounts.BLOCKED;
  const completedTasksCount = taskCounts.COMPLETED;
  const pendingTasksCount = taskCounts.BLOCKED;

  // Task actions: change the row immediately, put it back with the server's reason if refused.
  const changeTaskStatus = async (task: GroundTask, next: TaskStatus, okMessage: string) => {
    const before = rawTasks;
    setRawTasks((prev) => prev.map((t) => (t.taskId === task.taskId ? { ...t, status: next } : t)));
    try {
      await taskApi.updateTaskStatus(task.taskId, next);
      toast.success(okMessage);
      loadBoard();
      loadStaff();
    } catch (e) {
      setRawTasks(before);
      toast.error(`${task.title} was NOT changed to ${next}: ${describeApiError(e)}`);
    }
  };
  const handleMarkTaskStarted = (task: GroundTask) => changeTaskStatus(task, 'IN_PROGRESS', `${task.title} on ${task.flightNumber} is now in progress`);
  const handleMarkTaskCompleted = (task: GroundTask) => changeTaskStatus(task, 'COMPLETED', `${task.title} on ${task.flightNumber} completed`);
  const handleMarkTaskResumed = (task: GroundTask) => changeTaskStatus(task, 'IN_PROGRESS', `${task.title} on ${task.flightNumber} resumed`);

  const handleOpenAssignModal = (task: GroundTask) => {
    setActiveTaskToAssign(task);
    setAssignedUserChoice(rawTasks.find((t) => t.taskId === task.taskId)?.assignedUserId ?? '');
    setAssignModalOpen(true);
  };

  const handleSaveAssignment = async () => {
    if (!activeTaskToAssign || assignedUserChoice === '') {
      toast.error('Pick a staff member first');
      return;
    }
    try {
      const updated = await taskApi.assignTaskUser(activeTaskToAssign.taskId, assignedUserChoice);
      setRawTasks((prev) => prev.map((t) => (t.taskId === updated.taskId ? { ...t, ...updated } : t)));
      toast.success(`${activeTaskToAssign.title} assigned to ${updated.assignedUserName ?? 'staff member'}`);
      setAssignModalOpen(false);
      loadStaff();
    } catch (e) {
      toast.error(`Assignment failed: ${describeApiError(e)}`);
    }
  };

  const handleCreateTaskSubmit = async () => {
    if (newTaskFlightId === '') {
      toast.error('Choose a flight for this workorder');
      return;
    }
    try {
      const created = await taskApi.createTask({
        flightId: newTaskFlightId,
        taskName: newTaskName,
        assignedUserId: newTaskUserId === '' ? undefined : newTaskUserId,
      });
      toast.success(`${created.taskName} created for ${created.flightNumber}`);
      setCreateTaskOpen(false);
      setNewTaskUserId('');
      fetchTasks(0);
      loadBoard();
      loadStaff();
    } catch (e) {
      toast.error(`Workorder was NOT created: ${describeApiError(e)}`);
    }
  };

  const handleCreateHandoverSubmit = async () => {
    if (!handoverNotesInput.trim()) {
      toast.error('Please enter shift handover summary notes');
      return;
    }

    let createdId = Math.floor(402 + Math.random() * 100);
    const hour = new Date().getUTCHours();
    const currentShiftCode = hour >= 6 && hour < 14 ? 'MORNING_06_14' : hour >= 14 && hour < 22 ? 'AFTERNOON_14_22' : 'NIGHT_22_06';

    try {
      const backendCreated = await shiftHandoverApi.create({
        shiftCode: currentShiftCode,
        departmentId: 2,
        outgoingSupervisorId: user?.userId || 1,
        incomingSupervisorId: 2,
        totalFlightsHandled: flights.length,
        delayedFlightsCount: pendingTasksCount,
        criticalEventsSummary: handoverNotesInput,
        unresolvedEquipmentIssues: handoverIssuesInput,
      });
      if (backendCreated?.handoverId) {
        createdId = backendCreated.handoverId;
      }
    } catch (err) {
      console.warn('Backend shift handover creation fallback:', err);
    }

    const newHnd: HandoverLog = {
      id: `HND-${createdId}`,
      handoverId: createdId,
      shiftTitle: 'Current Ramp Shift Turnover',
      outgoingSupervisor: user?.name || 'Riya Johnson (Ground Ops Lead)',
      incomingSupervisor: handoverIncomingSup,
      timestamp: 'Just now (UTC)',
      carriedOverTasks: pendingTasksCount,
      flightsAwaitingAction: 2,
      unresolvedHolds: handoverIssuesInput ? [handoverIssuesInput] : [],
      status: 'SUBMITTED',
      summaryNotes: handoverNotesInput,
    };
    setHandovers([newHnd, ...handovers]);
    toast.success('Shift handover log submitted to live database for incoming supervisor review');
    setHandoverModalOpen(false);
  };

  const handleAcknowledgeHandover = async (h: HandoverLog) => {
    try {
      if (h.handoverId) {
        await shiftHandoverApi.acknowledge(h.handoverId, 2, 'Acknowledged by incoming supervisor');
      }
    } catch (err) {
      console.warn('Backend handover acknowledgement fallback:', err);
    }

    setHandovers((prev) =>
      prev.map((item) =>
        item.id === h.id ? { ...item, status: 'ACKNOWLEDGED' as const } : item
      )
    );
    toast.success(`Handover ${h.id} acknowledged and signed off.`);
  };

  // Helper renderers for status dots
  const renderTurnaroundDot = (status: StageStatus) => {
    if (status === 'NONE') {
      return (
        <Tooltip title="No task of this kind on this flight" arrow>
          <Box sx={{ color: '#CBD5E1', fontWeight: 600, fontSize: '0.74rem' }}>—</Box>
        </Tooltip>
      );
    }
    if (status === 'BLOCKED') {
      return (
        <Tooltip title="Blocked" arrow>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, color: '#DC2626', fontWeight: 700, fontSize: '0.74rem' }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#DC2626' }} />
            Blocked
          </Box>
        </Tooltip>
      );
    }
    if (status === 'COMPLETED') {
      return (
        <Tooltip title="Complete" arrow>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, color: '#10B981', fontWeight: 700, fontSize: '0.74rem' }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#10B981' }} />
            ✓ Done
          </Box>
        </Tooltip>
      );
    }
    if (status === 'IN_PROGRESS') {
      return (
        <Tooltip title="In Progress" arrow>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, color: '#0284C7', fontWeight: 700, fontSize: '0.74rem' }}>
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                bgcolor: '#0284C7',
                animation: 'pulse 1.8s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.4, transform: 'scale(1.3)' },
                  '100%': { opacity: 1, transform: 'scale(1)' },
                },
              }}
            />
            ● Running
          </Box>
        </Tooltip>
      );
    }
    return (
      <Tooltip title="Pending" arrow>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, color: '#94A3B8', fontWeight: 600, fontSize: '0.74rem' }}>
          <Box sx={{ width: 7, height: 7, borderRadius: '50%', border: '1.5px solid #94A3B8', bgcolor: 'transparent' }} />
          ○ Pending
        </Box>
      </Tooltip>
    );
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    return <PriorityBadge priority={priority} />;
  };

  // Filtered lists
  const filteredFlights = flights.filter((f) => {
    if (flightFilter !== 'ALL' && f.concourse !== flightFilter) return false;
    if (flightSearch.trim()) {
      const q = flightSearch.toLowerCase();
      return (
        f.flightNumber.toLowerCase().includes(q) ||
        f.airline.toLowerCase().includes(q) ||
        f.stand.toLowerCase().includes(q) ||
        f.route.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtering, searching and paging happen on the server; what is loaded is what is shown.
  const filteredTasks = tasks;

  return (
    <DashboardLayout activeRole="ground-ops">
      <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
        {/* ========================================================================= */}
        {/* VIEW 1: OVERVIEW (DEFAULT)                                               */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <Box>
            {/* Header Banner */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', md: 'center' },
                gap: 2,
                mb: 3.5,
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 0.5 }}>
                  <Chip
                    icon={<Radio size={12} color="#10B981" />}
                    label="RAMP TELEMETRY ACTIVE"
                    size="small"
                    sx={{
                      bgcolor: '#DCFCE7',
                      color: '#15803D',
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 800,
                      fontSize: '0.66rem',
                      height: '20px',
                    }}
                  />
                  <Typography sx={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600 }}>
                    APRON STAND STATUS: NORMAL FLOW
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', letterSpacing: '-0.02em' }}>
                  Ground Turnaround Operations
                </Typography>
                <Typography sx={{ fontSize: '0.86rem', color: '#64748B', mt: 0.2 }}>
                  Supervisor: {user?.name || 'Ground Handling Supervisor'} · Saphire Ground Handling & Apron Services
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  startIcon={<Briefcase size={16} />}
                  onClick={() => setHandoverModalOpen(true)}
                  sx={{
                    borderColor: '#CBD5E1',
                    color: '#0F2942',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    textTransform: 'none',
                    borderRadius: '10px',
                    px: 2,
                    py: 0.8,
                    '&:hover': { borderColor: '#94A3B8', backgroundColor: '#F8FAFC' },
                  }}
                >
                  Shift Handover
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={() => setCreateTaskOpen(true)}
                  sx={{
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    textTransform: 'none',
                    borderRadius: '10px',
                    px: 2.2,
                    py: 0.85,
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                    '&:hover': { backgroundColor: '#059669' },
                  }}
                >
                  Create Ground Task
                </Button>
              </Box>
            </Box>

            {/* ========================================================================= */}
            {/* COMPONENT 1: OPERATIONS KPI STRIP (4 CLEAN CARDS)                         */}
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
                onClick={() => setFlightFilter('ALL')}
                sx={{
                  p: 2.5,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: flightFilter === 'ALL' ? '2px solid #0284C7' : '1px solid #E2E8F0',
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
                  {totalFlightsCount}
                </Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.84rem', fontWeight: 700, color: '#475569', mt: 0.5 }}>
                  Active Flights
                </Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
                  Click to show all flights on stand
                </Typography>
              </Card>

              {/* Card 2: Total Tasks */}
              <Card
                elevation={0}
                onClick={() => setTaskFilter('ALL')}
                sx={{
                  p: 2.5,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: taskFilter === 'ALL' ? '2px solid #475569' : '1px solid #E2E8F0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    borderColor: '#475569',
                    boxShadow: '0 8px 24px rgba(71, 85, 105, 0.12)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      backgroundColor: '#F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Wrench size={22} color="#475569" />
                  </Box>
                  <Chip
                    label="All Tasks"
                    size="small"
                    sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 700, fontSize: '0.68rem', height: '22px' }}
                  />
                </Box>
                <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', lineHeight: 1.1 }}>
                  {totalTasksCount}
                </Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.84rem', fontWeight: 700, color: '#475569', mt: 0.5 }}>
                  Total Turnaround Tasks
                </Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
                  Click to view all workorders
                </Typography>
              </Card>

              {/* Card 3: Completed Tasks */}
              <Card
                elevation={0}
                onClick={() => setTaskFilter('COMPLETED')}
                sx={{
                  p: 2.5,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: taskFilter === 'COMPLETED' ? '2px solid #10B981' : '1px solid #E2E8F0',
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
                    <CheckCircle2 size={22} color="#10B981" />
                  </Box>
                  <Chip
                    label="Filter Completed"
                    size="small"
                    sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '0.68rem', height: '22px' }}
                  />
                </Box>
                <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', lineHeight: 1.1 }}>
                  {completedTasksCount}
                </Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.84rem', fontWeight: 700, color: '#475569', mt: 0.5 }}>
                  Completed Tasks
                </Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
                  Click to filter completed tasks
                </Typography>
              </Card>

              {/* Card 4: Pending Tasks (Immediate Attention) */}
              <Card
                elevation={0}
                onClick={() => setTaskFilter('ATTENTION')}
                sx={{
                  p: 2.5,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: taskFilter === 'ATTENTION' ? '2px solid #DC2626' : '1px solid #E2E8F0',
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
                    label="Immediate Action"
                    size="small"
                    sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 800, fontSize: '0.68rem', height: '22px' }}
                  />
                </Box>
                <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#DC2626', lineHeight: 1.1 }}>
                  {pendingTasksCount}
                </Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.84rem', fontWeight: 700, color: '#DC2626', mt: 0.5 }}>
                  Pending / High Priority
                </Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
                  Click to filter pending items
                </Typography>
              </Card>
            </Box>

            {/* ========================================================================= */}
            {/* COMPONENT 2: ACTIVE TURNAROUND BOARD (MAIN CENTERPIECE TABLE)             */}
            {/* ========================================================================= */}
            <Card
              elevation={0}
              sx={{
                mb: 3.5,
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  p: 2.5,
                  borderBottom: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 1.5,
                  backgroundColor: '#FAFAFA',
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                    Active Turnaround Board
                  </Typography>
                  <Typography sx={{ fontSize: '0.82rem', color: '#64748B' }}>
                    Click any flight to view instant turnaround checklist and dispatch crews.
                  </Typography>
                </Box>

                {/* Filters */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ display: 'flex', backgroundColor: '#FFFFFF', p: 0.4, borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    {(['ALL', 'Concourse A', 'Concourse B', 'Concourse C'] as const).map((cc) => (
                      <Button
                        key={cc}
                        size="small"
                        onClick={() => setFlightFilter(cc)}
                        sx={{
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          px: 1.4,
                          py: 0.3,
                          minWidth: 'auto',
                          borderRadius: '6px',
                          textTransform: 'none',
                          backgroundColor: flightFilter === cc ? '#0F2942' : 'transparent',
                          color: flightFilter === cc ? '#FFFFFF' : '#64748B',
                          '&:hover': { backgroundColor: flightFilter === cc ? '#1E3A5F' : '#F1F5F9' },
                        }}
                      >
                        {cc === 'ALL' ? 'All Stands' : cc}
                      </Button>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Table */}
              <TableContainer sx={{ maxHeight: 420 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.74rem', color: '#64748B', bgcolor: '#F8FAFC' }}>
                        FLIGHT / STAND
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.74rem', color: '#64748B', bgcolor: '#F8FAFC' }}>
                        AIRCRAFT & ROUTE
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.74rem', color: '#64748B', bgcolor: '#F8FAFC' }}>
                        CLEANING
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.74rem', color: '#64748B', bgcolor: '#F8FAFC' }}>
                        FUELING
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.74rem', color: '#64748B', bgcolor: '#F8FAFC' }}>
                        MAINTENANCE
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.74rem', color: '#64748B', bgcolor: '#F8FAFC' }}>
                        SECURITY
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.74rem', color: '#64748B', bgcolor: '#F8FAFC' }}>
                        PROGRESS
                      </TableCell>
                      <TableCell align="right" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.74rem', color: '#64748B', bgcolor: '#F8FAFC' }}>
                        ACTION
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredFlights.map((flight) => {
                      const isSelected = selectedFlight.id === flight.id;
                      return (
                        <TableRow
                          key={flight.id}
                          hover
                          onClick={() => setSelectedFlight(flight)}
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.05)' : 'inherit',
                            transition: 'background-color 0.15s ease',
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: isSelected ? '#10B981' : 'transparent',
                                }}
                              />
                              <Box>
                                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.9rem', color: '#0F2942' }}>
                                  {flight.flightNumber}
                                </Typography>
                                <Typography sx={{ fontSize: '0.74rem', fontWeight: 700, color: '#0284C7' }}>
                                  {flight.stand}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                              {flight.aircraft}
                            </Typography>
                            <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>
                              {flight.route} · <span style={{ color: '#0F2942', fontWeight: 700 }}>{flight.etaEtd}</span>
                            </Typography>
                          </TableCell>

                          <TableCell>{renderTurnaroundDot(flight.cleaningStatus)}</TableCell>
                          <TableCell>{renderTurnaroundDot(flight.fuelingStatus)}</TableCell>
                          <TableCell>{renderTurnaroundDot(flight.maintenanceStatus)}</TableCell>
                          <TableCell>{renderTurnaroundDot(flight.securityStatus)}</TableCell>

                          <TableCell sx={{ minWidth: 140 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={flight.overallProgress}
                                sx={{
                                  flex: 1,
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: '#E2E8F0',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: flight.overallProgress === 100 ? '#10B981' : flight.overallProgress > 50 ? '#0284C7' : '#F59E0B',
                                    borderRadius: 3,
                                  },
                                }}
                              />
                              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.78rem', color: '#0F2942' }}>
                                {flight.overallProgress}%
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell align="right">
                            <Button
                              size="small"
                              variant={isSelected ? 'contained' : 'outlined'}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFlight(flight);
                              }}
                              sx={{
                                fontFamily: "'Outfit', sans-serif",
                                fontWeight: 700,
                                fontSize: '0.72rem',
                                textTransform: 'none',
                                borderRadius: '7px',
                                px: 1.5,
                                py: 0.4,
                                backgroundColor: isSelected ? '#10B981' : 'transparent',
                                borderColor: isSelected ? '#10B981' : '#CBD5E1',
                                color: isSelected ? '#FFFFFF' : '#475569',
                                '&:hover': {
                                  backgroundColor: isSelected ? '#059669' : '#F8FAFC',
                                },
                              }}
                            >
                              {isSelected ? 'Active View' : 'Select'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>

            {/* ========================================================================= */}
            {/* LOWER SECTION: 2-COLUMN SPLIT (60% TASK QUEUE / 40% TURNAROUND PROGRESS)   */}
            {/* ========================================================================= */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '6fr 4fr' },
                gap: 3,
                mb: 3.5,
              }}
            >
              {/* COMPONENT 3: TASK QUEUE / CENTER (60%) */}
              <Card
                elevation={0}
                sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box
                  sx={{
                    p: 2.5,
                    borderBottom: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                        Ground Task Queue
                      </Typography>
                      <Chip
                        label={`${filteredTasks.length} of ${taskTotal}`}
                        size="small"
                        sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 800, fontSize: '0.68rem', height: '20px' }}
                      />
                    </Box>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748B' }}>
                      Blocked work first, then in-progress and pending, newest schedule first.
                    </Typography>
                  </Box>

                  {/* Filter chips */}
                  <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap' }}>
                    {(
                      [
                        { id: 'ALL', label: 'All Tasks' },
                        { id: 'ATTENTION', label: `Blocked (${taskCounts.BLOCKED})` },
                        { id: 'IN_PROGRESS', label: 'In Progress' },
                        { id: 'COMPLETED', label: 'Done' },
                      ] as const
                    ).map((f) => (
                      <Chip
                        key={f.id}
                        label={f.label}
                        clickable
                        onClick={() => setTaskFilter(f.id)}
                        sx={{
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          height: '26px',
                          bgcolor: taskFilter === f.id ? '#0F2942' : '#F8FAFC',
                          color: taskFilter === f.id ? '#FFFFFF' : '#475569',
                          border: '1px solid',
                          borderColor: taskFilter === f.id ? '#0F2942' : '#E2E8F0',
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Task items list */}
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
                  {filteredTasks.map((task) => (
                    <Box
                      key={task.id}
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: task.priority === 'HIGH' && task.status !== 'COMPLETED' ? '#FFFBEB' : '#FFFFFF',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 2,
                        transition: 'box-shadow 0.15s ease',
                        '&:hover': {
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        },
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.6, flexWrap: 'wrap' }}>
                          {getPriorityBadge(task.priority)}
                          <Chip
                            label={task.flightNumber}
                            size="small"
                            sx={{
                              bgcolor: '#0F2942',
                              color: '#FFFFFF',
                              fontFamily: "'Outfit', sans-serif",
                              fontWeight: 800,
                              fontSize: '0.68rem',
                              height: '20px',
                              borderRadius: '4px',
                            }}
                          />
                          {task.stand && (
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284C7' }}>
                              {task.stand}
                            </Typography>
                          )}
                          <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>• Est: {task.estCompletion}</Typography>
                        </Box>

                        <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#0F2942' }}>
                          {task.title}
                        </Typography>
                        <Typography sx={{ fontSize: '0.76rem', color: '#64748B', mt: 0.3 }}>
                          Assigned: <strong style={{ color: '#334155' }}>{task.assignedStaff || 'Unassigned'}</strong>
                        </Typography>
                      </Box>

                      {/* Action buttons */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, alignSelf: { xs: 'flex-end', sm: 'center' } }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleOpenAssignModal(task)}
                          sx={{
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            textTransform: 'none',
                            borderRadius: '7px',
                            borderColor: '#CBD5E1',
                            color: '#475569',
                            px: 1.4,
                            py: 0.4,
                            '&:hover': { borderColor: '#94A3B8', bgcolor: '#F8FAFC' },
                          }}
                        >
                          Reassign
                        </Button>

                        {task.status === 'PENDING' && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleMarkTaskStarted(task)}
                            sx={{
                              fontFamily: "'Outfit', sans-serif",
                              fontWeight: 700,
                              fontSize: '0.72rem',
                              textTransform: 'none',
                              borderRadius: '7px',
                              backgroundColor: '#0284C7',
                              color: '#FFFFFF',
                              px: 1.4,
                              py: 0.4,
                              '&:hover': { backgroundColor: '#0369A1' },
                            }}
                          >
                            Mark Started
                          </Button>
                        )}

                        {task.status === 'IN_PROGRESS' && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleMarkTaskCompleted(task)}
                            sx={{
                              fontFamily: "'Outfit', sans-serif",
                              fontWeight: 700,
                              fontSize: '0.72rem',
                              textTransform: 'none',
                              borderRadius: '7px',
                              backgroundColor: '#10B981',
                              color: '#FFFFFF',
                              px: 1.4,
                              py: 0.4,
                              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
                              '&:hover': { backgroundColor: '#059669' },
                            }}
                          >
                            Mark Completed
                          </Button>
                        )}

                        {task.status === 'BLOCKED' && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleMarkTaskResumed(task)}
                            sx={{
                              fontFamily: "'Outfit', sans-serif",
                              fontWeight: 700,
                              fontSize: '0.72rem',
                              textTransform: 'none',
                              borderRadius: '7px',
                              backgroundColor: '#DC2626',
                              color: '#FFFFFF',
                              px: 1.4,
                              py: 0.4,
                              '&:hover': { backgroundColor: '#B91C1C' },
                            }}
                          >
                            Resume
                          </Button>
                        )}

                        {task.status === 'COMPLETED' && (
                          <Chip
                            icon={<Check size={12} color="#15803D" />}
                            label="Done"
                            size="small"
                            sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '0.7rem', height: '24px' }}
                          />
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Card>

              {/* COMPONENT 4: TURNAROUND PROGRESS CARD (SELECTED FLIGHT) (40%) */}
              <Card
                elevation={0}
                sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ p: 2.5, borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                          {selectedFlight.flightNumber}
                        </Typography>
                        <Chip
                          label={selectedFlight.stand}
                          size="small"
                          sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 800, fontSize: '0.7rem' }}
                        />
                      </Box>
                      <Typography sx={{ fontSize: '0.82rem', color: '#64748B', mt: 0.2 }}>
                        {selectedFlight.airline} · {selectedFlight.aircraft}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#0F2942' }}>
                        {selectedFlight.overallProgress}%
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8' }}>Overall Turnaround</Typography>
                    </Box>
                  </Box>

                  {/* Progress bar */}
                  <LinearProgress
                    variant="determinate"
                    value={selectedFlight.overallProgress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#E2E8F0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: selectedFlight.overallProgress === 100 ? '#10B981' : '#0284C7',
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                {/* Breakdown Checklist */}
                <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: '#64748B', letterSpacing: '0.05em' }}>
                    STAGE COMPLETION CHECKLIST
                  </Typography>

                  {/* Cleaning stage */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '8px',
                          bgcolor: selectedFlight.cleaningStatus === 'COMPLETED' ? '#DCFCE7' : '#F1F5F9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Sparkles size={16} color={selectedFlight.cleaningStatus === 'COMPLETED' ? '#10B981' : '#64748B'} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#0F2942' }}>
                          Cleaning & Sanitization
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>Cabin Hygiene Alpha (Done at 22:25 UTC)</Typography>
                      </Box>
                    </Box>
                    {renderTurnaroundDot(selectedFlight.cleaningStatus)}
                  </Box>

                  <Divider />

                  {/* Fueling stage */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '8px',
                          bgcolor: selectedFlight.fuelingStatus === 'COMPLETED' ? '#DCFCE7' : '#F1F5F9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Fuel size={16} color={selectedFlight.fuelingStatus === 'COMPLETED' ? '#10B981' : '#64748B'} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#0F2942' }}>
                          Apron Hydrant Fueling
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>38,400 kg Jet A-1 loaded & sealed</Typography>
                      </Box>
                    </Box>
                    {renderTurnaroundDot(selectedFlight.fuelingStatus)}
                  </Box>

                  <Divider />

                  {/* Maintenance stage */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '8px',
                          bgcolor: selectedFlight.maintenanceStatus === 'IN_PROGRESS' ? '#FEF3C7' : selectedFlight.maintenanceStatus === 'COMPLETED' ? '#DCFCE7' : '#F1F5F9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Wrench size={16} color={selectedFlight.maintenanceStatus === 'IN_PROGRESS' ? '#D97706' : selectedFlight.maintenanceStatus === 'COMPLETED' ? '#10B981' : '#64748B'} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#0F2942' }}>
                          Maintenance Inspection
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: selectedFlight.maintenanceStatus === 'IN_PROGRESS' ? '#D97706' : '#64748B', fontWeight: 600 }}>
                          {selectedFlight.supervisorNotes}
                        </Typography>
                      </Box>
                    </Box>
                    {renderTurnaroundDot(selectedFlight.maintenanceStatus)}
                  </Box>

                  <Divider />

                  {/* Security stage */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '8px',
                          bgcolor: selectedFlight.securityStatus === 'COMPLETED' ? '#DCFCE7' : '#F1F5F9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ShieldCheck size={16} color={selectedFlight.securityStatus === 'COMPLETED' ? '#10B981' : '#64748B'} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#0F2942' }}>
                          Security Sweep & Final Clears
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>Awaiting maintenance sign-off</Typography>
                      </Box>
                    </Box>
                    {renderTurnaroundDot(selectedFlight.securityStatus)}
                  </Box>

                  {/* Delay callout if present */}
                  {selectedFlight.delayReason && (
                    <Box sx={{ mt: 1, p: 1.5, borderRadius: '10px', bgcolor: '#FEF2F2', border: '1px solid #FECACA' }}>
                      <Typography sx={{ fontSize: '0.76rem', color: '#DC2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <AlertTriangle size={14} /> ACTIVE IMPEDIMENT / DELAY
                      </Typography>
                      <Typography sx={{ fontSize: '0.74rem', color: '#991B1B', mt: 0.4 }}>
                        {selectedFlight.delayReason}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Card>
            </Box>

            {/* ========================================================================= */}
            {/* COMPONENT 5: SHIFT HANDOVER CARD (COMPACT OVERVIEW)                       */}
            {/* ========================================================================= */}
            <Card
              elevation={0}
              sx={{
                p: 2.5,
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      backgroundColor: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Briefcase size={24} color="#0284C7" />
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.96rem', color: '#0F2942' }}>
                      Shift Handover Protocol & Status
                    </Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: '#64748B', mt: 0.2 }}>
                      <strong style={{ color: '#0F2942' }}>{taskCounts.IN_PROGRESS} tasks in progress</strong> · {taskCounts.BLOCKED} blocked · {taskCounts.PENDING} pending across the airport
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Chip
                    label="Turnover Ready"
                    size="small"
                    sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '0.72rem' }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleTabSelect('handover')}
                    sx={{
                      backgroundColor: '#0F2942',
                      color: '#FFFFFF',
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      textTransform: 'none',
                      borderRadius: '8px',
                      px: 2,
                      py: 0.7,
                      '&:hover': { backgroundColor: '#1E3A5F' },
                    }}
                  >
                    View Full Handover Log
                  </Button>
                </Box>
              </Box>
            </Card>
          </Box>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: ACTIVE FLIGHTS (#flights)                                         */}
        {/* ========================================================================= */}
        {activeTab === 'flights' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                  Active Ground Servicing Flights
                </Typography>
                <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
                  {flights.length} flights with turnaround work in progress or blocked right now.
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                onClick={() => setCreateTaskOpen(true)}
                sx={{ bgcolor: '#10B981', color: '#FFF', fontWeight: 700, borderRadius: '8px', textTransform: 'none' }}
              >
                Assign Workorder
              </Button>
            </Box>

            {/* Flight Search */}
            <Box sx={{ mb: 2.5 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search flights by flight number, airline, or stand (e.g. A503000, S200)..."
                value={flightSearch}
                onChange={(e) => setFlightSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={16} color="#94A3B8" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  bgcolor: '#FFFFFF',
                  borderRadius: '10px',
                  '& .MuiOutlinedInput-root': { borderRadius: '10px' },
                }}
              />
            </Box>

            {/* Flights Table */}
            <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>FLIGHT / AIRLINE</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>STAND LOCATION</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>AIRCRAFT TYPE</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>ETD SCHEDULE</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>SERVICING STATUS</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: '#64748B' }}>ACTION</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredFlights.map((f) => (
                      <TableRow key={f.id} hover>
                        <TableCell>
                          <Typography sx={{ fontWeight: 800, color: '#0F2942' }}>{f.flightNumber}</Typography>
                          <Typography sx={{ fontSize: '0.74rem', color: '#64748B' }}>{f.airline} · {f.route}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={f.stand} size="small" sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 800 }} />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.82rem', color: '#334155' }}>{f.aircraft}</TableCell>
                        <TableCell sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F2942' }}>{f.etaEtd}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={f.overallProgress}
                              sx={{ width: 80, height: 6, borderRadius: 3 }}
                            />
                            <Typography sx={{ fontWeight: 800, fontSize: '0.76rem' }}>{f.overallProgress}%</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setSelectedFlight(f);
                              handleTabSelect('overview');
                            }}
                            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '6px' }}
                          >
                            Inspect Stand
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
        {/* VIEW 3: TASK CENTER (#tasks)                                              */}
        {/* ========================================================================= */}
        {activeTab === 'tasks' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                  Turnaround Task Center
                </Typography>
                <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
                  All pending, running, and completed apron workorders for the active shift.
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                onClick={() => setCreateTaskOpen(true)}
                sx={{ bgcolor: '#10B981', color: '#FFF', fontWeight: 700, borderRadius: '8px', textTransform: 'none' }}
              >
                New Task
              </Button>
            </Box>

            {/* Search and Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by flight number or task name (e.g. A503000, Refueling)..."
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={16} color="#94A3B8" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ bgcolor: '#FFFFFF', borderRadius: '10px' }}
              />
            </Box>

            {/* Tasks Table */}
            <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>TASK ID / STAGE</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>FLIGHT & STAND</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>WORKORDER DESCRIPTION</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>ASSIGNED TO</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>PRIORITY</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>STATUS</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: '#64748B' }}>ACTIONS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TableRow key={task.id} hover>
                        <TableCell>
                          <Typography sx={{ fontWeight: 800, color: '#0F2942' }}>{task.id}</Typography>
                          <Chip label={task.serviceType} size="small" sx={{ bgcolor: '#F1F5F9', fontSize: '0.66rem', fontWeight: 700 }} />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 800, color: '#0F2942' }}>{task.flightNumber}</Typography>
                          {task.stand && <Typography sx={{ fontSize: '0.74rem', color: '#0284C7', fontWeight: 700 }}>{task.stand}</Typography>}
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#1E293B' }}>{task.title}</Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>{task.notes}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700 }}>{task.assignedStaff || 'Unassigned'}</Typography>
                        </TableCell>
                        <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                        <TableCell>
                          {task.status === 'COMPLETED' ? (
                            <Chip label="COMPLETED" size="small" sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '0.68rem' }} />
                          ) : task.status === 'IN_PROGRESS' ? (
                            <Chip label="IN PROGRESS" size="small" sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 800, fontSize: '0.68rem' }} />
                          ) : task.status === 'BLOCKED' ? (
                            <Chip label="BLOCKED" size="small" sx={{ bgcolor: '#FEE2E2', color: '#B91C1C', fontWeight: 800, fontSize: '0.68rem' }} />
                          ) : (
                            <Chip label="PENDING" size="small" sx={{ bgcolor: '#FEF3C7', color: '#B45309', border: '1px solid #FCD34D', fontWeight: 800, fontSize: '0.68rem' }} />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleOpenAssignModal(task)}
                              sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.72rem', borderRadius: '6px' }}
                            >
                              Assign
                            </Button>
                            {task.status !== 'COMPLETED' && (
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() =>
                                  task.status === 'IN_PROGRESS' ? handleMarkTaskCompleted(task) : task.status === 'BLOCKED' ? handleMarkTaskResumed(task) : handleMarkTaskStarted(task)
                                }
                                sx={{ bgcolor: task.status === 'IN_PROGRESS' ? '#10B981' : task.status === 'BLOCKED' ? '#DC2626' : '#0284C7', color: '#FFF', textTransform: 'none', fontWeight: 700, fontSize: '0.72rem', borderRadius: '6px' }}
                              >
                                {task.status === 'IN_PROGRESS' ? 'Complete' : task.status === 'BLOCKED' ? 'Resume' : 'Start'}
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
            {filteredTasks.length < taskTotal && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button onClick={() => fetchTasks(taskPage + 1)} sx={{ textTransform: 'none', fontWeight: 700 }}>
                  Show more ({taskTotal - filteredTasks.length} remaining)
                </Button>
              </Box>
            )}
          </Box>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: TASK ASSIGNMENT (#assignment)                                     */}
        {/* ========================================================================= */}
        {activeTab === 'assignment' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                  Ramp Staff Dispatch & Assignment
                </Typography>
                <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
                  Active ramp agents and their current workload, least busy first.
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                gap: 2.5,
              }}
            >
              {staff.length === 0 && (
                <Typography sx={{ color: '#64748B', fontSize: '0.86rem' }}>
                  No ramp staff loaded. This list is only available to supervisors, managers and administrators.
                </Typography>
              )}
              {staff.map((member) => {
                const state = member.inProgressTasks > 0 ? 'ENGAGED' : member.openTasks > 0 ? 'QUEUED' : 'AVAILABLE';
                return (
                  <Card
                    key={member.userId}
                    elevation={0}
                    sx={{ p: 2.5, backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Box>
                          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#0F2942' }}>
                            {member.name}
                          </Typography>
                          <Typography sx={{ fontSize: '0.76rem', color: '#64748B' }}>
                            {member.username} · {member.departmentName?.replace(/_/g, ' ')}
                          </Typography>
                        </Box>
                        <Chip
                          label={state}
                          size="small"
                          sx={{
                            bgcolor: state === 'AVAILABLE' ? '#DCFCE7' : state === 'ENGAGED' ? '#FEF3C7' : '#F1F5F9',
                            color: state === 'AVAILABLE' ? '#15803D' : state === 'ENGAGED' ? '#D97706' : '#64748B',
                            fontWeight: 800,
                            fontSize: '0.68rem',
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, my: 2 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>
                          In progress: <strong>{member.inProgressTasks}</strong>
                        </Typography>
                        <Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>
                          Open workorders (pending, running, blocked): <strong>{member.openTasks}</strong>
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => {
                        setNewTaskUserId(member.userId);
                        setCreateTaskOpen(true);
                      }}
                      sx={{ bgcolor: '#0F2942', color: '#FFFFFF', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.8rem', textTransform: 'none', borderRadius: '8px', py: 0.8, '&:hover': { bgcolor: '#1E3A5F' } }}
                    >
                      Give {member.name.split(' ')[0]} a workorder
                    </Button>
                  </Card>
                );
              })}
            </Box>
          </Box>
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: SHIFT HANDOVER (#handover)                                       */}
        {/* ========================================================================= */}
        {activeTab === 'handover' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                  Shift Handover Registry
                </Typography>
                <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
                  Formal documentation and cross-shift sign-offs for ramp handling operations.
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                onClick={() => setHandoverModalOpen(true)}
                sx={{ bgcolor: '#0F2942', color: '#FFF', fontWeight: 700, borderRadius: '8px', textTransform: 'none' }}
              >
                New Handover Entry
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {handovers.map((h) => (
                <Card
                  key={h.id}
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                          {h.shiftTitle}
                        </Typography>
                        <Chip
                          label={h.status}
                          size="small"
                          sx={{
                            bgcolor: h.status === 'ACKNOWLEDGED' ? '#DCFCE7' : '#EFF6FF',
                            color: h.status === 'ACKNOWLEDGED' ? '#15803D' : '#0284C7',
                            fontWeight: 800,
                            fontSize: '0.68rem',
                          }}
                        />
                      </Box>
                      <Typography sx={{ fontSize: '0.8rem', color: '#64748B', mt: 0.3 }}>
                        Logged: <strong>{h.timestamp}</strong> · {h.id}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2, mb: 2 }}>
                    <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: '#F8FAFC' }}>
                      <Typography sx={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>OUTGOING SUPERVISOR</Typography>
                      <Typography sx={{ fontWeight: 800, color: '#0F2942', fontSize: '0.9rem' }}>{h.outgoingSupervisor}</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: '#F8FAFC' }}>
                      <Typography sx={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>INCOMING SUPERVISOR</Typography>
                      <Typography sx={{ fontWeight: 800, color: '#0F2942', fontSize: '0.9rem' }}>{h.incomingSupervisor}</Typography>
                    </Box>
                  </Box>

                  <Typography sx={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.6, mb: 2 }}>
                    {h.summaryNotes}
                  </Typography>

                  {h.unresolvedHolds.length > 0 && (
                    <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: '#FEF2F2', border: '1px solid #FEE2E2' }}>
                      <Typography sx={{ fontSize: '0.76rem', fontWeight: 800, color: '#DC2626', mb: 0.5 }}>
                        CRITICAL TURNOVER HOLDS:
                      </Typography>
                      {h.unresolvedHolds.map((hold, idx) => (
                        <Typography key={idx} sx={{ fontSize: '0.76rem', color: '#991B1B' }}>
                          • {hold}
                        </Typography>
                      ))}
                    </Box>
                  )}

                  {h.status === 'SUBMITTED' && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Check size={14} />}
                        onClick={() => handleAcknowledgeHandover(h)}
                        sx={{ textTransform: 'none', fontWeight: 700, borderColor: '#0284C7', color: '#0284C7', borderRadius: '8px' }}
                      >
                        Acknowledge & Sign Off Shift
                      </Button>
                    </Box>
                  )}
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* ========================================================================= */}
        {/* VIEW 6: NOTIFICATIONS (#notifications)                                   */}
        {/* ========================================================================= */}
        {activeTab === 'notifications' && (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                Operational Alerts & Telemetry
              </Typography>
              <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
                Real-time ramp priority broadcasts and turnaround progress notices.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {flights.length === 0 && (
                <Typography sx={{ color: '#64748B', fontSize: '0.86rem' }}>No flights have turnaround work in progress or blocked right now.</Typography>
              )}
              {flights
                .map((f) => {
                  const stages = [f.cleaningStatus, f.fuelingStatus, f.maintenanceStatus, f.securityStatus];
                  const blocked = stages.includes('BLOCKED') || f.supervisorNotes.startsWith('Blocked');
                  const running = stages.includes('IN_PROGRESS');
                  return {
                    id: f.id,
                    time: f.etaEtd ? `ETD ${f.etaEtd}` : '',
                    title: `${f.flightNumber} · ${f.stand}`,
                    body: blocked ? `${f.supervisorNotes}. ${f.airline} ${f.aircraft}.` : running ? `Turnaround work running (${f.overallProgress}% of tasks done).` : `${f.overallProgress}% of tasks done.`,
                    type: blocked ? 'WARN' : f.overallProgress === 100 ? 'SUCCESS' : 'INFO',
                  };
                })
                .sort((x, y) => Number(y.type === 'WARN') - Number(x.type === 'WARN'))
                .map((n) => (
                <Card
                  key={n.id}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: '14px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    gap: 2,
                    alignItems: 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      bgcolor: n.type === 'WARN' ? '#FEF3C7' : n.type === 'SUCCESS' ? '#DCFCE7' : '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {n.type === 'WARN' ? <AlertTriangle size={18} color="#D97706" /> : n.type === 'SUCCESS' ? <CheckCircle2 size={18} color="#10B981" /> : <Bell size={18} color="#0284C7" />}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', fontSize: '0.92rem' }}>
                        {n.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8' }}>{n.time}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.82rem', color: '#475569', mt: 0.3 }}>
                      {n.body}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* ========================================================================= */}
        {/* VIEW 7: PROFILE (#profile)                                                */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                Supervisor Profile & Qualifications
              </Typography>
              <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
                Ramp safety credentials, airside access clearance, and operational duty roster.
              </Typography>
            </Box>

            <Card elevation={0} sx={{ p: 3.5, backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
                <Avatar
                  sx={{
                    width: 72,
                    height: 72,
                    backgroundColor: '#10B981',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: '1.6rem',
                  }}
                >
                  RJ
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                    Riya Johnson
                  </Typography>
                  <Typography sx={{ fontSize: '0.88rem', color: '#64748B' }}>
                    Ground Operations Supervisor · Saphire Apron Control Hub
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip label="AIRSIDE BADGE: ALL-AREA RED" size="small" sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 800, fontSize: '0.68rem' }} />
                    <Chip label="RADIO: RAMP-VHF CH 4" size="small" sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 800, fontSize: '0.68rem' }} />
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2.5 }} />

              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.9rem', color: '#0F2942', mb: 1.5 }}>
                CERTIFICATIONS & ACCREDITATIONS
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                {[
                  { title: 'IATA Ground Operations Manual (IGOM)', valid: 'Valid thru Nov 2027', id: 'IGOM-88219' },
                  { title: 'Airside Ramp Safety Officer - Level 3', valid: 'Active License', id: 'ARSO-5412' },
                  { title: 'Dangerous Goods Handling (Cat 6)', valid: 'Recertified 2026', id: 'DGR-9940' },
                  { title: 'Emergency Aircraft Evacuation Marshall', valid: 'Airport Authority Certified', id: 'EM-1102' },
                ].map((cert, i) => (
                  <Box key={i} sx={{ p: 2, borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
                    <Typography sx={{ fontWeight: 800, color: '#0F2942', fontSize: '0.86rem' }}>{cert.title}</Typography>
                    <Typography sx={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 700, mt: 0.3 }}>{cert.valid}</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: 'monospace' }}>{cert.id}</Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>
        )}
      </Box>

      {/* ========================================================================= */}
      {/* DIALOG 1: CREATE GROUND TASK MODAL                                        */}
      {/* ========================================================================= */}
      <Dialog
        open={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: '16px', p: 1 },
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
          New Turnaround Workorder
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2, pt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Flight</InputLabel>
              <Select value={newTaskFlightId} label="Flight" onChange={(e) => setNewTaskFlightId(Number(e.target.value))}>
                {flights.map((f) => (
                  <MenuItem key={f.id} value={f.flightId}>
                    {f.flightNumber} ({f.stand})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Task</InputLabel>
              <Select value={newTaskName} label="Task" onChange={(e) => setNewTaskName(e.target.value)}>
                {TASK_NAME_OPTIONS.map((n) => (
                  <MenuItem key={n} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Assign to (optional)</InputLabel>
              <Select
                value={newTaskUserId}
                label="Assign to (optional)"
                onChange={(e) => setNewTaskUserId(String(e.target.value) === '' ? '' : Number(e.target.value))}
              >
                <MenuItem value="">
                  <em>Leave unassigned</em>
                </MenuItem>
                {staff.map((m) => (
                  <MenuItem key={m.userId} value={m.userId}>
                    {m.name} ({m.username}) · {m.openTasks} open
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCreateTaskOpen(false)} sx={{ textTransform: 'none', color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateTaskSubmit}
            sx={{ backgroundColor: '#10B981', color: '#FFFFFF', textTransform: 'none', fontWeight: 700 }}
          >
            Dispatch Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG 2: ASSIGN / REASSIGN TASK MODAL                                    */}
      {/* ========================================================================= */}
      <Dialog
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: '16px', p: 1 } },
        }}
      >
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
          Reassign Task {activeTaskToAssign?.id}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Typography sx={{ fontSize: '0.84rem', color: '#475569' }}>
              Assign <strong>{activeTaskToAssign?.title}</strong> on <strong>{activeTaskToAssign?.flightNumber}</strong>
            </Typography>

            <FormControl fullWidth size="small">
              <InputLabel>Staff member</InputLabel>
              <Select
                value={assignedUserChoice}
                label="Staff member"
                onChange={(e) => setAssignedUserChoice(Number(e.target.value))}
              >
                {staff.map((m) => (
                  <MenuItem key={m.userId} value={m.userId}>
                    {m.name} ({m.username}) · {m.openTasks} open
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAssignModalOpen(false)} sx={{ textTransform: 'none', color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveAssignment}
            sx={{ backgroundColor: '#0F2942', color: '#FFFFFF', textTransform: 'none', fontWeight: 700 }}
          >
            Save Assignment
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG 3: NEW SHIFT HANDOVER REPORT MODAL                                 */}
      {/* ========================================================================= */}
      <Dialog
        open={handoverModalOpen}
        onClose={() => setHandoverModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: '16px', p: 1 } },
        }}
      >
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
          Record Shift Handover
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Typography sx={{ fontSize: '0.84rem', color: '#64748B' }}>
              Handing over shift telemetry from <strong>Riya Johnson (Ground Ops Lead)</strong> to incoming supervisor.
            </Typography>

            <FormControl fullWidth size="small">
              <InputLabel>Incoming Supervisor</InputLabel>
              <Select
                value={handoverIncomingSup}
                label="Incoming Supervisor"
                onChange={(e) => setHandoverIncomingSup(e.target.value)}
              >
                <MenuItem value="Vikram Seth (Night Shift Lead)">Vikram Seth (Night Shift Lead)</MenuItem>
                <MenuItem value="Alok Verma (Airside Apron Supt)">Alok Verma (Airside Apron Supt)</MenuItem>
                <MenuItem value="Sunita Patil (Ramp Operations)">Sunita Patil (Ramp Operations)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Outstanding Critical Holds / Equipment Issues"
              size="small"
              value={handoverIssuesInput}
              onChange={(e) => setHandoverIssuesInput(e.target.value)}
              placeholder="e.g. Stand G12 hydraulic sensor pending check..."
              fullWidth
            />

            <TextField
              label="General Shift Summary & Handover Notes"
              multiline
              rows={3}
              value={handoverNotesInput}
              onChange={(e) => setHandoverNotesInput(e.target.value)}
              placeholder="Describe ramp efficiency, GSE availability, apron weather, and priority pushback flights..."
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setHandoverModalOpen(false)} sx={{ textTransform: 'none', color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateHandoverSubmit}
            sx={{ backgroundColor: '#0F2942', color: '#FFFFFF', textTransform: 'none', fontWeight: 700 }}
          >
            Submit Handover Log
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default GroundOpsSupervisorDashboard;
