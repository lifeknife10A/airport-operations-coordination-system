import axiosClient from './axiosClient';

export interface ShiftHandoverData {
  handoverId: number;
  shiftCode: string;
  departmentId: number;
  departmentName: string;
  outgoingSupervisorId: number;
  outgoingSupervisorName: string;
  incomingSupervisorId: number;
  incomingSupervisorName: string;
  totalFlightsHandled: number;
  delayedFlightsCount: number;
  averageTurnaroundMinutes: number;
  groundIncidentsCount: number;
  criticalEventsSummary: string;
  unresolvedEquipmentIssues?: string;
  pendingFlightWatches?: string;
  safetyWeatherAdvisories?: string;
  outgoingSignoffTimestamp: string;
  incomingSignoffTimestamp?: string;
  status: string;
  createdAt: string;
}

export interface ShiftHandoverCreatePayload {
  shiftCode: string;
  departmentId: number;
  outgoingSupervisorId: number;
  incomingSupervisorId: number;
  totalFlightsHandled?: number;
  delayedFlightsCount?: number;
  averageTurnaroundMinutes?: number;
  groundIncidentsCount?: number;
  criticalEventsSummary: string;
  unresolvedEquipmentIssues?: string;
  pendingFlightWatches?: string;
  safetyWeatherAdvisories?: string;
}

export const shiftHandoverApi = {
  getPending: async (): Promise<ShiftHandoverData[]> => {
    const response = await axiosClient.get<ShiftHandoverData[]>('/shift-handover/pending');
    return response.data;
  },

  getAll: async (page = 0, size = 20) => {
    const response = await axiosClient.get('/shift-handover', { params: { page, size } });
    return response.data;
  },

  getById: async (id: number): Promise<ShiftHandoverData> => {
    const response = await axiosClient.get<ShiftHandoverData>(`/shift-handover/${id}`);
    return response.data;
  },

  create: async (payload: ShiftHandoverCreatePayload): Promise<ShiftHandoverData> => {
    const response = await axiosClient.post<ShiftHandoverData>('/shift-handover', payload);
    return response.data;
  },

  acknowledge: async (id: number, incomingSupervisorId: number, acknowledgementNotes?: string): Promise<ShiftHandoverData> => {
    const response = await axiosClient.put<ShiftHandoverData>(`/shift-handover/${id}/acknowledge`, {
      incomingSupervisorId,
      acknowledgementNotes,
    });
    return response.data;
  },
};

export default shiftHandoverApi;
