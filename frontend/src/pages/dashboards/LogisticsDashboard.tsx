import React, { useState } from 'react';
import { Box, Typography, Paper, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { Truck, Layers, Fuel, Package, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { SpotlightCard } from '../../components/reactbits';

const CARGO_AWB_LIST = [
  { awb: 'AWB-772-9102', flight: 'SPH-102', origin: 'JFK', destination: 'LHR', weight: '4,250 kg', type: 'Pharma / Cold Chain', status: 'LOADED' },
  { awb: 'AWB-881-4419', flight: 'SPH-204', origin: 'SIN', destination: 'DXB', weight: '12,800 kg', type: 'High-Value Electronics', status: 'IN TRANSIT' },
  { awb: 'AWB-990-1234', flight: 'SPH-308', origin: 'HND', destination: 'LAX', weight: '8,400 kg', type: 'General Air Cargo', status: 'CLEARED' },
];

export const LogisticsDashboard: React.FC = () => {
  return (
    <DashboardLayout activeRole="logistics">
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <SpotlightCard spotlightColor="rgba(244, 114, 182, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(244, 114, 182, 0.3)', borderRadius: '16px' }}>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#F472B6', mb: 1 }}>
            DAILY TONNAGE PROCESSED
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            142.6 Tons
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#34D399', mt: 0.5, fontWeight: 600 }}>
            +12% vs. Forecast
          </Typography>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(56, 189, 248, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px' }}>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8', mb: 1 }}>
            BAGGAGE CONVEYOR VELOCITY
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            99.4% Delivery
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', mt: 0.5 }}>
            Avg. carousel claim: 11 mins
          </Typography>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(52, 211, 153, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '16px' }}>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#34D399', mb: 1 }}>
            ACTIVE ULD CONTAINERS
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            88 Positioned
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#34D399', mt: 0.5, fontWeight: 600 }}>
            All Pallets RFID Tagged
          </Typography>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(251, 191, 36, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '16px' }}>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#FBBF24', mb: 1 }}>
            FUEL BOWSER FLEET
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            12 / 12 Active
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', mt: 0.5 }}>
            Hydrant Dispenser Trucks
          </Typography>
        </SpotlightCard>
      </Box>

      {/* Cargo Manifest Table */}
      <Paper elevation={0} sx={{ p: 3.5, background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '18px' }}>
        <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 1 }}>
          Active Air Cargo Manifests & Dangerous Goods Registry
        </Typography>
        <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8', mb: 3 }}>
          Track Air Waybills (AWB), cold-chain pharma temperature alerts, and cargo holds.
        </Typography>

        <TableContainer sx={{ borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'rgba(2, 6, 23, 0.8)' }}>
              <TableRow>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>AWB NUMBER</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>FLIGHT</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>ROUTING</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>WEIGHT</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>CARGO CLASS</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CARGO_AWB_LIST.map((c) => (
                <TableRow key={c.awb} hover sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.03)' } }}>
                  <TableCell sx={{ color: '#38BDF8', fontFamily: "'Inter', monospace", fontWeight: 700 }}>{c.awb}</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 600 }}>{c.flight}</TableCell>
                  <TableCell sx={{ color: '#CBD5E1' }}>{c.origin} ➔ {c.destination}</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 700 }}>{c.weight}</TableCell>
                  <TableCell sx={{ color: '#94A3B8' }}>{c.type}</TableCell>
                  <TableCell>
                    <Chip label={c.status} size="small" sx={{ bgcolor: 'rgba(52,211,153,0.15)', color: '#34D399', fontWeight: 700 }} />
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

export default LogisticsDashboard;
