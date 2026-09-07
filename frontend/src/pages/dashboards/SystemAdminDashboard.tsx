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
  TextField,
  InputAdornment,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Users,
  ShieldCheck,
  Plane,
  Server,
  Activity,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  RefreshCw,
  Sliders,
  Terminal,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { SpotlightCard } from '../../components/reactbits';

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'ACTIVE' | 'SUSPENDED';
  lastLogin: string;
}

const INITIAL_USERS: UserAccount[] = [
  { id: 'USR-901', name: 'Commander K. Vance', email: 'admin@saphire.in', role: 'System Admin', department: 'Executive Directorate', status: 'ACTIVE', lastLogin: '2 mins ago' },
  { id: 'USR-902', name: 'Elena Rostova', email: 'aocc@saphire.in', role: 'AOCC Controller', department: 'Central Operations', status: 'ACTIVE', lastLogin: '14 mins ago' },
  { id: 'USR-903', name: 'Marcus Sterling', email: 'ground@saphire.in', role: 'Ground Ops Supervisor', department: 'Ramp Services', status: 'ACTIVE', lastLogin: '1 hour ago' },
  { id: 'USR-904', name: 'Sarah Chen', email: 'airside@saphire.in', role: 'Airside Ops Lead', department: 'Airfield Safety', status: 'ACTIVE', lastLogin: '3 hours ago' },
  { id: 'USR-905', name: 'Tariq Al-Mansoor', email: 'logistics@saphire.in', role: 'Logistics Supervisor', department: 'Cargo & Fuel', status: 'ACTIVE', lastLogin: 'Yesterday' },
];

const AUDIT_LOGS = [
  { id: 'LOG-8821', time: '18:14:02 UTC', user: 'admin@saphire.in', action: 'RUNWAY_CONFIG_CHANGE', details: 'Runway 09R ILS calibration status verified by ATC telemetry.' },
  { id: 'LOG-8820', time: '18:02:44 UTC', user: 'aocc@saphire.in', action: 'GATE_REALLOCATION', details: 'Flight SPH-204 reassigned from Gate A02 to Gate A04.' },
  { id: 'LOG-8819', time: '17:45:19 UTC', user: 'ground@saphire.in', action: 'CREW_DISPATCH', details: 'Turnaround cleaning crew #4 dispatched to Stand B12.' },
  { id: 'LOG-8818', time: '17:30:11 UTC', user: 'system', action: 'SECURITY_INTEGRITY_SCAN', details: 'All biometric e-gate terminal nodes reported nominal status.' },
];

export const SystemAdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [openUserModal, setOpenUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Ground Ops Supervisor');
  const [newUserDept, setNewUserDept] = useState('Ramp Operations');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      toast.error('Please complete user name and operational email.');
      return;
    }
    const newUser: UserAccount = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      department: newUserDept,
      status: 'ACTIVE',
      lastLogin: 'Just now',
    };
    setUsers([newUser, ...users]);
    toast.success(`Created account for ${newUserName}`);
    setOpenUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  const toggleUserStatus = (id: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          const updated = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          toast(`Account ${u.name} set to ${updated}`, { icon: '🔒' });
          return { ...u, status: updated };
        }
        return u;
      })
    );
  };

  return (
    <DashboardLayout activeRole="system-admin">
      {/* Overview Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <SpotlightCard spotlightColor="rgba(56, 189, 248, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.1em' }}>
              TOTAL ACTIVE USERS
            </Typography>
            <Users size={18} color="#38BDF8" />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            {users.length}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#34D399', mt: 0.5, fontWeight: 600 }}>
            ● 100% RBAC Policy Compliant
          </Typography>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(52, 211, 153, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#34D399', letterSpacing: '0.1em' }}>
              SERVER UPTIME
            </Typography>
            <Server size={18} color="#34D399" />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            99.98%
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', mt: 0.5 }}>
            Dual-Node HA Cluster Active
          </Typography>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(251, 191, 36, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#FBBF24', letterSpacing: '0.1em' }}>
              DATABASE SYNC
            </Typography>
            <Activity size={18} color="#FBBF24" />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            2.4 ms
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', mt: 0.5 }}>
            PostgreSQL Read Replica Latency
          </Typography>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(129, 140, 248, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(129, 140, 248, 0.3)', borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#818CF8', letterSpacing: '0.1em' }}>
              SECURITY FIREWALL
            </Typography>
            <ShieldCheck size={18} color="#818CF8" />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            OPTIMAL
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#34D399', mt: 0.5, fontWeight: 600 }}>
            0 Anomalies Detected
          </Typography>
        </SpotlightCard>
      </Box>

      {/* User Management Section */}
      <Paper id="users" elevation={0} sx={{ p: 3.5, mb: 4, background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '18px' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
              Operational Personnel & RBAC Registry
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8' }}>
              Configure authenticated staff access, department designations, and security clearances.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField
              size="small"
              placeholder="Filter by name, role or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                '& .MuiOutlinedInput-root': {
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(2, 6, 23, 0.7)',
                  borderRadius: '10px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.85rem',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.12)' },
                  '&:hover fieldset': { borderColor: '#38BDF8' },
                },
              }}
            />
            <Button
              variant="contained"
              startIcon={<Plus size={16} />}
              onClick={() => setOpenUserModal(true)}
              sx={{
                background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: '0.85rem',
                borderRadius: '10px',
                px: 2.5,
              }}
            >
              Add Staff
            </Button>
          </Box>
        </Box>

        <TableContainer sx={{ borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'rgba(2, 6, 23, 0.8)' }}>
              <TableRow>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.8rem' }}>STAFF ID / NAME</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.8rem' }}>EMAIL</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.8rem' }}>ROLE ACCESS</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.8rem' }}>DEPARTMENT</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.8rem' }}>STATUS</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.8rem' }}>ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.03)' } }}>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                    <Box>
                      <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.9rem' }}>{u.name}</Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontFamily: "'Inter', monospace" }}>{u.id}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#CBD5E1', fontSize: '0.85rem' }}>{u.email}</TableCell>
                  <TableCell>
                    <Chip label={u.role} size="small" sx={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', fontWeight: 700, fontSize: '0.72rem' }} />
                  </TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontSize: '0.85rem' }}>{u.department}</TableCell>
                  <TableCell>
                    <Chip
                      icon={u.status === 'ACTIVE' ? <CheckCircle2 size={12} /> : <Lock size={12} />}
                      label={u.status}
                      size="small"
                      sx={{
                        backgroundColor: u.status === 'ACTIVE' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: u.status === 'ACTIVE' ? '#34D399' : '#EF4444',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => toggleUserStatus(u.id)}
                      sx={{
                        fontSize: '0.72rem',
                        py: 0.3,
                        px: 1.5,
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        color: u.status === 'ACTIVE' ? '#F87171' : '#34D399',
                        '&:hover': { borderColor: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.08)' },
                      }}
                    >
                      {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Audit Logs Stream */}
      <Paper id="audit" elevation={0} sx={{ p: 3.5, background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '18px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Terminal size={22} color="#38BDF8" />
          <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            Airside Security & Command Audit Trail
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {AUDIT_LOGS.map((log) => (
            <Box
              key={log.id}
              sx={{
                p: 2,
                borderRadius: '12px',
                background: 'rgba(2, 6, 23, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { md: 'center' },
                gap: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label={log.action} size="small" sx={{ backgroundColor: 'rgba(129, 140, 248, 0.2)', color: '#818CF8', fontWeight: 800, fontSize: '0.7rem' }} />
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#E2E8F0' }}>
                  {log.details}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8' }}>{log.user}</Typography>
                <Typography sx={{ fontFamily: "'Inter', monospace", fontSize: '0.75rem', color: '#38BDF8' }}>{log.time}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Add User Modal */}
      <Dialog
        open={openUserModal}
        onClose={() => setOpenUserModal(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#0F172A',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '18px',
            p: 1.5,
            minWidth: { xs: '90%', sm: '480px' },
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
          Enroll Airside Staff Account
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          <TextField
            fullWidth
            label="Full Name"
            placeholder="e.g. Captain Liam Ross"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { color: '#FFF' }, '& .MuiInputLabel-root': { color: '#94A3B8' } }}
          />
          <TextField
            fullWidth
            label="Operational Email"
            placeholder="e.g. liam.ross@saphire.in"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { color: '#FFF' }, '& .MuiInputLabel-root': { color: '#94A3B8' } }}
          />
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#94A3B8' }}>Designated Role</InputLabel>
            <Select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
              sx={{ color: '#FFF', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' } }}
            >
              <MenuItem value="System Admin">System Administrator</MenuItem>
              <MenuItem value="AOCC Controller">AOCC Controller</MenuItem>
              <MenuItem value="Ground Ops Supervisor">Ground Ops Supervisor</MenuItem>
              <MenuItem value="Airside Ops Lead">Airside Operations</MenuItem>
              <MenuItem value="Logistics Supervisor">Logistics & Cargo</MenuItem>
              <MenuItem value="Passenger Security">Passenger & Security</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenUserModal(false)} sx={{ color: '#94A3B8' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreateUser} sx={{ background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)', fontWeight: 700 }}>
            Authorize & Save
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default SystemAdminDashboard;
