import React, { useState, useEffect } from 'react';
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
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import { RefreshCw, Edit3 } from 'lucide-react';
import { taskApi } from '../api/taskApi';
import { TurnaroundTask } from '../types';
import { StatusChip } from '../components/StatusChip';

export const TaskTrackerPage: React.FC = () => {
  const [tasks, setTasks] = useState<TurnaroundTask[]>([]);
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  // Edit Task Modal State
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TurnaroundTask | null>(null);
  const [taskStatus, setTaskStatus] = useState('IN_PROGRESS');
  const [notes, setNotes] = useState('');

  const mockTasks: TurnaroundTask[] = [
    {
      taskId: 1,
      flightId: 1,
      flightNumber: 'SPH-402',
      taskType: 'CLEANING',
      taskName: 'Cabin Sweep & Lavatory Sanitization',
      status: 'COMPLETED',
      assignedUserId: 10,
      assignedUserName: 'Ramp Team Alpha',
      departmentName: 'GROUND_HANDLING',
      plannedStart: '14:35',
      plannedEnd: '14:50',
      actualStart: '14:35',
      actualEnd: '14:48',
      notes: 'All seat pockets swept and sanitized clean.',
    },
    {
      taskId: 2,
      flightId: 1,
      flightNumber: 'SPH-402',
      taskType: 'REFUELING',
      taskName: 'Fuel Tank Loading (Target: 8,500 kg)',
      status: 'IN_PROGRESS',
      assignedUserId: 12,
      assignedUserName: 'Fuel Chief Vikram',
      departmentName: 'GROUND_HANDLING',
      plannedStart: '14:40',
      plannedEnd: '15:00',
      notes: 'Pumping in progress at Stand S101.',
    },
    {
      taskId: 3,
      flightId: 2,
      flightNumber: 'SPH-718',
      taskType: 'CATERING',
      taskName: 'Galley Cart Replenishment',
      status: 'COMPLETED',
      assignedUserId: 15,
      assignedUserName: 'Catering Lead Sunita',
      departmentName: 'CATERING_SERVICES',
      plannedStart: '14:45',
      plannedEnd: '15:00',
      actualStart: '14:44',
      actualEnd: '14:58',
    },
    {
      taskId: 4,
      flightId: 2,
      flightNumber: 'SPH-718',
      taskType: 'MAINTENANCE',
      taskName: 'Avionics & Tire Check Sign-Off',
      status: 'COMPLETED',
      assignedUserId: 8,
      assignedUserName: 'Eng. Rajesh K',
      departmentName: 'MAINTENANCE',
      plannedStart: '14:35',
      plannedEnd: '14:55',
    },
    {
      taskId: 5,
      flightId: 3,
      flightNumber: 'AI-631',
      taskType: 'SECURITY',
      taskName: 'Ramp Security & Cabin Sweep',
      status: 'PENDING',
      assignedUserId: 19,
      assignedUserName: 'Security Officer Roy',
      departmentName: 'SECURITY',
      plannedStart: '15:00',
      plannedEnd: '15:10',
    },
  ];

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await taskApi.getTasksByFlight(1);
      if (data && data.length > 0) setTasks(data);
      else setTasks(mockTasks);
    } catch {
      setTasks(mockTasks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskSave = async () => {
    if (!selectedTask) return;
    try {
      await taskApi.updateTaskStatus(selectedTask.taskId, taskStatus, undefined, notes);
      setOpenEdit(false);
      fetchTasks();
    } catch {
      setTasks(
        tasks.map((t) =>
          t.taskId === selectedTask.taskId ? { ...t, status: taskStatus as any, notes } : t
        )
      );
      setOpenEdit(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesDept = deptFilter === 'ALL' || t.departmentName === deptFilter;
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesDept && matchesStatus;
  });

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff' }}>
            Turnaround Task Checklist Grid
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Ground Operations & Ramp Task Monitoring Matrix (`SPH Hub`)
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshCw size={16} />}
          onClick={fetchTasks}
          disabled={loading}
          sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
        >
          Refresh Tasks
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Department</InputLabel>
              <Select
                value={deptFilter}
                label="Department"
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                <MenuItem value="ALL">All Departments</MenuItem>
                <MenuItem value="GROUND_HANDLING">Ground Handling</MenuItem>
                <MenuItem value="CATERING_SERVICES">Catering Services</MenuItem>
                <MenuItem value="MAINTENANCE">Maintenance & Engineering</MenuItem>
                <MenuItem value="SECURITY">Security & Safety</MenuItem>
                <MenuItem value="PASSENGER_SERVICES">Passenger Services</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Task Status</InputLabel>
              <Select
                value={statusFilter}
                label="Task Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="ALL">All Task Statuses</MenuItem>
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
                <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                <MenuItem value="DELAYED">DELAYED</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Task Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Table>
              <TableHead sx={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                <TableRow>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Task Name</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Flight #</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Department</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Assigned Staff</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Planned Window</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }} align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.map((t) => (
                  <TableRow key={t.taskId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 700, color: '#ffffff' }}>{t.taskName}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#60a5fa' }}>{t.flightNumber}</TableCell>
                    <TableCell sx={{ color: '#cbd5e1' }}>{t.departmentName || 'Ground Handling'}</TableCell>
                    <TableCell sx={{ color: '#94a3b8' }}>{t.assignedUserName || 'Unassigned'}</TableCell>
                    <TableCell sx={{ fontFamily: 'JetBrains Mono, monospace', color: '#38bdf8' }}>
                      {t.plannedStart} - {t.plannedEnd}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={t.status} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedTask(t);
                          setTaskStatus(t.status);
                          setNotes(t.notes || '');
                          setOpenEdit(true);
                        }}
                        sx={{ color: '#f59e0b' }}
                      >
                        <Edit3 size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Edit Task Status Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Update Task Status</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 700 }}>
            {selectedTask?.taskName} ({selectedTask?.flightNumber})
          </Typography>

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={taskStatus}
              label="Status"
              onChange={(e) => setTaskStatus(e.target.value)}
            >
              <MenuItem value="PENDING">PENDING</MenuItem>
              <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
              <MenuItem value="COMPLETED">COMPLETED</MenuItem>
              <MenuItem value="DELAYED">DELAYED</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Ground Crew Notes / Remarks"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Record any operational remarks or delay reasons..."
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleTaskSave}>
            Save Task Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
