import axiosClient from './axiosClient';
import { TurnaroundTask, TaskCreatePayload } from '../types';

export const taskApi = {
  getTasksByFlight: async (flightId: number): Promise<TurnaroundTask[]> => {
    const response = await axiosClient.get<TurnaroundTask[]>(`/tasks/flight/${flightId}`);
    return response.data;
  },

  updateTaskStatus: async (
    taskId: number,
    status: string,
    userId?: number,
    notes?: string
  ): Promise<TurnaroundTask> => {
    const response = await axiosClient.put<TurnaroundTask>(`/tasks/${taskId}/status`, {
      status,
      userId,
      notes,
    });
    return response.data;
  },

  assignTaskUser: async (taskId: number, userId: number): Promise<TurnaroundTask> => {
    const response = await axiosClient.put<TurnaroundTask>(`/tasks/${taskId}/assign`, { userId });
    return response.data;
  },

  createTask: async (payload: TaskCreatePayload): Promise<TurnaroundTask> => {
    const response = await axiosClient.post<TurnaroundTask>('/tasks', payload);
    return response.data;
  },
};
