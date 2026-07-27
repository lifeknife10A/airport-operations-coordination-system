# AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
## 500+ Row Database Seed Data Blueprint (60% National / 40% International)

---

### Executive Overview & Population Strategy
This document defines the specification for generating **600+ unique, realistic database rows** (`V2__seed_data.sql`) across all 16 operational tables upon team approval of the core schema.

To ensure realistic aviation analytics, the dataset maintains a strict **60% National (Indian Domestic Aviation)** and **40% International (Global Aviation)** distribution. Every row strictly adheres to PostgreSQL data types, foreign key integrity rules, and client-side regex validations.

---

## SECTION 1: AVIATION NETWORK DISTRIBUTION

### 1. National Aviation Network (60% Allocation)
* **Carriers & Airlines**: Air India (`AI`), IndiGo (`6E`), Vistara (`UK`), Akasa Air (`QP`), SpiceJet (`SG`).
* **Hub Airports**: DEL (Indira Gandhi Intl - New Delhi), BOM (Chhatrapati Shivaji Maharaj Intl - Mumbai), BLR (Kempegowda - Bengaluru), MAA (Chennai), CCU (Kolkata), HYD (Rajiv Gandhi Intl - Hyderabad).
* **Aircraft Tail Registrations**: `VT-ANZ` (B787-8), `VT-IFV` (A320neo), `VT-TQA` (A321neo), `VT-YAA` (B737 MAX 8).
* **Personnel & Passenger Demographics**: Indian names, valid Indian phone numbers (`+91 98xxxxxxxx`), and Indian passport format codes (`^[A-Z0-9]{6,12}$`).

### 2. International Aviation Network (40% Allocation)
* **Carriers & Airlines**: Emirates (`EK`), British Airways (`BA`), Singapore Airlines (`SQ`), Qatar Airways (`QR`), Lufthansa (`LH`), United Airlines (`UA`), Delta Air Lines (`DL`).
* **Global Hub Airports**: DXB (Dubai Intl), LHR (London Heathrow), SIN (Singapore Changi), JFK (New York John F. Kennedy), FRA (Frankfurt), HND (Tokyo Haneda).
* **Aircraft Tail Registrations**: `A6-EEO` (Emirates A380-800), `G-XWBA` (British Airways A350-1000), `9V-SWA` (Singapore B777-300ER), `N772AN` (American Airlines B777-200ER).
* **Personnel & Passenger Demographics**: International staff & passenger names, international dial codes (`+1`, `+44`, `+971`, `+65`), and global passport format codes.

---

## SECTION 2: TABLE-BY-TABLE ROW ALLOCATION (633 TOTAL ROWS)

| Table Name | Target Unique Rows | National (60%) | International (40%) | Key Validation & Constraint Rules |
|---|:---:|:---:|:---:|---|
| **`USERS`** | **50** | 30 Users | 20 Users | Regex: `username: ^[a-zA-Z0-9_.]{4,20}$`, `phone: ^\+[1-9]\d{1,14}$` |
| **`ROLES`** | **5** | 5 Roles | 5 Roles | Values: `ROLE_ADMIN`, `ROLE_SUPERVISOR`, `ROLE_GROUND_CREW`, `ROLE_ATC`, `ROLE_DISPATCH` |
| **`DEPARTMENTS`** | **8** | 8 Depts | 8 Depts | Divisions: `Ground Handling`, `Refueling Ops`, `Airfield Security`, `ATC Ops`, `Catering` |
| **`AIRCRAFT`** | **40** | 24 Airframes | 16 Airframes | Regex: `registration_number: ^[A-Z0-9-]{4,10}$` |
| **`GATES`** | **30** | 18 Gates | 12 Gates | Regex: `gate_number: ^[A-Z]\d{1,3}$` (`T1`, `T2`, `T3` concourses) |
| **`RUNWAYS`** | **10** | 6 Runways | 4 Runways | Regex: `runway_code: ^\d{2}[LCR]?$` (e.g., `28L`, `09R`, `10L`) |
| **`FLIGHTS`** | **60** | 36 Domestic | 24 Intl | Regex: `flight_number: ^[A-Z]{2,3}\d{3,4}$`, `CHECK (flight_status IN ('SCHEDULED',...))` |
| **`TASKS`** | **120** | 72 Sub-Tasks | 48 Sub-Tasks | `CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'))` |
| **`DELAY_LOGS`** | **35** | 21 Delays | 14 Delays | Weak Entity Composite PK `(flight_id, delay_seq_no)`, `CHECK (delay_minutes >= 0)` |
| **`FUEL_LOGS`** | **40** | 24 Fuel Logs | 16 Fuel Logs | Jet A-1 Density `CHECK (fuel_density > 0)` (approx `0.804 kg/L`) |
| **`CARGO_MANIFESTS`** | **40** | 24 Cargo Logs | 16 Cargo Logs | Regex: `container_id: ^[A-Z0-9-]{4,20}$` |
| **`BAGGAGE_CAROUSELS`**| **15** | 9 Carousels | 6 Carousels | Terminals `T1`, `T2`, `T3`, `Intl Arrival` |
| **`PASSENGERS`** | **60** | 36 Passengers | 24 Passengers | Regex: `passport_number: ^[A-Z0-9]{6,12}$` |
| **`LOUNGE_VISITS`** | **30** | 18 Lounge Entries | 12 Executive Entries| `FK REFERENCES PASSENGERS(passenger_id) ON DELETE CASCADE` |
| **`NOTIFICATIONS`** | **40** | 24 Staff Alerts | 16 Staff Alerts | Automated operational alerts sent to user IDs |
| **`AUDIT_LOGS`** | **50** | 30 Audit Logs | 20 Audit Logs | **Immutable Legal Audit Trail (`ON DELETE RESTRICT`)** |
| **TOTAL ROW COUNT** | **633 Rows** | **380 Rows (60%)** | **253 Rows (40%)** | **100% Unique Non-Repetitive Records** |

---

## SECTION 3: DATA PREPARATION & INTEGRITY SPECIFICATIONS

1. **100% Row Uniqueness**:
   * No duplicate flight numbers, passport numbers, container IDs, or tail registrations across the database.
2. **Timestamps & SLA Duration**:
   * Timestamps formatted as ISO 8601 UTC (`TIMESTAMPTZ`).
   * Scheduled vs actual turnaround times generated with realistic variances (0 to +45 mins).
3. **Legal Compliance Enforcement**:
   * `AUDIT_LOGS` foreign key to `USERS` enforces `ON DELETE RESTRICT`. Attempts to delete user accounts associated with historical audit records will be blocked by PostgreSQL to guarantee legal audit trail immutability.

---
*Author: Antigravity Agent (Google Deepmind) | Project: Saphire Airport Operations Coordination System (AOCS) (AOCS)*
