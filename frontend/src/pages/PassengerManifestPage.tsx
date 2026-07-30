import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import { Users, Search, Lock, Eye, EyeOff } from 'lucide-react';
import { Passenger } from '../types';
import { useAuth } from '../context/AuthContext';

export const PassengerManifestPage: React.FC = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [unmasked, setUnmasked] = useState(false);

  const mockPassengers: Passenger[] = [
    {
      passengerId: 1,
      pnr: 'SPH-8821',
      firstName: 'Aarav',
      lastName: 'Sharma',
      passportNumber: 'L8493012',
      seatNumber: '02A',
      cabinClass: 'BUSINESS',
      isBoarded: true,
      isTransit: false,
    },
    {
      passengerId: 2,
      pnr: 'SPH-8822',
      firstName: 'Ananya',
      lastName: 'Iyer',
      passportNumber: 'Z9103841',
      seatNumber: '02B',
      cabinClass: 'BUSINESS',
      isBoarded: true,
      isTransit: true,
    },
    {
      passengerId: 3,
      pnr: 'SPH-9014',
      firstName: 'Rohan',
      lastName: 'Mehta',
      passportNumber: 'K4729103',
      seatNumber: '14C',
      cabinClass: 'ECONOMY',
      isBoarded: true,
      isTransit: false,
    },
    {
      passengerId: 4,
      pnr: 'SPH-9015',
      firstName: 'Priya',
      lastName: 'Deshmukh',
      passportNumber: 'P1029384',
      seatNumber: '14D',
      cabinClass: 'ECONOMY',
      isBoarded: false,
      isTransit: false,
    },
    {
      passengerId: 5,
      pnr: 'SPH-9100',
      firstName: 'David',
      lastName: 'Smith',
      passportNumber: 'US948102',
      seatNumber: '01A',
      cabinClass: 'FIRST',
      isBoarded: true,
      isTransit: true,
    },
  ];

  const isImmigrationRole = user?.roleName === 'IMMIGRATION_OFFICER' || user?.roleName === 'AIRPORT_OPERATIONS_MANAGER';

  const maskPassport = (pass: string) => {
    if (unmasked && isImmigrationRole) return pass;
    return `XXXX-XXXX-${pass.slice(-4)}`;
  };

  const filtered = mockPassengers.filter(
    (p) =>
      p.pnr.toLowerCase().includes(search.toLowerCase()) ||
      p.lastName.toLowerCase().includes(search.toLowerCase()) ||
      p.firstName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff' }}>
            Passenger Manifest & Privacy Masking
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            PNR Lookup & NFR Automated Passport Confidentiality (`Flight SPH-402`)
          </Typography>
        </Box>
        <Users color="#60a5fa" size={32} />
      </Box>

      {/* Security Privacy Info Alert */}
      <Alert severity="info" icon={<Lock size={20} />}>
        <strong>NFR Confidentiality Guard Active:</strong> Passport numbers are automatically masked as{' '}
        <code>XXXX-XXXX-1234</code>. Unmasking is restricted strictly to authorized Immigration & Border Control roles.
      </Alert>

      {/* Search & Actions Card */}
      <Card sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              placeholder="Search PNR code or passenger name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} color="#94a3b8" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant={unmasked ? 'contained' : 'outlined'}
              color={unmasked ? 'warning' : 'primary'}
              startIcon={unmasked ? <EyeOff size={16} /> : <Eye size={16} />}
              onClick={() => setUnmasked(!unmasked)}
              disabled={!isImmigrationRole}
            >
              {unmasked ? 'Re-mask Passport Numbers' : 'Unmask Passports (Immigration Only)'}
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Manifest Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Table>
              <TableHead sx={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                <TableRow>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Passenger Name</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>PNR Code</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Seat #</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Cabin Class</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Passport Number (Masked)</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Transit Status</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Boarding Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.passengerId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 700, color: '#ffffff' }}>
                      {p.firstName} {p.lastName}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'JetBrains Mono, monospace', color: '#60a5fa', fontWeight: 700 }}>
                      {p.pnr}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'JetBrains Mono, monospace', color: '#ffffff', fontWeight: 700 }}>
                      {p.seatNumber}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.cabinClass}
                        size="small"
                        sx={{
                          fontSize: '0.68rem',
                          backgroundColor:
                            p.cabinClass === 'FIRST'
                              ? 'rgba(245, 158, 11, 0.2)'
                              : p.cabinClass === 'BUSINESS'
                              ? 'rgba(13, 148, 136, 0.2)'
                              : 'rgba(59, 130, 246, 0.2)',
                          color:
                            p.cabinClass === 'FIRST'
                              ? '#fbbf24'
                              : p.cabinClass === 'BUSINESS'
                              ? '#2dd4bf'
                              : '#60a5fa',
                          fontWeight: 800,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'JetBrains Mono, monospace', color: '#94a3b8' }}>
                      {maskPassport(p.passportNumber)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.isTransit ? 'TRANSIT PASSENGER' : 'LOCAL ORIGIN'}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.68rem', borderColor: 'rgba(255, 255, 255, 0.15)', color: '#cbd5e1' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.isBoarded ? 'BOARDED' : 'NOT BOARDED'}
                        size="small"
                        sx={{
                          backgroundColor: p.isBoarded ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: p.isBoarded ? '#34d399' : '#f87171',
                          fontWeight: 800,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};
