import axiosClient from './axiosClient';
import { BagTag, BaggageScanEvent, MishandledBaggage } from '../types';

export const baggageApi = {
  trackBag: async (tagNumber: string): Promise<{ bagTag: BagTag; scanEvents: BaggageScanEvent[] }> => {
    const response = await axiosClient.get<{ bagTag: BagTag; scanEvents: BaggageScanEvent[] }>(
      `/baggage/track/${encodeURIComponent(tagNumber)}`
    );
    return response.data;
  },

  recordScan: async (tagNumber: string, location: string): Promise<BaggageScanEvent> => {
    const response = await axiosClient.post<BaggageScanEvent>('/baggage/scan', {
      tagNumber,
      location,
    });
    return response.data;
  },

  reportMishandled: async (payload: {
    claimNumber: string;
    incidentType: string;
    tagNumber: string;
    passengerId: number;
  }): Promise<MishandledBaggage> => {
    const response = await axiosClient.post<MishandledBaggage>('/baggage/mishandled', payload);
    return response.data;
  },

  getMishandledReports: async (): Promise<MishandledBaggage[]> => {
    const response = await axiosClient.get<MishandledBaggage[]>('/baggage/mishandled');
    return response.data;
  },
};

export default baggageApi;
