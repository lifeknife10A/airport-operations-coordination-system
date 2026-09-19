export interface User {
  userId: number;
  username: string;
  name: string;
  fullName?: string;
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

// BAGGAGE & LOGISTICS
export interface BagTag {
  tagId: number;
  tagNumber: string;
  flightId: number;
  flightNumber: string;
  passengerId: number;
  passengerName: string;
  weightKg: number;
  isPriority: boolean;
  status: 'CHECKED_IN' | 'SCREENED' | 'LOADED' | 'TRANSIT' | 'ARRIVED' | 'CLAIMED';
}

export interface BaggageScanEvent {
  eventId: number;
  tagNumber: string;
  location: string;
  scannerId: string;
  timestamp: string;
  scanType: 'SECURITY_SCREEN' | 'RAMP_LOAD' | 'TRANSFER' | 'CAROUSEL_UNLOAD';
}

export interface MishandledBaggage {
  reportId: number;
  claimNumber: string;
  incidentType: 'LOST' | 'DAMAGED' | 'DELAYED' | 'PILFERED';
  tagNumber: string;
  passengerId: number;
  passengerName: string;
  status: 'REPORTED' | 'INVESTIGATING' | 'LOCATED' | 'DELIVERED' | 'COMPENSATED';
  reportedAt: string;
  lastKnownLocation: string;
}

// BILLING & INVOICES
export interface AirlineBillingInvoice {
  invoiceId: number;
  invoiceNumber: string;
  airlineId: number;
  airlineName: string;
  startDate: string;
  endDate: string;
  totalAmountUsd: number;
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'DISPUTED';
  generatedAt: string;
}

export interface InvoiceLineItem {
  itemId: number;
  invoiceId: number;
  flightNumber: string;
  chargeType: 'LANDING_FEE' | 'PARKING_STAND' | 'JETBRIDGE' | 'BAGGAGE_HANDLING' | 'FUEL_HYDRANT';
  amountUsd: number;
  units: number;
  ratePerUnit: number;
}

// BORDER CONTROL & TRAVELERS
export interface Traveler {
  travelerId: number;
  passportNumber: string;
  nationality: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  watchlistStatus: 'CLEAR' | 'FLAGGED' | 'WATCHLIST_HIT';
}

export interface PassengerClearanceLog {
  clearanceId: number;
  passengerId: number;
  clearanceStatus: 'CLEARED' | 'FLAGGED' | 'DENIED' | 'BOARDED';
  denialReason?: string;
  verificationMethod: 'BIOMETRIC_EGATE' | 'BARCODE_SCAN' | 'OFFICER_MANUAL';
  boardingPassId: number;
  checkpointId: number;
  timestamp: string;
}

export interface ImmigrationRecord {
  immigrationId: number;
  passengerId: number;
  visaType: string;
  stampNumber: string;
  biometricFacialMatched: boolean;
  clearanceType: 'ENTRY' | 'EXIT' | 'TRANSIT';
  processedAt: string;
}

// FEATURE MODULES & UTILITIES
export interface GpuTelemetryLog {
  logId: number;
  flightNumber: string;
  standCode: string;
  gpuUnitCode: string;
  kwhDelivered: number;
  durationMinutes: number;
  loggedAt: string;
}

export interface IncidentTicket {
  ticketId: string;
  title: string;
  location: string;
  flightNumber?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'INVESTIGATING' | 'ESCALATED' | 'RESOLVED';
  reportedAt: string;
  assignedOfficer?: string;
  description: string;
}

export interface CheckinCounterAllocation {
  allocationId: number;
  counterNumber: string;
  terminal: string;
  airlineCode: string;
  flightNumber: string;
  classCategory: 'ALL_PASSENGERS' | 'BUSINESS_FIRST' | 'BAGGAGE_DROP';
  startTime: string;
  endTime: string;
  allocatedAt: string;
}

export interface HandoverNote {
  noteId: number;
  department: string;
  author: string;
  priority: 'ROUTINE' | 'URGENT' | 'SAFETY_CRITICAL';
  title: string;
  content: string;
  postedAt: string;
}

// PUBLIC BRIDGE & LOUNGES
export interface LostFoundRecord {
  id: string;
  title: string;
  itemName?: string;
  category: 'ELECTRONICS' | 'BAGGAGE' | 'DOCUMENTS' | 'VALUABLES' | 'CLOTHING';
  locationFound: string;
  reportedBy: string;
  contactName?: string;
  contactNumber: string;
  contactEmail?: string;
  linkedPnr?: string;
  flightNumber?: string;
  status: 'NEW_REPORT' | 'SEARCHING' | 'MATCHED' | 'READY_FOR_COLLECTION' | 'RETURNED';
  reportedDate: string;
  description: string;
  color: string;
  storageLocker: string;
}

export interface LoungeFacility {
  id: string;
  name: string;
  terminal: string;
  capacity: number;
  currentGuests: number;
  status: 'NORMAL' | 'BUSY' | 'NEAR_CAPACITY';
  eligibleClasses: string[];
}
