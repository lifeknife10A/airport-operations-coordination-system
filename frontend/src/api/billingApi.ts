import axiosClient from './axiosClient';
import { AirlineBillingInvoice, InvoiceLineItem } from '../types';

export const billingApi = {
  getAllInvoices: async (): Promise<AirlineBillingInvoice[]> => {
    const response = await axiosClient.get<AirlineBillingInvoice[]>('/billing/invoices');
    return response.data;
  },

  getInvoiceDetails: async (
    invoiceId: number
  ): Promise<{ invoice: AirlineBillingInvoice; lineItems: InvoiceLineItem[] }> => {
    const response = await axiosClient.get<{ invoice: AirlineBillingInvoice; lineItems: InvoiceLineItem[] }>(
      `/billing/invoices/${invoiceId}`
    );
    return response.data;
  },

  generateInvoice: async (payload: {
    airlineId: number;
    startDate: string;
    endDate: string;
    totalAmountUsd: number;
    invoiceNumber: string;
  }): Promise<AirlineBillingInvoice> => {
    const response = await axiosClient.post<AirlineBillingInvoice>('/billing/generate-invoice', payload);
    return response.data;
  },
};

export default billingApi;
