import axiosClient from './axiosClient';
import { TurnaroundTask } from '../types';
import { normalizeTask } from './taskApi';
import { Flight } from '../types';
import { normalizeFlight } from './flightApi';

export interface DelayEntry {
  flightId: number;
  flightNumber: string;
  route: string;
  seqNo: number;
  delayCode: string;
  category: string;
  description: string;
  delayMinutes: number;
}

export interface DelayCode {
  delayCode: string;
  category: string;
  description: string;
}

export interface FlightOperations {
  flight: Flight;
  tasks: TurnaroundTask[];
  delays: DelayEntry[];
  boardingPasses: number;
}

export interface DelayPage {
  content: DelayEntry[];
  page: number;
  totalElements: number;
  totalPages: number;
}

export const flightOpsApi = {
  getOperations: async (flightId: number): Promise<FlightOperations> => {
    const { data } = await axiosClient.get(`/flights/${flightId}/operations`);
    return {
      flight: normalizeFlight(data.flight),
      tasks: data.tasks.map(normalizeTask),
      delays: data.delays,
      boardingPasses: data.boardingPasses,
    };
  },

  getDelays: async (page = 0, size = 25): Promise<DelayPage> =>
    (await axiosClient.get('/flights/delays', { params: { page, size } })).data,

  getDelayCodes: async (): Promise<DelayCode[]> => (await axiosClient.get('/flights/delay-codes')).data,

  logDelay: async (flightId: number, delayCode: string, delayMinutes: number): Promise<DelayEntry> =>
    (await axiosClient.post(`/flights/${flightId}/delays`, { delayCode, delayMinutes })).data,
};
