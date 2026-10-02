import axiosClient from './axiosClient';
import { PagedResponse } from '../types';

// Matches the backend's AuditLogDTO.
export interface AuditEntryDto {
  logId: number;
  action: string;
  entityType?: string | null;
  entityId?: number | null;
  changePayload?: string | null;
  userId?: number | null;
  username?: string | null;
  createdAt?: string | null;
}

export const auditApi = {
  // Newest first; administrator-only.
  getAuditLogs: async (page = 0, size = 100): Promise<PagedResponse<AuditEntryDto>> => {
    const response = await axiosClient.get<PagedResponse<AuditEntryDto>>('/audit/logs', { params: { page, size } });
    return response.data;
  },

  // Recorded against whoever is signed in; the server ignores any client-supplied user id.
  logAction: async (payload: { action: string; changePayload?: string }): Promise<AuditEntryDto> => {
    const response = await axiosClient.post<AuditEntryDto>('/audit/log-action', payload);
    return response.data;
  },
};

export default auditApi;
