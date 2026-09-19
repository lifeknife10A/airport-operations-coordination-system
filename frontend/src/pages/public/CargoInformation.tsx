import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Box, Container, Typography } from '@mui/material';
import { Package, Truck, FileText, Phone, ShieldCheck, Thermometer, CheckCircle2 } from 'lucide-react';

const cargoServices = [
  { icon: <Thermometer size={22} color="#0284C7" />, title: 'Cold-Chain & Pharma Logistics', desc: 'Temperature-controlled storage (-20°C to +25°C) compliant with WHO/GDP standards for life sciences and high-value perishables.' },
  { icon: <Package size={22} color="#0284C7" />, title: 'High-Value Vault Cargo', desc: 'Reinforced vault compartments monitored 24/7 by armed security escorts for bullion, currency, and luxury haute couture.' },
  { icon: <ShieldCheck size={22} color="#10B981" />, title: 'Dangerous Goods (DGR)', desc: 'Certified hazardous material logistics personnel trained in IATA DGR classification, containment, and dangerous goods transport.' },
  { icon: <Truck size={22} color="#0284C7" />, title: 'Express Freight & ULD Pallets', desc: 'Rapid turnaround ULD container palletization and automated maindeck freighter loading for dedicated Boeing 777F freighters.' },
];

const cargoProcessSteps = [
  { step: '01', title: 'Consignment Acceptance & Inspection', desc: 'Certified weight verification, dual-view X-ray security screening, and automated Master Air Waybill (MAWB) ingestion.' },
  { step: '02', title: 'Customs & Electronic e-AWB Clearance', desc: 'Paperless EDI customs declaration, digital tariff computation, and automated regulatory border agency authorization.' },
  { step: '03', title: 'High-Bay Automated Storage & Retrieval', desc: 'Robotic high-bay stacker cranes and climate-monitored pallet holding bays inside SAPHIRE Air Cargo Terminal.' },
  { step: '04', title: 'Apron Convoy Dispatch & Maindeck Loading', desc: 'Dedicated tug convoys dispatch pallets directly to widebody aircraft lower decks and freighter nose-loading gates.' },
];

export const CargoInformation: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FAF9F6', color: '#0F2942' }}>
      <Navbar />

      {/* Hero Banner: 1. Air Cargo Logistics Freighter Image, 2. Apple Liquid Glass, 3. Content */}
      <Box
        sx={{
          pt: { xs: 14, md: 17 },
          pb: { xs: 5, md: 7 },
          px: { xs: 2, md: 4 },
          position: 'relative',
          backgroundImage: `linear-gradient(180deg, rgba(15, 41, 66, 0.48) 0%, rgba(15, 41, 66, 0.72) 100%), url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl">
          <Box
            className="apple-liquid-glass"
            sx={{
              p: { xs: 4, md: 5.5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.4, py: 0.4, borderRadius: '100px', backgroundColor: 'rgba(30, 58, 95, 0.06)', border: '1px solid rgba(30, 58, 95, 0.12)', width: 'fit-content', mb: 2 }}>
              <Package size={12} color="#1E3A5F" />
              <Typography
                sx={{
                  fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  color: '#1E3A5F',
                  textTransform: 'uppercase',
                }}
              >
                GLOBAL FREIGHT &amp; LOGISTICS CORRIDOR
              </Typography>
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                color: '#0F2942',
                mt: 0.5,
                mb: 1.5,
                fontSize: { xs: '2rem', md: '2.75rem' },
                letterSpacing: '-0.025em',
              }}
            >
              Cargo Operations &amp; Freight Terminal
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#475569', maxWidth: '680px', lineHeight: 1.65, fontSize: '1rem' }}>
              Automated air freight logistics, high-capacity cold-chain pharmaceutical facilities, e-AWB paperless clearance, and freighter apron dispatch.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Section 1: Cargo Services Overview */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box id="services" sx={{ mb: 10 }}>
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', color: '#0284C7', letterSpacing: '0.14em', textTransform: 'uppercase', mb: 0.5, fontWeight: 600 }}>
              SPECIALIZED LOGISTICS
            </Typography>
            <Typography variant="h4" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', letterSpacing: '-0.02em' }}>
              Freight Handling Capabilities
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {cargoServices.map((srv, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 3.5,
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 20px rgba(15, 41, 66, 0.04)',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#0284C7',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(2, 132, 199, 0.08)',
                  },
                }}
              >
                <Box sx={{ p: 1.3, width: 'fit-content', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.08)', mb: 2.5 }}>
                  {srv.icon}
                </Box>
                <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', mb: 1, fontSize: '1.05rem' }}>
                  {srv.title}
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
                  {srv.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>

      {/* Section 2: 4-Step Cargo Handling Workflow (Authoritative Deep Navy Command) */}
      <Box id="process" sx={{ backgroundColor: '#0F2942', py: 10, borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 5 }}>
            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', color: '#38BDF8', letterSpacing: '0.14em', textTransform: 'uppercase', mb: 0.5, fontWeight: 600 }}>
              OPERATIONAL WORKFLOW
            </Typography>
            <Typography variant="h4" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              4-Step Air Freight Clearance Protocol
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {cargoProcessSteps.map((step, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 3.5,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#38BDF8',
                    background: 'rgba(255, 255, 255, 0.07)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Typography sx={{ fontFamily: "'Geist Mono', 'JetBrains Mono', monospace", fontSize: '2rem', fontWeight: 800, color: '#38BDF8', mb: 1.5 }}>
                  {step.step}
                </Typography>
                <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#FFFFFF', mb: 1, fontSize: '1.05rem' }}>
                  {step.title}
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
                  {step.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Section 3: Cargo Documentation & Contact Info */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box id="docs" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' }, gap: 4 }}>
          <Box sx={{ p: 4.5, background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(15, 41, 66, 0.04)', borderRadius: '16px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, borderRadius: '8px', background: 'rgba(30, 58, 95, 0.06)' }}>
                <FileText size={22} color="#1E3A5F" />
              </Box>
              <Typography variant="h5" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942' }}>
                Regulatory Compliance &amp; e-AWB Standards
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#475569', mb: 3, lineHeight: 1.65, fontSize: '0.95rem' }}>
              All international consignments transiting SAPHIRE Cargo Hub are processed under IATA multilateral e-AWB resolutions and direct customs EDI electronic filing.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#0F2942', fontSize: '0.9rem', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                <CheckCircle2 size={18} color="#10B981" /> 11-Digit Master Air Waybill (MAWB) &amp; Consolidator HAWB Ingestion
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#0F2942', fontSize: '0.9rem', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                <CheckCircle2 size={18} color="#10B981" /> Customs Automated Bill of Entry with Instant QR Clearance
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#0F2942', fontSize: '0.9rem', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                <CheckCircle2 size={18} color="#10B981" /> IATA Certified Dangerous Goods Declaration (DGD) Validation
              </Box>
            </Box>
          </Box>

          <Box id="contact" sx={{ p: 4.5, background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(15, 41, 66, 0.04)', borderRadius: '16px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, borderRadius: '8px', background: 'rgba(2, 132, 199, 0.08)' }}>
                <Phone size={22} color="#0284C7" />
              </Box>
              <Typography variant="h5" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942' }}>
                24/7 Freight Operations Desk
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#475569', mb: 3, lineHeight: 1.65, fontSize: '0.95rem' }}>
              Contact our air cargo duty controller for priority pallet reservations, charter apron slots, or consignment status telemetry.
            </Typography>
            <Box sx={{ p: 2.5, borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', mb: 1.5 }}>
              <Typography sx={{ fontFamily: "'Geist Mono', 'JetBrains Mono', monospace", fontSize: '0.9rem', color: '#0F2942', fontWeight: 700 }}>
                Toll-Free Dispatch: +91 (022) 8900-4400
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Geist Mono', 'JetBrains Mono', monospace", fontSize: '0.84rem', color: '#0284C7', fontWeight: 600 }}>
              EDI Desk: cargo-ops@saphire.in
            </Typography>
          </Box>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default CargoInformation;
