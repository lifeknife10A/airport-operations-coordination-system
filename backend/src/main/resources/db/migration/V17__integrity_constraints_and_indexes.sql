-- V17: constraints and indexes the application already assumes but the schema never enforced.
--
-- boarding_passes: nothing stopped two passes for one passenger or two passengers in one seat
-- (concurrent check-ins did exactly that, after which the single-result lookup by passenger threw
-- a 500 for good). The service now checks first and these make the database the final arbiter.
-- gate_assignment_rules: the seed had 200 duplicate (gate_id, type_id) pairs; keep the lowest
-- rule_id of each, then forbid new duplicates.
-- flights: status and scheduled-time filters back every dashboard board and the reports.

DELETE FROM gate_assignment_rules r
USING gate_assignment_rules keep
WHERE r.gate_id = keep.gate_id AND r.type_id = keep.type_id AND r.rule_id > keep.rule_id;

ALTER TABLE gate_assignment_rules ADD CONSTRAINT uq_gate_assignment_rules_gate_type UNIQUE (gate_id, type_id);

ALTER TABLE boarding_passes ADD CONSTRAINT uq_boarding_passes_passenger UNIQUE (passenger_id);
ALTER TABLE boarding_passes ADD CONSTRAINT uq_boarding_passes_flight_seat UNIQUE (flight_id, seat_number);
ALTER TABLE boarding_passes ADD CONSTRAINT uq_boarding_passes_flight_sequence UNIQUE (flight_id, sequence_number);

CREATE INDEX IF NOT EXISTS idx_flights_status ON flights (flight_status);
CREATE INDEX IF NOT EXISTS idx_flights_sched_departure ON flights (scheduled_departure_time);
