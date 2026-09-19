# SAPHIRE AERODROME & AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
## Frontend Web Application & Master Operations Guide

---

## 🛫 Executive Overview

The **Saphire Airport Operations Coordination System (AOCS)** is an enterprise-grade, real-time aerodrome coordination and passenger experience platform. Engineered with a **React 18, TypeScript, and Vite** frontend architecture and inspired by luxury aviation standards (Proptia aesthetics, Deep Navy `#0F2942`, Sky Cyan `#0284C7`, Emerald `#10B981`, and Warm Sand `#FAF9F6`), the platform bridges **public passenger hospitality** directly with **airside operations control**.

### Core Architectural Pillars
- **Dual Surface Architecture**:
  1. **Public Passenger Portal**: Live commercial radar, interactive baggage journey tracker, terminal facilities, and a direct Lost & Found reporting bridge.
  2. **Unified Operations Dashboard Shell (`DashboardLayout.tsx`)**: Dynamic role-based shell serving 7 specialized operations dashboards with contextual navigation, active subview hash routing, and real-time pub/sub synchronization.
- **Reactive Pub/Sub Data Store (`aocsDataStore.ts`)**: Cross-dashboard reactive state engine synchronizing turnaround task milestones, gate reassignments, flight statuses, baggage scans, security incidents, and audit trails across all dashboards with zero manual page refreshes.
- **Master Administrative Dispatch Authority**: Executive dispatch console providing System Administrators with operational overrides, an all-seeing real-time audit log stream, and a typable `Ctrl+K` global search across 6 entity domains.
- **Interactive KPI Telemetry**: Every KPI metric across all dashboards functions as an interactive click-to-filter trigger with visual filter chips and telemetry drawers.

---

## 🔐 Staff Roles, Credentials & Passkeys

Authentication supports both **Operational Email aliases**, **Short Role names**, and **Database Usernames** paired with the unified production passkey:

| Role | Operational Email / Username | DB Username | Valid Passkey | Assigned Dashboard Route | Primary Department |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@saphire.in`<br>`admin` | `user_10_aarav` | `SaphireOps@2026` | `/dashboard/system-admin` | Terminal Management & IT |
| **AOCC Controller** *(Ops Manager)* | `aocc@saphire.in`<br>`aocc` | `user_1_sai` | `SaphireOps@2026` | `/dashboard/aocc` | Flight Operations Center |
| **Ground Ops Supervisor** | `ground@saphire.in`<br>`ground` | `user_2_riya` | `SaphireOps@2026` | `/dashboard/ground-ops` | Ground Handling & Ramp |
| **Department Staff** *(Finance/Billing)* | `department@saphire.in`<br>`dept` | `user_9_elena` | `SaphireOps@2026` | `/dashboard/department` | Finance, Cleaning, Fuel, Maint. |
| **Airside Operations** *(Gate Agent)* | `airside@saphire.in`<br>`airside` | `user_5_aditya` | `SaphireOps@2026` | `/dashboard/airside-ops` | Airside Operations & Stands |
| **Logistics & Baggage** | `logistics@saphire.in`<br>`logistics` | `user_3_priya` | `SaphireOps@2026` | `/dashboard/logistics` | Logistics & Cargo Handling |
| **Passenger & Security** | `passenger@saphire.in`<br>`passenger` | `user_7_aarav` | `SaphireOps@2026` | `/dashboard/passenger-security` | Terminal Security & Border Control |

> **Quick Login Tip**: The `/login` portal includes convenient one-click role selector pills that automatically populate valid credentials for any role.

---

## 🖥️ The 7 Operations Dashboards

```
   ┌───────────────────────────────────────────────────────────┐
   │             1. SYSTEM ADMINISTRATOR DASHBOARD             │
   │  • Master Operational Overrides (Force Status / Stands)    │
   │  • All-Seeing Live Audit Stream across all 7 Domains       │
   │  • Admin-Exclusive Typable Global Search (Ctrl+K)         │
   └─────────────┬───────────────────────────────┬─────────────┘
                 │                               │
       ┌─────────▼─────────┐           ┌─────────▼─────────┐
       │2. AOCC CONTROLLER │           │5. AIRSIDE OPS     │
       │  • Turnaround SLA │           │  • Gate Allocation│
       │  • Delay Triage   │           │  • Vector Radar   │
       └─────────┬─────────┘           └─────────┬─────────┘
                 │                               │
       ┌─────────▼─────────┐           ┌─────────▼─────────┐
       │3. GROUND OPS      │           │6. LOGISTICS & BAG │
       │  • Ramp Handling  │           │  • Cargo Manifest │
       │  • Task Execution │           │  • Carousel Belts │
       └─────────┬─────────┘           └─────────┬─────────┘
                 │                               │
       ┌─────────▼─────────┐           ┌─────────▼─────────┐
       │4. DEPARTMENT OPS  │           │7. PASSENGER & SEC │
       │  • Cleaning       │           │  • Boarding Gate  │
       │  • Refueling      │           │  • Prereq Gating  │
       │  • Line Maint.    │           │  • Lost & Found   │
       │  • Security Sweep │           │  • Security Alert │
       └───────────────────┴───────────┴─────────▲─────────┘
                                                 │
                         ┌───────────────────────┴───────────────────────┐
                         │       PUBLIC PASSENGER WEB PORTAL             │
                         │  • Flight Tracker & Commercial Radar          │
                         │  • 5-Stage Baggage Journey Telemetry          │
                         │  • Lost & Found Central Bureau Intake         │
                         └───────────────────────────────────────────────┘
```

---

### 1. System Administrator Dashboard (`/dashboard/system-admin`)
* **Role**: `SYSTEM_ADMIN` (`user_10_aarav` / `admin@saphire.in`)
* **Core Modules**:
  - **Master Operational Overrides Console**: Executive dispatch authority to forcibly resolve aerodrome bottlenecks:
    - *Force-Push Flight State*: Bypasses standard operational sequence with certified reason logging.
    - *Master Stand Eviction & Allocation*: Overrides airside gate occupancy conflicts.
    - *Emergency Turnaround Sign-Off*: Instantly certifies all 4 department turnaround prerequisites.
    - *Terminal Facility Lockdown*: Emergency directive locking/unlocking boarding turnstiles across Terminal 1 or 2.
  - **All-Seeing Real-Time Audit Trail**: Filterable live stream aggregating audit logs from all 7 dashboards (`ALL`, `GATE`, `TASK`, `FUEL`, `FLIGHT`, `SECURITY`, `LOGISTICS`, `ADMIN`).
  - **Turnaround SLA Telemetry Drawer**: Interactive drawer displaying prerequisite progress across all active commercial flights.
  - **Functional Global Search (`Ctrl+K`)**: Typable search modal strictly restricted to the System Administrator, querying Flights, Aerobridges/Stands, Staff Accounts, Baggage Barcodes, Security Tickets, and Audit Logs.
  - **Interactive KPIs**: Total Active Users, System Health %, Master Dispatches, Audit Events Logged.

---

### 2. AOCC Controller Dashboard (`/dashboard/aocc`)
* **Role**: `AOCC_CONTROLLER` (`user_1_sai` / `aocc@saphire.in`)
* **Core Modules**:
  - **Airport Operations Center (AOCC) Flight Matrix**: Central commercial movements board displaying turnaround stage, progress percentages, origin/destination, gate assignments, and scheduled/estimated times.
  - **Turnaround Task Progression**: Advance turnaround tasks directly from the flight matrix with automatic cross-dashboard propagation.
  - **Stand & Gate Reassignment**: Change gates dynamically with conflict alerts.
  - **Delay Triage Console**: Assign IATA delay codes and update estimated timestamps.
  - **Interactive KPIs**: Total Active Flights, Departures Pending, Average Turnaround Time, Delayed Flights.

---

### 3. Ground Handling Supervisor Dashboard (`/dashboard/ground-ops`)
* **Role**: `GROUND_OPS_SUPERVISOR` (`user_2_riya` / `ground@saphire.in`)
* **Core Modules**:
  - **Ramp & Apron Service Dispatch**: Live Kanban and table views tracking tasks across Cleaning, Fueling, Baggage Handling, Catering, and Line Maintenance.
  - **Interactive Task Execution**: Update task statuses (`PENDING` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `COMPLETED`).
  - **Ramp Safety Incidents**: Real-time logging and dispatch of apron safety notices.
  - **Interactive KPIs**: Active Turnarounds, On-Time Service Rate, Ramp Staff On Duty, Pending Tasks.

---

### 4. Department Operations Dashboard (`/dashboard/department`)
* **Role**: `DEPARTMENT_STAFF` (`user_9_elena` / `department@saphire.in`)
* **Core Modules**:
  - **Multi-Department Workspace Switcher**:
    1. *Cabin Cleaning*: Cabin sanitization, premium cabin turnover, waste clearance sign-off.
    2. *Fuel Operations*: Jet A-1 hydrant dispensing, bowser dispatch, meter logging (liters dispensed, density, bowser ID).
    3. *Line Maintenance*: Avionics pre-flight release, tire pressure checks, APU diagnostics sign-off.
    4. *Security Sweeps*: K9 explosive sweeps, airside perimeter checks, security clearance sign-off.
  - **Interactive 16-KPI Grid**: Every department workspace features 4 interactive KPI cards with click-to-filter tables and active filter chips.

---

### 5. Airside Operations Dashboard (`/dashboard/airside-ops`)
* **Role**: `AIRSIDE_OPERATIONS` (`user_5_aditya` / `airside@saphire.in`)
* **Core Modules**:
  - **Gate & Stand Allocation Matrix**: Real-time graphical stand allocation across Terminal 1 and Terminal 2 aerobridges.
  - **Interactive Stand Status Filter**: Filter stands instantly by `AVAILABLE`, `OCCUPIED`, or `MAINTENANCE`.
  - **Aircraft Stand Reassignment**: Validate wingspan and MTOW constraints and assign gates.
  - **Runway & Vector Status**: Monitor runway surface conditions (`DRY`, `WET`, `LVP Active`), approach intervals, and wind vectors.
  - **Interactive KPIs**: Total Aerobridges, Available Stands, Occupied Stands, Runway Active Status.

---

### 6. Logistics & Baggage Dashboard (`/dashboard/logistics`)
* **Role**: `LOGISTICS_SUPERVISOR` (`user_3_priya` / `logistics@saphire.in`)
* **Core Modules**:
  - **Cargo Manifest Console**: Manage ULD containers, cargo weights, dangerous goods declarations, and customs clearance status.
  - **Dynamic Cargo Filtering**: Interactive filter chips for `ACTIVE`, `LOADED`, and `ALL` manifests with real-time weight accumulator math.
  - **Baggage Reclaim Carousel Allocation**: Assign arrival carousels (Belts 1–8) to inbound flights with interactive `ACTIVE` vs. `AVAILABLE` carousel filtering.
  - **Fuel Operations Logging**: Fuel hydrants, bowsers, and fuel consumption tracking.
  - **Interactive KPIs**: Total Cargo Tonnage, Active ULD Containers, Active Reclaim Belts, Fuel Dispensed.

---

### 7. Passenger & Security Operations Dashboard (`/dashboard/passenger-security`)
* **Role**: `SECURITY_OFFICER` (`user_7_aarav` / `passenger@saphire.in`)
* **Core Modules**:
  - **Turnaround Prerequisite Gating Engine**:
    - Enforces mandatory verification across **Security Sweeps**, **Cabin Cleaning**, **Maintenance Release**, and **Fueling Completion**.
    - If any prerequisite is incomplete, the boarding gate displays:
      $$\text{⚠ BOARDING LOCKED: Mandatory airside clearance prerequisites pending verification}$$
    - Once all 4 departments sign off, boarding turnstiles automatically unlock.
  - **Boarding Lifecycle Control**: `Start Boarding` $\rightarrow$ `Broadcast Final Call` $\rightarrow$ `Close Boarding` $\rightarrow$ `Sign-Off Pushback Ready`.
  - **Passenger Security & Boarding Manifest**: View booked passengers, boarding passes, verification methods (`BIOMETRIC_EGATE`, `BARCODE_SCAN`, `OFFICER_MANUAL`), and clearance flags.
  - **Lost & Found Command Center**: Direct receiver of reports filed on the public website; allows officers to review claims, match inventory, and update statuses (`Searching` $\rightarrow$ `Matched` $\rightarrow$ `Ready for Collection` $\rightarrow$ `Returned`).
  - **Security Incidents Console**: Log, triage, and resolve terminal and concourse incident tickets.
  - **VIP Lounge Occupancy Telemetry**: Real-time guest counts and capacity gauges across airport lounges.
  - **Interactive KPIs**: Total Booked Manifest, Checked-In %, Boarded %, Active Incidents.

---

## 🌐 Public Passenger Web Portal

The public web experience provides world-class traveler hospitality and operational transparency:

### 1. Home (`/`)
- **Interactive Aircraft Canvas**: Smooth scroll-scrubbed 3D touchdown canvas animation.
- **Floating Seam Bridge & Flight Finder**: Quick search input forwarding queries directly to the Flight Tracker.
- **Live Terminal Departures Matrix (`LiveFlightMatrix`)**: Real-time terminal departure board connected to reactive store events with dynamic active movement counters.
- **Passenger Excellence Pillars**: Clean cards highlighting executive lounges, aerodrome dining, and retail pavilions.
- **Airport Amenities Accordion**: Curated guest facilities, FastTrack security, and VIP transport.

### 2. Flight Status & Radar Tracker (`/tracker`)
- **Dual-Mode Telemetry Console**:
  1. *Commercial Flight Radar & Schedules*: Search flights by carrier, route, or flight number; filter by status (`BOARDING`, `ON TIME`, `TAXING`, `DELAYED`); view waypoint route arcs, stand/gate, and aircraft details. URL search parameter pre-fill support (`/tracker?flight=AI-203`).
  2. *Luggage & Baggage Journey Tracker*: Enter a 10-digit bag barcode (or test with sample tags `BAG-AI203-8821`, `BAG-AI203-8822`, `BAG-6E521-1049`, `BAG-UK901-5541`) to see:
     - Passenger name, flight number, weight, priority tier (`VIP Priority` / `Standard Hold`).
     - **5-Stage Optical Progression Pipeline**: Check-In $\rightarrow$ Inline CTX Screening $\rightarrow$ Airside Sortation $\rightarrow$ Cargo Hold Stowed $\rightarrow$ Arrival Reclaim Belt.
     - Verifiable optical scan milestone log with scanner IDs, timestamps, and locations.
- **Airport Operational Notices & NOTAMs**: Live advisories on runway maintenance, e-Gate availability, and Low Visibility Procedures (LVP).

### 3. Passenger Services & Amenities (`/passenger-services`)
- **Interactive Lost & Found Central Bureau**:
  - *"File Misplaced Property Report" Modal Dialog*: Passengers log misplaced items with category, color, location, flight, passenger name, and contact phone/email. Submitting generates an official reference ID (`LF-2024-XXX`) and pushes the ticket directly to the Terminal Security Dispatch Bureau queue.
  - *Real-Time Claim Status Search*: Passengers track claims by reference ID, viewing real-time status chips (`NEW_REPORT`, `SEARCHING`, `MATCHED`, `READY_FOR_COLLECTION`, `RETURNED`), assigned storage lockers, and collection desk instructions.
- **Executive VIP Sanctuaries**: Live occupancy indicators across executive lounges (e.g. VIP Sanctuary at 74% capacity, FastTrack lanes active).
- **Medical & Universal Accessibility**: 24/7 medical clinic information, wheelchair assistance, and escorts.
- **Guest Inquiries & FAQ Accordion**: Minimalist editorial FAQ covering check-in times, baggage desks, and terminal Wi-Fi.

### 4. Additional Informational Pages
- **Flight Schedule (`/schedule`)**: Weekly schedules, route maps, and seasonal airline services.
- **Cargo Information (`/cargo-info`)**: Cold chain facilities, air freight logistics, ULD container specs, and dangerous goods handling.
- **Airport Information (`/airport-info`)**: Aerodrome specifications, runway coordinates, terminal layouts, and ground transit.
- **Contact & Concierge (`/contact`)**: Customer care directory, emergency hotlines, and terminal information kiosks.
- **Authentication Portal (`/login`)**: Secure staff access with role autofill pills, security badge styling, and error handling.

---

## 🛠️ Technology Stack & Dependencies

```json
{
  "frontend": {
    "framework": "React 18 (TypeScript)",
    "build_tool": "Vite 8.1.5",
    "styling": "Material UI (MUI v5) + Emotion + Custom CSS Variables",
    "typography": "Outfit, Plus Jakarta Sans, Inter, Geist Mono",
    "charts": "Recharts",
    "icons": "Lucide React",
    "notifications": "React Hot Toast",
    "router": "React Router DOM v6"
  }
}
```

---

## 🚀 Running the Project Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Development
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The application will be accessible at `http://localhost:3000/`.

### Production Build & Verification
```bash
# Run strict TypeScript verification
npx tsc --noEmit

# Compile production distribution bundle
npm run build
```

---

## 📋 Quality Assurance Checklist

- [x] **100% Backend Endpoints Mapped**: All 10 Spring Boot controllers connected via typed API clients.
- [x] **25–30% Value-Add Capabilities**: Multi-department prerequisite gating, master administrative dispatch, baggage journey stepper, and public Lost & Found bridge.
- [x] **7 Dashboards Fully Interconnected**: Real-time pub/sub synchronization via `aocsDataStore`.
- [x] **Admin-Exclusive Global Search**: Typable `Ctrl+K` modal restricted strictly to the System Administrator.
- [x] **Interactive KPI Cards**: All top KPI cards across all 7 dashboards are clickable with filter chips and telemetry drawers.
- [x] **Zero Dummy Bloat**: Removed all hardcoded `+26`/`+20` numbers; live accumulator math implemented.
- [x] **Zero Banned Slang**: Professional, enterprise-grade terminology maintained throughout.
- [x] **Clean Production Build**: Zero TypeScript errors (`npx tsc --noEmit` and `npm run build` pass cleanly).
