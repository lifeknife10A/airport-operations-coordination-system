import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Popover,
  Dialog,
  DialogContent,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Button,
  Tooltip,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Plane,
  ShieldCheck,
  Radio,
  Sliders,
  Users,
  Briefcase,
  Layers,
  Truck,
  UserCheck,
  Bell,
  Search,
  LogOut,
  ChevronRight,
  ExternalLink,
  Wrench,
  Fuel,
  Sparkles,
  ShieldAlert,
  Menu as MenuIcon,
  X,
  FileText,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  PanelLeftClose,
  PanelLeft,
  Wind,
  Package,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { aocsDataStore } from '../../services/aocsDataStore';

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
  section?: string;
}

interface RoleConfig {
  name: string;
  roleKey: string;
  accent: string;
  tag: string;
  items: SidebarItem[];
}

const ROLE_CONFIGS: Record<string, RoleConfig> = {
  'system-admin': {
    name: 'System Administrator',
    roleKey: 'system-admin',
    accent: '#0284C7',
    tag: 'ADMIN',
    items: [
      { label: 'Overview', path: '/dashboard/system-admin', icon: <Sliders size={18} />, section: 'MAIN' },
      { label: 'Flights', path: '/dashboard/system-admin#flights', icon: <Plane size={18} />, badge: '64 Active', section: 'OPERATIONS' },
      { label: 'Staff Users', path: '/dashboard/system-admin#users', icon: <Users size={18} />, section: 'OPERATIONS' },
      { label: 'Roles & RBAC', path: '/dashboard/system-admin#roles', icon: <ShieldCheck size={18} />, section: 'OPERATIONS' },
      { label: 'Audit Trail', path: '/dashboard/system-admin#audit', icon: <FileText size={18} />, section: 'OPERATIONS' },
      { label: 'Reports & SLA', path: '/dashboard/system-admin#reports', icon: <Radio size={18} />, section: 'OPERATIONS' },
      { label: 'Notifications', path: '/dashboard/system-admin#notifications', icon: <Bell size={18} />, badge: '7', section: 'SYSTEM' },
      { label: 'Profile & Settings', path: '/dashboard/system-admin#profile', icon: <UserCheck size={18} />, section: 'SYSTEM' },
    ],
  },
  'aocc': {
    name: 'AOCC Controller',
    roleKey: 'aocc',
    accent: '#0284C7',
    tag: 'AOCC',
    items: [
      { label: 'Dashboard', path: '/dashboard/aocc', icon: <Sliders size={18} />, section: 'MAIN' },
      { label: 'Live Flight Monitor', path: '/dashboard/aocc#flights', icon: <Plane size={18} />, badge: '64 Active', section: 'OPERATIONS' },
      { label: 'Flight Details', path: '/dashboard/aocc#details', icon: <FileText size={18} />, section: 'OPERATIONS' },
      { label: 'Gate Occupancy', path: '/dashboard/aocc#gates', icon: <Layers size={18} />, badge: '86%', section: 'OPERATIONS' },
      { label: 'Turnaround Timeline', path: '/dashboard/aocc#turnaround', icon: <Clock size={18} />, section: 'OPERATIONS' },
      { label: 'Delay Logs', path: '/dashboard/aocc#delays', icon: <AlertTriangle size={18} />, badge: '5', section: 'OPERATIONS' },
      { label: 'Notifications', path: '/dashboard/aocc#notifications', icon: <Bell size={18} />, badge: '3', section: 'MONITORING' },
      { label: 'Profile', path: '/dashboard/aocc#profile', icon: <UserCheck size={18} />, section: 'ACCOUNT' },
    ],
  },
  'ground-ops': {
    name: 'Ground Ops Supervisor',
    roleKey: 'ground-ops',
    accent: '#10B981',
    tag: 'RAMP',
    items: [
      { label: 'Dashboard', path: '/dashboard/ground-ops', icon: <Sliders size={18} />, section: 'MAIN' },
      { label: 'Active Flights', path: '/dashboard/ground-ops#flights', icon: <Plane size={18} />, badge: '18 Active', section: 'OPERATIONS' },
      { label: 'Task Center', path: '/dashboard/ground-ops#tasks', icon: <CheckCircle2 size={18} />, badge: '32', section: 'OPERATIONS' },
      { label: 'Task Assignment', path: '/dashboard/ground-ops#assignment', icon: <Users size={18} />, section: 'OPERATIONS' },
      { label: 'Shift Handover', path: '/dashboard/ground-ops#handover', icon: <Briefcase size={18} />, badge: '3 Pending', section: 'OPERATIONS' },
      { label: 'Notifications', path: '/dashboard/ground-ops#notifications', icon: <Bell size={18} />, badge: '2', section: 'MONITORING' },
      { label: 'Profile', path: '/dashboard/ground-ops#profile', icon: <UserCheck size={18} />, section: 'ACCOUNT' },
    ],
  },
  'department': {
    name: 'Department Workspaces',
    roleKey: 'department',
    accent: '#0284C7',
    tag: 'WORKSPACES',
    items: [
      { label: 'Overview', path: '/dashboard/department', icon: <Sliders size={18} />, section: 'MAIN' },
      { label: 'Cabin Cleaning', path: '/dashboard/department#cleaning', icon: <Sparkles size={18} />, badge: '3 Active', section: 'DEPARTMENTS' },
      { label: 'Fuel Operations', path: '/dashboard/department#fuel', icon: <Fuel size={18} />, badge: 'Calculator', section: 'DEPARTMENTS' },
      { label: 'Aircraft Maintenance', path: '/dashboard/department#maintenance', icon: <Wrench size={18} />, badge: '1 Fault', section: 'DEPARTMENTS' },
      { label: 'Security Clearance', path: '/dashboard/department#security', icon: <ShieldCheck size={18} />, badge: 'PIN Sign', section: 'DEPARTMENTS' },
      { label: 'Assigned Flights', path: '/dashboard/department#flights', icon: <Plane size={18} />, section: 'OPERATIONS' },
      { label: 'Task Center', path: '/dashboard/department#tasks', icon: <CheckCircle2 size={18} />, badge: '18', section: 'OPERATIONS' },
      { label: 'Notifications', path: '/dashboard/department#notifications', icon: <Bell size={18} />, badge: '3', section: 'MONITORING' },
      { label: 'Staff Profile', path: '/dashboard/department#profile', icon: <UserCheck size={18} />, section: 'ACCOUNT' },
    ],
  },
  'airside-ops': {
    name: 'Airside Ops Lead',
    roleKey: 'airside-ops',
    accent: '#0284C7',
    tag: 'AIRSIDE',
    items: [
      { label: 'Overview', path: '/dashboard/airside-ops', icon: <Sliders size={18} />, section: 'MAIN' },
      { label: 'Gate Allocation', path: '/dashboard/airside-ops#gates', icon: <Layers size={18} />, badge: '24 Gates', section: 'OPERATIONS' },
      { label: 'Runway Status', path: '/dashboard/airside-ops#runways', icon: <Wind size={18} />, badge: '4 Active', section: 'OPERATIONS' },
      { label: 'Flight Assignment', path: '/dashboard/airside-ops#assignments', icon: <Plane size={18} />, badge: '12 Flights', section: 'OPERATIONS' },
      { label: 'Notifications', path: '/dashboard/airside-ops#notifications', icon: <Bell size={18} />, badge: '3', section: 'MONITORING' },
      { label: 'Profile', path: '/dashboard/airside-ops#profile', icon: <UserCheck size={18} />, section: 'ACCOUNT' },
    ],
  },
  'logistics': {
    name: 'Logistics Supervisor',
    roleKey: 'logistics',
    accent: '#0284C7',
    tag: 'LOGISTICS',
    items: [
      { label: 'Overview', path: '/dashboard/logistics', icon: <Sliders size={18} />, section: 'MAIN' },
      { label: 'Cargo Manifest', path: '/dashboard/logistics#cargo', icon: <Package size={18} />, badge: '7 Active', section: 'OPERATIONS' },
      { label: 'Baggage Carousels', path: '/dashboard/logistics#baggage', icon: <Layers size={18} />, badge: '6 Belts', section: 'OPERATIONS' },
      { label: 'Fuel Operations', path: '/dashboard/logistics#fuel', icon: <Fuel size={18} />, badge: 'Hydrant', section: 'OPERATIONS' },
      { label: 'Logistics Timeline', path: '/dashboard/logistics#timeline', icon: <Clock size={18} />, section: 'OPERATIONS' },
      { label: 'Notifications', path: '/dashboard/logistics#notifications', icon: <Bell size={18} />, badge: '3', section: 'MONITORING' },
      { label: 'Profile', path: '/dashboard/logistics#profile', icon: <UserCheck size={18} />, section: 'ACCOUNT' },
    ],
  },
  'passenger-security': {
    name: 'Passenger & Security Ops',
    roleKey: 'passenger-security',
    accent: '#0284C7',
    tag: 'SECURITY',
    items: [
      { label: 'Overview', path: '/dashboard/passenger-security', icon: <Sliders size={18} />, section: 'MAIN' },
      { label: 'Boarding Control', path: '/dashboard/passenger-security#boarding', icon: <Plane size={18} />, badge: 'Gate A12', section: 'OPERATIONS' },
      { label: 'Passenger Clearance', path: '/dashboard/passenger-security#clearance', icon: <ShieldCheck size={18} />, badge: '3 Flagged', section: 'OPERATIONS' },
      { label: 'Lost & Found', path: '/dashboard/passenger-security#lost-found', icon: <Package size={18} />, badge: '4 New', section: 'OPERATIONS' },
      { label: 'Incidents', path: '/dashboard/passenger-security#incidents', icon: <AlertTriangle size={18} />, badge: '2 Active', section: 'OPERATIONS' },
      { label: 'Lounge Activity', path: '/dashboard/passenger-security#lounges', icon: <Layers size={18} />, section: 'OPERATIONS' },
      { label: 'Notifications', path: '/dashboard/passenger-security#notifications', icon: <Bell size={18} />, badge: '4', section: 'MONITORING' },
      { label: 'Profile', path: '/dashboard/passenger-security#profile', icon: <UserCheck size={18} />, section: 'ACCOUNT' },
    ],
  },
};

const ROLE_TO_DASHBOARD: Record<string, string> = {
  'SYSTEM_ADMINISTRATOR': 'system-admin',
  'AIRPORT_OPERATIONS_MANAGER': 'aocc',
  'GROUND_HANDLING_SUPERVISOR': 'ground-ops',
  'RAMP_AGENT': 'ground-ops',
  'AIRLINE_BILLING_CLERK': 'department',
  'GATE_AGENT': 'airside-ops',
  'BAGGAGE_HANDLER': 'logistics',
  'SECURITY_OFFICER': 'passenger-security',
  'IMMIGRATION_OFFICER': 'passenger-security',
};

const SEARCHABLE_ITEMS = [
  { type: 'FLIGHT', title: 'SPH-102 · London Heathrow (LHR)', sub: 'Boarding · Gate B12 · Terminal 2', link: '/dashboard/system-admin#flights' },
  { type: 'FLIGHT', title: 'SPH-204 · Dubai International (DXB)', sub: 'Scheduled · Gate A04 · Terminal 1', link: '/dashboard/system-admin#flights' },
  { type: 'FLIGHT', title: 'SPH-308 · Los Angeles (LAX)', sub: 'Airborne · Gate C22 · Terminal 2', link: '/dashboard/system-admin#flights' },
  { type: 'FLIGHT', title: 'SPH-809 · New York (JFK)', sub: 'Delayed (+20m) · Gate A10 · Terminal 1', link: '/dashboard/system-admin#flights' },
  { type: 'STAFF', title: 'Aarav Li', sub: 'System Administrator · Terminal Management', link: '/dashboard/system-admin#users' },
  { type: 'STAFF', title: 'Sai Sharma', sub: 'AOCC Operations Manager · Flight Operations', link: '/dashboard/system-admin#users' },
  { type: 'STAFF', title: 'Riya Johnson', sub: 'Ground Ops Supervisor · Ground Handling', link: '/dashboard/system-admin#users' },
  { type: 'STAFF', title: 'Elena Tanaka', sub: 'Airline Billing Clerk · Finance & Billing', link: '/dashboard/system-admin#users' },
  { type: 'GATE', title: 'Gate B12', sub: 'Code F Dual-Deck Aerobridge · Terminal 2 Concourse B', link: '/dashboard/system-admin#flights' },
  { type: 'GATE', title: 'Gate A04', sub: 'Widebody Stand · Terminal 1 Concourse A', link: '/dashboard/system-admin#flights' },
  { type: 'AUDIT', title: 'ROLE_UPDATE Event #8821', sub: 'Admin updated RBAC permissions for Ground Ops', link: '/dashboard/system-admin#audit' },
  { type: 'AUDIT', title: 'GATE_ASSIGNMENT Event #8820', sub: 'Gate B12 synchronized for flight SPH-102', link: '/dashboard/system-admin#audit' },
];

const NOTIFICATIONS = [
  { id: 1, level: 'CRITICAL', title: 'Gate B12 Dual-Allocation Conflict', detail: 'SPH-102 & SPH-204 scheduled simultaneously on Aerobridge B12.', time: '2 mins ago' },
  { id: 2, level: 'WARNING', title: 'Turbulence Advisory Runway 09R', detail: 'Crosswind sheer detected exceeding 28 knots. Vector adjustments active.', time: '14 mins ago' },
  { id: 3, level: 'INFO', title: 'Shift Handover Complete', detail: 'Ground Handling Evening Roster synchronized across 42 apron crews.', time: '38 mins ago' },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeRole: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [utcTime, setUtcTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('saphire_sidebar_open');
    return saved !== null ? saved === 'true' : true;
  });

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem('saphire_sidebar_open', next.toString());
      return next;
    });
  };

  // Global search modal state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Priority Alerts Popover
  const [alertAnchor, setAlertAnchor] = useState<null | HTMLElement>(null);

  const currentConfig = ROLE_CONFIGS[activeRole] || ROLE_CONFIGS['system-admin'];

  // RBAC & Authentication Guard
  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.error('Session required. Please sign in with your operational credentials.');
      navigate('/login');
      return;
    }

    const expectedDashboard = ROLE_TO_DASHBOARD[user.roleName] || 'system-admin';
    if (expectedDashboard !== activeRole) {
      toast.error(`Access Denied: Your account (${user.roleName.replace(/_/g, ' ')}) is restricted to your assigned workspace.`);
      navigate(`/dashboard/${expectedDashboard}`);
    }
  }, [isAuthenticated, user, activeRole, navigate]);

  // Dual Zulu/Station Clocks
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setUtcTime(now.toUTCString().slice(17, 22) + ' UTC');
      setCurrentDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  // Global search Ctrl+K (strictly Admin only) and Sidebar Ctrl+B shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        if (activeRole === 'system-admin') {
          e.preventDefault();
          setSearchOpen((prev) => !prev);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeRole]);

  const searchableItems = React.useMemo(() => {
    const flights = aocsDataStore.getFlights().map((f) => ({
      type: 'FLIGHT',
      title: `${f.flightNumber} · ${f.originAirportCode} → ${f.destinationAirportCode}`,
      sub: `${f.status} · Gate ${f.gateCode || 'Unassigned'} · ${f.aircraftType}`,
      link: '/dashboard/system-admin#flights',
    }));

    const gates = aocsDataStore.getGates().map((g) => ({
      type: 'GATE',
      title: `Gate ${g.gateCode} (${g.terminalName})`,
      sub: `${g.status} · ${g.hasJetbridge ? 'Aerobridge' : 'Ramp Stand'} · Assigned: ${g.assignedFlightNumber || 'Available'}`,
      link: '/dashboard/system-admin#flights',
    }));

    const staff = aocsDataStore.getStaffUsers().map((u) => ({
      type: 'STAFF',
      title: u.fullName,
      sub: `${u.roleName} · ${u.department} (${u.email})`,
      link: '/dashboard/system-admin#users',
    }));

    const bags = aocsDataStore.getBags().map((b) => ({
      type: 'BAGGAGE',
      title: `Tag: ${b.tagNumber} (${b.flightNumber})`,
      sub: `Pax: ${b.passengerName} · Weight: ${b.weightKg}kg · Status: ${b.status}`,
      link: '/dashboard/system-admin#audit',
    }));

    const incidents = aocsDataStore.getIncidents().map((inc) => ({
      type: 'INCIDENT',
      title: `${inc.ticketId}: ${inc.title}`,
      sub: `${inc.severity} Severity · Loc: ${inc.location} · Assigned: ${inc.assignedOfficer}`,
      link: '/dashboard/system-admin#audit',
    }));

    const audits = aocsDataStore.getAuditLogs().slice(0, 15).map((log) => ({
      type: 'AUDIT',
      title: `${log.action} (#${log.auditId})`,
      sub: `${log.changePayload} · By: ${log.performedByUserName} · ${log.timestamp}`,
      link: '/dashboard/system-admin#audit',
    }));

    return [...flights, ...gates, ...staff, ...bags, ...incidents, ...audits];
  }, [searchOpen]);

  const filteredSearch = searchQuery.trim() === ''
    ? searchableItems.slice(0, 8)
    : searchableItems.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sub.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleLogout = () => {
    logout();
    toast.success('Operational session terminated.');
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION (SPANS FULL WIDTH 100% ACROSS THE ENTIRE SCREEN)       */}
      {/* ========================================================================= */}
      <Box
        component="header"
        sx={{
          height: '70px',
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02)',
          px: { xs: 2, sm: 2.5, md: 3.5 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}
      >
        {/* Left: Brand Logo & Sleek Collapse Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          <Box
            onClick={() => navigate('/')}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', userSelect: 'none' }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0F2942 0%, #1E3A5F 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(15, 41, 66, 0.2)',
                flexShrink: 0,
              }}
            >
              <Plane size={20} color="#FFFFFF" />
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, whiteSpace: 'nowrap' }}>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.12rem', color: '#0F2942', lineHeight: 1.1 }}>
                SAPHIRE AOCS
              </Typography>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.62rem', color: '#0284C7', fontWeight: 800, letterSpacing: '0.14em' }}>
                OPERATIONS HUB
              </Typography>
            </Box>
          </Box>

          {/* Sleek Collapse Toggle Button right next to Logo */}
          <Tooltip title={sidebarOpen ? "Collapse sidebar (Ctrl+B)" : "Expand sidebar (Ctrl+B)"} arrow>
            <IconButton
              size="small"
              onClick={toggleSidebar}
              sx={{
                color: '#64748B',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                width: 34,
                height: 34,
                transition: 'all 0.15s ease',
                '&:hover': { backgroundColor: '#F1F5F9', color: '#0F2942', borderColor: '#CBD5E1' },
              }}
            >
              {sidebarOpen ? <PanelLeftClose size={17} /> : <PanelLeft size={17} />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Center: Clean Modern Search Bar (System Admin Only) */}
        {activeRole === 'system-admin' && (
          <Box
            onClick={() => setSearchOpen(true)}
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1.2,
              px: 2,
              py: 0.9,
              width: { md: '280px', lg: '380px', xl: '440px' },
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              flexShrink: 1,
              mx: { md: 2, lg: 3 },
              '&:hover': {
                borderColor: '#CBD5E1',
                backgroundColor: '#F1F5F9',
              },
            }}
          >
            <Search size={16} color="#64748B" />
            <Typography sx={{ fontSize: '0.84rem', color: '#64748B', fontFamily: "'Outfit', sans-serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Search flights, staff, gates, audit records...
            </Typography>
          </Box>
        )}

        {/* Right: Live Time, Notifications, User Profile, Logout */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.2, sm: 1.8, md: 2.2 }, flexShrink: 0 }}>
          {/* Sleek Single-Line Live Time Pill (Zero wrapping at any zoom) */}
          <Box
            sx={{
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
              gap: 1.2,
              px: 2,
              py: 0.7,
              borderRadius: '999px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <Clock size={15} color="#0284C7" />
            <Typography sx={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600, whiteSpace: 'nowrap', lineHeight: 1 }}>
              {currentDate}
            </Typography>
            <Box sx={{ width: '1px', height: '14px', backgroundColor: '#CBD5E1', flexShrink: 0 }} />
            <Typography sx={{ fontFamily: "'Inter', monospace", fontSize: '0.78rem', fontWeight: 700, color: '#0284C7', whiteSpace: 'nowrap', lineHeight: 1 }}>
              {utcTime}
            </Typography>
            <Box sx={{ width: '1px', height: '14px', backgroundColor: '#CBD5E1', flexShrink: 0 }} />
            <Typography sx={{ fontFamily: "'Inter', monospace", fontSize: '0.78rem', fontWeight: 700, color: '#0F2942', whiteSpace: 'nowrap', lineHeight: 1 }}>
              {currentTime} Local
            </Typography>
          </Box>

          {/* Notifications Bell */}
          <Tooltip title="Airside Priority Alerts">
            <IconButton
              onClick={(e) => setAlertAnchor(e.currentTarget)}
              sx={{
                color: '#475569',
                backgroundColor: Boolean(alertAnchor) ? '#F1F5F9' : 'transparent',
                '&:hover': { color: '#0284C7', backgroundColor: '#F8FAFC' },
              }}
            >
              <Badge badgeContent={3} color="error">
                <Bell size={20} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Notifications Popover */}
          <Popover
            open={Boolean(alertAnchor)}
            anchorEl={alertAnchor}
            onClose={() => setAlertAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                sx: {
                  width: 360,
                  p: 2,
                  mt: 1.5,
                  borderRadius: '14px',
                  boxShadow: '0 16px 40px rgba(15, 41, 66, 0.12)',
                  border: '1px solid #E2E8F0',
                },
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, pb: 1, borderBottom: '1px solid #E2E8F0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AlertTriangle size={18} color="#0284C7" />
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.92rem', color: '#0F2942' }}>
                  Priority Airside Alerts
                </Typography>
              </Box>
              <Chip label="3 NEW" size="small" sx={{ bgcolor: '#FEF2F2', color: '#DC2626', fontWeight: 800, fontSize: '0.65rem', height: '20px' }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              {NOTIFICATIONS.map((n) => (
                <Box
                  key={n.id}
                  sx={{
                    p: 1.5,
                    borderRadius: '8px',
                    bgcolor: n.level === 'CRITICAL' ? '#FEF2F2' : n.level === 'WARNING' ? '#FFFBEB' : '#F0F9FF',
                    border: `1px solid ${n.level === 'CRITICAL' ? '#FCA5A5' : n.level === 'WARNING' ? '#FDE68A' : '#BAE6FD'}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.4 }}>
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: n.level === 'CRITICAL' ? '#991B1B' : n.level === 'WARNING' ? '#92400E' : '#0369A1' }}>
                      {n.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.68rem', color: '#64748B' }}>{n.time}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.74rem', color: '#475569', lineHeight: 1.3 }}>
                    {n.detail}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Popover>

          {/* User Profile Pill (Proptia Style) */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              px: 1.5,
              py: 0.6,
              borderRadius: '999px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: '#0F2942',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.75rem',
              }}
            >
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.84rem', fontWeight: 700, color: '#0F2942', lineHeight: 1.1 }}>
                {user?.name || 'Administrator'}
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: '#0284C7', fontWeight: 700 }}>
                {currentConfig.tag}
              </Typography>
            </Box>
          </Box>

          {/* Logout Button */}
          <Tooltip title="End Operational Session">
            <IconButton
              onClick={handleLogout}
              sx={{
                color: '#94A3B8',
                '&:hover': { color: '#DC2626', backgroundColor: 'rgba(220, 38, 38, 0.08)' },
              }}
            >
              <LogOut size={19} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ========================================================================= */}
      {/* 2. BODY LAYOUT: SIDEBAR (LEFT) + MAIN WORKSPACE (RIGHT)                   */}
      {/* ========================================================================= */}
      <Box sx={{ display: 'flex', flexGrow: 1, pt: '70px', maxWidth: '100vw', overflowX: 'hidden' }}>
        {/* ===================================================================== */}
        {/* 2A. LEFT SIDEBAR (COLLAPSIBLE: 260px FULL / 72px MINI-RAIL)           */}
        {/* ===================================================================== */}
        <Box
          component="nav"
          sx={{
            width: {
              xs: sidebarOpen ? '295px' : '0px',
              md: sidebarOpen ? '295px' : '72px',
            },
            transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
            overflowX: 'hidden',
            overflowY: 'auto',
            backgroundColor: '#FFFFFF',
            borderRight: '1px solid #E2E8F0',
            position: 'fixed',
            top: '70px',
            bottom: 0,
            left: 0,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: { xs: '4px 0 24px rgba(0,0,0,0.06)', md: 'none' },
          }}
        >
          {/* Navigation Items */}
          <Box sx={{ px: sidebarOpen ? 1.5 : 1, py: 2.5 }}>
            {['MAIN', 'DEPARTMENTS', 'OPERATIONS', 'MONITORING', 'ACCOUNT', 'SYSTEM'].map((sectionKey, secIdx) => {
              const items = currentConfig.items.filter((i) => i.section === sectionKey);
              if (items.length === 0) return null;

              return (
                <Box key={sectionKey} sx={{ mb: sidebarOpen ? 2.5 : 1.5 }}>
                  {sidebarOpen ? (
                    <Typography
                      sx={{
                        px: 1.5,
                        mb: 1,
                        fontSize: '0.68rem',
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        color: '#94A3B8',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {sectionKey}
                    </Typography>
                  ) : (
                    secIdx > 0 && <Box sx={{ my: 1, mx: 'auto', width: '28px', height: '1px', bgcolor: '#E2E8F0' }} />
                  )}

                  {items.map((item) => {
                    const isMatch =
                      location.pathname + location.hash === item.path ||
                      (item.path.includes('#')
                        ? location.hash === item.path.substring(item.path.indexOf('#'))
                        : !location.hash && location.pathname === item.path);

                    return (
                      <Tooltip
                        key={item.label}
                        title={!sidebarOpen ? (item.badge ? `${item.label} (${item.badge})` : item.label) : ''}
                        placement="right"
                        arrow
                        disableHoverListener={sidebarOpen}
                      >
                        <Box
                          onClick={() => {
                            if (item.path.startsWith('/dashboard')) navigate(item.path);
                          }}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: sidebarOpen ? 'space-between' : 'center',
                            px: sidebarOpen ? 1.5 : 0,
                            py: 1.05,
                            mb: 0.5,
                            borderRadius: '10px',
                            cursor: 'pointer',
                            backgroundColor: isMatch ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
                            color: isMatch ? '#0284C7' : '#475569',
                            transition: 'all 0.15s ease',
                            gap: 1.25,
                            minWidth: 0,
                            '&:hover': {
                              backgroundColor: isMatch ? 'rgba(2, 132, 199, 0.12)' : '#F8FAFC',
                              color: '#0F2942',
                              transform: sidebarOpen ? 'translateX(2px)' : 'none',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, justifyContent: sidebarOpen ? 'flex-start' : 'center', minWidth: 0, flex: 1, overflow: 'hidden' }}>
                            <Box sx={{ color: isMatch ? '#0284C7' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {item.icon}
                            </Box>
                            {sidebarOpen && (
                              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.83rem', fontWeight: isMatch ? 700 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.label}
                              </Typography>
                            )}
                          </Box>
                          {sidebarOpen && item.badge && (
                            <Chip
                              label={item.badge}
                              size="small"
                              sx={{
                                height: '20px',
                                fontSize: '0.64rem',
                                flexShrink: 0,
                                ml: 'auto',
                                backgroundColor: isMatch ? '#0284C7' : '#E2E8F0',
                                color: isMatch ? '#FFFFFF' : '#475569',
                                fontWeight: 700,
                                px: 0.4,
                              }}
                            />
                          )}
                        </Box>
                      </Tooltip>
                    );
                  })}
                </Box>
              );
            })}
          </Box>

          {/* Bottom Sidebar Footer */}
          <Box sx={{ p: sidebarOpen ? 2 : 1, borderTop: '1px solid #E2E8F0', backgroundColor: '#FAFAFA' }}>
            {sidebarOpen ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, px: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981', boxShadow: '0 0 6px rgba(16, 185, 129, 0.6)' }} />
                  <Typography sx={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
                    All Systems Nominal
                  </Typography>
                </Box>
                <Box
                  onClick={() => navigate('/')}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.2,
                    px: 1.5,
                    py: 1,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: '#64748B',
                    '&:hover': { backgroundColor: '#F1F5F9', color: '#0F2942' },
                  }}
                >
                  <ExternalLink size={15} />
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.82rem', fontWeight: 600 }}>
                    Exit to Public Portal
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, py: 0.5 }}>
                <Tooltip title="All Systems Nominal" placement="right">
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#10B981', boxShadow: '0 0 6px rgba(16, 185, 129, 0.6)', cursor: 'pointer' }} />
                </Tooltip>
                <Tooltip title="Exit to Public Portal" placement="right">
                  <IconButton
                    size="small"
                    onClick={() => navigate('/')}
                    sx={{ color: '#64748B', '&:hover': { color: '#0F2942', bgcolor: '#F1F5F9' } }}
                  >
                    <ExternalLink size={17} />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Box>

        {/* ===================================================================== */}
        {/* 2B. MAIN WORKSPACE (EXPANDS ON THE RIGHT OF THE SIDEBAR)               */}
        {/* ===================================================================== */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: {
              xs: 0,
              md: sidebarOpen ? '295px' : '72px',
            },
            width: {
              xs: '100%',
              md: sidebarOpen ? 'calc(100% - 295px)' : 'calc(100% - 72px)',
            },
            maxWidth: {
              xs: '100%',
              md: sidebarOpen ? 'calc(100% - 295px)' : 'calc(100% - 72px)',
            },
            boxSizing: 'border-box',
            transition: 'margin-left 0.22s cubic-bezier(0.16, 1, 0.3, 1), width 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
            minHeight: 'calc(100vh - 70px)',
            backgroundColor: '#F8FAFC',
            p: { xs: 2, sm: 2.5, md: 3.5 },
            minWidth: 0,
            overflowX: 'hidden',
          }}
        >
          {children}
        </Box>
      </Box>

      {/* ========================================================================= */}
      {/* GLOBAL SEARCH DIALOG MODAL (CTRL+K)                                       */}
      {/* ========================================================================= */}
      <Dialog
        open={searchOpen && activeRole === 'system-admin'}
        onClose={() => setSearchOpen(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 24px 60px rgba(15, 41, 66, 0.16)',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
            },
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Search size={20} color="#0284C7" />
          <TextField
            autoFocus
            fullWidth
            placeholder="Search flights, staff accounts, gates, bags, incidents, audit records..."
            variant="standard"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                disableUnderline: true,
                sx: { fontFamily: "'Outfit', sans-serif", fontSize: '0.98rem', color: '#0F2942' },
              },
            }}
          />
          {searchQuery && (
            <IconButton size="small" onClick={() => setSearchQuery('')}>
              <X size={16} color="#94A3B8" />
            </IconButton>
          )}
          <IconButton size="small" onClick={() => setSearchOpen(false)}>
            <X size={18} color="#64748B" />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 2, maxHeight: 420, overflowY: 'auto' }}>
          {filteredSearch.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography sx={{ color: '#64748B', fontSize: '0.9rem' }}>
                No matching operational records found for "{searchQuery}".
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {filteredSearch.map((item, idx) => (
                <Box
                  key={idx}
                  onClick={() => {
                    setSearchOpen(false);
                    navigate(item.link);
                  }}
                  sx={{
                    p: 1.5,
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      borderColor: '#BAE6FD',
                      backgroundColor: '#F0F9FF',
                      transform: 'translateX(3px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Chip
                      label={item.type}
                      size="small"
                      sx={{
                        height: '22px',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        backgroundColor:
                          item.type === 'FLIGHT' ? '#E0F2FE' :
                          item.type === 'STAFF' ? '#FEF3C7' :
                          item.type === 'GATE' ? '#DCFCE7' :
                          item.type === 'BAGGAGE' ? '#FFEDD5' :
                          item.type === 'INCIDENT' ? '#FEE2E2' : '#F3E8FF',
                        color:
                          item.type === 'FLIGHT' ? '#0369A1' :
                          item.type === 'STAFF' ? '#B45309' :
                          item.type === 'GATE' ? '#15803D' :
                          item.type === 'BAGGAGE' ? '#C2410C' :
                          item.type === 'INCIDENT' ? '#B91C1C' : '#6B21A8',
                      }}
                    />
                    <Box>
                      <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.88rem', fontWeight: 700, color: '#0F2942' }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {item.sub}
                      </Typography>
                    </Box>
                  </Box>
                  <ArrowRight size={16} color="#94A3B8" />
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DashboardLayout;

