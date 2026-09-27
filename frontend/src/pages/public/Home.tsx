import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/home/Hero/Hero';
import Footer from '../../components/layout/Footer';
import { Box, Container, Typography, Button } from '@mui/material';
import { Coffee, ShoppingBag, Utensils, Wifi, ArrowRight, Sparkles, ShieldCheck, Hotel } from 'lucide-react';
import { SpotlightCard } from '../../components/reactbits';
import ArchitecturalSanctuaries from '../../components/home/ArchitecturalSanctuaries';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#FAF9F6',
        color: '#0F2942',
        overflowX: 'hidden',
      }}
    >
      <Navbar />

      <Box component="main">
        {/* 1. Hero with Touchdown Scrubbing Canvas & Seam Bridge */}
        <Hero />

        {/* 2. Welcome & Executive Sanctuaries (All-White / Warm-Ivory Theme matching SS2 & Project Context) */}
        <Box sx={{ backgroundColor: '#FAF9F6', pt: { xs: 7, md: 9 }, pb: { xs: 7, md: 9 }, borderBottom: '1px solid rgba(15, 41, 66, 0.08)' }}>
          <Container maxWidth="xl">
            {/* Header Block */}
            <Box sx={{ textAlign: 'center', maxWidth: '820px', mx: 'auto', mb: { xs: 5, md: 6 } }}>
              <Typography
                sx={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: '#0284C7',
                  mb: 1.5,
                  textTransform: 'uppercase',
                }}
              >
                EXECUTIVE SANCTUARIES &amp; PASSENGER COMFORT
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  color: '#0F2942',
                  fontSize: { xs: '2rem', md: '2.85rem' },
                  letterSpacing: '-0.025em',
                  mb: 2,
                }}
              >
                Welcome to Saphire International Airport
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: { xs: '0.98rem', md: '1.05rem' },
                  lineHeight: 1.65,
                  color: '#64748B',
                }}
              >
                You can find essential information here, including baggage handling, lounge access, dining and retail facilities, and transport options. We aim to provide an efficient and comfortable journey. Thank you for using Saphire International Airport.
              </Typography>
            </Box>

            {/* Clickable Containers from Passenger Services (Matching SS2) with Multicolor Cursor Hover Reactbit */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                gap: 3,
              }}
            >
              {[
                {
                  icon: <Sparkles size={22} color="#D97706" />,
                  title: 'VIP Executive Sanctuary',
                  desc: 'Private suite seating, rain showers, curated sommelier bar, and private boarding transit for premium class travelers.',
                  tag: 'EXECUTIVE TIER',
                  accentColor: '#D97706',
                  bgColor: 'rgba(217, 119, 6, 0.08)',
                  spotlightColor: 'rgba(217, 119, 6, 0.12)',
                  accentClass: 'accent-orange',
                  target: '/passenger-services#lounges',
                },
                {
                  icon: <Coffee size={22} color="#0284C7" />,
                  title: 'Quiet Lounge & Family Suites',
                  desc: 'Acoustically isolated quiet suites for deep relaxation, nursing rooms, and children play spaces.',
                  tag: 'QUIET SUITES',
                  accentColor: '#0284C7',
                  bgColor: 'rgba(2, 132, 199, 0.08)',
                  spotlightColor: 'rgba(2, 132, 199, 0.12)',
                  accentClass: 'accent-blue',
                  target: '/passenger-services#lounges',
                },
                {
                  icon: <ShieldCheck size={22} color="#10B981" />,
                  title: 'FastTrack Security Access',
                  desc: 'Dedicated priority screening lanes for diplomatic, first-class, and business travelers.',
                  tag: 'PRIORITY LANES',
                  accentColor: '#10B981',
                  bgColor: 'rgba(16, 185, 129, 0.08)',
                  spotlightColor: 'rgba(16, 185, 129, 0.12)',
                  accentClass: 'accent-green',
                  target: '/passenger-services#facilities',
                },
                {
                  icon: <Hotel size={22} color="#7C3AED" />,
                  title: 'Transit Hotel & Sleep Pods',
                  desc: 'Soundproof luxury sleep capsules and micro-hotel suites situated directly inside the airside concourse.',
                  tag: 'AIRSIDE SLEEP',
                  accentColor: '#7C3AED',
                  bgColor: 'rgba(124, 58, 237, 0.08)',
                  spotlightColor: 'rgba(124, 58, 237, 0.12)',
                  accentClass: 'accent-purple',
                  target: '/passenger-services#facilities',
                },
              ].map((item, idx) => (
                <SpotlightCard
                  key={idx}
                  multicolor={false}
                  spotlightColor={item.spotlightColor}
                  className={item.accentClass}
                  onClick={() => navigate(item.target)}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    padding: '28px 22px',
                    boxShadow: '0 4px 16px rgba(15, 41, 66, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.2 }}>
                      <Box sx={{ p: 1.2, borderRadius: '12px', background: item.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.icon}
                      </Box>
                      <Box
                        sx={{
                          fontSize: '0.68rem',
                          fontFamily: "'Geist Mono', monospace",
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          px: 1.2,
                          py: 0.4,
                          borderRadius: '999px',
                          background: item.bgColor,
                          color: item.accentColor,
                        }}
                      >
                        {item.tag}
                      </Box>
                    </Box>

                    <Typography
                      sx={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: '1.15rem',
                        color: '#0F2942',
                        mb: 1.2,
                        lineHeight: 1.35,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.88rem',
                        color: '#64748B',
                        lineHeight: 1.6,
                        mb: 2.5,
                      }}
                    >
                      {item.desc}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.8,
                      color: item.accentColor,
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    <span>Explore Service</span>
                    <ArrowRight size={15} />
                  </Box>
                </SpotlightCard>
              ))}
            </Box>

            {/* Bottom Centered Navigation CTA */}
            <Box sx={{ mt: 5, textAlign: 'center' }}>
              <Button
                onClick={() => navigate('/passenger-services')}
                endIcon={<ArrowRight size={18} />}
                sx={{
                  backgroundColor: '#0F2942',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.94rem',
                  py: 1.2,
                  px: 3.5,
                  borderRadius: '10px',
                  boxShadow: '0 4px 14px rgba(15, 41, 66, 0.10)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#0284C7',
                    boxShadow: '0 6px 20px rgba(2, 132, 199, 0.25)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Explore All Passenger Services &amp; Facilities
              </Button>
            </Box>
          </Container>
        </Box>

        {/* 3. Architectural Sanctuaries Showcase */}
        <Box sx={{ backgroundColor: '#FAF9F6', pt: { xs: 4, md: 5 }, pb: { xs: 8, md: 10 }, px: { xs: 2, md: 4, lg: 8 }, maxWidth: '1440px', mx: 'auto' }}>
          {/* Section Heading */}
          <Box sx={{ textAlign: 'center', maxWidth: '840px', mx: 'auto', mb: 5 }}>
            <Typography
              sx={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#0284C7',
                mb: 1.5,
                textTransform: 'uppercase',
              }}
            >
              WORLD-CLASS TERMINAL ARCHITECTURE
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                color: '#0F2942',
                fontSize: { xs: '2rem', md: '2.8rem' },
                letterSpacing: '-0.025em',
                mb: 1.5,
              }}
            >
              Architectural Sanctuaries &amp; Curated Living
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '1.02rem',
                lineHeight: 1.65,
                color: '#64748B',
              }}
            >
              A harmonious aerodrome retreat combining 40-meter biophilic glass canopies, whisper-quiet travertine water mirrors,
              and private airside tarmac chauffeurs. Designed to turn layovers into moments of calm luxury.
            </Typography>
          </Box>

          {/* Architectural Sanctuaries Showcase */}
          <Box sx={{ mb: 6 }}>
            <ArchitecturalSanctuaries />
          </Box>

          {/* Rich Info & Passenger Amenities Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 2.5,
            }}
          >
            {[
              {
                icon: <Coffee size={20} color="#0284C7" />,
                title: '14 Executive Lounges',
                desc: 'Acoustic quiet suites, rain showers & complimentary barista bars across Concourses A, B & C.',
                tag: 'Concourses A & C',
                color: '#0284C7',
                spotlight: 'rgba(2, 132, 199, 0.20)',
                accentClass: 'accent-blue',
              },
              {
                icon: <ShoppingBag size={20} color="#10B981" />,
                title: '38+ Luxury Flagships',
                desc: 'Tax-free international timepieces, haute couture, and artisanal travel gifts.',
                tag: 'Airside Retail Plaza',
                color: '#10B981',
                spotlight: 'rgba(16, 185, 129, 0.20)',
                accentClass: 'accent-green',
              },
              {
                icon: <Utensils size={20} color="#D97706" />,
                title: '24/7 Global Culinary',
                desc: 'Michelin-partnered brasseries, fresh boulangeries, and transcontinental menus.',
                tag: 'Central Rotunda',
                color: '#D97706',
                spotlight: 'rgba(217, 119, 6, 0.20)',
                accentClass: 'accent-orange',
              },
              {
                icon: <Wifi size={20} color="#6366F1" />,
                title: 'Ultra-Fast Wi-Fi 6E',
                desc: 'Dedicated gigabit connectivity and USB-C rapid charging at 100% of concourse seats.',
                tag: 'All 42 Departure Gates',
                color: '#6366F1',
                spotlight: 'rgba(99, 102, 241, 0.20)',
                accentClass: 'accent-purple',
              },
            ].map((item, idx) => (
              <SpotlightCard
                key={idx}
                spotlightColor={item.spotlight}
                className={`spotlight-card ${item.accentClass}`}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '24px 20px',
                  boxShadow: '0 4px 16px rgba(15, 41, 66, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.8 }}>
                  <Box sx={{ p: 1, borderRadius: '10px', background: 'rgba(15, 41, 66, 0.04)' }}>
                    {item.icon}
                  </Box>
                  <Box
                    sx={{
                      fontSize: '0.68rem',
                      fontFamily: "'Geist Mono', monospace",
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      px: 1.2,
                      py: 0.3,
                      borderRadius: '999px',
                      background: 'rgba(30, 58, 95, 0.05)',
                      color: item.color,
                    }}
                  >
                    {item.tag}
                  </Box>
                </Box>
                <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#0F2942', mb: 0.8 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.86rem', color: '#64748B', lineHeight: 1.55 }}>
                  {item.desc}
                </Typography>
              </SpotlightCard>
            ))}
          </Box>
        </Box>
      </Box>

      {/* 4. Footer */}
      <Footer />
    </Box>
  );
};

export default Home;
