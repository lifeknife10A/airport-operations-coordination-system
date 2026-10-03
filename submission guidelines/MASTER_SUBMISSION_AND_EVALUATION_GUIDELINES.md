# Master Submission, Presentation, and Viva Evaluation Handbook
**Project Title**: Saphire AOCS (Airport Operations Coordination System)  
**Academic Level**: Graduate Software Engineering / Semester Software Engineering Project Evaluation  
**Target Folder**: `/Users/krish/Desktop/Software Engineering/Submission Guidelines`  

---

## 1. Official Team Roster and Technical Ownership

| Member Name | Roll Number | Primary Academic Role | Core Subsystem Ownership |
| :--- | :--- | :--- | :--- |
| **Krishna Solanki** | **I075** | Database & System Integration Lead | PostgreSQL 18 Architecture (41 tables in 3NF), 20 Flyway Migrations, 158k+ Seed Records, REST API Integration Wiring, Data Warehousing (Star Schema & Information Package) |
| **Chaitanya Tikku** | **I078** | Documentation, UML & QA Testing Lead | SRS Technical Specifications, UML Diagrams (Use Case, Activity, Class, Sequence, Collaboration, DFDs), 109 Automated JUnit 5 / Mockito QA Test Suite |
| **Anuvrat Tripathi** | **I080** | Frontend UI/UX Lead | React 19 + TypeScript Application, Vite Toolchain, Tailwind CSS, Material UI (MUI), Bento Grid Architecture, 16 Dedicated Web Consoles (7 Public + 9 Role Consoles) |
| **Anay Modi** | **I088** | Backend API & Logic Lead | Java 17 (Pinned JDK), Spring Boot 3.2.5 REST Microservices (18 Controllers), Spring Security 6 Stateless JWT RBAC, Single Active Session Governance (`auth_sessions`), Turnaround Critical Path Dispatch Logic |

---

## 2. Official Submission Rules and Class Representative (CR) Transcriptions

### Audio Note 1: Viva and Slide Deck Requirements
> *"Hello everyone. For the Software Engineering project evaluation, please make sure your presentation slide deck contains between 20 to 25 slides. Do not make it too short (under 15 slides) because the evaluator needs to see the depth across all semester lab experiments from Lab 1 to Lab 9.*
> 
> *The evaluation will be conducted through a formal viva. The faculty examiner will inspect your slides, ask deep technical questions on your UML models, database schema, and design patterns, and cross-examine your live code. Make sure all diagrams are clean, clear, and readable with zero clutter."*

### Audio Note 2: Video Demonstration Requirements
> *"Regarding the project demonstration video: you must record a 5 to 6 minute live screen recording walkthrough of your project.*
> 
> *For a 4-member group, each member should speak for approximately 1 minute and 15 to 20 seconds. Each person must explain their specific module (Frontend, Backend, Database, QA/Documentation) while demonstrating the live running software. You can show your webcam or record a clear voiceover over the live screen walkthrough. Ensure the video covers the live web application on localhost and proves zero mock data."*

### Key Submission Criteria:
1. **Slide Count**: Exactly 22 slides (within the mandatory 20 to 25 slide window).
2. **Design Standard**: Academic monochrome/dark aviation theme, zero emojis, standard punctuation (no em dashes or artificial formatting), crisp high-contrast layout.
3. **Database Scope**: Complete 41-table normalized 3NF schema in PostgreSQL 18 with 158,660+ seed records, plus OLAP Star Schema with 10 conformed dimensions.
4. **Live Code Verification**: Full-stack running locally on `http://localhost:3000` (Vite) and `http://localhost:8080` (Spring Boot).
5. **Video Demo**: Exactly 5:30 minutes with 4 equal speaking slots (1:20 each).

---

## 3. Master Slide-by-Slide Presentation Structure (22 Slides)

The presentation deck is compiled at:
`Submission Guidelines/I075_I078_I080_I088_Saphire_AOCS_Presentation.pptx`

### Slide 01: Title & Executive Summary
* **Header**: Software Engineering Project Evaluation
* **Title**: SAPHIRE AOCS: Airport Operations Coordination System
* **Subtitle**: A full-stack enterprise platform coordinating multi-terminal flight turnaround, dynamic gate assignment, departure control check-in, baggage reconciliation (BHS), runway telemetry, and airline billing.
* **Team Details**: Krishna Solanki (I075), Chaitanya Tikku (I078), Anuvrat Tripathi (I080), Anay Modi (I088).
* **Scale**: 41 Tables in 3NF, 158,660+ Seed Records, 16 Web Consoles, 109 Backend Unit Tests.
* **Speaker Notes**: Formal greeting and introduction of the team and system scope.

### Slide 02: Aerodrome Domain & Master Plan
* **Header**: Domain Analysis & Aerodrome Topology
* **Title**: Saphire International Mega-Aerodrome Masterplan
* **Subtitle**: Modeled after CSMIA Mumbai 4-limb quad-runway architecture.
* **Specs**: Central hub with 4 concourse limbs (A, B, C, D), 80+ contact stands, quad parallel runways (16L/16R & 17L/23R), underground BHS tunnels, cargo city.
* **Visual**: `balanced_4limb_quad_runway_airport_1785780879496.jpg`.

### Slide 03: Lab 1: Problem Definition & Operational Scope
* **Header**: Lab 01: Requirement Analysis & Problem Formulation
* **Title**: Problem Definition, Operational Scope & Boundaries
* **Content**: 6 operational silos:
  1. Operational silos & communication latency.
  2. Turnaround critical-path bottlenecks.
  3. Gate allocation wingspan/weight conflicts.
  4. Baggage tracing deficits (missing IATA Res 753 compliance).
  5. Commercial tariff invoicing leakage.
  6. Saphire AOCS real-time A-CDM solution.

### Slide 04: Lab 1: User Stories & Acceptance Criteria
* **Header**: Lab 01: Requirement Analysis & Agile Specification
* **Title**: Agile User Stories & Acceptance Criteria
* **Content**: 4 Core Personas:
  - AOCC Duty Controller (Live turnaround Gantt, delay code tagging).
  - DCS Check-In Agent (PNR lookup, seat map lock, IATA thermal boarding pass).
  - Airside Dispatcher (Automated wingspan compatibility validation).
  - Public Passenger (Live flight tracker, lost and found claims).

### Slide 05: Lab 1: Non-Functional Requirements (NFRs)
* **Header**: Lab 01: System Architectural Specifications
* **Title**: Non-Functional Requirements (NFRs) & Security Model
* **Content**:
  - Performance: Sub-350ms response times, JPA pageable max 100, FK index optimization.
  - High Availability: 99.9% uptime, stateless microservices, Docker Compose.
  - Security: Stateless JWT HMAC-SHA256, single active session enforcement (`auth_sessions`), BCrypt hashing.
  - Data Integrity: Strict 3NF across 41 tables, ON DELETE RESTRICT on legal clearance records.

### Slide 06: Lab 2: Agile Scrum Process Model
* **Header**: Lab 02: Software Process Methodology
* **Title**: Agile Scrum Process Model & Sprint Cadence
* **Content**: 5 Sprints over 10 weeks:
  - Sprint 1.0 (Weeks 1-2): Domain & Relational Core (3NF schema, Flyway V1-V3).
  - Sprint 2.0 (Weeks 3-4): Backend Services & Auth (Spring Boot REST, JWT RBAC).
  - Sprint 3.0 (Weeks 5-6): UI Scaffolding & Public Portal (React 19 + TypeScript, 7 public pages).
  - Sprint 4.0 (Weeks 7-8): Role Consoles & Workflows (9 staff consoles, DCS, AOCC Gantt).
  - Sprint 5.0 (Weeks 9-10): Integration, Testing & Deploy (109 tests, Docker orchestration).

### Slide 07: Lab 3: UML Use Case Model
* **Header**: Lab 03: Object-Oriented Modeling
* **Title**: UML Use Case Model & 10 Stakeholder Actors
* **Content**: 10 primary actors and formal stereotypes:
  - `<<include>>`: UC-05 (Check-In) includes Verify Documents, Assign Seat, Issue Boarding Pass.
  - `<<extend>>`: UC-03 (Assign Gate) extends Detect Wingspan Conflict.
  - `<<extend>>`: UC-04 (Dispatch Turnaround) extends Log Delay Code.
  - `<<include>>`: UC-09 (Board Passenger) includes Verify Security Clearance.

### Slide 08: Lab 3: Detailed Use Case Specifications
* **Header**: Lab 03: Use Case Specifications
* **Title**: Formal Use Case Specifications & Exception Workflows
* **Content**: Detailed specs for UC-05 (DCS Check-in) and UC-03 (Gate Allocation), including actors, preconditions, main flow steps, postconditions, and HTTP 409 exception branching.

### Slide 09: Lab 4: UML Activity Diagram: Turnaround
* **Header**: Lab 04: Behavioral & Workflow Modeling
* **Title**: UML Activity Diagram: Aircraft Turnaround Workflow
* **Content**: Critical-path flow with fork-join synchronization:
  - Phase 1: Inbound touchdown and taxi.
  - Phase 2: Parallel fork servicing (Cabin Cleaning, Apron Refueling, Inflight Catering, Baggage Handling).
  - Phase 3: Synchronization join node (all 4 streams report COMPLETED).
  - Phase 4: Outbound boarding and pushback.

### Slide 10: Lab 4: UML Activity Diagram: Baggage Reconciliation
* **Header**: Lab 04: Behavioral & Workflow Modeling
* **Title**: UML Activity Diagram: Baggage Reconciliation Lifecycle
* **Content**: IATA Resolution 753 compliant 5-stage tracking:
  1. Check-In Desk induction.
  2. Inline 3D CT screening (threat detection branching).
  3. Sortation & ULD make-up lateral.
  4. Apron ramp loading & reconciliation against passenger boarding.
  5. Arrival carousel induction.

### Slide 11: Lab 5: UML Class Diagram
* **Header**: Lab 05: Structural Architecture
* **Title**: UML Class Diagram & Domain Entity Relationships
* **Content**: Domain entities (`Flight`, `AircraftType`, `Gate`, `Passenger`, `TurnaroundTask`) with multiplicity associations.
* **Embedded Image**: `Figure 5 - Class Diagram.png`.

### Slide 12: Lab 5: Software Engineering Design Patterns
* **Header**: Lab 05: Object-Oriented Design Patterns
* **Title**: Software Engineering Design Patterns in Saphire AOCS
* **Content**:
  1. Repository Pattern (Spring Data JPA interfaces).
  2. Strategy Pattern (Airline tariff calculation).
  3. Filter Chain Pattern (JWT authentication & request logging).
  4. Data Transfer Object (DTO) Pattern (Decoupling entity models from REST JSON).

### Slide 13: Lab 6: UML Sequence Diagram: Turnaround Coordination
* **Header**: Lab 06: Dynamic & Interaction Modeling
* **Title**: UML Sequence Diagram: Flight Turnaround & Delay Logging
* **Content**: Interaction lifelines across UI, Controller, Service, and PostgreSQL DB with alternative execution frames for delay attribution.
* **Embedded Image**: `Figure 6 - Sequence Diagram.png`.

### Slide 14: Lab 6: UML Sequence Diagram: Check-In & Boarding Pass
* **Header**: Lab 06: Dynamic & Interaction Modeling
* **Title**: UML Sequence Diagram: DCS Check-In & IATA Boarding Pass
* **Content**: Time-ordered steps for passenger lookup, seat map locking, PDF417 barcode generation, and atomic 3-table commit.

### Slide 15: Lab 7: UML Collaboration Diagram
* **Header**: Lab 07: Collaborative Object Interaction
* **Title**: UML Collaboration / Communication Diagram
* **Content**: Numbered message graph during passenger security screening at checkpoint T2-SEC-04.
* **Embedded Image**: `Figure 7 - Collaboration Diagram.png`.

### Slide 16: Lab 8: Data Flow Diagrams (DFD Level 0 & Level 1)
* **Header**: Lab 08: Data Flow Architecture
* **Title**: Data Flow Diagrams: DFD Level 0 & Level 1 Subsystems
* **Content**: DFD Level 0 Context Diagram side-by-side with DFD Level 1 Subsystem Decomposition across 5 functional processes.
* **Embedded Images**: `Figure 8.1 - DFD Level 0.png` & `Figure 8.2 - DFD Level 1.png`.

### Slide 17: Database Architecture: Relational Schema (41 Tables)
* **Header**: Database Engineering & Schema Design
* **Title**: PostgreSQL 18 Relational Architecture (41 Tables in 3NF)
* **Content**: All 41 tables grouped into 6 functional domains:
  1. Security & Identity Governance (5 tables).
  2. Aerodrome & Airfield Infrastructure (8 tables).
  3. Flight Operations & Dispatch (5 tables).
  4. Airside Turnaround & Ground Servicing (5 tables).
  5. Passenger Journey & Baggage Lifecycle (12 tables).
  6. Commercial, Support & Audit (6 tables).
* **Embedded Image**: `Figure 9 - Relational Schema.png`.

### Slide 18: Database Architecture: Star Schema & Data Warehouse
* **Header**: Database Engineering & Data Warehouse
* **Title**: Star Schema Dimensional Architecture for OLAP Analytics
* **Content**: Multi-dimensional OLAP model centered on `FACT_FLIGHT_TURNAROUND` surrounded by 10 conformed dimensions (`DIM_TIME`, `DIM_FLIGHT`, `DIM_AIRCRAFT`, `DIM_GATE`, `DIM_RUNWAY`, `DIM_USER`, `DIM_DEPARTMENT`, `DIM_ROLE`, `DIM_PASSENGER`, `DIM_LOGISTICS`).
* **Embedded Image**: `Figure 10 - Star Schema.png`.

### Slide 19: Technology Stack & Full-Stack Integration
* **Header**: System Implementation & Full-Stack Integration
* **Title**: Full-Stack Technology Stack & Architecture
* **Content**:
  - Frontend: React 19, TypeScript, Vite, Tailwind CSS, Material UI (MUI), 16 Consoles.
  - Backend: Java 17, Spring Boot 3.2.5, Spring Security 6, Hibernate 6, 18 REST Controllers.
  - Database & Infra: PostgreSQL 18, 20 Flyway Migrations, Docker Compose, Nginx.

### Slide 20: Lab 9: Software Testing & Quality Assurance
* **Header**: Lab 09: Verification & Quality Assurance
* **Title**: Software Testing Suite & Quality Assurance Metrics
* **Content**: 109 automated tests implementing Equivalence Partitioning, Boundary Value Analysis (gate wingspans, baggage weights), State Machine tests, and full regression pass.

### Slide 21: System Demonstration & 16 Web Consoles
* **Header**: System Demonstration & User Interfaces
* **Title**: Live Operational Consoles & Public Passenger Portal
* **Content**:
  - 7 Public Pages: Home, Live Flight Tracker, Timetable, Passenger Services, Cargo, Airport Guide, Support.
  - 9 Staff Consoles: DCS Check-in, AOCC Controller, Ground Ops, Airside Ops, Logistics/BHS, Security, Billing, System Admin, Department Services.

### Slide 22: Conclusion, Innovations & Future Scope
* **Header**: Project Summary & Future Outlook
* **Title**: Conclusion, Key Innovations & Future Roadmap
* **Content**: Key engineering innovations (wingspan conflict engine, session revocation, shift handover logbook), future AI/IoT roadmap (ML delay forecasting, RFID telemetry), and formal viva thank you.

---

## 4. Four-Member Master Video Walkthrough Script (5:30 Total)

### Video Setup
* **Total Duration**: Exactly 5 minutes 30 seconds.
* **Format**: Full-screen 1080p recording of the live application (`http://localhost:3000`) with group member voiceover or webcam PIP overlay.
* **Pacing**: 1 minute 20 seconds per group member with 10-second transition buffers.

---

### Segment 1: Krishna Solanki (I075) - Database & Data Architecture (0:00 - 1:20)
* **Visual on Screen**: 
  - `0:00 - 0:25`: Slide 1 (Project Title & Roster), transitioning to Slide 17 (`Figure 9 - Relational Schema`).
  - `0:25 - 0:55`: Terminal showing `\dt` in PostgreSQL (listing 41 tables) and Flyway migration history (`SELECT * FROM flyway_schema_history`).
  - `0:55 - 1:20`: Slide 18 (`Figure 10 - Star Schema`) showing `FACT_FLIGHT_TURNAROUND` and the 10 conformed dimensions.
* **Spoken Script**:
  > *"Hello esteemed faculty evaluators. I am Krishna Solanki (Roll Number I075), Database and System Integration Lead for Saphire AOCS.*
  > 
  > *Our backend relies on PostgreSQL 18, architected across 41 relational tables in strict Third Normal Form. To ensure automated reproducibility, our schema is bootstrapped via 20 versioned Flyway migrations populated with over 158,000 live operational records.*
  > 
  > *We separated our architecture into 6 core domains: Security, Airfield Infrastructure, Flight Operations, Airside Servicing, Baggage Lifecycle, and Commercial Billing. For analytical intelligence, we synthesized these operational tables into a Kimball-compliant Data Warehouse Star Schema centered on `FACT_FLIGHT_TURNAROUND` joined to 10 conformed dimensions. Now, Chaitanya will present our software engineering lifecycle and UML modeling."*

---

### Segment 2: Chaitanya Tikku (I078) - Documentation, UML & QA Testing (1:20 - 2:40)
* **Visual on Screen**:
  - `1:20 - 1:45`: Slide 7 (Use Case Model) and Slide 9 (`Figure 4.2 - Turnaround Activity Diagram` with fork-join nodes).
  - `1:45 - 2:10`: Slide 11 (`Figure 5 - Class Diagram`) and Slide 13 (`Figure 6 - Sequence Diagram`).
  - `2:10 - 2:40`: Terminal running `./mvnw test` showing all 109 tests passing with 0 failures.
* **Spoken Script**:
  > *"I am Chaitanya Tikku (Roll Number I078), Documentation, UML, and QA Testing Lead.*
  > 
  > *Across Labs 1 through 9, we developed formal engineering artifacts. In Lab 3, we defined 10 stakeholder actors and operational stereotypes. In Lab 4, we modeled the aircraft turnaround critical path using UML Activity Diagrams with parallel fork-join synchronization across cabin cleaning, refueling, catering, and baggage servicing.*
  > 
  > *In Lab 5, our UML Class Diagram mapped directly to JPA entities. In Lab 6, our Sequence Diagrams modeled atomic transactions during check-in.*
  > 
  > *For Lab 9 verification, I engineered a test suite of 109 automated unit and integration tests executing Equivalence Partitioning and Boundary Value Analysis on gate wingspan thresholds and session security. I will now hand over to Anuvrat for the frontend demonstration."*

---

### Segment 3: Anuvrat Tripathi (I080) - Frontend UI/UX & Web Consoles (2:40 - 4:00)
* **Visual on Screen**:
  - `2:40 - 3:05`: Live browser on `http://localhost:3000` showing the Public Portal (Concourse Bento, Live 3D Aircraft, Live Flight Tracker map).
  - `3:05 - 3:35`: Switching to `/dashboard/check-in` (DCS Console) -> Search PNR `6E-8841`, interactively select seat on cabin map, enter baggage weight, and generate a printable PDF417 thermal boarding pass.
  - `3:35 - 4:00`: Navigating to `/dashboard/logistics` showing live baggage reclaim carousels and scan timeline.
* **Spoken Script**:
  > *"I am Anuvrat Tripathi (Roll Number I080), Frontend UI/UX Lead.*
  > 
  > *Our frontend is built using React 19, TypeScript, Vite, and Tailwind CSS with Material UI design tokens. We designed 16 dedicated web consoles with zero static UI mockups.*
  > 
  > *Our public portal features a real-time interactive flight tracker, timetable, and lost-and-found custody claims. On our staff side, our Departure Control Console enables check-in agents to search bookings by PNR, lock seats on a dynamic cabin grid, and instantly generate IATA-standard boarding passes with PDF417 barcodes and 10-digit bag tags.*
  > 
  > *Every button triggers live REST API calls with JWT interceptors. I now hand over to Anay for backend services and operational dispatch."*

---

### Segment 4: Anay Modi (I088) - Backend API, RBAC & Dispatch Logic (4:00 - 5:20)
* **Visual on Screen**:
  - `4:00 - 4:25`: Browser on `/dashboard/aocc` showing live flight turnaround Gantt bars, delay tags, and IATA delay code dropdown.
  - `4:25 - 4:55`: Navigating to `/dashboard/airside-ops` demonstrating wingspan compatibility check (e.g. attempting to assign an A380 to a narrowbody gate and seeing the conflict banner).
  - `4:55 - 5:20`: Slide 22 (Conclusion & Innovations) and thank you message.
* **Spoken Script**:
  > *"I am Anay Modi (Roll Number I088), Backend API and Logic Lead.*
  > 
  > *Our backend is powered by Java 17 and Spring Boot 3.2.5 across 18 RESTful controllers. We implemented Spring Security 6 with stateless JWT authentication and strict server-side session governance in the `auth_sessions` table.*
  > 
  > *Our AOCC Operations Console monitors live turnaround Gantt progress in real time, calculating estimated off-block times and linking duration variances to standardized IATA delay codes.*
  > 
  > *Furthermore, our airside engine validates aircraft wingspans and maximum takeoff weights against gate physical rules, rejecting incompatible assignments with HTTP 409 Conflict status.*
  > 
  > *In conclusion, Saphire AOCS delivers an enterprise-grade full-stack platform satisfying 100% of semester requirements. Thank you!"*

---

## 5. Database Engineering & Viva Defense Strategy

### Viva Question 1: "Why does your PostgreSQL database have 41 tables, but your Star Schema only has 10 dimensions?"
* **Official Defense Answer**:
  > *"Our PostgreSQL operational database is an **OLTP (Online Transaction Processing)** system normalized in **3NF** across 41 tables to eliminate data redundancy and handle real-time transactional writes (such as telemetry, baggage scan events, and gate assignments).*
  > 
  > *For analytical reporting and Lab 9 compliance, we designed an **OLAP (Online Analytical Processing) dimensional data warehouse**. Following Kimball dimensional modeling methodology, we consolidated those 41 transactional tables into **10 conformed dimension tables** and aggregated operational KPIs into **`FACT_FLIGHT_TURNAROUND`** to enable sub-second analytical queries without locking production tables."*

### Viva Question 2: "How do you enforce single active session security?"
* **Official Defense Answer**:
  > *"We store a SHA-256 token hash in the `auth_sessions` table with `is_active=true`. When a user logs in from a new device, previous active sessions for that `user_id` are revoked (`is_active=false`, `revoked_at=NOW()`). Our `JwtAuthFilter` queries this table on every request; if revoked, it returns HTTP 401 Unauthorized immediately."*

### Viva Question 3: "How is gate conflict prevented?"
* **Official Defense Answer**:
  > *"The `gate_assignment_rules` table defines `max_wingspan_meters` and `max_weight_mtow_kg` per gate. When an airside officer assigns an aircraft, the `GateAllocationService` queries the aircraft type specs. If `wingspan > max_wingspan_meters`, the backend aborts the transaction and returns HTTP 409 Conflict."*

---

## 6. AI Prompts and Second-Opinion Audit Package

### Prompt 1: Google NotebookLM Video Overview Prompt
```text
Create a structured, high-impact technical explainer video for the Software Engineering Project "Saphire AOCS" (Airport Operations Coordination System) developed by Krishna Solanki (I075), Chaitanya Tikku (I078), Anuvrat Tripathi (I080), and Anay Modi (I088).

Structure the video narration and visuals into 5 clear chronological segments:
1. Operational Scope & Problem Formulation:
Explain how modern mega-airports suffer from disconnected legacy silos. Introduce Saphire AOCS as an integrated Airport Collaborative Decision Making (A-CDM) platform unifying landside check-in, airside turnaround, security screening, and commercial billing.

2. Software Engineering & UML Modeling (Labs 1 to 8):
Walk through the formal engineering lifecycle: 10 stakeholder use cases, UML Activity Diagrams with parallel fork-join turnaround synchronization (cleaning, refueling, catering, baggage), Spring Data JPA Class Diagrams, atomic DCS Sequence Diagrams, and DFD Level 0/1 subsystem data flows.

3. Database Architecture & Data Warehousing (Lab 9):
Highlight the production PostgreSQL 18 relational core featuring 41 normalized tables in strict 3NF across 6 operational domains, managed via 20 versioned Flyway migrations with 158,660+ live seed records. Contrast this with the OLAP Star Schema centered on FACT_FLIGHT_TURNAROUND with 10 conformed dimensions for real-time KPI analytics.

4. Full-Stack Implementation & 16 Dedicated Web Consoles:
Present the modern tech stack (Spring Boot 3.2.5 on Java 17 + React 19 with TypeScript and Tailwind/MUI). Highlight the 7 public passenger pages (Live Flight Tracker, Timetable, Baggage Claims) and 9 role-based operational staff consoles (DCS Check-in with PDF417 boarding passes, AOCC Turnaround Gantt tracker with IATA delay codes, and automated wingspan-vs-gate conflict validation).

5. Quality Assurance & Engineering Verification:
Conclude with the 109 automated JUnit 5 and Mockito backend unit/integration tests enforcing Equivalence Partitioning, Boundary Value Analysis, and single active session security (auth_sessions) with zero static mock data.
```

### Prompt 2: External AI Auditor / Second-Opinion Review Prompt
```text
You are an expert academic evaluator and university professor reviewing a final Software Engineering project presentation and documentation package for "Saphire AOCS (Airport Operations Coordination System)".

Evaluate our project artifacts against standard university Software Engineering grading rubrics:
1. Team & Authorship: Krishna Solanki (I075), Chaitanya Tikku (I078), Anuvrat Tripathi (I080), Anay Modi (I088).
2. Presentation Structure: 22 slides covering Labs 1 to 9 (Agile, Use Cases, Activity with Fork/Join, Class Diagram, Sequence, Collaboration, DFD Level 0/1, 41-table 3NF Database, Star Schema OLAP, 109 Unit Tests, 16 Web Consoles).
3. Technical Rigor: PostgreSQL 18, 41 tables, 20 Flyway migrations, 158k records, Spring Boot 3.2.5, React 19.
4. Viva Readiness: Clear distinction between OLTP 3NF database (41 tables) and OLAP dimensional Star Schema (10 dimensions).

Provide an objective critique, highlight any potential viva trap questions an external examiner might ask, and confirm whether this deliverable meets full distinction criteria.
```

---

## 7. Complete Deliverables Checklist

- [x] **PowerPoint Presentation Deck**: [`Submission Guidelines/I075_I078_I080_I088_Saphire_AOCS_Presentation.pptx`](file:///Users/krish/Desktop/Software%20Engineering/Submission%20Guidelines/I075_I078_I080_I088_Saphire_AOCS_Presentation.pptx) (22 slides, 16:9, zero emojis).
- [x] **Master Submission Guidelines**: [`Submission Guidelines/MASTER_SUBMISSION_AND_EVALUATION_GUIDELINES.md`](file:///Users/krish/Desktop/Software%20Engineering/Submission%20Guidelines/MASTER_SUBMISSION_AND_EVALUATION_GUIDELINES.md).
- [x] **Diagram Assets (SVG)**: [`Mini Project/documentation/SVG/Final Assets/`](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/SVG/Final%20Assets) (Figures 3.1 through 11).
- [x] **High-Resolution Diagram Assets (PNG)**: [`Mini Project/documentation/PNG/`](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/PNG) (Figures 3.1 through 11).
- [x] **Database Seed and Schema Migrations**: 20 Flyway migration files (`V1` to `V20`) in backend resources.
- [x] **Quality Assurance Suite**: 109 backend unit and integration tests passing (`./mvnw test`).
- [x] **Frontend Web Consoles**: 16 operational web consoles in React 19 (`npm run dev` / `pnpm run dev` on port 3000).
