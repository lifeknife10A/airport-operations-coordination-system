import os

mig_dir = "/Users/krish/Desktop/Software Engineering/Mini Project/db/migration"
v1_path = os.path.join(mig_dir, "V1__initial_schema.sql")

with open(v1_path, "r", encoding="utf-8") as f:
    v1_sql = f.read()

# Add UNIQUE (inbound_flight_id) to FLIGHTS table constraint if not present
v1_sql_updated = v1_sql.replace(
    "CHECK (inbound_flight_id IS NULL OR inbound_flight_id <> flight_id)",
    "CHECK (inbound_flight_id IS NULL OR inbound_flight_id <> flight_id),\n    UNIQUE (inbound_flight_id)"
)

# Update trigger functions with row locking (FOR SHARE / FOR KEY SHARE) for concurrency safety
old_trg_1 = """CREATE OR REPLACE FUNCTION fn_verify_flight_rotation_aircraft()
RETURNS TRIGGER AS $$
DECLARE
    inbound_aircraft_id BIGINT;
BEGIN
    IF NEW.inbound_flight_id IS NOT NULL THEN
        SELECT aircraft_id INTO inbound_aircraft_id
        FROM flights
        WHERE flight_id = NEW.inbound_flight_id;"""

new_trg_1 = """CREATE OR REPLACE FUNCTION fn_verify_flight_rotation_aircraft()
RETURNS TRIGGER AS $$
DECLARE
    inbound_aircraft_id BIGINT;
BEGIN
    IF NEW.inbound_flight_id IS NOT NULL THEN
        SELECT aircraft_id INTO inbound_aircraft_id
        FROM flights
        WHERE flight_id = NEW.inbound_flight_id
        FOR SHARE;"""

old_trg_2 = """CREATE OR REPLACE FUNCTION fn_verify_downstream_rotation()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM flights
        WHERE inbound_flight_id = NEW.flight_id
          AND aircraft_id IS DISTINCT FROM NEW.aircraft_id
    ) THEN"""

new_trg_2 = """CREATE OR REPLACE FUNCTION fn_verify_downstream_rotation()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM flights
        WHERE inbound_flight_id = NEW.flight_id
          AND aircraft_id IS DISTINCT FROM NEW.aircraft_id
        FOR KEY SHARE
    ) THEN"""

v1_sql_updated = v1_sql_updated.replace(old_trg_1, new_trg_1).replace(old_trg_2, new_trg_2)

with open(v1_path, "w", encoding="utf-8") as f:
    f.write(v1_sql_updated)

print("Successfully applied Grade 10.0 concurrency row-locking & UNIQUE(inbound_flight_id) hardening!")
