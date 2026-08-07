import React, { useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Package, Building2, Truck, FileText, ArrowRight, Wifi } from 'lucide-react';

export const CombinedServicesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'passenger' | 'cargo'>('passenger');
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 6, position: 'relative' }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            component="span"
            sx={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: '#38BDF8',
              textTransform: 'uppercase',
              display: 'inline-block',
              mb: 1,
            }}
          >
            AIRPORT CAPABILITIES & ECOSYSTEM
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              color: '#FFFFFF',
              fontSize: { xs: '1.8rem', md: '2.4rem' },
              letterSpacing: '-0.02em',
              mb: 2,
            }}
          >
            Passenger & Cargo Operations Hub
          </Typography>

          {/* Toggle Pills */}
          <Box
            sx={{
              display: 'inline-flex',
              background: 'rgba(15, 23, 42, 0.9)',
              p: 0.6,
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              gap: 1,
            }}
          >
            <Button
              onClick={() => setActiveTab('passenger')}
              startIcon={<UserCheck size={18} />}
              sx={{
                borderRadius: '8px',
                px: 3,
                py: 1,
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'none',
                color: activeTab === 'passenger' ? '#FFFFFF' : '#94A3B8',
                background: activeTab === 'passenger' ? 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)' : 'transparent',
                boxShadow: activeTab === 'passenger' ? '0 4px 15px rgba(37, 99, 235, 0.3)' : 'none',
                '&:hover': {
                  background: activeTab === 'passenger' ? 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)' : 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              Passenger Services
            </Button>
            <Button
              onClick={() => setActiveTab('cargo')}
              startIcon={<Package size={18} />}
              sx={{
                borderRadius: '8px',
                px: 3,
                py: 1,
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'none',
                color: activeTab === 'cargo' ? '#FFFFFF' : '#94A3B8',
                background: activeTab === 'cargo' ? 'linear-gradient(135deg, #065F46 0%, #059669 100%)' : 'transparent',
                boxShadow: activeTab === 'cargo' ? '0 4px 15px rgba(16, 185, 129, 0.3)' : 'none',
                '&:hover': {
                  background: activeTab === 'cargo' ? 'linear-gradient(135deg, #047857 0%, #046C4E 100%)' : 'rgba(255, 255, 255, 0.05)',
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
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '16px',
                p: 3.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1.2, borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>
                  <UserCheck size={24} />
                </Box>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>
                  Passenger Information
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#94A3B8', mb: 3 }}>
                Complete passenger guidance from check-in counters to departure gate lounge boarding and baggage claim.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#CBD5E1', fontSize: '0.88rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#38BDF8' }} />
                  Automated Baggage Carousel Tracking
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#CBD5E1', fontSize: '0.88rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#38BDF8' }} />
                  Live Security Check Queue Estimates
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#CBD5E1', fontSize: '0.88rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#38BDF8' }} />
                  Biometric E-Gates & Fast-Track Lane Access
                </Box>
              </Box>
              <Button
                onClick={() => navigate('/passenger-services#facilities')}
                variant="outlined"
                endIcon={<ArrowRight size={16} />}
                sx={{
                  borderColor: 'rgba(56, 189, 248, 0.4)',
                  color: '#38BDF8',
                  textTransform: 'none',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600,
                  borderRadius: '8px',
                  '&:hover': { borderColor: '#38BDF8', background: 'rgba(56, 189, 248, 0.08)' },
                }}
              >
                View Passenger Info
              </Button>
            </Box>

            <Box
              sx={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '16px',
                p: 3.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1.2, borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>
                  <Building2 size={24} />
                </Box>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>
                  Terminal Information
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#94A3B8', mb: 3 }}>
                Navigate Terminal 1 (Domestic) and Terminal 2 (International) with inter-terminal automated transit.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#CBD5E1', fontSize: '0.88rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#38BDF8' }} />
                  T1 Domestic Concourse & Gates A1 - B20
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#CBD5E1', fontSize: '0.88rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#38BDF8' }} />
                  T2 International Hub & Widebody Gates C1 - D30
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#CBD5E1', fontSize: '0.88rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#38BDF8' }} />
                  24/7 Monorail Inter-Terminal Shuttle Service
                </Box>
              </Box>
              <Button
                onClick={() => navigate('/airport#terminals')}
                variant="outlined"
                endIcon={<ArrowRight size={16} />}
                sx={{
                  borderColor: 'rgba(56, 189, 248, 0.4)',
                  color: '#38BDF8',
                  textTransform: 'none',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600,
                  borderRadius: '8px',
                  '&:hover': { borderColor: '#38BDF8', background: 'rgba(56, 189, 248, 0.08)' },
                }}
              >
                Explore Terminals
              </Button>
            </Box>

            <Box
              sx={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '16px',
                p: 3.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1.2, borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>
                  <Wifi size={24} />
                </Box>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>
                  Airport Facilities
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#94A3B8', mb: 3 }}>
                World-class traveler amenities including high-speed Wi-Fi, medical centers, and lost item support.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#CBD5E1', fontSize: '0.88rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#38BDF8' }} />
                  Complimentary 5G Wi-Fi & Workstation Pods
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#CBD5E1', fontSize: '0.88rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#38BDF8' }} />
                  24/7 First Aid Center & On-site Pharmacy
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#CBD5E1', fontSize: '0.88rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#38BDF8' }} />
                  Centralized Lost & Found Baggage Counter
                </Box>
              </Box>
              <Button
                onClick={() => navigate('/passenger-services')}
                variant="outlined"
                endIcon={<ArrowRight size={16} />}
                sx={{
                  borderColor: 'rgba(56, 189, 248, 0.4)',
                  color: '#38BDF8',
                  textTransform: 'none',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600,
                  borderRadius: '8px',
                  '&:hover': { borderColor: '#38BDF8', background: 'rgba(56, 189, 248, 0.08)' },
                }}
              >
                All Facilities
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            <Box
              sx={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '16px',
                p: 3.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1.2, borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
                  <Package size={24} />
                </Box>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>
                  Cargo Information
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#94A3B8', mb: 3 }}>
                Real-time Air Waybill (AWB) telemetry tracking and high-capacity freight handling options.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#CBD5E1', fontSize: '0.88rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
                  Live 11-Digit Air Waybill (AWB) Tracking
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#CBD5E1', fontSize: '0.88rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
                  Cold-Chain Storage (-20°C to +8°C Controlled)
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#CBD5E1', fontSize: '0.88rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
                  High-Value Vault & Hazardous Cargo Storage
                </Box>
              </Box>
              <Button
                onClick={() => navigate('/cargo#services')}
                variant="outlined"
                endIcon={<ArrowRight size={16} />}
                sx={{
                  borderColor: 'rgba(16, 185, 129, 0.4)',
                  color: '#34D399',
                  textTransform: 'none',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600,
                  borderRadius: '8px',
                  '&:hover': { borderColor: '#34D399', background: 'rgba(16, 185, 129, 0.08)' },
                }}
              >
                View Cargo Info
              </Button>
            </Box>

            <Box
              sx={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '16px',
                p: 3.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1.2, borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
                  <Truck size={24} />
                </Box>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>
                  Cargo Handling
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#94A3B8', mb: 3 }}>
                Automated high-bay warehouse logistics, palletization, and direct ramp loading for cargo freighters.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#CBD5E1', fontSize: '0.88rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
                  Automated ULD Container Stacking & Retrieval
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#CBD5E1', fontSize: '0.88rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
                  Dedicated Freighter Ramp Slots & Maindeck Loaders
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#CBD5E1', fontSize: '0.88rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
                  Express Courier & Mail Sorting Concourse
                </Box>
              </Box>
              <Button
                onClick={() => navigate('/cargo#process')}
                variant="outlined"
                endIcon={<ArrowRight size={16} />}
                sx={{
                  borderColor: 'rgba(16, 185, 129, 0.4)',
                  color: '#34D399',
                  textTransform: 'none',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600,
                  borderRadius: '8px',
                  '&:hover': { borderColor: '#34D399', background: 'rgba(16, 185, 129, 0.08)' },
                }}
              >
                Handling Workflow
              </Button>
            </Box>

            <Box
              sx={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '16px',
                p: 3.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1.2, borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
                  <FileText size={24} />
                </Box>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>
                  Cargo Enquiries & Docs
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#94A3B8', mb: 3 }}>
                Direct customs documentation guidance, clearance manifests, and freight forwarder hotlines.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#CBD5E1', fontSize: '0.88rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
                  Digital Customs Clearance & e-AWB Submission
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#CBD5E1', fontSize: '0.88rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
                  24/7 Cargo Customer Service & Support Desk
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#CBD5E1', fontSize: '0.88rem' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
                  Freight Forwarder Terminal Access Passes
                </Box>
              </Box>
              <Button
                onClick={() => navigate('/cargo#docs')}
                variant="outlined"
                endIcon={<ArrowRight size={16} />}
                sx={{
                  borderColor: 'rgba(16, 185, 129, 0.4)',
                  color: '#34D399',
                  textTransform: 'none',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600,
                  borderRadius: '8px',
                  '&:hover': { borderColor: '#34D399', background: 'rgba(16, 185, 129, 0.08)' },
                }}
              >
                Cargo Documentation
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CombinedServicesSection;
