import {
  Flight,
  Gate,
  TurnaroundTask,
  BagTag,
  BaggageScanEvent,
  MishandledBaggage,
  AirlineBillingInvoice,
  Traveler,
  PassengerClearanceLog,
  GpuTelemetryLog,
  IncidentTicket,
  CheckinCounterAllocation,
  HandoverNote,
  LostFoundRecord,
  LoungeFacility,
  AuditLog,
} from '../types';
import { flightApi } from '../api/flightApi';
import { gateApi } from '../api/gateApi';
import { taskApi } from '../api/taskApi';
import { baggageApi } from '../api/baggageApi';
import { billingApi } from '../api/billingApi';
import { borderControlApi } from '../api/borderControlApi';
import { auditApi } from '../api/auditApi';
import { featureModulesApi } from '../api/featureModulesApi';

export type AocsEventType =
  | 'FLIGHT_UPDATED'
  | 'GATE_ASSIGNED'
  | 'TASK_UPDATED'
  | 'PREREQUISITE_CHANGED'
  | 'BAGGAGE_SCANNED'
  | 'INCIDENT_LOGGED'
  | 'LOST_ITEM_REPORTED'
  | 'ADMIN_OVERRIDE'
  | 'INITIALIZED'
  | 'REFRESH';

export interface AocsEvent {
  type: AocsEventType;
  payload: any;
  timestamp: string;
  source: string;
}

// Default Seed State
const SEED_FLIGHTS: Flight[] = [
  {
    flightId: 101,
    flightNumber: 'AI-203',
    airlineCode: 'AI',
    airlineName: 'Air India',
    flightType: 'DEPARTURE',
    originAirportCode: 'DEL',
    originAirportName: 'Indira Gandhi International Airport',
    destinationAirportCode: 'LHR',
    destinationAirportName: 'London Heathrow Airport',
    aircraftRegistration: 'VT-EXG',
    aircraftType: 'Boeing 787-9 Dreamliner',
    scheduledTime: '14:45 UTC',
    estimatedTime: '14:45 UTC',
    status: 'BOARDING',
    gateCode: 'A12',
    standCode: 'G12',
  },
  {
    flightId: 102,
    flightNumber: '6E-521',
    airlineCode: '6E',
    airlineName: 'IndiGo',
    flightType: 'DEPARTURE',
    originAirportCode: 'BOM',
    originAirportName: 'Chhatrapati Shivaji Maharaj International',
    destinationAirportCode: 'SIN',
    destinationAirportName: 'Singapore Changi Airport',
    aircraftRegistration: 'VT-IMD',
    aircraftType: 'Airbus A321neo',
    scheduledTime: '15:20 UTC',
    estimatedTime: '15:20 UTC',
    status: 'SCHEDULED',
    gateCode: 'B04',
    standCode: 'G08',
  },
  {
    flightId: 103,
    flightNumber: 'UK-901',
    airlineCode: 'UK',
    airlineName: 'Vistara',
    flightType: 'DEPARTURE',
    originAirportCode: 'BLR',
    originAirportName: 'Kempegowda International Airport',
    destinationAirportCode: 'DXB',
    destinationAirportName: 'Dubai International Airport',
    aircraftRegistration: 'VT-TQA',
    aircraftType: 'Airbus A320neo',
    scheduledTime: '16:00 UTC',
    estimatedTime: '16:15 UTC',
    status: 'DELAYED',
    gateCode: 'C08',
    standCode: 'G04',
  },
  {
    flightId: 104,
    flightNumber: 'SPH-102',
    airlineCode: 'SPH',
    airlineName: 'Saphire Executive',
    flightType: 'DEPARTURE',
    originAirportCode: 'FRA',
    originAirportName: 'Frankfurt Airport',
    destinationAirportCode: 'JFK',
    destinationAirportName: 'John F. Kennedy International',
    aircraftRegistration: 'VT-SPH',
    aircraftType: 'Boeing 777-300ER',
    scheduledTime: '13:50 UTC',
    estimatedTime: '13:50 UTC',
    status: 'READY',
    gateCode: 'A02',
    standCode: 'G01',
  },
  {
    flightId: 105,
    flightNumber: 'SPH-240',
    airlineCode: 'SPH',
    airlineName: 'Saphire Airways',
    flightType: 'DEPARTURE',
    originAirportCode: 'SPH',
    originAirportName: 'Saphire International Airport',
    destinationAirportCode: 'DXB',
    destinationAirportName: 'Dubai International Airport',
    aircraftRegistration: 'A6-SPH',
    aircraftType: 'Airbus A350-900',
    scheduledTime: '17:30 UTC',
    estimatedTime: '17:30 UTC',
    status: 'BOARDING',
    gateCode: 'A04',
    standCode: 'G02',
  },
];

const SEED_GATES: Gate[] = [
  { gateId: 1, gateCode: 'A12', terminalName: 'Terminal 2', hasJetbridge: true, status: 'OCCUPIED', assignedFlightId: 101, assignedFlightNumber: 'AI-203' },
  { gateId: 2, gateCode: 'B04', terminalName: 'Terminal 1', hasJetbridge: true, status: 'OCCUPIED', assignedFlightId: 102, assignedFlightNumber: '6E-521' },
  { gateId: 3, gateCode: 'C08', terminalName: 'Terminal 2', hasJetbridge: true, status: 'OCCUPIED', assignedFlightId: 103, assignedFlightNumber: 'UK-901' },
  { gateId: 4, gateCode: 'A02', terminalName: 'Terminal 2', hasJetbridge: true, status: 'OCCUPIED', assignedFlightId: 104, assignedFlightNumber: 'SPH-102' },
  { gateId: 5, gateCode: 'A04', terminalName: 'Terminal 1', hasJetbridge: true, status: 'AVAILABLE' },
  { gateId: 6, gateCode: 'B12', terminalName: 'Terminal 2', hasJetbridge: true, status: 'AVAILABLE' },
  { gateId: 7, gateCode: 'C22', terminalName: 'Terminal 2', hasJetbridge: true, status: 'AVAILABLE' },
  { gateId: 8, gateCode: 'A15', terminalName: 'Terminal 1', hasJetbridge: false, status: 'MAINTENANCE' },
];

const SEED_TASKS: TurnaroundTask[] = [
  { taskId: 201, flightId: 101, flightNumber: 'AI-203', taskType: 'SECURITY', taskName: 'Cabin Security Sweep', status: 'COMPLETED', departmentName: 'TERMINAL_SECURITY', plannedStart: '13:30', plannedEnd: '13:50', actualStart: '13:30', actualEnd: '13:48', notes: 'K9 airside sweep clear' },
  { taskId: 202, flightId: 101, flightNumber: 'AI-203', taskType: 'CLEANING', taskName: 'Deep Cabin Disinfection', status: 'COMPLETED', departmentName: 'CLEANING_SERVICES', plannedStart: '13:40', plannedEnd: '14:10', actualStart: '13:42', actualEnd: '14:05', notes: 'First and Business class sanitized' },
  { taskId: 203, flightId: 101, flightNumber: 'AI-203', taskType: 'REFUELING', taskName: 'Jet A-1 Fuel Hydrant Delivery', status: 'COMPLETED', departmentName: 'FUEL_OPERATIONS', plannedStart: '13:50', plannedEnd: '14:25', actualStart: '13:50', actualEnd: '14:22', notes: '9,950 Liters delivered via Bowser HYD-04' },
  { taskId: 204, flightId: 101, flightNumber: 'AI-203', taskType: 'MAINTENANCE', taskName: 'Avionics Pre-Flight Release', status: 'COMPLETED', departmentName: 'LINE_MAINTENANCE', plannedStart: '13:30', plannedEnd: '14:15', actualStart: '13:35', actualEnd: '14:12', notes: 'Engine oil levels and APU nominal' },
  { taskId: 205, flightId: 101, flightNumber: 'AI-203', taskType: 'BOARDING', taskName: 'Passenger Gate Embarkation', status: 'IN_PROGRESS', departmentName: 'TERMINAL_MANAGEMENT', plannedStart: '14:10', plannedEnd: '14:40', actualStart: '14:10', notes: '142 / 160 passengers boarded' },
  // 6E-521 Tasks (Security pending)
  { taskId: 206, flightId: 102, flightNumber: '6E-521', taskType: 'SECURITY', taskName: 'Canine Explosive Sweep', status: 'IN_PROGRESS', departmentName: 'TERMINAL_SECURITY', plannedStart: '14:20', plannedEnd: '14:45', notes: 'Stand B04 security perimeter inspection' },
  { taskId: 207, flightId: 102, flightNumber: '6E-521', taskType: 'CLEANING', taskName: 'Cabin Turnaround Tidy', status: 'COMPLETED', departmentName: 'CLEANING_SERVICES', plannedStart: '14:15', plannedEnd: '14:35', actualStart: '14:15', actualEnd: '14:32' },
  { taskId: 208, flightId: 102, flightNumber: '6E-521', taskType: 'REFUELING', taskName: 'Fuel Bowser Dispense', status: 'COMPLETED', departmentName: 'FUEL_OPERATIONS', plannedStart: '14:25', plannedEnd: '14:50', actualStart: '14:25', actualEnd: '14:48' },
  { taskId: 209, flightId: 102, flightNumber: '6E-521', taskType: 'MAINTENANCE', taskName: 'Tire Pressure & Hydraulics Check', status: 'COMPLETED', departmentName: 'LINE_MAINTENANCE', plannedStart: '14:10', plannedEnd: '14:40', actualStart: '14:10', actualEnd: '14:35' },
];

const SEED_BAGS: BagTag[] = [
  { tagId: 1, tagNumber: 'BAG-AI203-8821', flightId: 101, flightNumber: 'AI-203', passengerId: 1, passengerName: 'Lord Harrison Sterling', weightKg: 28.5, isPriority: true, status: 'LOADED' },
  { tagId: 2, tagNumber: 'BAG-AI203-8822', flightId: 101, flightNumber: 'AI-203', passengerId: 2, passengerName: 'Dr. Evelyn Morales', weightKg: 22.0, isPriority: true, status: 'LOADED' },
  { tagId: 3, tagNumber: 'BAG-6E521-1049', flightId: 102, flightNumber: '6E-521', passengerId: 3, passengerName: 'Kenji Takahashi', weightKg: 19.4, isPriority: false, status: 'SCREENED' },
  { tagId: 4, tagNumber: 'BAG-UK901-5541', flightId: 103, flightNumber: 'UK-901', passengerId: 4, passengerName: 'Pooja Sundaram', weightKg: 24.2, isPriority: false, status: 'CHECKED_IN' },
];

const SEED_SCANS: BaggageScanEvent[] = [
  { eventId: 1, tagNumber: 'BAG-AI203-8821', location: 'Terminal 2 Induction Sorter 4', scannerId: 'SCN-T2-04', timestamp: '13:20 UTC', scanType: 'SECURITY_SCREEN' },
  { eventId: 2, tagNumber: 'BAG-AI203-8821', location: 'Ramp Stand G12 ULD Loader 2', scannerId: 'SCN-RMP-12', timestamp: '13:58 UTC', scanType: 'RAMP_LOAD' },
  { eventId: 3, tagNumber: 'BAG-AI203-8822', location: 'Ramp Stand G12 ULD Loader 2', scannerId: 'SCN-RMP-12', timestamp: '14:02 UTC', scanType: 'RAMP_LOAD' },
];

const SEED_MISHANDLED: MishandledBaggage[] = [
  { reportId: 1, claimNumber: 'CLM-2024-0012', incidentType: 'DELAYED', tagNumber: 'BAG-UK901-5541', passengerId: 4, passengerName: 'Pooja Sundaram', status: 'INVESTIGATING', reportedAt: '12:30 UTC', lastKnownLocation: 'Terminal 2 Transfer Conveyor Belt 3' },
];

const SEED_INCIDENTS: IncidentTicket[] = [
  { ticketId: 'INC-881', title: 'Unattended Cabin Bag Detected', location: 'Gate A14 Concourse Seats', flightNumber: 'AI-203', severity: 'HIGH', status: 'INVESTIGATING', reportedAt: '12 mins ago', assignedOfficer: 'Officer Aarav Li', description: 'K9 bomb disposal team sweeping perimeter. Standby cordon established.' },
  { ticketId: 'INC-882', title: 'Transit Visa Documentation Discrepancy', location: 'Gate B04 Boarding Turnstile', flightNumber: '6E-521', severity: 'MEDIUM', status: 'RESOLVED', reportedAt: '25 mins ago', assignedOfficer: 'Immigration Desk 3', description: 'Passenger PNR-6420 re-routed to consular desk for visa verification.' },
  { ticketId: 'INC-883', title: 'Biometric E-Gate Reader #4 Optical Timeout', location: 'Terminal 2 Concourse Central E-Gates', severity: 'LOW', status: 'INVESTIGATING', reportedAt: '42 mins ago', assignedOfficer: 'Tech Support Team B', description: 'Sensor recalibration in progress. 5 adjacent lanes operational.' },
];

const SEED_LOST_FOUND: LostFoundRecord[] = [
  { id: 'LF-2024-089', title: 'Apple iPad Pro 11" Space Grey', category: 'ELECTRONICS', locationFound: 'Terminal 2 Security Checkpoint B', reportedBy: 'Public Portal - Priya Sharma', contactNumber: '+91 98765 43210', linkedPnr: 'PNR-AI203-03', flightNumber: 'AI-203', status: 'MATCHED', reportedDate: 'Today, 11:20 AM', description: 'Black magnetic folio cover, sticker of NASA on back casing.', color: 'Space Grey', storageLocker: 'Locker B-14' },
  { id: 'LF-2024-090', title: 'Samsonite Hard-Shell Carry-On (Navy)', category: 'BAGGAGE', locationFound: 'Gate A12 Seating Area Stand 4', reportedBy: 'Gate Agent Aarav', contactNumber: 'Airside Staff Extension 402', flightNumber: 'AI-203', status: 'READY_FOR_COLLECTION', reportedDate: 'Today, 12:45 PM', description: 'Left near charging kiosk. Luggage tag reads Harrison Sterling.', color: 'Navy Blue', storageLocker: 'Secure Vault A' },
  { id: 'LF-2024-091', title: 'Leather Passport Holder with Visa Documents', category: 'DOCUMENTS', locationFound: 'Terminal 1 Concourse Duty Free', reportedBy: 'Public Portal - Kenji Takahashi', contactNumber: '+81 90 1234 5678', linkedPnr: 'PNR-6E521-01', flightNumber: '6E-521', status: 'NEW_REPORT', reportedDate: 'Today, 13:10 PM', description: 'Tan leather passport case holding Japanese passport & boarding stub.', color: 'Tan Brown', storageLocker: 'Intake Desk Shelf 2' },
];

const SEED_AUDIT_LOGS: AuditLog[] = [
  { auditId: 1001, action: 'MASTER_GATE_ASSIGN', entityType: 'GATE', entityId: 1, performedByUserId: 10, performedByUserName: 'Aarav Li (Admin)', timestamp: '14:02 UTC', ipAddress: '10.0.4.12', changePayload: 'Flight AI-203 synchronized with Aerobridge A12' },
  { auditId: 1002, action: 'SECURITY_SWEEP_CLEAR', entityType: 'TASK', entityId: 201, performedByUserId: 7, performedByUserName: 'Aarav Patel (Security)', timestamp: '13:48 UTC', ipAddress: '10.0.2.88', changePayload: 'Cabin security clearance certified for AI-203' },
  { auditId: 1003, action: 'FUELING_LOG_SUBMIT', entityType: 'FUEL', entityId: 203, performedByUserId: 4, performedByUserName: 'Elena Tanaka (Billing)', timestamp: '14:22 UTC', ipAddress: '10.0.3.15', changePayload: 'Hydrant fuel bowser HYD-04 pumped 9,950 L' },
  { auditId: 1004, action: 'BOARDING_COMMENCE', entityType: 'FLIGHT', entityId: 101, performedByUserId: 2, performedByUserName: 'Riya Johnson (Ground Ops)', timestamp: '14:10 UTC', ipAddress: '10.0.1.44', changePayload: 'All turnaround prerequisites met. Turnstiles activated.' },
];

export interface StaffUserSummary {
  userId: number;
  fullName: string;
  roleName: string;
  department: string;
  email: string;
  status: 'ACTIVE' | 'OFF_DUTY' | 'ON_SHIFT';
}

const SEED_STAFF_USERS: StaffUserSummary[] = [
  { userId: 10, fullName: 'Aarav Li', roleName: 'System Administrator', department: 'Terminal Management', email: 'admin@saphire.in', status: 'ACTIVE' },
  { userId: 11, fullName: 'Sai Sharma', roleName: 'AOCC Operations Manager', department: 'Flight Operations', email: 'aocc@saphire.in', status: 'ACTIVE' },
  { userId: 12, fullName: 'Riya Johnson', roleName: 'Ground Ops Supervisor', department: 'Ground Handling', email: 'ground@saphire.in', status: 'ACTIVE' },
  { userId: 13, fullName: 'Elena Tanaka', roleName: 'Airline Billing Clerk', department: 'Finance & Billing', email: 'billing@saphire.in', status: 'ACTIVE' },
  { userId: 14, fullName: 'Marcus Vance', roleName: 'Gate Agent / Airside Lead', department: 'Airside Operations', email: 'airside@saphire.in', status: 'ACTIVE' },
  { userId: 15, fullName: 'Tariq Al-Mansoor', roleName: 'Baggage / Cargo Supervisor', department: 'Logistics', email: 'logistics@saphire.in', status: 'ACTIVE' },
  { userId: 16, fullName: 'Aarav Patel', roleName: 'Security Officer', department: 'Terminal Security', email: 'security@saphire.in', status: 'ACTIVE' },
];

// ============================================================================
// SINGLETON REACTIVE STORE
// ============================================================================

class AocsDataStore {
  private flights: Flight[] = [];
  private gates: Gate[] = [];
  private tasks: TurnaroundTask[] = [];
  private bags: BagTag[] = [];
  private scans: BaggageScanEvent[] = [];
  private mishandled: MishandledBaggage[] = [];
  private incidents: IncidentTicket[] = [];
  private lostFound: LostFoundRecord[] = [];
  private auditLogs: AuditLog[] = [];
  private listeners: Set<(event: AocsEvent) => void> = new Set();
  private initialized = false;

  constructor() {
    this.loadInitialState();
  }

  private loadInitialState() {
    try {
      const savedFlights = localStorage.getItem('saphire_flights');
      const savedGates = localStorage.getItem('saphire_gates');
      const savedTasks = localStorage.getItem('saphire_tasks');
      const savedBags = localStorage.getItem('saphire_bags');
      const savedScans = localStorage.getItem('saphire_scans');
      const savedIncidents = localStorage.getItem('saphire_incidents');
      const savedLostFound = localStorage.getItem('saphire_lost_found');
      const savedAudit = localStorage.getItem('saphire_audit_logs');

      this.flights = savedFlights ? JSON.parse(savedFlights) : SEED_FLIGHTS;
      this.gates = savedGates ? JSON.parse(savedGates) : SEED_GATES;
      this.tasks = savedTasks ? JSON.parse(savedTasks) : SEED_TASKS;
      this.bags = savedBags ? JSON.parse(savedBags) : SEED_BAGS;
      this.scans = savedScans ? JSON.parse(savedScans) : SEED_SCANS;
      this.mishandled = SEED_MISHANDLED;
      this.incidents = savedIncidents ? JSON.parse(savedIncidents) : SEED_INCIDENTS;
      this.lostFound = savedLostFound ? JSON.parse(savedLostFound) : SEED_LOST_FOUND;
      this.auditLogs = savedAudit ? JSON.parse(savedAudit) : SEED_AUDIT_LOGS;
      this.initialized = true;
    } catch (e) {
      console.warn('LocalStorage parse failed, using memory seeds', e);
      this.flights = SEED_FLIGHTS;
      this.gates = SEED_GATES;
      this.tasks = SEED_TASKS;
      this.bags = SEED_BAGS;
      this.scans = SEED_SCANS;
      this.mishandled = SEED_MISHANDLED;
      this.incidents = SEED_INCIDENTS;
      this.lostFound = SEED_LOST_FOUND;
      this.auditLogs = SEED_AUDIT_LOGS;
    }
  }

  private persist(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      // Storage quota or private mode fallback
    }
  }

  public subscribe(listener: (event: AocsEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(type: AocsEventType, payload: any, source: string = 'AOCS_CORE') {
    const event: AocsEvent = {
      type,
      payload,
      timestamp: new Date().toISOString(),
      source,
    };
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in AOCS listener:', err);
      }
    });
  }

  // ==========================================================================
  // GETTERS (SYNCHRONOUS ACCESS FOR REACTIVE STATE)
  // ==========================================================================

  public getFlights(): Flight[] {
    return [...this.flights];
  }

  public getFlightByNumber(flightNumber: string): Flight | undefined {
    return this.flights.find((f) => f.flightNumber === flightNumber);
  }

  public getGates(): Gate[] {
    return [...this.gates];
  }

  public getTasks(): TurnaroundTask[] {
    return [...this.tasks];
  }

  public getTasksByFlight(flightNumber: string): TurnaroundTask[] {
    return this.tasks.filter((t) => t.flightNumber === flightNumber);
  }

  public getBags(): BagTag[] {
    return [...this.bags];
  }

  public getIncidents(): IncidentTicket[] {
    return [...this.incidents];
  }

  public getLostFound(): LostFoundRecord[] {
    return [...this.lostFound];
  }

  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  public getStaffUsers(): StaffUserSummary[] {
    return [...SEED_STAFF_USERS];
  }

  // ==========================================================================
  // MUTATIONS (CROSS-DASHBOARD REACTIVE PROPAGATION)
  // ==========================================================================

  // 1. Assign Gate to Flight (Airside Ops ↔ AOCC ↔ Public Tracker ↔ Boarding)
  public assignGate(flightNumber: string, gateCode: string, source: string = 'Airside Ops'): boolean {
    const flight = this.flights.find((f) => f.flightNumber === flightNumber);
    const targetGate = this.gates.find((g) => g.gateCode === gateCode);
    if (!flight) return false;

    // Free previous gate if any
    this.gates = this.gates.map((g) => {
      if (g.assignedFlightNumber === flightNumber && g.gateCode !== gateCode) {
        return { ...g, status: 'AVAILABLE', assignedFlightId: undefined, assignedFlightNumber: undefined };
      }
      if (g.gateCode === gateCode) {
        return { ...g, status: 'OCCUPIED', assignedFlightId: flight.flightId, assignedFlightNumber: flight.flightNumber };
      }
      return g;
    });

    // Update flight
    this.flights = this.flights.map((f) => (f.flightNumber === flightNumber ? { ...f, gateCode } : f));

    this.persist('saphire_flights', this.flights);
    this.persist('saphire_gates', this.gates);

    this.logAuditEvent(
      'GATE_ASSIGNMENT',
      `Gate ${gateCode} assigned to Flight ${flightNumber}`,
      source
    );

    this.emit('GATE_ASSIGNED', { flightNumber, gateCode }, source);
    this.emit('FLIGHT_UPDATED', { flightNumber, gateCode }, source);
    return true;
  }

  // 2. Update Flight Status (AOCC / Ground Ops / Admin)
  public updateFlightStatus(flightNumber: string, status: Flight['status'], source: string = 'AOCC'): boolean {
    const flight = this.flights.find((f) => f.flightNumber === flightNumber);
    if (!flight) return false;

    this.flights = this.flights.map((f) => (f.flightNumber === flightNumber ? { ...f, status } : f));
    this.persist('saphire_flights', this.flights);

    this.logAuditEvent(
      'FLIGHT_STATUS_UPDATE',
      `Flight ${flightNumber} status transitioned to ${status}`,
      source
    );

    this.emit('FLIGHT_UPDATED', { flightNumber, status }, source);
    return true;
  }

  // 3. Update Turnaround Task Status (Ground Ops ↔ Department ↔ Passenger Clearance)
  public updateTaskStatus(taskId: number, status: TurnaroundTask['status'], source: string = 'Ground Ops'): boolean {
    const task = this.tasks.find((t) => t.taskId === taskId);
    if (!task) return false;

    this.tasks = this.tasks.map((t) =>
      t.taskId === taskId
        ? {
            ...t,
            status,
            actualEnd: status === 'COMPLETED' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t.actualEnd,
          }
        : t
    );
    this.persist('saphire_tasks', this.tasks);

    this.logAuditEvent(
      'TASK_STATUS_CHANGE',
      `Task #${taskId} (${task.taskName}) set to ${status} for ${task.flightNumber}`,
      source
    );

    this.emit('TASK_UPDATED', { taskId, status, flightNumber: task.flightNumber }, source);
    this.emit('PREREQUISITE_CHANGED', { flightNumber: task.flightNumber }, source);
    return true;
  }

  // 4. Prerequisite Checker: Check if flight has completed Cleaning, Fueling, Security, and Maintenance
  public getFlightPrerequisites(flightNumber: string): {
    securityCleared: boolean;
    cleaningCleared: boolean;
    maintenanceCleared: boolean;
    fuelingCleared: boolean;
    allCleared: boolean;
    boardingPermitted: boolean;
    cleaning: boolean;
    refueling: boolean;
    maintenance: boolean;
    security: boolean;
  } {
    const tasks = this.getTasksByFlight(flightNumber);
    const security = tasks.find((t) => t.taskType === 'SECURITY');
    const cleaning = tasks.find((t) => t.taskType === 'CLEANING');
    const maintenance = tasks.find((t) => t.taskType === 'MAINTENANCE');
    const fueling = tasks.find((t) => t.taskType === 'REFUELING');

    const securityCleared = !security || security.status === 'COMPLETED';
    const cleaningCleared = !cleaning || cleaning.status === 'COMPLETED';
    const maintenanceCleared = !maintenance || maintenance.status === 'COMPLETED';
    const fuelingCleared = !fueling || fueling.status === 'COMPLETED';
    const allCleared = securityCleared && cleaningCleared && maintenanceCleared && fuelingCleared;

    return {
      securityCleared,
      cleaningCleared,
      maintenanceCleared,
      fuelingCleared,
      allCleared,
      boardingPermitted: allCleared,
      cleaning: cleaningCleared,
      refueling: fuelingCleared,
      maintenance: maintenanceCleared,
      security: securityCleared,
    };
  }

  public updateTurnaroundTask(
    taskIdOrFlightNumber: number | string,
    statusOrType: string,
    statusOrSource?: string,
    sourceOrUser?: string
  ): boolean {
    if (typeof taskIdOrFlightNumber === 'string') {
      const flightNumber = taskIdOrFlightNumber;
      const taskType = statusOrType;
      const status = (statusOrSource || 'COMPLETED') as TurnaroundTask['status'];
      const user = sourceOrUser || 'Operations Agent';

      const task = this.tasks.find(
        (t) => t.flightNumber === flightNumber && t.taskType.toUpperCase() === taskType.toUpperCase()
      );

      if (task) {
        task.status = status;
        if (status === 'COMPLETED') {
          task.actualEnd = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
      } else {
        this.tasks.push({
          taskId: 500 + this.tasks.length + 1,
          flightId: 101,
          flightNumber,
          taskType,
          taskName: `${taskType} Sign-Off`,
          status,
          departmentName: user,
          plannedStart: '13:00',
          plannedEnd: '14:00',
          actualStart: '13:00',
          actualEnd: status === 'COMPLETED' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
        });
      }

      this.persist('saphire_tasks', this.tasks);
      this.emit('TASK_UPDATED', { flightNumber, taskType, status }, user);
      this.emit('PREREQUISITE_CHANGED', { flightNumber }, user);
      return true;
    } else {
      const taskId = taskIdOrFlightNumber;
      const status = statusOrType as TurnaroundTask['status'];
      const source = statusOrSource || 'Ground Ops';
      return this.updateTaskStatus(taskId, status, source);
    }
  }

  // 5. Lost & Found Reporting (Public Passenger Portal ↔ Passenger Security Ops)
  public reportLostItem(item: Partial<LostFoundRecord> & { title?: string; itemName?: string }): LostFoundRecord {
    const title = item.title || item.itemName || 'Misplaced Belonging';
    const newRecord: LostFoundRecord = {
      id: `LF-2024-${Math.floor(100 + Math.random() * 900)}`,
      title,
      itemName: title,
      category: item.category || 'ELECTRONICS',
      locationFound: item.locationFound || 'Terminal Concourse',
      reportedBy: item.reportedBy || item.contactName || 'Passenger (Public Portal)',
      contactName: item.contactName || item.reportedBy,
      contactNumber: item.contactNumber || 'N/A',
      contactEmail: item.contactEmail,
      linkedPnr: item.linkedPnr,
      flightNumber: item.flightNumber,
      status: 'NEW_REPORT',
      reportedDate: 'Just now',
      description: item.description || 'No additional description provided.',
      color: item.color || 'Unspecified',
      storageLocker: 'Triage Shelf A',
    };

    this.lostFound = [newRecord, ...this.lostFound];
    this.persist('saphire_lost_found', this.lostFound);

    this.logAuditEvent(
      'LOST_ITEM_SUBMISSION',
      `New public lost item reported: ${newRecord.title} (${newRecord.category})`,
      'Public Passenger Portal'
    );

    this.emit('LOST_ITEM_REPORTED', newRecord, 'Public Passenger Portal');
    return newRecord;
  }

  public resolveLostItem(id: string, locker?: string): boolean {
    return this.updateLostFoundStatus(id, 'RETURNED', locker);
  }

  public updateLostFoundStatus(id: string, status: LostFoundRecord['status'], locker?: string): boolean {
    this.lostFound = this.lostFound.map((item) =>
      item.id === id ? { ...item, status, storageLocker: locker || item.storageLocker } : item
    );
    this.persist('saphire_lost_found', this.lostFound);
    this.emit('LOST_ITEM_REPORTED', { id, status }, 'Passenger Security');
    return true;
  }

  // 6. Baggage Tracking & Scans (Logistics ↔ Public Tracker)
  public recordBaggageScan(tagNumber: string, location: string, scanType: BaggageScanEvent['scanType']): BaggageScanEvent {
    const newEvent: BaggageScanEvent = {
      eventId: this.scans.length + 1,
      tagNumber,
      location,
      scannerId: `SCN-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC',
      scanType,
    };

    this.scans = [newEvent, ...this.scans];
    this.persist('saphire_scans', this.scans);

    // Update bag tag status
    this.bags = this.bags.map((b) =>
      b.tagNumber === tagNumber
        ? {
            ...b,
            status:
              scanType === 'RAMP_LOAD'
                ? 'LOADED'
                : scanType === 'TRANSFER'
                ? 'TRANSIT'
                : scanType === 'CAROUSEL_UNLOAD'
                ? 'ARRIVED'
                : 'SCREENED',
          }
        : b
    );
    this.persist('saphire_bags', this.bags);

    this.emit('BAGGAGE_SCANNED', { tagNumber, location, scanType }, 'Logistics Dashboard');
    return newEvent;
  }

  public trackBaggage(tagNumber: string): { bagTag?: BagTag; scanEvents: BaggageScanEvent[] } {
    const bagTag = this.bags.find((b) => b.tagNumber.toLowerCase() === tagNumber.toLowerCase());
    const scanEvents = this.scans.filter((s) => s.tagNumber.toLowerCase() === tagNumber.toLowerCase());
    return { bagTag, scanEvents };
  }

  // 7. Security & Incident Management
  public logIncident(incident: Partial<IncidentTicket> & { title: string; location: string }): IncidentTicket {
    const newInc: IncidentTicket = {
      ticketId: `INC-${Math.floor(880 + Math.random() * 110)}`,
      title: incident.title,
      location: incident.location,
      flightNumber: incident.flightNumber,
      severity: incident.severity || 'MEDIUM',
      status: 'INVESTIGATING',
      reportedAt: 'Just now',
      assignedOfficer: incident.assignedOfficer || 'Duty Patrol Officer',
      description: incident.description || 'Terminal incident logged.',
    };

    this.incidents = [newInc, ...this.incidents];
    this.persist('saphire_incidents', this.incidents);

    this.logAuditEvent(
      'SECURITY_INCIDENT_DISPATCH',
      `${newInc.severity} Incident: ${newInc.title} at ${newInc.location}`,
      'Passenger & Security Ops'
    );

    this.emit('INCIDENT_LOGGED', newInc, 'Passenger & Security Ops');
    return newInc;
  }

  public resolveIncident(ticketId: string): boolean {
    this.incidents = this.incidents.map((inc) => (inc.ticketId === ticketId ? { ...inc, status: 'RESOLVED' } : inc));
    this.persist('saphire_incidents', this.incidents);
    this.logAuditEvent('INCIDENT_RESOLVED', `Incident ${ticketId} resolved and archived`, 'Admin/Security');
    this.emit('INCIDENT_LOGGED', { ticketId, status: 'RESOLVED' }, 'Security');
    return true;
  }

  // ==========================================================================
  // MASTER ADMINISTRATIVE OVERRIDES (ENTERPRISE / ADMINISTRATIVE AUTHORITY)
  // ==========================================================================

  // Administrative Override 1: Force-Push Flight Status (Bypasses regular operational state machines)
  public adminForceFlightStatus(flightNumber: string, targetStatus: Flight['status'], reason: string): boolean {
    this.updateFlightStatus(flightNumber, targetStatus, 'Master Administrative Authority');
    this.logAuditEvent(
      'ADMIN_FORCE_FLIGHT_STATUS',
      `Administrative override: Flight ${flightNumber} forcibly updated to ${targetStatus}. Rationale: ${reason}`,
      'System Administrator'
    );
    this.emit('ADMIN_OVERRIDE', { action: 'FORCE_STATUS', flightNumber, targetStatus }, 'System Administrator');
    return true;
  }

  // Administrative Override 2: Master Gate Eviction / Allocation Override
  public adminMasterGateOverride(flightNumber: string, targetGateCode: string, ignoreConflicts: boolean = true): boolean {
    this.assignGate(flightNumber, targetGateCode, 'Master Administrative Authority');
    this.logAuditEvent(
      'ADMIN_GATE_OVERRIDE',
      `Administrative override: Flight ${flightNumber} forcibly assigned to Gate ${targetGateCode} (Conflict bypass: ${ignoreConflicts})`,
      'System Administrator'
    );
    this.emit('ADMIN_OVERRIDE', { action: 'GATE_OVERRIDE', flightNumber, targetGateCode }, 'System Administrator');
    return true;
  }

  // Administrative Override 3: Clear All Turnaround Prerequisites for a Flight
  public adminClearAllTurnaroundPrerequisites(flightNumber: string, supervisorPin: string): boolean {
    this.tasks = this.tasks.map((t) =>
      t.flightNumber === flightNumber
        ? { ...t, status: 'COMPLETED', actualEnd: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        : t
    );
    this.persist('saphire_tasks', this.tasks);

    this.logAuditEvent(
      'ADMIN_TURNAROUND_CLEAR_ALL',
      `Administrative override: All turnaround prerequisites for ${flightNumber} authorized and signed off by supervisor (PIN: ${supervisorPin})`,
      'System Administrator'
    );

    this.emit('PREREQUISITE_CHANGED', { flightNumber, allCleared: true }, 'System Administrator');
    this.emit('ADMIN_OVERRIDE', { action: 'CLEAR_PREREQUISITES', flightNumber }, 'System Administrator');
    return true;
  }

  // Administrative Override 4: Emergency Terminal Facility Lockdown
  public adminEmergencyTerminalLockdown(terminal: string, locked: boolean): boolean {
    this.logAuditEvent(
      'ADMIN_TERMINAL_LOCKDOWN',
      `Emergency administrative directive: ${terminal} boarding gates ${locked ? 'LOCKED DOWN' : 'UNLOCKED/RESTORED'}`,
      'System Administrator'
    );
    this.emit('ADMIN_OVERRIDE', { action: 'LOCKDOWN', terminal, locked }, 'System Administrator');
    return true;
  }

  // ==========================================================================
  // AUDIT LOG SYSTEM
  // ==========================================================================

  public logAuditEvent(action: string, changePayload: string, source: string = 'OPERATIONS_HUB', performedBy?: string) {
    const newLog: AuditLog = {
      auditId: 1000 + this.auditLogs.length + 1,
      action,
      entityType: action.split('_')[0] || 'SYSTEM',
      entityId: Math.floor(100 + Math.random() * 900),
      performedByUserId: 10,
      performedByUserName: performedBy || source,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC',
      ipAddress: '10.0.0.1',
      changePayload,
    };

    this.auditLogs = [newLog, ...this.auditLogs];
    this.persist('saphire_audit_logs', this.auditLogs);
  }
}

export const aocsDataStore = new AocsDataStore();
export default aocsDataStore;
