import axiosClient from './axiosClient';

export interface LostFoundItemData {
  itemId: number;
  referenceCode: string;
  itemName: string;
  category: string;
  colorAndDescription: string;
  foundLocationType: string;
  foundLocationDetail: string;
  terminalId: number;
  flightId?: number;
  flightNumber?: string;
  storageVaultLocation: string;
  status: string;
  finderType: string;
  loggedByUserId: number;
  loggedByUserName?: string;
  createdAt: string;
  updatedAt: string;
  claimantName?: string;
  claimantContactEmail?: string;
  claimantContactPhone?: string;
  claimVerificationNotes?: string;
  claimedTimestamp?: string;
}

export const lostFoundApi = {
  getAll: async (params?: { status?: string; category?: string; search?: string; page?: number; size?: number }) => {
    // The backend's search parameter is called `query`.
    const { search, ...rest } = params ?? {};
    const response = await axiosClient.get('/lost-found', { params: { ...rest, query: search || undefined } });
    return response.data;
  },

  getByReferenceCode: async (referenceCode: string): Promise<LostFoundItemData> => {
    const response = await axiosClient.get<LostFoundItemData>(`/lost-found/${encodeURIComponent(referenceCode)}`);
    return response.data;
  },

  // terminalId is required by the backend; loggedByUserId is ignored there (taken from the login).
  reportFound: async (payload: Partial<LostFoundItemData>): Promise<LostFoundItemData> => {
    const response = await axiosClient.post<LostFoundItemData>('/lost-found', payload);
    return response.data;
  },

  updateStatus: async (id: number, status: string, storageVaultLocation?: string): Promise<LostFoundItemData> => {
    const response = await axiosClient.put<LostFoundItemData>(`/lost-found/${id}/status`, { status, storageVaultLocation });
    return response.data;
  },

  submitClaim: async (id: number, payload: {
    claimantName: string;
    claimantContactEmail: string;
    claimantContactPhone?: string;
    claimVerificationNotes: string;
  }): Promise<LostFoundItemData> => {
    const response = await axiosClient.post<LostFoundItemData>(`/lost-found/${id}/claim`, payload);
    return response.data;
  },
};

export default lostFoundApi;
