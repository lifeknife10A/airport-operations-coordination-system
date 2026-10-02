import React, { useCallback, useEffect, useState } from 'react';
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
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import LiveBaggageDesk from '../../components/logistics/LiveBaggageDesk';
import { useAuth } from '../../context/AuthContext';
import { aocsDataStore, describeApiError } from '../../services/aocsDataStore';
import { flightApi } from '../../api/flightApi';
import { taskApi, ActiveTurnaround } from '../../api/taskApi';
import { logisticsApi, CargoItem, CargoTypeTotal, Carousel, EquipmentTotal, FuelEntry } from '../../api/logisticsApi';
import type { Flight } from '../../types';

// Logistics desk: baggage, cargo, carousels, fuel and ground equipment, all read from the backend.
// Carousel changes are saved on the server, which refuses cancelled/departed flights and double bookings.

type Tab = 'overview' | 'desk' | 'cargo' | 'baggage' | 'fuel' | 'timeline' | 'notifications' | 'profile';
const TABS: Tab[] = ['desk', 'cargo', 'baggage', 'fuel', 'timeline', 'notifications', 'profile'];

const FONT = "'Outfit', sans-serif";
const CARD_SX = { borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' } as const;
const pretty = (s?: string | null) => (s ? s.replace(/_/g, ' ') : '');
const kg = (n: number) => `${Math.round(n).toLocaleString()} kg`;

const Stat: React.FC<{ value: React.ReactNode; label: string; hint?: string; tone?: string }> = ({ value, label, hint, tone = '#0F2942' }) => (
  <Card elevation={0} sx={{ ...CARD_SX, p: 2.5 }}>
    <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '1.9rem', lineHeight: 1.1, color: tone }}>{value}</Typography>
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

const TASK_COLOR: Record<string, { bg: string; fg: string }> = {
  COMPLETED: { bg: '#DCFCE7', fg: '#15803D' },
  IN_PROGRESS: { bg: '#E0F2FE', fg: '#0369A1' },
  PENDING: { bg: '#F1F5F9', fg: '#64748B' },
  BLOCKED: { bg: '#FEE2E2', fg: '#B91C1C' },
};
const TaskChip: React.FC<{ status?: string }> = ({ status }) =>
  status ? (
    <Chip label={pretty(status)} size="small" sx={{ bgcolor: TASK_COLOR[status]?.bg, color: TASK_COLOR[status]?.fg, fontWeight: 800, fontSize: '0.66rem' }} />
  ) : (
    <Typography sx={{ color: '#CBD5E1' }}>—</Typography>
  );

const Pager: React.FC<{ page: number; pages: number; onChange: (p: number) => void }> = ({ page, pages, onChange }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 2 }}>
    <Button disabled={page === 0} onClick={() => onChange(page - 1)} sx={{ textTransform: 'none' }}>Previous</Button>
    <Typography sx={{ fontSize: '0.8rem', color: '#64748B' }}>Page {page + 1} of {Math.max(1, pages)}</Typography>
    <Button disabled={page + 1 >= pages} onClick={() => onChange(page + 1)} sx={{ textTransform: 'none' }}>Next</Button>
  </Box>
);

export const LogisticsDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  useEffect(() => {
    const hash = location.hash.replace('#', '') as Tab;
    setActiveTab(TABS.includes(hash) ? hash : 'overview');
  }, [location.hash]);
  const go = (tab: Tab) => navigate(tab === 'overview' ? '/dashboard/logistics' : `/dashboard/logistics#${tab}`);

  // ---- summaries (overview) ----
  const [totals, setTotals] = useState<CargoTypeTotal[]>([]);
  const [equipment, setEquipment] = useState<EquipmentTotal[]>([]);
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [turnarounds, setTurnarounds] = useState<ActiveTurnaround[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);

  const loadSummaries = useCallback(async () => {
    try {
      const [t, e, c, a, f] = await Promise.all([
        logisticsApi.getCargoTotals(),
        logisticsApi.getEquipment(),
        logisticsApi.getCarousels(),
        taskApi.getActiveTurnarounds(30),
        flightApi.getOperationalFlights(60),
      ]);
      setTotals(t);
      setEquipment(e);
      setCarousels(c);
      setTurnarounds(a);
      setFlights(f);
    } catch (err) {
      toast.error(`Could not load logistics data: ${describeApiError(err)}`);
    }
  }, []);
  useEffect(() => {
    loadSummaries();
  }, [loadSummaries]);

  const totalContainers = totals.reduce((n, t) => n + t.containers, 0);
  const totalWeight = totals.reduce((n, t) => n + t.totalKg, 0);
  const equipmentTotal = equipment.reduce((n, e) => n + e.available + e.inUse + e.maintenance, 0);
  const equipmentAvailable = equipment.reduce((n, e) => n + e.available, 0);
  const equipmentMaintenance = equipment.reduce((n, e) => n + e.maintenance, 0);
  const task = (a: ActiveTurnaround, name: string) => a.tasks.find((t) => t.taskName === name)?.status;
  const blockedFlows = turnarounds.filter((a) => a.tasks.some((t) => t.status === 'BLOCKED'));

  // ---- cargo ----
  const [cargo, setCargo] = useState<CargoItem[]>([]);
  const [cargoTotal, setCargoTotal] = useState(0);
  const [cargoPage, setCargoPage] = useState(0);
  const [cargoQuery, setCargoQuery] = useState('');
  const [cargoLoading, setCargoLoading] = useState(false);
  useEffect(() => {
    const handle = setTimeout(() => {
      setCargoLoading(true);
      logisticsApi
        .getCargo(cargoQuery.trim(), cargoPage, 20)
        .then((res) => {
          setCargo(res.content);
          setCargoTotal(res.totalElements);
        })
        .catch((e) => toast.error(`Could not load cargo: ${describeApiError(e)}`))
        .finally(() => setCargoLoading(false));
    }, 250);
    return () => clearTimeout(handle);
  }, [cargoQuery, cargoPage]);

  // ---- fuel ----
  const [fuel, setFuel] = useState<FuelEntry[]>([]);
  const [fuelTotal, setFuelTotal] = useState(0);
  const [fuelPage, setFuelPage] = useState(0);
  useEffect(() => {
    logisticsApi
      .getFuel(fuelPage, 20)
      .then((res) => {
        setFuel(res.content);
        setFuelTotal(res.totalElements);
      })
      .catch((e) => toast.error(`Could not load fuel logs: ${describeApiError(e)}`));
  }, [fuelPage]);

  // ---- carousels ----
  const [carouselFilter, setCarouselFilter] = useState('');
  const [carouselTarget, setCarouselTarget] = useState<Carousel | null>(null);
  const [carouselFlight, setCarouselFlight] = useState<number | ''>('');
  const [carouselBusy, setCarouselBusy] = useState(false);
  const shownCarousels = carousels.filter((c) => {
    const q = carouselFilter.trim().toLowerCase();
    return !q || c.carouselNumber.toLowerCase().includes(q) || (c.flightNumber ?? '').toLowerCase().includes(q) || c.terminal.toLowerCase().includes(q);
  });
  const saveCarousel = async (flightId: number | null) => {
    if (!carouselTarget) return;
    setCarouselBusy(true);
    try {
      const updated = await logisticsApi.assignCarousel(carouselTarget.carouselId, flightId);
      aocsDataStore.logAuditEvent(
        'BAGGAGE',
        flightId ? `Carousel ${updated.carouselNumber} now serves ${updated.flightNumber}` : `Carousel ${updated.carouselNumber} cleared`,
        updated.flightNumber,
        user?.fullName || user?.name || 'Logistics Officer'
      );
      toast.success(flightId ? `${updated.carouselNumber} now serves ${updated.flightNumber}` : `${updated.carouselNumber} cleared`);
      setCarouselTarget(null);
      loadSummaries();
    } catch (e) {
      toast.error(`Carousel was NOT changed: ${describeApiError(e)}`);
    } finally {
      setCarouselBusy(false);
    }
  };

  const freeCarousels = carousels.filter((c) => !c.flightId).length;

  return (
    <DashboardLayout activeRole="logistics">
      {/* ===================== OVERVIEW ===================== */}
      {activeTab === 'overview' && (
        <Box>
          <Heading title="Logistics Operations" sub={`Signed in as ${user?.name ?? 'officer'} · baggage, cargo, carousels, fuel and ground equipment`} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
            <Stat value={totalContainers.toLocaleString()} label="Cargo containers" hint={kg(totalWeight)} />
            <Stat value={`${carousels.length - freeCarousels}/${carousels.length}`} label="Carousels in use" hint={`${freeCarousels} free`} />
            <Stat value={`${equipmentAvailable}/${equipmentTotal}`} label="Ground equipment available" hint={`${equipmentMaintenance} in maintenance`} tone={equipmentMaintenance ? '#B45309' : '#15803D'} />
            <Stat value={blockedFlows.length} label="Flights with blocked work" tone={blockedFlows.length ? '#B91C1C' : '#15803D'} hint="among flights with live turnaround" />
          </Box>

          <Typography sx={{ fontFamily: FONT, fontWeight: 800, color: '#0F2942', mb: 1.2 }}>Cargo by type</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
            {totals.map((t) => (
              <Stat key={t.cargoType} value={t.containers.toLocaleString()} label={pretty(t.cargoType)} hint={kg(t.totalKg)} />
            ))}
          </Box>

          <Typography sx={{ fontFamily: FONT, fontWeight: 800, color: '#0F2942', mb: 1.2 }}>Ground equipment</Typography>
          <Card elevation={0} sx={{ ...CARD_SX, overflow: 'hidden' }}>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    {head('EQUIPMENT')}
                    {head('AVAILABLE')}
                    {head('IN USE')}
                    {head('MAINTENANCE')}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {equipment.map((e) => (
                    <TableRow key={e.equipmentType} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{e.equipmentType}</TableCell>
                      <TableCell sx={{ color: '#15803D', fontWeight: 700 }}>{e.available}</TableCell>
                      <TableCell sx={{ color: '#0369A1', fontWeight: 700 }}>{e.inUse}</TableCell>
                      <TableCell sx={{ color: e.maintenance ? '#B45309' : '#94A3B8', fontWeight: 700 }}>{e.maintenance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      )}

      {/* ===================== LIVE BAGGAGE DESK ===================== */}
      {activeTab === 'desk' && <LiveBaggageDesk />}

      {/* ===================== CARGO ===================== */}
      {activeTab === 'cargo' && (
        <Box>
          <Heading title="Cargo Manifest" sub={`${cargoTotal.toLocaleString()} containers${cargoQuery ? ' match' : ''}`} />
          <TextField
            size="small"
            placeholder="Search container, flight or type (CARGO, MAIL, BAGGAGE)"
            value={cargoQuery}
            onChange={(e) => { setCargoQuery(e.target.value); setCargoPage(0); }}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={16} color="#94A3B8" /></InputAdornment> } }}
            sx={{ minWidth: 380, mb: 2 }}
          />
          <Card elevation={0} sx={{ ...CARD_SX, overflow: 'hidden' }}>
            {cargoLoading && <LinearProgress />}
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    {head('CONTAINER')}
                    {head('TYPE')}
                    {head('WEIGHT')}
                    {head('FLIGHT')}
                    {head('AIRLINE')}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cargo.map((c) => (
                    <TableRow key={c.cargoId} hover>
                      <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700 }}>{c.containerId}</TableCell>
                      <TableCell><Chip label={c.cargoType} size="small" sx={{ fontWeight: 700, fontSize: '0.68rem' }} /></TableCell>
                      <TableCell>{kg(c.weightKg)}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{c.flightNumber}</TableCell>
                      <TableCell sx={{ color: '#64748B' }}>{c.airline}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
          <Pager page={cargoPage} pages={Math.ceil(cargoTotal / 20)} onChange={setCargoPage} />
        </Box>
      )}

      {/* ===================== CAROUSELS ===================== */}
      {activeTab === 'baggage' && (
        <Box>
          <Heading title="Baggage Carousels" sub={`${carousels.length - freeCarousels} of ${carousels.length} carousels are serving a flight`} />
          <TextField
            size="small"
            placeholder="Search belt, terminal or flight"
            value={carouselFilter}
            onChange={(e) => setCarouselFilter(e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={16} color="#94A3B8" /></InputAdornment> } }}
            sx={{ minWidth: 320, mb: 2 }}
          />
          <Card elevation={0} sx={{ ...CARD_SX, overflow: 'hidden' }}>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    {head('BELT')}
                    {head('TERMINAL')}
                    {head('FLIGHT')}
                    {head('FROM')}
                    {head('FLIGHT STATUS')}
                    {head('', 'right')}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shownCarousels.map((c) => (
                    <TableRow key={c.carouselId} hover>
                      <TableCell sx={{ fontWeight: 800, color: '#0F2942' }}>{c.carouselNumber}</TableCell>
                      <TableCell>{c.terminal}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        {c.flightNumber ?? <span style={{ color: '#94A3B8', fontWeight: 600 }}>Free</span>}
                        {c.airline && <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>{c.airline} · {pretty(c.flightType).toLowerCase()}</Typography>}
                      </TableCell>
                      <TableCell>{c.origin ?? '—'}</TableCell>
                      <TableCell>{c.flightStatus ? <Chip label={pretty(c.flightStatus)} size="small" sx={{ fontWeight: 700, fontSize: '0.66rem' }} /> : '—'}</TableCell>
                      <TableCell align="right">
                        <Button size="small" onClick={() => { setCarouselTarget(c); setCarouselFlight(c.flightId ?? ''); }} sx={{ textTransform: 'none', fontWeight: 700 }}>
                          Reassign
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

      {/* ===================== FUEL ===================== */}
      {activeTab === 'fuel' && (
        <Box>
          <Heading title="Fuel Operations" sub={`${fuelTotal.toLocaleString()} fuel log entries. Pumped volume is not recorded; only fuel density and the linked task.`} />
          <Card elevation={0} sx={{ ...CARD_SX, overflow: 'hidden' }}>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    {head('FLIGHT')}
                    {head('STAND')}
                    {head('TASK')}
                    {head('TASK STATUS')}
                    {head('DENSITY (kg/L)')}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fuel.map((f) => (
                    <TableRow key={f.fuelLogId} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{f.flightNumber}</TableCell>
                      <TableCell>{f.stand ?? '—'}</TableCell>
                      <TableCell>{f.taskName}</TableCell>
                      <TableCell><TaskChip status={f.taskStatus} /></TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{f.fuelDensity.toFixed(3)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
          <Pager page={fuelPage} pages={Math.ceil(fuelTotal / 20)} onChange={setFuelPage} />
        </Box>
      )}

      {/* ===================== TIMELINE ===================== */}
      {activeTab === 'timeline' && (
        <Box>
          <Heading title="Logistics Timeline" sub="Ground work on flights with turnaround under way or blocked, from the live task board" />
          <Card elevation={0} sx={{ ...CARD_SX, overflow: 'hidden' }}>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    {head('FLIGHT')}
                    {head('STAND')}
                    {head('BAGGAGE OFFLOAD')}
                    {head('REFUELING')}
                    {head('CATERING')}
                    {head('PUSHBACK PREP')}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {turnarounds.map((a) => (
                    <TableRow key={a.flightId} hover>
                      <TableCell>
                        <Typography sx={{ fontWeight: 800, color: '#0F2942' }}>{a.flightNumber}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>{a.airlineName} · {a.origin} → {a.destination}</Typography>
                      </TableCell>
                      <TableCell>{a.standNumber || '—'}</TableCell>
                      <TableCell><TaskChip status={task(a, 'Baggage Unloading')} /></TableCell>
                      <TableCell><TaskChip status={task(a, 'Refueling')} /></TableCell>
                      <TableCell><TaskChip status={task(a, 'Catering Replenishment')} /></TableCell>
                      <TableCell><TaskChip status={task(a, 'Pushback Operational Prep')} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      )}

      {/* ===================== NOTIFICATIONS ===================== */}
      {activeTab === 'notifications' && (
        <Box>
          <Heading title="Logistics Alerts" sub="Blocked baggage, fuel, catering or pushback work, and equipment in maintenance" />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {blockedFlows.length === 0 && equipmentMaintenance === 0 && <Typography sx={{ color: '#64748B' }}>No alerts right now.</Typography>}
            {blockedFlows.map((a) => (
              <Card key={a.flightId} elevation={0} sx={{ ...CARD_SX, p: 2.2, borderColor: '#FECACA', bgcolor: '#FEF2F2' }}>
                <Typography sx={{ fontWeight: 800, color: '#991B1B' }}>{a.flightNumber}: blocked {a.tasks.filter((t) => t.status === 'BLOCKED').map((t) => t.taskName).join(', ')}</Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#7F1D1D' }}>Stand {a.standNumber || '—'} · {a.airlineName}</Typography>
              </Card>
            ))}
            {equipmentMaintenance > 0 && (
              <Card elevation={0} sx={{ ...CARD_SX, p: 2.2, borderColor: '#FDE68A', bgcolor: '#FFFBEB' }}>
                <Typography sx={{ fontWeight: 800, color: '#92400E' }}>{equipmentMaintenance} ground equipment unit(s) in maintenance</Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#78350F' }}>{equipmentAvailable} of {equipmentTotal} units are available.</Typography>
              </Card>
            )}
          </Box>
        </Box>
      )}

      {/* ===================== PROFILE ===================== */}
      {activeTab === 'profile' && (
        <Box>
          <Heading title="Officer Profile" />
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

      {/* ===================== CAROUSEL DIALOG ===================== */}
      <Dialog open={!!carouselTarget} onClose={() => setCarouselTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: FONT, fontWeight: 800 }}>Carousel {carouselTarget?.carouselNumber}</DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ fontSize: '0.84rem', color: '#64748B', mb: 1.5 }}>
            Choose the flight this belt serves. The server refuses cancelled or departed flights, and a flight that is already on another belt.
          </Typography>
          <Select size="small" fullWidth displayEmpty value={carouselFlight} onChange={(e) => setCarouselFlight(String(e.target.value) === '' ? '' : Number(e.target.value))}>
            <MenuItem value=""><em>No flight (free)</em></MenuItem>
            {flights.map((f) => (
              <MenuItem key={f.flightId} value={f.flightId}>
                {f.flightNumber} · {f.originAirportCode} → {f.destinationAirportCode} · {f.status}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCarouselTarget(null)} sx={{ textTransform: 'none', color: '#64748B' }}>Cancel</Button>
          <Button variant="contained" disabled={carouselBusy} onClick={() => saveCarousel(carouselFlight === '' ? null : carouselFlight)} sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#0F2942' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default LogisticsDashboard;
