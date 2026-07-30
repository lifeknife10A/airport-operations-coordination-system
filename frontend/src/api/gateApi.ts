import axiosClient from './axiosClient';
import { Gate, GateAssignmentPayload } from '../types';

export const gateApi = {
  getAllGates: async (): Promise<Gate[]> => {
    const response = await axiosClient.get<Gate[]>('/gates');
    return response.data;
  },

  assignGateToFlight: async (payload: GateAssignmentPayload): Promise<Gate> => {
    const response = await axiosClient.put<Gate>('/gates/assign', payload);
    return response.data;
  },
};
