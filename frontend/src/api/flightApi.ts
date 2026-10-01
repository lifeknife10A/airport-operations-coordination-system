import axiosClient from './axiosClient';
import { Flight, FlightCreatePayload, PagedResponse } from '../types';

// The backend's FlightDTO uses its own field names (flightStatus, gateNumber, scheduled/estimated/
// actual Departure|ArrivalTime, ...). The rest of the frontend works with the `Flight` shape in
// types/index.ts, so every response is converted here, once, at the API boundary. Reading the
// backend fields directly with the frontend names (as this used to) silently gave `undefined`
// for status, gate and time.
const utcClock = (iso?: string | null): string | undefined => {
  if (!iso) return undefined;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? undefined : `${d.toISOString().slice(11, 16)} UTC`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeFlight = (d: any): Flight => {
  const departure = d.flightType === 'DEPARTURE';
  const scheduled = departure ? d.scheduledDepartureTime : d.scheduledArrivalTime;
  const estimated = departure ? d.estimatedDepartureTime : d.estimatedArrivalTime;
  const actual = departure ? d.actualDepartureTime : d.actualArrivalTime;
  return {
    flightId: d.flightId,
    flightNumber: d.flightNumber,
    airlineCode: d.airlineCode ?? '',
    airlineName: d.airlineName ?? '',
    flightType: d.flightType,
    originAirportCode: d.originAirportCode ?? '',
    originAirportName: d.originAirportName ?? '',
    destinationAirportCode: d.destinationAirportCode ?? '',
    destinationAirportName: d.destinationAirportName ?? '',
    aircraftRegistration: d.aircraftRegistration ?? '',
    aircraftType: d.aircraftType ?? 'Aircraft',
    scheduledTime: utcClock(scheduled) ?? '',
    estimatedTime: utcClock(estimated),
    actualTime: utcClock(actual),
    status: d.flightStatus ?? d.status ?? 'SCHEDULED',
    gateCode: d.gateNumber ?? undefined,
    standCode: d.standNumber ?? undefined,
  };
};

export const flightApi = {
  getSaphireHubFlights: async (): Promise<Flight[]> => {
    const response = await axiosClient.get('/flights');
    return response.data.map(normalizeFlight);
  },

  getSaphireHubFlightsPaged: async (
    page: number,
    size: number = 10,
    query?: string
  ): Promise<PagedResponse<Flight>> => {
    const response = await axiosClient.get('/flights/paged', {
      params: { page, size, query: query || undefined },
    });
    return { ...response.data, content: response.data.content.map(normalizeFlight) };
  },

  getFlightById: async (id: number): Promise<Flight> => {
    const response = await axiosClient.get(`/flights/${id}`);
    return normalizeFlight(response.data);
  },

  createFlight: async (payload: FlightCreatePayload): Promise<Flight> => {
    const response = await axiosClient.post('/flights', payload);
    return normalizeFlight(response.data);
  },

  updateFlightStatus: async (id: number, status: string): Promise<Flight> => {
    const response = await axiosClient.put(`/flights/${id}/status`, { status });
    return normalizeFlight(response.data);
  },
};
