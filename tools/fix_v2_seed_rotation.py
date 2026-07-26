import os
import re

v2_path = "/Users/krish/Desktop/Software Engineering/Mini Project/db/migration/V2__seed_data.sql"

with open(v2_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# First pass: map flight_id -> aircraft_id
flight_aircraft = {}
flight_line_indices = []

for idx, line in enumerate(lines):
    if "INSERT INTO flights" in line or line.strip().startswith("("):
        # check if it's a flight tuple: (flight_id, 'number', 'status', 'type', orig, dest, airline, dep_s, dep_e, dep_a, arr_s, arr_e, arr_a, board, aircraft_id, gate, stand, runway, dept, inbound_id)
        # e.g., (62, 'BA262', ..., 61, 2, 2, 2, 1, 61)
        m = re.match(r"^\((\d+),\s*'[^']+',\s*'[^']+',\s*'[^']+',\s*\d+,\s*\d+,\s*\d+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*(\d+),\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*(\d+|NULL)\)", line.strip())
        if m:
            f_id = int(m.group(1))
            ac_id = int(m.group(2))
            flight_aircraft[f_id] = ac_id

new_lines = []
for line in lines:
    m = re.match(r"^\((\d+),\s*('[^']+',\s*'[^']+',\s*'[^']+',\s*\d+,\s*\d+,\s*\d+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+),\s*(\d+),\s*([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+),\s*(\d+|NULL)\)(,|=|;)?", line.strip())
    if m:
        f_id = int(m.group(1))
        prefix = m.group(2)
        old_ac_id = int(m.group(3))
        mid = m.group(4)
        inbound_str = m.group(5)
        ending = m.group(6) if m.group(6) else ""
        
        if inbound_str != "NULL":
            inbound_id = int(inbound_str)
            correct_ac_id = flight_aircraft.get(inbound_id, old_ac_id)
            flight_aircraft[f_id] = correct_ac_id
            new_line = f"({f_id}, {prefix}, {correct_ac_id}, {mid}, {inbound_id}){ending}\n"
            new_lines.append(new_line)
        else:
            new_lines.append(line)
    else:
        new_lines.append(line)

with open(v2_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Successfully fixed all aircraft rotation alignments in V2__seed_data.sql!")
