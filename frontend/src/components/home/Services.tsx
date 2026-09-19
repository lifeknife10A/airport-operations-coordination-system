import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { SpotlightCard } from '../reactbits';
import { LayoutGrid, Fuel, Sparkles, Utensils, Shield, Cpu, ArrowRight } from 'lucide-react';

interface ServiceItem {
  icon: React.ElementType;
  title: string;
  desc: string;
  badge: string;
  link: string;
}

const services: ServiceItem[] = [
  {
    icon: LayoutGrid,
    title: 'Smart Gate & Stand Allocation',
    desc: 'Dynamic apron conflict prevention with live gate occupancy telemetry.',
    badge: 'AUTOMATED',
    link: '/gate-allocation',
  },
  {
    icon: Fuel,
    title: 'Refueling & Hydrant Dispatch',
    desc: 'Precision fuel flow rate telemetry, mass balancing, and safety clearance sync.',
    badge: 'REAL-TIME',
    link: '/refueling',
  },
  {
    icon: Sparkles,
    title: 'Cabin Turnaround & Sanitization',
    desc: 'Milestone tracking for aircraft cabin cleaning, security audit, and provisioning.',
    badge: 'LIVE TELEMETRY',
    link: '/cabin-cleaning',
  },
  {
    icon: Utensils,
    title: 'Catering & Provisioning Control',
    desc: 'Galleys loading validation, special meal tracking, and departure readiness locks.',
    badge: 'INTEGRATED',
    link: '/catering',
  },
  {
    icon: Shield,
    title: 'Security Clearance & Manifest',
    desc: 'Passenger biometric verification, no-fly crosscheck, and baggage reconciliation.',
    badge: 'SECURE',
    link: '/security',
  },
  {
    icon: Cpu,
    title: 'Audit Logs & Fleet Analytics',
    desc: 'Immutable operation logs, turn time breakdown, and historical telemetry reports.',
    badge: 'ANALYTICS',
    link: '/audit-log',
  },
];

export const Services: React.FC = () => {
  return (
    <Box sx={{ py: 8, position: 'relative' }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            component="span"
            sx={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              color: 'primary.main',
              textTransform: 'uppercase',
              display: 'inline-block',
              mb: 1,
            }}
          >
            AOCS PLATFORM MODULES
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '2rem', md: '2.75rem' },
              letterSpacing: '-0.025em',
              mb: 2,
            }}
          >
            Unified Ground & Flight Control
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.125rem',
              color: 'text.secondary',
              maxWidth: '65ch',
              mx: 'auto',
            }}
          >
            Engineered for seamless coordination across air traffic control, ground crew, and terminal management.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 4,
          }}
        >
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <SpotlightCard
                key={svc.link}
                sx={{
                  height: '100%',
                  borderRadius: 16,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  bgcolor: 'background.paper',
                  boxShadow: 0,
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box
                      sx={{
                        p: 1.2,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, rgba(33, 7, 128, 0.15) 0%, rgba(76, 81, 226, 0.15) 100%)',
                        border: '1px solid rgba(33, 7, 128, 0.3)',
                        color: 'primary.main',
                      }}
                    >
                      <Icon size={22} />
                    </Box>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: '20px',
                        background: 'rgba(33, 7, 128, 0.12)',
                        border: '1px solid rgba(33, 7, 128, 0.25)',
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: 'primary.main',
                        textTransform: 'uppercase',
                      }}
                    >
                      {svc.badge}
                    </Box>
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    {svc.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      color: 'text.secondary',
                      flexGrow: 1,
                    }}
                  >
                    {svc.desc}
                  </Typography>

                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'primary.main',
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                  >
                    <span>Explore Module</span>
                    <ArrowRight size={16} />
                  </Box>
                </Box>
              </SpotlightCard>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default Services;
