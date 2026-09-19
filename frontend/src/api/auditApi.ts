import axiosClient from './axiosClient';
import { AuditLog } from '../types';

export const auditApi = {
  getAuditLogs: async (): Promise<AuditLog[]> => {
    const response = await axiosClient.get<AuditLog[]>('/audit/logs');
    return response.data;
  },

  logAction: async (payload: {
    userId: number;
    action: string;
    changePayload: string;
  }): Promise<AuditLog> => {
    const response = await axiosClient.post<AuditLog>('/audit/log-action', payload);
    return response.data;
  },
};

export default auditApi;
