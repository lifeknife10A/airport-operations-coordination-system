import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Wifi,
  Luggage,
  DollarSign,
  Info,
  ShieldCheck,
  Hotel,
  Coffee,
  HeartPulse,
  Accessibility,
  Search,
  Plus,
  Minus,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  FileCheck2,
  PackageSearch,
} from 'lucide-react';
import { aocsDataStore } from '../../services/aocsDataStore';
import { LostFoundRecord } from '../../types';

const facilitiesList = [
  { icon: <Wifi size={20} color="#0284C7" />, title: 'High-Speed 5G Wi-Fi', desc: 'Unlimited complimentary high-speed internet throughout both Terminal 1 and Terminal 2 concourses.' },
  { icon: <Luggage size={20} color="#0284C7" />, title: 'Baggage Storage & Porterage', desc: 'Secure short-term luggage storage lockers and white-glove porter services available pre-security.' },
  { icon: <DollarSign size={20} color="#0284C7" />, title: 'Currency Exchange & Banking', desc: '24/7 multi-currency exchange booths and international premier banking ATMs in arrival halls.' },
  { icon: <Info size={20} color="#0284C7" />, title: '24/7 Concierge Desks', desc: 'Multilingual airport guest experience staff stationed across central rotunda information kiosks.' },
];

const loungesList = [
  { icon: <Sparkles size={20} color="#D97706" />, title: 'VIP Executive Sanctuary', desc: 'Private suite seating, rain showers, curated sommelier bar, and private boarding transit for premium class travelers.' },
  { icon: <Coffee size={20} color="#0284C7" />, title: 'Quiet Lounge & Family Suites', desc: 'Acoustically isolated quiet suites for deep relaxation, nursing rooms, and children play spaces.' },
  { icon: <ShieldCheck size={20} color="#10B981" />, title: 'FastTrack Security Access', desc: 'Dedicated priority screening lanes for diplomatic, first-class, and business travelers.' },
  { icon: <Hotel size={20} color="#0284C7" />, title: 'Transit Hotel & Sleep Pods', desc: 'Soundproof luxury sleep capsules and micro-hotel suites situated directly inside the international airside concourse.' },
];

const medicalAccessibilityList = [
  { icon: <HeartPulse size={22} color="#EF4444" />, title: '24/7 Emergency Medical Center', desc: 'Certified emergency medical staff, on-site trauma stabilization center, and travel pharmacy.' },
  { icon: <Accessibility size={22} color="#0284C7" />, title: 'Assisted Mobility & Escorts', desc: 'Dedicated wheelchair assistance, tactile paving, accessible restrooms, and hearing loop induction.' },
];

const faqList = [
  { q: 'How early should I arrive before my scheduled departure?', a: 'We recommend arriving 2 hours prior to scheduled departure for domestic flights and 3 hours prior for international widebody services.' },
  { q: 'Where is the Lost & Found central bureau located?', a: 'The primary Lost & Found office is situated on Terminal 2, Level 1 (Arrivals Concourse), adjacent to Baggage Reclaim Belt 6.' },
  { q: 'How can I connect to the airport complimentary network?', a: 'Select "SAPHIRE_AIRPORT_5G" on your device. Acceptance of standard terms grants uninterrupted high-speed connectivity.' },
  { q: 'Can mobility assistance be requested upon arrival?', a: 'Yes, wheelchair and mobility escorts can be booked through your carrier or requested directly at any terminal information desk.' },
];

export const PassengerServices: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [lostFoundList, setLostFoundList] = useState<LostFoundRecord[]>([]);
  const [trackingQuery, setTrackingQuery] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<LostFoundRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'ELECTRONICS' as LostFoundRecord['category'],
    color: '',
    locationFound: '',
    flightNumber: '',
    linkedPnr: '',
    description: '',
    reportedBy: '',
    contactNumber: '',
  });

  useEffect(() => {
    setLostFoundList(aocsDataStore.getLostFound());

    const unsubscribe = aocsDataStore.subscribe((event) => {
      if (event.type.includes('LOST') || event.type === 'REFRESH') {
        setLostFoundList(aocsDataStore.getLostFound());
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.reportedBy || !formData.contactNumber) {
      alert('Please provide the Item Name, your Full Name, and Contact Number.');
      return;
    }

    const created = aocsDataStore.reportLostItem({
      title: formData.title.trim(),
      category: formData.category,
      color: formData.color.trim() || 'Unspecified',
      locationFound: formData.locationFound.trim() || 'Terminal 2 Concourse',
      flightNumber: formData.flightNumber.trim() ? formData.flightNumber.trim().toUpperCase() : undefined,
      linkedPnr: formData.linkedPnr.trim() ? formData.linkedPnr.trim().toUpperCase() : undefined,
      description: formData.description.trim() || 'No additional description provided.',
      reportedBy: `${formData.reportedBy.trim()} (Public Portal)`,
      contactNumber: formData.contactNumber.trim(),
    });

    setSubmittedRecord(created);
    setLostFoundList(aocsDataStore.getLostFound());
    // Reset form
    setFormData({
      title: '',
      category: 'ELECTRONICS',
      color: '',
      locationFound: '',
      flightNumber: '',
      linkedPnr: '',
      description: '',
      reportedBy: '',
      contactNumber: '',
    });
  };

  const getStatusBadge = (status: LostFoundRecord['status']) => {
    switch (status) {
      case 'NEW_REPORT':
        return <Chip label="Report Logged • Security Intake" size="small" sx={{ background: '#FEF3C7', color: '#92400E', fontWeight: 700, fontSize: '0.72rem' }} />;
      case 'SEARCHING':
        return <Chip label="Active Concourse Sweep" size="small" sx={{ background: '#EFF6FF', color: '#1E40AF', fontWeight: 700, fontSize: '0.72rem' }} />;
      case 'MATCHED':
        return <Chip label="Item Located & Vaulted" size="small" sx={{ background: '#EDE9FE', color: '#6B21A8', fontWeight: 700, fontSize: '0.72rem' }} />;
      case 'READY_FOR_COLLECTION':
        return <Chip label="Ready for Collection at Desk" size="small" sx={{ background: '#ECFDF5', color: '#065F46', fontWeight: 700, fontSize: '0.72rem' }} />;
      case 'RETURNED':
        return <Chip label="Restored to Passenger" size="small" sx={{ background: '#F1F5F9', color: '#475569', fontWeight: 700, fontSize: '0.72rem' }} />;
    }
  };

  const filteredLostItems = lostFoundList.filter((item) => {
    if (!trackingQuery.trim()) return true;
    const q = trackingQuery.toLowerCase();
    return (
      item.id.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.locationFound.toLowerCase().includes(q) ||
      (item.flightNumber && item.flightNumber.toLowerCase().includes(q)) ||
      (item.linkedPnr && item.linkedPnr.toLowerCase().includes(q))
    );
  });

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FAF9F6', color: '#0F2942' }}>
      <Navbar />

      {/* Hero Banner: 1. Luxury Airport Lounge Image, 2. Apple Liquid Glass, 3. Content */}
      <Box
        sx={{
          pt: { xs: 14, md: 17 },
          pb: { xs: 5, md: 7 },
          px: { xs: 2, md: 4 },
          position: 'relative',
          backgroundImage: `linear-gradient(180deg, rgba(15, 41, 66, 0.42) 0%, rgba(15, 41, 66, 0.65) 100%), url('/images/vip-dining-lounge.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 45%',
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
              <Sparkles size={12} color="#1E3A5F" />
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
                AERODROME CONCIERGE &amp; HOSPITALITY
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
              Passenger Services &amp; Amenities
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#475569', maxWidth: '680px', lineHeight: 1.65, fontSize: '1rem' }}>
              Curated guest services, executive lounge sanctums, private transit suites, accessibility assistance, and round-the-clock passenger care.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Section 1: Passenger Facilities */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box id="facilities" sx={{ mb: 10 }}>
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', color: '#0284C7', letterSpacing: '0.14em', textTransform: 'uppercase', mb: 0.5, fontWeight: 600 }}>
              ESSENTIAL SERVICES
            </Typography>
            <Typography variant="h4" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', letterSpacing: '-0.02em' }}>
              Terminal Facilities &amp; Convenience
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {facilitiesList.map((fac, idx) => (
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
                  {fac.icon}
                </Box>
                <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', mb: 1, fontSize: '1.05rem' }}>
                  {fac.title}
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
                  {fac.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>

      {/* Section 2: Lounges & Dining (Authoritative Deep Navy Sanctuary) */}
      <Box id="lounges" sx={{ backgroundColor: '#0F2942', py: 10, borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 5 }}>
            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', color: '#38BDF8', letterSpacing: '0.14em', textTransform: 'uppercase', mb: 0.5, fontWeight: 600 }}>
              EXECUTIVE SANCTUARIES
            </Typography>
            <Typography variant="h4" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              VIP Lounges &amp; Transit Comfort
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {loungesList.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 3.5,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'rgba(56, 189, 248, 0.4)',
                    background: 'rgba(255, 255, 255, 0.07)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box sx={{ p: 1.3, width: 'fit-content', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.08)', mb: 2.5 }}>
                  {item.icon}
                </Box>
                <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#FFFFFF', mb: 1, fontSize: '1.05rem' }}>
                  {item.title}
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
                  {item.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Section 3: Medical & Accessibility */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box id="medical" sx={{ mb: 8 }}>
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', color: '#10B981', letterSpacing: '0.14em', textTransform: 'uppercase', mb: 0.5, fontWeight: 600 }}>
              HEALTH &amp; INCLUSION
            </Typography>
            <Typography variant="h4" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', letterSpacing: '-0.02em' }}>
              Medical Care &amp; Universal Accessibility
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {medicalAccessibilityList.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 4,
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 20px rgba(15, 41, 66, 0.04)',
                  borderRadius: '16px',
                  display: 'flex',
                  gap: 3,
                  alignItems: 'flex-start',
                  transition: 'all 0.2s ease',
                  '&:hover': { borderColor: '#10B981', boxShadow: '0 8px 25px rgba(16, 185, 129, 0.08)' },
                }}
              >
                <Box sx={{ p: 1.4, borderRadius: '10px', background: '#ECFDF5', flexShrink: 0 }}>
                  {item.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', mb: 1, fontSize: '1.15rem' }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#475569', lineHeight: 1.65 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Section 4: Lost & Found Central Bureau (Interactive Public ↔ Security Operations Bridge) */}
        <Box id="lost-found" sx={{ mb: 8 }}>
          <Box sx={{ p: { xs: 3, md: 4.5 }, background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(15, 41, 66, 0.04)', borderRadius: '16px' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.2, borderRadius: '10px', background: 'rgba(30, 58, 95, 0.06)' }}>
                  <PackageSearch size={24} color="#1E3A5F" />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942' }}>
                    Lost &amp; Found Central Bureau
                  </Typography>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#64748B', fontSize: '0.85rem' }}>
                    Direct 24/7 synchronization with Airport Terminal Security Dispatch and Baggage Storage Vault
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                onClick={() => setReportModalOpen(true)}
                startIcon={<Plus size={16} />}
                sx={{
                  background: '#0284C7',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  borderRadius: '10px',
                  px: 2.5,
                  py: 1.1,
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
                  '&:hover': { background: '#0369A1' },
                }}
              >
                File Misplaced Property Report
              </Button>
            </Box>

            <Typography sx={{ fontFamily: "'Inter', sans-serif", color: '#475569', mb: 3, lineHeight: 1.65, fontSize: '0.94rem' }}>
              Misplaced personal belongings in concourses or on inbound aircraft can be logged directly into our central system. All reports instantly queue to active Airside Security patrol agents and Terminal 2 Level 1 storage vaults.
            </Typography>

            {/* Submission Confirmation Alert */}
            {submittedRecord && (
              <Alert
                severity="success"
                icon={<CheckCircle2 size={20} />}
                onClose={() => setSubmittedRecord(null)}
                sx={{ mb: 3, borderRadius: '10px', border: '1px solid #A7F3D0', backgroundColor: '#ECFDF5', color: '#065F46' }}
              >
                <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.92rem', mb: 0.3 }}>
                  Report Successfully Registered: Reference #{submittedRecord.id}
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.84rem' }}>
                  Your case has been transmitted to the Terminal Security Dispatch Bureau. You may track this claim below using your reference ID.
                </Typography>
              </Alert>
            )}

            {/* Live Search & Claim Telemetry Tracker */}
            <Box sx={{ p: 3, background: '#FAF9F6', borderRadius: '12px', border: '1px solid #E2E8F0', mb: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center', mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Track your claim: Enter Reference ID (e.g. LF-2024-089), Item Name, or Flight No..."
                  value={trackingQuery}
                  onChange={(e) => setTrackingQuery(e.target.value)}
                  size="small"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search size={16} color="#64748B" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    '& fieldset': { borderColor: '#CBD5E1' },
                    '&:hover fieldset': { borderColor: '#94A3B8' },
                    '&.Mui-focused fieldset': { borderColor: '#0284C7' },
                  }}
                />
                {trackingQuery && (
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => setTrackingQuery('')}
                    sx={{ color: '#64748B', textTransform: 'none', whiteSpace: 'nowrap' }}
                  >
                    Clear Filter
                  </Button>
                )}
              </Box>

              {/* Claims Stream Grid */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: '340px', overflowY: 'auto', pr: 1 }}>
                {filteredLostItems.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center', color: '#64748B' }}>
                    <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem' }}>
                      No matching registered property records found.
                    </Typography>
                  </Box>
                ) : (
                  filteredLostItems.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        p: 2.2,
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 1.5,
                        transition: 'border-color 0.2s',
                        '&:hover': { borderColor: '#0284C7' },
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
                          <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontWeight: 700, fontSize: '0.84rem', color: '#1E3A5F' }}>
                            {item.id}
                          </Typography>
                          {getStatusBadge(item.status)}
                          <Chip label={item.category} size="small" variant="outlined" sx={{ fontSize: '0.68rem', height: '20px' }} />
                          {item.flightNumber && (
                            <Chip label={`Flight ${item.flightNumber}`} size="small" sx={{ background: '#F1F5F9', fontSize: '0.68rem', height: '20px' }} />
                          )}
                        </Box>
                        <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: '0.96rem', color: '#0F2942' }}>
                          {item.title} ({item.color})
                        </Typography>
                        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.82rem', color: '#64748B' }}>
                          {item.description}
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, flexShrink: 0 }}>
                        <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.74rem', color: '#0284C7', fontWeight: 600 }}>
                          {item.storageLocker || 'Triage Shelf'}
                        </Typography>
                        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.74rem', color: '#94A3B8' }}>
                          {item.locationFound} • {item.reportedDate}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography sx={{ fontFamily: "'Geist Mono', 'JetBrains Mono', monospace", fontSize: '0.82rem', color: '#1E3A5F', fontWeight: 600 }}>
                Direct Bureau Hotline: +91 (022) 8900-3344 • Email: lostandfound@saphire.in
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#64748B' }}>
                Arrivals Concourse, Level 1, Adjacent to Baggage Reclaim Belt 6
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* File Lost Property Dialog Modal */}
        <Dialog open={reportModalOpen} onClose={() => setReportModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', pb: 1 }}>
            Register Misplaced Belonging
          </DialogTitle>
          <DialogContent dividers>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.84rem', color: '#64748B', mb: 2.5 }}>
              Please provide complete details. Your report is immediately pushed to the Airside Security patrol network and Terminal 2 Central Baggage Bureau.
            </Typography>

            <Box component="form" onSubmit={handleSubmitReport} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Item Name / Title"
                placeholder="e.g. Space Grey iPad Pro 11-inch with folio case"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                required
                fullWidth
                size="small"
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  select
                  label="Category"
                  value={formData.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  size="small"
                  fullWidth
                >
                  <MenuItem value="ELECTRONICS">Electronics & Gadgets</MenuItem>
                  <MenuItem value="BAGGAGE">Luggage & Carry-on</MenuItem>
                  <MenuItem value="DOCUMENTS">Passports & Documents</MenuItem>
                  <MenuItem value="VALUABLES">Jewelry & Valuables</MenuItem>
                  <MenuItem value="CLOTHING">Apparel & Outerwear</MenuItem>
                </TextField>

                <TextField
                  label="Primary Color"
                  placeholder="e.g. Midnight Black / Silver"
                  value={formData.color}
                  onChange={(e) => handleFormChange('color', e.target.value)}
                  size="small"
                  fullWidth
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 2 }}>
                <TextField
                  label="Last Seen Location"
                  placeholder="e.g. Gate A12 Concourse Restrooms"
                  value={formData.locationFound}
                  onChange={(e) => handleFormChange('locationFound', e.target.value)}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Flight No. (Optional)"
                  placeholder="e.g. AI-203"
                  value={formData.flightNumber}
                  onChange={(e) => handleFormChange('flightNumber', e.target.value)}
                  size="small"
                  fullWidth
                />
              </Box>

              <TextField
                label="Distinguishing Features / Serial / Sticker Description"
                placeholder="Include serial numbers, stickers, case characteristics, or identifying markings..."
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                multiline
                rows={3}
                size="small"
                fullWidth
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 2 }}>
                <TextField
                  label="Your Full Name"
                  placeholder="Passenger Name"
                  value={formData.reportedBy}
                  onChange={(e) => handleFormChange('reportedBy', e.target.value)}
                  required
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Contact Phone / Mobile"
                  placeholder="+91 98765 43210"
                  value={formData.contactNumber}
                  onChange={(e) => handleFormChange('contactNumber', e.target.value)}
                  required
                  size="small"
                  fullWidth
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setReportModalOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={(e) => {
                handleSubmitReport(e);
                setReportModalOpen(false);
              }}
              startIcon={<Send size={15} />}
              sx={{
                background: '#0284C7',
                color: '#FFFFFF',
                textTransform: 'none',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                borderRadius: '8px',
                px: 2.5,
                '&:hover': { background: '#0369A1' },
              }}
            >
              Submit Property Report
            </Button>
          </DialogActions>
        </Dialog>

        {/* Section 5: Minimalist Editorial FAQ */}
        <Box id="faq">
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.72rem', color: '#0284C7', letterSpacing: '0.14em', textTransform: 'uppercase', mb: 0.5, fontWeight: 600 }}>
              FREQUENTLY ASKED QUESTIONS
            </Typography>
            <Typography variant="h4" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#0F2942', letterSpacing: '-0.02em' }}>
              Guest Inquiries &amp; Travel Guidance
            </Typography>
          </Box>

          <Box sx={{ borderTop: '1px solid #E2E8F0' }}>
            {faqList.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <Box
                  key={idx}
                  onClick={() => toggleFaq(idx)}
                  sx={{
                    py: 3,
                    borderBottom: '1px solid #E2E8F0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover .faq-question': { color: '#0284C7' },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                      className="faq-question"
                      sx={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 600,
                        color: '#0F2942',
                        fontSize: '1.05rem',
                        transition: 'color 0.15s ease',
                      }}
                    >
                      {faq.q}
                    </Typography>
                    <Box sx={{ color: '#64748B', display: 'flex', alignItems: 'center' }}>
                      {isOpen ? <Minus size={18} color="#0284C7" /> : <Plus size={18} />}
                    </Box>
                  </Box>
                  {isOpen && (
                    <Typography
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        color: '#475569',
                        fontSize: '0.92rem',
                        lineHeight: 1.65,
                        mt: 1.5,
                        maxWidth: '850px',
                      }}
                    >
                      {faq.a}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default PassengerServices;
