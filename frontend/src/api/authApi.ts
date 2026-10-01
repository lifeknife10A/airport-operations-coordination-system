import axiosClient from './axiosClient';
import { LoginResponse } from '../types';

export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>('/auth/login', { username, password });
    return response.data;
  },

  // Server's view of who is signed in (role read from the database).
  me: async (): Promise<Omit<LoginResponse, 'token'>> => {
    const response = await axiosClient.get<Omit<LoginResponse, 'token'>>('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosClient.post('/auth/logout');
  },
};
