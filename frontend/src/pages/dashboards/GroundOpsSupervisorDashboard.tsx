import React, { useState, useEffect } from 'react';
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

// Types
export type TaskStage = 'CLEANING' | 'FUELING' | 'MAINTENANCE' | 'SECURITY';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface GroundTurnaroundFlight {
  id: string;
  flightNumber: string;
  airline: string;
  aircraft: string;
  stand: string;
  concourse: 'T1' | 'T2';
  route: string;
  etaEtd: string;
  cleaningStatus: TaskStatus;
  fuelingStatus: TaskStatus;
  maintenanceStatus: TaskStatus;
  securityStatus: TaskStatus;
  overallProgress: number; // 0 - 100
  supervisorNotes: string;
  delayReason?: string;
}

export interface GroundTask {
  id: string;
  flightNumber: string;
  stand: string;
  serviceType: TaskStage;
  title: string;
  priority: TaskPriority;
  assignedCrew: string;
  assignedStaff: string;
  status: TaskStatus;
  estCompletion: string;
  notes: string;
}

export interface GroundCrew {
  id: string;
  name: string;
  department: string;
  lead: string;
  activeTasks: number;
  standLocation: string;
  status: 'AVAILABLE' | 'ENGAGED' | 'STANDBY';
  members: number;
}

export interface HandoverLog {
  id: string;
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

// Initial Data
const INITIAL_GROUND_FLIGHTS: GroundTurnaroundFlight[] = [
  {
    id: 'GF-203',
    flightNumber: 'AI-203',
    airline: 'Air India',
    aircraft: 'Boeing 787-8 Dreamliner',
    stand: 'Stand G12',
    concourse: 'T1',
    route: 'DEL → BOM',
    etaEtd: 'ETD 23:42 UTC',
    cleaningStatus: 'COMPLETED',
    fuelingStatus: 'COMPLETED',
    maintenanceStatus: 'IN_PROGRESS',
    securityStatus: 'PENDING',
    overallProgress: 75,
    supervisorNotes: 'Hydraulic sensor check on Stand G12 currently ongoing by Avionics Team.',
    delayReason: 'Line maintenance hydraulic fluid check (+12m)',
  },
  {
    id: 'GF-521',
    flightNumber: '6E-521',
    airline: 'IndiGo',
    aircraft: 'Airbus A321neo',
    stand: 'Stand G08',
    concourse: 'T1',
    route: 'BOM → BLR',
    etaEtd: 'ETD 23:33 UTC',
    cleaningStatus: 'COMPLETED',
    fuelingStatus: 'IN_PROGRESS',
    maintenanceStatus: 'COMPLETED',
    securityStatus: 'PENDING',
    overallProgress: 50,
    supervisorNotes: 'Apron tanker #3 currently dispensing 14,200 kg Jet A-1.',
    delayReason: 'ATC slot adjustment due to storm routing',
  },
  {
    id: 'GF-901',
    flightNumber: 'UK-901',
    airline: 'Vistara',
    aircraft: 'Airbus A320neo',
    stand: 'Stand G04',
    concourse: 'T1',
    route: 'BOM → DEL',
    etaEtd: 'ETD 23:05 UTC',
    cleaningStatus: 'COMPLETED',
    fuelingStatus: 'COMPLETED',
    maintenanceStatus: 'COMPLETED',
    securityStatus: 'COMPLETED',
    overallProgress: 100,
    supervisorNotes: 'Turnaround complete. Pushback tug connected. Stand clear.',
  },
  {
    id: 'GF-102',
    flightNumber: 'SPH-102',
    airline: 'Saphire Airways',
    aircraft: 'Airbus A350-900',
    stand: 'Stand G10',
    concourse: 'T1',
    route: 'SPH → LHR',
    etaEtd: 'ETD 23:45 UTC',
    cleaningStatus: 'COMPLETED',
    fuelingStatus: 'COMPLETED',
    maintenanceStatus: 'COMPLETED',
    securityStatus: 'IN_PROGRESS',
    overallProgress: 85,
    supervisorNotes: 'Passenger boarding group 3 in progress. Baggage hold hatches locked.',
  },
  {
    id: 'GF-204',
    flightNumber: 'SPH-204',
    airline: 'Saphire Airways',
    aircraft: 'Boeing 777-300ER',
    stand: 'Stand G01',
    concourse: 'T2',
    route: 'SPH → DXB',
    etaEtd: 'ETD 00:15 UTC',
    cleaningStatus: 'IN_PROGRESS',
    fuelingStatus: 'PENDING',
    maintenanceStatus: 'PENDING',
    securityStatus: 'PENDING',
    overallProgress: 25,
    supervisorNotes: 'Inbound offload finishing. Cabin cleaning crew Alpha boarding.',
  },
  {
    id: 'GF-809',
    flightNumber: 'SPH-809',
    airline: 'Saphire Airways',
    aircraft: 'Boeing 787-9',
    stand: 'Stand G14',
    concourse: 'T2',
    route: 'SPH → JFK',
    etaEtd: 'ETD 00:40 UTC',
    cleaningStatus: 'PENDING',
    fuelingStatus: 'PENDING',
    maintenanceStatus: 'IN_PROGRESS',
    securityStatus: 'PENDING',
    overallProgress: 20,
    supervisorNotes: 'Catering high-loader vehicle being swapped out on apron.',
    delayReason: 'Ground equipment mechanical interlock replacement',
  },
];

const INITIAL_GROUND_TASKS: GroundTask[] = [
  {
    id: 'TSK-101',
    flightNumber: 'AI-203',
    stand: 'Stand G12',
    serviceType: 'MAINTENANCE',
    title: 'Hydraulic reserve sensor inspection',
    priority: 'HIGH',
    assignedCrew: 'Avionics Pre-Flight Crew',
    assignedStaff: 'Ravi Sharma',
    status: 'IN_PROGRESS',
    estCompletion: '22:45 UTC',
    notes: 'Investigating standby sensor pressure telemetry before cabin door close.',
  },
  {
    id: 'TSK-102',
    flightNumber: 'SPH-809',
    stand: 'Stand G14',
    serviceType: 'MAINTENANCE',
    title: 'Catering lift truck replacement & apron check',
    priority: 'HIGH',
    assignedCrew: 'Ramp GSE Fleet Team',
    assignedStaff: 'Manoj Rao',
    status: 'IN_PROGRESS',
    estCompletion: '23:10 UTC',
    notes: 'Hydraulic scissor lock sensor faulted. Replacement tug en route from GSE bay.',
  },
  {
    id: 'TSK-103',
    flightNumber: '6E-521',
    stand: 'Stand G08',
    serviceType: 'FUELING',
    title: 'Apron pressure refueling (14,200 kg)',
    priority: 'MEDIUM',
    assignedCrew: 'Jet Fuel Unit #3',
    assignedStaff: 'Arjun Mehta',
    status: 'IN_PROGRESS',
    estCompletion: '23:30 UTC',
    notes: 'Fuel flow rate: 1,200 L/min via hydrant dispenser #4.',
  },
  {
    id: 'TSK-104',
    flightNumber: 'UK-901',
    stand: 'Stand G04',
    serviceType: 'CLEANING',
    title: 'Cabin deep cleaning & sanitary sterilization',
    priority: 'LOW',
    assignedCrew: 'Cabin Hygiene Alpha',
    assignedStaff: 'Sunita Patil',
    status: 'COMPLETED',
    estCompletion: '22:25 UTC',
    notes: 'Full cabin sweep completed. Galleys and lavatories sealed.',
  },
  {
    id: 'TSK-105',
    flightNumber: 'SPH-204',
    stand: 'Stand G01',
    serviceType: 'CLEANING',
    title: 'Long-haul turn cabin refresh & bedding replacement',
    priority: 'MEDIUM',
    assignedCrew: 'Cabin Hygiene Alpha',
    assignedStaff: 'Unassigned',
    status: 'PENDING',
    estCompletion: '23:45 UTC',
    notes: 'Awaiting completion of passenger offload before team enters aircraft.',
  },
  {
    id: 'TSK-106',
    flightNumber: 'SPH-102',
    stand: 'Stand G10',
    serviceType: 'SECURITY',
    title: 'Pre-departure airside security sweep & K9 sweep',
    priority: 'MEDIUM',
    assignedCrew: 'Canine & Airside Security',
    assignedStaff: 'Inspector Farooq',
    status: 'IN_PROGRESS',
    estCompletion: '23:25 UTC',
    notes: 'Overhead bin and forward cargo hold security verification.',
  },
];

const INITIAL_GROUND_CREWS: GroundCrew[] = [
  { id: 'CRW-1', name: 'Cabin Hygiene Alpha', department: 'Cleaning & Hospitality', lead: 'Sunita Patil', activeTasks: 2, standLocation: 'Stand G01', status: 'ENGAGED', members: 12 },
  { id: 'CRW-2', name: 'Jet Fuel Unit #3', department: 'Hydrant & Refueling', lead: 'Arjun Mehta', activeTasks: 1, standLocation: 'Stand G08', status: 'ENGAGED', members: 4 },
  { id: 'CRW-3', name: 'Avionics Pre-Flight Crew', department: 'Engineering & Line Tech', lead: 'Ravi Sharma', activeTasks: 1, standLocation: 'Stand G12', status: 'ENGAGED', members: 5 },
  { id: 'CRW-4', name: 'Canine & Airside Security', department: 'Airside Security', lead: 'Insp. Farooq', activeTasks: 1, standLocation: 'Stand G10', status: 'ENGAGED', members: 6 },
  { id: 'CRW-5', name: 'Ramp Cargo Team Delta', department: 'Baggage & Cargo Ramp', lead: 'Kiran Reddy', activeTasks: 0, standLocation: 'Apron Hub Central', status: 'AVAILABLE', members: 14 },
  { id: 'CRW-6', name: 'Ramp GSE Fleet Team', department: 'Ground Equipment & Tugs', lead: 'Manoj Rao', activeTasks: 1, standLocation: 'Stand G14', status: 'ENGAGED', members: 8 },
];

const INITIAL_HANDOVERS: HandoverLog[] = [
  {
    id: 'HND-401',
    shiftTitle: 'Evening Ramp Shift (14:00 - 22:30 UTC)',
    outgoingSupervisor: 'Riya Johnson (Ground Ops Lead)',
    incomingSupervisor: 'Vikram Seth (Night Shift Lead)',
    timestamp: 'Today, 22:30 UTC',
    carriedOverTasks: 3,
    flightsAwaitingAction: 2,
    unresolvedHolds: [
      'AI-203 hydraulic pressure sensor line check on Stand G12 (Avionics engaged).',
      'SPH-809 catering lift truck swap ongoing at Stand G14.',
    ],
    status: 'SUBMITTED',
    summaryNotes: 'Turnaround overall efficiency at 94.2%. Weather clear over airside. Stand G12 requires priority monitoring for pushback slot at 23:42 UTC.',
  },
  {
    id: 'HND-400',
    shiftTitle: 'Day Ramp Shift (06:00 - 14:00 UTC)',
    outgoingSupervisor: 'Vikram Seth (Shift Lead)',
    incomingSupervisor: 'Riya Johnson (Ground Ops Lead)',
    timestamp: 'Today, 14:00 UTC',
    carriedOverTasks: 1,
    flightsAwaitingAction: 1,
    unresolvedHolds: ['Concourse A fuel hydrant pressure surge resolved at 11:30 UTC.'],
    status: 'ACKNOWLEDGED',
    summaryNotes: 'All 19 flights turned around within target block times. 1 minor GSE tire maintenance.',
  },
];

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

  const handleTabSelect = (tab: string) => {
    if (tab === 'overview') {
      navigate('/dashboard/ground-ops');
    } else {
      navigate(`/dashboard/ground-ops#${tab}`);
    }
  };

  // State
  const [flights, setFlights] = useState<GroundTurnaroundFlight[]>(INITIAL_GROUND_FLIGHTS);
  const [tasks, setTasks] = useState<GroundTask[]>(INITIAL_GROUND_TASKS);
  const [crews, setCrews] = useState<GroundCrew[]>(INITIAL_GROUND_CREWS);
  const [handovers, setHandovers] = useState<HandoverLog[]>(INITIAL_HANDOVERS);
  const [selectedFlight, setSelectedFlight] = useState<GroundTurnaroundFlight>(INITIAL_GROUND_FLIGHTS[0]);

  // Filters
  const [taskFilter, setTaskFilter] = useState<'ALL' | 'ATTENTION' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  const [flightFilter, setFlightFilter] = useState<'ALL' | 'T1' | 'T2'>('ALL');
  const [flightSearch, setFlightSearch] = useState('');
  const [taskSearch, setTaskSearch] = useState('');

  // Modals
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [newTaskFlight, setNewTaskFlight] = useState('AI-203');
  const [newTaskType, setNewTaskType] = useState<TaskStage>('CLEANING');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCrew, setNewTaskCrew] = useState('Cabin Hygiene Alpha');
  const [newTaskStaff, setNewTaskStaff] = useState('Sunita Patil');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('MEDIUM');
  const [newTaskTime, setNewTaskTime] = useState('23:45 UTC');

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [activeTaskToAssign, setActiveTaskToAssign] = useState<GroundTask | null>(null);
  const [assignedCrewChoice, setAssignedCrewChoice] = useState('');
  const [assignedStaffChoice, setAssignedStaffChoice] = useState('');

  const [handoverModalOpen, setHandoverModalOpen] = useState(false);
  const [handoverIncomingSup, setHandoverIncomingSup] = useState('Vikram Seth (Night Shift Lead)');
  const [handoverNotesInput, setHandoverNotesInput] = useState('');
  const [handoverIssuesInput, setHandoverIssuesInput] = useState('AI-203 hydraulic pressure sensor line check on Stand G12');

  // Accurate stats calculation directly from state
  const totalFlightsCount = flights.length;
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'COMPLETED').length;

  // Task Actions
  const handleMarkTaskStarted = (taskId: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          toast.success(`Task ${t.id} (${t.title}) marked as IN PROGRESS`);
          aocsDataStore.updateTurnaroundTask(t.flightNumber, t.serviceType, 'IN_PROGRESS', 'Ground Handling');
          return { ...t, status: 'IN_PROGRESS' };
        }
        return t;
      })
    );
  };

  const handleMarkTaskCompleted = (taskId: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          toast.success(`Task ${t.id} marked as COMPLETED!`);
          aocsDataStore.updateTurnaroundTask(t.flightNumber, t.serviceType, 'COMPLETED', 'Ground Handling');

          // If this task belongs to the currently selected flight, update that stage
          if (t.flightNumber === selectedFlight.flightNumber) {
            const updated = { ...selectedFlight };
            if (t.serviceType === 'CLEANING') updated.cleaningStatus = 'COMPLETED';
            if (t.serviceType === 'FUELING') updated.fuelingStatus = 'COMPLETED';
            if (t.serviceType === 'MAINTENANCE') updated.maintenanceStatus = 'COMPLETED';
            if (t.serviceType === 'SECURITY') updated.securityStatus = 'COMPLETED';

            // recalculate overall
            let completedCount = 0;
            if (updated.cleaningStatus === 'COMPLETED') completedCount++;
            if (updated.fuelingStatus === 'COMPLETED') completedCount++;
            if (updated.maintenanceStatus === 'COMPLETED') completedCount++;
            if (updated.securityStatus === 'COMPLETED') completedCount++;
            updated.overallProgress = Math.round((completedCount / 4) * 100);

            setSelectedFlight(updated);
            setFlights(flights.map((f) => (f.id === updated.id ? updated : f)));
          }
          return { ...t, status: 'COMPLETED' };
        }
        return t;
      })
    );
  };

  const handleOpenAssignModal = (task: GroundTask) => {
    setActiveTaskToAssign(task);
    setAssignedCrewChoice(task.assignedCrew);
    setAssignedStaffChoice(task.assignedStaff);
    setAssignModalOpen(true);
  };

  const handleSaveAssignment = () => {
    if (!activeTaskToAssign) return;
    setTasks(
      tasks.map((t) => {
        if (t.id === activeTaskToAssign.id) {
          return {
            ...t,
            assignedCrew: assignedCrewChoice,
            assignedStaff: assignedStaffChoice || 'Assigned Ramp Specialist',
          };
        }
        return t;
      })
    );
    toast.success(`Task ${activeTaskToAssign.id} assigned to ${assignedCrewChoice} (${assignedStaffChoice})`);
    setAssignModalOpen(false);
  };

  const handleCreateTaskSubmit = () => {
    if (!newTaskTitle.trim()) {
      toast.error('Please enter a task title / work order description');
      return;
    }
    const flightObj = flights.find((f) => f.flightNumber === newTaskFlight);
    const newTask: GroundTask = {
      id: `TSK-${Math.floor(107 + Math.random() * 800)}`,
      flightNumber: newTaskFlight,
      stand: flightObj ? flightObj.stand : 'Stand G12',
      serviceType: newTaskType,
      title: newTaskTitle,
      priority: newTaskPriority,
      assignedCrew: newTaskCrew,
      assignedStaff: newTaskStaff,
      status: 'PENDING',
      estCompletion: newTaskTime,
      notes: `Created by Ground Ops Supervisor Riya Johnson at ${new Date().toLocaleTimeString()} UTC.`,
    };

    setTasks([newTask, ...tasks]);
    toast.success(`New task ${newTask.id} created for flight ${newTaskFlight}`);
    setNewTaskTitle('');
    setCreateTaskOpen(false);
  };

  const handleCreateHandoverSubmit = () => {
    if (!handoverNotesInput.trim()) {
      toast.error('Please enter shift handover summary notes');
      return;
    }
    const newHnd: HandoverLog = {
      id: `HND-${Math.floor(402 + Math.random() * 100)}`,
      shiftTitle: 'Current Ramp Shift Turnover',
      outgoingSupervisor: 'Riya Johnson (Ground Ops Lead)',
      incomingSupervisor: handoverIncomingSup,
      timestamp: 'Just now (UTC)',
      carriedOverTasks: pendingTasksCount,
      flightsAwaitingAction: 2,
      unresolvedHolds: handoverIssuesInput ? [handoverIssuesInput] : [],
      status: 'SUBMITTED',
      summaryNotes: handoverNotesInput,
    };
    setHandovers([newHnd, ...handovers]);
    toast.success('Shift handover log submitted for incoming supervisor review');
    setHandoverModalOpen(false);
  };

  // Helper renderers for status dots
  const renderTurnaroundDot = (status: TaskStatus) => {
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
    if (priority === 'HIGH') {
      return (
        <Chip
          label="🔴 HIGH PRIORITY"
          size="small"
          sx={{
            bgcolor: '#FEE2E2',
            color: '#DC2626',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: '0.68rem',
            height: '22px',
          }}
        />
      );
    }
    if (priority === 'MEDIUM') {
      return (
        <Chip
          label="🟠 MEDIUM"
          size="small"
          sx={{
            bgcolor: '#FEF3C7',
            color: '#D97706',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: '0.68rem',
            height: '22px',
          }}
        />
      );
    }
    return (
      <Chip
        label="🟡 ROUTINE"
        size="small"
        sx={{
          bgcolor: '#F1F5F9',
          color: '#64748B',
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          fontSize: '0.68rem',
          height: '22px',
        }}
      />
    );
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

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'ATTENTION') {
      if (t.status === 'COMPLETED' || (t.priority !== 'HIGH' && t.status !== 'PENDING')) return false;
    } else if (taskFilter === 'IN_PROGRESS') {
      if (t.status !== 'IN_PROGRESS') return false;
    } else if (taskFilter === 'COMPLETED') {
      if (t.status !== 'COMPLETED') return false;
    }
    if (taskSearch.trim()) {
      const q = taskSearch.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.flightNumber.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.stand.toLowerCase().includes(q) ||
        t.assignedCrew.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
                  Supervisor: Riya Johnson · Saphire Ground Handling & Apron Services
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
                    {(['ALL', 'T1', 'T2'] as const).map((cc) => (
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
                        {cc === 'ALL' ? 'All Stands' : cc === 'T1' ? 'Concourse A (T1)' : 'Concourse B (T2)'}
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
                        label={`${filteredTasks.length} in queue`}
                        size="small"
                        sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 800, fontSize: '0.68rem', height: '20px' }}
                      />
                    </Box>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748B' }}>
                      Prioritized turnaround dispatch and crew verification queue.
                    </Typography>
                  </Box>

                  {/* Filter chips */}
                  <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap' }}>
                    {(
                      [
                        { id: 'ALL', label: 'All Tasks' },
                        { id: 'ATTENTION', label: '🔴 Attention (4)' },
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
                              height: '22px',
                            }}
                          />
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284C7' }}>
                            {task.stand}
                          </Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>• Est: {task.estCompletion}</Typography>
                        </Box>

                        <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#0F2942' }}>
                          {task.title}
                        </Typography>
                        <Typography sx={{ fontSize: '0.76rem', color: '#64748B', mt: 0.3 }}>
                          Assigned Crew: <strong style={{ color: '#334155' }}>{task.assignedCrew}</strong> ({task.assignedStaff})
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
                            onClick={() => handleMarkTaskStarted(task.id)}
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
                            onClick={() => handleMarkTaskCompleted(task.id)}
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
                      <strong style={{ color: '#0F2942' }}>3 tasks carried over</strong> · 2 flights awaiting action · 1 unresolved stand hold (AI-203 hydraulic sensor)
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
                  Complete telemetry for 18 flights currently berthed at Terminal 1 & 2 stands.
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
                placeholder="Search flights by flight number, airline, or stand (e.g. AI-203, Stand G12)..."
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
                placeholder="Search tasks by ID, flight, workorder title, or crew..."
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
                      <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>ASSIGNED CREW</TableCell>
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
                          <Typography sx={{ fontSize: '0.74rem', color: '#0284C7', fontWeight: 700 }}>{task.stand}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#1E293B' }}>{task.title}</Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>{task.notes}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700 }}>{task.assignedCrew}</Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>{task.assignedStaff}</Typography>
                        </TableCell>
                        <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                        <TableCell>
                          {task.status === 'COMPLETED' ? (
                            <Chip label="COMPLETED" size="small" sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '0.68rem' }} />
                          ) : task.status === 'IN_PROGRESS' ? (
                            <Chip label="IN PROGRESS" size="small" sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 800, fontSize: '0.68rem' }} />
                          ) : (
                            <Chip label="PENDING" size="small" sx={{ bgcolor: '#F1F5F9', color: '#64748B', fontWeight: 700, fontSize: '0.68rem' }} />
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
                                onClick={() => handleMarkTaskCompleted(task.id)}
                                sx={{ bgcolor: '#10B981', color: '#FFF', textTransform: 'none', fontWeight: 700, fontSize: '0.72rem', borderRadius: '6px' }}
                              >
                                Complete
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
                  Apron Crew Dispatch & Assignment
                </Typography>
                <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
                  Deploy specialized ground handling crews across Terminal 1 & Terminal 2 apron stands.
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
              {crews.map((crew) => (
                <Card
                  key={crew.id}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box>
                        <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#0F2942' }}>
                          {crew.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.76rem', color: '#64748B' }}>{crew.department}</Typography>
                      </Box>
                      <Chip
                        label={crew.status}
                        size="small"
                        sx={{
                          bgcolor: crew.status === 'AVAILABLE' ? '#DCFCE7' : crew.status === 'ENGAGED' ? '#FEF3C7' : '#F1F5F9',
                          color: crew.status === 'AVAILABLE' ? '#15803D' : crew.status === 'ENGAGED' ? '#D97706' : '#64748B',
                          fontWeight: 800,
                          fontSize: '0.68rem',
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, my: 2 }}>
                      <Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>
                        Crew Lead: <strong>{crew.lead}</strong>
                      </Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>
                        Current Location: <strong style={{ color: '#0284C7' }}>{crew.standLocation}</strong>
                      </Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>
                        Deployed Specialists: <strong>{crew.members} personnel</strong>
                      </Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>
                        Active Workorders: <strong>{crew.activeTasks} in flight</strong>
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      setNewTaskCrew(crew.name);
                      setNewTaskStaff(crew.lead);
                      setCreateTaskOpen(true);
                    }}
                    sx={{
                      bgcolor: '#0F2942',
                      color: '#FFFFFF',
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      textTransform: 'none',
                      borderRadius: '8px',
                      py: 0.8,
                      '&:hover': { bgcolor: '#1E3A5F' },
                    }}
                  >
                    Deploy New Workorder to Crew
                  </Button>
                </Card>
              ))}
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
              {[
                {
                  id: 'n1',
                  time: '5 mins ago',
                  title: 'Stand G12 Hydraulic Check',
                  body: 'Avionics team is completing the secondary sensor calibration on flight AI-203. Stand pushback window adjusted to 23:42 UTC.',
                  type: 'WARN',
                },
                {
                  id: 'n2',
                  time: '18 mins ago',
                  title: 'Stand G04 Turnaround Completed',
                  body: 'Vistara flight UK-901 has completed all ground servicing checks. Towbar hitch confirmed for pushback.',
                  type: 'SUCCESS',
                },
                {
                  id: 'n3',
                  time: '42 mins ago',
                  title: 'GSE Equipment Swap: Stand G14',
                  body: 'Catering lift truck replaced with unit #7. Apron safety officer has cleared stand for service resumption.',
                  type: 'INFO',
                },
              ].map((n) => (
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
          Dispatch New Ground Workorder
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2, pt: 1 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Flight Number</InputLabel>
                <Select
                  value={newTaskFlight}
                  label="Flight Number"
                  onChange={(e) => setNewTaskFlight(e.target.value)}
                >
                  {flights.map((f) => (
                    <MenuItem key={f.id} value={f.flightNumber}>
                      {f.flightNumber} ({f.stand})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Turnaround Stage</InputLabel>
                <Select
                  value={newTaskType}
                  label="Turnaround Stage"
                  onChange={(e) => setNewTaskType(e.target.value as TaskStage)}
                >
                  <MenuItem value="CLEANING">Cleaning & Hospitality</MenuItem>
                  <MenuItem value="FUELING">Apron Refueling</MenuItem>
                  <MenuItem value="MAINTENANCE">Line Maintenance</MenuItem>
                  <MenuItem value="SECURITY">Airside Security</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Workorder Title / Action Summary"
              size="small"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="e.g. Inspect hydraulic sensor pressure, Refuel 14,000 kg..."
              fullWidth
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Assigned Crew</InputLabel>
                <Select
                  value={newTaskCrew}
                  label="Assigned Crew"
                  onChange={(e) => {
                    const c = crews.find((crw) => crw.name === e.target.value);
                    setNewTaskCrew(e.target.value);
                    if (c) setNewTaskStaff(c.lead);
                  }}
                >
                  {crews.map((crw) => (
                    <MenuItem key={crw.id} value={crw.name}>
                      {crw.name} ({crw.standLocation})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Priority Level</InputLabel>
                <Select
                  value={newTaskPriority}
                  label="Priority Level"
                  onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                >
                  <MenuItem value="HIGH">🔴 High (Blocking Turnaround)</MenuItem>
                  <MenuItem value="MEDIUM">🟠 Medium (Standard)</MenuItem>
                  <MenuItem value="LOW">🟡 Routine / Low</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Target Completion Time (UTC)"
              size="small"
              value={newTaskTime}
              onChange={(e) => setNewTaskTime(e.target.value)}
              placeholder="e.g. 23:45 UTC"
              fullWidth
            />
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
              Reassign workorder for <strong>{activeTaskToAssign?.flightNumber}</strong> ({activeTaskToAssign?.stand})
            </Typography>

            <FormControl fullWidth size="small">
              <InputLabel>Designated Crew</InputLabel>
              <Select
                value={assignedCrewChoice}
                label="Designated Crew"
                onChange={(e) => {
                  const crw = crews.find((c) => c.name === e.target.value);
                  setAssignedCrewChoice(e.target.value);
                  if (crw) setAssignedStaffChoice(crw.lead);
                }}
              >
                {crews.map((c) => (
                  <MenuItem key={c.id} value={c.name}>
                    {c.name} ({c.status})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Assigned Lead / Specialist"
              size="small"
              value={assignedStaffChoice}
              onChange={(e) => setAssignedStaffChoice(e.target.value)}
              fullWidth
            />
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
