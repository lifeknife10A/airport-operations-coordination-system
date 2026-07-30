import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Paper,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Plane,
  Clock,
  Shield,
  Activity,
  Grid as GridIcon,
  Fuel,
  Users,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utcString = now.toISOString().substring(11, 19) + ' UTC';
      const localString = now.toLocaleTimeString('en-US', { hour12: false }) + ' SPH';
      setTime(`${localString} | ${utcString}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickRoleLogin = (role: string) => {
    login('krishna.ops', 'saphire2026', role);
    navigate('/dashboard');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#070b14', color: '#f8fafc', overflowX: 'hidden' }}>
      {/* Top Glass Navigation */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          backgroundColor: 'rgba(7, 11, 20, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          py: 2,
        }}
      >
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 25px rgba(6, 182, 212, 0.5)',
              }}
            >
              <Plane size={24} color="#ffffff" />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontFamily: 'Outfit, sans-serif',
                  letterSpacing: '-0.5px',
                  background: 'linear-gradient(90deg, #ffffff 0%, #38bdf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                SAPHIRE AOCS
              </Typography>
              <Typography variant="caption" sx={{ color: '#06b6d4', fontWeight: 600, display: 'block', mt: -0.5 }}>
                Saphire International Airport (`SPH / VASP`)
              </Typography>
            </Box>
          </Box>

          {/* Center Clock */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1.5,
              px: 3,
              py: 0.8,
              borderRadius: '1000px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Clock size={16} color="#38bdf8" />
            <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#38bdf8' }}>
              {time || '12:00:00 SPH | 06:30:00 UTC'}
            </Typography>
          </Box>

          {/* Action CTAs */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <Button
                variant="contained"
                onClick={() => navigate('/dashboard')}
                sx={{
                  borderRadius: '1000px',
                  px: 3,
                  py: 1.2,
                  background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                }}
              >
                Enter Command Center &rarr;
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderRadius: '1000px',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    px: 3,
                  }}
                >
                  Staff Sign In
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleQuickRoleLogin('AIRPORT_OPERATIONS_MANAGER')}
                  sx={{
                    borderRadius: '1000px',
                    px: 3,
                    py: 1.2,
                    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
                  }}
                >
                  Launch Demo Command &rarr;
                </Button>
              </>
            )}
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="xl" sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 8, md: 12 } }}>
        <Grid container spacing={6} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Chip
                icon={<Sparkles size={14} color="#06b6d4" />}
                label="NEXT-GEN AIRPORT OPERATIONS SYSTEM"
                sx={{
                  backgroundColor: 'rgba(6, 182, 212, 0.12)',
                  color: '#38bdf8',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  letterSpacing: '1px',
                  mb: 3,
                  borderRadius: '1000px',
                }}
              />

              <Typography
                variant="h1"
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: '42px', sm: '56px', md: '64px' },
                  lineHeight: 1.05,
                  letterSpacing: '-1.5px',
                  mb: 3,
                  background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Beyond Operations. <br />
                <span style={{ color: '#06b6d4', WebkitTextFillColor: 'initial' }}>Precision Aerospace Control.</span>
              </Typography>

              <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: '1.15rem', lineHeight: 1.6, mb: 4, maxWidth: 580 }}>
                Saphire International Airport Hub (`SPH / VASP`). Turnaround coordination, gate allocation, safety-critical refueling guards, and passenger manifest privacy engineered for zero-delay operations.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 6 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => handleQuickRoleLogin('AIRPORT_OPERATIONS_MANAGER')}
                  startIcon={<Play size={18} />}
                  sx={{
                    borderRadius: '1000px',
                    px: 4,
                    py: 1.6,
                    fontSize: '1rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                    boxShadow: '0 0 35px rgba(6, 182, 212, 0.5)',
                  }}
                >
                  Launch Operations Command
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderRadius: '1000px',
                    px: 4,
                    py: 1.6,
                    fontSize: '1rem',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                  }}
                >
                  Staff Role Selection
                </Button>
              </Box>

              {/* KPI Badges Bar */}
              <Grid container spacing={2}>
                {[
                  { label: 'On-Time Performance', value: '94.2%', color: '#34d399' },
                  { label: 'Active Hub Flights', value: '14 Live', color: '#38bdf8' },
                  { label: 'Refuel Safety Guard', value: '±1.0%', color: '#fbbf24' },
                ].map((kpi, idx) => (
                  <Grid size={4} key={idx}>
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 600 }}>
                        {kpi.label}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: kpi.color, fontFamily: 'JetBrains Mono, monospace' }}>
                        {kpi.value}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Right Hero Image Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ position: 'relative' }}>
              <Paper
                elevation={24}
                sx={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  boxShadow: '0 0 50px rgba(6, 182, 212, 0.25)',
                  position: 'relative',
                }}
              >
                <Box
                  component="img"
                  src="/hero_jet.jpg"
                  alt="Saphire Aerospace Jet"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    transform: 'scale(1.02)',
                    transition: 'transform 0.5s ease',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                />

                {/* Overlaid Live Telemetry Card */}
                <Paper
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    right: 20,
                    p: 2.5,
                    backgroundColor: 'rgba(7, 11, 20, 0.85)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '14px',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: '#34d399',
                        boxShadow: '0 0 10px #34d399',
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffffff' }}>
                        SPH-402 • Airbus A320neo
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                        CSMIA Mumbai &rarr; Saphire Hub • Gate A1 (Stand S101)
                      </Typography>
                    </Box>
                  </Box>
                  <Chip label="LANDED" size="small" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 800 }} />
                </Paper>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Operational Capabilities Section */}
      <Box sx={{ py: 10, backgroundColor: '#0f172a', borderTop: '1px solid rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: 8 }}>
            <Typography variant="overline" sx={{ color: '#06b6d4', fontWeight: 800, letterSpacing: '1.5px' }}>
              ENTERPRISE CAPABILITY MATRIX
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#ffffff', mt: 1, mb: 2 }}>
              Built for 15+ Operational Web Modules
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: '1.1rem' }}>
              Seamless integration between ground handling, engineering release, fuel safety, gate allocations, and immigration audits.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                icon: Activity,
                title: 'Turnaround Milestone Stepper',
                desc: 'Real-time 8-phase turnaround tracking (SCHEDULED ➔ LANDED ➔ ON BLOCK ➔ SERVICING ➔ READY ➔ BOARDING ➔ DEPARTED).',
                path: '/flights/1',
              },
              {
                icon: Fuel,
                title: 'Refueling Variance Guard',
                desc: 'Jet A-1 fuel density calculator with automated ±1.0% safety boundary validation & Supervisor PIN authorization prompt.',
                path: '/refueling',
              },
              {
                icon: GridIcon,
                title: 'Terminal Gate Allocator',
                desc: 'Interactive Terminal 1, Terminal 2, and Remote Stand occupancy map with 409 conflict detection warnings.',
                path: '/gates',
              },
              {
                icon: Shield,
                title: 'Immigration & Privacy Guard',
                desc: 'Automated passport confidentiality masking (XXXX-XXXX-1234) with RBAC unmasking for authorized officers.',
                path: '/manifest',
              },
            ].map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                  <Card
                    sx={{
                      p: 2,
                      height: '100%',
                      backgroundColor: 'rgba(7, 11, 20, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        border: '1px solid rgba(6, 182, 212, 0.4)',
                        boxShadow: '0 10px 30px rgba(6, 182, 212, 0.2)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          backgroundColor: 'rgba(6, 182, 212, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#38bdf8',
                          mb: 2.5,
                        }}
                      >
                        <Icon size={24} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', mb: 1 }}>
                        {cap.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6, mb: 3 }}>
                        {cap.desc}
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => handleQuickRoleLogin('AIRPORT_OPERATIONS_MANAGER')}
                        sx={{ color: '#06b6d4', fontWeight: 700, p: 0 }}
                      >
                        Explore Module &rarr;
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* Interactive Staff Role Gateway */}
      <Container maxWidth="xl" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: 6 }}>
          <Typography variant="overline" sx={{ color: '#38bdf8', fontWeight: 800, letterSpacing: '1.5px' }}>
            STAFF ACCESS GATEWAY
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#ffffff', mt: 1 }}>
            Select Operational Role for Immediate Demo
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {[
            { role: 'AIRPORT_OPERATIONS_MANAGER', title: 'Airport Ops Manager', dept: 'Command Center' },
            { role: 'GROUND_HANDLING_SUPERVISOR', title: 'Ground Handling Lead', dept: 'Ramp Operations' },
            { role: 'RAMP_AGENT', title: 'Ramp Agent', dept: 'Turnaround Team' },
            { role: 'GATE_AGENT', title: 'Boarding Gate Agent', dept: 'Passenger Services' },
            { role: 'SECURITY_OFFICER', title: 'Security Lead', dept: 'Ramp & Cabin Security' },
            { role: 'IMMIGRATION_OFFICER', title: 'Immigration Officer', dept: 'Immigration & Manifest' },
          ].map((r, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
              <Paper
                sx={{
                  p: 3,
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  },
                }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ffffff' }}>
                    {r.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                    Department: {r.dept}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleQuickRoleLogin(r.role)}
                  sx={{ borderRadius: '1000px', borderColor: 'rgba(6, 182, 212, 0.4)', color: '#38bdf8' }}
                >
                  Enter Portal &rarr;
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ py: 6, backgroundColor: '#04070e', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ffffff' }}>
              SAPHIRE AOCS • Saphire International Airport
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              PostgreSQL 18 DB • Spring Boot 3.2 REST API • React 18 + TS + MUI v6
            </Typography>
          </Box>
          <Chip
            icon={<CheckCircle2 size={14} color="#34d399" />}
            label="Backend REST API: Certified Online"
            sx={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 700 }}
          />
        </Container>
      </Box>
    </Box>
  );
};
