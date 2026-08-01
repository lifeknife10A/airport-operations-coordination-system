# Anuvrat Front-End Architecture Analysis & Dual-Layer RBAC Security Blueprint

**Project:** Saphire Airport Operations Coordination System (AOCS)  
**Author:** Krishna Solanki (Database & System Architecture Lead)  
**Target Audience:** Anuvrat Tripathi (Front-End Lead), Anay Modi (Backend & Security Lead), Chaitanya Tikku  
**Document Version:** 1.0  
**Date:** 2026-07-30  

---

## 1. Executive Context & Proposal Review

Recently, **Anuvrat Tripathi** presented a comprehensive front-end sitemap proposal consisting of:
* **Public Passenger/Visitor Website** (CSMIA Mumbai Airport framework)
* **Login System with Automatic Role Router**
* **10 Distinct Workspaces** (Admin, AOCC Controller, Ground Ops Supervisor, Cleaning, Fuel, Maintenance, Security, Airside Ops, Logistics, Passenger & Security Ops)
* **Total Estimated Scope:** 10 Dashboards / 110+ individual webpages

This document provides a technical evaluation of this proposal, assessing **database compatibility**, **scope feasibility**, **academic evaluation impact**, and the **architectural design for enterprise Role-Based Access Control (RBAC)**.

---

## 2. Database Compatibility Audit & Resolution of Apparent Gaps

Our PostgreSQL 18 database (`aocs_db`) consists of **38 normalized tables** and **158,660+ seed records**. 

### 🟢 Fully Supported Operational Domains (Zero Schema Changes Needed)
* **Flight Tracker & FIDS Schedule:** Powered by `flights`, `airlines`, `airports`, `aircraft`, `aircraft_types`.
* **Airside & Gate Operations:** Powered by `gates`, `stands`, `runways`, `gate_assignment_rules`.
* **Department Turnaround Tasks:** Powered by `tasks`, `ground_equipment`, `equipment_assignments`, `fuel_logs`, `delay_logs`, `delay_codes`.
* **Border Control & Security:** Powered by `travelers`, `passengers`, `boarding_passes`, `security_checkpoints`, `passenger_clearance_logs`, `immigration_records`.
* **Cargo & Baggage BRS:** Powered by `cargo_manifests`, `baggage_carousels`, `bag_tags`, `baggage_scan_events`, `mishandled_baggage`.
* **System Administration:** Powered by `users`, `roles`, `departments`, `notifications`, `audit_logs`.

### 🛡️ How the 4 Apparent Gaps Are Solved (Zero Database DDL Extensions Required)

1. **Live Security Queue Times & Terminal Wait Times:**
   * **Resolution:** Computed dynamically via Spring Boot SQL aggregation queries on `passenger_clearance_logs`! By counting timestamped scans at `checkpoint_id` over a rolling 15-minute window, the backend computes real-time line throughput and estimated queue wait times without needing a redundant hardcoded database column.

2. **Public Website Content (News, Guidelines, FAQs, Parking, Dining):**
   * **Resolution:** Handled as static React UI components and JSON assets! Modern enterprise AODBs manage runtime operational state (flights, gates, turnarounds), while public CMS content is rendered cleanly on the client side.

3. **Vehicle Fleet & Shuttle Dispatch:**
   * **Resolution:** Fully supported by existing `ground_equipment` and `equipment_assignments` tables! Passenger shuttles, baggage tugs, and fuel tankers are cataloged with `equipment_type` (`PASSENGER_SHUTTLE`, `BAG_TUG`, `FUEL_TRUCK`), and dispatched by creating assignment records linked to specific turnaround tasks (`task_id`).

4. **Shift Handover Logs:**
   * **Resolution:** Fully supported by existing `audit_logs` table! Controller and supervisor shift handover summaries are persisted directly into `audit_logs` with `entity_type = 'SHIFT_HANDOVER'`, storing structured notes inside PostgreSQL's flexible `change_payload` JSONB column.

---

## 3. Scope Rationalization: The 1 Unified Dashboard Shell Solution

Building 10 separate dashboard applications (110+ pages) would lead to code duplication, high maintenance overhead, and risk of unrendered shell pages during faculty evaluation.

### 💡 The Architecture Solution:
Instead of building 10 separate apps, Anuvrat will build **ONE Unified Master Dashboard Shell (`DashboardLayout.tsx`)** with a **Dynamic Role-Based Sidebar**.

```
                                    USER LOGIN
                                        │
                                        ▼
                           POST /api/auth/login (Anay)
                                        │
                         Returns: { role, department }
                                        │
                                        ▼
                            REACT DASHBOARD LAYOUT SHELL
                                        │
      ┌─────────────────────────────────┼─────────────────────────────────┐
      ▼                                 ▼                                 ▼
ROLE_DEPARTMENT (Fuel)       ROLE_AOCC_CONTROLLER               ROLE_ADMIN
Sidebar Renders:             Sidebar Renders:                   Sidebar Renders:
- Assigned Flights           - Live Flight Monitor              - User Management
- Fuel Calculator            - Gate Occupancy                   - Master System Specs
- Fuel Logs                  - Turnaround Timeline              - Audit Logs
```

---

## 4. Dual-Layer Security & RBAC Enforcement

To prevent users from using Chrome DevTools (Inspect Element) or URL manipulation to bypass client-side checks, security is enforced across **two independent layers**:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        DUAL-LAYER ENTERPRISE SECURITY                           │
├────────────────────────────────────────────────┬────────────────────────────────┤
│ LAYER 1: CLIENT-SIDE (React Protected Routes)  │ LAYER 2: SERVER-SIDE (Spring)  │
├────────────────────────────────────────────────┼────────────────────────────────┤
│ Prevents unauthorized navigation in browser    │ Blocks unauthorized API calls  │
│ address bar or DOM inspection manipulation.    │ at the database/server layer.  │
│                                                │                                │
│ Code: `<ProtectedRoute allowedRoles={...} />`  │ Code: `@PreAuthorize(...)`     │
│ Action: Redirects to `/unauthorized`          │ Action: Returns `403 Forbidden`│
└────────────────────────────────────────────────┴────────────────────────────────┘
```

### Layer 1: Client-Side (React Router Guards)
React wraps unauthorized routes inside `<ProtectedRoute />`. If a Fuel technician manually types `/admin` or inspects DOM state, React Router intercepts the request before any component mounts and redirects them away.

### Layer 2: Server-Side (Spring Security `@PreAuthorize` & JWT)
Every request to Anay's REST API includes a JWT token in the header (`Authorization: Bearer <token>`). Anay enforces backend security annotations on controller methods:

```java
@PutMapping("/assign-gate")
@PreAuthorize("hasRole('ROLE_AOCC_CONTROLLER') or hasRole('ROLE_ADMIN')")
public ResponseEntity<?> assignGate(@RequestBody GateAssignmentDTO dto) {
    return ResponseEntity.ok(gateService.assignGate(dto));
}
```

If an unauthorized user attempts to trigger an API endpoint via DevTools or Postman, Spring Security rejects the request with **HTTP 403 Forbidden** and writes an entry to `audit_logs`.

---

## 5. CSMIA-Inspired Public Website Integration

Taking **Chhatrapati Shivaji Maharaj International Airport (CSMIA / Mumbai Airport)** as our framework benchmark:

* **Public Portal Features:** Flight Search by Number/Route, Live FIDS Arrivals/Departures Board, Terminal Maps, Baggage Carousel Lookup.
* **Live Synchronization Demo:** When an AOCC Controller or Ground Supervisor updates a flight status or gate in their internal workspace, the Public Passenger Portal updates **in real time**.

---

## 6. Actionable Roadmap for Team Leads

1. **Anuvrat (Front-End Lead):**
   * Build 1 Public Passenger Portal (CSMIA Framework).
   * Build 1 Unified Master Dashboard Shell with dynamic sidebar tabs.
   * Wrap admin/controller views in React `<ProtectedRoute />`.

2. **Anay (Backend Lead):**
   * Build `AuthController` (`/api/auth/login`) returning `{ userId, username, role, department, token }`.
   * Secure REST controllers using `@PreAuthorize`.

3. **Krishna (Database & Integration Lead):**
   * Maintain zero-DDL-change policy on the 38-table schema.
   * Provide integration support between Spring Boot JPA repositories and React components.

---

## 7. Prototype 1.1 Official Approval & Architectural Validation

On August 01, 2026, **Anuvrat Tripathi** submitted **AOCS Prototype 1.1**, adopting the team's recommendations:

* ✅ **Shared Dashboard Layout:** All roles share **ONE dashboard application shell** (`DashboardLayout.tsx`), avoiding bloat and duplicate code.
* ✅ **Role-Based Dynamic Sidebar:** Navigation sidebar and accessible workspace modules are rendered dynamically based on the user's authenticated `role` and `department`.
* ✅ **CSMIA Public Portal (20% Scope):** Lightweight passenger site (Home, Flight Tracker, FIDS Schedule, Services, Airport Info, Contact, Login).
* ✅ **Turnaround Data Flow Alignment:** The core system data flow (*Flight Created ➔ Aircraft Assigned ➔ Gate Assigned ➔ Tasks Generated ➔ Delay Logged ➔ Boarding ➔ Flight Ready ➔ Departure*) maps 1:1 with backend entities (`flights`, `tasks`, `gates`, `fuel_logs`, `delay_logs`).

**Status:** **100% APPROVED.** Anuvrat is authorized to commence front-end skeletal structure development.

