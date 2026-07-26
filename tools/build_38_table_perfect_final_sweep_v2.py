import os

mig_dir = "/Users/krish/Desktop/Software Engineering/Mini Project/db/migration"
v1_path = os.path.join(mig_dir, "V1__initial_schema.sql")
v2_path = os.path.join(mig_dir, "V2__seed_data.sql")

# Read V2 and replace flight 2's aircraft assignment so inbound_flight_id = 1 shares aircraft_id = 1
with open(v2_path, "r", encoding="utf-8") as f:
    v2_content = f.read()

# Make sure all flights with inbound_flight_id use the same aircraft_id as inbound_flight_id
# We can dynamically fix V2__seed_data.sql by updating FLIGHTS inserts where inbound_flight_id is present.
# In seed data, let's fix flight 2, 4, 6, 8 etc. so they match the aircraft_id of their inbound flight.
# Or simpler: regenerate seed data properly in Python!

v2_fixed = v2_content.replace(
    "INSERT INTO flights (flight_id, flight_number, flight_status, flight_type, origin_airport_id, destination_airport_id, airline_id, scheduled_departure_time, estimated_departure_time, actual_departure_time, scheduled_arrival_time, estimated_arrival_time, actual_arrival_time, boarding_time, aircraft_id, gate_id, stand_id, runway_id, department_id, inbound_flight_id) VALUES\n(2, 'BA202', 'SCHEDULED', 'DEPARTURE', 1, 3, 2, '2026-07-27 10:00:00+00', '2026-07-27 10:05:00+00', NULL, '2026-07-27 18:00:00+00', '2026-07-27 18:05:00+00', NULL, '2026-07-27 09:15:00+00', 2, 2, 2, 2, 1, 1)",
    "INSERT INTO flights (flight_id, flight_number, flight_status, flight_type, origin_airport_id, destination_airport_id, airline_id, scheduled_departure_time, estimated_departure_time, actual_departure_time, scheduled_arrival_time, estimated_arrival_time, actual_arrival_time, boarding_time, aircraft_id, gate_id, stand_id, runway_id, department_id, inbound_flight_id) VALUES\n(2, 'BA202', 'SCHEDULED', 'DEPARTURE', 1, 3, 2, '2026-07-27 10:00:00+00', '2026-07-27 10:05:00+00', NULL, '2026-07-27 18:00:00+00', '2026-07-27 18:05:00+00', NULL, '2026-07-27 09:15:00+00', 1, 2, 2, 2, 1, 1)"
).replace(
    "VALUES (2, 'BA202', 'SCHEDULED', 'DEPARTURE', 1, 3, 2, '2026-07-27 10:00:00+00', '2026-07-27 10:05:00+00', NULL, '2026-07-27 18:00:00+00', '2026-07-27 18:05:00+00', NULL, '2026-07-27 09:15:00+00', 2, 2, 2, 2, 1, 1)",
    "VALUES (2, 'BA202', 'SCHEDULED', 'DEPARTURE', 1, 3, 2, '2026-07-27 10:00:00+00', '2026-07-27 10:05:00+00', NULL, '2026-07-27 18:00:00+00', '2026-07-27 18:05:00+00', NULL, '2026-07-27 09:15:00+00', 1, 2, 2, 2, 1, 1)"
)

# Let's fix any pattern where aircraft_id doesn't match inbound_flight_id in V2
import re

def fix_flights_rotation(match):
    full = match.group(0)
    # Extract values
    # (id, num, status, type, orig, dest, airline, dep_s, dep_e, dep_a, arr_s, arr_e, arr_a, board, aircraft, gate, stand, runway, dept, inbound)
    parts = full.split(',')
    if len(parts) >= 20:
        inbound_str = parts[19].strip().rstrip(');').rstrip(')')
        if inbound_str != 'NULL':
            try:
                inbound_id = int(inbound_str)
                # set aircraft_id to inbound_id for simplicity in seed data
                parts[14] = f" {inbound_id}"
                return ','.join(parts)
            except ValueError:
                pass
    return full

fixed_v2 = re.sub(r'\(\d+,\s*\'[^\']+\',\s*\'[^\']+\',\s*\'[^\']+\',\s*\d+,\s*\d+,\s*\d+,\s*\'[^\']+\',\s*(?:\'[^\']+\'|NULL),\s*(?:\'[^\']+\'|NULL),\s*\'[^\']+\',\s*(?:\'[^\']+\'|NULL),\s*(?:\'[^\']+\'|NULL),\s*(?:\'[^\']+\'|NULL),\s*\d+,\s*(?:\d+|NULL),\s*(?:\d+|NULL),\s*(?:\d+|NULL),\s*(?:\d+|NULL),\s*(?:\d+|NULL)\)', fix_flights_rotation, v2_content)

with open(v2_path, "w", encoding="utf-8") as f:
    f.write(fixed_v2)

print("Successfully fixed V2 seed data rotation aircraft alignment!")
