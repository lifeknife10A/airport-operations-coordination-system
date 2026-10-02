-- V18: make account suspension real.
--
-- PUT /api/users/{id}/status used to validate the request and report success while changing
-- nothing, because users had no status column. Adding it (everyone starts ACTIVE) lets the
-- application actually store a suspension; login and every authenticated request now check it.
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE users ADD CONSTRAINT chk_users_status CHECK (status IN ('ACTIVE', 'SUSPENDED'));
