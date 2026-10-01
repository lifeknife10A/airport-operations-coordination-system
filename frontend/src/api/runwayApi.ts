import axiosClient from './axiosClient';

export interface RunwayTelemetryData {
  runwayId: number;
  runwayCode: string;
  operationalStatus: string;
  surfaceFriction: number;
  activeIlsFrequency: string;
  visualRangeMeters: number;
  activeDeparturesCount: number;
  activeArrivalsCount: number;
  crosswindVector: string;
  headwindVector: string;
  weatherCondition: string;
}

export const runwayApi = {
  getAll: async (): Promise<RunwayTelemetryData[]> => {
    const response = await axiosClient.get<RunwayTelemetryData[]>('/airside/runways');
    return response.data;
  },

  getById: async (id: number): Promise<RunwayTelemetryData> => {
    const response = await axiosClient.get<RunwayTelemetryData>(`/airside/runways/${id}`);
    return response.data;
  },

  updateStatus: async (id: number, payload: {
    operationalStatus?: string;
    surfaceFriction?: number;
    visualRangeMeters?: number;
  }): Promise<RunwayTelemetryData> => {
    const response = await axiosClient.put<RunwayTelemetryData>(`/airside/runways/${id}/status`, payload);
    return response.data;
  },
};

export default runwayApi;
