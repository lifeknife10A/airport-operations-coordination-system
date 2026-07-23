-- ============================================================
-- AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
-- Flyway Migration V2: Add Specialized Role Tables
-- ============================================================

-- 1. RUNWAYS TABLE (AOCC Control)
CREATE TABLE runways (
    runway_id BIGSERIAL PRIMARY KEY,
    runway_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., '09R/27L', '14/32'
    length_meters INTEGER NOT NULL,
    status VARCHAR(30) DEFAULT 'ACTIVE', -- 'ACTIVE', 'MAINTENANCE', 'CLOSED'
    current_slot_flight_id BIGINT REFERENCES flights(flight_id) ON DELETE SET NULL
);

-- Add foreign key constraint to flights table for assigned runway
ALTER TABLE flights ADD COLUMN assigned_runway_id BIGINT REFERENCES runways(runway_id) ON DELETE SET NULL;

-- 2. FUEL_LOGS TABLE (Refueling Tech & Pilot)
CREATE TABLE fuel_logs (
    fuel_log_id BIGSERIAL PRIMARY KEY,
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE,
    target_fuel_kg DECIMAL(10,2) NOT NULL,
    current_fuel_kg DECIMAL(10,2) NOT NULL,
    fuel_density DECIMAL(5,4) NOT NULL, -- e.g., 0.8000 kg/L
    liters_pumped DECIMAL(10,2) NOT NULL,
    refueler_user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    pilot_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ
);

-- 3. CARGO_MANIFESTS TABLE (Cargo Specialist)
CREATE TABLE cargo_manifests (
    cargo_id BIGSERIAL PRIMARY KEY,
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE,
    container_id VARCHAR(50) NOT NULL,
    pallet_weight_kg DECIMAL(10,2) NOT NULL,
    hazmat_flag BOOLEAN DEFAULT FALSE,
    loaded_by_user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    status VARCHAR(30) DEFAULT 'LOADED'
);

-- 4. PASSENGERS TABLE (Boarding Gate & PRM Assistant)
CREATE TABLE passengers (
    passenger_id BIGSERIAL PRIMARY KEY,
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE,
    passport_number VARCHAR(50) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    boarding_status VARCHAR(30) DEFAULT 'CHECKED_IN', -- 'CHECKED_IN', 'BOARDED', 'NO_SHOW'
    prm_assistance_required BOOLEAN DEFAULT FALSE
);

-- 5. LOUNGE_VISITS TABLE (Executive Lounge Supervisor)
CREATE TABLE lounge_visits (
    visit_id BIGSERIAL PRIMARY KEY,
    passenger_id BIGINT NOT NULL REFERENCES passengers(passenger_id) ON DELETE CASCADE,
    lounge_name VARCHAR(100) NOT NULL,
    entry_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    exit_time TIMESTAMPTZ,
    scanned_by_user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL
);

-- 6. BAGGAGE_CAROUSELS TABLE (Baggage Reclaim Agent)
CREATE TABLE baggage_carousels (
    carousel_id BIGSERIAL PRIMARY KEY,
    carousel_number VARCHAR(20) UNIQUE NOT NULL, -- e.g., 'Carousel 1', 'Carousel 2'
    terminal VARCHAR(20) NOT NULL,
    assigned_flight_id BIGINT REFERENCES flights(flight_id) ON DELETE SET NULL,
    status VARCHAR(30) DEFAULT 'AVAILABLE' -- 'AVAILABLE', 'ACTIVE_OFFLOAD', 'MAINTENANCE'
);

-- INDEXES FOR NEW SPECIALIZED TABLES
CREATE INDEX idx_runways_status ON runways(status);
CREATE INDEX idx_fuel_logs_flight ON fuel_logs(flight_id);
CREATE INDEX idx_cargo_manifests_flight ON cargo_manifests(flight_id);
CREATE INDEX idx_passengers_flight ON passengers(flight_id);
CREATE INDEX idx_lounge_visits_passenger ON lounge_visits(passenger_id);
CREATE INDEX idx_carousels_flight ON baggage_carousels(assigned_flight_id);
