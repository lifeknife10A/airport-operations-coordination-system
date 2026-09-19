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
} from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { aocsDataStore } from '../../services/aocsDataStore';

// Types
export interface OperationalFlight {
  id: string;
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
  turnaroundProgress: number; // 0 - 100
  turnaroundStage: string;
  passengers: number;
  fuelKg: number;
  crew: string;
  delayMinutes?: number;
  delayReason?: string;
}

export interface TurnaroundStep {
  id: string;
  title: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  timestamp: string;
  notes: string;
  department: string;
}

export interface GateSlot {
  gate: string;
  concourse: 'T1' | 'T2';
  flight: string | null;
  aircraftType?: string;
  status: 'OCCUPIED' | 'AVAILABLE' | 'BOARDING' | 'DELAYED' | 'MAINTENANCE';
}

export interface DelayLogItem {
  id: string;
  flightNumber: string;
  route: string;
  delayMinutes: number;
  reasonCategory: 'WEATHER' | 'MAINTENANCE' | 'ATC' | 'GROUND_HANDLING' | 'BAGGAGE';
  description: string;
  loggedAt: string;
  loggedBy: string;
  status: 'ACTIVE' | 'RESOLVED' | 'MITIGATED';
}

// Initial Data
const INITIAL_FLIGHTS: OperationalFlight[] = [
  {
    id: 'FL-203',
    flightNumber: 'AI-203',
    airline: 'Air India',
    aircraft: 'Boeing 787-8 Dreamliner',
    route: 'DEL → BOM',
    origin: 'DEL (New Delhi)',
    destination: 'BOM (Mumbai)',
    gate: 'G12',
    scheduledTime: '23:30 UTC',
    estimatedTime: '23:42 UTC',
    status: 'BOARDING',
    turnaroundProgress: 80,
    turnaroundStage: 'Fuel & Cleaning Done',
    passengers: 248,
    fuelKg: 38400,
    crew: 'Capt. R. Deshmukh / FO P. Varma',
    delayMinutes: 12,
    delayReason: 'Line maintenance hydraulic fluid check',
  },
  {
    id: 'FL-521',
    flightNumber: '6E-521',
    airline: 'IndiGo',
    aircraft: 'Airbus A321neo',
    route: 'BOM → BLR',
    origin: 'BOM (Mumbai)',
    destination: 'BLR (Bengaluru)',
    gate: 'G08',
    scheduledTime: '23:15 UTC',
    estimatedTime: '23:33 UTC',
    status: 'DELAYED',
    turnaroundProgress: 50,
    turnaroundStage: 'Apron Refueling In Progress',
    passengers: 214,
    fuelKg: 14200,
    crew: 'Capt. A. Nair / FO S. Pillai',
    delayMinutes: 18,
    delayReason: 'Weather routing deviation over Deccan Plateau',
  },
  {
    id: 'FL-901',
    flightNumber: 'UK-901',
    airline: 'Vistara',
    aircraft: 'Airbus A320neo',
    route: 'BOM → DEL',
    origin: 'BOM (Mumbai)',
    destination: 'DEL (New Delhi)',
    gate: 'G04',
    scheduledTime: '23:05 UTC',
    estimatedTime: '23:05 UTC',
    status: 'READY',
    turnaroundProgress: 100,
    turnaroundStage: 'All Checks Clear - Pushback Ready',
    passengers: 168,
    fuelKg: 11800,
    crew: 'Capt. V. Kapoor / FO M. Chawla',
  },
  {
    id: 'FL-102',
    flightNumber: 'SPH-102',
    airline: 'Saphire Airways',
    aircraft: 'Airbus A350-900',
    route: 'SPH → LHR',
    origin: 'SPH (Saphire Hub)',
    destination: 'LHR (London Heathrow)',
    gate: 'G10',
    scheduledTime: '23:45 UTC',
    estimatedTime: '23:45 UTC',
    status: 'BOARDING',
    turnaroundProgress: 85,
    turnaroundStage: 'Passenger Boarding Group 3',
    passengers: 312,
    fuelKg: 78500,
    crew: 'Capt. E. Sterling / FO J. Davies',
  },
  {
    id: 'FL-204',
    flightNumber: 'SPH-204',
    airline: 'Saphire Airways',
    aircraft: 'Boeing 777-300ER',
    route: 'SPH → DXB',
    origin: 'SPH (Saphire Hub)',
    destination: 'DXB (Dubai Int)',
    gate: 'G01',
    scheduledTime: '00:15 UTC',
    estimatedTime: '00:15 UTC',
    status: 'SCHEDULED',
    turnaroundProgress: 20,
    turnaroundStage: 'Inbound Bag Offload',
    passengers: 340,
    fuelKg: 64200,
    crew: 'Capt. M. Al-Mansoori / FO K. Vance',
  },
  {
    id: 'FL-308',
    flightNumber: 'SPH-308',
    airline: 'Saphire Airways',
    aircraft: 'Boeing 787-9 Dreamliner',
    route: 'SPH → LAX',
    origin: 'SPH (Saphire Hub)',
    destination: 'LAX (Los Angeles Int)',
    gate: 'G03',
    scheduledTime: '22:50 UTC',
    estimatedTime: '22:50 UTC',
    status: 'AIRBORNE',
    turnaroundProgress: 100,
    turnaroundStage: 'Departed Runway 27R',
    passengers: 288,
    fuelKg: 91000,
    crew: 'Capt. C. Montgomery / FO H. Becker',
  },
  {
    id: 'FL-809',
    flightNumber: 'SPH-809',
    airline: 'Saphire Airways',
    aircraft: 'Airbus A330-300',
    route: 'SPH → JFK',
    origin: 'SPH (Saphire Hub)',
    destination: 'JFK (New York JFK)',
    gate: 'G06',
    scheduledTime: '23:55 UTC',
    estimatedTime: '00:20 UTC',
    status: 'DELAYED',
    turnaroundProgress: 40,
    turnaroundStage: 'Cabin Catering Hold',
    passengers: 275,
    fuelKg: 82000,
    crew: 'Capt. D. Miller / FO G. Henderson',
    delayMinutes: 25,
    delayReason: 'Catering highloader hydraulic mechanical servicing',
  },
];

const INITIAL_GATES: GateSlot[] = [
  { gate: 'G01', concourse: 'T1', flight: 'SPH-204', aircraftType: 'Boeing 777-300ER', status: 'OCCUPIED' },
  { gate: 'G02', concourse: 'T1', flight: null, status: 'AVAILABLE' },
  { gate: 'G03', concourse: 'T1', flight: 'SPH-308', aircraftType: 'Boeing 787-9', status: 'OCCUPIED' },
  { gate: 'G04', concourse: 'T1', flight: 'UK-901', aircraftType: 'Airbus A320neo', status: 'BOARDING' },
  { gate: 'G05', concourse: 'T1', flight: null, status: 'AVAILABLE' },
  { gate: 'G06', concourse: 'T1', flight: 'SPH-809', aircraftType: 'Airbus A330-300', status: 'DELAYED' },
  { gate: 'G07', concourse: 'T2', flight: null, status: 'AVAILABLE' },
  { gate: 'G08', concourse: 'T2', flight: '6E-521', aircraftType: 'Airbus A321neo', status: 'OCCUPIED' },
  { gate: 'G09', concourse: 'T2', flight: null, status: 'AVAILABLE' },
  { gate: 'G10', concourse: 'T2', flight: 'SPH-102', aircraftType: 'Airbus A350-900', status: 'BOARDING' },
  { gate: 'G11', concourse: 'T2', flight: null, status: 'AVAILABLE' },
  { gate: 'G12', concourse: 'T2', flight: 'AI-203', aircraftType: 'Boeing 787-8', status: 'OCCUPIED' },
];

const INITIAL_DELAYS: DelayLogItem[] = [
  {
    id: 'DLY-101',
    flightNumber: 'AI-203',
    route: 'DEL → BOM',
    delayMinutes: 12,
    reasonCategory: 'MAINTENANCE',
    description: 'Line maintenance checking secondary hydraulic reserve pressure sensor on stand G12.',
    loggedAt: '22:30 UTC',
    loggedBy: 'Sai Sharma (AOCC)',
    status: 'ACTIVE',
  },
  {
    id: 'DLY-102',
    flightNumber: '6E-521',
    route: 'BOM → BLR',
    delayMinutes: 18,
    reasonCategory: 'WEATHER',
    description: 'Deccan Plateau storm cell causing air traffic control hold & re-routing 45 nm west.',
    loggedAt: '22:15 UTC',
    loggedBy: 'Sai Sharma (AOCC)',
    status: 'ACTIVE',
  },
  {
    id: 'DLY-103',
    flightNumber: 'SPH-809',
    route: 'SPH → JFK',
    delayMinutes: 25,
    reasonCategory: 'GROUND_HANDLING',
    description: 'Catering lift truck replaced after stand mechanical sensor triggered fail-safe.',
    loggedAt: '22:05 UTC',
    loggedBy: 'Riya Johnson (Ground Ops)',
    status: 'ACTIVE',
  },
  {
    id: 'DLY-104',
    flightNumber: 'UK-442',
    route: 'BOM → CCU',
    delayMinutes: 15,
    reasonCategory: 'BAGGAGE',
    description: 'Transfer baggage conveyor belt jam in Concourse B sorting hall.',
    loggedAt: '21:40 UTC',
    loggedBy: 'Priya Kumar (Logistics)',
    status: 'RESOLVED',
  },
];

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

  // State
  const [flights, setFlights] = useState<OperationalFlight[]>(INITIAL_FLIGHTS);
  const [gates, setGates] = useState<GateSlot[]>(INITIAL_GATES);
  const [delayLogs, setDelayLogs] = useState<DelayLogItem[]>(INITIAL_DELAYS);
  const [selectedFlight, setSelectedFlight] = useState<OperationalFlight>(INITIAL_FLIGHTS[0]); // defaults to AI-203
  const [selectedConcourse, setSelectedConcourse] = useState<'ALL' | 'T1' | 'T2'>('ALL');
  const [flightSearch, setFlightSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Dynamic Turnaround Tasks for selected flight
  const [turnaroundTasks, setTurnaroundTasks] = useState<TurnaroundStep[]>([
    { id: 't1', title: 'Arrival & Chocks On Stand', status: 'COMPLETED', timestamp: '22:15 UTC', notes: 'Aircraft marshaled, ground power plugged in.', department: 'Ramp Ops' },
    { id: 't2', title: 'Baggage Offload & Cabin Cleaning', status: 'COMPLETED', timestamp: '22:25 UTC', notes: 'Hold containers offloaded; interior sterilized.', department: 'Ground & Cabin' },
    { id: 't3', title: 'Apron Refueling Operation', status: 'COMPLETED', timestamp: '22:40 UTC', notes: '38,400 kg Jet A-1 loaded and verified.', department: 'Refueling Ops' },
    { id: 't4', title: 'Maintenance & Pre-Flight Inspections', status: 'IN_PROGRESS', timestamp: 'Running (22:45 UTC)', notes: 'Line engineer inspecting hydraulic fluid sensor.', department: 'Engineering' },
    { id: 't5', title: 'Security Sweep & Passenger Boarding', status: 'PENDING', timestamp: 'Target: 23:05 UTC', notes: 'Biometric aerobridge gates standing by.', department: 'Passenger Security' },
    { id: 't6', title: 'Cabin Door Closure & Ready Status', status: 'PENDING', timestamp: 'Target: 23:25 UTC', notes: 'Final manifest cross-checked with ATC slot.', department: 'Gate Operations' },
    { id: 't7', title: 'Tug Pushback & Runway Taxi', status: 'PENDING', timestamp: 'Target: 23:35 UTC', notes: 'Towbar hitched; ATC clearance received.', department: 'Apron Movement' },
  ]);

  // Dialog States
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [modalFlight, setModalFlight] = useState<OperationalFlight | null>(null);

  const [logDelayOpen, setLogDelayOpen] = useState(false);
  const [delayFlightNum, setDelayFlightNum] = useState('AI-203');
  const [delayMinutesInput, setDelayMinutesInput] = useState('15');
  const [delayCategoryInput, setDelayCategoryInput] = useState<'WEATHER' | 'MAINTENANCE' | 'ATC' | 'GROUND_HANDLING' | 'BAGGAGE'>('MAINTENANCE');
  const [delayDescInput, setDelayDescInput] = useState('');

  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [reassignGateTarget, setReassignGateTarget] = useState<GateSlot | null>(null);
  const [reassignFlightChoice, setReassignFlightChoice] = useState('');

  // Handlers
  const handleSelectFlightForTurnaround = (f: OperationalFlight) => {
    setSelectedFlight(f);
    // Adjust turnaround task progression based on the flight's status
    if (f.status === 'READY' || f.status === 'AIRBORNE') {
      setTurnaroundTasks((prev) => prev.map((t) => ({ ...t, status: 'COMPLETED' })));
    } else if (f.status === 'BOARDING') {
      setTurnaroundTasks((prev) =>
        prev.map((t, idx) => ({
          ...t,
          status: idx < 4 ? 'COMPLETED' : idx === 4 ? 'IN_PROGRESS' : 'PENDING',
        }))
      );
    } else if (f.status === 'DELAYED') {
      setTurnaroundTasks((prev) =>
        prev.map((t, idx) => ({
          ...t,
          status: idx < 3 ? 'COMPLETED' : idx === 3 ? 'IN_PROGRESS' : 'PENDING',
        }))
      );
    } else {
      setTurnaroundTasks((prev) =>
        prev.map((t, idx) => ({
          ...t,
          status: idx < 1 ? 'COMPLETED' : idx === 1 ? 'IN_PROGRESS' : 'PENDING',
        }))
      );
    }
  };

  const handleOpenFlightDetails = (f: OperationalFlight) => {
    setModalFlight(f);
    setDetailsModalOpen(true);
  };

  // Synchronize with AOCS Store
  useEffect(() => {
    const syncFromStore = () => {
      const storeFlights = aocsDataStore.getFlights();
      if (storeFlights && storeFlights.length > 0) {
        setFlights((prev) =>
          storeFlights.map((sf) => {
            const existing = prev.find((p) => p.flightNumber === sf.flightNumber);
            return {
              id: existing ? existing.id : `FL-${sf.flightId}`,
              flightNumber: sf.flightNumber,
              airline: sf.airlineName,
              aircraft: sf.aircraftType,
              route: `${sf.originAirportCode} → ${sf.destinationAirportCode}`,
              origin: sf.originAirportName,
              destination: sf.destinationAirportName,
              gate: sf.gateCode || 'Unassigned',
              scheduledTime: sf.scheduledTime,
              estimatedTime: sf.estimatedTime || sf.scheduledTime,
              status: (sf.status as any) || 'SCHEDULED',
              turnaroundProgress: existing ? existing.turnaroundProgress : (sf.status === 'READY' ? 100 : sf.status === 'BOARDING' ? 80 : 45),
              turnaroundStage: existing ? existing.turnaroundStage : 'Turnaround Active',
              passengers: existing ? existing.passengers : 180,
              fuelKg: existing ? existing.fuelKg : 25000,
              crew: existing ? existing.crew : 'Capt. / First Officer',
            };
          })
        );
      }

      const storeGates = aocsDataStore.getGates();
      if (storeGates && storeGates.length > 0) {
        setGates(
          storeGates.map((sg) => ({
            gate: sg.gateCode,
            concourse: sg.terminalName === 'Terminal 1' ? 'T1' : 'T2',
            flight: sg.assignedFlightNumber || null,
            status: (sg.status as any) || 'AVAILABLE',
          }))
        );
      }
    };

    syncFromStore();
    const unsub = aocsDataStore.subscribe(() => {
      syncFromStore();
    });
    return () => unsub();
  }, []);

  const handleAdvanceTask = () => {
    const currentInProgressIdx = turnaroundTasks.findIndex((t) => t.status === 'IN_PROGRESS');
    if (currentInProgressIdx !== -1) {
      const updated = [...turnaroundTasks];
      updated[currentInProgressIdx].status = 'COMPLETED';
      if (currentInProgressIdx + 1 < updated.length) {
        updated[currentInProgressIdx + 1].status = 'IN_PROGRESS';
      }
      setTurnaroundTasks(updated);

      // Increase progress of selected flight
      const newProgress = Math.min(100, selectedFlight.turnaroundProgress + 15);
      const newStatus = newProgress >= 100 ? 'READY' : selectedFlight.status;
      setFlights(
        flights.map((fl) => (fl.id === selectedFlight.id ? { ...fl, turnaroundProgress: newProgress, status: newStatus } : fl))
      );
      setSelectedFlight({ ...selectedFlight, turnaroundProgress: newProgress, status: newStatus });
      aocsDataStore.updateFlightStatus(selectedFlight.flightNumber, newStatus as any, 'AOCC Controller');
      toast.success(`Turnaround step advanced for ${selectedFlight.flightNumber}`);
    } else {
      toast('All turnaround tasks for this flight are already complete.', { icon: '✓' });
    }
  };

  const handleSaveDelay = () => {
    if (!delayFlightNum || !delayDescInput.trim()) {
      toast.error('Please specify flight number and delay description.');
      return;
    }
    const newLog: DelayLogItem = {
      id: `DLY-${Math.floor(100 + Math.random() * 900)}`,
      flightNumber: delayFlightNum,
      route: flights.find((f) => f.flightNumber === delayFlightNum)?.route || 'SPH Hub Route',
      delayMinutes: parseInt(delayMinutesInput, 10) || 15,
      reasonCategory: delayCategoryInput,
      description: delayDescInput,
      loggedAt: 'Just now (UTC)',
      loggedBy: 'Sai Sharma (AOCC Controller)',
      status: 'ACTIVE',
    };
    setDelayLogs([newLog, ...delayLogs]);

    // Update flight status to DELAYED and sync store
    setFlights(
      flights.map((fl) =>
        fl.flightNumber === delayFlightNum
          ? { ...fl, status: 'DELAYED', delayMinutes: newLog.delayMinutes, delayReason: newLog.description }
          : fl
      )
    );
    aocsDataStore.updateFlightStatus(delayFlightNum, 'DELAYED', 'AOCC Controller');
    aocsDataStore.logAuditEvent(
      'FLIGHT_DELAY_LOGGED',
      `Delay logged for ${delayFlightNum} (+${newLog.delayMinutes}m [${newLog.reasonCategory}]): ${newLog.description}`,
      'AOCC Controller'
    );
    toast.success(`Operational delay of +${newLog.delayMinutes}m logged for ${delayFlightNum}`);
    setLogDelayOpen(false);
    setDelayDescInput('');
  };

  const handleReassignGateSubmit = () => {
    if (!reassignGateTarget) return;
    setGates(
      gates.map((g) => {
        if (g.gate === reassignGateTarget.gate) {
          return {
            ...g,
            flight: reassignFlightChoice || null,
            status: reassignFlightChoice ? 'OCCUPIED' : 'AVAILABLE',
          };
        }
        return g;
      })
    );
    if (reassignFlightChoice) {
      aocsDataStore.assignGate(reassignFlightChoice, reassignGateTarget.gate, 'AOCC Controller');
      setFlights(
        flights.map((f) => (f.flightNumber === reassignFlightChoice ? { ...f, gate: reassignGateTarget.gate } : f))
      );
      toast.success(`Stand ${reassignGateTarget.gate} assigned to ${reassignFlightChoice}`);
    } else {
      aocsDataStore.logAuditEvent('STAND_DEALLOCATED', `Stand ${reassignGateTarget.gate} cleared and marked AVAILABLE`, 'AOCC Controller');
      toast.success(`Stand ${reassignGateTarget.gate} cleared and marked AVAILABLE`);
    }
    setReassignModalOpen(false);
  };

  // Filtered flights
  const filteredFlights = flights.filter((f) => {
    const matchesSearch =
      f.flightNumber.toLowerCase().includes(flightSearch.toLowerCase()) ||
      f.route.toLowerCase().includes(flightSearch.toLowerCase()) ||
      f.gate.toLowerCase().includes(flightSearch.toLowerCase()) ||
      f.airline.toLowerCase().includes(flightSearch.toLowerCase()) ||
      f.status.toLowerCase().includes(flightSearch.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    const matchesConcourse =
      selectedConcourse === 'ALL' ||
      (selectedConcourse === 'T1' && f.gate.startsWith('G0') && parseInt(f.gate.replace('G0', ''), 10) <= 6) ||
      (selectedConcourse === 'T2' && (f.gate.startsWith('G1') || parseInt(f.gate.replace('G0', '').replace('G', ''), 10) > 6));

    return matchesSearch && matchesStatus && matchesConcourse;
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
                Controller: Sai Sharma · Saphire Air Operations Control Center (SPH)
              </Typography>
            </Box>

            {/* Controls: Concourse Selector Pills + Primary Action */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ display: 'flex', backgroundColor: '#FFFFFF', p: 0.5, borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                {(['ALL', 'T1', 'T2'] as const).map((concourse) => (
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
                    {concourse === 'ALL' ? 'All Concourses' : concourse === 'T1' ? 'Concourse A (T1)' : 'Concourse B (T2)'}
                  </Button>
                ))}
              </Box>

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
                {flights.length}
              </Typography>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.84rem', fontWeight: 700, color: '#475569', mt: 0.5 }}>
                Active Flights
              </Typography>
              <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
                {flights.filter((f) => f.status === 'AIRBORNE').length} Airborne · {flights.filter((f) => f.status === 'BOARDING').length} Boarding · {flights.filter((f) => f.status === 'ON_BLOCK').length} On Block
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
                {flights.filter((f) => f.status === 'BOARDING').length}
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
                {flights.filter((f) => f.status === 'DELAYED').length}
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
                {delayLogs.length}
              </Typography>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.84rem', fontWeight: 700, color: '#475569', mt: 0.5 }}>
                Attention Required
              </Typography>
              <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
                {delayLogs.length} Logged Delays · Click to triage
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
                  Click a flight to inspect its real-time Turnaround Progress below
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
                  onClick={() => toast.success(`Priority telemetry dispatched to ${selectedFlight.gate} ground crews.`)}
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
                  Ping Ground Handling
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
                    label="3 ACTIVE"
                    size="small"
                    sx={{ bgcolor: '#FEF2F2', color: '#DC2626', fontWeight: 800, fontSize: '0.68rem', border: '1px solid #FECACA' }}
                  />
                </Box>

                {/* Attention Items */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Alert 1 */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      bgcolor: '#FEF2F2',
                      border: '1px solid #FECACA',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#DC2626' }} />
                        <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.88rem', color: '#991B1B' }}>
                          AI-203 · Stand G12
                        </Typography>
                      </Box>
                      <Chip label="+12 min" size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#FFFFFF', color: '#DC2626' }} />
                    </Box>
                    <Typography sx={{ fontSize: '0.76rem', color: '#7F1D1D', mb: 1.5 }}>
                      Maintenance task pending: secondary hydraulic fluid check awaiting engineer signoff.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        onClick={() => toast.success('Line maintenance team contacted for AI-203.')}
                        sx={{
                          fontSize: '0.72rem',
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 700,
                          backgroundColor: '#DC2626',
                          color: '#FFF',
                          py: 0.3,
                          textTransform: 'none',
                          borderRadius: '6px',
                          '&:hover': { backgroundColor: '#B91C1C' },
                        }}
                      >
                        Contact Maintenance
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          const gateTarget = gates.find((g) => g.gate === 'G12') || gates[0];
                          setReassignGateTarget(gateTarget);
                          setReassignModalOpen(true);
                        }}
                        sx={{
                          fontSize: '0.72rem',
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 700,
                          backgroundColor: '#FFFFFF',
                          color: '#991B1B',
                          border: '1px solid #FCA5A5',
                          py: 0.3,
                          textTransform: 'none',
                          borderRadius: '6px',
                          '&:hover': { backgroundColor: '#FEE2E2' },
                        }}
                      >
                        Reassign Stand
                      </Button>
                    </Box>
                  </Box>

                  {/* Alert 2 */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      bgcolor: '#FFFBEB',
                      border: '1px solid #FDE68A',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#D97706' }} />
                        <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.88rem', color: '#92400E' }}>
                          6E-521 · BOM → BLR
                        </Typography>
                      </Box>
                      <Chip label="+18 min" size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#FFFFFF', color: '#D97706' }} />
                    </Box>
                    <Typography sx={{ fontSize: '0.76rem', color: '#78350F', mb: 1.5 }}>
                      En-route Deccan weather hold delay logged. Refueling running 6 mins behind target.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        onClick={() => toast.success('ATC Slot updated and filed for 6E-521.')}
                        sx={{
                          fontSize: '0.72rem',
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 700,
                          backgroundColor: '#D97706',
                          color: '#FFF',
                          py: 0.3,
                          textTransform: 'none',
                          borderRadius: '6px',
                          '&:hover': { backgroundColor: '#B45309' },
                        }}
                      >
                        Update Slot
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          setDelayFlightNum('6E-521');
                          setLogDelayOpen(true);
                        }}
                        sx={{
                          fontSize: '0.72rem',
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 700,
                          backgroundColor: '#FFFFFF',
                          color: '#92400E',
                          border: '1px solid #FCD34D',
                          py: 0.3,
                          textTransform: 'none',
                          borderRadius: '6px',
                          '&:hover': { backgroundColor: '#FEF3C7' },
                        }}
                      >
                        Log Reason
                      </Button>
                    </Box>
                  </Box>

                  {/* Alert 3 */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      bgcolor: '#FFFBEB',
                      border: '1px solid #FDE68A',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#D97706' }} />
                        <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.88rem', color: '#92400E' }}>
                          UK-442 · Stand G04
                        </Typography>
                      </Box>
                      <Chip label="Baggage" size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#FFFFFF', color: '#D97706' }} />
                    </Box>
                    <Typography sx={{ fontSize: '0.76rem', color: '#78350F', mb: 1.5 }}>
                      Baggage container tractor held at Concourse B apron crossing. Turnaround incomplete.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        onClick={() => toast.success('Ramp tug expedited for Stand G04.')}
                        sx={{
                          fontSize: '0.72rem',
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 700,
                          backgroundColor: '#0F2942',
                          color: '#FFF',
                          py: 0.3,
                          textTransform: 'none',
                          borderRadius: '6px',
                          '&:hover': { backgroundColor: '#1E3A5F' },
                        }}
                      >
                        Dispatch Tug
                      </Button>
                      <Button
                        size="small"
                        onClick={() => toast.success('Baggage telemetry center notified.')}
                        sx={{
                          fontSize: '0.72rem',
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 700,
                          backgroundColor: '#FFFFFF',
                          color: '#334155',
                          border: '1px solid #CBD5E1',
                          py: 0.3,
                          textTransform: 'none',
                          borderRadius: '6px',
                          '&:hover': { backgroundColor: '#F8FAFC' },
                        }}
                      >
                        Notify Baggage
                      </Button>
                    </Box>
                  </Box>
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
              {gates.map((g) => {
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
                      setReassignFlightChoice(g.flight || '');
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
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>{f.passengers} pax</TableCell>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                  <Typography sx={{ color: '#64748B', fontSize: '0.84rem' }}>Flight Crew</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#475569' }}>{selectedFlight.crew}</Typography>
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
                  <Typography sx={{ color: '#64748B', fontSize: '0.84rem' }}>Booked Passengers</Typography>
                  <Typography sx={{ fontWeight: 800, color: '#0F2942' }}>{selectedFlight.passengers} Pax</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                  <Typography sx={{ color: '#64748B', fontSize: '0.84rem' }}>Fuel On Board</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#0F2942' }}>{selectedFlight.fuelKg.toLocaleString()} kg (Jet A-1)</Typography>
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
                {selectedFlight.delayReason && (
                  <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: '#FEF2F2', border: '1px solid #FECACA', mt: 1 }}>
                    <Typography sx={{ fontSize: '0.76rem', color: '#991B1B', fontWeight: 700 }}>
                      Active Delay Note: {selectedFlight.delayReason} (+{selectedFlight.delayMinutes}m)
                    </Typography>
                  </Box>
                )}
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
                Real-time stand telemetry for Concourse A (T1) and Concourse B (T2)
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
            {gates.map((g) => (
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
                  setReassignFlightChoice(g.flight || '');
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
                        <Chip label={d.reasonCategory} size="small" sx={{ fontWeight: 700, fontSize: '0.68rem', bgcolor: '#F1F5F9' }} />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', color: '#334155' }}>{d.description}</TableCell>
                      <TableCell sx={{ fontSize: '0.74rem', color: '#64748B' }}>{d.loggedBy} ({d.loggedAt})</TableCell>
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
                Airside telemetry stream, ATC vector advisories, and critical turnarounds
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
            <Card sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #FECACA', bgcolor: '#FEF2F2' }}>
              <Typography sx={{ fontWeight: 800, color: '#991B1B', fontSize: '0.95rem', mb: 0.5 }}>
                🔴 CRITICAL: Gate G12 Stand Conflict & Maintenance Hold
              </Typography>
              <Typography sx={{ fontSize: '0.82rem', color: '#7F1D1D' }}>
                Flight AI-203 line maintenance check running over slot by 12 minutes. Inbound widebody SPH-204 scheduled for G12 stand at 00:15 UTC. Stand reallocation required immediately.
              </Typography>
            </Card>

            <Card sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #FDE68A', bgcolor: '#FFFBEB' }}>
              <Typography sx={{ fontWeight: 800, color: '#92400E', fontSize: '0.95rem', mb: 0.5 }}>
                🟠 WARNING: Deccan Plateau Weather Routing Deviation
              </Typography>
              <Typography sx={{ fontSize: '0.82rem', color: '#78350F' }}>
                Air traffic control reported active convective cloud build-up along Route W42. Inbound flight 6E-521 holding 45 nm west; delay logged +18m.
              </Typography>
            </Card>

            <Card sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #BAE6FD', bgcolor: '#F0F9FF' }}>
              <Typography sx={{ fontWeight: 800, color: '#0369A1', fontSize: '0.95rem', mb: 0.5 }}>
                ℹ INFO: Concourse A Biometric E-Gate Channel Operational
              </Typography>
              <Typography sx={{ fontSize: '0.82rem', color: '#075985' }}>
                All 8 boarding lanes for Flight SPH-102 (LHR) operational. Boarding completion estimated at 23:30 UTC.
              </Typography>
            </Card>
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
                SS
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                  Sai Sharma
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#0284C7', fontWeight: 700 }}>
                  AOCC Operations Manager · Level 4 Airside Controller
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mt: 0.2 }}>
                  Station ID: SPH-AOCC-CON-01 · Radio Frequency: 121.85 MHz (Ground Ops)
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                <Typography sx={{ color: '#64748B', fontSize: '0.84rem' }}>Operational Email</Typography>
                <Typography sx={{ fontWeight: 700, color: '#0F2942' }}>aocc@saphire.in</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                <Typography sx={{ color: '#64748B', fontSize: '0.84rem' }}>Assigned Airfield Hub</Typography>
                <Typography sx={{ fontWeight: 700, color: '#0F2942' }}>Saphire International Airport (SPH)</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                <Typography sx={{ color: '#64748B', fontSize: '0.84rem' }}>Assigned Concourse</Typography>
                <Typography sx={{ fontWeight: 700, color: '#0F2942' }}>Concourse A & B (All Terminal Gates)</Typography>
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
                  <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>PASSENGERS</Typography>
                  <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F2942' }}>{modalFlight.passengers} Pax</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>FUEL WEIGHT</Typography>
                  <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F2942' }}>{modalFlight.fuelKg.toLocaleString()} kg</Typography>
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
              <InputLabel>Flight Number</InputLabel>
              <Select
                value={delayFlightNum}
                label="Flight Number"
                onChange={(e) => setDelayFlightNum(e.target.value)}
              >
                {flights.map((f) => (
                  <MenuItem key={f.id} value={f.flightNumber}>
                    {f.flightNumber} ({f.route}) — {f.gate}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Delay Duration (Minutes)"
                type="number"
                size="small"
                value={delayMinutesInput}
                onChange={(e) => setDelayMinutesInput(e.target.value)}
              />

              <FormControl fullWidth size="small">
                <InputLabel>Root Reason Category</InputLabel>
                <Select
                  value={delayCategoryInput}
                  label="Root Reason Category"
                  onChange={(e) => setDelayCategoryInput(e.target.value as any)}
                >
                  <MenuItem value="WEATHER">Weather Deviation</MenuItem>
                  <MenuItem value="MAINTENANCE">Line Maintenance</MenuItem>
                  <MenuItem value="ATC">ATC Vector Hold</MenuItem>
                  <MenuItem value="GROUND_HANDLING">Ground Servicing</MenuItem>
                  <MenuItem value="BAGGAGE">Baggage Conveyor Jam</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Incident Description & Operational Mitigation"
              multiline
              rows={3}
              value={delayDescInput}
              onChange={(e) => setDelayDescInput(e.target.value)}
              placeholder="e.g. Line maintenance checking secondary hydraulic pressure sensor on stand..."
            />
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
              Assign an active flight or clear this stand to mark it as Available.
            </Typography>

            <FormControl fullWidth size="small">
              <InputLabel>Assigned Flight</InputLabel>
              <Select
                value={reassignFlightChoice}
                label="Assigned Flight"
                onChange={(e) => setReassignFlightChoice(e.target.value)}
              >
                <MenuItem value="">
                  <em>None (Clear Stand to Available)</em>
                </MenuItem>
                {flights.map((f) => (
                  <MenuItem key={f.id} value={f.flightNumber}>
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
            Update Stand
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
