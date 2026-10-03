# Master Project Documentation & Report Specification for Chaitanya Tikku
**Target Deliverable**: Formal Software Engineering Project Report / Master Laboratory Dossier  
**Project Title**: SAPHIRE AOCS (Airport Operations Coordination System)  
**Lead Author & Documentation Head**: Chaitanya Tikku (Roll No: **I078**)  
**Co-Authors & Technical Leads**:
- **Krishna Solanki** (**I075**) — Database & System Integration Lead
- **Anuvrat Tripathi** (**I080**) — Frontend UI/UX Lead
- **Anay Modi** (**I088**) — Backend API & Logic Lead

---

## 1. Executive Context & The Three Final Deliverables

For the final semester Software Engineering evaluation, our group has **three core deliverables**:

```
+-----------------------------------------------------------------------------+
|                     SAPHIRE AOCS - 3 OFFICIAL SUBMISSIONS                   |
+-----------------------------------------------------------------------------+
| 1. MASTER PROJECT REPORT (Handled by Chaitanya Tikku - I078)               |
|    -> Full academic & engineering report covering Labs 1 to 9, UML models,  |
|       41-table database, 16 web consoles, and 109 QA automated tests.       |
|                                                                             |
| 2. PRESENTATION SLIDE DECK (Ready - 22 Slides PPTX)                         |
|    -> File: Submission Guidelines/I075_I078_I080_I088_Saphire_AOCS_...pptx  |
|                                                                             |
| 3. VIDEO DEMONSTRATION (Ready - 5:30 Master Walkthrough MP4)                |
|    -> File: Submission Guidelines/I075_I078_I080_I088_Saphire_AOCS_...mp4   |
+-----------------------------------------------------------------------------+
```

---

## 2. Master Report Outline & Structure (Table of Contents)

Chaitanya, your final document (in Microsoft Word `.docx` and exported `.pdf`) should follow this exact chapter-by-chapter structure:

```
COVER PAGE (College Logo, Subject, Project Title, Team Roster, Academic Year)
CERTIFICATE / DECLARATION OF ORIGINALITY
ACKNOWLEDGEMENTS
EXECUTIVE SUMMARY / ABSTRACT
TABLE OF CONTENTS, LIST OF FIGURES, LIST OF TABLES

CHAPTER 1: INTRODUCTION & DOMAIN BACKGROUND (Lab 1)
  1.1 Aerodrome Domain & Masterplan (CSMIA 4-Limb Quad-Runway Layout)
  1.2 Problem Definition: 6 Legacy Airport Operational Silos
  1.3 Project Vision & Objectives: Airport Collaborative Decision Making (A-CDM)
  1.4 Scope & Operational Boundaries

CHAPTER 2: REQUIREMENTS SPECIFICATION & AGILE USER STORIES (Lab 1)
  2.1 Functional Requirements (FRS)
  2.2 Non-Functional Requirements (NFRs - Performance, Security, Availability, Data Integrity)
  2.3 Agile User Personas & Acceptance Criteria (AOCC, DCS, Airside, Passenger)

CHAPTER 3: SOFTWARE PROCESS METHODOLOGY (Lab 2)
  3.1 Agile Scrum Process Model
  3.2 Sprint Cadence & 10-Week Roadmap (Sprints 1.0 to 5.0)
  3.3 Team Roles & Responsibility Assignment Matrix (RACI)

CHAPTER 4: OBJECT-ORIENTED MODELING & UML ARTIFACTS (Labs 3 to 7)
  4.1 Lab 3: UML Use Case Modeling (10 Actors, <<include>>, <<extend>>)
  4.2 Lab 3: Formal Use Case Specifications (UC-05 Check-In & UC-03 Gate Allocation)
  4.3 Lab 4: UML Activity Diagrams (Aircraft Turnaround 4-way Fork-Join & Baggage Lifecycle)
  4.4 Lab 5: UML Class Diagram & JPA Domain Entities
  4.5 Lab 5: Software Engineering Design Patterns (Repository, Strategy, Filter Chain, DTO)
  4.6 Lab 6: UML Sequence Diagrams (Turnaround Delay Attribution & DCS Boarding Pass)
  4.7 Lab 7: UML Collaboration / Communication Diagram (Passenger Security Screening)

CHAPTER 5: SYSTEM ARCHITECTURE & DATA FLOW MODELING (Lab 8)
  5.1 DFD Level 0 Context Diagram
  5.2 DFD Level 1 Subsystem Functional Decomposition (5 Process Blocks)

CHAPTER 6: DATABASE DESIGN & DATA WAREHOUSING (Lab 9 / Data Architecture)
  6.1 Operational OLTP PostgreSQL 18 Relational Architecture (41 Tables in 3NF)
  6.2 Database Domain Breakdown (6 Relational Sub-Domains)
  6.3 Automated Migrations via 20 Flyway Scripts (158,660+ Seed Records)
  6.4 Analytical OLAP Dimensional Star Schema (FACT_FLIGHT_TURNAROUND + 10 Dimensions)
  6.5 Information Package for Business Intelligence Reporting
  6.6 Key Relational Constraints (Session Revocation, Gate Wingspan Rules)

CHAPTER 7: USER INTERFACES & OPERATIONAL CONSOLES (All 16 Web Consoles)
  7.1 Public Passenger Portal Walkthrough (7 Pages)
  7.2 Operational Staff Consoles Walkthrough (9 Role-Based Consoles)
  7.3 Core Transaction Showcase: Dynamic Seat Selection & IATA PDF417 Boarding Pass

CHAPTER 8: QUALITY ASSURANCE, VERIFICATION & TESTING (Lab 9)
  8.1 Black-Box Test Design: Equivalence Partitioning & Boundary Value Analysis (BVA)
  8.2 Automated Test Suite: 109 Backend JUnit 5 & Mockito Tests (100% Pass Rate)
  8.3 Formal Test Execution Matrix

CHAPTER 9: SYSTEM IMPLEMENTATION & FULL-STACK INTEGRATION
  9.1 Technology Stack Architecture (React 19 + Spring Boot 3.2.5 + PostgreSQL 18)
  9.2 Security Model: Stateless JWT, Active Session Tracking (auth_sessions), RBAC

CHAPTER 10: CONCLUSION, KEY INNOVATIONS & FUTURE ROADMAP
  10.1 Summary of Engineering Achievements
  10.2 Key Technical Innovations
  10.3 Future Enhancements (ML Delay Forecasting, IoT RFID Telemetry)
  10.4 References & IEEE Citations
```

---

## 3. High-Resolution Diagram Assets Catalog

All diagrams have already been generated in high resolution PNG and vector SVG. Embed these exact files into your Word report at their respective sections:

| Figure # | Diagram Name | Location in Report | PNG Asset File Path |
| :--- | :--- | :--- | :--- |
| **Fig 3.1** | Level 1 High-Level Use Case Diagram | Chapter 4 (Lab 3) | `Mini Project/documentation/PNG/Figure 3.1 - Level 1 High-Level Use Case Diagram.png` |
| **Fig 3.2** | Level 2 Detailed Operation Use Case Diagram | Chapter 4 (Lab 3) | `Mini Project/documentation/PNG/Figure 3.2 - Level 2 Detailed Operation Use Case Diagram.png` |
| **Fig 4.1** | Public User Activity Diagram | Chapter 4 (Lab 4) | `Mini Project/documentation/PNG/Figure 4.1 - Public User Activity Diagram.png` |
| **Fig 4.2** | Admin / Turnaround Activity Diagram | Chapter 4 (Lab 4) | `Mini Project/documentation/PNG/Figure 4.2 - Admin User Activity Diagram.png` |
| **Fig 5** | UML Class Diagram (Domain Model) | Chapter 4 (Lab 5) | `Mini Project/documentation/PNG/Figure 5 - Class Diagram.png` |
| **Fig 6** | UML Sequence Diagram (Turnaround & Check-In) | Chapter 4 (Lab 6) | `Mini Project/documentation/PNG/Figure 6 - Sequence Diagram.png` |
| **Fig 7** | UML Collaboration / Communication Diagram | Chapter 4 (Lab 7) | `Mini Project/documentation/PNG/Figure 7 - Collaboration Diagram.png` |
| **Fig 8.1** | Data Flow Diagram (DFD) Level 0 | Chapter 5 (Lab 8) | `Mini Project/documentation/PNG/Figure 8.1 - DFD Level 0.png` |
| **Fig 8.2** | Data Flow Diagram (DFD) Level 1 | Chapter 5 (Lab 8) | `Mini Project/documentation/PNG/Figure 8.2 - DFD Level 1.png` |
| **Fig 9** | 41-Table Relational Schema (PostgreSQL 3NF) | Chapter 6 (Lab 9) | `Mini Project/documentation/PNG/Figure 9 - Relational Schema.png` |
| **Fig 10** | OLAP Star Schema (10 Conformed Dimensions) | Chapter 6 (Lab 9) | `Mini Project/documentation/PNG/Figure 10 - Star Schema.png` |
| **Fig 11** | Information Package (DW Dimension Matrix) | Chapter 6 (Lab 9) | `Mini Project/documentation/PNG/Figure 11 - Information Package.png` |

> *Note: Vector SVG files for all the above figures are also available in `Mini Project/documentation/SVG/Final Assets/` if you want lossless vector scaling.*

---

## 4. UI Screenshot Capture Guide (All 16 Web Consoles)

Chaitanya, in your WhatsApp message you asked:
> *"Bhai SE ke documentation mai kya kya dikhana hai, ek toh project ka homepage fir dashboards saare, ER diagram dikhana hai, aur kuch jo aap chahte vo required hai mai ussaab se create karunga."*

Here is the exact step-by-step checklist of screens you must capture from the live running web app on `http://localhost:3000`:

### A. Public Passenger Portal (7 Pages)
1. **Public Homepage / Hero Section** (`/`):
   - Capture the top hero bento, aerodrome 3D model banner, quick flight status bar, and concourse terminal quick-links.
2. **Live Flight Tracker** (`/flight-tracker`):
   - Capture the live interactive flight radar map with active aircraft pins, altitude/speed badges, and search filters.
3. **Flight Timetable & Schedule** (`/timetable`):
   - Capture arrivals and departures schedule table with status badges (ON TIME, DELAYED, BOARDING, GATE OPEN).
4. **Passenger Services** (`/services`):
   - Capture lounge booking, transit assistance, and special assistance cards.
5. **Air Cargo & Logistics** (`/cargo`):
   - Capture cargo AWB tracking search bar, customs clearance status, and cold-chain temperature telemetry.
6. **Airport Guide & Interactive Map** (`/guide`):
   - Capture terminal map selector (Terminal 1 vs Terminal 2), duty-free directory, and gate navigation path.
7. **Support & Lost Property Portal** (`/support`):
   - Capture the Lost & Found item registration form and automated reference claim badge generator.

---

### B. Operational Staff Consoles (9 Role Dashboards)
*(Log in as `admin` or access staff routes directly)*

8. **Departure Control System (DCS Check-In Console)** (`/dashboard/check-in`):
   - **Crucial Screenshot 1**: PNR Search (`6E-8841`) showing passenger manifest details.
   - **Crucial Screenshot 2**: Interactive Seat Selection cabin grid (showing occupied vs available seats).
   - **Crucial Screenshot 3**: Baggage Tag generation (enter weight e.g. `14.5 kg`) and generated **IATA PDF417 Thermal Boarding Pass** with readable barcode.
9. **Airport Operations Control Center (AOCC Console)** (`/dashboard/aocc`):
   - Capture the live Turnaround Gantt Chart with color-coded service task bars (Cleaning, Catering, Refueling, Baggage) and IATA Delay Code tagging modal (`Code 41 - Cabin Cleaning Delay`).
10. **Ground Handling & Ramp Servicing** (`/dashboard/ground-ops`):
    - Capture the turnaround task completion toggles, service vehicle telemetry, and fuel uplift gallons calculator.
11. **Airside Operations & Gate Allocation** (`/dashboard/airside-ops`):
    - Capture the Gate Matrix showing active stands (A01 - D24), aircraft wingspan clearance badges, and the automated **Wingspan Conflict Rejection** banner (e.g., A380 assigned to Code C stand).
12. **Baggage Handling & Logistics (BHS)** (`/dashboard/logistics`):
    - Capture the 5-stage IATA Resolution 753 conveyor tracking timeline, sortation lateral status, and baggage carousel allocation table.
13. **Security Screening & Checkpoint Control** (`/dashboard/security`):
    - Capture biometric gate status, boarding pass validation log at checkpoint `T2-SEC-04`, and alert queue.
14. **Aeronautical Billing & Commercial Tariffs** (`/dashboard/billing`):
    - Capture landing fee calculations, MTOW weight-tier tariff breakdowns, parking charges, and PDF invoice generator.
15. **System Administration & RBAC Console** (`/dashboard/admin`):
    - Capture user roles matrix, active sessions table (`auth_sessions`), and real-time system audit logs.
16. **Department Services & Shift Handover** (`/dashboard/departments`):
    - Capture duty manager shift handover logbook, incident report submissions, and broadcast announcements.

---

## 5. Detailed Technical Specifications to Include in Writing

### 5.1 Lab 1: Problem Definition & Operational Silos
- Explain how mega-airports traditionally operate in disconnected operational silos (Landside check-in, Airside turnaround, Baggage sortation, and ATC).
- Detail how Saphire AOCS implements the **IATA/Eurocontrol Airport Collaborative Decision Making (A-CDM)** paradigm to share real-time milestones:
  - Target Off-Block Time (TOBT)
  - Target Take-Off Time (TTOT)
  - Aircraft Ready Time (ARDT)

### 5.2 Lab 2: Agile Scrum Framework
- **Sprint 1.0 (Weeks 1-2)**: Domain & 3NF Relational Foundation (Flyway migrations `V1`-`V3`).
- **Sprint 2.0 (Weeks 3-4)**: Spring Boot 3 REST Microservices & JWT Security (`auth_sessions`).
- **Sprint 3.0 (Weeks 5-6)**: React 19 Frontend & Public Passenger Portal (7 public pages).
- **Sprint 4.0 (Weeks 7-8)**: 9 Staff Consoles (DCS Check-in, AOCC Turnaround Gantt, Wingspan Engine).
- **Sprint 5.0 (Weeks 9-10)**: Integration, 109 Automated QA Tests, and Docker Compose Orchestration.

### 5.3 Lab 3: UML Use Case Modeling
- **10 Primary Stakeholders**: Passenger, DCS Check-in Agent, AOCC Controller, Airside Dispatcher, Ground Crew, Baggage Handler, Security Screener, Commercial Billing Officer, System Admin, Duty Manager.
- **Key Stereotypes**:
  - `<<include>>`: Check-in Passenger `<<include>>` Verify Travel Docs, `<<include>>` Assign Seat, `<<include>>` Issue IATA Boarding Pass.
  - `<<extend>>`: Assign Aircraft Gate `<<extend>>` Validate Wingspan Compatibility (Extension Point: Code E/F widebody anomaly).
  - `<<extend>>`: Dispatch Turnaround `<<extend>>` Tag IATA Delay Code (Extension Point: TOBT variance > 15 mins).

### 5.4 Lab 4: UML Activity Diagrams
- **Aircraft Turnaround Workflow**:
  - Starts at Runway Touchdown -> Taxi to Stand -> Chocks On.
  - **Fork Node**: Splits into 4 concurrent servicing streams:
    1. Cabin Cleaning & Disinfection
    2. Underwing Fuel Uplift (Hydrant Dispenser)
    3. High-Loader Inflight Catering
    4. ULD Baggage Unload & Outbound Load
  - **Join Node**: Synchronizes when all 4 streams report `COMPLETED` -> Clearance to Board -> Chocks Off -> Pushback.
- **Baggage Reconciliation (IATA Res 753)**:
  - Induction at Check-in -> Inline 3D CT Screening (Pass vs Reject/EOD) -> Sortation Lateral -> Ramp Loading -> Aircraft Hold -> Inbound Arrival Carousel.

### 5.5 Lab 5: Class Diagram & Design Patterns
- Explain the 4 enterprise design patterns implemented:
  1. **Repository Pattern**: Spring Data JPA repositories isolating database CRUD operations.
  2. **Strategy Pattern**: Dynamic airline tariff pricing based on MTOW, peak hours, and stand electrical consumption.
  3. **Filter Chain Pattern**: `JwtAuthFilter` validating token signature and querying `auth_sessions` table before dispatching to controller.
  4. **DTO Pattern**: Request and Response DTOs decoupling JPA entities from public REST JSON APIs.

### 5.6 Lab 6: Sequence Diagrams
- **Turnaround Coordination**: Illustrates lifelines for `AoccController` -> `AoccUi` -> `FlightController` -> `TurnaroundService` -> `PostgreSqlDb`.
- **DCS Check-In Sequence**: Illustrates atomic seat lock, PDF417 generation, bag tag issuance, and single-transaction commit.

### 5.7 Lab 7: Collaboration / Communication Diagram
- Illustrates numbered message interactions during passenger security screening at `T2-SEC-04`:
  - `1: scanBoardingPass()` -> `2: validateSecurityClearance()` -> `3: checkBiometricMatch()` -> `4: logAccessEvent()` -> `5: unlockTurnstile()`.

### 5.8 Lab 8: Data Flow Diagrams (DFDs)
- **DFD Level 0**: System context showing external entities (Passenger, Airline ERP, Ground Handler, ATC, Payment Gateway) exchanging data flows with Process 0.0 (Saphire AOCS Core).
- **DFD Level 1**: 5 Core Subsystems:
  - Process 1.0: Identity, Access & Session Governance
  - Process 2.0: Aerodrome Infrastructure & Gate Dispatch
  - Process 3.0: Flight Turnaround & A-CDM Engine
  - Process 4.0: Passenger Journey & Baggage Reconciliation
  - Process 5.0: Commercial Tariffs & Audit Invoicing

### 5.9 Lab 9: Database Architecture & Testing
- **OLTP 41-Table 3NF Database**:
  - 6 Domains: Security (5 tables), Aerodrome (8 tables), Flight Operations (5 tables), Ground Servicing (5 tables), Passenger/Baggage (12 tables), Billing/Audit (6 tables).
  - 20 Flyway migrations (`V1__init_schema.sql` to `V20__final_seeds.sql`) with 158,660+ seed records.
- **OLAP Star Schema**:
  - Central `FACT_FLIGHT_TURNAROUND` joined to 10 conformed dimensions (`DIM_TIME`, `DIM_FLIGHT`, `DIM_AIRCRAFT`, `DIM_GATE`, `DIM_RUNWAY`, `DIM_USER`, `DIM_DEPARTMENT`, `DIM_ROLE`, `DIM_PASSENGER`, `DIM_LOGISTICS`).
- **QA Automated Testing**:
  - 109 Unit and Integration tests written in JUnit 5 & Mockito.
  - Equivalence Partitioning & Boundary Value Analysis on gate wingspans (e.g. 35.9m vs 36.0m vs 36.1m for Code C stands) and baggage weights (0.0kg vs 15.0kg vs 32.0kg limit).

---

## 6. How Chaitanya Should Run & Inspect the System Locally

To run the full stack on your laptop and capture screenshots:

### Step 1: Clone / Pull Git Repository
```bash
# In your terminal:
cd "/Users/krish/Desktop/Software Engineering"
git status
git pull origin main
```

### Step 2: Start PostgreSQL Database
```bash
# Verify PostgreSQL 18 is running
docker compose up -d postgres
# Or ensure your local PostgreSQL instance is running on port 5432
```

### Step 3: Run Spring Boot Backend
```bash
cd "Mini Project/backend"
./mvnw spring-boot:run
# Backend will start on http://localhost:8080
# Run automated tests:
./mvnw test
```

### Step 4: Run React Frontend
```bash
cd "Mini Project/frontend"
pnpm install
pnpm run dev
# Frontend will start on http://localhost:3000
```

---

## 7. Report Formatting & Submission Standards

- **Page Layout**: Standard A4, 1-inch margins on all sides.
- **Typography**: 
  - Body Text: 12 pt Times New Roman or Calibri, 1.5 line spacing.
  - Headings: 16 pt Bold (Heading 1), 14 pt Bold (Heading 2), 12 pt Bold (Heading 3).
- **Captions**: Every figure and table must have a formal caption (e.g., `Figure 4.2: Turnaround Activity Diagram with Fork-Join Synchronization`, `Table 8.1: Boundary Value Analysis Test Cases`).
- **Header & Footer**: Header should contain "SAPHIRE AOCS - Software Engineering Project Report"; Footer should contain Page Numbering (`Page X of Y`).
- **Final Output Formats**: Save as editable `Saphire_AOCS_Project_Report.docx` and export as print-ready `Saphire_AOCS_Project_Report.pdf`.

---
*Created for Chaitanya Tikku (I078), Documentation & QA Lead — SAPHIRE AOCS Team.*
