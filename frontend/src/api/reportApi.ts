import axiosClient from './axiosClient';
import { ReportSummary } from '../types';

export const reportApi = {
  getSummary: async (): Promise<ReportSummary> => {
    const response = await axiosClient.get<ReportSummary>('/reports/summary');
    return response.data;
  },
};
