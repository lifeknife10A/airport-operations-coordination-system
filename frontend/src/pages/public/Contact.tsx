import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Box, Container, Typography, Paper, TextField, Button, Alert, MenuItem } from '@mui/material';
import { Phone, Mail, MapPin, ShieldAlert, Send, Clock, CheckCircle2, Building, Radio } from 'lucide-react';

const emergencyContacts = [
  { dept: 'Airport Security Command Center', number: '+91 (022) 8900-9111', sub: 'Airside & landside perimeter security' },
  { dept: '24/7 Medical & Trauma Unit', number: '+91 (022) 8900-9108', sub: 'Terminal 1 & Terminal 2 First Aid stations' },
  { dept: 'Airport Rescue & Fire Fighting (ARFF)', number: '+91 (022) 8900-9999', sub: 'Category 10 emergency crash rescue' },
  { dept: 'Passenger Concierge & Baggage Assistance', number: '+91 (022) 8900-1000', sub: 'Toll-free 24-hour bilingual hotline' },
];

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Enquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: 'General Enquiry', message: '' });
    }, 4000);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FAF9F6', color: '#0F2942' }}>
      <Navbar />

      {/* Hero Header: 1. Terminal Operations Concourse Image, 2. Apple Liquid Glass, 3. Content */}
      <Box
        sx={{
          pt: { xs: 14, md: 17 },
          pb: { xs: 5, md: 7 },
          px: { xs: 2, md: 4 },
          position: 'relative',
          backgroundImage: `linear-gradient(180deg, rgba(15, 41, 66, 0.48) 0%, rgba(15, 41, 66, 0.72) 100%), url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop')`,
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
              <Phone size={12} color="#1E3A5F" />
              <Typography sx={{ fontFamily: "'Geist Mono', 'JetBrains Mono', monospace", fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', color: '#1E3A5F', textTransform: 'uppercase' }}>
                Operations &amp; Passenger Assistance Desks
              </Typography>
            </Box>
            <Typography variant="h2" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, letterSpacing: '-0.025em', color: '#0F2942', mb: 2, fontSize: { xs: '2.2rem', md: '3.2rem' } }}>
              Contact &amp; Operations Desk
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#475569', maxWidth: '680px', fontSize: '1.05rem', lineHeight: 1.65 }}>
              Direct lines to terminal customer experience, emergency command, administrative headquarters, and cargo logistics coordinators.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 8 }}>
        {/* Section 1: Contact Details & Emergency Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4, mb: 8 }}>
          {/* Corporate Office Information */}
          <Paper
            elevation={0}
            sx={{
              p: 4.5,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(15, 41, 66, 0.04)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ p: 1, borderRadius: '8px', background: 'rgba(30, 58, 95, 0.06)' }}>
                <Building size={22} color="#1E3A5F" />
              </Box>
              <Typography variant="h5" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942' }}>
                SAPHIRE Aviation Headquarters
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <MapPin size={20} color="#0284C7" style={{ marginTop: '3px', flexShrink: 0 }} />
                <Box>
                  <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', fontSize: '0.95rem' }}>
                    Physical Address
                  </Typography>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#475569', mt: 0.5, lineHeight: 1.6 }}>
                    AOCS Operations Complex, Terminal 2 Ring Road, Vile Parle East, Mumbai, Maharashtra 400099
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Mail size={20} color="#0284C7" style={{ marginTop: '3px', flexShrink: 0 }} />
                <Box>
                  <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', fontSize: '0.95rem' }}>
                    Email Contacts
                  </Typography>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#475569', mt: 0.5, lineHeight: 1.6 }}>
                    General: info@saphire-airport.in • Passenger Care: care@saphire-airport.in • Flight Dispatch: ops@saphire-airport.in
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Clock size={20} color="#0284C7" style={{ marginTop: '3px', flexShrink: 0 }} />
                <Box>
                  <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', fontSize: '0.95rem' }}>
                    Working Hours
                  </Typography>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#475569', mt: 0.5, lineHeight: 1.6 }}>
                    Airside &amp; Passenger Helplines: 24/7/365 Continuous • Corporate Admin: Mon – Fri (09:00 – 18:00 IST)
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Emergency Lines (Authoritative Deep Navy Security Card) */}
          <Paper
            elevation={0}
            sx={{
              p: 4.5,
              backgroundColor: '#0F2942',
              color: '#F8FAFC',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              boxShadow: '0 8px 30px rgba(15, 41, 66, 0.12)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ p: 1, borderRadius: '8px', background: 'rgba(239, 68, 68, 0.2)' }}>
                <ShieldAlert size={22} color="#F87171" />
              </Box>
              <Typography variant="h5" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>
                Emergency &amp; Safety Helplines
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {emergencyContacts.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 1,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#FFFFFF', fontSize: '0.9rem' }}>
                      {item.dept}
                    </Typography>
                    <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#94A3B8' }}>
                      {item.sub}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontWeight: 700, color: '#38BDF8', fontSize: '0.92rem' }}>
                    {item.number}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Section 2: Contact Form */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' }, gap: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4.5,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(15, 41, 66, 0.04)',
            }}
          >
            <Typography variant="h5" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', mb: 1 }}>
              Submit an Operational Inquiry
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#475569', mb: 4, fontSize: '0.92rem' }}>
              For passenger experience queries, lost baggage assistance, or special flight requirements.
            </Typography>

            {submitted && (
              <Alert
                icon={<CheckCircle2 size={18} />}
                severity="success"
                sx={{
                  mb: 3,
                  borderRadius: '10px',
                  backgroundColor: '#ECFDF5',
                  color: '#047857',
                  border: '1px solid #A7F3D0',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Inquiry registered successfully. Reference ticket dispatched to your email.
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#0F2942',
                        backgroundColor: '#FAF9F6',
                        borderRadius: '10px',
                        '& fieldset': { borderColor: '#E2E8F0' },
                        '&:hover fieldset': { borderColor: '#1E3A5F' },
                        '&.Mui-focused fieldset': { borderColor: '#1E3A5F' },
                      },
                      '& .MuiInputLabel-root': { color: '#64748B', '&.Mui-focused': { color: '#1E3A5F' } },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#0F2942',
                        backgroundColor: '#FAF9F6',
                        borderRadius: '10px',
                        '& fieldset': { borderColor: '#E2E8F0' },
                        '&:hover fieldset': { borderColor: '#1E3A5F' },
                        '&.Mui-focused fieldset': { borderColor: '#1E3A5F' },
                      },
                      '& .MuiInputLabel-root': { color: '#64748B', '&.Mui-focused': { color: '#1E3A5F' } },
                    }}
                  />
                </Box>

                <TextField
                  fullWidth
                  select
                  label="Category of Inquiry"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#0F2942',
                      backgroundColor: '#FAF9F6',
                      borderRadius: '10px',
                      '& fieldset': { borderColor: '#E2E8F0' },
                      '&:hover fieldset': { borderColor: '#1E3A5F' },
                      '&.Mui-focused fieldset': { borderColor: '#1E3A5F' },
                    },
                    '& .MuiInputLabel-root': { color: '#64748B', '&.Mui-focused': { color: '#1E3A5F' } },
                  }}
                >
                  <MenuItem value="General Enquiry">General Passenger Assistance</MenuItem>
                  <MenuItem value="Flight Info">Flight Schedule &amp; Status Confirmation</MenuItem>
                  <MenuItem value="Lost & Found">Lost Property &amp; Baggage Tracing</MenuItem>
                  <MenuItem value="Cargo & Customs">Cargo &amp; Customs EDI Guidance</MenuItem>
                  <MenuItem value="VIP Services">VIP Protocol &amp; Executive Lounges</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Inquiry Details"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#0F2942',
                      backgroundColor: '#FAF9F6',
                      borderRadius: '10px',
                      '& fieldset': { borderColor: '#E2E8F0' },
                      '&:hover fieldset': { borderColor: '#1E3A5F' },
                      '&.Mui-focused fieldset': { borderColor: '#1E3A5F' },
                    },
                    '& .MuiInputLabel-root': { color: '#64748B', '&.Mui-focused': { color: '#1E3A5F' } },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<Send size={16} />}
                  sx={{
                    py: 1.5,
                    px: 3.5,
                    width: 'fit-content',
                    borderRadius: '10px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    backgroundColor: '#1E3A5F',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 14px rgba(30, 58, 95, 0.2)',
                    '&:hover': {
                      backgroundColor: '#162C46',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  Transmit Message
                </Button>
              </Box>
            </form>
          </Paper>

          {/* Quick Notice Card */}
          <Paper
            elevation={0}
            sx={{
              p: 4.5,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(15, 41, 66, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', mb: 2 }}>
                Critical Passenger Notices
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#475569', fontSize: '0.9rem', lineHeight: 1.65, mb: 3 }}>
                If you require urgent assistance regarding flights departing within 2 hours, please proceed directly to the nearest airport information kiosk or call our emergency hotline.
              </Typography>
              <Box sx={{ p: 2.5, borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', mb: 2 }}>
                <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.82rem', color: '#1E3A5F', fontWeight: 600 }}>
                  AOCC Control Room Desk
                </Typography>
                <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#0F2942', mt: 0.5 }}>
                  +91 (022) 8900-2200
                </Typography>
              </Box>
            </Box>

            <Box sx={{ pt: 3, borderTop: '1px solid #E2E8F0' }}>
              <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', color: '#64748B' }}>
                ICAO AERODROME CODE: VASP • IATA: SPH
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default Contact;
