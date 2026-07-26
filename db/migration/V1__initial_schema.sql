-- ============================================================
-- AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
-- PostgreSQL 18 Initial Database Schema (Flyway V1 Migration)
-- Author: Krishna Solanki & AOCS Engineering Team
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

-- 5. AIRLINES TABLE (Aviation Carrier Master)
CREATE TABLE IF NOT EXISTS airlines (
    airline_id BIGSERIAL PRIMARY KEY,
    iata_code VARCHAR(10) NOT NULL UNIQUE,
    icao_code VARCHAR(10) NOT NULL UNIQUE,
    airline_name VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL
);

-- 6. AIRPORTS TABLE (Global Airport Directory Master)
CREATE TABLE IF NOT EXISTS airports (
    airport_id BIGSERIAL PRIMARY KEY,
    iata_code VARCHAR(10) NOT NULL UNIQUE,
    icao_code VARCHAR(10) NOT NULL UNIQUE,
    airport_name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC'
);

-- 7. AIRCRAFT TABLE
CREATE TABLE IF NOT EXISTS aircraft (
    aircraft_id BIGSERIAL PRIMARY KEY,
    registration_number VARCHAR(20) NOT NULL UNIQUE,
    airline_id BIGINT NOT NULL REFERENCES airlines(airline_id) ON DELETE RESTRICT
);

-- 8. GATES TABLE
CREATE TABLE IF NOT EXISTS gates (
    gate_id BIGSERIAL PRIMARY KEY,
    gate_number VARCHAR(10) NOT NULL UNIQUE
);

-- 9. RUNWAYS TABLE
CREATE TABLE IF NOT EXISTS runways (
    runway_id BIGSERIAL PRIMARY KEY,
    runway_code VARCHAR(10) NOT NULL UNIQUE
);

-- 10. WEATHER_REPORTS TABLE (Airside METAR Observations)
CREATE TABLE IF NOT EXISTS weather_reports (
    report_id BIGSERIAL PRIMARY KEY,
    visibility_meters INT NOT NULL CHECK (visibility_meters >= 0),
    wind_speed_knots INT NOT NULL CHECK (wind_speed_knots >= 0),
    temperature_celsius NUMERIC(4,1) NOT NULL,
    runway_condition VARCHAR(20) NOT NULL DEFAULT 'DRY' CHECK (runway_condition IN ('DRY', 'WET', 'FOG', 'HEAVY_RAIN')),
    observation_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. GATE_ASSIGNMENT_RULES TABLE (Aircraft Size & Capacity Constraints)
CREATE TABLE IF NOT EXISTS gate_assignment_rules (
    rule_id BIGSERIAL PRIMARY KEY,
    gate_id BIGINT NOT NULL REFERENCES gates(gate_id) ON DELETE CASCADE,
    max_wingspan_meters NUMERIC(5,2) NOT NULL CHECK (max_wingspan_meters > 0),
    max_weight_mtow_kg NUMERIC(10,2) NOT NULL CHECK (max_weight_mtow_kg > 0),
    compatible_aircraft_type VARCHAR(50) NOT NULL
);

-- 12. FLIGHTS TABLE (Enhanced with Foreign Keys to Airlines & Airports)
CREATE TABLE IF NOT EXISTS flights (
    flight_id BIGSERIAL PRIMARY KEY,
    flight_number VARCHAR(10) NOT NULL,
    flight_status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED' CHECK (flight_status IN ('SCHEDULED', 'BOARDING', 'AIRBORNE', 'LANDED', 'DELAYED', 'CANCELLED')),
    flight_type VARCHAR(15) NOT NULL DEFAULT 'DEPARTURE' CHECK (flight_type IN ('DEPARTURE', 'ARRIVAL')),
    origin_airport_id BIGINT NOT NULL REFERENCES airports(airport_id) ON DELETE RESTRICT,
    destination_airport_id BIGINT NOT NULL REFERENCES airports(airport_id) ON DELETE RESTRICT,
    airline_id BIGINT NOT NULL REFERENCES airlines(airline_id) ON DELETE RESTRICT,
    scheduled_departure_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actual_departure_time TIMESTAMPTZ,
    scheduled_arrival_time TIMESTAMPTZ NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '2 hours'),
    actual_arrival_time TIMESTAMPTZ,
    boarding_time TIMESTAMPTZ,
    aircraft_id BIGINT NOT NULL REFERENCES aircraft(aircraft_id) ON DELETE RESTRICT,
    gate_id BIGINT REFERENCES gates(gate_id) ON DELETE SET NULL,
    runway_id BIGINT REFERENCES runways(runway_id) ON DELETE SET NULL,
    department_id BIGINT REFERENCES departments(department_id) ON DELETE SET NULL
);

-- 13. GROUND_EQUIPMENT TABLE (Apron Fleet Vehicles)
CREATE TABLE IF NOT EXISTS ground_equipment (
    equipment_id BIGSERIAL PRIMARY KEY,
    equipment_code VARCHAR(20) NOT NULL UNIQUE,
    equipment_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'IN_USE', 'MAINTENANCE'))
);

-- 14. TASKS TABLE
CREATE TABLE IF NOT EXISTS tasks (
    task_id BIGSERIAL PRIMARY KEY,
    task_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED')),
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE,
    assigned_user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL
);

-- 15. EQUIPMENT_ASSIGNMENTS TABLE (Vehicle to Task Allocation)
CREATE TABLE IF NOT EXISTS equipment_assignments (
    assignment_id BIGSERIAL PRIMARY KEY,
    equipment_id BIGINT NOT NULL REFERENCES ground_equipment(equipment_id) ON DELETE CASCADE,
    task_id BIGINT NOT NULL REFERENCES tasks(task_id) ON DELETE CASCADE,
    assigned_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    released_timestamp TIMESTAMPTZ
);

-- 16. DELAY_LOGS TABLE (Weak Entity)
CREATE TABLE IF NOT EXISTS delay_logs (
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE,
    delay_seq_no INT NOT NULL CHECK (delay_seq_no > 0),
    delay_minutes INT NOT NULL CHECK (delay_minutes >= 0),
    PRIMARY KEY (flight_id, delay_seq_no)
);

-- 17. FUEL_LOGS TABLE
CREATE TABLE IF NOT EXISTS fuel_logs (
    fuel_log_id BIGSERIAL PRIMARY KEY,
    fuel_density NUMERIC(6,3) NOT NULL CHECK (fuel_density > 0),
    task_id BIGINT NOT NULL REFERENCES tasks(task_id) ON DELETE RESTRICT
);

-- 18. CARGO_MANIFESTS TABLE
CREATE TABLE IF NOT EXISTS cargo_manifests (
    cargo_id BIGSERIAL PRIMARY KEY,
    container_id VARCHAR(30) NOT NULL,
    fuel_log_id BIGINT NOT NULL REFERENCES fuel_logs(fuel_log_id) ON DELETE RESTRICT
);

-- 19. BAGGAGE_CAROUSELS TABLE
CREATE TABLE IF NOT EXISTS baggage_carousels (
    carousel_id BIGSERIAL PRIMARY KEY,
    terminal VARCHAR(10) NOT NULL,
    flight_id BIGINT REFERENCES flights(flight_id) ON DELETE SET NULL
);

-- 20. PASSENGERS TABLE
CREATE TABLE IF NOT EXISTS passengers (
    passenger_id BIGSERIAL PRIMARY KEY,
    passport_number VARCHAR(20) NOT NULL UNIQUE,
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE RESTRICT
);

-- 21. BOARDING_PASSES TABLE
CREATE TABLE IF NOT EXISTS boarding_passes (
    boarding_pass_id BIGSERIAL PRIMARY KEY,
    barcode_data VARCHAR(100) NOT NULL UNIQUE,
    seat_number VARCHAR(10) NOT NULL,
    cabin_class VARCHAR(20) NOT NULL DEFAULT 'ECONOMY' CHECK (cabin_class IN ('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST')),
    passenger_id BIGINT NOT NULL REFERENCES passengers(passenger_id) ON DELETE CASCADE,
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE
);

-- 22. BAG_TAGS TABLE (Baggage Reconciliation System BRS)
CREATE TABLE IF NOT EXISTS bag_tags (
    bag_tag_id BIGSERIAL PRIMARY KEY,
    tag_number VARCHAR(20) NOT NULL UNIQUE,
    passenger_id BIGINT NOT NULL REFERENCES passengers(passenger_id) ON DELETE CASCADE,
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE,
    weight_kg NUMERIC(5,2) NOT NULL CHECK (weight_kg > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'CHECKED_IN' CHECK (status IN ('CHECKED_IN', 'SCREENED', 'LOADED', 'CLAIMED'))
);

-- 23. BAGGAGE_SCAN_EVENTS TABLE (RFID / Barcode Scan History)
CREATE TABLE IF NOT EXISTS baggage_scan_events (
    scan_id BIGSERIAL PRIMARY KEY,
    bag_tag_id BIGINT NOT NULL REFERENCES bag_tags(bag_tag_id) ON DELETE CASCADE,
    scan_location VARCHAR(100) NOT NULL,
    scan_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 24. SECURITY_CHECKPOINTS TABLE
CREATE TABLE IF NOT EXISTS security_checkpoints (
    checkpoint_id BIGSERIAL PRIMARY KEY,
    checkpoint_name VARCHAR(100) NOT NULL UNIQUE,
    checkpoint_type VARCHAR(30) NOT NULL CHECK (checkpoint_type IN ('TERMINAL_ENTRY', 'SECURITY_SCREENING', 'IMMIGRATION_CONTROL', 'BOARDING_GATE')),
    terminal VARCHAR(10) NOT NULL
);

-- 25. PASSENGER_CLEARANCE_LOGS TABLE
CREATE TABLE IF NOT EXISTS passenger_clearance_logs (
    clearance_id BIGSERIAL PRIMARY KEY,
    scan_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    clearance_status VARCHAR(25) NOT NULL DEFAULT 'APPROVED' CHECK (clearance_status IN ('APPROVED', 'FLAGGED_SECURITY', 'DENIED', 'BOARDED')),
    verification_method VARCHAR(30) NOT NULL CHECK (verification_method IN ('BARCODE_SCANNER', 'BIOMETRIC_FACIAL', 'PASSPORT_CHIP_READER')),
    passenger_id BIGINT NOT NULL REFERENCES passengers(passenger_id) ON DELETE CASCADE,
    boarding_pass_id BIGINT NOT NULL REFERENCES boarding_passes(boarding_pass_id) ON DELETE CASCADE,
    checkpoint_id BIGINT NOT NULL REFERENCES security_checkpoints(checkpoint_id) ON DELETE RESTRICT
);

-- 26. IMMIGRATION_RECORDS TABLE
CREATE TABLE IF NOT EXISTS immigration_records (
    immigration_id BIGSERIAL PRIMARY KEY,
    passport_number VARCHAR(20) NOT NULL,
    visa_type VARCHAR(30) NOT NULL DEFAULT 'TOURIST_VISA',
    stamp_number VARCHAR(50) NOT NULL UNIQUE,
    biometric_facial_matched BOOLEAN NOT NULL DEFAULT TRUE,
    clearance_type VARCHAR(30) NOT NULL CHECK (clearance_type IN ('DEPARTURE_EMIGRATION', 'ARRIVAL_IMMIGRATION')),
    passenger_id BIGINT NOT NULL REFERENCES passengers(passenger_id) ON DELETE CASCADE
);

-- 27. LOUNGE_VISITS TABLE
CREATE TABLE IF NOT EXISTS lounge_visits (
    visit_id BIGSERIAL PRIMARY KEY,
    lounge_name VARCHAR(100) NOT NULL,
    passenger_id BIGINT NOT NULL REFERENCES passengers(passenger_id) ON DELETE CASCADE
);

-- 28. CUSTOMER_FEEDBACK_LOGS TABLE (Passenger Terminal Feedback Kiosks)
CREATE TABLE IF NOT EXISTS customer_feedback_logs (
    feedback_id BIGSERIAL PRIMARY KEY,
    passenger_id BIGINT REFERENCES passengers(passenger_id) ON DELETE SET NULL,
    terminal VARCHAR(10) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    category VARCHAR(50) NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 29. AIRLINE_BILLING_INVOICES TABLE (Aeronautical Revenue Invoices)
CREATE TABLE IF NOT EXISTS airline_billing_invoices (
    invoice_id BIGSERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    airline_id BIGINT NOT NULL REFERENCES airlines(airline_id) ON DELETE RESTRICT,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    total_amount_usd NUMERIC(12,2) NOT NULL CHECK (total_amount_usd >= 0),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'UNPAID' CHECK (payment_status IN ('UNPAID', 'PAID', 'OVERDUE'))
);

-- 30. INVOICE_LINE_ITEMS TABLE (Itemized Charges)
CREATE TABLE IF NOT EXISTS invoice_line_items (
    line_item_id BIGSERIAL PRIMARY KEY,
    invoice_id BIGINT NOT NULL REFERENCES airline_billing_invoices(invoice_id) ON DELETE CASCADE,
    charge_type VARCHAR(50) NOT NULL,
    amount_usd NUMERIC(10,2) NOT NULL CHECK (amount_usd >= 0)
);

-- 31. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
);

-- 32. AUDIT_LOGS TABLE (Immutable Security Trail - Legal Compliance)
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id BIGSERIAL PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_dept ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_aircraft_airline ON aircraft(airline_id);
CREATE INDEX IF NOT EXISTS idx_flights_airline ON flights(airline_id);
CREATE INDEX IF NOT EXISTS idx_flights_airports ON flights(origin_airport_id, destination_airport_id);
CREATE INDEX IF NOT EXISTS idx_tasks_flight ON tasks(flight_id);
CREATE INDEX IF NOT EXISTS idx_passengers_flight ON passengers(flight_id);
CREATE INDEX IF NOT EXISTS idx_bag_tags_pass ON bag_tags(passenger_id);
CREATE INDEX IF NOT EXISTS idx_invoices_airline ON airline_billing_invoices(airline_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
