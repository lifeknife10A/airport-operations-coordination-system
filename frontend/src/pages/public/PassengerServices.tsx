import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Box, Container, Typography, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Wifi, Luggage, DollarSign, Info, ShieldCheck, Hotel, Coffee, HeartPulse, Accessibility, Search, ChevronDown, Sparkles } from 'lucide-react';
import { SpotlightCard } from '../../components/reactbits';

const facilitiesList = [
  { icon: <Wifi size={22} color="#38BDF8" />, title: 'High-Speed 5G Wi-Fi', desc: 'Unlimited complimentary high-speed internet throughout both Terminal 1 and Terminal 2 concourses.' },
  { icon: <Luggage size={22} color="#38BDF8" />, title: 'Baggage Storage & Wrapping', desc: 'Secure short-term luggage storage lockers and protective wrapping services available pre-security.' },
  { icon: <DollarSign size={22} color="#38BDF8" />, title: 'Currency Exchange & ATMs', desc: '24/7 multi-currency exchange booths and international banking ATMs in departure and arrival halls.' },
  { icon: <Info size={22} color="#38BDF8" />, title: '24/7 Information Desks', desc: 'Multilingual airport customer service staff available at central information kiosks in every terminal zone.' },
];

const servicesList = [
  { icon: <ShieldCheck size={22} color="#34D399" />, title: 'Fast-Track Security Pass', desc: 'Skip standard security lines with priority clearance passes available for purchase or business class passengers.' },
  { icon: <Hotel size={22} color="#34D399" />, title: 'Transit Hotel & Nap Pods', desc: 'Soundproof luxury sleep pods and transit hotel rooms located directly inside the international airside zone.' },
];

const loungesList = [
  { icon: <Sparkles size={22} color="#E087FF" />, title: 'VIP Executive Lounge', desc: 'Premium private seating, private showers, gourmet buffet, and dedicated bar service for business class travelers.' },
  { icon: <Coffee size={22} color="#E087FF" />, title: 'Family & Quiet Lounge', desc: 'Dedicated quiet zones for relaxation, nursing rooms, and children play areas in both terminals.' },
];

const medicalAccessibilityList = [
  { icon: <HeartPulse size={22} color="#F87171" />, title: '24/7 Medical First Aid Kiosks', desc: 'On-site paramedics, emergency first aid centers, and pharmacies stocked with travel essentials.' },
  { icon: <Accessibility size={22} color="#FBBF24" />, title: 'Special Assistance & Mobility', desc: 'Dedicated wheelchair escort, tactile paving, accessible restrooms, and hearing loop technology.' },
];

const faqList = [
  { q: 'How early should I arrive before my flight?', a: 'We recommend arriving 2 hours prior for domestic flights and 3 hours prior for international departures.' },
  { q: 'Where is the Lost & Found desk located?', a: 'The main Lost & Found office is situated in Terminal 2, Arrival Level 1, near Baggage Belt 6.' },
  { q: 'Is free Wi-Fi available throughout the airport?', a: 'Yes! Connect to "SAPHIRE_FREE_WIFI" and complete a quick one-step SMS activation.' },
  { q: 'Are wheelchairs available upon arrival?', a: 'Yes, special assistance wheelchairs can be pre-requested via your airline or requested directly at any info desk.' },
];

export const PassengerServices: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0B1020', color: '#F4F4F4' }}>
      <Navbar />

      {/* Hero Banner */}
      <Box sx={{ pt: 14, pb: 6, background: 'linear-gradient(180deg, #1E1B4B 0%, #0B1020 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth="xl">
          <Typography component="span" sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.15em', color: '#38BDF8', textTransform: 'uppercase' }}>
            WORLD-CLASS TRAVEL EXPERIENCE
          </Typography>
          <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mt: 1, mb: 1 }}>
            Passenger Services & Amenities
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', maxWidth: '650px' }}>
            Explore terminal facilities, luxury lounges, dining options, accessibility support, and passenger care desks.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Section 1: Passenger Facilities */}
        <Box id="facilities" sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 3 }}>
            Passenger Facilities & Convenience
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {facilitiesList.map((fac, idx) => (
              <SpotlightCard key={idx} spotlightColor="rgba(56, 189, 248, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '16px', height: '100%' }}>
                <Box sx={{ p: 1.2, width: 'fit-content', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', mb: 2 }}>
                  {fac.icon}
                </Box>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF', mb: 1, fontSize: '1.1rem' }}>
                  {fac.title}
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.55 }}>
                  {fac.desc}
                </Typography>
              </SpotlightCard>
            ))}
          </Box>
        </Box>

        {/* Section 2: Lounges & Dining */}
        <Box id="lounges" sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 3 }}>
            VIP Lounges & Transit Comfort
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {loungesList.concat(servicesList).map((item, idx) => (
              <SpotlightCard key={idx} spotlightColor="rgba(224, 135, 255, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(224, 135, 255, 0.2)', borderRadius: '16px', height: '100%' }}>
                <Box sx={{ p: 1.2, width: 'fit-content', borderRadius: '10px', background: 'rgba(224, 135, 255, 0.12)', mb: 2 }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF', mb: 1, fontSize: '1.1rem' }}>
                  {item.title}
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.55 }}>
                  {item.desc}
                </Typography>
              </SpotlightCard>
            ))}
          </Box>
        </Box>

        {/* Section 3: Medical & Accessibility */}
        <Box id="medical" sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 3 }}>
            Medical Care & Special Accessibility
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {medicalAccessibilityList.map((item, idx) => (
              <SpotlightCard key={idx} spotlightColor="rgba(248, 113, 113, 0.2)" style={{ padding: '28px', background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(248, 113, 113, 0.25)', borderRadius: '16px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <Box sx={{ p: 1.5, borderRadius: '12px', background: 'rgba(248, 113, 113, 0.15)' }}>
                  {item.icon}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF', mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </SpotlightCard>
            ))}
          </Box>
        </Box>

        {/* Section 4: Lost & Found */}
        <Box id="lost-found" sx={{ mb: 8 }}>
          <Paper elevation={0} sx={{ p: 4, background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Search size={26} color="#38BDF8" />
              <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
                Lost & Found Central Desk
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', mb: 2 }}>
              Left an item in the terminal or on board? Visit our central baggage counter at Terminal 2, Level 1 (Arrivals) or submit an online tracking inquiry.
            </Typography>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#38BDF8' }}>
              Direct Hotline: +91 (022) 8900-3344 | Email: lostandfound@saphire-airport.com
            </Typography>
          </Paper>
        </Box>

        {/* Section 5: FAQ Accordion */}
        <Box id="faq">
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 3 }}>
            Frequently Asked Questions
          </Typography>
          {faqList.map((faq, idx) => (
            <Accordion key={idx} elevation={0} sx={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px !important', mb: 2, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ChevronDown color="#38BDF8" />}>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF', fontSize: '1.05rem' }}>
                  {faq.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', fontSize: '0.92rem' }}>
                  {faq.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default PassengerServices;
