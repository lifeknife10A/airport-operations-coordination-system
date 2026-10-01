-- ============================================================
-- AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
-- Flyway V4 Migration: Add Concourse Topology & Expanded Gate Records
-- ============================================================

-- 1. Add Concourse, Terminal, and Wingspan to Gates Table
ALTER TABLE gates ADD COLUMN IF NOT EXISTS concourse VARCHAR(30) DEFAULT 'Concourse A';
ALTER TABLE gates ADD COLUMN IF NOT EXISTS terminal VARCHAR(50) DEFAULT 'Central Terminal';
ALTER TABLE gates ADD COLUMN IF NOT EXISTS max_wingspan_meters NUMERIC(5,2) DEFAULT 42.0;

-- 2. Add Concourse and Terminal to Stands Table
ALTER TABLE stands ADD COLUMN IF NOT EXISTS concourse VARCHAR(30) DEFAULT 'Concourse A';
ALTER TABLE stands ADD COLUMN IF NOT EXISTS terminal VARCHAR(50) DEFAULT 'Central Terminal';

-- 3. Add Concourse to Checkin Counters Table
ALTER TABLE checkin_counters ADD COLUMN IF NOT EXISTS concourse VARCHAR(30) DEFAULT 'Concourse A';

-- V2's gate/stand seed rows insert explicit gate_id/stand_id values (1, 2, 3, ...) and never call
-- nextval(), so on a fresh database the gates_gate_id_seq/stands_stand_id_seq sequences are still
-- at their starting position by the time this migration runs. The implicit-ID inserts below would
-- then collide with gate_id/stand_id 1 (duplicate key on gates_pkey) -- this resync (the same
-- logic V13 applies globally, pulled forward here since V4 needs it before V13 ever runs) fixes
-- that before any insert below executes.
DO $$
DECLARE
    seq RECORD;
BEGIN
    FOR seq IN
        SELECT table_name, column_name, pg_get_serial_sequence(table_name, column_name) as seq_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name IN ('gates', 'stands')
          AND column_default LIKE 'nextval%'
    LOOP
        IF seq.seq_name IS NOT NULL THEN
            EXECUTE format('SELECT setval(%L, COALESCE((SELECT MAX(%I) FROM %I), 1) + 1)',
                           seq.seq_name, seq.column_name, seq.table_name);
        END IF;
    END LOOP;
END $$;

-- 4. Seed / Upsert Authoritative Gates for Concourses A, B, and C
-- Concourse A: Domestic Pier (A01 - A14)
INSERT INTO gates (gate_number, concourse, terminal, max_wingspan_meters) VALUES
  ('A01', 'Concourse A', 'Central Terminal', 65.0),
  ('A02', 'Concourse A', 'Central Terminal', 42.0),
  ('A03', 'Concourse A', 'Central Terminal', 42.0),
  ('A04', 'Concourse A', 'Central Terminal', 42.0),
  ('A05', 'Concourse A', 'Central Terminal', 38.0),
  ('A06', 'Concourse A', 'Central Terminal', 42.0),
  ('A07', 'Concourse A', 'Central Terminal', 42.0),
  ('A08', 'Concourse A', 'Central Terminal', 36.0),
  ('A09', 'Concourse A', 'Central Terminal', 42.0),
  ('A10', 'Concourse A', 'Central Terminal', 65.0),
  ('A11', 'Concourse A', 'Central Terminal', 36.0),
  ('A12', 'Concourse A', 'Central Terminal', 42.0),
  ('A13', 'Concourse A', 'Central Terminal', 42.0),
  ('A14', 'Concourse A', 'Central Terminal', 65.0)
ON CONFLICT (gate_number) DO UPDATE SET
  concourse = EXCLUDED.concourse,
  terminal = EXCLUDED.terminal,
  max_wingspan_meters = EXCLUDED.max_wingspan_meters;

-- Concourse B: Transcontinental Pier (B01 - B16)
INSERT INTO gates (gate_number, concourse, terminal, max_wingspan_meters) VALUES
  ('B01', 'Concourse B', 'Central Terminal', 65.0),
  ('B02', 'Concourse B', 'Central Terminal', 42.0),
  ('B03', 'Concourse B', 'Central Terminal', 42.0),
  ('B04', 'Concourse B', 'Central Terminal', 38.0),
  ('B05', 'Concourse B', 'Central Terminal', 42.0),
  ('B06', 'Concourse B', 'Central Terminal', 42.0),
  ('B07', 'Concourse B', 'Central Terminal', 65.0),
  ('B08', 'Concourse B', 'Central Terminal', 36.0),
  ('B09', 'Concourse B', 'Central Terminal', 42.0),
  ('B10', 'Concourse B', 'Central Terminal', 42.0),
  ('B11', 'Concourse B', 'Central Terminal', 36.0),
  ('B12', 'Concourse B', 'Central Terminal', 65.0),
  ('B13', 'Concourse B', 'Central Terminal', 42.0),
  ('B14', 'Concourse B', 'Central Terminal', 42.0),
  ('B15', 'Concourse B', 'Central Terminal', 65.0),
  ('B16', 'Concourse B', 'Central Terminal', 65.0)
ON CONFLICT (gate_number) DO UPDATE SET
  concourse = EXCLUDED.concourse,
  terminal = EXCLUDED.terminal,
  max_wingspan_meters = EXCLUDED.max_wingspan_meters;

-- Concourse C: Widebody Flagship Pier (C01 - C18)
INSERT INTO gates (gate_number, concourse, terminal, max_wingspan_meters) VALUES
  ('C01', 'Concourse C', 'Central Terminal', 80.0),
  ('C02', 'Concourse C', 'Central Terminal', 80.0),
  ('C03', 'Concourse C', 'Central Terminal', 68.0),
  ('C04', 'Concourse C', 'Central Terminal', 68.0),
  ('C05', 'Concourse C', 'Central Terminal', 80.0),
  ('C06', 'Concourse C', 'Central Terminal', 68.0),
  ('C07', 'Concourse C', 'Central Terminal', 80.0),
  ('C08', 'Concourse C', 'Central Terminal', 68.0),
  ('C09', 'Concourse C', 'Central Terminal', 65.0),
  ('C10', 'Concourse C', 'Central Terminal', 65.0),
  ('C11', 'Concourse C', 'Central Terminal', 80.0),
  ('C12', 'Concourse C', 'Central Terminal', 80.0),
  ('C13', 'Concourse C', 'Central Terminal', 68.0),
  ('C14', 'Concourse C', 'Central Terminal', 68.0),
  ('C15', 'Concourse C', 'Central Terminal', 80.0),
  ('C16', 'Concourse C', 'Central Terminal', 80.0),
  ('C17', 'Concourse C', 'Central Terminal', 65.0),
  ('C18', 'Concourse C', 'Central Terminal', 80.0)
ON CONFLICT (gate_number) DO UPDATE SET
  concourse = EXCLUDED.concourse,
  terminal = EXCLUDED.terminal,
  max_wingspan_meters = EXCLUDED.max_wingspan_meters;

-- 5. Seed / Upsert Corresponding Contact Stands for Concourses A, B, and C
-- Concourse A Stands (Stand G01 - G14)
INSERT INTO stands (stand_number, is_remote, has_jetbridge, concourse, terminal) VALUES
  ('Stand G01', FALSE, TRUE, 'Concourse A', 'Central Terminal'),
  ('Stand G02', FALSE, TRUE, 'Concourse A', 'Central Terminal'),
  ('Stand G03', FALSE, TRUE, 'Concourse A', 'Central Terminal'),
  ('Stand G04', FALSE, TRUE, 'Concourse A', 'Central Terminal'),
  ('Stand G05', FALSE, TRUE, 'Concourse A', 'Central Terminal'),
  ('Stand G06', FALSE, TRUE, 'Concourse A', 'Central Terminal'),
  ('Stand G07', FALSE, TRUE, 'Concourse A', 'Central Terminal'),
  ('Stand G08', FALSE, TRUE, 'Concourse A', 'Central Terminal'),
  ('Stand G09', FALSE, TRUE, 'Concourse A', 'Central Terminal'),
  ('Stand G10', FALSE, TRUE, 'Concourse A', 'Central Terminal'),
  ('Stand G11', FALSE, TRUE, 'Concourse A', 'Central Terminal'),
  ('Stand G12', FALSE, TRUE, 'Concourse A', 'Central Terminal'),
  ('Stand G13', TRUE, FALSE, 'Concourse A', 'Central Terminal'),
  ('Stand G14', TRUE, FALSE, 'Concourse A', 'Central Terminal')
ON CONFLICT (stand_number) DO UPDATE SET
  is_remote = EXCLUDED.is_remote,
  has_jetbridge = EXCLUDED.has_jetbridge,
  concourse = EXCLUDED.concourse,
  terminal = EXCLUDED.terminal;

-- Concourse B Stands (Stand G15 - G30)
INSERT INTO stands (stand_number, is_remote, has_jetbridge, concourse, terminal) VALUES
  ('Stand G15', FALSE, TRUE, 'Concourse B', 'Central Terminal'),
  ('Stand G16', FALSE, TRUE, 'Concourse B', 'Central Terminal'),
  ('Stand G17', FALSE, TRUE, 'Concourse B', 'Central Terminal'),
  ('Stand G18', FALSE, TRUE, 'Concourse B', 'Central Terminal'),
  ('Stand G19', FALSE, TRUE, 'Concourse B', 'Central Terminal'),
  ('Stand G20', FALSE, TRUE, 'Concourse B', 'Central Terminal'),
  ('Stand G21', FALSE, TRUE, 'Concourse B', 'Central Terminal'),
  ('Stand G22', FALSE, TRUE, 'Concourse B', 'Central Terminal'),
  ('Stand G23', TRUE, FALSE, 'Concourse B', 'Central Terminal'),
  ('Stand G24', FALSE, TRUE, 'Concourse B', 'Central Terminal'),
  ('Stand G25', FALSE, TRUE, 'Concourse B', 'Central Terminal'),
  ('Stand G26', FALSE, TRUE, 'Concourse B', 'Central Terminal'),
  ('Stand G27', TRUE, FALSE, 'Concourse B', 'Central Terminal'),
  ('Stand G28', FALSE, TRUE, 'Concourse B', 'Central Terminal'),
  ('Stand G29', FALSE, TRUE, 'Concourse B', 'Central Terminal'),
  ('Stand G30', FALSE, TRUE, 'Concourse B', 'Central Terminal')
ON CONFLICT (stand_number) DO UPDATE SET
  is_remote = EXCLUDED.is_remote,
  has_jetbridge = EXCLUDED.has_jetbridge,
  concourse = EXCLUDED.concourse,
  terminal = EXCLUDED.terminal;

-- Concourse C Stands (Stand G31 - G48: Dual-deck Aerobridges for Widebody Code F/E)
INSERT INTO stands (stand_number, is_remote, has_jetbridge, concourse, terminal) VALUES
  ('Stand G31', FALSE, TRUE, 'Concourse C', 'Central Terminal'),
  ('Stand G32', FALSE, TRUE, 'Concourse C', 'Central Terminal'),
  ('Stand G33', FALSE, TRUE, 'Concourse C', 'Central Terminal'),
  ('Stand G34', FALSE, TRUE, 'Concourse C', 'Central Terminal'),
  ('Stand G35', FALSE, TRUE, 'Concourse C', 'Central Terminal'),
  ('Stand G36', FALSE, TRUE, 'Concourse C', 'Central Terminal'),
  ('Stand G37', FALSE, TRUE, 'Concourse C', 'Central Terminal'),
  ('Stand G38', FALSE, TRUE, 'Concourse C', 'Central Terminal'),
  ('Stand G39', FALSE, TRUE, 'Concourse C', 'Central Terminal'),
  ('Stand G40', FALSE, TRUE, 'Concourse C', 'Central Terminal'),
  ('Stand G41', FALSE, TRUE, 'Concourse C', 'Central Terminal'),
  ('Stand G42', FALSE, TRUE, 'Concourse C', 'Central Terminal'),
  ('Stand G43', FALSE, TRUE, 'Concourse C', 'Central Terminal'),
  ('Stand G44', FALSE, TRUE, 'Concourse C', 'Central Terminal'),
  ('Stand G45', FALSE, TRUE, 'Concourse C', 'Central Terminal'),
  ('Stand G46', FALSE, TRUE, 'Concourse C', 'Central Terminal'),
  ('Stand G47', TRUE, FALSE, 'Concourse C', 'Central Terminal'),
  ('Stand G48', FALSE, TRUE, 'Concourse C', 'Central Terminal')
ON CONFLICT (stand_number) DO UPDATE SET
  is_remote = EXCLUDED.is_remote,
  has_jetbridge = EXCLUDED.has_jetbridge,
  concourse = EXCLUDED.concourse,
  terminal = EXCLUDED.terminal;

-- 6. Link Stands to Gates
UPDATE stands SET assigned_gate_id = g.gate_id FROM gates g WHERE g.gate_number = 'A01' AND stands.stand_number = 'Stand G01';
UPDATE stands SET assigned_gate_id = g.gate_id FROM gates g WHERE g.gate_number = 'A02' AND stands.stand_number = 'Stand G02';
UPDATE stands SET assigned_gate_id = g.gate_id FROM gates g WHERE g.gate_number = 'A03' AND stands.stand_number = 'Stand G03';
UPDATE stands SET assigned_gate_id = g.gate_id FROM gates g WHERE g.gate_number = 'A04' AND stands.stand_number = 'Stand G04';
UPDATE stands SET assigned_gate_id = g.gate_id FROM gates g WHERE g.gate_number = 'A07' AND stands.stand_number = 'Stand G07';
UPDATE stands SET assigned_gate_id = g.gate_id FROM gates g WHERE g.gate_number = 'A10' AND stands.stand_number = 'Stand G10';
UPDATE stands SET assigned_gate_id = g.gate_id FROM gates g WHERE g.gate_number = 'A12' AND stands.stand_number = 'Stand G12';
UPDATE stands SET assigned_gate_id = g.gate_id FROM gates g WHERE g.gate_number = 'B01' AND stands.stand_number = 'Stand G15';
UPDATE stands SET assigned_gate_id = g.gate_id FROM gates g WHERE g.gate_number = 'B03' AND stands.stand_number = 'Stand G17';
UPDATE stands SET assigned_gate_id = g.gate_id FROM gates g WHERE g.gate_number = 'B04' AND stands.stand_number = 'Stand G18';
UPDATE stands SET assigned_gate_id = g.gate_id FROM gates g WHERE g.gate_number = 'B06' AND stands.stand_number = 'Stand G20';
UPDATE stands SET assigned_gate_id = g.gate_id FROM gates g WHERE g.gate_number = 'C01' AND stands.stand_number = 'Stand G31';
UPDATE stands SET assigned_gate_id = g.gate_id FROM gates g WHERE g.gate_number = 'C05' AND stands.stand_number = 'Stand G35';
UPDATE stands SET assigned_gate_id = g.gate_id FROM gates g WHERE g.gate_number = 'C08' AND stands.stand_number = 'Stand G38';
UPDATE stands SET assigned_gate_id = g.gate_id FROM gates g WHERE g.gate_number = 'C11' AND stands.stand_number = 'Stand G41';
