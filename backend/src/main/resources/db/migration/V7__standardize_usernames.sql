-- V7: Standardize Usernames to first.last enterprise naming
-- Converts legacy user_X_name usernames to standardized first.last handles
--
-- Originally two sequential UPDATEs: the first renamed every 'user_%' row to its bare
-- lower-case first.last form, the second suffixed any resulting duplicates. That first UPDATE
-- alone fails against this dataset -- several seeded users share the same name (e.g. two
-- "Chen Zhang"s), so renaming both to 'chen.zhang' in the same statement trips the
-- users_username_key unique constraint before the de-duplication pass ever runs (the constraint
-- is checked per-row as PostgreSQL writes each one, not once at the end of the UPDATE). Rewritten
-- below to compute the final, already-deduplicated username in a single pass instead, so no
-- intermediate duplicate value is ever written.
WITH renamed AS (
    SELECT user_id, LOWER(REGEXP_REPLACE(TRIM(name), '\s+', '.', 'g')) AS base_username
    FROM users
    WHERE username LIKE 'user_%'
),
numbered AS (
    SELECT user_id, base_username,
           ROW_NUMBER() OVER (PARTITION BY base_username ORDER BY user_id) AS rn
    FROM renamed
)
UPDATE users u
SET username = CASE WHEN n.rn = 1 THEN n.base_username ELSE n.base_username || (n.rn - 1)::text END
FROM numbered n
WHERE u.user_id = n.user_id;

-- Preserve root and special admin staff accounts
-- Note: Dual corporate email authentication (e.g. admin@saphire.in, aocc@saphire.in) is active
