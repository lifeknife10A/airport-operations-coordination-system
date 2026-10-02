import axiosClient from './axiosClient';

export type ClearanceStatus = 'APPROVED' | 'FLAGGED_SECURITY' | 'DENIED' | 'BOARDED';
export type VerificationMethod = 'BARCODE_SCANNER' | 'BIOMETRIC_FACIAL' | 'PASSPORT_CHIP_READER';
export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'INVESTIGATING' | 'ESCALATED' | 'RESOLVED';

export interface GateFlight {
  flightId: number;
  flightNumber: string;
  airline: string;
  destination: string;
  gate?: string;
  terminal?: string;
  scheduledDeparture?: string;
  flightStatus: string;
  booked: number;
  boardingPasses: number;
  approved: number;
  boarded: number;
  flagged: number;
  denied: number;
  tasksTotal: number;
  tasksCompleted: number;
  tasksBlocked: number;
}

export interface ManifestEntry {
  passengerId: number;
  pnr: string;
  name: string;
  passportLast4: string;
  nationality: string;
  boardingPassId?: number;
  seat?: string;
  cabinClass?: string;
  boardingGroup?: string;
  clearanceStatus?: ClearanceStatus;
  verificationMethod?: VerificationMethod;
  scannedAt?: string;
  denialReason?: string;
}

export interface ClearanceEntry {
  clearanceId: number;
  scannedAt: string;
  passenger: string;
  pnr: string;
  flightNumber: string;
  clearanceStatus: ClearanceStatus;
  verificationMethod: VerificationMethod;
  checkpoint: string;
  denialReason?: string;
}

export interface Checkpoint {
  checkpointId: number;
  name: string;
  type: string;
  terminal: string;
}

export interface Incident {
  incidentId: number;
  title: string;
  location: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description?: string;
  flightNumber?: string;
  reportedBy?: string;
  reportedAt: string;
  resolvedAt?: string;
}

export interface Lounge {
  name: string;
  visits: number;
  distinctPassengers: number;
}

export interface LoungeVisit {
  visitId: number;
  lounge: string;
  passenger: string;
  pnr: string;
  flightNumber: string;
}

export interface Paged<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const securityOpsApi = {
  getGateFlights: async (limit = 12): Promise<GateFlight[]> =>
    (await axiosClient.get('/security-ops/gate-flights', { params: { limit } })).data,

  getManifest: async (flightId: number): Promise<ManifestEntry[]> =>
    (await axiosClient.get(`/security-ops/flights/${flightId}/manifest`)).data,

  getCheckpoints: async (): Promise<Checkpoint[]> => (await axiosClient.get('/security-ops/checkpoints')).data,

  getClearanceLog: async (status = '', page = 0, size = 25): Promise<Paged<ClearanceEntry>> =>
    (await axiosClient.get('/security-ops/clearance-log', { params: { status: status || undefined, page, size } })).data,

  logClearance: async (payload: {
    passengerId: number;
    clearanceStatus: ClearanceStatus;
    verificationMethod: VerificationMethod;
    checkpointId: number;
    denialReason?: string;
  }): Promise<ClearanceEntry> => (await axiosClient.post('/security-ops/clearance', payload)).data,

  getIncidents: async (status = '', page = 0, size = 25): Promise<Paged<Incident>> =>
    (await axiosClient.get('/security-ops/incidents', { params: { status: status || undefined, page, size } })).data,

  createIncident: async (payload: { title: string; location: string; severity: IncidentSeverity; description?: string; flightId?: number }): Promise<Incident> =>
    (await axiosClient.post('/security-ops/incidents', payload)).data,

  updateIncidentStatus: async (id: number, status: IncidentStatus): Promise<Incident> =>
    (await axiosClient.put(`/security-ops/incidents/${id}/status`, { status })).data,

  getLounges: async (): Promise<Lounge[]> => (await axiosClient.get('/security-ops/lounges')).data,

  getLoungeVisits: async (page = 0, size = 15): Promise<Paged<LoungeVisit>> =>
    (await axiosClient.get('/security-ops/lounge-visits', { params: { page, size } })).data,

  logLoungeVisit: async (loungeName: string, passengerId: number): Promise<LoungeVisit> =>
    (await axiosClient.post('/security-ops/lounge-visits', { loungeName, passengerId })).data,
};
