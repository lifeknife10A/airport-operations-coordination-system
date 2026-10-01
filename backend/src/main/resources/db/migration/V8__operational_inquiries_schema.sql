-- V8: Table #40 Operational Inquiries Schema (Public Helpdesk & Support Desk)
CREATE TABLE IF NOT EXISTS operational_inquiries (
    inquiry_id BIGSERIAL PRIMARY KEY,
    ticket_number VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email_address VARCHAR(150) NOT NULL,
    phone_number VARCHAR(30),
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'GENERAL_PASSENGER_ASSISTANCE', 'FLIGHT_SCHEDULE_STATUS', 
        'LOST_PROPERTY_BAGGAGE', 'CARGO_CUSTOMS', 'VIP_PROTOCOL', 
        'ACCESSIBILITY_SPECIAL_ASSISTANCE', 'SECURITY_SAFETY', 'OTHER'
    )),
    inquiry_details TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'URGENT', 'CRITICAL')),
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN' CHECK (status IN (
        'OPEN', 'ASSIGNED', 'UNDER_INVESTIGATION', 'RESOLVED', 'CLOSED'
    )),
    source_channel VARCHAR(30) NOT NULL DEFAULT 'WEB_PORTAL' CHECK (source_channel IN (
        'WEB_PORTAL', 'INFORMATION_DESK', 'PHONE_HELPLINE', 'EMAIL_DIRECT'
    )),
    assigned_department VARCHAR(50),
    
    -- Relational Links
    assigned_staff_user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    linked_flight_id BIGINT REFERENCES flights(flight_id) ON DELETE SET NULL,
    linked_traveler_id BIGINT REFERENCES travelers(traveler_id) ON DELETE SET NULL,
    
    -- Resolution Metadata
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_inq_ticket_number ON operational_inquiries(ticket_number);
CREATE INDEX IF NOT EXISTS idx_inq_status_cat ON operational_inquiries(status, category);
CREATE INDEX IF NOT EXISTS idx_inq_email ON operational_inquiries(email_address);
CREATE INDEX IF NOT EXISTS idx_inq_created_at ON operational_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inq_staff ON operational_inquiries(assigned_staff_user_id);
