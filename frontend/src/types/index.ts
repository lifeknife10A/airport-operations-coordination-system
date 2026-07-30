export interface User {
  userId: number;
  username: string;
  name: string;
  roleId: number;
  roleName: string;
  departmentId: number;
  departmentName: string;
  token?: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  username: string;
  name: string;
  roleId: number;
  roleName: string;
  departmentId: number;
  departmentName: string;
}

export interface Flight {
  flightId: number;
  flightNumber: string;
  airlineCode: string;
  airlineName: string;
  flightType: 'ARRIVAL' | 'DEPARTURE';
  originAirportCode: string;
  originAirportName: string;
  destinationAirportCode: string;
  destinationAirportName: string;
  aircraftRegistration: string;
  aircraftType: string;
  scheduledTime: string;
  estimatedTime?: string;
  actualTime?: string;
  status: 'SCHEDULED' | 'LANDED' | 'ON_BLOCK' | 'SERVICING' | 'READY' | 'BOARDING' | 'AIRBORNE' | 'DEPARTED' | 'DELAYED';
  gateCode?: string;
  standCode?: string;
}

export interface FlightCreatePayload {
  flightNumber: string;
  airlineCode: string;
  airlineName: string;
  flightType: 'ARRIVAL' | 'DEPARTURE';
  originAirportId: number;
  destinationAirportId: number;
  aircraftRegistration: string;
  aircraftType: string;
  scheduledTime: string;
}

export interface TurnaroundTask {
  taskId: number;
  flightId: number;
  flightNumber: string;
  taskType: string; // CLEANING, REFUELING, MAINTENANCE, CATERING, BOARDING, SECURITY
  taskName: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  assignedUserId?: number;
  assignedUserName?: string;
  departmentName?: string;
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  notes?: string;
}

export interface TaskCreatePayload {
  flightId: number;
  taskType: string;
  taskName: string;
  assignedUserId?: number;
  plannedStart: string;
  plannedEnd: string;
}

export interface Gate {
  gateId: number;
  gateCode: string;
  terminalName: string;
  hasJetbridge: boolean;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  assignedFlightId?: number;
  assignedFlightNumber?: string;
  stands?: Stand[];
}

export interface Stand {
  standId: number;
  standCode: string;
  isRemote: boolean;
  maxAircraftSize: string;
  status: 'AVAILABLE' | 'OCCUPIED';
}

export interface GateAssignmentPayload {
  flightId: number;
  gateId: number;
  standId?: number;
}

export interface ReportSummary {
  totalFlightsToday: number;
  activeHubFlights: number;
  landedCount: number;
  delayedCount: number;
  onTimeDepartureRate: number;
  pendingTasksCount: number;
  activeGateOccupancyRate: number;
}

export interface DelayLog {
  delayId: number;
  flightId: number;
  flightNumber: string;
  delayCode: string;
  delayCategory: string;
  durationMinutes: number;
  remarks: string;
  loggedAt: string;
}

export interface Passenger {
  passengerId: number;
  pnr: string;
  firstName: string;
  lastName: string;
  passportNumber: string; // Automated masking applied XXXX-XXXX-1234
  seatNumber: string;
  cabinClass: 'ECONOMY' | 'BUSINESS' | 'FIRST';
  isBoarded: boolean;
  isTransit: boolean;
}

export interface AuditLog {
  auditId: number;
  action: string;
  entityType: string;
  entityId: number;
  performedByUserId: number;
  performedByUserName: string;
  timestamp: string;
  ipAddress: string;
  changePayload: string;
}
