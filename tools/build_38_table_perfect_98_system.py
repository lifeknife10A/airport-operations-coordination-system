import os

mig_dir = "/Users/krish/Desktop/Software Engineering/Mini Project/db/migration"
v1_path = os.path.join(mig_dir, "V1__initial_schema.sql")

# Read current V1 schema
with open(v1_path, "r", encoding="utf-8") as f:
    v1_sql = f.read()

# Bidirectional trigger functions SQL
triggers_sql = """-- ============================================================
-- TRIGGER FUNCTION 1: UPSTREAM AIRCRAFT ROTATION CONSISTENCY
-- Ensures when setting inbound_flight_id, the aircraft matches the inbound flight
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
CREATE TRIGGER trg_verify_flight_rotation
BEFORE INSERT OR UPDATE OF inbound_flight_id, aircraft_id ON flights
FOR EACH ROW
EXECUTE FUNCTION fn_verify_flight_rotation_aircraft();

-- ============================================================
-- TRIGGER FUNCTION 2: DOWNSTREAM AIRCRAFT ROTATION INTEGRITY
-- Ensures when an aircraft_id is updated on a flight, all downstream rotated flights match
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
CREATE TRIGGER trg_verify_downstream_rotation
BEFORE UPDATE OF aircraft_id ON flights
FOR EACH ROW
EXECUTE FUNCTION fn_verify_downstream_rotation();
"""

# Replace the single trigger section with the full bidirectional trigger system
if "fn_verify_downstream_rotation" not in v1_sql:
    v1_sql_updated = v1_sql.replace(
        "DROP TRIGGER IF EXISTS trg_verify_flight_rotation ON flights;\nCREATE TRIGGER trg_verify_flight_rotation\nBEFORE INSERT OR UPDATE OF inbound_flight_id, aircraft_id ON flights\nFOR EACH ROW\nEXECUTE FUNCTION fn_verify_flight_rotation_aircraft();",
        triggers_sql
    )
    with open(v1_path, "w", encoding="utf-8") as f:
        f.write(v1_sql_updated)
    print("Successfully added bidirectional downstream rotation trigger to V1__initial_schema.sql!")
else:
    print("Downstream trigger already present in V1__initial_schema.sql.")
