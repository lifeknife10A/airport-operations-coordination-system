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

-- 5. AIRCRAFT TABLE
CREATE TABLE IF NOT EXISTS aircraft (
    aircraft_id BIGSERIAL PRIMARY KEY,
    registration_number VARCHAR(20) NOT NULL UNIQUE
);

-- 6. GATES TABLE
CREATE TABLE IF NOT EXISTS gates (
    gate_id BIGSERIAL PRIMARY KEY,
    gate_number VARCHAR(10) NOT NULL UNIQUE
);

-- 7. RUNWAYS TABLE
CREATE TABLE IF NOT EXISTS runways (
    runway_id BIGSERIAL PRIMARY KEY,
    runway_code VARCHAR(10) NOT NULL UNIQUE
);

-- 8. FLIGHTS TABLE (Enhanced with Origin/Destination & Boarding/Departure Timestamps for FIDS TV Display)
CREATE TABLE IF NOT EXISTS flights (
    flight_id BIGSERIAL PRIMARY KEY,
    flight_number VARCHAR(10) NOT NULL,
    flight_status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED' CHECK (flight_status IN ('SCHEDULED', 'BOARDING', 'AIRBORNE', 'LANDED', 'DELAYED', 'CANCELLED')),
    flight_type VARCHAR(15) NOT NULL DEFAULT 'DEPARTURE' CHECK (flight_type IN ('DEPARTURE', 'ARRIVAL')),
    origin_airport VARCHAR(10) NOT NULL DEFAULT 'DEL',
    destination_airport VARCHAR(10) NOT NULL DEFAULT 'BOM',
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

-- 9. TASKS TABLE
CREATE TABLE IF NOT EXISTS tasks (
    task_id BIGSERIAL PRIMARY KEY,
    task_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED')),
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE,
    assigned_user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL
);

-- 10. DELAY_LOGS TABLE (Weak Entity)
CREATE TABLE IF NOT EXISTS delay_logs (
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE,
    delay_seq_no INT NOT NULL CHECK (delay_seq_no > 0),
    delay_minutes INT NOT NULL CHECK (delay_minutes >= 0),
    PRIMARY KEY (flight_id, delay_seq_no)
);

-- 11. FUEL_LOGS TABLE
CREATE TABLE IF NOT EXISTS fuel_logs (
    fuel_log_id BIGSERIAL PRIMARY KEY,
    fuel_density NUMERIC(6,3) NOT NULL CHECK (fuel_density > 0),
    task_id BIGINT NOT NULL REFERENCES tasks(task_id) ON DELETE RESTRICT
);

-- 12. CARGO_MANIFESTS TABLE
CREATE TABLE IF NOT EXISTS cargo_manifests (
    cargo_id BIGSERIAL PRIMARY KEY,
    container_id VARCHAR(30) NOT NULL,
    fuel_log_id BIGINT NOT NULL REFERENCES fuel_logs(fuel_log_id) ON DELETE RESTRICT
);

-- 13. BAGGAGE_CAROUSELS TABLE
CREATE TABLE IF NOT EXISTS baggage_carousels (
    carousel_id BIGSERIAL PRIMARY KEY,
    terminal VARCHAR(10) NOT NULL,
    flight_id BIGINT REFERENCES flights(flight_id) ON DELETE SET NULL
);

-- 14. PASSENGERS TABLE
CREATE TABLE IF NOT EXISTS passengers (
    passenger_id BIGSERIAL PRIMARY KEY,
    passport_number VARCHAR(20) NOT NULL UNIQUE,
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE RESTRICT
);

-- 15. LOUNGE_VISITS TABLE
CREATE TABLE IF NOT EXISTS lounge_visits (
    visit_id BIGSERIAL PRIMARY KEY,
    lounge_name VARCHAR(100) NOT NULL,
    passenger_id BIGINT NOT NULL REFERENCES passengers(passenger_id) ON DELETE CASCADE
);

-- 16. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
);

-- 17. AUDIT_LOGS TABLE (Immutable Security Trail - Legal Compliance)
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id BIGSERIAL PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE & FIDS SEARCHES
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_dept ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_flights_aircraft ON flights(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_flights_gate ON flights(gate_id);
CREATE INDEX IF NOT EXISTS idx_flights_runway ON flights(runway_id);
CREATE INDEX IF NOT EXISTS idx_flights_airports ON flights(origin_airport, destination_airport);
CREATE INDEX IF NOT EXISTS idx_flights_status ON flights(flight_status, flight_type);
CREATE INDEX IF NOT EXISTS idx_tasks_flight ON tasks(flight_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(assigned_user_id);
CREATE INDEX IF NOT EXISTS idx_passengers_flight ON passengers(flight_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
