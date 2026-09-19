import React, { useState, useEffect } from 'react';
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
  Card,
  Avatar,
  Divider,
  Tooltip,
  IconButton,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Users,
  ShieldCheck,
  Plane,
  Radio,
  FileText,
  Bell,
  Sliders,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  UserCheck,
  Download,
  Building2,
  RefreshCw,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Info,
  Calendar,
  ShieldAlert,
  Key,
  Check,
  Layers,
  Fuel,
  Wrench,
  Sparkles,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { aocsDataStore } from '../../services/aocsDataStore';

// Types
interface StaffAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'ACTIVE' | 'SUSPENDED';
  lastLogin: string;
}

interface HubFlight {
  id: number;
  flightNumber: string;
  aircraft: string;
  airline: string;
  route: string;
  gate: string;
  scheduledTime: string;
  status: 'SCHEDULED' | 'BOARDING' | 'AIRBORNE' | 'ON_BLOCK' | 'DELAYED';
}

interface AuditRecord {
  id: string;
  time: string;
  user: string;
  action: string;
  details: string;
  entityType?: string;
}

// Visual Chart Telemetry Data
const HOURLY_TRAFFIC_DATA = [
  { time: '00:00', departures: 4, arrivals: 6 },
  { time: '03:00', departures: 2, arrivals: 3 },
  { time: '06:00', departures: 12, arrivals: 9 },
  { time: '09:00', departures: 26, arrivals: 20 },
  { time: '12:00', departures: 32, arrivals: 28 },
  { time: '15:00', departures: 24, arrivals: 22 },
  { time: '18:00', departures: 34, arrivals: 29 },
  { time: '21:00', departures: 18, arrivals: 17 },
  { time: '23:59', departures: 9, arrivals: 11 },
];

const STATUS_PIE_DATA = [
  { name: 'Airborne', value: 22, color: '#10B981' },
  { name: 'Boarding', value: 14, color: '#0284C7' },
  { name: 'On Block', value: 16, color: '#6366F1' },
  { name: 'Scheduled', value: 9, color: '#F59E0B' },
  { name: 'Delayed', value: 3, color: '#EF4444' },
];

const INITIAL_STAFF: StaffAccount[] = [
  { id: 'USR-10', name: 'Aarav Li', email: 'admin@saphire.in', role: 'System Administrator', department: 'Terminal Management', status: 'ACTIVE', lastLogin: 'Just now' },
  { id: 'USR-01', name: 'Sai Sharma', email: 'aocc@saphire.in', role: 'AOCC Operations Manager', department: 'Flight Operations', status: 'ACTIVE', lastLogin: '4 mins ago' },
  { id: 'USR-02', name: 'Riya Johnson', email: 'ground@saphire.in', role: 'Ground Handling Supervisor', department: 'Ground Handling', status: 'ACTIVE', lastLogin: '18 mins ago' },
  { id: 'USR-09', name: 'Elena Tanaka', email: 'department@saphire.in', role: 'Airline Billing Clerk', department: 'Finance & Billing', status: 'ACTIVE', lastLogin: '1 hour ago' },
  { id: 'USR-05', name: 'Aditya Zhang', email: 'airside@saphire.in', role: 'Gate Agent', department: 'Airfield Maintenance', status: 'ACTIVE', lastLogin: '2 hours ago' },
  { id: 'USR-03', name: 'Priya Kumar', email: 'logistics@saphire.in', role: 'Baggage Handler', department: 'Baggage Services', status: 'ACTIVE', lastLogin: '3 hours ago' },
  { id: 'USR-07', name: 'Aarav Patel', email: 'passenger@saphire.in', role: 'Security Officer', department: 'Security & Safety', status: 'ACTIVE', lastLogin: '5 hours ago' },
];

const INITIAL_FLIGHTS: HubFlight[] = [
  { id: 101, flightNumber: 'SPH-102', aircraft: 'Airbus A350-900', airline: 'Saphire Airways', route: 'SPH ➔ LHR (London Heathrow)', gate: 'Gate B12', scheduledTime: '22:45 UTC', status: 'BOARDING' },
  { id: 102, flightNumber: 'SPH-204', aircraft: 'Boeing 777-300ER', airline: 'Saphire Airways', route: 'SPH ➔ DXB (Dubai International)', gate: 'Gate A04', scheduledTime: '23:10 UTC', status: 'SCHEDULED' },
  { id: 103, flightNumber: 'SPH-308', aircraft: 'Boeing 787-9 Dreamliner', airline: 'Saphire Airways', route: 'SPH ➔ LAX (Los Angeles Int)', gate: 'Gate C22', scheduledTime: '23:35 UTC', status: 'AIRBORNE' },
  { id: 104, flightNumber: 'SPH-809', aircraft: 'Airbus A330-300', airline: 'Saphire Airways', route: 'SPH ➔ JFK (New York JFK)', gate: 'Gate A10', scheduledTime: '23:50 UTC', status: 'DELAYED' },
  { id: 105, flightNumber: 'SPH-412', aircraft: 'Airbus A321neo', airline: 'Saphire Airways', route: 'CDG ➔ SPH (Paris Charles de Gaulle)', gate: 'Gate B08', scheduledTime: '00:15 UTC', status: 'ON_BLOCK' },
];

const INITIAL_AUDIT: AuditRecord[] = [
  { id: 'LOG-8824', time: '22:27:14 UTC', user: 'admin@saphire.in', action: 'USER_LOGIN', details: 'Aarav Li authenticated executive command session from internal terminal subnet.' },
  { id: 'LOG-8823', time: '22:21:08 UTC', user: 'aocc@saphire.in', action: 'FLIGHT_STATUS_UPDATE', details: 'Flight SPH-102 transitioned to BOARDING at Gate B12 (Concourse B).' },
  { id: 'LOG-8822', time: '22:16:45 UTC', user: 'aocc@saphire.in', action: 'GATE_ALLOCATION', details: 'Gate A04 allocated for widebody aircraft arrival SPH-204.' },
  { id: 'LOG-8821', time: '22:09:30 UTC', user: 'ground@saphire.in', action: 'TASK_COMPLETION', details: 'Apron refueling telemetry verified and signed off for Stand B12.' },
  { id: 'LOG-8820', time: '21:55:12 UTC', user: 'admin@saphire.in', action: 'ROLE_RBAC_AUDIT', details: 'Ground handling role permissions matrix validated and locked.' },
];

const RBAC_ROLES = [
  { role: 'SYSTEM_ADMINISTRATOR', name: 'System Administrator', desc: 'Full airport operations, RBAC, users, audit, reports & flight configuration.', level: 'Level 5 (Root)' },
  { role: 'AIRPORT_OPERATIONS_MANAGER', name: 'AOCC Operations Manager', desc: 'Airside movement, gate assignment, vector tracking, emergency response.', level: 'Level 4 (Executive)' },
  { role: 'GROUND_HANDLING_SUPERVISOR', name: 'Ground Handling Supervisor', desc: 'Apron turnarounds, baggage reconciliation, ramp crew management.', level: 'Level 3 (Operational)' },
  { role: 'RAMP_AGENT', name: 'Ramp Agent', desc: 'Aircraft marshaling, tug towing, pushback coordination on stands.', level: 'Level 2 (Airside)' },
  { role: 'BAGGAGE_HANDLER', name: 'Baggage Handler', desc: 'Conveyor routing, BRS telemetry, barcode validation, lost luggage tracking.', level: 'Level 2 (Airside)' },
  { role: 'GATE_AGENT', name: 'Gate Agent', desc: 'Aerobridge operation, boarding passes, standby seating, door closures.', level: 'Level 2 (Terminal)' },
  { role: 'SECURITY_OFFICER', name: 'Security Officer', desc: 'Security checkpoint, e-gate biometric scans, airside access validation.', level: 'Level 3 (Safety)' },
  { role: 'IMMIGRATION_OFFICER', name: 'Immigration Officer', desc: 'Customs declaration, passport clearance, international entry manifests.', level: 'Level 3 (Border)' },
  { role: 'AIRLINE_BILLING_CLERK', name: 'Airline Billing Clerk', desc: 'Airport landing fees, parking charges, utility tariffs, passenger reconciliation.', level: 'Level 3 (Finance)' },
  { role: 'PASSENGER', name: 'Passenger (Public Portal)', desc: 'Flight tracker, live schedule, concourse maps, terminal dining & services.', level: 'Level 1 (Public)' },
];

// Custom Recharts Tooltip Component
const CustomTrafficTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          p: 1.5,
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 8px 24px rgba(15, 41, 66, 0.12)',
        }}
      >
        <Typography sx={{ fontFamily: "'Inter', monospace", fontSize: '0.75rem', fontWeight: 700, color: '#0F2942', mb: 0.5 }}>
          Slot {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#0284C7' }} />
          <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>
            Departures: <b>{payload[0].value}</b> flights
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981' }} />
          <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>
            Arrivals: <b>{payload[1].value}</b> flights
          </Typography>
        </Box>
      </Box>
    );
  }
  return null;
};

export const SystemAdminDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const getTabFromHash = (hash: string) => {
    switch (hash) {
      case '#flights': return 'flights';
      case '#users': return 'users';
      case '#roles': return 'roles';
      case '#audit': return 'audit';
      case '#reports': return 'reports';
      case '#profile': return 'profile';
      default: return 'overview';
    }
  };

  const [activeTab, setActiveTab] = useState<string>(() => getTabFromHash(location.hash));
  const [concourseFilter, setConcourseFilter] = useState<'ALL' | 'T1' | 'T2'>('ALL');

  useEffect(() => {
    setActiveTab(getTabFromHash(location.hash));
  }, [location.hash]);

  const handleTabSelect = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'overview') {
      navigate('/dashboard/system-admin');
    } else {
      navigate(`/dashboard/system-admin#${tab}`);
    }
  };

  // State
  const [staff, setStaff] = useState<StaffAccount[]>(INITIAL_STAFF);
  const [flights, setFlights] = useState<HubFlight[]>(INITIAL_FLIGHTS);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>(INITIAL_AUDIT);
  const [staffSearch, setStaffSearch] = useState('');
  const [flightSearch, setFlightSearch] = useState('');
  const [auditSearch, setAuditSearch] = useState('');
  const [auditEntityFilter, setAuditEntityFilter] = useState('ALL');

  // Master Operational Overrides State (Administrative Dispatch Authority)
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [overrideSection, setOverrideSection] = useState<'status' | 'gate' | 'turnaround' | 'lockdown'>('status');
  const [overrideFlightNum, setOverrideFlightNum] = useState('AI-203');
  const [overrideStatus, setOverrideStatus] = useState<HubFlight['status']>('BOARDING');
  const [overrideReason, setOverrideReason] = useState('Administrative operational dispatch acceleration');
  const [overrideGateCode, setOverrideGateCode] = useState('B12');
  const [overrideBypassConflict, setOverrideBypassConflict] = useState(true);
  const [overridePin, setOverridePin] = useState('8821');
  const [overrideTerminal, setOverrideTerminal] = useState('Terminal 2');
  const [terminalLocked, setTerminalLocked] = useState(false);

  // Turnaround Telemetry Modal
  const [turnaroundModalOpen, setTurnaroundModalOpen] = useState(false);

  // Synchronize with AOCS Reactive Store
  const syncStoreData = () => {
    const storeFlights = aocsDataStore.getFlights();
    if (storeFlights && storeFlights.length > 0) {
      setFlights(
        storeFlights.map((f) => ({
          id: f.flightId,
          flightNumber: f.flightNumber,
          aircraft: f.aircraftType,
          airline: f.airlineName,
          route: `${f.originAirportCode} ➔ ${f.destinationAirportCode}`,
          gate: f.gateCode ? `Gate ${f.gateCode}` : 'Unassigned',
          scheduledTime: f.scheduledTime,
          status: (f.status as any) || 'SCHEDULED',
        }))
      );
    }

    const storeAudits = aocsDataStore.getAuditLogs();
    if (storeAudits && storeAudits.length > 0) {
      setAuditLogs(
        storeAudits.map((a) => ({
          id: `LOG-${a.auditId}`,
          time: a.timestamp,
          user: a.performedByUserName,
          action: a.action,
          details: a.changePayload,
          entityType: a.entityType,
        }))
      );
    }
  };

  useEffect(() => {
    syncStoreData();
    const unsub = aocsDataStore.subscribe(() => {
      syncStoreData();
    });
    return () => unsub();
  }, []);

  // Handlers for Master Operational Overrides
  const handleExecuteStatusOverride = () => {
    if (!overrideReason.trim()) {
      toast.error('Operational rationale is mandatory for executive audit compliance.');
      return;
    }
    aocsDataStore.adminForceFlightStatus(overrideFlightNum, overrideStatus as any, overrideReason);
    toast.success(`Executive override authorized: ${overrideFlightNum} transitioned to ${overrideStatus}`);
    setOverrideModalOpen(false);
  };

  const handleExecuteGateOverride = () => {
    aocsDataStore.adminMasterGateOverride(overrideFlightNum, overrideGateCode, overrideBypassConflict);
    toast.success(`Executive override authorized: ${overrideFlightNum} assigned to Gate ${overrideGateCode}`);
    setOverrideModalOpen(false);
  };

  const handleExecuteTurnaroundClear = () => {
    if (overridePin !== '8821' && overridePin !== '1234') {
      toast.error('Invalid Supervisor Clearance PIN. Verification failed.');
      return;
    }
    aocsDataStore.adminClearAllTurnaroundPrerequisites(overrideFlightNum, overridePin);
    toast.success(`Turnaround sign-off verified for ${overrideFlightNum}. Boarding turnstiles unlocked.`);
    setOverrideModalOpen(false);
  };

  const handleExecuteLockdownToggle = () => {
    const nextLocked = !terminalLocked;
    setTerminalLocked(nextLocked);
    aocsDataStore.adminEmergencyTerminalLockdown(overrideTerminal, nextLocked);
    if (nextLocked) {
      toast.error(`EMERGENCY: ${overrideTerminal} boarding gates LOCKED DOWN by Administrator authority.`);
    } else {
      toast.success(`${overrideTerminal} normal gate operations restored.`);
    }
    setOverrideModalOpen(false);
  };

  // Modals
  const [openUserModal, setOpenUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Ground Handling Supervisor');
  const [newUserDept, setNewUserDept] = useState('Ground Handling');

  const [openFlightModal, setOpenFlightModal] = useState(false);
  const [newFlightNum, setNewFlightNum] = useState('');
  const [newFlightRoute, setNewFlightRoute] = useState('');
  const [newFlightGate, setNewFlightGate] = useState('Gate B14');
  const [newFlightTime, setNewFlightTime] = useState('');

  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertLevel, setAlertLevel] = useState<'CRITICAL' | 'WARNING' | 'INFO'>('CRITICAL');
  const [alertMessage, setAlertMessage] = useState('');

  // Handlers
  const handleCreateUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      toast.error('Please enter name and operational email.');
      return;
    }
    const newEntry: StaffAccount = {
      id: `USR-${Math.floor(10 + Math.random() * 90)}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      department: newUserDept,
      status: 'ACTIVE',
      lastLogin: 'Never',
    };
    setStaff([newEntry, ...staff]);
    toast.success(`Account enrolled for ${newUserName}`);
    setOpenUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  const toggleStaffStatus = (id: string) => {
    setStaff(
      staff.map((s) => {
        if (s.id === id) {
          const updated = s.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          toast(`Account status set to ${updated}: ${s.name}`, { icon: '🔒' });
          return { ...s, status: updated };
        }
        return s;
      })
    );
  };

  const handleCreateFlight = () => {
    if (!newFlightNum.trim() || !newFlightRoute.trim()) {
      toast.error('Please enter flight number and route.');
      return;
    }
    const newFlight: HubFlight = {
      id: Math.floor(100 + Math.random() * 900),
      flightNumber: newFlightNum.toUpperCase(),
      aircraft: 'Boeing 787-9 Dreamliner',
      airline: 'Saphire Airways',
      route: newFlightRoute,
      gate: newFlightGate,
      scheduledTime: newFlightTime ? `${newFlightTime} UTC` : '12:00 UTC',
      status: 'SCHEDULED',
    };
    setFlights([newFlight, ...flights]);
    toast.success(`Flight ${newFlightNum} scheduled at ${newFlightGate}`);
    setOpenFlightModal(false);
    setNewFlightNum('');
    setNewFlightRoute('');
  };

  const handleBroadcastAlert = () => {
    if (!alertTitle.trim() || !alertMessage.trim()) {
      toast.error('Please complete alert title and message.');
      return;
    }
    toast.success(`Airside Priority Broadcast dispatched (${alertLevel})`);
    setOpenAlertModal(false);
    setAlertTitle('');
    setAlertMessage('');
  };

  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(staffSearch.toLowerCase()) ||
      s.role.toLowerCase().includes(staffSearch.toLowerCase())
  );

  const filteredFlights = flights.filter(
    (f) =>
      f.flightNumber.toLowerCase().includes(flightSearch.toLowerCase()) ||
      f.route.toLowerCase().includes(flightSearch.toLowerCase()) ||
      f.gate.toLowerCase().includes(flightSearch.toLowerCase())
  );

  const filteredAudit = auditLogs.filter((a) => {
    const matchesSearch =
      a.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
      a.user.toLowerCase().includes(auditSearch.toLowerCase()) ||
      a.action.toLowerCase().includes(auditSearch.toLowerCase());
    const matchesEntity =
      auditEntityFilter === 'ALL' ||
      (a.entityType && a.entityType.toUpperCase().includes(auditEntityFilter)) ||
      a.action.includes(auditEntityFilter);
    return matchesSearch && matchesEntity;
  });

  return (
    <DashboardLayout activeRole="system-admin">
      {/* ========================================================================= */}
      {/* 1. OVERVIEW (PROPTIA-STYLE COMMAND DASHBOARD)                             */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <Box>
          {/* HEADER ROW: Title + Controls (Proptia Aesthetic) */}
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
                  TERMINAL COMMAND STATION
                </Typography>
                <Chip
                  label="ALL SYSTEMS NOMINAL ●"
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
                Executive Operations Overview
              </Typography>
              <Typography sx={{ fontSize: '0.86rem', color: '#64748B', mt: 0.2 }}>
                Saphire International Airport (SPH) · Flight movements, turnaround SLA & airside telemetry
              </Typography>
            </Box>

            {/* Controls: Concourse Selector Pills + Primary Action */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ display: 'flex', backgroundColor: '#FFFFFF', p: 0.5, borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                {(['ALL', 'T1', 'T2'] as const).map((filter) => (
                  <Button
                    key={filter}
                    size="small"
                    onClick={() => setConcourseFilter(filter)}
                    sx={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      px: 1.5,
                      py: 0.4,
                      minWidth: 'auto',
                      borderRadius: '7px',
                      textTransform: 'none',
                      backgroundColor: concourseFilter === filter ? '#0F2942' : 'transparent',
                      color: concourseFilter === filter ? '#FFFFFF' : '#64748B',
                      '&:hover': {
                        backgroundColor: concourseFilter === filter ? '#1E3A5F' : '#F1F5F9',
                      },
                    }}
                  >
                    {filter === 'ALL' ? 'All Terminals' : filter === 'T1' ? 'Terminal 1' : 'Terminal 2'}
                  </Button>
                ))}
              </Box>

              <Button
                variant="outlined"
                startIcon={<ShieldAlert size={16} color="#0284C7" />}
                onClick={() => setOverrideModalOpen(true)}
                sx={{
                  borderColor: '#0284C7',
                  color: '#0284C7',
                  backgroundColor: '#F0F9FF',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  textTransform: 'none',
                  borderRadius: '10px',
                  px: 2.0,
                  py: 0.9,
                  boxShadow: '0 1px 3px rgba(2, 132, 199, 0.08)',
                  '&:hover': { backgroundColor: '#E0F2FE', borderColor: '#0369A1' },
                }}
              >
                Master Operational Overrides
              </Button>

              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                onClick={() => setOpenFlightModal(true)}
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
                Schedule Flight
              </Button>
            </Box>
          </Box>

          {/* ========================================================================= */}
          {/* 4 SUMMARY METRIC CARDS (INTERACTIVE & LIVE AOCS CONNECTED)                */}
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
              onClick={() => handleTabSelect('flights')}
              sx={{
                p: 2.5,
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
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
                  label="View Schedule"
                  size="small"
                  sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '0.68rem', height: '22px' }}
                />
              </Box>
              <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', lineHeight: 1.1 }}>
                {flights.length}
              </Typography>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.84rem', fontWeight: 700, color: '#475569', mt: 0.5 }}>
                Active Hub Flights
              </Typography>
              <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
                {flights.filter((f) => f.status === 'AIRBORNE').length} Airborne · {flights.filter((f) => f.status === 'BOARDING').length} Boarding · {flights.filter((f) => f.status === 'ON_BLOCK').length} On Block
              </Typography>
            </Card>

            {/* Card 2: Staff On Duty */}
            <Card
              elevation={0}
              onClick={() => handleTabSelect('users')}
              sx={{
                p: 2.5,
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
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
                  label="View Registry"
                  size="small"
                  sx={{ bgcolor: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', fontWeight: 700, fontSize: '0.68rem', height: '22px' }}
                />
              </Box>
              <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', lineHeight: 1.1 }}>
                {staff.length}
              </Typography>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.84rem', fontWeight: 700, color: '#475569', mt: 0.5 }}>
                Staff Personnel on Duty
              </Typography>
              <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
                Authenticated across 7 airport departments
              </Typography>
            </Card>

            {/* Card 3: Turnaround Operations */}
            <Card
              elevation={0}
              onClick={() => setTurnaroundModalOpen(true)}
              sx={{
                p: 2.5,
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  borderColor: '#6366F1',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.12)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    backgroundColor: '#EEF2FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sliders size={22} color="#6366F1" />
                </Box>
                <Chip
                  label="Gating Telemetry"
                  size="small"
                  sx={{ bgcolor: '#EEF2FF', color: '#4338CA', border: '1px solid #C7D2FE', fontWeight: 700, fontSize: '0.68rem', height: '22px' }}
                />
              </Box>
              <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', lineHeight: 1.1 }}>
                {aocsDataStore.getTasks().length}
              </Typography>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.84rem', fontWeight: 700, color: '#475569', mt: 0.5 }}>
                Turnaround Operations
              </Typography>
              <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
                {aocsDataStore.getTasks().filter((t) => t.status === 'COMPLETED').length} Done · {aocsDataStore.getTasks().filter((t) => t.status === 'IN_PROGRESS').length} In-Progress Tasks
              </Typography>
            </Card>

            {/* Card 4: Critical Alerts */}
            <Card
              elevation={0}
              onClick={() => handleTabSelect('audit')}
              sx={{
                p: 2.5,
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
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
                  <Bell size={22} color="#DC2626" />
                </Box>
                <Chip
                  label="View Audit Trail"
                  size="small"
                  sx={{ bgcolor: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', fontWeight: 800, fontSize: '0.68rem', height: '22px' }}
                />
              </Box>
              <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#DC2626', lineHeight: 1.1 }}>
                {aocsDataStore.getIncidents().filter((i) => i.status !== 'RESOLVED').length}
              </Typography>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.84rem', fontWeight: 700, color: '#475569', mt: 0.5 }}>
                Airside Operational Alerts
              </Typography>
              <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
                {aocsDataStore.getIncidents().length} Security Tickets · {auditLogs.length} Audit Events
              </Typography>
            </Card>
          </Box>

          {/* ========================================================================= */}
          {/* VISUAL CHARTS ROW: 2 RECHARTS VISUALIZATIONS                               */}
          {/* ========================================================================= */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '8fr 4fr' },
              gap: 3,
              mb: 3.5,
            }}
          >
            {/* Chart 1: Airfield Hourly Movement Dynamics (AreaChart) */}
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                <Box>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.05rem', color: '#0F2942' }}>
                    Airfield Movement Dynamics
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Hourly flight departures vs arrivals throughout the 24-hour cycle
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: '#0284C7' }} />
                    <Typography sx={{ fontSize: '0.74rem', color: '#475569', fontWeight: 700 }}>Departures</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: '#10B981' }} />
                    <Typography sx={{ fontSize: '0.74rem', color: '#475569', fontWeight: 700 }}>Arrivals</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Area Chart Container */}
              <Box sx={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={HOURLY_TRAFFIC_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="departuresGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284C7" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="arrivalsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                    <RechartsTooltip content={<CustomTrafficTooltip />} />
                    <Area type="monotone" dataKey="departures" stroke="#0284C7" strokeWidth={2.5} fillOpacity={1} fill="url(#departuresGrad)" />
                    <Area type="monotone" dataKey="arrivals" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#arrivalsGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Card>

            {/* Chart 2: Flight Status Distribution (Donut Chart) */}
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
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.05rem', color: '#0F2942' }}>
                  Flight Status Distribution
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Real-time fleet state across concourses
                </Typography>
              </Box>

              {/* Donut Chart with Center Metric */}
              <Box sx={{ position: 'relative', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', my: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={STATUS_PIE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {STATUS_PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Stat */}
                <Box sx={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#0F2942', lineHeight: 1 }}>
                    64
                  </Typography>
                  <Typography sx={{ fontSize: '0.62rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Flights
                  </Typography>
                </Box>
              </Box>

              {/* Custom Legend */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                {STATUS_PIE_DATA.map((item) => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                    <Typography sx={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>
                      {item.name}: <b>{item.value}</b>
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>

          {/* ========================================================================= */}
          {/* LOWER OPERATIONAL SECTION: ACTIVE FLIGHT BOARD + ACTIVITY / ALERTS        */}
          {/* ========================================================================= */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '8fr 4fr' },
              gap: 3,
            }}
          >
            {/* Left Column (60%): Live Airside Flight Board */}
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Box>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.05rem', color: '#0F2942' }}>
                    Active Hub Movements Board
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Real-time flight manifests & assigned terminal gates
                  </Typography>
                </Box>
                <Button
                  size="small"
                  onClick={() => handleTabSelect('flights')}
                  endIcon={<ArrowRight size={14} />}
                  sx={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    color: '#0284C7',
                    textTransform: 'none',
                  }}
                >
                  View All Flights
                </Button>
              </Box>

              <TableContainer sx={{ border: '1px solid #E2E8F0', borderRadius: '12px' }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.74rem' }}>FLIGHT</TableCell>
                      <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.74rem' }}>ROUTE</TableCell>
                      <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.74rem' }}>GATE / STAND</TableCell>
                      <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.74rem' }}>SCHEDULED</TableCell>
                      <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.74rem' }}>STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {flights.slice(0, 5).map((f) => (
                      <TableRow key={f.id} hover sx={{ '&:hover': { backgroundColor: '#F8FAFC' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            <Box
                              sx={{
                                width: 30,
                                height: 30,
                                borderRadius: '8px',
                                bgcolor: '#F1F5F9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Plane size={15} color="#0284C7" />
                            </Box>
                            <Box>
                              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.88rem', color: '#0F2942' }}>
                                {f.flightNumber}
                              </Typography>
                              <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8' }}>{f.aircraft}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                          {f.route}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={f.gate}
                            size="small"
                            sx={{
                              bgcolor: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              fontWeight: 700,
                              fontSize: '0.72rem',
                              color: '#0F2942',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontFamily: "'Inter', monospace", fontSize: '0.8rem', color: '#0F2942' }}>
                          {f.scheduledTime}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={f.status}
                            size="small"
                            sx={{
                              height: '22px',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              bgcolor:
                                f.status === 'BOARDING' ? '#E0F2FE' :
                                f.status === 'AIRBORNE' ? '#DCFCE7' :
                                f.status === 'DELAYED' ? '#FEF2F2' : '#F1F5F9',
                              color:
                                f.status === 'BOARDING' ? '#0369A1' :
                                f.status === 'AIRBORNE' ? '#15803D' :
                                f.status === 'DELAYED' ? '#991B1B' : '#475569',
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>

            {/* Right Column (40%): Airside Triage & Live Activity Stream */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Critical Alert Card */}
              <Card
                elevation={0}
                sx={{
                  p: 2.5,
                  backgroundColor: '#FEF2F2',
                  borderRadius: '16px',
                  border: '1px solid #FCA5A5',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AlertTriangle size={18} color="#DC2626" />
                    <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.88rem', color: '#991B1B' }}>
                      CRITICAL: Gate Conflict
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.7rem', color: '#991B1B', fontWeight: 600 }}>2m ago</Typography>
                </Box>
                <Typography sx={{ fontSize: '0.78rem', color: '#7F1D1D', mb: 2, lineHeight: 1.4 }}>
                  SPH-102 and SPH-204 scheduled concurrently on Aerobridge B12. Immediate ramp stand reassignment recommended.
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleTabSelect('flights')}
                  sx={{
                    bgcolor: '#DC2626',
                    color: '#FFF',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    borderRadius: '8px',
                    '&:hover': { bgcolor: '#B91C1C' },
                  }}
                >
                  Resolve Allocation Conflict
                </Button>
              </Card>

              {/* Live Activity Stream */}
              <Card
                elevation={0}
                sx={{
                  p: 2.5,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  flexGrow: 1,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.98rem', color: '#0F2942' }}>
                    Live Operational Stream
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => handleTabSelect('audit')}
                    sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.75rem', color: '#0284C7', textTransform: 'none' }}
                  >
                    View All
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.6 }}>
                  {auditLogs.slice(0, 4).map((log) => (
                    <Box key={log.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#0284C7', mt: 0.7, flexShrink: 0 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.78rem', fontWeight: 800, color: '#0F2942' }}>
                            {log.action}
                          </Typography>
                          <Typography sx={{ fontFamily: "'Inter', monospace", fontSize: '0.7rem', color: '#94A3B8' }}>
                            {log.time.slice(0, 5)}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.3, mt: 0.2 }}>
                          {log.details}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Box>
          </Box>
        </Box>
      )}

      {/* ========================================================================= */}
      {/* 2. FLIGHTS MANAGEMENT VIEW                                                */}
      {/* ========================================================================= */}
      {activeTab === 'flights' && (
        <Card elevation={0} sx={{ p: 3.5, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                Flight Operations Management
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>
                Active arrival & departure manifests synchronized with airside radar telemetry.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextField
                size="small"
                placeholder="Search flight number, route, gate..."
                value={flightSearch}
                onChange={(e) => setFlightSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={16} color="#64748B" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  width: { xs: '100%', sm: '260px' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#F8FAFC',
                    fontSize: '0.85rem',
                  },
                }}
              />
              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                onClick={() => setOpenFlightModal(true)}
                sx={{
                  backgroundColor: '#0F2942',
                  color: '#FFFFFF',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 2.2,
                  '&:hover': { backgroundColor: '#1E3A5F' },
                }}
              >
                Create Flight
              </Button>
            </Box>
          </Box>

          <TableContainer sx={{ border: '1px solid #E2E8F0', borderRadius: '12px' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.78rem' }}>FLIGHT NUMBER</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.78rem' }}>AIRCRAFT</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.78rem' }}>ROUTE</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.78rem' }}>GATE STAND</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.78rem' }}>SCHEDULED</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.78rem' }}>STATUS</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.78rem' }}>ACTION</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFlights.map((f) => (
                  <TableRow key={f.id} hover>
                    <TableCell sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                      {f.flightNumber}
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontSize: '0.85rem' }}>{f.aircraft}</TableCell>
                    <TableCell sx={{ color: '#0F2942', fontWeight: 600, fontSize: '0.85rem' }}>{f.route}</TableCell>
                    <TableCell>
                      <Chip label={f.gate} size="small" sx={{ bgcolor: '#F1F5F9', color: '#0F2942', fontWeight: 700, fontSize: '0.72rem' }} />
                    </TableCell>
                    <TableCell sx={{ fontFamily: "'Inter', monospace", fontSize: '0.85rem', color: '#0F2942' }}>
                      {f.scheduledTime}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={f.status}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.7rem',
                          bgcolor:
                            f.status === 'BOARDING' ? '#E0F2FE' :
                            f.status === 'AIRBORNE' ? '#DCFCE7' :
                            f.status === 'DELAYED' ? '#FEF2F2' : '#F1F5F9',
                          color:
                            f.status === 'BOARDING' ? '#0369A1' :
                            f.status === 'AIRBORNE' ? '#15803D' :
                            f.status === 'DELAYED' ? '#991B1B' : '#475569',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          const nextStatus = f.status === 'SCHEDULED' ? 'BOARDING' : f.status === 'BOARDING' ? 'AIRBORNE' : 'SCHEDULED';
                          setFlights(flights.map((item) => item.id === f.id ? { ...item, status: nextStatus } : item));
                          toast.success(`Flight ${f.flightNumber} status set to ${nextStatus}`);
                        }}
                        sx={{ fontSize: '0.72rem', py: 0.3, px: 1.2, borderColor: '#CBD5E1', color: '#0284C7', textTransform: 'none' }}
                      >
                        Advance Status
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 3. USER MANAGEMENT VIEW                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <Card elevation={0} sx={{ p: 3.5, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                Operational Personnel & Staff Registry
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>
                Configure authenticated staff accounts, departments, and operational clearance levels.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextField
                size="small"
                placeholder="Filter by name, email, role..."
                value={staffSearch}
                onChange={(e) => setStaffSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={16} color="#64748B" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  width: { xs: '100%', sm: '260px' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#F8FAFC',
                    fontSize: '0.85rem',
                  },
                }}
              />
              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                onClick={() => setOpenUserModal(true)}
                sx={{
                  backgroundColor: '#0F2942',
                  color: '#FFFFFF',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 2.2,
                  '&:hover': { backgroundColor: '#1E3A5F' },
                }}
              >
                Add Staff
              </Button>
            </Box>
          </Box>

          <TableContainer sx={{ border: '1px solid #E2E8F0', borderRadius: '12px' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.78rem' }}>STAFF ID / NAME</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.78rem' }}>EMAIL</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.78rem' }}>ROLE</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.78rem' }}>DEPARTMENT</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.78rem' }}>STATUS</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.78rem' }}>ACTION</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStaff.map((s) => (
                  <TableRow key={s.id} hover>
                    <TableCell sx={{ color: '#0F2942', fontWeight: 600 }}>
                      <Box>
                        <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#0F2942' }}>
                          {s.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontFamily: "'Inter', monospace" }}>
                          {s.id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontSize: '0.85rem' }}>{s.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={s.role}
                        size="small"
                        sx={{ backgroundColor: '#F0F9FF', color: '#0284C7', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #BAE6FD' }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontSize: '0.85rem' }}>{s.department}</TableCell>
                    <TableCell>
                      <Chip
                        icon={s.status === 'ACTIVE' ? <CheckCircle2 size={12} color="#15803D" /> : <Lock size={12} color="#DC2626" />}
                        label={s.status}
                        size="small"
                        sx={{
                          backgroundColor: s.status === 'ACTIVE' ? '#DCFCE7' : '#FEF2F2',
                          color: s.status === 'ACTIVE' ? '#15803D' : '#DC2626',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => toggleStaffStatus(s.id)}
                        sx={{
                          fontSize: '0.72rem',
                          py: 0.3,
                          px: 1.5,
                          borderRadius: '6px',
                          borderColor: '#CBD5E1',
                          color: s.status === 'ACTIVE' ? '#DC2626' : '#15803D',
                          textTransform: 'none',
                          '&:hover': { borderColor: s.status === 'ACTIVE' ? '#DC2626' : '#15803D' },
                        }}
                      >
                        {s.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 4. ROLES & RBAC MATRIX VIEW                                               */}
      {/* ========================================================================= */}
      {activeTab === 'roles' && (
        <Card elevation={0} sx={{ p: 3.5, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
              Roles & RBAC Access Matrix
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>
              System role hierarchy and operational capability boundaries seeded in database.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
            {RBAC_ROLES.map((r, i) => (
              <Card key={i} variant="outlined" sx={{ borderRadius: '12px', borderColor: '#E2E8F0', p: 2, backgroundColor: '#FAFAFA' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.94rem', color: '#0F2942' }}>
                    {r.name}
                  </Typography>
                  <Chip label={r.level} size="small" sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 800, fontSize: '0.68rem' }} />
                </Box>
                <Typography sx={{ fontSize: '0.78rem', color: '#0284C7', fontFamily: "'Inter', monospace", mb: 0.8 }}>
                  ROLE_{r.role}
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>
                  {r.desc}
                </Typography>
              </Card>
            ))}
          </Box>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 5. AUDIT LOGS VIEW                                                        */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <Card elevation={0} sx={{ p: 3.5, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                All-Seeing Airport Operational Audit Trail
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>
                Unified cross-dashboard ledger streaming live operations across Airside, Ground Ops, AOCC, Security, and Logistics.
              </Typography>
            </Box>
            <TextField
              size="small"
              placeholder="Search audit trail..."
              value={auditSearch}
              onChange={(e) => setAuditSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} color="#64748B" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                width: { xs: '100%', sm: '260px' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#F8FAFC',
                  fontSize: '0.85rem',
                },
              }}
            />
          </Box>

          {/* Audit Entity Filter Buttons */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {['ALL', 'FLIGHT', 'GATE', 'TASK', 'FUEL', 'SECURITY', 'SYSTEM'].map((category) => (
              <Button
                key={category}
                size="small"
                onClick={() => setAuditEntityFilter(category)}
                sx={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 1.6,
                  py: 0.4,
                  backgroundColor: auditEntityFilter === category ? '#0F2942' : '#F1F5F9',
                  color: auditEntityFilter === category ? '#FFFFFF' : '#475569',
                  '&:hover': {
                    backgroundColor: auditEntityFilter === category ? '#1E3A5F' : '#E2E8F0',
                  },
                }}
              >
                {category === 'ALL' ? 'All Activity' : category}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {filteredAudit.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography sx={{ color: '#64748B', fontSize: '0.9rem' }}>
                  No audit trail records matched the selected criteria.
                </Typography>
              </Box>
            ) : (
              filteredAudit.map((log) => (
                <Box
                  key={log.id}
                  sx={{
                    p: 2,
                    borderRadius: '10px',
                    bgcolor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { md: 'center' },
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Chip
                      label={log.action}
                      size="small"
                      sx={{
                        backgroundColor:
                          log.action.includes('ADMIN') || log.action.includes('LOCKDOWN') ? '#FEE2E2' :
                          log.action.includes('SECURITY') ? '#FEF3C7' :
                          log.action.includes('GATE') ? '#DCFCE7' : '#E0F2FE',
                        color:
                          log.action.includes('ADMIN') || log.action.includes('LOCKDOWN') ? '#991B1B' :
                          log.action.includes('SECURITY') ? '#92400E' :
                          log.action.includes('GATE') ? '#166534' : '#0369A1',
                        fontWeight: 800,
                        fontSize: '0.7rem',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.86rem', fontWeight: 600, color: '#0F2942' }}>
                      {log.details}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 500 }}>
                      By: {log.user}
                    </Typography>
                    <Typography sx={{ fontFamily: "'Inter', monospace", fontSize: '0.75rem', color: '#0284C7', fontWeight: 700 }}>
                      {log.time}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 6. REPORTS VIEW                                                           */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <Card elevation={0} sx={{ p: 3.5, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
              Operational Reports & Summary Exports
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>
              Backend-generated summary manifests and turnaround SLA statistics (/api/reports/summary).
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
            <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: '#E2E8F0', p: 2.5 }}>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#0F2942', mb: 0.5 }}>
                Flight Movement Summary
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#64748B', mb: 2 }}>
                Daily departure and arrival totals, delay breakdown, and airline compliance metrics.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Download size={14} />}
                onClick={() => toast.success('Exporting Flight Movement Summary (CSV)...')}
                sx={{ borderColor: '#CBD5E1', color: '#0F2942', fontWeight: 700, fontSize: '0.78rem', textTransform: 'none' }}
              >
                Export CSV
              </Button>
            </Card>

            <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: '#E2E8F0', p: 2.5 }}>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#0F2942', mb: 0.5 }}>
                Gate & Stand Utilization
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#64748B', mb: 2 }}>
                Occupancy hours, turnaround critical-path times, and aerobridge maintenance telemetry.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Download size={14} />}
                onClick={() => toast.success('Exporting Gate Utilization Report (PDF)...')}
                sx={{ borderColor: '#CBD5E1', color: '#0F2942', fontWeight: 700, fontSize: '0.78rem', textTransform: 'none' }}
              >
                Export PDF
              </Button>
            </Card>

            <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: '#E2E8F0', p: 2.5 }}>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#0F2942', mb: 0.5 }}>
                Airline Billing & Tariff Manifest
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#64748B', mb: 2 }}>
                Landing fees, aerobridge connection charges, and ground equipment utility calculations.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Download size={14} />}
                onClick={() => toast.success('Exporting Billing Summary (Excel)...')}
                sx={{ borderColor: '#CBD5E1', color: '#0F2942', fontWeight: 700, fontSize: '0.78rem', textTransform: 'none' }}
              >
                Export Excel
              </Button>
            </Card>
          </Box>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 7. PROFILE VIEW                                                           */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <Card elevation={0} sx={{ p: 3.5, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', maxWidth: '800px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: '#0F2942', color: '#FFFFFF', fontSize: '1.4rem', fontWeight: 800 }}>
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                {user?.name || 'Administrator'}
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>
                {user?.roleName ? user.roleName.replace(/_/g, ' ') : 'System Administrator'} · Saphire Central Directorate
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2.5, borderColor: '#E2E8F0' }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', mb: 0.5 }}>OPERATIONAL EMAIL</Typography>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F2942' }}>admin@saphire.in</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', mb: 0.5 }}>SECURITY CLEARANCE</Typography>
              <Chip label="Level 5 (Root Executive)" size="small" sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', mb: 0.5 }}>TERMINAL STATION</Typography>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F2942' }}>Saphire International Hub (SPH) - Concourse A/B/C</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', mb: 0.5 }}>SESSION STATUS</Typography>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#059669' }}>Active & Signed with Token</Typography>
            </Box>
          </Box>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD STAFF ACCOUNT                                                  */}
      {/* ========================================================================= */}
      <Dialog
        open={openUserModal}
        onClose={() => setOpenUserModal(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              p: 1.5,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 24px 60px rgba(15, 41, 66, 0.16)',
            },
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
          Enroll Airport Staff Account
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            fullWidth
            label="Full Name"
            placeholder="e.g. Captain Liam Ross"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Operational Email"
            placeholder="e.g. liam.ross@saphire.in"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Operational Role</InputLabel>
            <Select
              value={newUserRole}
              label="Operational Role"
              onChange={(e) => setNewUserRole(e.target.value)}
            >
              {RBAC_ROLES.map((r) => (
                <MenuItem key={r.role} value={r.name}>
                  {r.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Assigned Department</InputLabel>
            <Select
              value={newUserDept}
              label="Assigned Department"
              onChange={(e) => setNewUserDept(e.target.value)}
            >
              <MenuItem value="Flight Operations">Flight Operations</MenuItem>
              <MenuItem value="Ground Handling">Ground Handling</MenuItem>
              <MenuItem value="Baggage Services">Baggage Services</MenuItem>
              <MenuItem value="Airfield Maintenance">Airfield Maintenance</MenuItem>
              <MenuItem value="Security & Safety">Security & Safety</MenuItem>
              <MenuItem value="Terminal Management">Terminal Management</MenuItem>
              <MenuItem value="Finance & Billing">Finance & Billing</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenUserModal(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateUser}
            sx={{ backgroundColor: '#0F2942', color: '#FFF', fontWeight: 700, textTransform: 'none', '&:hover': { backgroundColor: '#1E3A5F' } }}
          >
            Authorize Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL: CREATE FLIGHT RECORD                                               */}
      {/* ========================================================================= */}
      <Dialog
        open={openFlightModal}
        onClose={() => setOpenFlightModal(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              p: 1.5,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 24px 60px rgba(15, 41, 66, 0.16)',
            },
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
          Schedule New Flight Movement
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            fullWidth
            label="Flight Number"
            placeholder="e.g. SPH-505"
            value={newFlightNum}
            onChange={(e) => setNewFlightNum(e.target.value)}
          />
          <TextField
            fullWidth
            label="Route (Origin ➔ Destination)"
            placeholder="e.g. SPH ➔ SIN (Singapore Changi)"
            value={newFlightRoute}
            onChange={(e) => setNewFlightRoute(e.target.value)}
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Assigned Gate"
              placeholder="e.g. Gate B14"
              value={newFlightGate}
              onChange={(e) => setNewFlightGate(e.target.value)}
            />
            <TextField
              label="Scheduled Time (UTC)"
              placeholder="e.g. 14:30"
              value={newFlightTime}
              onChange={(e) => setNewFlightTime(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenFlightModal(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateFlight}
            sx={{ backgroundColor: '#0F2942', color: '#FFF', fontWeight: 700, textTransform: 'none', '&:hover': { backgroundColor: '#1E3A5F' } }}
          >
            Create Flight
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL: MASTER OPERATIONAL OVERRIDES (ADMINISTRATIVE DISPATCH AUTHORITY)    */}
      {/* ========================================================================= */}
      <Dialog
        open={overrideModalOpen}
        onClose={() => setOverrideModalOpen(false)}
        fullWidth
        maxWidth="md"
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              p: 2,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 24px 60px rgba(15, 41, 66, 0.2)',
            },
          },
        }}
      >
        <DialogTitle sx={{ p: 1, pb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <ShieldAlert size={20} color="#0284C7" />
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#0F2942' }}>
                  Master Operational Overrides
                </Typography>
                <Chip
                  label="EXECUTIVE DISPATCH"
                  size="small"
                  sx={{ backgroundColor: '#FEF3C7', color: '#B45309', fontWeight: 800, fontSize: '0.65rem' }}
                />
              </Box>
              <Typography sx={{ fontSize: '0.84rem', color: '#64748B' }}>
                Administrative dispatch authority console · Force flight states, override stands, clear turnaround prerequisites, and broadcast directives.
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setOverrideModalOpen(false)}>
              <X size={18} color="#64748B" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 1, pt: 1 }}>
          {/* Action Selector Pills */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3, p: 0.5, backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            {[
              { id: 'status', label: '1. Force-Push Flight State' },
              { id: 'gate', label: '2. Master Stand Allocation' },
              { id: 'turnaround', label: '3. Turnaround Sign-Off' },
              { id: 'lockdown', label: '4. Terminal Facility Lockdown' },
            ].map((sec) => (
              <Button
                key={sec.id}
                size="small"
                onClick={() => setOverrideSection(sec.id as any)}
                sx={{
                  flex: 1,
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  textTransform: 'none',
                  borderRadius: '8px',
                  py: 0.8,
                  backgroundColor: overrideSection === sec.id ? '#0F2942' : 'transparent',
                  color: overrideSection === sec.id ? '#FFFFFF' : '#64748B',
                  '&:hover': {
                    backgroundColor: overrideSection === sec.id ? '#1E3A5F' : '#F1F5F9',
                  },
                }}
              >
                {sec.label}
              </Button>
            ))}
          </Box>

          {/* SECTION 1: FORCE-PUSH FLIGHT STATE */}
          {overrideSection === 'status' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, p: 1 }}>
              <Box sx={{ p: 2, borderRadius: '10px', backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD' }}>
                <Typography sx={{ fontSize: '0.82rem', color: '#0369A1', fontWeight: 600 }}>
                  Directly sets flight movement status across all operational radar and public passenger trackers, bypassing normal turnaround prerequisite checks.
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Target Aircraft Flight</InputLabel>
                  <Select
                    value={overrideFlightNum}
                    label="Target Aircraft Flight"
                    onChange={(e) => setOverrideFlightNum(e.target.value)}
                  >
                    {flights.map((f) => (
                      <MenuItem key={f.flightNumber} value={f.flightNumber}>
                        {f.flightNumber} ({f.route}) — Current: {f.status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Target Movement Status</InputLabel>
                  <Select
                    value={overrideStatus}
                    label="Target Movement Status"
                    onChange={(e) => setOverrideStatus(e.target.value as any)}
                  >
                    <MenuItem value="SCHEDULED">SCHEDULED</MenuItem>
                    <MenuItem value="BOARDING">BOARDING</MenuItem>
                    <MenuItem value="AIRBORNE">AIRBORNE</MenuItem>
                    <MenuItem value="ON_BLOCK">ON_BLOCK</MenuItem>
                    <MenuItem value="DELAYED">DELAYED</MenuItem>
                    <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                fullWidth
                label="Operational Justification (Mandatory for Audit Compliance)"
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="e.g. Executive operational vector acceleration approved by Operations Director"
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
                <Button onClick={() => setOverrideModalOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleExecuteStatusOverride}
                  sx={{ backgroundColor: '#0F2942', color: '#FFF', fontWeight: 700, textTransform: 'none', px: 2.5 }}
                >
                  Authorize Status Override
                </Button>
              </Box>
            </Box>
          )}

          {/* SECTION 2: MASTER STAND ALLOCATION */}
          {overrideSection === 'gate' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, p: 1 }}>
              <Box sx={{ p: 2, borderRadius: '10px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <Typography sx={{ fontSize: '0.82rem', color: '#166534', fontWeight: 600 }}>
                  Forces immediate aerobridge or ramp hardstand reassignment for any flight, updating Airside Ops, AOCC displays, and passenger gate boards.
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Aircraft Flight</InputLabel>
                  <Select
                    value={overrideFlightNum}
                    label="Aircraft Flight"
                    onChange={(e) => setOverrideFlightNum(e.target.value)}
                  >
                    {flights.map((f) => (
                      <MenuItem key={f.flightNumber} value={f.flightNumber}>
                        {f.flightNumber} — {f.gate}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Target Stand / Aerobridge</InputLabel>
                  <Select
                    value={overrideGateCode}
                    label="Target Stand / Aerobridge"
                    onChange={(e) => setOverrideGateCode(e.target.value)}
                  >
                    {aocsDataStore.getGates().map((g) => (
                      <MenuItem key={g.gateCode} value={g.gateCode}>
                        Gate {g.gateCode} ({g.terminalName}) — {g.status} {g.assignedFlightNumber ? `[${g.assignedFlightNumber}]` : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle2 size={16} color="#15803D" />
                <Typography sx={{ fontSize: '0.82rem', color: '#334155' }}>
                  Conflict resolution bypass: Automatically evicts any previous flight on this stand and re-routes ground crews.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
                <Button onClick={() => setOverrideModalOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleExecuteGateOverride}
                  sx={{ backgroundColor: '#0F2942', color: '#FFF', fontWeight: 700, textTransform: 'none', px: 2.5 }}
                >
                  Execute Stand Assignment
                </Button>
              </Box>
            </Box>
          )}

          {/* SECTION 3: TURNAROUND SIGN-OFF */}
          {overrideSection === 'turnaround' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, p: 1 }}>
              <Box sx={{ p: 2, borderRadius: '10px', backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE' }}>
                <Typography sx={{ fontSize: '0.82rem', color: '#4338CA', fontWeight: 600 }}>
                  Administrative Turnaround Bypass: Authorizes immediate completion of Cabin Cleaning, Fueling, Canine Security Sweep, and Line Maintenance Release. Unlocks boarding turnstiles instantly.
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Aircraft Flight</InputLabel>
                  <Select
                    value={overrideFlightNum}
                    label="Aircraft Flight"
                    onChange={(e) => setOverrideFlightNum(e.target.value)}
                  >
                    {flights.map((f) => (
                      <MenuItem key={f.flightNumber} value={f.flightNumber}>
                        {f.flightNumber} ({f.route})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Supervisor Authorization PIN"
                  placeholder="Enter 8821"
                  value={overridePin}
                  onChange={(e) => setOverridePin(e.target.value)}
                  helperText="Default supervisor authority PIN: 8821"
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
                <Button onClick={() => setOverrideModalOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleExecuteTurnaroundClear}
                  sx={{ backgroundColor: '#0F2942', color: '#FFF', fontWeight: 700, textTransform: 'none', px: 2.5 }}
                >
                  Sign-Off All Prerequisites
                </Button>
              </Box>
            </Box>
          )}

          {/* SECTION 4: TERMINAL FACILITY LOCKDOWN */}
          {overrideSection === 'lockdown' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, p: 1 }}>
              <Box sx={{ p: 2, borderRadius: '10px', backgroundColor: terminalLocked ? '#FEF2F2' : '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <Typography sx={{ fontSize: '0.84rem', color: terminalLocked ? '#991B1B' : '#475569', fontWeight: 600 }}>
                  {terminalLocked
                    ? 'TERMINAL FACILITY LOCKDOWN IS CURRENTLY ACTIVE. All gate turnstiles are locked and biometric e-gates held.'
                    : 'Emergency Facility Control: Suspends all boarding turnstiles, locks aerobridge doors, and broadcasts high-priority alerts to airport security.'}
                </Typography>
              </Box>

              <FormControl fullWidth>
                <InputLabel>Target Terminal Facility</InputLabel>
                <Select
                  value={overrideTerminal}
                  label="Target Terminal Facility"
                  onChange={(e) => setOverrideTerminal(e.target.value)}
                >
                  <MenuItem value="Terminal 1">Terminal 1 (Gates A01 - A20)</MenuItem>
                  <MenuItem value="Terminal 2">Terminal 2 (Gates B01 - C30)</MenuItem>
                  <MenuItem value="All Terminals">All Airport Terminals (T1 + T2)</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
                <Button onClick={() => setOverrideModalOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleExecuteLockdownToggle}
                  sx={{
                    backgroundColor: terminalLocked ? '#15803D' : '#DC2626',
                    color: '#FFF',
                    fontWeight: 700,
                    textTransform: 'none',
                    px: 2.5,
                    '&:hover': { backgroundColor: terminalLocked ? '#166534' : '#B91C1C' },
                  }}
                >
                  {terminalLocked ? 'Lift Lockdown & Restore Operations' : 'Initiate Security Lockdown'}
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL: TURNAROUND SLA & GATING TELEMETRY                                  */}
      {/* ========================================================================= */}
      <Dialog
        open={turnaroundModalOpen}
        onClose={() => setTurnaroundModalOpen(false)}
        fullWidth
        maxWidth="md"
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              p: 2,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 24px 60px rgba(15, 41, 66, 0.2)',
            },
          },
        }}
      >
        <DialogTitle sx={{ p: 1, pb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <Sliders size={20} color="#6366F1" />
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#0F2942' }}>
                  Turnaround SLA & Apron Gating Telemetry
                </Typography>
                <Chip label="LIVE AOCS SYNC" size="small" sx={{ backgroundColor: '#EEF2FF', color: '#4338CA', fontWeight: 800, fontSize: '0.65rem' }} />
              </Box>
              <Typography sx={{ fontSize: '0.84rem', color: '#64748B' }}>
                Prerequisite gating telemetry across Cleaning, Fueling, Security Sweeps, and Maintenance.
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setTurnaroundModalOpen(false)}>
              <X size={18} color="#64748B" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 1, maxHeight: 520, overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {flights.map((flight) => {
              const prereq = aocsDataStore.getFlightPrerequisites(flight.flightNumber);
              const tasks = aocsDataStore.getTasks().filter((t) => t.flightNumber === flight.flightNumber);

              return (
                <Card key={flight.flightNumber} variant="outlined" sx={{ p: 2, borderRadius: '12px', borderColor: '#E2E8F0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#0F2942' }}>
                        {flight.flightNumber}
                      </Typography>
                      <Typography sx={{ fontSize: '0.82rem', color: '#64748B' }}>
                        {flight.route} · {flight.aircraft}
                      </Typography>
                    </Box>
                    <Chip
                      label={prereq.boardingPermitted ? 'Boarding Gate Unlocked' : 'Prerequisites Incomplete'}
                      size="small"
                      sx={{
                        backgroundColor: prereq.boardingPermitted ? '#DCFCE7' : '#FEF3C7',
                        color: prereq.boardingPermitted ? '#15803D' : '#92400E',
                        fontWeight: 800,
                        fontSize: '0.68rem',
                      }}
                    />
                  </Box>

                  {/* 4 Prerequisite Checks */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, mb: 2 }}>
                    {[
                      { label: 'Security K9', cleared: prereq.securityCleared },
                      { label: 'Cabin Clean', cleared: prereq.cleaningCleared },
                      { label: 'Refueling', cleared: prereq.fuelingCleared },
                      { label: 'Maintenance', cleared: prereq.maintenanceCleared },
                    ].map((item, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          p: 1,
                          borderRadius: '8px',
                          textAlign: 'center',
                          backgroundColor: item.cleared ? '#F0FDF4' : '#FFFBEB',
                          border: `1px solid ${item.cleared ? '#BBF7D0' : '#FDE68A'}`,
                        }}
                      >
                        <Typography sx={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
                          {item.label}
                        </Typography>
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, color: item.cleared ? '#15803D' : '#B45309' }}>
                          {item.cleared ? 'PASS ●' : 'PENDING'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Tasks breakdown */}
                  {tasks.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                      {tasks.map((t) => (
                        <Box
                          key={t.taskId}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 1,
                            borderRadius: '6px',
                            backgroundColor: '#F8FAFC',
                            fontSize: '0.78rem',
                          }}
                        >
                          <Typography sx={{ fontWeight: 600, color: '#0F2942' }}>
                            {t.taskName} ({t.departmentName})
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Typography sx={{ color: '#64748B', fontSize: '0.74rem' }}>
                              {t.actualStart || t.plannedStart} - {t.actualEnd || t.plannedEnd}
                            </Typography>
                            <Chip
                              label={t.status}
                              size="small"
                              sx={{
                                height: '20px',
                                fontSize: '0.64rem',
                                fontWeight: 800,
                                backgroundColor: t.status === 'COMPLETED' ? '#DCFCE7' : '#FEF3C7',
                                color: t.status === 'COMPLETED' ? '#15803D' : '#B45309',
                              }}
                            />
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Card>
              );
            })}
          </Box>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SystemAdminDashboard;
