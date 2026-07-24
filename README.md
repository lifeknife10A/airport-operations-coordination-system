# AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
## Master System Documentation & Developer Guide

---

## 📁 Repository Directory Structure

```
Mini Project/
├── README.md                              <-- Master Developer Guide
├── flyway.conf                            <-- Flyway Migration Config
├── db/                                    <-- Database Diagrams & Migrations
│   ├── AOCS ER Diagram.drawio             <-- Step 1 ERD Source
│   ├── AOCS ER Diagram.drawio.xml         <-- Step 1 ERD XML
│   ├── AOCS Information Package.drawio    <-- Step 2 Information Package Source
│   ├── AOCS Information Package.drawio.xml<-- Step 2 Information Package XML
│   └── migration/                         <-- Flyway SQL Migration Scripts
│
└── documentation/                         <-- Documentation Hub
    ├── PDF/                               <-- PRIMARY VISUAL ASSETS (For Easy Teammate Viewing)
    │   ├── ER Diagram.pdf                 <-- Step 1 ERD PDF
    │   └── AOCS Information Package.pdf   <-- Step 2 Information Package PDF
    ├── PNG/                               <-- PNG Image Assets
    ├── SVG/                               <-- SVG Vector Assets
    └── MD/                                <-- Technical Documentation Specs
        ├── project_discussion/            <-- Brainstorming, Roles, Roadmap & Groupings
        └── database_creation/             <-- DB Specs, ERD Codex & Information Package Matrix
```

---

## 🛠️ Core Technology Stack

| Layer | Primary Technology | Version / Specification |
|---|---|---|
| **Database Engine** | PostgreSQL | 18.0 |
| **Database Migrations** | Flyway CLI | 13.0.0 |
| **Backend Framework** | Java / Spring Boot | Java 17/21 + Spring Boot 3.x |
| **ORM / Data Access** | Spring Data JPA | Hibernate / PostgreSQL Driver |
| **Frontend Framework** | React / TypeScript | React 18 + TypeScript |
| **UI Component Library**| Material UI (MUI) | MUI v5 |
| **API Testing & Testing** | Postman / JUnit | Postman Collections + JUnit 5 |

---

## ⚙️ Backend API & Connection Specification

### 1. Spring Boot Controller Endpoints & Base Route Structure
* **Base URL**: `http://localhost:8080/api/v1`
* **Authentication Service**: `/api/v1/auth` (`/login`, `/register`, `/logout`, `/me`)
* **Flight Dispatch Service**: `/api/v1/flights` (`GET /`, `GET /{id}`, `POST /`, `PUT /{id}/status`, `PUT /{id}/gate`)
* **Airside Gate Service**: `/api/v1/gates` (`GET /`, `GET /{id}`, `PUT /{id}/assign`)
* **Runway Allocation Service**: `/api/v1/runways` (`GET /`, `PUT /{id}/assign`)
* **Ground Turnaround Task Service**: `/api/v1/tasks` (`GET /`, `GET /flight/{flightId}`, `PUT /{id}/status`, `PUT /{id}/assign`)
* **Logistics & Fuel Service**: `/api/v1/logistics` (`GET /fuel/{flightId}`, `GET /cargo/{flightId}`, `GET /baggage/{flightId}`)
* **Delay Analytics & Audit Logs**: `/api/v1/reports` (`GET /delays`, `GET /audit-logs`)

### 2. Connection Wiring & Security Protocol
* **CORS Policy**: Configured to allow requests from React frontend `http://localhost:3000`.
* **Security & Access Control (RBAC)**:
  * `ROLE_ADMIN` & `ROLE_SUPERVISOR`: Full access to flights, gates, and task creation.
  * `ROLE_GROUND_CREW`: Read access to assigned flight turnaround tasks and status update permissions (`PENDING` ➔ `IN_PROGRESS` ➔ `COMPLETED`).
  * `ROLE_ATC`: Clearance permissions for runway assignments and flight status (`LANDED`, `DEPARTED`).
* **Database Wiring**: Spring Data JPA mapping entity classes to PostgreSQL tables maintained via Flyway (`db/migration/`).

---

## 🎨 Frontend UI Technical Specification

### 1. Required Web UI Screens (React + TypeScript)
1. **Dashboard Overview Screen**: Real-time flight turnaround status cards, active delay alerts, and gate occupancy summary.
2. **Flight Schedule Grid Screen**: Searchable/filterable tabular view of flights, status badges (*On Time, Delayed, Boarding, Departed*), and quick actions.
3. **Gate & Runway Allocation Map**: Visual airside terminal layout showing gate assignments and runway occupancy.
4. **Ground Turnaround Task Manager**: Interactive task cards grouped by sub-task (catering, cleaning, refuel, maintenance) with SLA countdown timers.
5. **Department & Staff Operations View**: User task assignments by department (Ground Handling, Security, Refueling).
6. **User Authentication & Profile Screen**: Secure login form, role selection, and user preferences.
7. **Operational Reports & Analytics Screen**: Visual charts for turnaround efficiency and delay incident logs.

### 2. UI Component Standards (Material UI)
* **Status Badges / Chips**:
  * Green Chip: `READY` / `COMPLETED` / `ON_TIME`
  * Orange Chip: `IN_PROGRESS` / `BOARDING`
  * Red Chip: `DELAYED` / `CRITICAL_ALERT`
* **Form Validation**: Client-side validation using Formik/Yup or React Hook Form before API payload submission.

---

## 📄 Diagram Quick Reference for Teammates

For visual diagram review, open the vector PDF files in [`documentation/PDF/`](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/PDF):
* 📐 **Step 1: Peter Chen ER Diagram**: [ER Diagram.pdf](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/PDF/ER%20Diagram.pdf)
* 📊 **Step 2: Information Package Matrix**: [Information Package.pdf](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/PDF/Information%20Package.pdf)
* 🌟 **Step 3: Star Schema Dimensional Model**: [Star Schema.pdf](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/PDF/Star%20Schema.pdf)

---
*Airport Operations Coordination System (AOCS) — Project Developer Guide*
