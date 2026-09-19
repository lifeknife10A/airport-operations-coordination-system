import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { Globe, ShieldCheck, Plane } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        backgroundImage: `linear-gradient(180deg, rgba(15, 41, 66, 0.4) 0%, rgba(15, 41, 66, 0.68) 100%), url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2400&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        py: { xs: 6, md: 8 },
        px: { xs: 2, md: 4 },
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xl">
        <Box
          className="apple-liquid-glass"
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: '28px',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr' },
              gap: { xs: 4, md: 6 },
              mb: 6,
            }}
          >
          {/* Brand & Sapphire Identity */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <img
                src="/saphire_logo_clean.png"
                alt="Saphire International Airport"
                style={{
                  height: '42px',
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
                    fontSize: '1.15rem',
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
                fontSize: '0.92rem',
                lineHeight: 1.7,
                color: '#64748B',
                maxWidth: '400px',
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
                fontSize: '0.92rem',
                color: '#0F2942',
                mb: 2.5,
                letterSpacing: '-0.01em',
              }}
            >
              Passenger Travel
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.6 }}>
              <Link href="/tracker" sx={{ color: '#64748B', textDecoration: 'none', fontSize: '0.88rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                Flight Status Tracker
              </Link>
              <Link href="/schedule" sx={{ color: '#64748B', textDecoration: 'none', fontSize: '0.88rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                Master Timetable
              </Link>
              <Link href="/passenger-services#facilities" sx={{ color: '#64748B', textDecoration: 'none', fontSize: '0.88rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                Terminal Facilities
              </Link>
              <Link href="/passenger-services#lounges" sx={{ color: '#64748B', textDecoration: 'none', fontSize: '0.88rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
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
                fontSize: '0.92rem',
                color: '#0F2942',
                mb: 2.5,
                letterSpacing: '-0.01em',
              }}
            >
              Concourses &amp; Logistics
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.6 }}>
              <Link href="/airport#terminals" sx={{ color: '#64748B', textDecoration: 'none', fontSize: '0.88rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                Terminal 1 &amp; Terminal 2
              </Link>
              <Link href="/airport#transport" sx={{ color: '#64748B', textDecoration: 'none', fontSize: '0.88rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                Ground Express &amp; Valet
              </Link>
              <Link href="/cargo" sx={{ color: '#64748B', textDecoration: 'none', fontSize: '0.88rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                Air Freight &amp; Cargo Hub
              </Link>
              <Link href="/login" sx={{ color: '#64748B', textDecoration: 'none', fontSize: '0.88rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
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
                fontSize: '0.92rem',
                color: '#0F2942',
                mb: 2.5,
                letterSpacing: '-0.01em',
              }}
            >
              Guest Assistance
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.6 }}>
              <Link href="/contact#emergency" sx={{ color: '#64748B', textDecoration: 'none', fontSize: '0.88rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                24/7 Tower Hotline
              </Link>
              <Link href="/passenger-services#lost-found" sx={{ color: '#64748B', textDecoration: 'none', fontSize: '0.88rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                Lost Property Bureau
              </Link>
              <Link href="/contact#form" sx={{ color: '#64748B', textDecoration: 'none', fontSize: '0.88rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
                Feedback &amp; Inquiries
              </Link>
              <Link href="/passenger-services#faq" sx={{ color: '#64748B', textDecoration: 'none', fontSize: '0.88rem', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s ease', '&:hover': { color: '#0284C7', fontWeight: 600 } }}>
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
            pt: 4,
            borderTop: '1px solid rgba(229, 231, 235, 0.7)',
          }}
        >
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', color: '#94A3B8' }}>
            © {new Date().getFullYear()} Saphire International Airport Authority. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Box
              sx={{
                px: 1.6,
                py: 0.5,
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
              <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', fontWeight: 700, color: '#0F2942' }}>
                ICAO CAT III B AUTOLAND
              </Typography>
            </Box>

            <Box
              sx={{
                px: 1.6,
                py: 0.5,
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
              <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', fontWeight: 700, color: '#0F2942' }}>
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
