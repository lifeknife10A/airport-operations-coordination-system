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
} from '@mui/material';
import { Utensils, CheckCircle2 } from 'lucide-react';

export const CateringModule: React.FC = () => {
  const [firstCartCount, setFirstCartCount] = useState(2);
  const [businessCartCount, setBusinessCartCount] = useState(6);
  const [economyCartCount, setEconomyCartCount] = useState(14);
  const [sealNumber, setSealNumber] = useState('CAT-SEAL-8841');
  const [chilledTempC, setChilledTempC] = useState(3.5);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff' }}>
            Galley Catering Replenishment Tracker
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Galley Cart Load Manifest & Seal Verification (`Flight SPH-402`)
          </Typography>
        </Box>
        <Utensils color="#f472b6" size={32} />
      </Box>

      {submitted && (
        <Alert severity="success" icon={<CheckCircle2 size={22} />}>
          Galley Catering Manifest Verified & Sealed! Catering Task COMPLETED.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                Cart Replenishment Manifest
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label="First Class Carts"
                    type="number"
                    value={firstCartCount}
                    onChange={(e) => setFirstCartCount(Number(e.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label="Business Class Carts"
                    type="number"
                    value={businessCartCount}
                    onChange={(e) => setBusinessCartCount(Number(e.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label="Economy Class Carts"
                    type="number"
                    value={economyCartCount}
                    onChange={(e) => setEconomyCartCount(Number(e.target.value))}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Tamper-Evident Seal #"
                    value={sealNumber}
                    onChange={(e) => setSealNumber(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Chilled Food Temp (°C)"
                    type="number"
                    value={chilledTempC}
                    onChange={(e) => setChilledTempC(Number(e.target.value))}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained"
                size="large"
                disabled={submitted}
                onClick={handleSubmit}
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%)',
                }}
              >
                {submitted ? 'Catering Seal Verified' : 'Verify Cart Seals & Confirm Loading'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
