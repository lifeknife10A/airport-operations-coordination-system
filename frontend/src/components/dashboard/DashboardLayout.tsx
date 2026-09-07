import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Badge, Menu, MenuItem, Tooltip, Avatar, Chip } from '@mui/material';
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
} from 'lucide-react';

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
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
    accent: '#38BDF8',
    tag: 'ADMIN',
    items: [
      { label: 'Overview & Telemetry', path: '/dashboard/system-admin', icon: <Sliders size={18} /> },
      { label: 'User RBAC Accounts', path: '/dashboard/system-admin#users', icon: <Users size={18} />, badge: 'Active' },
      { label: 'Flight Coordinator', path: '/dashboard/system-admin#flights', icon: <Plane size={18} /> },
      { label: 'Security & Audit Logs', path: '/dashboard/system-admin#audit', icon: <ShieldCheck size={18} /> },
    ],
  },
  'aocc': {
    name: 'AOCC Operations Controller',
    roleKey: 'aocc',
    accent: '#818CF8',
    tag: 'AOCC',
    items: [
      { label: 'Live Operations Center', path: '/dashboard/aocc', icon: <Radio size={18} /> },
      { label: 'Terminal Gate Occupancy', path: '/dashboard/aocc#gates', icon: <Layers size={18} />, badge: 'T1/T2' },
      { label: 'Turnaround Gantt Timeline', path: '/dashboard/aocc#timeline', icon: <Briefcase size={18} /> },
      { label: 'Delay & Incident Log', path: '/dashboard/aocc#delays', icon: <ShieldAlert size={18} /> },
    ],
  },
  'ground-ops': {
    name: 'Ground Ops Supervisor',
    roleKey: 'ground-ops',
    accent: '#FBBF24',
    tag: 'RAMP',
    items: [
      { label: 'Ramp Turnaround Center', path: '/dashboard/ground-ops', icon: <Plane size={18} /> },
      { label: 'Task Dispatch & Crew', path: '/dashboard/ground-ops#tasks', icon: <Briefcase size={18} />, badge: '12 Active' },
      { label: 'Shift Handover Protocol', path: '/dashboard/ground-ops#handover', icon: <Layers size={18} /> },
    ],
  },
  'department': {
    name: 'Department Workspaces',
    roleKey: 'department',
    accent: '#34D399',
    tag: 'SERVICES',
    items: [
      { label: 'Department Overview', path: '/dashboard/department', icon: <Briefcase size={18} /> },
      { label: 'Aircraft Maintenance', path: '/dashboard/department#maintenance', icon: <Wrench size={18} /> },
      { label: 'Jet A-1 Fuel Logistics', path: '/dashboard/department#fuel', icon: <Fuel size={18} /> },
      { label: 'Cabin Cleaning & Turnaround', path: '/dashboard/department#cleaning', icon: <Sparkles size={18} /> },
      { label: 'Airside Security Clearance', path: '/dashboard/department#security', icon: <ShieldCheck size={18} /> },
    ],
  },
  'airside-ops': {
    name: 'Airside & Runway Operations',
    roleKey: 'airside-ops',
    accent: '#38BDF8',
    tag: 'AIRSIDE',
    items: [
      { label: 'Runway & Taxiway Status', path: '/dashboard/airside-ops', icon: <Plane size={18} /> },
      { label: 'Apron Stand Allocation', path: '/dashboard/airside-ops#stands', icon: <Layers size={18} /> },
      { label: 'METAR Weather Advisory', path: '/dashboard/airside-ops#weather', icon: <Radio size={18} /> },
    ],
  },
  'logistics': {
    name: 'Logistics & Cargo Freight',
    roleKey: 'logistics',
    accent: '#F472B6',
    tag: 'LOGISTICS',
    items: [
      { label: 'Cargo Manifest & AWB', path: '/dashboard/logistics', icon: <Truck size={18} /> },
      { label: 'Baggage Conveyor Telemetry', path: '/dashboard/logistics#baggage', icon: <Layers size={18} /> },
      { label: 'Apron Refueling Fleet', path: '/dashboard/logistics#fleet', icon: <Fuel size={18} /> },
    ],
  },
  'passenger-security': {
    name: 'Passenger & Security Ops',
    roleKey: 'passenger-security',
    accent: '#A78BFA',
    tag: 'SECURITY',
    items: [
      { label: 'Passenger Manifest Clearance', path: '/dashboard/passenger-security', icon: <UserCheck size={18} /> },
      { label: 'Biometric Boarding Gates', path: '/dashboard/passenger-security#gates', icon: <Radio size={18} /> },
      { label: 'VIP Lounge Occupancy', path: '/dashboard/passenger-security#lounges', icon: <Layers size={18} /> },
    ],
  },
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeRole: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [utcTime, setUtcTime] = useState<string>('');
  const [roleMenuAnchor, setRoleMenuAnchor] = useState<null | HTMLElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentConfig = ROLE_CONFIGS[activeRole] || ROLE_CONFIGS['system-admin'];

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#070B16', color: '#F8FAFC' }}>
      {/* SIDEBAR */}
      <Box
        sx={{
          width: sidebarOpen ? { xs: '260px', md: '280px' } : '0px',
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
          backgroundColor: 'rgba(11, 16, 32, 0.95)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 120,
          position: { xs: 'fixed', md: 'relative' },
          height: '100vh',
        }}
      >
        {/* Brand Header */}
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)',
              }}
            >
              <Plane size={20} color="#FFFFFF" />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.15rem', color: '#FFFFFF', lineHeight: 1.1 }}>
                SAPHIRE AOCS
              </Typography>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', color: currentConfig.accent, fontWeight: 700, letterSpacing: '0.15em' }}>
                EXECUTIVE OPS
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={() => setSidebarOpen(false)} sx={{ display: { md: 'none' }, color: '#94A3B8' }}>
            <X size={18} />
          </IconButton>
        </Box>

        {/* Current Active Role Card */}
        <Box sx={{ p: 2.5, m: 2, borderRadius: '14px', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Chip label={currentConfig.tag} size="small" sx={{ backgroundColor: `${currentConfig.accent}20`, color: currentConfig.accent, fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.68rem', height: '22px' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Radio size={12} color="#34D399" className="animate-pulse" />
              <Typography sx={{ fontSize: '0.7rem', color: '#34D399', fontWeight: 600 }}>ONLINE</Typography>
            </Box>
          </Box>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF', fontSize: '0.92rem' }}>
            {currentConfig.name}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', mt: 0.3 }}>
            Terminal Command Station
          </Typography>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ flexGrow: 1, px: 2, py: 1, overflowY: 'auto' }}>
          <Typography sx={{ px: 1.5, py: 1, fontSize: '0.7rem', fontFamily: "'Outfit', sans-serif", fontWeight: 700, letterSpacing: '0.12em', color: '#64748B' }}>
            ROLE MODULES
          </Typography>
          {currentConfig.items.map((item) => {
            const isActive = location.pathname === item.path || (location.hash && item.path.includes(location.hash));
            return (
              <Box
                key={item.label}
                onClick={() => {
                  if (item.path.startsWith('/dashboard')) navigate(item.path);
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 1.3,
                  mb: 0.8,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'rgba(56, 189, 248, 0.14)' : 'transparent',
                  border: isActive ? `1px solid ${currentConfig.accent}40` : '1px solid transparent',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#FFFFFF',
                    transform: 'translateX(3px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ color: isActive ? currentConfig.accent : '#64748B' }}>{item.icon}</Box>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.88rem', fontWeight: isActive ? 700 : 500 }}>
                    {item.label}
                  </Typography>
                </Box>
                {item.badge && (
                  <Chip label={item.badge} size="small" sx={{ height: '18px', fontSize: '0.65rem', backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', fontWeight: 700 }} />
                )}
              </Box>
            );
          })}
        </Box>

        {/* Public Portal Switch & Logout */}
        <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <Box
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1.2,
              borderRadius: '10px',
              cursor: 'pointer',
              color: '#94A3B8',
              '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8' },
            }}
          >
            <ExternalLink size={16} />
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem', fontWeight: 600 }}>
              Exit to Passenger Portal
            </Typography>
          </Box>
          <Box
            onClick={() => navigate('/login')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1.2,
              mt: 0.5,
              borderRadius: '10px',
              cursor: 'pointer',
              color: '#EF4444',
              '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.12)' },
            }}
          >
            <LogOut size={16} />
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem', fontWeight: 600 }}>
              End Operational Session
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* MAIN CONTENT AREA */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        {/* TOP EXECUTIVE BAR */}
        <Box
          sx={{
            height: '68px',
            backgroundColor: 'rgba(11, 16, 32, 0.92)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(16px)',
            px: { xs: 2, md: 4 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: '#94A3B8' }}>
              <MenuIcon size={20} />
            </IconButton>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem', color: '#64748B' }}>AOCS CONTROL</Typography>
              <ChevronRight size={14} color="#64748B" />
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.88rem', fontWeight: 700, color: '#F8FAFC' }}>
                {currentConfig.name}
              </Typography>
            </Box>
          </Box>

          {/* Right: Live Clocks, Fast Role Switcher, Alerts */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 3 } }}>
            {/* Live Dual UTC / Local Clocks */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2, px: 2, py: 0.8, borderRadius: '10px', background: 'rgba(2, 6, 23, 0.65)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontFamily: "'Inter', monospace", fontSize: '0.82rem', fontWeight: 700, color: '#38BDF8' }}>
                  {utcTime}
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>ZULU TIME</Typography>
              </Box>
              <Box sx={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <Box>
                <Typography sx={{ fontFamily: "'Inter', monospace", fontSize: '0.82rem', fontWeight: 700, color: '#F8FAFC' }}>
                  {currentTime}
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>LOCAL STATION</Typography>
              </Box>
            </Box>

            {/* Quick Role Switcher Button */}
            <Chip
              icon={<Sliders size={14} color="#38BDF8" />}
              label="Switch Workspace"
              onClick={(e) => setRoleMenuAnchor(e.currentTarget)}
              clickable
              sx={{
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38BDF8',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: '0.78rem',
                height: '32px',
                '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.25)' },
              }}
            />

            {/* Role Menu Dropdown */}
            <Menu
              anchorEl={roleMenuAnchor}
              open={Boolean(roleMenuAnchor)}
              onClose={() => setRoleMenuAnchor(null)}
              PaperProps={{
                sx: {
                  backgroundColor: '#0F172A',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '14px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                  minWidth: '240px',
                  mt: 1,
                },
              }}
            >
              {Object.entries(ROLE_CONFIGS).map(([key, cfg]) => (
                <MenuItem
                  key={key}
                  onClick={() => {
                    setRoleMenuAnchor(null);
                    navigate(`/dashboard/${key}`);
                  }}
                  selected={key === activeRole}
                  sx={{
                    py: 1.2,
                    px: 2,
                    gap: 1.5,
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '0.88rem',
                    color: key === activeRole ? '#38BDF8' : '#CBD5E1',
                    '&.Mui-selected': { backgroundColor: 'rgba(56, 189, 248, 0.15)' },
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.06)' },
                  }}
                >
                  <Chip label={cfg.tag} size="small" sx={{ height: '18px', fontSize: '0.65rem', backgroundColor: `${cfg.accent}25`, color: cfg.accent, fontWeight: 800 }} />
                  {cfg.name}
                </MenuItem>
              ))}
            </Menu>

            {/* Notifications Bell */}
            <Tooltip title="Airside Priority Alerts">
              <IconButton sx={{ color: '#94A3B8', '&:hover': { color: '#38BDF8' } }}>
                <Badge badgeContent={3} color="primary">
                  <Bell size={19} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* User Avatar */}
            <Avatar sx={{ width: 34, height: 34, bgcolor: currentConfig.accent, color: '#070B16', fontWeight: 800, fontSize: '0.85rem' }}>
              {currentConfig.tag.slice(0, 2)}
            </Avatar>
          </Box>
        </Box>

        {/* WORKSPACE BODY */}
        <Box sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 }, maxWidth: '1600px', width: '100%', mx: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
