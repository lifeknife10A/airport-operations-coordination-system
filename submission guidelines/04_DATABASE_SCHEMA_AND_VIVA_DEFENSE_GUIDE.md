# 04: Database Schema & Viva Defense Technical Guide
## Saphire Airport Operations Coordination System (AOCS)
**Lead Architect**: Krishna Solanki (I075)  
**Database Engine**: PostgreSQL 16 (Alpine Container)  
**Migration Tool**: Flyway (17 sequential scripts: V1 to V20)  
**Total Relational Tables**: 43 Tables in 3NF (41 Domain Core + `notifications` + `security_incidents`)  
**Live Seed Records**: 158,660+ Operational Records  

---

## 1. The 43 Relational Tables by Domain (OLTP 3NF Core)

### Domain 1: Security & Identity Governance (6 Tables)
1. `roles`: Role definitions and RBAC clearance tiers (`SYSTEM_ADMINISTRATOR`, `AIRPORT_OPERATIONS_MANAGER`, `CHECKIN_AGENT`, etc.).
2. `departments`: Operational units (`Flight Operations`, `Ground Handling`, `Security CISF`, `Customer Service`).
3. `users`: System staff accounts with BCrypt-hashed credentials (`password123`), role FKs, and account status flags (`ACTIVE`, `SUSPENDED`).
4. `user_phone_numbers`: Normalized 1:N contact phone numbers per user.
5. `auth_sessions`: Active session governance storing UUID `session_id`, `created_at`, `expires_at`, `revoked_at`, and `revoked_reason`.
6. `security_incidents`: Security incident reports with clearance level, incident type, and CISF logging timestamps (V20).

### Domain 2: Aerodrome & Airfield Infrastructure (8 Tables)
7. `airlines`: Commercial carriers with unique IATA/ICAO codes and operating countries.
8. `airports`: Worldwide destinations with coordinates, IATA codes, and timezones.
9. `aircraft_types`: Fleet aircraft models with physical specifications (`wingspan_meters`, `mtow_kg`, `max_passenger_capacity`).
10. `aircraft`: Individual tail-numbered airframes linked to airlines and aircraft types.
11. `gates`: Terminal contact gates across Concourses A, B, and C with `max_wingspan_meters` and jetbridge flags.
12. `checkin_counters`: Terminal check-in desks allocated dynamically to airlines.
13. `stands`: Remote and contact apron parking stands with jetbridge support flags.
14. `runways`: Quad runway complex with live telemetry (`surface_friction`, `ils_frequency`, `visual_range_meters`).

### Domain 3: Flight Operations & Dispatch (5 Tables)
15. `weather_reports`: METAR aerodrome observations (visibility, wind speed knots, temperature).
16. `flights`: Core movement table tracking status (`SCHEDULED`, `BOARDING`, `AIRBORNE`, `ON_BLOCK`, `DELAYED`), stand, gate, runway, scheduled/actual timestamps.
17. `delay_codes`: Standardized IATA/ICAO delay categories (e.g., Code 41: Cabin Cleaning, Code 89: Ground Handling / Baggage).
18. `delay_logs`: Multi-incident delay attribution tracking responsible department, duration minutes, and dispatcher notes.
19. `notifications`: Real-time system notifications and dispatch alert messages.

### Domain 4: Airside Turnaround & Ground Servicing (5 Tables)
20. `tasks`: Ground servicing work packages (`CABIN_CLEANING`, `REFUELING`, `CATERING`, `BAGGAGE_OFFLOAD`, `PUSHBACK`).
21. `ground_equipment`: Apron fleet assets (GPU, PCA, baggage tugs, fuel hydrants).
22. `equipment_assignments`: Real-time allocation of equipment to tasks and operators.
23. `fuel_logs`: Aviation turbine fuel delivery logs tracking fuel density and liters dispensed.
24. `shift_handover_logs`: 8-Hour supervisor handover logbook with digital sign-offs.

### Domain 5: Passenger Journey & Baggage Lifecycle (12 Tables)
25. `travelers`: Master traveler profiles with unique passport numbers and contact emails.
26. `passengers`: Flight segment bookings linking travelers to flights via unique 6-character PNRs (`PNR00001` to `PNR00600`).
27. `boarding_passes`: Issued thermal passes with unique ticket numbers, seats, cabin classes, and IATA barcode payloads.
28. `bag_tags`: 10-digit IATA barcode tags with measured scale weight in kg.
29. `baggage_scan_events`: Mandatory scan checkpoint audit logs (`CHECKIN_DESK`, `SECURITY_EDS`, `MAKEUP_SORT`, `RAMP_HOLD`, `CAROUSEL`).
30. `mishandled_baggage`: PIR damage/delay claims with tracking reference codes.
31. `security_checkpoints`: Physical screening lanes and 3D CT scanner configurations.
32. `passenger_clearance_logs`: CISF screening approval records with biometric verification flags.
33. `immigration_records`: International border control passport stamping logs.
34. `lounge_visits`: Airport lounge access tracking.
35. `baggage_carousels`: Reclaim hall conveyor allocations.
36. `lost_and_found_items`: Custody tracking for lost terminal property with public inquiry numbers.

### Domain 6: Commercial, Support & Audit (7 Tables)
37. `cargo_manifests`: Air freight consignments with ULD containers and weight allocations.
38. `customer_feedback_logs`: Terminal passenger ratings and feedback comments.
39. `airline_billing_invoices`: Commercial aeronautical tariff invoices for airlines.
40. `invoice_line_items`: Itemized charges for landing fees (calculated from MTOW), stand parking, aerobridge docking, and passenger taxes.
41. `operational_inquiries`: Public passenger support tickets with unique inquiry numbers (`INQ-2026-XXXXX`).
42. `audit_logs`: System-wide immutable administrative audit stream.
43. `gate_assignment_rules`: Aerodrome physical rule constraints.

---

## 2. The OLAP Data Warehouse (Star Schema & Information Package)

### Central Fact Table: `FACT_FLIGHT_TURNAROUND`
* **Grain**: One record per completed aircraft turnaround event.
* **16 Fact Measures & KPIs**:
  1. `planned_turnaround_mins`
  2. `actual_turnaround_mins`
  3. `turnaround_variance_mins`
  4. `turnaround_efficiency_pct`
  5. `total_delay_mins`
  6. `ground_delay_mins`
  7. `air_delay_mins`
  8. `delay_incident_count`
  9. `passenger_count`
  10. `lounge_visit_count`
  11. `baggage_units_processed`
  12. `cargo_weight_kg`
  13. `fuel_delivered_liters`
  14. `total_tasks_assigned`
  15. `tasks_completed_on_time`
  16. `task_delay_duration_mins`

### 10 Conformed Dimension Tables:
1. `DIM_TIME`: `time_key` (PK), full_date, year, quarter, month, week, day_of_week, shift_name, is_holiday_flag.
2. `DIM_FLIGHT`: `flight_key` (PK), flight_id, flight_number, carrier_code, route_type, flight_category, flight_status.
3. `DIM_AIRCRAFT`: `aircraft_key` (PK), aircraft_id, registration_number, manufacturer, model_type, seating_capacity.
4. `DIM_GATE`: `gate_key` (PK), gate_id, gate_number, terminal_code, concourse_zone, gate_type.
5. `DIM_RUNWAY`: `runway_key` (PK), runway_id, runway_code, airside_sector, surface_type, length_meters.
6. `DIM_USER`: `user_key` (PK), user_id, username, full_name, phone_number, employment_status.
7. `DIM_DEPARTMENT`: `department_key` (PK), department_id, department_name, manager_name, number_of_staff.
8. `DIM_ROLE`: `role_key` (PK), role_id, role_name, access_tier, clearance_level.
9. `DIM_PASSENGER`: `passenger_key` (PK), passenger_id, traveler_id, pnr_code, nationality, is_transit_passenger, cabin_class.
10. `DIM_LOGISTICS`: `logistics_key` (PK), equipment_code, equipment_type, fuel_supplier, carousel_number.

---

## 3. High-Yield Viva Defense Questions & Answers

### Q1: "Why did you separate the 43-table relational schema from the Star Schema?"
* **Answer**:
  > *"The 43 tables represent our **OLTP operational database**, normalized to **3NF** to eliminate data redundancy and prevent insert/update anomalies during high-concurrency flight dispatch, check-in, and airside task logging.*
  > 
  > *The Star Schema represents our **OLAP analytical data warehouse** for Lab 9. Following Kimball dimensional modeling, we consolidated operational tables into **10 conformed dimensions** and centered our analysis on **`FACT_FLIGHT_TURNAROUND`** with 16 numeric KPIs, enabling complex executive analytics without degrading OLTP transaction throughput."*

### Q2: "How is session security and revocation handled in your backend?"
* **Answer**:
  > *"Authentication is managed via signed JWTs carrying a unique UUID `session_id`. When a user logs in via `AuthService`, a new session is created in the `auth_sessions` table. The `JwtAuthFilter` intercepts incoming requests, validates the signature, and verifies that the session in `auth_sessions` has not been revoked (`revoked_at IS NULL`). If an administrator revokes a session or a user logs out, the session is stamped with a revocation timestamp, immediately invalidating the token without waiting for JWT expiration."*

### Q3: "How does the backend prevent concurrent seat double-booking?"
* **Answer**:
  > *"Concurrency control is enforced at both the database and application levels. In the database, Flyway migration V17 enforces a strict unique constraint on `(flight_id, seat_number)` in the `boarding_passes` table. In the application layer, `CheckinService` checks seat availability atomically within a `@Transactional` boundary. If another agent or thread attempts to claim the same seat simultaneously, the transaction fails and throws a `ConflictException` (HTTP 409), which the UI catches to display an immediate alert."*

### Q4: "How does the Gate Allocation Engine enforce physical safety constraints?"
* **Answer**:
  > *"When a flight is assigned to a gate, `GateService.assertWingspanFits()` retrieves the aircraft type's wingspan from `aircraft_types.wingspan_meters` and compares it against `gates.max_wingspan_meters`. If the aircraft wingspan exceeds the gate's structural capacity (such as assigning a 64.8m Boeing 777 to a 36.0m Narrowbody Gate A1), the service rejects the assignment, throwing a `ConflictException` (HTTP 409) with a detailed violation message."*

### Q5: "How are automated tests structured and what do they verify?"
* **Answer**:
  > *"We engineered a suite of 109 automated unit tests using JUnit 5 and Mockito. These tests validate critical business logic across our 22 Spring Boot controllers and service layers, including Equivalence Partitioning and Boundary Value Analysis on gate wingspan thresholds, JWT authentication and session lifecycle, flight status transitions, and aeronautical tariff calculations."*
