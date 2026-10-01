-- V15: Fix flights.flight_status CHECK constraint to match entity/FlightStatus.java
--
-- V1__initial_schema.sql (as checked into this backend/src/main/resources/db/migration folder)
-- only allowed ('SCHEDULED','BOARDING','AIRBORNE','LANDED','DELAYED','CANCELLED') -- but
-- FlightStatus.java's state machine requires ON_BLOCK, SERVICING, READY, and DEPARTED too, and
-- FlightService.updateFlightStatus() routes every normal turnaround through them. Any fresh
-- database built from this migration folder (a new developer, CI, or a real deployment) would
-- reject those transitions with a DB constraint violation the moment a flight tried to progress
-- past LANDED.
--
-- Not a no-op on every database: this repo's own live dev DB already has the wider constraint
-- (its schema was baselined from elsewhere, not built fresh from V1 in this folder -- see
-- flyway_schema_history), so on THIS database the ALTER below just re-asserts what's already
-- true. On a genuinely fresh install it's the difference between working and broken.
ALTER TABLE flights DROP CONSTRAINT IF EXISTS flights_flight_status_check;

ALTER TABLE flights ADD CONSTRAINT flights_flight_status_check CHECK (
    flight_status IN (
        'SCHEDULED', 'LANDED', 'ON_BLOCK', 'SERVICING', 'READY',
        'BOARDING', 'AIRBORNE', 'DEPARTED', 'DELAYED', 'CANCELLED'
    )
);
