import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { FileText, Code, Shield } from 'lucide-react';
import { AuditLog } from '../types';

export const AuditLogViewer: React.FC = () => {
  const [selectedPayload, setSelectedPayload] = useState<string | null>(null);

  const mockLogs: AuditLog[] = [
    {
      auditId: 1001,
      action: 'UPDATE_FLIGHT_STATUS',
      entityType: 'FLIGHT',
      entityId: 101,
      performedByUserId: 1,
      performedByUserName: 'krishna.ops (Operations Manager)',
      timestamp: '2026-07-30 00:45:12',
      ipAddress: '192.168.1.45',
      changePayload: JSON.stringify(
        { oldStatus: 'SCHEDULED', newStatus: 'LANDED', flightNumber: 'SPH-402', gate: 'A1' },
        null,
        2
      ),
    },
    {
      auditId: 1002,
      action: 'AUTHORIZE_FUEL_VARIANCE',
      entityType: 'TURNAROUND_TASK',
      entityId: 2,
      performedByUserId: 12,
      performedByUserName: 'vikram.fuel (Supervisor)',
      timestamp: '2026-07-30 00:52:40',
      ipAddress: '192.168.1.88',
      changePayload: JSON.stringify(
        { targetKg: 8500, actualKg: 8650, variancePct: '+1.76%', overridePinUsed: true },
        null,
        2
      ),
    },
    {
      auditId: 1003,
      action: 'ALLOCATE_GATE',
      entityType: 'GATE',
      entityId: 4,
      performedByUserId: 1,
      performedByUserName: 'krishna.ops (Operations Manager)',
      timestamp: '2026-07-30 01:05:00',
      ipAddress: '192.168.1.45',
      changePayload: JSON.stringify(
        { gateCode: 'B4', flightId: 102, terminal: 'Terminal 2' },
        null,
        2
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff' }}>
            Immutable Security Audit Trail
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            System Action Log Viewer & JSON Change Payload Inspector (`SPH Hub`)
          </Typography>
        </Box>
        <Shield color="#38bdf8" size={32} />
      </Box>

      {/* Audit Log Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Table>
              <TableHead sx={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                <TableRow>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Audit ID</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Action</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Entity Type & ID</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Performed By</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Timestamp</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>IP Address</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }} align="right">
                    Payload
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockLogs.map((log) => (
                  <TableRow key={log.auditId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontFamily: 'JetBrains Mono, monospace', color: '#94a3b8' }}>
                      #{log.auditId}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.action}
                        size="small"
                        sx={{ backgroundColor: 'rgba(37, 99, 235, 0.2)', color: '#60a5fa', fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>
                      {log.entityType} (ID: {log.entityId})
                    </TableCell>
                    <TableCell sx={{ color: '#cbd5e1' }}>{log.performedByUserName}</TableCell>
                    <TableCell sx={{ fontFamily: 'JetBrains Mono, monospace', color: '#38bdf8' }}>
                      {log.timestamp}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'JetBrains Mono, monospace', color: '#94a3b8' }}>
                      {log.ipAddress}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => setSelectedPayload(log.changePayload)}
                        sx={{ color: '#38bdf8' }}
                      >
                        <Code size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* JSON Payload Dialog */}
      <Dialog open={Boolean(selectedPayload)} onClose={() => setSelectedPayload(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>JSON Change Payload (`change_payload`)</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box
            component="pre"
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: '#0b1329',
              color: '#38bdf8',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.85rem',
              overflow: 'auto',
            }}
          >
            {selectedPayload}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedPayload(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
