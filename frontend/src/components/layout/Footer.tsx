import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { Globe, ShieldCheck } from 'lucide-react';
import { SaphireLogo } from '../common/SaphireLogo';
import bannerFooter from '../../assets/banners/banner-footer.jpg';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        backgroundImage: `linear-gradient(180deg, rgba(15, 41, 66, 0.42) 0%, rgba(15, 41, 66, 0.70) 100%), url(${bannerFooter})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        py: { xs: 3, md: 4 },
        px: { xs: 2, md: 3 },
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xl">
        <Box
          className="apple-liquid-glass"
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: '24px',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr' },
              gap: { xs: 3, md: 5 },
              mb: 3.5,
            }}
          >
            {/* Brand & Sapphire Identity */}
            <Box>
              <Box sx={{ mb: 1.8 }}>
                <SaphireLogo size={40} variant="full" title="SAPHIRE AIRPORT" subtitle="ICAO: VASP • IATA: SPH" />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.88rem',
                  lineHeight: 1.65,
                  color: '#0F172A',
                  fontWeight: 500,
                  maxWidth: '390px',
                }}
              >
                Saphire International Airport is a premier civil aviation gateway connecting millions of global travelers with serene terminal experiences, precision flight guidance, and round-the-clock passenger care.
              </Typography>
            </Box>

            {/* Passenger Travel */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: '0.90rem',
                  color: '#0F2942',
                  mb: 1.8,
                  letterSpacing: '-0.01em',
                }}
              >
                Passenger Travel
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                <Link href="/tracker" sx={{ color: '#1E293B', fontWeight: 500, textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  Flight Status Tracker
                </Link>
                <Link href="/schedule" sx={{ color: '#1E293B', fontWeight: 500, textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  Master Timetable
                </Link>
                <Link href="/passenger-services#facilities" sx={{ color: '#1E293B', fontWeight: 500, textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  Terminal Facilities
                </Link>
                <Link href="/passenger-services#lounges" sx={{ color: '#1E293B', fontWeight: 500, textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  Executive Lounges &amp; VIP
                </Link>
              </Box>
            </Box>

            {/* Ground & Airside Hub */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: '0.90rem',
                  color: '#0F2942',
                  mb: 1.8,
                  letterSpacing: '-0.01em',
                }}
              >
                Concourses &amp; Logistics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                <Link href="/airport#terminals" sx={{ color: '#1E293B', fontWeight: 500, textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  Central Terminal &amp; Concourses
                </Link>
                <Link href="/airport#transport" sx={{ color: '#1E293B', fontWeight: 500, textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  Ground Express &amp; Valet
                </Link>
                <Link href="/cargo" sx={{ color: '#1E293B', fontWeight: 500, textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  Air Freight &amp; Cargo Hub
                </Link>
                <Link href="/login" sx={{ color: '#1E293B', fontWeight: 500, textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  Airside Staff Login
                </Link>
              </Box>
            </Box>

            {/* Assistance & Emergency */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: '0.90rem',
                  color: '#0F2942',
                  mb: 1.8,
                  letterSpacing: '-0.01em',
                }}
              >
                Guest Assistance
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                <Link href="/contact#emergency" sx={{ color: '#1E293B', fontWeight: 500, textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  24/7 Tower Hotline
                </Link>
                <Link href="/passenger-services#lost-found" sx={{ color: '#1E293B', fontWeight: 500, textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  Lost Property Bureau
                </Link>
                <Link href="/contact#form" sx={{ color: '#1E293B', fontWeight: 500, textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  Feedback &amp; Inquiries
                </Link>
                <Link href="/passenger-services#faq" sx={{ color: '#1E293B', fontWeight: 500, textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  Travel FAQs
                </Link>
              </Box>
            </Box>
          </Box>

          {/* Clean High-Contrast Legal & Identity Strip */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              pt: 2.5,
              borderTop: '1px solid rgba(15, 41, 66, 0.12)',
            }}
          >
            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>
              © {new Date().getFullYear()} Saphire International Airport Authority. All rights reserved.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', fontWeight: 700, color: '#0284C7' }}>
                ICAO: VASP • IATA: SPH
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
