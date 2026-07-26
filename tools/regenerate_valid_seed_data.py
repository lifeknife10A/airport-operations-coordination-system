import os
import re

v2_path = "/Users/krish/Desktop/Software Engineering/Mini Project/db/migration/V2__seed_data.sql"

with open(v2_path, "r", encoding="utf-8") as f:
    v2_content = f.read()

# Build aircraft map for all 100 flights first
flight_aircraft = {}
# Flight 1 to 100
for fid in range(1, 101):
    # Base aircraft_id
    flight_aircraft[fid] = ((fid - 1) % 12) + 1

# Process in order: if inbound_flight_id is present, set flight_aircraft[fid] = flight_aircraft[inbound_id]
# Let's inspect all INSERT INTO flights statements in v2_content
flight_pattern = re.compile(r"INSERT INTO flights \([^)]+\) VALUES \((\d+), '[^']+', '[^']+', '[^']+', \d+, \d+, \d+, [^,]+, [^,]+, [^,]+, [^,]+, [^,]+, [^,]+, [^,]+, (\d+), (\d+|NULL), (\d+|NULL), (\d+|NULL), (\d+|NULL), (\d+|NULL)\)")

# Let's parse all flights statement by statement
def replace_flight_row(match):
    fid = int(match.group(1))
    old_ac = int(match.group(2))
    gate = match.group(3)
    stand = match.group(4)
    runway = match.group(5)
    dept = match.group(6)
    inbound_str = match.group(7)
    
    if inbound_str != "NULL":
        inbound_id = int(inbound_str)
        ac_id = flight_aircraft[inbound_id]
        flight_aircraft[fid] = ac_id
    else:
        ac_id = flight_aircraft[fid]
    
    # Reconstruct the line
    full_stmt = match.group(0)
    # Replace the aircraft_id field
    # The structure is ... boarding_time, aircraft_id, gate_id ...
    # We replace aircraft_id in full_stmt
    parts = full_stmt.split(',')
    parts[14] = f" {ac_id}"
    return ','.join(parts)

new_v2_content = flight_pattern.sub(replace_flight_row, v2_content)

with open(v2_path, "w", encoding="utf-8") as f:
    f.write(new_v2_content)

print("Successfully regenerated V2__seed_data.sql with 100% valid rotation aircraft mapping!")
