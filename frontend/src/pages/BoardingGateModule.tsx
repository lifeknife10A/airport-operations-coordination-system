import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Button,
  TextField,
  Chip,
  Alert,
  InputAdornment,
} from '@mui/material';
import { UserCheck, QrCode, Lock, CheckCircle2 } from 'lucide-react';

export const BoardingGateModule: React.FC = () => {
  const [boardedCount, setBoardedCount] = useState(154);
  const totalCount = 162;
  const [activeZone, setActiveZone] = useState('Zone 2 (Rows 15-30)');
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [gateClosed, setGateClosed] = useState(false);

  const pct = Math.round((boardedCount / totalCount) * 100);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput) return;
    if (boardedCount < totalCount) {
      setBoardedCount(boardedCount + 1);
      setScanResult(`PASS: Boarding pass validated for PNR [${scanInput.toUpperCase()}]. Passenger boarded.`);
      setScanInput('');
    }
  };

  const handleCloseGate = () => {
    setGateClosed(true);
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff' }}>
            Passenger Boarding Gate Controller
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Live Manifest Scanner & Gate Closure Control (`Gate A3 / Flight 6E-204`)
          </Typography>
        </Box>
        <UserCheck color="#a78bfa" size={32} />
      </Box>

      {gateClosed && (
        <Alert severity="success" icon={<Lock size={22} />}>
          Boarding Gate Closed! Passenger count finalized ({boardedCount}/{totalCount}). Flight Status updated to READY for Pushback.
        </Alert>
      )}

      {scanResult && !gateClosed && (
        <Alert severity="info" icon={<CheckCircle2 size={20} />}>
          {scanResult}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Progress & Counter Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 1 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                  Live Boarding Milestone
                </Typography>
                <Chip
                  label={gateClosed ? 'GATE CLOSED' : 'BOARDING ACTIVE'}
                  color={gateClosed ? 'default' : 'secondary'}
                  sx={{ fontWeight: 800 }}
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    Boarded Passengers:
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#a78bfa', fontFamily: 'JetBrains Mono, monospace' }}>
                    {boardedCount} / {totalCount} ({pct}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{ height: 12, borderRadius: 6, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                {['Zone 1 (Business)', 'Zone 2 (Rows 15-30)', 'Zone 3 (Rows 1-14)'].map((zone) => (
                  <Button
                    key={zone}
                    variant={activeZone === zone ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setActiveZone(zone)}
                    sx={{ fontSize: '0.72rem', fontWeight: 700 }}
                  >
                    {zone.split(' ')[0]} {zone.split(' ')[1]}
                  </Button>
                ))}
              </Box>

              <Button
                variant="contained"
                color="error"
                size="large"
                disabled={gateClosed}
                onClick={handleCloseGate}
                startIcon={<Lock size={18} />}
                sx={{ py: 1.5, fontWeight: 700, mt: 1 }}
              >
                {gateClosed ? 'Boarding Gate Closed' : 'Finalize & Close Boarding Gate'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Boarding Pass Scanner Simulator */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 1 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                Boarding Pass Scanner Simulator
              </Typography>

              <Box component="form" onSubmit={handleScan} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Scan Boarding Pass Barcode / PNR"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder="e.g. SPH-PNR-8839"
                  disabled={gateClosed}
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <QrCode size={20} color="#a78bfa" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={gateClosed || !scanInput}
                  sx={{ py: 1.2, fontWeight: 700, background: 'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 100%)' }}
                >
                  Validate & Board Passenger
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
