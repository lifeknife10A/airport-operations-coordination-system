import React from 'react';
import { Box, Typography } from '@mui/material';

const GroundOpsSupervisorDashboard = () => (
  <Box sx={{ p: 4, bgcolor: '#0B1020', minHeight: '100vh', color: '#F4F4F4' }}>
    <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif" }}>Ground Operations Supervisor Dashboard</Typography>
    <Typography sx={{ color: '#94A3B8', mt: 2 }}>Welcome to your workspace.</Typography>
  </Box>
);

export default GroundOpsSupervisorDashboard;
