import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { Globe, ShieldCheck } from 'lucide-react';
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.8 }}>
                <img
                  src="/saphire_logo_clean.png"
                  alt="Saphire International Airport"
                  style={{
                    height: '40px',
                    width: 'auto',
                    objectFit: 'contain',
                    imageRendering: '-webkit-optimize-contrast',
                    filter: 'drop-shadow(0 2px 8px rgba(2, 132, 199, 0.22))',
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 800,
                      fontSize: '1.12rem',
                      color: '#0F2942',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.1,
                    }}
                  >
                    SAPHIRE AIRPORT
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: '0.64rem',
                      color: '#0284C7',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                    }}
                  >
                    ICAO: VASP • IATA: SPH
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.88rem',
                  lineHeight: 1.65,
                  color: '#475569',
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
                  fontWeight: 700,
                  fontSize: '0.90rem',
                  color: '#0F2942',
                  mb: 1.8,
                  letterSpacing: '-0.01em',
                }}
              >
                Passenger Travel
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                <Link href="/tracker" sx={{ color: '#475569', textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  Flight Status Tracker
                </Link>
                <Link href="/schedule" sx={{ color: '#475569', textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  Master Timetable
                </Link>
                <Link href="/passenger-services#facilities" sx={{ color: '#475569', textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  Terminal Facilities
                </Link>
                <Link href="/passenger-services#lounges" sx={{ color: '#475569', textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
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
                  fontWeight: 700,
                  fontSize: '0.90rem',
                  color: '#0F2942',
                  mb: 1.8,
                  letterSpacing: '-0.01em',
                }}
              >
                Concourses &amp; Logistics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                <Link href="/airport#terminals" sx={{ color: '#475569', textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  Terminal 1 &amp; Terminal 2
                </Link>
                <Link href="/airport#transport" sx={{ color: '#475569', textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  Ground Express &amp; Valet
                </Link>
                <Link href="/cargo" sx={{ color: '#475569', textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  Air Freight &amp; Cargo Hub
                </Link>
                <Link href="/login" sx={{ color: '#475569', textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
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
                  fontWeight: 700,
                  fontSize: '0.90rem',
                  color: '#0F2942',
                  mb: 1.8,
                  letterSpacing: '-0.01em',
                }}
              >
                Guest Assistance
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                <Link href="/contact#emergency" sx={{ color: '#475569', textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  24/7 Tower Hotline
                </Link>
                <Link href="/passenger-services#lost-found" sx={{ color: '#475569', textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  Lost Property Bureau
                </Link>
                <Link href="/contact#form" sx={{ color: '#475569', textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  Feedback &amp; Inquiries
                </Link>
                <Link href="/passenger-services#faq" sx={{ color: '#475569', textDecoration: 'none', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                  Travel FAQs
                </Link>
              </Box>
            </Box>
          </Box>

          {/* Apple-Style Glassy Badge Strip */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              pt: 2.5,
              borderTop: '1px solid rgba(229, 231, 235, 0.75)',
            }}
          >
            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', color: '#64748B' }}>
              © {new Date().getFullYear()} Saphire International Airport Authority. All rights reserved.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.45,
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(229, 231, 235, 0.9)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.8,
                  boxShadow: '0 2px 8px rgba(15, 41, 66, 0.03)',
                }}
              >
                <ShieldCheck size={13} color="#10B981" />
                <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.70rem', fontWeight: 700, color: '#0F2942' }}>
                  ICAO CAT III B AUTOLAND
                </Typography>
              </Box>

              <Box
                sx={{
                  px: 1.5,
                  py: 0.45,
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(229, 231, 235, 0.9)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.8,
                  boxShadow: '0 2px 8px rgba(15, 41, 66, 0.03)',
                }}
              >
                <Globe size={13} color="#0284C7" />
                <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.70rem', fontWeight: 700, color: '#0F2942' }}>
                  IATA CODE SPH
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
