import os
import re

v2_path = "/Users/krish/Desktop/Software Engineering/Mini Project/db/migration/V2__seed_data.sql"

with open(v2_path, "r", encoding="utf-8") as f:
    v2_content = f.read()

# First, fix the column header if it got broken
v2_content = v2_content.replace(
    "boarding_time, 1, gate_id", "boarding_time, aircraft_id, gate_id"
).replace(
    "boarding_time, 3, gate_id", "boarding_time, aircraft_id, gate_id"
).replace(
    "boarding_time, 5, gate_id", "boarding_time, aircraft_id, gate_id"
).replace(
    "boarding_time, 7, gate_id", "boarding_time, aircraft_id, gate_id"
)

v2_content = re.sub(r"boarding_time,\s*\d+,\s*gate_id", "boarding_time, aircraft_id, gate_id", v2_content)

flight_aircraft = {}

def fix_values_tuple(match):
    prefix = match.group(1) # INSERT INTO flights (...) VALUES
    fid = int(match.group(2))
    before_ac = match.group(3)
    old_ac = int(match.group(4))
    between = match.group(5)
    inbound_str = match.group(6)
    suffix = match.group(7)
    
    if inbound_str != "NULL":
        inbound_id = int(inbound_str)
        ac_id = flight_aircraft.get(inbound_id, ((fid - 1) % 12) + 1)
    else:
        ac_id = ((old_ac - 1) % 12) + 1
        
    flight_aircraft[fid] = ac_id
    
    return f"{prefix} ({fid}, {before_ac}, {ac_id}, {between}, {inbound_str}){suffix}"

# Regex for matching single line INSERT INTO flights ... VALUES ( ... )
pattern = re.compile(
    r"(INSERT INTO flights \([^)]+\) VALUES)\s*\(\s*(\d+),\s*('[^']+',\s*'[^']+',\s*'[^']+',\s*\d+,\s*\d+,\s*\d+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+),\s*(\d+),\s*(\d+|NULL,\s*\d+|NULL,\s*\d+|NULL,\s*\d+|NULL),\s*(\d+|NULL)\s*\)(;|\s*ON CONFLICT DO NOTHING;)"
)

# Better: parse line by line
lines = v2_content.splitlines()
out_lines = []

for line in lines:
    if "INSERT INTO flights" in line and "VALUES" in line:
        # separate header and values
        parts = line.split("VALUES", 1)
        header = parts[0] + "VALUES"
        val_str = parts[1].strip()
        
        # val_str is like: (1, 'AI101', 'SCHEDULED', 'DEPARTURE', 1, 3, 1, '2026-07-27 09:30:00+05:30', '2026-07-27 09:40:00+05:30', NULL, '2026-07-27 11:30:00+05:30', '2026-07-27 11:42:00+05:30', NULL, '2026-07-27 08:45:00+05:30', 1, 1, 1, 1, 1, NULL) ON CONFLICT DO NOTHING;
        # Extract tuple inside ()
        m = re.match(r"^\((.+)\)(.*)$", val_str)
        if m:
            tuple_content = m.group(1)
            suffix = m.group(2)
            
            # tuple_content has 20 comma-separated fields
            # We must be careful splitting by comma because of timestamptz strings!
            # Timestamptz strings don't contain commas, so simple split by comma works!
            fields = [f.strip() for f in tuple_content.split(',')]
            if len(fields) == 20:
                fid = int(fields[0])
                inbound_str = fields[19]
                
                if inbound_str != "NULL":
                    inbound_id = int(inbound_str)
                    ac_id = flight_aircraft.get(inbound_id, ((fid - 1) % 12) + 1)
                else:
                    ac_id = ((fid - 1) % 12) + 1
                
                flight_aircraft[fid] = ac_id
                fields[14] = str(ac_id)
                
                new_tuple = ", ".join(fields)
                out_lines.append(f"{header} ({new_tuple}){suffix}")
                continue
    out_lines.append(line)

with open(v2_path, "w", encoding="utf-8") as f:
    f.write("\n".join(out_lines))

print("Cleanly updated V2__seed_data.sql flight rotation aircraft IDs!")
