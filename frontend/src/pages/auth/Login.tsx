import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Radio,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setErrorMessage('Please enter your operational email or username.');
      toast.error('Please enter your operational email or username.');
      return;
    }

    if (!cleanPassword) {
      setErrorMessage('Please enter your security passkey.');
      toast.error('Please enter your security passkey.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await login(cleanEmail, cleanPassword);

      // Determine destination dashboard route based on user's authorized role
      let targetPath = '/dashboard/system-admin';
      switch (user.roleName) {
        case 'SYSTEM_ADMINISTRATOR':
          targetPath = '/dashboard/system-admin';
          break;
        case 'AIRPORT_OPERATIONS_MANAGER':
          targetPath = '/dashboard/aocc';
          break;
        case 'GROUND_HANDLING_SUPERVISOR':
        case 'RAMP_AGENT':
          targetPath = '/dashboard/ground-ops';
          break;
        case 'AIRLINE_BILLING_CLERK':
          targetPath = '/dashboard/department';
          break;
        case 'GATE_AGENT':
          targetPath = '/dashboard/airside-ops';
          break;
        case 'BAGGAGE_HANDLER':
          targetPath = '/dashboard/logistics';
          break;
        case 'SECURITY_OFFICER':
        case 'IMMIGRATION_OFFICER':
          targetPath = '/dashboard/passenger-security';
          break;
        default:
          targetPath = '/dashboard/system-admin';
      }

      toast.success(`Access Granted: ${user.name}`);
      setTimeout(() => {
        navigate(targetPath);
      }, 300);
    } catch (err: any) {
      const msg = err.message || 'Invalid operational credentials. Access denied.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#FAF9F6',
        color: '#0F2942',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 4, md: 8 },
        px: 2,
        position: 'relative',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Back to Home Link */}
        <Box sx={{ mb: 3 }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: '#475569',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.88rem',
              fontWeight: 600,
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#0284C7')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#475569')}
          >
            <ArrowLeft size={16} /> Back to SAPHIRE Portal
          </Link>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 24px 70px rgba(15, 41, 66, 0.08)',
          }}
        >
          {/* LEFT: Authoritative Aviation Photography Panel */}
          <Box
            sx={{
              position: 'relative',
              p: { xs: 4, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: { xs: '360px', md: '640px' },
              backgroundImage: `linear-gradient(180deg, rgba(15, 41, 66, 0.72) 0%, rgba(15, 41, 66, 0.94) 100%), url('https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1400&q=85')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: '#FFFFFF',
            }}
          >
            {/* Top Brand Header */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plane size={22} color="#38BDF8" />
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: '#FFFFFF', fontSize: '1.3rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                    SAPHIRE
                  </Typography>
                  <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.68rem', color: '#38BDF8', letterSpacing: '0.18em', fontWeight: 600 }}>
                    OPERATIONS DISPATCH
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.6,
                  py: 0.6,
                  borderRadius: '100px',
                  backgroundColor: 'rgba(15, 41, 66, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  mb: 3,
                }}
              >
                <Radio size={12} color="#10B981" />
                <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', fontWeight: 600, color: '#10B981', letterSpacing: '0.05em' }}>
                  CAT-III B ALL-WEATHER OPS ACTIVE
                </Typography>
              </Box>

              <Typography variant="h3" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: '#FFFFFF', fontSize: { xs: '1.8rem', md: '2.2rem' }, lineHeight: 1.25, mb: 2 }}>
                Unified Aerodrome Command Gateway
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", color: 'rgba(255, 255, 255, 0.82)', fontSize: '0.92rem', lineHeight: 1.65, maxWidth: '440px' }}>
                Secure real-time coordination bridge linking air traffic management, apron ramp control, turnaround services, cargo freight logistics, and terminal security.
              </Typography>
            </Box>

            {/* Aerodrome Telemetry Strip */}
            <Box
              sx={{
                mt: 4,
                p: 2.5,
                borderRadius: '16px',
                backgroundColor: 'rgba(15, 41, 66, 0.65)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.12em' }}>
                  PRECINCT TELEMETRY STATUS
                </Typography>
                <Box sx={{ px: 1, py: 0.3, borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10B981', fontSize: '0.68rem', fontFamily: "'Geist Mono', monospace", fontWeight: 700 }}>
                  LIVE 24/7
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, textAlign: 'center' }}>
                <Box sx={{ p: 1.2, borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)' }}>
                  <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF' }}>200</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.75)', fontFamily: "'Inter', sans-serif" }}>Gates Online</Typography>
                </Box>
                <Box sx={{ p: 1.2, borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)' }}>
                  <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '1.2rem', fontWeight: 700, color: '#10B981' }}>99.8%</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.75)', fontFamily: "'Inter', sans-serif" }}>Dispatch OTP</Typography>
                </Box>
                <Box sx={{ p: 1.2, borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)' }}>
                  <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '1.2rem', fontWeight: 700, color: '#38BDF8' }}>7 Roles</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.75)', fontFamily: "'Inter', sans-serif" }}>RBAC Access</Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* RIGHT: Modern Crisp Auth Console */}
          <Box
            sx={{
              p: { xs: 4, md: 5.5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundColor: '#FFFFFF',
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.4, py: 0.4, borderRadius: '100px', backgroundColor: 'rgba(30, 58, 95, 0.06)', border: '1px solid rgba(30, 58, 95, 0.12)', color: '#1E3A5F', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.75rem', fontWeight: 700, mb: 1.5 }}>
                <ShieldCheck size={14} color="#1E3A5F" /> AIRPORT STAFF AUTHENTICATION
              </Box>
              <Typography variant="h4" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: '#0F2942', fontSize: '1.8rem', mb: 1, letterSpacing: '-0.02em' }}>
                Operator Authorization
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#475569', fontSize: '0.88rem' }}>
                Enter your operational credentials to access your authorized console.
              </Typography>
            </Box>

            {/* Credential Failure Alert Banner */}
            {errorMessage && (
              <Box
                sx={{
                  p: 1.5,
                  mb: 2.5,
                  borderRadius: '10px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  color: '#991B1B',
                  animation: 'fadeIn 0.2s ease',
                }}
              >
                <AlertTriangle size={18} color="#DC2626" style={{ flexShrink: 0 }} />
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.84rem', fontWeight: 600 }}>
                  {errorMessage}
                </Typography>
              </Box>
            )}

            <form onSubmit={handleLogin}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Email Field */}
                <Box>
                  <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.82rem', fontWeight: 700, color: '#0F2942', mb: 0.8 }}>
                    Operational Email Identifier
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="e.g. admin@saphire.in or username"
                    value={email}
                    error={Boolean(errorMessage)}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={18} color="#64748B" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#0F2942',
                        backgroundColor: '#FAF9F6',
                        borderRadius: '10px',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.9rem',
                        '& fieldset': { borderColor: errorMessage ? '#EF4444' : '#E2E8F0' },
                        '&:hover fieldset': { borderColor: errorMessage ? '#EF4444' : '#1E3A5F' },
                        '&.Mui-focused fieldset': { borderColor: errorMessage ? '#EF4444' : '#1E3A5F' },
                      },
                    }}
                  />
                </Box>

                {/* Password Field */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                    <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.82rem', fontWeight: 700, color: '#0F2942' }}>
                      Security Passkey
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.75rem',
                        color: '#0284C7',
                        cursor: 'pointer',
                        fontWeight: 600,
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Reset code?
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    error={Boolean(errorMessage)}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    slotProps={{
                      input: {
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
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#0F2942',
                        backgroundColor: '#FAF9F6',
                        borderRadius: '10px',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.9rem',
                        '& fieldset': { borderColor: errorMessage ? '#EF4444' : '#E2E8F0' },
                        '&:hover fieldset': { borderColor: errorMessage ? '#EF4444' : '#1E3A5F' },
                        '&.Mui-focused fieldset': { borderColor: errorMessage ? '#EF4444' : '#1E3A5F' },
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
                        '&.Mui-checked': { color: '#1E3A5F' },
                      }}
                      size="small"
                    />
                  }
                  label={
                    <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.82rem', color: '#475569' }}>
                      Persist session on this airside terminal
                    </Typography>
                  }
                  sx={{ mt: -0.5 }}
                />

                {/* Submit Action */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  endIcon={<ArrowRight size={18} />}
                  sx={{
                    py: 1.4,
                    borderRadius: '10px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    letterSpacing: '0.02em',
                    backgroundColor: '#1E3A5F',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 14px rgba(30, 58, 95, 0.25)',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      backgroundColor: '#162C46',
                      transform: 'translateY(-1px)',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#94A3B8',
                      color: '#FFFFFF',
                    },
                  }}
                >
                  {isLoading ? 'Verifying Authorization...' : 'Authorize & Access Console'}
                </Button>
              </Box>
            </form>

            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#94A3B8' }}>
                Protected by Saphire Aerodrome Security &amp; RBAC Authorization Gateway
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
