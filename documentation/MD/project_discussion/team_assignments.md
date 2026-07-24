# Team Roles and Project Ownership Division

This document records the official architectural role division and operational responsibilities for the 4 team members of the **Airport Operations Coordination System (AOCS)** project.

---

## 1. Summary of Team Role Division

| Team Member | Project Role | Core Technical Responsibilities |
| :--- | :--- | :--- |
| **Anuvrat Tripathi** | **Frontend UI/UX Lead** *(React + Material UI)* | Building and styling the 15+ web pages, responsive layouts, dashboard components, flight schedules, gate maps, and task status cards. |
| **Anay Modi** | **Backend API & Logic Lead** *(Java Spring Boot)* | Writing REST Controllers, turnaround business logic, role-based authorization (RBAC), task assignment algorithms, and service layer logic. |
| **Krishna Solanki** | **Database & System Integration Lead** *(PostgreSQL + API Wiring)* | Database schema design, Flyway migration scripts, JPA repositories, and connecting React frontend components to Spring Boot APIs. |
| **Chaitanya Tikku** | **Documentation, UML & QA Testing Lead** | Software Requirement Specification (SRS), ER Diagrams, Use Case & Sequence Diagrams, test suite creation, User Manual, and final PPT presentation. |

---

## 2. Detailed Technical & Functional Responsibilities

### 🎨 Anuvrat Tripathi — Frontend UI/UX Lead
* **Primary Tech Stack**: React, TypeScript, Material UI (MUI), HTML5, CSS3.
* **Core Deliverables**:
  1. **Dashboard UI**: Interactive operational overview (Flights Today, Active Delays, Gate Status, Department Cards).
  2. **15+ Core Web Pages**: Flight Management, Gate Allocation, Task Tracking, User Administration, Reports View, Login/Logout.
  3. **Component Library**: Reusable UI components (Status Chips, Priority Badges, Flight Progress Bars, Alert Snackbars).
  4. **Form Validation**: Client-side form validations for user inputs, task creation, and gate changes.

---

### ⚙️ Anay Modi — Backend API & Logic Lead
* **Primary Tech Stack**: Java 17/21, Spring Boot, Spring Security (JWT / RBAC), RESTful APIs.
* **Core Deliverables**:
  1. **REST API Endpoints**: `/api/auth`, `/api/flights`, `/api/gates`, `/api/tasks`, `/api/departments`, `/api/notifications`, `/api/reports`.
  2. **Business Rules**: Turnaround workflow rules (e.g., preventing boarding before cleaning/fueling are complete).
  3. **Role-Based Access Control (RBAC)**: Enforcing permissions across the 8 stakeholder roles.
  4. **Delay Engine**: Logic to detect overdue tasks, calculate delay minutes, and flag alerts.

---

### 🗄️ Krishna Solanki — Database & System Integration Lead
* **Primary Tech Stack**: PostgreSQL, Spring Data JPA, Hibernate, Flyway, Axios/Fetch API Integration.
* **Core Deliverables**:
  1. **Database Management**: Schema creation, indexes, foreign key constraints, and seed data initialization.
  2. **Database Migrations**: Flyway version control scripts (`V1__init_schema.sql`, `V2__seed_data.sql`).
  3. **ORM & Repositories**: Spring Data JPA Entities, DTOs, and Custom Query Repositories.
  4. **Full-Stack Integration**: Connecting React frontend components with Spring Boot REST endpoints, handling CORS, error responses, and state wiring.

---

### 📝 Chaitanya Tikku — Documentation, UML & QA Testing Lead
* **Primary Tools & Deliverables**: Draw.io/Mermaid, Postman, JUnit/Jest, MS Word/PDF tools.
* **Core Deliverables**:
  1. **Formal SRS Document**: System requirements, use cases, non-functional requirements, and system boundaries.
  2. **UML Diagrams**: Use Case Diagram, Class Diagram, Sequence Diagrams (Aircraft Turnaround Flow), State Machine Diagrams.
  3. **Quality Assurance & Testing**: Writing test cases, API endpoint testing via Postman, verifying data validation and edge cases.
  4. **Project Deliverables**: User Manual, SQL Database Script verification, Project Report, and final Evaluation Presentation (PPT).
