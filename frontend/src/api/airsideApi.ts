import axiosClient from './axiosClient';

export interface OperationalFlightDto {
  flightId: number;
  flightNumber: string;
  flightStatus: string;
  flightType: string;
  airlineName?: string;
  aircraftType?: string;
  aircraftWingspanMeters?: number;
  gateNumber?: string;
  standNumber?: string;
  runwayId?: number;
  scheduledDepartureTime?: string;
}

export interface AirsideConflictDto {
  type: 'WINGSPAN_OVERSIZE' | 'GATE_CONFLICT';
  severity: 'CRITICAL' | 'WARNING';
  flightId: number;
  flightNumber: string;
  gateNumber?: string;
  otherFlightNumber?: string;
  aircraftWingspanMeters?: number;
  gateMaxWingspanMeters?: number;
  scheduledDeparture?: string;
  title: string;
  description: string;
}

export interface AirsideConflicts {
  total: number;
  wingspanOversize: number;
  gateConflicts: number;
  items: AirsideConflictDto[];
}

export const airsideApi = {
  getOperationalFlights: async (limit = 40): Promise<OperationalFlightDto[]> =>
    (await axiosClient.get('/flights/operational', { params: { limit } })).data,

  getFlightStatusSummary: async (): Promise<Record<string, number>> =>
    (await axiosClient.get('/flights/status-summary')).data,

  getConflicts: async (limit = 25): Promise<AirsideConflicts> =>
    (await axiosClient.get('/airside/conflicts', { params: { limit } })).data,

  assignRunway: async (flightId: number, runwayId: number): Promise<void> => {
    await axiosClient.put(`/flights/${flightId}/runway`, { runwayId });
  },
};
