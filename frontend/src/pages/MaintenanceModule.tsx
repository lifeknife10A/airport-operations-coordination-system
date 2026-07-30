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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { Wrench, CheckCircle2 } from 'lucide-react';

export const MaintenanceModule: React.FC = () => {
  const [checks, setChecks] = useState({
    tiresBrakes: true,
    apuHealth: true,
    avionicsScan: true,
    pitotStatic: true,
    engineOil: true,
  });

  const [defectCategory, setDefectCategory] = useState('NONE');
  const [remarks, setRemarks] = useState('');
  const [released, setReleased] = useState(false);

  const allChecked = Object.values(checks).every(Boolean);

  const handleRelease = () => {
    if (!allChecked) return;
    setReleased(true);
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff' }}>
            Aircraft Line Maintenance & Avionics Log
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Pre-flight Engineering Inspection & Technical Release (`VT-SPA / SPH-402`)
          </Typography>
        </Box>
        <Wrench color="#60a5fa" size={32} />
      </Box>

      {released && (
        <Alert severity="success" icon={<CheckCircle2 size={22} />}>
          Aircraft Maintenance Release Signed! VT-SPA Certified Fit for Flight. Task MAINTENANCE set to COMPLETED.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                Line Maintenance Inspection Checklist
              </Typography>

              <FormGroup sx={{ gap: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checks.tiresBrakes}
                      onChange={(e) => setChecks({ ...checks, tiresBrakes: e.target.checked })}
                    />
                  }
                  label="Landing Gear Tires & Brake Wear Inspection"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checks.apuHealth}
                      onChange={(e) => setChecks({ ...checks, apuHealth: e.target.checked })}
                    />
                  }
                  label="Auxiliary Power Unit (APU) Operational Health Scan"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checks.avionicsScan}
                      onChange={(e) => setChecks({ ...checks, avionicsScan: e.target.checked })}
                    />
                  }
                  label="Cockpit Avionics Diagnostics & Radar Checks"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checks.pitotStatic}
                      onChange={(e) => setChecks({ ...checks, pitotStatic: e.target.checked })}
                    />
                  }
                  label="Pitot-Static Tubes & Probe Covers Inspected"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checks.engineOil}
                      onChange={(e) => setChecks({ ...checks, engineOil: e.target.checked })}
                    />
                  }
                  label="LEAP-1A Engine Oil Quantity Verification"
                />
              </FormGroup>

              <FormControl fullWidth>
                <InputLabel>Technical Defect Category</InputLabel>
                <Select
                  value={defectCategory}
                  label="Technical Defect Category"
                  onChange={(e) => setDefectCategory(e.target.value)}
                >
                  <MenuItem value="NONE">Nil Defect / Clean Log</MenuItem>
                  <MenuItem value="AVIONICS">Avionics Sensor Warning</MenuItem>
                  <MenuItem value="HYDRAULIC">Hydraulic Pressure Variance</MenuItem>
                  <MenuItem value="CABIN_ITEM">Non-Critical Cabin Defect</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Maintenance Engineer Remarks"
                multiline
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Log engineering observations or MEL rectifications..."
                fullWidth
              />

              <Button
                variant="contained"
                size="large"
                disabled={!allChecked || released}
                onClick={handleRelease}
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #2563eb 0%, #0d9488 100%)',
                }}
              >
                {released ? 'Maintenance Release Active' : 'Sign Maintenance Release Certificate'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
