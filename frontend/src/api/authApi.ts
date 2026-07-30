import axiosClient from './axiosClient';
import { LoginResponse } from '../types';

export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>('/auth/login', { username, password });
    return response.data;
  },
};
