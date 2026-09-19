import axiosClient from './axiosClient';
import { Traveler, Passenger, PassengerClearanceLog, ImmigrationRecord } from '../types';

export const borderControlApi = {
  lookupPassport: async (
    passportNumber: string
  ): Promise<{ traveler: Traveler; flightSegments: Passenger[] }> => {
    const response = await axiosClient.get<{ traveler: Traveler; flightSegments: Passenger[] }>(
      `/border-control/passport/${encodeURIComponent(passportNumber)}`
    );
    return response.data;
  },

  logClearance: async (payload: {
    passengerId: number;
    clearanceStatus: string;
    denialReason?: string;
    verificationMethod: string;
    boardingPassId?: number;
    checkpointId?: number;
  }): Promise<PassengerClearanceLog> => {
    const response = await axiosClient.post<PassengerClearanceLog>('/border-control/clearance', payload);
    return response.data;
  },

  logImmigration: async (payload: {
    passengerId: number;
    visaType: string;
    stampNumber: string;
    biometricFacialMatched: boolean;
    clearanceType: string;
  }): Promise<ImmigrationRecord> => {
    const response = await axiosClient.post<ImmigrationRecord>('/border-control/immigration', payload);
    return response.data;
  },
};

export default borderControlApi;
