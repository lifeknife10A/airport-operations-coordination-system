import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Luggage, Printer, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { aocsDataStore, describeApiError } from '../../services/aocsDataStore';
import { flightApi } from '../../api/flightApi';
import {
  checkinApi,
  CheckinCounterData,
  CheckinLookupData,
  CheckinManifestEntry,
} from '../../api/checkinApi';
import type { Flight } from '../../types';

// Check-in & boarding pass desk. Everything comes from the backend; a pass or bag tag is only
// shown as issued once the server has saved it, and the numbers on them are the server's.

type Tab = 'overview' | 'manifest' | 'pnr-lookup' | 'boarding-desk' | 'baggage-tag' | 'notifications' | 'profile';
const TABS: Tab[] = ['manifest', 'pnr-lookup', 'boarding-desk', 'baggage-tag', 'notifications', 'profile'];

const FONT = "'Outfit', sans-serif";
const CARD_SX = { borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' } as const;
const pretty = (s?: string | null) => (s ? s.replace(/_/g, ' ') : '');

const Stat: React.FC<{ value: React.ReactNode; label: string; hint?: string; tone?: string }> = ({ value, label, hint, tone = '#0F2942' }) => (
  <Card elevation={0} sx={{ ...CARD_SX, p: 2.5 }}>
    <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '2rem', lineHeight: 1.1, color: tone }}>{value}</Typography>
    <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: '0.84rem', color: '#475569', mt: 0.5 }}>{label}</Typography>
    {hint && <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>{hint}</Typography>}
  </Card>
);

const Heading: React.FC<{ title: string; sub?: string }> = ({ title, sub }) => (
  <Box sx={{ mb: 2.5 }}>
    <Typography variant="h4" sx={{ fontFamily: FONT, fontWeight: 800, color: '#0F2942' }}>
      {title}
    </Typography>
    {sub && <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>{sub}</Typography>}
  </Box>
);

const head = (label: string, align?: 'right') => (
  <TableCell align={align} sx={{ fontWeight: 800, color: '#64748B', fontSize: '0.74rem' }}>
    {label}
  </TableCell>
);

/** What the pass dialog needs; built from the manifest or from a PNR lookup. */
interface PassView {
  name: string;
  pnr: string;
  flightNumber: string;
  route: string;
  gate: string;
  departure: string;
  seat: string;
  cabinClass: string;
  boardingGroup: string;
  ticketNumber?: string;
  barcodeData?: string;
}

export const PassengerCheckInDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  useEffect(() => {
    const hash = location.hash.replace('#', '') as Tab;
    setActiveTab(TABS.includes(hash) ? hash : 'overview');
  }, [location.hash]);
  const go = (tab: Tab) => navigate(tab === 'overview' ? '/dashboard/check-in' : `/dashboard/check-in#${tab}`);

  // ---- flights and manifest ----
  const [flights, setFlights] = useState<Flight[]>([]);
  const [flightId, setFlightId] = useState<number | ''>('');
  const [manifest, setManifest] = useState<CheckinManifestEntry[]>([]);
  const [manifestLoading, setManifestLoading] = useState(false);
  const [search, setSearch] = useState('');
  const flight = flights.find((f) => f.flightId === flightId);

  useEffect(() => {
    flightApi
      .getOperationalFlights(30)
      .then((list) => {
        setFlights(list);
        setFlightId((cur) => (cur === '' && list.length ? list[0].flightId : cur));
      })
      .catch((e) => toast.error(`Could not load flights: ${describeApiError(e)}`));
  }, []);

  const loadManifest = useCallback(async (id: number) => {
    setManifestLoading(true);
    try {
      setManifest(await checkinApi.getManifest(id));
    } catch (e) {
      toast.error(`Could not load the manifest: ${describeApiError(e)}`);
      setManifest([]);
    } finally {
      setManifestLoading(false);
    }
  }, []);
  useEffect(() => {
    if (flightId !== '') loadManifest(flightId);
  }, [flightId, loadManifest]);

  const filteredManifest = manifest.filter((m) => {
    const q = search.trim().toLowerCase();
    return !q || m.name.toLowerCase().includes(q) || m.pnr.toLowerCase().includes(q) || (m.seat ?? '').toLowerCase().includes(q);
  });
  const withPass = manifest.filter((m) => m.boardingPassId).length;
  const totalBags = manifest.reduce((n, m) => n + m.bags, 0);
  const totalKg = manifest.reduce((n, m) => n + m.bagWeightKg, 0);
  const withoutPass = manifest.filter((m) => !m.boardingPassId);

  // ---- counters ----
  const [counters, setCounters] = useState<CheckinCounterData[]>([]);
  const [counterLimit, setCounterLimit] = useState(24);
  useEffect(() => {
    checkinApi.getCounters().then(setCounters).catch(() => setCounters([]));
  }, []);
  const allocated = counters.filter((c) => c.status === 'ALLOCATED').length;

  // ---- pass dialog ----
  const [pass, setPass] = useState<PassView | null>(null);
  const passFromManifest = (m: CheckinManifestEntry): PassView | null =>
    flight && m.seat
      ? {
          name: m.name,
          pnr: m.pnr,
          flightNumber: flight.flightNumber,
          route: `${flight.originAirportCode} → ${flight.destinationAirportCode}`,
          gate: flight.gateCode ?? 'TBA',
          departure: flight.scheduledTime,
          seat: m.seat,
          cabinClass: m.cabinClass ?? '',
          boardingGroup: m.boardingGroup ?? '',
          ticketNumber: m.ticketNumber,
          barcodeData: m.barcodeData,
        }
      : null;
  const showPass = (m: CheckinManifestEntry) => {
    const view = passFromManifest(m);
    if (view) setPass(view);
  };

  // ---- issue a pass ----
  const [issueFor, setIssueFor] = useState<{ passengerId: number; name: string; pnr: string; flightId: number } | null>(null);
  const [issueSeat, setIssueSeat] = useState('');
  const [issueCabin, setIssueCabin] = useState('ECONOMY');
  const [issueBusy, setIssueBusy] = useState(false);
  const [freeSeats, setFreeSeats] = useState<string[]>([]);

  const openIssue = async (target: { passengerId: number; name: string; pnr: string; flightId: number }) => {
    setIssueFor(target);
    setIssueSeat('');
    setFreeSeats([]);
    try {
      const map = await checkinApi.getSeatMap(target.flightId);
      const taken = new Set(map.occupiedSeats);
      const rows = Math.ceil(map.totalCapacity / 6);
      const seats: string[] = [];
      for (let r = 1; r <= rows && seats.length < 40; r++) {
        for (const letter of 'ABCDEF') if (!taken.has(`${r}${letter}`)) seats.push(`${r}${letter}`);
      }
      setFreeSeats(seats);
      setIssueSeat(seats[0] ?? '');
    } catch (e) {
      toast.error(`Could not load the seat map: ${describeApiError(e)}`);
    }
  };
  const submitIssue = async () => {
    if (!issueFor || !issueSeat.trim()) return;
    setIssueBusy(true);
    try {
      const res = await checkinApi.issueBoardingPass({ passengerId: issueFor.passengerId, seatNumber: issueSeat.trim(), cabinClass: issueCabin });
      aocsDataStore.logAuditEvent('FLIGHT', `Boarding pass issued for ${res.passengerName} (${res.pnrCode}) on ${res.flightNumber}, seat ${res.seatNumber}`, res.pnrCode, user?.fullName || user?.name || 'Check-in Agent');
      toast.success(`Boarding pass issued: seat ${res.seatNumber}, ticket ${res.ticketNumber}`);
      setIssueFor(null);
      setPass({
        name: res.passengerName, pnr: res.pnrCode, flightNumber: res.flightNumber, route: `${res.originIata} → ${res.destinationIata}`,
        gate: res.departureGate, departure: res.boardingTime ? `boards ${res.boardingTime}` : '', seat: res.seatNumber,
        cabinClass: res.cabinClass, boardingGroup: res.boardingGroup, ticketNumber: res.ticketNumber, barcodeData: res.barcodeData,
      });
      if (flightId !== '') loadManifest(flightId);
      if (lookup && lookup.passengerId === res.passengerId) runLookup(lookup.pnrCode);
    } catch (e) {
      toast.error(`Boarding pass was NOT issued: ${describeApiError(e)}`);
    } finally {
      setIssueBusy(false);
    }
  };

  // ---- baggage ----
  const [bagFor, setBagFor] = useState<{ passengerId: number; flightId: number; name: string; pnr: string } | null>(null);
  const [bagWeight, setBagWeight] = useState('20');
  const [bagBusy, setBagBusy] = useState(false);
  const submitBag = async () => {
    const weight = parseFloat(bagWeight);
    if (!bagFor || !Number.isFinite(weight) || weight <= 0 || weight > 60) {
      toast.error('Enter a bag weight between 0 and 60 kg.');
      return;
    }
    setBagBusy(true);
    try {
      const tag = await checkinApi.tagBaggage({ passengerId: bagFor.passengerId, flightId: bagFor.flightId, weightKg: weight, scannerLocation: 'CHECKIN_DESK' });
      aocsDataStore.logAuditEvent('BAGGAGE', `Bag tag ${tag.tagNumber} (${tag.weightKg} kg) issued for ${bagFor.pnr}`, bagFor.pnr, user?.fullName || user?.name || 'Check-in Agent');
      toast.success(`Bag tag ${tag.tagNumber} issued (${tag.weightKg} kg)`);
      setBagFor(null);
      if (flightId !== '') loadManifest(flightId);
      if (lookup && lookup.passengerId === bagFor.passengerId) runLookup(lookup.pnrCode);
    } catch (e) {
      toast.error(`Bag was NOT tagged: ${describeApiError(e)}`);
    } finally {
      setBagBusy(false);
    }
  };

  // ---- PNR lookup ----
  const [query, setQuery] = useState('');
  const [lookup, setLookup] = useState<CheckinLookupData | null>(null);
  const [lookupBusy, setLookupBusy] = useState(false);
  const runLookup = async (q: string) => {
    const text = q.trim();
    if (!text) return;
    setLookupBusy(true);
    try {
      setLookup(await checkinApi.lookupPassenger(text));
    } catch (e) {
      setLookup(null);
      toast.error(`No passenger found: ${describeApiError(e)}`);
    } finally {
      setLookupBusy(false);
    }
  };
  const lookupPass = (l: CheckinLookupData): PassView => ({
    name: l.travelerName, pnr: l.pnrCode, flightNumber: l.flightNumber, route: `${l.originIata} → ${l.destinationIata}`,
    gate: l.departureGate || 'TBA', departure: l.scheduledDeparture ? new Date(l.scheduledDeparture).toISOString().slice(11, 16) + ' UTC' : '',
    seat: l.seatNumber ?? '', cabinClass: l.cabinClass ?? '', boardingGroup: l.boardingGroup ?? '', ticketNumber: l.ticketNumber, barcodeData: l.barcodeData,
  });
  const lookupBlock = (
    <>
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, maxWidth: 560 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="PNR (e.g. PNR02858) or passport number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runLookup(query)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={16} color="#94A3B8" /></InputAdornment> } }}
        />
        <Button variant="contained" disabled={lookupBusy} onClick={() => runLookup(query)} sx={{ bgcolor: '#0F2942', textTransform: 'none', fontWeight: 700 }}>
          Find
        </Button>
      </Box>
      {lookup && (
        <Card elevation={0} sx={{ ...CARD_SX, p: 3, maxWidth: 720 }}>
          <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '1.2rem', color: '#0F2942' }}>{lookup.travelerName}</Typography>
          <Typography sx={{ fontSize: '0.84rem', color: '#64748B', mb: 1.5 }}>
            {lookup.pnrCode} · {lookup.nationality} · {lookup.flightNumber} {lookup.originIata} → {lookup.destinationIata} · gate {lookup.departureGate || 'TBA'} · {lookup.flightStatus}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip label={lookup.isCheckedIn ? `Checked in · seat ${lookup.seatNumber}` : 'Not checked in'} size="small" sx={{ fontWeight: 800, bgcolor: lookup.isCheckedIn ? '#DCFCE7' : '#FEF3C7', color: lookup.isCheckedIn ? '#15803D' : '#B45309' }} />
            {lookup.isTransitPassenger && <Chip label="Transit" size="small" sx={{ fontWeight: 700 }} />}
            <Chip label={`${lookup.baggageTags?.length ?? 0} bag(s)`} size="small" sx={{ fontWeight: 700 }} />
          </Box>
          {lookup.baggageTags && lookup.baggageTags.length > 0 && (
            <Box sx={{ mb: 2 }}>
              {lookup.baggageTags.map((b) => (
                <Typography key={b.bagTagId} sx={{ fontSize: '0.8rem', color: '#475569', fontFamily: 'monospace' }}>
                  {b.tagNumber} · {b.weightKg} kg · {pretty(b.status)}
                </Typography>
              ))}
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {lookup.isCheckedIn ? (
              <Button variant="outlined" startIcon={<Printer size={16} />} onClick={() => setPass(lookupPass(lookup))} sx={{ textTransform: 'none', fontWeight: 700 }}>
                Show boarding pass
              </Button>
            ) : (
              <Button variant="contained" onClick={() => openIssue({ passengerId: lookup.passengerId, name: lookup.travelerName, pnr: lookup.pnrCode, flightId: lookup.flightId })} sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}>
                Check in and issue pass
              </Button>
            )}
            <Button variant="outlined" startIcon={<Luggage size={16} />} onClick={() => { setBagFor({ passengerId: lookup.passengerId, flightId: lookup.flightId, name: lookup.travelerName, pnr: lookup.pnrCode }); }} sx={{ textTransform: 'none', fontWeight: 700 }}>
              Tag a bag
            </Button>
          </Box>
        </Card>
      )}
    </>
  );

  const flightPicker = (
    <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
      <Select size="small" value={flightId} onChange={(e) => setFlightId(Number(e.target.value))} sx={{ minWidth: 300 }}>
        {flights.map((f) => (
          <MenuItem key={f.flightId} value={f.flightId}>
            {f.flightNumber} · {f.originAirportCode} → {f.destinationAirportCode} · {f.status} · gate {f.gateCode ?? '—'}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );

  const passCard = useMemo(() => pass, [pass]);

  return (
    <DashboardLayout activeRole="check-in">
      {/* ===================== OVERVIEW ===================== */}
      {activeTab === 'overview' && (
        <Box>
          <Heading title="Check-In & Boarding Pass Desk" sub={`Signed in as ${user?.name ?? 'agent'} · passenger lookup, boarding passes and baggage tags`} />
          {flightPicker}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
            <Stat value={manifest.length} label="Booked passengers" hint={flight ? `${flight.flightNumber} · ${flight.status}` : undefined} />
            <Stat value={withPass} label="Boarding passes issued" tone="#15803D" hint={manifest.length ? `${Math.round((withPass / manifest.length) * 100)}% checked in` : undefined} />
            <Stat value={totalBags} label="Bags tagged" hint={`${totalKg.toFixed(1)} kg in all`} />
            <Stat value={withoutPass.length} label="Still to check in" tone={withoutPass.length ? '#B45309' : '#15803D'} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
            <Button variant="contained" onClick={() => go('manifest')} sx={{ bgcolor: '#0F2942', textTransform: 'none', fontWeight: 700 }}>Open manifest</Button>
            <Button variant="outlined" onClick={() => go('pnr-lookup')} sx={{ textTransform: 'none', fontWeight: 700 }}>Look up a passenger</Button>
          </Box>

          <Typography sx={{ fontFamily: FONT, fontWeight: 800, color: '#0F2942', mb: 0.5 }}>Check-in desks</Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#64748B', mb: 1.5 }}>
            {counters.length} desks · {allocated} allocated to an airline · {counters.length - allocated} unassigned. Queue lengths and agents are not tracked.
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(6, 1fr)' }, gap: 1.2 }}>
            {counters.slice(0, counterLimit).map((c) => (
              <Card key={c.counterId} elevation={0} sx={{ ...CARD_SX, p: 1.5, borderRadius: '10px' }}>
                <Typography sx={{ fontWeight: 800, color: '#0F2942', fontSize: '0.9rem' }}>{c.counterNumber}</Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>{c.concourse} · {c.terminal}</Typography>
                <Typography sx={{ fontSize: '0.74rem', color: c.status === 'ALLOCATED' ? '#0369A1' : '#94A3B8', fontWeight: 700 }}>
                  {c.status === 'ALLOCATED' ? c.allocatedAirlineName : 'Unassigned'}
                </Typography>
              </Card>
            ))}
          </Box>
          {counters.length > counterLimit && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button onClick={() => setCounterLimit((n) => n + 48)} sx={{ textTransform: 'none', fontWeight: 700 }}>Show more desks ({counters.length - counterLimit} remaining)</Button>
            </Box>
          )}
        </Box>
      )}

      {/* ===================== MANIFEST ===================== */}
      {activeTab === 'manifest' && (
        <Box>
          <Heading title="Passenger Manifest" sub="Everyone booked on the flight, with their seat, pass and bags" />
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {flightPicker}
            <TextField
              size="small"
              placeholder="Search name, PNR or seat"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={16} color="#94A3B8" /></InputAdornment> } }}
              sx={{ minWidth: 260 }}
            />
          </Box>
          <Card elevation={0} sx={{ ...CARD_SX, overflow: 'hidden' }}>
            {manifestLoading && <LinearProgress />}
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    {head('PASSENGER')}
                    {head('PNR')}
                    {head('SEAT')}
                    {head('CLASS / GROUP')}
                    {head('BAGS')}
                    {head('STATUS')}
                    {head('', 'right')}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredManifest.length === 0 && !manifestLoading && (
                    <TableRow><TableCell colSpan={7} sx={{ color: '#64748B' }}>No passengers match.</TableCell></TableRow>
                  )}
                  {filteredManifest.map((m) => (
                    <TableRow key={m.passengerId} hover>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, color: '#0F2942' }}>{m.name}</Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>{m.nationality}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{m.pnr}</TableCell>
                      <TableCell>{m.seat ?? '—'}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{pretty(m.cabinClass) || '—'} <span style={{ color: '#94A3B8' }}>{m.boardingGroup}</span></TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{m.bags} · {m.bagWeightKg.toFixed(1)} kg</TableCell>
                      <TableCell>
                        <Chip label={m.boardingPassId ? 'Pass issued' : 'Not checked in'} size="small" sx={{ fontWeight: 800, fontSize: '0.68rem', bgcolor: m.boardingPassId ? '#DCFCE7' : '#FEF3C7', color: m.boardingPassId ? '#15803D' : '#B45309' }} />
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        {m.boardingPassId ? (
                          <Button size="small" onClick={() => showPass(m)} sx={{ textTransform: 'none', fontWeight: 700 }}>Pass</Button>
                        ) : (
                          flight && <Button size="small" onClick={() => openIssue({ passengerId: m.passengerId, name: m.name, pnr: m.pnr, flightId: flight.flightId })} sx={{ textTransform: 'none', fontWeight: 700, color: '#15803D' }}>Check in</Button>
                        )}
                        {flight && <Button size="small" onClick={() => setBagFor({ passengerId: m.passengerId, flightId: flight.flightId, name: m.name, pnr: m.pnr })} sx={{ textTransform: 'none', fontWeight: 700, color: '#475569' }}>Tag bag</Button>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      )}

      {/* ===================== PNR LOOKUP ===================== */}
      {activeTab === 'pnr-lookup' && (
        <Box>
          <Heading title="PNR Lookup & Check-In" sub="Find a passenger by PNR or passport number" />
          {lookupBlock}
        </Box>
      )}

      {/* ===================== BOARDING DESK ===================== */}
      {activeTab === 'boarding-desk' && (
        <Box>
          <Heading title="Boarding Pass Desk" sub="Passengers on the selected flight who still need a boarding pass" />
          {flightPicker}
          <Card elevation={0} sx={{ ...CARD_SX, p: 2.5 }}>
            {withoutPass.length === 0 ? (
              <Typography sx={{ color: '#64748B' }}>Everyone on this flight has a boarding pass.</Typography>
            ) : (
              withoutPass.map((m) => (
                <Box key={m.passengerId} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #F1F5F9' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{m.name}</Typography>
                    <Typography sx={{ fontSize: '0.74rem', color: '#64748B', fontFamily: 'monospace' }}>{m.pnr}</Typography>
                  </Box>
                  {flight && <Button size="small" variant="contained" onClick={() => openIssue({ passengerId: m.passengerId, name: m.name, pnr: m.pnr, flightId: flight.flightId })} sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#10B981' }}>Issue pass</Button>}
                </Box>
              ))
            )}
          </Card>
        </Box>
      )}

      {/* ===================== BAGGAGE ===================== */}
      {activeTab === 'baggage-tag' && (
        <Box>
          <Heading title="Baggage Induction" sub="Find the passenger, then tag their bag. The tag number is issued by the server." />
          {lookupBlock}
        </Box>
      )}

      {/* ===================== NOTIFICATIONS ===================== */}
      {activeTab === 'notifications' && (
        <Box>
          <Heading title="Desk Alerts" sub="What needs attention on the selected flight" />
          {flightPicker}
          {withoutPass.length > 0 ? (
            <Card elevation={0} sx={{ ...CARD_SX, p: 2.2, borderColor: '#FDE68A', bgcolor: '#FFFBEB' }}>
              <Typography sx={{ fontWeight: 800, color: '#92400E' }}>{withoutPass.length} passenger(s) on {flight?.flightNumber} still need a boarding pass</Typography>
              <Button size="small" onClick={() => go('boarding-desk')} sx={{ textTransform: 'none', fontWeight: 700 }}>Open boarding pass desk</Button>
            </Card>
          ) : (
            <Typography sx={{ color: '#64748B' }}>Nothing needs attention on this flight.</Typography>
          )}
        </Box>
      )}

      {/* ===================== PROFILE ===================== */}
      {activeTab === 'profile' && (
        <Box>
          <Heading title="Agent Profile" />
          <Card elevation={0} sx={{ ...CARD_SX, p: 3, maxWidth: 560 }}>
            {[
              ['Name', user?.name],
              ['Username', user?.username],
              ['Email', user?.email],
              ['Role', pretty(user?.roleName)],
              ['Department', pretty(user?.departmentName)],
            ].map(([label, value]) => (
              <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #F1F5F9' }}>
                <Typography sx={{ color: '#64748B', fontSize: '0.86rem' }}>{label}</Typography>
                <Typography sx={{ fontWeight: 700, color: '#0F2942' }}>{value || '—'}</Typography>
              </Box>
            ))}
          </Card>
        </Box>
      )}

      {/* ===================== DIALOGS ===================== */}
      <Dialog open={!!issueFor} onClose={() => setIssueFor(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: FONT, fontWeight: 800 }}>Issue pass: {issueFor?.name}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField size="small" label="Seat" value={issueSeat} onChange={(e) => setIssueSeat(e.target.value.toUpperCase())} helperText={freeSeats.length ? `Free seats include ${freeSeats.slice(0, 6).join(', ')}` : 'Loading seat map…'} />
            <Select size="small" value={issueCabin} onChange={(e) => setIssueCabin(e.target.value)}>
              {['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'].map((c) => <MenuItem key={c} value={c}>{pretty(c)}</MenuItem>)}
            </Select>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIssueFor(null)} sx={{ textTransform: 'none', color: '#64748B' }}>Cancel</Button>
          <Button variant="contained" disabled={issueBusy || !issueSeat.trim()} onClick={submitIssue} sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}>Issue pass</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!bagFor} onClose={() => setBagFor(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: FONT, fontWeight: 800 }}>Tag a bag: {bagFor?.name}</DialogTitle>
        <DialogContent dividers>
          <TextField size="small" fullWidth label="Weight (kg)" type="number" value={bagWeight} onChange={(e) => setBagWeight(e.target.value)} sx={{ mt: 1 }} slotProps={{ htmlInput: { min: 0, max: 60, step: 0.1 } }} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setBagFor(null)} sx={{ textTransform: 'none', color: '#64748B' }}>Cancel</Button>
          <Button variant="contained" disabled={bagBusy} onClick={submitBag} sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#0F2942' }}>Issue tag</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!passCard} onClose={() => setPass(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: FONT, fontWeight: 800 }}>Boarding pass</DialogTitle>
        <DialogContent dividers>
          {passCard && (
            <Box sx={{ fontFamily: FONT }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: '#0F2942' }}>{passCard.name.toUpperCase()}</Typography>
              <Typography sx={{ fontSize: '0.84rem', color: '#64748B', mb: 1.5 }}>PNR {passCard.pnr}</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2 }}>
                {[
                  ['Flight', passCard.flightNumber],
                  ['Route', passCard.route],
                  ['Gate', passCard.gate],
                  ['Departure', passCard.departure],
                  ['Seat', passCard.seat],
                  ['Class / group', `${pretty(passCard.cabinClass)} ${passCard.boardingGroup}`],
                ].map(([label, value]) => (
                  <Box key={label}>
                    <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700 }}>{label.toUpperCase()}</Typography>
                    <Typography sx={{ fontWeight: 700, color: '#0F2942' }}>{value || '—'}</Typography>
                  </Box>
                ))}
              </Box>
              <Typography sx={{ fontFamily: 'monospace', fontSize: '0.74rem', color: '#334155', wordBreak: 'break-all' }}>{passCard.barcodeData}</Typography>
              {passCard.ticketNumber && <Typography sx={{ fontFamily: 'monospace', fontSize: '0.74rem', color: '#64748B' }}>TKT {passCard.ticketNumber}</Typography>}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => window.print()} startIcon={<Printer size={15} />} sx={{ textTransform: 'none', fontWeight: 700 }}>Print</Button>
          <Button onClick={() => setPass(null)} sx={{ textTransform: 'none', color: '#64748B' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default PassengerCheckInDashboard;
