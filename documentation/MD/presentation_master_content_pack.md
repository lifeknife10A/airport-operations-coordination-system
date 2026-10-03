# Saphire AOCS — Master 22-Slide Technical Presentation Content & Prompt Pack

> **Evaluation Objective**: This document provides the complete, unabridged technical content, system architecture, database specifications, algorithm details, testing metrics, and lab artifacts for the 22-slide PowerPoint presentation evaluated by the faculty examination board.
> 
> **Team Roster & Roll Numbers**:
> - **Krishna Solanki (I075)** — Lead Architect, Database & System Integration Lead
> - **Chaitanya Tikku (I078)** — Documentation, UML & QA Testing Lead
> - **Anuvrat Tripathi (I080)** — Frontend UI/UX Lead
> - **Anay Modi (I088)** — Backend API & Logic Lead

---

## 📋 Master Technical Prompt for Claude (Opus 5.5) in PowerPoint

```markdown
You are an expert Software Engineering architect and slide author. Build a comprehensive, 22-slide, technically rigorous, deeply detailed presentation deck for our graduate software engineering capstone project: "Saphire AOCS (Airport Operations Coordination System)".

IMPORTANT INSTRUCTIONS:
1. Context & Depth: The faculty evaluator will inspect this deck and the live codebase to conduct an in-depth technical viva. Ensure every slide contains exhaustive technical depth, specific formulas, exact database table names, REST endpoints, algorithms, design patterns, and engineering metrics. Avoid high-level superficial summaries.
2. Repository Context: Reference all project documentation files in the repository for deep grounding:
   - `Mini Project/README.md` & `Mini Project/DATABASE_TODO_LIST.md`
   - `AIRPORT_ASSETS.md` (CSMIA 4-limb quad-runway masterplan)
   - `Mini Project/documentation/MD/Anay_Technical_Handoff_Guide.md`
   - `Mini Project/documentation/MD/Phase2_Backend_Architecture_Guide.md`
   - `Mini Project/documentation/MD/database_creation/` (ER diagrams, Relational mapping, Star schema)
   - `Lab/` Experiments 1 through 9 (SRS, Agile, UML Use Cases, Activity, Class, Sequence, Collaboration, DFDs, Testing)
3. Team Details & Roll Numbers:
   - Krishna Solanki (Roll No: I075) — Database & System Integration Lead
   - Chaitanya Tikku (Roll No: I078) — Documentation, UML & QA Testing Lead
   - Anuvrat Tripathi (Roll No: I080) — Frontend UI/UX Lead
   - Anay Modi (Roll No: I088) — Backend API & Logic Lead
4. Presentation Scale: 22 Slides covering the entire software engineering lifecycle from Lab 1 to Lab 9, full-stack architecture, 41-table relational database, live APIs, and operational consoles.

---

### SLIDE 1: Title & Executive Architecture Summary
- Title: Saphire AOCS — Airport Operations Coordination System
- Subtitle: Enterprise Multi-Terminal Airport Operations Coordination & Collaborative Decision Making (A-CDM) Platform
- Team Members & Roles:
  * Krishna Solanki (I075) — Database & System Integration Lead
  * Chaitanya Tikku (I078) — Documentation, UML & QA Testing Lead
  * Anuvrat Tripathi (I080) — Frontend UI/UX Lead
  * Anay Modi (I088) — Backend API & Logic Lead
- Executive System Scale & Engineering Highlights:
  * Database Architecture: 41 Relational Tables normalized in strict 3NF with 47 Foreign Key constraints.
  * Live Operational Dataset: 158,660+ production records managed via 20 versioned Flyway migrations (V1 to V20).
  * Backend Framework: Java 17 / Spring Boot 3.2.5 REST API with Spring Security RBAC & stateless JWT session governance.
  * Frontend Application: React 19 + TypeScript + Vite + Tailwind CSS + Material UI (MUI) across 16 dedicated web consoles.
  * Quality Assurance: 109 backend unit & integration tests passing with 0 database mocks during CI regression.

### SLIDE 2: Aerodrome Domain & Infrastructure Masterplan
- Physical Aerodrome Inspiration: Chhatrapati Shivaji Maharaj International Airport (CSMIA, Mumbai).
- Infrastructure Specifications:
  * Terminal Topology: Central core terminal with symmetrical 4-limb X-shaped concourses (Concourses A, B, C, D).
  * Radial Pier Contact Stands: 80+ simultaneous widebody (Code E/F: B777, A380) and narrowbody (Code C: A320, B737) contact stands with glass Passenger Boarding Bridges (PBB), 400Hz Ground Power Units (GPU), and Pre-Conditioned Air (PCA).
  * Quad-Runway Parallel Vector System: Runways 16L/16R (East complex) and 17L/23R (West complex) supporting independent simultaneous Instrument Flight Rules (IFR) departures and CAT-III ILS autoland arrivals.
  * Landside & Transit Facilities: Multi-Level Car Parking (MLCP) with automated slot occupancy sensors, landside transit loops, and dedicated Cargo Freight City.

### SLIDE 3: Lab 1 — Problem Definition & Operational Scope
- Real-World Operational Challenges in Modern Aviation:
  * Fragmented Data Silos: Disconnected communication between Airlines, Ground Handling Agencies (GHA), Air Traffic Control (ATC), Central Industrial Security Force (CISF), and Airport Commercial Billing.
  * Aircraft Turnaround Inefficiencies: Uncoordinated critical path activities (fueling, catering, cleaning, baggage handling) causing cascade delay propagation.
  * Gate & Stand Conflict Bottlenecks: Aircraft assigned to contact gates without automated wingspan or Maximum Takeoff Weight (MTOW) constraint validation.
  * Baggage Mishandling: Inability to track real-time IATA 10-digit bag tags across multi-point CT scan checkpoints.
- System Operational Boundaries:
  * Landside Processing (Check-in desks C01–C60, DigiYatra biometric turnstiles, Public Information).
  * Terminal Security & Emigration (3D CT Screening lanes, ATRS tray return, Emigration/Immigration clearance).
  * Airside Turnaround (Apron ground support equipment, fuel hydrants, turnaround task dispatch).
  * Commercial & Tariffs (Aeronautical landing tariffs, parking fees, aerobridge royalties, automated invoicing).

### SLIDE 4: Lab 1 — Agile User Stories & Acceptance Criteria
- Epic 1: Flight Dispatch & Collaborative Decision Making (A-CDM)
  * User Story: "As an AOCC Duty Manager, I want to monitor real-time turnaround progress bars for scheduled flights so that I can preemptively detect delay risks and log standardized IATA delay codes."
  * Acceptance Criteria: System calculates estimated off-block time (EOBT), tracks SLA task completion percentages, and records delay minutes linking specific IATA delay codes (e.g., Code 41: Aircraft Cabin Cleaning).
- Epic 2: Departure Control System (DCS) & Passenger Handling
  * User Story: "As a Check-in Agent at Counter C-14, I want to lookup passenger bookings by 6-character PNR or Passport, view real-time cabin seat availability, and weigh checked baggage to generate IATA thermal boarding passes and 10-digit bag tags."
  * Acceptance Criteria: PNR lookup returns linked traveler profile, seat map locks selected seat to prevent race conditions, and bag tags automatically create initial `CHECKIN_DESK` scan events.
- Epic 3: Airside Resource & Gate Management
  * User Story: "As an Airside Operations Officer, I want automated gate validation that blocks aircraft assignment if aircraft wingspan exceeds gate limits."
  * Acceptance Criteria: Backend queries `gate_assignment_rules`; if `aircraft.type.wingspan_meters > gate.max_wingspan_meters`, throws `409 Conflict` and logs airside conflict.
- Epic 4: Public Passenger Transparency
  * User Story: "As a passenger, I want to track my flight status in real time, trace my checked baggage milestones, and submit lost & found property claims."
  * Acceptance Criteria: Instant public search without authentication, redaction of sensitive traveler data, and issuance of tracked ticket IDs (`INQ-2026-XXXXX` / `LF-2026-XXXXX`).

### SLIDE 5: Lab 1 — Non-Functional Requirements (NFRs) & Architectural Constraints
- Performance & Scalability:
  * API Latency: 95th percentile REST API response time $\le 350\text{ ms}$ under concurrent load.
  * Pagination Bounds: Spring Data JPA `Pageable` capped at `max-page-size=100` to prevent memory exhaustion.
- Availability & Fault Tolerance:
  * Target Uptime: 99.9% high availability with stateless micro-service design and zero in-memory session locking.
- Security & Compliance:
  * Authentication: Stateless JWT signed with HMAC-SHA256 (32+ character dynamic key) tied to database session records (`auth_sessions`).
  * Server-Side Revocation: Single active session enforcement per staff user; concurrent login immediately revokes previous token.
  * Brute-Force Lockout: Per-username lockout (5 failed attempts / 15 min lock) and per-IP lockout (30 failed attempts / 15 min lock) via `LoginAttemptService`.
  * Passwords & PII: Passwords hashed with BCrypt (strength 10), never serialized into JSON responses; passport numbers masked showing only last 4 digits on operational manifests.
- Data Normalization:
  * Strict Third Normal Form (3NF) across all 41 relational tables with zero transitive dependencies.

### SLIDE 6: Lab 2 — Agile Process Model & Scrum Sprints
- Engineering Methodology: Agile Scrum Framework with 2-week sprint cycles, daily standups, sprint reviews, and continuous integration.
- Sprint Roadmap & Velocity Breakdown:
  * Sprint 1 (Sprint 1.0 — Architecture & Data Layer): Domain modeling, 3NF schema normalization, writing Flyway migrations V1 to V3, and synthesizing baseline aerodrome master data.
  * Sprint 2 (Sprint 2.0 — Security & Core APIs): Spring Boot REST services, Spring Security filter chains, JWT issuance, BCrypt credential management, and `auth_sessions` table.
  * Sprint 3 (Sprint 3.0 — Frontend Architecture & Public Portal): React 19 + Vite scaffolding, Tailwind CSS design tokens, Material UI component library, and 7 public pages (Home, 3D Tracker, Schedule, Services, Cargo, Directory, Contact).
  * Sprint 4 (Sprint 4.0 — Role Consoles & Business Workflows): Building 9 operational dashboards (DCS Check-in, AOCC Controller, Ground Ops, Airside Dispatch, Logistics BHS, Security Clearance, Airline Billing, System Admin).
  * Sprint 5 (Sprint 5.0 — Full-Stack Integration, Telemetry & Hardening): Live API wiring replacing all mock data, runway telemetry, shift handover logbook, 109 unit tests, and Docker Compose orchestration.

### SLIDE 7: Lab 3 — UML Use Case Model & System Boundary
- System Boundary: "Saphire Airport Operations Coordination System (AOCS)"
- Primary Actors (10 Stakeholder Roles):
  1. System Administrator
  2. Airport Operations Manager (AOCC)
  3. Ground Handling Supervisor
  4. Ramp Agent
  5. Gate Agent / Airside Dispatcher
  6. Baggage Handler
  7. Security Officer (CISF)
  8. Immigration Officer
  9. Check-in Agent
  10. Airline Billing Clerk
- Core Use Cases:
  * `UC-01: Authenticate Staff User`
  * `UC-02: Manage Flight Schedules`
  * `UC-03: Assign Gate & Stand`
  * `UC-04: Dispatch Aircraft Turnaround Tasks`
  * `UC-05: Process Passenger Check-In & Issue Boarding Pass`
  * `UC-06: Tag & Screen Checked Baggage`
  * `UC-07: Log Flight Delay & Assign IATA Code`
  * `UC-08: Execute Runway Telemetry & Friction Sweep`
  * `UC-09: Process Emigration & Security Clearance`
  * `UC-10: Compile Airline Tariff Invoices`
  * `UC-11: Submit & Reconcile Shift Handover Logbook`
- Stereotype Relationships:
  * `<<include>>`: "Process Passenger Check-In" $\ll\text{includes}\gg$ "Verify Travel Documents", "Assign Seat", and "Issue Boarding Pass".
  * `<<extend>>`: "Assign Gate & Stand" $\ll\text{extends}\gg$ "Detect Wingspan Conflict" (Condition: Aircraft wingspan > Gate limit).
  * `<<extend>>`: "Dispatch Turnaround" $\ll\text{extends}\gg$ "Log Delay Code" (Condition: Critical path task exceeds scheduled end time).

### SLIDE 8: Lab 3 — Formal Use Case Specifications
- Use Case Specification 1: UC-05 — "DCS Passenger Check-In & Boarding Pass Issuance"
  * Primary Actor: Check-in Agent (`CHECKIN_AGENT`).
  * Preconditions: Flight status is `SCHEDULED` or `BOARDING`; Counter is open and assigned to airline.
  * Main Flow:
    1. Agent inputs 6-character PNR code or Passport number into DCS console.
    2. System queries `passengers` and `travelers` tables and displays booking segment.
    3. Agent opens interactive aircraft seat map grid; system returns available vs. occupied seats.
    4. Agent selects seat (e.g. 14B); system reserves seat lock.
    5. Agent weighs luggage on smart scale; system checks allowance (15kg domestic / 25kg international).
    6. System persists record into `boarding_passes`, generates unique IATA PDF417 barcode, creates record in `bag_tags`, and logs initial scan event in `baggage_scan_events`.
    7. Thermal boarding pass ticket and bag tags are rendered for physical printing.
  * Postconditions: Seat status updated to `OCCUPIED`; Bag status updated to `CHECKED_IN`.
- Use Case Specification 2: UC-03 — "Automated Gate Allocation with Conflict Check"
  * Primary Actor: Airside Operations Officer / AOCC Duty Manager.
  * Main Flow: Agent selects scheduled flight and target gate; system verifies physical dimensions against `aircraft_types.wingspan_meters` and `gate_assignment_rules.max_wingspan_meters`; if valid, updates `flights.gate_id` and sets gate status to `OCCUPIED`.
  * Exception Flow (Conflict): If wingspan exceeds threshold, allocation is rejected with `409 Conflict`, error alert displayed on Airside conflict board.

### SLIDE 9: Lab 4 — UML Activity Diagram: Aircraft Turnaround Sequence
- Critical Path Modeling:
  * Initial State: Aircraft touches down on Runway 16L/17L $\rightarrow$ Taxi to assigned Stand/Gate.
  * Milestone 1: Aircraft On-Block (AOBT) $\rightarrow$ Wheel chocks placed $\rightarrow$ Jetbridge positioned $\rightarrow$ Deboarding commences.
  * Milestone 2 (Parallel Fork Node):
    - Lane A: Cabin Cleaning & Waste Servicing (`tasks.task_name = 'CABIN_CLEANING'`).
    - Lane B: Aircraft Refueling via Apron Hydrant (`fuel_logs` records density & liters).
    - Lane C: Inflight Catering High-Loader Docking (`tasks.task_name = 'CATERING_RELOAD'`).
    - Lane D: Inbound Baggage Offloading $\rightarrow$ Outbound Baggage Loading (`tasks.task_name = 'BAGGAGE_LOADING'`).
  * Milestone 3 (Synchronization Join Node): All 4 parallel servicing tasks must reach status `COMPLETED`.
  * Milestone 4: Passenger Boarding commences $\rightarrow$ Final loadsheet verified $\rightarrow$ Cargo doors closed $\rightarrow$ Jetbridge retracted.
  * Final State: Pushback tug connected $\rightarrow$ ATC pushback clearance granted $\rightarrow$ Actual Off-Block Time (AOBT) recorded $\rightarrow$ Flight status transitions to `AIRBORNE`.

### SLIDE 10: Lab 4 — UML Activity Diagram: Baggage Handling System (BHS) Lifecycle
- Baggage Handling Workflow:
  * Check-In Intake: Bag placed on conveyor scale $\rightarrow$ 10-digit IATA barcode tag attached (`bag_tags.tag_number`).
  * Infeed Conveyor & Initial Scan: `baggage_scan_events` logs `CHECKIN_DESK_14`.
  * Security Inspection (Decision Diamond): Inline 3D CT Explosives Detection System (EDS).
    - If Cleared $\rightarrow$ Proceed to High-Speed Tilt-Tray Sorter.
    - If Flagged $\rightarrow$ Route to Level 3 Manual Physical Inspection Area $\rightarrow$ Security Officer clearance log required.
  * Automated Sorter Dispatch: Sorter reads barcode $\rightarrow$ Diverts bag to specific Flight Makeup Lateral Pier.
  * Apron Transfer: Baggage handler scans tag (`APRON_TUG_TRANSFER`) $\rightarrow$ Loaded into Unit Load Device (ULD) container (`cargo_manifests`).
  * Aircraft Stowing: ULD locked into aircraft bulk cargo hold $\rightarrow$ Flight departs.
  * Destination Reclaim: Flight lands $\rightarrow$ Bag offloaded to arrival infeed belt $\rightarrow$ Scanned at Claim Carousel (`baggage_carousels.carousel_number = 'BC-04'`) $\rightarrow$ Passenger collects luggage.

### SLIDE 11: Lab 5 — UML Class Diagram & Domain Architecture
- JPA Domain Entity Hierarchy & Relationships:
  * `Flight` (Core Aggregate Root): Fields: `flightId`, `flightNumber`, `flightStatus`, `scheduledDepartureTime`, `actualDepartureTime`, `scheduledArrivalTime`, `aircraft`, `gate`, `stand`, `runway`, `originAirport`, `destinationAirport`.
  * `Aircraft` & `AircraftType`: `AircraftType` encapsulates physical constraints (`wingspanMeters`, `mtowKg`, `maxPassengerCapacity`); `Aircraft` holds operational registration (`registrationNumber`). Multiplicity: `AircraftType (1) ──── (*) Aircraft (1) ──── (*) Flight`.
  * `Gate` & `GateAssignmentRule`: `Gate` has `gateNumber`, `terminal`, `isOperational`; `GateAssignmentRule` establishes strict N-to-M type constraints. Multiplicity: `Gate (1) ──── (*) GateAssignmentRule (*) ──── (1) AircraftType`.
  * `TurnaroundTask`: Fields: `taskId`, `taskName`, `taskStatus`, `scheduledStart`, `scheduledEnd`, `actualStart`, `actualEnd`, `assignedUser`. Multiplicity: `Flight (1) ──── (*) TurnaroundTask`.
  * `Passenger` & `Traveler`: `Traveler` represents master human identity (Name, Passport, Nationality, Email); `Passenger` represents individual flight booking segment (PNR, Transit flag). Multiplicity: `Traveler (1) ──── (*) Passenger (1) ──── (1) BoardingPass & (1..*) BagTag`.
  * `ShiftHandoverLog`: Fields: `handoverId`, `shiftCode`, `department`, `outgoingSupervisor`, `incomingSupervisor`, `criticalEventsSummary`, `status`. Multiplicity: `Department (1) ──── (*) ShiftHandoverLog`.

### SLIDE 12: Lab 5 — Software Engineering Design Patterns Applied
- 1. Repository Pattern (Persistence Abstraction):
  * Utilizes Spring Data JPA interfaces (`FlightRepository`, `GateRepository`, `TaskRepository`, `UserRepository`) extending `JpaRepository` and `JpaSpecificationExecutor` for type-safe query execution and zero raw SQL in controllers.
- 2. Strategy Pattern (Aeronautical Tariff Billing Engine):
  * `AirlineBillingService` applies modular fee calculation algorithms based on aircraft MTOW, stand docking duration, jetbridge utilization, and passenger head-tax to dynamically construct `InvoiceLineItem` records.
- 3. Interceptor / Filter Chain Pattern (Security & Audit):
  * `JwtAuthFilter`: Intercepts every HTTP request, parses `Authorization: Bearer <token>`, validates token signature against `auth_sessions`, and populates Spring `SecurityContextHolder`.
  * `RequestLoggingFilter`: Captures incoming client IP, HTTP method, URI, response status, and execution duration in milliseconds.
- 4. Data Transfer Object (DTO) Pattern:
  * Strict decoupling between internal JPA entity models and external REST JSON contracts (e.g. `FlightDTO`, `CheckinLookupDTO`, `BoardingPassResponseDTO`, `ShiftHandoverDTO`) preventing circular serialization and over-fetching.

### SLIDE 13: Lab 6 — UML Sequence Diagram: Aircraft Turnaround Dispatch
- Lifeline Participants:
  `Actor: AOCC Controller` $\rightarrow$ `Boundary: AOCCControllerDashboard.tsx` $\rightarrow$ `Control: FlightOperationsController` $\rightarrow$ `Service: TurnaroundTaskService` $\rightarrow$ `Persistence: TaskRepository` $\rightarrow$ `Database: PostgreSQL 18` $\rightarrow$ `NotificationService` $\rightarrow$ `Actor: Ramp Supervisor`
- Step-by-Step Message Sequence:
  1. `getTurnaroundTimeline(flightId)` $\rightarrow$ Controller retrieves task list with calculated delay metrics.
  2. `updateTaskStatus(taskId, "IN_PROGRESS", timestamp)` $\rightarrow$ Service updates task status in DB.
  3. `detectOverdueTasks(flightId)` $\rightarrow$ Service checks if `actualEnd > scheduledEnd`.
  4. [Alt Frame: Task Overdue]: Service triggers `logDelayCode(flightId, delayCodeId, delayMinutes)` $\rightarrow$ Inserts record into `delay_logs`.
  5. `publishTaskUpdate(flightId, taskDTO)` $\rightarrow$ Push state to AOCC flight board and mobile ramp agent.

### SLIDE 14: Lab 6 — UML Sequence Diagram: DCS Check-In & Boarding Pass Issuance
- Lifeline Participants:
  `Actor: Check-In Agent` $\rightarrow$ `Boundary: CheckinAgentDashboard.tsx` $\rightarrow$ `Control: CheckinController` $\rightarrow$ `Service: CheckinService` $\rightarrow$ `Repository: BoardingPassRepository & BagTagRepository` $\rightarrow$ `DB: aocs_db`
- Interaction Steps:
  1. `POST /api/checkin/lookup { pnr: "PNR-8841" }` $\rightarrow$ Returns passenger booking, traveler name, flight ID.
  2. `GET /api/checkin/flights/{id}/seatmap` $\rightarrow$ Returns seat matrix (Occupied: 12A, 12B; Available: 14B).
  3. `POST /api/checkin/issue-boarding-pass { passengerId, seatNumber: "14B", bagWeight: 18.5 }`
  4. Service validates seat availability $\rightarrow$ Generates unique IATA ticket number & PDF417 payload.
  5. Service creates `BagTag` with 10-digit number (`BT-6E-99412`) and logs initial scan event.
  6. Atomic Transaction Commits $\rightarrow$ Returns `200 OK` with printable boarding pass card.

### SLIDE 15: Lab 7 — UML Collaboration / Communication Diagram
- Structural Communication Graph:
  * Focus: Numbered object message collaboration during Passenger Security Clearance & Boarding.
- Numbered Message Graph:
  1. `1: scanBoardingPass(barcode)` $\rightarrow$ Security Officer scans boarding pass at Checkpoint T2-SEC-04.
  2. `1.1: validateTicket(barcode)` $\rightarrow$ Security Controller queries `BoardingPassRepository`.
  3. `1.2: verifyEmigrationStatus(passengerId)` $\rightarrow$ Controller checks `ImmigrationRecord` table for international segments.
  4. `1.3: createClearanceLog(status = "APPROVED", method = "BARCODE_SCANNER")` $\rightarrow$ Inserts into `passenger_clearance_logs` with un-bypassable `ON DELETE RESTRICT` constraint.
  5. `1.4: notifyGateReader(passengerId, status)` $\rightarrow$ Gate terminal updates manifest showing passenger cleared for boarding.

### SLIDE 16: Lab 8 — Data Flow Diagrams (DFD Level 0 Context & Level 1 Subsystems)
- DFD Level 0 (Context Diagram):
  * Central Process: `0.0 Saphire Airport Operations Coordination System`
  * External Entities: Airlines, Passengers, Air Traffic Control (ATC), Ground Handling Agencies (GHA), Security Agencies (CISF/Customs), Commercial Accounting.
  * Inflows: Flight Schedules, Passenger Bookings, METAR Weather, Bag Tags, Gate Requests, Payment Confirmations.
  * Outflows: Flight Status Broadcasts (FIDS), IATA Boarding Passes, Turnaround Work Orders, Clearance Logs, Airline Invoices, Audit Streams.
- DFD Level 1 (Subsystem Decomposition):
  * `Process 1.0: Flight Operations & Turnaround Scheduling` (Interacts with `D1: Flights Data Store`, `D2: Tasks Data Store`).
  * `Process 2.0: Departure Control & Passenger Check-In` (Interacts with `D3: Passengers Store`, `D4: Boarding Passes Store`).
  * `Process 3.0: Baggage Reconciliation & BHS Tracking` (Interacts with `D5: Bag Tags Store`, `D6: Scan Events Store`).
  * `Process 4.0: Airside Resource & Runway Telemetry` (Interacts with `D7: Gates/Stands Store`, `D8: Runway Telemetry Store`).
  * `Process 5.0: Commercial Tariffs & Airline Invoicing` (Interacts with `D9: Billing Invoices Store`, `D10: Audit Logs Store`).

### SLIDE 17: Database Architecture: PostgreSQL Relational Schema (41 Tables)
- Relational Normalization: Strict Third Normal Form (3NF) across 6 core operational domains:
  1. Security & Identity Governance (5 tables): `roles`, `departments`, `users`, `user_phone_numbers`, `auth_sessions`.
  2. Aerodrome & Airfield Infrastructure (8 tables): `airlines`, `airports`, `aircraft_types`, `aircraft`, `gates`, `checkin_counters`, `stands`, `runways`.
  3. Flight Operations & Dispatch (5 tables): `weather_reports`, `gate_assignment_rules`, `flights`, `delay_codes`, `delay_logs`.
  4. Airside Turnaround & Ground Servicing (5 tables): `tasks`, `ground_equipment`, `equipment_assignments`, `fuel_logs`, `shift_handover_logs`.
  5. Passenger Journey & Baggage Lifecycle (12 tables): `travelers`, `passengers`, `boarding_passes`, `bag_tags`, `baggage_scan_events`, `mishandled_baggage`, `security_checkpoints`, `passenger_clearance_logs`, `immigration_records`, `lounge_visits`, `baggage_carousels`, `lost_and_found_items`.
  6. Commercial, Support & Audit (6 tables): `cargo_manifests`, `customer_feedback_logs`, `airline_billing_invoices`, `invoice_line_items`, `notifications`, `audit_logs`, `operational_inquiries`, `security_incidents`.
- Synthetic Dataset Scale: 158,660+ production records loaded via 20 automated Flyway migration scripts (`V1` to `V20`).
- Integrity & Optimization: 47 Foreign Key indexes, `ON DELETE RESTRICT` on legal audit tables, and zero orphan records.

### SLIDE 18: Database Architecture: Star Schema & OLAP Analytics
- Data Warehouse Dimensional Modeling:
  * Fact Table 1: `Fact_Flight_Turnaround` (Grain: One row per completed flight movement; Measures: `turnaround_duration_minutes`, `delay_minutes`, `fuel_liters_dispensed`, `turnaround_cost_usd`, `passenger_count`).
  * Fact Table 2: `Fact_Baggage_Movements` (Grain: One row per baggage scan event; Measures: `transit_time_minutes`, `weight_kg`, `mishandling_flag`).
  * Dimension Tables:
    - `Dim_Time` (Hour, Day, Month, Quarter, Year, Shift_Code, Is_Peak_Hour).
    - `Dim_Airline` (Airline_Name, IATA_Code, Country, Alliance).
    - `Dim_Aircraft_Type` (Manufacturer, Model_Name, Wingspan_Category, MTOW_Tier).
    - `Dim_Gate` (Gate_Number, Terminal, Concourse, Has_Jetbridge).
    - `Dim_Delay_Code` (Delay_Code, Category, Sub_Reason, IATA_Standard_Group).
- Analytical Query Capabilities: Hourly runway throughput, On-Time Performance (OTP %) by airline, gate occupancy heatmaps, and turnaround delay causality analysis.

### SLIDE 19: Technology Stack & Full-Stack API Integration
- Frontend Architecture:
  * Framework: React 19 + TypeScript + Vite.
  * Styling & UI Components: Tailwind CSS, Material UI (MUI 5), Lucide Icons, Custom Theme Provider (Sapphire Dark Theme).
  * State & API Communication: Axios HTTP client with request/response interceptors, reactive state hooks, React Router v6 with `ProtectedRoute` guards.
- Backend Architecture:
  * Language & Runtime: Java 17 (Pinned) / OpenJDK 17.
  * Framework: Spring Boot 3.2.5, Spring Security 6, Spring Data JPA, Hibernate 6, Jackson.
  * Build & Packaging: Maven Wrapper (`mvnw`), Docker Multi-Stage Builds, Nginx Reverse Proxy.
- Integration Integrity: 100% Live database wiring across all 16 pages; 0 static UI mock data remaining; centralized error handling via `@ControllerAdvice`.

### SLIDE 20: Lab 9 — Software Testing & Quality Assurance
- Automated Test Suite: 109 Backend Unit and Integration Tests executing under JUnit 5 and Mockito.
- Testing Techniques & Methodologies:
  * 1. Equivalence Partitioning (EP): Valid vs. invalid flight state transitions (e.g., `SCHEDULED` $\rightarrow$ `BOARDING` $\rightarrow$ `AIRBORNE` is VALID; `SCHEDULED` $\rightarrow$ `LANDED` directly is INVALID and rejected).
  * 2. Boundary Value Analysis (BVA): Gate wingspan validation ($65.00\text{m}$ max limit tested at $64.99\text{m}$ [PASS], $65.00\text{m}$ [PASS], and $65.01\text{m}$ [FAIL / 409 Conflict]); Baggage weight limits tested at $15.00\text{kg}$ and $25.00\text{kg}$ boundaries.
  * 3. State Machine & Transition Testing: Aircraft turnaround task dependency chain testing (Pushback blocked until cleaning and fueling tasks report `COMPLETED`).
  * 4. API Regression Testing: Postman test collection validating HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `409 Conflict`) across all 18 REST controllers.

### SLIDE 21: System Demonstration & Operational Consoles (16 Pages)
- Public Passenger Portal (7 Pages):
  * Home Page (`/`): Dynamic concourse telemetry bento and architectural overview.
  * Live Flight Tracker (`/tracker`): 3D interactive flight tracking and live status board.
  * Flight Timetable (`/schedule`): Real-time search, filter, and airline sorting.
  * Passenger Services (`/passenger-services`): Lost & found claims and terminal amenities.
  * Cargo Logistics (`/cargo`): Air waybill (AWB) freight tracking.
  * Airport Information (`/airport`): Aerodrome terminal maps and facility guide.
  * Support Desk (`/contact`): Live passenger inquiry submission returning tracked ticket numbers (`INQ-2026-XXXXX`).
- Role-Based Staff Consoles (9 Dedicated Dashboards):
  * 1. DCS Check-In Console (`/dashboard/check-in`): PNR passenger search, interactive cabin seat map, smart luggage scale, and IATA thermal boarding pass generation.
  * 2. AOCC Controller Console (`/dashboard/aocc`): Real-time turnaround Gantt chart, flight board, delay code logger, and gate allocation.
  * 3. Ground Operations Console (`/dashboard/ground-ops`): Active turnaround tasks, ramp equipment assignment, and staff workload distribution.
  * 4. Airside Operations Console (`/dashboard/airside-ops`): Stand occupancy heatmap, runway friction telemetry sweeps, and wingspan conflict alerts.
  * 5. Logistics & Cargo Console (`/dashboard/logistics`): Baggage reclaim carousel monitor (`BC-01` to `BC-16`) and cargo manifest management.
  * 6. Passenger Security Console (`/dashboard/passenger-security`): Biometric screening lanes, passenger clearance logs, and lost property vault.
  * 7. Airline Billing Console (`/dashboard/billing`): Landing tariffs, parking fees, aerobridge royalties, and automated invoice line-item compilation.
  * 8. System Administrator Console (`/dashboard/system-admin`): Staff directory, role governance, security audit log streams, and streaming report exporters (CSV/PDF/Excel).
  * 9. Department Ground Services Console (`/dashboard/department`): Departmental shift handovers and unserviceable equipment logs.

### SLIDE 22: Conclusion, Innovations & Future Scope
- Project Impact & Engineering Summary:
  * Delivered an enterprise-grade, full-stack aviation coordination platform compliant with all 15 academic requirements and 9 lab experiments.
  * Scaled to 41 relational tables, 158k+ production records, 16 dedicated web consoles, and 109 automated unit tests.
- Core Technical Innovations:
  * Automated physical wingspan-vs-gate conflict detection.
  * Single active session token security with instant server-side revocation (`auth_sessions`).
  * Live 8-hour shift handover logbook with digital supervisor sign-offs.
  * Real-time streaming multi-format report export engine (CSV, PDF, Excel).
- Future Roadmap:
  * Machine Learning Turnaround Delay Forecasting using Random Forest models trained on historical `delay_logs`.
  * IoT RFID Apron Vehicle Fleet Tracking via MQTT telemetry brokers.
  * Biometric DigiYatra facial recognition automated e-gates integration.
```
