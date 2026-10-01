-- V14: Auth Sessions (real session tracking + logout revocation + single-session-per-user)
-- Previously the app issued a stateless JWT with no server-side record of it: logout only
-- cleared localStorage on the client, the token itself stayed valid until its 24h expiry, and
-- the same account could be logged in on unlimited tabs/devices at once. This table gives every
-- login a real, revocable session row; JwtAuthFilter checks it on every request.
CREATE TABLE IF NOT EXISTS auth_sessions (
    session_id UUID PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    revoked_reason VARCHAR(30)
);

-- Fast "does this user already have an active session" lookup for single-session enforcement.
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_active ON auth_sessions(user_id) WHERE revoked_at IS NULL;
