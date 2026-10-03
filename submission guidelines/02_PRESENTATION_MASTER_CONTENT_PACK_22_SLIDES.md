# 02: Presentation Master Content Pack (22 Slides)
**Deck File**: `Submission Guidelines/I075_I078_I080_I088_Saphire_AOCS_Presentation.pptx`  
**Authors**: Krishna Solanki (I075), Chaitanya Tikku (I078), Anuvrat Tripathi (I080), Anay Modi (I088)  

---

### Slide 01: Title & Executive Summary
* **Category**: GRADUATE CAPSTONE PROJECT EVALUATION
* **Title**: SAPHIRE AOCS
* **Subtitle**: Airport Operations Coordination System: Master Capstone Platform
* **Overview Box**: A full-stack enterprise platform coordinating multi-terminal flight turnaround, dynamic gate assignment, departure control check-in, baggage reconciliation (BHS), runway telemetry, and airline billing.
* **Team Roster**:
  - Krishna Solanki (I075) - Database & System Integration Lead (PostgreSQL / Flyway / API Wiring)
  - Chaitanya Tikku (I078) - Documentation, UML & QA Testing Lead (SRS / Diagrams / Test Suite)
  - Anuvrat Tripathi (I080) - Frontend UI/UX Lead (React 19 / TypeScript / Material UI / Bento)
  - Anay Modi (I088) - Backend API & Logic Lead (Spring Boot 3 / RBAC Security / Dispatch)
* **Scale**: 41 Relational Tables (3NF), 158,660+ Seed Records (20 Migrations), 16 Web Consoles, 109 Backend Tests.
* **Speaker Notes**: "Welcome esteemed faculty evaluators. We present Saphire AOCS, an enterprise-grade full-stack airport operations platform developed across 9 laboratory experiments."

---

### Slide 02: Domain Analysis & Aerodrome Topology
* **Category**: DOMAIN ANALYSIS & AERODROME TOPOLOGY
* **Title**: Saphire International Mega-Aerodrome Masterplan
* **Subtitle**: Modeled after Chhatrapati Shivaji Maharaj International Airport (CSMIA, Mumbai) 4-limb quad-runway architecture.
* **Key Specifications**:
  - Terminal Topography: Central processing hub with 4 radial concourse limbs (Concourses A, B, C, D).
  - Radial Contact Stands: 80+ contact gates with dual/triple glass Passenger Boarding Bridges, 400Hz GPU, PCA.
  - Quad Parallel Runway System: Runways 16L/16R & 17L/23R for simultaneous independent IFR operations.
  - Baggage Transit Corridors: High-speed underground conveyor network with automated tray sorters.
  - Logistics & Cargo City: Multi-bay freight cargo terminal with HAZMAT vaults and customs staging.
* **Visual Attachment**: `balanced_4limb_quad_runway_airport_1785780879496.jpg`.

---

### Slide 03: Lab 1: Problem Definition & Operational Scope
* **Category**: LAB 01: REQUIREMENT ANALYSIS & PROBLEM FORMULATION
* **Title**: Problem Definition, Operational Scope & Boundaries
* **Subtitle**: Identifying critical pain-points across traditional airport operational silos.
* **Core Problem Cards**:
  1. Operational Silos & Latency: Disconnected legacy databases cause communication lag and cascade delays.
  2. Turnaround Bottlenecks: Critical-path ground activities lack unified Gantt scheduling and delay attribution.
  3. Gate Allocation Conflicts: Manual assignments lead to wingspan overruns and stand overcrowding.
  4. Baggage Tracing Deficits: Missing end-to-end IATA 10-digit barcode tracking across sorters and apron tugs.
  5. Commercial Tariff Invoicing: Manual tariff consolidation leads to billing leakage and revenue delay.
  6. Saphire AOCS Solution: Unified real-time A-CDM platform connecting landside, airside, security, and billing.

---

### Slide 04: Lab 1: Agile User Stories & Acceptance Criteria
* **Category**: LAB 01: REQUIREMENT ANALYSIS & AGILE SPECIFICATION
* **Title**: Agile User Stories & Acceptance Criteria
* **Subtitle**: Formal user stories mapping stakeholder goals to deterministic system acceptance tests.
* **Stories**:
  - AOCC Duty Controller: "Monitor live turnaround completion bars to detect delay risks and log IATA delay codes." -> Acceptance: Dynamic EOBT, IATA delay code linking, live progress bar.
  - DCS Check-In Agent: "Search bookings by PNR/Passport, select seats on cabin grid, weigh luggage, and issue IATA boarding passes." -> Acceptance: PNR lookup, seat lock, PDF417 barcode.
  - Airside Dispatcher: "Automated gate compatibility validation to prevent widebody assignments on narrow gates." -> Acceptance: Query gate rules, HTTP 409 rejection, stand occupancy heatmap.
  - Public Passenger: "Track flight status in real time, monitor baggage carousels, and submit lost and found claims." -> Acceptance: Public search, ticket generation (`INQ-2026-XXXXX`), carousel feed.

---

### Slide 05: Lab 1: Non-Functional Requirements (NFRs)
* **Category**: LAB 01: SYSTEM ARCHITECTURAL SPECIFICATIONS
* **Title**: Non-Functional Requirements (NFRs) & Security Model
* **Subtitle**: Engineering benchmarks for latency, security, data integrity, and fault tolerance.
* **NFR Cards**:
  - Performance & Latency: REST API response <= 350ms, JPA Pageable max 100, FK index optimization.
  - High Availability & Scalability: 99.9% uptime target, stateless Spring Boot services, Docker multi-stage builds.
  - Security & Session Governance: Stateless JWT (HMAC-SHA256), single active session per user (`auth_sessions`), BCrypt hashing.
  - Data Integrity & Normalization: Strict 3NF across 41 tables, ON DELETE RESTRICT on clearance records.

---

### Slide 06: Lab 2: Agile Scrum Process Model
* **Category**: LAB 02: SOFTWARE PROCESS METHODOLOGY
* **Title**: Agile Scrum Process Model & Sprint Cadence
* **Subtitle**: Iterative 2-week sprint breakdown from domain modeling to production deployment.
* **Sprint Breakdown**:
  - Sprint 1.0 (Weeks 1-2): Domain & Relational Core (3NF design, Flyway V1-V3, aerodrome seeds).
  - Sprint 2.0 (Weeks 3-4): Backend Services & Auth (Spring Boot REST, JWT RBAC, session governance).
  - Sprint 3.0 (Weeks 5-6): UI Scaffolding & Public Portal (React 19 + TypeScript, 7 public pages).
  - Sprint 4.0 (Weeks 7-8): Role Consoles & Workflows (9 staff dashboards, DCS Check-in, AOCC Gantt).
  - Sprint 5.0 (Weeks 9-10): Integration, Testing & Deploy (109 unit tests, Docker Compose).

---

### Slide 07: Lab 3: UML Use Case Model
* **Category**: LAB 03: OBJECT-ORIENTED MODELING
* **Title**: UML Use Case Model & 10 Stakeholder Actors
* **Subtitle**: Comprehensive use case model establishing system boundaries and stereotype associations.
* **Actors**: System Admin, AOCC Duty Manager, Ground Ops Supervisor, Ramp Agent, Airside Dispatcher, Check-In Agent, Baggage Handler, Security Officer (CISF), Immigration Officer, Airline Billing Clerk.
* **Stereotypes**:
  - `<<include>>`: UC-05 (Check-In) includes Verify Documents, Assign Seat, Issue Boarding Pass.
  - `<<extend>>`: UC-03 (Assign Gate) extends Detect Wingspan Conflict.
  - `<<extend>>`: UC-04 (Dispatch Turnaround) extends Log Delay Code.
  - `<<include>>`: UC-09 (Board Passenger) includes Verify Security Clearance.

---

### Slide 08: Lab 3: Detailed Use Case Specifications
* **Category**: LAB 03: USE CASE SPECIFICATIONS
* **Title**: Formal Use Case Specifications & Exception Workflows
* **Subtitle**: Detailed pre/post conditions, trigger events, and exception branching for core operations.
* **Specifications**:
  - UC-05 (DCS Check-In): PNR query -> interactive seat selection -> scale weight capture -> PDF417 boarding pass + bag tag issue -> Exception: Duplicate seat lock returns HTTP 409.
  - UC-03 (Gate Allocation): Target flight selection -> wingspan & MTOW verification against `gate_assignment_rules` -> gate assignment -> Exception: Wingspan conflict returns HTTP 409.

---

### Slide 09: Lab 4: UML Activity Diagram: Aircraft Turnaround
* **Category**: LAB 04: BEHAVIORAL & WORKFLOW MODELING
* **Title**: UML Activity Diagram: Aircraft Turnaround Workflow
* **Subtitle**: Critical path coordination with parallel fork-join synchronization across apron ground services.
* **Phases**:
  - Phase 1: Inbound touchdown, taxi to stand, chocks positioned, jetbridge docked.
  - Phase 2: Parallel Servicing Fork: Lane A (Cabin Cleaning), Lane B (Apron Refueling), Lane C (Inflight Catering), Lane D (Baggage Handling).
  - Phase 3: Synchronization Join Bar (All 4 parallel services must report status = COMPLETED).
  - Phase 4: Outbound boarding, loadsheet verification, cargo door closure, pushback.

---

### Slide 10: Lab 4: UML Activity Diagram: Baggage Handling Lifecycle
* **Category**: LAB 04: BEHAVIORAL & WORKFLOW MODELING
* **Title**: UML Activity Diagram: Baggage Reconciliation Lifecycle
* **Subtitle**: End-to-end baggage tracking pipeline from landside induction to airside loading and reclaim.
* **5 Stages**:
  1. Check-In & Bag Tag Induction (10-digit IATA barcode generated).
  2. Security Screening & Inline 3D CT (Threat detection branching).
  3. Sortation & Make-Up Area (Sorter chute routing into ULD).
  4. Apron Ramp Loading & Reconciliation (Reconciled against checked-in passenger status).
  5. Arrival Carousel Induction (Offloaded to reclaim carousel).

---

### Slide 11: Lab 5: UML Class Diagram & Domain Architecture
* **Category**: LAB 05: STRUCTURAL ARCHITECTURE
* **Title**: UML Class Diagram & Domain Entity Relationships
* **Subtitle**: Object-oriented domain model with multiplicity, inheritance, and encapsulation boundaries.
* **Entities**: `Flight`, `AircraftType`, `Aircraft`, `Gate`, `GateAssignmentRule`, `Passenger`, `BoardingPass`, `TurnaroundTask`, `GroundEquipment`.
* **Embedded Diagram**: `Figure 5 - Class Diagram.png`.

---

### Slide 12: Lab 5: Software Engineering Design Patterns Applied
* **Category**: LAB 05: OBJECT-ORIENTED DESIGN PATTERNS
* **Title**: Software Engineering Design Patterns in Saphire AOCS
* **Subtitle**: Enterprise design patterns applied across persistence, business logic, and security layers.
* **Patterns**:
  1. Repository Pattern: Spring Data JPA type-safe persistence abstraction.
  2. Strategy Pattern: Airline tariff calculations (MTOW, stand duration, passenger head-tax).
  3. Interceptor / Filter Chain: `JwtAuthFilter` & `RequestLoggingFilter` for token validation and audit logging.
  4. Data Transfer Object (DTO) Pattern: Decoupling internal entity persistence from REST JSON contracts.

---

### Slide 13: Lab 6: UML Sequence Diagram: Turnaround Coordination
* **Category**: LAB 06: DYNAMIC & INTERACTION MODELING
* **Title**: UML Sequence Diagram: Flight Turnaround & Delay Logging
* **Subtitle**: Time-ordered interaction sequence coordinating AOCC controller actions, service logic, and database state.
* **Lifelines**: AOCC Controller -> AOCCDashboard.tsx -> FlightOperationsController -> TurnaroundTaskService -> TaskRepository -> PostgreSQL DB.
* **Embedded Diagram**: `Figure 6 - Sequence Diagram.png`.

---

### Slide 14: Lab 6: UML Sequence Diagram: Check-In & Boarding Pass
* **Category**: LAB 06: DYNAMIC & INTERACTION MODELING
* **Title**: UML Sequence Diagram: DCS Check-In & IATA Boarding Pass
* **Subtitle**: Time-ordered interaction sequence for passenger booking lookup, seat map locking, and barcode generation.
* **Phases**: Passenger lookup -> Visual seat map query -> Boarding pass & tag generation -> Atomic 3-table transaction commit (`boarding_passes`, `bag_tags`, `baggage_scan_events`).

---

### Slide 15: Lab 7: UML Collaboration / Communication Diagram
* **Category**: LAB 07: COLLABORATIVE OBJECT INTERACTION
* **Title**: UML Collaboration / Communication Diagram
* **Subtitle**: Object structural collaboration with numbered message exchanges during passenger security clearance.
* **Numbered Messages**: `scanBoardingPass(barcode)` -> `validateTicket()` -> `verifyEmigration()` -> `createClearanceLog(status='APPROVED')` -> `updateGateManifest('CLEARED')`.
* **Embedded Diagram**: `Figure 7 - Collaboration Diagram.png`.

---

### Slide 16: Lab 8: Data Flow Diagrams (DFD Level 0 & Level 1)
* **Category**: LAB 08: DATA FLOW ARCHITECTURE
* **Title**: Data Flow Diagrams: DFD Level 0 & Level 1 Subsystems
* **Subtitle**: Context-level entity boundaries and functional subsystem data transformations.
* **Components**: DFD Level 0 Context Diagram (Airport boundaries) and DFD Level 1 Decomposition (Flight Ops, Check-in, BHS Baggage, Airside Servicing, Billing).
* **Embedded Diagrams**: `Figure 8.1 - DFD Level 0.png` & `Figure 8.2 - DFD Level 1.png`.

---

### Slide 17: Database Architecture: Relational Schema (41 Tables)
* **Category**: DATABASE ENGINEERING & SCHEMA DESIGN
* **Title**: PostgreSQL 18 Relational Architecture (41 Tables in 3NF)
* **Subtitle**: Enterprise relational database with 158,660+ records managed via 20 Flyway migrations.
* **6 Domains**:
  1. Security & Identity Governance (5 tables: `roles`, `departments`, `users`, `user_phone_numbers`, `auth_sessions`).
  2. Aerodrome & Airfield Infrastructure (8 tables: `airlines`, `airports`, `aircraft_types`, `aircraft`, `gates`, `checkin_counters`, `stands`, `runways`).
  3. Flight Operations & Dispatch (5 tables: `weather_reports`, `gate_assignment_rules`, `flights`, `delay_codes`, `delay_logs`).
  4. Airside Turnaround & Ground Servicing (5 tables: `tasks`, `ground_equipment`, `equipment_assignments`, `fuel_logs`, `shift_handover_logs`).
  5. Passenger Journey & Baggage Lifecycle (12 tables: `travelers`, `passengers`, `boarding_passes`, `bag_tags`, `baggage_scan_events`, `mishandled_baggage`, `checkpoints`, `clearance_logs`, `immigration_records`, `lounge_visits`, `carousels`, `lost_and_found`).
  6. Commercial, Support & Audit (6 tables: `cargo_manifests`, `feedback_logs`, `billing_invoices`, `invoice_line_items`, `operational_inquiries`, `audit_logs`).
* **Embedded Diagram**: `Figure 9 - Relational Schema.png`.

---

### Slide 18: Database Architecture: Star Schema & OLAP Analytics
* **Category**: DATABASE ENGINEERING & DATA WAREHOUSE
* **Title**: Star Schema Dimensional Architecture for OLAP Analytics
* **Subtitle**: De-normalized dimensional model optimized for operational KPI reporting and business intelligence.
* **Fact & 10 Dimensions**:
  - Central Fact: `FACT_FLIGHT_TURNAROUND` (16 KPI measures including planned/actual turnaround mins, variance, efficiency %, delay minutes, baggage processed, fuel liters, task completion rate).
  - 10 Conformed Dimensions: `DIM_TIME`, `DIM_FLIGHT`, `DIM_AIRCRAFT`, `DIM_GATE`, `DIM_RUNWAY`, `DIM_USER`, `DIM_DEPARTMENT`, `DIM_ROLE`, `DIM_PASSENGER`, `DIM_LOGISTICS`.
* **Embedded Diagram**: `Figure 10 - Star Schema.png`.

---

### Slide 19: Technology Stack & Full-Stack Integration
* **Category**: SYSTEM IMPLEMENTATION & FULL-STACK INTEGRATION
* **Title**: Full-Stack Technology Stack & Architecture
* **Subtitle**: Modern microservice-ready full-stack architecture with 100% live database wiring.
* **Stack**:
  - Frontend: React 19 + TypeScript + Vite, Tailwind CSS + Material UI (MUI), Axios with JWT interceptors, 16 Dedicated Web Consoles.
  - Backend: Java 17 + Spring Boot 3.2.5, Spring Security 6 with stateless JWT, Hibernate 6 ORM, 18 REST Controllers, `@ControllerAdvice` global error handling.
  - Database & Infra: PostgreSQL 18 Relational Engine, 20 Versioned Flyway Migrations, Single active session governance (`auth_sessions`), Docker Compose, Nginx.

---

### Slide 20: Lab 9: Software Testing & Quality Assurance
* **Category**: LAB 09: VERIFICATION & QUALITY ASSURANCE
* **Title**: Software Testing Suite & Quality Assurance Metrics
* **Subtitle**: 109 automated unit and integration tests implementing formal testing techniques.
* **Test Suites**:
  1. Equivalence Partitioning (EP): Valid vs. invalid flight state transitions (e.g. `SCHEDULED -> BOARDING -> AIRBORNE` valid; direct jump to `LANDED` rejected).
  2. Boundary Value Analysis (BVA): Gate wingspan thresholds (65.00m tested at 64.99m, 65.00m, 65.01m) and baggage weight limits.
  3. State Machine & Transition Tests: Task dependencies enforcing pushback lock until fueling and cleaning are COMPLETED.
  4. Automated Regression Suite: 109 JUnit 5 + Mockito tests covering session revocation, gate locks, and delay logs.

---

### Slide 21: System Demonstration & Operational Consoles (16 Pages)
* **Category**: SYSTEM DEMONSTRATION & USER INTERFACES
* **Title**: Live Operational Consoles & Public Passenger Portal
* **Subtitle**: 16 dedicated web consoles providing role-tailored workflows across all aerodrome functions.
* **7 Public Pages**: Home Overview, Live Flight Tracker, Flight Timetable, Passenger Services, Cargo Logistics, Airport Guide, Support Helpdesk.
* **9 Staff Consoles**: DCS Check-In Desk, AOCC Controller, Ground Ops Supervisor, Airside Operations, Logistics & BHS, Passenger Security, Airline Billing, System Admin, Department Services.

---

### Slide 22: Conclusion, Innovations & Future Scope
* **Category**: PROJECT SUMMARY & FUTURE OUTLOOK
* **Title**: Conclusion, Key Innovations & Future Roadmap
* **Subtitle**: Summary of engineering achievements and roadmap for next-generation smart airport extensions.
* **Key Innovations**:
  - Automated wingspan-vs-gate physical conflict detection engine.
  - Single active session security with server-side revocation (`auth_sessions`).
  - 8-Hour airfield shift handover logbook with digital supervisor sign-offs.
  - Multi-format streaming report exporter (CSV, PDF, Excel).
* **Future AI & IoT Roadmap**: Random Forest turnaround delay prediction, RFID apron vehicle tracking over MQTT, Biometric DigiYatra facial recognition e-gates.
