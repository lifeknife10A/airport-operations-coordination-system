import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  TextField,
  Alert,
} from '@mui/material';
import { Shield, ShieldCheck } from 'lucide-react';

export const SecurityClearancePage: React.FC = () => {
  const [checks, setChecks] = useState({
    cabinSearch: true,
    cargoHoldCheck: true,
    unattendedBagCheck: true,
    rampPerimeterSweep: true,
  });

  const [badgeId, setBadgeId] = useState('SEC-OFF-9942');
  const [cleared, setCleared] = useState(false);

  const allChecked = Object.values(checks).every(Boolean);

  const handleClearance = () => {
    if (!allChecked || !badgeId) return;
    setCleared(true);
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff' }}>
            Ramp & Cabin Security Clearance
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Terminal & Aircraft Security Sweep Inspection (`Flight SPH-402`)
          </Typography>
        </Box>
        <Shield color="#38bdf8" size={32} />
      </Box>

      {cleared && (
        <Alert severity="success" icon={<ShieldCheck size={22} />}>
          Security Sweep Clearance Granted! Timestamped log appended to Security Audit Trail. Task SECURITY set to COMPLETED.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                Security Sweep Protocols
              </Typography>

              <FormGroup sx={{ gap: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checks.cabinSearch}
                      onChange={(e) => setChecks({ ...checks, cabinSearch: e.target.checked })}
                    />
                  }
                  label="Aircraft Cabin & Overhead Bin Search Complete"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checks.cargoHoldCheck}
                      onChange={(e) => setChecks({ ...checks, cargoHoldCheck: e.target.checked })}
                    />
                  }
                  label="Forward & Aft Cargo Hold Clearance Verification"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checks.unattendedBagCheck}
                      onChange={(e) => setChecks({ ...checks, unattendedBagCheck: e.target.checked })}
                    />
                  }
                  label="Unattended Baggage & Suspicious Item Scan"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checks.rampPerimeterSweep}
                      onChange={(e) => setChecks({ ...checks, rampPerimeterSweep: e.target.checked })}
                    />
                  }
                  label="Ramp & Jetbridge Security Perimeter Controlled"
                />
              </FormGroup>

              <TextField
                label="Security Officer Badge ID"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                fullWidth
              />

              <Button
                variant="contained"
                size="large"
                disabled={!allChecked || cleared}
                onClick={handleClearance}
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #0284c7 0%, #0d9488 100%)',
                }}
              >
                {cleared ? 'Security Clearance Active' : 'Issue Official Security Clearance'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
