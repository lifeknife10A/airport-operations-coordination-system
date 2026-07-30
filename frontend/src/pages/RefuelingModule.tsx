import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { Fuel, AlertTriangle, CheckCircle } from 'lucide-react';

export const RefuelingModule: React.FC = () => {
  const [targetFuelKg, setTargetFuelKg] = useState<number>(8500);
  const [actualFuelKg, setActualFuelKg] = useState<number>(8650); // 1.76% variance -> out of limits!
  const [density, setDensity] = useState<number>(0.804); // kg/L

  const [pin, setPin] = useState('');
  const [openPinModal, setOpenPinModal] = useState(false);
  const [approved, setApproved] = useState(false);
  const [pinError, setPinError] = useState('');

  // Calculate Variance Percentage
  const varianceKg = actualFuelKg - targetFuelKg;
  const variancePct = (varianceKg / targetFuelKg) * 100;
  const isOutOfLimits = Math.abs(variancePct) > 1.0;

  const actualLiters = Math.round(actualFuelKg / density);

  const handleVerify = () => {
    if (isOutOfLimits && !approved) {
      setOpenPinModal(true);
    } else {
      setApproved(true);
    }
  };

  const handlePinSubmit = () => {
    if (pin === '1234' || pin === '2026') {
      setApproved(true);
      setOpenPinModal(false);
    } else {
      setPinError('Invalid Supervisor PIN code! Security authorization denied.');
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff' }}>
            Fuel Load Verification & Variance Guard
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Safety-Critical Fuel Calculator & &plusmn;1.0% Variance Guard (`Flight SPH-402`)
          </Typography>
        </Box>
        <Fuel color="#fbbf24" size={32} />
      </Box>

      {/* Status Warning Banner */}
      {isOutOfLimits && !approved && (
        <Alert severity="warning" icon={<AlertTriangle size={22} />}>
          <strong>Fuel Load Variance Guard Alert:</strong> Actual fuel payload ({actualFuelKg} kg) deviates by{' '}
          <strong>{variancePct > 0 ? `+${variancePct.toFixed(2)}%` : `${variancePct.toFixed(2)}%`}</strong> from flight plan target ({targetFuelKg} kg). Exceeds safe &plusmn;1.0% threshold! Requires Supervisor PIN Override.
        </Alert>
      )}

      {approved && (
        <Alert severity="success" icon={<CheckCircle size={22} />}>
          Fuel Loading Verified & Authorized! Saved to Aircraft Weight & Balance System. Task Status: COMPLETED.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Form Controls */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                Fuel Quantity Loading Parameters
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Target Fuel Payload (kg)"
                    type="number"
                    value={targetFuelKg}
                    onChange={(e) => setTargetFuelKg(Number(e.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Actual Fuel Metered (kg)"
                    type="number"
                    value={actualFuelKg}
                    onChange={(e) => setActualFuelKg(Number(e.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Jet A-1 Fuel Density (kg/L)"
                    type="number"
                    value={density}
                    onChange={(e) => setDensity(Number(e.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Calculated Volume (Liters)"
                    value={actualLiters.toLocaleString() + ' L'}
                    disabled
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained"
                size="large"
                onClick={handleVerify}
                disabled={approved}
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  background: isOutOfLimits
                    ? 'linear-gradient(90deg, #d97706 0%, #dc2626 100%)'
                    : 'linear-gradient(90deg, #10b981 0%, #0d9488 100%)',
                }}
              >
                {approved
                  ? 'Fuel Load Authorized'
                  : isOutOfLimits
                  ? 'Request Supervisor PIN Override'
                  : 'Verify Fuel Load & Complete'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Live Calculation Output Card */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
              Fuel Variance Analysis
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Target vs Actual Delta:
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: isOutOfLimits ? '#f87171' : '#34d399',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {varianceKg > 0 ? `+${varianceKg} kg` : `${varianceKg} kg`}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Variance Percentage:
              </Typography>
              <Chip
                label={`${variancePct > 0 ? '+' : ''}${variancePct.toFixed(2)}%`}
                sx={{
                  backgroundColor: isOutOfLimits ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: isOutOfLimits ? '#f87171' : '#34d399',
                  fontWeight: 800,
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                NFR Safety Rule (&plusmn;1.0%):
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: isOutOfLimits ? '#ef4444' : '#10b981' }}>
                {isOutOfLimits ? 'VIOLATED (OVERRIDE NEEDED)' : 'PASSED (WITHIN LIMITS)'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Supervisor PIN Dialog */}
      <Dialog open={openPinModal} onClose={() => setOpenPinModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Supervisor PIN Authorization</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {pinError && <Alert severity="error">{pinError}</Alert>}
          <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
            Fuel variance ({variancePct.toFixed(2)}%) exceeds safe limits. Enter Supervisor Security PIN to authorize fuel load:
          </Typography>
          <TextField
            label="4-Digit Security PIN"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            fullWidth
            placeholder="Try demo PIN: 1234"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPinModal(false)}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={handlePinSubmit}>
            Authorize Variance
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
