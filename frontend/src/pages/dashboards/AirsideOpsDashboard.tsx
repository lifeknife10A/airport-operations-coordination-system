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
  Tooltip,
  Alert,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import {
  Plane,
  Sliders,
  Layers,
  Wind,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Compass,
  Radio,
  Sparkles,
  Filter,
  ExternalLink,
  MapPin,
  Check,
  Clock,
  UserCheck,
  Bell,
} from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { aocsDataStore } from '../../services/aocsDataStore';
import toast from 'react-hot-toast';
import { runwayApi, RunwayTelemetryData } from '../../api/runwayApi';

// ============================================================================
// TYPES & DATA STRUCTURES
// ============================================================================

export type GateStatus = 'OCCUPIED' | 'AVAILABLE' | 'STANDBY' | 'MAINTENANCE';
export type RunwayStatus = 'ACTIVE_CAT_III' | 'DEPARTURE_ONLY' | 'AVAILABLE' | 'SWEEP';

// The backend names runway modes differently from this screen; translate at the boundary.
const RUNWAY_STATUS_TO_BACKEND: Record<RunwayStatus, string> = {
  ACTIVE_CAT_III: 'ACTIVE_CAT_III',
  DEPARTURE_ONLY: 'DEPARTURE_ONLY',
  AVAILABLE: 'ARRIVALS_ONLY',
  SWEEP: 'SWEEP_FOD_INSPECTION',
};
const runwayStatusFromBackend = (raw: string | undefined, fallback: RunwayStatus): RunwayStatus => {
  switch (raw) {
    case 'ACTIVE_CAT_III': return 'ACTIVE_CAT_III';
    case 'DEPARTURE_ONLY': return 'DEPARTURE_ONLY';
    case 'ARRIVALS_ONLY': return 'AVAILABLE';
    case 'SWEEP_FOD_INSPECTION':
    case 'CLOSED_MAINTENANCE': return 'SWEEP';
    default: return fallback;
  }
};

export interface GateInfo {
  id: string;
  gateNumber: string;
  terminal: string;
  concourse: string;
  standNumber: string;
  hasJetbridge: boolean;
  maxWingspanMeters: number;
  status: GateStatus;
  assignedFlightNumber?: string;
  aircraft?: string;
  scheduledTime?: string;
}

export interface RunwayInfo {
  id: string;
  runwayCode: string;
  status: RunwayStatus;
  length: string;
  surfaceCondition: string;
  wind: string;
  crosswind: string;
  activeFlightNumber?: string;
  queueCount: number;
}

export interface AirsideFlight {
  id: string;
  flightNumber: string;
  airline: string;
  aircraft: string;
  wingspanMeters: number;
  stand: string;
  gateNumber: string;
  runwayCode: string; // '28L', '09R', '10L', '27R', or 'UNASSIGNED'
  flightType: 'DEPARTURE' | 'ARRIVAL';
  time: string; // e.g. '23:40'
  status: 'SCHEDULED' | 'BOARDING' | 'PUSHBACK' | 'TAXIING' | 'CLEARED';
  hasConflict: boolean;
  conflictReason?: string;
}

export interface OperationalConflict {
  id: string;
  flightNumber: string;
  type: 'GATE_CONFLICT' | 'RUNWAY_UNASSIGNED' | 'WINGSPAN_OVERSIZE';
  severity: 'CRITICAL' | 'WARNING';
  title: string;
  description: string;
  affectedGate?: string;
  affectedRunway?: string;
  suggestedGate?: string;
  suggestedRunway?: string;
}

// ============================================================================
// INITIAL SEED DATA
// ============================================================================

const INITIAL_GATES: GateInfo[] = [
  // Central Terminal - Concourse A (Domestic Pier - Stands G01 to G14)
  { id: 'G-A01', gateNumber: 'A01', terminal: 'Central Terminal', concourse: 'Concourse A', standNumber: 'Stand G01', hasJetbridge: true, maxWingspanMeters: 65.0, status: 'OCCUPIED', assignedFlightNumber: 'AI-203', aircraft: 'Boeing 787-8', scheduledTime: '23:40' },
  { id: 'G-A02', gateNumber: 'A02', terminal: 'Central Terminal', concourse: 'Concourse A', standNumber: 'Stand G02', hasJetbridge: true, maxWingspanMeters: 42.0, status: 'AVAILABLE' },
  { id: 'G-A03', gateNumber: 'A03', terminal: 'Central Terminal', concourse: 'Concourse A', standNumber: 'Stand G03', hasJetbridge: true, maxWingspanMeters: 42.0, status: 'OCCUPIED', assignedFlightNumber: 'SPH-102', aircraft: 'Airbus A350-900', scheduledTime: '00:15' },
  { id: 'G-A04', gateNumber: 'A04', terminal: 'Central Terminal', concourse: 'Concourse A', standNumber: 'Stand G04', hasJetbridge: true, maxWingspanMeters: 42.0, status: 'OCCUPIED', assignedFlightNumber: 'UK-901', aircraft: 'Airbus A320neo', scheduledTime: '23:55' },
  { id: 'G-A05', gateNumber: 'A05', terminal: 'Central Terminal', concourse: 'Concourse A', standNumber: 'Stand G05', hasJetbridge: false, maxWingspanMeters: 38.0, status: 'OCCUPIED', assignedFlightNumber: 'AF-225', aircraft: 'Boeing 777-300ER', scheduledTime: '01:10' },
  { id: 'G-A06', gateNumber: 'A06', terminal: 'Central Terminal', concourse: 'Concourse A', standNumber: 'Stand G06', hasJetbridge: true, maxWingspanMeters: 42.0, status: 'AVAILABLE' },
  { id: 'G-A07', gateNumber: 'A07', terminal: 'Central Terminal', concourse: 'Concourse A', standNumber: 'Stand G07', hasJetbridge: true, maxWingspanMeters: 42.0, status: 'OCCUPIED', assignedFlightNumber: '6E-521', aircraft: 'Airbus A321neo', scheduledTime: '23:42' },
  { id: 'G-A08', gateNumber: 'A08', terminal: 'Central Terminal', concourse: 'Concourse A', standNumber: 'Stand G08', hasJetbridge: false, maxWingspanMeters: 36.0, status: 'STANDBY' },
  { id: 'G-A09', gateNumber: 'A09', terminal: 'Central Terminal', concourse: 'Concourse A', standNumber: 'Stand G09', hasJetbridge: true, maxWingspanMeters: 42.0, status: 'AVAILABLE' },
  { id: 'G-A10', gateNumber: 'A10', terminal: 'Central Terminal', concourse: 'Concourse A', standNumber: 'Stand G10', hasJetbridge: true, maxWingspanMeters: 65.0, status: 'OCCUPIED', assignedFlightNumber: 'BA-142', aircraft: 'Boeing 787-9', scheduledTime: '00:30' },
  { id: 'G-A11', gateNumber: 'A11', terminal: 'Central Terminal', concourse: 'Concourse A', standNumber: 'Stand G11', hasJetbridge: false, maxWingspanMeters: 36.0, status: 'MAINTENANCE' },
  { id: 'G-A12', gateNumber: 'A12', terminal: 'Central Terminal', concourse: 'Concourse A', standNumber: 'Stand G12', hasJetbridge: true, maxWingspanMeters: 42.0, status: 'AVAILABLE' },
  { id: 'G-A13', gateNumber: 'A13', terminal: 'Central Terminal', concourse: 'Concourse A', standNumber: 'Stand G13', hasJetbridge: true, maxWingspanMeters: 36.0, status: 'AVAILABLE' },
  { id: 'G-A14', gateNumber: 'A14', terminal: 'Central Terminal', concourse: 'Concourse A', standNumber: 'Stand G14', hasJetbridge: true, maxWingspanMeters: 65.0, status: 'AVAILABLE' },

  // Central Terminal - Concourse B (Transcontinental Pier - Stands G15 to G30)
  { id: 'G-B01', gateNumber: 'B01', terminal: 'Central Terminal', concourse: 'Concourse B', standNumber: 'Stand G15', hasJetbridge: true, maxWingspanMeters: 65.0, status: 'OCCUPIED', assignedFlightNumber: 'EK-506', aircraft: 'Boeing 777-300ER', scheduledTime: '00:45' },
  { id: 'G-B02', gateNumber: 'B02', terminal: 'Central Terminal', concourse: 'Concourse B', standNumber: 'Stand G16', hasJetbridge: true, maxWingspanMeters: 42.0, status: 'AVAILABLE' },
  { id: 'G-B03', gateNumber: 'B03', terminal: 'Central Terminal', concourse: 'Concourse B', standNumber: 'Stand G17', hasJetbridge: true, maxWingspanMeters: 42.0, status: 'OCCUPIED', assignedFlightNumber: 'LH-760', aircraft: 'Airbus A350-900', scheduledTime: '01:25' },
  { id: 'G-B04', gateNumber: 'B04', terminal: 'Central Terminal', concourse: 'Concourse B', standNumber: 'Stand G18', hasJetbridge: false, maxWingspanMeters: 38.0, status: 'OCCUPIED', assignedFlightNumber: 'QR-557', aircraft: 'Airbus A330-300', scheduledTime: '01:40' },
  { id: 'G-B05', gateNumber: 'B05', terminal: 'Central Terminal', concourse: 'Concourse B', standNumber: 'Stand G19', hasJetbridge: true, maxWingspanMeters: 42.0, status: 'AVAILABLE' },
  { id: 'G-B06', gateNumber: 'B06', terminal: 'Central Terminal', concourse: 'Concourse B', standNumber: 'Stand G20', hasJetbridge: true, maxWingspanMeters: 42.0, status: 'OCCUPIED', assignedFlightNumber: 'SQ-402', aircraft: 'Boeing 787-10', scheduledTime: '02:00' },
  { id: 'G-B07', gateNumber: 'B07', terminal: 'Central Terminal', concourse: 'Concourse B', standNumber: 'Stand G21', hasJetbridge: true, maxWingspanMeters: 65.0, status: 'OCCUPIED', assignedFlightNumber: 'KL-871', aircraft: 'Boeing 777-200', scheduledTime: '02:15' },
  { id: 'G-B08', gateNumber: 'B08', terminal: 'Central Terminal', concourse: 'Concourse B', standNumber: 'Stand G22', hasJetbridge: false, maxWingspanMeters: 36.0, status: 'AVAILABLE' },
  { id: 'G-B09', gateNumber: 'B09', terminal: 'Central Terminal', concourse: 'Concourse B', standNumber: 'Stand G23', hasJetbridge: true, maxWingspanMeters: 42.0, status: 'OCCUPIED', assignedFlightNumber: 'TG-317', aircraft: 'Airbus A350-900', scheduledTime: '02:30' },
  { id: 'G-B10', gateNumber: 'B10', terminal: 'Central Terminal', concourse: 'Concourse B', standNumber: 'Stand G24', hasJetbridge: true, maxWingspanMeters: 42.0, status: 'OCCUPIED', assignedFlightNumber: 'MH-194', aircraft: 'Airbus A330-200', scheduledTime: '02:45' },
  { id: 'G-B11', gateNumber: 'B11', terminal: 'Central Terminal', concourse: 'Concourse B', standNumber: 'Stand G25', hasJetbridge: false, maxWingspanMeters: 36.0, status: 'STANDBY' },
  { id: 'G-B12', gateNumber: 'B12', terminal: 'Central Terminal', concourse: 'Concourse B', standNumber: 'Stand G26', hasJetbridge: true, maxWingspanMeters: 65.0, status: 'AVAILABLE' },
  { id: 'G-B13', gateNumber: 'B13', terminal: 'Central Terminal', concourse: 'Concourse B', standNumber: 'Stand G27', hasJetbridge: true, maxWingspanMeters: 42.0, status: 'AVAILABLE' },
  { id: 'G-B14', gateNumber: 'B14', terminal: 'Central Terminal', concourse: 'Concourse B', standNumber: 'Stand G28', hasJetbridge: true, maxWingspanMeters: 65.0, status: 'AVAILABLE' },
  { id: 'G-B15', gateNumber: 'B15', terminal: 'Central Terminal', concourse: 'Concourse B', standNumber: 'Stand G29', hasJetbridge: false, maxWingspanMeters: 36.0, status: 'AVAILABLE' },
  { id: 'G-B16', gateNumber: 'B16', terminal: 'Central Terminal', concourse: 'Concourse B', standNumber: 'Stand G30', hasJetbridge: true, maxWingspanMeters: 65.0, status: 'AVAILABLE' },

  // Central Terminal - Concourse C (Widebody Flagship Pier - Stands G31 to G48)
  { id: 'G-C01', gateNumber: 'C01', terminal: 'Central Terminal', concourse: 'Concourse C', standNumber: 'Stand G31', hasJetbridge: true, maxWingspanMeters: 80.0, status: 'OCCUPIED', assignedFlightNumber: 'EK-201', aircraft: 'Airbus A380-800', scheduledTime: '00:50' },
  { id: 'G-C02', gateNumber: 'C02', terminal: 'Central Terminal', concourse: 'Concourse C', standNumber: 'Stand G32', hasJetbridge: true, maxWingspanMeters: 65.0, status: 'AVAILABLE' },
  { id: 'G-C03', gateNumber: 'C03', terminal: 'Central Terminal', concourse: 'Concourse C', standNumber: 'Stand G33', hasJetbridge: true, maxWingspanMeters: 80.0, status: 'AVAILABLE' },
  { id: 'G-C04', gateNumber: 'C04', terminal: 'Central Terminal', concourse: 'Concourse C', standNumber: 'Stand G34', hasJetbridge: true, maxWingspanMeters: 75.0, status: 'OCCUPIED', assignedFlightNumber: 'BA-117', aircraft: 'Boeing 777-300ER', scheduledTime: '01:05' },
  { id: 'G-C05', gateNumber: 'C05', terminal: 'Central Terminal', concourse: 'Concourse C', standNumber: 'Stand G35', hasJetbridge: true, maxWingspanMeters: 65.0, status: 'AVAILABLE' },
  { id: 'G-C06', gateNumber: 'C06', terminal: 'Central Terminal', concourse: 'Concourse C', standNumber: 'Stand G36', hasJetbridge: true, maxWingspanMeters: 80.0, status: 'AVAILABLE' },
  { id: 'G-C07', gateNumber: 'C07', terminal: 'Central Terminal', concourse: 'Concourse C', standNumber: 'Stand G37', hasJetbridge: true, maxWingspanMeters: 75.0, status: 'AVAILABLE' },
  { id: 'G-C08', gateNumber: 'C08', terminal: 'Central Terminal', concourse: 'Concourse C', standNumber: 'Stand G38', hasJetbridge: true, maxWingspanMeters: 80.0, status: 'OCCUPIED', assignedFlightNumber: 'SQ-406', aircraft: 'Airbus A350-900', scheduledTime: '01:35' },
  { id: 'G-C09', gateNumber: 'C09', terminal: 'Central Terminal', concourse: 'Concourse C', standNumber: 'Stand G39', hasJetbridge: true, maxWingspanMeters: 65.0, status: 'AVAILABLE' },
  { id: 'G-C10', gateNumber: 'C10', terminal: 'Central Terminal', concourse: 'Concourse C', standNumber: 'Stand G40', hasJetbridge: true, maxWingspanMeters: 65.0, status: 'AVAILABLE' },
  { id: 'G-C11', gateNumber: 'C11', terminal: 'Central Terminal', concourse: 'Concourse C', standNumber: 'Stand G41', hasJetbridge: true, maxWingspanMeters: 80.0, status: 'AVAILABLE' },
  { id: 'G-C12', gateNumber: 'C12', terminal: 'Central Terminal', concourse: 'Concourse C', standNumber: 'Stand G42', hasJetbridge: true, maxWingspanMeters: 75.0, status: 'OCCUPIED', assignedFlightNumber: 'QR-571', aircraft: 'Boeing 777-200LR', scheduledTime: '01:50' },
  { id: 'G-C13', gateNumber: 'C13', terminal: 'Central Terminal', concourse: 'Concourse C', standNumber: 'Stand G43', hasJetbridge: true, maxWingspanMeters: 65.0, status: 'AVAILABLE' },
  { id: 'G-C14', gateNumber: 'C14', terminal: 'Central Terminal', concourse: 'Concourse C', standNumber: 'Stand G44', hasJetbridge: true, maxWingspanMeters: 65.0, status: 'STANDBY' },
  { id: 'G-C15', gateNumber: 'C15', terminal: 'Central Terminal', concourse: 'Concourse C', standNumber: 'Stand G45', hasJetbridge: true, maxWingspanMeters: 80.0, status: 'OCCUPIED', assignedFlightNumber: 'LH-772', aircraft: 'Boeing 747-8', scheduledTime: '02:20' },
  { id: 'G-C16', gateNumber: 'C16', terminal: 'Central Terminal', concourse: 'Concourse C', standNumber: 'Stand G46', hasJetbridge: true, maxWingspanMeters: 75.0, status: 'AVAILABLE' },
  { id: 'G-C17', gateNumber: 'C17', terminal: 'Central Terminal', concourse: 'Concourse C', standNumber: 'Stand G47', hasJetbridge: true, maxWingspanMeters: 65.0, status: 'AVAILABLE' },
  { id: 'G-C18', gateNumber: 'C18', terminal: 'Central Terminal', concourse: 'Concourse C', standNumber: 'Stand G48', hasJetbridge: true, maxWingspanMeters: 80.0, status: 'AVAILABLE' },
];

const INITIAL_RUNWAYS: RunwayInfo[] = [
  { id: 'RWY-28L', runwayCode: '28L', status: 'ACTIVE_CAT_III', length: '3,800m', surfaceCondition: 'DRY (Friction 0.84)', wind: '080° @ 12 kts', crosswind: '3 kts', activeFlightNumber: 'AI-203', queueCount: 2 },
  { id: 'RWY-09R', runwayCode: '09R', status: 'DEPARTURE_ONLY', length: '3,500m', surfaceCondition: 'DRY (Friction 0.81)', wind: '085° @ 11 kts', crosswind: '4 kts', activeFlightNumber: '6E-521', queueCount: 3 },
  { id: 'RWY-10L', runwayCode: '10L', status: 'AVAILABLE', length: '3,200m', surfaceCondition: 'NORMAL (Friction 0.80)', wind: '075° @ 10 kts', crosswind: '2 kts', activeFlightNumber: 'SPH-102', queueCount: 1 },
  { id: 'RWY-27R', runwayCode: '27R', status: 'SWEEP', length: '3,000m', surfaceCondition: 'MAINTENANCE (Radar FOD Scan)', wind: '080° @ 12 kts', crosswind: '3 kts', queueCount: 0 },
];

const INITIAL_FLIGHTS: AirsideFlight[] = [
  { id: 'FLT-203', flightNumber: 'AI-203', airline: 'Air India', aircraft: 'Boeing 787-8', wingspanMeters: 60.1, stand: 'Stand G01', gateNumber: 'A01', runwayCode: '28L', flightType: 'DEPARTURE', time: '23:40', status: 'BOARDING', hasConflict: false },
  { id: 'FLT-521', flightNumber: '6E-521', airline: 'IndiGo', aircraft: 'Airbus A321neo', wingspanMeters: 35.8, stand: 'Stand G07', gateNumber: 'A07', runwayCode: '09R', flightType: 'DEPARTURE', time: '23:42', status: 'PUSHBACK', hasConflict: false },
  { id: 'FLT-901', flightNumber: 'UK-901', airline: 'Vistara', aircraft: 'Airbus A320neo', wingspanMeters: 35.8, stand: 'Stand G04', gateNumber: 'A04', runwayCode: 'UNASSIGNED', flightType: 'DEPARTURE', time: '23:55', status: 'SCHEDULED', hasConflict: true, conflictReason: 'Departure in 22 mins with no takeoff runway vector assigned' },
  { id: 'FLT-102', flightNumber: 'SPH-102', airline: 'Saphire Air', aircraft: 'Airbus A350-900', wingspanMeters: 64.75, stand: 'Stand G03', gateNumber: 'A03', runwayCode: '10L', flightType: 'DEPARTURE', time: '00:15', status: 'SCHEDULED', hasConflict: false },
  { id: 'FLT-142', flightNumber: 'BA-142', airline: 'British Airways', aircraft: 'Boeing 787-9', wingspanMeters: 60.1, stand: 'Stand G10', gateNumber: 'A10', runwayCode: '28L', flightType: 'DEPARTURE', time: '00:30', status: 'SCHEDULED', hasConflict: false },
  { id: 'FLT-506', flightNumber: 'EK-506', airline: 'Emirates', aircraft: 'Boeing 777-300ER', wingspanMeters: 64.8, stand: 'Stand G15', gateNumber: 'B01', runwayCode: '09R', flightType: 'DEPARTURE', time: '00:45', status: 'SCHEDULED', hasConflict: false },
  { id: 'FLT-225', flightNumber: 'AF-225', airline: 'Air France', aircraft: 'Boeing 777-300ER', wingspanMeters: 64.8, stand: 'Stand G05', gateNumber: 'A05', runwayCode: '28L', flightType: 'DEPARTURE', time: '01:10', status: 'SCHEDULED', hasConflict: false },
  { id: 'FLT-557', flightNumber: 'QR-557', airline: 'Qatar Airways', aircraft: 'Airbus A330-300', wingspanMeters: 60.3, stand: 'Stand G18', gateNumber: 'B04', runwayCode: 'UNASSIGNED', flightType: 'DEPARTURE', time: '01:40', status: 'SCHEDULED', hasConflict: true, conflictReason: 'Runway unassigned for international widebody' },
  { id: 'FLT-760', flightNumber: 'LH-760', airline: 'Lufthansa', aircraft: 'Airbus A350-900', wingspanMeters: 64.75, stand: 'Stand G17', gateNumber: 'B03', runwayCode: '28L', flightType: 'DEPARTURE', time: '01:25', status: 'SCHEDULED', hasConflict: false },
  { id: 'FLT-402', flightNumber: 'SQ-402', airline: 'Singapore Airlines', aircraft: 'Boeing 787-10', wingspanMeters: 60.1, stand: 'Stand G20', gateNumber: 'B06', runwayCode: '10L', flightType: 'DEPARTURE', time: '02:00', status: 'SCHEDULED', hasConflict: false },
  { id: 'FLT-871', flightNumber: 'KL-871', airline: 'KLM Royal Dutch', aircraft: 'Boeing 777-200', wingspanMeters: 60.9, stand: 'Stand G21', gateNumber: 'B07', runwayCode: '09R', flightType: 'DEPARTURE', time: '02:15', status: 'SCHEDULED', hasConflict: false },
  { id: 'FLT-317', flightNumber: 'TG-317', airline: 'Thai Airways', aircraft: 'Airbus A350-900', wingspanMeters: 64.75, stand: 'Stand G23', gateNumber: 'B09', runwayCode: '28L', flightType: 'DEPARTURE', time: '02:30', status: 'SCHEDULED', hasConflict: false },
  // Concourse C Flagship Flights
  { id: 'FLT-201', flightNumber: 'EK-201', airline: 'Emirates', aircraft: 'Airbus A380-800', wingspanMeters: 79.8, stand: 'Stand G31', gateNumber: 'C01', runwayCode: '28L', flightType: 'DEPARTURE', time: '00:50', status: 'SCHEDULED', hasConflict: false },
  { id: 'FLT-117', flightNumber: 'BA-117', airline: 'British Airways', aircraft: 'Boeing 777-300ER', wingspanMeters: 64.8, stand: 'Stand G34', gateNumber: 'C04', runwayCode: '10L', flightType: 'DEPARTURE', time: '01:05', status: 'SCHEDULED', hasConflict: false },
  { id: 'FLT-406', flightNumber: 'SQ-406', airline: 'Singapore Airlines', aircraft: 'Airbus A350-900', wingspanMeters: 64.75, stand: 'Stand G38', gateNumber: 'C08', runwayCode: '28L', flightType: 'DEPARTURE', time: '01:35', status: 'SCHEDULED', hasConflict: false },
  { id: 'FLT-571', flightNumber: 'QR-571', airline: 'Qatar Airways', aircraft: 'Boeing 777-200LR', wingspanMeters: 64.8, stand: 'Stand G42', gateNumber: 'C12', runwayCode: '09R', flightType: 'DEPARTURE', time: '01:50', status: 'SCHEDULED', hasConflict: false },
  { id: 'FLT-772', flightNumber: 'LH-772', airline: 'Lufthansa', aircraft: 'Boeing 747-8', wingspanMeters: 68.4, stand: 'Stand G45', gateNumber: 'C15', runwayCode: '28L', flightType: 'DEPARTURE', time: '02:20', status: 'SCHEDULED', hasConflict: false },
];

const INITIAL_CONFLICTS: OperationalConflict[] = [
  {
    id: 'CONF-01',
    flightNumber: '6E-521',
    type: 'GATE_CONFLICT',
    severity: 'CRITICAL',
    title: 'Stand Timing Contention at Gate A01',
    description: 'Scheduled turnaround pushback at 23:42 overlaps with AI-203 docked until 23:40. Minimum separation of 15 minutes violated.',
    affectedGate: 'A01',
    suggestedGate: 'A02',
  },
  {
    id: 'CONF-02',
    flightNumber: 'UK-901',
    type: 'RUNWAY_UNASSIGNED',
    severity: 'WARNING',
    title: 'Runway Takeoff Vector Missing',
    description: 'Vistara UK-901 scheduled for 23:55 has no takeoff vector assigned. Taxi clearance cannot be issued.',
    suggestedRunway: '10L',
  },
  {
    id: 'CONF-03',
    flightNumber: 'QR-557',
    type: 'RUNWAY_UNASSIGNED',
    severity: 'WARNING',
    title: 'Widebody Runway Vector Unallocated',
    description: 'Qatar Airways QR-557 (A330-300) departs at 01:40. Requires Heavy Runway CAT III clearance.',
    suggestedRunway: '28L',
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const AirsideOpsDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Navigation tab state based on URL hash
  const [activeTab, setActiveTab] = useState<'overview' | 'gates' | 'runways' | 'assignments' | 'notifications' | 'profile'>('overview');

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (['gates', 'runways', 'assignments', 'notifications', 'profile'].includes(hash)) {
      setActiveTab(hash as any);
    } else {
      setActiveTab('overview');
    }
  }, [location.hash]);

  // Core Operational States
  const [gates, setGates] = useState<GateInfo[]>(INITIAL_GATES);
  const [runways, setRunways] = useState<RunwayInfo[]>(INITIAL_RUNWAYS);
  const [flights, setFlights] = useState<AirsideFlight[]>(INITIAL_FLIGHTS);
  const [conflicts, setConflicts] = useState<OperationalConflict[]>(INITIAL_CONFLICTS);

  // Filter for Gate Boards
  const [selectedConcourse, setSelectedConcourse] = useState<'ALL' | 'Concourse A' | 'Concourse B' | 'Concourse C'>('ALL');
  const [gateStatusFilter, setGateStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'OCCUPIED'>('ALL');

  // Cross-dashboard synchronization with aocsDataStore and Live Runway Telemetry
  useEffect(() => {
    let isMounted = true;

    // Fetch live runway telemetry from backend API
    runwayApi.getAll()
      .then((data) => {
        if (!isMounted || !data || data.length === 0) return;
        setRunways((prev) =>
          prev.map((r) => {
            const telemetry = data.find((d) => d.runwayCode === r.runwayCode);
            if (!telemetry) return r;
            return {
              ...r,
              status: runwayStatusFromBackend(telemetry.operationalStatus, r.status),
              surfaceCondition: `DRY (Friction ${telemetry.surfaceFriction?.toFixed(2) || '0.84'})`,
              wind: telemetry.headwindVector || r.wind,
              crosswind: telemetry.crosswindVector || r.crosswind,
              queueCount: telemetry.activeDeparturesCount || r.queueCount,
            };
          })
        );
      })
      .catch((err) => {
        console.warn('Backend runway telemetry fallback:', err);
      });

    const syncFromStore = () => {
      const storeGates = aocsDataStore.getGates();
      if (storeGates.length > 0) {
        setGates((prev) =>
          prev.map((g) => {
            const sg = storeGates.find((s) => (s as any).gateCode === g.gateNumber || (s as any).gateNumber === g.gateNumber);
            if (sg) {
              return {
                ...g,
                status: (sg.status === 'OCCUPIED' ? 'OCCUPIED' : sg.status === 'MAINTENANCE' ? 'MAINTENANCE' : 'AVAILABLE') as GateStatus,
                assignedFlightNumber: sg.assignedFlightNumber || g.assignedFlightNumber,
              };
            }
            return g;
          })
        );
      }
    };

    syncFromStore();
    const unsub = aocsDataStore.subscribe(syncFromStore);
    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  // Handler: Toggle Runway Operational Mode / Trigger Surface Sweep
  const handleToggleRunwayMode = async (rwy: RunwayInfo) => {
    const nextStatus: RunwayStatus =
      rwy.status === 'ACTIVE_CAT_III'
        ? 'DEPARTURE_ONLY'
        : rwy.status === 'DEPARTURE_ONLY'
        ? 'SWEEP'
        : 'ACTIVE_CAT_III';

    const rwyIdNum = rwy.runwayCode === '28L' ? 1 : rwy.runwayCode === '09R' ? 2 : rwy.runwayCode === '10L' ? 3 : 4;

    try {
      await runwayApi.updateStatus(rwyIdNum, {
        operationalStatus: RUNWAY_STATUS_TO_BACKEND[nextStatus],
        surfaceFriction: nextStatus === 'SWEEP' ? 0.72 : 0.85,
        visualRangeMeters: 1200,
      });
    } catch (err) {
      console.error('Backend runway update failed', err);
      toast.error(`Runway ${rwy.runwayCode} was NOT changed: the server rejected the update.`);
      return;
    }

    setRunways((prev) =>
      prev.map((r) =>
        r.id === rwy.id
          ? {
              ...r,
              status: nextStatus,
              surfaceCondition: nextStatus === 'SWEEP' ? 'MAINTENANCE (Radar FOD Scan)' : 'DRY (Friction 0.85)',
            }
          : r
      )
    );

    toast.success(`Runway ${rwy.runwayCode} mode updated to ${nextStatus.replace(/_/g, ' ')}`);
  };

  // Interactive Assignment Modal State
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [selectedFlightForAssignment, setSelectedFlightForAssignment] = useState<AirsideFlight>(flights[0]);
  const [selectedGateNumber, setSelectedGateNumber] = useState<string>('A02');
  const [selectedRunwayCode, setSelectedRunwayCode] = useState<string>('28L');

  // Selected Gate Inspector Drawer/Modal
  const [gateDetailModalOpen, setGateDetailModalOpen] = useState(false);
  const [inspectingGate, setInspectingGate] = useState<GateInfo>(gates[0]);

  // Handle open assignment flow for a flight
  const handleOpenAssignment = (flight: AirsideFlight) => {
    setSelectedFlightForAssignment(flight);
    setSelectedGateNumber(flight.gateNumber !== 'UNASSIGNED' ? flight.gateNumber : 'A02');
    setSelectedRunwayCode(flight.runwayCode !== 'UNASSIGNED' ? flight.runwayCode : '28L');
    setAssignmentModalOpen(true);
  };

  // Open modal from conflict resolution
  const handleResolveConflict = (conflict: OperationalConflict) => {
    const targetFlight = flights.find((f) => f.flightNumber === conflict.flightNumber) || flights[0];
    setSelectedFlightForAssignment(targetFlight);
    if (conflict.suggestedGate) setSelectedGateNumber(conflict.suggestedGate);
    if (conflict.suggestedRunway) setSelectedRunwayCode(conflict.suggestedRunway);
    setAssignmentModalOpen(true);
  };

  // Real-time Conflict Checker inside Assignment Modal
  const isConflictDetected = (): { hasConflict: boolean; reason?: string } => {
    // Check if gate is currently occupied by a different flight
    const targetGate = gates.find((g) => g.gateNumber === selectedGateNumber);
    if (targetGate && targetGate.status === 'OCCUPIED' && targetGate.assignedFlightNumber !== selectedFlightForAssignment.flightNumber) {
      return {
        hasConflict: true,
        reason: `Gate ${selectedGateNumber} is currently occupied by flight ${targetGate.assignedFlightNumber} (${targetGate.aircraft}) at ${targetGate.scheduledTime}. Reassigning without buffer causes gate collision!`,
      };
    }

    // Check wingspan compatibility
    if (targetGate && selectedFlightForAssignment.wingspanMeters > targetGate.maxWingspanMeters) {
      return {
        hasConflict: true,
        reason: `Aircraft wingspan (${selectedFlightForAssignment.wingspanMeters}m) exceeds Gate ${selectedGateNumber} structural limit (${targetGate.maxWingspanMeters}m). Clearance blocked!`,
      };
    }

    // Check runway operational status
    const targetRunway = runways.find((r) => r.runwayCode === selectedRunwayCode);
    if (targetRunway && targetRunway.status === 'SWEEP') {
      return {
        hasConflict: true,
        reason: `Runway ${selectedRunwayCode} is currently closed for FOD radar sweep inspection!`,
      };
    }

    return { hasConflict: false };
  };

  const validationResult = isConflictDetected();

  // Confirm and persist assignment
  const handleConfirmAssignment = () => {
    if (validationResult.hasConflict) {
      toast.error('Cannot proceed: Active assignment conflict must be resolved first.');
      return;
    }

    // 1. Update Flight
    const updatedFlights = flights.map((f) => {
      if (f.id === selectedFlightForAssignment.id) {
        return {
          ...f,
          gateNumber: selectedGateNumber,
          runwayCode: selectedRunwayCode,
          hasConflict: false,
          conflictReason: undefined,
          status: 'CLEARED' as const,
        };
      }
      return f;
    });
    setFlights(updatedFlights);

    // 2. Update Gates: Free old gate if applicable, occupy new gate
    const updatedGates = gates.map((g) => {
      if (g.assignedFlightNumber === selectedFlightForAssignment.flightNumber && g.gateNumber !== selectedGateNumber) {
        return {
          ...g,
          status: 'AVAILABLE' as GateStatus,
          assignedFlightNumber: undefined,
          aircraft: undefined,
          scheduledTime: undefined,
        };
      }
      if (g.gateNumber === selectedGateNumber) {
        return {
          ...g,
          status: 'OCCUPIED' as GateStatus,
          assignedFlightNumber: selectedFlightForAssignment.flightNumber,
          aircraft: selectedFlightForAssignment.aircraft,
          scheduledTime: selectedFlightForAssignment.time,
        };
      }
      return g;
    });
    setGates(updatedGates);

    // 3. Clear from conflicts list
    setConflicts(conflicts.filter((c) => c.flightNumber !== selectedFlightForAssignment.flightNumber));

    // 4. Update unified cross-dashboard store & dispatch audit
    aocsDataStore.assignGate(selectedFlightForAssignment.flightNumber, selectedGateNumber);
    aocsDataStore.logAuditEvent(
      'GATE',
      `Vector Cleared: Flight ${selectedFlightForAssignment.flightNumber} assigned to Gate ${selectedGateNumber}, Runway ${selectedRunwayCode}`,
      selectedFlightForAssignment.flightNumber,
      user?.fullName || 'Airside Operations Officer'
    );

    toast.success(`Vector Confirmed: ${selectedFlightForAssignment.flightNumber} ➔ Gate ${selectedGateNumber} ➔ Runway ${selectedRunwayCode}`);
    setAssignmentModalOpen(false);
  };

  // Quick inspect a gate
  const handleInspectGate = (gate: GateInfo) => {
    setInspectingGate(gate);
    setGateDetailModalOpen(true);
  };

  // Filtered Gates
  const filteredGates = gates.filter((g) => {
    if (selectedConcourse !== 'ALL' && g.concourse !== selectedConcourse) return false;
    if (gateStatusFilter !== 'ALL' && g.status !== gateStatusFilter) return false;
    return true;
  });

  const openGatesCount = gates.filter((g) => g.status === 'AVAILABLE').length;
  const occupiedGatesCount = gates.filter((g) => g.status === 'OCCUPIED').length;

  return (
    <DashboardLayout activeRole="airside-ops">
      {/* ===================================================================== */}
      {/* TOP HEADER & OPERATIONAL TELEMETRY BADGE                              */}
      {/* ===================================================================== */}
      <Box sx={{ mb: 3.5, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Chip
              icon={<Radio size={14} color="#0284C7" />}
              label="AIRSIDE OPERATIONS CONTROL"
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
              Live Airport Telemetry • 19 Sep 12:05 IST
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', letterSpacing: '-0.02em' }}>
            Airside Operations & Resource Allocation
          </Typography>
          <Typography sx={{ fontSize: '0.86rem', color: '#64748B', mt: 0.2 }}>
            Terminal Gate Stands • Active Runways • Flight Vector Clearance System
          </Typography>
        </Box>

        {/* Global Action: Quick Vector Assignment */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<Sparkles size={16} />}
            onClick={() => handleOpenAssignment(flights[0])}
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
            + Assign Flight Vector
          </Button>
        </Box>
      </Box>

      {/* ===================================================================== */}
      {/* 1. COMPACT AIRSIDE OVERVIEW: STRICTLY 4 KPIS                           */}
      {/* ===================================================================== */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5, mb: 3.5 }}>
        {/* KPI 1: GATES / OPEN */}
        <Card
          elevation={0}
          onClick={() => setGateStatusFilter(gateStatusFilter === 'AVAILABLE' ? 'ALL' : 'AVAILABLE')}
          sx={{
            p: 2.5,
            backgroundColor: gateStatusFilter === 'AVAILABLE' ? '#F0FDF4' : '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid',
            borderColor: gateStatusFilter === 'AVAILABLE' ? '#10B981' : '#E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'translateY(-2px)', borderColor: '#10B981' },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
              {gates.length} GATES
            </Typography>
            <Chip label={`${openGatesCount} OPEN`} size="small" sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '0.68rem' }} />
          </Box>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#475569', mt: 0.5 }}>
            Total Airside Stands
          </Typography>
          <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
            Click to filter available berths
          </Typography>
        </Card>

        {/* KPI 2: OCCUPIED */}
        <Card
          elevation={0}
          onClick={() => setGateStatusFilter(gateStatusFilter === 'OCCUPIED' ? 'ALL' : 'OCCUPIED')}
          sx={{
            p: 2.5,
            backgroundColor: gateStatusFilter === 'OCCUPIED' ? '#F0F9FF' : '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid',
            borderColor: gateStatusFilter === 'OCCUPIED' ? '#0284C7' : '#E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'translateY(-2px)', borderColor: '#0284C7' },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0284C7' }}>
              {occupiedGatesCount} OCCUPIED
            </Typography>
            <Chip
              label={`${Math.round((occupiedGatesCount / (gates.length || 1)) * 100)}% RATE`}
              size="small"
              sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 800, fontSize: '0.68rem' }}
            />
          </Box>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#475569', mt: 0.5 }}>
            Active Docked Aircraft
          </Typography>
          <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
            Click to filter active turnarounds
          </Typography>
        </Card>

        {/* KPI 3: FLIGHTS MOVEMENTS */}
        <Card
          elevation={0}
          onClick={() => setActiveTab('assignments')}
          sx={{
            p: 2.5,
            backgroundColor: activeTab === 'assignments' ? '#F8FAFC' : '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid',
            borderColor: activeTab === 'assignments' ? '#0F2942' : '#E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'translateY(-2px)', borderColor: '#0F2942' },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
              {flights.length} FLIGHTS
            </Typography>
            <Chip label="NEXT 2 HRS" size="small" sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 800, fontSize: '0.68rem' }} />
          </Box>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#475569', mt: 0.5 }}>
            Scheduled Movements
          </Typography>
          <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
            {flights.filter((f) => f.flightType === 'DEPARTURE').length} Departures • {flights.filter((f) => f.flightType === 'ARRIVAL').length} Arrivals
          </Typography>
        </Card>

        {/* KPI 4: ACTIONS REQUIRED */}
        <Card
          elevation={0}
          onClick={() => setActiveTab('overview')}
          sx={{
            p: 2.5,
            backgroundColor: conflicts.length > 0 ? '#FEF2F2' : '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid',
            borderColor: conflicts.length > 0 ? '#DC2626' : '#E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'translateY(-2px)', borderColor: '#DC2626' },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: conflicts.length > 0 ? '#DC2626' : '#10B981' }}>
              {conflicts.length} ACTIONS
            </Typography>
            <Chip
              label={conflicts.length > 0 ? 'REQUIRED' : 'ALL CLEAR'}
              size="small"
              sx={{
                bgcolor: conflicts.length > 0 ? '#FEE2E2' : '#DCFCE7',
                color: conflicts.length > 0 ? '#DC2626' : '#15803D',
                fontWeight: 800,
                fontSize: '0.68rem',
              }}
            />
          </Box>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: conflicts.length > 0 ? '#DC2626' : '#475569', mt: 0.5 }}>
            Operational Attention
          </Typography>
          <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>
            {conflicts.length > 0 ? `${conflicts.length} vector conflicts awaiting assignment` : 'Zero assignment collisions detected'}
          </Typography>
        </Card>
      </Box>

      {/* ===================================================================== */}
      {/* 2. PRIMARY HOMEPAGE / MAIN CONSOLE VIEW (2x2 SPATIAL ALLOCATION)      */}
      {/* ===================================================================== */}
      {activeTab === 'overview' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          {/* Row 1: Left Gate Allocation Board (Spatial Grid) / Right Attention Panel */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '6.5fr 3.5fr' }, gap: 3 }}>
            {/* 2A. GATE ALLOCATION BOARD (SPATIAL GRID) */}
            <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <Box sx={{ p: 2.5, borderBottom: '1px solid #E2E8F0', backgroundColor: '#FAFAFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                    Gate Allocation Board
                  </Typography>
                  <Typography sx={{ fontSize: '0.82rem', color: '#64748B' }}>
                    Spatial berth distribution across Terminal concourses. Click any gate to inspect or reassign.
                  </Typography>
                </Box>

                {/* Terminal Selector Buttons & Active Filters */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {gateStatusFilter !== 'ALL' && (
                    <Chip
                      label={`Status: ${gateStatusFilter}`}
                      size="small"
                      onDelete={() => setGateStatusFilter('ALL')}
                      sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 700, fontSize: '0.72rem' }}
                    />
                  )}
                  {(['ALL', 'Concourse A', 'Concourse B', 'Concourse C'] as const).map((c) => (
                    <Button
                      key={c}
                      size="small"
                      onClick={() => setSelectedConcourse(c)}
                      sx={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 700,
                        fontSize: '0.74rem',
                        px: 1.5,
                        py: 0.4,
                        borderRadius: '7px',
                        textTransform: 'none',
                        backgroundColor: selectedConcourse === c ? '#0F2942' : 'transparent',
                        color: selectedConcourse === c ? '#FFFFFF' : '#64748B',
                        border: '1px solid',
                        borderColor: selectedConcourse === c ? '#0F2942' : '#E2E8F0',
                        '&:hover': { backgroundColor: selectedConcourse === c ? '#1E3A5F' : '#F1F5F9' },
                      }}
                    >
                      {c === 'ALL' ? `All (${gates.length})` : c}
                    </Button>
                  ))}
                </Box>
              </Box>

              {/* Spatial Gate Cards Grid */}
              <Box sx={{ p: 2.5, display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                {filteredGates.map((gate) => {
                  const isOccupied = gate.status === 'OCCUPIED';
                  const isAvailable = gate.status === 'AVAILABLE';
                  const isStandby = gate.status === 'STANDBY';

                  return (
                    <Box
                      key={gate.id}
                      onClick={() => handleInspectGate(gate)}
                      sx={{
                        p: 1.8,
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: isOccupied ? '#CBD5E1' : isAvailable ? '#86EFAC' : '#E2E8F0',
                        backgroundColor: isOccupied ? '#FFFFFF' : isAvailable ? '#F0FDF4' : '#F8FAFC',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                          borderColor: '#0284C7',
                        },
                      }}
                    >
                      {/* Gate Top Strip */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '1.05rem', color: '#0F2942' }}>
                          {gate.gateNumber}
                        </Typography>
                        <Chip
                          label={gate.status}
                          size="small"
                          sx={{
                            height: '18px',
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            bgcolor: isOccupied ? '#E0F2FE' : isAvailable ? '#DCFCE7' : '#F1F5F9',
                            color: isOccupied ? '#0369A1' : isAvailable ? '#15803D' : '#64748B',
                          }}
                        />
                      </Box>

                      {/* Gate Body: Flight details or Open status */}
                      {isOccupied ? (
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: '#0F2942' }}>
                            {gate.assignedFlightNumber}
                          </Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {gate.aircraft}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, pt: 0.8, borderTop: '1px dashed #E2E8F0' }}>
                            <Typography sx={{ fontSize: '0.7rem', color: '#0284C7', fontWeight: 700 }}>
                              {gate.standNumber}
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: '#475569', fontWeight: 700 }}>
                              {gate.scheduledTime}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={{ py: 0.5 }}>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.82rem', color: '#15803D' }}>
                            OPEN / READY
                          </Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>
                            Max: {gate.maxWingspanMeters}m span
                          </Typography>
                          <Box sx={{ mt: 1, pt: 0.8, borderTop: '1px dashed #BBF7D0' }}>
                            <Typography sx={{ fontSize: '0.68rem', color: '#16A34A', fontWeight: 700 }}>
                              + Click to Assign
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>

              {/* Bottom footer link */}
              <Box sx={{ p: 2, px: 2.5, borderTop: '1px solid #E2E8F0', bgcolor: '#FAFAFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.76rem', color: '#64748B' }}>
                  Showing 12 of {gates.length} operational stands • Jetbridge and remote status active
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate('/dashboard/airside-ops#gates')}
                  endIcon={<ArrowRight size={14} />}
                  sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.76rem', color: '#0284C7' }}
                >
                  View All 24 Gates
                </Button>
              </Box>
            </Card>

            {/* 2B. ATTENTION PANEL (OPERATIONAL CONFLICT DETECTION) */}
            <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', p: 2.5, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1.5, borderBottom: '1px solid #E2E8F0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AlertTriangle size={18} color="#DC2626" />
                  <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                    Attention & Conflicts
                  </Typography>
                </Box>
                <Chip
                  label={`${conflicts.length} Active`}
                  size="small"
                  sx={{ bgcolor: conflicts.length > 0 ? '#FEE2E2' : '#DCFCE7', color: conflicts.length > 0 ? '#DC2626' : '#15803D', fontWeight: 800 }}
                />
              </Box>

              {/* Conflict Items List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8, flexGrow: 1 }}>
                {conflicts.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <CheckCircle2 size={36} color="#10B981" style={{ margin: '0 auto', marginBottom: '8px' }} />
                    <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#0F2942', fontSize: '0.95rem' }}>
                      All Airside Vectors Clear
                    </Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: '#64748B', mt: 0.5 }}>
                      No gate collisions or unassigned flight vectors detected.
                    </Typography>
                  </Box>
                ) : (
                  conflicts.map((item) => (
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
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.8 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                      </Box>

                      <Typography sx={{ fontSize: '0.76rem', color: '#475569', lineHeight: 1.4, mb: 1.5 }}>
                        {item.description}
                      </Typography>

                      <Button
                        size="small"
                        variant="contained"
                        fullWidth
                        onClick={() => handleResolveConflict(item)}
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
                        Resolve Assignment Conflict
                      </Button>
                    </Box>
                  ))
                )}
              </Box>
            </Card>
          </Box>

          {/* Row 2: Left Flight Assignments Vector Board / Right Runway Status Panel */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '6.5fr 3.5fr' }, gap: 3 }}>
            {/* 2C. FLIGHT ASSIGNMENTS BOARD (Flight ➔ Gate ➔ Runway Flow) */}
            <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <Box sx={{ p: 2.5, borderBottom: '1px solid #E2E8F0', backgroundColor: '#FAFAFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                    Flight Allocation & Vector Board
                  </Typography>
                  <Typography sx={{ fontSize: '0.82rem', color: '#64748B' }}>
                    Live resource routing sequence: Flight ➔ Aircraft ➔ Gate Stand ➔ Active Runway.
                  </Typography>
                </Box>
                <Chip label="12 Flights" size="small" sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 800 }} />
              </Box>

              {/* Visual Sequence List */}
              <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                {flights.slice(0, 6).map((flt) => {
                  const hasRunway = flt.runwayCode !== 'UNASSIGNED';

                  return (
                    <Box
                      key={flt.id}
                      sx={{
                        p: 1.8,
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: flt.hasConflict ? '#FED7AA' : '#E2E8F0',
                        bgcolor: flt.hasConflict ? '#FFFBEB' : '#F8FAFC',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'space-between',
                        gap: 2,
                      }}
                    >
                      {/* Flow Step: Flight Info */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: '38px', height: '38px', borderRadius: '10px', bgcolor: '#0F2942', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                          <Plane size={18} />
                        </Box>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#0F2942' }}>
                              {flt.flightNumber}
                            </Typography>
                            <Typography sx={{ fontSize: '0.74rem', color: '#64748B' }}>
                              {flt.airline}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                            {flt.aircraft} • Dep: {flt.time}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Flow Middle: Arrow Vector (Flight ➔ Gate ➔ Runway) */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'nowrap' }}>
                        {/* Gate Capsule */}
                        <Box sx={{ px: 1.2, py: 0.5, borderRadius: '8px', bgcolor: '#FFFFFF', border: '1px solid #CBD5E1', textAlign: 'center' }}>
                          <Typography sx={{ fontSize: '0.62rem', color: '#64748B', fontWeight: 800 }}>GATE</Typography>
                          <Typography sx={{ fontSize: '0.82rem', color: '#0F2942', fontWeight: 800 }}>{flt.gateNumber}</Typography>
                        </Box>

                        <ArrowRight size={14} color="#94A3B8" />

                        {/* Runway Capsule */}
                        <Box
                          sx={{
                            px: 1.2,
                            py: 0.5,
                            borderRadius: '8px',
                            bgcolor: hasRunway ? '#FFFFFF' : '#FEE2E2',
                            border: '1px solid',
                            borderColor: hasRunway ? '#CBD5E1' : '#FCA5A5',
                            textAlign: 'center',
                          }}
                        >
                          <Typography sx={{ fontSize: '0.62rem', color: hasRunway ? '#64748B' : '#DC2626', fontWeight: 800 }}>
                            RUNWAY
                          </Typography>
                          <Typography sx={{ fontSize: '0.82rem', color: hasRunway ? '#0284C7' : '#DC2626', fontWeight: 800 }}>
                            {hasRunway ? flt.runwayCode : '⚠ UNASSIGNED'}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Action Button */}
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenAssignment(flt)}
                        sx={{
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 700,
                          fontSize: '0.74rem',
                          textTransform: 'none',
                          borderRadius: '8px',
                          whiteSpace: 'nowrap',
                          px: 1.6,
                        }}
                      >
                        Edit Vector
                      </Button>
                    </Box>
                  );
                })}
              </Box>
            </Card>

            {/* 2D. RUNWAY STATUS PANEL */}
            <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', p: 2.5, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1.5, borderBottom: '1px solid #E2E8F0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Wind size={18} color="#0284C7" />
                  <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                    Runway Status & Surface
                  </Typography>
                </Box>
                <Chip label="4 Runways" size="small" sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 800 }} />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                {runways.map((rwy) => {
                  const isActive = rwy.status === 'ACTIVE_CAT_III';
                  const isDepartureOnly = rwy.status === 'DEPARTURE_ONLY';
                  const isAvailable = rwy.status === 'AVAILABLE';
                  const isSweep = rwy.status === 'SWEEP';

                  return (
                    <Box
                      key={rwy.id}
                      sx={{
                        p: 1.8,
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: isSweep ? '#FECACA' : '#E2E8F0',
                        bgcolor: isSweep ? '#FEF2F2' : '#F8FAFC',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '1rem', color: '#0F2942' }}>
                            {rwy.runwayCode}
                          </Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>
                            ({rwy.length})
                          </Typography>
                        </Box>
                        <Chip
                          label={rwy.status.replace(/_/g, ' ')}
                          size="small"
                          sx={{
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            height: '18px',
                            bgcolor: isActive ? '#DCFCE7' : isDepartureOnly ? '#E0F2FE' : isAvailable ? '#F1F5F9' : '#FEE2E2',
                            color: isActive ? '#15803D' : isDepartureOnly ? '#0369A1' : isAvailable ? '#475569' : '#DC2626',
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, my: 1, py: 0.8, borderTop: '1px dashed #E2E8F0', borderBottom: '1px dashed #E2E8F0' }}>
                        <Box>
                          <Typography sx={{ fontSize: '0.66rem', color: '#94A3B8', fontWeight: 700 }}>SURFACE</Typography>
                          <Typography sx={{ fontSize: '0.74rem', color: '#0F2942', fontWeight: 600 }}>{rwy.surfaceCondition}</Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: '0.66rem', color: '#94A3B8', fontWeight: 700 }}>WIND VECTOR</Typography>
                          <Typography sx={{ fontSize: '0.74rem', color: '#0284C7', fontWeight: 700 }}>{rwy.wind}</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>
                          Active: <strong style={{ color: '#0F2942' }}>{rwy.activeFlightNumber || 'None'}</strong>
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#0284C7', fontWeight: 700 }}>
                          Queue: {rwy.queueCount} aircraft
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Card>
          </Box>
        </Box>
      )}

      {/* ===================================================================== */}
      {/* 3. SUBVIEW: GATE ALLOCATION MANAGER (#gates)                           */}
      {/* ===================================================================== */}
      {activeTab === 'gates' && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mb: 0.5 }}>
              Terminal Gate Allocation Matrix
            </Typography>
            <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
              Comprehensive real-time stand management for all {gates.length} gates across Concourse A (Domestic Pier), Concourse B (Transcontinental Pier), and Concourse C (Widebody Flagship Pier).
            </Typography>
          </Box>

          {/* Filter Pills */}
          <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
            <Button
              size="small"
              onClick={() => setSelectedConcourse('ALL')}
              variant={selectedConcourse === 'ALL' ? 'contained' : 'outlined'}
              sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, borderRadius: '8px', textTransform: 'none' }}
            >
              All Concourses ({gates.length})
            </Button>
            <Button
              size="small"
              onClick={() => setSelectedConcourse('Concourse A')}
              variant={selectedConcourse === 'Concourse A' ? 'contained' : 'outlined'}
              sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, borderRadius: '8px', textTransform: 'none' }}
            >
              Concourse A (Gates A01 - A14)
            </Button>
            <Button
              size="small"
              onClick={() => setSelectedConcourse('Concourse B')}
              variant={selectedConcourse === 'Concourse B' ? 'contained' : 'outlined'}
              sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, borderRadius: '8px', textTransform: 'none' }}
            >
              Concourse B (Gates B01 - B16)
            </Button>
            <Button
              size="small"
              onClick={() => setSelectedConcourse('Concourse C')}
              variant={selectedConcourse === 'Concourse C' ? 'contained' : 'outlined'}
              sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, borderRadius: '8px', textTransform: 'none' }}
            >
              Concourse C (Gates C01 - C18)
            </Button>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(6, 1fr)' }, gap: 2 }}>
            {filteredGates.map((gate) => {
              const isOccupied = gate.status === 'OCCUPIED';
              const isAvailable = gate.status === 'AVAILABLE';

              return (
                <Card
                  key={gate.id}
                  elevation={0}
                  onClick={() => handleInspectGate(gate)}
                  sx={{
                    p: 2,
                    borderRadius: '14px',
                    border: '1px solid',
                    borderColor: isOccupied ? '#CBD5E1' : isAvailable ? '#86EFAC' : '#E2E8F0',
                    backgroundColor: isOccupied ? '#FFFFFF' : isAvailable ? '#F0FDF4' : '#F8FAFC',
                    cursor: 'pointer',
                    '&:hover': { borderColor: '#0284C7', transform: 'translateY(-2px)' },
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '1.1rem', color: '#0F2942' }}>
                      {gate.gateNumber}
                    </Typography>
                    <Chip
                      label={gate.status}
                      size="small"
                      sx={{
                        height: '18px',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        bgcolor: isOccupied ? '#E0F2FE' : isAvailable ? '#DCFCE7' : '#F1F5F9',
                        color: isOccupied ? '#0369A1' : isAvailable ? '#15803D' : '#64748B',
                      }}
                    />
                  </Box>

                  {isOccupied ? (
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.86rem', color: '#0F2942' }}>
                        {gate.assignedFlightNumber}
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {gate.aircraft}
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#0284C7', fontWeight: 700, mt: 0.5 }}>
                        {gate.scheduledTime} • {gate.standNumber}
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.82rem', color: '#16A34A' }}>
                        AVAILABLE
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>
                        Max Span: {gate.maxWingspanMeters}m
                      </Typography>
                    </Box>
                  )}
                </Card>
              );
            })}
          </Box>
        </Box>
      )}

      {/* ===================================================================== */}
      {/* 4. SUBVIEW: RUNWAY STATUS & TELEMETRY (#runways)                      */}
      {/* ===================================================================== */}
      {activeTab === 'runways' && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mb: 0.5 }}>
              Airfield Runway Status & Surface Vectors
            </Typography>
            <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
              Real-time CAT III status, METAR wind telemetry, friction coefficients, and departure queues.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            {runways.map((r) => (
              <Card key={r.id} elevation={0} sx={{ p: 3, backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, color: '#0F2942' }}>
                      RUNWAY {r.runwayCode}
                    </Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: '#64748B' }}>
                      Length: {r.length} • Heavy Widebody Capable
                    </Typography>
                  </Box>
                  <Chip
                    label={r.status.replace(/_/g, ' ')}
                    size="medium"
                    sx={{
                      fontWeight: 800,
                      bgcolor: r.status === 'ACTIVE_CAT_III' ? '#DCFCE7' : r.status === 'SWEEP' ? '#FEE2E2' : '#E0F2FE',
                      color: r.status === 'ACTIVE_CAT_III' ? '#15803D' : r.status === 'SWEEP' ? '#DC2626' : '#0369A1',
                    }}
                  />
                </Box>

                <Box sx={{ p: 2, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', mb: 2 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 800 }}>SURFACE FRICTION</Typography>
                      <Typography sx={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F2942', mt: 0.3 }}>{r.surfaceCondition}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 800 }}>WIND HEADING</Typography>
                      <Typography sx={{ fontSize: '0.88rem', fontWeight: 800, color: '#0284C7', mt: 0.3 }}>{r.wind}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 800 }}>CROSSWIND COMPONENT</Typography>
                      <Typography sx={{ fontSize: '0.88rem', fontWeight: 800, color: '#475569', mt: 0.3 }}>{r.crosswind}</Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.84rem', color: '#64748B' }}>
                    Active Departure: <strong style={{ color: '#0F2942' }}>{r.activeFlightNumber || 'No queue'}</strong>
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleToggleRunwayMode(r)}
                    sx={{ textTransform: 'none', fontWeight: 700 }}
                  >
                    Switch Operational Mode
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* ===================================================================== */}
      {/* 5. SUBVIEW: FLIGHT ASSIGNMENT MASTER BOARD (#assignments)              */}
      {/* ===================================================================== */}
      {activeTab === 'assignments' && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mb: 0.5 }}>
              Airside Flight Assignment & Vector Routing
            </Typography>
            <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
              Full aircraft schedule with gate stand and departure runway correlation.
            </Typography>
          </Box>

          <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {flights.map((f) => (
                <Box
                  key={f.id}
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    bgcolor: f.hasConflict ? '#FFFBEB' : '#F8FAFC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: '40px', height: '40px', borderRadius: '10px', bgcolor: '#0F2942', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                      <Plane size={20} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.94rem', color: '#0F2942' }}>
                        {f.flightNumber} · {f.airline}
                      </Typography>
                      <Typography sx={{ fontSize: '0.76rem', color: '#64748B' }}>
                        {f.aircraft} • Wingspan: {f.wingspanMeters}m • ETD: {f.time}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip label={`Gate ${f.gateNumber}`} size="small" sx={{ fontWeight: 800 }} />
                    <Chip
                      label={f.runwayCode !== 'UNASSIGNED' ? `Runway ${f.runwayCode}` : '⚠ RUNWAY UNASSIGNED'}
                      size="small"
                      sx={{
                        bgcolor: f.runwayCode !== 'UNASSIGNED' ? '#E0F2FE' : '#FEE2E2',
                        color: f.runwayCode !== 'UNASSIGNED' ? '#0369A1' : '#DC2626',
                        fontWeight: 800,
                      }}
                    />
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleOpenAssignment(f)}
                      sx={{
                        bgcolor: '#0F2942',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#1E3A5F' },
                      }}
                    >
                      Change Assignment
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Box>
      )}

      {/* ===================================================================== */}
      {/* 6. SUBVIEW: AIRSIDE NOTIFICATIONS (#notifications)                    */}
      {/* ===================================================================== */}
      {activeTab === 'notifications' && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mb: 0.5 }}>
              Airside Notifications & Operations Log
            </Typography>
            <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
              Real-time audit log of gate changes, runway re-vectors, and clearance telemetry.
            </Typography>
          </Box>

          <Card elevation={0} sx={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { id: 'NOTIF-01', time: '12:02 IST', title: 'Gate A07 Reassigned to IndiGo 6E-521', type: 'INFO' },
                { id: 'NOTIF-02', time: '11:55 IST', title: 'Runway 27R closed for scheduled FOD radar inspection', type: 'WARNING' },
                { id: 'NOTIF-03', time: '11:40 IST', title: 'Air India AI-203 boarding clearance granted at Stand G12', type: 'SUCCESS' },
                { id: 'NOTIF-04', time: '11:20 IST', title: 'Vistara UK-901 gate berth confirmed at Concourse A', type: 'INFO' },
              ].map((n) => (
                <Box key={n.id} sx={{ p: 2, borderRadius: '10px', border: '1px solid #E2E8F0', bgcolor: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', bgcolor: n.type === 'SUCCESS' ? '#10B981' : n.type === 'WARNING' ? '#D97706' : '#0284C7' }} />
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: '#0F2942' }}>{n.title}</Typography>
                      <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8' }}>Logged by Airside Operations Lead</Typography>
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
      {/* 7. SUBVIEW: AIRSIDE OFFICER PROFILE (#profile)                        */}
      {/* ===================================================================== */}
      {activeTab === 'profile' && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mb: 0.5 }}>
              Airside Operations Lead Profile
            </Typography>
            <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
              Certified Gate Agent & Airside Resource Controller credentials.
            </Typography>
          </Box>

          <Card elevation={0} sx={{ p: 3.5, backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', maxWidth: '700px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
              <Box sx={{ width: '64px', height: '64px', borderRadius: '50%', bgcolor: '#0284C7', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800 }}>
                AZ
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                  Aditya Zhang
                </Typography>
                <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>
                  Airside Operations Lead • Gate Agent
                </Typography>
                <Chip label="Badge #AIR-9904" size="small" sx={{ mt: 0.5, bgcolor: '#F1F5F9', fontWeight: 800, fontSize: '0.7rem' }} />
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, pt: 2, borderTop: '1px solid #E2E8F0' }}>
              <Box>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700 }}>AUTHORIZED STATION</Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#0F2942', fontWeight: 800 }}>Central Terminal Apron Control Tower</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700 }}>CLEARANCE LEVEL</Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#15803D', fontWeight: 800 }}>Airside Movement Tier 3 (Full)</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700 }}>DUTY SHIFT</Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#0F2942', fontWeight: 800 }}>Morning / Afternoon (06:00 - 14:30)</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700 }}>OPERATIONAL SPECIALTY</Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#0284C7', fontWeight: 800 }}>Airside Movement & Gate Allocation Lead</Typography>
              </Box>
            </Box>
          </Card>
        </Box>
      )}

      {/* ===================================================================== */}
      {/* 8. INTERACTIVE ASSIGNMENT FLOW MODAL (WITH INSTANT CONFLICT ENGINE)  */}
      {/* ===================================================================== */}
      <Dialog
        open={assignmentModalOpen}
        onClose={() => setAssignmentModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: '18px', p: 1 } },
        }}
      >
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
              Flight Resource Assignment Flow
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
              Allocate Gate Stand and Runway Vector with real-time collision detection.
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setAssignmentModalOpen(false)}>
            <X size={18} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          {/* Target Flight Details */}
          <Box sx={{ p: 2, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0F2942' }}>
                  {selectedFlightForAssignment.flightNumber} · {selectedFlightForAssignment.airline}
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Aircraft: {selectedFlightForAssignment.aircraft} • Wingspan: {selectedFlightForAssignment.wingspanMeters}m
                </Typography>
              </Box>
              <Chip label={selectedFlightForAssignment.time} size="small" sx={{ fontWeight: 800, bgcolor: '#E0F2FE', color: '#0369A1' }} />
            </Box>
          </Box>

          {/* Step 1: Select Gate */}
          <TextField
            select
            label="Target Gate Stand"
            fullWidth
            size="small"
            value={selectedGateNumber}
            onChange={(e) => setSelectedGateNumber(e.target.value)}
            helperText="Choose a terminal gate capable of accommodating aircraft wingspan"
          >
            {gates.map((g) => {
              const isOccupied = g.status === 'OCCUPIED' && g.assignedFlightNumber !== selectedFlightForAssignment.flightNumber;
              return (
                <MenuItem key={g.id} value={g.gateNumber}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.86rem' }}>
                      Gate {g.gateNumber} ({g.terminal} • {g.standNumber})
                    </Typography>
                    <Chip
                      label={isOccupied ? `Occupied by ${g.assignedFlightNumber}` : 'AVAILABLE'}
                      size="small"
                      sx={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        bgcolor: isOccupied ? '#FEE2E2' : '#DCFCE7',
                        color: isOccupied ? '#DC2626' : '#15803D',
                      }}
                    />
                  </Box>
                </MenuItem>
              );
            })}
          </TextField>

          {/* Step 2: Select Runway */}
          <TextField
            select
            label="Departure Runway Vector"
            fullWidth
            size="small"
            value={selectedRunwayCode}
            onChange={(e) => setSelectedRunwayCode(e.target.value)}
            helperText="Select active takeoff runway capable of aircraft performance profile"
          >
            {runways.map((r) => (
              <MenuItem key={r.id} value={r.runwayCode}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.86rem' }}>
                    Runway {r.runwayCode} ({r.length})
                  </Typography>
                  <Chip
                    label={r.status.replace(/_/g, ' ')}
                    size="small"
                    sx={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      bgcolor: r.status === 'ACTIVE_CAT_III' ? '#DCFCE7' : r.status === 'SWEEP' ? '#FEE2E2' : '#E0F2FE',
                      color: r.status === 'ACTIVE_CAT_III' ? '#15803D' : r.status === 'SWEEP' ? '#DC2626' : '#0369A1',
                    }}
                  />
                </Box>
              </MenuItem>
            ))}
          </TextField>

          {/* Step 3: Real-Time Conflict / Validation Warning Box */}
          {validationResult.hasConflict ? (
            <Box sx={{ p: 2, borderRadius: '12px', border: '1px solid #FCA5A5', bgcolor: '#FEF2F2' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <AlertTriangle size={18} color="#DC2626" />
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#DC2626', fontSize: '0.86rem' }}>
                  ASSIGNMENT CONFLICT DETECTED
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.78rem', color: '#7F1D1D', lineHeight: 1.4, mb: 1.5 }}>
                {validationResult.reason}
              </Typography>

              {/* Auto-suggest button */}
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  const firstOpen = gates.find((g) => g.status === 'AVAILABLE');
                  if (firstOpen) setSelectedGateNumber(firstOpen.gateNumber);
                  setSelectedRunwayCode('28L');
                }}
                sx={{
                  color: '#DC2626',
                  borderColor: '#DC2626',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.74rem',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#FEE2E2', borderColor: '#B91C1C' },
                }}
              >
                Auto-Select Next Available Gate (A02)
              </Button>
            </Box>
          ) : (
            <Box sx={{ p: 2, borderRadius: '12px', border: '1px solid #86EFAC', bgcolor: '#F0FDF4' }}>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#15803D', fontSize: '0.84rem', mb: 0.8 }}>
                ASSIGNMENT CHECK: ALL NOMINAL
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.76rem', color: '#166534', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Check size={14} color="#15803D" /> Gate {selectedGateNumber} is open and available for berthing
                </Typography>
                <Typography sx={{ fontSize: '0.76rem', color: '#166534', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Check size={14} color="#15803D" /> Runway {selectedRunwayCode} is operational (CAT III Clearance)
                </Typography>
                <Typography sx={{ fontSize: '0.76rem', color: '#166534', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Check size={14} color="#15803D" /> Aircraft wingspan ({selectedFlightForAssignment.wingspanMeters}m) verified within gate safety margins
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 1, borderTop: '1px solid #E2E8F0' }}>
          <Button
            onClick={() => setAssignmentModalOpen(false)}
            sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#64748B', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={validationResult.hasConflict}
            onClick={handleConfirmAssignment}
            sx={{
              backgroundColor: '#0F2942',
              color: '#FFFFFF',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              borderRadius: '9px',
              px: 2.5,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#1E3A5F' },
              '&.Mui-disabled': { backgroundColor: '#CBD5E1', color: '#94A3B8' },
            }}
          >
            Confirm Vector Assignment
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================================== */}
      {/* 9. GATE DETAIL INSPECTOR MODAL                                        */}
      {/* ===================================================================== */}
      <Dialog
        open={gateDetailModalOpen}
        onClose={() => setGateDetailModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px', p: 1 } } }}
      >
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Gate {inspectingGate.gateNumber} Telemetry
          <IconButton size="small" onClick={() => setGateDetailModalOpen(false)}>
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ p: 2, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 800 }}>TERMINAL & CONCOURSE</Typography>
            <Typography sx={{ fontWeight: 800, fontSize: '0.94rem', color: '#0F2942' }}>
              {inspectingGate.terminal} • {inspectingGate.concourse}
            </Typography>
            <Typography sx={{ fontSize: '0.76rem', color: '#0284C7', fontWeight: 700, mt: 0.5 }}>
              {inspectingGate.standNumber} • {inspectingGate.hasJetbridge ? 'Jetbridge Attached' : 'Remote Apron Stand'}
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <Box sx={{ p: 1.5, borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>STATUS</Typography>
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F2942' }}>{inspectingGate.status}</Typography>
            </Box>
            <Box sx={{ p: 1.5, borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>MAX WINGSPAN</Typography>
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F2942' }}>{inspectingGate.maxWingspanMeters} meters</Typography>
            </Box>
          </Box>

          {inspectingGate.status === 'OCCUPIED' && (
            <Box sx={{ p: 2, borderRadius: '12px', bgcolor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
              <Typography sx={{ fontSize: '0.74rem', color: '#1E40AF', fontWeight: 800 }}>CURRENT BERTHED FLIGHT</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0F2942', mt: 0.2 }}>
                {inspectingGate.assignedFlightNumber}
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>
                {inspectingGate.aircraft} • Departure: {inspectingGate.scheduledTime}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1, borderTop: '1px solid #E2E8F0' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setGateDetailModalOpen(false);
              const targetFlight = flights.find((f) => f.flightNumber === inspectingGate.assignedFlightNumber) || flights[0];
              handleOpenAssignment(targetFlight);
            }}
            sx={{
              backgroundColor: '#0F2942',
              color: '#FFFFFF',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#1E3A5F' },
            }}
          >
            {inspectingGate.status === 'OCCUPIED' ? 'Reassign This Gate' : 'Assign New Flight Here'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default AirsideOpsDashboard;
