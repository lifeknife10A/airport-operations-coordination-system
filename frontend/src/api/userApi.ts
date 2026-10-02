import axiosClient from './axiosClient';

// Matches the backend's UserResponseDTO (administrator-only endpoints).
export interface StaffUserDto {
  userId: number;
  username: string;
  email?: string;
  name: string;
  role: string;
  department: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface CreateUserPayload {
  name: string;
  email: string;
  roleName: string;
  departmentName: string;
}

export const userApi = {
  getAll: async (): Promise<StaffUserDto[]> => {
    const response = await axiosClient.get<StaffUserDto[]>('/users');
    return response.data;
  },

  setStatus: async (userId: number, status: 'ACTIVE' | 'SUSPENDED'): Promise<StaffUserDto> => {
    const response = await axiosClient.put<StaffUserDto>(`/users/${userId}/status`, { status });
    return response.data;
  },

  // The server generates a one-time temporary password and returns it in this response only.
  create: async (payload: CreateUserPayload): Promise<{ user: StaffUserDto; temporaryPassword: string }> => {
    const response = await axiosClient.post<{ user: StaffUserDto; temporaryPassword: string }>('/users', payload);
    return response.data;
  },
};

export default userApi;
