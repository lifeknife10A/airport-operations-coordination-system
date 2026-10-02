import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Download, FilePlus2, Receipt } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { billingApi, InvoiceDto, InvoiceLineItemDto } from '../../api/billingApi';
import { exportAirlineBillingExcel } from '../../utils/exportReports';

type StatusFilter = 'ALL' | InvoiceDto['paymentStatus'];

const STATUS_STYLE: Record<InvoiceDto['paymentStatus'], { bg: string; fg: string }> = {
  PAID: { bg: '#DCFCE7', fg: '#15803D' },
  UNPAID: { bg: '#FEF3C7', fg: '#B45309' },
  OVERDUE: { bg: '#FEF2F2', fg: '#DC2626' },
};

const PAGE_SIZE = 15;
const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const apiMessage = (err: unknown, fallback: string) => {
  const e = err as { response?: { data?: { detail?: string; fieldErrors?: Record<string, string> } } };
  const fields = e.response?.data?.fieldErrors ? Object.values(e.response.data.fieldErrors).join(', ') : '';
  return fields || e.response?.data?.detail || fallback;
};

export const BillingDashboard: React.FC = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const [detail, setDetail] = useState<{ invoice: InvoiceDto; lineItems: InvoiceLineItemDto[] } | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [generateOpen, setGenerateOpen] = useState(false);
  const [genAirlineId, setGenAirlineId] = useState<number | ''>('');
  const [genStart, setGenStart] = useState('');
  const [genEnd, setGenEnd] = useState('');
  const [genAmount, setGenAmount] = useState('');
  const [genNumber, setGenNumber] = useState('');
  const [generating, setGenerating] = useState(false);

  const load = () => {
    setLoading(true);
    billingApi
      .getAllInvoices()
      .then(setInvoices)
      .catch((err) => toast.error(apiMessage(err, 'Could not load invoices from the server.')))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const airlines = useMemo(() => {
    const byId = new Map<number, string>();
    invoices.forEach((i) => byId.set(i.airline.airlineId, i.airline.airlineName));
    return [...byId.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [invoices]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return invoices.filter(
      (i) =>
        (statusFilter === 'ALL' || i.paymentStatus === statusFilter) &&
        (!q || i.invoiceNumber.toLowerCase().includes(q) || i.airline.airlineName.toLowerCase().includes(q) || i.airline.iataCode.toLowerCase().includes(q))
    );
  }, [invoices, statusFilter, search]);

  useEffect(() => setPage(0), [statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const totals = useMemo(() => {
    const sum = (s?: InvoiceDto['paymentStatus']) =>
      invoices.filter((i) => !s || i.paymentStatus === s).reduce((acc, i) => acc + i.totalAmountUsd, 0);
    return {
      billed: sum(),
      paid: sum('PAID'),
      outstanding: sum('UNPAID') + sum('OVERDUE'),
      overdueCount: invoices.filter((i) => i.paymentStatus === 'OVERDUE').length,
    };
  }, [invoices]);

  const openDetail = (invoiceId: number) => {
    setDetailLoading(true);
    setDetail(null);
    billingApi
      .getInvoiceDetails(invoiceId)
      .then(setDetail)
      .catch((err) => toast.error(apiMessage(err, 'Could not load that invoice.')))
      .finally(() => setDetailLoading(false));
  };

  const handleGenerate = async () => {
    if (!genAirlineId || !genStart || !genEnd || !genAmount || !genNumber.trim()) {
      toast.error('Please complete every field.');
      return;
    }
    setGenerating(true);
    try {
      const created = await billingApi.generateInvoice({
        airlineId: Number(genAirlineId),
        startDate: genStart,
        endDate: genEnd,
        totalAmountUsd: Number(genAmount),
        invoiceNumber: genNumber.trim(),
      });
      setInvoices((prev) => [created, ...prev]);
      toast.success(`Invoice ${created.invoiceNumber} created for ${created.airline.airlineName}.`);
      setGenerateOpen(false);
      setGenAirlineId('');
      setGenAmount('');
      setGenNumber('');
    } catch (err) {
      toast.error(`Invoice was NOT created: ${apiMessage(err, 'the server rejected the request.')}`);
    } finally {
      setGenerating(false);
    }
  };

  const kpis = [
    { label: 'Invoices', value: invoices.length.toLocaleString(), sub: 'on record' },
    { label: 'Total billed', value: usd(totals.billed), sub: 'all invoices' },
    { label: 'Collected', value: usd(totals.paid), sub: 'paid invoices' },
    { label: 'Outstanding', value: usd(totals.outstanding), sub: `${totals.overdueCount} overdue` },
  ];

  const lineTotal = detail ? detail.lineItems.reduce((a, l) => a + l.amountUsd, 0) : 0;

  return (
    <DashboardLayout activeRole="billing">
      <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', color: '#0284C7' }}>
              AIRLINE BILLING
            </Typography>
            <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.6rem', color: '#0F2942' }}>
              Invoices &amp; charges
            </Typography>
            <Typography sx={{ color: '#64748B', fontSize: '0.88rem' }}>
              Signed in as {user?.name}. Figures below come straight from the billing database.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button variant="outlined" startIcon={<Download size={16} />} onClick={() => exportAirlineBillingExcel()} sx={{ textTransform: 'none', fontWeight: 600 }}>
              Export billing manifest
            </Button>
            <Button
              variant="contained"
              startIcon={<FilePlus2 size={16} />}
              onClick={() => {
                setGenNumber(`INV-${new Date().getFullYear()}-${String(Math.floor(10000 + Math.random() * 89999))}`);
                setGenerateOpen(true);
              }}
              sx={{ textTransform: 'none', fontWeight: 700, backgroundColor: '#0F2942', '&:hover': { backgroundColor: '#1E3A5F' } }}
            >
              New invoice
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          {kpis.map((k) => (
            <Card key={k.label} elevation={0} sx={{ p: 2.5, border: '1px solid #E2E8F0', borderRadius: '14px' }}>
              <Typography sx={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>{k.label}</Typography>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(1.05rem, 1.6vw, 1.5rem)', color: '#0F2942', overflowWrap: 'anywhere' }}>{loading ? '…' : k.value}</Typography>
              <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8' }}>{k.sub}</Typography>
            </Card>
          ))}
        </Box>

        <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', p: 2.5 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', mb: 2 }}>
            <TextField
              size="small"
              placeholder="Search invoice number or airline…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 280 }}
            />
            {(['ALL', 'UNPAID', 'OVERDUE', 'PAID'] as StatusFilter[]).map((s) => (
              <Chip
                key={s}
                label={s}
                onClick={() => setStatusFilter(s)}
                variant={statusFilter === s ? 'filled' : 'outlined'}
                sx={{ fontWeight: 700, ...(statusFilter === s ? { backgroundColor: '#0F2942', color: '#fff' } : {}) }}
              />
            ))}
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['INVOICE', 'AIRLINE', 'BILLING PERIOD', 'AMOUNT', 'STATUS', ''].map((h) => (
                    <TableCell key={h} sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.74rem' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: '#64748B' }}>Loading invoices…</TableCell></TableRow>
                ) : pageRows.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: '#64748B' }}>No invoices match.</TableCell></TableRow>
                ) : (
                  pageRows.map((i) => (
                    <TableRow key={i.invoiceId} hover>
                      <TableCell sx={{ fontFamily: "'Geist Mono', monospace", fontWeight: 700 }}>{i.invoiceNumber}</TableCell>
                      <TableCell>{i.airline.airlineName} <span style={{ color: '#94A3B8' }}>({i.airline.iataCode})</span></TableCell>
                      <TableCell sx={{ color: '#475569' }}>{i.billingPeriodStart} → {i.billingPeriodEnd}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{usd(i.totalAmountUsd)}</TableCell>
                      <TableCell>
                        <Chip size="small" label={i.paymentStatus} sx={{ fontWeight: 700, fontSize: '0.7rem', backgroundColor: STATUS_STYLE[i.paymentStatus].bg, color: STATUS_STYLE[i.paymentStatus].fg }} />
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" startIcon={<Receipt size={14} />} onClick={() => openDetail(i.invoiceId)} sx={{ textTransform: 'none', fontWeight: 600 }}>
                          Charges
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
            <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
              {loading ? 'Loading…' : `Page ${page + 1} of ${totalPages} · ${filtered.length.toLocaleString()} invoices`}
            </Typography>
            <Box>
              <Button size="small" disabled={page === 0} onClick={() => setPage((p) => p - 1)} sx={{ textTransform: 'none' }}>Prev</Button>
              <Button size="small" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)} sx={{ textTransform: 'none' }}>Next</Button>
            </Box>
          </Box>
        </Card>
      </Box>

      <Dialog open={detailLoading || !!detail} onClose={() => { setDetail(null); setDetailLoading(false); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>{detail ? detail.invoice.invoiceNumber : 'Loading invoice…'}</DialogTitle>
        <DialogContent>
          {detail && (
            <>
              <Typography sx={{ color: '#475569', mb: 2, fontSize: '0.88rem' }}>
                {detail.invoice.airline.airlineName} · {detail.invoice.billingPeriodStart} → {detail.invoice.billingPeriodEnd} · {detail.invoice.paymentStatus}
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>CHARGE</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>FLIGHT</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>AMOUNT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {detail.lineItems.length === 0 ? (
                    <TableRow><TableCell colSpan={3} align="center" sx={{ color: '#64748B' }}>No itemised charges recorded.</TableCell></TableRow>
                  ) : (
                    detail.lineItems.map((l) => (
                      <TableRow key={l.lineItemId}>
                        <TableCell>{l.chargeType}</TableCell>
                        <TableCell sx={{ color: '#64748B' }}>{l.flight?.flightNumber ?? '—'}</TableCell>
                        <TableCell align="right">{usd(l.amountUsd)}</TableCell>
                      </TableRow>
                    ))
                  )}
                  <TableRow>
                    <TableCell colSpan={2} sx={{ fontWeight: 800 }}>Invoice total</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>{usd(detail.invoice.totalAmountUsd)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {detail.lineItems.length > 0 && Math.abs(lineTotal - detail.invoice.totalAmountUsd) > 0.01 && (
                <Typography sx={{ mt: 1.5, fontSize: '0.78rem', color: '#B45309' }}>
                  Itemised charges add up to {usd(lineTotal)}, which differs from the invoice total.
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDetail(null); setDetailLoading(false); }} sx={{ textTransform: 'none' }}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={generateOpen} onClose={() => setGenerateOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>New invoice</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          <TextField select size="small" label="Airline" value={genAirlineId} onChange={(e) => setGenAirlineId(Number(e.target.value))}>
            {airlines.map(([id, name]) => <MenuItem key={id} value={id}>{name}</MenuItem>)}
          </TextField>
          <TextField size="small" type="date" label="Period start" slotProps={{ inputLabel: { shrink: true } }} value={genStart} onChange={(e) => setGenStart(e.target.value)} />
          <TextField size="small" type="date" label="Period end" slotProps={{ inputLabel: { shrink: true } }} value={genEnd} onChange={(e) => setGenEnd(e.target.value)} />
          <TextField size="small" type="number" label="Total amount (USD)" value={genAmount} onChange={(e) => setGenAmount(e.target.value)} />
          <TextField size="small" label="Invoice number" value={genNumber} onChange={(e) => setGenNumber(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" disabled={generating} onClick={handleGenerate} sx={{ textTransform: 'none', fontWeight: 700, backgroundColor: '#0F2942' }}>
            {generating ? 'Creating…' : 'Create invoice'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default BillingDashboard;
