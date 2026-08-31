import React from 'react';
import { Box, Typography } from '@mui/material';

const DepartmentDashboard = () => (
  <Box sx={{ p: 4, bgcolor: '#0B1020', minHeight: '100vh', color: '#F4F4F4' }}>
    <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif" }}>Department Dashboard</Typography>
    <Typography sx={{ color: '#94A3B8', mt: 2 }}>
      Welcome to the Department Operations workspace (Cleaning, Fuel, Maintenance, Security).
    </Typography>
  </Box>
);

export default DepartmentDashboard;
