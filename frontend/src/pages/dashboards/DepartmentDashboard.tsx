import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Tabs,
  Tab,
  TextField,
  LinearProgress,
} from '@mui/material';
import {
  Wrench,
  Fuel,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Radio,
  FileText,
  Calculator,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { SpotlightCard } from '../../components/reactbits';

export const DepartmentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Maintenance State
  const [faultReports, setFaultReports] = useState([
    { id: 'FLT-801', aircraft: 'Boeing 787-9 (SPH-102)', issue: 'Hydraulic Sensor Calibration required on Landing Gear Actuator B', severity: 'MEDIUM', status: 'RESOLVED' },
    { id: 'FLT-802', aircraft: 'Airbus A350-900 (SPH-204)', issue: 'Cabin APU Temperature Sensor intermittent alert', severity: 'LOW', status: 'IN INSPECTION' },
  ]);

  // Fuel State
  const [fuelKg, setFuelKg] = useState('28500');
  const [fuelCalculatedLitres, setFuelCalculatedLitres] = useState('35625');

  // Cleaning State
  const [cleaningChecklist, setCleaningChecklist] = useState([
    { id: 1, task: 'First Class & VIP Cabin Vacuum & Sanitization', done: true },
    { id: 2, task: 'Galley Equipment Disinfection & Waste Clearance', done: true },
    { id: 3, task: 'Lavatory Deep Disinfection & Fresh Consumables Replenishment', done: true },
    { id: 4, task: 'Economy Seating Pocket Inspection & Clean Headrest Covers', done: false },
    { id: 5, task: 'Cockpit Flight Deck Sanitization (Bio-clean protocols)', done: true },
  ]);

  const toggleCleanItem = (id: number) => {
    setCleaningChecklist(
      cleaningChecklist.map((c) => (c.id === id ? { ...c, done: !c.done } : c))
    );
  };

  const calculateFuel = () => {
    const kg = parseFloat(fuelKg) || 0;
    const litres = (kg / 0.8).toFixed(0);
    setFuelCalculatedLitres(litres);
    toast.success(`Computed: ${kg} kg = ${litres} L of Jet A-1 Fuel`);
  };

  return (
    <DashboardLayout activeRole="department">
      {/* Department Tabs Navigation */}
      <Paper elevation={0} sx={{ mb: 4, background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', p: 1 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#34D399', height: 3, borderRadius: 2 },
          }}
        >
          <Tab icon={<Wrench size={18} />} iconPosition="start" label="Aircraft Maintenance" sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700, '&.Mui-selected': { color: '#34D399' } }} />
          <Tab icon={<Fuel size={18} />} iconPosition="start" label="Jet A-1 Fuel Telemetry" sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700, '&.Mui-selected': { color: '#34D399' } }} />
          <Tab icon={<Sparkles size={18} />} iconPosition="start" label="Cabin Cleaning" sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700, '&.Mui-selected': { color: '#34D399' } }} />
          <Tab icon={<ShieldCheck size={18} />} iconPosition="start" label="Airside Security" sx={{ color: '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 700, '&.Mui-selected': { color: '#34D399' } }} />
        </Tabs>
      </Paper>

      {/* TAB 0: MAINTENANCE */}
      {activeTab === 0 && (
        <Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
            <Paper elevation={0} sx={{ p: 3.5, background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '18px' }}>
              <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 1 }}>
                Aircraft Fault Reports & Work Orders
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8', mb: 3 }}>
                Avionics, airframe structural logs, and pre-departure airworthiness sign-offs.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {faultReports.map((f) => (
                  <Box key={f.id} sx={{ p: 2.5, borderRadius: '12px', background: 'rgba(2, 6, 23, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#38BDF8', fontSize: '0.95rem' }}>
                        {f.aircraft}
                      </Typography>
                      <Chip label={f.severity} size="small" sx={{ backgroundColor: 'rgba(251, 191, 36, 0.2)', color: '#FBBF24', fontWeight: 800, fontSize: '0.68rem' }} />
                    </Box>
                    <Typography sx={{ fontSize: '0.88rem', color: '#CBD5E1', mb: 2 }}>{f.issue}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip label={f.status} size="small" sx={{ backgroundColor: 'rgba(52, 211, 153, 0.2)', color: '#34D399', fontWeight: 700, fontSize: '0.7rem' }} />
                      <Button size="small" variant="outlined" sx={{ color: '#38BDF8', borderColor: 'rgba(56, 189, 248, 0.4)', fontSize: '0.75rem' }}>
                        View Diagnostics
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>

            <SpotlightCard spotlightColor="rgba(52, 211, 153, 0.2)" style={{ padding: '28px', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '18px' }}>
              <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 2 }}>
                Pre-Flight Airworthiness
              </Typography>
              <Box sx={{ p: 2, borderRadius: '10px', background: 'rgba(2, 6, 23, 0.7)', mb: 2 }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>ACTIVE SQUAD</Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#FFFFFF' }}>Avionics Crew Lead #2</Typography>
              </Box>
              <Typography sx={{ fontSize: '0.85rem', color: '#CBD5E1', mb: 3 }}>
                Ready to release aircraft SPH-102 (Boeing 787-9) for gate pushback upon final captain sign-off.
              </Typography>
              <Button fullWidth variant="contained" sx={{ background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', fontWeight: 700 }}>
                Sign Off Airworthiness
              </Button>
            </SpotlightCard>
          </Box>
        </Box>
      )}

      {/* TAB 1: FUEL CALCULATOR & LOGS */}
      {activeTab === 1 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          <Paper elevation={0} sx={{ p: 3.5, background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '18px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Calculator size={22} color="#34D399" />
              <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
                Jet A-1 Fuel Uplift Calculator
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth
                label="Target Uplift Mass (kg)"
                value={fuelKg}
                onChange={(e) => setFuelKg(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { color: '#FFF' }, '& .MuiInputLabel-root': { color: '#94A3B8' } }}
              />

              <Button variant="contained" onClick={calculateFuel} sx={{ background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', fontWeight: 700, py: 1.2 }}>
                Compute Required Volume
              </Button>

              <Box sx={{ p: 2.5, borderRadius: '12px', background: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(52, 211, 153, 0.3)', mt: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>ESTIMATED VOLUME @ STANDARD DENSITY (0.80 kg/L)</Typography>
                <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#34D399', mt: 0.5 }}>
                  {fuelCalculatedLitres} Litres
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ p: 3.5, background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '18px' }}>
            <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 3 }}>
              Fuel Depot Farm Inventory
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                  <Typography sx={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 600 }}>Main Apron Tank Farm A (Jet A-1)</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#34D399', fontWeight: 700 }}>84% Capacity</Typography>
                </Box>
                <LinearProgress variant="determinate" value={84} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: '#34D399' } }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                  <Typography sx={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 600 }}>Reserve Satellite Hydrant B</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#38BDF8', fontWeight: 700 }}>92% Capacity</Typography>
                </Box>
                <LinearProgress variant="determinate" value={92} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: '#38BDF8' } }} />
              </Box>
            </Box>
          </Paper>
        </Box>
      )}

      {/* TAB 2: CLEANING CHECKLIST */}
      {activeTab === 2 && (
        <Paper elevation={0} sx={{ p: 3.5, background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '18px' }}>
          <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 1 }}>
            Aircraft Turnaround Cabin Sanitation Protocol
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8', mb: 3 }}>
            Active Stand: Gate B12 (Flight SPH-102 Boeing 787-9)
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {cleaningChecklist.map((item) => (
              <Box
                key={item.id}
                onClick={() => toggleCleanItem(item.id)}
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  background: item.done ? 'rgba(52, 211, 153, 0.1)' : 'rgba(2, 6, 23, 0.6)',
                  border: item.done ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { background: 'rgba(52, 211, 153, 0.15)' },
                }}
              >
                <CheckCircle2 size={20} color={item.done ? '#34D399' : '#64748B'} />
                <Typography sx={{ fontFamily: "'Inter', sans-serif", color: item.done ? '#FFFFFF' : '#94A3B8', textDecoration: item.done ? 'none' : 'none', fontWeight: item.done ? 600 : 400 }}>
                  {item.task}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* TAB 3: AIRSIDE SECURITY */}
      {activeTab === 3 && (
        <Paper elevation={0} sx={{ p: 3.5, background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '18px' }}>
          <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF', mb: 1 }}>
            Airside Perimeter & Baggage Screening
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8', mb: 3 }}>
            Continuous K9 sweep, FOD airfield detection, and TSA / ICAO compliant screening.
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2.5 }}>
            <Box sx={{ p: 2.5, borderRadius: '14px', background: 'rgba(2, 6, 23, 0.7)', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#34D399', fontSize: '1.1rem' }}>Perimeter Fence A-D</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', mt: 0.5 }}>Fiber Optic Sensor: SECURE</Typography>
            </Box>
            <Box sx={{ p: 2.5, borderRadius: '14px', background: 'rgba(2, 6, 23, 0.7)', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#34D399', fontSize: '1.1rem' }}>Baggage CT Scanners</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', mt: 0.5 }}>100% Units Online</Typography>
            </Box>
            <Box sx={{ p: 2.5, borderRadius: '14px', background: 'rgba(2, 6, 23, 0.7)', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#34D399', fontSize: '1.1rem' }}>Canine Detection Unit</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', mt: 0.5 }}>Sector Alpha Active</Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </DashboardLayout>
  );
};

export default DepartmentDashboard;
