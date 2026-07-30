import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
} from '@mui/material';
import { Download, FileSpreadsheet } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

const delayData = [
  { name: 'Ground Handling (Ramp)', value: 35, color: '#3b82f6' },
  { name: 'Late Incoming Aircraft', value: 25, color: '#ef4444' },
  { name: 'Weather / ATC Congestion', value: 20, color: '#f59e0b' },
  { name: 'Catering / Refueling', value: 12, color: '#0d9488' },
  { name: 'Passenger / Baggage', value: 8, color: '#8b5cf6' },
];

const otpData = [
  { day: 'Mon', target: 92, actual: 95 },
  { day: 'Tue', target: 92, actual: 93 },
  { day: 'Wed', target: 92, actual: 94 },
  { day: 'Thu', target: 92, actual: 89 },
  { day: 'Fri', target: 92, actual: 96 },
  { day: 'Sat', target: 92, actual: 97 },
  { day: 'Sun', target: 92, actual: 94 },
];

export const ReportsAnalyticsPage: React.FC = () => {
  const [downloading, setDownloading] = useState(false);

  const handlePdfExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('Saphire AOCS Turnaround Delay & Executive OTP Report PDF exported successfully!');
    }, 1200);
  };

  const handleExcelExport = () => {
    alert('Delay Dataset CSV / Excel dataset downloaded.');
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff' }}>
            Turnaround Delay Analytics & Reports
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Executive On-Time Performance (OTP) Metrics & Delay Distribution (`SPH Hub`)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FileSpreadsheet size={16} />}
            onClick={handleExcelExport}
            sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
          >
            Export CSV Dataset
          </Button>
          <Button
            variant="contained"
            startIcon={<Download size={16} />}
            onClick={handlePdfExport}
            disabled={downloading}
            sx={{ background: 'linear-gradient(90deg, #1e40af 0%, #0d9488 100%)', fontWeight: 700 }}
          >
            {downloading ? 'Generating PDF...' : 'Download PDF Report'}
          </Button>
        </Box>
      </Box>

      {/* Analytics Charts Grid */}
      <Grid container spacing={3}>
        {/* Pie Chart: Delay Cause Distribution */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff', mb: 2 }}>
                Turnaround Delay Cause Distribution (%)
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={delayData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {delayData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#131e3a', borderRadius: '8px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart: On-Time Performance (OTP) Weekly Trend */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff', mb: 2 }}>
                Weekly On-Time Performance OTP (%)
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={otpData}>
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis domain={[80, 100]} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#131e3a', borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="target" fill="#475569" name="Target Guard (92%)" />
                    <Bar dataKey="actual" fill="#10b981" name="Actual SPH OTP (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
