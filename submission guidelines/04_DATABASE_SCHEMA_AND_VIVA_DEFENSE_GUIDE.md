# 04: Database Schema & Viva Defense Technical Guide
**Lead Architect**: Krishna Solanki (I075)  
**Database Engine**: PostgreSQL 18  
**Migration Tool**: Flyway (20 versioned scripts: V1 to V20)  
**Total Relational Tables**: 41 Tables in 3NF  
**Live Seed Records**: 158,660+ Records  

---

## 1. The 41 Relational Tables by Domain (OLTP 3NF Core)

### Domain 1: Security & Identity Governance (5 Tables)
1. `roles`: Role definitions and RBAC clearance tiers (`ADMIN`, `AOCC_CONTROLLER`, `CHECKIN_AGENT`, etc.).
2. `departments`: Operational units (`Flight Operations`, `Ground Handling`, `Security CISF`, `Customer Service`).
3. `users`: System staff accounts with BCrypt-hashed credentials, role FKs, and account status flags.
4. `user_phone_numbers`: Normalized 1:N contact phone numbers per user.
5. `auth_sessions`: Single active session governance tracking SHA-256 token hashes and revocation timestamps.

### Domain 2: Aerodrome & Airfield Infrastructure (8 Tables)
6. `airlines`: Commercial carriers with unique IATA/ICAO codes and operating countries.
7. `airports`: Worldwide destinations with coordinates, IATA codes, and timezones.
8. `aircraft_types`: Fleet aircraft models with physical specs (`wingspan_meters`, `mtow_kg`, `max_passenger_capacity`).
9. `aircraft`: Individual tail-numbered airframes linked to airlines and aircraft types.
10. `gates`: Terminal contact gates and boarding bridge attributes.
11. `checkin_counters`: Terminal check-in desks allocated dynamically to airlines.
12. `stands`: Remote and contact apron parking stands with jetbridge support flags.
13. `runways`: Quad runway complex with live telemetry (`surface_friction`, `ils_frequency`, `visual_range_meters`).

### Domain 3: Flight Operations & Dispatch (5 Tables)
14. `weather_reports`: METAR aerodrome observations (visibility, wind speed knots, temperature).
15. `gate_assignment_rules`: Hard physical limits enforcing maximum wingspan and MTOW limits per gate.
16. `flights`: Core movement table tracking status (`SCHEDULED`, `BOARDING`, `AIRBORNE`, `LANDED`), stand, gate, runway, scheduled/actual timestamps.
17. `delay_codes`: Standardized IATA/ICAO delay categories (e.g., Code 41: Cabin Cleaning, Code 89: Technical).
18. `delay_logs`: Multi-incident delay attribution tracking responsible department and duration.

### Domain 4: Airside Turnaround & Ground Servicing (5 Tables)
19. `tasks`: Ground servicing work packages (`CABIN_CLEANING`, `REFUELING`, `CATERING`, `BAGGAGE_OFFLOAD`, `PUSHBACK`).
20. `ground_equipment`: Apron fleet assets (GPU, PCA, baggage tugs, fuel hydrants).
21. `equipment_assignments`: Real-time allocation of equipment to tasks and operators.
22. `fuel_logs`: Aviation turbine fuel delivery logs tracking fuel density and liters dispensed.
23. `shift_handover_logs`: 8-Hour supervisor handover logbook with digital sign-offs.

### Domain 5: Passenger Journey & Baggage Lifecycle (12 Tables)
24. `travelers`: Master traveler profiles with unique passport numbers and contact emails.
25. `passengers`: Flight segment bookings linking travelers to flights via unique 6-character PNRs.
26. `boarding_passes`: Issued thermal passes with unique ticket numbers, seats, cabin classes, and PDF417 barcode payloads.
27. `bag_tags`: 10-digit IATA barcode tags with measured scale weight in kg.
28. `baggage_scan_events`: Mandatory scan checkpoint audit logs (`CHECKIN_DESK`, `SECURITY_EDS`, `MAKEUP_SORT`, `RAMP_HOLD`, `CAROUSEL`).
29. `mishandled_baggage`: PIR damage/delay claims with tracking reference codes.
30. `security_checkpoints`: Physical screening lanes and 3D CT scanner configurations.
31. `passenger_clearance_logs`: CISF screening approval records with biometric verification flags.
32. `immigration_records`: International border control passport stamping logs.
33. `lounge_visits`: Airport lounge access tracking.
34. `baggage_carousels`: Reclaim hall conveyer allocations.
35. `lost_and_found_items`: Custody tracking for lost terminal property with public inquiry numbers.

### Domain 6: Commercial, Support & Audit (6 Tables)
36. `cargo_manifests`: Air freight consignments with ULD containers and weight allocations.
37. `customer_feedback_logs`: Terminal passenger ratings and feedback comments.
38. `airline_billing_invoices`: Commercial aeronautical tariff invoices for airlines.
39. `invoice_line_items`: Itemized charges for landing fees, stand parking, aerobridge docking, and passenger taxes.
40. `operational_inquiries`: Public passenger support tickets with unique inquiry numbers (`INQ-2026-XXXXX`).
41. `audit_logs`: System-wide immutable administrative audit stream.

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

### Q1: "Why did you separate the 41-table relational schema from the Star Schema?"
* **Answer**:
  > *"The 41 tables represent our **OLTP operational database**, normalized to **3NF** to prevent insert/update anomalies during real-time flight operations and ground task logging.*
  > 
  > *The Star Schema represents our **OLAP analytical data warehouse** for Lab 9. Following Kimball dimensional design principles, we consolidated the 41 operational tables into **10 conformed dimensions** and aggregated operational measures into **`FACT_FLIGHT_TURNAROUND`** so business intelligence queries can run without table locking or performance degradation on production."*

### Q2: "How do Flyway migrations work in your backend?"
* **Answer**:
  > *"When Spring Boot initializes, Flyway reads the versioned migration scripts (`V1__initial_schema.sql` through `V20__security_incidents.sql`) from `src/main/resources/db/migration/`. It maintains an immutable metadata table `flyway_schema_history` ensuring the database schema is deterministically created, validated via checksums, and populated with seed data on any fresh Docker instance."*

### Q3: "What prevents concurrent seat double-booking?"
* **Answer**:
  > *"When a Check-in Agent selects a seat, the backend executes an atomic lookup on `boarding_passes` for that `flight_id` and `seat_number`. If a record already exists, Spring Data JPA aborts the transaction with an `EntityConflictException`, returning an HTTP 409 Conflict status to the UI."*
