# AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
## Master System Documentation & Developer Execution Guide

---

> [!IMPORTANT]
> **DATABASE STATUS: LOCKED & FROZEN (Grade 9.9 / 10 Enterprise Production Architecture)**  
> The AOCS database schema (38 normalized tables, 100% indexed 47 FK edges, zero security defaults, bidirectional deferrable turnaround rotation triggers, and 11,615+ Flyway-migrated live records) is **OFFICIALLY LOCKED**. No further database DDL changes are required. All engineering focus is now directed to Backend API Development (**Anay**) and Web Application Frontend Development (**Anuvrat**).

---

## 📁 Repository Directory Structure

```
Mini Project/
├── README.md                              <-- Master Developer Execution Guide & API Specs
├── flyway.conf                            <-- Flyway Migration Config (PostgreSQL 18)
├── db/                                    <-- Database Diagrams & Migrations
│   ├── AOCS Relational Schema.drawio.xml  <-- Step 1 Relational Schema Draw.io XML
│   ├── AOCS ER Diagram.drawio.xml         <-- Step 1 Peter Chen ERD Draw.io XML
│   ├── AOCS Information Package.drawio.xml<-- Step 2 Information Package Draw.io XML
│   ├── AOCS Star Schema.drawio.xml        <-- Step 3 Star Schema Draw.io XML
│   └── migration/                         <-- Flyway SQL Migration Scripts
│       ├── V1__initial_schema.sql         <-- 38-Table DDL + Triggers + Indexes + Views
│       └── V2__seed_data.sql              <-- 11,615+ Validated Production Records
│
├── tools/                                 <-- Python Automation, Generation & Sync Tools
│   ├── build_38_table_perfect_100_final.py<-- Master DDL Generator
│   ├── build_7200_seed_data.py            <-- 11,615+ Seed Data Generator
│   ├── apply_participation_only.py        <-- ERD Double Line Sync Tool
│   ├── update_all_38_table_diagrams.py    <-- Draw.io List Container Generator
│   └── verify_db_counts.py                <-- PostgreSQL 18 Record Count Verifier
│
└── documentation/                         <-- Documentation Hub
    ├── PDF/                               <-- Primary Visual Assets for Teammate Viewing
    │   ├── Relational Schema.pdf
    │   ├── ER Diagram.pdf                 <-- Peter Chen ERD PDF
    │   ├── Information Package.pdf        <-- Matrix PDF
    │   └── Star Schema.pdf                <-- Data Warehouse PDF
    └── MD/                                <-- Markdown Discussion & Critique Artifacts
        └── project_discussion/            <-- Claude & ChatGPT Peer Review Log
```

---

## 🛠️ Core Technology Stack

| Layer | Primary Technology | Specification |
|---|---|---|
| **Database Engine** | PostgreSQL | Version 18.4 (Port 5432, `airport_db`) |
| **Database Migrations** | Flyway CLI | Version 13.0.0 (`v1`, `v2` applied) |
| **Backend Framework** | Java / Spring Boot | Java 17/21 + Spring Boot 3.x |
| **ORM / Data Access** | Spring Data JPA | Hibernate / PostgreSQL Driver |
| **Frontend Framework** | React / TypeScript | React 18 + TypeScript |
| **UI Component Library**| Material UI (MUI) | MUI v5 / TailwindCSS |
| **API Protocol** | RESTful JSON & WebSockets | Spring WebSockets / Webhooks |

---

# 🚀 TEAM MEMBER EXECUTION ROADMAP

Below is the complete, exhaustive operational specification for **Anuvrat (Frontend Lead)** and **Anay (Backend Lead)** based on the 11,615+ dataset and 38-table architecture.

---

## 🖥️ ANUVRAT'S FRONTEND EXECUTION SPECIFICATION
### Total Webpages Required: **10 Modules**

Anuvrat is responsible for building a modern, dynamic, responsive web application for airport staff, operators, airlines, and security agents.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AOCS WEB APPLICATION                               │
├──────────────┬──────────────┬──────────────┬──────────────┬─────────────────┤
│ 1. Flight    │ 2. Turnaround│ 3. Airside   │ 4. Baggage   │ 5. Border       │
│    Ops Hub   │    Task Grid │    Gate Map  │    BRS Scan  │    Security Desk│
├──────────────┼──────────────┼──────────────┼──────────────┼─────────────────┤
│ 6. Traveler  │ 7. Airline   │ 8. Weather   │ 9. Security  │10. Analytics &  │
│    Directory │    Billing   │    Radar     │    Audit Log │    Delay Reports│
└──────────────┴──────────────┴──────────────┴──────────────┴─────────────────┘
```

#### 1. Flight Operations Hub (`/flights`)
* **Purpose**: Central FIDS (Flight Information Display System) dashboard.
* **UI Features**: Searchable, filterable table of all 400 scheduled arrival/departure flights. Real-time status chips (`SCHEDULED`, `BOARDING`, `AIRBORNE`, `LANDED`, `DELAYED`, `CANCELLED`).
* **Key Components**: Quick-filter by Airline, Gate, Stand, or Airport; Modal to edit estimated timestamps (`estimated_departure_time`).

#### 2. Turnaround Task Manager (`/tasks`)
* **Purpose**: Ground crew dispatch board for ramp agents, fueling, catering, and cleaning.
* **UI Features**: Kanban board or Grid view showing 800 tasks grouped by status (`PENDING`, `IN_PROGRESS`, `COMPLETED`, `BLOCKED`). SLA countdown timers.
* **Key Components**: Drag-and-drop task status update, ground equipment assignment modal (`ground_equipment`).

#### 3. Airside Gate & Stand Allocation Map (`/airside`)
* **Purpose**: Visual graphical map of 100 Gates, 100 Stands, and 20 Runways.
* **UI Features**: Interactive terminal map showing occupied vs. available stands, remote stand badges, and jetbridge indicators.
* **Key Components**: Click-to-assign gate rules inspector (`wingspan_meters`, `mtow_kg` validation check).

#### 4. Baggage Reconciliation System (BRS) Console (`/baggage`)
* **Purpose**: Baggage tracking and mishandled luggage management.
* **UI Features**: Search bag tag numbers (`tag_number`), scan event history timeline (Check-in ➔ Inline Screening ➔ Makeup Area ➔ Cart ➔ Cargo Hold).
* **Key Components**: PIR report filing modal for `MISHANDLED_BAGGAGE` (`LOST`, `DAMAGED`, `DELAYED`, `PILFERED`).

#### 5. Border Control & Security Desk (`/security`)
* **Purpose**: Immigration officer and security checkpoint terminal.
* **UI Features**: Passenger passport scanner interface (`passport_number`), barcode scanner verification for boarding passes.
* **Key Components**: Biometric facial match status badge, visa type validator, and `PASSENGER_CLEARANCE_LOGS` flag button (`APPROVED`, `FLAGGED_SECURITY`, `DENIED`).

#### 6. Traveler & Passenger Directory (`/travelers`)
* **Purpose**: 3NF normalized traveler profile directory.
* **UI Features**: View 600 unique human `TRAVELERS` and their associated flight segment `PASSENGERS` history.
* **Key Components**: PNR lookup tool, transit passenger indicator (`is_transit_passenger`), frequent flyer status details.

#### 7. Airline Billing & Invoice Portal (`/billing`)
* **Purpose**: Finance team invoice management for 25 airlines.
* **UI Features**: Tabular list of `AIRLINE_BILLING_INVOICES`, payment status badges (`UNPAID`, `PAID`, `OVERDUE`).
* **Key Components**: Invoice detail drill-down showing itemized landing fees, parking charges, and jetbridge usage line items (`invoice_line_items`).

#### 8. Weather & Field Condition Radar (`/weather`)
* **Purpose**: Meteorological monitoring view.
* **UI Features**: Meteorological charts for visibility meters, wind speed knots, temperature celsius, and runway surface conditions (`DRY`, `WET`, `FOG`, `HEAVY_RAIN`).

#### 9. Security Audit & Notification Feed (`/audit`)
* **Purpose**: Immutable compliance trail.
* **UI Features**: Real-time notification bell feed, JSONB change payload viewer for `AUDIT_LOGS` (`entity_type`, `entity_id`, `change_payload`).

#### 10. Executive Analytics & Delay Report Dashboard (`/analytics`)
* **Purpose**: Operational BI reporting.
* **UI Features**: Pie charts for IATA delay code breakdown (`delay_codes`), turnaround delay minutes, passenger lounge visit analytics, and feedback ratings.

---

## ⚙️ ANAY'S BACKEND EXECUTION SPECIFICATION
### Total REST Controllers & Webhooks Required: **8 Controllers + 3 Webhook Event Handlers**

Anay is responsible for building the Spring Boot 3.x REST API layer connecting the React frontend to the PostgreSQL 18 database (`airport_db`).

```
                              ┌─────────────────────────────────┐
                              │     SPRING BOOT REST API        │
                              └────────────────┬────────────────┘
                                               │
         ┌──────────────────┬──────────────────┼──────────────────┬──────────────────┐
         ▼                  ▼                  ▼                  ▼                  ▼
  FlightController    TaskController     BaggageController   SecurityController BillingController
  (Flight Dispatch)   (Turnaround Task)  (BRS Scans & PIR)   (Border Clearance) (Invoices & Fees)
```

#### 1. `FlightDispatchController` (`/api/v1/flights`)
* **Endpoints**:
  * `GET /api/v1/flights`: Paginated, filterable list of flights (filters: `status`, `type`, `airline_id`).
  * `GET /api/v1/flights/{id}`: Detailed flight movement payload including assigned aircraft, gate, stand, and inbound turnaround flight.
  * `PUT /api/v1/flights/{id}/times`: Update estimated/actual departure & arrival timestamps.
  * `PUT /api/v1/flights/{id}/aircraft`: Reassign aircraft (fires PostgreSQL deferrable rotation constraint trigger).

#### 2. `TurnaroundTaskController` (`/api/v1/tasks`)
* **Endpoints**:
  * `GET /api/v1/tasks/flight/{flightId}`: Get all turnaround sub-tasks for a flight.
  * `PUT /api/v1/tasks/{taskId}/status`: Update task status (`PENDING` ➔ `IN_PROGRESS` ➔ `COMPLETED`).
  * `POST /api/v1/tasks/{taskId}/equipment`: Assign ground equipment (`equipment_assignments`).

#### 3. `AirsideGateController` (`/api/v1/airside`)
* **Endpoints**:
  * `GET /api/v1/airside/gates`: List all gates and stand occupancy statuses.
  * `POST /api/v1/airside/assign-gate`: Validate aircraft wingspan/MTOW against `gate_assignment_rules` and assign gate.

#### 4. `BaggageReconciliationController` (`/api/v1/baggage`)
* **Endpoints**:
  * `GET /api/v1/baggage/track/{tagNumber}`: Fetch complete baggage scan timeline (`baggage_scan_events`).
  * `POST /api/v1/baggage/scan`: Ingest new barcode scan event.
  * `POST /api/v1/baggage/mishandled`: Create new PIR mishandled baggage report.

#### 5. `BorderControlController` (`/api/v1/border-control`)
* **Endpoints**:
  * `POST /api/v1/border-control/verify-passport`: Lookup traveler profile by passport number.
  * `POST /api/v1/border-control/clearance`: Log security clearance (`PASSENGER_CLEARANCE_LOGS`). Enforces `RESTRICT` delete retention.
  * `POST /api/v1/border-control/immigration`: Log immigration departure/arrival stamp record (`IMMIGRATION_RECORDS`).

#### 6. `AirlineBillingController` (`/api/v1/billing`)
* **Endpoints**:
  * `GET /api/v1/billing/invoices`: List billing invoices by airline and period.
  * `POST /api/v1/billing/generate-invoice`: Calculate flight movement line items and total USD amount.

#### 7. `SecurityAuditController` (`/api/v1/audit`)
* **Endpoints**:
  * `GET /api/v1/audit/logs`: Query `AUDIT_LOGS` with JSONB payload filtering.
  * `POST /api/v1/audit/log-action`: Ingest automated security audit trail.

#### 8. `AnalyticsReportController` (`/api/v1/reports`)
* **Endpoints**:
  * `GET /api/v1/reports/delays`: Aggregated IATA delay minutes report (`delay_logs`).
  * `GET /api/v1/reports/efficiency`: Ground turnaround SLA performance metrics.

---

### 🔌 Webhooks & Real-Time Event Handlers Required (Anay)

1. **`FlightStatusWebhook` (`/api/v1/webhooks/flight-status`)**:
   * Receives external radar / ATC flight status updates (`AIRBORNE`, `LANDED`, `CANCELLED`).
   * Automatically updates `FLIGHTS` table and emits WebSocket alert to Anuvrat's Flight Ops Hub.

2. **`BaggageScanWebhook` (`/api/v1/webhooks/baggage-scan`)**:
   * Ingests automated barcode scanner events from airport BHS conveyor belt sorting systems into `BAGGAGE_SCAN_EVENTS`.

3. **`TurnaroundDelayAlertWebhook` (`/api/v1/webhooks/delay-alert`)**:
   * Triggers automatically when a turnaround task exceeds its scheduled end time, creating an entry in `DELAY_LOGS` and pushing a notification to the assigned user (`NOTIFICATIONS`).

---

## 📄 Diagram Quick Reference for Teammates

For visual diagram review, open the vector PDF files in [`documentation/PDF/`](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/PDF):
* 📐 **Relational Schema**: [Relational Schema.pdf](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/PDF/Relational%20Schema.pdf)
* 📐 **Peter Chen ER Diagram**: [ER Diagram.pdf](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/PDF/ER%20Diagram.pdf)
* 📊 **Information Package Matrix**: [Information Package.pdf](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/PDF/Information%20Package.pdf)
* 🌟 **Star Schema Dimensional Model**: [Star Schema.pdf](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/PDF/Star%20Schema.pdf)

---
*Airport Operations Coordination System (AOCS) — Master Developer Execution Guide*
