import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  TextField,
  Alert,
  Divider,
  Paper,
  Grid,
} from '@mui/material';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const CabinCleaningModule: React.FC = () => {
  const [checklist, setChecklist] = useState({
    seatPockets: true,
    galleySanitation: true,
    lavatorySanitization: false,
    carpetVacuuming: true,
    wasteDisposal: true,
  });

  const [supervisorName, setSupervisorName] = useState('Ankit Sharma');
  const [signedOff, setSignedOff] = useState(false);

  const allChecked = Object.values(checklist).every(Boolean);

  const handleSignOff = () => {
    if (!allChecked) return;
    setSignedOff(true);
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff' }}>
            Cabin Cleaning & Hygiene Sign-Off
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Ramp Cabin Cleaning Checklist & Sanitation Verification (`Flight SPH-402`)
          </Typography>
        </Box>
        <Sparkles color="#34d399" size={32} />
      </Box>

      {signedOff && (
        <Alert severity="success" icon={<ShieldCheck size={20} />}>
          Cabin Cleaning Inspection Signed Off Successfully! Task marked as COMPLETED in AOCS Database.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                Cabin Inspection Checklist
              </Typography>
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

              <FormGroup sx={{ gap: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checklist.seatPockets}
                      onChange={(e) => setChecklist({ ...checklist, seatPockets: e.target.checked })}
                    />
                  }
                  label="Seat Pockets Swept & Safety Cards Placed"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checklist.galleySanitation}
                      onChange={(e) => setChecklist({ ...checklist, galleySanitation: e.target.checked })}
                    />
                  }
                  label="Galley Surfaces Sanitized & Waste Containers Cleared"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checklist.lavatorySanitization}
                      onChange={(e) => setChecklist({ ...checklist, lavatorySanitization: e.target.checked })}
                    />
                  }
                  label="Lavatories Sanitized, Soap & Paper Replenished"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checklist.carpetVacuuming}
                      onChange={(e) => setChecklist({ ...checklist, carpetVacuuming: e.target.checked })}
                    />
                  }
                  label="Aisle & Seat Row Carpets Vacuumed"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checklist.wasteDisposal}
                      onChange={(e) => setChecklist({ ...checklist, wasteDisposal: e.target.checked })}
                    />
                  }
                  label="Baggage Bins Checked & FOD Removed"
                />
              </FormGroup>

              <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

              <TextField
                label="Cleaning Supervisor Name"
                value={supervisorName}
                onChange={(e) => setSupervisorName(e.target.value)}
                fullWidth
              />

              <Button
                variant="contained"
                size="large"
                disabled={!allChecked || signedOff}
                onClick={handleSignOff}
                sx={{
                  mt: 1,
                  py: 1.5,
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #10b981 0%, #0d9488 100%)',
                }}
              >
                {signedOff ? 'Inspection Signed Off' : 'Submit & Complete Cleaning Task'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
              Flight Context
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Flight Number: <strong style={{ color: '#fff' }}>SPH-402</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Aircraft: <strong style={{ color: '#fff' }}>Airbus A320neo (VT-SPA)</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Stand Position: <strong style={{ color: '#fff' }}>Gate A1 / Stand S101</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Status: <strong style={{ color: '#34d399' }}>IN_PROGRESS</strong>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
