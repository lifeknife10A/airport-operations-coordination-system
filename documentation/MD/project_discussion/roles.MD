# Official Team Role Breakdown & Deliverable Expectations

**Project:** Airport Operations Coordination System (AOCS)  
**Document Version:** 2.0 (Updated with Unified Dashboard Shell & Feature Ownership)  
**Date:** 2026-07-30  

---

## 🗄️ 1. Krishna Solanki — Database & System Integration
* **Domain**: Data Architecture, ORM, Database Migrations, & Full-Stack API Integration  
* **Primary Tech**: PostgreSQL 18, Spring Data JPA, Flyway, Axios/Fetch API Integration

### Core Deliverables:
1. **Database Schema Stability & Zero-DDL Enforcement (`schema.sql` & Flyway)**:
   * Maintain the locked 38-table PostgreSQL database architecture (`users`, `roles`, `flights`, `gates`, `tasks`, `passenger_clearance_logs`, `audit_logs`, etc.).
   * Ensure Flyway versioned migration scripts (`V1__initial_schema.sql`, `V2__seed_data.sql`) remain 100% synchronized across all teammate environments.
2. **Spring Data JPA Entities & Repositories**:
   * Maintain Java Entity classes (`@Entity Flight`, `@Entity TurnaroundTask`, `@Entity PassengerClearanceLog`) mapping tables to Spring Boot.
   * Provide optimized Spring Data Repository interfaces for fast database queries.
3. **Frontend-to-Backend Integration**:
   * Wire Anuvrat's React frontend screens to Anay's Spring Boot REST APIs (`/api/v1/auth`, `/api/v1/flights`, `/api/v1/security/queue-times`, `/api/v1/audit/shift-handover`).
   * Handle CORS headers, HTTP request/response payloads, and loading/error states.
4. **Viva Expectation**:
   * Explain database table relationships (Foreign Keys, Indexes), Spring Boot to PostgreSQL connectivity, and real-time data flow to the React UI.

---

## ⚙️ 2. Anay Modi — Backend API, Business Logic & Security
* **Domain**: REST API Services, Turnaround Rules, SQL Aggregations & Dual-Layer Security  
* **Primary Tech**: Java 17/21, Spring Boot 3.x, Spring Security (RBAC & JWT), PostgreSQL JSONB

### Core Deliverables:
1. **REST Controller Endpoints**:
   * Build REST endpoints: `/api/v1/auth`, `/api/v1/flights`, `/api/v1/gates`, `/api/v1/tasks`, `/api/v1/border-control`, `/api/v1/audit`.
2. **Specialized Feature APIs**:
   * **Live Security Queue & Wait Times API (`GET /api/v1/security/queue-times`):** Executes 15-minute rolling window SQL aggregations on `passenger_clearance_logs` to compute real-time throughput.
   * **Vehicle Fleet & Shuttle Dispatch API (`POST /api/v1/tasks/{id}/equipment`):** Enables assignment of `PASSENGER_SHUTTLE`, `BAG_TUG`, and `FUEL_TRUCK` in `equipment_assignments`.
   * **Shift Handover Log API (`POST /api/v1/audit/shift-handover`):** Persists controller shift notes directly into `audit_logs` using PostgreSQL JSONB `change_payload`.
3. **Server-Side Dual-Layer Security (RBAC & Spring Security)**:
   * Implement `@PreAuthorize` security filters on REST methods to block unauthorized requests with `HTTP 403 Forbidden` if client-side tampering occurs.
4. **Viva Expectation**:
   * Explain Java service logic, SQL aggregation queries, Spring Security filters, and JSONB audit logging.

---

## 🎨 3. Anuvrat Tripathi — Frontend UI/UX & Web Application
* **Domain**: Web Interface, CSMIA Public Portal, Master Dashboard Shell & Route Security  
* **Primary Tech**: React 18, TypeScript, Material UI (MUI), React Router 6

### Core Deliverables:
1. **CSMIA-Inspired Public Website (Passenger Portal)**:
   * Build public-facing flight search, live FIDS arrivals/departures board, interactive terminal guide, and baggage carousel lookup.
   * Render static CMS content (Airport FAQs, Parking Tariffs, Guidelines, Dining listings) using React components and local JSON asset files (`faqs.json`, `diningData.json`).
2. **1 Unified Master Dashboard Shell (`DashboardLayout.tsx`)**:
   * Build a single master dashboard shell that dynamically renders sidebar navigation modules based on the user's `role` and `department` returned by `/api/v1/auth/login`.
3. **Client-Side Route Security & Form Modals**:
   * Wrap protected routes inside `<ProtectedRoute />` components to prevent unauthorized URL access or Inspect Element tampering.
   * Build UI modals for Vehicle Dispatch and Shift Handover log submissions.
4. **Viva Expectation**:
   * Demonstrate the CSMIA public portal, live sync updates between AOCC and Public FIDS, dynamic sidebar filtering, and React state management.

---

## 📝 4. Chaitanya Tikku — Documentation, Content Copy & QA Testing
* **Domain**: Academic Submission Documents, Public Site Content Copy, & QA Testing  
* **Primary Tools**: Draw.io / Mermaid, Postman, MS Word / Markdown, JUnit

### Core Deliverables:
1. **Public Site Copywriting & Content Assets**:
   * Write and structure realistic text copy for Airport FAQs, Guidelines, Parking tariffs, and Duty-Free / Dining listings inside JSON files for Anuvrat's components.
2. **Software Requirement Specification (SRS Document) & UML Diagrams**:
   * Write the official SRS document detailing 15+ functional requirements.
   * Maintain Use Case, Class, and Sequence diagrams matching the AOCS turnaround workflow.
3. **API & QA Testing**:
   * Test backend APIs (including Queue Times, Vehicle Dispatch, and Shift Handover endpoints) using Postman and log test verification reports.
4. **User Manual & Final Presentation (PPT)**:
   * Create the AOCS User Manual guide and design PowerPoint slides for evaluation day.
5. **Viva Expectation**:
   * Explain system architecture diagrams, use cases, Postman test collections, and SRS requirements.

---

## 📊 Updated Summary Matrix for Evaluation

| Team Member | Primary Technical Responsibility | Key Output Files / Artifacts |
| :--- | :--- | :--- |
| **Krishna Solanki** | Database Integrity, ORM Entities & API Integration | `V1__initial_schema.sql`, JPA Entities, Axios API Hooks |
| **Anay Modi** | REST APIs, Queue Aggregations, Shift Logs & Security | `FlightController.java`, `PassengerClearanceService.java`, `@PreAuthorize` |
| **Anuvrat Tripathi** | CSMIA Public Site, Unified Dashboard Shell & Route Guards | `DashboardLayout.tsx`, `<ProtectedRoute />`, `FlightTracker.tsx` |
| **Chaitanya Tikku** | SRS, Public Site Text Copy, Postman Testing & Presentation | `faqs.json`, `SRS.pdf`, Postman Test Collection, Final PPT |
