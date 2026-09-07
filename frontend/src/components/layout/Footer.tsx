import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 6, md: 8 },
        px: { xs: 2, md: 4 },
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default',
        color: 'text.secondary',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr' },
            gap: { xs: 4, md: 6 },
            mb: 6,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box
                component="img"
                src="/saphire_logo_transparent.png"
                alt="Saphire Logo"
                sx={{ height: '36px' }}
              />
              <Typography
                sx={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: 'text.primary',
                  letterSpacing: '0.05em',
                }}
              >
                SAPHIRE AOCS
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.95rem',
                lineHeight: 1.7,
                color: 'text.secondary',
                maxWidth: '380px',
              }}
            >
              Next-Generation Airport Operations Coordination System powering global air traffic hub synchronization.
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                color: 'text.primary',
                mb: 3,
                letterSpacing: '0.04em',
              }}
            >
              Public Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Link href="/tracker" sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.95rem', '&:hover': { color: 'primary.main' } }}>
                Flight Telemetry Tracker
              </Link>
              <Link href="/schedule" sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.95rem', '&:hover': { color: 'primary.main' } }}>
                Schedules & Gates
              </Link>
              <Link href="/passenger-services" sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.95rem', '&:hover': { color: 'primary.main' } }}>
                Passenger Assistance
              </Link>
              <Link href="/cargo" sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.95rem', '&:hover': { color: 'primary.main' } }}>
                Air Cargo Express
              </Link>
            </Box>
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                color: 'text.primary',
                mb: 3,
                letterSpacing: '0.04em',
              }}
            >
              Operations Portal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Link href="/login" sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.95rem', '&:hover': { color: 'primary.main' } }}>
                Staff SSO Login
              </Link>
              <Link href="/gate-allocation" sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.95rem', '&:hover': { color: 'primary.main' } }}>
                Gate & Apron Allocation
              </Link>
              <Link href="/refueling" sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.95rem', '&:hover': { color: 'primary.main' } }}>
                Refueling Control
              </Link>
              <Link href="/audit-log" sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.95rem', '&:hover': { color: 'primary.main' } }}>
                Security & Audit Logs
              </Link>
            </Box>
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                color: 'text.primary',
                mb: 3,
                letterSpacing: '0.04em',
              }}
            >
              Global Network
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.95rem',
                lineHeight: 1.7,
                color: 'text.secondary',
                mb: 3,
              }}
            >
              Operating across international hub terminals worldwide with 24/7 dedicated dispatch support.
            </Typography>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1,
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.primary',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '0.875rem',
              }}
            >
              <Globe size={16} sx={{ color: 'primary.main' }} />
              <span>24/7 Control Center Support</span>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.875rem',
            color: 'text.secondary',
          }}
        >
          <Typography variant="body2">
            © 2026 Saphire International Airlines. All Rights Reserved. Airport Operations Coordination System.
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Crafted for Software Engineering Operations
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
