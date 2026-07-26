# AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
## Step 4: Relational Database Schema & ER-to-Relational Mapping Codex

---

### Executive Overview & Theoretical Foundation
This document details the **Relational Database Schema** for AOCS, mapped directly from our Peter Chen Conceptual ER Diagram using the **7-Step ER-to-Relational Mapping Algorithm** from **Elmasri & Navathe's *Fundamentals of Database Systems* (Chapter 7)**.

While the Peter Chen ERD captures conceptual entity relationships via ovals and diamonds, this Relational Schema represents the **physical database implementation in PostgreSQL 18**, explicitly defining Primary Keys (`PK`), Foreign Keys (`FK`), table structures, and referential integrity constraints.

---

## SECTION 1: ELMASRI & NAVATHE 7-STEP MAPPING ALGORITHM ALIGNMENT

| Mapping Step | Formal Algorithm Rule | Applied AOCS Relational Schema Mapping |
|---|---|---|
| **Step 1** | **Regular Entity Types** | Each strong entity (`USERS`, `ROLES`, `DEPARTMENTS`, `AIRCRAFT`, `FLIGHTS`, `GATES`, `RUNWAYS`, `TASKS`, `FUEL_LOGS`, `CARGO_MANIFESTS`, `PASSENGERS`, `LOUNGE_VISITS`, `BAGGAGE_CAROUSELS`, `NOTIFICATIONS`, `AUDIT_LOGS`) is mapped to a relation schema with its simple attributes and Primary Key (`PK`). |
| **Step 2** | **Weak Entity Types** | Weak entity `DELAY_LOGS` is mapped to relation `DELAY_LOGS`. It includes owner foreign key `flight_id [FK]` combined with partial key `delay_seq_no` to form composite Primary Key `(flight_id, delay_seq_no)`. |
| **Step 3** | **Binary 1:1 Relationships** | Standard foreign key approach used for 1:1 linkages where applicable. |
| **Step 4** | **Binary 1:N Relationships** | Primary Key from the `1`-side is embedded as a Foreign Key (`FK`) in the `N`-side relation:<br>• `FLIGHTS` includes `aircraft_id [FK]`, `gate_id [FK]`, `runway_id [FK]`, `department_id [FK]`.<br>• `USERS` includes `role_id [FK]`, `department_id [FK]`.<br>• `TASKS` includes `flight_id [FK]`, `assigned_user_id [FK]`. |
| **Step 5** | **Binary M:N Relationships** | Junction relations created with composite Primary Keys combining foreign keys from both participating entities. |
| **Step 6** | **Multivalued Attributes** | Multivalued attribute `phone_numbers` on `USERS` is mapped to relation `USER_PHONE_NUMBERS(user_id [FK], phone_number)`. |
| **Step 7** | **N-ary Relationships** | Higher degree relations mapped using foreign key cross-references. |

---

## SECTION 2: RELATIONAL TABLES & REFERENTIAL INTEGRITY SPECIFICATIONS

### 1. `ROLES` Relation
* `role_id` **[PK]**: `BIGINT NOT NULL`
* `role_name`: `VARCHAR(50) NOT NULL UNIQUE`

### 2. `DEPARTMENTS` Relation
* `department_id` **[PK]**: `BIGINT NOT NULL`
* `department_name`: `VARCHAR(100) NOT NULL UNIQUE`

### 3. `USERS` Relation
* `user_id` **[PK]**: `BIGINT NOT NULL`
* `username`: `VARCHAR(50) NOT NULL UNIQUE`
* `name`: `VARCHAR(100) NOT NULL`
* `role_id` **[FK]**: `BIGINT NOT NULL` ➔ `ROLES(role_id) ON DELETE RESTRICT`
* `department_id` **[FK]**: `BIGINT NOT NULL` ➔ `DEPARTMENTS(department_id) ON DELETE RESTRICT`

### 4. `USER_PHONE_NUMBERS` Relation *(Step 6 Multivalued Mapping)*
* `user_id` **[FK, PK]**: `BIGINT NOT NULL` ➔ `USERS(user_id) ON DELETE CASCADE`
* `phone_number` **[PK]**: `VARCHAR(30) NOT NULL`

### 5. `AIRCRAFT` Relation
* `aircraft_id` **[PK]**: `BIGINT NOT NULL`
* `registration_number`: `VARCHAR(20) NOT NULL UNIQUE`

### 6. `GATES` Relation
* `gate_id` **[PK]**: `BIGINT NOT NULL`
* `gate_number`: `VARCHAR(10) NOT NULL UNIQUE`

### 7. `RUNWAYS` Relation
* `runway_id` **[PK]**: `BIGINT NOT NULL`
* `runway_code`: `VARCHAR(10) NOT NULL UNIQUE`

### 8. `FLIGHTS` Relation
* `flight_id` **[PK]**: `BIGINT NOT NULL`
* `flight_number`: `VARCHAR(10) NOT NULL`
* `flight_status`: `VARCHAR(20) NOT NULL`
* `aircraft_id` **[FK]**: `BIGINT NOT NULL` ➔ `AIRCRAFT(aircraft_id) ON DELETE RESTRICT`
* `gate_id` **[FK]**: `BIGINT NULL` ➔ `GATES(gate_id) ON DELETE SET NULL`
* `runway_id` **[FK]**: `BIGINT NULL` ➔ `RUNWAYS(runway_id) ON DELETE SET NULL`
* `department_id` **[FK]**: `BIGINT NULL` ➔ `DEPARTMENTS(department_id) ON DELETE SET NULL`

### 9. `TASKS` Relation
* `task_id` **[PK]**: `BIGINT NOT NULL`
* `task_name`: `VARCHAR(100) NOT NULL`
* `status`: `VARCHAR(20) NOT NULL`
* `flight_id` **[FK]**: `BIGINT NOT NULL` ➔ `FLIGHTS(flight_id) ON DELETE CASCADE`
* `assigned_user_id` **[FK]**: `BIGINT NULL` ➔ `USERS(user_id) ON DELETE SET NULL`

### 10. `DELAY_LOGS` Relation *(Step 2 Weak Entity Mapping)*
* `flight_id` **[FK, PK]**: `BIGINT NOT NULL` ➔ `FLIGHTS(flight_id) ON DELETE CASCADE`
* `delay_seq_no` **[PK]**: `INT NOT NULL`
* `delay_minutes`: `INT NOT NULL`

### 11. `FUEL_LOGS` Relation
* `fuel_log_id` **[PK]**: `BIGINT NOT NULL`
* `fuel_density`: `NUMERIC(6,3) NOT NULL`
* `task_id` **[FK]**: `BIGINT NOT NULL` ➔ `TASKS(task_id) ON DELETE RESTRICT`

### 12. `CARGO_MANIFESTS` Relation
* `cargo_id` **[PK]**: `BIGINT NOT NULL`
* `container_id`: `VARCHAR(30) NOT NULL`
* `fuel_log_id` **[FK]**: `BIGINT NOT NULL` ➔ `FUEL_LOGS(fuel_log_id) ON DELETE RESTRICT`

### 13. `BAGGAGE_CAROUSELS` Relation
* `carousel_id` **[PK]**: `BIGINT NOT NULL`
* `terminal`: `VARCHAR(10) NOT NULL`
* `flight_id` **[FK]**: `BIGINT NULL` ➔ `FLIGHTS(flight_id) ON DELETE SET NULL`

### 14. `PASSENGERS` Relation
* `passenger_id` **[PK]**: `BIGINT NOT NULL`
* `passport_number`: `VARCHAR(20) NOT NULL UNIQUE`
* `flight_id` **[FK]**: `BIGINT NOT NULL` ➔ `FLIGHTS(flight_id) ON DELETE RESTRICT`

### 15. `LOUNGE_VISITS` Relation
* `visit_id` **[PK]**: `BIGINT NOT NULL`
* `lounge_name`: `VARCHAR(100) NOT NULL`
* `passenger_id` **[FK]**: `BIGINT NOT NULL` ➔ `PASSENGERS(passenger_id) ON DELETE CASCADE`

### 16. `NOTIFICATIONS` Relation
* `notification_id` **[PK]**: `BIGINT NOT NULL`
* `title`: `VARCHAR(150) NOT NULL`
* `user_id` **[FK]**: `BIGINT NOT NULL` ➔ `USERS(user_id) ON DELETE CASCADE`

### 17. `AUDIT_LOGS` Relation *(Legal Compliance Immutable Log)*
* `log_id` **[PK]**: `BIGINT NOT NULL`
* `action`: `VARCHAR(255) NOT NULL`
* `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`
* `user_id` **[FK]**: `BIGINT NOT NULL` ➔ `USERS(user_id) ON DELETE RESTRICT`

---
*Author: Antigravity Agent (Google Deepmind) | Project: Airport Operations Coordination System (AOCS)*
