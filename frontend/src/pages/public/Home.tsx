import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/home/Hero/Hero';
import Footer from '../../components/layout/Footer';
import { Box, Container, Typography } from '@mui/material';
import { CheckCircle2, Compass, Luggage, Coffee, ShoppingBag, Utensils, Wifi, Sparkles } from 'lucide-react';
import { AccordionGallery, SpotlightCard } from '../../components/reactbits';

const accordionItems = [
  {
    id: 'lounges',
    title: 'Executive VIP Suites',
    subtitle: 'TRANQUIL REPOSE & PRIVATE WORKING BAYS',
    description: 'Quiet sanctuary suites featuring high-speed Wi-Fi, private shower suites, and concierge boarding notifications.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop',
    link: '/passenger-services#lounges',
    badge: 'Concourse A & C',
  },
  {
    id: 'duty-free',
    title: 'Aerodrome Retail Pavilions',
    subtitle: 'CURATED LUXURY & TRAVEL ESSENTIALS',
    description: 'Tax-free pricing on international perfumes, fine watches, artisanal gifts, and travel exclusives before departure.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop',
    link: '/passenger-services#facilities',
    badge: 'Terminal 1 & 2',
  },
  {
    id: 'dining',
    title: 'Culinary Pavilions',
    subtitle: 'WORLD-CLASS BRASSERIES & ESPRESSO',
    description: 'Artisanal coffee roasters, fresh patisseries, and 24/7 dining spaces crafted for connecting travelers.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
    link: '/passenger-services#facilities',
    badge: 'Airside Concourse',
  },
];

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

        {/* 2. Public Passenger Pillars (Clean White Cards, Non-Glassy as requested) */}
        <Box sx={{ backgroundColor: '#FAF9F6', pt: { xs: 14, md: 16 }, pb: { xs: 4, md: 6 } }}>
          <Container maxWidth="xl">
            <Box sx={{ textAlign: 'center', maxWidth: '740px', mx: 'auto', mb: 8 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.6,
                  borderRadius: '999px',
                  background: 'rgba(30, 58, 95, 0.06)',
                  border: '1px solid rgba(30, 58, 95, 0.12)',
                  color: '#1E3A5F',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  mb: 2,
                }}
              >
                <CheckCircle2 size={14} color="#0284C7" />
                <span>PASSENGER EXCELLENCE AT SAPHIRE</span>
              </Box>

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
                Peace of Mind Across Every Terminal
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1.05rem',
                  lineHeight: 1.65,
                  color: '#64748B',
                }}
              >
                Engineered so arriving, departing, and connecting passengers experience effortless movement,
                clear status notifications, and world-class care at every gate.
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 4,
              }}
            >
              {/* Feature 1: Flight & Gate Guidance */}
              <SpotlightCard
                spotlightColor="rgba(2, 132, 199, 0.18)"
                className="spotlight-card home-pillar accent-blue"
              >
                <Box sx={{ p: 1.3, width: 'fit-content', borderRadius: '12px', background: 'rgba(2, 132, 199, 0.08)', mb: 2.5 }}>
                  <Compass size={24} color="#0284C7" />
                </Box>
                <Typography
                  sx={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    color: '#0284C7',
                    mb: 1.5,
                  }}
                >
                  LIVE RADAR &amp; WAYFINDING
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: '#0F2942',
                    mb: 1.5,
                  }}
                >
                  Real-Time Concourse Guidance
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.94rem',
                    lineHeight: 1.65,
                    color: '#64748B',
                    mb: 3.5,
                    flex: 1,
                  }}
                >
                  Live gate occupancy, exact departure countdowns, and turn-by-turn concourse signage
                  ensure you always know precisely when boarding commences without any terminal rush.
                </Typography>
                <Box sx={{ pt: 2, borderTop: '1px solid #F1F5F9' }}>
                  <Typography sx={{ color: '#059669', fontSize: '0.84rem', fontWeight: 600 }}>
                    ● 0.0s Sync latency to all departure screens
                  </Typography>
                </Box>
              </SpotlightCard>

              {/* Feature 2: Baggage Care */}
              <SpotlightCard
                spotlightColor="rgba(16, 185, 129, 0.18)"
                className="spotlight-card home-pillar accent-green"
              >
                <Box sx={{ p: 1.3, width: 'fit-content', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', mb: 2.5 }}>
                  <Luggage size={24} color="#10B981" />
                </Box>
                <Typography
                  sx={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    color: '#10B981',
                    mb: 1.5,
                  }}
                >
                  SMART BAGGAGE RECONCILIATION
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: '#0F2942',
                    mb: 1.5,
                  }}
                >
                  Fast Luggage to Carousel
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.94rem',
                    lineHeight: 1.65,
                    color: '#64748B',
                    mb: 3.5,
                    flex: 1,
                  }}
                >
                  Automated 5-point BRS barcode tracking synchronizes baggage offloading directly
                  to your designated reclaim carousel before you even step off border control.
                </Typography>
                <Box sx={{ pt: 2, borderTop: '1px solid #F1F5F9' }}>
                  <Typography sx={{ color: '#059669', fontSize: '0.84rem', fontWeight: 600 }}>
                    ● &lt; 12 min Average luggage carousel delivery
                  </Typography>
                </Box>
              </SpotlightCard>

              {/* Feature 3: Lounges & Care */}
              <SpotlightCard
                spotlightColor="rgba(217, 119, 6, 0.18)"
                className="spotlight-card home-pillar accent-orange"
              >
                <Box sx={{ p: 1.3, width: 'fit-content', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.08)', mb: 2.5 }}>
                  <Coffee size={24} color="#D97706" />
                </Box>
                <Typography
                  sx={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    color: '#D97706',
                    mb: 1.5,
                  }}
                >
                  HOSPITALITY &amp; LEISURE
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: '#0F2942',
                    mb: 1.5,
                  }}
                >
                  VIP Lounges &amp; Tax-Free Retail
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.94rem',
                    lineHeight: 1.65,
                    color: '#64748B',
                    mb: 3.5,
                    flex: 1,
                  }}
                >
                  Unwind in acoustically isolated executive suites, enjoy complimentary rain showers,
                  and explore curated international luxury boutiques across Concourse A &amp; C.
                </Typography>
                <Box sx={{ pt: 2, borderTop: '1px solid #F1F5F9' }}>
                  <Typography sx={{ color: '#059669', fontSize: '0.84rem', fontWeight: 600 }}>
                    ● 24/7 Concierge &amp; fast-track screening access
                  </Typography>
                </Box>
              </SpotlightCard>
            </Box>
          </Container>
        </Box>

        {/* 3. Terminal Hospitality Gallery (Warm Porcelain White Container with Proportional Spacing) */}
        <Box sx={{ backgroundColor: '#FAF9F6', pt: { xs: 4, md: 5 }, pb: { xs: 8, md: 10 }, px: { xs: 2, md: 4, lg: 8 }, maxWidth: '1440px', mx: 'auto' }}>
          {/* Section Heading with Rich Subtitle */}
          <Box sx={{ textAlign: 'center', maxWidth: '840px', mx: 'auto', mb: 5 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 0.6,
                borderRadius: '999px',
                background: 'rgba(30, 58, 95, 0.06)',
                border: '1px solid rgba(30, 58, 95, 0.12)',
                color: '#1E3A5F',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                mb: 2,
              }}
            >
              <Sparkles size={13} color="#0284C7" />
              <span>TERMINAL SANCTUARY &amp; PASSENGER CARE</span>
            </Box>
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
              Curated Terminal Environments
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '1.02rem',
                lineHeight: 1.65,
                color: '#64748B',
              }}
            >
              A harmonious aerodrome retreat combining restorative quiet suites, world-class duty-free retail boulevards,
              and artisanal dining. Designed to turn transit layovers into moments of calm luxury.
            </Typography>
          </Box>

          {/* Rich Info & Passenger Amenities Grid with Color-Based Hover */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 2.5,
              mb: 6,
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

          <AccordionGallery items={accordionItems} height="520px" expandRatio={2.8} />
        </Box>
      </Box>

      {/* 4. Footer */}
      <Footer />
    </Box>
  );
};

export default Home;
