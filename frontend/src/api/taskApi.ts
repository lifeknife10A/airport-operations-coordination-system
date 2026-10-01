import axiosClient from './axiosClient';
import { TurnaroundTask, TaskCreatePayload } from '../types';

const clock = (iso?: string | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${d.toISOString().slice(11, 16)} UTC`;
};

// Backend TaskDTO -> frontend TurnaroundTask (scheduledStart/End -> plannedStart/End as a clock
// string, and the task's type is its name, e.g. CLEANING / REFUELING).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeTask = (d: any): TurnaroundTask => ({
  taskId: d.taskId,
  flightId: d.flightId,
  flightNumber: d.flightNumber ?? '',
  taskType: String(d.taskName ?? '').toUpperCase(),
  taskName: d.taskName ?? '',
  status: d.status,
  assignedUserId: d.assignedUserId ?? undefined,
  assignedUserName: d.assignedUserName ?? undefined,
  plannedStart: clock(d.scheduledStart),
  plannedEnd: clock(d.scheduledEnd),
  actualStart: d.actualStart ? clock(d.actualStart) : undefined,
  actualEnd: d.actualEnd ? clock(d.actualEnd) : undefined,
  notes: d.notes ?? undefined,
});

export const taskApi = {
  getAllTasks: async (): Promise<TurnaroundTask[]> => {
    const response = await axiosClient.get('/tasks');
    return response.data.map(normalizeTask);
  },

  getTasksByFlight: async (flightId: number): Promise<TurnaroundTask[]> => {
    const response = await axiosClient.get(`/tasks/flight/${flightId}`);
    return response.data.map(normalizeTask);
  },

  // The acting user is taken from the auth token on the server; none is sent from here.
  updateTaskStatus: async (taskId: number, status: string, notes?: string): Promise<TurnaroundTask> => {
    const response = await axiosClient.put(`/tasks/${taskId}/status`, { status, notes });
    return normalizeTask(response.data);
  },

  assignTaskUser: async (taskId: number, userId: number): Promise<TurnaroundTask> => {
    const response = await axiosClient.put(`/tasks/${taskId}/assign`, { userId });
    return normalizeTask(response.data);
  },

  createTask: async (payload: TaskCreatePayload): Promise<TurnaroundTask> => {
    const response = await axiosClient.post('/tasks', payload);
    return normalizeTask(response.data);
  },
};
