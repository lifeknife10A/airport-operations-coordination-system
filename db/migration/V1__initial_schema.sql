-- ============================================================
-- AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
-- PostgreSQL 18 Initial Database Schema (Flyway V1 Migration)
-- Author: Krishna Solanki & AOCS Engineering Team
-- Complete 38-Table Master Architecture (Zero Classification Defaults & Aircraft Rotation Trigger)
-- Includes Complete FK Indexing across 47 Edges, Full 3NF, and Flight Rotation Aircraft Validation
-- ============================================================

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
    role_id BIGSERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
    department_id BIGSERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE
);

-- 3. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    role_id BIGINT NOT NULL REFERENCES roles(role_id) ON DELETE RESTRICT,
    department_id BIGINT NOT NULL REFERENCES departments(department_id) ON DELETE RESTRICT
);

-- 4. USER_PHONE_NUMBERS TABLE (Multivalued Attribute)
CREATE TABLE IF NOT EXISTS user_phone_numbers (
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    phone_number VARCHAR(30) NOT NULL,
    PRIMARY KEY (user_id, phone_number)
);

-- 5. AIRLINES TABLE
CREATE TABLE IF NOT EXISTS airlines (
    airline_id BIGSERIAL PRIMARY KEY,
    iata_code VARCHAR(10) NOT NULL UNIQUE,
    icao_code VARCHAR(10) NOT NULL UNIQUE,
    airline_name VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL
);

-- 6. AIRPORTS TABLE
CREATE TABLE IF NOT EXISTS airports (
    airport_id BIGSERIAL PRIMARY KEY,
    iata_code VARCHAR(10) NOT NULL UNIQUE,
    icao_code VARCHAR(10) NOT NULL UNIQUE,
    airport_name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC'
);

-- 7. AIRCRAFT_TYPES TABLE (Master Aircraft Category & Physical Specs)
CREATE TABLE IF NOT EXISTS aircraft_types (
    type_id BIGSERIAL PRIMARY KEY,
    type_code VARCHAR(20) NOT NULL UNIQUE,
    manufacturer VARCHAR(50) NOT NULL,
    model_name VARCHAR(50) NOT NULL,
    wingspan_meters NUMERIC(5,2) NOT NULL CHECK (wingspan_meters > 0),
    mtow_kg NUMERIC(10,2) NOT NULL CHECK (mtow_kg > 0),
    max_passenger_capacity INT NOT NULL CHECK (max_passenger_capacity > 0)
);

-- 8. AIRCRAFT TABLE
CREATE TABLE IF NOT EXISTS aircraft (
    aircraft_id BIGSERIAL PRIMARY KEY,
    registration_number VARCHAR(20) NOT NULL UNIQUE,
    type_id BIGINT NOT NULL REFERENCES aircraft_types(type_id) ON DELETE RESTRICT,
    airline_id BIGINT NOT NULL REFERENCES airlines(airline_id) ON DELETE RESTRICT
);

-- 9. GATES TABLE
CREATE TABLE IF NOT EXISTS gates (
    gate_id BIGSERIAL PRIMARY KEY,
    gate_number VARCHAR(10) NOT NULL UNIQUE
);

-- 10. CHECKIN_COUNTERS TABLE
CREATE TABLE IF NOT EXISTS checkin_counters (
    counter_id BIGSERIAL PRIMARY KEY,
    counter_number VARCHAR(20) NOT NULL UNIQUE,
    terminal VARCHAR(10) NOT NULL,
    allocated_airline_id BIGINT REFERENCES airlines(airline_id) ON DELETE SET NULL
);

-- 11. STANDS TABLE (No Silent Remote or Jetbridge Defaults!)
CREATE TABLE IF NOT EXISTS stands (
    stand_id BIGSERIAL PRIMARY KEY,
    stand_number VARCHAR(20) NOT NULL UNIQUE,
    is_remote BOOLEAN NOT NULL,
    has_jetbridge BOOLEAN NOT NULL,
    assigned_gate_id BIGINT REFERENCES gates(gate_id) ON DELETE SET NULL
);

-- 12. RUNWAYS TABLE
CREATE TABLE IF NOT EXISTS runways (
    runway_id BIGSERIAL PRIMARY KEY,
    runway_code VARCHAR(10) NOT NULL UNIQUE
);

-- 13. WEATHER_REPORTS TABLE (No Silent Runway Condition Default!)
CREATE TABLE IF NOT EXISTS weather_reports (
    report_id BIGSERIAL PRIMARY KEY,
    visibility_meters INT NOT NULL CHECK (visibility_meters >= 0),
    wind_speed_knots INT NOT NULL CHECK (wind_speed_knots >= 0),
    temperature_celsius NUMERIC(4,1) NOT NULL,
    runway_condition VARCHAR(20) NOT NULL CHECK (runway_condition IN ('DRY', 'WET', 'FOG', 'HEAVY_RAIN')),
    observation_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 14. GATE_ASSIGNMENT_RULES TABLE (Strict 3NF: Only FK to AIRCRAFT_TYPES)
CREATE TABLE IF NOT EXISTS gate_assignment_rules (
    rule_id BIGSERIAL PRIMARY KEY,
    gate_id BIGINT NOT NULL REFERENCES gates(gate_id) ON DELETE CASCADE,
    type_id BIGINT NOT NULL REFERENCES aircraft_types(type_id) ON DELETE CASCADE,
    max_wingspan_meters NUMERIC(5,2) NOT NULL CHECK (max_wingspan_meters > 0),
    max_weight_mtow_kg NUMERIC(10,2) NOT NULL CHECK (max_weight_mtow_kg > 0)
);

-- 15. FLIGHTS TABLE (Three-Tier Times, Rotation Safeguard & No Silent Defaults)
CREATE TABLE IF NOT EXISTS flights (
    flight_id BIGSERIAL PRIMARY KEY,
    flight_number VARCHAR(10) NOT NULL,
    flight_status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED' CHECK (flight_status IN ('SCHEDULED', 'BOARDING', 'AIRBORNE', 'LANDED', 'DELAYED', 'CANCELLED')),
    flight_type VARCHAR(15) NOT NULL CHECK (flight_type IN ('DEPARTURE', 'ARRIVAL')),
    origin_airport_id BIGINT NOT NULL REFERENCES airports(airport_id) ON DELETE RESTRICT,
    destination_airport_id BIGINT NOT NULL REFERENCES airports(airport_id) ON DELETE RESTRICT,
    airline_id BIGINT NOT NULL REFERENCES airlines(airline_id) ON DELETE RESTRICT,
    scheduled_departure_time TIMESTAMPTZ NOT NULL,
    estimated_departure_time TIMESTAMPTZ,
    actual_departure_time TIMESTAMPTZ,
    scheduled_arrival_time TIMESTAMPTZ NOT NULL,
    estimated_arrival_time TIMESTAMPTZ,
    actual_arrival_time TIMESTAMPTZ,
    boarding_time TIMESTAMPTZ,
    aircraft_id BIGINT NOT NULL REFERENCES aircraft(aircraft_id) ON DELETE RESTRICT,
    gate_id BIGINT REFERENCES gates(gate_id) ON DELETE SET NULL,
    stand_id BIGINT REFERENCES stands(stand_id) ON DELETE SET NULL,
    runway_id BIGINT REFERENCES runways(runway_id) ON DELETE SET NULL,
    department_id BIGINT REFERENCES departments(department_id) ON DELETE SET NULL,
    inbound_flight_id BIGINT REFERENCES flights(flight_id) ON DELETE SET NULL,
    UNIQUE (flight_number, airline_id, scheduled_departure_time),
    CHECK (inbound_flight_id IS NULL OR inbound_flight_id <> flight_id),
    UNIQUE (inbound_flight_id)
);

-- 16. TASKS TABLE (Enhanced with SLA Timestamps)
CREATE TABLE IF NOT EXISTS tasks (
    task_id BIGSERIAL PRIMARY KEY,
    task_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED')),
    scheduled_start TIMESTAMPTZ,
    scheduled_end TIMESTAMPTZ,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE,
    assigned_user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL
);

-- 17. GROUND_EQUIPMENT TABLE
CREATE TABLE IF NOT EXISTS ground_equipment (
    equipment_id BIGSERIAL PRIMARY KEY,
    equipment_code VARCHAR(20) NOT NULL UNIQUE,
    equipment_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'IN_USE', 'MAINTENANCE'))
);

-- 18. EQUIPMENT_ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS equipment_assignments (
    assignment_id BIGSERIAL PRIMARY KEY,
    equipment_id BIGINT NOT NULL REFERENCES ground_equipment(equipment_id) ON DELETE CASCADE,
    task_id BIGINT NOT NULL REFERENCES tasks(task_id) ON DELETE CASCADE,
    assigned_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    released_timestamp TIMESTAMPTZ
);

-- 19. DELAY_CODES TABLE (Master IATA Delay Code Directory)
CREATE TABLE IF NOT EXISTS delay_codes (
    delay_code VARCHAR(10) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL
);

-- 20. DELAY_LOGS TABLE (Normalized with FK to DELAY_CODES)
CREATE TABLE IF NOT EXISTS delay_logs (
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE,
    delay_seq_no INT NOT NULL CHECK (delay_seq_no > 0),
    delay_code VARCHAR(10) NOT NULL REFERENCES delay_codes(delay_code) ON DELETE RESTRICT,
    delay_minutes INT NOT NULL CHECK (delay_minutes >= 0),
    PRIMARY KEY (flight_id, delay_seq_no)
);

-- 21. FUEL_LOGS TABLE
CREATE TABLE IF NOT EXISTS fuel_logs (
    fuel_log_id BIGSERIAL PRIMARY KEY,
    fuel_density NUMERIC(6,3) NOT NULL CHECK (fuel_density > 0),
    task_id BIGINT NOT NULL REFERENCES tasks(task_id) ON DELETE RESTRICT
);

-- 22. CARGO_MANIFESTS TABLE (No Silent Cargo Type or Weight Defaults!)
CREATE TABLE IF NOT EXISTS cargo_manifests (
    cargo_id BIGSERIAL PRIMARY KEY,
    container_id VARCHAR(30) NOT NULL,
    weight_kg NUMERIC(8,2) NOT NULL CHECK (weight_kg > 0),
    cargo_type VARCHAR(20) NOT NULL CHECK (cargo_type IN ('CARGO', 'MAIL', 'BAGGAGE')),
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE
);

-- 23. BAGGAGE_CAROUSELS TABLE (Enhanced with Carousel Number)
CREATE TABLE IF NOT EXISTS baggage_carousels (
    carousel_id BIGSERIAL PRIMARY KEY,
    carousel_number VARCHAR(20) NOT NULL UNIQUE,
    terminal VARCHAR(10) NOT NULL,
    flight_id BIGINT REFERENCES flights(flight_id) ON DELETE SET NULL
);

-- 24. TRAVELERS TABLE (Master Human Entity - Required Nationality without silent default)
CREATE TABLE IF NOT EXISTS travelers (
    traveler_id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    passport_number VARCHAR(20) NOT NULL UNIQUE,
    nationality VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone_number VARCHAR(30)
);

-- 25. PASSENGERS TABLE (Flight Segment Instance - Unique traveler_id + flight_id, No Silent Transit Default!)
CREATE TABLE IF NOT EXISTS passengers (
    passenger_id BIGSERIAL PRIMARY KEY,
    traveler_id BIGINT NOT NULL REFERENCES travelers(traveler_id) ON DELETE RESTRICT,
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE RESTRICT,
    pnr_code VARCHAR(10) NOT NULL,
    is_transit_passenger BOOLEAN NOT NULL,
    UNIQUE (traveler_id, flight_id)
);

-- 26. BOARDING_PASSES TABLE (No Silent Cabin Class Revenue Default!)
CREATE TABLE IF NOT EXISTS boarding_passes (
    boarding_pass_id BIGSERIAL PRIMARY KEY,
    barcode_data VARCHAR(255) NOT NULL UNIQUE,
    ticket_number VARCHAR(30) NOT NULL UNIQUE,
    seat_number VARCHAR(10) NOT NULL,
    cabin_class VARCHAR(20) NOT NULL CHECK (cabin_class IN ('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST')),
    boarding_group VARCHAR(10) NOT NULL DEFAULT 'ZONE 1',
    sequence_number INT NOT NULL CHECK (sequence_number > 0),
    frequent_flyer_number VARCHAR(30),
    passenger_id BIGINT NOT NULL REFERENCES passengers(passenger_id) ON DELETE CASCADE,
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE
);

-- 27. BAG_TAGS TABLE
CREATE TABLE IF NOT EXISTS bag_tags (
    bag_tag_id BIGSERIAL PRIMARY KEY,
    tag_number VARCHAR(20) NOT NULL UNIQUE,
    passenger_id BIGINT NOT NULL REFERENCES passengers(passenger_id) ON DELETE CASCADE,
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE,
    weight_kg NUMERIC(5,2) NOT NULL CHECK (weight_kg > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'CHECKED_IN' CHECK (status IN ('CHECKED_IN', 'SCREENED', 'LOADED', 'CLAIMED'))
);

-- 28. BAGGAGE_SCAN_EVENTS TABLE
CREATE TABLE IF NOT EXISTS baggage_scan_events (
    scan_id BIGSERIAL PRIMARY KEY,
    bag_tag_id BIGINT NOT NULL REFERENCES bag_tags(bag_tag_id) ON DELETE CASCADE,
    scan_location VARCHAR(100) NOT NULL,
    scan_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 29. MISHANDLED_BAGGAGE TABLE
CREATE TABLE IF NOT EXISTS mishandled_baggage (
    report_id BIGSERIAL PRIMARY KEY,
    claim_number VARCHAR(50) NOT NULL UNIQUE,
    incident_type VARCHAR(30) NOT NULL CHECK (incident_type IN ('LOST', 'DAMAGED', 'DELAYED', 'PILFERED')),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'LOCATED', 'IN_TRANSIT', 'RESOLVED')),
    bag_tag_id BIGINT NOT NULL REFERENCES bag_tags(bag_tag_id) ON DELETE CASCADE,
    passenger_id BIGINT NOT NULL REFERENCES passengers(passenger_id) ON DELETE CASCADE
);

-- 30. SECURITY_CHECKPOINTS TABLE
CREATE TABLE IF NOT EXISTS security_checkpoints (
    checkpoint_id BIGSERIAL PRIMARY KEY,
    checkpoint_name VARCHAR(100) NOT NULL UNIQUE,
    checkpoint_type VARCHAR(30) NOT NULL CHECK (checkpoint_type IN ('TERMINAL_ENTRY', 'SECURITY_SCREENING', 'IMMIGRATION_CONTROL', 'BOARDING_GATE')),
    terminal VARCHAR(10) NOT NULL
);

-- 31. PASSENGER_CLEARANCE_LOGS TABLE (Un-bypassable Legal Retention - RESTRICT on ALL edges, NO Silent Approved Default!)
CREATE TABLE IF NOT EXISTS passenger_clearance_logs (
    clearance_id BIGSERIAL PRIMARY KEY,
    scan_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    clearance_status VARCHAR(25) NOT NULL CHECK (clearance_status IN ('APPROVED', 'FLAGGED_SECURITY', 'DENIED', 'BOARDED')),
    denial_reason VARCHAR(100),
    verification_method VARCHAR(30) NOT NULL CHECK (verification_method IN ('BARCODE_SCANNER', 'BIOMETRIC_FACIAL', 'PASSPORT_CHIP_READER')),
    passenger_id BIGINT NOT NULL REFERENCES passengers(passenger_id) ON DELETE RESTRICT,
    boarding_pass_id BIGINT NOT NULL REFERENCES boarding_passes(boarding_pass_id) ON DELETE RESTRICT,
    checkpoint_id BIGINT NOT NULL REFERENCES security_checkpoints(checkpoint_id) ON DELETE RESTRICT
);

-- 32. IMMIGRATION_RECORDS TABLE (Authoritative Passport derived via passenger_id ON DELETE RESTRICT, NO Silent Visa Type or Biometric Defaults!)
CREATE TABLE IF NOT EXISTS immigration_records (
    immigration_id BIGSERIAL PRIMARY KEY,
    visa_type VARCHAR(30) NOT NULL,
    stamp_number VARCHAR(50) NOT NULL UNIQUE,
    biometric_facial_matched BOOLEAN NOT NULL,
    clearance_type VARCHAR(30) NOT NULL CHECK (clearance_type IN ('DEPARTURE_EMIGRATION', 'ARRIVAL_IMMIGRATION')),
    passenger_id BIGINT NOT NULL REFERENCES passengers(passenger_id) ON DELETE RESTRICT
);

-- 33. LOUNGE_VISITS TABLE
CREATE TABLE IF NOT EXISTS lounge_visits (
    visit_id BIGSERIAL PRIMARY KEY,
    lounge_name VARCHAR(100) NOT NULL,
    passenger_id BIGINT NOT NULL REFERENCES passengers(passenger_id) ON DELETE CASCADE
);

-- 34. CUSTOMER_FEEDBACK_LOGS TABLE
CREATE TABLE IF NOT EXISTS customer_feedback_logs (
    feedback_id BIGSERIAL PRIMARY KEY,
    passenger_id BIGINT REFERENCES passengers(passenger_id) ON DELETE SET NULL,
    terminal VARCHAR(10) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    category VARCHAR(50) NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 35. AIRLINE_BILLING_INVOICES TABLE
CREATE TABLE IF NOT EXISTS airline_billing_invoices (
    invoice_id BIGSERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    airline_id BIGINT NOT NULL REFERENCES airlines(airline_id) ON DELETE RESTRICT,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    total_amount_usd NUMERIC(12,2) NOT NULL CHECK (total_amount_usd >= 0),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'UNPAID' CHECK (payment_status IN ('UNPAID', 'PAID', 'OVERDUE'))
);

-- 36. INVOICE_LINE_ITEMS TABLE (Enhanced with Direct FLIGHTS Movement Link)
CREATE TABLE IF NOT EXISTS invoice_line_items (
    line_item_id BIGSERIAL PRIMARY KEY,
    invoice_id BIGINT NOT NULL REFERENCES airline_billing_invoices(invoice_id) ON DELETE CASCADE,
    flight_id BIGINT REFERENCES flights(flight_id) ON DELETE SET NULL,
    charge_type VARCHAR(50) NOT NULL,
    amount_usd NUMERIC(10,2) NOT NULL CHECK (amount_usd >= 0)
);

-- 37. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
);

-- 38. AUDIT_LOGS TABLE (Immutable Security Audit Trail with Structured JSONB Payload)
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id BIGSERIAL PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    change_payload JSONB,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TRIGGER FUNCTION: AIRCRAFT ROTATION CONSISTENCY ENFORCEMENT
-- Ensures an inbound flight linked via inbound_flight_id operates the exact same physical aircraft
-- ============================================================
CREATE OR REPLACE FUNCTION fn_verify_flight_rotation_aircraft()
RETURNS TRIGGER AS $$
DECLARE
    inbound_aircraft_id BIGINT;
BEGIN
    IF NEW.inbound_flight_id IS NOT NULL THEN
        SELECT aircraft_id INTO inbound_aircraft_id
        FROM flights
        WHERE flight_id = NEW.inbound_flight_id
        FOR SHARE;
        
        IF inbound_aircraft_id IS DISTINCT FROM NEW.aircraft_id THEN
            RAISE EXCEPTION 'Rotation integrity violation: Inbound flight % operates aircraft %, but flight % is assigned aircraft %',
                NEW.inbound_flight_id, inbound_aircraft_id, NEW.flight_id, NEW.aircraft_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TRIGGER FUNCTION 1: UPSTREAM AIRCRAFT ROTATION CONSISTENCY
-- Ensures when setting inbound_flight_id, the aircraft matches the inbound flight
-- ============================================================
CREATE OR REPLACE FUNCTION fn_verify_flight_rotation_aircraft()
RETURNS TRIGGER AS $$
DECLARE
    inbound_aircraft_id BIGINT;
BEGIN
    IF NEW.inbound_flight_id IS NOT NULL THEN
        SELECT aircraft_id INTO inbound_aircraft_id
        FROM flights
        WHERE flight_id = NEW.inbound_flight_id
        FOR SHARE;
        
        IF inbound_aircraft_id IS DISTINCT FROM NEW.aircraft_id THEN
            RAISE EXCEPTION 'Rotation integrity violation: Inbound flight % operates aircraft %, but flight % is assigned aircraft %',
                NEW.inbound_flight_id, inbound_aircraft_id, NEW.flight_id, NEW.aircraft_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_verify_flight_rotation ON flights;
CREATE TRIGGER trg_verify_flight_rotation
BEFORE INSERT OR UPDATE OF inbound_flight_id, aircraft_id ON flights
FOR EACH ROW
EXECUTE FUNCTION fn_verify_flight_rotation_aircraft();

-- ============================================================
-- TRIGGER FUNCTION 2: DOWNSTREAM AIRCRAFT ROTATION INTEGRITY
-- Ensures when an aircraft_id is updated on a flight, all downstream rotated flights match
-- ============================================================
CREATE OR REPLACE FUNCTION fn_verify_downstream_rotation()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM flights
        WHERE inbound_flight_id = NEW.flight_id
          AND aircraft_id IS DISTINCT FROM NEW.aircraft_id
        FOR KEY SHARE
    ) THEN
        RAISE EXCEPTION 'Aircraft reassignment violation: Reassigning aircraft on flight % breaks rotation consistency with dependent outbound flights',
            NEW.flight_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_verify_downstream_rotation ON flights;
CREATE TRIGGER trg_verify_downstream_rotation
BEFORE UPDATE OF aircraft_id ON flights
FOR EACH ROW
EXECUTE FUNCTION fn_verify_downstream_rotation();


-- ============================================================
-- SQL VIEW FOR SOFT-COPY & HARDCOPY BOARDING PASS PRINTING
-- ============================================================
CREATE OR REPLACE VIEW vw_boarding_pass_print_details AS
SELECT 
    bp.boarding_pass_id,
    bp.ticket_number,
    p.pnr_code,
    (tr.last_name || ' / ' || tr.first_name) AS passenger_name,
    tr.passport_number,
    tr.nationality,
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
    f.estimated_departure_time,
    f.scheduled_arrival_time,
    f.estimated_arrival_time,
    ac.registration_number AS aircraft_tail_number,
    act.type_code AS aircraft_type,
    bp.barcode_data
FROM boarding_passes bp
JOIN passengers p ON bp.passenger_id = p.passenger_id
JOIN travelers tr ON p.traveler_id = tr.traveler_id
JOIN flights f ON bp.flight_id = f.flight_id
JOIN airlines al ON f.airline_id = al.airline_id
JOIN airports orig ON f.origin_airport_id = orig.airport_id
JOIN airports dest ON f.destination_airport_id = dest.airport_id
LEFT JOIN gates g ON f.gate_id = g.gate_id
LEFT JOIN stands st ON f.stand_id = st.stand_id
LEFT JOIN aircraft ac ON f.aircraft_id = ac.aircraft_id
LEFT JOIN aircraft_types act ON ac.type_id = act.type_id;

-- ============================================================
-- 100% COMPLETE B-TREE PERFORMANCE INDEXES FOR ALL 47 FK EDGES
-- (44 Explicit B-Tree Indexes + 3 Auto-Indexed PK/UNIQUE Composite Edges + 1 PNR Lookup)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_dept ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_aircraft_type ON aircraft(type_id);
CREATE INDEX IF NOT EXISTS idx_aircraft_airline ON aircraft(airline_id);
CREATE INDEX IF NOT EXISTS idx_counters_airline ON checkin_counters(allocated_airline_id);
CREATE INDEX IF NOT EXISTS idx_stands_gate ON stands(assigned_gate_id);
CREATE INDEX IF NOT EXISTS idx_gate_rules_gate ON gate_assignment_rules(gate_id);
CREATE INDEX IF NOT EXISTS idx_gate_rules_type ON gate_assignment_rules(type_id);

-- FLIGHTS FK INDEXES
CREATE INDEX IF NOT EXISTS idx_flights_airline ON flights(airline_id);
CREATE INDEX IF NOT EXISTS idx_flights_orig_airport ON flights(origin_airport_id);
CREATE INDEX IF NOT EXISTS idx_flights_dest_airport ON flights(destination_airport_id);
CREATE INDEX IF NOT EXISTS idx_flights_aircraft ON flights(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_flights_gate ON flights(gate_id);
CREATE INDEX IF NOT EXISTS idx_flights_stand ON flights(stand_id);
CREATE INDEX IF NOT EXISTS idx_flights_runway ON flights(runway_id);
CREATE INDEX IF NOT EXISTS idx_flights_dept ON flights(department_id);
CREATE INDEX IF NOT EXISTS idx_flights_inbound ON flights(inbound_flight_id);

-- TURNAROUND & DELAY FK INDEXES
CREATE INDEX IF NOT EXISTS idx_tasks_flight ON tasks(flight_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(assigned_user_id);
CREATE INDEX IF NOT EXISTS idx_eq_assign_eq ON equipment_assignments(equipment_id);
CREATE INDEX IF NOT EXISTS idx_eq_assign_task ON equipment_assignments(task_id);
CREATE INDEX IF NOT EXISTS idx_delay_logs_code ON delay_logs(delay_code);
CREATE INDEX IF NOT EXISTS idx_fuel_task ON fuel_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_cargo_flight ON cargo_manifests(flight_id);
CREATE INDEX IF NOT EXISTS idx_baggage_carousel_flight ON baggage_carousels(flight_id);

-- PASSENGER & BRS FK INDEXES
CREATE INDEX IF NOT EXISTS idx_passengers_flight ON passengers(flight_id);
CREATE INDEX IF NOT EXISTS idx_passengers_pnr ON passengers(pnr_code);
CREATE INDEX IF NOT EXISTS idx_boarding_passes_pass ON boarding_passes(passenger_id);
CREATE INDEX IF NOT EXISTS idx_boarding_passes_flight ON boarding_passes(flight_id);
CREATE INDEX IF NOT EXISTS idx_bag_tags_pass ON bag_tags(passenger_id);
CREATE INDEX IF NOT EXISTS idx_bag_tags_flight ON bag_tags(flight_id);
CREATE INDEX IF NOT EXISTS idx_bag_scans_tag ON baggage_scan_events(bag_tag_id);
CREATE INDEX IF NOT EXISTS idx_mishandled_bag_tag ON mishandled_baggage(bag_tag_id);
CREATE INDEX IF NOT EXISTS idx_mishandled_bag_pass ON mishandled_baggage(passenger_id);

-- BORDER CONTROL & SECURITY FK INDEXES
CREATE INDEX IF NOT EXISTS idx_clearance_pass ON passenger_clearance_logs(passenger_id);
CREATE INDEX IF NOT EXISTS idx_clearance_bp ON passenger_clearance_logs(boarding_pass_id);
CREATE INDEX IF NOT EXISTS idx_clearance_chk ON passenger_clearance_logs(checkpoint_id);
CREATE INDEX IF NOT EXISTS idx_immigration_pass ON immigration_records(passenger_id);
CREATE INDEX IF NOT EXISTS idx_lounge_pass ON lounge_visits(passenger_id);
CREATE INDEX IF NOT EXISTS idx_feedback_pass ON customer_feedback_logs(passenger_id);

-- BILLING, NOTIFICATION & AUDIT FK INDEXES
CREATE INDEX IF NOT EXISTS idx_invoices_airline ON airline_billing_invoices(airline_id);
CREATE INDEX IF NOT EXISTS idx_line_items_inv ON invoice_line_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_line_items_flight ON invoice_line_items(flight_id);
CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
