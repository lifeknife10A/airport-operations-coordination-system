import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Box, Button, Card, Chip, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { Search, ScanLine, AlertOctagon } from 'lucide-react';
import { baggageApi, BagTrackingDto, MishandledReportDto } from '../../api/baggageApi';

const INCIDENT_TYPES = ['LOST', 'DAMAGED', 'DELAYED', 'PILFERED'] as const;

const apiMessage = (err: unknown, fallback: string) => {
  const e = err as { response?: { status?: number; data?: { detail?: string; fieldErrors?: Record<string, string> } } };
  if (e.response?.status === 404) return 'No bag with that tag number.';
  const fields = e.response?.data?.fieldErrors ? Object.values(e.response.data.fieldErrors).join(', ') : '';
  return fields || e.response?.data?.detail || fallback;
};

export const LiveBaggageDesk: React.FC = () => {
  const [tagInput, setTagInput] = useState('');
  const [bag, setBag] = useState<BagTrackingDto | null>(null);
  const [tracking, setTracking] = useState(false);

  const [scanLocation, setScanLocation] = useState('');
  const [scanning, setScanning] = useState(false);

  const [incidentType, setIncidentType] = useState<string>('DELAYED');
  const [reporting, setReporting] = useState(false);

  const [reports, setReports] = useState<MishandledReportDto[]>([]);
  const [reportPage, setReportPage] = useState(0);
  const [reportPages, setReportPages] = useState(1);
  const [reportTotal, setReportTotal] = useState(0);
  const [reportsLoading, setReportsLoading] = useState(true);

  useEffect(() => {
    setReportsLoading(true);
    baggageApi
      .getMishandledReports(reportPage, 10)
      .then((res) => {
        setReports(res.content);
        setReportPages(Math.max(1, res.totalPages));
        setReportTotal(res.totalElements);
      })
      .catch((err) => toast.error(apiMessage(err, 'Could not load mishandled-baggage reports.')))
      .finally(() => setReportsLoading(false));
  }, [reportPage]);

  const track = async (tag = tagInput) => {
    const clean = tag.trim();
    if (!clean) return;
    setTracking(true);
    try {
      setBag(await baggageApi.trackBag(clean));
    } catch (err) {
      setBag(null);
      toast.error(apiMessage(err, 'Could not look up that bag.'));
    } finally {
      setTracking(false);
    }
  };

  const recordScan = async () => {
    if (!bag || !scanLocation.trim()) return;
    setScanning(true);
    try {
      await baggageApi.recordScan(bag.tagNumber, scanLocation.trim());
      toast.success(`Scan recorded for ${bag.tagNumber}.`);
      setScanLocation('');
      await track(bag.tagNumber);
    } catch (err) {
      toast.error(`Scan was NOT recorded: ${apiMessage(err, 'the server rejected it.')}`);
    } finally {
      setScanning(false);
    }
  };

  const reportMishandled = async () => {
    if (!bag) return;
    setReporting(true);
    try {
      const created = await baggageApi.reportMishandled({ tagNumber: bag.tagNumber, incidentType });
      toast.success(`Report ${created.claimNumber} filed (${created.incidentType}).`);
      setReportPage(0);
      setReports((prev) => [created, ...prev].slice(0, 10));
      setReportTotal((n) => n + 1);
    } catch (err) {
      toast.error(`Report was NOT filed: ${apiMessage(err, 'the server rejected it.')}`);
    } finally {
      setReporting(false);
    }
  };

  const head = { color: '#64748B', fontWeight: 700, fontSize: '0.74rem' } as const;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
      <Card elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', borderRadius: '14px' }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F2942', mb: 0.5 }}>Track a bag</Typography>
        <Typography sx={{ color: '#64748B', fontSize: '0.84rem', mb: 2 }}>Enter the tag number printed on the bag tag, for example 00980000001.</Typography>
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
          <TextField size="small" fullWidth placeholder="Bag tag number" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && track()} />
          <Button variant="contained" disabled={tracking} startIcon={<Search size={15} />} onClick={() => track()} sx={{ textTransform: 'none', fontWeight: 700, backgroundColor: '#0F2942' }}>
            Track
          </Button>
        </Box>

        {bag && (
          <>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography sx={{ fontFamily: "'Geist Mono', monospace", fontWeight: 800 }}>{bag.tagNumber}</Typography>
              <Chip size="small" label={bag.status} sx={{ fontWeight: 700 }} />
              {bag.weightKg != null && <Chip size="small" variant="outlined" label={`${bag.weightKg} kg`} />}
              {bag.flightNumber && <Chip size="small" variant="outlined" label={`Flight ${bag.flightNumber}`} />}
              {bag.passengerName && <Chip size="small" variant="outlined" label={bag.passengerName} />}
            </Box>

            <Typography sx={{ ...head, mb: 0.5 }}>SCAN HISTORY</Typography>
            <Table size="small" sx={{ mb: 2 }}>
              <TableBody>
                {bag.scanEvents.length === 0 ? (
                  <TableRow><TableCell sx={{ color: '#64748B' }}>No scans recorded yet.</TableCell></TableRow>
                ) : (
                  bag.scanEvents.map((s) => (
                    <TableRow key={s.scanId}>
                      <TableCell>{s.location}</TableCell>
                      <TableCell align="right" sx={{ color: '#64748B' }}>{new Date(s.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
              <TextField size="small" fullWidth placeholder="Scan location, e.g. Carousel C03" value={scanLocation} onChange={(e) => setScanLocation(e.target.value)} />
              <Button variant="outlined" disabled={scanning || !scanLocation.trim()} startIcon={<ScanLine size={15} />} onClick={recordScan} sx={{ textTransform: 'none', fontWeight: 700, whiteSpace: 'nowrap' }}>
                Record scan
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextField select size="small" value={incidentType} onChange={(e) => setIncidentType(e.target.value)} sx={{ minWidth: 150 }}>
                {INCIDENT_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
              <Button variant="outlined" color="error" disabled={reporting} startIcon={<AlertOctagon size={15} />} onClick={reportMishandled} sx={{ textTransform: 'none', fontWeight: 700 }}>
                Report as mishandled
              </Button>
            </Box>
          </>
        )}
      </Card>

      <Card elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', borderRadius: '14px' }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F2942', mb: 2 }}>Mishandled baggage reports</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={head}>CLAIM</TableCell>
              <TableCell sx={head}>TYPE</TableCell>
              <TableCell sx={head}>TAG</TableCell>
              <TableCell sx={head}>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportsLoading ? (
              <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3, color: '#64748B' }}>Loading…</TableCell></TableRow>
            ) : (
              reports.map((r) => (
                <TableRow key={r.reportId} hover sx={{ cursor: 'pointer' }} onClick={() => { if (r.tagNumber) { setTagInput(r.tagNumber); track(r.tagNumber); } }}>
                  <TableCell sx={{ fontFamily: "'Geist Mono', monospace", fontWeight: 700 }}>{r.claimNumber}</TableCell>
                  <TableCell>{r.incidentType}</TableCell>
                  <TableCell sx={{ fontFamily: "'Geist Mono', monospace" }}>{r.tagNumber}</TableCell>
                  <TableCell>{r.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
          <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>Page {reportPage + 1} of {reportPages} · {reportTotal.toLocaleString()} reports</Typography>
          <Box>
            <Button size="small" disabled={reportPage === 0} onClick={() => setReportPage((p) => p - 1)} sx={{ textTransform: 'none' }}>Prev</Button>
            <Button size="small" disabled={reportPage + 1 >= reportPages} onClick={() => setReportPage((p) => p + 1)} sx={{ textTransform: 'none' }}>Next</Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default LiveBaggageDesk;
