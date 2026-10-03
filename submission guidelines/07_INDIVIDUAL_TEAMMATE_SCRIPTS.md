# 07: Individual Teammate Recording Scripts & Spoken Cards
## Saphire Airport Operations Coordination System (AOCS)
**Software Engineering Project Evaluation • 4-Member Spoken Distribution**

---

### Instructions for Teammates
1. **Target Video Duration**: 5 Minutes 30 Seconds (Total).
2. **Audio/Video Setup**: Use a clean microphone, record in a quiet room. If using a webcam overlay, ensure adequate front lighting and professional attire.
3. **Pacing**: Speak with clarity, steady pace, and authoritative engineering terminology. Do NOT rush.
4. **Zero Slang / Zero Emojis**: Maintain strict academic and professional software engineering standards.

---

# Member 1: Krishna Solanki (Roll Number: I075)
**Role**: Lead Architect, Database & System Integration Lead  
**Assigned Time Segments**:
- **Segment 1**: Cold Boot & System Initialization (`0:00 - 0:45`) [45 seconds]
- **Segment 2**: System Administration, RBAC & Session Security (`4:30 - 4:55`) [25 seconds]
- **Segment 3**: Final Group Sign-Off (`5:15 - 5:20`) [5 seconds]

---

### Segment 1 Spoken Card (`0:00 - 0:45`)
**Visual Action on Screen**:
- Show Terminal running `./start.sh`.
- Highlight PostgreSQL 16 on port 5432, 17 Flyway migrations executing against `aocs_db`, Spring Boot 3.2.5 initializing on port 8080, and Vite React 19 on port 3000.
- Execute `curl -s http://localhost:8080/actuator/health` in split pane showing `{"status":"UP"}`.

**Spoken Script**:
> "Welcome to the final project demonstration of Saphire AOCS, the Airport Operations Coordination System. I am Krishna Solanki, Roll Number I075, Database and Integration Lead.
> 
> We begin with a cold boot of the entire platform from the terminal. Executing our startup script boots our PostgreSQL 16 database, applies 17 sequential Flyway migrations across all 43 relational tables in strict Third Normal Form, initializes our Spring Boot 3.2.5 backend on port 8080, and launches our React 19 frontend on port 3000.
> 
> Our Spring Actuator healthcheck confirms status UP. Every screen shown in this video is wired directly to our live PostgreSQL database with zero static mock fallbacks. I now hand over to Anuvrat for the public portal and departure control flow."

---

### Segment 2 Spoken Card (`4:30 - 4:55`)
**Visual Action on Screen**:
- Login as System Administrator (`aarav.li` / `password123`) on `/login`.
- Navigate to `/dashboard/system-admin`.
- Show staff table with 20+ accounts, demonstrate status toggle (ACTIVE to SUSPENDED) via `/api/users/{id}/status`.
- Open Active Sessions Inspector: View UUID sessions in `auth_sessions` and click **Revoke Session**.
- Show Tamper-Evident Audit Log with logged events.

**Spoken Script**:
> "In the System Administration console, administrators manage fine-grained role-based access control. Our session engine tracks active UUID sessions in our auth_sessions table with real-time revocation. Every administrative, operational, and check-in event is permanently recorded in our tamper-evident audit trail."

---

### Segment 3 Spoken Card (`5:15 - 5:20`)
**Spoken Script**:
> "Saphire AOCS bridges passenger services, airside safety, turnaround logistics, and aeronautical billing into a single, unified, resilient aerodrome platform."

---

# Member 2: Anuvrat Tripathi (Roll Number: I080)
**Role**: Frontend UI/UX Lead  
**Assigned Time Segments**:
- **Segment 1**: Public Aerodrome Portal & Interactive Radar (`0:45 - 1:30`) [45 seconds]
- **Segment 2**: Departure Control System (DCS) Live Flow (`1:30 - 2:30`) [60 seconds]
- **Segment 3**: Final Group Sign-Off (`5:22 - 5:26`) [4 seconds]

---

### Segment 1 Spoken Card (`0:45 - 1:30`)
**Visual Action on Screen**:
- Navigate to `http://localhost:3000/`.
- Show Home Portal aerodrome status cards and runway mode.
- Navigate to `/tracker` (Flight Tracker): Pan/zoom interactive radar canvas, search flight `6E-204`, click aircraft marker to show telemetry details.
- Navigate to `/schedule` (Flight Schedule): Filter by Departures/Arrivals and status chips.

**Spoken Script**:
> "I am Anuvrat Tripathi, Roll Number I080, leading Frontend UI and UX.
> 
> On the Saphire Public Portal, passengers and ground personnel monitor real-time aerodrome telemetry. Navigating to our Flight Tracker, our custom interactive radar canvas plots live aircraft coordinates fetched dynamically from our backend REST endpoints.
> 
> On our Flight Schedule page, travelers query real-time timetables with instant filtering across arrivals, departures, and flight statuses, fully synchronized with live AOCC dispatch operations."

---

### Segment 2 Spoken Card (`1:30 - 2:30`)
**Visual Action on Screen**:
- Navigate to `/login`. Login as `emma.verma` / `password123` (Role: `CHECKIN_AGENT`).
- Lands on `/dashboard/check-in`.
- Select Flight ID 1 from dropdown -> Flight manifest loads dynamically.
- Click **PNR Lookup** tab. Enter `PNR00001` -> Click **Search**.
- Click **Assign Seat / Issue Boarding Pass** -> Select seat `12A` on the live seat map -> Click **Issue Boarding Pass** -> View rendered boarding pass with IATA barcode.
- Click **Tag Baggage** -> Enter `18.5 kg` -> Click **Generate IATA Bag Tag**.
- Switch to Manifest tab: Show passenger status updated to Boarding Pass Issued.

**Spoken Script**:
> "Next, we demonstrate our Departure Control System. Logging in as Check-in Agent Emma Verma, our RBAC gateway authenticates credentials and issues a signed JWT session.
> 
> Searching seed PNR PNR00001 retrieves passenger booking records from our database. We open the live seat map, which prevents double-booking using optimistic database locking.
> 
> Selecting seat 12A issues a verified boarding pass with automated barcode telemetry. Tagging checked baggage at 18.5 kilograms logs the tag against the passenger and updates the live flight manifest in real time. I now hand over to Chaitanya for Airside Operations."

---

### Segment 3 Spoken Card (`5:22 - 5:26`)
**Spoken Script**:
> "With zero static UI mocks and 100% database-driven reactivity."

---

# Member 3: Chaitanya Tikku (Roll Number: I078)
**Role**: Documentation, UML & QA Lead  
**Assigned Time Segments**:
- **Segment 1**: Airside Operations & Gate Conflict Engine (`2:30 - 3:30`) [60 seconds]
- **Segment 2**: Automated Unit Test Verification (`4:55 - 5:15`) [20 seconds]
- **Segment 3**: Final Group Sign-Off (`5:20 - 5:22`) [2 seconds]

---

### Segment 1 Spoken Card (`2:30 - 3:30`)
**Visual Action on Screen**:
- Login as Gate Agent (`aditya.zhang` / `password123`) on `/login`.
- Redirects to `/dashboard/airside-ops`.
- Show Concourse Grid (Concourses A, B, C).
- **Trigger Gate Conflict Rejection**:
  - Select Boeing 777-300ER (wingspan 64.8m).
  - Click **Reassign Gate** -> Choose **Gate A1** (Narrowbody limit: 36.0m) -> Click **Confirm**.
  - Show red conflict banner: *"Gate A1 maximum wingspan (36.0m) exceeded by aircraft wingspan (64.8m). Assignment rejected."* (HTTP 409 `ConflictException`).
- Reassign to **Gate B2** (max wingspan 65.0m) -> Assignment succeeds, gate status updates to `OCCUPIED`.
- Show Runway Telemetry: Switch Runway 09L/27R between `ACTIVE_CAT_III` and `DEPARTURE_ONLY`.

**Spoken Script**:
> "I am Chaitanya Tikku, Roll Number I078, overseeing System Logic and Quality Assurance.
> 
> In the Airside Operations Console, we manage gate allocations across Concourses A, B, and C. Saphire AOCS enforces hard mathematical safety constraints.
> 
> When attempting to assign a widebody Boeing 777 with a 64.8-meter wingspan to Gate A1 with a 36-meter limit, our backend GateService triggers physical wingspan validation and rejects the transaction with an HTTP 409 Conflict exception.
> 
> Reassigning to Gate B2 succeeds immediately, maintaining strict aerodrome safety compliance. I now hand over to Anay for turnaround coordination."

---

### Segment 2 Spoken Card (`4:55 - 5:15`)
**Visual Action on Screen**:
- Switch to Terminal.
- Run: `./mvnw test`
- Show test execution log: 109 tests run, 0 failures, 0 errors, BUILD SUCCESS.

**Spoken Script**:
> "To ensure system reliability, we execute our automated test suite. Spring Boot and Mockito execute 109 unit tests with zero failures, validating security boundaries, gate constraints, and tariff calculations."

---

### Segment 3 Spoken Card (`5:20 - 5:22`)
**Spoken Script**:
> "Backed by rigorous UML modeling and 109 passing automated unit tests."

---

# Member 4: Anay Modi (Roll Number: I088)
**Role**: Backend API & Logistics Lead  
**Assigned Time Segments**:
- **Segment 1**: AOCC Turnaround, Delay Attribution, Logistics & Billing (`3:30 - 4:30`) [60 seconds]
- **Segment 2**: Final Group Sign-Off (`5:26 - 5:30`) [4 seconds]

---

### Segment 1 Spoken Card (`3:30 - 4:30`)
**Visual Action on Screen**:
- Login as Airport Operations Manager (`sai.sharma` / `password123`) on `/login`.
- Redirects to `/dashboard/aocc`.
- Expand Flight `6E-204` Turnaround: Show milestone progress. Mark "Fueling" as Completed -> Progress bar updates from 40% to 60%.
- **Log Delay**: Click **Log Delay** on Flight `AI-101` -> Select IATA Delay Code `89` (Ground Handling Delay), Duration `25 mins`, Note *"Baggage belt congestion during transit transfer"* -> Submit -> Status updates to `DELAYED (+25m)`.
- Navigate to `/dashboard/logistics`: Show Baggage Carousels (Belts 01 to 08), assign Belt 04 to incoming flight.
- Navigate to `/dashboard/billing`: Show airline invoice table and itemized line items (Landing Fees based on MTOW, parking fees).

**Spoken Script**:
> "I am Anay Modi, Roll Number I088, leading Backend APIs and Logistics.
> 
> In the AOCC Command Center, dispatchers monitor end-to-end turnaround lifecycles. Updating fueling milestones triggers reactive progress recalculation across ground teams.
> 
> When disruptions occur, logging an IATA Delay Code 89 with operator telemetry updates flight records and alerts airside handlers in real time.
> 
> In our Logistics desk, we dynamically assign baggage claim carousels, while our Billing engine calculates automated aeronautical tariffs based on aircraft Maximum Takeoff Weight and apron dwell time. I hand back to Krishna for security governance and test verification."

---

### Segment 2 Spoken Card (`5:26 - 5:30`)
**Spoken Script**:
> "This concludes our live demonstration. Thank you for your evaluation."

---

## Quick Reference Summary Table for Recording

| Member | Roll Number | Role | Segments | Key Screens / Commands |
| :--- | :--- | :--- | :--- | :--- |
| **Krishna Solanki** | **I075** | Database & Integration Lead | `0:00-0:45`, `4:30-4:55`, `5:15-5:20` | Terminal `./start.sh`, Actuator healthcheck, `/dashboard/system-admin`, `auth_sessions` |
| **Anuvrat Tripathi** | **I080** | Frontend UI/UX Lead | `0:45-1:30`, `1:30-2:30`, `5:22-5:26` | `/`, `/tracker`, `/schedule`, `/dashboard/check-in`, PNR `PNR00001`, Seat `12A`, Bag Tag `18.5kg` |
| **Chaitanya Tikku** | **I078** | QA & Logic Lead | `2:30-3:30`, `4:55-5:15`, `5:20-5:22` | `/dashboard/airside-ops`, Gate A1 conflict rejection (HTTP 409), Gate B2 assign, `./mvnw test` |
| **Anay Modi** | **I088** | Backend API & Logistics Lead | `3:30-4:30`, `5:26-5:30` | `/dashboard/aocc` (Turnaround, Delay Code 89), `/dashboard/logistics` (Belt 04), `/dashboard/billing` |
