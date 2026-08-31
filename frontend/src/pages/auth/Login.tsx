import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Container,
  Chip,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Plane,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Compass,
  Radio,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SpotlightCard } from '../../components/reactbits';

interface DemoAccount {
  role: string;
  email: string;
  path: string;
  tag: string;
  color: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  { role: 'System Admin', email: 'admin@saphire.in', path: '/dashboard/system-admin', tag: 'ADMIN', color: '#38BDF8' },
  { role: 'AOCC Controller', email: 'aocc@saphire.in', path: '/dashboard/aocc', tag: 'AOCC', color: '#818CF8' },
  { role: 'Ground Ops', email: 'ground@saphire.in', path: '/dashboard/ground-ops', tag: 'RAMP', color: '#FBBF24' },
  { role: 'Department', email: 'department@saphire.in', path: '/dashboard/department', tag: 'DEPT', color: '#34D399' },
  { role: 'Airside Ops', email: 'airside@saphire.in', path: '/dashboard/airside-ops', tag: 'AIRSIDE', color: '#38BDF8' },
  { role: 'Logistics', email: 'logistics@saphire.in', path: '/dashboard/logistics', tag: 'CARGO', color: '#F472B6' },
  { role: 'Passenger & Security', email: 'passenger@saphire.in', path: '/dashboard/passenger-security', tag: 'SECURITY', color: '#A78BFA' },
];

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('admin@saphire.in');
  const [password, setPassword] = useState('pass');
  const [rememberMe, setRememberMe] = useState(true);

  const resolveDashboardPath = (inputEmail: string): string => {
    const clean = inputEmail.trim().toLowerCase();
    const matched = DEMO_ACCOUNTS.find((acc) => acc.email.toLowerCase() === clean);
    if (matched) return matched.path;

    if (clean.includes('admin')) return '/dashboard/system-admin';
    if (clean.includes('aocc')) return '/dashboard/aocc';
    if (clean.includes('ground') || clean.includes('ramp')) return '/dashboard/ground-ops';
    if (clean.includes('dept') || clean.includes('department') || clean.includes('fuel') || clean.includes('clean') || clean.includes('maint')) return '/dashboard/department';
    if (clean.includes('airside') || clean.includes('flight') || clean.includes('pilot')) return '/dashboard/airside-ops';
    if (clean.includes('logistic') || clean.includes('cargo') || clean.includes('freight')) return '/dashboard/logistics';
    if (clean.includes('passenger') || clean.includes('security') || clean.includes('terminal')) return '/dashboard/passenger-security';

    return '/dashboard/system-admin';
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your operational email.');
      return;
    }

    const targetPath = resolveDashboardPath(email);
    const matchedRole = DEMO_ACCOUNTS.find((acc) => acc.path === targetPath)?.role || 'Authorized Workspace';
    
    toast.success(`Authenticating as ${matchedRole}...`);
    setTimeout(() => {
      navigate(targetPath);
    }, 350);
  };

  const handleSelectDemoAccount = (acc: DemoAccount) => {
    setEmail(acc.email);
    setPassword('pass');
    toast(`Loaded ${acc.role} credentials`, { icon: '✈️' });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#070B16',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 4, md: 6 },
        px: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient lighting */}
      <Box
        sx={{
          position: 'absolute',
          top: '-15%',
          left: '10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-15%',
          right: '10%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(129, 140, 248, 0.12) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' },
            borderRadius: '28px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(11, 16, 32, 0.85)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.7)',
          }}
        >
          {/* LEFT: 30% Travel & Aviation Showcase */}
          <Box
            sx={{
              position: 'relative',
              p: { xs: 4, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: { xs: '320px', md: '640px' },
              backgroundImage: `
                linear-gradient(180deg, rgba(7, 11, 22, 0.4) 0%, rgba(7, 11, 22, 0.85) 100%),
                url('https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1600&auto=format&fit=crop')
              `,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRight: { md: '1px solid rgba(255, 255, 255, 0.08)' },
            }}
          >
            {/* Top Brand Header */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(56, 189, 248, 0.35)',
                  }}
                >
                  <Plane size={22} color="#FFFFFF" />
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', fontSize: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                    SAPHIRE
                  </Typography>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.7rem', color: '#38BDF8', letterSpacing: '0.18em', fontWeight: 700 }}>
                    OPERATIONS HUB
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.8,
                  py: 0.8,
                  borderRadius: '100px',
                  background: 'rgba(2, 6, 23, 0.75)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  backdropFilter: 'blur(10px)',
                  mb: 3,
                }}
              >
                <Radio size={14} color="#34D399" className="animate-pulse" />
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#F8FAFC', letterSpacing: '0.05em' }}>
                  CAT-III DUAL RUNWAY ACTIVE
                </Typography>
              </Box>

              <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', fontSize: { xs: '1.8rem', md: '2.3rem' }, lineHeight: 1.2, mb: 1.5 }}>
                Unified Airside & Terminal Control
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#CBD5E1', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '420px' }}>
                Seamless orchestration across AOCC dispatch, airside gates, ground turnaround, cargo logistics, and security clearance.
              </Typography>
            </Box>

            {/* Travel Flight Ticket Card Preview (20% Travel Touch) */}
            <Box
              sx={{
                mt: 4,
                p: 2.5,
                borderRadius: '18px',
                background: 'rgba(15, 23, 42, 0.82)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(14px)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.72rem', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.12em' }}>
                  LIVE PRECINCT TELEMETRY
                </Typography>
                <Chip label="24/7 OPS" size="small" sx={{ height: '20px', fontSize: '0.65rem', fontWeight: 800, backgroundColor: 'rgba(56, 189, 248, 0.18)', color: '#38BDF8' }} />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, textAlign: 'center' }}>
                <Box sx={{ p: 1.2, borderRadius: '10px', background: 'rgba(2, 6, 23, 0.55)' }}>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>200</Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8' }}>Active Gates</Typography>
                </Box>
                <Box sx={{ p: 1.2, borderRadius: '10px', background: 'rgba(2, 6, 23, 0.55)' }}>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 800, color: '#34D399' }}>99.8%</Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8' }}>On-Time Rate</Typography>
                </Box>
                <Box sx={{ p: 1.2, borderRadius: '10px', background: 'rgba(2, 6, 23, 0.55)' }}>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 800, color: '#FBBF24' }}>7 Roles</Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8' }}>Secure Auth</Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* RIGHT: 65% Sleek Dark Mode Login Form */}
          <Box
            sx={{
              p: { xs: 4, md: 5.5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: 'rgba(11, 16, 32, 0.95)',
            }}
          >
            <Box sx={{ mb: 3.5 }}>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', fontSize: '1.9rem', mb: 0.8 }}>
                Sign In to Portal
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', fontSize: '0.9rem' }}>
                Enter your role-assigned credentials to access your designated operational dashboard.
              </Typography>
            </Box>

            <form onSubmit={handleLogin}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Email Field */}
                <Box>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', mb: 0.8 }}>
                    Operational Email
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="e.g. admin@saphire.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail size={18} color="#64748B" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#FFFFFF',
                        backgroundColor: 'rgba(2, 6, 23, 0.7)',
                        borderRadius: '12px',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.92rem',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.12)' },
                        '&:hover fieldset': { borderColor: 'rgba(56, 189, 248, 0.4)' },
                        '&.Mui-focused fieldset': { borderColor: '#38BDF8', borderWidth: '1.5px' },
                      },
                    }}
                  />
                </Box>

                {/* Password Field */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                    <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1' }}>
                      Security Password
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.78rem',
                        color: '#38BDF8',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Forgot code?
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock size={18} color="#64748B" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#64748B' }}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#FFFFFF',
                        backgroundColor: 'rgba(2, 6, 23, 0.7)',
                        borderRadius: '12px',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.92rem',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.12)' },
                        '&:hover fieldset': { borderColor: 'rgba(56, 189, 248, 0.4)' },
                        '&.Mui-focused fieldset': { borderColor: '#38BDF8', borderWidth: '1.5px' },
                      },
                    }}
                  />
                </Box>

                {/* Remember Me */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        color: '#64748B',
                        '&.Mui-checked': { color: '#38BDF8' },
                      }}
                      size="small"
                    />
                  }
                  label={
                    <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#94A3B8' }}>
                      Remember session on this airside terminal
                    </Typography>
                  }
                  sx={{ mt: -0.5 }}
                />

                {/* Submit Action */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  endIcon={<ArrowRight size={18} />}
                  sx={{
                    py: 1.4,
                    borderRadius: '12px',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.98rem',
                    letterSpacing: '0.02em',
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
                    boxShadow: '0 8px 24px -4px rgba(56, 189, 248, 0.4)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0369A1 0%, #0284C7 100%)',
                      boxShadow: '0 12px 28px -4px rgba(56, 189, 248, 0.55)',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  Sign In to Dashboard
                </Button>
              </Box>
            </form>

            {/* Quick Demo Credentials Autofill Pills (5% Creative Control) */}
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Sparkles size={14} color="#38BDF8" /> QUICK LOGIN AS ROLE (CLICK TO AUTOFILL):
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {DEMO_ACCOUNTS.map((acc) => (
                  <Chip
                    key={acc.email}
                    label={`${acc.role}`}
                    onClick={() => handleSelectDemoAccount(acc)}
                    clickable
                    size="small"
                    sx={{
                      backgroundColor: email === acc.email ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15, 23, 42, 0.8)',
                      borderColor: email === acc.email ? '#38BDF8' : 'rgba(255, 255, 255, 0.12)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      color: email === acc.email ? '#FFFFFF' : '#CBD5E1',
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      '&:hover': {
                        backgroundColor: 'rgba(56, 189, 248, 0.2)',
                        borderColor: '#38BDF8',
                        color: '#FFFFFF',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
