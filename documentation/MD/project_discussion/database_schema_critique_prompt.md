# AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
## Complete 37-Table Master Database Architecture Critique & Peer-Review Prompt

Copy and paste the entire block below directly into **Claude (Claude 3.5 Sonnet)** or **ChatGPT (GPT-4o)** to solicit a rigorous expert database architecture critique:

```markdown
Role: You are a Principal Aviation Database Architect and Senior Software Engineer specializing in Airport Operational Databases (AODB), Departure Control Systems (DCS), Baggage Reconciliation Systems (BRS), and Resource Management Systems (RMS) for major international airports (such as SITA, Amadeus, or TAV Tech Stack).

Objective: Evaluate the complete 37-table PostgreSQL 18 relational database schema for the Airport Operations Coordination System (AOCS) designed by our software engineering team. Provide a rigorous review of its design, normalization (3NF/BCNF), real-world airport operational flow accuracy, foreign key constraints, indexing strategy, and potential missing edge cases.

---

### 🏛️ SYSTEM DOMAINS & 37-TABLE SCHEMATIC BREAKDOWN

#### DOMAIN 1: IDENTITY & ACCESS MANAGEMENT (IAM) & ORGANIZATIONAL STRUCTURE
1. ROLES (role_id PK, role_name UNIQUE)
2. DEPARTMENTS (department_id PK, department_name UNIQUE)
3. USERS (user_id PK, username UNIQUE, name, role_id FK, department_id FK)
4. USER_PHONE_NUMBERS (user_id FK, phone_number PK - 1NF multivalued contact split)

#### DOMAIN 2: AVIATION INFRASTRUCTURE & AIRFIELD MASTERS
5. AIRLINES (airline_id PK, iata_code UNIQUE, icao_code UNIQUE, airline_name, country)
6. AIRPORTS (airport_id PK, iata_code UNIQUE, icao_code UNIQUE, airport_name, city, country, timezone)
7. AIRCRAFT_TYPES (type_id PK, type_code UNIQUE, manufacturer, model_name, wingspan_meters, mtow_kg, max_passenger_capacity)
8. AIRCRAFT (aircraft_id PK, registration_number UNIQUE, type_id FK -> AIRCRAFT_TYPES, airline_id FK -> AIRLINES)
9. GATES (gate_id PK, gate_number UNIQUE)
10. CHECKIN_COUNTERS (counter_id PK, counter_number UNIQUE, terminal, allocated_airline_id FK -> AIRLINES)
11. STANDS (stand_id PK, stand_number UNIQUE, is_remote, has_jetbridge, assigned_gate_id FK -> GATES)
12. RUNWAYS (runway_id PK, runway_code UNIQUE)

#### DOMAIN 3: AIRSIDE METAR & RESOURCE ASSIGNMENT RULES
13. WEATHER_REPORTS (report_id PK, visibility_meters, wind_speed_knots, temperature_celsius, runway_condition, observation_time)
14. GATE_ASSIGNMENT_RULES (rule_id PK, gate_id FK -> GATES, type_id FK -> AIRCRAFT_TYPES, max_wingspan_meters, max_weight_mtow_kg)

#### DOMAIN 4: FLIGHT LOGISTICS & GROUND TURNAROUND
15. FLIGHTS (flight_id PK, flight_number, flight_status, flight_type, origin_airport_id FK, destination_airport_id FK, airline_id FK, aircraft_id FK, gate_id FK, stand_id FK, runway_id FK, scheduled_departure_time, actual_departure_time, scheduled_arrival_time, actual_arrival_time, boarding_time)
16. TASKS (task_id PK, task_name, status, scheduled_start, scheduled_end, actual_start, actual_end, flight_id FK, assigned_user_id FK)
17. GROUND_EQUIPMENT (equipment_id PK, equipment_code UNIQUE, equipment_type, status)
18. EQUIPMENT_ASSIGNMENTS (assignment_id PK, equipment_id FK, task_id FK, assigned_timestamp, released_timestamp)
19. DELAY_CODES (delay_code PK, category, description - IATA delay code master)
20. DELAY_LOGS (flight_id FK, delay_seq_no PK, delay_code FK -> DELAY_CODES, delay_minutes)
21. FUEL_LOGS (fuel_log_id PK, fuel_density, task_id FK)
22. CARGO_MANIFESTS (cargo_id PK, container_id, weight_kg, cargo_type, flight_id FK -> FLIGHTS)

#### DOMAIN 5: PASSENGER DCS, BRS, SECURITY & BORDER CONTROL
23. BAGGAGE_CAROUSELS (carousel_id PK, terminal, flight_id FK)
24. TRAVELERS (traveler_id PK, first_name, last_name, passport_number UNIQUE, nationality, email, phone_number - Master Human Traveler Profile)
25. PASSENGERS (passenger_id PK, traveler_id FK -> TRAVELERS, flight_id FK -> FLIGHTS, pnr_code, is_transit_passenger - Flight Segment Instance)
26. BOARDING_PASSES (boarding_pass_id PK, barcode_data UNIQUE, ticket_number UNIQUE, seat_number, cabin_class, boarding_group, sequence_number, frequent_flyer_number, passenger_id FK, flight_id FK)
27. BAG_TAGS (bag_tag_id PK, tag_number UNIQUE, weight_kg, status, passenger_id FK, flight_id FK)
28. BAGGAGE_SCAN_EVENTS (scan_id PK, bag_tag_id FK, scan_location, scan_timestamp)
29. MISHANDLED_BAGGAGE (report_id PK, claim_number UNIQUE, incident_type, status, bag_tag_id FK, passenger_id FK)
30. SECURITY_CHECKPOINTS (checkpoint_id PK, checkpoint_name UNIQUE, checkpoint_type, terminal)
31. PASSENGER_CLEARANCE_LOGS (clearance_id PK, scan_timestamp, clearance_status, denial_reason, verification_method, passenger_id FK ON DELETE RESTRICT, boarding_pass_id FK, checkpoint_id FK)
32. IMMIGRATION_RECORDS (immigration_id PK, passport_number, visa_type, stamp_number UNIQUE, biometric_facial_matched, clearance_type, passenger_id FK ON DELETE RESTRICT)
33. LOUNGE_VISITS (visit_id PK, lounge_name, passenger_id FK)

#### DOMAIN 6: REVENUE BILLING, FEEDBACK, NOTIFICATIONS & LEGAL AUDIT
34. CUSTOMER_FEEDBACK_LOGS (feedback_id PK, terminal, rating, category, submitted_at, passenger_id FK)
35. AIRLINE_BILLING_INVOICES (invoice_id PK, invoice_number UNIQUE, airline_id FK, billing_period_start, billing_period_end, total_amount_usd, payment_status)
36. INVOICE_LINE_ITEMS (line_item_id PK, charge_type, amount_usd, invoice_id FK)
37. NOTIFICATIONS (notification_id PK, title, user_id FK)
38. AUDIT_LOGS (log_id PK, action, created_at, user_id FK ON DELETE RESTRICT)
```
