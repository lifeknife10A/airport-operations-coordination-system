import axiosClient from './axiosClient';

export interface CheckinLookupData {
  passengerId: number;
  pnrCode: string;
  travelerId: number;
  travelerName: string;
  passportNumber: string;
  nationality: string;
  isTransitPassenger: boolean;
  flightId: number;
  flightNumber: string;
  airlineName: string;
  originIata: string;
  destinationIata: string;
  departureGate: string;
  stand: string;
  scheduledDeparture: string;
  flightStatus: string;
  isCheckedIn: boolean;
  seatNumber?: string;
  cabinClass?: string;
  boardingGroup?: string;
  sequenceNumber?: number;
  ticketNumber?: string;
  barcodeData?: string;
  baggageTags?: Array<{
    bagTagId: number;
    tagNumber: string;
    weightKg: number;
    status: string;
  }>;
}

export interface CheckinManifestEntry {
  passengerId: number;
  pnr: string;
  name: string;
  nationality: string;
  boardingPassId?: number;
  seat?: string;
  cabinClass?: string;
  boardingGroup?: string;
  ticketNumber?: string;
  barcodeData?: string;
  bags: number;
  bagWeightKg: number;
}

export interface BagTagResult {
  bagTagId: number;
  tagNumber: string;
  weightKg: number;
  status: string;
  passengerId: number;
  flightId: number;
}

export interface SeatMapData {
  flightId: number;
  flightNumber: string;
  aircraftModel: string;
  totalCapacity: number;
  occupiedSeatsCount: number;
  availableSeatsCount: number;
  occupiedSeats: string[];
  cabinTiers: string[];
}

export interface IssueBoardingPassRequest {
  passengerId: number;
  seatNumber: string;
  cabinClass?: string;
  frequentFlyerNumber?: string;
}

export interface BoardingPassResponse {
  boardingPassId: number;
  barcodeData: string;
  ticketNumber: string;
  seatNumber: string;
  cabinClass: string;
  boardingGroup: string;
  sequenceNumber: number;
  frequentFlyerNumber?: string;
  passengerId: number;
  passengerName: string;
  pnrCode: string;
  flightId: number;
  flightNumber: string;
  originIata: string;
  destinationIata: string;
  departureGate: string;
  boardingTime: string;
  scheduledDeparture: string;
}

export interface TagBaggageRequest {
  passengerId: number;
  flightId: number;
  weightKg: number;
  scannerLocation?: string;
}

export interface CheckinCounterData {
  counterId: number;
  counterNumber: string;
  terminal: string;
  concourse: string;
  allocatedAirlineId?: number;
  allocatedAirlineName?: string;
  allocatedAirlineIata?: string;
  status: string;
}

export const checkinApi = {
  lookupPassenger: async (query: string): Promise<CheckinLookupData> => {
    const response = await axiosClient.get<CheckinLookupData>(`/checkin/lookup?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  getManifest: async (flightId: number): Promise<CheckinManifestEntry[]> => {
    const response = await axiosClient.get<CheckinManifestEntry[]>(`/checkin/flights/${flightId}/manifest`);
    return response.data;
  },

  getSeatMap: async (flightId: number): Promise<SeatMapData> => {
    const response = await axiosClient.get<SeatMapData>(`/checkin/flights/${flightId}/seatmap`);
    return response.data;
  },

  issueBoardingPass: async (payload: IssueBoardingPassRequest): Promise<BoardingPassResponse> => {
    const response = await axiosClient.post<BoardingPassResponse>('/checkin/issue-boarding-pass', payload);
    return response.data;
  },

  tagBaggage: async (payload: TagBaggageRequest): Promise<BagTagResult> => {
    const response = await axiosClient.post<BagTagResult>('/checkin/tag-baggage', payload);
    return response.data;
  },

  getCounters: async (): Promise<CheckinCounterData[]> => {
    const response = await axiosClient.get<CheckinCounterData[]>('/checkin/counters');
    return response.data;
  },
};

export default checkinApi;
