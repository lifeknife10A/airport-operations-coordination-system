# AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
## Complete 35-Table Master Database Architecture Critique & Peer-Review Prompt

Copy and paste the entire block below directly into **Claude (Claude 3.5 Sonnet)** or **ChatGPT (GPT-4o)** to solicit a rigorous expert database architecture critique:

```markdown
Role: You are a Principal Aviation Database Architect and Senior Software Engineer specializing in Airport Operational Databases (AODB), Departure Control Systems (DCS), Baggage Reconciliation Systems (BRS), and Resource Management Systems (RMS) for major international airports (such as SITA, Amadeus, or TAV Tech Stack).

Objective: Evaluate the complete 35-table PostgreSQL 18 relational database schema for the Airport Operations Coordination System (AOCS) designed by our software engineering team. Provide a rigorous, highly critical review of its design, normalization (3NF/BCNF), real-world airport operational flow accuracy, foreign key constraints, indexing strategy, and potential missing edge cases.

---

### 🏛️ SYSTEM DOMAINS & 35-TABLE SCHEMATIC BREAKDOWN

#### DOMAIN 1: IDENTITY & ACCESS MANAGEMENT (IAM) & ORGANIZATIONAL STRUCTURE
1. ROLES
   - Primary Key: role_id (BIGSERIAL)
   - Attributes: role_name (VARCHAR(50), UNIQUE) - e.g., ROLE_ADMIN, ROLE_SUPERVISOR, ROLE_GROUND_CREW, ROLE_ATC, ROLE_DISPATCH.
   - Purpose: Enforces RBAC security across the airport portal.

2. DEPARTMENTS
   - Primary Key: department_id (BIGSERIAL)
   - Attributes: department_name (VARCHAR(100), UNIQUE) - e.g., Flight Dispatch, ATC, Ground Handling, Refueling, Security.
   - Purpose: Maps operational responsibility for tasks and turnaround SLAs.

3. USERS
   - Primary Key: user_id (BIGSERIAL)
   - Foreign Keys: role_id -> ROLES(role_id), department_id -> DEPARTMENTS(department_id)
   - Attributes: username (VARCHAR(50), UNIQUE), name (VARCHAR(100))
   - Purpose: Central employee/staff user registry.

4. USER_PHONE_NUMBERS (Multivalued Attribute Table)
   - Composite Primary Key: (user_id, phone_number)
   - Foreign Key: user_id -> USERS(user_id) ON DELETE CASCADE
   - Attributes: phone_number (VARCHAR(30))
   - Purpose: 1NF normalization of employee contact numbers.

---

#### DOMAIN 2: AVIATION INFRASTRUCTURE & AIRFIELD MASTERS
5. AIRLINES
   - Primary Key: airline_id (BIGSERIAL)
   - Attributes: iata_code (VARCHAR(10), UNIQUE), icao_code (VARCHAR(10), UNIQUE), airline_name (VARCHAR(100)), country (VARCHAR(50))
   - Purpose: Master carrier registry (Air India, IndiGo, Emirates, British Airways).

6. AIRPORTS
   - Primary Key: airport_id (BIGSERIAL)
   - Attributes: iata_code (VARCHAR(10), UNIQUE), icao_code (VARCHAR(10), UNIQUE), airport_name (VARCHAR(100)), city (VARCHAR(50)), country (VARCHAR(50)), timezone (VARCHAR(50))
   - Purpose: Global origin/destination airport directory (DEL, BOM, DXB, LHR, JFK, SIN).

7. AIRCRAFT
   - Primary Key: aircraft_id (BIGSERIAL)
   - Foreign Key: airline_id -> AIRLINES(airline_id) ON DELETE RESTRICT
   - Attributes: registration_number (VARCHAR(20), UNIQUE) - e.g., VT-ANZ, A6-EUA.
   - Purpose: Commercial airframe tail number master inventory.

8. GATES
   - Primary Key: gate_id (BIGSERIAL)
   - Attributes: gate_number (VARCHAR(10), UNIQUE) - e.g., Gate A01, B12, C05.
   - Purpose: Terminal concourse passenger boarding gate doors.

9. CHECKIN_COUNTERS
   - Primary Key: counter_id (BIGSERIAL)
   - Foreign Key: allocated_airline_id -> AIRLINES(airline_id) ON DELETE SET NULL
   - Attributes: counter_number (VARCHAR(20), UNIQUE), terminal (VARCHAR(10))
   - Purpose: Front-end Departure Control System (DCS) check-in counter blocks allocated to carriers.

10. STANDS
    - Primary Key: stand_id (BIGSERIAL)
    - Foreign Key: assigned_gate_id -> GATES(gate_id) ON DELETE SET NULL
    - Attributes: stand_number (VARCHAR(20), UNIQUE), is_remote (BOOLEAN), has_jetbridge (BOOLEAN)
    - Purpose: Airside apron parking positions distinguishing Jetbridge contact stands vs. Remote bus stands.

11. RUNWAYS
    - Primary Key: runway_id (BIGSERIAL)
    - Attributes: runway_code (VARCHAR(10), UNIQUE) - e.g., 09L, 27R, 10L, 28R.
    - Purpose: Airfield takeoff and landing runway strip inventory.

---

#### DOMAIN 3: AIRSIDE METAR & RESOURCE ASSIGNMENT RULES
12. WEATHER_REPORTS
    - Primary Key: report_id (BIGSERIAL)
    - Attributes: visibility_meters (INT), wind_speed_knots (INT), temperature_celsius (NUMERIC(4,1)), runway_condition (VARCHAR(20) - DRY/WET/FOG/HEAVY_RAIN), observation_time (TIMESTAMPTZ)
    - Purpose: Real-time METAR weather tracking driving ATC runway direction and flight delay decisions.

13. GATE_ASSIGNMENT_RULES
    - Primary Key: rule_id (BIGSERIAL)
    - Foreign Key: gate_id -> GATES(gate_id) ON DELETE CASCADE
    - Attributes: max_wingspan_meters (NUMERIC(5,2)), max_weight_mtow_kg (NUMERIC(10,2)), compatible_aircraft_type (VARCHAR(50))
    - Purpose: Resource Management System (RMS) physical constraint rules enforcing aircraft size compatibility per gate.

---

#### DOMAIN 4: FLIGHT LOGISTICS & GROUND TURNAROUND
14. FLIGHTS
    - Primary Key: flight_id (BIGSERIAL)
    - Foreign Keys: origin_airport_id -> AIRPORTS(airport_id), destination_airport_id -> AIRPORTS(airport_id), airline_id -> AIRLINES(airline_id), aircraft_id -> AIRCRAFT(aircraft_id), gate_id -> GATES(gate_id), stand_id -> STANDS(stand_id), runway_id -> RUNWAYS(runway_id), department_id -> DEPARTMENTS(department_id)
    - Attributes: flight_number (VARCHAR(10)), flight_status (VARCHAR(20) - SCHEDULED/BOARDING/AIRBORNE/LANDED/DELAYED/CANCELLED), flight_type (DEPARTURE/ARRIVAL), scheduled_departure_time, actual_departure_time, scheduled_arrival_time, actual_arrival_time, boarding_time
    - Purpose: Core AODB flight schedule & real-time operational status center.

15. TASKS
    - Primary Key: task_id (BIGSERIAL)
    - Foreign Keys: flight_id -> FLIGHTS(flight_id) ON DELETE CASCADE, assigned_user_id -> USERS(user_id) ON DELETE SET NULL
    - Attributes: task_name (VARCHAR(100)), status (PENDING/IN_PROGRESS/COMPLETED/BLOCKED)
    - Purpose: Turnaround SLA sub-tasks (Cabin Cleaning, Refueling, Catering, Baggage Loading).

16. GROUND_EQUIPMENT
    - Primary Key: equipment_id (BIGSERIAL)
    - Attributes: equipment_code (VARCHAR(20), UNIQUE), equipment_type (Pushback Tug, GPU, PCA Unit, Belt Loader, Airside Bus, De-icing Rig), status (AVAILABLE/IN_USE/MAINTENANCE)
    - Purpose: Fleet management for airside motorized and non-motorized ground support equipment (GSE).

17. EQUIPMENT_ASSIGNMENTS
    - Primary Key: assignment_id (BIGSERIAL)
    - Foreign Keys: equipment_id -> GROUND_EQUIPMENT(equipment_id) ON DELETE CASCADE, task_id -> TASKS(task_id) ON DELETE CASCADE
    - Attributes: assigned_timestamp, released_timestamp
    - Purpose: Vehicle allocation tracking for ground turnaround tasks.

18. DELAY_LOGS (Weak Entity)
    - Composite Primary Key: (flight_id, delay_seq_no)
    - Foreign Key: flight_id -> FLIGHTS(flight_id) ON DELETE CASCADE
    - Attributes: delay_seq_no (INT), delay_minutes (INT)
    - Purpose: Weak entity logging granular IATA delay code minutes per flight.

19. FUEL_LOGS
    - Primary Key: fuel_log_id (BIGSERIAL)
    - Foreign Key: task_id -> TASKS(task_id) ON DELETE RESTRICT
    - Attributes: fuel_density (NUMERIC(6,3))
    - Purpose: Refueling density quality check audit logs.

20. CARGO_MANIFESTS
    - Primary Key: cargo_id (BIGSERIAL)
    - Foreign Key: fuel_log_id -> FUEL_LOGS(fuel_log_id) ON DELETE RESTRICT
    - Attributes: container_id (VARCHAR(30)) - e.g., AKN-10042-AOCS.
    - Purpose: ULD freight container manifest records.

---

#### DOMAIN 5: PASSENGER DCS, BARS, SECURITY & BORDER CONTROL
21. PASSENGERS
    - Primary Key: passenger_id (BIGSERIAL)
    - Foreign Key: flight_id -> FLIGHTS(flight_id) ON DELETE RESTRICT
    - Attributes: first_name (VARCHAR(50)), last_name (VARCHAR(50)), pnr_code (VARCHAR(10)), passport_number (VARCHAR(20), UNIQUE), nationality (VARCHAR(50)), is_transit_passenger (BOOLEAN), email, phone_number
    - Purpose: Departure Control System (DCS) passenger manifest with PNR booking codes and transit flags.

22. BOARDING_PASSES
    - Primary Key: boarding_pass_id (BIGSERIAL)
    - Foreign Keys: passenger_id -> PASSENGERS(passenger_id) ON DELETE CASCADE, flight_id -> FLIGHTS(flight_id) ON DELETE CASCADE
    - Attributes: barcode_data (VARCHAR(255), UNIQUE), ticket_number (VARCHAR(30), UNIQUE), seat_number (VARCHAR(10)), cabin_class (ECONOMY/PREMIUM_ECONOMY/BUSINESS/FIRST), boarding_group (ZONE 1..4), sequence_number (INT), frequent_flyer_number
    - Purpose: Soft-copy & printable IATA Resolution 792 Barcoded Boarding Pass (BCBP) records.

23. BAGGAGE_CAROUSELS
    - Primary Key: carousel_id (BIGSERIAL)
    - Foreign Key: flight_id -> FLIGHTS(flight_id) ON DELETE SET NULL
    - Attributes: terminal (VARCHAR(10))
    - Purpose: Terminal arrival baggage reclaim carousel allocations.

24. BAG_TAGS
    - Primary Key: bag_tag_id (BIGSERIAL)
    - Foreign Keys: passenger_id -> PASSENGERS(passenger_id) ON DELETE CASCADE, flight_id -> FLIGHTS(flight_id) ON DELETE CASCADE
    - Attributes: tag_number (VARCHAR(20), UNIQUE), weight_kg (NUMERIC(5,2)), status (CHECKED_IN/SCREENED/LOADED/CLAIMED)
    - Purpose: Baggage Reconciliation System (BRS) 10-digit IATA barcode/RFID tag registry.

25. BAGGAGE_SCAN_EVENTS
    - Primary Key: scan_id (BIGSERIAL)
    - Foreign Key: bag_tag_id -> BAG_TAGS(bag_tag_id) ON DELETE CASCADE
    - Attributes: scan_location (VARCHAR(100)), scan_timestamp (TIMESTAMPTZ)
    - Purpose: Live RFID scan tracking trail (Check-in -> Sorting Belt -> HBS X-Ray -> ULD Loader -> Carousel).

26. MISHANDLED_BAGGAGE
    - Primary Key: report_id (BIGSERIAL)
    - Foreign Keys: bag_tag_id -> BAG_TAGS(bag_tag_id) ON DELETE CASCADE, passenger_id -> PASSENGERS(passenger_id) ON DELETE CASCADE
    - Attributes: claim_number (VARCHAR(50), UNIQUE), incident_type (LOST/DAMAGED/DELAYED/PILFERED), status (OPEN/LOCATED/IN_TRANSIT/RESOLVED)
    - Purpose: IATA WorldTracer Property Irregularity Report (PIR) claims system.

27. SECURITY_CHECKPOINTS
    - Primary Key: checkpoint_id (BIGSERIAL)
    - Attributes: checkpoint_name (VARCHAR(100), UNIQUE), checkpoint_type (TERMINAL_ENTRY/SECURITY_SCREENING/IMMIGRATION_CONTROL/BOARDING_GATE), terminal (VARCHAR(10))
    - Purpose: Terminal physical scanner gate locations.

28. PASSENGER_CLEARANCE_LOGS
    - Primary Key: clearance_id (BIGSERIAL)
    - Foreign Keys: passenger_id -> PASSENGERS(passenger_id) ON DELETE CASCADE, boarding_pass_id -> BOARDING_PASSES(boarding_pass_id) ON DELETE CASCADE, checkpoint_id -> SECURITY_CHECKPOINTS(checkpoint_id) ON DELETE RESTRICT
    - Attributes: scan_timestamp, clearance_status (APPROVED/FLAGGED_SECURITY/DENIED/BOARDED), denial_reason (VARCHAR(100)), verification_method (BARCODE_SCANNER/BIOMETRIC_FACIAL/PASSPORT_CHIP_READER)
    - Purpose: E-Gate & boarding scanner validation log with security denial reasons.

29. IMMIGRATION_RECORDS
    - Primary Key: immigration_id (BIGSERIAL)
    - Foreign Key: passenger_id -> PASSENGERS(passenger_id) ON DELETE CASCADE
    - Attributes: passport_number (VARCHAR(20)), visa_type (TOURIST_VISA/E_VISA/VISA_EXEMPT), stamp_number (VARCHAR(50), UNIQUE), biometric_facial_matched (BOOLEAN), clearance_type (DEPARTURE_EMIGRATION/ARRIVAL_IMMIGRATION)
    - Purpose: Government border control passport control & visa clearance logs.

30. LOUNGE_VISITS
    - Primary Key: visit_id (BIGSERIAL)
    - Foreign Key: passenger_id -> PASSENGERS(passenger_id) ON DELETE CASCADE
    - Attributes: lounge_name (VARCHAR(100))
    - Purpose: Executive VIP lounge access tracking.

---

#### DOMAIN 6: REVENUE BILLING, FEEDBACK, NOTIFICATIONS & LEGAL AUDIT
31. CUSTOMER_FEEDBACK_LOGS
    - Primary Key: feedback_id (BIGSERIAL)
    - Foreign Key: passenger_id -> PASSENGERS(passenger_id) ON DELETE SET NULL
    - Attributes: terminal (VARCHAR(10)), rating (INT 1..5), category (SECURITY_SPEED, GATE_CLEANLINESS, etc.), submitted_at
    - Purpose: Passenger satisfaction analytics from terminal kiosk touchscreens.

32. AIRLINE_BILLING_INVOICES
    - Primary Key: invoice_id (BIGSERIAL)
    - Foreign Key: airline_id -> AIRLINES(airline_id) ON DELETE RESTRICT
    - Attributes: invoice_number (VARCHAR(50), UNIQUE), billing_period_start, billing_period_end, total_amount_usd (NUMERIC(12,2)), payment_status (UNPAID/PAID/OVERDUE)
    - Purpose: Aeronautical revenue billing generated by the airport operator for carriers.

33. INVOICE_LINE_ITEMS
    - Primary Key: line_item_id (BIGSERIAL)
    - Foreign Key: invoice_id -> AIRLINE_BILLING_INVOICES(invoice_id) ON DELETE CASCADE
    - Attributes: charge_type (Landing Fee Tariff, Gate Stand Parking, Refueling Uplift Charge, Passenger Service Fee), amount_usd (NUMERIC(10,2))
    - Purpose: Itemized charge breakdowns for airline monthly invoices.

34. NOTIFICATIONS
    - Primary Key: notification_id (BIGSERIAL)
    - Foreign Key: user_id -> USERS(user_id) ON DELETE CASCADE
    - Attributes: title (VARCHAR(150))
    - Purpose: Staff operational push alerts.

35. AUDIT_LOGS
    - Primary Key: log_id (BIGSERIAL)
    - Foreign Key: user_id -> USERS(user_id) ON DELETE RESTRICT
    - Attributes: action (VARCHAR(255)), created_at (TIMESTAMPTZ)
    - Purpose: Immutable security audit trail enforcing ON DELETE RESTRICT for compliance.

---

### 🔍 UNIFIED SQL PRINT VIEW: `vw_boarding_pass_print_details`
```sql
CREATE OR REPLACE VIEW vw_boarding_pass_print_details AS
SELECT 
    bp.boarding_pass_id,
    bp.ticket_number,
    p.pnr_code,
    (p.last_name || ' / ' || p.first_name) AS passenger_name,
    p.passport_number,
    p.nationality,
    p.is_transit_passenger,
    f.flight_number,
    al.airline_name,
    al.iata_code AS airline_iata,
    orig.city || ' (' || orig.iata_code || ')' AS origin_airport,
    dest.city || ' (' || dest.iata_code || ')' AS destination_airport,
    g.gate_number,
    st.stand_number,
    st.is_remote AS is_remote_stand,
    bp.seat_number,
    bp.cabin_class,
    bp.boarding_group,
    bp.sequence_number,
    bp.frequent_flyer_number,
    f.boarding_time,
    f.scheduled_departure_time,
    f.scheduled_arrival_time,
    ac.registration_number AS aircraft_tail_number,
    bp.barcode_data
FROM boarding_passes bp
JOIN passengers p ON bp.passenger_id = p.passenger_id
JOIN flights f ON bp.flight_id = f.flight_id
JOIN airlines al ON f.airline_id = al.airline_id
JOIN airports orig ON f.origin_airport_id = orig.airport_id
JOIN airports dest ON f.destination_airport_id = dest.airport_id
LEFT JOIN gates g ON f.gate_id = g.gate_id
LEFT JOIN stands st ON f.stand_id = st.stand_id
LEFT JOIN aircraft ac ON f.aircraft_id = ac.aircraft_id;
```

---

### ❓ CRITIQUE QUESTIONS FOR THE AI EVALUATOR:

1. **Operational Completeness**: Is there any real-world airport system flow (AODB, DCS, BRS, RMS, ATC) that is still missing or poorly modeled in this 35-table architecture?
2. **Normalization & Integrity**: Are there any 3NF / BCNF normalization violations, redundant attributes, or missing foreign key cascade behaviors?
3. **Data Types & Precision**: Are the data types (BIGSERIAL, NUMERIC(12,2), TIMESTAMPTZ, VARCHAR constraints) optimal for high-throughput enterprise airport management?
4. **Final Verdict**: On a scale of 1 to 10, how production-ready and impressive is this 35-table schema for a university Mini Project / Software Engineering course?
```
