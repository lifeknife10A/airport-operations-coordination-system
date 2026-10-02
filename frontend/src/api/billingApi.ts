import axiosClient from './axiosClient';

// Matches the backend's AirlineBillingInvoice / InvoiceLineItem JSON (billing-clerk and
// administrator only).
export interface InvoiceDto {
  invoiceId: number;
  invoiceNumber: string;
  airline: { airlineId: number; iataCode: string; airlineName: string; country?: string };
  billingPeriodStart: string;
  billingPeriodEnd: string;
  totalAmountUsd: number;
  paymentStatus: 'UNPAID' | 'PAID' | 'OVERDUE';
}

export interface InvoiceLineItemDto {
  lineItemId: number;
  chargeType: string;
  amountUsd: number;
  flight?: { flightNumber?: string } | null;
}

export interface GenerateInvoicePayload {
  airlineId: number;
  startDate: string;
  endDate: string;
  totalAmountUsd: number;
  invoiceNumber: string;
}

export const billingApi = {
  getAllInvoices: async (): Promise<InvoiceDto[]> => {
    const response = await axiosClient.get<InvoiceDto[]>('/billing/invoices');
    return response.data;
  },

  getInvoiceDetails: async (invoiceId: number): Promise<{ invoice: InvoiceDto; lineItems: InvoiceLineItemDto[] }> => {
    const response = await axiosClient.get<{ invoice: InvoiceDto; lineItems: InvoiceLineItemDto[] }>(`/billing/invoices/${invoiceId}`);
    return response.data;
  },

  generateInvoice: async (payload: GenerateInvoicePayload): Promise<InvoiceDto> => {
    const response = await axiosClient.post<InvoiceDto>('/billing/generate-invoice', payload);
    return response.data;
  },
};

export default billingApi;
