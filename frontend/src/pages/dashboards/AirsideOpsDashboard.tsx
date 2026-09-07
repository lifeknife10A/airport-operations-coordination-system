import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { Plane, Radio, Wind, Eye } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { SpotlightCard } from '../../components/reactbits';

export const AirsideOpsDashboard: React.FC = () => {
  return (
    <DashboardLayout activeRole="airside-ops">
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <SpotlightCard spotlightColor="rgba(56, 189, 248, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px' }}>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8', mb: 1 }}>
            RUNWAY 09R / 27L
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            ACTIVE (CAT III)
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#34D399', mt: 0.5, fontWeight: 600 }}>
            ● Surface Friction: Normal (0.82)
          </Typography>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(52, 211, 153, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '16px' }}>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#34D399', mb: 1 }}>
            RUNWAY 09L / 27R
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            DEPARTURE ONLY
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#38BDF8', mt: 0.5 }}>
            Separation Interval: 120s
          </Typography>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(129, 140, 248, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(129, 140, 248, 0.3)', borderRadius: '16px' }}>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#818CF8', mb: 1 }}>
            WIND & METAR
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            080° @ 12 kts
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', mt: 0.5 }}>
            QNH 1014 hPa | Temp 24°C
          </Typography>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(251, 191, 36, 0.2)" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '16px' }}>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#FBBF24', mb: 1 }}>
            AIRFIELD FOD SWEEP
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
            CLEAR
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#34D399', mt: 0.5, fontWeight: 600 }}>
            Automated Radar Scanning
          </Typography>
        </SpotlightCard>
      </Box>

      {/* Runway Status & Stand Allocation */}
      <Paper elevation={0} sx={{ p: 3.5, background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '18px' }}>
        <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 1 }}>
          Airside Apron Stand Status & Taxiway Clearances
        </Typography>
        <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8', mb: 3 }}>
          Monitor taxiway flows (Echo, Foxtrot, Alpha) and apron Marshalling readiness.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          <Box sx={{ p: 2.5, borderRadius: '14px', background: 'rgba(2, 6, 23, 0.7)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>Taxiway Foxtrot</Typography>
            <Chip label="CLEAR FOR TAXI" size="small" sx={{ my: 1, bgcolor: 'rgba(52,211,153,0.2)', color: '#34D399', fontWeight: 700 }} />
            <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8' }}>In-use by flight SPH-204 to Runway 09L</Typography>
          </Box>

          <Box sx={{ p: 2.5, borderRadius: '14px', background: 'rgba(2, 6, 23, 0.7)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>Taxiway Echo</Typography>
            <Chip label="STANDBY" size="small" sx={{ my: 1, bgcolor: 'rgba(56,189,248,0.2)', color: '#38BDF8', fontWeight: 700 }} />
            <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8' }}>Holding clearance for inbound SPH-308</Typography>
          </Box>

          <Box sx={{ p: 2.5, borderRadius: '14px', background: 'rgba(2, 6, 23, 0.7)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>Apron Stand 42</Typography>
            <Chip label="MARSHALLING READY" size="small" sx={{ my: 1, bgcolor: 'rgba(52,211,153,0.2)', color: '#34D399', fontWeight: 700 }} />
            <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8' }}>VDGS Docking Guidance Activated</Typography>
          </Box>
        </Box>
      </Paper>
    </DashboardLayout>
  );
};

export default AirsideOpsDashboard;
