import React, { useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Package, Building2, Truck, FileText, ArrowRight, Wifi } from 'lucide-react';

export const CombinedServicesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'passenger' | 'cargo'>('passenger');
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 10, position: 'relative', backgroundColor: '#FAF8F5', color: '#1A1A1A' }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            component="span"
            sx={{
              fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
              fontSize: '0.74rem',
              fontWeight: 600,
              letterSpacing: '0.16em',
              color: '#C43E3A',
              textTransform: 'uppercase',
              display: 'inline-block',
              mb: 1.5,
            }}
          >
            AERODROME CAPABILITIES & ECOSYSTEM
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              color: '#1A1A1A',
              fontSize: { xs: '1.8rem', md: '2.4rem' },
              letterSpacing: '-0.02em',
              mb: 3,
            }}
          >
            Passenger & Cargo Operations Hub
          </Typography>

          {/* Minimalist Toggle Pills */}
          <Box
            sx={{
              display: 'inline-flex',
              background: '#EFECE6',
              p: 0.5,
              borderRadius: '8px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              gap: 0.5,
            }}
          >
            <Button
              onClick={() => setActiveTab('passenger')}
              startIcon={<UserCheck size={16} />}
              sx={{
                borderRadius: '6px',
                px: 3,
                py: 0.8,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '0.84rem',
                textTransform: 'none',
                color: activeTab === 'passenger' ? '#1A1A1A' : '#787873',
                background: activeTab === 'passenger' ? '#FFFFFF' : 'transparent',
                boxShadow: activeTab === 'passenger' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.15s ease',
                '&:hover': {
                  background: activeTab === 'passenger' ? '#FFFFFF' : 'rgba(0, 0, 0, 0.04)',
                  color: '#1A1A1A',
                },
              }}
            >
              Passenger Facilities
            </Button>
            <Button
              onClick={() => setActiveTab('cargo')}
              startIcon={<Package size={16} />}
              sx={{
                borderRadius: '6px',
                px: 3,
                py: 0.8,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '0.84rem',
                textTransform: 'none',
                color: activeTab === 'cargo' ? '#1A1A1A' : '#787873',
                background: activeTab === 'cargo' ? '#FFFFFF' : 'transparent',
                boxShadow: activeTab === 'cargo' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.15s ease',
                '&:hover': {
                  background: activeTab === 'cargo' ? '#FFFFFF' : 'rgba(0, 0, 0, 0.04)',
                  color: '#1A1A1A',
                },
              }}
            >
              Cargo Operations
            </Button>
          </Box>
        </Box>

        {/* Tab Content Display */}
        {activeTab === 'passenger' ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            <Box
              sx={{
                background: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                borderRadius: '14px',
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  borderColor: 'rgba(196, 62, 58, 0.45)',
                  boxShadow: '0 14px 32px rgba(196, 62, 58, 0.08)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1.2, borderRadius: '8px', background: 'rgba(196, 62, 58, 0.08)', color: '#C43E3A' }}>
                  <UserCheck size={20} />
                </Box>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#1A1A1A' }}>
                  Passenger Guidance
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', lineHeight: 1.6, color: '#52524E', mb: 3 }}>
                Comprehensive traveler guidance from check-in concourses to departure gate lounges and baggage claim carousels.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#2E2E2C', fontSize: '0.84rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#C43E3A' }} />
                  Automated Baggage Belt & Claim Tracking
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#2E2E2C', fontSize: '0.84rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#C43E3A' }} />
                  Security Checkpoint Queue Estimates
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#2E2E2C', fontSize: '0.84rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#C43E3A' }} />
                  Biometric e-Gates & FastTrack Access
                </Box>
              </Box>
              <Button
                onClick={() => navigate('/passenger-services#facilities')}
                variant="outlined"
                endIcon={<ArrowRight size={14} />}
                sx={{
                  borderColor: 'rgba(0, 0, 0, 0.15)',
                  color: '#1A1A1A',
                  textTransform: 'none',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  borderRadius: '6px',
                  py: 0.8,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: '#C43E3A',
                    color: '#FFFFFF',
                    background: '#C43E3A',
                    boxShadow: '0 4px 12px rgba(196, 62, 58, 0.25)',
                  },
                }}
              >
                View Passenger Guide
              </Button>
            </Box>

            <Box
              sx={{
                background: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                borderRadius: '14px',
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  borderColor: 'rgba(196, 62, 58, 0.45)',
                  boxShadow: '0 14px 32px rgba(196, 62, 58, 0.08)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1.2, borderRadius: '8px', background: 'rgba(196, 62, 58, 0.08)', color: '#C43E3A' }}>
                  <Building2 size={20} />
                </Box>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#1A1A1A' }}>
                  Terminal Navigation
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', lineHeight: 1.6, color: '#52524E', mb: 3 }}>
                Navigate Terminal 1 (Domestic) and Terminal 2 (International) with inter-terminal automated transit.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#2E2E2C', fontSize: '0.84rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#C43E3A' }} />
                  T1 Domestic Concourse & Gates A1 - B20
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#2E2E2C', fontSize: '0.84rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#C43E3A' }} />
                  T2 International Hub & Widebody Gates C1 - D30
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#2E2E2C', fontSize: '0.84rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#C43E3A' }} />
                  Automated People Mover (APM) Express
                </Box>
              </Box>
              <Button
                onClick={() => navigate('/airport#terminals')}
                variant="outlined"
                endIcon={<ArrowRight size={14} />}
                sx={{
                  borderColor: 'rgba(0, 0, 0, 0.15)',
                  color: '#1A1A1A',
                  textTransform: 'none',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  borderRadius: '6px',
                  py: 0.8,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: '#C43E3A',
                    color: '#FFFFFF',
                    background: '#C43E3A',
                    boxShadow: '0 4px 12px rgba(196, 62, 58, 0.25)',
                  },
                }}
              >
                Explore Terminals
              </Button>
            </Box>

            <Box
              sx={{
                background: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                borderRadius: '14px',
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  borderColor: 'rgba(196, 62, 58, 0.45)',
                  boxShadow: '0 14px 32px rgba(196, 62, 58, 0.08)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1.2, borderRadius: '8px', background: 'rgba(196, 62, 58, 0.08)', color: '#C43E3A' }}>
                  <Wifi size={20} />
                </Box>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#1A1A1A' }}>
                  Airport Amenities
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', lineHeight: 1.6, color: '#52524E', mb: 3 }}>
                Premium passenger amenities including high-speed 5G Wi-Fi, VIP executive lounges, and medical assistance.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#2E2E2C', fontSize: '0.84rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#C43E3A' }} />
                  Complimentary High-Speed Wi-Fi & Work Pods
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#2E2E2C', fontSize: '0.84rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#C43E3A' }} />
                  24/7 First Aid Center & Urgent Care Clinic
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#2E2E2C', fontSize: '0.84rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#C43E3A' }} />
                  Luggage Storage & Protective Porterage
                </Box>
              </Box>
              <Button
                onClick={() => navigate('/passenger-services')}
                variant="outlined"
                endIcon={<ArrowRight size={14} />}
                sx={{
                  borderColor: 'rgba(0, 0, 0, 0.15)',
                  color: '#1A1A1A',
                  textTransform: 'none',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  borderRadius: '6px',
                  py: 0.8,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: '#C43E3A',
                    color: '#FFFFFF',
                    background: '#C43E3A',
                    boxShadow: '0 4px 12px rgba(196, 62, 58, 0.25)',
                  },
                }}
              >
                All Passenger Services
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            <Box
              sx={{
                background: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                borderRadius: '14px',
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  borderColor: 'rgba(196, 62, 58, 0.45)',
                  boxShadow: '0 14px 32px rgba(196, 62, 58, 0.08)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1.2, borderRadius: '8px', background: 'rgba(196, 62, 58, 0.08)', color: '#C43E3A' }}>
                  <Package size={20} />
                </Box>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#1A1A1A' }}>
                  Cargo Consignments
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', lineHeight: 1.6, color: '#52524E', mb: 3 }}>
                Live Air Waybill (AWB) freight tracking and cold-chain temperature monitoring across global supply corridors.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#2E2E2C', fontSize: '0.84rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#C43E3A' }} />
                  11-Digit Master Air Waybill (MAWB) Tracking
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#2E2E2C', fontSize: '0.84rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#C43E3A' }} />
                  Cold-Chain Storage (-20°C to +8°C Controlled)
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#2E2E2C', fontSize: '0.84rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#C43E3A' }} />
                  High-Value Vault & Dangerous Goods Storage
                </Box>
              </Box>
              <Button
                onClick={() => navigate('/cargo#services')}
                variant="outlined"
                endIcon={<ArrowRight size={14} />}
                sx={{
                  borderColor: 'rgba(0, 0, 0, 0.15)',
                  color: '#1A1A1A',
                  textTransform: 'none',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  borderRadius: '6px',
                  py: 0.8,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: '#C43E3A',
                    color: '#FFFFFF',
                    background: '#C43E3A',
                    boxShadow: '0 4px 12px rgba(196, 62, 58, 0.25)',
                  },
                }}
              >
                View Cargo Services
              </Button>
            </Box>

            <Box
              sx={{
                background: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                borderRadius: '14px',
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  borderColor: 'rgba(196, 62, 58, 0.45)',
                  boxShadow: '0 14px 32px rgba(196, 62, 58, 0.08)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1.2, borderRadius: '8px', background: 'rgba(196, 62, 58, 0.08)', color: '#C43E3A' }}>
                  <Truck size={20} />
                </Box>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#1A1A1A' }}>
                  Ramp & Freight Handling
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', lineHeight: 1.6, color: '#52524E', mb: 3 }}>
                Automated high-bay warehouse logistics, container palletization, and dedicated maindeck freighter loading.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#2E2E2C', fontSize: '0.84rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#C43E3A' }} />
                  Automated ULD Container Stacking & Retrieval
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#2E2E2C', fontSize: '0.84rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#C43E3A' }} />
                  Dedicated Freighter Ramp Slots & Pushback Tugs
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#2E2E2C', fontSize: '0.84rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#C43E3A' }} />
                  Express 90-Minute Transshipment SLA
                </Box>
              </Box>
              <Button
                onClick={() => navigate('/cargo#process')}
                variant="outlined"
                endIcon={<ArrowRight size={14} />}
                sx={{
                  borderColor: 'rgba(0, 0, 0, 0.15)',
                  color: '#1A1A1A',
                  textTransform: 'none',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  borderRadius: '6px',
                  py: 0.8,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: '#C43E3A',
                    color: '#FFFFFF',
                    background: '#C43E3A',
                    boxShadow: '0 4px 12px rgba(196, 62, 58, 0.25)',
                  },
                }}
              >
                View Handling Workflow
              </Button>
            </Box>

            <Box
              sx={{
                background: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                borderRadius: '14px',
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  borderColor: 'rgba(196, 62, 58, 0.45)',
                  boxShadow: '0 14px 32px rgba(196, 62, 58, 0.08)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1.2, borderRadius: '8px', background: 'rgba(196, 62, 58, 0.08)', color: '#C43E3A' }}>
                  <FileText size={20} />
                </Box>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#1A1A1A' }}>
                  Customs & Documentation
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', lineHeight: 1.6, color: '#52524E', mb: 3 }}>
                Rapid paperless customs clearance, automated EDI cargo manifest transmission, and phytosanitary inspections.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#2E2E2C', fontSize: '0.84rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#C43E3A' }} />
                  Paperless Electronic Air Waybill (e-AWB)
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#2E2E2C', fontSize: '0.84rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#C43E3A' }} />
                  24/7 On-Site Border & Customs Officers
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#2E2E2C', fontSize: '0.84rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#C43E3A' }} />
                  Dangerous Goods & Quarantine Clearance
                </Box>
              </Box>
              <Button
                onClick={() => navigate('/cargo#docs')}
                variant="outlined"
                endIcon={<ArrowRight size={14} />}
                sx={{
                  borderColor: 'rgba(0, 0, 0, 0.15)',
                  color: '#1A1A1A',
                  textTransform: 'none',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  borderRadius: '6px',
                  py: 0.8,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: '#C43E3A',
                    color: '#FFFFFF',
                    background: '#C43E3A',
                    boxShadow: '0 4px 12px rgba(196, 62, 58, 0.25)',
                  },
                }}
              >
                Customs Guidelines
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CombinedServicesSection;
