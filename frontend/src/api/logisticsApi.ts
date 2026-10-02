import axiosClient from './axiosClient';

export interface CargoItem {
  cargoId: number;
  containerId: string;
  weightKg: number;
  cargoType: 'CARGO' | 'MAIL' | 'BAGGAGE';
  flightId: number;
  flightNumber: string;
  airline: string;
}

export interface CargoTypeTotal {
  cargoType: string;
  containers: number;
  totalKg: number;
}

export interface Carousel {
  carouselId: number;
  carouselNumber: string;
  terminal: string;
  flightId?: number;
  flightNumber?: string;
  airline?: string;
  origin?: string;
  flightType?: string;
  flightStatus?: string;
}

export interface FuelEntry {
  fuelLogId: number;
  fuelDensity: number;
  taskId: number;
  taskName: string;
  taskStatus: string;
  flightId: number;
  flightNumber: string;
  stand?: string;
}

export interface EquipmentTotal {
  equipmentType: string;
  available: number;
  inUse: number;
  maintenance: number;
}

export interface PageOf<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const logisticsApi = {
  getCargo: async (q = '', page = 0, size = 20): Promise<PageOf<CargoItem>> =>
    (await axiosClient.get('/logistics/cargo', { params: { q: q || undefined, page, size } })).data,

  getCargoTotals: async (): Promise<CargoTypeTotal[]> => (await axiosClient.get('/logistics/cargo/totals')).data,

  getCarousels: async (): Promise<Carousel[]> => (await axiosClient.get('/logistics/carousels')).data,

  // flightId null clears the carousel
  assignCarousel: async (carouselId: number, flightId: number | null): Promise<Carousel> =>
    (await axiosClient.put(`/logistics/carousels/${carouselId}/flight`, { flightId })).data,

  getFuel: async (page = 0, size = 20): Promise<PageOf<FuelEntry>> =>
    (await axiosClient.get('/logistics/fuel', { params: { page, size } })).data,

  getEquipment: async (): Promise<EquipmentTotal[]> => (await axiosClient.get('/logistics/equipment')).data,
};
