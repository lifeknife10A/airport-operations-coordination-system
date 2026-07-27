# AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
## Complete Operational Flow & 16-Table Schema Blueprint

---

### Executive Summary & System Scope
The **Saphire Airport Operations Coordination System (AOCS) (AOCS)** coordinates 25 operational airport roles across flight dispatch, air traffic control, ground handling, logistics, and passenger processing. 

This document serves as the **authoritative data dictionary, operational workflow specification, and LLM schema reference** for all 16 normalized database tables. It is structured so human developers (**Krishna**, **Anay**, **Anuvrat**, **Chaitanya**) and AI coding tools (**Codex**, **Antigravity**, **Claude Code**) can parse and implement backend services, database migrations, and frontend forms without ambiguity.

---

## PART 1: THE 5 OPERATIONAL STORIES (SYSTEM WORKFLOW)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)               │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
      ┌────────────────┬───────────────┼───────────────┬────────────────┐
      ▼                ▼               ▼               ▼                ▼
  [STORY 1]        [STORY 2]       [STORY 3]       [STORY 4]        [STORY 5]
  Personnel        Airside         Turnaround      Logistics        Security &
  & Access         Infrastructure  & Delays        & Supplies       Passengers
  ─────────        ──────────────  ──────────      ──────────       ──────────
  • USERS          • AIRCRAFT      • TASKS         • FUEL_LOGS      • PASSENGERS
  • ROLES          • FLIGHTS       • DELAY_LOGS    • CARGO_MANIFESTS• LOUNGE_VISITS
  • DEPARTMENTS    • GATES                         • BAGGAGE_CAR.   • NOTIFICATIONS
                   • RUNWAYS                                        • AUDIT_LOGS
```

### Story 1: Airport Personnel & Security Access
* **Context**: Manages airport staff members, organizational departments, and security clearances.
* **Entities**: `USERS`, `ROLES`, `DEPARTMENTS`
* **Flow**: A user is assigned a specific `ROLE` (e.g. *Ground Crew Manager*) and employed by a `DEPARTMENT` (e.g. *Refueling Dept*).

### Story 2: Flight & Airside Infrastructure
* **Context**: Manages flight schedules, airframe registrations, gate assignments, and runway clearance.
* **Entities**: `AIRCRAFT`, `FLIGHTS`, `GATES`, `RUNWAYS`
* **Flow**: A scheduled `FLIGHT` is assigned an `AIRCRAFT`, allocated a terminal `GATE` for boarding, and designated a `RUNWAY` for landing/takeoff.

### Story 3: Ground Turnaround & Delay Management
* **Context**: Tracks ground turnaround sub-tasks and records delay bottlenecks.
* **Entities**: `TASKS`, `DELAY_LOGS`
* **Flow**: When a flight arrives, required turnaround `TASKS` (cleaning, refueling, catering) are created. If tasks breach SLA windows, a `DELAY_LOG` entry records the delay cause.

### Story 4: Airside Logistics & Resource Supplies
* **Context**: Tracks fuel volume/density, freight containers, and luggage carousels.
* **Entities**: `FUEL_LOGS`, `CARGO_MANIFESTS`, `BAGGAGE_CAROUSELS`
* **Flow**: Turnaround tasks generate `FUEL_LOGS` for fuel density metrics, load `CARGO_MANIFESTS` into the plane, and route passenger baggage to a `BAGGAGE_CAROUSEL`.

### Story 5: Passengers, Executive Lounges & Security Audit
* **Context**: Manages traveler tracking, staff notifications, and un-deletable security logs.
* **Entities**: `PASSENGERS`, `LOUNGE_VISITS`, `NOTIFICATIONS`, `AUDIT_LOGS`
* **Flow**: `PASSENGERS` generate `LOUNGE_VISITS` at terminal lounges. Operational changes trigger `NOTIFICATIONS` to staff. Every critical action creates an **immutable, un-deletable `AUDIT_LOG`** for legal compliance.

---

## PART 2: LLM-OPTIMIZED 16-TABLE DATA DICTIONARY

---

### STORY 1: PERSONNEL & ACCESS MANAGEMENT

#### Table 1: `ROLES`
* **Description**: Security role definitions and system clearance tiers.
* **API Route**: `/api/v1/roles`

| Column Name | PostgreSQL Data Type | Nullability | Constraints & Defaults | Description / Validation |
|---|---|---|---|---|
| `role_id` | `BIGSERIAL` | `NOT NULL` | `PRIMARY KEY` | Unique role identifier |
| `role_name` | `VARCHAR(50)` | `NOT NULL` | `UNIQUE` | Allowed: `ROLE_ADMIN`, `ROLE_SUPERVISOR`, `ROLE_GROUND_CREW`, `ROLE_ATC`, `ROLE_DISPATCH` |

#### Table 2: `DEPARTMENTS`
* **Description**: Organizational divisions employing airport personnel.
* **API Route**: `/api/v1/departments`

| Column Name | PostgreSQL Data Type | Nullability | Constraints & Defaults | Description / Validation |
|---|---|---|---|---|
| `department_id` | `BIGSERIAL` | `NOT NULL` | `PRIMARY KEY` | Unique department identifier |
| `department_name` | `VARCHAR(100)` | `NOT NULL` | `UNIQUE` | E.g., `Ground Handling`, `Refueling Ops`, `Airfield Security` |

#### Table 3: `USERS`
* **Description**: Airport personnel user accounts.
* **API Route**: `/api/v1/users`

| Column Name | PostgreSQL Data Type | Nullability | Constraints & Defaults | Description / Validation |
|---|---|---|---|---|
| `user_id` | `BIGSERIAL` | `NOT NULL` | `PRIMARY KEY` | Unique user identifier |
| `username` | `VARCHAR(50)` | `NOT NULL` | `UNIQUE`, Regex: `^[a-zA-Z0-9_.]{4,20}$` | Login username |
| `name` | `VARCHAR(100)` | `NOT NULL` | - | Staff full name |
| `phone_numbers` | `VARCHAR(30)` | `NULL` | Regex: `^\+[1-9]\d{1,14}$` | Multivalued contact numbers |
| `role_id` | `BIGINT` | `NOT NULL` | `FK REFERENCES ROLES(role_id) ON DELETE RESTRICT` | Assigned security role |
| `department_id` | `BIGINT` | `NOT NULL` | `FK REFERENCES DEPARTMENTS(department_id) ON DELETE RESTRICT` | Employing department |

---

### STORY 2: FLIGHT & AIRSIDE INFRASTRUCTURE

#### Table 4: `AIRCRAFT`
* **Description**: Airframe fleet inventory.
* **API Route**: `/api/v1/aircraft`

| Column Name | PostgreSQL Data Type | Nullability | Constraints & Defaults | Description / Validation |
|---|---|---|---|---|
| `aircraft_id` | `BIGSERIAL` | `NOT NULL` | `PRIMARY KEY` | Unique aircraft identifier |
| `registration_number` | `VARCHAR(20)` | `NOT NULL` | `UNIQUE`, Regex: `^[A-Z0-9-]{4,10}$` | Tail registration (e.g. `VT-ANZ`) |

#### Table 5: `GATES`
* **Description**: Terminal boarding gates.
* **API Route**: `/api/v1/gates`

| Column Name | PostgreSQL Data Type | Nullability | Constraints & Defaults | Description / Validation |
|---|---|---|---|---|
| `gate_id` | `BIGSERIAL` | `NOT NULL` | `PRIMARY KEY` | Unique gate identifier |
| `gate_number` | `VARCHAR(10)` | `NOT NULL` | `UNIQUE`, Regex: `^[A-Z]\d{1,3}$` | Gate label (e.g. `B12`) |

#### Table 6: `RUNWAYS`
* **Description**: Landing and takeoff airside runways.
* **API Route**: `/api/v1/runways`

| Column Name | PostgreSQL Data Type | Nullability | Constraints & Defaults | Description / Validation |
|---|---|---|---|---|
| `runway_id` | `BIGSERIAL` | `NOT NULL` | `PRIMARY KEY` | Unique runway identifier |
| `runway_code` | `VARCHAR(10)` | `NOT NULL` | `UNIQUE`, Regex: `^\d{2}[LCR]?$` | Runway designation (e.g. `28L`) |

#### Table 7: `FLIGHTS`
* **Description**: Central flight operational schedules.
* **API Route**: `/api/v1/flights`

| Column Name | PostgreSQL Data Type | Nullability | Constraints & Defaults | Description / Validation |
|---|---|---|---|---|
| `flight_id` | `BIGSERIAL` | `NOT NULL` | `PRIMARY KEY` | Unique flight identifier |
| `flight_number` | `VARCHAR(10)` | `NOT NULL` | Regex: `^[A-Z]{2,3}\d{3,4}$` | Official flight code (e.g. `AI101`) |
| `flight_status` | `VARCHAR(20)` | `NOT NULL` | `DEFAULT 'SCHEDULED'`, `CHECK (flight_status IN ('SCHEDULED', 'BOARDING', 'AIRBORNE', 'LANDED', 'DELAYED', 'CANCELLED'))` | Current operational state |
| `aircraft_id` | `BIGINT` | `NOT NULL` | `FK REFERENCES AIRCRAFT(aircraft_id) ON DELETE RESTRICT` | Assigned aircraft |
| `gate_id` | `BIGINT` | `NULL` | `FK REFERENCES GATES(gate_id) ON DELETE SET NULL` | Assigned terminal gate |
| `runway_id` | `BIGINT` | `NULL` | `FK REFERENCES RUNWAYS(runway_id) ON DELETE SET NULL` | Assigned runway |
| `department_id` | `BIGINT` | `NULL` | `FK REFERENCES DEPARTMENTS(department_id) ON DELETE SET NULL` | Coordinating department |

---

### STORY 3: GROUND TURNAROUND & DELAYS

#### Table 8: `TASKS`
* **Description**: Ground turnaround sub-tasks created per flight.
* **API Route**: `/api/v1/tasks`

| Column Name | PostgreSQL Data Type | Nullability | Constraints & Defaults | Description / Validation |
|---|---|---|---|---|
| `task_id` | `BIGSERIAL` | `NOT NULL` | `PRIMARY KEY` | Unique task identifier |
| `task_name` | `VARCHAR(100)` | `NOT NULL` | - | E.g., `Cabin Cleaning`, `Refueling`, `Catering` |
| `status` | `VARCHAR(20)` | `NOT NULL` | `DEFAULT 'PENDING'`, `CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'))` | Sub-task progress state |
| `flight_id` | `BIGINT` | `NOT NULL` | `FK REFERENCES FLIGHTS(flight_id) ON DELETE CASCADE` | Associated flight |
| `assigned_user_id` | `BIGINT` | `NULL` | `FK REFERENCES USERS(user_id) ON DELETE SET NULL` | Assigned ground crew member |

#### Table 9: `DELAY_LOGS` (Weak Entity)
* **Description**: Incident logs tracking flight delays.
* **API Route**: `/api/v1/delays`

| Column Name | PostgreSQL Data Type | Nullability | Constraints & Defaults | Description / Validation |
|---|---|---|---|---|
| `flight_id` | `BIGINT` | `NOT NULL` | `FK REFERENCES FLIGHTS(flight_id) ON DELETE CASCADE` | Parent flight (Part of Composite PK) |
| `delay_seq_no` | `INT` | `NOT NULL` | `CHECK (delay_seq_no > 0)` | Partial key sequence number |
| `delay_minutes` | `INT` | `NOT NULL` | `CHECK (delay_minutes >= 0)` | Duration of delay in minutes |
| - | - | - | `PRIMARY KEY (flight_id, delay_seq_no)` | Composite Primary Key |

---

### STORY 4: LOGISTICS & SUPPLIES

#### Table 10: `FUEL_LOGS`
* **Description**: Fueling transactions connected to refueling turnaround tasks.
* **API Route**: `/api/v1/logistics/fuel`

| Column Name | PostgreSQL Data Type | Nullability | Constraints & Defaults | Description / Validation |
|---|---|---|---|---|
| `fuel_log_id` | `BIGSERIAL` | `NOT NULL` | `PRIMARY KEY` | Unique fuel log identifier |
| `fuel_density` | `NUMERIC(6,3)`| `NOT NULL` | `CHECK (fuel_density > 0)` | Fuel density metric (kg/L) |
| `task_id` | `BIGINT` | `NOT NULL` | `FK REFERENCES TASKS(task_id) ON DELETE RESTRICT` | Associated refueling task |

#### Table 11: `CARGO_MANIFESTS`
* **Description**: Air freight containers loaded onto flights.
* **API Route**: `/api/v1/logistics/cargo`

| Column Name | PostgreSQL Data Type | Nullability | Constraints & Defaults | Description / Validation |
|---|---|---|---|---|
| `cargo_id` | `BIGSERIAL` | `NOT NULL` | `PRIMARY KEY` | Unique cargo manifest ID |
| `container_id` | `VARCHAR(30)` | `NOT NULL` | Regex: `^[A-Z0-9-]{4,20}$` | Freight container code |
| `fuel_log_id` | `BIGINT` | `NOT NULL` | `FK REFERENCES FUEL_LOGS(fuel_log_id) ON DELETE RESTRICT` | Associated fuel log transaction |

#### Table 12: `BAGGAGE_CAROUSELS`
* **Description**: Luggage retrieval carousels assigned to arriving flights.
* **API Route**: `/api/v1/logistics/baggage`

| Column Name | PostgreSQL Data Type | Nullability | Constraints & Defaults | Description / Validation |
|---|---|---|---|---|
| `carousel_id` | `BIGSERIAL` | `NOT NULL` | `PRIMARY KEY` | Unique carousel identifier |
| `terminal` | `VARCHAR(10)` | `NOT NULL` | - | Terminal identifier (e.g., `T2`) |
| `flight_id` | `BIGINT` | `NULL` | `FK REFERENCES FLIGHTS(flight_id) ON DELETE SET NULL` | Arriving flight claim |

---

### STORY 5: PASSENGERS, LOUNGES & SECURITY AUDIT

#### Table 13: `PASSENGERS`
* **Description**: Traveler passenger records.
* **API Route**: `/api/v1/passengers`

| Column Name | PostgreSQL Data Type | Nullability | Constraints & Defaults | Description / Validation |
|---|---|---|---|---|
| `passenger_id` | `BIGSERIAL` | `NOT NULL` | `PRIMARY KEY` | Unique passenger identifier |
| `passport_number` | `VARCHAR(20)` | `NOT NULL` | `UNIQUE`, Regex: `^[A-Z0-9]{6,12}$` | Official passport code |
| `flight_id` | `BIGINT` | `NOT NULL` | `FK REFERENCES FLIGHTS(flight_id) ON DELETE RESTRICT` | Booked flight |

#### Table 14: `LOUNGE_VISITS`
* **Description**: Executive lounge entries logged for premium passengers.
* **API Route**: `/api/v1/lounges`

| Column Name | PostgreSQL Data Type | Nullability | Constraints & Defaults | Description / Validation |
|---|---|---|---|---|
| `visit_id` | `BIGSERIAL` | `NOT NULL` | `PRIMARY KEY` | Unique lounge visit identifier |
| `lounge_name` | `VARCHAR(100)`| `NOT NULL` | - | Lounge facility name |
| `passenger_id` | `BIGINT` | `NOT NULL` | `FK REFERENCES PASSENGERS(passenger_id) ON DELETE CASCADE` | Visiting passenger |

#### Table 15: `NOTIFICATIONS`
* **Description**: Automated operational alerts sent to airport users.
* **API Route**: `/api/v1/notifications`

| Column Name | PostgreSQL Data Type | Nullability | Constraints & Defaults | Description / Validation |
|---|---|---|---|---|
| `notification_id`| `BIGSERIAL` | `NOT NULL` | `PRIMARY KEY` | Unique notification identifier |
| `title` | `VARCHAR(150)`| `NOT NULL` | - | Alert title headline |
| `user_id` | `BIGINT` | `NOT NULL` | `FK REFERENCES USERS(user_id) ON DELETE CASCADE` | Recipient user |

#### Table 16: `AUDIT_LOGS` (Immutable Security Trail - Legal Compliance)
* **Description**: Permanent security audit trails logging system activity. **Cannot be deleted under any circumstances.**
* **API Route**: `/api/v1/reports/audit-logs`

| Column Name | PostgreSQL Data Type | Nullability | Constraints & Defaults | Description / Validation |
|---|---|---|---|---|
| `log_id` | `BIGSERIAL` | `NOT NULL` | `PRIMARY KEY` | Unique audit log ID |
| `action` | `VARCHAR(255)`| `NOT NULL` | - | Executed system action |
| `user_id` | `BIGINT` | `NOT NULL` | `FK REFERENCES USERS(user_id) ON DELETE RESTRICT` | User who performed action |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `DEFAULT CURRENT_TIMESTAMP` | System timestamp |

> [!CAUTION]
> **Legal Compliance Rule**: `AUDIT_LOGS` entries enforce `ON DELETE RESTRICT`. Attempts to delete user records with active audit logs will be rejected by the database to preserve historical legal audit integrity.

---
*Author: Antigravity Agent (Google Deepmind) | Project: Saphire Airport Operations Coordination System (AOCS) (AOCS)*
