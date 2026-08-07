import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Box, Container, Typography, Paper } from '@mui/material';
import { Package, Truck, FileText, Phone, ShieldCheck, Thermometer, CheckCircle2 } from 'lucide-react';

const cargoServices = [
  { icon: <Thermometer size={24} color="#34D399" />, title: 'Cold-Chain & Pharma Logistics', desc: 'Temperature-controlled storage (-20°C to +25°C) compliant with GDP standards for life sciences and perishable goods.' },
  { icon: <Package size={24} color="#34D399" />, title: 'High-Value Vault Cargo', desc: 'Reinforced vault storage monitored 24/7 by armored security escorts for gold, currency, and luxury items.' },
  { icon: <ShieldCheck size={24} color="#34D399" />, title: 'Dangerous Goods (DGR)', desc: 'Certified hazardous material handling personnel trained in IATA DGR classification and safe containment.' },
  { icon: <Truck size={24} color="#34D399" />, title: 'Express Freight & ULD Handling', desc: 'Rapid turnaround ULD container palletization and automated maindeck cargo freighter loading.' },
];

const cargoProcessSteps = [
  { step: '01', title: 'Cargo Acceptance & Inspection', desc: 'Weight verification, physical security screening (dual-view X-ray), and Air Waybill (AWB) logging at gate.' },
  { step: '02', title: 'Customs & e-AWB Clearance', desc: 'Electronic customs manifest declaration, duty assessment, and automated regulatory clearance approval.' },
  { step: '03', title: 'High-Bay Automated Warehousing', desc: 'Robotic retrieval and temperature-monitored pallet storage inside SAPHIRE Smart Cargo Terminal.' },
  { step: '04', title: 'Ramp Dispatch & Aircraft Loading', desc: 'High-speed tractor convoy dispatch directly to widebody aircraft belly holds or dedicated freighters.' },
];

export const CargoInformation: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0B1020', color: '#F4F4F4' }}>
      <Navbar />

      {/* Hero Banner */}
      <Box sx={{ pt: 14, pb: 6, background: 'linear-gradient(180deg, #1E1B4B 0%, #0B1020 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth="xl">
          <Typography component="span" sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.15em', color: '#34D399', textTransform: 'uppercase' }}>
            GLOBAL FREIGHT & LOGISTICS HUB
          </Typography>
          <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mt: 1, mb: 1 }}>
            Cargo & Freight Information
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', maxWidth: '650px' }}>
            State-of-the-art air cargo terminal operations, pharmaceutical cold-chain handling, and e-AWB customs workflow.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Section 1: Cargo Services Overview */}
        <Box id="services" sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 3 }}>
            Cargo Handling Capabilities
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {cargoServices.map((srv, idx) => (
              <Paper key={idx} elevation={0} sx={{ p: 3, background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '16px', height: '100%' }}>
                <Box sx={{ p: 1.2, width: 'fit-content', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', mb: 2 }}>
                  {srv.icon}
                </Box>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF', mb: 1, fontSize: '1.1rem' }}>
                  {srv.title}
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.55 }}>
                  {srv.desc}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Section 2: 4-Step Cargo Handling Workflow */}
        <Box id="process" sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 3 }}>
            4-Step Cargo Handling Workflow
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {cargoProcessSteps.map((step, idx) => (
              <Paper key={idx} elevation={0} sx={{ p: 3, background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '16px', height: '100%', position: 'relative' }}>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 900, color: 'rgba(56, 189, 248, 0.3)', mb: 1 }}>
                  {step.step}
                </Typography>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF', mb: 1, fontSize: '1.05rem' }}>
                  {step.title}
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.5 }}>
                  {step.desc}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Section 3: Cargo Documentation & Contact Info */}
        <Box id="docs" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' }, gap: 4 }}>
          <Paper elevation={0} sx={{ p: 4, background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <FileText size={24} color="#38BDF8" />
              <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
                Cargo Documentation & Compliance
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', mb: 3, lineHeight: 1.6 }}>
              All freight shipments passing through SAPHIRE Cargo Terminal must strictly comply with IATA e-AWB standard formats and Indian Customs EDI declarations.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#CBD5E1', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} color="#34D399" /> 11-Digit Master Air Waybill (MAWB) & House Air Waybill (HAWB)
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#CBD5E1', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} color="#34D399" /> Customs Shipping Bill / Bill of Entry with QR Code
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#CBD5E1', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} color="#34D399" /> Shipper's Declaration for Dangerous Goods (SDDG)
              </Box>
            </Box>
          </Paper>

          <Paper id="contact" elevation={0} sx={{ p: 4, background: 'rgba(6, 78, 59, 0.25)', border: '1px solid rgba(52, 211, 153, 0.4)', borderRadius: '16px', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Phone size={24} color="#34D399" />
              <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
                Cargo Enquiries Hotline
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', mb: 3 }}>
              Get in touch directly with our 24/7 Cargo Operational Command Desk for slot booking or shipment queries.
            </Typography>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#34D399', fontSize: '1.1rem', mb: 1 }}>
              Direct Hotline: +91 (022) 8900-5500
            </Typography>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, color: '#F8FAFC', mb: 1 }}>
              Customs Helpdesk: +91 (022) 8900-5511
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', fontSize: '0.9rem' }}>
              Email: cargo-ops@saphire-airport.com
            </Typography>
          </Paper>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default CargoInformation;
