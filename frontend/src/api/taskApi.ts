import axiosClient from './axiosClient';
import { TurnaroundTask } from '../types';

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

export interface TaskPage {
  content: TurnaroundTask[];
  page: number;
  totalElements: number;
  totalPages: number;
}

export interface TaskStatusCounts {
  PENDING: number;
  IN_PROGRESS: number;
  COMPLETED: number;
  BLOCKED: number;
}

export interface ActiveTurnaround {
  flightId: number;
  flightNumber: string;
  flightStatus: string;
  airlineName: string;
  aircraftType: string;
  standNumber: string;
  concourse: string;
  origin: string;
  destination: string;
  scheduledDeparture?: string;
  tasks: TurnaroundTask[];
}

export interface StaffWorkload {
  userId: number;
  name: string;
  username: string;
  departmentName: string;
  inProgressTasks: number;
  openTasks: number;
}

export const taskApi = {
  getPage: async (opts: { status?: string; q?: string; page?: number; size?: number } = {}): Promise<TaskPage> => {
    const response = await axiosClient.get('/tasks/page', {
      params: { status: opts.status || undefined, q: opts.q || undefined, page: opts.page ?? 0, size: opts.size ?? 25 },
    });
    return { ...response.data, content: response.data.content.map(normalizeTask) };
  },

  getStatusCounts: async (): Promise<TaskStatusCounts> => (await axiosClient.get('/tasks/summary')).data,

  getActiveTurnarounds: async (limit = 30): Promise<ActiveTurnaround[]> => {
    const response = await axiosClient.get('/tasks/active-turnarounds', { params: { limit } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data.map((x: any): ActiveTurnaround => ({
      flightId: x.flight.flightId,
      flightNumber: x.flight.flightNumber,
      flightStatus: x.flight.flightStatus,
      airlineName: x.flight.airlineName ?? '',
      aircraftType: x.flight.aircraftType ?? '',
      standNumber: x.flight.standNumber ?? '',
      concourse: x.concourse ?? '',
      origin: x.flight.originAirportCode ?? '',
      destination: x.flight.destinationAirportCode ?? '',
      scheduledDeparture: x.flight.scheduledDepartureTime ?? undefined,
      tasks: x.tasks.map(normalizeTask),
    }));
  },

  getRampStaff: async (): Promise<StaffWorkload[]> => (await axiosClient.get('/tasks/staff')).data,

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
    const response = await axiosClient.put(`/tasks/${taskId}/assign`, null, { params: { userId } });
    return normalizeTask(response.data);
  },

  // The backend defaults the schedule to "now, 30 minutes long" when none is given.
  createTask: async (payload: { flightId: number; taskName: string; assignedUserId?: number }): Promise<TurnaroundTask> => {
    const response = await axiosClient.post('/tasks', payload);
    return normalizeTask(response.data);
  },
};
