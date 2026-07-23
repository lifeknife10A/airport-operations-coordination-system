-- ============================================================
-- AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
-- Flyway Migration V1: Initial Database Schema
-- ============================================================

-- 1. ROLES TABLE
CREATE TABLE roles (
    role_id BIGSERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

-- 2. DEPARTMENTS TABLE
CREATE TABLE departments (
    department_id BIGSERIAL PRIMARY KEY,
    department_name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255),
    contact_number VARCHAR(20)
);

-- 3. USERS TABLE
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role_id BIGINT NOT NULL REFERENCES roles(role_id) ON DELETE RESTRICT,
    department_id BIGINT REFERENCES departments(department_id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. AIRCRAFT TABLE
CREATE TABLE aircraft (
    aircraft_id BIGSERIAL PRIMARY KEY,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    model VARCHAR(50) NOT NULL,
    passenger_capacity INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL
);

-- 5. GATES TABLE
CREATE TABLE gates (
    gate_id BIGSERIAL PRIMARY KEY,
    gate_number VARCHAR(10) UNIQUE NOT NULL,
    terminal VARCHAR(20) NOT NULL,
    max_aircraft_size VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL
);

-- 6. FLIGHTS TABLE
CREATE TABLE flights (
    flight_id BIGSERIAL PRIMARY KEY,
    flight_number VARCHAR(20) NOT NULL,
    airline_name VARCHAR(100) NOT NULL,
    origin VARCHAR(10) NOT NULL,
    destination VARCHAR(10) NOT NULL,
    scheduled_arrival TIMESTAMPTZ NOT NULL,
    scheduled_departure TIMESTAMPTZ NOT NULL,
    actual_arrival TIMESTAMPTZ,
    actual_departure TIMESTAMPTZ,
    aircraft_id BIGINT NOT NULL REFERENCES aircraft(aircraft_id) ON DELETE RESTRICT,
    assigned_gate_id BIGINT REFERENCES gates(gate_id) ON DELETE SET NULL,
    flight_status VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. TASKS TABLE
CREATE TABLE tasks (
    task_id BIGSERIAL PRIMARY KEY,
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE,
    department_id BIGINT NOT NULL REFERENCES departments(department_id) ON DELETE RESTRICT,
    assigned_to_user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    task_name VARCHAR(100) NOT NULL,
    priority VARCHAR(20) DEFAULT 'NORMAL',
    status VARCHAR(30) DEFAULT 'PENDING',
    planned_start TIMESTAMPTZ NOT NULL,
    planned_end TIMESTAMPTZ NOT NULL,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    notes TEXT
);

-- 8. DELAY_LOGS TABLE
CREATE TABLE delay_logs (
    delay_id BIGSERIAL PRIMARY KEY,
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE,
    task_id BIGINT REFERENCES tasks(task_id) ON DELETE SET NULL,
    reason_category VARCHAR(50) NOT NULL,
    delay_minutes INTEGER NOT NULL,
    explanation TEXT NOT NULL,
    logged_by_user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    logged_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    recipient_user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. AUDIT_LOGS TABLE
CREATE TABLE audit_logs (
    log_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(50) NOT NULL,
    target_id BIGINT,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);

-- INDEXES FOR PERFORMANCE OPTIMIZATION
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_flights_aircraft ON flights(aircraft_id);
CREATE INDEX idx_flights_gate ON flights(assigned_gate_id);
CREATE INDEX idx_tasks_flight ON tasks(flight_id);
CREATE INDEX idx_tasks_department ON tasks(department_id);
CREATE INDEX idx_tasks_assigned_user ON tasks(assigned_to_user_id);
CREATE INDEX idx_delay_logs_flight ON delay_logs(flight_id);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_user_id);
