-- Security incidents logged by officers at the Passenger Security desk. Until now the dashboard
-- kept these in browser memory only.
CREATE TABLE IF NOT EXISTS security_incidents (
    incident_id          BIGSERIAL PRIMARY KEY,
    title                VARCHAR(150) NOT NULL,
    location             VARCHAR(150) NOT NULL,
    severity             VARCHAR(10)  NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    status               VARCHAR(15)  NOT NULL DEFAULT 'INVESTIGATING'
                         CHECK (status IN ('INVESTIGATING', 'ESCALATED', 'RESOLVED')),
    description          TEXT,
    flight_id            BIGINT REFERENCES flights (flight_id),
    reported_by_user_id  BIGINT REFERENCES users (user_id),
    reported_at          TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at          TIMESTAMPTZ,
    resolved_by_user_id  BIGINT REFERENCES users (user_id)
);

CREATE INDEX IF NOT EXISTS idx_security_incidents_status_time
    ON security_incidents (status, reported_at DESC);
