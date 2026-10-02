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
  FormControl,
  InputAdornment,
  InputLabel,
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
import { AlertTriangle, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { aocsDataStore, describeApiError } from '../../services/aocsDataStore';
import { lostFoundApi, LostFoundItemData } from '../../api/lostFoundApi';
import {
  securityOpsApi,
  Checkpoint,
  ClearanceEntry,
  ClearanceStatus,
  GateFlight,
  Incident,
  IncidentSeverity,
  IncidentStatus,
  Lounge,
  LoungeVisit,
  ManifestEntry,
  VerificationMethod,
} from '../../api/securityOpsApi';

// Passenger & Security Ops: everything on this screen comes from the backend. Clearance scans,
// incidents and lounge visits are saved on the server; a write the server refuses shows its reason.

type Tab = 'overview' | 'security-screening' | 'clearance' | 'lost-found' | 'incidents' | 'lounges' | 'notifications' | 'profile';
const TABS: Tab[] = ['security-screening', 'clearance', 'lost-found', 'incidents', 'lounges', 'notifications', 'profile'];

const FONT = "'Outfit', sans-serif";
const CARD_SX = { borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' } as const;

const CLEARANCE_LABEL: Record<ClearanceStatus, string> = {
  APPROVED: 'Approved',
  FLAGGED_SECURITY: 'Flagged',
  DENIED: 'Denied',
  BOARDED: 'Boarded',
};
const CLEARANCE_COLOR: Record<ClearanceStatus, { bg: string; fg: string }> = {
  APPROVED: { bg: '#DCFCE7', fg: '#15803D' },
  FLAGGED_SECURITY: { bg: '#FEF3C7', fg: '#B45309' },
  DENIED: { bg: '#FEE2E2', fg: '#B91C1C' },
  BOARDED: { bg: '#E0F2FE', fg: '#0369A1' },
};
const METHOD_LABEL: Record<VerificationMethod, string> = {
  BARCODE_SCANNER: 'Barcode scanner',
  BIOMETRIC_FACIAL: 'Facial biometric',
  PASSPORT_CHIP_READER: 'Passport chip',
};
const SEVERITY_COLOR: Record<IncidentSeverity, { bg: string; fg: string }> = {
  CRITICAL: { bg: '#FEE2E2', fg: '#B91C1C' },
  HIGH: { bg: '#FFEDD5', fg: '#C2410C' },
  MEDIUM: { bg: '#FEF3C7', fg: '#B45309' },
  LOW: { bg: '#F1F5F9', fg: '#475569' },
};
const LF_STATUSES = ['LOGGED_SECURITY_INTAKE', 'ITEM_LOCATED_VAULTED', 'READY_FOR_COLLECTION', 'DISPOSED_AUCTIONED'];
const LF_CATEGORIES = ['ELECTRONICS', 'BAGGAGE', 'DOCUMENTS', 'CLOTHING', 'JEWELRY', 'VALUABLES', 'KEYS', 'OTHER'];

const pretty = (s?: string | null) => (s ? s.replace(/_/g, ' ') : '');
const clock = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const StatusChip: React.FC<{ status?: ClearanceStatus }> = ({ status }) =>
  status ? (
    <Chip label={CLEARANCE_LABEL[status]} size="small" sx={{ bgcolor: CLEARANCE_COLOR[status].bg, color: CLEARANCE_COLOR[status].fg, fontWeight: 800, fontSize: '0.68rem' }} />
  ) : (
    <Chip label="Not scanned" size="small" sx={{ bgcolor: '#F1F5F9', color: '#64748B', fontWeight: 700, fontSize: '0.68rem' }} />
  );

const Stat: React.FC<{ value: React.ReactNode; label: string; hint?: string; tone?: string; onClick?: () => void }> = ({ value, label, hint, tone = '#0F2942', onClick }) => (
  <Card
    elevation={0}
    onClick={onClick}
    sx={{ ...CARD_SX, p: 2.5, cursor: onClick ? 'pointer' : 'default', '&:hover': onClick ? { borderColor: tone } : undefined }}
  >
    <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '2rem', lineHeight: 1.1, color: tone }}>{value}</Typography>
    <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: '0.84rem', color: '#475569', mt: 0.5 }}>{label}</Typography>
    {hint && <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', mt: 0.3 }}>{hint}</Typography>}
  </Card>
);

const Heading: React.FC<{ title: string; sub?: string; action?: React.ReactNode }> = ({ title, sub, action }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, gap: 2, flexWrap: 'wrap' }}>
    <Box>
      <Typography variant="h4" sx={{ fontFamily: FONT, fontWeight: 800, color: '#0F2942' }}>
        {title}
      </Typography>
      {sub && <Typography sx={{ fontSize: '0.86rem', color: '#64748B' }}>{sub}</Typography>}
    </Box>
    {action}
  </Box>
);

const head = (label: string, align?: 'right') => (
  <TableCell align={align} sx={{ fontWeight: 800, color: '#64748B', fontSize: '0.74rem' }}>
    {label}
  </TableCell>
);

export const PassengerSecurityOpsDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  useEffect(() => {
    const hash = location.hash.replace('#', '') as Tab;
    setActiveTab(TABS.includes(hash) ? hash : 'overview');
  }, [location.hash]);
  const go = (tab: Tab) => navigate(tab === 'overview' ? '/dashboard/passenger-security' : `/dashboard/passenger-security#${tab}`);

  // ---- shared data ----
  const [gateFlights, setGateFlights] = useState<GateFlight[]>([]);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [counts, setCounts] = useState<Record<ClearanceStatus, number>>({ APPROVED: 0, FLAGGED_SECURITY: 0, DENIED: 0, BOARDED: 0 });
  const [lounges, setLounges] = useState<Lounge[]>([]);
  const [incidentList, setIncidentList] = useState<Incident[]>([]);
  const [incidentTotal, setIncidentTotal] = useState(0);
  const [loadFailed, setLoadFailed] = useState<string | null>(null);

  const loadCore = useCallback(async () => {
    try {
      const [flightsRes, cps, approved, flagged, denied, boarded, loungeRes, incidentRes] = await Promise.all([
        securityOpsApi.getGateFlights(12),
        securityOpsApi.getCheckpoints(),
        securityOpsApi.getClearanceLog('APPROVED', 0, 1),
        securityOpsApi.getClearanceLog('FLAGGED_SECURITY', 0, 1),
        securityOpsApi.getClearanceLog('DENIED', 0, 1),
        securityOpsApi.getClearanceLog('BOARDED', 0, 1),
        securityOpsApi.getLounges(),
        securityOpsApi.getIncidents('', 0, 50),
      ]);
      setGateFlights(flightsRes);
      setCheckpoints(cps);
      setCounts({ APPROVED: approved.totalElements, FLAGGED_SECURITY: flagged.totalElements, DENIED: denied.totalElements, BOARDED: boarded.totalElements });
      setLounges(loungeRes);
      setIncidentList(incidentRes.content);
      setIncidentTotal(incidentRes.totalElements);
      setLoadFailed(null);
    } catch (e) {
      setLoadFailed(describeApiError(e));
    }
  }, []);
  useEffect(() => {
    loadCore();
  }, [loadCore]);

  const openIncidents = incidentList.filter((i) => i.status !== 'RESOLVED');

  // ---- screening: selected flight + manifest ----
  const [selectedFlightId, setSelectedFlightId] = useState<number | ''>('');
  const [manifest, setManifest] = useState<ManifestEntry[]>([]);
  const [manifestLoading, setManifestLoading] = useState(false);
  const [passengerSearch, setPassengerSearch] = useState('');
  const [passengerFilter, setPassengerFilter] = useState<string>('ALL');
  const selectedFlight = gateFlights.find((f) => f.flightId === selectedFlightId);

  useEffect(() => {
    if (selectedFlightId === '' && gateFlights.length) setSelectedFlightId(gateFlights[0].flightId);
  }, [gateFlights, selectedFlightId]);

  const loadManifest = useCallback(async (flightId: number) => {
    setManifestLoading(true);
    try {
      setManifest(await securityOpsApi.getManifest(flightId));
    } catch (e) {
      toast.error(`Could not load the manifest: ${describeApiError(e)}`);
      setManifest([]);
    } finally {
      setManifestLoading(false);
    }
  }, []);
  useEffect(() => {
    if (selectedFlightId !== '') loadManifest(selectedFlightId);
  }, [selectedFlightId, loadManifest]);

  const filteredManifest = manifest.filter((m) => {
    const q = passengerSearch.trim().toLowerCase();
    const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.pnr.toLowerCase().includes(q) || (m.seat ?? '').toLowerCase().includes(q);
    const matchesStatus = passengerFilter === 'ALL' || (passengerFilter === 'NONE' ? !m.clearanceStatus : m.clearanceStatus === passengerFilter);
    return matchesSearch && matchesStatus;
  });

  // ---- clearance dialog ----
  const [scanTarget, setScanTarget] = useState<ManifestEntry | null>(null);
  const [scanStatus, setScanStatus] = useState<ClearanceStatus>('APPROVED');
  const [scanMethod, setScanMethod] = useState<VerificationMethod>('BARCODE_SCANNER');
  const [scanCheckpoint, setScanCheckpoint] = useState<number | ''>('');
  const [scanReason, setScanReason] = useState('');
  const [scanBusy, setScanBusy] = useState(false);

  const openScan = (m: ManifestEntry, status: ClearanceStatus) => {
    setScanTarget(m);
    setScanStatus(status);
    setScanReason('');
    setScanCheckpoint((cur) => cur || checkpoints.find((c) => c.type === 'BOARDING_GATE')?.checkpointId || checkpoints[0]?.checkpointId || '');
  };
  const submitScan = async () => {
    if (!scanTarget || scanCheckpoint === '') return;
    setScanBusy(true);
    try {
      const entry = await securityOpsApi.logClearance({
        passengerId: scanTarget.passengerId,
        clearanceStatus: scanStatus,
        verificationMethod: scanMethod,
        checkpointId: scanCheckpoint,
        denialReason: scanStatus === 'DENIED' ? scanReason : undefined,
      });
      aocsDataStore.logAuditEvent('SECURITY', `Passenger ${entry.pnr} ${CLEARANCE_LABEL[scanStatus].toLowerCase()} on ${entry.flightNumber} at ${entry.checkpoint}`, entry.flightNumber, user?.fullName || user?.name || 'Security Officer');
      toast.success(`${entry.passenger}: ${CLEARANCE_LABEL[entry.clearanceStatus].toLowerCase()}`);
      setScanTarget(null);
      if (selectedFlightId !== '') loadManifest(selectedFlightId);
      loadCore();
      loadLog(logPage);
    } catch (e) {
      toast.error(`Scan was NOT saved: ${describeApiError(e)}`);
    } finally {
      setScanBusy(false);
    }
  };

  // ---- clearance log ----
  const [logStatus, setLogStatus] = useState<string>('');
  const [logPage, setLogPage] = useState(0);
  const [log, setLog] = useState<{ rows: ClearanceEntry[]; total: number; pages: number }>({ rows: [], total: 0, pages: 1 });
  const loadLog = useCallback(
    async (page: number) => {
      try {
        const res = await securityOpsApi.getClearanceLog(logStatus, page, 15);
        setLog({ rows: res.content, total: res.totalElements, pages: Math.max(1, res.totalPages) });
      } catch (e) {
        toast.error(`Could not load the clearance log: ${describeApiError(e)}`);
      }
    },
    [logStatus]
  );
  useEffect(() => {
    loadLog(logPage);
  }, [loadLog, logPage]);

  // ---- overview: recent flagged / denied ----
  const [attention, setAttention] = useState<ClearanceEntry[]>([]);
  useEffect(() => {
    Promise.all([securityOpsApi.getClearanceLog('DENIED', 0, 4), securityOpsApi.getClearanceLog('FLAGGED_SECURITY', 0, 4)])
      .then(([d, f]) => setAttention([...d.content, ...f.content].sort((a, b) => b.scannedAt.localeCompare(a.scannedAt)).slice(0, 6)))
      .catch(() => setAttention([]));
  }, [counts]);

  // ---- incidents ----
  const [incidentOpen, setIncidentOpen] = useState(false);
  const [incTitle, setIncTitle] = useState('');
  const [incLocation, setIncLocation] = useState('');
  const [incSeverity, setIncSeverity] = useState<IncidentSeverity>('MEDIUM');
  const [incDescription, setIncDescription] = useState('');
  const [incFlightId, setIncFlightId] = useState<number | ''>('');
  const saveIncident = async () => {
    if (!incTitle.trim() || !incLocation.trim()) {
      toast.error('Title and location are required.');
      return;
    }
    try {
      const inc = await securityOpsApi.createIncident({
        title: incTitle,
        location: incLocation,
        severity: incSeverity,
        description: incDescription || undefined,
        flightId: incFlightId === '' ? undefined : incFlightId,
      });
      aocsDataStore.logAuditEvent('SECURITY', `SECURITY DISPATCH [${inc.severity}]: ${inc.title} at ${inc.location}`, inc.flightNumber, user?.fullName || user?.name || 'Security Officer');
      toast.success(`Incident #${inc.incidentId} logged`);
      setIncidentOpen(false);
      setIncTitle('');
      setIncLocation('');
      setIncDescription('');
      setIncFlightId('');
      loadCore();
    } catch (e) {
      toast.error(`Incident was NOT logged: ${describeApiError(e)}`);
    }
  };
  const changeIncident = async (inc: Incident, status: IncidentStatus) => {
    try {
      await securityOpsApi.updateIncidentStatus(inc.incidentId, status);
      toast.success(`Incident #${inc.incidentId} is now ${status.toLowerCase()}`);
      loadCore();
    } catch (e) {
      toast.error(`Incident was NOT updated: ${describeApiError(e)}`);
    }
  };

  // ---- lounges ----
  const [visits, setVisits] = useState<{ rows: LoungeVisit[]; total: number }>({ rows: [], total: 0 });
  const [visitTarget, setVisitTarget] = useState<ManifestEntry | null>(null);
  const [visitLounge, setVisitLounge] = useState('');
  const loadVisits = useCallback(() => {
    securityOpsApi
      .getLoungeVisits(0, 15)
      .then((res) => setVisits({ rows: res.content, total: res.totalElements }))
      .catch((e) => toast.error(`Could not load lounge visits: ${describeApiError(e)}`));
  }, []);
  useEffect(() => {
    loadVisits();
  }, [loadVisits]);
  const submitVisit = async () => {
    if (!visitTarget || !visitLounge) return;
    try {
      const v = await securityOpsApi.logLoungeVisit(visitLounge, visitTarget.passengerId);
      toast.success(`${v.passenger} logged into ${v.lounge}`);
      setVisitTarget(null);
      loadVisits();
      loadCore();
    } catch (e) {
      toast.error(`Visit was NOT logged: ${describeApiError(e)}`);
    }
  };

  // ---- lost & found (live) ----
  const [lfItems, setLfItems] = useState<LostFoundItemData[]>([]);
  const [lfTotal, setLfTotal] = useState(0);
  const [lfPage, setLfPage] = useState(0);
  const [lfSearch, setLfSearch] = useState('');
  const [lfStatus, setLfStatus] = useState('');
  const [lfNewOpen, setLfNewOpen] = useState(false);
  const [lfName, setLfName] = useState('');
  const [lfCategory, setLfCategory] = useState('ELECTRONICS');
  const [lfLocation, setLfLocation] = useState('');
  const [lfDescription, setLfDescription] = useState('');
  const [lfVault, setLfVault] = useState('');
  const [claimItem, setClaimItem] = useState<LostFoundItemData | null>(null);
  const [claimName, setClaimName] = useState('');
  const [claimEmail, setClaimEmail] = useState('');
  const [claimNotes, setClaimNotes] = useState('');

  const loadLostFound = useCallback(
    async (page: number) => {
      try {
        const res = await lostFoundApi.getAll({ page, size: 15, search: lfSearch.trim(), status: lfStatus || undefined });
        setLfItems(res.content ?? []);
        setLfTotal(res.totalElements ?? 0);
      } catch (e) {
        toast.error(`Could not load lost & found: ${describeApiError(e)}`);
      }
    },
    [lfSearch, lfStatus]
  );
  useEffect(() => {
    const handle = setTimeout(() => loadLostFound(lfPage), 250);
    return () => clearTimeout(handle);
  }, [loadLostFound, lfPage]);

  const saveLostFound = async () => {
    if (!lfName.trim() || !lfLocation.trim() || !lfDescription.trim()) {
      toast.error('Item name, where it was found and a description are required.');
      return;
    }
    try {
      const created = await lostFoundApi.reportFound({
        itemName: lfName,
        category: lfCategory,
        colorAndDescription: lfDescription,
        foundLocationType: 'CONCOURSE',
        terminalId: 1,
        foundLocationDetail: lfLocation,
        finderType: 'SECURITY_OFFICER',
        storageVaultLocation: lfVault || undefined,
      });
      aocsDataStore.logAuditEvent('SECURITY', `Found item logged: ${lfName} at ${lfLocation} (${created.referenceCode})`, undefined, user?.fullName || user?.name || 'Security Officer');
      toast.success(`Item logged as ${created.referenceCode}`);
      setLfNewOpen(false);
      setLfName('');
      setLfLocation('');
      setLfDescription('');
      setLfVault('');
      loadLostFound(0);
      setLfPage(0);
    } catch (e) {
      toast.error(`Item was NOT logged: ${describeApiError(e)}`);
    }
  };
  const changeLfStatus = async (item: LostFoundItemData, status: string) => {
    try {
      const updated = await lostFoundApi.updateStatus(item.itemId, status);
      setLfItems((prev) => prev.map((i) => (i.itemId === item.itemId ? { ...i, status: updated.status } : i)));
      toast.success(`${item.referenceCode} is now ${pretty(status).toLowerCase()}`);
    } catch (e) {
      toast.error(`Status was NOT changed: ${describeApiError(e)}`);
    }
  };
  const submitClaim = async () => {
    if (!claimItem || !claimName.trim() || !claimEmail.trim() || !claimNotes.trim()) {
      toast.error('Claimant name, email and verification notes are required.');
      return;
    }
    try {
      await lostFoundApi.submitClaim(claimItem.itemId, { claimantName: claimName, claimantContactEmail: claimEmail, claimVerificationNotes: claimNotes });
      toast.success(`${claimItem.referenceCode} released to ${claimName}`);
      setClaimItem(null);
      setClaimName('');
      setClaimEmail('');
      setClaimNotes('');
      loadLostFound(lfPage);
    } catch (e) {
      toast.error(`Claim was NOT recorded: ${describeApiError(e)}`);
    }
  };

  // ---------------------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------------------
  const readiness = (f: GateFlight) => (f.tasksTotal ? Math.round((f.tasksCompleted / f.tasksTotal) * 100) : 0);

  const flightsTable = (
    <Card elevation={0} sx={{ ...CARD_SX, overflow: 'hidden' }}>
      <TableContainer>
        <Table size="small">
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              {head('FLIGHT')}
              {head('GATE')}
              {head('PASSENGERS')}
              {head('CLEARANCE')}
              {head('TURNAROUND')}
              {head('', 'right')}
            </TableRow>
          </TableHead>
          <TableBody>
            {gateFlights.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ color: '#64748B' }}>
                  No flights are boarding or delayed at the gate right now.
                </TableCell>
              </TableRow>
            )}
            {gateFlights.map((f) => (
              <TableRow key={f.flightId} hover>
                <TableCell>
                  <Typography sx={{ fontWeight: 800, color: '#0F2942' }}>{f.flightNumber}</Typography>
                  <Typography sx={{ fontSize: '0.74rem', color: '#64748B' }}>
                    {f.airline} → {f.destination} · {f.flightStatus}
                  </Typography>
                </TableCell>
                <TableCell>{f.gate ? <Chip label={f.gate} size="small" sx={{ fontWeight: 700, bgcolor: '#F1F5F9' }} /> : '—'}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#334155' }}>
                  {f.booked} booked · {f.boardingPasses} passes
                </TableCell>
                <TableCell sx={{ fontSize: '0.78rem' }}>
                  <span style={{ color: '#15803D', fontWeight: 700 }}>{f.approved} ok</span> ·{' '}
                  <span style={{ color: '#0369A1', fontWeight: 700 }}>{f.boarded} boarded</span> ·{' '}
                  <span style={{ color: '#B45309', fontWeight: 700 }}>{f.flagged} flagged</span> ·{' '}
                  <span style={{ color: '#B91C1C', fontWeight: 700 }}>{f.denied} denied</span>
                </TableCell>
                <TableCell sx={{ minWidth: 130 }}>
                  <LinearProgress variant="determinate" value={readiness(f)} sx={{ height: 6, borderRadius: 3, mb: 0.4 }} />
                  <Typography sx={{ fontSize: '0.7rem', color: f.tasksBlocked ? '#B91C1C' : '#64748B' }}>
                    {f.tasksCompleted}/{f.tasksTotal} tasks{f.tasksBlocked ? ` · ${f.tasksBlocked} blocked` : ''}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setSelectedFlightId(f.flightId);
                      go('security-screening');
                    }}
                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '7px' }}
                  >
                    Screen
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );

  return (
    <DashboardLayout activeRole="passenger-security">
      {loadFailed && (
        <Card elevation={0} sx={{ ...CARD_SX, p: 2, mb: 2, borderColor: '#FECACA', bgcolor: '#FEF2F2' }}>
          <Typography sx={{ color: '#991B1B', fontWeight: 700, fontSize: '0.86rem' }}>Some data could not be loaded: {loadFailed}</Typography>
        </Card>
      )}

      {/* ===================== OVERVIEW ===================== */}
      {activeTab === 'overview' && (
        <Box>
          <Heading
            title="Passenger & Security Operations"
            sub={`Signed in as ${user?.name ?? 'officer'} · live clearance, incidents, lost property and lounges`}
            action={
              <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setIncidentOpen(true)} sx={{ bgcolor: '#DC2626', textTransform: 'none', fontWeight: 700, borderRadius: '8px', '&:hover': { bgcolor: '#B91C1C' } }}>
                Log Incident
              </Button>
            }
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2, mb: 3 }}>
            <Stat value={counts.APPROVED.toLocaleString()} label="Approved scans" tone="#15803D" onClick={() => { setLogStatus('APPROVED'); setLogPage(0); go('clearance'); }} />
            <Stat value={counts.BOARDED.toLocaleString()} label="Boarded" tone="#0369A1" onClick={() => { setLogStatus('BOARDED'); setLogPage(0); go('clearance'); }} />
            <Stat value={counts.FLAGGED_SECURITY.toLocaleString()} label="Flagged for review" tone="#B45309" onClick={() => { setLogStatus('FLAGGED_SECURITY'); setLogPage(0); go('clearance'); }} />
            <Stat value={counts.DENIED.toLocaleString()} label="Denied" tone="#B91C1C" onClick={() => { setLogStatus('DENIED'); setLogPage(0); go('clearance'); }} />
            <Stat value={openIncidents.length} label="Open incidents" hint={`${incidentTotal} logged in all`} tone={openIncidents.length ? '#DC2626' : '#15803D'} onClick={() => go('incidents')} />
          </Box>

          <Typography sx={{ fontFamily: FONT, fontWeight: 800, color: '#0F2942', mb: 1.2 }}>Flights at the gate</Typography>
          {flightsTable}

          <Typography sx={{ fontFamily: FONT, fontWeight: 800, color: '#0F2942', mt: 3, mb: 1.2 }}>Latest denied and flagged scans</Typography>
          <Card elevation={0} sx={{ ...CARD_SX, overflow: 'hidden' }}>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  {attention.length === 0 && (
                    <TableRow>
                      <TableCell sx={{ color: '#64748B' }}>Nothing flagged or denied.</TableCell>
                    </TableRow>
                  )}
                  {attention.map((a) => (
                    <TableRow key={a.clearanceId}>
                      <TableCell sx={{ fontWeight: 700 }}>{a.passenger}</TableCell>
                      <TableCell>{a.flightNumber}</TableCell>
                      <TableCell>
                        <StatusChip status={a.clearanceStatus} />
                      </TableCell>
                      <TableCell sx={{ color: '#64748B', fontSize: '0.8rem' }}>{a.denialReason || METHOD_LABEL[a.verificationMethod]}</TableCell>
                      <TableCell sx={{ color: '#94A3B8', fontSize: '0.78rem' }}>{clock(a.scannedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      )}

      {/* ===================== SECURITY SCREENING ===================== */}
      {activeTab === 'security-screening' && (
        <Box>
          <Heading title="Security Screening" sub="Scan passengers against the flight's manifest. Each scan is saved with the checkpoint and method." />
          <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 280 }}>
              <InputLabel>Flight</InputLabel>
              <Select value={selectedFlightId} label="Flight" onChange={(e) => setSelectedFlightId(Number(e.target.value))}>
                {gateFlights.map((f) => (
                  <MenuItem key={f.flightId} value={f.flightId}>
                    {f.flightNumber} → {f.destination} ({f.gate ?? 'no gate'})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size="small"
              placeholder="Search name, PNR or seat"
              value={passengerSearch}
              onChange={(e) => setPassengerSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={16} color="#94A3B8" /></InputAdornment> } }}
              sx={{ minWidth: 260 }}
            />
            <Select size="small" value={passengerFilter} onChange={(e) => setPassengerFilter(e.target.value)} sx={{ minWidth: 170 }}>
              <MenuItem value="ALL">All passengers</MenuItem>
              <MenuItem value="NONE">Not scanned</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="BOARDED">Boarded</MenuItem>
              <MenuItem value="FLAGGED_SECURITY">Flagged</MenuItem>
              <MenuItem value="DENIED">Denied</MenuItem>
            </Select>
          </Box>

          {selectedFlight && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 2.5 }}>
              <Stat value={selectedFlight.booked} label="Booked passengers" hint={`${selectedFlight.boardingPasses} boarding passes issued`} />
              <Stat value={`${selectedFlight.approved + selectedFlight.boarded}`} label="Cleared or boarded" tone="#15803D" />
              <Stat value={selectedFlight.flagged + selectedFlight.denied} label="Flagged or denied" tone={selectedFlight.flagged + selectedFlight.denied ? '#B45309' : '#15803D'} />
              <Stat value={`${selectedFlight.tasksCompleted}/${selectedFlight.tasksTotal}`} label="Turnaround tasks done" hint={selectedFlight.tasksBlocked ? `${selectedFlight.tasksBlocked} blocked` : 'none blocked'} tone={selectedFlight.tasksBlocked ? '#B91C1C' : '#0F2942'} />
            </Box>
          )}

          <Card elevation={0} sx={{ ...CARD_SX, overflow: 'hidden' }}>
            {manifestLoading && <LinearProgress />}
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    {head('PASSENGER')}
                    {head('PNR')}
                    {head('SEAT')}
                    {head('PASSPORT')}
                    {head('LATEST SCAN')}
                    {head('', 'right')}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredManifest.length === 0 && !manifestLoading && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ color: '#64748B' }}>
                        No passengers match.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredManifest.map((m) => (
                    <TableRow key={m.passengerId} hover>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, color: '#0F2942' }}>{m.name}</Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>{m.nationality}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{m.pnr}</TableCell>
                      <TableCell>
                        {m.seat ?? '—'} <span style={{ color: '#94A3B8', fontSize: '0.72rem' }}>{pretty(m.cabinClass)}</span>
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', color: '#64748B' }}>•••• {m.passportLast4}</TableCell>
                      <TableCell>
                        <StatusChip status={m.clearanceStatus} />
                        {m.denialReason && <Typography sx={{ fontSize: '0.7rem', color: '#B91C1C' }}>{m.denialReason}</Typography>}
                        {m.scannedAt && <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8' }}>{clock(m.scannedAt)}</Typography>}
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        {!m.boardingPassId ? (
                          <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>Not checked in</Typography>
                        ) : (
                          <>
                            <Button size="small" onClick={() => openScan(m, 'APPROVED')} sx={{ textTransform: 'none', fontWeight: 700, color: '#15803D' }}>Approve</Button>
                            <Button size="small" onClick={() => openScan(m, 'FLAGGED_SECURITY')} sx={{ textTransform: 'none', fontWeight: 700, color: '#B45309' }}>Flag</Button>
                            <Button size="small" onClick={() => openScan(m, 'DENIED')} sx={{ textTransform: 'none', fontWeight: 700, color: '#B91C1C' }}>Deny</Button>
                            <Button size="small" onClick={() => { setVisitTarget(m); setVisitLounge(lounges[0]?.name ?? ''); }} sx={{ textTransform: 'none', fontWeight: 700, color: '#475569' }}>Lounge</Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      )}

      {/* ===================== CLEARANCE LOG ===================== */}
      {activeTab === 'clearance' && (
        <Box>
          <Heading title="Passenger Clearance Log" sub={`${log.total.toLocaleString()} scans${logStatus ? ` · ${CLEARANCE_LABEL[logStatus as ClearanceStatus]?.toLowerCase()} only` : ''}, newest first`} />
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {[['', 'All'], ['APPROVED', 'Approved'], ['BOARDED', 'Boarded'], ['FLAGGED_SECURITY', 'Flagged'], ['DENIED', 'Denied']].map(([value, label]) => (
              <Chip
                key={value || 'all'}
                label={label}
                clickable
                onClick={() => { setLogStatus(value); setLogPage(0); }}
                sx={{ fontWeight: 700, bgcolor: logStatus === value ? '#0F2942' : '#F8FAFC', color: logStatus === value ? '#FFF' : '#475569', border: '1px solid #E2E8F0' }}
              />
            ))}
          </Box>
          <Card elevation={0} sx={{ ...CARD_SX, overflow: 'hidden' }}>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    {head('WHEN')}
                    {head('PASSENGER')}
                    {head('FLIGHT')}
                    {head('RESULT')}
                    {head('METHOD')}
                    {head('CHECKPOINT')}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {log.rows.map((r) => (
                    <TableRow key={r.clearanceId} hover>
                      <TableCell sx={{ color: '#64748B', fontSize: '0.78rem' }}>{clock(r.scannedAt)}</TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700 }}>{r.passenger}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: 'monospace' }}>{r.pnr}</Typography>
                      </TableCell>
                      <TableCell>{r.flightNumber}</TableCell>
                      <TableCell>
                        <StatusChip status={r.clearanceStatus} />
                        {r.denialReason && <Typography sx={{ fontSize: '0.7rem', color: '#B91C1C' }}>{r.denialReason}</Typography>}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{METHOD_LABEL[r.verificationMethod]}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', color: '#64748B' }}>{r.checkpoint}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 2 }}>
            <Button disabled={logPage === 0} onClick={() => setLogPage((p) => p - 1)} sx={{ textTransform: 'none' }}>Previous</Button>
            <Typography sx={{ fontSize: '0.8rem', color: '#64748B' }}>Page {logPage + 1} of {log.pages}</Typography>
            <Button disabled={logPage + 1 >= log.pages} onClick={() => setLogPage((p) => p + 1)} sx={{ textTransform: 'none' }}>Next</Button>
          </Box>
        </Box>
      )}

      {/* ===================== LOST & FOUND ===================== */}
      {activeTab === 'lost-found' && (
        <Box>
          <Heading
            title="Lost & Found"
            sub={`${lfTotal.toLocaleString()} items on record`}
            action={
              <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setLfNewOpen(true)} sx={{ bgcolor: '#0F2942', textTransform: 'none', fontWeight: 700, borderRadius: '8px' }}>
                Log Found Item
              </Button>
            }
          />
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search item, reference or location"
              value={lfSearch}
              onChange={(e) => { setLfSearch(e.target.value); setLfPage(0); }}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={16} color="#94A3B8" /></InputAdornment> } }}
              sx={{ minWidth: 300 }}
            />
            <Select size="small" displayEmpty value={lfStatus} onChange={(e) => { setLfStatus(e.target.value); setLfPage(0); }} sx={{ minWidth: 230 }}>
              <MenuItem value="">All statuses</MenuItem>
              {[...LF_STATUSES, 'CLAIMED_RETURNED'].map((s) => (
                <MenuItem key={s} value={s}>{pretty(s)}</MenuItem>
              ))}
            </Select>
          </Box>
          <Card elevation={0} sx={{ ...CARD_SX, overflow: 'hidden' }}>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    {head('REFERENCE')}
                    {head('ITEM')}
                    {head('FOUND AT')}
                    {head('VAULT')}
                    {head('STATUS')}
                    {head('', 'right')}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lfItems.map((it) => (
                    <TableRow key={it.itemId} hover>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{it.referenceCode}</TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700 }}>{it.itemName}</Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>{pretty(it.category)} · {it.colorAndDescription}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>
                        {pretty(it.foundLocationType)}
                        <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8' }}>{it.foundLocationDetail}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{it.storageVaultLocation || '—'}</TableCell>
                      <TableCell>
                        {it.status === 'CLAIMED_RETURNED' ? (
                          <Chip label="Returned" size="small" sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '0.68rem' }} />
                        ) : (
                          <Select size="small" value={it.status} onChange={(e) => changeLfStatus(it, e.target.value)} sx={{ fontSize: '0.74rem', minWidth: 190 }}>
                            {LF_STATUSES.map((s) => (
                              <MenuItem key={s} value={s} sx={{ fontSize: '0.78rem' }}>{pretty(s)}</MenuItem>
                            ))}
                          </Select>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {it.status !== 'CLAIMED_RETURNED' && it.status !== 'DISPOSED_AUCTIONED' && (
                          <Button size="small" onClick={() => setClaimItem(it)} sx={{ textTransform: 'none', fontWeight: 700 }}>Release to owner</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 2 }}>
            <Button disabled={lfPage === 0} onClick={() => setLfPage((p) => p - 1)} sx={{ textTransform: 'none' }}>Previous</Button>
            <Typography sx={{ fontSize: '0.8rem', color: '#64748B' }}>Page {lfPage + 1} of {Math.max(1, Math.ceil(lfTotal / 15))}</Typography>
            <Button disabled={(lfPage + 1) * 15 >= lfTotal} onClick={() => setLfPage((p) => p + 1)} sx={{ textTransform: 'none' }}>Next</Button>
          </Box>
        </Box>
      )}

      {/* ===================== INCIDENTS ===================== */}
      {activeTab === 'incidents' && (
        <Box>
          <Heading
            title="Security Incidents"
            sub={`${openIncidents.length} open · ${incidentTotal} logged in all`}
            action={
              <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setIncidentOpen(true)} sx={{ bgcolor: '#DC2626', textTransform: 'none', fontWeight: 700, borderRadius: '8px', '&:hover': { bgcolor: '#B91C1C' } }}>
                Log Incident
              </Button>
            }
          />
          {incidentList.length === 0 && <Typography sx={{ color: '#64748B' }}>No incidents have been logged.</Typography>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {incidentList.map((inc) => (
              <Card key={inc.incidentId} elevation={0} sx={{ ...CARD_SX, p: 2.5, opacity: inc.status === 'RESOLVED' ? 0.7 : 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Chip label={inc.severity} size="small" sx={{ bgcolor: SEVERITY_COLOR[inc.severity].bg, color: SEVERITY_COLOR[inc.severity].fg, fontWeight: 800, fontSize: '0.66rem' }} />
                      <Chip label={inc.status} size="small" sx={{ fontWeight: 700, fontSize: '0.66rem' }} />
                      <Typography sx={{ fontFamily: FONT, fontWeight: 800, color: '#0F2942' }}>#{inc.incidentId} · {inc.title}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748B' }}>
                      {inc.location}{inc.flightNumber ? ` · flight ${inc.flightNumber}` : ''} · reported by {inc.reportedBy ?? 'unknown'} · {clock(inc.reportedAt)}
                    </Typography>
                    {inc.description && <Typography sx={{ fontSize: '0.84rem', color: '#334155', mt: 0.8 }}>{inc.description}</Typography>}
                  </Box>
                  {inc.status !== 'RESOLVED' && (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      {inc.status === 'INVESTIGATING' && (
                        <Button size="small" variant="outlined" onClick={() => changeIncident(inc, 'ESCALATED')} sx={{ textTransform: 'none', fontWeight: 700 }}>Escalate</Button>
                      )}
                      <Button size="small" variant="contained" onClick={() => changeIncident(inc, 'RESOLVED')} sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}>Resolve</Button>
                    </Box>
                  )}
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* ===================== LOUNGES ===================== */}
      {activeTab === 'lounges' && (
        <Box>
          <Heading title="Lounge Activity" sub="Visit counts per lounge, from the lounge access log. Capacity is not tracked." />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
            {lounges.map((l) => (
              <Stat key={l.name} value={l.visits.toLocaleString()} label={l.name} hint={`${l.distinctPassengers.toLocaleString()} different passengers`} />
            ))}
          </Box>
          <Typography sx={{ fontFamily: FONT, fontWeight: 800, color: '#0F2942', mb: 1.2 }}>Latest visits ({visits.total.toLocaleString()} in all)</Typography>
          <Card elevation={0} sx={{ ...CARD_SX, overflow: 'hidden' }}>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    {head('LOUNGE')}
                    {head('PASSENGER')}
                    {head('PNR')}
                    {head('FLIGHT')}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visits.rows.map((v) => (
                    <TableRow key={v.visitId} hover>
                      <TableCell>{v.lounge}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{v.passenger}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{v.pnr}</TableCell>
                      <TableCell>{v.flightNumber}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
          <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8', mt: 1 }}>Log a visit from a passenger's row on the Security Screening tab.</Typography>
        </Box>
      )}

      {/* ===================== NOTIFICATIONS ===================== */}
      {activeTab === 'notifications' && (
        <Box>
          <Heading title="Alerts" sub="Open incidents, blocked turnaround tasks at the gate, and the latest flagged scans" />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {openIncidents.length === 0 && gateFlights.every((f) => !f.tasksBlocked) && attention.length === 0 && (
              <Typography sx={{ color: '#64748B' }}>No alerts right now.</Typography>
            )}
            {openIncidents.map((inc) => (
              <Card key={`i${inc.incidentId}`} elevation={0} sx={{ ...CARD_SX, p: 2.2, borderColor: '#FECACA', bgcolor: '#FEF2F2' }}>
                <Typography sx={{ fontWeight: 800, color: '#991B1B' }}>{inc.severity} incident: {inc.title}</Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#7F1D1D' }}>{inc.location} · {clock(inc.reportedAt)}</Typography>
              </Card>
            ))}
            {gateFlights.filter((f) => f.tasksBlocked).map((f) => (
              <Card key={`f${f.flightId}`} elevation={0} sx={{ ...CARD_SX, p: 2.2, borderColor: '#FDE68A', bgcolor: '#FFFBEB' }}>
                <Typography sx={{ fontWeight: 800, color: '#92400E' }}>{f.flightNumber}: {f.tasksBlocked} blocked turnaround task(s)</Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#78350F' }}>Gate {f.gate ?? '—'} · {f.tasksCompleted}/{f.tasksTotal} tasks done</Typography>
              </Card>
            ))}
            {attention.map((a) => (
              <Card key={`a${a.clearanceId}`} elevation={0} sx={{ ...CARD_SX, p: 2.2 }}>
                <Typography sx={{ fontWeight: 800, color: '#0F2942' }}>{a.passenger} · {CLEARANCE_LABEL[a.clearanceStatus]} on {a.flightNumber}</Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#64748B' }}>{a.denialReason || METHOD_LABEL[a.verificationMethod]} · {clock(a.scannedAt)}</Typography>
              </Card>
            ))}
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

      {/* ===================== DIALOGS ===================== */}
      <Dialog open={!!scanTarget} onClose={() => setScanTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: FONT, fontWeight: 800 }}>Record scan: {scanTarget?.name}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Result</InputLabel>
              <Select value={scanStatus} label="Result" onChange={(e) => setScanStatus(e.target.value as ClearanceStatus)}>
                {(Object.keys(CLEARANCE_LABEL) as ClearanceStatus[]).map((s) => (
                  <MenuItem key={s} value={s}>{CLEARANCE_LABEL[s]}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>Verified by</InputLabel>
              <Select value={scanMethod} label="Verified by" onChange={(e) => setScanMethod(e.target.value as VerificationMethod)}>
                {(Object.keys(METHOD_LABEL) as VerificationMethod[]).map((m) => (
                  <MenuItem key={m} value={m}>{METHOD_LABEL[m]}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>Checkpoint</InputLabel>
              <Select value={scanCheckpoint} label="Checkpoint" onChange={(e) => setScanCheckpoint(Number(e.target.value))}>
                {checkpoints.map((c) => (
                  <MenuItem key={c.checkpointId} value={c.checkpointId}>{c.name} ({pretty(c.type)})</MenuItem>
                ))}
              </Select>
            </FormControl>
            {scanStatus === 'DENIED' && (
              <TextField size="small" label="Reason for denial (required)" value={scanReason} onChange={(e) => setScanReason(e.target.value)} slotProps={{ htmlInput: { maxLength: 100 } }} />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setScanTarget(null)} sx={{ textTransform: 'none', color: '#64748B' }}>Cancel</Button>
          <Button variant="contained" disabled={scanBusy || (scanStatus === 'DENIED' && !scanReason.trim())} onClick={submitScan} sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#0F2942' }}>Save scan</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={incidentOpen} onClose={() => setIncidentOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: FONT, fontWeight: 800 }}>Log security incident</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField size="small" label="Title" value={incTitle} onChange={(e) => setIncTitle(e.target.value)} slotProps={{ htmlInput: { maxLength: 150 } }} />
            <TextField size="small" label="Location" value={incLocation} onChange={(e) => setIncLocation(e.target.value)} slotProps={{ htmlInput: { maxLength: 150 } }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl size="small">
                <InputLabel>Severity</InputLabel>
                <Select value={incSeverity} label="Severity" onChange={(e) => setIncSeverity(e.target.value as IncidentSeverity)}>
                  {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as IncidentSeverity[]).map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl size="small">
                <InputLabel>Flight (optional)</InputLabel>
                <Select value={incFlightId} label="Flight (optional)" onChange={(e) => setIncFlightId(String(e.target.value) === '' ? '' : Number(e.target.value))}>
                  <MenuItem value=""><em>None</em></MenuItem>
                  {gateFlights.map((f) => <MenuItem key={f.flightId} value={f.flightId}>{f.flightNumber}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <TextField size="small" label="What happened" multiline rows={3} value={incDescription} onChange={(e) => setIncDescription(e.target.value)} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIncidentOpen(false)} sx={{ textTransform: 'none', color: '#64748B' }}>Cancel</Button>
          <Button variant="contained" onClick={saveIncident} startIcon={<AlertTriangle size={15} />} sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#DC2626', '&:hover': { bgcolor: '#B91C1C' } }}>Log incident</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!visitTarget} onClose={() => setVisitTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: FONT, fontWeight: 800 }}>Log lounge visit: {visitTarget?.name}</DialogTitle>
        <DialogContent dividers>
          <FormControl size="small" fullWidth sx={{ mt: 1 }}>
            <InputLabel>Lounge</InputLabel>
            <Select value={visitLounge} label="Lounge" onChange={(e) => setVisitLounge(e.target.value)}>
              {lounges.map((l) => <MenuItem key={l.name} value={l.name}>{l.name}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setVisitTarget(null)} sx={{ textTransform: 'none', color: '#64748B' }}>Cancel</Button>
          <Button variant="contained" onClick={submitVisit} sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#0F2942' }}>Log visit</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={lfNewOpen} onClose={() => setLfNewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: FONT, fontWeight: 800 }}>Log found item</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField size="small" label="Item" value={lfName} onChange={(e) => setLfName(e.target.value)} />
            <FormControl size="small">
              <InputLabel>Category</InputLabel>
              <Select value={lfCategory} label="Category" onChange={(e) => setLfCategory(e.target.value)}>
                {LF_CATEGORIES.map((c) => <MenuItem key={c} value={c}>{pretty(c)}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField size="small" label="Found where" value={lfLocation} onChange={(e) => setLfLocation(e.target.value)} />
            <TextField size="small" label="Colour and description" multiline rows={2} value={lfDescription} onChange={(e) => setLfDescription(e.target.value)} />
            <TextField size="small" label="Vault location (optional)" value={lfVault} onChange={(e) => setLfVault(e.target.value)} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setLfNewOpen(false)} sx={{ textTransform: 'none', color: '#64748B' }}>Cancel</Button>
          <Button variant="contained" onClick={saveLostFound} sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#0F2942' }}>Save item</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!claimItem} onClose={() => setClaimItem(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: FONT, fontWeight: 800 }}>Release {claimItem?.referenceCode} to its owner</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField size="small" label="Owner's name" value={claimName} onChange={(e) => setClaimName(e.target.value)} />
            <TextField size="small" label="Owner's email" value={claimEmail} onChange={(e) => setClaimEmail(e.target.value)} />
            <TextField size="small" label="How ownership was verified" multiline rows={2} value={claimNotes} onChange={(e) => setClaimNotes(e.target.value)} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setClaimItem(null)} sx={{ textTransform: 'none', color: '#64748B' }}>Cancel</Button>
          <Button variant="contained" onClick={submitClaim} sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}>Release item</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default PassengerSecurityOpsDashboard;
