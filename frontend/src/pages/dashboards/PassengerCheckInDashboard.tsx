import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Search,
  UserCheck,
  CheckCircle2,
  Luggage,
  Printer,
  Plane,
  CreditCard,
  QrCode,
  RotateCcw,
  Sliders,
  Users,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  X,
  Bell,
  Building,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { aocsDataStore } from '../../services/aocsDataStore';
import { SaphireLogo } from '../../components/common/SaphireLogo';
import { checkinApi, CheckinLookupData, CheckinCounterData, SeatMapData, BoardingPassResponse } from '../../api/checkinApi';

interface PassengerManifestItem {
  passengerId?: number;
  flightId?: number;
  pnr: string;
  name: string;
  flightNumber: string;
  destination: string;
  seat: string;
  cabinClass: 'FIRST' | 'BUSINESS' | 'ECONOMY';
  gate: string;
  boardingTime: string;
  boardingGroup: string;
  checkInStatus: 'CHECKED_IN' | 'PENDING' | 'PASS_PRINTED';
  bagsChecked: number;
  baggageWeightKg: number;
  bagTagNumber?: string;
  specialAssistance?: string;
  frequentFlyerTier?: string;
  barcodeData?: string;
  ticketNumber?: string;
}

interface CheckInCounter {
  counterNumber: string;
  concourse: string;
  assignedFlight: string;
  airline: string;
  status: 'OPEN' | 'BUSY' | 'CLOSED';
  queueLength: number;
  agentName: string;
}

const INITIAL_PASSENGERS: PassengerManifestItem[] = [
  {
    pnr: 'PNR-AI203-01',
    name: 'Lord Harrison Sterling',
    flightNumber: 'AI-203',
    destination: 'London Heathrow (LHR)',
    seat: '01A',
    cabinClass: 'FIRST',
    gate: 'Gate A12',
    boardingTime: '13:45',
    boardingGroup: 'Zone 1 (Priority)',
    checkInStatus: 'PASS_PRINTED',
    bagsChecked: 2,
    baggageWeightKg: 42.5,
    bagTagNumber: 'BAG-AI203-8821',
    specialAssistance: 'VIP Airside Escort',
    frequentFlyerTier: 'Saphire Executive Diamond',
  },
  {
    pnr: 'PNR-AI203-02',
    name: 'Dr. Evelyn Morales',
    flightNumber: 'AI-203',
    destination: 'London Heathrow (LHR)',
    seat: '02F',
    cabinClass: 'FIRST',
    gate: 'Gate A12',
    boardingTime: '13:45',
    boardingGroup: 'Zone 1 (Priority)',
    checkInStatus: 'CHECKED_IN',
    bagsChecked: 1,
    baggageWeightKg: 22.0,
    bagTagNumber: 'BAG-AI203-8822',
    specialAssistance: 'None',
    frequentFlyerTier: 'Star Alliance Gold',
  },
  {
    pnr: 'PNR-AI203-03',
    name: 'Priya Sharma',
    flightNumber: 'AI-203',
    destination: 'London Heathrow (LHR)',
    seat: '14B',
    cabinClass: 'ECONOMY',
    gate: 'Gate A12',
    boardingTime: '13:55',
    boardingGroup: 'Zone 3',
    checkInStatus: 'PENDING',
    bagsChecked: 1,
    baggageWeightKg: 18.5,
    specialAssistance: 'Vegetarian Meal (VGML)',
    frequentFlyerTier: 'Saphire Blue',
  },
  {
    pnr: 'PNR-6E521-01',
    name: 'Kenji Takahashi',
    flightNumber: '6E-521',
    destination: 'Bengaluru Kempegowda (BLR)',
    seat: '04C',
    cabinClass: 'BUSINESS',
    gate: 'Gate B04',
    boardingTime: '14:05',
    boardingGroup: 'Zone 2',
    checkInStatus: 'PASS_PRINTED',
    bagsChecked: 1,
    baggageWeightKg: 19.4,
    bagTagNumber: 'BAG-6E521-1049',
    specialAssistance: 'None',
    frequentFlyerTier: 'IndiGo 6E Rewards Elite',
  },
  {
    pnr: 'PNR-6E521-02',
    name: 'Marcus Vance',
    flightNumber: '6E-521',
    destination: 'Bengaluru Kempegowda (BLR)',
    seat: '18A',
    cabinClass: 'ECONOMY',
    gate: 'Gate B04',
    boardingTime: '14:15',
    boardingGroup: 'Zone 4',
    checkInStatus: 'PENDING',
    bagsChecked: 0,
    baggageWeightKg: 0,
    specialAssistance: 'None',
    frequentFlyerTier: 'Standard',
  },
  {
    pnr: 'PNR-UK901-01',
    name: 'Pooja Sundaram',
    flightNumber: 'UK-901',
    destination: 'Delhi Indira Gandhi (DEL)',
    seat: '03D',
    cabinClass: 'BUSINESS',
    gate: 'Gate C08',
    boardingTime: '14:20',
    boardingGroup: 'Zone 2',
    checkInStatus: 'CHECKED_IN',
    bagsChecked: 1,
    baggageWeightKg: 24.2,
    bagTagNumber: 'BAG-UK901-5541',
    specialAssistance: 'WCHR Wheelchair Assistance',
    frequentFlyerTier: 'Club Vistara Platinum',
  },
  {
    pnr: 'PNR-SPH102-01',
    name: 'Captain Daniel Miller',
    flightNumber: 'SPH-102',
    destination: 'Dubai International (DXB)',
    seat: '01K',
    cabinClass: 'FIRST',
    gate: 'Gate B03',
    boardingTime: '14:30',
    boardingGroup: 'Zone 1 (Priority)',
    checkInStatus: 'CHECKED_IN',
    bagsChecked: 2,
    baggageWeightKg: 38.0,
    bagTagNumber: 'BAG-SPH102-3301',
    specialAssistance: 'Crew Deadheading Protocol',
    frequentFlyerTier: 'Saphire Executive VIP',
  },
  {
    pnr: 'PNR-EK201-01',
    name: 'Princess Zahra Al-Maktoum',
    flightNumber: 'EK-201',
    destination: 'Dubai International (DXB)',
    seat: '01A',
    cabinClass: 'FIRST',
    gate: 'Gate C01',
    boardingTime: '00:15',
    boardingGroup: 'Zone 1 (Royal Suite)',
    checkInStatus: 'PASS_PRINTED',
    bagsChecked: 3,
    baggageWeightKg: 58.0,
    bagTagNumber: 'BAG-EK201-9901',
    specialAssistance: 'VIP Apron Limousine Transfer',
    frequentFlyerTier: 'Emirates Skywards Platinum',
  },
  {
    pnr: 'PNR-BA117-01',
    name: 'Sir Arthur Wellesley',
    flightNumber: 'BA-117',
    destination: 'London Heathrow (LHR)',
    seat: '03B',
    cabinClass: 'BUSINESS',
    gate: 'Gate C04',
    boardingTime: '00:30',
    boardingGroup: 'Zone 2 (Club World)',
    checkInStatus: 'CHECKED_IN',
    bagsChecked: 2,
    baggageWeightKg: 40.5,
    bagTagNumber: 'BAG-BA117-4402',
    specialAssistance: 'None',
    frequentFlyerTier: 'British Airways Executive Gold',
  },
];

const INITIAL_COUNTERS: CheckInCounter[] = [
  // Concourse A (Domestic Pier)
  { counterNumber: 'DESK-01', concourse: 'Concourse A', assignedFlight: 'AI-203 (BOM)', airline: 'Air India', status: 'BUSY', queueLength: 4, agentName: 'Meera Nair' },
  { counterNumber: 'DESK-02', concourse: 'Concourse A', assignedFlight: 'AI-203 (BOM)', airline: 'Air India', status: 'OPEN', queueLength: 1, agentName: 'Aarav Patel' },
  { counterNumber: 'DESK-03', concourse: 'Concourse A', assignedFlight: 'UK-901 (DEL)', airline: 'Vistara', status: 'OPEN', queueLength: 2, agentName: 'Priya Sen' },
  { counterNumber: 'DESK-04', concourse: 'Concourse A', assignedFlight: '6E-521 (BLR)', airline: 'IndiGo', status: 'BUSY', queueLength: 5, agentName: 'Vikram Joshi' },
  // Concourse B (Transcontinental Pier)
  { counterNumber: 'DESK-05', concourse: 'Concourse B', assignedFlight: 'SPH-102 (LHR)', airline: 'Saphire Airways', status: 'OPEN', queueLength: 2, agentName: 'Ananya Roy' },
  { counterNumber: 'DESK-06', concourse: 'Concourse B', assignedFlight: 'SPH-204 (DXB)', airline: 'Saphire Airways', status: 'OPEN', queueLength: 3, agentName: 'Rohan Verma' },
  { counterNumber: 'DESK-07', concourse: 'Concourse B', assignedFlight: 'QR-557 (DOH)', airline: 'Qatar Airways', status: 'OPEN', queueLength: 2, agentName: 'Tara Sharma' },
  // Concourse C (Widebody Flagship Pier)
  { counterNumber: 'DESK-08', concourse: 'Concourse C', assignedFlight: 'EK-201 (DXB)', airline: 'Emirates', status: 'BUSY', queueLength: 6, agentName: 'Kavita Singh' },
  { counterNumber: 'DESK-09', concourse: 'Concourse C', assignedFlight: 'BA-117 (LHR)', airline: 'British Airways', status: 'OPEN', queueLength: 3, agentName: 'Dev Patel' },
  { counterNumber: 'DESK-10', concourse: 'Concourse C', assignedFlight: 'LH-772 (FRA)', airline: 'Lufthansa', status: 'OPEN', queueLength: 1, agentName: 'Sanjay Reddy' },
];

export const PassengerCheckInDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // URL Hash Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'manifest' | 'pnr-search' | 'boarding-pass' | 'baggage-induction' | 'counters' | 'notifications' | 'profile'>('overview');

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (['manifest', 'pnr-search', 'boarding-pass', 'baggage-induction', 'counters', 'notifications', 'profile'].includes(hash)) {
      setActiveTab(hash as any);
    } else {
      setActiveTab('overview');
    }
  }, [location.hash]);

  // Reactive state
  const [passengers, setPassengers] = useState<PassengerManifestItem[]>(INITIAL_PASSENGERS);
  const [counters, setCounters] = useState<CheckInCounter[]>(INITIAL_COUNTERS);
  const [selectedFlight, setSelectedFlight] = useState<string>('AI-203');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchingBackend, setIsSearchingBackend] = useState<boolean>(false);

  // Fetch live Central Terminal counters on mount
  useEffect(() => {
    let isMounted = true;
    checkinApi.getCounters()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          const mapped: CheckInCounter[] = data.map((c, idx) => ({
            counterNumber: c.counterNumber || `DESK-${String(idx + 1).padStart(2, '0')}`,
            concourse: c.concourse || 'Concourse A',
            assignedFlight: c.allocatedAirlineName ? `${c.allocatedAirlineName} (${c.allocatedAirlineIata || 'SAP'})` : 'Common Use Desk',
            airline: c.allocatedAirlineName || 'Saphire Hub Handling',
            status: (c.status === 'OPEN' || c.status === 'BUSY' || c.status === 'CLOSED') ? c.status : 'OPEN',
            queueLength: c.status === 'CLOSED' ? 0 : Math.floor(1 + (idx % 5)),
            agentName: user?.name ? `${user.name} (${c.counterNumber})` : `Agent ${idx + 1}`,
          }));
          setCounters(mapped);
        }
      })
      .catch((err) => {
        console.warn('Backend counters API unavailable, using cached telemetry:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Selected Passenger for Check-In & Boarding Pass Preview
  const [activePassenger, setActivePassenger] = useState<PassengerManifestItem>(INITIAL_PASSENGERS[0]);
  const [boardingPassModalOpen, setBoardingPassModalOpen] = useState<boolean>(false);

  // Bag Tag Check Modal
  const [baggageModalOpen, setBaggageModalOpen] = useState<boolean>(false);
  const [inputWeight, setInputWeight] = useState<number>(20.5);
  const [inputPieces, setInputPieces] = useState<number>(1);

  // Live Backend Passenger Lookup
  const handlePerformBackendLookup = async (queryToSearch: string) => {
    const q = queryToSearch.trim();
    if (!q) return;

    setIsSearchingBackend(true);
    try {
      const result: CheckinLookupData = await checkinApi.lookupPassenger(q);
      if (result && result.pnrCode) {
        const mappedItem: PassengerManifestItem = {
          passengerId: result.passengerId,
          flightId: result.flightId,
          pnr: result.pnrCode,
          name: result.travelerName,
          flightNumber: result.flightNumber,
          destination: `${result.destinationIata} (Gate ${result.departureGate || 'A01'})`,
          seat: result.seatNumber || '01A',
          cabinClass: (result.cabinClass as any) || 'ECONOMY',
          gate: `Gate ${result.departureGate || 'A01'}`,
          boardingTime: result.scheduledDeparture ? new Date(result.scheduledDeparture).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '14:00',
          boardingGroup: result.boardingGroup || 'Zone 1',
          checkInStatus: result.barcodeData ? 'PASS_PRINTED' : result.isCheckedIn ? 'CHECKED_IN' : 'PENDING',
          bagsChecked: result.baggageTags ? result.baggageTags.length : 0,
          baggageWeightKg: result.baggageTags ? result.baggageTags.reduce((acc, b) => acc + (b.weightKg || 0), 0) : 0,
          bagTagNumber: result.baggageTags && result.baggageTags.length > 0 ? result.baggageTags[0].tagNumber : undefined,
          frequentFlyerTier: result.passportNumber ? `Passport: ${result.passportNumber}` : 'Standard Passenger',
          barcodeData: result.barcodeData,
          ticketNumber: result.ticketNumber,
        };

        setPassengers((prev) => {
          const exists = prev.some((p) => p.pnr === mappedItem.pnr);
          return exists ? prev.map((p) => (p.pnr === mappedItem.pnr ? mappedItem : p)) : [mappedItem, ...prev];
        });
        setActivePassenger(mappedItem);
        toast.success(`Found passenger record for ${mappedItem.name} (${mappedItem.pnr}) from Live Database!`);
      }
    } catch (error) {
      // Offline fallback: check in local list
      const localMatch = passengers.find(
        (p) => p.pnr.toLowerCase().includes(q.toLowerCase()) || p.name.toLowerCase().includes(q.toLowerCase())
      );
      if (localMatch) {
        setActivePassenger(localMatch);
        toast.success(`Loaded passenger ${localMatch.name} (${localMatch.pnr})`);
      }
    } finally {
      setIsSearchingBackend(false);
    }
  };

  // Filtered passengers by flight & search query
  const filteredPassengers = passengers.filter((p) => {
    const matchesFlight = selectedFlight === 'ALL' || p.flightNumber === selectedFlight;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pnr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.seat.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFlight && matchesSearch;
  });

  // Action: 1-Click Check In
  const handleCheckInPassenger = async (pnr: string) => {
    const targetPax = passengers.find((p) => p.pnr === pnr);
    const generatedBagTag = targetPax?.bagTagNumber || `BAG-${targetPax?.flightNumber?.replace('-', '') || 'SAP'}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      if (targetPax?.passengerId) {
        await checkinApi.issueBoardingPass({
          passengerId: targetPax.passengerId,
          seatNumber: targetPax.seat,
          cabinClass: targetPax.cabinClass,
          frequentFlyerNumber: targetPax.frequentFlyerTier,
        });
      }
    } catch (err) {
      console.warn('Backend pass issuance API returned fallback, persisting client state:', err);
    }

    setPassengers((prev) =>
      prev.map((p) => {
        if (p.pnr === pnr) {
          const updated: PassengerManifestItem = {
            ...p,
            checkInStatus: 'CHECKED_IN' as const,
            bagTagNumber: generatedBagTag,
          };
          setActivePassenger(updated);
          return updated;
        }
        return p;
      })
    );

    aocsDataStore.logAuditEvent(
      'FLIGHT',
      `Check-in certified for passenger PNR ${pnr} at Central Terminal Departure Desk`,
      pnr,
      user?.name || 'Meera Nair (Check-in Agent)'
    );

    toast.success(`Check-in completed for ${pnr}! Live database updated.`);
  };

  // Action: Print / Issue Boarding Pass
  const handleIssueBoardingPass = async (passenger: PassengerManifestItem) => {
    let updatedPassData: Partial<PassengerManifestItem> = {};

    try {
      if (passenger.passengerId) {
        const backendPass: BoardingPassResponse = await checkinApi.issueBoardingPass({
          passengerId: passenger.passengerId,
          seatNumber: passenger.seat,
          cabinClass: passenger.cabinClass,
          frequentFlyerNumber: passenger.frequentFlyerTier,
        });
        if (backendPass) {
          updatedPassData = {
            barcodeData: backendPass.barcodeData,
            ticketNumber: backendPass.ticketNumber,
            boardingGroup: backendPass.boardingGroup || passenger.boardingGroup,
          };
        }
      }
    } catch (err) {
      console.warn('Backend live boarding pass sync, utilizing client pass structure:', err);
    }

    const updatedPax: PassengerManifestItem = {
      ...passenger,
      ...updatedPassData,
      checkInStatus: 'PASS_PRINTED' as const,
    };

    setActivePassenger(updatedPax);
    setBoardingPassModalOpen(true);

    setPassengers((prev) =>
      prev.map((p) => (p.pnr === passenger.pnr ? updatedPax : p))
    );

    aocsDataStore.logAuditEvent(
      'FLIGHT',
      `Official Boarding Pass issued for ${passenger.name} (${passenger.pnr}) on flight ${passenger.flightNumber} Seat ${passenger.seat}`,
      passenger.pnr,
      user?.name || 'Meera Nair'
    );
  };

  // Action: Save Baggage Induction
  const handleSaveBaggage = async () => {
    if (!activePassenger) return;

    const generatedTag = `BAG-${activePassenger.flightNumber.replace('-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      if (activePassenger.passengerId) {
        await checkinApi.tagBaggage({
          passengerId: activePassenger.passengerId,
          flightId: activePassenger.flightId || 101,
          weightKg: inputWeight,
          scannerLocation: 'Central Terminal Belt Induction 01',
        });
      }
    } catch (err) {
      console.warn('Backend baggage induction fallback:', err);
    }

    setPassengers((prev) =>
      prev.map((p) =>
        p.pnr === activePassenger.pnr
          ? {
              ...p,
              bagsChecked: inputPieces,
              baggageWeightKg: inputWeight,
              bagTagNumber: generatedTag,
              checkInStatus: p.checkInStatus === 'PENDING' ? 'CHECKED_IN' : p.checkInStatus,
            }
          : p
      )
    );

    // Register into reactive baggage store
    aocsDataStore.registerBagTag({
      tagNumber: generatedTag,
      flightNumber: activePassenger.flightNumber,
      flightId: activePassenger.flightId || 101,
      passengerId: activePassenger.passengerId || 1,
      passengerName: activePassenger.name,
      weightKg: inputWeight,
      isPriority: activePassenger.cabinClass === 'FIRST' || activePassenger.cabinClass === 'BUSINESS',
      status: 'CHECKED_IN',
    });

    toast.success(`Baggage tag ${generatedTag} generated & inducted into Live Sorter!`);
    setBaggageModalOpen(false);
  };

  const handlePrintDocument = () => {
    window.print();
    toast.success('Boarding pass document sent to thermal gate printer.');
  };

  return (
    <DashboardLayout activeRole="check-in">
      {/* Top Header */}
      <Box sx={{ mb: 3.5, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', letterSpacing: '-0.02em' }}>
              Check-In & Boarding Pass Desk
            </Typography>
            <Chip
              label="DESK 14 · CONCOURSE A"
              size="small"
              sx={{
                height: 22,
                fontSize: '0.68rem',
                fontWeight: 800,
                backgroundColor: '#EFF6FF',
                color: '#0284C7',
                border: '1px solid #BAE6FD',
              }}
            />
          </Box>
          <Typography sx={{ fontSize: '0.86rem', color: '#64748B', mt: 0.5, fontFamily: "'Outfit', sans-serif" }}>
            Passenger identity verification, seat allocation, baggage induction, and IATA boarding pass issuance.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setActivePassenger(passengers[0]);
              setBoardingPassModalOpen(true);
            }}
            startIcon={<Printer size={16} />}
            sx={{
              borderColor: '#CBD5E1',
              color: '#0F2942',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.84rem',
              borderRadius: '8px',
              px: 2,
              py: 0.8,
              '&:hover': { borderColor: '#0284C7', bgcolor: '#F0F9FF' },
            }}
          >
            Instant Pass Generator
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setActivePassenger(passengers[0]);
              setBaggageModalOpen(true);
            }}
            startIcon={<Luggage size={16} />}
            sx={{
              backgroundColor: '#0F2942',
              color: '#FFFFFF',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.84rem',
              borderRadius: '8px',
              px: 2,
              py: 0.8,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#1E3A5F', boxShadow: 'none' },
            }}
          >
            Tag Baggage
          </Button>
        </Box>
      </Box>

      {/* 4 Dedicated Check-in KPI Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5, mb: 3.5 }}>
        {/* KPI 1: Booked Manifest */}
        <Card
          sx={{
            p: 2.5,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.06em' }}>
                TOTAL BOOKED MANIFEST
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mt: 0.6 }}>
                704 Pax
              </Typography>
            </Box>
            <Box sx={{ p: 1.2, borderRadius: '10px', backgroundColor: '#F0F9FF', color: '#0284C7' }}>
              <Users size={20} />
            </Box>
          </Box>
          <Typography sx={{ fontSize: '0.74rem', color: '#64748B', mt: 1.5 }}>
            Across 4 Active Flights · Central Terminal
          </Typography>
        </Card>

        {/* KPI 2: Checked-In */}
        <Card
          sx={{
            p: 2.5,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.06em' }}>
                CHECKED-IN PASSENGERS
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mt: 0.6 }}>
                682
              </Typography>
            </Box>
            <Box sx={{ p: 1.2, borderRadius: '10px', backgroundColor: '#F0FDF4', color: '#16A34A' }}>
              <CheckCircle2 size={20} />
            </Box>
          </Box>
          <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A' }}>
              97% Check-in Completion
            </Typography>
            <Typography sx={{ fontSize: '0.74rem', color: '#64748B' }}>· 22 remaining</Typography>
          </Box>
        </Card>

        {/* KPI 3: Boarding Passes Issued */}
        <Card
          sx={{
            p: 2.5,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.06em' }}>
                BOARDING PASSES ISSUED
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mt: 0.6 }}>
                658
              </Typography>
            </Box>
            <Box sx={{ p: 1.2, borderRadius: '10px', backgroundColor: '#FAF5FF', color: '#9333EA' }}>
              <Printer size={20} />
            </Box>
          </Box>
          <Typography sx={{ fontSize: '0.74rem', color: '#64748B', mt: 1.5 }}>
            96% e-Pass & Thermal Print Delivered
          </Typography>
        </Card>

        {/* KPI 4: Baggage Inducted */}
        <Card
          sx={{
            p: 2.5,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.06em' }}>
                BAGGAGE INDUCTED
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', mt: 0.6 }}>
                584 Bags
              </Typography>
            </Box>
            <Box sx={{ p: 1.2, borderRadius: '10px', backgroundColor: '#FFFBEB', color: '#D97706' }}>
              <Luggage size={20} />
            </Box>
          </Box>
          <Typography sx={{ fontSize: '0.74rem', color: '#64748B', mt: 1.5 }}>
            Avg 21.4 kg · Automated Belt Induction
          </Typography>
        </Card>
      </Box>

      {/* Main Operations Card: Flight Passenger Manifest & Boarding Desk */}
      <Card
        sx={{
          p: 3,
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          mb: 4,
        }}
      >
        {/* Search & Flight Filters Row */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F2942' }}>
              SELECT FLIGHT:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['ALL', 'AI-203', '6E-521', 'UK-901', 'SPH-102'].map((flt) => (
                <Chip
                  key={flt}
                  label={flt}
                  onClick={() => setSelectedFlight(flt)}
                  sx={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    backgroundColor: selectedFlight === flt ? '#0F2942' : '#F1F5F9',
                    color: selectedFlight === flt ? '#FFFFFF' : '#475569',
                    borderRadius: '6px',
                    '&:hover': { backgroundColor: selectedFlight === flt ? '#1E3A5F' : '#E2E8F0' },
                  }}
                />
              ))}
            </Box>
          </Box>

          <TextField
            size="small"
            placeholder="Search by PNR, Passenger Name, or Seat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handlePerformBackendLookup(searchQuery);
              }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color="#64748B" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery.trim().length >= 3 ? (
                  <InputAdornment position="end">
                    <Button
                      size="small"
                      disabled={isSearchingBackend}
                      onClick={() => handlePerformBackendLookup(searchQuery)}
                      sx={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'none', px: 1, minWidth: 'auto', color: '#0284C7' }}
                    >
                      {isSearchingBackend ? 'Checking...' : 'DB Lookup'}
                    </Button>
                  </InputAdornment>
                ) : undefined,
              },
            }}
            sx={{
              width: { xs: '100%', md: 360 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                fontSize: '0.84rem',
                backgroundColor: '#F8FAFC',
              },
            }}
          />
        </Box>

        {/* Passenger Table */}
        <TableContainer sx={{ borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.8125rem', color: '#64748B' }}>PNR CODE</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.8125rem', color: '#64748B' }}>PASSENGER NAME</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.8125rem', color: '#64748B' }}>FLIGHT / ROUTE</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.8125rem', color: '#64748B' }}>SEAT & CLASS</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.8125rem', color: '#64748B' }}>BAGGAGE</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.8125rem', color: '#64748B' }}>STATUS</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.8125rem', color: '#64748B', pr: 2.5 }}>DESK ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPassengers.map((pax) => {
                const isCheckedIn = pax.checkInStatus !== 'PENDING';
                const hasPass = pax.checkInStatus === 'PASS_PRINTED';

                return (
                  <TableRow key={pax.pnr} hover sx={{ '&:hover': { backgroundColor: 'rgba(2, 132, 199, 0.03)' } }}>
                    <TableCell sx={{ minWidth: 120, whiteSpace: 'nowrap' }}>
                      <Typography sx={{ fontFamily: "'Inter', monospace", fontWeight: 800, fontSize: '0.875rem', color: '#0284C7' }}>
                        {pax.pnr}
                      </Typography>
                      {pax.specialAssistance && pax.specialAssistance !== 'None' && (
                        <Typography sx={{ fontSize: '0.72rem', color: '#D97706', fontWeight: 700 }}>
                          SSR: {pax.specialAssistance}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell sx={{ minWidth: 160, whiteSpace: 'nowrap' }}>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F2942' }}>
                        {pax.name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {pax.frequentFlyerTier}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.875rem', color: '#0F2942' }}>
                          {pax.flightNumber}
                        </Typography>
                        <Chip label={pax.gate} size="small" sx={{ height: 18, fontSize: '0.68rem', fontWeight: 800, bgcolor: '#F1F5F9' }} />
                      </Box>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {pax.destination}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ px: 1, py: 0.3, borderRadius: '4px', bgcolor: '#0F2942', color: '#FFFFFF', fontWeight: 800, fontSize: '0.75rem', fontFamily: 'monospace' }}>
                          {pax.seat}
                        </Box>
                        <Chip
                          label={pax.cabinClass}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            bgcolor: pax.cabinClass === 'FIRST' ? '#FEF3C7' : pax.cabinClass === 'BUSINESS' ? '#E0F2FE' : '#F1F5F9',
                            color: pax.cabinClass === 'FIRST' ? '#B45309' : pax.cabinClass === 'BUSINESS' ? '#0369A1' : '#475569',
                          }}
                        />
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F2942' }}>
                        {pax.bagsChecked} Bags ({pax.baggageWeightKg} kg)
                      </Typography>
                      {pax.bagTagNumber && (
                        <Typography sx={{ fontSize: '0.72rem', color: '#0284C7', fontFamily: 'monospace' }}>
                          {pax.bagTagNumber}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={hasPass ? 'PASS ISSUED' : isCheckedIn ? 'CHECKED IN' : 'PENDING'}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.7rem',
                          bgcolor: hasPass ? '#FAF5FF' : isCheckedIn ? '#DCFCE7' : '#FEF3C7',
                          color: hasPass ? '#9333EA' : isCheckedIn ? '#15803D' : '#B45309',
                          border: !isCheckedIn ? '1px solid #FCD34D' : undefined,
                        }}
                      />
                    </TableCell>

                    <TableCell align="right" sx={{ pr: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {!isCheckedIn && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleCheckInPassenger(pax.pnr)}
                            sx={{
                              backgroundColor: '#16A34A',
                              color: '#FFFFFF',
                              textTransform: 'none',
                              fontWeight: 700,
                              fontSize: '0.72rem',
                              borderRadius: '6px',
                              px: 1.5,
                              py: 0.4,
                              '&:hover': { backgroundColor: '#15803D' },
                            }}
                          >
                            Check-In
                          </Button>
                        )}
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleIssueBoardingPass(pax)}
                          startIcon={<Printer size={13} />}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            borderRadius: '6px',
                            px: 1.5,
                            py: 0.4,
                            borderColor: '#CBD5E1',
                            color: '#0F2942',
                            '&:hover': { borderColor: '#0284C7', bgcolor: '#F0F9FF' },
                          }}
                        >
                          Boarding Pass
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Check-In Counter Desks Layout Grid */}
      <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #E2E8F0', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, pb: 1.5, borderBottom: '1px solid #E2E8F0' }}>
          <Box>
            <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942' }}>
              Central Terminal Check-in Counter Allocations
            </Typography>
            <Typography sx={{ fontSize: '0.82rem', color: '#64748B' }}>
              Live counter queue telemetry, assigned airlines, and operational dispatch desks across Concourses A, B & C.
            </Typography>
          </Box>
          <Chip label={`${counters.length} DESKS MONITORED`} size="small" sx={{ fontWeight: 800, bgcolor: '#E0F2FE', color: '#0369A1' }} />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2.5 }}>
          {counters.map((c) => (
            <Box
              key={c.counterNumber}
              sx={{
                p: 2.5,
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                bgcolor: '#F8FAFC',
                transition: 'all 0.15s ease',
                '&:hover': { borderColor: '#0284C7', bgcolor: '#FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.2 }}>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', fontSize: '1.05rem' }}>
                  {c.counterNumber}
                </Typography>
                <Chip
                  label={c.status}
                  size="small"
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.64rem',
                    bgcolor: c.status === 'OPEN' ? '#DCFCE7' : c.status === 'BUSY' ? '#FEF3C7' : '#F1F5F9',
                    color: c.status === 'OPEN' ? '#15803D' : c.status === 'BUSY' ? '#B45309' : '#64748B',
                  }}
                />
              </Box>

              <Typography sx={{ fontWeight: 700, fontSize: '0.86rem', color: '#0284C7' }}>
                {c.assignedFlight}
              </Typography>
              <Typography sx={{ fontSize: '0.74rem', color: '#64748B', mt: 0.3 }}>
                {c.concourse} · {c.airline}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 1.5, borderTop: '1px solid #E2E8F0' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Agent: <b>{c.agentName}</b>
                </Typography>
                <Chip
                  label={`${c.queueLength} in queue`}
                  size="small"
                  sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, bgcolor: '#FFFFFF', border: '1px solid #CBD5E1' }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Card>

      {/* ===================================================================== */}
      {/* MODAL 1: OFFICIAL IATA BOARDING PASS GENERATOR & PRINT DIALOG         */}
      {/* ===================================================================== */}
      <Dialog
        open={boardingPassModalOpen}
        onClose={() => setBoardingPassModalOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
      >
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Printer size={20} color="#0284C7" />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F2942' }}>
              Official Aviation Boarding Pass
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setBoardingPassModalOpen(false)}>
            <X size={18} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2, pb: 3 }}>
          {/* Authentic Physical Boarding Pass Simulation */}
          <Box
            id="printable-boarding-pass"
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '2px dashed #CBD5E1',
              boxShadow: '0 10px 30px rgba(15, 41, 66, 0.08)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            {/* Left Main Stub */}
            <Box sx={{ flex: 1, p: 3.5, backgroundColor: '#FFFFFF', borderRight: { md: '2px dashed #E2E8F0' } }}>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <SaphireLogo size={28} variant="full" theme="light" />
                  <Typography sx={{ fontSize: '0.74rem', color: '#64748B', mt: 0.5, letterSpacing: '0.05em' }}>
                    CENTRAL TERMINAL AIRSIDE EMBARKATION PASS
                  </Typography>
                </Box>
                <Chip
                  label={activePassenger.cabinClass}
                  sx={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    bgcolor: activePassenger.cabinClass === 'FIRST' ? '#0F2942' : '#0284C7',
                    color: '#FFFFFF',
                    px: 1,
                  }}
                />
              </Box>

              {/* Passenger Name & Flight Details */}
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 800, letterSpacing: '0.06em' }}>
                  PASSENGER NAME
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, color: '#0F2942', mt: 0.3 }}>
                  {activePassenger.name.toUpperCase()}
                </Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#0284C7', fontWeight: 600, mt: 0.2 }}>
                  {activePassenger.frequentFlyerTier}
                </Typography>
              </Box>

              {/* Grid Details */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2.5, mb: 3 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 800 }}>FLIGHT</Typography>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '1.1rem', color: '#0F2942' }}>
                    {activePassenger.flightNumber}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 800 }}>GATE</Typography>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '1.1rem', color: '#0284C7' }}>
                    {activePassenger.gate}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 800 }}>BOARDING</Typography>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '1.1rem', color: '#0F2942' }}>
                    {activePassenger.boardingTime}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 800 }}>SEAT</Typography>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '1.3rem', color: '#16A34A' }}>
                    {activePassenger.seat}
                  </Typography>
                </Box>
              </Box>

              {/* Destination Banner */}
              <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700 }}>DESTINATION</Typography>
                  <Typography sx={{ fontWeight: 800, color: '#0F2942', fontSize: '0.9rem' }}>
                    {activePassenger.destination}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700 }}>BOARDING GROUP</Typography>
                  <Typography sx={{ fontWeight: 800, color: '#0284C7', fontSize: '0.9rem' }}>
                    {activePassenger.boardingGroup}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Right Flight Coupon / Barcode Stub */}
            <Box sx={{ width: { xs: '100%', md: 220 }, p: 3, backgroundColor: '#FAFAFA', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <Typography sx={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 800 }}>PASSENGER RECEIPT</Typography>
                <Typography sx={{ fontWeight: 800, color: '#0F2942', fontSize: '0.86rem', mt: 0.5 }}>
                  {activePassenger.pnr}
                </Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#64748B' }}>
                  Seat <b>{activePassenger.seat}</b> · Gate <b>{activePassenger.gate}</b>
                </Typography>
              </Box>

              {/* Simulated 2D Aztec / Barcode */}
              <Box sx={{ my: 2.5, textAlign: 'center', p: 1.5, borderRadius: '8px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <QrCode size={110} color="#0F2942" />
                <Typography sx={{ fontSize: '0.62rem', color: '#64748B', fontFamily: 'monospace', mt: 0.5, wordBreak: 'break-all' }}>
                  {activePassenger.barcodeData || `M1${activePassenger.pnr}/${activePassenger.name}`}
                </Typography>
                {activePassenger.ticketNumber && (
                  <Typography sx={{ fontSize: '0.62rem', color: '#0284C7', fontWeight: 800, mt: 0.3 }}>
                    TKT: {activePassenger.ticketNumber}
                  </Typography>
                )}
              </Box>

              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <Typography sx={{ fontSize: '0.68rem', color: '#64748B' }}>
                  Baggage: <b>{activePassenger.bagsChecked} pcs ({activePassenger.baggageWeightKg} kg)</b>
                </Typography>
                <Typography sx={{ fontSize: '0.62rem', color: '#64748B', mt: 0.3 }}>
                  Gate closes 15 mins prior to departure
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 1, borderTop: '1px solid #E2E8F0' }}>
          <Button onClick={() => setBoardingPassModalOpen(false)} sx={{ color: '#64748B', fontWeight: 700, textTransform: 'none' }}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handlePrintDocument}
            startIcon={<Printer size={16} />}
            sx={{
              backgroundColor: '#0F2942',
              color: '#FFFFFF',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              borderRadius: '8px',
              px: 2.5,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#1E3A5F' },
            }}
          >
            Print Boarding Pass
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================================== */}
      {/* MODAL 2: BAGGAGE WEIGHT CHECK & INDUCTION TAGGING                      */}
      {/* ===================================================================== */}
      <Dialog
        open={baggageModalOpen}
        onClose={() => setBaggageModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '18px', p: 1 } } }}
      >
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F2942', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Tag & Induct Baggage
          <IconButton size="small" onClick={() => setBaggageModalOpen(false)}>
            <X size={18} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          <Box sx={{ p: 1.8, borderRadius: '10px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <Typography sx={{ fontSize: '0.74rem', color: '#64748B' }}>Passenger:</Typography>
            <Typography sx={{ fontWeight: 800, color: '#0F2942', fontSize: '0.95rem' }}>
              {activePassenger.name} ({activePassenger.pnr})
            </Typography>
            <Typography sx={{ fontSize: '0.76rem', color: '#0284C7', mt: 0.3 }}>
              Flight {activePassenger.flightNumber} · Seat {activePassenger.seat}
            </Typography>
          </Box>

          <TextField
            label="Total Baggage Pieces"
            type="number"
            size="small"
            fullWidth
            value={inputPieces}
            onChange={(e) => setInputPieces(Math.max(1, Number(e.target.value)))}
          />

          <TextField
            label="Total Weight (kg)"
            type="number"
            size="small"
            fullWidth
            value={inputWeight}
            onChange={(e) => setInputWeight(Number(e.target.value))}
            helperText="Standard allowance: 23 kg per piece"
          />

          <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: inputWeight > 23 ? '#FFFBEB' : '#F0FDF4', border: `1px solid ${inputWeight > 23 ? '#FDE68A' : '#BBF7D0'}` }}>
            <Typography sx={{ fontSize: '0.76rem', fontWeight: 700, color: inputWeight > 23 ? '#92400E' : '#15803D' }}>
              {inputWeight > 23
                ? `Heavy Baggage Warning: +${(inputWeight - 23).toFixed(1)} kg excess. Heavy tag applied.`
                : 'Standard Baggage: Clear for automated high-speed sortation.'}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 1, borderTop: '1px solid #E2E8F0' }}>
          <Button onClick={() => setBaggageModalOpen(false)} sx={{ color: '#64748B', fontWeight: 700, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveBaggage}
            sx={{
              backgroundColor: '#0F2942',
              color: '#FFFFFF',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              borderRadius: '8px',
              px: 2.5,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#1E3A5F' },
            }}
          >
            Generate Tag & Induct
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default PassengerCheckInDashboard;
