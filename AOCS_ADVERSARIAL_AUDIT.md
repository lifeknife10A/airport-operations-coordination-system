# ADVERSARIAL REPOSITORY AUDIT: AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
**Lead Auditor:** Senior Principal Frontend Architect, Systems Reviewer, Aviation Ops Analyst & Lead QA  
**Date of Assessment:** September 2026  
**Target Repository:** Airport Operations Coordination System (AOCS)  
**Evaluation Scope:** Complete Full-Stack Codebase (`frontend/`, `backend/`, `db/`, `documentation/`)  
**Audit Posture:** Adversarial, Evidence-Based, Zero Code Tampering  

---

## 1. EXECUTIVE SUMMARY

### 1.1 Overview of Current System State
The Airport Operations Coordination System (AOCS) is conceived as an integrated aerodrome operations command center that bridges airside management, landside passenger processing, turnaround ground handling, department handovers, and public flight information displays. The system is architecturally split into two primary operational tiers:
1. **Public Passenger Portal (~20%):** A client-facing web application encompassing live flight tracking, schedules, passenger services (Lost & Found intake, special assistance), cargo information, aerodrome facilities, and contact desk.
2. **Internal Operations Hub (~80%):** A role-governed operational cockpit serving 8 specialized airport personas (System Admin, AOCC Controller, Ground Handling Supervisor, Department Workspaces [Cleaning, Fuel, Maintenance, Security], Airside Ops Lead, Logistics Supervisor, Passenger & Security Ops, and Check-In & Boarding Services).

Visually, the frontend exhibits high aesthetic maturity. The design system features deep midnight navy `#0F2942`, professional cyan-sky `#0284C7`, slate borders `#E2E8F0`, crisp Lucide iconography, Material-UI layout containers, and Framer Motion micro-interactions. Domain models faithfully mirror genuine ICAO/IATA concepts (turnaround milestones, dual fuel sign-offs, baggage scan state machines, boarding pass PDF/barcode generation, and spatial stand grids).

However, an unsparing engineering inspection reveals that **the frontend and backend live in almost completely detached realities**:

1. **The "Ghost Network" Façade:** Despite having 10 robust Axios API clients in `frontend/src/api/` (`flightApi`, `gateApi`, `taskApi`, `baggageApi`, `borderControlApi`, `billingApi`, `auditApi`, `featureModulesApi`, etc.) and a full Spring Boot REST layer with 12 controllers and 18 JPA entities, **not a single dashboard component connects directly to these remote endpoints**.
2. **The LocalStorage / In-Memory Isolation:** Across all 8 operational role dashboards, cross-role coordination is powered entirely by `frontend/src/services/aocsDataStore.ts`, a client-side pub-sub singleton backed by browser `localStorage`. While state reactivity works remarkably well between multiple tabs on the same computer, the application is fundamentally an offline simulation masquerading as a distributed airport coordination system.
3. **Monolithic Component Architecture:** Several UI components have grown into massive monolithic files exceeding 2,000 lines of code (`PassengerSecurityOpsDashboard.tsx` is 2,857 lines; `SystemAdminDashboard.tsx` is 2,676 lines; `DepartmentDashboard.tsx` is 1,820 lines; `AirsideOpsDashboard.tsx` is 1,632 lines; `DashboardLayout.tsx` is 1,068 lines). These files combine data models, mock datasets, state management, complex table renderings, canvas overlays, and modal forms in single translation units.
4. **Complete Absence of Automated Tests:** `npm test` fails immediately with `Missing script: "test"`. There are **zero automated frontend unit or integration tests**. While `tsc -b && vite build` compiles cleanly in 1.39 seconds, there is no safety net ensuring that critical operations (e.g. gate allocation conflict resolution, turnaround prerequisite gating, or security sign-offs) do not break during refactoring.

### 1.2 Honest Assessment of Maturity
- **Visual Design & Layout:** **Grade: A- (88/100)**. Professional color palette, clear information hierarchy, high-density aviation data grids, responsive sidebars, and realistic operational terminology.
- **Frontend Architecture & State:** **Grade: B- (70/100)**. Clean pub-sub bus in `aocsDataStore.ts` with typed events, but marred by extreme component file size, inline mock state duplication, and missing route guards.
- **Backend & Network Integration:** **Grade: D (45/100)**. Fully designed Spring Boot REST backend with Flyway migrations exists, but frontend runtime is decoupled and operates almost exclusively on local fallback mock seeds.
- **Production Readiness & Quality Assurance:** **Grade: F (32/100)**. Zero frontend tests, unhandled network timeouts, lack of server-side data synchronization across browser sessions, and several unvalidated form workflows.

## 2. ACTUAL IMPLEMENTATION INVENTORY

To eliminate ambiguity between what is actually coded versus what is merely mocked or non-functional, the table below provides a strict classification of every major feature across the repository.

| Module / Feature | File Location | Implementation Status | Ground Truth & Evidence |
| :--- | :--- | :--- | :--- |
| **Authentication & RBAC** | `frontend/src/context/AuthContext.tsx`, `backend/.../AuthController.java` | **IMPLEMENTED AND WORKING (Hybrid)** | Real POST `/api/auth/login` to Spring Boot backend with JWT token storage. Gracefully falls back to 8 pre-seeded offline role accounts if Spring Boot is unreachable. Role-based routing verified in `DashboardLayout.tsx`. |
| **Shared Shell & Unified Navigation** | `frontend/src/components/dashboard/DashboardLayout.tsx` | **IMPLEMENTED AND WORKING** | Dynamically loads sidebar modules based on active route and user role. Real-time notification badge counts, active route highlighting, user initials, quick role switcher, and responsive drawer toggles work reliably. |
| **Cross-Role Data Store & Event Bus** | `frontend/src/services/aocsDataStore.ts` | **IMPLEMENTED AND WORKING (Client-Side Only)** | Fully operational reactive event emitter with `localStorage` persistence. Emits and handles 11 distinct event types (`FLIGHT_UPDATED`, `GATE_ASSIGNED`, `TASK_UPDATED`, `LOST_ITEM_REPORTED`, etc.). Cross-tab sync verified via window storage events. |
| **Public Flight Tracker** | `frontend/src/pages/public/FlightTracker.tsx` | **PARTIALLY IMPLEMENTED** | Real-time flight search, route filtering, and baggage tag lookup query `aocsDataStore`. However, no direct HTTP calls to `backend/FlightController` or `BaggageController` are dispatched from this component. |
| **Public Passenger Services (Lost & Found)** | `frontend/src/pages/public/PassengerServices.tsx` | **PARTIALLY IMPLEMENTED** | Users can submit lost baggage/item claims. Writes to `aocsDataStore.reportLostItem()` and reflects in `PassengerSecurityOpsDashboard.tsx`. Bypasses Spring Boot backend persistence. |
| **Boarding Pass Desk & Check-In Counter** | `frontend/src/pages/dashboards/PassengerCheckInDashboard.tsx` | **IMPLEMENTED AND WORKING (Client Store)** | Complete PNR lookup, interactive seat allocation map, baggage induction scale, hazardous materials declaration, and browser print-ready boarding pass with rendered barcode and QR code. Operates on local store. |
| **Spatial Gate Allocation Grid** | `frontend/src/pages/dashboards/AirsideOpsDashboard.tsx` | **IMPLEMENTED AND WORKING (Client Store)** | Interactive grid of 24 aerodrome stands/gates. Filtering by concourse, status toggles, flight assignment modal, and conflict validation operate against `aocsDataStore`. Updates reflect across AOCC dashboard. |
| **Department Turnaround Workspaces** | `frontend/src/pages/dashboards/DepartmentDashboard.tsx` | **IMPLEMENTED BUT BROKEN (Minor Layout)** | All 4 sub-workspaces (Cleaning, Fuel, Line Maintenance, Security) have deep interactive state machines. Fuel dual-signature sign-off and Security PIN sweep function correctly. **Broken:** Security table column widths cause the button text to clip as `Sign-of` at line 1516. |
| **Logistics & Baggage Carousel Management** | `frontend/src/pages/dashboards/LogisticsDashboard.tsx` | **PARTIALLY IMPLEMENTED** | Carousel load telemetry, ULD cargo manifest inspection, and baggage scan injection exist. Connects to `aocsDataStore`, but simulated belt speed and luggage rates are client-side pseudo-random intervals. |
| **Passenger & Security Operations Hub** | `frontend/src/pages/dashboards/PassengerSecurityOpsDashboard.tsx` | **IMPLEMENTED AND WORKING (Client Store)** | Checkpoint wait-time sliders, metal detector alarm logging, passenger clearance watchlist verification, and full Lost & Found claim matching/resolution modal operate seamlessly via `aocsDataStore`. |
| **AOCC Turnaround Timeline & Gantt** | `frontend/src/pages/dashboards/AOCCControllerDashboard.tsx` | **UI ONLY / MOCK DATA** | Visual turnaround progress bars and milestone checklists look high-tech, but task progress percentages are hardcoded or tied to static client arrays rather than real-time telemetry feeds. |
| **Report Generation & Export Engine** | `frontend/src/utils/exportReports.ts`, `backend/.../ReportController.java` | **IMPLEMENTED AND WORKING (Client Fallback)** | Exports genuine CSV, PDF (`%PDF-1.4`), and Excel spreadsheet files directly in the browser via Blob synthesis. Spring Boot backend endpoints (`/api/reports/...`) exist but are bypassed by the frontend utility. |
| **Automated Testing Suite** | `frontend/package.json` | **NOT IMPLEMENTED** | `npm test` script is completely absent. Zero unit tests, zero E2E integration specs, and zero linter tests configured in CI pipeline. |
| **Spring Boot Remote API Persistence** | `frontend/src/api/*` vs `frontend/src/pages/dashboards/*` | **IMPLEMENTED BUT DISCONNECTED** | 10 API wrappers exist with full Axios CRUD contracts, but dashboards rely entirely on `aocsDataStore.ts`. If `localStorage` is cleared, all state resets to seed defaults regardless of PostgreSQL database contents. |

## 3. TOP 10 MOST CONSEQUENTIAL PROBLEMS

The following ten architectural, operational, and UX defects represent the highest-risk vulnerabilities and deficiencies in the current repository:

### 1. Total Disconnect Between Operational Dashboards and Spring Boot Backend
- **Location:** `frontend/src/pages/dashboards/*` vs `frontend/src/services/aocsDataStore.ts` & `frontend/src/api/*`
- **Root Cause:** All role dashboards import and interact with `aocsDataStore.ts`. The store provides synchronous getters and setters that mutate in-memory state and write to browser `localStorage`. Although `aocsDataStore.ts` imports `flightApi`, `gateApi`, `taskApi`, etc., it never actually executes HTTP requests to sync with Spring Boot (`backend/src/main/java/com/saphire/aocs/controller/`).
- **Consequence:** Two different operators opening the system on different devices cannot collaborate. If Controller A assigns Flight AI-203 to Gate A12 on Laptop 1, Ground Supervisor B on Laptop 2 will not see the change. The system fails its foundational mission: *Airport Coordination*.
- **Smallest Practical Fix:** Introduce a remote sync synchronization method in `aocsDataStore.ts` on bootstrap (`initRemoteSync()`) that performs an initial `Promise.all()` across `flightApi.getAll()`, `gateApi.getAll()`, and `taskApi.getAll()`. On mutations (`assignGate`, `updateFlightStatus`), issue fire-and-forget background Axios calls to the backend while preserving the local optimistic update.

### 2. Zero Automated Frontend Test Suite
- **Location:** `frontend/package.json` (line 15)
- **Root Cause:** Running `npm test` outputs `npm error Missing script: "test"`. No testing runner (Vitest/Jest) or assertion library (Testing Library) is configured.
- **Consequence:** High regression risk. In an enterprise system with 8 interconnected dashboards sharing an in-memory event bus, any refactor to `aocsDataStore.ts` or `DashboardLayout.tsx` risks silently breaking turnaround gating logic, security clearances, or role routing with zero build-time warnings.
- **Smallest Practical Fix:** Add Vitest and `@testing-library/react` to `devDependencies`. Add a `"test": "vitest run"` script in `package.json`, and write a minimal test verifying `aocsDataStore.assignGate()` and `aocsDataStore.updateTaskStatus()`.

### 3. Monolithic Component Sprawl (Over 2,800 Lines per File)
- **Location:** `PassengerSecurityOpsDashboard.tsx` (2,857 lines), `SystemAdminDashboard.tsx` (2,676 lines), `DepartmentDashboard.tsx` (1,820 lines), `AirsideOpsDashboard.tsx` (1,632 lines).
- **Root Cause:** Dashboard pages contain large inline mock data arrays, local modal state, sub-view renderers, tab managers, and CSS styles bundled into single `.tsx` files.
- **Consequence:** Extreme cognitive overload for developers, slow IDE language server responsiveness, merge conflict hazards, and high risk of unintended side-effects during maintenance.
- **Smallest Practical Fix:** Extract tab sub-views into dedicated sub-component folders (e.g. `src/pages/dashboards/passenger-security/components/LostFoundTab.tsx`, `SecurityScreeningTab.tsx`).

### 4. Layout Clipping: Button Truncation in Security Clearance Matrix
- **Location:** `frontend/src/pages/dashboards/DepartmentDashboard.tsx` (lines 1467–1520)
- **Root Cause:** The table container specifies `overflowX: 'hidden'`, and the table uses `tableLayout: 'fixed'`. The final column `ACTION` is constrained to `width: '12%'`. When combined with padding and standard DPI scaling, the text "Sign-off" inside the MUI `Button` exceeds the cell boundary and visibly clips as `Sign-of`.
- **Consequence:** Looks unprofessional during live evaluations and indicates brittle CSS layout math.
- **Smallest Practical Fix:** In `DepartmentDashboard.tsx`, widen the `ACTION` column from `width: '12%'` to `width: '16%'`, and narrow the `AIRCRAFT` column from `28%` to `24%`. Set `minWidth: '90px'` on the button container.

### 5. Inconsistent Terminal Naming Terminology
- **Location:** `frontend/src/pages/dashboards/AirsideOpsDashboard.tsx` (lines 227–228, 637, 1031) vs `aocsDataStore.ts` (lines 151–160)
- **Root Cause:** The system's official aerodrome specification establishes a single integrated terminal ("Central Terminal") split into Concourse A (Gates A01–A12) and Concourse B (Gates B01–B12). However, filter buttons and copy in `AirsideOpsDashboard.tsx` still reference `T1 Concourse A` and `T2 Concourse B`.
- **Consequence:** Operational confusion. Flight information boards show "Central Terminal", but airside controllers see legacy "T1 / T2" tags.
- **Smallest Practical Fix:** In `AirsideOpsDashboard.tsx`, update terminal filter labels to `Concourse A` and `Concourse B` under `Central Terminal`, eliminating legacy "T1" and "T2" references.

### 6. Hardcoded Stale Timestamps in Airside Telemetry
- **Location:** `frontend/src/pages/dashboards/AirsideOpsDashboard.tsx` (line 419)
- **Root Cause:** Header badge displays hardcoded text: `Live Airport Telemetry • 19 Sep 12:05 IST`.
- **Consequence:** Destroys the illusion of real-time monitoring when evaluated outside September 19, 2026.
- **Smallest Practical Fix:** Replace the static string with dynamic clock state (`new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST'`).

### 7. Dual Fuel Workflow Redundancy and Divergence
- **Location:** `DepartmentDashboard.tsx` (Fuel Tab, lines 850–1150) vs `LogisticsDashboard.tsx` (Fuel Section, lines 350–520)
- **Root Cause:** Both dashboards provide fuel order calculation and hydrants dispatch workflows. However, `DepartmentDashboard.tsx` implements a rigorous dual-technician sign-off modal with density calculators, while `LogisticsDashboard.tsx` maintains a separate, simpler fuel truck dispatch table with disconnected state.
- **Consequence:** Disjointed operational domain modeling. An airline fueling supervisor does not have a single source of truth for fuel uplifts.
- **Smallest Practical Fix:** Retain the technical calculation and safety sign-off exclusively inside `DepartmentDashboard.tsx` (Fuel Department), and convert the logistics view into a read-only fuel supply status monitor subscribing to `aocsDataStore`.

### 8. Client-Side Bypassing of Spring Boot Report Generation
- **Location:** `frontend/src/utils/exportReports.ts` vs `backend/src/main/java/com/saphire/aocs/controller/ReportController.java`
- **Root Cause:** The backend team implemented dedicated Spring Boot endpoints (`/api/reports/flight-movements/csv`, `/api/reports/gate-utilization/pdf`, `/api/reports/airline-billing/excel`). The frontend completely bypasses these endpoints and synthesizes synthetic Blobs on the client side using static hardcoded arrays.
- **Consequence:** Data exported by operators does not reflect dynamic changes saved in the PostgreSQL database.
- **Smallest Practical Fix:** In `exportReports.ts`, first attempt to fetch from `/api/reports/...` via `axiosClient.get({ responseType: 'blob' })`. If the network request fails, fall back to the existing client-side Blob generator.

### 9. Lost & Found Sync Disconnect Between Public Intake and Backend DB
- **Location:** `PassengerServices.tsx` -> `aocsDataStore.ts` -> `PassengerSecurityOpsDashboard.tsx`
- **Root Cause:** Public users can report lost items at `/passenger-services`. The report correctly saves to `aocsDataStore` and appears in the Security Officer's dashboard. However, there is no corresponding database entity or controller in `backend/` for Lost & Found (it does not exist in `schema.sql` or JPA repositories).
- **Consequence:** All lost property records are lost whenever browser storage is cleared.
- **Smallest Practical Fix:** Document this architectural boundary clearly: Lost & Found is currently an ephemeral client-side reactive service, and add a simple endpoint `/api/feature-modules/lost-found` on the backend to persist records into a JSONB table or dedicated entity.

### 10. Missing Automated Session Invalidation and Global Route Protection
- **Location:** `frontend/src/routes/AppRoutes.tsx`
- **Root Cause:** Routes like `/dashboard/system-admin`, `/dashboard/aocc`, etc., are rendered as naked elements without an enclosing `<ProtectedRoute allowedRoles={[...]} />` wrapper. While `DashboardLayout.tsx` internally redirects if `user` is null, unauthenticated or unauthorized users can momentarily mount dashboard views.
- **Consequence:** Security violation during architectural review and vulnerability to inspect-element route hijacking.
- **Smallest Practical Fix:** Create a reusable `<ProtectedRoute>` component in `frontend/src/routes/` that checks `useAuth().user` and `allowedRoles` before rendering child components, redirecting unauthenticated users to `/login`.

## 4. PUBLIC WEBSITE AUDIT, PAGE BY PAGE

The Public Passenger Portal accounts for approximately 20% of the project scope. Each page was audited for visual fidelity, functional interactivity, backend connectivity, and responsive behavior.

### 4.1 Home Page (`frontend/src/pages/public/Home.tsx`)
- **Visuals & Motion:** Excellent hero section with scroll-driven aircraft video canvas (`HeroVideo.tsx`), spotlight cards, and smooth section transitions. Concourse telemetry bento grid and operational gallery present a high-end luxury feel.
- **Behavior:** The flight search widget on the hero bar allows passengers to query flight numbers.
- **Defects & Flaws:**
  - Search queries check local static state rather than real-time updates.
  - Video scrub behavior can exhibit micro-stutter on low-end GPUs or mobile browsers without hardware-accelerated video decoding.
- **Verdict:** Production-grade visual design; needs dynamic query linkage.

### 4.2 Flight Tracker (`frontend/src/pages/public/FlightTracker.tsx` - 857 lines)
- **Visuals & Layout:** Clean tabs for Departures, Arrivals, and Baggage Locator. Renders flight status chips, route indicators, and carousel assignments.
- **Behavior:** Reads directly from `aocsDataStore.getFlights()`. Subscribes to reactive store events. If an airside controller reassigns a gate in the internal dashboard, the public flight card reflects the new gate in real time.
- **Defects & Flaws:**
  - Direct Axios requests to `/api/flights` are absent; relies purely on store seed data.
  - Baggage lookup accepts tag inputs like `BAG-AI203-01` and displays scan steps (CHECKED_IN -> SCREENED -> LOADED -> DELIVERED). However, scan events cannot be updated by external baggage handler scanners over network websockets.
- **Verdict:** Outstanding client-side reactive simulation; lacks live REST polling/WebSocket.

### 4.3 Flight Schedule (`frontend/src/pages/public/FlightSchedule.tsx` - 602 lines)
- **Visuals & Layout:** High-density Flight Information Display System (FIDS) table with search, airline filter chips, and terminal selector.
- **Behavior:** Displays scheduled departures and arrivals with status badges (ON TIME, DELAYED, BOARDING, CANCELLED).
- **Defects & Flaws:**
  - Filtering logic is purely client-side across 15 pre-seeded flights.
  - Pagination is absent; if the flight count grows past 30, the table extends the page vertically without virtualized scrolling.
- **Verdict:** Functionally sound for prototype demonstration; needs virtual table or pagination for production.

### 4.4 Passenger Services (`frontend/src/pages/public/PassengerServices.tsx` - 716 lines)
- **Visuals & Layout:** Tabbed interface providing Special Assistance booking, Lost & Found intake form, Lounge access guide, and Baggage regulations.
- **Behavior:** Lost & Found form features full input validation (Item Name, Category, Flight Number, Date Lost, Description, Contact Details). Clicking "Submit Claim" invokes `aocsDataStore.reportLostItem()` and displays an immediate reference ID (e.g. `LF-2026-XXXX`).
- **Defects & Flaws:**
  - Special assistance requests show an optimistic confirmation modal, but the request is not persisted to any backend queue or ground handling dispatch view.
- **Verdict:** Highly impressive Lost & Found intake; special assistance is UI-only.

### 4.5 Cargo Information (`frontend/src/pages/public/CargoInformation.tsx` - 222 lines)
- **Visuals & Layout:** Logistics overview displaying cold chain facilities, dangerous goods handling compliance, and air cargo tracking form.
- **Behavior:** Air Waybill (AWB) tracker accepts tracking numbers (e.g. `AWB-987-12345678`) and renders shipment progression milestones.
- **Defects & Flaws:**
  - Milestone progression is simulated via static hashing of the AWB number rather than querying an active cargo database.
- **Verdict:** High visual credibility; mock calculation logic.

### 4.6 Airport Information (`frontend/src/pages/public/AirportInformation.tsx` - 482 lines)
- **Visuals & Layout:** Comprehensive guide featuring interactive terminal concourse schematics, ground transportation tariffs, security guidelines, and duty-free dining directories.
- **Behavior:** Tab navigation is instantaneous; parking fee calculator allows passengers to estimate short-term vs long-term parking rates.
- **Defects & Flaws:**
  - Content is hardcoded inside the file instead of being sourced from an external CMS or localized JSON asset file as originally envisioned in project discussion docs.
- **Verdict:** Highly polished static resource.

### 4.7 Contact & Help Desk (`frontend/src/pages/public/Contact.tsx` - 382 lines)
- **Visuals & Layout:** Department contact cards, interactive feedback inquiry form, and terminal emergency numbers.
- **Behavior:** Form captures passenger feedback and triggers a success toast notification.
- **Defects & Flaws:**
  - Submission does not POST to `/api/feedback` or any backend logging endpoint; data is discarded after toast confirmation.
- **Verdict:** Clean interface; simulated form handling.

## 5. SHARED DASHBOARD ARCHITECTURE AUDIT (`DashboardLayout.tsx`)

The file `frontend/src/components/dashboard/DashboardLayout.tsx` (1,068 lines) serves as the unified administrative and operational shell for all 8 internal role views.

### 5.1 Dynamic Sidebar Configuration
- **Design Pattern:** The layout defines a master navigation dictionary `NAV_CONFIG: Record<string, DashboardNavGroup>` mapping route slugs to specific sidebar navigation trees with badges, icons, and categorized groupings (`MAIN`, `OPERATIONS`, `DEPARTMENTS`, `MONITORING`, `ACCOUNT`).
- **Strengths:**
  - Clean separation of navigation metadata by role.
  - Active route highlighting based on `location.pathname` and `location.hash`.
  - Responsive drawer with mobile hamburger toggle and smooth transition animations.
  - Role switcher dropdown allowing rapid demonstration of different operational personas without re-authenticating.

### 5.2 Top Navigation Bar & Notification System
- **Integration with Notification Bell:** The top navigation bar renders a Lucide `Bell` icon displaying a dynamic unread counter badge.
- **Interactive Popover:** Clicking the bell opens a popover displaying recent operational alerts categorized by severity (`CRITICAL`, `WARNING`, `AIRSIDE`, `SECURITY`, `INFO`).
- **Real-Time Notification Sync:**
  - The badge count and list subscribe to `aocsDataStore.subscribe()`.
  - When an operator clicks "Mark as Read", `aocsDataStore.toggleNotificationRead(id)` or `markAllNotificationsRead()` is triggered, updating local storage and instantly refreshing the badge count across open tabs.
  - **Verdict:** The notification bell and sidebar tab are properly synchronized and fully reactive.

### 5.3 Architectural Weaknesses in `DashboardLayout.tsx`
1. **Excessive Responsibilities:** Beyond rendering the sidebar and header, `DashboardLayout.tsx` includes user profile modals, global search modals, notification popovers, and quick-switching logic.
2. **Missing Token Expiry Interception:** If a user's JWT expires while interacting within the shell, `DashboardLayout` does not intercept 401 events globally to gracefully prompt re-login.
3. **Hardcoded User Metadata:** While user initials derive from `user?.name`, fallback values default to mock users when running in decoupled mode.

## 6. DASHBOARD AUDIT, ROLE BY ROLE

The internal operations cockpit comprises 8 primary role workspaces. Each was audited for domain fidelity, state integrity, and workflow execution.

### 6.1 System Administrator (`SystemAdminDashboard.tsx` - 2,676 lines)
- **Role Identity:** `SYSTEM_ADMINISTRATOR` (User: Admin User / Elena Vance).
- **Core Features:** User management table, role privilege matrix, flight management table, system health gauges, and immutable audit logs.
- **Operational Reality:**
  - User creation and role assignments mutate local component state.
  - Audit logs are pulled from `aocsDataStore.getAuditLogs()` and correctly append whenever administrative overrides occur.
  - Report download buttons invoke `exportReports.ts` to generate CSV/PDF files.
- **Defects:**
  - File size is unwieldy (2,676 lines).
  - Editing user privileges does not update permissions in Spring Boot's PostgreSQL `users` or `roles` tables.

### 6.2 AOCC Controller (`AOCCControllerDashboard.tsx` - 1,220 lines)
- **Role Identity:** `AIRPORT_OPERATIONS_MANAGER` (User: Sai Sharma).
- **Core Features:** Aerodrome operational overview, flight turnaround Gantt timeline, runway operational status, delay logging modal.
- **Operational Reality:**
  - Delay logging updates `aocsDataStore.updateFlightStatus()` to `DELAYED` and propagates immediately to the public tracker.
  - Turnaround task status progress is computed from local task seeds.
- **Defects:**
  - No active WebSocket connection to live radar or transponder feeds (expected in a prototype, but telemetry simulation should have controllable speed).

### 6.3 Ground Operations Supervisor (`GroundOpsSupervisorDashboard.tsx` - 1,480 lines)
- **Role Identity:** `GROUND_HANDLING_SUPERVISOR` / `RAMP_AGENT` (User: Riya Johnson).
- **Core Features:** Active flight turnaround task matrix, equipment assignment modal (Baggage Tug, Fuel Hydrant Dispenser, Passenger Bus), shift handover log.
- **Operational Reality:**
  - Task status toggles (NOT_STARTED -> IN_PROGRESS -> COMPLETED) update `aocsDataStore`.
  - Prerequisite gating prevents baggage loading until cabin cleaning is completed.
- **Defects:**
  - Shift handover notes are stored in `aocsDataStore` local memory rather than invoking `POST /api/feature-modules/handover-notes` on the backend.

### 6.4 Department Workspaces (`DepartmentDashboard.tsx` - 1,820 lines)
- **Sub-Workspaces:** Cabin Cleaning, Fuel Operations, Line Maintenance, Security Clearance.
- **Operational Reality:**
  - **Cabin Cleaning:** Checklist for Business/Economy cabin sanitization, trash clearance, and crew handover sign-off.
  - **Fuel Operations:** Uplift calculator (Block Fuel, Trip Fuel, Reserve) with dual-technician electronic sign-off.
  - **Aircraft Maintenance:** Defect logger with MEL (Minimum Equipment List) classification (CAT A, B, C) and technical release toggle.
  - **Security Clearance:** Cabin search grid with secure PIN sign-off modal.
- **Defects:**
  - Table cell truncation: Button in Security Clearance Matrix clips as `Sign-of` (line 1516).
  - Duplicate fuel workflow with Logistics dashboard.

### 6.5 Airside Operations Lead (`AirsideOpsDashboard.tsx` - 1,632 lines)
- **Role Identity:** `GATE_AGENT` / Airside Lead (User: Vikram Malhotra).
- **Core Features:** Spatial aerodrome stand grid (24 gates across Concourse A & B), runway status monitoring, gate reassignment modal.
- **Operational Reality:**
  - Reassigning a gate validates that the target stand is not occupied. Emits `GATE_ASSIGNED` event which updates public tracker and check-in boards.
- **Defects:**
  - Inconsistent terminal labeling: Filter buttons show `T1 Concourse A` and `T2 Concourse B` instead of standard `Concourse A / B`.
  - Static header date `19 Sep 12:05 IST` is frozen in time.

### 6.6 Logistics Supervisor (`LogisticsDashboard.tsx` - 1,410 lines)
- **Role Identity:** `BAGGAGE_HANDLER` (User: Priya Kumar).
- **Core Features:** Baggage carousel assignment (Belts 1–6), ULD cargo container loading manifest, baggage scan event simulator.
- **Operational Reality:**
  - Scanning a bag tag updates its status from `OFFLOADED` to `CAROUSEL_DELIVERED`, triggering real-time update in the public baggage tracker.
- **Defects:**
  - Cargo weight balancing (trim and center-of-gravity) is a static visual representation rather than a computed physical formula.

### 6.7 Passenger & Security Operations (`PassengerSecurityOpsDashboard.tsx` - 2,857 lines)
- **Role Identity:** `SECURITY_OFFICER` / `IMMIGRATION_OFFICER` (User: Aarav Patel).
- **Core Features:** Security checkpoint wait-time sliders, metal detector incident logging, watchlist passenger clearance, and Lost & Found custody ledger.
- **Operational Reality:**
  - Deepest component in the system. Full modal for matching lost property claims with found inventory, updating status to `CLAIMED` or `RETURNED`.
- **Defects:**
  - Largest monolith in the repo (2,857 lines).
  - Watchlist verification uses hardcoded mock traveler list.

### 6.8 Check-In & Boarding Services (`PassengerCheckInDashboard.tsx` - 1,065 lines)
- **Role Identity:** `CHECKIN_AGENT` (User: Meera Nair).
- **Core Features:** PNR lookup, interactive seat allocation (Airbus A350 / Boeing 777 cabin seat maps), baggage induction scale with excess baggage surcharge calculation, and boarding pass printing with rendered barcode and QR code.
- **Operational Reality:**
  - Check-in agent can look up PNR `PNR-AI203-01`, assign Seat 02A, register 2 pieces of luggage (generating tags `BAG-AI203-01` and `BAG-AI203-02`), and print an authentic boarding pass.
- **Defects:**
  - Newly generated bag tags are appended to `aocsDataStore`, but not committed to Spring Boot's `bag_tags` table.

## 7. BACKEND INTEGRATION AND API GAP MATRIX

A detailed comparison between the available Spring Boot REST endpoints and their actual usage by the frontend client:

| Backend Controller | REST Endpoint | HTTP Method | Frontend API Wrapper | Frontend UI Invocation Status | Gap Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `AuthController` | `/api/auth/login` | `POST` | `authApi.login` | **ACTIVE (Invoked in AuthContext)** | None (Works with fallback) |
| `FlightController` | `/api/flights` | `GET` | `flightApi.getAll` | **NOT INVOKED (Bypassed by store)** | **CRITICAL (P0)** |
| `FlightController` | `/api/flights/{id}/status` | `PUT` | `flightApi.updateStatus` | **NOT INVOKED (Bypassed by store)** | **CRITICAL (P0)** |
| `GateController` | `/api/gates` | `GET` | `gateApi.getAll` | **NOT INVOKED (Bypassed by store)** | **CRITICAL (P0)** |
| `GateController` | `/api/gates/assign` | `PUT` | `gateApi.assignGate` | **NOT INVOKED (Bypassed by store)** | **CRITICAL (P0)** |
| `TaskController` | `/api/tasks/flight/{id}` | `GET` | `taskApi.getByFlight` | **NOT INVOKED (Bypassed by store)** | **HIGH (P1)** |
| `TaskController` | `/api/tasks/{id}/status` | `PUT` | `taskApi.updateStatus` | **NOT INVOKED (Bypassed by store)** | **HIGH (P1)** |
| `BaggageController`| `/api/baggage/track/{tag}`| `GET` | `baggageApi.track` | **NOT INVOKED (Bypassed by store)** | **HIGH (P1)** |
| `BaggageController`| `/api/baggage/scan` | `POST` | `baggageApi.scan` | **NOT INVOKED (Bypassed by store)** | **HIGH (P1)** |
| `BorderControlController`| `/api/border-control/clearance`| `POST` | `borderControlApi.logClearance` | **NOT INVOKED (Bypassed by store)** | **MEDIUM (P2)** |
| `ReportController` | `/api/reports/summary` | `GET` | `reportApi.getSummary` | **NOT INVOKED (UI uses local array)** | **MEDIUM (P2)** |
| `ReportController` | `/api/reports/flight-movements/csv` | `GET` | None | **NOT INVOKED (Synthesized client-side)** | **MEDIUM (P2)** |
| `ReportController` | `/api/reports/gate-utilization/pdf` | `GET` | None | **NOT INVOKED (Synthesized client-side)** | **MEDIUM (P2)** |
| `ReportController` | `/api/reports/airline-billing/excel` | `GET` | None | **NOT INVOKED (Synthesized client-side)** | **MEDIUM (P2)** |
| `FeatureModulesController` | `/api/handover-notes` | `POST` | `featureModulesApi.createHandover` | **NOT INVOKED (Stored in local state)** | **LOW (P2)** |

### Architectural Root Cause
The disconnect is rooted in the prototype development sequence: The frontend developer built a completely functional, self-contained mock engine (`aocsDataStore.ts`) to enable rapid UI design and reactive demonstrations without requiring the Spring Boot service to be running. While Axios wrappers were prepared in `frontend/src/api/`, the final step of binding `aocsDataStore` mutations to trigger Axios calls was never completed.

## 8. CROSS-DEPARTMENT WORKFLOW PROBLEMS

1. **Gate Reassignment Cascade Failure:**
   - When an Airside Ops Lead changes a flight's gate from A02 to B04, `aocsDataStore.assignGate()` emits `GATE_ASSIGNED`.
   - The Public Flight Tracker and Check-In Dashboard update their UI chips accordingly.
   - **The Problem:** The Turnaround Task List for ramp agents does not automatically reschedule or reassign ground handling equipment to the new stand. A ramp crew assigned to Stand G01 will continue seeing tasks for Flight SPH-102 even though the aircraft has been diverted to Stand G04.
2. **Turnaround Prerequisite Enforcing vs Overrides:**
   - Ground handling rules dictate that passenger boarding cannot commence until Cabin Cleaning, Fueling, Line Maintenance, and Security Sweeps have all been certified as `CLEARED`.
   - In `PassengerSecurityOpsDashboard.tsx` (lines 530–535), an automatic unlock rule checks these flags and enables boarding.
   - **The Problem:** In `PassengerCheckInDashboard.tsx`, an agent can manually initiate boarding pass issuance and passenger boarding even if the security clearance flag in `DepartmentDashboard` is still `PENDING`. There is no global interlock preventing check-in agents from boarding uncleared aircraft.

---

## 9. LOST & FOUND END-TO-END AUDIT

The Lost & Found workflow is a crucial cross-boundary feature that spans the public passenger portal and internal security operations.

### 9.1 Data Flow Trace
```
[Public Passenger] 
       │
       ▼ Submits Claim at /passenger-services
[PassengerServices.tsx]
       │
       ▼ aocsDataStore.reportLostItem()
[aocsDataStore.ts] ──(persists to localStorage 'saphire_lost_found')
       │
       ▼ Emits 'LOST_ITEM_REPORTED' Event
[PassengerSecurityOpsDashboard.tsx]
       │
       ▼ Receives in useEffect() via aocsDataStore.subscribe()
[Security Officer Queue]
       │
       ▼ Clicks "Review / Match" Modal
[Status updated to 'MATCHED' or 'RETURNED']
       │
       ▼ aocsDataStore.resolveLostItem()
```

### 9.2 Audit Findings
- **Strengths:**
  - The reactive loop between public passenger intake and internal security review functions cleanly within the same browser.
  - Submitting an item on `/passenger-services` immediately makes it visible under `/dashboard/passenger-security#lost-found`.
  - The security officer can assign a secure storage locker ID and mark the property as returned to the owner.
- **Vulnerabilities:**
  - **No Backend Table:** There is no `lost_found_items` table in `backend/src/main/resources/db/migration/` or `schema.sql`.
  - **No Cross-Device Persistence:** If a passenger files a report from their smartphone on public Wi-Fi, the security officer on the operations desktop cannot see it because `localStorage` is origin- and device-specific.

## 10. COMPONENT ARCHITECTURE AND CODE QUALITY

### 10.1 File Complexity & Linter Warnings
- **Build Cleanliness:** `tsc -b && vite build` completes with 0 errors.
- **Linter Analysis:** Running `npm run lint` (`oxlint`) produces **0 errors and 203 warnings**.
  - All 203 warnings represent unused variable declarations and redundant icon imports (e.g. `Lucide` icons imported but never rendered, or destructured state variables never read).
- **Megabyte-Scale Components:** Five files account for over 9,000 lines of code. This code density violates single-responsibility principles and severely impedes parallel team development.

---

## 11. ACCESSIBILITY, RESPONSIVE DESIGN, PERFORMANCE, AND UX

### 11.1 Accessibility (a11y)
- Many interactive icon buttons lack `aria-label` tags (e.g., table action buttons in `DepartmentDashboard.tsx` and `AirsideOpsDashboard.tsx`).
- Color contrast between slate-400 text (`#94A3B8`) on slate-100 backgrounds (`#F1F5F9`) fails WCAG AA standards (ratio is 2.8:1, required is 4.5:1).

### 11.2 Responsive Layout
- Public pages collapse gracefully onto mobile screens with full hamburger drawer support.
- Internal dashboards, however, assume a minimum viewport width of 1280px. High-density data tables in `DepartmentDashboard` and `PassengerCheckInDashboard` trigger horizontal overflow scrollbars on viewports smaller than 1024px.

### 11.3 Performance & Bundle Size
- Vite build output warns of chunks exceeding 500 kB:
  - `dist/assets/index-*.js`: **1,420 kB** (unminified/gzipped: 395 kB).
  - Large dependencies: Three.js, Recharts, Framer Motion, and Material UI are bundled into the primary vendor chunk without dynamic `React.lazy()` route-based code splitting.

---

## 12. SECURITY AND RBAC FINDINGS

1. **Unprotected Route Mounting:**
   - Direct navigation to `/dashboard/system-admin` does not perform synchronous server-side token validation. While `DashboardLayout.tsx` redirects if local user state is absent, client-side route guards are not enforced at the router level.
2. **Local Storage Token Storage:**
   - JWT tokens are stored in `localStorage` (`aocs_token`), which is accessible to cross-site scripting (XSS) if third-party scripts are injected.
3. **Hardcoded Fallback Credentials:**
   - In `AuthContext.tsx` (lines 117), fallback passwords (`SaphireOps@2026`, `pass`, `admin123`) are hardcoded in client-side bundles. Anyone inspecting the compiled JavaScript can extract valid demo credentials.

## 13. BUILD, LINT, TYPE-CHECK, AND TEST RESULTS

- **Type Check (`tsc -b`):** **PASSED** (0 TypeScript errors).
- **Vite Build (`vite build`):** **PASSED** (Built in 1.39s, 3,364 modules transformed).
- **Lint Check (`oxlint`):** **PASSED** (0 errors, 203 warnings for unused imports/variables).
- **Test Runner (`npm test`):** **FAILED** (`Missing script: "test"`).

---

## 14. UNNECESSARY FEATURES WORTH REMOVING

1. **Duplicate Fuel Operations Section in Logistics:** The fuel uplift calculator belongs to the fueling department. Its presence in `LogisticsDashboard.tsx` duplicates UI and creates dual sources of truth.
2. **Pseudo-Random Carousel Luggage Rate Generators:** The animated interval generating pseudo-random bag flow metrics creates unnecessary re-renders without adding operational value.
3. **Redundant Department Wrapper Files:** Empty wrapper components like `DepartmentCleaningDashboard.tsx` (8 lines) simply re-export `DepartmentDashboard.tsx` and clutter the file tree.

---

## 15. MISSING FEATURES WORTH ADDING

1. **Global Interlock on Uncleared Aircraft:** Prevent check-in agents from initiating boarding if aircraft maintenance or security sweeps have not reached `CLEARED` status.
2. **Central Stand Conflict Banner:** Display an immediate prominent warning banner in AOCC and Airside Ops if two arriving flights are scheduled at the same stand within 45 minutes of each other.
3. **Network Status Indicator:** Add a subtle pill badge in the top navigation bar (`LIVE BACKEND` vs `OFFLINE DEMO SIMULATION`) so evaluators know whether the system is connected to Spring Boot or running on local store.

---

## 16. QUICK WINS (High Impact, Low Effort - Under 30 Minutes Each)

1. **Fix Security Button Text Clipping:** In `DepartmentDashboard.tsx`, widen the `ACTION` table column from `12%` to `16%` and adjust neighboring column widths to eliminate the clipped `Sign-of` text.
2. **Fix Terminal Concourse Naming Inconsistency:** In `AirsideOpsDashboard.tsx`, replace all legacy `T1 / T2` strings with `Concourse A / B`.
3. **Dynamic Airside Header Clock:** Replace the hardcoded `19 Sep 12:05 IST` string with a live dynamic clock.
4. **Clean 203 Linter Warnings:** Run `oxlint --fix` or strip unused imports across the 8 dashboard files to achieve zero warnings.
5. **Add Basic Vitest Configuration:** Add `"test": "vitest run"` and a single sanity test file verifying `aocsDataStore` event emission.

## 17. PRIORITIZED REMEDIATION ROADMAP

### Phase 1: P0 Critical Blockers (Hours 1–4)
- [ ] Connect `aocsDataStore` to Spring Boot REST endpoints on startup (`initRemoteSync`).
- [ ] Implement optimistic remote persistence for gate allocation and flight status updates.
- [ ] Fix visual clipping in Security Clearance Matrix (`DepartmentDashboard.tsx`).
- [ ] Harmonize terminal and concourse naming conventions in `AirsideOpsDashboard.tsx`.
- [ ] Enforce route-level `<ProtectedRoute>` guards in `AppRoutes.tsx`.

### Phase 2: P1 Architectural Quality (Hours 5–8)
- [ ] Configure Vitest test runner and write unit tests for `aocsDataStore` and `AuthContext`.
- [ ] Decompose monolithic dashboard components into focused sub-tabs.
- [ ] Implement backend report fetching in `exportReports.ts` with graceful client fallback.
- [ ] Add live network connectivity status badge to `DashboardLayout.tsx`.

### Phase 3: P2 Polish and Operational Rigor (Hours 9–12)
- [ ] Clean up all 203 linter warnings.
- [ ] Enforce turnaround prerequisite interlocks during passenger boarding initiation.
- [ ] Implement code splitting via `React.lazy()` to reduce initial bundle chunk size below 500 kB.

---

## 18. FINDINGS REQUIRING BACKEND-TEAM CONFIRMATION

1. **Lost & Found Data Persistence:** Confirm whether Krishna and Anay plan to add a `lost_found_records` table to PostgreSQL, or if Lost & Found should remain an in-memory client-side demonstration feature.
2. **CORS and Endpoint Path Prefixing:** Confirm whether production backend endpoints use `/api/...` or `/api/v1/...` (Spring Boot currently supports both via mapping arrays).
3. **Database Seed Refresh:** Confirm whether Flyway migrations re-seed flights and gates on server restart.

---

## 19. WHAT SHOULD NOT BE CHANGED

Under no circumstances should the following established architectural and visual foundations be altered during remediation:
1. **The Midnight Blue & Slate Design Language:** The color palette (`#0F2942`, `#0284C7`, `#F8FAFC`, `#E2E8F0`) is mature, professional, and visually aligned with enterprise aviation systems.
2. **The 20% Public / 80% Internal Structural Split:** This project scope boundary is clear, defensible, and matches the team's project handbook.
3. **The Single `DashboardLayout` Shell Architecture:** The unified dashboard shell with dynamic role-based navigation is a standout structural strength.
4. **The Scroll-Driven Home Hero Video:** The video scrub animation is an exceptional visual hook for academic evaluation.
5. **The Dual-Signature Fueling & Security Sweep PIN Workflows:** These domain-specific interactive features demonstrate deep software engineering consideration.

## 20. "IF I HAD ONLY 12 HOURS TO FIX THIS PROJECT"

If a lead engineer were granted exactly 12 uninterrupted hours to elevate this codebase from an impressive prototype to an airtight, academic-award-winning showcase, this is the exact hour-by-hour sprint plan:

| Time Block | Focus Area | Concrete Execution Actions | Deliverable Artifact |
| :--- | :--- | :--- | :--- |
| **Hours 01–02** | **Visual Polish & Bug Eradication** | Fix the clipped `Sign-of` button in `DepartmentDashboard.tsx`; replace legacy `T1 / T2` labels in `AirsideOpsDashboard.tsx`; replace hardcoded `19 Sep` telemetry date with live dynamic clock; fix linter warnings. | Clean UI with 0 visible cosmetic defects and 0 linter warnings. |
| **Hours 03–05** | **Backend Network Bridge** | Wire `aocsDataStore.ts` to perform initial data hydration from Spring Boot (`flightApi.getAll()`, `gateApi.getAll()`); implement fire-and-forget background PUT/POST calls on gate and status mutations while preserving instant optimistic local updates. | Multi-tab / multi-device data synchronization when Spring Boot is running, with zero regression when offline. |
| **Hours 06–07** | **Route Security & Interlocks** | Implement `<ProtectedRoute>` component wrapping internal dashboard routes; add cross-dashboard interlock preventing boarding pass issuance if security clearance is pending. | Robust client-side security architecture and enforced operational safety invariants. |
| **Hours 08–09** | **Automated Testing Suite** | Install Vitest and `@testing-library/react`; create unit test suite covering `aocsDataStore` mutations, prerequisite gating rules, and auth state management; ensure `npm test` passes cleanly. | Real CI test pipeline with high-trust test coverage on critical business logic. |
| **Hours 10–11** | **Component Modularization** | Split `PassengerSecurityOpsDashboard.tsx` and `SystemAdminDashboard.tsx` into modular sub-tab components under dedicated directories; implement `React.lazy()` for route code splitting. | Reduced bundle sizes, maintainable codebase, faster IDE compilation. |
| **Hour 12** | **Live Network Status & Final Verification** | Add a subtle "Connected to AOCS Core" / "Local Simulation Mode" pill to `DashboardLayout`; conduct end-to-end rehearsal of full flight turnaround lifecycle. | Bulletproof demonstration readiness for viva and technical review. |

---
*End of Adversarial Audit Report.*

