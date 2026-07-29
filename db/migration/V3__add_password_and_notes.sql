-- ============================================================
-- AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
-- Flyway V3 Migration: Add Password Hash & Task Notes
-- ============================================================

-- 1. Add password_hash column to users table with a BCrypt hashed default password ('password')
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) DEFAULT '$2a$10$e8w617u.S92a4m6Z9mZ8ve0A/x9Bv6g5C8g5C8g5C8g5C8g5C8g5C';

-- Update all existing seed users with BCrypt hash for 'password123'
UPDATE users SET password_hash = '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xD0D1bPHZ3OmyI.6' WHERE password_hash IS NULL OR password_hash LIKE '$2a$10$e8w617u%';

-- 2. Add notes column to tasks table for ground crew logging
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS notes TEXT;
