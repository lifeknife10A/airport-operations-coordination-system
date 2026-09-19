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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Fuel,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Plane,
  Calculator,
  Search,
  Plus,
  ArrowUpRight,
  Check,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  X,
  Bell,
  UserCheck,
  Lock,
  Unlock,
  Radio,
  FileText,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { aocsDataStore } from '../../services/aocsDataStore';

// Types
export type DepartmentType = 'cleaning' | 'fuel' | 'maintenance' | 'security';

export interface CleaningCheckItem {
  id: string;
  label: string;
  mandatory: boolean;
  checked: boolean;
  category: 'CABIN' | 'GALLEY' | 'LAVATORY';
}

export interface FuelLogRecord {
  id: string;
  flightNumber: string;
  stand: string;
  targetKg: number;
  currentKg: number;
  netKg: number;
  density: number; // kg/L
  litersPumped: number;
  refuelerVerified: boolean;
  pilotVerified: boolean;
  completedAt: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
}

export interface FaultReportItem {
  id: string;
  flightNumber: string;
  aircraft: string;
  stand: string;
  title: string;
  system: 'AVIONICS' | 'HYDRAULIC' | 'ENGINE' | 'STRUCTURAL' | 'CABIN';
  severity: 'CRITICAL' | 'MAJOR' | 'RESOLVED';
  status: 'OPEN' | 'IN_REPAIR' | 'RESOLVED';
  technician: string;
  reportedAt: string;
  blocksDeparture: boolean;
}

export interface SecurityCheckItem {
  id: string;
  label: string;
  mandatory: boolean;
  checked: boolean;
}

export interface OperationalFlightInfo {
  id: string;
  flightNumber: string;
  airline: string;
  aircraft: string;
  stand: string;
  route: string;
  etd: string;
  cleaningStatus: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  fuelStatus: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  maintenanceStatus: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  securityStatus: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
}

// Initial Data
const INITIAL_FLIGHTS: OperationalFlightInfo[] = [
  {
    id: 'F-203',
    flightNumber: 'AI-203',
    airline: 'Air India',
    aircraft: 'Boeing 787-8 Dreamliner',
    stand: 'Stand G12',
    route: 'DEL → BOM',
    etd: '23:42 UTC',
    cleaningStatus: 'IN_PROGRESS',
    fuelStatus: 'IN_PROGRESS',
    maintenanceStatus: 'IN_PROGRESS',
    securityStatus: 'PENDING',
  },
  {
    id: 'F-521',
    flightNumber: '6E-521',
    airline: 'IndiGo',
    aircraft: 'Airbus A321neo',
    stand: 'Stand G08',
    route: 'BOM → BLR',
    etd: '23:33 UTC',
    cleaningStatus: 'PENDING',
    fuelStatus: 'PENDING',
    maintenanceStatus: 'COMPLETED',
    securityStatus: 'PENDING',
  },
  {
    id: 'F-901',
    flightNumber: 'UK-901',
    airline: 'Vistara',
    aircraft: 'Airbus A320neo',
    stand: 'Stand G04',
    route: 'BOM → DEL',
    etd: '23:05 UTC',
    cleaningStatus: 'COMPLETED',
    fuelStatus: 'COMPLETED',
    maintenanceStatus: 'COMPLETED',
    securityStatus: 'COMPLETED',
  },
  {
    id: 'F-102',
    flightNumber: 'SPH-102',
    airline: 'Saphire Airways',
    aircraft: 'Airbus A350-900',
    stand: 'Stand G10',
    route: 'SPH → LHR',
    etd: '23:45 UTC',
    cleaningStatus: 'COMPLETED',
    fuelStatus: 'COMPLETED',
    maintenanceStatus: 'COMPLETED',
    securityStatus: 'IN_PROGRESS',
  },
];

const INITIAL_CLEANING_CHECKLIST: CleaningCheckItem[] = [
  { id: 'c1', label: 'Main cabin carpet vacuum & seat track clean', mandatory: true, checked: true, category: 'CABIN' },
  { id: 'c2', label: 'Galley waste bins cleared & food surfaces sanitized', mandatory: true, checked: true, category: 'GALLEY' },
  { id: 'c3', label: 'Sanitize all passenger seat tray tables & armrests', mandatory: true, checked: true, category: 'CABIN' },
  { id: 'c4', label: 'Inspect seat pockets, emergency cards & life vests', mandatory: true, checked: false, category: 'CABIN' },
  { id: 'c5', label: 'Lavatory deep sterilization, mirror & soap replenishment', mandatory: true, checked: false, category: 'LAVATORY' },
];

const INITIAL_FUEL_LOGS: FuelLogRecord[] = [
  {
    id: 'FLOG-101',
    flightNumber: 'AI-203',
    stand: 'Stand G12',
    targetKg: 12000,
    currentKg: 4000,
    netKg: 8000,
    density: 0.804,
    litersPumped: 9950,
    refuelerVerified: true,
    pilotVerified: false,
    completedAt: 'Running',
    status: 'IN_PROGRESS',
  },
  {
    id: 'FLOG-102',
    flightNumber: 'UK-901',
    stand: 'Stand G04',
    targetKg: 11800,
    currentKg: 5000,
    netKg: 6800,
    density: 0.802,
    litersPumped: 8478,
    refuelerVerified: true,
    pilotVerified: true,
    completedAt: '22:30 UTC',
    status: 'COMPLETED',
  },
  {
    id: 'FLOG-103',
    flightNumber: 'SPH-102',
    stand: 'Stand G10',
    targetKg: 45000,
    currentKg: 18000,
    netKg: 27000,
    density: 0.805,
    litersPumped: 33540,
    refuelerVerified: true,
    pilotVerified: true,
    completedAt: '22:15 UTC',
    status: 'COMPLETED',
  },
];

const INITIAL_FAULTS: FaultReportItem[] = [
  {
    id: 'FLT-801',
    flightNumber: 'AI-203',
    aircraft: 'Boeing 787-8 Dreamliner',
    stand: 'Stand G12',
    title: 'Secondary hydraulic reserve pressure sensor calibration alert',
    system: 'AVIONICS',
    severity: 'CRITICAL',
    status: 'IN_REPAIR',
    technician: 'Ravi Sharma (Lead Avionics)',
    reportedAt: '22:30 UTC',
    blocksDeparture: true,
  },
  {
    id: 'FLT-802',
    flightNumber: '6E-521',
    aircraft: 'Airbus A321neo',
    stand: 'Stand G08',
    title: 'Weather deviation post-flight rudder actuator inspection',
    system: 'HYDRAULIC',
    severity: 'MAJOR',
    status: 'OPEN',
    technician: 'Arun K. (Line Maintenance)',
    reportedAt: '22:45 UTC',
    blocksDeparture: false,
  },
  {
    id: 'FLT-803',
    flightNumber: 'UK-901',
    aircraft: 'Airbus A320neo',
    stand: 'Stand G04',
    title: 'Forward cabin service overhead bin latch replacement',
    system: 'CABIN',
    severity: 'RESOLVED',
    status: 'RESOLVED',
    technician: 'Pooja Verma (Cabin Tech)',
    reportedAt: '21:50 UTC',
    blocksDeparture: false,
  },
];

const INITIAL_SECURITY_CHECKLIST: SecurityCheckItem[] = [
  { id: 's1', label: 'Overhead luggage bins interior sweep & seal check', mandatory: true, checked: true },
  { id: 's2', label: 'Under-seat life vest stowage & lifeline verification', mandatory: true, checked: true },
  { id: 's3', label: 'Lavatory service panel tampering & smoke detector check', mandatory: true, checked: true },
  { id: 's4', label: 'Emergency exit doors, slide packs & jumpseat integrity', mandatory: true, checked: true },
  { id: 's5', label: 'Forward & aft bulk cargo hold airside security sweep', mandatory: true, checked: false },
];

export const DepartmentDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Active hash-based tab / workspace
  const [activeWorkspace, setActiveWorkspace] = useState<DepartmentType>('cleaning');
  const [activeTab, setActiveTab] = useState<'workspace' | 'flights' | 'tasks' | 'notifications' | 'profile'>('workspace');

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (['cleaning', 'fuel', 'maintenance', 'security'].includes(hash)) {
      setActiveWorkspace(hash as DepartmentType);
      setActiveTab('workspace');
    } else if (['flights', 'tasks', 'notifications', 'profile'].includes(hash)) {
      setActiveTab(hash as any);
    } else {
      setActiveTab('workspace');
    }
  }, [location.hash]);

  const handleSwitchWorkspace = (dept: DepartmentType) => {
    setActiveWorkspace(dept);
    setActiveTab('workspace');
    navigate(`/dashboard/department#${dept}`);
  };

  // State: Flights & Global Tasks
  const [flights, setFlights] = useState<OperationalFlightInfo[]>(INITIAL_FLIGHTS);
  const [selectedFlight, setSelectedFlight] = useState<OperationalFlightInfo>(INITIAL_FLIGHTS[0]);

  // Interactive KPI filter states
  const [cleaningFilter, setCleaningFilter] = useState<'ALL' | 'COMPLETED' | 'IN_PROGRESS' | 'PENDING'>('ALL');
  const [fuelFilter, setFuelFilter] = useState<'ALL' | 'COMPLETED' | 'IN_PROGRESS'>('ALL');
  const [faultFilter, setFaultFilter] = useState<'ALL' | 'CRITICAL' | 'MAJOR' | 'RESOLVED'>('ALL');
  const [securityFilter, setSecurityFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING'>('ALL');

  // Cross-dashboard synchronizer with aocsDataStore
  useEffect(() => {
    const syncFromStore = () => {
      setFlights((prev) =>
        prev.map((f) => {
          const prereq = aocsDataStore.getFlightPrerequisites(f.flightNumber);
          return {
            ...f,
            cleaningStatus: prereq.cleaning ? 'COMPLETED' : f.cleaningStatus,
            fuelStatus: prereq.refueling ? 'COMPLETED' : f.fuelStatus,
            maintenanceStatus: prereq.maintenance ? 'COMPLETED' : f.maintenanceStatus,
            securityStatus: prereq.security ? 'COMPLETED' : f.securityStatus,
          };
        })
      );
    };

    syncFromStore();
    const unsub = aocsDataStore.subscribe(syncFromStore);
    return unsub;
  }, []);

  // =========================================================================
  // WORKSPACE 1: CLEANING STATE & HANDLERS
  // =========================================================================
  const [cleaningChecklist, setCleaningChecklist] = useState<CleaningCheckItem[]>(INITIAL_CLEANING_CHECKLIST);

  const toggleCleaningItem = (id: string) => {
    setCleaningChecklist(
      cleaningChecklist.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c))
    );
  };

  const mandatoryCleaningDone = cleaningChecklist.filter((c) => c.mandatory && c.checked).length;
  const mandatoryCleaningTotal = cleaningChecklist.filter((c) => c.mandatory).length;
  const isCleaningReadyToComplete = mandatoryCleaningDone === mandatoryCleaningTotal;

  const handleCompleteCleaning = () => {
    if (!isCleaningReadyToComplete) {
      toast.error('All mandatory cabin cleaning checks must be completed!');
      return;
    }
    setFlights(
      flights.map((f) => (f.id === selectedFlight.id ? { ...f, cleaningStatus: 'COMPLETED' } : f))
    );
    setSelectedFlight({ ...selectedFlight, cleaningStatus: 'COMPLETED' });

    // Cross-dashboard propagation
    aocsDataStore.updateTurnaroundTask(
      selectedFlight.flightNumber,
      'CLEANING',
      'COMPLETED',
      user?.fullName || 'Elena Tanaka'
    );
    aocsDataStore.logAuditEvent(
      'TASK',
      `Cabin cleaning certified & completed for flight ${selectedFlight.flightNumber}`,
      selectedFlight.flightNumber,
      user?.fullName || 'Elena Tanaka'
    );

    toast.success(`Cabin cleaning cleared and completed for flight ${selectedFlight.flightNumber}!`);
  };

  // =========================================================================
  // WORKSPACE 2: FUEL STATE & HANDLERS
  // =========================================================================
  const [fuelLogs, setFuelLogs] = useState<FuelLogRecord[]>(INITIAL_FUEL_LOGS);
  const [calcFlight, setCalcFlight] = useState('AI-203');
  const [targetFuelKg, setTargetFuelKg] = useState('12000');
  const [currentFuelKg, setCurrentFuelKg] = useState('4000');
  const [fuelDensity, setFuelDensity] = useState('0.804');
  const [refuelerVerified, setRefuelerVerified] = useState(false);
  const [pilotVerified, setPilotVerified] = useState(false);

  // Derived calculations
  const targetKgNum = parseFloat(targetFuelKg) || 0;
  const currentKgNum = parseFloat(currentFuelKg) || 0;
  const densityNum = parseFloat(fuelDensity) || 0.804;
  const netRequiredKg = Math.max(0, targetKgNum - currentKgNum);
  const litersToPump = densityNum > 0 ? Math.round(netRequiredKg / densityNum) : 0;
  const isFuelDualVerified = refuelerVerified && pilotVerified;

  const handleConfirmPumping = () => {
    if (!isFuelDualVerified) {
      toast.error('Refueling blocked! Both Refueler and Pilot dual verifications are required.');
      return;
    }
    const flightObj = flights.find((f) => f.flightNumber === calcFlight);
    const newLog: FuelLogRecord = {
      id: `FLOG-${Math.floor(104 + Math.random() * 800)}`,
      flightNumber: calcFlight,
      stand: flightObj ? flightObj.stand : 'Stand G12',
      targetKg: targetKgNum,
      currentKg: currentKgNum,
      netKg: netRequiredKg,
      density: densityNum,
      litersPumped: litersToPump,
      refuelerVerified: true,
      pilotVerified: true,
      completedAt: 'Just now (UTC)',
      status: 'COMPLETED',
    };

    setFuelLogs([newLog, ...fuelLogs]);
    setFlights(
      flights.map((f) => (f.flightNumber === calcFlight ? { ...f, fuelStatus: 'COMPLETED' } : f))
    );

    // Cross-dashboard propagation
    aocsDataStore.updateTurnaroundTask(
      calcFlight,
      'REFUELING',
      'COMPLETED',
      user?.fullName || 'Fuel Specialist'
    );
    aocsDataStore.logAuditEvent(
      'FUEL',
      `Fuel pumped: ${litersToPump.toLocaleString()}L (${netRequiredKg.toLocaleString()}kg Jet A-1) into ${calcFlight} at ${flightObj ? flightObj.stand : 'Stand G12'}. Dual-verified.`,
      calcFlight,
      user?.fullName || 'Fuel Specialist'
    );

    toast.success(`Refueling logged & verified for ${calcFlight}: ${litersToPump.toLocaleString()} Liters pumped.`);
    setRefuelerVerified(false);
    setPilotVerified(false);
  };

  // =========================================================================
  // WORKSPACE 3: MAINTENANCE STATE & HANDLERS
  // =========================================================================
  const [faults, setFaults] = useState<FaultReportItem[]>(INITIAL_FAULTS);
  const activeCriticalFaults = faults.filter((f) => f.flightNumber === selectedFlight.flightNumber && f.severity === 'CRITICAL' && f.status !== 'RESOLVED');
  const isMaintenanceCleared = activeCriticalFaults.length === 0;

  const handleResolveFault = (faultId: string) => {
    setFaults(
      faults.map((f) => (f.id === faultId ? { ...f, status: 'RESOLVED', severity: 'RESOLVED' } : f))
    );
    // If resolving AI-203 fault, update flight maintenance status
    setFlights(
      flights.map((fl) => (fl.flightNumber === selectedFlight.flightNumber ? { ...fl, maintenanceStatus: 'COMPLETED' } : fl))
    );
    setSelectedFlight({ ...selectedFlight, maintenanceStatus: 'COMPLETED' });

    // Cross-dashboard propagation
    aocsDataStore.updateTurnaroundTask(
      selectedFlight.flightNumber,
      'MAINTENANCE',
      'COMPLETED',
      user?.fullName || 'Line Maintenance Engineer'
    );
    aocsDataStore.logAuditEvent(
      'TASK',
      `Maintenance defect ${faultId} resolved. Airworthiness certified for ${selectedFlight.flightNumber}`,
      selectedFlight.flightNumber,
      user?.fullName || 'Line Maintenance'
    );

    toast.success(`Defect ${faultId} resolved. Aircraft airworthiness certificate signed!`);
  };

  // =========================================================================
  // WORKSPACE 4: SECURITY STATE & HANDLERS
  // =========================================================================
  const [securityChecklist, setSecurityChecklist] = useState<SecurityCheckItem[]>(INITIAL_SECURITY_CHECKLIST);
  const [securityPin, setSecurityPin] = useState('');
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [isSecurityCleared, setIsSecurityCleared] = useState(false);

  const toggleSecurityItem = (id: string) => {
    setSecurityChecklist(
      securityChecklist.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s))
    );
  };

  const allSecurityChecked = securityChecklist.every((s) => s.checked);

  const handleVerifySecurityPin = () => {
    if (securityPin.trim().length !== 4) {
      toast.error('Security verification requires a 4-digit operational PIN.');
      return;
    }
    setIsSecurityCleared(true);
    setFlights(
      flights.map((f) => (f.id === selectedFlight.id ? { ...f, securityStatus: 'COMPLETED' } : f))
    );
    setSelectedFlight({ ...selectedFlight, securityStatus: 'COMPLETED' });

    // Cross-dashboard propagation
    aocsDataStore.updateTurnaroundTask(
      selectedFlight.flightNumber,
      'SECURITY',
      'COMPLETED',
      user?.fullName || 'Airside Security Officer'
    );
    aocsDataStore.logAuditEvent(
      'SECURITY',
      `Cabin and airside security sweep validated with PIN clearance for ${selectedFlight.flightNumber}`,
      selectedFlight.flightNumber,
      user?.fullName || 'Security Officer'
    );

    toast.success(`Security Clearance Granted for ${selectedFlight.flightNumber}! Boarding unlocked.`);
    setPinModalOpen(false);
    setSecurityPin('');
  };

  return (
    <DashboardLayout activeRole="department">
      <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
        {/* ========================================================================= */}
        {/* TOP DEPARTMENT WORKSPACE SWITCHER PILLS                                    */}
        {/* ========================================================================= */}
        {activeTab === 'workspace' && (
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
                  icon={<Radio size={12} color="#0284C7" />}
                  label="DEPARTMENT OPERATIONS CONSOLE"
                  size="small"
                  sx={{
                    bgcolor: '#E0F2FE',
                    color: '#0369A1',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: '0.66rem',
                    height: '20px',
                  }}
                />
                <Typography sx={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600 }}>
                  DISPATCH TELEMETRY ACTIVE
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', letterSpacing: '-0.02em' }}>
                {activeWorkspace === 'cleaning' && 'Cabin Cleaning Operations'}
                {activeWorkspace === 'fuel' && 'Jet A-1 Refueling Telemetry & Calculator'}
                {activeWorkspace === 'maintenance' && 'Aircraft Maintenance & Airworthiness Workbench'}
                {activeWorkspace === 'security' && 'Airside Security Clearance & Cabin Sweeper'}
              </Typography>
              <Typography sx={{ fontSize: '0.86rem', color: '#64748B', mt: 0.2 }}>
                Staff Lead: Elena Tanaka · Saphire Apron Specialized Department Services
              </Typography>
            </Box>

            {/* 4 Department Workspace Switchers */}
            <Box sx={{ display: 'flex', backgroundColor: '#FFFFFF', p: 0.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              {(
                [
                  { id: 'cleaning', label: 'Cleaning', icon: <Sparkles size={16} /> },
                  { id: 'fuel', label: 'Fuel', icon: <Fuel size={16} /> },
                  { id: 'maintenance', label: 'Maintenance', icon: <Wrench size={16} /> },
                  { id: 'security', label: 'Security', icon: <ShieldCheck size={16} /> },
                ] as const
              ).map((w) => (
                <Button
                  key={w.id}
                  size="small"
                  startIcon={w.icon}
                  onClick={() => handleSwitchWorkspace(w.id)}
                  sx={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    px: 1.8,
                    py: 0.7,
                    borderRadius: '9px',
                    textTransform: 'none',
                    backgroundColor: activeWorkspace === w.id ? '#0F2942' : 'transparent',
                    color: activeWorkspace === w.id ? '#FFFFFF' : '#64748B',
                    '&:hover': {
                      backgroundColor: activeWorkspace === w.id ? '#1E3A5F' : '#F1F5F9',
                    },
                  }}
                >
                  {w.label}
                </Button>
              ))}
            </Box>
          </Box>
        )}

        {/* ========================================================================= */}
        {/* WORKSPACE 1: CLEANING DEPARTMENT                                         */}
        {/* ========================================================================= */}
        {activeWorkspace === 'cleaning' && activeTab === 'workspace' && (
          <Box>
            {/* KPI Strip */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5, mb: 3.5 }}>
              <Card
                elevation={0}
                onClick={() => setCleaningFilter('ALL')}
                sx={{
                  p: 2.5,
                  backgroundColor: cleaningFilter === 'ALL' ? '#F0F9FF' : '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: cleaningFilter === 'ALL' ? '#0284C7' : '#E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)', borderColor: '#0284C7' },
                }}
              >
                <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>{flights.length}</Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#475569', mt: 0.5 }}>Assigned Flights</Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>Total flights under apron turn</Typography>
              </Card>

              <Card
                elevation={0}
                onClick={() => setCleaningFilter(cleaningFilter === 'IN_PROGRESS' ? 'ALL' : 'IN_PROGRESS')}
                sx={{
                  p: 2.5,
                  backgroundColor: cleaningFilter === 'IN_PROGRESS' ? '#F0F9FF' : '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: cleaningFilter === 'IN_PROGRESS' ? '#0284C7' : '#E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)', borderColor: '#0284C7' },
                }}
              >
                <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0284C7' }}>
                  {flights.filter((f) => f.cleaningStatus === 'IN_PROGRESS').length}
                </Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#475569', mt: 0.5 }}>Active Cleaning Tasks</Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>Cabin Hygiene Alpha deployed</Typography>
              </Card>

              <Card
                elevation={0}
                onClick={() => setCleaningFilter(cleaningFilter === 'COMPLETED' ? 'ALL' : 'COMPLETED')}
                sx={{
                  p: 2.5,
                  backgroundColor: cleaningFilter === 'COMPLETED' ? '#F0FDF4' : '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: cleaningFilter === 'COMPLETED' ? '#10B981' : '#E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)', borderColor: '#10B981' },
                }}
              >
                <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#10B981' }}>
                  {flights.filter((f) => f.cleaningStatus === 'COMPLETED').length} / {flights.length}
                </Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#475569', mt: 0.5 }}>Completed Turns</Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
                  {Math.round((flights.filter((f) => f.cleaningStatus === 'COMPLETED').length / (flights.length || 1)) * 100)}% on schedule
                </Typography>
              </Card>

              <Card
                elevation={0}
                onClick={() => setCleaningFilter(cleaningFilter === 'PENDING' ? 'ALL' : 'PENDING')}
                sx={{
                  p: 2.5,
                  backgroundColor: cleaningFilter === 'PENDING' ? '#FEF2F2' : '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: cleaningFilter === 'PENDING' ? '#DC2626' : '#E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)', borderColor: '#DC2626' },
                }}
              >
                <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#DC2626' }}>
                  {flights.filter((f) => f.cleaningStatus === 'PENDING').length}
                </Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#DC2626', mt: 0.5 }}>Pending Turnaround</Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>Awaiting crew dispatch</Typography>
              </Card>
            </Box>

            {/* Split View: Left Cleaning Queue / Right Hero Cabin Checklist */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '6.5fr 3.5fr' }, gap: 3, mb: 3.5 }}>
              {/* Cleaning Queue */}
              <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <Box sx={{ p: 2.5, borderBottom: '1px solid #E2E8F0', backgroundColor: '#FAFAFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                      Active Cleaning Operations
                    </Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: '#64748B' }}>
                      Select an aircraft stand to inspect live cabin checklist.
                    </Typography>
                  </Box>
                  {cleaningFilter !== 'ALL' && (
                    <Chip
                      label={`Filter: ${cleaningFilter}`}
                      size="small"
                      onDelete={() => setCleaningFilter('ALL')}
                      sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 700 }}
                    />
                  )}
                </Box>

                <TableContainer sx={{ overflowX: 'hidden' }}>
                  <Table size="small" sx={{ width: '100%', tableLayout: 'fixed', '& .MuiTableCell-root': { py: 1.5, px: 1.5 } }}>
                    <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                      <TableRow>
                        <TableCell sx={{ width: '22%', pl: 2.5, fontWeight: 800, color: '#64748B', fontSize: '0.72rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>FLIGHT / STAND</TableCell>
                        <TableCell sx={{ width: '30%', fontWeight: 800, color: '#64748B', fontSize: '0.72rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>AIRCRAFT & ROUTE</TableCell>
                        <TableCell sx={{ width: '14%', fontWeight: 800, color: '#64748B', fontSize: '0.72rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>ETD</TableCell>
                        <TableCell sx={{ width: '20%', fontWeight: 800, color: '#64748B', fontSize: '0.72rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>STATUS</TableCell>
                        <TableCell align="right" sx={{ width: '14%', pr: 2.5, fontWeight: 800, color: '#64748B', fontSize: '0.72rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>ACTION</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {flights
                        .filter((f) => cleaningFilter === 'ALL' || f.cleaningStatus === cleaningFilter)
                        .map((f) => {
                        const isSelected = selectedFlight.id === f.id;
                        return (
                          <TableRow
                            key={f.id}
                            hover
                            onClick={() => setSelectedFlight(f)}
                            sx={{
                              cursor: 'pointer',
                              backgroundColor: isSelected ? 'rgba(2, 132, 199, 0.05)' : 'inherit',
                              '&:hover': { backgroundColor: isSelected ? 'rgba(2, 132, 199, 0.08)' : 'rgba(2, 132, 199, 0.04)' },
                            }}
                          >
                            <TableCell sx={{ pl: 2.5, whiteSpace: 'nowrap' }}>
                              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.88rem', color: '#0F2942', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                                {f.flightNumber}
                              </Typography>
                              <Typography sx={{ fontSize: '0.74rem', color: '#0284C7', fontWeight: 700, mt: 0.3, whiteSpace: 'nowrap' }}>
                                {f.stand}
                              </Typography>
                            </TableCell>

                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>{f.aircraft}</Typography>
                              <Typography sx={{ fontSize: '0.72rem', color: '#64748B', whiteSpace: 'nowrap' }}>{f.route}</Typography>
                            </TableCell>

                            <TableCell sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F2942', whiteSpace: 'nowrap' }}>{f.etd}</TableCell>

                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                              {f.cleaningStatus === 'COMPLETED' ? (
                                <Chip label="✓ COMPLETED" size="small" sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '0.68rem', whiteSpace: 'nowrap' }} />
                              ) : f.cleaningStatus === 'IN_PROGRESS' ? (
                                <Chip label="● IN PROGRESS" size="small" sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 800, fontSize: '0.68rem', whiteSpace: 'nowrap' }} />
                              ) : (
                                <Chip label="○ PENDING" size="small" sx={{ bgcolor: '#F1F5F9', color: '#64748B', fontWeight: 700, fontSize: '0.68rem', whiteSpace: 'nowrap' }} />
                              )}
                            </TableCell>

                            <TableCell align="right" sx={{ pr: 2.5, whiteSpace: 'nowrap' }}>
                              <Button
                                size="small"
                                variant={isSelected ? 'contained' : 'outlined'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedFlight(f);
                                }}
                                sx={{
                                  fontFamily: "'Outfit', sans-serif",
                                  fontWeight: 700,
                                  fontSize: '0.72rem',
                                  textTransform: 'none',
                                  borderRadius: '6px',
                                  backgroundColor: isSelected ? '#0F2942' : 'transparent',
                                  color: isSelected ? '#FFFFFF' : '#475569',
                                  px: 1.5,
                                }}
                              >
                                {isSelected ? 'Active' : 'Select'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>

              {/* HERO COMPONENT: CABIN CHECKLIST */}
              <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', p: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                        {selectedFlight.flightNumber} • Cabin Cleaning Checklist
                      </Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: '#64748B' }}>
                        {selectedFlight.stand} · Mandatory sanitation checks before passenger boarding.
                      </Typography>
                    </Box>
                    <Chip
                      label={`${mandatoryCleaningDone} / ${mandatoryCleaningTotal}`}
                      size="small"
                      sx={{ bgcolor: isCleaningReadyToComplete ? '#DCFCE7' : '#EFF6FF', color: isCleaningReadyToComplete ? '#15803D' : '#0284C7', fontWeight: 800 }}
                    />
                  </Box>

                  {/* Progress bar */}
                  <LinearProgress
                    variant="determinate"
                    value={Math.round((mandatoryCleaningDone / mandatoryCleaningTotal) * 100)}
                    sx={{ height: 6, borderRadius: 3, mb: 2.5, backgroundColor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: isCleaningReadyToComplete ? '#10B981' : '#0284C7' } }}
                  />

                  {/* Checklist Items */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {cleaningChecklist.map((item) => (
                      <Box
                        key={item.id}
                        onClick={() => toggleCleaningItem(item.id)}
                        sx={{
                          p: 1.5,
                          borderRadius: '10px',
                          border: '1px solid',
                          borderColor: item.checked ? '#CBD5E1' : '#E2E8F0',
                          backgroundColor: item.checked ? '#F8FAFC' : '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          '&:hover': { bgcolor: '#F1F5F9' },
                        }}
                      >
                        <Checkbox
                          checked={item.checked}
                          size="small"
                          sx={{ p: 0, color: '#94A3B8', '&.Mui-checked': { color: '#10B981' } }}
                        />
                        <Typography sx={{ fontSize: '0.84rem', fontWeight: 600, color: item.checked ? '#1E293B' : '#64748B', textDecoration: item.checked ? 'line-through' : 'none' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Complete Action */}
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #E2E8F0' }}>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={!isCleaningReadyToComplete || selectedFlight.cleaningStatus === 'COMPLETED'}
                    onClick={handleCompleteCleaning}
                    sx={{
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      textTransform: 'none',
                      borderRadius: '10px',
                      py: 1.2,
                      boxShadow: isCleaningReadyToComplete ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
                      '&:hover': { backgroundColor: '#059669' },
                    }}
                  >
                    {selectedFlight.cleaningStatus === 'COMPLETED' ? '✓ Cabin Cleaning Verified & Completed' : isCleaningReadyToComplete ? 'Complete Cleaning & Clear Cabin' : `Incomplete Checks (${mandatoryCleaningDone}/${mandatoryCleaningTotal})`}
                  </Button>
                </Box>
              </Card>
            </Box>
          </Box>
        )}

        {/* ========================================================================= */}
        {/* WORKSPACE 2: FUEL DEPARTMENT (HERO CALCULATOR + DUAL VERIFICATION)         */}
        {/* ========================================================================= */}
        {activeWorkspace === 'fuel' && activeTab === 'workspace' && (
          <Box>
            {/* KPI Strip */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5, mb: 3.5 }}>
              <Card
                elevation={0}
                onClick={() => setFuelFilter(fuelFilter === 'COMPLETED' ? 'ALL' : 'COMPLETED')}
                sx={{
                  p: 2.5,
                  backgroundColor: fuelFilter === 'COMPLETED' ? '#F0FDF4' : '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: fuelFilter === 'COMPLETED' ? '#10B981' : '#E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)', borderColor: '#10B981' },
                }}
              >
                <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                  {fuelLogs.filter((f) => f.status === 'COMPLETED').length}
                </Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#475569', mt: 0.5 }}>Completed Operations</Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>Refueling operations closed</Typography>
              </Card>

              <Card
                elevation={0}
                sx={{ p: 2.5, backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}
              >
                <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0284C7' }}>
                  {fuelLogs.reduce((acc, l) => acc + l.litersPumped, 0).toLocaleString()} L
                </Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#475569', mt: 0.5 }}>Jet A-1 Fuel Pumped</Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>Total throughput logged</Typography>
              </Card>

              <Card
                elevation={0}
                sx={{ p: 2.5, backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}
              >
                <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                  {(fuelLogs.reduce((acc, l) => acc + l.density, 0) / (fuelLogs.length || 1)).toFixed(3)}
                </Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#475569', mt: 0.5 }}>Average Density (kg/L)</Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>Standard temperature calibrated</Typography>
              </Card>

              <Card
                elevation={0}
                onClick={() => setFuelFilter(fuelFilter === 'IN_PROGRESS' ? 'ALL' : 'IN_PROGRESS')}
                sx={{
                  p: 2.5,
                  backgroundColor: fuelFilter === 'IN_PROGRESS' ? '#FEF3C7' : '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: fuelFilter === 'IN_PROGRESS' ? '#D97706' : '#E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)', borderColor: '#D97706' },
                }}
              >
                <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#D97706' }}>
                  {fuelLogs.filter((f) => f.status !== 'COMPLETED' || !f.pilotVerified).length}
                </Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#D97706', mt: 0.5 }}>Awaiting Dual Verification</Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>Pilot sign-off pending</Typography>
              </Card>
            </Box>

            {/* Split: HERO FUEL CALCULATOR (55%) & RECENT FUEL LOGS (45%) */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '6fr 4fr' }, gap: 3, mb: 3.5 }}>
              {/* HERO INTERACTIVE FUEL CALCULATOR */}
              <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                      Refueling Calculator & Telemetry
                    </Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: '#64748B' }}>
                      Net Weight = Target - Current · Liters to Pump = Net Weight ÷ Density
                    </Typography>
                  </Box>
                  <Chip
                    icon={<Calculator size={14} />}
                    label="BUSINESS LOGIC ACTIVE"
                    size="small"
                    sx={{ bgcolor: '#EFF6FF', color: '#0284C7', fontWeight: 800, fontSize: '0.68rem' }}
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2.5 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Flight Number</InputLabel>
                    <Select
                      value={calcFlight}
                      label="Flight Number"
                      onChange={(e) => setCalcFlight(e.target.value)}
                    >
                      {flights.map((f) => (
                        <MenuItem key={f.id} value={f.flightNumber}>
                          {f.flightNumber} ({f.stand})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Fuel Density (kg/L)"
                    size="small"
                    value={fuelDensity}
                    onChange={(e) => setFuelDensity(e.target.value)}
                    fullWidth
                  />

                  <TextField
                    label="Target Fuel Weight (kg)"
                    size="small"
                    value={targetFuelKg}
                    onChange={(e) => setTargetFuelKg(e.target.value)}
                    fullWidth
                  />

                  <TextField
                    label="Current Fuel Weight (kg)"
                    size="small"
                    value={currentFuelKg}
                    onChange={(e) => setCurrentFuelKg(e.target.value)}
                    fullWidth
                  />
                </Box>

                {/* Calculation Output Card */}
                <Box sx={{ p: 2.5, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', mb: 3 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>NET FUEL REQUIRED</Typography>
                      <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                        {netRequiredKg.toLocaleString()} <span style={{ fontSize: '0.9rem', color: '#64748B' }}>kg</span>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>LITERS TO PUMP</Typography>
                      <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0284C7' }}>
                        {litersToPump.toLocaleString()} <span style={{ fontSize: '0.9rem', color: '#64748B' }}>L</span>
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Dual Verification System */}
                <Box sx={{ p: 2, borderRadius: '12px', border: '1px solid', borderColor: isFuelDualVerified ? '#BBF7D0' : '#FED7AA', bgcolor: isFuelDualVerified ? '#F0FDF4' : '#FFFBEB', mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.86rem', color: isFuelDualVerified ? '#15803D' : '#C2410C' }}>
                      DUAL SAFETY SIGN-OFF
                    </Typography>
                    <Chip
                      icon={isFuelDualVerified ? <Unlock size={12} color="#15803D" /> : <Lock size={12} color="#C2410C" />}
                      label={isFuelDualVerified ? 'SAFETY CLEARED' : 'FUEL LOCKED'}
                      size="small"
                      sx={{ bgcolor: isFuelDualVerified ? '#DCFCE7' : '#FEE2E2', color: isFuelDualVerified ? '#15803D' : '#DC2626', fontWeight: 800, fontSize: '0.68rem' }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <FormControlLabel
                      control={<Checkbox checked={refuelerVerified} onChange={(e) => setRefuelerVerified(e.target.checked)} size="small" />}
                      label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Refueler Verified (Arjun Mehta)</Typography>}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={pilotVerified} onChange={(e) => setPilotVerified(e.target.checked)} size="small" />}
                      label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Pilot / FO Verified (Capt. Deshmukh)</Typography>}
                    />
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  disabled={!isFuelDualVerified}
                  onClick={handleConfirmPumping}
                  sx={{
                    backgroundColor: '#0F2942',
                    color: '#FFFFFF',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    textTransform: 'none',
                    borderRadius: '10px',
                    py: 1.1,
                    '&:hover': { backgroundColor: '#1E3A5F' },
                  }}
                >
                  Confirm Pumping & Record Fuel Transaction
                </Button>
              </Card>

              {/* RECENT FUEL LOGS */}
              <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <Box sx={{ p: 2.5, borderBottom: '1px solid #E2E8F0', backgroundColor: '#FAFAFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                      Recent Fuel Logs & Audits
                    </Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: '#64748B' }}>
                      Persisted fuel transactions with density calibration.
                    </Typography>
                  </Box>
                  {fuelFilter !== 'ALL' && (
                    <Chip
                      label={`Filter: ${fuelFilter}`}
                      size="small"
                      onDelete={() => setFuelFilter('ALL')}
                      sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 700 }}
                    />
                  )}
                </Box>

                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {fuelLogs
                    .filter((log) => fuelFilter === 'ALL' || (fuelFilter === 'COMPLETED' ? log.status === 'COMPLETED' : log.status !== 'COMPLETED'))
                    .map((log) => (
                    <Box key={log.id} sx={{ p: 1.8, borderRadius: '10px', border: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 800, color: '#0F2942', fontSize: '0.9rem' }}>
                          {log.flightNumber} · <span style={{ color: '#0284C7' }}>{log.stand}</span>
                        </Typography>
                        <Chip
                          label={`${log.litersPumped.toLocaleString()} L`}
                          size="small"
                          sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 800, fontSize: '0.72rem' }}
                        />
                      </Box>
                      <Typography sx={{ fontSize: '0.76rem', color: '#64748B' }}>
                        Net: <strong>{log.netKg.toLocaleString()} kg</strong> · Density: {log.density} kg/L · {log.completedAt}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Box>
          </Box>
        )}

        {/* ========================================================================= */}
        {/* WORKSPACE 3: MAINTENANCE DEPARTMENT                                      */}
        {/* ========================================================================= */}
        {activeWorkspace === 'maintenance' && activeTab === 'workspace' && (
          <Box>
            {/* KPI Strip */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5, mb: 3.5 }}>
              <Card
                elevation={0}
                onClick={() => setFaultFilter('ALL')}
                sx={{
                  p: 2.5,
                  backgroundColor: faultFilter === 'ALL' ? '#F0F9FF' : '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: faultFilter === 'ALL' ? '#0284C7' : '#E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)', borderColor: '#0284C7' },
                }}
              >
                <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>{flights.length}</Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#475569', mt: 0.5 }}>Aircraft Monitored</Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>Under active line inspection</Typography>
              </Card>

              <Card
                elevation={0}
                onClick={() => setFaultFilter(faultFilter === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
                sx={{
                  p: 2.5,
                  backgroundColor: faultFilter === 'CRITICAL' ? '#FEF2F2' : '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: faultFilter === 'CRITICAL' ? '#DC2626' : '#E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)', borderColor: '#DC2626' },
                }}
              >
                <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#DC2626' }}>
                  {faults.filter((f) => f.severity === 'CRITICAL' && f.status !== 'RESOLVED').length}
                </Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#DC2626', mt: 0.5 }}>Critical Defects</Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>Blocks departure clearance</Typography>
              </Card>

              <Card
                elevation={0}
                onClick={() => setFaultFilter(faultFilter === 'RESOLVED' ? 'ALL' : 'RESOLVED')}
                sx={{
                  p: 2.5,
                  backgroundColor: faultFilter === 'RESOLVED' ? '#F0FDF4' : '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: faultFilter === 'RESOLVED' ? '#10B981' : '#E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)', borderColor: '#10B981' },
                }}
              >
                <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#10B981' }}>
                  {flights.filter((f) => f.maintenanceStatus === 'COMPLETED').length} / {flights.length}
                </Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#475569', mt: 0.5 }}>Airworthy Cleared</Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>Departure certificates signed</Typography>
              </Card>

              <Card elevation={0} sx={{ p: 2.5, backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                  {Math.round((flights.filter((f) => f.maintenanceStatus === 'COMPLETED').length / (flights.length || 1)) * 100)}%
                </Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#475569', mt: 0.5 }}>Technical Dispatch SLA</Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>Live airworthiness health</Typography>
              </Card>
            </Box>

            {/* Split: TECHNICAL BOARD (60%) & FAULTS + PROMINENT CLEARANCE (40%) */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '6fr 4fr' }, gap: 3, mb: 3.5 }}>
              {/* Aircraft Technical Board */}
              <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', p: 3 }}>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mb: 0.5 }}>
                  Aircraft Technical Board: {selectedFlight.flightNumber}
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#64748B', mb: 3 }}>
                  {selectedFlight.aircraft} · {selectedFlight.stand} · Avionics and structural health telemetry.
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                  {[
                    { label: 'Structural Inspection', status: 'PASSED', note: 'Fuselage, wings & flaps nominal', ok: true },
                    { label: 'Engine & APU Pressure', status: 'PASSED', note: 'Turbine compression within bounds', ok: true },
                    { label: 'Avionics & Telemetry', status: isMaintenanceCleared ? 'PASSED' : 'FAULT DETECTED', note: isMaintenanceCleared ? 'All sensors synchronized' : 'Hydraulic reserve sensor check in progress', ok: isMaintenanceCleared },
                    { label: 'Landing Gear & Brakes', status: 'PASSED', note: 'Brake pads & tire pressure ok', ok: true },
                  ].map((sys, idx) => (
                    <Box key={idx} sx={{ p: 2, borderRadius: '12px', border: '1px solid', borderColor: sys.ok ? '#E2E8F0' : '#FECACA', bgcolor: sys.ok ? '#F8FAFC' : '#FEF2F2' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.6 }}>
                        <Typography sx={{ fontWeight: 800, color: '#0F2942', fontSize: '0.86rem' }}>{sys.label}</Typography>
                        <Chip
                          label={sys.status}
                          size="small"
                          sx={{ bgcolor: sys.ok ? '#DCFCE7' : '#FEE2E2', color: sys.ok ? '#15803D' : '#DC2626', fontWeight: 800, fontSize: '0.66rem' }}
                        />
                      </Box>
                      <Typography sx={{ fontSize: '0.74rem', color: '#64748B' }}>{sys.note}</Typography>
                    </Box>
                  ))}
                </Box>

                {/* Maintenance Task Timeline */}
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.82rem', color: '#64748B', mb: 1.5, letterSpacing: '0.05em' }}>
                  TURNAROUND TECHNICAL TIMELINE
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  {[
                    { step: '1. Line Inspection', done: true },
                    { step: '2. Defect Logging', done: true },
                    { step: '3. Sensor Repair', done: isMaintenanceCleared },
                    { step: '4. Sign-off', done: isMaintenanceCleared },
                  ].map((st, i) => (
                    <Box key={i} sx={{ textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: st.done ? '#10B981' : '#64748B' }}>
                        {st.done ? '✓' : '○'} {st.step}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Card>

              {/* Right: Prominent Clearance Card & Faults */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* HERO PROMINENT CLEARANCE STATUS */}
                <Card
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1.5px solid',
                    borderColor: isMaintenanceCleared ? '#10B981' : '#DC2626',
                    backgroundColor: isMaintenanceCleared ? '#F0FDF4' : '#FEF2F2',
                  }}
                >
                  <Typography sx={{ fontSize: '0.76rem', fontWeight: 800, color: isMaintenanceCleared ? '#15803D' : '#DC2626', letterSpacing: '0.08em', mb: 0.5 }}>
                    AIRWORTHINESS DISPATCH STATUS
                  </Typography>
                  <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: isMaintenanceCleared ? '#15803D' : '#DC2626', mb: 1 }}>
                    {isMaintenanceCleared ? '✓ MAINTENANCE CLEARED' : '⚠ NOT CLEARED (DEPARTURE BLOCKED)'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.82rem', color: isMaintenanceCleared ? '#166534' : '#991B1B', mb: 2 }}>
                    {isMaintenanceCleared
                      ? 'All aircraft subsystems passed pre-flight sign-off. Boarding clearance authorized.'
                      : '1 critical avionics defect requires resolution before pushback clearance.'}
                  </Typography>

                  {!isMaintenanceCleared && (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleResolveFault('FLT-801')}
                      sx={{
                        backgroundColor: '#DC2626',
                        color: '#FFFFFF',
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 700,
                        textTransform: 'none',
                        borderRadius: '8px',
                        '&:hover': { backgroundColor: '#B91C1C' },
                      }}
                    >
                      Resolve Fault & Issue Technical Clearance
                    </Button>
                  )}
                </Card>

                {/* Faults list */}
                <Card elevation={0} sx={{ p: 2.5, backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                      Active Defect Tickets
                    </Typography>
                    {faultFilter !== 'ALL' && (
                      <Chip
                        label={`Filter: ${faultFilter}`}
                        size="small"
                        onDelete={() => setFaultFilter('ALL')}
                        sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 700 }}
                      />
                    )}
                  </Box>
                  {faults
                    .filter((flt) =>
                      faultFilter === 'ALL'
                        ? true
                        : faultFilter === 'RESOLVED'
                        ? flt.status === 'RESOLVED'
                        : faultFilter === 'CRITICAL'
                        ? flt.severity === 'CRITICAL' && flt.status !== 'RESOLVED'
                        : flt.severity === faultFilter
                    )
                    .map((flt) => (
                    <Box key={flt.id} sx={{ p: 1.5, borderRadius: '10px', border: '1px solid #E2E8F0', mb: 1, bgcolor: flt.severity === 'CRITICAL' ? '#FEF2F2' : '#FFFFFF' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.84rem', color: '#0F2942' }}>{flt.flightNumber} · {flt.system}</Typography>
                        <Chip
                          label={flt.severity}
                          size="small"
                          sx={{
                            bgcolor: flt.severity === 'CRITICAL' ? '#FEE2E2' : flt.severity === 'MAJOR' ? '#FEF3C7' : '#DCFCE7',
                            color: flt.severity === 'CRITICAL' ? '#DC2626' : flt.severity === 'MAJOR' ? '#D97706' : '#15803D',
                            fontWeight: 800,
                            fontSize: '0.64rem',
                          }}
                        />
                      </Box>
                      <Typography sx={{ fontSize: '0.76rem', color: '#64748B', mt: 0.3 }}>{flt.title}</Typography>
                    </Box>
                  ))}
                </Card>
              </Box>
            </Box>
          </Box>
        )}

        {/* ========================================================================= */}
        {/* WORKSPACE 4: SECURITY DEPARTMENT (CHECKLIST + SECURE PIN SIGN-OFF)        */}
        {/* ========================================================================= */}
        {activeWorkspace === 'security' && activeTab === 'workspace' && (
          <Box>
            {/* KPI Strip */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5, mb: 3.5 }}>
              <Card
                elevation={0}
                onClick={() => setSecurityFilter('ALL')}
                sx={{
                  p: 2.5,
                  backgroundColor: securityFilter === 'ALL' ? '#F0F9FF' : '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: securityFilter === 'ALL' ? '#0284C7' : '#E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)', borderColor: '#0284C7' },
                }}
              >
                <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>{flights.length}</Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#475569', mt: 0.5 }}>Airside Flights</Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>On active terminal stands</Typography>
              </Card>

              <Card
                elevation={0}
                onClick={() => setSecurityFilter(securityFilter === 'COMPLETED' ? 'ALL' : 'COMPLETED')}
                sx={{
                  p: 2.5,
                  backgroundColor: securityFilter === 'COMPLETED' ? '#F0FDF4' : '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: securityFilter === 'COMPLETED' ? '#10B981' : '#E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)', borderColor: '#10B981' },
                }}
              >
                <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#10B981' }}>
                  {flights.filter((f) => f.securityStatus === 'COMPLETED').length} / {flights.length}
                </Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#475569', mt: 0.5 }}>Security Cleared</Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>PIN sign-off certified</Typography>
              </Card>

              <Card
                elevation={0}
                onClick={() => setSecurityFilter(securityFilter === 'PENDING' ? 'ALL' : 'PENDING')}
                sx={{
                  p: 2.5,
                  backgroundColor: securityFilter === 'PENDING' ? '#FEF3C7' : '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: securityFilter === 'PENDING' ? '#D97706' : '#E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)', borderColor: '#D97706' },
                }}
              >
                <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0284C7' }}>
                  {flights.filter((f) => f.securityStatus !== 'COMPLETED').length}
                </Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#475569', mt: 0.5 }}>Sweeps In Progress</Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>Canine & officer team active</Typography>
              </Card>

              <Card elevation={0} sx={{ p: 2.5, backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#DC2626' }}>0</Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#DC2626', mt: 0.5 }}>Security Breaches</Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>Sterile corridor perimeter intact</Typography>
              </Card>
            </Box>

            {/* Split View: Security Clearance Board & Hero Security PIN Sign-off */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '6.5fr 3.5fr' }, gap: 3, mb: 3.5 }}>
              {/* Security Clearance Board */}
              <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <Box sx={{ p: 2.5, borderBottom: '1px solid #E2E8F0', backgroundColor: '#FAFAFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                      Security Clearance Matrix
                    </Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: '#64748B' }}>
                      Aircraft cabin search progress and passenger boarding clearance status.
                    </Typography>
                  </Box>
                  {securityFilter !== 'ALL' && (
                    <Chip
                      label={`Filter: ${securityFilter}`}
                      size="small"
                      onDelete={() => setSecurityFilter('ALL')}
                      sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 700 }}
                    />
                  )}
                </Box>

                <TableContainer sx={{ overflowX: 'hidden' }}>
                  <Table size="small" sx={{ width: '100%', tableLayout: 'fixed', '& .MuiTableCell-root': { py: 1.5, px: 1.5 } }}>
                    <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                      <TableRow>
                        <TableCell sx={{ width: '24%', pl: 2.5, fontWeight: 800, color: '#64748B', fontSize: '0.72rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>FLIGHT / STAND</TableCell>
                        <TableCell sx={{ width: '28%', fontWeight: 800, color: '#64748B', fontSize: '0.72rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>AIRCRAFT</TableCell>
                        <TableCell align="center" sx={{ width: '14%', fontWeight: 800, color: '#64748B', fontSize: '0.72rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>CHECKLIST</TableCell>
                        <TableCell sx={{ width: '22%', fontWeight: 800, color: '#64748B', fontSize: '0.72rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>STATUS</TableCell>
                        <TableCell align="right" sx={{ width: '12%', pr: 2.5, fontWeight: 800, color: '#64748B', fontSize: '0.72rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>ACTION</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {flights
                        .filter((f) =>
                          securityFilter === 'ALL'
                            ? true
                            : securityFilter === 'COMPLETED'
                            ? f.securityStatus === 'COMPLETED'
                            : f.securityStatus !== 'COMPLETED'
                        )
                        .map((f) => (
                        <TableRow key={f.id} hover onClick={() => setSelectedFlight(f)} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(2, 132, 199, 0.04)' } }}>
                          <TableCell sx={{ pl: 2.5, whiteSpace: 'nowrap' }}>
                            <Typography sx={{ fontWeight: 800, color: '#0F2942', fontSize: '0.88rem', lineHeight: 1.2, whiteSpace: 'nowrap' }}>{f.flightNumber}</Typography>
                            <Typography sx={{ fontSize: '0.74rem', color: '#0284C7', fontWeight: 700, mt: 0.3, whiteSpace: 'nowrap' }}>{f.stand}</Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.82rem', color: '#334155', whiteSpace: 'nowrap' }}>{f.aircraft}</TableCell>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F2942', whiteSpace: 'nowrap' }}>
                              {f.securityStatus === 'COMPLETED' ? '5 / 5' : '4 / 5'}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            {f.securityStatus === 'COMPLETED' ? (
                              <Chip label="✓ CLEARED" size="small" sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '0.68rem', whiteSpace: 'nowrap' }} />
                            ) : (
                              <Chip label="⚠ PENDING SIGN-OFF" size="small" sx={{ bgcolor: '#FEF3C7', color: '#D97706', fontWeight: 800, fontSize: '0.68rem', whiteSpace: 'nowrap' }} />
                            )}
                          </TableCell>
                          <TableCell align="right" sx={{ pr: 2.5, whiteSpace: 'nowrap' }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setSelectedFlight(f);
                                setPinModalOpen(true);
                              }}
                              sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.72rem', borderRadius: '6px', whiteSpace: 'nowrap', px: 1.5 }}
                            >
                              Sign-off
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>

              {/* HERO CABIN SECURITY CHECKLIST & SECURE PIN SIGN-OFF */}
              <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', p: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                      {selectedFlight.flightNumber} • Cabin Security Sweep
                    </Typography>
                    <Chip
                      icon={<Lock size={12} />}
                      label="PIN REQUIRED"
                      size="small"
                      sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 800, fontSize: '0.68rem' }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                    {securityChecklist.map((item) => (
                      <Box
                        key={item.id}
                        onClick={() => toggleSecurityItem(item.id)}
                        sx={{
                          p: 1.5,
                          borderRadius: '10px',
                          border: '1px solid #E2E8F0',
                          backgroundColor: item.checked ? '#F8FAFC' : '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          cursor: 'pointer',
                        }}
                      >
                        <Checkbox checked={item.checked} size="small" sx={{ p: 0, color: '#94A3B8', '&.Mui-checked': { color: '#0284C7' } }} />
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>{item.label}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setPinModalOpen(true)}
                  sx={{
                    backgroundColor: '#0F2942',
                    color: '#FFFFFF',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    textTransform: 'none',
                    borderRadius: '10px',
                    py: 1.2,
                    '&:hover': { backgroundColor: '#1E3A5F' },
                  }}
                >
                  Enter Security PIN & Authorize Boarding
                </Button>
              </Card>
            </Box>
          </Box>
        )}

        {/* ========================================================================= */}
        {/* VIEW: ASSIGNED FLIGHTS (#flights)                                         */}
        {/* ========================================================================= */}
        {activeTab === 'flights' && (
          <Box>
            <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mb: 0.5 }}>
              Assigned Department Turnaround Flights
            </Typography>
            <Typography sx={{ fontSize: '0.86rem', color: '#64748B', mb: 3 }}>
              Cross-department servicing telemetry for aircraft currently berthed on stands.
            </Typography>

            <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <TableContainer sx={{ overflowX: 'hidden' }}>
                <Table size="small" sx={{ width: '100%', '& .MuiTableCell-root': { px: { xs: 1, sm: 1.5 }, py: 1.2 } }}>
                  <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>FLIGHT / ROUTE</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>STAND</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>CLEANING</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>FUELING</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>MAINTENANCE</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>SECURITY</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {flights.map((f) => (
                      <TableRow key={f.id} hover>
                        <TableCell>
                          <Typography sx={{ fontWeight: 800, color: '#0F2942' }}>{f.flightNumber}</Typography>
                          <Typography sx={{ fontSize: '0.74rem', color: '#64748B' }}>{f.airline} · {f.route}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={f.stand} size="small" sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 800 }} />
                        </TableCell>
                        <TableCell><Chip label={f.cleaningStatus} size="small" /></TableCell>
                        <TableCell><Chip label={f.fuelStatus} size="small" /></TableCell>
                        <TableCell><Chip label={f.maintenanceStatus} size="small" /></TableCell>
                        <TableCell><Chip label={f.securityStatus} size="small" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        )}

        {/* ========================================================================= */}
        {/* VIEW: ALL TASKS & HISTORY (#tasks)                                        */}
        {/* ========================================================================= */}
        {activeTab === 'tasks' && (
          <Box>
            <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mb: 0.5 }}>
              Department Task Center & Audit History
            </Typography>
            <Typography sx={{ fontSize: '0.86rem', color: '#64748B', mb: 3 }}>
              Complete record of turnaround workorders dispatched across specialized teams.
            </Typography>

            <Card elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mb: 2 }}>
                Active Turnaround Shift Workorders (18)
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                  { id: 'TSK-C10', flight: 'AI-203', dept: 'CLEANING', title: 'Deep sanitization and tray table sterilization', status: 'IN_PROGRESS' },
                  { id: 'TSK-F22', flight: 'AI-203', dept: 'FUEL', title: 'Hydrant dispensing 8,000 kg Jet A-1', status: 'IN_PROGRESS' },
                  { id: 'TSK-M41', flight: 'AI-203', dept: 'MAINTENANCE', title: 'Secondary hydraulic reserve pressure calibration', status: 'IN_REPAIR' },
                  { id: 'TSK-S99', flight: 'AI-203', dept: 'SECURITY', title: 'Cabin overhead bins & lavatory panels sweep', status: 'PENDING' },
                ].map((t) => (
                  <Box key={t.id} sx={{ p: 2, borderRadius: '10px', border: '1px solid #E2E8F0', bgcolor: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.4 }}>
                        <Typography sx={{ fontWeight: 800, color: '#0F2942', fontSize: '0.9rem' }}>{t.id} · {t.flight}</Typography>
                        <Chip label={t.dept} size="small" sx={{ bgcolor: '#0F2942', color: '#FFF', fontWeight: 800, fontSize: '0.66rem' }} />
                      </Box>
                      <Typography sx={{ fontSize: '0.8rem', color: '#64748B' }}>{t.title}</Typography>
                    </Box>
                    <Chip label={t.status} size="small" sx={{ bgcolor: '#FEF3C7', color: '#D97706', fontWeight: 800, fontSize: '0.7rem' }} />
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>
        )}

        {/* ========================================================================= */}
        {/* VIEW: NOTIFICATIONS (#notifications)                                     */}
        {/* ========================================================================= */}
        {activeTab === 'notifications' && (
          <Box>
            <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mb: 0.5 }}>
              Operational Telemetry & Broadcasts
            </Typography>
            <Typography sx={{ fontSize: '0.86rem', color: '#64748B', mb: 3 }}>
              Real-time department clearances, delay escalations, and turnaround stage updates.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { time: '3m ago', title: 'Jet A-1 Fuel Hydrant Flow Verified', body: 'Stand G12 flow rate steady at 1,200 L/min for flight AI-203.', type: 'INFO' },
                { time: '14m ago', title: 'Avionics Pre-Flight Alert', body: 'Line maintenance reported secondary hydraulic pressure sensor check on Stand G12.', type: 'WARN' },
                { time: '28m ago', title: 'Cabin Hygiene Alpha Deployed', body: 'Cleaning crew boarded Stand G01 for long-haul turn on Boeing 777.', type: 'SUCCESS' },
              ].map((n, idx) => (
                <Card key={idx} elevation={0} sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', display: 'flex', gap: 2 }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: n.type === 'WARN' ? '#FEF3C7' : '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {n.type === 'WARN' ? <AlertTriangle size={18} color="#D97706" /> : <CheckCircle2 size={18} color="#10B981" />}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>{n.title}</Typography>
                      <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8' }}>{n.time}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.82rem', color: '#475569', mt: 0.3 }}>{n.body}</Typography>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* ========================================================================= */}
        {/* VIEW: PROFILE (#profile)                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && (
          <Box>
            <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mb: 0.5 }}>
              Staff Profile & Department Credentials
            </Typography>
            <Typography sx={{ fontSize: '0.86rem', color: '#64748B', mb: 3 }}>
              Operational certifications, airside access authorizations, and department assignment.
            </Typography>

            <Card elevation={0} sx={{ p: 3.5, backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
                <Avatar sx={{ width: 72, height: 72, bgcolor: '#0284C7', fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.6rem' }}>
                  ET
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                    Elena Tanaka
                  </Typography>
                  <Typography sx={{ fontSize: '0.88rem', color: '#64748B' }}>
                    Airline Billing Clerk & Specialized Operations Lead · Apron Services
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip label="AIRSIDE ACCESS: ZONE 1-4 ALL APRON" size="small" sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '0.68rem' }} />
                    <Chip label="RADIO: VHF DEPT-4" size="small" sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 800, fontSize: '0.68rem' }} />
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2.5 }} />

              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.9rem', color: '#0F2942', mb: 1.5 }}>
                CERTIFICATIONS & AIRSIDE CREDENTIALS
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                {[
                  { title: 'IATA Fuel Quality Control & Metering (FQCM)', valid: 'Certified thru 2027', id: 'FQCM-3391' },
                  { title: 'Airside Aircraft Security Sweeper License', valid: 'Active Red Badge', id: 'AASS-1102' },
                  { title: 'Line Aircraft Turnaround SLA Coordination', valid: 'Saphire Hub Certified', id: 'LATC-7740' },
                  { title: 'Dangerous Goods & Aviation Fuel Safety Level 2', valid: 'ICAO Recertified', id: 'DG-5519' },
                ].map((c, i) => (
                  <Box key={i} sx={{ p: 2, borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
                    <Typography sx={{ fontWeight: 800, color: '#0F2942', fontSize: '0.86rem' }}>{c.title}</Typography>
                    <Typography sx={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 700, mt: 0.3 }}>{c.valid}</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: 'monospace' }}>{c.id}</Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>
        )}
      </Box>

      {/* ========================================================================= */}
      {/* DIALOG: SECURITY 4-DIGIT PIN SIGN-OFF MODAL                               */}
      {/* ========================================================================= */}
      <Dialog
        open={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px', p: 1 } } }}
      >
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
          Secure Security PIN Sign-Off
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Typography sx={{ fontSize: '0.84rem', color: '#475569' }}>
              Confirm cabin search completion for <strong>{selectedFlight.flightNumber}</strong> ({selectedFlight.stand}).
            </Typography>

            <Box sx={{ p: 2, borderRadius: '10px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <Typography sx={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>AUTHORIZED SECURITY OFFICER</Typography>
              <Typography sx={{ fontWeight: 800, color: '#0F2942', fontSize: '0.9rem' }}>Inspector Farooq (Badge #SEC-4410)</Typography>
            </Box>

            <TextField
              label="4-Digit Security Authorization PIN"
              type="password"
              value={securityPin}
              onChange={(e) => setSecurityPin(e.target.value)}
              placeholder="e.g. 2026"
              autoFocus
              fullWidth
              slotProps={{
                htmlInput: { maxLength: 4, style: { letterSpacing: '0.5em', fontSize: '1.2rem', textAlign: 'center' } },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPinModalOpen(false)} sx={{ textTransform: 'none', color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleVerifySecurityPin}
            sx={{ backgroundColor: '#0F2942', color: '#FFFFFF', textTransform: 'none', fontWeight: 700 }}
          >
            Verify & Clear Aircraft
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default DepartmentDashboard;