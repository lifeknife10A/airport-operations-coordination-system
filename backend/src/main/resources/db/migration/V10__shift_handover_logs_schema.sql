-- V10: Table #41 Shift Handover Logs Schema (Operational Changeover Logbook)
CREATE TABLE IF NOT EXISTS shift_handover_logs (
    handover_id BIGSERIAL PRIMARY KEY,
    shift_code VARCHAR(20) NOT NULL CHECK (shift_code IN ('MORNING_06_14', 'AFTERNOON_14_22', 'NIGHT_22_06')),
    department_id BIGINT NOT NULL REFERENCES departments(department_id) ON DELETE RESTRICT,
    outgoing_supervisor_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    incoming_supervisor_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    
    -- Operational Summary Metrics
    total_flights_handled INT NOT NULL DEFAULT 0,
    delayed_flights_count INT NOT NULL DEFAULT 0,
    average_turnaround_minutes NUMERIC(5,2) NOT NULL DEFAULT 45.00,
    ground_incidents_count INT NOT NULL DEFAULT 0,
    
    -- Narrative Log Sections
    critical_events_summary TEXT NOT NULL,
    unresolved_equipment_issues TEXT,
    pending_flight_watches TEXT,
    safety_weather_advisories TEXT,
    
    -- Verification & Digital Sign-off
    outgoing_signoff_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    incoming_signoff_timestamp TIMESTAMPTZ,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_ACKNOWLEDGEMENT' CHECK (status IN (
        'DRAFT', 'PENDING_ACKNOWLEDGEMENT', 'ACKNOWLEDGED_ACTIVE', 'ARCHIVED'
    )),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_handover_dept ON shift_handover_logs(department_id);
CREATE INDEX IF NOT EXISTS idx_handover_shift ON shift_handover_logs(shift_code, outgoing_signoff_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_handover_status ON shift_handover_logs(status);
