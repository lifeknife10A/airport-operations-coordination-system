import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Box, Container, Typography, Paper, TextField, Button, Alert, MenuItem } from '@mui/material';
import { Phone, Mail, MapPin, ShieldAlert, Send, Clock, CheckCircle2, Building } from 'lucide-react';

const emergencyContacts = [
  { dept: 'Airport Security Command Center', number: '+91 (022) 8900-9111', icon: <ShieldAlert size={20} color="#F87171" /> },
  { dept: '24/7 Medical & Ambulance Desk', number: '+91 (022) 8900-9108', icon: <Phone size={20} color="#F87171" /> },
  { dept: 'Fire & Crash Rescue Services', number: '+91 (022) 8900-9999', icon: <Phone size={20} color="#F87171" /> },
  { dept: 'Passenger Customer Care Hotline', number: '+91 (022) 8900-1000', icon: <Phone size={20} color="#38BDF8" /> },
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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0B1020', color: '#F4F4F4' }}>
      <Navbar />

      {/* Hero Banner */}
      <Box sx={{ pt: 14, pb: 6, background: 'linear-gradient(180deg, #1E1B4B 0%, #0B1020 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth="xl">
          <Typography component="span" sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.15em', color: '#38BDF8', textTransform: 'uppercase' }}>
            CONNECT WITH AIRPORT OPERATIONS
          </Typography>
          <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mt: 1, mb: 1 }}>
            Contact & Passenger Feedback
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', maxWidth: '650px' }}>
            Get in touch with airport administrative offices, emergency helplines, terminal desks, or send feedback to our team.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Section 1: Contact Info & Emergency Grid */}
        <Box id="info" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 8 }}>
          {/* Office Details */}
          <Paper elevation={0} sx={{ p: 4, background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '16px', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Building size={24} color="#38BDF8" />
              <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
                SAPHIRE Corporate Office
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <MapPin size={20} color="#38BDF8" style={{ marginTop: '4px' }} />
                <Box>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>Headquarters Address</Typography>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#94A3B8' }}>
                    SAPHIRE International Airport Complex, Terminal 2 Road, Vile Parle East, Mumbai, Maharashtra 400099
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Mail size={20} color="#38BDF8" style={{ marginTop: '4px' }} />
                <Box>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>Email Desks</Typography>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#94A3B8' }}>
                    General: info@saphire-airport.com | Support: care@saphire-airport.com
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Clock size={20} color="#38BDF8" style={{ marginTop: '4px' }} />
                <Box>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>Operating Hours</Typography>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#94A3B8' }}>
                    Terminal & Airside Desks: 24 Hours / 7 Days | Admin Office: Mon - Fri (09:00 - 18:00 IST)
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Emergency Contacts */}
          <Paper id="emergency" elevation={0} sx={{ p: 4, background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(248, 113, 113, 0.3)', borderRadius: '16px', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <ShieldAlert size={24} color="#F87171" />
              <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
                24/7 Emergency & Helplines
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {emergencyContacts.map((item, idx) => (
                <Box key={idx} sx={{ p: 2, background: 'rgba(2, 6, 23, 0.7)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {item.icon}
                    <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, color: '#FFFFFF', fontSize: '0.92rem' }}>
                      {item.dept}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#F87171', fontSize: '0.95rem' }}>
                    {item.number}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Section 2: Contact / Feedback Form */}
        <Box id="form" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' }, gap: 4 }}>
          <Paper elevation={0} sx={{ p: 4, background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '16px' }}>
            <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 1 }}>
              Send Feedback or Inquiry
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', mb: 3 }}>
              Have a question or comment about your airport experience? Fill out the form below.
            </Typography>

            {submitted && (
              <Alert icon={<CheckCircle2 size={20} />} severity="success" sx={{ mb: 3, borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
                Thank you! Your feedback has been received by our Passenger Experience Team.
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
                    sx={{ '& .MuiOutlinedInput-root': { color: '#FFF', background: 'rgba(2, 6, 23, 0.8)', borderRadius: '10px' }, '& .MuiInputLabel-root': { color: '#94A3B8' } }}
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { color: '#FFF', background: 'rgba(2, 6, 23, 0.8)', borderRadius: '10px' }, '& .MuiInputLabel-root': { color: '#94A3B8' } }}
                  />
                </Box>
                <TextField
                  fullWidth
                  select
                  label="Inquiry Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { color: '#FFF', background: 'rgba(2, 6, 23, 0.8)', borderRadius: '10px' }, '& .MuiInputLabel-root': { color: '#94A3B8' } }}
                >
                  <MenuItem value="General Enquiry">General Inquiry</MenuItem>
                  <MenuItem value="Flight Info">Flight Information</MenuItem>
                  <MenuItem value="Lost & Found">Lost & Found Item</MenuItem>
                  <MenuItem value="Feedback">Passenger Feedback</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Message / Comments"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { color: '#FFF', background: 'rgba(2, 6, 23, 0.8)', borderRadius: '10px' }, '& .MuiInputLabel-root': { color: '#94A3B8' } }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Send size={16} />}
                  sx={{ px: 4, py: 1.2, width: 'fit-content', background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)', fontFamily: "'Outfit', sans-serif", fontWeight: 600, borderRadius: '8px' }}
                >
                  Submit Message
                </Button>
              </Box>
            </form>
          </Paper>

          {/* Embedded Map Placeholder */}
          <Paper elevation={0} sx={{ p: 4, height: '100%', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <MapPin size={48} color="#38BDF8" style={{ marginBottom: '16px' }} />
            <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 1 }}>
              Airport Geolocation View
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#94A3B8', fontSize: '0.9rem' }}>
              SAPHIRE International Airport, Mumbai (SPH / VASP) • Terminal 1 & Terminal 2 Access Expressway.
            </Typography>
          </Paper>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default Contact;
