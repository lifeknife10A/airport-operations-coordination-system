import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  InputAdornment,
} from '@mui/material';
import { Plane, Lock, User as UserIcon, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const rolesList = [
  { id: '1', code: 'AIRPORT_OPERATIONS_MANAGER', title: 'Airport Operations Manager (Flight Ops)' },
  { id: '2', code: 'GROUND_HANDLING_SUPERVISOR', title: 'Ground Handling Supervisor (Ground Ops)' },
  { id: '3', code: 'RAMP_AGENT', title: 'Ramp Agent (Ramp Operations)' },
  { id: '4', code: 'BAGGAGE_HANDLER', title: 'Baggage Handler (Baggage Services)' },
  { id: '5', code: 'GATE_AGENT', title: 'Gate Agent (Passenger Services)' },
  { id: '6', code: 'CHECKIN_AGENT', title: 'Check-in Agent (Passenger Services)' },
  { id: '7', code: 'SECURITY_OFFICER', title: 'Security Officer (Security & Safety)' },
  { id: '8', code: 'IMMIGRATION_OFFICER', title: 'Immigration Officer (Border Control)' },
  { id: '9', code: 'AIRLINE_BILLING_CLERK', title: 'Airline Billing Clerk (Finance)' },
  { id: '10', code: 'SYSTEM_ADMINISTRATOR', title: 'System Administrator (IT & Systems)' },
];

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('krishna.ops');
  const [password, setPassword] = useState('saphire2026');
  const [selectedRole, setSelectedRole] = useState('AIRPORT_OPERATIONS_MANAGER');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await login(username, password, selectedRole);
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Invalid username or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 30%, #132347 0%, #0b1329 100%)',
        p: 3,
      }}
    >
      <Card
        sx={{
          maxWidth: 460,
          width: '100%',
          p: 2,
          borderRadius: 4,
          backgroundColor: 'rgba(19, 30, 58, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ textAlign: 'center', mb: 1 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #1e40af 0%, #0d9488 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                mb: 1.5,
                boxShadow: '0 0 25px rgba(30, 64, 175, 0.6)',
              }}
            >
              <Plane size={32} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#ffffff' }}>
              Saphire AOCS Portal
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
              Saphire International Airport (`SPH` / `VASP`)
            </Typography>
          </Box>

          {errorMsg && (
            <Alert severity="error" icon={<ShieldAlert size={20} />} sx={{ borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Staff Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <UserIcon size={18} color="#94a3b8" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={18} color="#94a3b8" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Operational Role</InputLabel>
              <Select
                value={selectedRole}
                label="Operational Role"
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {rolesList.map((r) => (
                  <MenuItem key={r.code} value={r.code}>
                    {r.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontWeight: 700,
                fontSize: '1rem',
                background: 'linear-gradient(90deg, #1e40af 0%, #0d9488 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1d4ed8 0%, #0f766e 100%)',
                },
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Operations Portal'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
