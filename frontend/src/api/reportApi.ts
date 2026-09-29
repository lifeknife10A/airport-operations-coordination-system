import axiosClient from './axiosClient';
import { ReportSummary } from '../types';

export const reportApi = {
  getSummary: async (): Promise<ReportSummary> => {
    const response = await axiosClient.get<ReportSummary>('/reports/summary');
    return response.data;
  },

  downloadFlightsCsv: async () => {
    const response = await axiosClient.get('/reports/export/flights-csv', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'saphire-flights-export.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  downloadGatesReport: async () => {
    const response = await axiosClient.get('/reports/export/gates-pdf', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'saphire-gates-report.txt');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  downloadBillingExcel: async () => {
    const response = await axiosClient.get('/reports/export/billing-excel', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'saphire-billing-invoices.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};

export default reportApi;
