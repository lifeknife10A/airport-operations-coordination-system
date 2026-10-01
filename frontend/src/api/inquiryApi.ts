import axiosClient from './axiosClient';

export interface InquiryCreatePayload {
  fullName: string;
  emailAddress: string;
  phoneNumber?: string;
  category: string;
  inquiryDetails: string;
  priority?: string;
  sourceChannel?: string;
  linkedFlightId?: number;
  linkedTravelerId?: number;
}

export interface InquiryResponseData {
  inquiryId: number;
  ticketNumber: string;
  fullName: string;
  emailAddress: string;
  phoneNumber?: string;
  category: string;
  inquiryDetails: string;
  priority: string;
  status: string;
  sourceChannel: string;
  assignedDepartment?: string;
  assignedStaffUserId?: number;
  assignedStaffName?: string;
  linkedFlightId?: number;
  linkedFlightNumber?: string;
  linkedTravelerId?: number;
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const inquiryApi = {
  submitInquiry: async (payload: InquiryCreatePayload): Promise<InquiryResponseData> => {
    const response = await axiosClient.post<InquiryResponseData>('/inquiries', payload);
    return response.data;
  },

  getByTicketNumber: async (ticketNumber: string): Promise<InquiryResponseData> => {
    const response = await axiosClient.get<InquiryResponseData>(`/inquiries/ticket/${ticketNumber}`);
    return response.data;
  },

  searchInquiries: async (params?: {
    status?: string;
    category?: string;
    department?: string;
    search?: string;
    page?: number;
    size?: number;
  }) => {
    const response = await axiosClient.get('/inquiries', { params });
    return response.data;
  },

  updateStatus: async (id: number, payload: { status: string; resolutionNotes?: string; assignedStaffUserId?: number }) => {
    const response = await axiosClient.put(`/inquiries/${id}/status`, payload);
    return response.data;
  },
};

export default inquiryApi;
