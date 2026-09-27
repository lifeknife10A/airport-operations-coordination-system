-- ============================================================
-- AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
-- PostgreSQL 18 Database Migration (Flyway V4 Migration)
-- 39th Table: Lost & Found Central Bureau Subsystem
-- ============================================================

CREATE TABLE IF NOT EXISTS lost_and_found_items (
    item_id BIGSERIAL PRIMARY KEY,
    reference_code VARCHAR(30) NOT NULL UNIQUE,
    item_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (
        category IN ('ELECTRONICS', 'BAGGAGE', 'DOCUMENTS', 'CLOTHING', 'JEWELRY', 'VALUABLES', 'KEYS', 'OTHER')
    ),
    color_and_description TEXT NOT NULL,
    found_location_type VARCHAR(50) NOT NULL CHECK (
        found_location_type IN ('SECURITY_CHECKPOINT', 'GATE_SEATING', 'DUTY_FREE', 'AIRCRAFT_CABIN', 'BAGGAGE_RECLAIM', 'CONCOURSE', 'RESTROOM', 'LOUNGE', 'OTHER')
    ),
    found_location_detail VARCHAR(150) NOT NULL,
    terminal_id INTEGER NOT NULL CHECK (terminal_id IN (1, 2)),
    flight_id BIGINT REFERENCES flights(flight_id) ON DELETE SET NULL,
    checkpoint_id BIGINT REFERENCES security_checkpoints(checkpoint_id) ON DELETE SET NULL,
    storage_vault_location VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'REPORTED' CHECK (
        status IN ('REPORTED', 'LOGGED_SECURITY_INTAKE', 'ITEM_LOCATED_VAULTED', 'READY_FOR_COLLECTION', 'CLAIMED_RETURNED', 'DISPOSED_AUCTIONED', 'TRANSFERRED_POLICE')
    ),
    finder_type VARCHAR(50) NOT NULL CHECK (
        finder_type IN ('PASSENGER', 'SECURITY_OFFICER', 'CABIN_CLEANER', 'GATE_AGENT', 'GROUND_HANDLER', 'DUTY_FREE_STAFF')
    ),
    logged_by_user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    claimant_traveler_id BIGINT REFERENCES travelers(traveler_id) ON DELETE SET NULL,
    claimant_name VARCHAR(100),
    claimant_contact_email VARCHAR(100),
    claimant_contact_phone VARCHAR(30),
    claim_verification_notes TEXT,
    claimed_timestamp TIMESTAMP WITH TIME ZONE,
    released_by_user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL
);

-- Performance & Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_lf_ref_code ON lost_and_found_items(reference_code);
CREATE INDEX IF NOT EXISTS idx_lf_status_cat ON lost_and_found_items(status, category);
CREATE INDEX IF NOT EXISTS idx_lf_flight_id ON lost_and_found_items(flight_id);
CREATE INDEX IF NOT EXISTS idx_lf_created_at ON lost_and_found_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lf_logged_user ON lost_and_found_items(logged_by_user_id);
CREATE INDEX IF NOT EXISTS idx_lf_checkpoint ON lost_and_found_items(checkpoint_id);
