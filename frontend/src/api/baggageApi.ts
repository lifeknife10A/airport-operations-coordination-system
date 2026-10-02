import axiosClient from './axiosClient';
import { PagedResponse } from '../types';

// Matches the backend's BagTrackingDTO / MishandledReportDTO (no passport or contact details).
export interface BagScanDto {
  scanId: number;
  location: string;
  timestamp: string;
}

export interface BagTrackingDto {
  tagNumber: string;
  status: string;
  weightKg?: number;
  passengerName?: string;
  flightNumber?: string;
  scanEvents: BagScanDto[];
}

export interface MishandledReportDto {
  reportId: number;
  claimNumber: string;
  incidentType: 'LOST' | 'DAMAGED' | 'DELAYED' | 'PILFERED';
  status: string;
  tagNumber?: string;
  passengerName?: string;
  flightNumber?: string;
}

export const baggageApi = {
  trackBag: async (tagNumber: string): Promise<BagTrackingDto> => {
    const response = await axiosClient.get<BagTrackingDto>(`/baggage/track/${encodeURIComponent(tagNumber)}`);
    return response.data;
  },

  recordScan: async (tagNumber: string, location: string): Promise<BagScanDto> => {
    const response = await axiosClient.post<BagScanDto>('/baggage/scan', { tagNumber, location });
    return response.data;
  },

  // Claim number and passenger are filled in by the server from the tag when omitted.
  reportMishandled: async (payload: { tagNumber: string; incidentType: string; claimNumber?: string }): Promise<MishandledReportDto> => {
    const response = await axiosClient.post<MishandledReportDto>('/baggage/mishandled', payload);
    return response.data;
  },

  getMishandledReports: async (page = 0, size = 25): Promise<PagedResponse<MishandledReportDto>> => {
    const response = await axiosClient.get<PagedResponse<MishandledReportDto>>('/baggage/mishandled', { params: { page, size } });
    return response.data;
  },
};

export default baggageApi;
