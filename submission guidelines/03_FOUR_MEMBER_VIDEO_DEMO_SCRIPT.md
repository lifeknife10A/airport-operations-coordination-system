# 03: Master Live Software Walkthrough & Video Recording Script
## Saphire Airport Operations Coordination System (AOCS)
**Software Engineering Project Evaluation • 4-Member Live Demonstration**  
**Total Target Time**: 5 Minutes 30 Seconds  
**Format**: 1080p Screen Recording of Live Terminal Boot & Live Browser Consoles (`http://localhost:3000`) + Spoken Narration / Video Overlay  
**Database**: PostgreSQL 16 (`aocs_db`) • Spring Boot 3.2.5 (Port 8080) • React 19 (Port 3000) • 100% Database-Rendered UI with Zero Static Mock Data

---

## Member Allocation & Master Timeline

```
[0:00 - 0:45] Krishna Solanki (I075)  : Terminal Cold Boot, Healthcheck & System Architecture
[0:45 - 1:30] Anuvrat Tripathi (I080) : Public Aerodrome Portal, Interactive Flight Radar & Timetable
[1:30 - 2:30] Anuvrat Tripathi (I080) : DCS Check-in Desk, Live PNR Lookup, Seat Lock & Bag Tagging
[2:30 - 3:30] Chaitanya Tikku (I078)  : Airside Ops, Concourse Capacity & Gate Wingspan Conflict Engine
[3:30 - 4:30] Anay Modi (I088)        : AOCC Turnaround Milestone Engine, IATA Delay Attribution & Tariffs
[4:30 - 5:15] Krishna Solanki (I075)  : RBAC Console, Active Sessions, Tamper-Evident Audit & Test Suite
[5:15 - 5:30] All 4 Team Members      : Project Sign-Off & Viva Readiness Summary
```

---

## Phase 1: Terminal Cold Boot & Healthcheck (0:00 - 0:45)
- **Speaker**: **Krishna Solanki (Roll Number I075)** - Database & System Integration Lead
- **Visual Recording Steps**:
  1. Open macOS Terminal at repository root.
  2. Run the boot command:
     ```bash
     ./start.sh
     ```
  3. Show terminal execution:
     - PostgreSQL 16 initialized on port 5432 with database `aocs_db`.
     - Flyway executing 17 sequential migration scripts (`V1` through `V20`) building the complete 43-table relational schema.
     - Spring Boot 3.2.5 initializing Tomcat on port 8080.
     - Vite React 19 starting frontend dev server on port 3000.
  4. In a split terminal pane, execute the live healthcheck:
     ```bash
     curl -s http://localhost:8080/actuator/health
     # Output: {"status":"UP"}
     ```
  5. Switch focus to browser window at `http://localhost:3000`.

- **Spoken Script (Krishna Solanki - I075)**:
  > "Welcome to the final project demonstration of Saphire AOCS, the Airport Operations Coordination System. I am Krishna Solanki, Roll Number I075, Database and Integration Lead.
  > 
  > We begin with a cold boot of the entire platform from the terminal. Executing our startup script boots our PostgreSQL 16 database, applies 17 sequential Flyway migrations across all 43 relational tables in strict Third Normal Form, initializes our Spring Boot 3.2.5 backend on port 8080, and launches our React 19 frontend on port 3000.
  > 
  > Our Spring Actuator healthcheck confirms status UP. Every screen shown in this video is wired directly to our live PostgreSQL database with zero static mock fallbacks. I now hand over to Anuvrat for the public portal and departure control flow."

---

## Phase 2: Public Aerodrome Telemetry Portal (0:45 - 1:30)
- **Speaker**: **Anuvrat Tripathi (Roll Number I080)** - Frontend UI/UX Lead
- **Visual Recording Steps**:
  1. Navigate to `http://localhost:3000/`.
  2. Scroll through the Home Portal: Show the Aerodrome Status Bar, Active Runway Telemetry, and Quick Flight Lookup.
  3. Click header navigation -> **Flight Tracker** (`/tracker`).
  4. Demonstrate the interactive radar canvas rendering live aircraft trajectories fetched from backend endpoint `/api/flights`.
  5. Search for flight `6E-204` (or `AI-101`) in the radar search box. Click the aircraft marker to show origin, destination, ETA, altitude, and assigned gate.
  6. Navigate to **Flight Schedule** (`/schedule`).
  7. Toggle between "Departures" and "Arrivals", showing real-time status badges (`SCHEDULED`, `BOARDING`, `AIRBORNE`).

- **Spoken Script (Anuvrat Tripathi - I080)**:
  > "I am Anuvrat Tripathi, Roll Number I080, leading Frontend UI and UX.
  > 
  > On the Saphire Public Portal, passengers and ground personnel monitor real-time aerodrome telemetry. Navigating to our Flight Tracker, our custom interactive radar canvas plots live aircraft coordinates fetched dynamically from our backend REST endpoints.
  > 
  > On our Flight Schedule page, travelers query real-time timetables with instant filtering across arrivals, departures, and flight statuses, fully synchronized with live AOCC dispatch operations."

---

## Phase 3: Departure Control System (DCS) Live Passenger Flow (1:30 - 2:30)
- **Speaker**: **Anuvrat Tripathi (Roll Number I080)** - Frontend UI/UX Lead
- **Visual Recording Steps**:
  1. Click **Operator Login** (`/login`).
  2. Enter credentials:
     - Identifier: `emma.verma`
     - Passkey: `password123`
     - Role: `CHECKIN_AGENT`
  3. Click **Authorize & Access Console** -> Redirects automatically to `/dashboard/check-in`.
  4. Select active flight from the flight selector dropdown (e.g., Flight `6E-204` / Flight ID 1).
  5. Flight manifest loads dynamically from the database via `/api/checkin/flights/1/manifest`.
  6. Click **PNR Lookup** tab. Enter seed PNR: `PNR00001`. Click **Search**.
  7. Passenger details load: Name, PNR, Flight, Booking Class.
  8. Click **Assign Seat / Issue Boarding Pass**:
     - Seat map modal loads from `/api/checkin/flights/1/seat-map`.
     - Select available seat `12A`.
     - Click **Issue Boarding Pass**.
     - Live Boarding Pass modal renders passenger name, seat 12A, gate, boarding group, ticket number, and IATA barcode.
  9. Click **Tag Baggage**:
     - Enter weight: `18.5 kg`.
     - Click **Generate IATA Bag Tag**.
     - Bag tag issued and stored via `/api/checkin/baggage/tag`.
  10. Switch to Manifest tab: Show passenger status instantly updated from Unchecked to Boarding Pass Issued.

- **Spoken Script (Anuvrat Tripathi - I080)**:
  > "Next, we demonstrate our Departure Control System. Logging in as Check-in Agent Emma Verma, our RBAC gateway authenticates credentials and issues a signed JWT session.
  > 
  > Searching seed PNR PNR00001 retrieves passenger booking records from our database. We open the live seat map, which prevents double-booking using optimistic database locking.
  > 
  > Selecting seat 12A issues a verified boarding pass with automated barcode telemetry. Tagging checked baggage at 18.5 kilograms logs the tag against the passenger and updates the live flight manifest in real time. I now hand over to Chaitanya for Airside Operations."

---

## Phase 4: Airside Operations & Gate Conflict Engine (2:30 - 3:30)
- **Speaker**: **Chaitanya Tikku (Roll Number I078)** - System Logic & QA Lead
- **Visual Recording Steps**:
  1. Login as Gate Agent / Airside Manager:
     - Identifier: `aditya.zhang`
     - Passkey: `password123`
     - Role: `GATE_AGENT`
  2. Dashboard redirects to `/dashboard/airside-ops`.
  3. Display Concourse Gate Grid: Concourse A (Narrowbody, max wingspan 36m), Concourse B & C (Widebody, max wingspan 65m to 80m).
  4. **Trigger Gate Conflict Rejection**:
     - Select a Widebody aircraft flight (e.g., Boeing 777-300ER with wingspan 64.8m).
     - Click **Reassign Gate**. Attempt to assign to **Gate A1** (Narrowbody limit: 36.0m).
     - Click **Confirm Assignment**.
     - Backend executes `GateService.assertWingspanFits()`, detects wingspan violation (64.8m > 36.0m), and throws `ConflictException` (HTTP 409).
     - UI displays red conflict alert: *"Gate A1 maximum wingspan (36.0m) exceeded by aircraft wingspan (64.8m). Assignment rejected."*
  5. Assign to **Gate B2** (max wingspan 65.0m) -> Successful assignment, gate status updates to `OCCUPIED`.
  6. Display Runway Telemetry Panel: View Runway 09L/27R, toggle operational mode between `ACTIVE_CAT_III` and `DEPARTURE_ONLY`.

- **Spoken Script (Chaitanya Tikku - I078)**:
  > "I am Chaitanya Tikku, Roll Number I078, overseeing System Logic and Quality Assurance.
  > 
  > In the Airside Operations Console, we manage gate allocations across Concourses A, B, and C. Saphire AOCS enforces hard mathematical safety constraints.
  > 
  > When attempting to assign a widebody Boeing 777 with a 64.8-meter wingspan to Gate A1 with a 36-meter limit, our backend GateService triggers physical wingspan validation and rejects the transaction with an HTTP 409 Conflict exception.
  > 
  > Reassigning to Gate B2 succeeds immediately, maintaining strict aerodrome safety compliance. I now hand over to Anay for turnaround coordination."

---

## Phase 5: AOCC Turnaround, Logistics & Tariff Billing (3:30 - 4:30)
- **Speaker**: **Anay Modi (Roll Number I088)** - Backend API & Logistics Lead
- **Visual Recording Steps**:
  1. Login as Airport Operations Manager:
     - Identifier: `sai.sharma`
     - Passkey: `password123`
     - Role: `AIRPORT_OPERATIONS_MANAGER`
  2. Redirects to `/dashboard/aocc`.
  3. View Turnaround Timeline & Milestone Tracker:
     - Expand active turnaround for Flight `6E-204`.
     - Show milestones: Deboarding, Fueling, Catering, Cabin Cleaning, Boarding, Pushback.
     - Mark "Fueling" milestone as Completed -> Turnaround progress bar updates from 40% to 60%.
  4. **Log Flight Delay**:
     - Click **Log Delay** on Flight `AI-101`.
     - Select IATA Delay Code `89` (Ground Handling / Baggage Transfer Delay).
     - Enter Delay Duration: `25 mins`. Operator Note: *"Baggage belt congestion during transit transfer."*
     - Click **Submit Delay**.
     - Flight status updates to `DELAYED (+25m)` across all linked consoles.
  5. Navigate to **Logistics Desk** (`/dashboard/logistics`):
     - View Baggage Carousels (Belts 01 to 08).
     - Assign Carousel 04 to incoming flight baggage stream.
  6. Navigate to **Billing Console** (`/dashboard/billing`):
     - View automated IATA airline invoice table.
     - Open invoice line items: Show itemized Landing Fees computed from Maximum Takeoff Weight (MTOW), jetbridge connection, and parking fees.

- **Spoken Script (Anay Modi - I088)**:
  > "I am Anay Modi, Roll Number I088, leading Backend APIs and Logistics.
  > 
  > In the AOCC Command Center, dispatchers monitor end-to-end turnaround lifecycles. Updating fueling milestones triggers reactive progress recalculation across ground teams.
  > 
  > When disruptions occur, logging an IATA Delay Code 89 with operator telemetry updates flight records and alerts airside handlers in real time.
  > 
  > In our Logistics desk, we dynamically assign baggage claim carousels, while our Billing engine calculates automated aeronautical tariffs based on aircraft Maximum Takeoff Weight and apron dwell time. I hand back to Krishna for security governance and test verification."

---

## Phase 6: System Administration, RBAC & Automated Test Suite (4:30 - 5:15)
- **Speakers**: **Krishna Solanki (I075)** & **Chaitanya Tikku (I078)**
- **Visual Recording Steps**:
  1. Login as System Administrator:
     - Identifier: `aarav.li`
     - Passkey: `password123`
     - Role: `SYSTEM_ADMINISTRATOR`
  2. Redirects to `/dashboard/system-admin`.
  3. Show Staff Management: 20+ active staff accounts across 10 roles.
  4. Show single-click account status toggle (ACTIVE to SUSPENDED) via `/api/users/{id}/status`.
  5. Show **Active Sessions Inspector**:
     - Live records from `auth_sessions` table with UUID session tokens.
     - Click **Revoke Session** to demonstrate instant token invalidation.
  6. Show **Tamper-Evident Audit Log**:
     - View chronological log of all previous actions (Check-in for PNR00001, Gate Reassignment, Delay Logged, Session Revoked).
  7. Switch to Terminal:
     - Run:
       ```bash
       ./mvnw test
       ```
     - Terminal displays:
       ```
       [INFO] Running com.saphire.aocs.service.GateServiceTest
       [INFO] Running com.saphire.aocs.service.AuthServiceTest
       [INFO] Running com.saphire.aocs.service.FlightServiceTest
       [INFO] Tests run: 109, Failures: 0, Errors: 0, Skipped: 0
       [INFO] BUILD SUCCESS
       ```

- **Spoken Script**:
  > **Krishna Solanki (I075)**:
  > "In the System Administration console, administrators manage fine-grained role-based access control. Our session engine tracks active UUID sessions in our auth_sessions table with real-time revocation. Every administrative, operational, and check-in event is permanently recorded in our tamper-evident audit trail."
  > 
  > **Chaitanya Tikku (I078)**:
  > "To ensure system reliability, we execute our automated test suite. Spring Boot and Mockito execute 109 unit tests with zero failures, validating security boundaries, gate constraints, and tariff calculations."

---

## Phase 7: Team Summary & Production Sign-Off (5:15 - 5:30)
- **Speakers**: **All 4 Team Members**
- **Visual Recording Steps**:
  - Show System Admin Overview with operational summary metrics.
  - Display Final Credits Slide:
    - Krishna Solanki (I075) - Database & Integration Lead
    - Chaitanya Tikku (I078) - Documentation, UML & QA Lead
    - Anuvrat Tripathi (I080) - Frontend UI/UX Lead
    - Anay Modi (I088) - Backend API & Logic Lead

- **Spoken Script (All Members)**:
  > **Krishna Solanki (I075)**: "Saphire AOCS bridges passenger services, airside safety, turnaround logistics, and aeronautical billing into a single, unified, resilient aerodrome platform."
  > 
  > **Chaitanya Tikku (I078)**: "Backed by rigorous UML modeling and 109 passing automated unit tests."
  > 
  > **Anuvrat Tripathi (I080)**: "With zero static UI mocks and 100% database-driven reactivity."
  > 
  > **Anay Modi (I088)**: "This concludes our live demonstration. Thank you for your evaluation."

---

## Deterministic Credential & Seed Data Reference

| Persona / Role | Username / Identifier | Password | Target Dashboard URL | Live Verification Action |
| :--- | :--- | :--- | :--- | :--- |
| **Check-in Agent** | `emma.verma` | `password123` | `/dashboard/check-in` | Lookup `PNR00001`, assign seat `12A`, bag tag `18.5kg` |
| **Gate Agent** | `aditya.zhang` | `password123` | `/dashboard/airside-ops` | Wingspan conflict on Gate A1 (HTTP 409), assign Gate B2 |
| **AOCC Manager** | `sai.sharma` | `password123` | `/dashboard/aocc` | Fueling milestone update, IATA Delay Code 89 (+25m) |
| **Baggage Handler** | `sai.li` | `password123` | `/dashboard/logistics` | Carousel Belt 04 allocation, cargo hold reconciliation |
| **Billing Clerk** | `elena.tanaka` | `password123` | `/dashboard/billing` | Itemized invoice breakdown with MTOW landing fees |
| **System Administrator** | `aarav.li` | `password123` | `/dashboard/system-admin` | Suspend user, revoke active session in `auth_sessions` |
