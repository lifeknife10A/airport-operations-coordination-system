-- V7: Standardize Usernames to first.last enterprise naming
-- Converts legacy user_X_name usernames to standardized first.last handles

-- 1. Standardize usernames to lowercase first.last
UPDATE users 
SET username = LOWER(REGEXP_REPLACE(TRIM(name), '\s+', '.', 'g'))
WHERE username LIKE 'user_%';

-- 2. Handle any duplicate name collisions cleanly with numeric suffix
WITH duplicates AS (
    SELECT user_id, username,
           ROW_NUMBER() OVER (PARTITION BY username ORDER BY user_id) AS rn
    FROM users
)
UPDATE users u
SET username = d.username || (d.rn - 1)::text
FROM duplicates d
WHERE u.user_id = d.user_id AND d.rn > 1;

-- 3. Preserve root and special admin staff accounts
-- Note: Dual corporate email authentication (e.g. admin@saphire.in, aocc@saphire.in) is active
