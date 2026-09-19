import axiosClient from './axiosClient';
import { GpuTelemetryLog, IncidentTicket, CheckinCounterAllocation, HandoverNote } from '../types';

export const featureModulesApi = {
  // Feature 7: Aircraft Auxiliary Power (GPU/PCA) Utility Monitor
  getGpuLogs: async (): Promise<GpuTelemetryLog[]> => {
    const response = await axiosClient.get<GpuTelemetryLog[]>('/utilities/gpu');
    return response.data;
  },

  logGpuUsage: async (payload: {
    flightNumber: string;
    standCode: string;
    gpuUnitCode: string;
    kwhDelivered: number;
    durationMinutes: number;
  }): Promise<GpuTelemetryLog> => {
    const response = await axiosClient.post<GpuTelemetryLog>('/utilities/gpu', payload);
    return response.data;
  },

  // Feature 12: Interactive Terminal Incident Tracker
  getIncidents: async (): Promise<IncidentTicket[]> => {
    const response = await axiosClient.get<IncidentTicket[]>('/incidents');
    return response.data;
  },

  createIncident: async (payload: {
    title: string;
    location: string;
    flightNumber?: string;
    severity: string;
    assignedOfficer: string;
    description: string;
  }): Promise<IncidentTicket> => {
    const response = await axiosClient.post<IncidentTicket>('/incidents', payload);
    return response.data;
  },

  updateIncidentStatus: async (ticketId: string, status: string): Promise<IncidentTicket> => {
    const response = await axiosClient.put<IncidentTicket>(`/incidents/${ticketId}/status`, { status });
    return response.data;
  },

  // Feature 13: Check-in Counter Allocation Planner
  getCheckinCounterAllocations: async (): Promise<CheckinCounterAllocation[]> => {
    const response = await axiosClient.get<CheckinCounterAllocation[]>('/checkin-counters');
    return response.data;
  },

  allocateCheckinCounter: async (payload: {
    counterNumber: string;
    terminal: string;
    airlineCode: string;
    flightNumber: string;
    classCategory: string;
    startTime: string;
    endTime: string;
  }): Promise<CheckinCounterAllocation> => {
    const response = await axiosClient.post<CheckinCounterAllocation>('/checkin-counters', payload);
    return response.data;
  },

  // Feature 19: Shift Handover Bulletin Board
  getHandoverNotes: async (): Promise<HandoverNote[]> => {
    const response = await axiosClient.get<HandoverNote[]>('/handover-notes');
    return response.data;
  },

  postHandoverNote: async (payload: {
    department: string;
    author: string;
    priority: string;
    title: string;
    content: string;
  }): Promise<HandoverNote> => {
    const response = await axiosClient.post<HandoverNote>('/handover-notes', payload);
    return response.data;
  },
};

export default featureModulesApi;
