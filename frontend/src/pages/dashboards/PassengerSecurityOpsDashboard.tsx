import React from 'react';
import { Box, Typography, Paper, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { UserCheck, Radio, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { SpotlightCard } from '../../components/reactbits';

const PASSENGER_QUEUE = [
  { pnr: 'PNR-9921', passenger: 'Lord Harrison Sterling', seat: '02A (First)', flight: 'SPH-102', gate: 'B12', status: 'BOARDED', lounge: 'SAPHIRE VIP Suite' },
  { pnr: 'PNR-9922', passenger: 'Dr. Evelyn Morales', seat: '14C (Business)', flight: 'SPH-102', gate: 'B12', status: 'BOARDED', lounge: 'Silver Kris Club' },
  { pnr: 'PNR-9923', passenger: 'Kenji Takahashi', seat: '22D (Economy)', flight: 'SPH-204', gate: 'A04', status: 'SECURITY CLEARED', lounge: 'None' },
  { pnr: 'PNR-9924', passenger: 'Amira Benali', seat: '08F (Business)', flight: 'SPH-308', gate: 'C22', status: 'SECURITY CLEARED', lounge: 'Oasis Executive' },
];

export const PassengerSecurityOpsDashboard: React.FC = () => {
  return (
    <DashboardLayout activeRole="passenger-security">
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <SpotlightCard spotlightColor="rgba(167, 139, 250, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(167, 139, 250, 0.3)', borderRadius: '16px' }}>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#A78BFA', mb: 1 }}>
            PROCESSED PASSENGERS
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            18,420 Today
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#34D399', mt: 0.5, fontWeight: 600 }}>
            Avg. TSA Queue: 3.2 mins
          </Typography>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(56, 189, 248, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px' }}>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8', mb: 1 }}>
            E-GATE BIOMETRICS
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            94.8% Match Rate
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', mt: 0.5 }}>
            Facial Recognition Turnstiles
          </Typography>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(52, 211, 153, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '16px' }}>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#34D399', mb: 1 }}>
            VIP LOUNGE OCCUPANCY
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            54% (128 / 240)
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#34D399', mt: 0.5, fontWeight: 600 }}>
            Suites & Showers Available
          </Typography>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(251, 191, 36, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '16px' }}>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#FBBF24', mb: 1 }}>
            SECURITY CLEARANCE
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            NOMINAL
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#34D399', mt: 0.5, fontWeight: 600 }}>
            Zero Breach Incidents
          </Typography>
        </SpotlightCard>
      </Box>

      {/* Passenger Manifest Clearance Table */}
      <Paper elevation={0} sx={{ p: 3.5, background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '18px' }}>
        <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 1 }}>
          Live Passenger Boarding & Security Clearance Manifest
        </Typography>
        <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8', mb: 3 }}>
          Track biometric e-gate validation, VIP lounge access, and seat manifest allocations.
        </Typography>

        <TableContainer sx={{ borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'rgba(2, 6, 23, 0.8)' }}>
              <TableRow>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>PNR RECORD</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>PASSENGER NAME</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>SEAT / CABIN</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>FLIGHT / GATE</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>LOUNGE ACCESS</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {PASSENGER_QUEUE.map((p) => (
                <TableRow key={p.pnr} hover sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.03)' } }}>
                  <TableCell sx={{ color: '#A78BFA', fontFamily: "'Inter', monospace", fontWeight: 700 }}>{p.pnr}</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 600 }}>{p.passenger}</TableCell>
                  <TableCell sx={{ color: '#CBD5E1' }}>{p.seat}</TableCell>
                  <TableCell sx={{ color: '#38BDF8', fontWeight: 700 }}>{p.flight} ({p.gate})</TableCell>
                  <TableCell sx={{ color: '#94A3B8' }}>{p.lounge}</TableCell>
                  <TableCell>
                    <Chip label={p.status} size="small" sx={{ bgcolor: 'rgba(52,211,153,0.15)', color: '#34D399', fontWeight: 700 }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </DashboardLayout>
  );
};

export default PassengerSecurityOpsDashboard;
