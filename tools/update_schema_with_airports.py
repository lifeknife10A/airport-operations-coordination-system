import os

mig_dir = "/Users/krish/Desktop/Software Engineering/Mini Project/db/migration"
v1_path = os.path.join(mig_dir, "V1__initial_schema.sql")
v2_path = os.path.join(mig_dir, "V2__seed_data.sql")

# 1. UPDATE V1__initial_schema.sql
v1_sql = """-- ============================================================
-- AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
-- PostgreSQL 18 Initial Database Schema (Flyway V1 Migration)
-- Author: Krishna Solanki & AOCS Engineering Team
-- ============================================================

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
    role_id BIGSERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
    department_id BIGSERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE
);

-- 3. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    role_id BIGINT NOT NULL REFERENCES roles(role_id) ON DELETE RESTRICT,
    department_id BIGINT NOT NULL REFERENCES departments(department_id) ON DELETE RESTRICT
);

-- 4. USER_PHONE_NUMBERS TABLE (Multivalued Attribute)
CREATE TABLE IF NOT EXISTS user_phone_numbers (
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    phone_number VARCHAR(30) NOT NULL,
    PRIMARY KEY (user_id, phone_number)
);

-- 5. AIRCRAFT TABLE
CREATE TABLE IF NOT EXISTS aircraft (
    aircraft_id BIGSERIAL PRIMARY KEY,
    registration_number VARCHAR(20) NOT NULL UNIQUE
);

-- 6. GATES TABLE
CREATE TABLE IF NOT EXISTS gates (
    gate_id BIGSERIAL PRIMARY KEY,
    gate_number VARCHAR(10) NOT NULL UNIQUE
);

-- 7. RUNWAYS TABLE
CREATE TABLE IF NOT EXISTS runways (
    runway_id BIGSERIAL PRIMARY KEY,
    runway_code VARCHAR(10) NOT NULL UNIQUE
);

-- 8. FLIGHTS TABLE (Enhanced with Origin/Destination & Boarding/Departure Timestamps for FIDS TV Display)
CREATE TABLE IF NOT EXISTS flights (
    flight_id BIGSERIAL PRIMARY KEY,
    flight_number VARCHAR(10) NOT NULL,
    flight_status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED' CHECK (flight_status IN ('SCHEDULED', 'BOARDING', 'AIRBORNE', 'LANDED', 'DELAYED', 'CANCELLED')),
    flight_type VARCHAR(15) NOT NULL DEFAULT 'DEPARTURE' CHECK (flight_type IN ('DEPARTURE', 'ARRIVAL')),
    origin_airport VARCHAR(10) NOT NULL DEFAULT 'DEL',
    destination_airport VARCHAR(10) NOT NULL DEFAULT 'BOM',
    scheduled_departure_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actual_departure_time TIMESTAMPTZ,
    scheduled_arrival_time TIMESTAMPTZ NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '2 hours'),
    actual_arrival_time TIMESTAMPTZ,
    boarding_time TIMESTAMPTZ,
    aircraft_id BIGINT NOT NULL REFERENCES aircraft(aircraft_id) ON DELETE RESTRICT,
    gate_id BIGINT REFERENCES gates(gate_id) ON DELETE SET NULL,
    runway_id BIGINT REFERENCES runways(runway_id) ON DELETE SET NULL,
    department_id BIGINT REFERENCES departments(department_id) ON DELETE SET NULL
);

-- 9. TASKS TABLE
CREATE TABLE IF NOT EXISTS tasks (
    task_id BIGSERIAL PRIMARY KEY,
    task_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED')),
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE,
    assigned_user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL
);

-- 10. DELAY_LOGS TABLE (Weak Entity)
CREATE TABLE IF NOT EXISTS delay_logs (
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE,
    delay_seq_no INT NOT NULL CHECK (delay_seq_no > 0),
    delay_minutes INT NOT NULL CHECK (delay_minutes >= 0),
    PRIMARY KEY (flight_id, delay_seq_no)
);

-- 11. FUEL_LOGS TABLE
CREATE TABLE IF NOT EXISTS fuel_logs (
    fuel_log_id BIGSERIAL PRIMARY KEY,
    fuel_density NUMERIC(6,3) NOT NULL CHECK (fuel_density > 0),
    task_id BIGINT NOT NULL REFERENCES tasks(task_id) ON DELETE RESTRICT
);

-- 12. CARGO_MANIFESTS TABLE
CREATE TABLE IF NOT EXISTS cargo_manifests (
    cargo_id BIGSERIAL PRIMARY KEY,
    container_id VARCHAR(30) NOT NULL,
    fuel_log_id BIGINT NOT NULL REFERENCES fuel_logs(fuel_log_id) ON DELETE RESTRICT
);

-- 13. BAGGAGE_CAROUSELS TABLE
CREATE TABLE IF NOT EXISTS baggage_carousels (
    carousel_id BIGSERIAL PRIMARY KEY,
    terminal VARCHAR(10) NOT NULL,
    flight_id BIGINT REFERENCES flights(flight_id) ON DELETE SET NULL
);

-- 14. PASSENGERS TABLE
CREATE TABLE IF NOT EXISTS passengers (
    passenger_id BIGSERIAL PRIMARY KEY,
    passport_number VARCHAR(20) NOT NULL UNIQUE,
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE RESTRICT
);

-- 15. LOUNGE_VISITS TABLE
CREATE TABLE IF NOT EXISTS lounge_visits (
    visit_id BIGSERIAL PRIMARY KEY,
    lounge_name VARCHAR(100) NOT NULL,
    passenger_id BIGINT NOT NULL REFERENCES passengers(passenger_id) ON DELETE CASCADE
);

-- 16. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
);

-- 17. AUDIT_LOGS TABLE (Immutable Security Trail - Legal Compliance)
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id BIGSERIAL PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE & FIDS SEARCHES
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_dept ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_flights_aircraft ON flights(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_flights_gate ON flights(gate_id);
CREATE INDEX IF NOT EXISTS idx_flights_runway ON flights(runway_id);
CREATE INDEX IF NOT EXISTS idx_flights_airports ON flights(origin_airport, destination_airport);
CREATE INDEX IF NOT EXISTS idx_flights_status ON flights(flight_status, flight_type);
CREATE INDEX IF NOT EXISTS idx_tasks_flight ON tasks(flight_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(assigned_user_id);
CREATE INDEX IF NOT EXISTS idx_passengers_flight ON passengers(flight_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
"""

with open(v1_path, "w", encoding="utf-8") as f:
    f.write(v1_sql)

# 2. UPDATE V2__seed_data.sql
lines = [
    "-- ============================================================",
    "-- AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)",
    "-- Expanded Seed Dataset (2,175+ Unique Rows: 60% National / 40% Intl)",
    "-- Enhanced with FIDS Origin/Destination City Pairs & Timestamps",
    "-- Author: Krishna Solanki & AOCS Engineering Team",
    "-- ============================================================",
    ""
]

# 1. ROLES
lines.append("-- 1. ROLES")
roles_list = ["ROLE_ADMIN", "ROLE_SUPERVISOR", "ROLE_GROUND_CREW", "ROLE_ATC", "ROLE_DISPATCH"]
for r in roles_list:
    lines.append(f"INSERT INTO roles (role_name) VALUES ('{r}') ON CONFLICT (role_name) DO NOTHING;")
lines.append("")

# 2. DEPARTMENTS
lines.append("-- 2. DEPARTMENTS")
depts_list = [
    "Flight Dispatch & Navigation",
    "Air Traffic Control (ATC)",
    "Ground Handling & Turnaround",
    "Refueling & Fuel Quality Ops",
    "Cabin Cleaning & Sanitation",
    "Cargo & Freight Logistics",
    "Passenger Services & Terminal Ops",
    "Airfield Security & Audit Control"
]
for d in depts_list:
    lines.append(f"INSERT INTO departments (department_name) VALUES ('{d}') ON CONFLICT (department_name) DO NOTHING;")
lines.append("")

# 3. USERS (150)
lines.append("-- 3. USERS (150)")
indian_first = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Dhruv", "Kabir", "Ananya", "Diya", "Pari", "Saanvi", "Riya", "Aadhya", "Neha", "Pooja", "Rajesh", "Suresh", "Vikram", "Sunil", "Amit", "Rahul", "Priya", "Sneha", "Karan", "Gaurav", "Manish", "Deepak", "Sanjay", "Alok", "Rohit", "Tarun", "Nikhil", "Kavita", "Swati", "Meena"]
indian_last = ["Sharma", "Verma", "Patel", "Singh", "Kumar", "Gupta", "Rao", "Joshi", "Mehta", "Shah", "Nair", "Iyer", "Chawla", "Deshmukh", "Reddy", "Solanki", "Modi", "Tripathi", "Tikku", "Agarwal", "Banerjee", "Chatterjee", "Bhattacharya", "Dutta", "Saha"]

intl_first = ["John", "Michael", "David", "James", "Robert", "Emily", "Sarah", "Jessica", "Daniel", "Matthew", "Alex", "Christopher", "Sophia", "Emma", "Olivia", "Liam", "Noah", "Lucas", "Ethan", "Oliver", "Benjamin", "William", "Henry", "Alexander", "Sebastian", "Jack", "Samuel", "Grace", "Chloe", "Ella"]
intl_last = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Wilson", "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez"]

users_data = []
for i in range(1, 91):
    fname = indian_first[(i - 1) % len(indian_first)]
    lname = indian_last[(i - 1) % len(indian_last)]
    uname = f"{fname.lower()}.{lname.lower()}{i:03d}"
    fullname = f"{fname} {lname}"
    role_id = ((i - 1) % 5) + 1
    dept_id = ((i - 1) % 8) + 1
    phone = f"+9198{i:08d}"
    users_data.append((uname, fullname, role_id, dept_id, phone))

for i in range(91, 151):
    fname = intl_first[(i - 91) % len(intl_first)]
    lname = intl_last[(i - 91) % len(intl_last)]
    uname = f"{fname.lower()}.{lname.lower()}{i:03d}"
    fullname = f"{fname} {lname}"
    role_id = ((i - 1) % 5) + 1
    dept_id = ((i - 1) % 8) + 1
    phone = f"+1415{i:07d}"
    users_data.append((uname, fullname, role_id, dept_id, phone))

for idx, (u, n, r, d, p) in enumerate(users_data, 1):
    lines.append(f"INSERT INTO users (user_id, username, name, role_id, department_id) VALUES ({idx}, '{u}', '{n}', {r}, {d}) ON CONFLICT DO NOTHING;")
    lines.append(f"INSERT INTO user_phone_numbers (user_id, phone_number) VALUES ({idx}, '{p}') ON CONFLICT DO NOTHING;")
lines.append("")

# 5. AIRCRAFT (100)
lines.append("-- 5. AIRCRAFT (100)")
aircraft_list = []
for i in range(1, 61):
    code = f"VT-A{i:03d}"
    aircraft_list.append((i, code))

intl_prefixes = ["A6-E", "G-X", "9V-S", "N7"]
for i in range(61, 101):
    pref = intl_prefixes[(i - 61) % len(intl_prefixes)]
    code = f"{pref}{i:03d}"
    aircraft_list.append((i, code))

for aid, reg in aircraft_list:
    lines.append(f"INSERT INTO aircraft (aircraft_id, registration_number) VALUES ({aid}, '{reg}') ON CONFLICT DO NOTHING;")
lines.append("")

# 6. GATES (60)
lines.append("-- 6. GATES (60)")
for i in range(1, 61):
    gn = f"A{i:02d}" if i <= 20 else (f"B{i-20:02d}" if i <= 40 else f"C{i-40:02d}")
    lines.append(f"INSERT INTO gates (gate_id, gate_number) VALUES ({i}, '{gn}') ON CONFLICT DO NOTHING;")
lines.append("")

# 7. RUNWAYS (12)
lines.append("-- 7. RUNWAYS (12)")
rw_codes = ["09L", "09R", "27L", "27R", "10L", "10R", "28L", "28R", "14L", "32R", "11L", "29R"]
for idx, rcode in enumerate(rw_codes, 1):
    lines.append(f"INSERT INTO runways (runway_id, runway_code) VALUES ({idx}, '{rcode}') ON CONFLICT DO NOTHING;")
lines.append("")

# 8. FLIGHTS (200)
lines.append("-- 8. FLIGHTS (200)")
statuses = ["SCHEDULED", "BOARDING", "AIRBORNE", "LANDED", "DELAYED", "CANCELLED"]

nat_city_pairs = [
    ("DEL", "BOM"), ("BOM", "BLR"), ("BLR", "MAA"), ("DEL", "CCU"),
    ("HYD", "DEL"), ("BOM", "DEL"), ("BLR", "DEL"), ("MAA", "BOM"),
    ("CCU", "DEL"), ("DEL", "HYD"), ("BOM", "BLR"), ("DEL", "BLR")
]
intl_city_pairs = [
    ("DEL", "DXB"), ("BOM", "LHR"), ("DEL", "JFK"), ("DEL", "SIN"),
    ("BOM", "FRA"), ("DEL", "HND"), ("DXB", "DEL"), ("LHR", "BOM"),
    ("JFK", "DEL"), ("SIN", "DEL"), ("FRA", "BOM"), ("HND", "DEL")
]

flights_data = []
nat_carriers = ["AI", "6E", "UK", "QP", "SG"]
for i in range(1, 121):
    c = nat_carriers[(i - 1) % len(nat_carriers)]
    fnum = f"{c}{100 + i}"
    st = statuses[(i - 1) % len(statuses)]
    ftype = "DEPARTURE" if (i % 2 == 1) else "ARRIVAL"
    orig, dest = nat_city_pairs[(i - 1) % len(nat_city_pairs)]
    
    h_dep = (8 + (i % 12)) % 24
    h_arr = (10 + (i % 12)) % 24
    h_brd = (7 + (i % 12)) % 24
    
    sch_dep = f"2026-07-27 {h_dep:02d}:30:00+05:30"
    act_dep = f"2026-07-27 {h_dep:02d}:45:00+05:30" if st in ["AIRBORNE", "LANDED", "DELAYED"] else "NULL"
    sch_arr = f"2026-07-27 {h_arr:02d}:30:00+05:30"
    act_arr = f"2026-07-27 {h_arr:02d}:50:00+05:30" if st == "LANDED" else "NULL"
    brd_time = f"2026-07-27 {h_brd:02d}:45:00+05:30"
    
    acid = ((i - 1) % 60) + 1
    gid = ((i - 1) % 60) + 1
    rwid = ((i - 1) % 12) + 1
    deptid = ((i - 1) % 8) + 1
    
    flights_data.append((i, fnum, st, ftype, orig, dest, sch_dep, act_dep, sch_arr, act_arr, brd_time, acid, gid, rwid, deptid))

intl_carriers = ["EK", "BA", "SQ", "QR", "LH", "UA", "DL"]
for i in range(121, 201):
    c = intl_carriers[(i - 121) % len(intl_carriers)]
    fnum = f"{c}{500 + i}"
    st = statuses[(i - 121) % len(statuses)]
    ftype = "DEPARTURE" if (i % 2 == 1) else "ARRIVAL"
    orig, dest = intl_city_pairs[(i - 121) % len(intl_city_pairs)]
    
    h_dep = (1 + (i % 20)) % 24
    h_arr = (8 + (i % 20)) % 24
    h_brd = (0 + (i % 20)) % 24
    
    sch_dep = f"2026-07-27 {h_dep:02d}:00:00+05:30"
    act_dep = f"2026-07-27 {h_dep:02d}:20:00+05:30" if st in ["AIRBORNE", "LANDED", "DELAYED"] else "NULL"
    sch_arr = f"2026-07-27 {h_arr:02d}:30:00+05:30"
    act_arr = f"2026-07-27 {h_arr:02d}:55:00+05:30" if st == "LANDED" else "NULL"
    brd_time = f"2026-07-27 {h_brd:02d}:15:00+05:30"
    
    acid = 61 + ((i - 121) % 40)
    gid = ((i - 1) % 60) + 1
    rwid = ((i - 1) % 12) + 1
    deptid = ((i - 1) % 8) + 1
    
    flights_data.append((i, fnum, st, ftype, orig, dest, sch_dep, act_dep, sch_arr, act_arr, brd_time, acid, gid, rwid, deptid))

for fid, fnum, st, ftype, orig, dest, sch_dep, act_dep, sch_arr, act_arr, brd_time, acid, gid, rwid, deptid in flights_data:
    act_dep_val = f"'{act_dep}'" if act_dep != "NULL" else "NULL"
    act_arr_val = f"'{act_arr}'" if act_arr != "NULL" else "NULL"
    lines.append(f"INSERT INTO flights (flight_id, flight_number, flight_status, flight_type, origin_airport, destination_airport, scheduled_departure_time, actual_departure_time, scheduled_arrival_time, actual_arrival_time, boarding_time, aircraft_id, gate_id, runway_id, department_id) VALUES ({fid}, '{fnum}', '{st}', '{ftype}', '{orig}', '{dest}', '{sch_dep}', {act_dep_val}, '{sch_arr}', {act_arr_val}, '{brd_time}', {acid}, {gid}, {rwid}, {deptid}) ON CONFLICT DO NOTHING;")
lines.append("")

# 9. TASKS (600)
lines.append("-- 9. TASKS (600)")
task_types = [
    "Cabin Cleaning & Decontamination",
    "Aviation Refueling & Density Check",
    "Catering & Galley Supply Loading",
    "Baggage & Freight Loading",
    "Avionics & Pre-flight Maintenance",
    "Security & Passenger Boarding Clearance"
]
task_statuses = ["PENDING", "IN_PROGRESS", "COMPLETED", "BLOCKED"]
task_id_counter = 1
for fid in range(1, 201):
    for sub in range(3):
        tname = task_types[(fid + sub) % len(task_types)]
        tstat = task_statuses[(fid + sub) % len(task_statuses)]
        uid = ((fid + sub * 7) % 150) + 1
        lines.append(f"INSERT INTO tasks (task_id, task_name, status, flight_id, assigned_user_id) VALUES ({task_id_counter}, '{tname}', '{tstat}', {fid}, {uid}) ON CONFLICT DO NOTHING;")
        task_id_counter += 1
lines.append("")

# 10. DELAY_LOGS (100)
lines.append("-- 10. DELAY_LOGS (100)")
for fid in range(1, 101):
    dm = (fid * 7) % 110 + 10
    lines.append(f"INSERT INTO delay_logs (flight_id, delay_seq_no, delay_minutes) VALUES ({fid}, 1, {dm}) ON CONFLICT DO NOTHING;")
lines.append("")

# 11. FUEL_LOGS (150)
lines.append("-- 11. FUEL_LOGS (150)")
for i in range(1, 151):
    fd = 0.800 + ((i % 10) * 0.001)
    tid = i
    lines.append(f"INSERT INTO fuel_logs (fuel_log_id, fuel_density, task_id) VALUES ({i}, {fd:.3f}, {tid}) ON CONFLICT DO NOTHING;")
lines.append("")

# 12. CARGO_MANIFESTS (150)
lines.append("-- 12. CARGO_MANIFESTS (150)")
for i in range(1, 151):
    cid = f"AKN-{1000 + i:05d}-AOCS"
    lines.append(f"INSERT INTO cargo_manifests (cargo_id, container_id, fuel_log_id) VALUES ({i}, '{cid}', {i}) ON CONFLICT DO NOTHING;")
lines.append("")

# 13. BAGGAGE_CAROUSELS (30)
lines.append("-- 13. BAGGAGE_CAROUSELS (30)")
for i in range(1, 31):
    term = "T1" if i <= 10 else ("T2" if i <= 20 else "T3")
    fid = (i * 6)
    lines.append(f"INSERT INTO baggage_carousels (carousel_id, terminal, flight_id) VALUES ({i}, '{term}', {fid}) ON CONFLICT DO NOTHING;")
lines.append("")

# 14. PASSENGERS (300)
lines.append("-- 14. PASSENGERS (300)")
for i in range(1, 301):
    ppt = f"P{1000000 + i*1337:08d}"
    fid = ((i - 1) % 200) + 1
    lines.append(f"INSERT INTO passengers (passenger_id, passport_number, flight_id) VALUES ({i}, '{ppt}', {fid}) ON CONFLICT DO NOTHING;")
lines.append("")

# 15. LOUNGE_VISITS (100)
lines.append("-- 15. LOUNGE_VISITS (100)")
lounges = ["Encalm VIP Executive Lounge", "Emirates First Class Lounge", "Star Alliance Lounge", "Plaza Premium Executive Lounge", "Air India Maharaja Lounge"]
for i in range(1, 101):
    lname = lounges[(i - 1) % len(lounges)]
    pid = i * 2
    lines.append(f"INSERT INTO lounge_visits (visit_id, lounge_name, passenger_id) VALUES ({i}, '{lname}', {pid}) ON CONFLICT DO NOTHING;")
lines.append("")

# 16. NOTIFICATIONS (150)
lines.append("-- 16. NOTIFICATIONS (150)")
notif_titles = [
    "Gate Change Alert: Reassigned to Gate A12",
    "Turnaround SLA Alert: Refueling Delay Detected",
    "Airside Clearance: Runway 28L Ready for Arrival",
    "Security Clearance: Baggage Carousel 4 Active",
    "Flight Dispatch: Flight Schedule Updated"
]
for i in range(1, 151):
    t = notif_titles[(i - 1) % len(notif_titles)]
    uid = ((i - 1) % 150) + 1
    lines.append(f"INSERT INTO notifications (notification_id, title, user_id) VALUES ({i}, '{t}', {uid}) ON CONFLICT DO NOTHING;")
lines.append("")

# 17. AUDIT_LOGS (200)
lines.append("-- 17. AUDIT_LOGS (200)")
actions = [
    "User Login Succeeded",
    "Gate Assignment Modified",
    "Flight Status Updated to BOARDING",
    "Refueling Density Transaction Completed",
    "Ground Turnaround Sub-Task Closed"
]
for i in range(1, 201):
    act = actions[(i - 1) % len(actions)]
    uid = ((i - 1) % 150) + 1
    lines.append(f"INSERT INTO audit_logs (log_id, action, user_id) VALUES ({i}, '{act}', {uid}) ON CONFLICT DO NOTHING;")
lines.append("")

with open(v2_path, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"Successfully generated clean V2 seed script in {v2_path}")
