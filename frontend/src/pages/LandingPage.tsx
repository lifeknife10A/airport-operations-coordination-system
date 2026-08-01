import React, { useState, useEffect, useRef } from 'react';
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
  InputBase,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  Plane,
  Clock,
  Shield,
  Activity,
  Grid as GridIcon,
  Fuel,
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  Navigation,
  Coffee,
  Car,
  MapPin,
  X,
  ArrowUpRight,
  Luggage,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SampleFlight {
  id: string;
  number: string;
  airline: string;
  airlineCode: string;
  origin: string;
  destination: string;
  type: 'ARRIVAL' | 'DEPARTURE';
  scheduledTime: string;
  estimatedTime: string;
  status: 'SCHEDULED' | 'BOARDING' | 'LANDED' | 'SERVICING' | 'DELAYED' | 'AIRBORNE';
  gate: string;
  stand: string;
  carousel: string;
}

const SAMPLE_FLIGHTS: SampleFlight[] = [
  {
    id: '1',
    number: 'AI-101',
    airline: 'Air India',
    airlineCode: 'AI',
    origin: 'Mumbai (BOM)',
    destination: 'Saphire Hub (SPH)',
    type: 'ARRIVAL',
    scheduledTime: '14:30',
    estimatedTime: '14:30',
    status: 'LANDED',
    gate: 'Gate A3',
    stand: 'Stand S102',
    carousel: 'Carousel 4',
  },
  {
    id: '2',
    number: '6E-532',
    airline: 'IndiGo',
    airlineCode: '6E',
    origin: 'Saphire Hub (SPH)',
    destination: 'Delhi (DEL)',
    type: 'DEPARTURE',
    scheduledTime: '15:15',
    estimatedTime: '15:15',
    status: 'BOARDING',
    gate: 'Gate B1',
    stand: 'Stand S204',
    carousel: 'N/A',
  },
  {
    id: '3',
    number: 'UK-924',
    airline: 'Vistara',
    airlineCode: 'UK',
    origin: 'Bengaluru (BLR)',
    destination: 'Saphire Hub (SPH)',
    type: 'ARRIVAL',
    scheduledTime: '16:00',
    estimatedTime: '16:25',
    status: 'DELAYED',
    gate: 'Gate A1',
    stand: 'Stand S101',
    carousel: 'Carousel 2',
  },
  {
    id: '4',
    number: 'EK-502',
    airline: 'Emirates',
    airlineCode: 'EK',
    origin: 'Saphire Hub (SPH)',
    destination: 'Dubai (DXB)',
    type: 'DEPARTURE',
    scheduledTime: '17:45',
    estimatedTime: '17:45',
    status: 'SCHEDULED',
    gate: 'Gate C4',
    stand: 'Stand S301',
    carousel: 'N/A',
  },
  {
    id: '5',
    number: 'SG-811',
    airline: 'SpiceJet',
    airlineCode: 'SG',
    origin: 'Goa (GOI)',
    destination: 'Saphire Hub (SPH)',
    type: 'ARRIVAL',
    scheduledTime: '18:10',
    estimatedTime: '18:10',
    status: 'AIRBORNE',
    gate: 'Gate B3',
    stand: 'Stand S202',
    carousel: 'Carousel 1',
  },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [time, setTime] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [fidsTab, setFidsTab] = useState<'ALL' | 'ARRIVALS' | 'DEPARTURES'>('ALL');
  const [selectedFlight, setSelectedFlight] = useState<SampleFlight | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Video Scroll Scrubbing Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  // UTC and SPH Hub Clock
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

  // Video Scroll Scrubbing Controller (Scrub Video on Window Scroll)
  useEffect(() => {
    const video = videoRef.current;
    const heroSection = heroSectionRef.current;
    if (!video || !heroSection) return;

    const handleScroll = () => {
      const heroRect = heroSection.getBoundingClientRect();
      const heroHeight = heroSection.offsetHeight;
      
      // Calculate how far down the hero section we scrolled (0 to 1)
      const scrolled = Math.max(0, Math.min(1, -heroRect.top / (heroHeight - window.innerHeight)));
      
      if (video.duration && !isNaN(video.duration)) {
        video.currentTime = scrolled * video.duration;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQuickRoleLogin = (role: string) => {
    login('krishna.ops', 'saphire2026', role);
    navigate('/dashboard');
  };

  const handleSearchFlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const match = SAMPLE_FLIGHTS.find(
      (f) =>
        f.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (match) {
      setSelectedFlight(match);
      setIsModalOpen(true);
    } else {
      setSelectedFlight({
        id: 'search-custom',
        number: searchQuery.toUpperCase(),
        airline: 'Scheduled Flight',
        airlineCode: 'SPH',
        origin: 'CSMIA Mumbai (BOM)',
        destination: 'Saphire Hub (SPH)',
        type: 'ARRIVAL',
        scheduledTime: '15:30',
        estimatedTime: '15:30',
        status: 'SCHEDULED',
        gate: 'Gate A2',
        stand: 'Stand S103',
        carousel: 'Carousel 3',
      });
      setIsModalOpen(true);
    }
  };

  const filteredFlights = SAMPLE_FLIGHTS.filter((f) => {
    if (fidsTab === 'ARRIVALS' && f.type !== 'ARRIVAL') return false;
    if (fidsTab === 'DEPARTURES' && f.type !== 'DEPARTURE') return false;
    if (!searchQuery) return true;
    return (
      f.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LANDED':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.4)' };
      case 'BOARDING':
        return { bg: 'rgba(217, 119, 6, 0.15)', text: '#fbbf24', border: 'rgba(217, 119, 6, 0.4)' };
      case 'DELAYED':
        return { bg: 'rgba(225, 29, 72, 0.15)', text: '#f43f5e', border: 'rgba(225, 29, 72, 0.4)' };
      case 'AIRBORNE':
        return { bg: 'rgba(6, 182, 212, 0.15)', text: '#38bdf8', border: 'rgba(6, 182, 212, 0.4)' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.15)', text: '#cbd5e1', border: 'rgba(148, 163, 184, 0.3)' };
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#070b14', color: '#f8fafc', overflowX: 'hidden' }}>
      {/* 1. Header Navigation Bar */}
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
                background: 'linear-gradient(135deg, #d97706 0%, #3b82f6 50%, #1e3a8a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 25px rgba(217, 119, 6, 0.4)',
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
                  background: 'linear-gradient(90deg, #ffffff 0%, #f59e0b 50%, #38bdf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                SAPHIRE AIRPORT
              </Typography>
              <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 700, display: 'block', mt: -0.5 }}>
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
            <Clock size={16} color="#f59e0b" />
            <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#f59e0b' }}>
              {time || '17:45:00 SPH | 12:15:00 UTC'}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <Button
                variant="contained"
                onClick={() => navigate('/dashboard')}
                sx={{
                  borderRadius: '1000px',
                  px: 3,
                  py: 1.2,
                  background: 'linear-gradient(135deg, #d97706 0%, #3b82f6 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                }}
              >
                Enter Staff Command Center &rarr;
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
                    background: 'linear-gradient(135deg, #d97706 0%, #2563eb 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    boxShadow: '0 0 20px rgba(217, 119, 6, 0.4)',
                  }}
                >
                  Demo Role Launch &rarr;
                </Button>
              </>
            )}
          </Box>
        </Container>
      </Box>

      {/* 2. Hero Section with Scroll-Scrubbed Video Takeoff */}
      <Box
        ref={heroSectionRef}
        sx={{
          position: 'relative',
          minHeight: '160vh', // Extended height so scrolling scrubs the video takeoff
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Sticky Video Background */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          <video
            ref={videoRef}
            src="/sph_takeoff_video.mp4"
            muted
            playsInline
            preload="auto"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.65) contract(1.1)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(7, 11, 20, 0.2) 0%, rgba(7, 11, 20, 0.85) 100%)',
            }}
          />
        </Box>

        {/* Floating Hero Content Overlay */}
        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 10,
            mt: '-85vh',
            pb: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Chip
            icon={<Sparkles size={14} color="#f59e0b" />}
            label="CSMIA-INSPIRED INTERNATIONAL PASSENGER PORTAL"
            sx={{
              backgroundColor: 'rgba(217, 119, 6, 0.18)',
              color: '#f59e0b',
              border: '1px solid rgba(217, 119, 6, 0.4)',
              fontWeight: 800,
              fontSize: '0.78rem',
              letterSpacing: '1px',
              mb: 3,
              borderRadius: '1000px',
              backdropFilter: 'blur(12px)',
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 800,
              fontSize: { xs: '38px', sm: '54px', md: '68px' },
              lineHeight: 1.05,
              letterSpacing: '-1.5px',
              mb: 2,
              background: 'linear-gradient(180deg, #ffffff 0%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 10px 40px rgba(0,0,0,0.8)',
            }}
          >
            Welcome to Saphire International Airport
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#cbd5e1',
              fontSize: '1.25rem',
              maxWidth: 680,
              mb: 5,
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            }}
          >
            Scroll down to watch the flight take off. Search real-time flight schedules, gate allocations, and baggage carousels.
          </Typography>

          {/* Interactive Glassmorphism Flight Search Box */}
          <Paper
            component="form"
            onSubmit={handleSearchFlight}
            elevation={24}
            sx={{
              p: 1.5,
              width: '100%',
              maxWidth: 720,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '20px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(217, 119, 6, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box sx={{ pl: 2, color: '#f59e0b', display: 'flex', alignItems: 'center' }}>
              <Search size={22} />
            </Box>
            <InputBase
              placeholder="Enter Flight Number (e.g. AI-101, 6E-532) or City..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flex: 1,
                color: '#ffffff',
                fontSize: '1.1rem',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 600,
                '& ::placeholder': { color: '#94a3b8', opacity: 1 },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: '14px',
                px: 4,
                py: 1.4,
                background: 'linear-gradient(135deg, #d97706 0%, #2563eb 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1rem',
                boxShadow: '0 0 20px rgba(217, 119, 6, 0.5)',
              }}
            >
              Track Flight &rarr;
            </Button>
          </Paper>

          {/* Quick Search Chips */}
          <Box sx={{ display: 'flex', gap: 1.5, mt: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', alignSelf: 'center', fontWeight: 600 }}>
              Popular Searches:
            </Typography>
            {['AI-101', '6E-532', 'UK-924', 'EK-502'].map((code) => (
              <Chip
                key={code}
                label={code}
                onClick={() => {
                  setSearchQuery(code);
                  const f = SAMPLE_FLIGHTS.find((item) => item.number === code);
                  if (f) {
                    setSelectedFlight(f);
                    setIsModalOpen(true);
                  }
                }}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#38bdf8',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.2)' },
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* 3. CSMIA Terminal 2 Inspired Passenger Services Grid */}
      <Box sx={{ py: 10, backgroundColor: '#0b1120', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', maxWidth: 750, mx: 'auto', mb: 8 }}>
            <Typography variant="overline" sx={{ color: '#f59e0b', fontWeight: 800, letterSpacing: '1.5px' }}>
              CSMIA ARCHITECTURAL EXPERIENCE
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#ffffff', mt: 1, mb: 2 }}>
              World-Class Terminal Services
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: '1.1rem' }}>
              Inspired by the iconic golden jali canopy architecture of Mumbai CSMIA Terminal 2.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                title: 'VIP Executive Lounges',
                category: 'TERMINAL 2 LOUNGES',
                desc: 'Adani & SPH Executive Lounges featuring live chef counters, quiet relaxation pods, and priority boarding notifications.',
                icon: Coffee,
                accent: '#f59e0b',
                tag: 'OPEN 24/7',
              },
              {
                title: 'Duty-Free & Fine Dining',
                category: 'SHOPPING & CUISINE',
                desc: 'Explore luxury fashion houses, authentic Indian cuisine, and global coffee roasters inside Terminal 1 & 2 concourses.',
                icon: ArrowUpRight,
                accent: '#38bdf8',
                tag: '120+ STORES',
              },
              {
                title: 'Live Security Queue Times',
                category: 'SMART CHECKPOINTS',
                desc: 'Real-time line wait indicator: Terminal 2 Security Screening average wait time is currently 6 minutes.',
                icon: Shield,
                accent: '#34d399',
                tag: '6 MIN WAIT',
              },
              {
                title: 'Surface Transport & Parking',
                category: 'METRO & SHUTTLES',
                desc: 'Direct connection to SPH Airport Metro Line, automated parking tariff guidance, and 24/7 terminal shuttle dispatch.',
                icon: Car,
                accent: '#818cf8',
                tag: 'METRO CONNECT',
              },
            ].map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                  <Card
                    sx={{
                      height: '100%',
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        border: `1px solid ${srv.accent}`,
                        boxShadow: `0 15px 35px ${srv.accent}33`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 6,
                        backgroundColor: srv.accent,
                        boxShadow: `0 0 15px ${srv.accent}`,
                      }}
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: '12px',
                            backgroundColor: `${srv.accent}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: srv.accent,
                          }}
                        >
                          <Icon size={22} />
                        </Box>
                        <Chip
                          label={srv.tag}
                          size="small"
                          sx={{
                            backgroundColor: `${srv.accent}15`,
                            color: srv.accent,
                            fontWeight: 800,
                            fontSize: '0.72rem',
                          }}
                        />
                      </Box>

                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px', display: 'block' }}>
                        {srv.category}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', mb: 1, mt: 0.5 }}>
                        {srv.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>
                        {srv.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* 4. Live Flight Information Display System (FIDS) Board */}
      <Container maxWidth="xl" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', maxWidth: 750, mx: 'auto', mb: 6 }}>
          <Typography variant="overline" sx={{ color: '#38bdf8', fontWeight: 800, letterSpacing: '1.5px' }}>
            FLIGHT INFORMATION DISPLAY SYSTEM (FIDS)
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#ffffff', mt: 1, mb: 2 }}>
            Live Saphire Hub Flight Schedule
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: '1.1rem' }}>
            Real-time flight movements synchronized with internal AOCC Controller Dispatch.
          </Typography>

          {/* FIDS Filter Tabs */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Tabs
              value={fidsTab}
              onChange={(_, val) => setFidsTab(val)}
              sx={{
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                borderRadius: '1000px',
                p: 0.5,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '& .MuiTabs-indicator': { backgroundColor: '#f59e0b', borderRadius: '1000px' },
                '& .MuiTab-root': { color: '#94a3b8', fontWeight: 700, minWidth: 120, '&.Mui-selected': { color: '#ffffff' } },
              }}
            >
              <Tab label="ALL FLIGHTS" value="ALL" />
              <Tab label="ARRIVALS" value="ARRIVALS" />
              <Tab label="DEPARTURES" value="DEPARTURES" />
            </Tabs>
          </Box>
        </Box>

        {/* FIDS Table */}
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '18px',
            overflow: 'hidden',
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: 'rgba(7, 11, 20, 0.9)' }}>
              <TableRow>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 800 }}>FLIGHT #</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 800 }}>AIRLINE</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 800 }}>ORIGIN / DESTINATION</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 800 }}>TYPE</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 800 }}>TIME</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 800 }}>GATE / STAND</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 800 }}>BAGGAGE</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 800 }}>STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFlights.map((f) => {
                const statusStyle = getStatusColor(f.status);
                return (
                  <TableRow
                    key={f.id}
                    onClick={() => {
                      setSelectedFlight(f);
                      setIsModalOpen(true);
                    }}
                    sx={{
                      cursor: 'pointer',
                      transition: 'backgroundColor 0.2s',
                      '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.06)' },
                    }}
                  >
                    <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontFamily: 'JetBrains Mono, monospace' }}>
                      {f.number}
                    </TableCell>
                    <TableCell sx={{ color: '#cbd5e1', fontWeight: 600 }}>{f.airline}</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>
                      {f.type === 'ARRIVAL' ? f.origin : f.destination}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={f.type}
                        size="small"
                        sx={{
                          backgroundColor: f.type === 'ARRIVAL' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(217, 119, 6, 0.15)',
                          color: f.type === 'ARRIVAL' ? '#38bdf8' : '#f59e0b',
                          fontWeight: 800,
                          fontSize: '0.7rem',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#f59e0b', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                      {f.scheduledTime}
                    </TableCell>
                    <TableCell sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                      {f.gate} ({f.stand})
                    </TableCell>
                    <TableCell sx={{ color: '#cbd5e1', fontWeight: 600 }}>{f.carousel}</TableCell>
                    <TableCell>
                      <Chip
                        label={f.status}
                        size="small"
                        sx={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.text,
                          border: `1px solid ${statusStyle.border}`,
                          fontWeight: 800,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* 5. Interactive Staff Access Role Gateway */}
      <Box sx={{ py: 10, backgroundColor: '#0b1120', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', maxWidth: 750, mx: 'auto', mb: 6 }}>
            <Typography variant="overline" sx={{ color: '#f59e0b', fontWeight: 800, letterSpacing: '1.5px' }}>
              STAFF COMMAND CENTER GATEWAY
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#ffffff', mt: 1, mb: 2 }}>
              Role-Based Operational Workspace Launcher
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: '1.1rem' }}>
              Test internal AOCS workflows by signing in as a specific department lead.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              { role: 'AIRPORT_OPERATIONS_MANAGER', title: 'System Administrator', dept: 'System Admin & Governance' },
              { role: 'AIRPORT_OPERATIONS_MANAGER', title: 'AOCC Controller', dept: 'Airside & Gate Operations' },
              { role: 'GROUND_HANDLING_SUPERVISOR', title: 'Ground Ops Lead', dept: 'Ramp & Turnaround Tasks' },
              { role: 'RAMP_AGENT', title: 'Fuel & Maintenance Tech', dept: 'Department Workstation' },
              { role: 'SECURITY_OFFICER', title: 'Border Security Lead', dept: 'Passenger Clearance & BRS' },
              { role: 'IMMIGRATION_OFFICER', title: 'Immigration Officer', dept: 'Passport & Visa Clearance' },
            ].map((r, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                <Paper
                  sx={{
                    p: 3,
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ffffff' }}>
                      {r.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                      Domain: {r.dept}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleQuickRoleLogin(r.role)}
                    sx={{ borderRadius: '1000px', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#f59e0b', fontWeight: 700 }}
                  >
                    Launch &rarr;
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 6. Flight Search Detail Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#0f172a',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '20px',
            color: '#ffffff',
            boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
          },
        }}
      >
        {selectedFlight && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Plane size={24} color="#f59e0b" />
                <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
                  {selectedFlight.number} Details
                </Typography>
              </Box>
              <IconButton onClick={() => setIsModalOpen(false)} sx={{ color: '#94a3b8' }}>
                <X size={20} />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <Box sx={{ mb: 3, p: 2, borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.04)' }}>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>
                  Airlines & Route
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff' }}>
                  {selectedFlight.airline} ({selectedFlight.airlineCode})
                </Typography>
                <Typography variant="body1" sx={{ color: '#38bdf8', fontWeight: 700 }}>
                  {selectedFlight.origin} &rarr; {selectedFlight.destination}
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={6}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                    Scheduled Time
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#f59e0b', fontFamily: 'JetBrains Mono' }}>
                    {selectedFlight.scheduledTime} SPH
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                    Status
                  </Typography>
                  <Chip
                    label={selectedFlight.status}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(selectedFlight.status).bg,
                      color: getStatusColor(selectedFlight.status).text,
                      fontWeight: 800,
                    }}
                  />
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                    Assigned Gate & Stand
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ffffff' }}>
                    {selectedFlight.gate} ({selectedFlight.stand})
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                    Baggage Claim
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ffffff' }}>
                    {selectedFlight.carousel}
                  </Typography>
                </Grid>
              </Grid>

              {/* Progress Bar Stepper */}
              <Box sx={{ p: 2, borderRadius: '12px', backgroundColor: 'rgba(217, 119, 6, 0.1)', border: '1px solid rgba(217, 119, 6, 0.3)' }}>
                <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 700, display: 'block', mb: 1 }}>
                  Turnaround Synchronization Active
                </Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                  Flight is synchronized live with Saphire Hub AOCC Dispatch Center.
                </Typography>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* 7. Footer */}
      <Box sx={{ py: 6, backgroundColor: '#04070e', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ffffff' }}>
              SAPHIRE AOCS • Saphire International Airport (`SPH / VASP`)
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              PostgreSQL 18 DB • Spring Boot 3.2 REST API • React 18 + TS + MUI v6 • Flyway Migrations
            </Typography>
          </Box>
          <Chip
            icon={<CheckCircle2 size={14} color="#34d399" />}
            label="CSMIA Passenger Portal & AOCS Core: Certified Online"
            sx={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 700 }}
          />
        </Container>
      </Box>
    </Box>
  );
};
