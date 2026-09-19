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
  Tooltip,
  Divider,
} from '@mui/material';
import {
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  Radio,
  Sliders,
  Plane,
  Package,
  Layers,
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
  Plus,
  RefreshCw,
  Eye,
  Check,
  Lock,
  Unlock,
  MapPin,
  Filter,
  FileText,
  Phone,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { aocsDataStore } from '../../services/aocsDataStore';
import toast from 'react-hot-toast';

// ============================================================================
// DATA TYPES & INTERFACES
// ============================================================================

export type ClearanceStatus = 'CLEARED' | 'FLAGGED_REVIEW' | 'DENIED' | 'BOARDED';
export type VerificationMethod = 'BIOMETRIC_EGATE' | 'BARCODE_SCAN' | 'OFFICER_MANUAL';
export type GateBoardingStatus = 'LOCKED' | 'BOARDING_STARTED' | 'FINAL_CALL' | 'BOARDING_CLOSED' | 'PUSHBACK_READY';
export type LostFoundStatus = 'NEW_REPORT' | 'SEARCHING' | 'MATCHED' | 'READY_FOR_COLLECTION' | 'RETURNED';
export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'INVESTIGATING' | 'ESCALATED' | 'RESOLVED';

export interface PassengerRecord {
  pnr: string;
  name: string;
  flightNumber: string;
  seat: string;
  cabinClass: 'FIRST' | 'BUSINESS' | 'ECONOMY';
  gate: string;
  clearanceStatus: ClearanceStatus;
  verificationMethod: VerificationMethod;
  specialAssistance: string;
  passportLast4: string;
  boardingTime?: string;
  notes?: string;
}

export interface GateFlightReadiness {
  flightNumber: string;
  airline: string;
  destination: string;
  gate: string;
  terminal: string;
  scheduledDeparture: string;
  boardingStatus: GateBoardingStatus;
  bookedPassengers: number;
  checkedInPassengers: number;
  boardedPassengers: number;
  securityCleared: boolean;
  cabinCleaningCleared: boolean;
  maintenanceReleased: boolean;
  fuelingCompleted: boolean;
}

export interface LostFoundItem {
  id: string;
  title: string;
  category: 'ELECTRONICS' | 'BAGGAGE' | 'DOCUMENTS' | 'VALUABLES' | 'CLOTHING';
  locationFound: string;
  reportedBy: string;
  contactNumber: string;
  linkedPnr?: string;
  flightNumber?: string;
  status: LostFoundStatus;
  reportedDate: string;
  description: string;
  color: string;
  storageLocker: string;
}

export interface SecurityIncident {
  id: string;
  title: string;
  location: string;
  flightNumber?: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedAt: string;
  assignedOfficer: string;
  description: string;
}

export interface LoungeRecord {
  id: string;
  name: string;
  terminal: string;
  capacity: number;
  currentGuests: number;
  status: 'NORMAL' | 'BUSY' | 'NEAR_CAPACITY';
  eligibleClasses: string[];
}

export interface LoungeVisitLog {
  id: string;
  pnr: string;
  passengerName: string;
  flightNumber: string;
  loungeName: string;
  accessTier: string;
  timestamp: string;
}

// ============================================================================
// INITIAL MOCK DATA
// ============================================================================

const INITIAL_FLIGHTS_GATE: GateFlightReadiness[] = [
  {
    flightNumber: 'AI-203',
    airline: 'Air India',
    destination: 'London Heathrow (LHR)',
    gate: 'Gate A12',
    terminal: 'Terminal 2',
    scheduledDeparture: '14:45 Local',
    boardingStatus: 'BOARDING_STARTED',
    bookedPassengers: 160,
    checkedInPassengers: 158,
    boardedPassengers: 142,
    securityCleared: true,
    cabinCleaningCleared: true,
    maintenanceReleased: true,
    fuelingCompleted: true,
  },
  {
    flightNumber: '6E-521',
    airline: 'IndiGo',
    destination: 'Singapore Changi (SIN)',
    gate: 'Gate B04',
    terminal: 'Terminal 1',
    scheduledDeparture: '15:20 Local',
    boardingStatus: 'LOCKED',
    bookedPassengers: 180,
    checkedInPassengers: 174,
    boardedPassengers: 0,
    securityCleared: false, // Security sweep pending!
    cabinCleaningCleared: true,
    maintenanceReleased: true,
    fuelingCompleted: true,
  },
  {
    flightNumber: 'UK-901',
    airline: 'Vistara',
    destination: 'Dubai International (DXB)',
    gate: 'Gate C08',
    terminal: 'Terminal 2',
    scheduledDeparture: '16:00 Local',
    boardingStatus: 'LOCKED',
    bookedPassengers: 144,
    checkedInPassengers: 130,
    boardedPassengers: 0,
    securityCleared: false,
    cabinCleaningCleared: false,
    maintenanceReleased: true,
    fuelingCompleted: false,
  },
  {
    flightNumber: 'SPH-102',
    airline: 'Saphire Executive',
    destination: 'Frankfurt (FRA)',
    gate: 'Gate A02',
    terminal: 'Terminal 2',
    scheduledDeparture: '13:50 Local',
    boardingStatus: 'PUSHBACK_READY',
    bookedPassengers: 220,
    checkedInPassengers: 220,
    boardedPassengers: 220,
    securityCleared: true,
    cabinCleaningCleared: true,
    maintenanceReleased: true,
    fuelingCompleted: true,
  },
];

const INITIAL_PASSENGERS: PassengerRecord[] = [
  {
    pnr: 'PNR-AI203-01',
    name: 'Lord Harrison Sterling',
    flightNumber: 'AI-203',
    seat: '02A',
    cabinClass: 'FIRST',
    gate: 'Gate A12',
    clearanceStatus: 'BOARDED',
    verificationMethod: 'BIOMETRIC_EGATE',
    specialAssistance: 'VIP Protocol',
    passportLast4: '9841',
    boardingTime: '14:05',
    notes: 'Diplomatic fast-track approved',
  },
  {
    pnr: 'PNR-AI203-02',
    name: 'Dr. Evelyn Morales',
    flightNumber: 'AI-203',
    seat: '14C',
    cabinClass: 'BUSINESS',
    gate: 'Gate A12',
    clearanceStatus: 'BOARDED',
    verificationMethod: 'BIOMETRIC_EGATE',
    specialAssistance: 'None',
    passportLast4: '3312',
    boardingTime: '14:12',
  },
  {
    pnr: 'PNR-AI203-03',
    name: 'Vikramaditya Rao',
    flightNumber: 'AI-203',
    seat: '28D',
    cabinClass: 'ECONOMY',
    gate: 'Gate A12',
    clearanceStatus: 'FLAGGED_REVIEW',
    verificationMethod: 'OFFICER_MANUAL',
    specialAssistance: 'None',
    passportLast4: '8820',
    notes: 'Secondary luggage inspection flag at checkpoint C',
  },
  {
    pnr: 'PNR-AI203-04',
    name: 'Amira Benali',
    flightNumber: 'AI-203',
    seat: '08F',
    cabinClass: 'BUSINESS',
    gate: 'Gate A12',
    clearanceStatus: 'CLEARED',
    verificationMethod: 'BARCODE_SCAN',
    specialAssistance: 'None',
    passportLast4: '4190',
  },
  {
    pnr: 'PNR-6E521-01',
    name: 'Kenji Takahashi',
    flightNumber: '6E-521',
    seat: '12B',
    cabinClass: 'ECONOMY',
    gate: 'Gate B04',
    clearanceStatus: 'CLEARED',
    verificationMethod: 'BIOMETRIC_EGATE',
    specialAssistance: 'None',
    passportLast4: '7734',
  },
  {
    pnr: 'PNR-6E521-02',
    name: 'Marcus Vance',
    flightNumber: '6E-521',
    seat: '18A',
    cabinClass: 'ECONOMY',
    gate: 'Gate B04',
    clearanceStatus: 'DENIED',
    verificationMethod: 'OFFICER_MANUAL',
    specialAssistance: 'None',
    passportLast4: '1092',
    notes: 'Transit visa expiration discrepancy. Handed to immigration.',
  },
  {
    pnr: 'PNR-UK901-01',
    name: 'Pooja Sundaram',
    flightNumber: 'UK-901',
    seat: '04A',
    cabinClass: 'BUSINESS',
    gate: 'Gate C08',
    clearanceStatus: 'CLEARED',
    verificationMethod: 'BIOMETRIC_EGATE',
    specialAssistance: 'WCHR Wheelchair Request',
    passportLast4: '5561',
  },
];

const INITIAL_LOST_FOUND: LostFoundItem[] = [
  {
    id: 'LF-2024-089',
    title: 'Apple iPad Pro 11" Space Grey',
    category: 'ELECTRONICS',
    locationFound: 'Terminal 2 Security Checkpoint B',
    reportedBy: 'Public Portal - Priya Sharma',
    contactNumber: '+91 98765 43210',
    linkedPnr: 'PNR-AI203-03',
    flightNumber: 'AI-203',
    status: 'MATCHED',
    reportedDate: 'Today, 11:20 AM',
    description: 'Black magnetic folio cover, sticker of NASA on back casing.',
    color: 'Space Grey',
    storageLocker: 'Locker B-14',
  },
  {
    id: 'LF-2024-090',
    title: 'Samsonite Hard-Shell Carry-On (Navy)',
    category: 'BAGGAGE',
    locationFound: 'Gate A12 Seating Area Stand 4',
    reportedBy: 'Gate Agent Aarav',
    contactNumber: 'Airside Staff Extension 402',
    flightNumber: 'AI-203',
    status: 'READY_FOR_COLLECTION',
    reportedDate: 'Today, 12:45 PM',
    description: 'Left near charging kiosk. Luggage tag reads Harrison Sterling.',
    color: 'Navy Blue',
    storageLocker: 'Secure Vault A',
  },
  {
    id: 'LF-2024-091',
    title: 'Leather Passport Holder with Visa Documents',
    category: 'DOCUMENTS',
    locationFound: 'Terminal 1 Concourse Duty Free',
    reportedBy: 'Public Portal - Kenji Takahashi',
    contactNumber: '+81 90 1234 5678',
    linkedPnr: 'PNR-6E521-01',
    flightNumber: '6E-521',
    status: 'NEW_REPORT',
    reportedDate: 'Today, 13:10 PM',
    description: 'Tan leather passport case holding Japanese passport & boarding stub.',
    color: 'Tan Brown',
    storageLocker: 'Intake Desk Shelf 2',
  },
  {
    id: 'LF-2024-092',
    title: 'Bose Noise Cancelling Headphones 700',
    category: 'ELECTRONICS',
    locationFound: 'Plaza Premium Lounge Quiet Zone',
    reportedBy: 'Lounge Concierge David',
    contactNumber: 'Plaza Reception Ext 911',
    status: 'SEARCHING',
    reportedDate: 'Today, 09:30 AM',
    description: 'Black zip case with audio cable and USB-C adapter.',
    color: 'Black',
    storageLocker: 'Locker C-03',
  },
  {
    id: 'LF-2024-085',
    title: 'Gold Wristwatch (Seiko Presage)',
    category: 'VALUABLES',
    locationFound: 'Security Screening Tray Scanner 4',
    reportedBy: 'Officer Aarav Li',
    contactNumber: '+91 94441 22334',
    status: 'RETURNED',
    reportedDate: 'Yesterday, 18:00 PM',
    description: 'Brown leather strap, white dial. Passenger verified with purchase bill.',
    color: 'Gold / Brown',
    storageLocker: 'Archived Release',
  },
];

const INITIAL_INCIDENTS: SecurityIncident[] = [
  {
    id: 'INC-881',
    title: 'Unattended Cabin Bag Detected',
    location: 'Gate A14 Concourse Seats',
    flightNumber: 'AI-203',
    severity: 'HIGH',
    status: 'INVESTIGATING',
    reportedAt: '12 mins ago',
    assignedOfficer: 'Officer Aarav Li',
    description: 'K9 bomb disposal team sweeping perimeter. Standby cordon established.',
  },
  {
    id: 'INC-882',
    title: 'Transit Visa Documentation Discrepancy',
    location: 'Gate B04 Boarding Turnstile',
    flightNumber: '6E-521',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    reportedAt: '25 mins ago',
    assignedOfficer: 'Immigration Desk 3',
    description: 'Passenger PNR-6420 re-routed to consular desk for visa verification.',
  },
  {
    id: 'INC-883',
    title: 'Biometric E-Gate Reader #4 Optical Timeout',
    location: 'Terminal 2 Concourse Central E-Gates',
    severity: 'LOW',
    status: 'INVESTIGATING',
    reportedAt: '42 mins ago',
    assignedOfficer: 'Tech Support Team B',
    description: 'Sensor recalibration in progress. 5 adjacent lanes operational.',
  },
];

const INITIAL_LOUNGES: LoungeRecord[] = [
  {
    id: 'LNG-01',
    name: 'Saphire First Class Presidential Suite',
    terminal: 'Terminal 2',
    capacity: 60,
    currentGuests: 48,
    status: 'BUSY',
    eligibleClasses: ['First Class', 'Diplomatic VIP'],
  },
  {
    id: 'LNG-02',
    name: 'Maharaja Business Lounge',
    terminal: 'Terminal 2',
    capacity: 150,
    currentGuests: 112,
    status: 'NORMAL',
    eligibleClasses: ['Business Class', 'Star Alliance Gold'],
  },
  {
    id: 'LNG-03',
    name: 'Plaza Premium Airside Oasis',
    terminal: 'Terminal 1',
    capacity: 120,
    currentGuests: 64,
    status: 'NORMAL',
    eligibleClasses: ['Priority Pass', 'All Ticketed Pass Holders'],
  },
  {
    id: 'LNG-04',
    name: 'Executive Quiet Sanctuary',
    terminal: 'Terminal 1',
    capacity: 40,
    currentGuests: 38,
    status: 'NEAR_CAPACITY',
    eligibleClasses: ['First Class', 'Corporate Members'],
  },
];

const INITIAL_LOUNGE_VISITS: LoungeVisitLog[] = [
  {
    id: 'VST-101',
    pnr: 'PNR-AI203-01',
    passengerName: 'Lord Harrison Sterling',
    flightNumber: 'AI-203',
    loungeName: 'Saphire First Class Presidential Suite',
    accessTier: 'First Class VIP',
    timestamp: '13:15 Local',
  },
  {
    id: 'VST-102',
    pnr: 'PNR-AI203-02',
    passengerName: 'Dr. Evelyn Morales',
    flightNumber: 'AI-203',
    loungeName: 'Maharaja Business Lounge',
    accessTier: 'Business Class',
    timestamp: '13:30 Local',
  },
  {
    id: 'VST-103',
    pnr: 'PNR-UK901-01',
    passengerName: 'Pooja Sundaram',
    flightNumber: 'UK-901',
    loungeName: 'Maharaja Business Lounge',
    accessTier: 'Business Class',
    timestamp: '13:45 Local',
  },
];

// ============================================================================
// MAIN PASSENGER & SECURITY OPERATIONS DASHBOARD
// ============================================================================

export const PassengerSecurityOpsDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // URL Hash Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'boarding' | 'clearance' | 'lost-found' | 'incidents' | 'lounges' | 'notifications' | 'profile'>('overview');

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (['boarding', 'clearance', 'lost-found', 'incidents', 'lounges', 'notifications', 'profile'].includes(hash)) {
      setActiveTab(hash as any);
    } else {
      setActiveTab('overview');
    }
  }, [location.hash]);

  // Core Reactive States
  const [flightsGate, setFlightsGate] = useState<GateFlightReadiness[]>(INITIAL_FLIGHTS_GATE);
  const [selectedFlightNumber, setSelectedFlightNumber] = useState<string>('AI-203');
  const [passengers, setPassengers] = useState<PassengerRecord[]>(INITIAL_PASSENGERS);
  const [lostFoundList, setLostFoundList] = useState<LostFoundItem[]>(INITIAL_LOST_FOUND);
  const [incidents, setIncidents] = useState<SecurityIncident[]>(INITIAL_INCIDENTS);
  const [lounges] = useState<LoungeRecord[]>(INITIAL_LOUNGES);
  const [loungeVisits, setLoungeVisits] = useState<LoungeVisitLog[]>(INITIAL_LOUNGE_VISITS);

  // Cross-dashboard synchronizer with aocsDataStore
  useEffect(() => {
    const syncFromStore = () => {
      // 1. Sync turnaround prerequisites from aocsDataStore
      setFlightsGate((prev) =>
        prev.map((f) => {
          const prereqs = aocsDataStore.getFlightPrerequisites(f.flightNumber);
          const allCleared = prereqs.cleaning && prereqs.refueling && prereqs.maintenance && prereqs.security;
          return {
            ...f,
            cabinCleaningCleared: prereqs.cleaning,
            fuelingCompleted: prereqs.refueling,
            maintenanceReleased: prereqs.maintenance,
            securityCleared: prereqs.security,
            // Auto unlock boarding status if all prerequisites cleared
            boardingStatus: f.boardingStatus === 'LOCKED' && allCleared ? 'BOARDING_STARTED' : f.boardingStatus,
          };
        })
      );

      // 2. Sync public Lost & Found reports
      const storeLostItems = aocsDataStore.getLostFound();
      if (storeLostItems.length > 0) {
        setLostFoundList((prev) => {
          const existingIds = new Set(prev.map((i) => i.id));
          const newFromStore: LostFoundItem[] = storeLostItems
            .filter((item) => !existingIds.has(item.id))
            .map((item) => ({
              id: item.id,
              title: item.title || item.itemName || 'Misplaced Property',
              category: (item.category as any) || 'BAGGAGE',
              locationFound: item.locationFound,
              reportedBy: item.reportedBy || item.contactName || 'Passenger Submission',
              contactNumber: item.contactNumber || item.contactEmail || 'N/A',
              flightNumber: item.flightNumber,
              status: (item.status as LostFoundStatus) || 'NEW_REPORT',
              reportedDate: 'Public Portal Intake',
              description: item.description,
              color: 'N/A',
              storageLocker: 'Public Intake Queue',
            }));
          return [...newFromStore, ...prev];
        });
      }
    };

    syncFromStore();
    const unsub = aocsDataStore.subscribe(syncFromStore);
    return unsub;
  }, []);

  // Filter States for Passenger Table
  const [passengerSearch, setPassengerSearch] = useState('');
  const [passengerFilterStatus, setPassengerFilterStatus] = useState<string>('ALL');

  // Filter States for Lost & Found Table
  const [lfSearch, setLfSearch] = useState('');
  const [lfCategoryFilter, setLfCategoryFilter] = useState<string>('ALL');

  // Modal 1: Boarding Pass Inspection Dialog
  const [selectedPassenger, setSelectedPassenger] = useState<PassengerRecord | null>(null);
  const [passModalOpen, setPassModalOpen] = useState(false);

  // Modal 2: Lost & Found Review & Match Dialog
  const [selectedLfItem, setSelectedLfItem] = useState<LostFoundItem | null>(null);
  const [lfModalOpen, setLfModalOpen] = useState(false);

  // Modal 3: Log New Found Item Dialog (Internal Officer Intake)
  const [newLfModalOpen, setNewLfModalOpen] = useState(false);
  const [newLfTitle, setNewLfTitle] = useState('');
  const [newLfCategory, setNewLfCategory] = useState<'ELECTRONICS' | 'BAGGAGE' | 'DOCUMENTS' | 'VALUABLES' | 'CLOTHING'>('ELECTRONICS');
  const [newLfLocation, setNewLfLocation] = useState('');
  const [newLfDescription, setNewLfDescription] = useState('');
  const [newLfLocker, setNewLfLocker] = useState('');

  // Modal 4: Log Security Incident Dialog
  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [incidentTitle, setIncidentTitle] = useState('');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [incidentSeverity, setIncidentSeverity] = useState<IncidentSeverity>('MEDIUM');
  const [incidentDescription, setIncidentDescription] = useState('');

  // Active Flight Object
  const currentFlight = flightsGate.find((f) => f.flightNumber === selectedFlightNumber) || flightsGate[0];

  // ============================================================================
  // BOARDING CONTROL ACTIONS
  // ============================================================================

  const handleStartBoarding = (flightNum: string) => {
    const flight = flightsGate.find((f) => f.flightNumber === flightNum);
    if (!flight) return;

    // Prerequisite Check
    if (!flight.securityCleared || !flight.cabinCleaningCleared || !flight.maintenanceReleased || !flight.fuelingCompleted) {
      toast.error(`Cannot start boarding for ${flightNum}: Turnaround clearances incomplete!`);
      return;
    }

    setFlightsGate((prev) =>
      prev.map((f) =>
        f.flightNumber === flightNum
          ? { ...f, boardingStatus: 'BOARDING_STARTED' }
          : f
      )
    );

    aocsDataStore.logAuditEvent(
      'FLIGHT',
      `Passenger boarding turnstiles opened at ${flight.gate} for ${flightNum} (${flight.destination})`,
      flightNum,
      user?.fullName || 'Boarding Gate Agent'
    );

    toast.success(`Boarding gate turnstiles activated for Flight ${flightNum}!`);
  };

  const handleFinalCall = (flightNum: string) => {
    setFlightsGate((prev) =>
      prev.map((f) =>
        f.flightNumber === flightNum
          ? { ...f, boardingStatus: 'FINAL_CALL' }
          : f
      )
    );

    aocsDataStore.logAuditEvent(
      'FLIGHT',
      `FINAL CALL broadcasted for flight ${flightNum} at ${currentFlight.gate}`,
      flightNum,
      user?.fullName || 'Gate Agent'
    );

    toast.success(`FINAL CALL broadcasted across concourse and terminal PAs for ${flightNum}!`);
  };

  const handleCloseBoarding = (flightNum: string) => {
    setFlightsGate((prev) =>
      prev.map((f) =>
        f.flightNumber === flightNum
          ? { ...f, boardingStatus: 'BOARDING_CLOSED' }
          : f
      )
    );

    aocsDataStore.logAuditEvent(
      'FLIGHT',
      `Boarding closed for flight ${flightNum}. Reconciling manifest.`,
      flightNum,
      user?.fullName || 'Gate Agent'
    );

    toast.success(`Boarding closed for ${flightNum}. Reconciling final passenger load manifest.`);
  };

  const handleMarkPushbackReady = (flightNum: string) => {
    setFlightsGate((prev) =>
      prev.map((f) =>
        f.flightNumber === flightNum
          ? { ...f, boardingStatus: 'PUSHBACK_READY' }
          : f
      )
    );

    aocsDataStore.logAuditEvent(
      'FLIGHT',
      `Flight ${flightNum} marked PUSHBACK READY at gate ${currentFlight.gate}. Ready for tug assignment.`,
      flightNum,
      user?.fullName || 'Gate Supervisor'
    );

    toast.success(`Flight ${flightNum} marked PUSHBACK READY! Handed off to Ground Ops & AOCC.`);
  };

  const handleClearPrerequisite = (flightNum: string, field: 'securityCleared' | 'cabinCleaningCleared' | 'maintenanceReleased' | 'fuelingCompleted') => {
    const taskTypeMap = {
      cabinCleaningCleared: 'CLEANING',
      fuelingCompleted: 'REFUELING',
      maintenanceReleased: 'MAINTENANCE',
      securityCleared: 'SECURITY',
    } as const;

    // Cross-dashboard update
    aocsDataStore.updateTurnaroundTask(
      flightNum,
      taskTypeMap[field],
      'COMPLETED',
      user?.fullName || 'Airside Supervisor'
    );

    aocsDataStore.logAuditEvent(
      'SECURITY',
      `Prerequisite clearance '${field}' certified for flight ${flightNum}`,
      flightNum,
      user?.fullName || 'Security Supervisor'
    );

    setFlightsGate((prev) =>
      prev.map((f) =>
        f.flightNumber === flightNum
          ? { ...f, [field]: true }
          : f
      )
    );
    toast.success(`Prerequisite '${field}' signed off and propagated across airport network.`);
  };

  // ============================================================================
  // PASSENGER ACTIONS
  // ============================================================================

  const handlePassengerStatusChange = (pnr: string, newStatus: ClearanceStatus) => {
    setPassengers((prev) =>
      prev.map((p) => {
        if (p.pnr === pnr) {
          return {
            ...p,
            clearanceStatus: newStatus,
            boardingTime: newStatus === 'BOARDED' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : p.boardingTime,
          };
        }
        return p;
      })
    );

    // If boarded, increment the flight's boarded counter
    if (newStatus === 'BOARDED') {
      setFlightsGate((prev) =>
        prev.map((f) =>
          f.flightNumber === currentFlight.flightNumber
            ? { ...f, boardedPassengers: Math.min(f.bookedPassengers, f.boardedPassengers + 1) }
            : f
        )
      );
      toast.success(`Passenger ${pnr} verified & boarded.`);
    } else if (newStatus === 'FLAGGED_REVIEW') {
      aocsDataStore.logAuditEvent('SECURITY', `Passenger ${pnr} flagged for secondary screening at gate ${currentFlight.gate}`, currentFlight.flightNumber, user?.fullName || 'Gate Agent');
      toast.error(`Passenger ${pnr} flagged for secondary security screening.`);
    } else {
      toast.success(`Passenger status updated to ${newStatus}.`);
    }
  };

  // ============================================================================
  // LOST & FOUND ACTIONS
  // ============================================================================

  const handleSaveNewFoundItem = () => {
    if (!newLfTitle.trim() || !newLfLocation.trim()) {
      toast.error('Title and location found are required.');
      return;
    }

    const newItem: LostFoundItem = {
      id: `LF-2024-${Math.floor(100 + Math.random() * 900)}`,
      title: newLfTitle,
      category: newLfCategory,
      locationFound: newLfLocation,
      reportedBy: `Officer ${user?.name || 'Aarav Patel'}`,
      contactNumber: 'Security Office Ext 204',
      status: 'SEARCHING',
      reportedDate: 'Just now',
      description: newLfDescription || 'Retrieved from airside concourse.',
      color: 'Standard',
      storageLocker: newLfLocker || 'Locker Sec-01',
    };

    setLostFoundList((prev) => [newItem, ...prev]);

    // Cross-dashboard bridge
    aocsDataStore.reportLostItem({
      category: newLfCategory,
      itemName: newLfTitle,
      description: newLfDescription || 'Retrieved from airside concourse.',
      locationFound: newLfLocation,
      contactName: `Officer ${user?.name || 'Aarav Patel'}`,
      contactEmail: 'security@saphire-airport.internal',
    });

    aocsDataStore.logAuditEvent(
      'SECURITY',
      `Found item intake logged: ${newLfTitle} found at ${newLfLocation}`,
      undefined,
      user?.fullName || 'Security Officer'
    );

    setNewLfModalOpen(false);
    setNewLfTitle('');
    setNewLfLocation('');
    setNewLfDescription('');
    setNewLfLocker('');
    toast.success(`Found item ${newItem.id} cataloged into secure storage!`);
  };

  const handleUpdateLfStatus = (itemId: string, newStatus: LostFoundStatus) => {
    setLostFoundList((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
    if (selectedLfItem && selectedLfItem.id === itemId) {
      setSelectedLfItem((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    if (newStatus === 'RETURNED') {
      aocsDataStore.resolveLostItem(itemId);
    }

    aocsDataStore.logAuditEvent(
      'SECURITY',
      `Lost & Found record ${itemId} updated to ${newStatus.replace(/_/g, ' ')}`,
      undefined,
      user?.fullName || 'Security Officer'
    );

    toast.success(`Item ${itemId} status updated to ${newStatus.replace(/_/g, ' ')}!`);
  };

  // ============================================================================
  // INCIDENT ACTIONS
  // ============================================================================

  const handleSaveIncident = () => {
    if (!incidentTitle.trim() || !incidentLocation.trim()) {
      toast.error('Incident title and location are required.');
      return;
    }

    const newInc: SecurityIncident = {
      id: `INC-${Math.floor(800 + Math.random() * 199)}`,
      title: incidentTitle,
      location: incidentLocation,
      severity: incidentSeverity,
      status: 'INVESTIGATING',
      reportedAt: 'Just now',
      assignedOfficer: user?.name || 'Officer Aarav Li',
      description: incidentDescription || 'Incident reported by airside checkpoint.',
    };

    setIncidents((prev) => [newInc, ...prev]);

    // Cross-dashboard incident logging
    aocsDataStore.logIncident({
      title: incidentTitle,
      severity: incidentSeverity,
      location: incidentLocation,
      description: incidentDescription,
    });

    aocsDataStore.logAuditEvent(
      'SECURITY',
      `SECURITY DISPATCH [${incidentSeverity}]: ${incidentTitle} at ${incidentLocation}`,
      undefined,
      user?.fullName || 'Security Officer'
    );

    setIncidentModalOpen(false);
    setIncidentTitle('');
    setIncidentLocation('');
    setIncidentDescription('');
    toast.success(`Security incident ${newInc.id} logged and dispatched!`);
  };

  const handleResolveIncident = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId ? { ...inc, status: 'RESOLVED' } : inc
      )
    );

    aocsDataStore.resolveIncident(incidentId);
    aocsDataStore.logAuditEvent(
      'SECURITY',
      `Incident ${incidentId} resolved and logged in security audit`,
      undefined,
      user?.fullName || 'Security Supervisor'
    );

    toast.success(`Incident ${incidentId} resolved and logged in security audit.`);
  };

  // Filtered Passenger List
  const filteredPassengers = passengers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(passengerSearch.toLowerCase()) ||
      p.pnr.toLowerCase().includes(passengerSearch.toLowerCase()) ||
      p.seat.toLowerCase().includes(passengerSearch.toLowerCase()) ||
      p.flightNumber.toLowerCase().includes(passengerSearch.toLowerCase());
    const matchesStatus =
      passengerFilterStatus === 'ALL' || p.clearanceStatus === passengerFilterStatus;
    return matchesSearch && matchesStatus;
  });

  // Filtered Lost & Found List
  const filteredLostFound = lostFoundList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(lfSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(lfSearch.toLowerCase()) ||
      item.locationFound.toLowerCase().includes(lfSearch.toLowerCase()) ||
      (item.linkedPnr && item.linkedPnr.toLowerCase().includes(lfSearch.toLowerCase()));
    const matchesCategory =
      lfCategoryFilter === 'ALL' || item.category === lfCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout activeRole="passenger-security">
      {/* ========================================================================= */}
      {/* HEADER: TITLE & OPERATIONAL STATUS                                        */}
      {/* ========================================================================= */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          mb: 3.5,
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              Passenger & Security Operations
            </Typography>
            <Chip
              label="AIRSIDE SECURITY LEVEL 1"
              size="small"
              sx={{
                height: 22,
                fontSize: '0.66rem',
                fontWeight: 800,
                backgroundColor: '#EFF6FF',
                color: '#0284C7',
                border: '1px solid #BAE6FD',
              }}
            />
          </Box>
          <Typography sx={{ fontSize: '0.84rem', color: '#64748B', mt: 0.5, fontFamily: "'Outfit', sans-serif" }}>
            Biometric gate screening, passenger manifests, airside clearances & public lost-and-found bridge.
          </Typography>
        </Box>

        {/* Action Buttons: Kept strictly on a single horizontal row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0, flexWrap: 'nowrap' }}>
          <Button
            variant="outlined"
            onClick={() => setNewLfModalOpen(true)}
            startIcon={<Plus size={15} />}
            sx={{
              borderColor: '#E2E8F0',
              color: '#0F2942',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              borderRadius: '9px',
              px: 1.8,
              py: 0.85,
              whiteSpace: 'nowrap',
              backgroundColor: '#FFFFFF',
              '&:hover': { borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' },
            }}
          >
            Intake Found Item
          </Button>

          <Button
            variant="contained"
            onClick={() => setIncidentModalOpen(true)}
            startIcon={<AlertTriangle size={15} />}
            sx={{
              backgroundColor: '#0F2942',
              color: '#FFFFFF',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              borderRadius: '9px',
              px: 2,
              py: 0.85,
              whiteSpace: 'nowrap',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#1E3A5F', boxShadow: 'none' },
            }}
          >
            Log Security Incident
          </Button>
        </Box>
      </Box>

      {/* ========================================================================= */}
      {/* 4 PROPTIA KPI METRIC CARDS                                                */}
      {/* ========================================================================= */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 2.5,
          mb: 3.5,
        }}
      >
        {/* KPI 1: Active Manifest */}
        <Card
          onClick={() => navigate('/dashboard/passenger-security#clearance')}
          sx={{
            p: 2.5,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'translateY(-2px)', borderColor: '#0284C7' },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                TOTAL BOOKED MANIFEST
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mt: 0.6 }}>
                {flightsGate.reduce((acc, f) => acc + f.bookedPassengers, 0).toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ p: 1.2, borderRadius: '10px', backgroundColor: '#F0F9FF', color: '#0284C7' }}>
              <UserCheck size={20} />
            </Box>
          </Box>
          <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label={`${flightsGate.length} ACTIVE FLIGHTS`} size="small" sx={{ height: 20, fontSize: '0.62rem', fontWeight: 800, backgroundColor: '#E0F2FE', color: '#0369A1' }} />
            <Typography sx={{ fontSize: '0.74rem', color: '#64748B' }}>Terminal 1 & 2</Typography>
          </Box>
        </Card>

        {/* KPI 2: Checked-In */}
        <Card
          onClick={() => navigate('/dashboard/passenger-security#boarding')}
          sx={{
            p: 2.5,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'translateY(-2px)', borderColor: '#16A34A' },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                CHECKED-IN PASSENGERS
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mt: 0.6 }}>
                {flightsGate.reduce((acc, f) => acc + f.checkedInPassengers, 0).toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ p: 1.2, borderRadius: '10px', backgroundColor: '#F0FDF4', color: '#16A34A' }}>
              <CheckCircle2 size={20} />
            </Box>
          </Box>
          <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A' }}>
              {Math.round((flightsGate.reduce((acc, f) => acc + f.checkedInPassengers, 0) / (flightsGate.reduce((acc, f) => acc + f.bookedPassengers, 0) || 1)) * 100)}% check-in rate
            </Typography>
            <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8' }}>
              · {flightsGate.reduce((acc, f) => acc + f.bookedPassengers, 0) - flightsGate.reduce((acc, f) => acc + f.checkedInPassengers, 0)} pending
            </Typography>
          </Box>
        </Card>

        {/* KPI 3: Boarded & Cleared */}
        <Card
          onClick={() => navigate('/dashboard/passenger-security#boarding')}
          sx={{
            p: 2.5,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'translateY(-2px)', borderColor: '#7C3AED' },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                BOARDED THROUGH GATES
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mt: 0.6 }}>
                {flightsGate.reduce((acc, f) => acc + f.boardedPassengers, 0).toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ p: 1.2, borderRadius: '10px', backgroundColor: '#F5F3FF', color: '#7C3AED' }}>
              <Plane size={20} />
            </Box>
          </Box>
          <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#7C3AED' }}>
              {Math.round((flightsGate.reduce((acc, f) => acc + f.boardedPassengers, 0) / (flightsGate.reduce((acc, f) => acc + f.bookedPassengers, 0) || 1)) * 100)}% boarded
            </Typography>
            <Typography sx={{ fontSize: '0.74rem', color: '#64748B' }}>· Biometric E-Gates Active</Typography>
          </Box>
        </Card>

        {/* KPI 4: Security Alerts & Incidents */}
        <Card
          onClick={() => navigate('/dashboard/passenger-security#incidents')}
          sx={{
            p: 2.5,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'translateY(-2px)', borderColor: '#EF4444' },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                ACTIVE ALERTS & INCIDENTS
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#EF4444', mt: 0.6 }}>
                {incidents.filter((i) => i.status !== 'RESOLVED').length}
              </Typography>
            </Box>
            <Box sx={{ p: 1.2, borderRadius: '10px', backgroundColor: '#FEF2F2', color: '#EF4444' }}>
              <ShieldAlert size={20} />
            </Box>
          </Box>
          <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={`${incidents.filter((i) => (i.severity === 'CRITICAL' || i.severity === 'HIGH') && i.status !== 'RESOLVED').length} HIGH PRIORITY`}
              size="small"
              sx={{ height: 20, fontSize: '0.62rem', fontWeight: 800, backgroundColor: '#FEE2E2', color: '#B91C1C' }}
            />
            <Typography sx={{ fontSize: '0.74rem', color: '#64748B' }}>Airside dispatch monitoring</Typography>
          </Box>
        </Card>
      </Box>

      {/* Contextual Subview Breadcrumb (When routed via sidebar hash) */}
      {activeTab !== 'overview' && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
            p: 1.5,
            px: 2.2,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 600 }}>
              Active Workspace Subview:
            </Typography>
            <Chip
              label={activeTab.toUpperCase().replace(/-/g, ' ')}
              size="small"
              sx={{ fontWeight: 800, fontSize: '0.72rem', backgroundColor: '#EFF6FF', color: '#0284C7', border: '1px solid #BAE6FD' }}
            />
          </Box>
          <Button
            size="small"
            onClick={() => {
              setActiveTab('overview');
              navigate('/dashboard/passenger-security');
            }}
            startIcon={<Sliders size={14} />}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.8rem',
              color: '#0F2942',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              px: 1.6,
              '&:hover': { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' },
            }}
          >
            Return to Operations Console
          </Button>
        </Box>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW / OPERATIONS CONSOLE                                      */}
      {/* ========================================================================= */}
      {(activeTab === 'overview' || activeTab === 'boarding') && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, mb: 4 }}>
          {/* SECTION: BOARDING GATE CONTROL & PREREQUISITES VERIFICATION */}
          <Card
            sx={{
              p: 3,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 3 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                    Boarding Gate Readiness & Turnstile Control
                  </Typography>
                  <Chip
                    label={currentFlight.boardingStatus.replace(/_/g, ' ')}
                    size="small"
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.7rem',
                      backgroundColor:
                        currentFlight.boardingStatus === 'BOARDING_STARTED'
                          ? '#DCFCE7'
                          : currentFlight.boardingStatus === 'FINAL_CALL'
                          ? '#FEF3C7'
                          : currentFlight.boardingStatus === 'PUSHBACK_READY'
                          ? '#E0F2FE'
                          : '#FEE2E2',
                      color:
                        currentFlight.boardingStatus === 'BOARDING_STARTED'
                          ? '#15803D'
                          : currentFlight.boardingStatus === 'FINAL_CALL'
                          ? '#B45309'
                          : currentFlight.boardingStatus === 'PUSHBACK_READY'
                          ? '#0369A1'
                          : '#B91C1C',
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: '0.82rem', color: '#64748B', mt: 0.5 }}>
                  Enforce operational prerequisite checks (Security clearance, Cabin cleaning, Maintenance release) before authorizing gate turnstiles.
                </Typography>
              </Box>

              {/* Flight Selector */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>
                  ACTIVE FLIGHT:
                </Typography>
                <TextField
                  select
                  size="small"
                  value={selectedFlightNumber}
                  onChange={(e) => setSelectedFlightNumber(e.target.value)}
                  sx={{
                    width: 220,
                    backgroundColor: '#F8FAFC',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      color: '#0F2942',
                    },
                  }}
                >
                  {flightsGate.map((f) => (
                    <MenuItem key={f.flightNumber} value={f.flightNumber} sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.86rem' }}>
                      {f.flightNumber} · {f.gate} ({f.airline})
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            {/* Flight Flight Board & Gate Telemetry */}
            <Box
              sx={{
                p: 2.5,
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
                gap: 2,
                mb: 3,
              }}
            >
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>FLIGHT & DESTINATION</Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.05rem', color: '#0F2942', mt: 0.3 }}>
                  {currentFlight.flightNumber} · {currentFlight.airline}
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#0284C7', fontWeight: 600 }}>
                  {currentFlight.destination}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>ASSIGNED GATE & TERMINAL</Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.05rem', color: '#0F2942', mt: 0.3 }}>
                  {currentFlight.gate}
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
                  {currentFlight.terminal} · STD {currentFlight.scheduledDeparture}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>BOARDING MANIFEST RATIO</Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.05rem', color: '#0F2942', mt: 0.3 }}>
                  {currentFlight.boardedPassengers} / {currentFlight.bookedPassengers} Boarded
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.6 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(currentFlight.boardedPassengers / currentFlight.bookedPassengers) * 100}
                    sx={{
                      width: '100%',
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#E2E8F0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor:
                          currentFlight.boardedPassengers === currentFlight.bookedPassengers ? '#16A34A' : '#0284C7',
                      },
                    }}
                  />
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284C7', whiteSpace: 'nowrap' }}>
                    {Math.round((currentFlight.boardedPassengers / currentFlight.bookedPassengers) * 100)}%
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>CHECKED-IN COUNT</Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.05rem', color: '#0F2942', mt: 0.3 }}>
                  {currentFlight.checkedInPassengers} Passengers
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 600 }}>
                  {currentFlight.bookedPassengers - currentFlight.checkedInPassengers} No-Show / Gate Pending
                </Typography>
              </Box>
            </Box>

            {/* Prerequisites Checklist Banner */}
            <Box
              sx={{
                p: 2.2,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: currentFlight.boardingStatus === 'LOCKED' ? '#FCA5A5' : '#BBF7D0',
                backgroundColor: currentFlight.boardingStatus === 'LOCKED' ? '#FEF2F2' : '#F0FDF4',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {currentFlight.boardingStatus === 'LOCKED' ? (
                    <Lock size={18} color="#DC2626" />
                  ) : (
                    <Unlock size={18} color="#16A34A" />
                  )}
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.92rem', color: currentFlight.boardingStatus === 'LOCKED' ? '#991B1B' : '#166534' }}>
                    {currentFlight.boardingStatus === 'LOCKED'
                      ? '⚠ BOARDING LOCKED: Mandatory airside clearance prerequisites pending verification'
                      : '✓ ALL CLEARANCES VERIFIED: Turnstiles authorized for passenger embarkation'}
                  </Typography>
                </Box>
              </Box>

              {/* Prerequisite Badges & Overrides */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
                <Chip
                  icon={currentFlight.securityCleared ? <Check size={14} /> : <AlertTriangle size={14} />}
                  label={`Security Sweep: ${currentFlight.securityCleared ? 'CLEARED' : 'PENDING'}`}
                  size="small"
                  onClick={() => !currentFlight.securityCleared && handleClearPrerequisite(currentFlight.flightNumber, 'securityCleared')}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.76rem',
                    cursor: !currentFlight.securityCleared ? 'pointer' : 'default',
                    backgroundColor: currentFlight.securityCleared ? '#DCFCE7' : '#FEE2E2',
                    color: currentFlight.securityCleared ? '#15803D' : '#B91C1C',
                    border: '1px solid',
                    borderColor: currentFlight.securityCleared ? '#86EFAC' : '#FCA5A5',
                  }}
                />

                <Chip
                  icon={currentFlight.cabinCleaningCleared ? <Check size={14} /> : <AlertTriangle size={14} />}
                  label={`Cabin Cleaning: ${currentFlight.cabinCleaningCleared ? 'COMPLETED' : 'PENDING'}`}
                  size="small"
                  onClick={() => !currentFlight.cabinCleaningCleared && handleClearPrerequisite(currentFlight.flightNumber, 'cabinCleaningCleared')}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.76rem',
                    cursor: !currentFlight.cabinCleaningCleared ? 'pointer' : 'default',
                    backgroundColor: currentFlight.cabinCleaningCleared ? '#DCFCE7' : '#FEE2E2',
                    color: currentFlight.cabinCleaningCleared ? '#15803D' : '#B91C1C',
                    border: '1px solid',
                    borderColor: currentFlight.cabinCleaningCleared ? '#86EFAC' : '#FCA5A5',
                  }}
                />

                <Chip
                  icon={currentFlight.maintenanceReleased ? <Check size={14} /> : <AlertTriangle size={14} />}
                  label={`Maintenance: ${currentFlight.maintenanceReleased ? 'RELEASED' : 'PENDING'}`}
                  size="small"
                  onClick={() => !currentFlight.maintenanceReleased && handleClearPrerequisite(currentFlight.flightNumber, 'maintenanceReleased')}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.76rem',
                    cursor: !currentFlight.maintenanceReleased ? 'pointer' : 'default',
                    backgroundColor: currentFlight.maintenanceReleased ? '#DCFCE7' : '#FEE2E2',
                    color: currentFlight.maintenanceReleased ? '#15803D' : '#B91C1C',
                    border: '1px solid',
                    borderColor: currentFlight.maintenanceReleased ? '#86EFAC' : '#FCA5A5',
                  }}
                />

                <Chip
                  icon={currentFlight.fuelingCompleted ? <Check size={14} /> : <AlertTriangle size={14} />}
                  label={`Fuel Load: ${currentFlight.fuelingCompleted ? 'COMPLETED' : 'PENDING'}`}
                  size="small"
                  onClick={() => !currentFlight.fuelingCompleted && handleClearPrerequisite(currentFlight.flightNumber, 'fuelingCompleted')}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.76rem',
                    cursor: !currentFlight.fuelingCompleted ? 'pointer' : 'default',
                    backgroundColor: currentFlight.fuelingCompleted ? '#DCFCE7' : '#FEE2E2',
                    color: currentFlight.fuelingCompleted ? '#15803D' : '#B91C1C',
                    border: '1px solid',
                    borderColor: currentFlight.fuelingCompleted ? '#86EFAC' : '#FCA5A5',
                  }}
                />
              </Box>
            </Box>

            {/* Boarding Lifecycle Control Actions */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
              <Button
                variant="contained"
                disabled={currentFlight.boardingStatus === 'BOARDING_STARTED' || currentFlight.boardingStatus === 'PUSHBACK_READY'}
                onClick={() => handleStartBoarding(currentFlight.flightNumber)}
                startIcon={<Plane size={16} />}
                sx={{
                  backgroundColor: '#0284C7',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  borderRadius: '9px',
                  px: 2.5,
                  py: 1,
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: '#0369A1', boxShadow: 'none' },
                  '&.Mui-disabled': { backgroundColor: '#E2E8F0', color: '#94A3B8' },
                }}
              >
                Start Boarding
              </Button>

              <Button
                variant="contained"
                disabled={currentFlight.boardingStatus !== 'BOARDING_STARTED'}
                onClick={() => handleFinalCall(currentFlight.flightNumber)}
                startIcon={<Bell size={16} />}
                sx={{
                  backgroundColor: '#D97706',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  borderRadius: '9px',
                  px: 2.5,
                  py: 1,
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: '#B45309', boxShadow: 'none' },
                  '&.Mui-disabled': { backgroundColor: '#E2E8F0', color: '#94A3B8' },
                }}
              >
                Broadcast Final Call
              </Button>

              <Button
                variant="contained"
                disabled={currentFlight.boardingStatus === 'BOARDING_CLOSED' || currentFlight.boardingStatus === 'PUSHBACK_READY' || currentFlight.boardingStatus === 'LOCKED'}
                onClick={() => handleCloseBoarding(currentFlight.flightNumber)}
                startIcon={<Lock size={16} />}
                sx={{
                  backgroundColor: '#0F2942',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  borderRadius: '9px',
                  px: 2.5,
                  py: 1,
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: '#1E3A5F', boxShadow: 'none' },
                  '&.Mui-disabled': { backgroundColor: '#E2E8F0', color: '#94A3B8' },
                }}
              >
                Close Boarding
              </Button>

              <Button
                variant="outlined"
                disabled={currentFlight.boardingStatus !== 'BOARDING_CLOSED'}
                onClick={() => handleMarkPushbackReady(currentFlight.flightNumber)}
                startIcon={<CheckCircle2 size={16} />}
                sx={{
                  borderColor: '#16A34A',
                  color: '#16A34A',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  borderRadius: '9px',
                  px: 2.5,
                  py: 1,
                  '&:hover': { backgroundColor: '#F0FDF4', borderColor: '#15803D' },
                  '&.Mui-disabled': { borderColor: '#E2E8F0', color: '#94A3B8' },
                }}
              >
                Sign-off Pushback Ready
              </Button>
            </Box>
          </Card>
        </Box>
      )}

      {/* ========================================================================= */}
      {/* TAB 2 / MAIN: PASSENGER MANIFEST & CLEARANCE MONITOR                      */}
      {/* ========================================================================= */}
      {(activeTab === 'overview' || activeTab === 'clearance') && (
        <Card
          sx={{
            p: 3,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                Live Passenger Security & Boarding Clearance Manifest
              </Typography>
              <Typography sx={{ fontSize: '0.82rem', color: '#64748B', mt: 0.3 }}>
                E-Gate biometric records, watchlist inspection flags, and seat allocations for departure flights.
              </Typography>
            </Box>

            {/* Filter & Search Bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search PNR, name, seat..."
                value={passengerSearch}
                onChange={(e) => setPassengerSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <Search size={16} color="#94A3B8" style={{ marginRight: 8 }} />,
                    sx: { fontFamily: "'Outfit', sans-serif", fontSize: '0.84rem' },
                  },
                }}
                sx={{ width: { xs: '100%', sm: 220 }, backgroundColor: '#F8FAFC', borderRadius: '8px' }}
              />

              <TextField
                select
                size="small"
                value={passengerFilterStatus}
                onChange={(e) => setPassengerFilterStatus(e.target.value)}
                sx={{
                  width: 170,
                  backgroundColor: '#F8FAFC',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-root': {
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 600,
                    fontSize: '0.84rem',
                  },
                }}
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="CLEARED">Cleared</MenuItem>
                <MenuItem value="BOARDED">Boarded</MenuItem>
                <MenuItem value="FLAGGED_REVIEW">Flagged for Review</MenuItem>
                <MenuItem value="DENIED">Denied</MenuItem>
              </TextField>
            </Box>
          </Box>

          <TableContainer sx={{ borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ color: '#64748B', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.75rem' }}>PNR RECORD</TableCell>
                  <TableCell sx={{ color: '#64748B', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.75rem' }}>PASSENGER NAME</TableCell>
                  <TableCell sx={{ color: '#64748B', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.75rem' }}>SEAT & CABIN</TableCell>
                  <TableCell sx={{ color: '#64748B', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.75rem' }}>FLIGHT / GATE</TableCell>
                  <TableCell sx={{ color: '#64748B', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.75rem' }}>VERIFICATION METHOD</TableCell>
                  <TableCell sx={{ color: '#64748B', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.75rem' }}>STATUS</TableCell>
                  <TableCell sx={{ color: '#64748B', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.75rem', textAlign: 'right' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPassengers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4, color: '#94A3B8', fontSize: '0.85rem' }}>
                      No passengers match the specified filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPassengers.map((p) => (
                    <TableRow key={p.pnr} hover sx={{ '&:hover': { backgroundColor: '#F8FAFC' } }}>
                      <TableCell sx={{ fontFamily: "'Inter', monospace", fontWeight: 700, fontSize: '0.84rem', color: '#0284C7' }}>
                        {p.pnr}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.86rem', color: '#0F2942' }}>
                            {p.name}
                          </Typography>
                          {p.specialAssistance !== 'None' && (
                            <Typography sx={{ fontSize: '0.72rem', color: '#7C3AED', fontWeight: 600 }}>
                              {p.specialAssistance}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontFamily: "'Inter', monospace", fontWeight: 700, fontSize: '0.82rem', color: '#0F2942' }}>
                          {p.seat}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>
                          {p.cabinClass}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#0F2942' }}>
                          {p.flightNumber}
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>
                          {p.gate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={p.verificationMethod.replace(/_/g, ' ')}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            backgroundColor:
                              p.verificationMethod === 'BIOMETRIC_EGATE'
                                ? '#EFF6FF'
                                : p.verificationMethod === 'BARCODE_SCAN'
                                ? '#F5F3FF'
                                : '#FEF3C7',
                            color:
                              p.verificationMethod === 'BIOMETRIC_EGATE'
                                ? '#0284C7'
                                : p.verificationMethod === 'BARCODE_SCAN'
                                ? '#7C3AED'
                                : '#B45309',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={p.clearanceStatus.replace(/_/g, ' ')}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            backgroundColor:
                              p.clearanceStatus === 'BOARDED'
                                ? '#DCFCE7'
                                : p.clearanceStatus === 'CLEARED'
                                ? '#E0F2FE'
                                : p.clearanceStatus === 'FLAGGED_REVIEW'
                                ? '#FEF3C7'
                                : '#FEE2E2',
                            color:
                              p.clearanceStatus === 'BOARDED'
                                ? '#15803D'
                                : p.clearanceStatus === 'CLEARED'
                                ? '#0369A1'
                                : p.clearanceStatus === 'FLAGGED_REVIEW'
                                ? '#B45309'
                                : '#B91C1C',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                          <Tooltip title="View Boarding Pass & Details">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedPassenger(p);
                                setPassModalOpen(true);
                              }}
                              sx={{ color: '#0284C7', backgroundColor: '#F0F9FF', '&:hover': { backgroundColor: '#E0F2FE' } }}
                            >
                              <Eye size={15} />
                            </IconButton>
                          </Tooltip>

                          {p.clearanceStatus !== 'BOARDED' && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handlePassengerStatusChange(p.pnr, 'BOARDED')}
                              sx={{
                                fontSize: '0.72rem',
                                py: 0.3,
                                px: 1.2,
                                textTransform: 'none',
                                fontWeight: 700,
                                borderColor: '#E2E8F0',
                                color: '#0F2942',
                                '&:hover': { backgroundColor: '#F0FDF4', borderColor: '#16A34A', color: '#16A34A' },
                              }}
                            >
                              Board
                            </Button>
                          )}

                          {p.clearanceStatus === 'FLAGGED_REVIEW' ? (
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handlePassengerStatusChange(p.pnr, 'CLEARED')}
                              sx={{
                                fontSize: '0.72rem',
                                py: 0.3,
                                px: 1.2,
                                textTransform: 'none',
                                fontWeight: 700,
                                backgroundColor: '#16A34A',
                                boxShadow: 'none',
                                '&:hover': { backgroundColor: '#15803D', boxShadow: 'none' },
                              }}
                            >
                              Clear
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => handlePassengerStatusChange(p.pnr, 'FLAGGED_REVIEW')}
                              sx={{
                                fontSize: '0.72rem',
                                py: 0.3,
                                px: 1,
                                textTransform: 'none',
                                fontWeight: 700,
                                color: '#D97706',
                                '&:hover': { backgroundColor: '#FEF3C7' },
                              }}
                            >
                              Flag
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 3 / BRIDGE: LOST & FOUND COMMAND CENTER                               */}
      {/* ========================================================================= */}
      {(activeTab === 'overview' || activeTab === 'lost-found') && (
        <Card
          sx={{
            p: 3,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 3 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                  Lost & Found Bridge (Public Passenger Inquiries ↔ Airside Ops)
                </Typography>
                <Chip
                  label="PUBLIC BRIDGE ACTIVE"
                  size="small"
                  sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, backgroundColor: '#EFF6FF', color: '#0284C7' }}
                />
              </Box>
              <Typography sx={{ fontSize: '0.82rem', color: '#64748B', mt: 0.3 }}>
                Items submitted via public passenger portal matched against security office inventory and airside locker claims.
              </Typography>
            </Box>

            {/* Search & Category Filter */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search lost items, PNR, locker..."
                value={lfSearch}
                onChange={(e) => setLfSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <Search size={16} color="#94A3B8" style={{ marginRight: 8 }} />,
                    sx: { fontFamily: "'Outfit', sans-serif", fontSize: '0.84rem' },
                  },
                }}
                sx={{ width: { xs: '100%', sm: 220 }, backgroundColor: '#F8FAFC', borderRadius: '8px' }}
              />

              <TextField
                select
                size="small"
                value={lfCategoryFilter}
                onChange={(e) => setLfCategoryFilter(e.target.value)}
                sx={{
                  width: 170,
                  backgroundColor: '#F8FAFC',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-root': {
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 600,
                    fontSize: '0.84rem',
                  },
                }}
              >
                <MenuItem value="ALL">All Categories</MenuItem>
                <MenuItem value="ELECTRONICS">Electronics</MenuItem>
                <MenuItem value="BAGGAGE">Baggage / Luggage</MenuItem>
                <MenuItem value="DOCUMENTS">Documents & Passports</MenuItem>
                <MenuItem value="VALUABLES">Valuables & Jewelry</MenuItem>
                <MenuItem value="CLOTHING">Clothing & Accessories</MenuItem>
              </TextField>

              <Button
                variant="contained"
                onClick={() => setNewLfModalOpen(true)}
                startIcon={<Plus size={15} />}
                sx={{
                  backgroundColor: '#0284C7',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  borderRadius: '8px',
                  px: 2,
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: '#0369A1', boxShadow: 'none' },
                }}
              >
                Log Found
              </Button>
            </Box>
          </Box>

          {/* Lost & Found Item Table */}
          <TableContainer sx={{ borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ color: '#64748B', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.75rem' }}>ITEM ID</TableCell>
                  <TableCell sx={{ color: '#64748B', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.75rem' }}>DESCRIPTION & CATEGORY</TableCell>
                  <TableCell sx={{ color: '#64748B', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.75rem' }}>LOCATION FOUND</TableCell>
                  <TableCell sx={{ color: '#64748B', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.75rem' }}>REPORTED BY / CONTACT</TableCell>
                  <TableCell sx={{ color: '#64748B', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.75rem' }}>STORAGE LOCKER</TableCell>
                  <TableCell sx={{ color: '#64748B', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.75rem' }}>MATCH STATUS</TableCell>
                  <TableCell sx={{ color: '#64748B', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.75rem', textAlign: 'right' }}>ACTION</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLostFound.map((item) => (
                  <TableRow key={item.id} hover sx={{ '&:hover': { backgroundColor: '#F8FAFC' } }}>
                    <TableCell sx={{ fontFamily: "'Inter', monospace", fontWeight: 700, fontSize: '0.84rem', color: '#0F2942' }}>
                      {item.id}
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.86rem', color: '#0F2942' }}>
                        {item.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
                        <Chip
                          label={item.category}
                          size="small"
                          sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, backgroundColor: '#F1F5F9', color: '#475569' }}
                        />
                        {item.linkedPnr && (
                          <Chip
                            label={`PNR: ${item.linkedPnr}`}
                            size="small"
                            sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, backgroundColor: '#E0F2FE', color: '#0369A1' }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <MapPin size={14} color="#64748B" />
                        <Typography sx={{ fontSize: '0.82rem', color: '#475569' }}>
                          {item.locationFound}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F2942' }}>
                        {item.reportedBy}
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {item.contactNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.storageLocker}
                        size="small"
                        sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F2942' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.status.replace(/_/g, ' ')}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          backgroundColor:
                            item.status === 'MATCHED'
                              ? '#FEF3C7'
                              : item.status === 'READY_FOR_COLLECTION'
                              ? '#DCFCE7'
                              : item.status === 'RETURNED'
                              ? '#F1F5F9'
                              : '#E0F2FE',
                          color:
                            item.status === 'MATCHED'
                              ? '#B45309'
                              : item.status === 'READY_FOR_COLLECTION'
                              ? '#15803D'
                              : item.status === 'RETURNED'
                              ? '#64748B'
                              : '#0284C7',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setSelectedLfItem(item);
                          setLfModalOpen(true);
                        }}
                        sx={{
                          fontSize: '0.74rem',
                          py: 0.4,
                          px: 1.4,
                          textTransform: 'none',
                          fontWeight: 700,
                          borderColor: '#E2E8F0',
                          color: '#0284C7',
                          '&:hover': { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' },
                        }}
                      >
                        Review / Match
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: INCIDENTS & AIRSIDE SECURITY MONITOR                               */}
      {/* ========================================================================= */}
      {(activeTab === 'overview' || activeTab === 'incidents') && (
        <Card
          sx={{
            p: 3,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box>
              <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                Airside Security & Checkpoint Incidents
              </Typography>
              <Typography sx={{ fontSize: '0.82rem', color: '#64748B', mt: 0.3 }}>
                Immediate dispatch queue for turnstile overrides, unaccompanied baggage sweeps, and VIP clearances.
              </Typography>
            </Box>

            <Button
              variant="outlined"
              onClick={() => setIncidentModalOpen(true)}
              startIcon={<Plus size={15} />}
              sx={{
                borderColor: '#E2E8F0',
                color: '#0F2942',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                borderRadius: '8px',
                px: 2,
                '&:hover': { borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' },
              }}
            >
              Report Incident
            </Button>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
            {incidents.map((inc) => (
              <Box
                key={inc.id}
                sx={{
                  p: 2.5,
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: inc.severity === 'HIGH' ? '#FECACA' : inc.severity === 'MEDIUM' ? '#FED7AA' : '#E2E8F0',
                  backgroundColor: inc.severity === 'HIGH' ? '#FFF5F5' : inc.severity === 'MEDIUM' ? '#FFFBF5' : '#F8FAFC',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Chip
                      label={inc.severity}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.64rem',
                        fontWeight: 800,
                        backgroundColor: inc.severity === 'HIGH' ? '#FEE2E2' : inc.severity === 'MEDIUM' ? '#FFEDD5' : '#F1F5F9',
                        color: inc.severity === 'HIGH' ? '#B91C1C' : inc.severity === 'MEDIUM' ? '#C2410C' : '#475569',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                      {inc.reportedAt}
                    </Typography>
                  </Box>

                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.94rem', color: '#0F2942', mb: 0.5 }}>
                    {inc.title}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
                    <MapPin size={13} color="#64748B" />
                    <Typography sx={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                      {inc.location} {inc.flightNumber && `· ${inc.flightNumber}`}
                    </Typography>
                  </Box>

                  <Typography sx={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4, mb: 2 }}>
                    {inc.description}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.5, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                    Assigned: {inc.assignedOfficer}
                  </Typography>

                  {inc.status !== 'RESOLVED' ? (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleResolveIncident(inc.id)}
                      sx={{
                        fontSize: '0.72rem',
                        py: 0.3,
                        px: 1.2,
                        textTransform: 'none',
                        fontWeight: 700,
                        backgroundColor: '#16A34A',
                        boxShadow: 'none',
                        '&:hover': { backgroundColor: '#15803D', boxShadow: 'none' },
                      }}
                    >
                      Resolve
                    </Button>
                  ) : (
                    <Chip label="RESOLVED" size="small" sx={{ height: 20, fontSize: '0.62rem', fontWeight: 800, backgroundColor: '#DCFCE7', color: '#15803D' }} />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: LOUNGE VISITS & OCCUPANCY MONITOR                                  */}
      {/* ========================================================================= */}
      {(activeTab === 'overview' || activeTab === 'lounges') && (
        <Card
          sx={{
            p: 3,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                VIP & Business Lounge Occupancy Telemetry
              </Typography>
              <Typography sx={{ fontSize: '0.82rem', color: '#64748B', mt: 0.3 }}>
                Live headcount, turnstile access logs, and seating thresholds across Terminals 1 & 2.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5, mb: 3.5 }}>
            {lounges.map((lounge) => {
              const occupancyPct = Math.round((lounge.currentGuests / lounge.capacity) * 100);
              return (
                <Box
                  key={lounge.id}
                  sx={{
                    p: 2.5,
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B' }}>
                        {lounge.terminal}
                      </Typography>
                      <Chip
                        label={lounge.status.replace(/_/g, ' ')}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          backgroundColor:
                            lounge.status === 'NEAR_CAPACITY'
                              ? '#FEE2E2'
                              : lounge.status === 'BUSY'
                              ? '#FEF3C7'
                              : '#DCFCE7',
                          color:
                            lounge.status === 'NEAR_CAPACITY'
                              ? '#B91C1C'
                              : lounge.status === 'BUSY'
                              ? '#B45309'
                              : '#15803D',
                        }}
                      />
                    </Box>

                    <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.94rem', color: '#0F2942', mb: 1 }}>
                      {lounge.name}
                    </Typography>

                    <Typography sx={{ fontSize: '0.74rem', color: '#64748B', mb: 2 }}>
                      {lounge.eligibleClasses.join(' · ')}
                    </Typography>
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F2942' }}>
                        {lounge.currentGuests} / {lounge.capacity}
                      </Typography>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, color: occupancyPct > 85 ? '#EF4444' : '#0284C7' }}>
                        {occupancyPct}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={occupancyPct}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#E2E8F0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: occupancyPct > 85 ? '#EF4444' : '#0284C7',
                        },
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Recent Lounge Entry Log */}
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.9rem', color: '#0F2942', mb: 1.5 }}>
            Recent Lounge Access Authorizations
          </Typography>
          <TableContainer sx={{ borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.75rem' }}>ENTRY ID</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.75rem' }}>PASSENGER</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.75rem' }}>FLIGHT / PNR</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.75rem' }}>LOUNGE NAME</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.75rem' }}>ACCESS TIER</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.75rem' }}>TIMESTAMP</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loungeVisits.map((v) => (
                  <TableRow key={v.id} hover>
                    <TableCell sx={{ fontFamily: "'Inter', monospace", fontWeight: 700, fontSize: '0.8rem', color: '#0284C7' }}>
                      {v.id}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#0F2942' }}>
                      {v.passengerName}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: '#64748B' }}>
                      {v.flightNumber} ({v.pnr})
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.82rem', color: '#0F2942' }}>
                      {v.loungeName}
                    </TableCell>
                    <TableCell>
                      <Chip label={v.accessTier} size="small" sx={{ height: 20, fontSize: '0.66rem', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#0284C7' }} />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: '#64748B' }}>
                      {v.timestamp}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: NOTIFICATIONS & SECURITY BULLETINS                                 */}
      {/* ========================================================================= */}
      {activeTab === 'notifications' && (
        <Card sx={{ p: 3.5, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', mb: 4 }}>
          <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mb: 1 }}>
            Airside Security Bulletins & Operational Directives
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#64748B', mb: 3 }}>
            Official alerts broadcasted to Security Officers, Gate Agents, and Immigration desks.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { id: 1, level: 'CRITICAL', title: 'Security Sweep Mandate Gate B04', detail: 'IndiGo 6E-521 turnstiles locked pending canine team sweep. Clearance required prior to boarding commencement.', time: '8 mins ago' },
              { id: 2, level: 'WARNING', title: 'E-Gate Optical Sensor Calibration Advisory', detail: 'Concourse Central Turnstile 4 experiencing 120ms optical latency. Routine recalibration ongoing.', time: '24 mins ago' },
              { id: 3, level: 'INFO', title: 'Diplomatic VIP Delegations Arriving', detail: 'Lord Harrison Sterling and 4 diplomatic attachés expedited via Saphire Presidential Suite.', time: '48 mins ago' },
              { id: 4, level: 'INFO', title: 'Lost & Found Public Portal Sync', detail: '14 inquiries submitted by passengers in the last 2 hours. 4 high-probability matches identified.', time: '1 hour ago' },
            ].map((n) => (
              <Box
                key={n.id}
                sx={{
                  p: 2.2,
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: n.level === 'CRITICAL' ? '#FEF2F2' : n.level === 'WARNING' ? '#FFFBEB' : '#F8FAFC',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                  <Chip
                    label={n.level}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.64rem',
                      fontWeight: 800,
                      backgroundColor: n.level === 'CRITICAL' ? '#FEE2E2' : n.level === 'WARNING' ? '#FEF3C7' : '#E0F2FE',
                      color: n.level === 'CRITICAL' ? '#B91C1C' : n.level === 'WARNING' ? '#B45309' : '#0369A1',
                    }}
                  />
                  <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>{n.time}</Typography>
                </Box>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.92rem', color: '#0F2942', mb: 0.4 }}>
                  {n.title}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                  {n.detail}
                </Typography>
              </Box>
            ))}
          </Box>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: OFFICER PROFILE                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <Card sx={{ p: 4, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', maxWidth: 700, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3.5 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: '#0F2942',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 800,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              AP
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
                {user?.name || 'Officer Aarav Patel'}
              </Typography>
              <Typography sx={{ fontSize: '0.84rem', color: '#0284C7', fontWeight: 700 }}>
                Senior Security Officer · Airside Operations Command
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#64748B', mt: 0.3 }}>
                Station: Terminal 1 & 2 Security Control · Airside Level 1 Clearance
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2.5 }}>
            <Box>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>STAFF ID</Typography>
              <Typography sx={{ fontFamily: "'Inter', monospace", fontWeight: 700, fontSize: '0.9rem', color: '#0F2942' }}>
                SEC-9042-IN
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>ROLE / RBAC</Typography>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#0F2942' }}>
                SECURITY_OFFICER
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>AIRSIDE CLEARANCE</Typography>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#16A34A' }}>
                ALPHA-1 FULL AIRSIDE ACCESS
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>CURRENT SHIFT</Typography>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#0F2942' }}>
                Shift B · 08:00 - 16:30 Local
              </Typography>
            </Box>
          </Box>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: PASSENGER BOARDING PASS INSPECTION DIALOG                        */}
      {/* ========================================================================= */}
      <Dialog
        open={passModalOpen}
        onClose={() => setPassModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              p: 1,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 24px 60px rgba(15, 41, 66, 0.16)',
            },
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#0F2942' }}>
              Digital Boarding Pass & Security Stamp
            </Typography>
            <Typography sx={{ fontSize: '0.76rem', color: '#64748B' }}>
              Official carrier boarding credential & biometric verification record.
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setPassModalOpen(false)}>
            <X size={18} color="#64748B" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {selectedPassenger && (
            <Box
              sx={{
                p: 3,
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
              }}
            >
              {/* Header Airline */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, pb: 2, borderBottom: '1px dashed #CBD5E1' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Plane size={20} color="#0284C7" />
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.05rem', color: '#0F2942' }}>
                    {selectedPassenger.flightNumber} · SAPHIRE CARRIER ALLIANCE
                  </Typography>
                </Box>
                <Chip
                  label={selectedPassenger.cabinClass}
                  size="small"
                  sx={{ height: 22, fontSize: '0.68rem', fontWeight: 800, backgroundColor: '#0F2942', color: '#FFFFFF' }}
                />
              </Box>

              {/* Passenger Info Grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2.5 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>PASSENGER NAME</Typography>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#0F2942' }}>
                    {selectedPassenger.name}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>PNR RECORD</Typography>
                  <Typography sx={{ fontFamily: "'Inter', monospace", fontWeight: 800, fontSize: '1rem', color: '#0284C7' }}>
                    {selectedPassenger.pnr}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>ASSIGNED SEAT</Typography>
                  <Typography sx={{ fontFamily: "'Inter', monospace", fontWeight: 800, fontSize: '1.2rem', color: '#0F2942' }}>
                    {selectedPassenger.seat}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>GATE NUMBER</Typography>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#0284C7' }}>
                    {selectedPassenger.gate}
                  </Typography>
                </Box>
              </Box>

              {/* Biometrics & Verification */}
              <Box sx={{ p: 2, borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', mb: 2.5 }}>
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', mb: 1 }}>
                  SECURITY CLEARANCE STATUS
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Chip
                    label={selectedPassenger.clearanceStatus.replace(/_/g, ' ')}
                    size="small"
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.72rem',
                      backgroundColor:
                        selectedPassenger.clearanceStatus === 'BOARDED' ? '#DCFCE7' : '#E0F2FE',
                      color:
                        selectedPassenger.clearanceStatus === 'BOARDED' ? '#15803D' : '#0369A1',
                    }}
                  />
                  <Typography sx={{ fontSize: '0.76rem', color: '#64748B' }}>
                    Method: {selectedPassenger.verificationMethod.replace(/_/g, ' ')}
                  </Typography>
                </Box>
                {selectedPassenger.notes && (
                  <Typography sx={{ fontSize: '0.75rem', color: '#D97706', mt: 1, fontWeight: 600 }}>
                    ⚠ Inspection Note: {selectedPassenger.notes}
                  </Typography>
                )}
              </Box>

              {/* Barcode Stamp Mock */}
              <Box sx={{ p: 2, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', textAlign: 'center' }}>
                <Box
                  sx={{
                    height: 48,
                    background: 'repeating-linear-gradient(90deg, #0F2942, #0F2942 2px, transparent 2px, transparent 4px, #0F2942 4px, #0F2942 8px, transparent 8px, transparent 10px)',
                    mb: 1,
                  }}
                />
                <Typography sx={{ fontFamily: "'Inter', monospace", fontSize: '0.74rem', color: '#64748B', letterSpacing: '0.12em' }}>
                  *SAPHIRE-AOCS-{selectedPassenger.pnr}-{selectedPassenger.seat}*
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setPassModalOpen(false)}
            sx={{ textTransform: 'none', fontWeight: 700, color: '#64748B' }}
          >
            Close
          </Button>
          {selectedPassenger && selectedPassenger.clearanceStatus !== 'BOARDED' && (
            <Button
              variant="contained"
              onClick={() => {
                handlePassengerStatusChange(selectedPassenger.pnr, 'BOARDED');
                setPassModalOpen(false);
              }}
              sx={{
                backgroundColor: '#16A34A',
                textTransform: 'none',
                fontWeight: 700,
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#15803D', boxShadow: 'none' },
              }}
            >
              Verify & Board Passenger
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 2: LOST & FOUND REVIEW & MATCH DIALOG                               */}
      {/* ========================================================================= */}
      <Dialog
        open={lfModalOpen}
        onClose={() => setLfModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              p: 1,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 24px 60px rgba(15, 41, 66, 0.16)',
            },
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#0F2942' }}>
              Lost & Found Item Verification
            </Typography>
            <Typography sx={{ fontSize: '0.76rem', color: '#64748B' }}>
              Review public passenger report and match against verified airside inventory.
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setLfModalOpen(false)}>
            <X size={18} color="#64748B" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {selectedLfItem && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ p: 2.2, backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography sx={{ fontFamily: "'Inter', monospace", fontWeight: 800, fontSize: '0.9rem', color: '#0284C7' }}>
                    {selectedLfItem.id}
                  </Typography>
                  <Chip
                    label={selectedLfItem.category}
                    size="small"
                    sx={{ height: 20, fontSize: '0.66rem', fontWeight: 800, backgroundColor: '#E0F2FE', color: '#0369A1' }}
                  />
                </Box>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.05rem', color: '#0F2942', mb: 0.5 }}>
                  {selectedLfItem.title}
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, mb: 1.5 }}>
                  {selectedLfItem.description}
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, pt: 1.5, borderTop: '1px solid #E2E8F0' }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>LOCATION RETRIEVED</Typography>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F2942' }}>
                      {selectedLfItem.locationFound}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>STORAGE LOCKER</Typography>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F2942' }}>
                      {selectedLfItem.storageLocker}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>REPORTED BY</Typography>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F2942' }}>
                      {selectedLfItem.reportedBy}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>CONTACT NUMBER</Typography>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F2942' }}>
                      {selectedLfItem.contactNumber}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Status Selector */}
              <Box>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F2942', mb: 1 }}>
                  UPDATE OPERATIONAL RESOLUTION STATUS
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {(['SEARCHING', 'MATCHED', 'READY_FOR_COLLECTION', 'RETURNED'] as LostFoundStatus[]).map((st) => (
                    <Button
                      key={st}
                      size="small"
                      variant={selectedLfItem.status === st ? 'contained' : 'outlined'}
                      onClick={() => handleUpdateLfStatus(selectedLfItem.id, st)}
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        backgroundColor: selectedLfItem.status === st ? '#0F2942' : 'transparent',
                        borderColor: '#E2E8F0',
                        color: selectedLfItem.status === st ? '#FFFFFF' : '#0F2942',
                        '&:hover': {
                          backgroundColor: selectedLfItem.status === st ? '#1E3A5F' : '#F8FAFC',
                          borderColor: '#CBD5E1',
                        },
                      }}
                    >
                      {st.replace(/_/g, ' ')}
                    </Button>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setLfModalOpen(false)} sx={{ textTransform: 'none', fontWeight: 700, color: '#64748B' }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 3: INTAKE NEW FOUND ITEM (INTERNAL OFFICER)                         */}
      {/* ========================================================================= */}
      <Dialog
        open={newLfModalOpen}
        onClose={() => setNewLfModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              p: 1,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 24px 60px rgba(15, 41, 66, 0.16)',
            },
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#0F2942' }}>
              Log Found Item (Airside / Terminal Intake)
            </Typography>
            <Typography sx={{ fontSize: '0.76rem', color: '#64748B' }}>
              Register items retrieved from aircraft cabins, gate lounges, or security screening.
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setNewLfModalOpen(false)}>
            <X size={18} color="#64748B" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Item Name / Title"
            fullWidth
            size="small"
            placeholder="e.g. Sony WH-1000XM5 Headphones in Silver"
            value={newLfTitle}
            onChange={(e) => setNewLfTitle(e.target.value)}
          />

          <TextField
            select
            label="Category"
            fullWidth
            size="small"
            value={newLfCategory}
            onChange={(e) => setNewLfCategory(e.target.value as any)}
          >
            <MenuItem value="ELECTRONICS">Electronics</MenuItem>
            <MenuItem value="BAGGAGE">Baggage / Luggage</MenuItem>
            <MenuItem value="DOCUMENTS">Documents & Passports</MenuItem>
            <MenuItem value="VALUABLES">Valuables & Jewelry</MenuItem>
            <MenuItem value="CLOTHING">Clothing & Accessories</MenuItem>
          </TextField>

          <TextField
            label="Location Found"
            fullWidth
            size="small"
            placeholder="e.g. Terminal 2 Concourse B Gate 12 Standby Lounge"
            value={newLfLocation}
            onChange={(e) => setNewLfLocation(e.target.value)}
          />

          <TextField
            label="Storage Locker / Vault Identifier"
            fullWidth
            size="small"
            placeholder="e.g. Locker Sec-04 / Shelf A2"
            value={newLfLocker}
            onChange={(e) => setNewLfLocker(e.target.value)}
          />

          <TextField
            label="Detailed Description & Distinguishing Marks"
            fullWidth
            multiline
            rows={3}
            size="small"
            placeholder="Serial number, stickers, color, wear, accessories included..."
            value={newLfDescription}
            onChange={(e) => setNewLfDescription(e.target.value)}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setNewLfModalOpen(false)} sx={{ textTransform: 'none', fontWeight: 700, color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveNewFoundItem}
            sx={{
              backgroundColor: '#0F2942',
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#1E3A5F', boxShadow: 'none' },
            }}
          >
            Save to Inventory
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 4: LOG SECURITY INCIDENT DIALOG                                     */}
      {/* ========================================================================= */}
      <Dialog
        open={incidentModalOpen}
        onClose={() => setIncidentModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              p: 1,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 24px 60px rgba(15, 41, 66, 0.16)',
            },
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#0F2942' }}>
              Log Security / Airside Incident
            </Typography>
            <Typography sx={{ fontSize: '0.76rem', color: '#64748B' }}>
              Dispatch incident to security units and record in terminal event ledger.
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setIncidentModalOpen(false)}>
            <X size={18} color="#64748B" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Incident Title"
            fullWidth
            size="small"
            placeholder="e.g. Unattended Luggage Cordon at Gate C14"
            value={incidentTitle}
            onChange={(e) => setIncidentTitle(e.target.value)}
          />

          <TextField
            select
            label="Severity Level"
            fullWidth
            size="small"
            value={incidentSeverity}
            onChange={(e) => setIncidentSeverity(e.target.value as any)}
          >
            <MenuItem value="CRITICAL">Critical (Immediate Evacuation / Lockdown)</MenuItem>
            <MenuItem value="HIGH">High (K9 Sweep / Escort Required)</MenuItem>
            <MenuItem value="MEDIUM">Medium (Secondary Screening / Document Issue)</MenuItem>
            <MenuItem value="LOW">Low (Equipment Sensor Calibration / Routine)</MenuItem>
          </TextField>

          <TextField
            label="Location"
            fullWidth
            size="small"
            placeholder="e.g. Terminal 2 Concourse B, Stand 14"
            value={incidentLocation}
            onChange={(e) => setIncidentLocation(e.target.value)}
          />

          <TextField
            label="Incident Narrative & Actions Taken"
            fullWidth
            multiline
            rows={3}
            size="small"
            placeholder="Describe findings, individuals involved, officers dispatched..."
            value={incidentDescription}
            onChange={(e) => setIncidentDescription(e.target.value)}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIncidentModalOpen(false)} sx={{ textTransform: 'none', fontWeight: 700, color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveIncident}
            sx={{
              backgroundColor: '#EF4444',
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#DC2626', boxShadow: 'none' },
            }}
          >
            Broadcast Incident
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default PassengerSecurityOpsDashboard;
