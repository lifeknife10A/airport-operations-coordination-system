import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/home/Hero/Hero';
import Footer from '../../components/layout/Footer';
import { Box, Container, Typography } from '@mui/material';
import { Coffee, ShoppingBag, Utensils, Wifi } from 'lucide-react';
import { SpotlightCard } from '../../components/reactbits';
import ConcourseTelemetryBento from '../../components/home/ConcourseTelemetryBento';
import ArchitecturalSanctuaries from '../../components/home/ArchitecturalSanctuaries';

export const Home: React.FC = () => {
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

        {/* 2. High-Tech Concourse Telemetry Bento Grid */}
        <Box sx={{ backgroundColor: '#FAF9F6', pt: { xs: 6, md: 8 }, pb: { xs: 5, md: 6 } }}>
          <Container maxWidth="xl">
            <Box sx={{ textAlign: 'center', maxWidth: '780px', mx: 'auto', mb: 5 }}>
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
                LIVE PRECINCT INTELLIGENCE • AOCC SYNCHRONIZED
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  color: '#0F2942',
                  fontSize: { xs: '2rem', md: '2.85rem' },
                  letterSpacing: '-0.03em',
                  mb: 2,
                }}
              >
                Concourse Telemetry &amp; Acoustic Serenity
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1.05rem',
                  lineHeight: 1.65,
                  color: '#64748B',
                }}
              >
                Explore live aerodrome runway conditions, interactive acoustic suite noise dampening,
                and real-time 5-point RFID baggage reconciliation across our concourses.
              </Typography>
            </Box>

            <ConcourseTelemetryBento />
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
                desc: 'Acoustic quiet suites, rain showers & complimentary barista bars across T1 & T2.',
                tag: 'Concourse A & C',
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
