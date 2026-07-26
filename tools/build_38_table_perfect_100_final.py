import os

mig_dir = "/Users/krish/Desktop/Software Engineering/Mini Project/db/migration"
v1_path = os.path.join(mig_dir, "V1__initial_schema.sql")

with open(v1_path, "r", encoding="utf-8") as f:
    v1_sql = f.read()

# Replace deferrable triggers with deferrable + FOR SHARE / FOR KEY SHARE locking
old_deferrable_block = """-- ============================================================
-- CONSTRAINT TRIGGER 1: UPSTREAM AIRCRAFT ROTATION CONSISTENCY (DEFERRABLE INITIALLY DEFERRED)
-- Validates at transaction commit that aircraft matches inbound flight
-- ============================================================
CREATE OR REPLACE FUNCTION fn_verify_flight_rotation_aircraft()
RETURNS TRIGGER AS $$
DECLARE
    inbound_aircraft_id BIGINT;
BEGIN
    IF NEW.inbound_flight_id IS NOT NULL THEN
        SELECT aircraft_id INTO inbound_aircraft_id
        FROM flights
        WHERE flight_id = NEW.inbound_flight_id;
        
        IF inbound_aircraft_id IS DISTINCT FROM NEW.aircraft_id THEN
            RAISE EXCEPTION 'Rotation integrity violation: Inbound flight % operates aircraft %, but flight % is assigned aircraft %',
                NEW.inbound_flight_id, inbound_aircraft_id, NEW.flight_id, NEW.aircraft_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_verify_flight_rotation ON flights;
CREATE CONSTRAINT TRIGGER trg_verify_flight_rotation
AFTER INSERT OR UPDATE OF inbound_flight_id, aircraft_id ON flights
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION fn_verify_flight_rotation_aircraft();

-- ============================================================
-- CONSTRAINT TRIGGER 2: DOWNSTREAM AIRCRAFT ROTATION INTEGRITY (DEFERRABLE INITIALLY DEFERRED)
-- Validates at transaction commit that all downstream rotated outbound flights match new aircraft
-- ============================================================
CREATE OR REPLACE FUNCTION fn_verify_downstream_rotation()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM flights
        WHERE inbound_flight_id = NEW.flight_id
          AND aircraft_id IS DISTINCT FROM NEW.aircraft_id
    ) THEN
        RAISE EXCEPTION 'Aircraft reassignment violation: Reassigning aircraft on flight % breaks rotation consistency with dependent outbound flights',
            NEW.flight_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_verify_downstream_rotation ON flights;
CREATE CONSTRAINT TRIGGER trg_verify_downstream_rotation
AFTER UPDATE OF aircraft_id ON flights
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION fn_verify_downstream_rotation();"""

new_deferrable_locked_block = """-- ============================================================
-- CONSTRAINT TRIGGER 1: UPSTREAM AIRCRAFT ROTATION CONSISTENCY (DEFERRABLE + ROW LOCKING)
-- Validates at transaction commit that aircraft matches inbound flight with FOR SHARE row lock
-- ============================================================
CREATE OR REPLACE FUNCTION fn_verify_flight_rotation_aircraft()
RETURNS TRIGGER AS $$
DECLARE
    inbound_aircraft_id BIGINT;
BEGIN
    IF NEW.inbound_flight_id IS NOT NULL THEN
        SELECT aircraft_id INTO inbound_aircraft_id
        FROM flights
        WHERE flight_id = NEW.inbound_flight_id
        FOR SHARE;
        
        IF inbound_aircraft_id IS DISTINCT FROM NEW.aircraft_id THEN
            RAISE EXCEPTION 'Rotation integrity violation: Inbound flight % operates aircraft %, but flight % is assigned aircraft %',
                NEW.inbound_flight_id, inbound_aircraft_id, NEW.flight_id, NEW.aircraft_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_verify_flight_rotation ON flights;
CREATE CONSTRAINT TRIGGER trg_verify_flight_rotation
AFTER INSERT OR UPDATE OF inbound_flight_id, aircraft_id ON flights
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION fn_verify_flight_rotation_aircraft();

-- ============================================================
-- CONSTRAINT TRIGGER 2: DOWNSTREAM AIRCRAFT ROTATION INTEGRITY (DEFERRABLE + KEY SHARE LOCKING)
-- Validates at transaction commit that all downstream rotated outbound flights match new aircraft with FOR KEY SHARE row lock
-- ============================================================
CREATE OR REPLACE FUNCTION fn_verify_downstream_rotation()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM flights
        WHERE inbound_flight_id = NEW.flight_id
          AND aircraft_id IS DISTINCT FROM NEW.aircraft_id
        FOR KEY SHARE
    ) THEN
        RAISE EXCEPTION 'Aircraft reassignment violation: Reassigning aircraft on flight % breaks rotation consistency with dependent outbound flights',
            NEW.flight_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_verify_downstream_rotation ON flights;
CREATE CONSTRAINT TRIGGER trg_verify_downstream_rotation
AFTER UPDATE OF aircraft_id ON flights
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION fn_verify_downstream_rotation();"""

v1_sql_updated = v1_sql.replace(old_deferrable_block, new_deferrable_locked_block)

with open(v1_path, "w", encoding="utf-8") as f:
    f.write(v1_sql_updated)

print("Successfully combined DEFERRABLE CONSTRAINT TRIGGERS with FOR SHARE / FOR KEY SHARE row locking!")
