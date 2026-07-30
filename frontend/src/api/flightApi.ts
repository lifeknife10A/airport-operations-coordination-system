import axiosClient from './axiosClient';
import { Flight, FlightCreatePayload } from '../types';

export const flightApi = {
  getSaphireHubFlights: async (): Promise<Flight[]> => {
    const response = await axiosClient.get<Flight[]>('/flights');
    return response.data;
  },

  getFlightById: async (id: number): Promise<Flight> => {
    const response = await axiosClient.get<Flight>(`/flights/${id}`);
    return response.data;
  },

  createFlight: async (payload: FlightCreatePayload): Promise<Flight> => {
    const response = await axiosClient.post<Flight>('/flights', payload);
    return response.data;
  },

  updateFlightStatus: async (id: number, status: string): Promise<Flight> => {
    const response = await axiosClient.put<Flight>(`/flights/${id}/status`, { status });
    return response.data;
  },
};
