import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import {
  Package,
  Sliders,
  Layers,
  Fuel,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowRight,
  ShieldCheck,
  Radio,
  Sparkles,
  Plane,
  Truck,
  RotateCw,
  Check,
  ExternalLink,
  UserCheck,
  Bell,
  CheckCircle,
} from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { aocsDataStore } from '../../services/aocsDataStore';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES & DATA STRUCTURES
// ============================================================================

export type CargoStatus = 'PENDING' | 'LOADING' | 'LOADED';
export type CarouselStatus = 'AVAILABLE' | 'ARRIVING' | 'ARRIVED' | 'MAINTENANCE';
export type FuelLogStatus = 'COMPLETED' | 'PUMPING' | 'QUEUED';

export interface CargoRecord {
  id: string;
  flightNumber: string;
  airline: string;
  containerId: string;
  cargoType: 'CARGO' | 'MAIL' | 'BAGGAGE';
  weightKg: number;
  description: string;
  status: CargoStatus;
}

export interface CarouselRecord {
  id: string;
  carouselNumber: string; // 'C01', 'C02', etc.
  terminal: string; // 'Terminal 1', 'Terminal 2'
  status: CarouselStatus;
  flightNumber?: string;
  airline?: string;
  origin?: string;
  bagsCount?: number;
  eta?: string;
}

export interface FuelSupplyLog {
  id: string;
  flightNumber: string;
  stand: string;
  taskId: string;
  hydrantTruck: string;
  litersPumped: number;
  density: number;
  status: FuelLogStatus;
  timestamp: string;
}

export interface FlightLogisticsFlow {
  id: string;
  flightNumber: string;
  airline: string;
  aircraft: string;
  stand: string;
  arrival: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  baggageOffload: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  cargoHandling: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  fuelSupply: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  dispatchReady: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
}

export interface LogisticsAlert {
  id: string;
  flightNumber: string;
  severity: 'CRITICAL' | 'WARNING';
  type: 'CARGO_INCOMPLETE' | 'CAROUSEL_UNASSIGNED' | 'FUEL_PENDING';
  title: string;
  description: string;
  actionLabel: string;
}

// ============================================================================
// INITIAL SEED DATA
// ============================================================================

const INITIAL_CARGO: CargoRecord[] = [
  { id: 'CRG-101', flightNumber: 'AI-203', airline: 'Air India', containerId: 'CTN-4821', cargoType: 'CARGO', weightKg: 1240, description: 'Medical cold-chain & avionics spares', status: 'LOADING' },
  { id: 'CRG-102', flightNumber: '6E-521', airline: 'IndiGo', containerId: 'CTN-1940', cargoType: 'BAGGAGE', weightKg: 890, description: 'Priority passenger transit baggage', status: 'LOADED' },
  { id: 'CRG-103', flightNumber: 'UK-901', airline: 'Vistara', containerId: 'CTN-7312', cargoType: 'CARGO', weightKg: 1560, description: 'General commercial pallet freight', status: 'PENDING' },
  { id: 'CRG-104', flightNumber: 'SPH-102', airline: 'Saphire Air', containerId: 'CTN-5509', cargoType: 'MAIL', weightKg: 420, description: 'Express diplomatic mail pouches', status: 'LOADED' },
  { id: 'CRG-105', flightNumber: 'BA-142', airline: 'British Airways', containerId: 'ULD-9022', cargoType: 'CARGO', weightKg: 2840, description: 'Perishable agro exports', status: 'LOADED' },
  { id: 'CRG-106', flightNumber: 'EK-506', airline: 'Emirates', containerId: 'ULD-8114', cargoType: 'BAGGAGE', weightKg: 1650, description: 'International widebody belly hold', status: 'PENDING' },
  { id: 'CRG-107', flightNumber: 'QR-557', airline: 'Qatar Airways', containerId: 'CTN-3301', cargoType: 'CARGO', weightKg: 1980, description: 'High-value electronics manifest', status: 'LOADED' },
];

const INITIAL_CAROUSELS: CarouselRecord[] = [
  { id: 'CRSL-01', carouselNumber: 'C01', terminal: 'Terminal 1', status: 'ARRIVED', flightNumber: 'AI-203', airline: 'Air India', origin: 'Delhi (DEL)', bagsCount: 184, eta: 'Active Claim' },
  { id: 'CRSL-02', carouselNumber: 'C02', terminal: 'Terminal 1', status: 'ARRIVING', flightNumber: '6E-521', airline: 'IndiGo', origin: 'Bengaluru (BLR)', bagsCount: 142, eta: 'In 8 mins' },
  { id: 'CRSL-03', carouselNumber: 'C03', terminal: 'Terminal 1', status: 'AVAILABLE' },
  { id: 'CRSL-04', carouselNumber: 'C04', terminal: 'Terminal 2', status: 'ARRIVED', flightNumber: 'UK-901', airline: 'Vistara', origin: 'Mumbai (BOM)', bagsCount: 168, eta: 'Active Claim' },
  { id: 'CRSL-05', carouselNumber: 'C05', terminal: 'Terminal 2', status: 'AVAILABLE' },
  { id: 'CRSL-06', carouselNumber: 'C06', terminal: 'Terminal 2', status: 'AVAILABLE' },
];

const INITIAL_FUEL_LOGS: FuelSupplyLog[] = [
  { id: 'LOG-F01', flightNumber: 'AI-203', stand: 'Stand G12', taskId: 'TSK-F22', hydrantTruck: 'HYD-04', litersPumped: 9950, density: 0.804, status: 'COMPLETED', timestamp: '11:45 IST' },
  { id: 'LOG-F02', flightNumber: '6E-521', stand: 'Stand G08', taskId: 'TSK-F23', hydrantTruck: 'HYD-02', litersPumped: 6400, density: 0.804, status: 'COMPLETED', timestamp: '11:58 IST' },
  { id: 'LOG-F03', flightNumber: 'UK-901', stand: 'Stand G04', taskId: 'TSK-F24', hydrantTruck: 'HYD-07', litersPumped: 0, density: 0.804, status: 'QUEUED', timestamp: 'Queued' },
  { id: 'LOG-F04', flightNumber: 'SPH-102', stand: 'Stand G10', taskId: 'TSK-F25', hydrantTruck: 'HYD-01', litersPumped: 14200, density: 0.805, status: 'COMPLETED', timestamp: '11:20 IST' },
  { id: 'LOG-F05', flightNumber: 'BA-142', stand: 'Stand G03', taskId: 'TSK-F26', hydrantTruck: 'HYD-05', litersPumped: 18600, density: 0.804, status: 'PUMPING', timestamp: 'In progress' },
];

const INITIAL_FLOWS: FlightLogisticsFlow[] = [
  { id: 'FLW-01', flightNumber: 'AI-203', airline: 'Air India', aircraft: 'Boeing 787-8', stand: 'Stand G12', arrival: 'COMPLETED', baggageOffload: 'COMPLETED', cargoHandling: 'IN_PROGRESS', fuelSupply: 'COMPLETED', dispatchReady: 'PENDING' },
  { id: 'FLW-02', flightNumber: '6E-521', airline: 'IndiGo', aircraft: 'Airbus A321neo', stand: 'Stand G08', arrival: 'COMPLETED', baggageOffload: 'IN_PROGRESS', cargoHandling: 'COMPLETED', fuelSupply: 'COMPLETED', dispatchReady: 'IN_PROGRESS' },
  { id: 'FLW-03', flightNumber: 'UK-901', airline: 'Vistara', aircraft: 'Airbus A320neo', stand: 'Stand G04', arrival: 'COMPLETED', baggageOffload: 'COMPLETED', cargoHandling: 'PENDING', fuelSupply: 'PENDING', dispatchReady: 'PENDING' },
  { id: 'FLW-04', flightNumber: 'SPH-102', airline: 'Saphire Air', aircraft: 'Airbus A350-900', stand: 'Stand G10', arrival: 'COMPLETED', baggageOffload: 'COMPLETED', cargoHandling: 'COMPLETED', fuelSupply: 'COMPLETED', dispatchReady: 'COMPLETED' },
];

const INITIAL_ALERTS: LogisticsAlert[] = [
  {
    id: 'ALT-01',
    flightNumber: 'AI-203',
    severity: 'CRITICAL',
    type: 'CARGO_INCOMPLETE',
    title: 'Cargo Loading Incomplete',
    description: 'Container CTN-4821 tally in progress. Aircraft target departure in 28 mins.',
    actionLabel: 'Complete Cargo Loading',
  },
  {
    id: 'ALT-02',
    flightNumber: '6E-521',
    severity: 'WARNING',
    type: 'CAROUSEL_UNASSIGNED',
    title: 'Baggage Carousel Unallocated',
    description: 'Inbound passengers deplaning. Terminal 1 reclaim carousel not yet locked.',
    actionLabel: 'Assign Carousel',
  },
  {
    id: 'ALT-03',
    flightNumber: 'UK-901',
    severity: 'WARNING',
    type: 'FUEL_PENDING',
    title: 'Hydrant Dispenser Standby',
    description: 'Turnaround task TSK-F24 queued. Fuel bowser HYD-07 en route to Stand G04.',
    actionLabel: 'Check Fuel Telemetry',
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const LogisticsDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Navigation tab based on hash
  const [activeTab, setActiveTab] = useState<'overview' | 'cargo' | 'baggage' | 'fuel' | 'timeline' | 'notifications' | 'profile'>('overview');

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (['cargo', 'baggage', 'fuel', 'timeline', 'notifications', 'profile'].includes(hash)) {
      setActiveTab(hash as any);
    } else {
      setActiveTab('overview');
    }
  }, [location.hash]);

  // Core Data States
  const [cargoList, setCargoList] = useState<CargoRecord[]>(INITIAL_CARGO);
  const [carousels, setCarousels] = useState<CarouselRecord[]>(INITIAL_CAROUSELS);
  const [fuelLogs, setFuelLogs] = useState<FuelSupplyLog[]>(INITIAL_FUEL_LOGS);
  const [logisticsFlows, setLogisticsFlows] = useState<FlightLogisticsFlow[]>(INITIAL_FLOWS);
  const [alerts, setAlerts] = useState<LogisticsAlert[]>(INITIAL_ALERTS);

  // Filter states
  const [cargoFilter, setCargoFilter] = useState<'ALL' | 'ACTIVE' | 'LOADED'>('ALL');
  const [carouselFilter, setCarouselFilter] = useState<'ALL' | 'ACTIVE' | 'AVAILABLE'>('ALL');

  // Modal 1: Cargo Container Create / Edit
  const [cargoModalOpen, setCargoModalOpen] = useState(false);
  const [selectedCargoFlight, setSelectedCargoFlight] = useState<string>('AI-203');
  const [containerIdInput, setContainerIdInput] = useState<string>('CTN-8840');
  const [cargoTypeInput, setCargoTypeInput] = useState<'CARGO' | 'MAIL' | 'BAGGAGE'>('CARGO');
  const [cargoWeightInput, setCargoWeightInput] = useState<number>(1420);
  const [cargoStatusInput, setCargoStatusInput] = useState<CargoStatus>('LOADING');

  // Modal 2: Carousel Reclaim Allocation
  const [carouselModalOpen, setCarouselModalOpen] = useState(false);
  const [selectedCarouselNumber, setSelectedCarouselNumber] = useState<string>('C03');
  const [carouselFlightInput, setCarouselFlightInput] = useState<string>('6E-521');

  // Open Cargo Modal
  const handleOpenCargoModal = (record?: CargoRecord) => {
    if (record) {
      setSelectedCargoFlight(record.flightNumber);
      setContainerIdInput(record.containerId);
      setCargoTypeInput(record.cargoType);
      setCargoWeightInput(record.weightKg);
      setCargoStatusInput(record.status);
    } else {
      setSelectedCargoFlight('UK-901');
      setContainerIdInput(`CTN-${Math.floor(1000 + Math.random() * 9000)}`);
      setCargoTypeInput('CARGO');
      setCargoWeightInput(1200);
      setCargoStatusInput('LOADING');
    }
    setCargoModalOpen(true);
  };

  // Save / Update Cargo Record
  const handleSaveCargo = () => {
    if (!containerIdInput.trim()) {
      toast.error('Container ID is required');
      return;
    }

    const existingIndex = cargoList.findIndex((c) => c.containerId === containerIdInput);
    if (existingIndex >= 0) {
      const updated = [...cargoList];
      updated[existingIndex] = {
        ...updated[existingIndex],
        flightNumber: selectedCargoFlight,
        cargoType: cargoTypeInput,
        weightKg: cargoWeightInput,
        status: cargoStatusInput,
      };
      setCargoList(updated);
    } else {
      const newRecord: CargoRecord = {
        id: `CRG-${Date.now().toString().slice(-4)}`,
        flightNumber: selectedCargoFlight,
        airline: selectedCargoFlight === 'AI-203' ? 'Air India' : selectedCargoFlight === '6E-521' ? 'IndiGo' : 'Vistara',
        containerId: containerIdInput,
        cargoType: cargoTypeInput,
        weightKg: cargoWeightInput,
        description: 'New pallet container manifest registered',
        status: cargoStatusInput,
      };
      setCargoList([newRecord, ...cargoList]);
    }

    // If loaded, update timeline and clear cargo alert
    if (cargoStatusInput === 'LOADED') {
      setLogisticsFlows(
        logisticsFlows.map((f) =>
          f.flightNumber === selectedCargoFlight ? { ...f, cargoHandling: 'COMPLETED' } : f
        )
      );
      setAlerts(alerts.filter((a) => !(a.flightNumber === selectedCargoFlight && a.type === 'CARGO_INCOMPLETE')));
    }

    // Cross-dashboard audit log
    aocsDataStore.logAuditEvent(
      'TASK',
      `Cargo Container ${containerIdInput} (${cargoWeightInput} kg, ${cargoTypeInput}) manifested for ${selectedCargoFlight} - Status: ${cargoStatusInput}`,
      selectedCargoFlight,
      user?.fullName || 'Cargo Ramp Supervisor'
    );

    toast.success(`Cargo Manifest Recorded: ${containerIdInput} (${cargoWeightInput} kg) ➔ ${selectedCargoFlight}`);
    setCargoModalOpen(false);
  };

  // Open Carousel Modal
  const handleOpenCarouselModal = (carousel?: CarouselRecord) => {
    if (carousel) {
      setSelectedCarouselNumber(carousel.carouselNumber);
    }
    setCarouselModalOpen(true);
  };

  // Save Carousel Assignment
  const handleSaveCarouselAssignment = () => {
    const updated = carousels.map((c) => {
      if (c.carouselNumber === selectedCarouselNumber) {
        return {
          ...c,
          status: 'ARRIVING' as CarouselStatus,
          flightNumber: carouselFlightInput,
          airline: carouselFlightInput === '6E-521' ? 'IndiGo' : 'Air India',
          origin: carouselFlightInput === '6E-521' ? 'Bengaluru (BLR)' : 'Delhi (DEL)',
          bagsCount: 156,
          eta: 'Arriving in 12 mins',
        };
      }
      return c;
    });
    setCarousels(updated);

    // Clear carousel unassigned alert
    setAlerts(alerts.filter((a) => !(a.flightNumber === carouselFlightInput && a.type === 'CAROUSEL_UNASSIGNED')));

    // Cross-dashboard audit log
    aocsDataStore.logAuditEvent(
      'GATE',
      `Baggage Reclaim Carousel ${selectedCarouselNumber} assigned to arriving flight ${carouselFlightInput}`,
      carouselFlightInput,
      user?.fullName || 'Baggage Services Lead'
    );

    toast.success(`Baggage Reclaim Assigned: Flight ${carouselFlightInput} ➔ Carousel ${selectedCarouselNumber}`);
    setCarouselModalOpen(false);
  };

  // Handle Action in Attention Panel
  const handleResolveAlert = (alert: LogisticsAlert) => {
    if (alert.type === 'CARGO_INCOMPLETE') {
      const match = cargoList.find((c) => c.flightNumber === alert.flightNumber);
      handleOpenCargoModal(match);
    } else if (alert.type === 'CAROUSEL_UNASSIGNED') {
      setCarouselFlightInput(alert.flightNumber);
      handleOpenCarouselModal();
    } else if (alert.type === 'FUEL_PENDING') {
      navigate('/dashboard/logistics#fuel');
      toast.success('Navigated to Fuel Supply Telemetry');
    }
  };

  return (
    <DashboardLayout activeRole="logistics">
      {/* ===================================================================== */}
      {/* TOP HEADER & RAMP SUPPLY TELEMETRY                                    */}
      {/* ===================================================================== */}
      <Box sx={{ mb: 3.5, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Chip
              icon={<Truck size={14} color="#0284C7" />}
              label="AIRPORT LOGISTICS & RAMP SUPPLY"
              size="small"
              sx={{
                bgcolor: 'rgba(2, 132, 199, 0.08)',
                color: '#0284C7',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: '0.72rem',
                border: '1px solid rgba(2, 132, 199, 0.2)',
              }}
            />
            <Typography sx={{ fontSize: '0.76rem', color: '#94A3B8', fontWeight: 600 }}>
              Live Supply Chain & Turnaround Feeds • 19 Sep 12:18 IST
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', letterSpacing: '-0.02em' }}>
            Logistics, Cargo & Baggage Operations
          </Typography>
          <Typography sx={{ fontSize: '0.86rem', color: '#64748B', mt: 0.2 }}>
            ULD Container Manifests • Baggage Reclaim Belts • Ramp Fuel Supply Monitoring
          </Typography>
        </Box>

        {/* Global Action */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<Package size={16} />}
            onClick={() => handleOpenCargoModal()}
            sx={{
              backgroundColor: '#0F2942',
              color: '#FFFFFF',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: '0.82rem',
              borderRadius: '9px',
              px: 2.2,
              py: 1,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#1E3A5F' },
            }}
          >
            + New Cargo Manifest
          </Button>
        </Box>
      </Box>

      {/* ===================================================================== */}
      {/* 1. TOP KPI STRIP: STRICTLY 4 COMPACT KPIS                             */}
      {/* ===================================================================== */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5, mb: 3.5 }}>
        {/* KPI 1: Active Operations */}
        <Card
          elevation={0}
          onClick={() => setCargoFilter(cargoFilter === 'ACTIVE' ? 'ALL' : 'ACTIVE')}
          sx={{
            p: 2.5,
            backgroundColor: cargoFilter === 'ACTIVE' ? '#F0F9FF' : '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid',
            borderColor: cargoFilter === 'ACTIVE' ? '#0284C7' : '#E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'translateY(-2px)', borderColor: '#0284C7' },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
              {cargoList.filter((c) => c.status !== 'LOADED').length + carousels.filter((c) => c.status !== 'AVAILABLE').length}
            </Typography>
            <Chip label="ACTIVE OPS" size="small" sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 800, fontSize: '0.68rem' }} />
          </Box>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#475569', mt: 0.5 }}>
            Active Operations
          </Typography>
          <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
            Ramp loading & apron supply runs
          </Typography>
        </Card>

        {/* KPI 2: Cargo Manifests */}
        <Card
          elevation={0}
          onClick={() => setCargoFilter(cargoFilter === 'LOADED' ? 'ALL' : 'LOADED')}
          sx={{
            p: 2.5,
            backgroundColor: cargoFilter === 'LOADED' ? '#F0FDF4' : '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid',
            borderColor: cargoFilter === 'LOADED' ? '#10B981' : '#E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'translateY(-2px)', borderColor: '#10B981' },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0284C7' }}>
              {cargoList.length}
            </Typography>
            <Chip label="CONTAINERS" size="small" sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 800, fontSize: '0.68rem' }} />
          </Box>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#475569', mt: 0.5 }}>
            Cargo Manifests
          </Typography>
          <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
            Total weight: {cargoList.reduce((acc, c) => acc + c.weightKg, 0).toLocaleString()} kg allocated
          </Typography>
        </Card>

        {/* KPI 3: Baggage Carousels */}
        <Card
          elevation={0}
          onClick={() => setCarouselFilter(carouselFilter === 'ACTIVE' ? 'ALL' : 'ACTIVE')}
          sx={{
            p: 2.5,
            backgroundColor: carouselFilter === 'ACTIVE' ? '#F0FDF4' : '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid',
            borderColor: carouselFilter === 'ACTIVE' ? '#10B981' : '#E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'translateY(-2px)', borderColor: '#10B981' },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
              {carousels.length}
            </Typography>
            <Chip label={`${carousels.filter((c) => c.status !== 'AVAILABLE').length} ACTIVE`} size="small" sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '0.68rem' }} />
          </Box>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#475569', mt: 0.5 }}>
            Baggage Carousels
          </Typography>
          <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
            Terminal 1 & 2 arrival reclaim belts
          </Typography>
        </Card>

        {/* KPI 4: Attention Required */}
        <Card
          elevation={0}
          onClick={() => setActiveTab('overview')}
          sx={{
            p: 2.5,
            backgroundColor: alerts.length > 0 ? '#FEF2F2' : '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid',
            borderColor: alerts.length > 0 ? '#DC2626' : '#E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'translateY(-2px)', borderColor: '#DC2626' },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: alerts.length > 0 ? '#DC2626' : '#10B981' }}>
              {alerts.length}
            </Typography>
            <Chip
              label={alerts.length > 0 ? 'REQUIRED' : 'ALL NOMINAL'}
              size="small"
              sx={{
                bgcolor: alerts.length > 0 ? '#FEE2E2' : '#DCFCE7',
                color: alerts.length > 0 ? '#DC2626' : '#15803D',
                fontWeight: 800,
                fontSize: '0.68rem',
              }}
            />
          </Box>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: alerts.length > 0 ? '#DC2626' : '#475569', mt: 0.5 }}>
            Attention Required
          </Typography>
          <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
            {alerts.length > 0 ? `${alerts.length} bottlenecks needing resolution` : 'Zero logistics bottlenecks detected'}
          </Typography>
        </Card>
      </Box>

      {/* ===================================================================== */}
      {/* 2. PRIMARY HOMEPAGE CONSOLE                                           */}
      {/* ===================================================================== */}
      {activeTab === 'overview' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          {/* Row 1: Left Split (Cargo Board & Baggage Flow) / Right Attention Panel */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '6.5fr 3.5fr' }, gap: 3 }}>
            {/* Left Stack */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* 2A. CARGO OPERATIONS BOARD */}
              <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <Box sx={{ p: 2.5, borderBottom: '1px solid #E2E8F0', backgroundColor: '#FAFAFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                      Cargo Operations & Manifest Board
                    </Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: '#64748B' }}>
                      Active pallet and container load status per scheduled aircraft.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {cargoFilter !== 'ALL' && (
                      <Chip
                        label={`Filter: ${cargoFilter}`}
                        size="small"
                        onDelete={() => setCargoFilter('ALL')}
                        sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 700 }}
                      />
                    )}
                    <Chip label={`${cargoList.length} Manifests`} size="small" sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 800 }} />
                  </Box>
                </Box>

                <TableContainer sx={{ overflowX: 'hidden' }}>
                  <Table size="small" sx={{ width: '100%', tableLayout: 'fixed', '& .MuiTableCell-root': { py: 1.5, px: 1.5 } }}>
                    <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                      <TableRow>
                        <TableCell sx={{ width: '22%', pl: 2.5, fontWeight: 800, color: '#64748B', fontSize: '0.72rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>FLIGHT</TableCell>
                        <TableCell sx={{ width: '24%', fontWeight: 800, color: '#64748B', fontSize: '0.72rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>CONTAINER ID</TableCell>
                        <TableCell sx={{ width: '18%', fontWeight: 800, color: '#64748B', fontSize: '0.72rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>WEIGHT</TableCell>
                        <TableCell sx={{ width: '22%', fontWeight: 800, color: '#64748B', fontSize: '0.72rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>STATUS</TableCell>
                        <TableCell align="right" sx={{ width: '14%', pr: 2.5, fontWeight: 800, color: '#64748B', fontSize: '0.72rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>ACTION</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cargoList
                        .filter((c) => (cargoFilter === 'ALL' ? true : cargoFilter === 'ACTIVE' ? c.status !== 'LOADED' : c.status === 'LOADED'))
                        .map((c) => (
                        <TableRow key={c.id} hover sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(2, 132, 199, 0.04)' } }}>
                          <TableCell sx={{ pl: 2.5, whiteSpace: 'nowrap' }}>
                            <Typography sx={{ fontWeight: 800, color: '#0F2942', fontSize: '0.88rem', lineHeight: 1.2 }}>{c.flightNumber}</Typography>
                            <Typography sx={{ fontSize: '0.72rem', color: '#64748B', mt: 0.2 }}>{c.airline}</Typography>
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Typography sx={{ fontFamily: "'Inter', monospace", fontWeight: 700, fontSize: '0.84rem', color: '#0284C7' }}>
                              {c.containerId}
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8' }}>{c.cargoType}</Typography>
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#0F2942' }}>
                              {c.weightKg.toLocaleString()} kg
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Chip
                              label={c.status === 'LOADING' ? '● LOADING' : c.status === 'LOADED' ? '✓ LOADED' : '○ PENDING'}
                              size="small"
                              sx={{
                                fontWeight: 800,
                                fontSize: '0.66rem',
                                bgcolor: c.status === 'LOADED' ? '#DCFCE7' : c.status === 'LOADING' ? '#E0F2FE' : '#F1F5F9',
                                color: c.status === 'LOADED' ? '#15803D' : c.status === 'LOADING' ? '#0369A1' : '#64748B',
                              }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ pr: 2.5, whiteSpace: 'nowrap' }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleOpenCargoModal(c)}
                              sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.72rem', borderRadius: '6px', px: 1.5 }}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>

              {/* 2B. BAGGAGE FLOW: VISUAL CAROUSEL ALLOCATION BOARD */}
              <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1.5, borderBottom: '1px solid #E2E8F0' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                      Baggage Reclaim Flow (Terminal 1 & 2)
                    </Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: '#64748B' }}>
                      Physical reclaim carousel allocation for arriving passenger flights.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {carouselFilter !== 'ALL' && (
                      <Chip
                        label={`Filter: ${carouselFilter}`}
                        size="small"
                        onDelete={() => setCarouselFilter('ALL')}
                        sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 700 }}
                      />
                    )}
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleOpenCarouselModal()}
                      sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.74rem', borderRadius: '8px' }}
                    >
                      + Assign Carousel
                    </Button>
                  </Box>
                </Box>

                {/* Spatial Carousel Cards */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                  {carousels
                    .filter((car) =>
                      carouselFilter === 'ALL'
                        ? true
                        : carouselFilter === 'ACTIVE'
                        ? car.status !== 'AVAILABLE'
                        : car.status === 'AVAILABLE'
                    )
                    .map((car) => {
                    const isArrived = car.status === 'ARRIVED';
                    const isArriving = car.status === 'ARRIVING';
                    const isAvailable = car.status === 'AVAILABLE';

                    return (
                      <Box
                        key={car.id}
                        onClick={() => handleOpenCarouselModal(car)}
                        sx={{
                          p: 1.8,
                          borderRadius: '12px',
                          border: '1px solid',
                          borderColor: isArrived ? '#CBD5E1' : isArriving ? '#BAE6FD' : '#86EFAC',
                          backgroundColor: isArrived ? '#FFFFFF' : isArriving ? '#F0F9FF' : '#F0FDF4',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '0.98rem', color: '#0F2942' }}>
                            CAROUSEL {car.carouselNumber.replace('C', '')}
                          </Typography>
                          <Chip
                            label={car.status}
                            size="small"
                            sx={{
                              height: '18px',
                              fontSize: '0.62rem',
                              fontWeight: 800,
                              bgcolor: isArrived ? '#E0F2FE' : isArriving ? '#FEF3C7' : '#DCFCE7',
                              color: isArrived ? '#0369A1' : isArriving ? '#D97706' : '#15803D',
                            }}
                          />
                        </Box>

                        {isAvailable ? (
                          <Box sx={{ py: 1 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.84rem', color: '#16A34A' }}>
                              AVAILABLE
                            </Typography>
                            <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>
                              {car.terminal} • Ready
                            </Typography>
                          </Box>
                        ) : (
                          <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F2942' }}>
                              {car.flightNumber}
                            </Typography>
                            <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>
                              {car.origin}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, pt: 0.8, borderTop: '1px dashed #E2E8F0' }}>
                              <Typography sx={{ fontSize: '0.7rem', color: '#0284C7', fontWeight: 700 }}>
                                {car.bagsCount} Bags
                              </Typography>
                              <Typography sx={{ fontSize: '0.7rem', color: '#475569', fontWeight: 700 }}>
                                {car.eta}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Card>
            </Box>

            {/* Right Stack: 2C. LOGISTICS ATTENTION PANEL */}
            <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', p: 2.5, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1.5, borderBottom: '1px solid #E2E8F0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AlertTriangle size={18} color="#DC2626" />
                  <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                    Logistics Attention
                  </Typography>
                </Box>
                <Chip
                  label={`${alerts.length} Action Items`}
                  size="small"
                  sx={{ bgcolor: alerts.length > 0 ? '#FEE2E2' : '#DCFCE7', color: alerts.length > 0 ? '#DC2626' : '#15803D', fontWeight: 800 }}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8, flexGrow: 1 }}>
                {alerts.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <CheckCircle2 size={36} color="#10B981" style={{ margin: '0 auto', marginBottom: '8px' }} />
                    <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#0F2942', fontSize: '0.95rem' }}>
                      All Supply Flows Nominal
                    </Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: '#64748B', mt: 0.5 }}>
                      No cargo imbalances or unallocated baggage belts.
                    </Typography>
                  </Box>
                ) : (
                  alerts.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: item.severity === 'CRITICAL' ? '#FECACA' : '#FED7AA',
                        bgcolor: item.severity === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                        <Chip
                          label={item.flightNumber}
                          size="small"
                          sx={{
                            bgcolor: item.severity === 'CRITICAL' ? '#DC2626' : '#D97706',
                            color: '#FFFFFF',
                            fontWeight: 800,
                            fontSize: '0.68rem',
                            height: '20px',
                          }}
                        />
                        <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.84rem', color: '#0F2942' }}>
                          {item.title}
                        </Typography>
                      </Box>

                      <Typography sx={{ fontSize: '0.76rem', color: '#475569', lineHeight: 1.4, mb: 1.5 }}>
                        {item.description}
                      </Typography>

                      <Button
                        size="small"
                        variant="contained"
                        fullWidth
                        onClick={() => handleResolveAlert(item)}
                        sx={{
                          backgroundColor: item.severity === 'CRITICAL' ? '#DC2626' : '#D97706',
                          color: '#FFFFFF',
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          textTransform: 'none',
                          borderRadius: '8px',
                          py: 0.7,
                          '&:hover': { backgroundColor: item.severity === 'CRITICAL' ? '#B91C1C' : '#B45309' },
                        }}
                      >
                        {item.actionLabel}
                      </Button>
                    </Box>
                  ))
                )}
              </Box>
            </Card>
          </Box>

          {/* Row 2: Bottom Full Width 2D. FLIGHT LOGISTICS INTEGRATED TIMELINE */}
          <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, pb: 1.5, borderBottom: '1px solid #E2E8F0' }}>
              <Box>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                  Flight Logistics Turnaround Pipeline
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#64748B' }}>
                  End-to-end supply synchronization: Inbound Arrival ➔ Baggage Offload ➔ Cargo Handling ➔ Hydrant Fueling ➔ Dispatch Ready.
                </Typography>
              </Box>
              <Chip label="Cross-Operation Visibility" size="small" sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 800 }} />
            </Box>

            {/* Timeline Rows */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {logisticsFlows.map((flow) => (
                <Box
                  key={flow.id}
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    bgcolor: '#F8FAFC',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  {/* Left Flight Identity */}
                  <Box sx={{ minWidth: '180px' }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F2942' }}>
                      {flow.flightNumber} • {flow.stand}
                    </Typography>
                    <Typography sx={{ fontSize: '0.74rem', color: '#64748B' }}>
                      {flow.airline} · {flow.aircraft}
                    </Typography>
                  </Box>

                  {/* Horizontal Pipeline Steps */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', flexGrow: 1 }}>
                    {/* Step 1: Arrival */}
                    <Box sx={{ px: 1.4, py: 0.6, borderRadius: '8px', bgcolor: flow.arrival === 'COMPLETED' ? '#DCFCE7' : '#F1F5F9', border: '1px solid #CBD5E1', textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '0.64rem', color: '#64748B', fontWeight: 800 }}>1. ARRIVAL</Typography>
                      <Typography sx={{ fontSize: '0.76rem', color: flow.arrival === 'COMPLETED' ? '#15803D' : '#475569', fontWeight: 800 }}>✓ Docked</Typography>
                    </Box>

                    <ArrowRight size={14} color="#94A3B8" />

                    {/* Step 2: Baggage Offload */}
                    <Box sx={{ px: 1.4, py: 0.6, borderRadius: '8px', bgcolor: flow.baggageOffload === 'COMPLETED' ? '#DCFCE7' : flow.baggageOffload === 'IN_PROGRESS' ? '#E0F2FE' : '#F1F5F9', border: '1px solid #CBD5E1', textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '0.64rem', color: '#64748B', fontWeight: 800 }}>2. BAGGAGE</Typography>
                      <Typography sx={{ fontSize: '0.76rem', color: flow.baggageOffload === 'COMPLETED' ? '#15803D' : flow.baggageOffload === 'IN_PROGRESS' ? '#0369A1' : '#64748B', fontWeight: 800 }}>
                        {flow.baggageOffload === 'COMPLETED' ? '✓ Offloaded' : flow.baggageOffload === 'IN_PROGRESS' ? '● Unloading' : '○ Pending'}
                      </Typography>
                    </Box>

                    <ArrowRight size={14} color="#94A3B8" />

                    {/* Step 3: Cargo Handling */}
                    <Box sx={{ px: 1.4, py: 0.6, borderRadius: '8px', bgcolor: flow.cargoHandling === 'COMPLETED' ? '#DCFCE7' : flow.cargoHandling === 'IN_PROGRESS' ? '#E0F2FE' : '#F1F5F9', border: '1px solid #CBD5E1', textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '0.64rem', color: '#64748B', fontWeight: 800 }}>3. CARGO</Typography>
                      <Typography sx={{ fontSize: '0.76rem', color: flow.cargoHandling === 'COMPLETED' ? '#15803D' : flow.cargoHandling === 'IN_PROGRESS' ? '#0369A1' : '#64748B', fontWeight: 800 }}>
                        {flow.cargoHandling === 'COMPLETED' ? '✓ Manifested' : flow.cargoHandling === 'IN_PROGRESS' ? '● Loading' : '○ Standby'}
                      </Typography>
                    </Box>

                    <ArrowRight size={14} color="#94A3B8" />

                    {/* Step 4: Fuel Supply */}
                    <Box sx={{ px: 1.4, py: 0.6, borderRadius: '8px', bgcolor: flow.fuelSupply === 'COMPLETED' ? '#DCFCE7' : flow.fuelSupply === 'IN_PROGRESS' ? '#E0F2FE' : '#F1F5F9', border: '1px solid #CBD5E1', textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '0.64rem', color: '#64748B', fontWeight: 800 }}>4. FUEL</Typography>
                      <Typography sx={{ fontSize: '0.76rem', color: flow.fuelSupply === 'COMPLETED' ? '#15803D' : flow.fuelSupply === 'IN_PROGRESS' ? '#0369A1' : '#64748B', fontWeight: 800 }}>
                        {flow.fuelSupply === 'COMPLETED' ? '✓ Hydrant Pumped' : flow.fuelSupply === 'IN_PROGRESS' ? '● Dispensing' : '○ Standby'}
                      </Typography>
                    </Box>

                    <ArrowRight size={14} color="#94A3B8" />

                    {/* Step 5: Dispatch Ready */}
                    <Box sx={{ px: 1.4, py: 0.6, borderRadius: '8px', bgcolor: flow.dispatchReady === 'COMPLETED' ? '#DCFCE7' : flow.dispatchReady === 'IN_PROGRESS' ? '#FEF3C7' : '#F1F5F9', border: '1px solid #CBD5E1', textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '0.64rem', color: '#64748B', fontWeight: 800 }}>5. DISPATCH</Typography>
                      <Typography sx={{ fontSize: '0.76rem', color: flow.dispatchReady === 'COMPLETED' ? '#15803D' : flow.dispatchReady === 'IN_PROGRESS' ? '#D97706' : '#64748B', fontWeight: 800 }}>
                        {flow.dispatchReady === 'COMPLETED' ? '✓ Ready' : flow.dispatchReady === 'IN_PROGRESS' ? '● Pre-flight' : '○ Awaiting'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Box>
      )}

      {/* ===================================================================== */}
      {/* 3. SUBVIEW: CARGO MANIFEST REGISTRY (#cargo)                          */}
      {/* ===================================================================== */}
      {activeTab === 'cargo' && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mb: 0.5 }}>
              Cargo Manifests & Container Registry
            </Typography>
            <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
              Full operational list of active Unit Load Devices (ULDs), containers, and belly-hold cargo manifests.
            </Typography>
          </Box>

          <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                All Registered Cargo Loads ({cargoList.length})
              </Typography>
              <Button
                variant="contained"
                onClick={() => handleOpenCargoModal()}
                sx={{ bgcolor: '#0F2942', textTransform: 'none', fontWeight: 700, borderRadius: '8px' }}
              >
                + Add Container Record
              </Button>
            </Box>

            <TableContainer sx={{ overflowX: 'hidden' }}>
              <Table size="small" sx={{ width: '100%', tableLayout: 'fixed', '& .MuiTableCell-root': { py: 1.5, px: 1.5 } }}>
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ width: '18%', pl: 2.5, fontWeight: 800, color: '#64748B', fontSize: '0.72rem' }}>CONTAINER ID</TableCell>
                    <TableCell sx={{ width: '18%', fontWeight: 800, color: '#64748B', fontSize: '0.72rem' }}>FLIGHT</TableCell>
                    <TableCell sx={{ width: '16%', fontWeight: 800, color: '#64748B', fontSize: '0.72rem' }}>CARGO TYPE</TableCell>
                    <TableCell sx={{ width: '16%', fontWeight: 800, color: '#64748B', fontSize: '0.72rem' }}>WEIGHT (KG)</TableCell>
                    <TableCell sx={{ width: '18%', fontWeight: 800, color: '#64748B', fontSize: '0.72rem' }}>STATUS</TableCell>
                    <TableCell align="right" sx={{ width: '14%', pr: 2.5, fontWeight: 800, color: '#64748B', fontSize: '0.72rem' }}>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cargoList.map((c) => (
                    <TableRow key={c.id} hover sx={{ cursor: 'pointer' }}>
                      <TableCell sx={{ pl: 2.5, whiteSpace: 'nowrap' }}>
                        <Typography sx={{ fontFamily: "'Inter', monospace", fontWeight: 800, color: '#0284C7' }}>
                          {c.containerId}
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>{c.description}</Typography>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Typography sx={{ fontWeight: 800, color: '#0F2942' }}>{c.flightNumber}</Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>{c.airline}</Typography>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Chip label={c.cargoType} size="small" sx={{ fontWeight: 800, fontSize: '0.66rem' }} />
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Typography sx={{ fontWeight: 800, color: '#0F2942' }}>
                          {c.weightKg.toLocaleString()} kg
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Chip
                          label={c.status}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: '0.66rem',
                            bgcolor: c.status === 'LOADED' ? '#DCFCE7' : c.status === 'LOADING' ? '#E0F2FE' : '#F1F5F9',
                            color: c.status === 'LOADED' ? '#15803D' : c.status === 'LOADING' ? '#0369A1' : '#64748B',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 2.5, whiteSpace: 'nowrap' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleOpenCargoModal(c)}
                          sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.72rem', borderRadius: '6px' }}
                        >
                          Modify
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      )}

      {/* ===================================================================== */}
      {/* 4. SUBVIEW: BAGGAGE CAROUSEL RECLAIM HALL (#baggage)                   */}
      {/* ===================================================================== */}
      {activeTab === 'baggage' && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mb: 0.5 }}>
              Baggage Reclaim Carousel Allocation Hall
            </Typography>
            <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
              Assign and monitor passenger reclaim belts across Terminal 1 and Terminal 2.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {carousels.map((car) => (
              <Card key={car.id} elevation={0} sx={{ p: 3, backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, color: '#0F2942' }}>
                    CAROUSEL {car.carouselNumber}
                  </Typography>
                  <Chip
                    label={car.status}
                    size="small"
                    sx={{
                      fontWeight: 800,
                      bgcolor: car.status === 'ARRIVED' ? '#DCFCE7' : car.status === 'ARRIVING' ? '#FEF3C7' : '#E0F2FE',
                      color: car.status === 'ARRIVED' ? '#15803D' : car.status === 'ARRIVING' ? '#D97706' : '#0369A1',
                    }}
                  />
                </Box>

                <Typography sx={{ fontSize: '0.82rem', color: '#64748B', mb: 2 }}>
                  {car.terminal} • Reclaim Hall Concourse
                </Typography>

                {car.flightNumber ? (
                  <Box sx={{ p: 2, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', mb: 2 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0F2942' }}>{car.flightNumber}</Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>{car.airline} • From {car.origin}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 0.8, borderTop: '1px dashed #E2E8F0' }}>
                      <Typography sx={{ fontSize: '0.74rem', color: '#0284C7', fontWeight: 700 }}>{car.bagsCount} Luggage Bags</Typography>
                      <Typography sx={{ fontSize: '0.74rem', color: '#475569', fontWeight: 700 }}>{car.eta}</Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ p: 2, borderRadius: '12px', bgcolor: '#F0FDF4', border: '1px solid #BBF7D0', mb: 2, textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 800, color: '#15803D', fontSize: '0.9rem' }}>AVAILABLE FOR ASSIGNMENT</Typography>
                    <Typography sx={{ fontSize: '0.74rem', color: '#166534', mt: 0.3 }}>Conveyor test nominal</Typography>
                  </Box>
                )}

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleOpenCarouselModal(car)}
                  sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px' }}
                >
                  {car.flightNumber ? 'Reassign Carousel' : 'Assign Arriving Flight'}
                </Button>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* ===================================================================== */}
      {/* 5. SUBVIEW: FUEL OPERATIONS MONITORING (#fuel)                        */}
      {/* ===================================================================== */}
      {activeTab === 'fuel' && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mb: 0.5 }}>
              Ramp Fuel Supply & Dispatch Monitoring
            </Typography>
            <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
              Logistics supply telemetry: Hydrant bowser status, volume pumped, and density calibration records from <code>FUEL_LOGS</code>.
            </Typography>
          </Box>

          <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', p: 3 }}>
            <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mb: 2 }}>
              Fuel Operations Audit Records
            </Typography>

            <TableContainer sx={{ overflowX: 'hidden' }}>
              <Table size="small" sx={{ width: '100%', tableLayout: 'fixed', '& .MuiTableCell-root': { py: 1.5, px: 1.5 } }}>
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ width: '18%', pl: 2.5, fontWeight: 800, color: '#64748B', fontSize: '0.72rem' }}>FLIGHT / STAND</TableCell>
                    <TableCell sx={{ width: '18%', fontWeight: 800, color: '#64748B', fontSize: '0.72rem' }}>TASK ID</TableCell>
                    <TableCell sx={{ width: '18%', fontWeight: 800, color: '#64748B', fontSize: '0.72rem' }}>DISPENSER TRUCK</TableCell>
                    <TableCell sx={{ width: '18%', fontWeight: 800, color: '#64748B', fontSize: '0.72rem' }}>PUMPED VOLUME</TableCell>
                    <TableCell sx={{ width: '14%', fontWeight: 800, color: '#64748B', fontSize: '0.72rem' }}>DENSITY</TableCell>
                    <TableCell align="right" sx={{ width: '14%', pr: 2.5, fontWeight: 800, color: '#64748B', fontSize: '0.72rem' }}>STATUS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fuelLogs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell sx={{ pl: 2.5, whiteSpace: 'nowrap' }}>
                        <Typography sx={{ fontWeight: 800, color: '#0F2942' }}>{log.flightNumber}</Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#0284C7', fontWeight: 700 }}>{log.stand}</Typography>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Typography sx={{ fontFamily: "'Inter', monospace", fontWeight: 700, fontSize: '0.84rem' }}>{log.taskId}</Typography>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Typography sx={{ fontWeight: 700, color: '#334155', fontSize: '0.84rem' }}>{log.hydrantTruck}</Typography>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Typography sx={{ fontWeight: 800, color: '#0F2942' }}>{log.litersPumped.toLocaleString()} L</Typography>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Typography sx={{ fontWeight: 700, color: '#64748B', fontSize: '0.84rem' }}>{log.density} kg/L</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 2.5, whiteSpace: 'nowrap' }}>
                        <Chip
                          label={log.status}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: '0.66rem',
                            bgcolor: log.status === 'COMPLETED' ? '#DCFCE7' : log.status === 'PUMPING' ? '#E0F2FE' : '#F1F5F9',
                            color: log.status === 'COMPLETED' ? '#15803D' : log.status === 'PUMPING' ? '#0369A1' : '#64748B',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      )}

      {/* ===================================================================== */}
      {/* 6. SUBVIEW: LOGISTICS TIMELINE PIPELINE (#timeline)                   */}
      {/* ===================================================================== */}
      {activeTab === 'timeline' && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mb: 0.5 }}>
              Cross-Operation Turnaround Supply Pipeline
            </Typography>
            <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
              Linear flight lifecycle connecting arrival offload, cargo loading, fueling, and dispatch.
            </Typography>
          </Box>

          <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {logisticsFlows.map((flow) => (
                <Box key={flow.id} sx={{ p: 2, borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0F2942', mb: 1 }}>
                    {flow.flightNumber} · {flow.airline} ({flow.aircraft})
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#64748B', mb: 2 }}>
                    Assigned Stand: <strong style={{ color: '#0284C7' }}>{flow.stand}</strong>
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Chip label="1. Arrival: ✓ Done" size="small" sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800 }} />
                    <ArrowRight size={14} color="#94A3B8" />
                    <Chip
                      label={`2. Baggage: ${flow.baggageOffload === 'COMPLETED' ? '✓ Done' : '● Offloading'}`}
                      size="small"
                      sx={{ bgcolor: flow.baggageOffload === 'COMPLETED' ? '#DCFCE7' : '#E0F2FE', color: flow.baggageOffload === 'COMPLETED' ? '#15803D' : '#0369A1', fontWeight: 800 }}
                    />
                    <ArrowRight size={14} color="#94A3B8" />
                    <Chip
                      label={`3. Cargo: ${flow.cargoHandling === 'COMPLETED' ? '✓ Loaded' : '● Loading'}`}
                      size="small"
                      sx={{ bgcolor: flow.cargoHandling === 'COMPLETED' ? '#DCFCE7' : '#E0F2FE', color: flow.cargoHandling === 'COMPLETED' ? '#15803D' : '#0369A1', fontWeight: 800 }}
                    />
                    <ArrowRight size={14} color="#94A3B8" />
                    <Chip
                      label={`4. Fuel: ${flow.fuelSupply === 'COMPLETED' ? '✓ Supplied' : '○ Standby'}`}
                      size="small"
                      sx={{ bgcolor: flow.fuelSupply === 'COMPLETED' ? '#DCFCE7' : '#F1F5F9', color: flow.fuelSupply === 'COMPLETED' ? '#15803D' : '#64748B', fontWeight: 800 }}
                    />
                    <ArrowRight size={14} color="#94A3B8" />
                    <Chip
                      label={`5. Dispatch: ${flow.dispatchReady === 'COMPLETED' ? '✓ Cleared' : '○ Pending'}`}
                      size="small"
                      sx={{ bgcolor: flow.dispatchReady === 'COMPLETED' ? '#DCFCE7' : '#F1F5F9', color: flow.dispatchReady === 'COMPLETED' ? '#15803D' : '#64748B', fontWeight: 800 }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Box>
      )}

      {/* ===================================================================== */}
      {/* 7. SUBVIEW: NOTIFICATIONS (#notifications)                            */}
      {/* ===================================================================== */}
      {activeTab === 'notifications' && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mb: 0.5 }}>
              Logistics Notifications & Telemetry Feed
            </Typography>
            <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
              Real-time audit alerts on ULD loading, belt allocations, and fuel supply dispatches.
            </Typography>
          </Box>

          <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { id: 'NOTIF-L1', time: '12:15 IST', title: 'Container CTN-4821 assigned to Flight AI-203 hold', type: 'INFO' },
                { id: 'NOTIF-L2', time: '12:05 IST', title: 'Carousel C02 allocated for IndiGo 6E-521 deplaning', type: 'SUCCESS' },
                { id: 'NOTIF-L3', time: '11:50 IST', title: 'Hydrant bowser HYD-04 recorded 9,950 L dispensed at Stand G12', type: 'INFO' },
                { id: 'NOTIF-L4', time: '11:35 IST', title: 'Diplomatic mail container CTN-5509 sealed and loaded on SPH-102', type: 'SUCCESS' },
              ].map((n) => (
                <Box key={n.id} sx={{ p: 2, borderRadius: '10px', border: '1px solid #E2E8F0', bgcolor: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', bgcolor: n.type === 'SUCCESS' ? '#10B981' : '#0284C7' }} />
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: '#0F2942' }}>{n.title}</Typography>
                      <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8' }}>Logged by Baggage & Ramp Logistics</Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>{n.time}</Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Box>
      )}

      {/* ===================================================================== */}
      {/* 8. SUBVIEW: LOGISTICS SUPERVISOR PROFILE (#profile)                   */}
      {/* ===================================================================== */}
      {activeTab === 'profile' && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mb: 0.5 }}>
              Logistics Supervisor Profile
            </Typography>
            <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
              Certified Baggage & Ramp Cargo Logistics credentials.
            </Typography>
          </Box>

          <Card elevation={0} sx={{ p: 3.5, backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', maxWidth: '700px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
              <Box sx={{ width: '64px', height: '64px', borderRadius: '50%', bgcolor: '#0284C7', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800 }}>
                PK
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                  Priya Kumar
                </Typography>
                <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
                  Logistics Supervisor • Baggage & Cargo Services
                </Typography>
                <Chip label="Badge #LOG-7702" size="small" sx={{ mt: 0.5, bgcolor: '#F1F5F9', fontWeight: 800, fontSize: '0.7rem' }} />
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, pt: 2, borderTop: '1px solid #E2E8F0' }}>
              <Box>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700 }}>DEPARTMENT</Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#0F2942', fontWeight: 800 }}>Baggage & Ground Logistics (Dept 3)</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700 }}>STATION ASSIGNMENT</Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#15803D', fontWeight: 800 }}>Terminal 1 & 2 Baggage Reclaim Hall</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700 }}>DUTY SHIFT</Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#0F2942', fontWeight: 800 }}>Day Shift (06:00 - 15:00)</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700 }}>DATABASE ROLE</Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#0284C7', fontWeight: 800 }}>BAGGAGE_HANDLER (user_3_priya)</Typography>
              </Box>
            </Box>
          </Card>
        </Box>
      )}

      {/* ===================================================================== */}
      {/* 9. MODAL: CARGO MANIFEST / CONTAINER REGISTRATION                     */}
      {/* ===================================================================== */}
      <Dialog
        open={cargoModalOpen}
        onClose={() => setCargoModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '18px', p: 1 } } }}
      >
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
              Record Cargo Container Manifest
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
              Associate container ULD with flight, record weight, and track ramp loading.
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setCargoModalOpen(false)}>
            <X size={18} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          <TextField
            select
            label="Associated Flight"
            fullWidth
            size="small"
            value={selectedCargoFlight}
            onChange={(e) => setSelectedCargoFlight(e.target.value)}
          >
            {['AI-203', '6E-521', 'UK-901', 'SPH-102', 'BA-142', 'EK-506'].map((flt) => (
              <MenuItem key={flt} value={flt}>
                {flt}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Container ID (e.g. CTN-4821 or ULD-8802)"
            fullWidth
            size="small"
            value={containerIdInput}
            onChange={(e) => setContainerIdInput(e.target.value)}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              select
              label="Cargo Type"
              fullWidth
              size="small"
              value={cargoTypeInput}
              onChange={(e) => setCargoTypeInput(e.target.value as any)}
            >
              <MenuItem value="CARGO">Commercial Cargo</MenuItem>
              <MenuItem value="BAGGAGE">Passenger Baggage</MenuItem>
              <MenuItem value="MAIL">Air Mail</MenuItem>
            </TextField>

            <TextField
              label="Weight (kg)"
              type="number"
              fullWidth
              size="small"
              value={cargoWeightInput}
              onChange={(e) => setCargoWeightInput(Number(e.target.value))}
            />
          </Box>

          <TextField
            select
            label="Ramp Loading Status"
            fullWidth
            size="small"
            value={cargoStatusInput}
            onChange={(e) => setCargoStatusInput(e.target.value as any)}
          >
            <MenuItem value="PENDING">○ PENDING (Staged on Apron)</MenuItem>
            <MenuItem value="LOADING">● LOADING (In-transit to Aircraft Belly)</MenuItem>
            <MenuItem value="LOADED">✓ LOADED (Secured in Hold)</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 1, borderTop: '1px solid #E2E8F0' }}>
          <Button onClick={() => setCargoModalOpen(false)} sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveCargo}
            sx={{
              backgroundColor: '#0F2942',
              color: '#FFFFFF',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              borderRadius: '9px',
              px: 2.5,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#1E3A5F' },
            }}
          >
            Save Manifest Record
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================================== */}
      {/* 10. MODAL: BAGGAGE CAROUSEL ALLOCATION                                */}
      {/* ===================================================================== */}
      <Dialog
        open={carouselModalOpen}
        onClose={() => setCarouselModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '18px', p: 1 } } }}
      >
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Assign Baggage Reclaim Belt
          <IconButton size="small" onClick={() => setCarouselModalOpen(false)}>
            <X size={18} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          <TextField
            select
            label="Select Carousel"
            fullWidth
            size="small"
            value={selectedCarouselNumber}
            onChange={(e) => setSelectedCarouselNumber(e.target.value)}
          >
            {carousels.map((car) => (
              <MenuItem key={car.id} value={car.carouselNumber}>
                {car.carouselNumber} ({car.terminal}) — {car.status}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Arriving Inbound Flight"
            fullWidth
            size="small"
            value={carouselFlightInput}
            onChange={(e) => setCarouselFlightInput(e.target.value)}
          >
            {['6E-521', 'AI-203', 'UK-901', 'SPH-102', 'BA-142'].map((flt) => (
              <MenuItem key={flt} value={flt}>
                {flt}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 1, borderTop: '1px solid #E2E8F0' }}>
          <Button onClick={() => setCarouselModalOpen(false)} sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveCarouselAssignment}
            sx={{
              backgroundColor: '#0F2942',
              color: '#FFFFFF',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              borderRadius: '9px',
              px: 2.5,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#1E3A5F' },
            }}
          >
            Confirm Belt Allocation
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default LogisticsDashboard;
