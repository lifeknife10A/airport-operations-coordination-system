import os

mig_dir = "/Users/krish/Desktop/Software Engineering/Mini Project/db/migration"
v2_path = os.path.join(mig_dir, "V2__seed_data.sql")

lines = [
    "-- ============================================================",
    "-- AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)",
    "-- Expanded Seed Dataset (2,175+ Unique Rows: 60% National / 40% Intl)",
    "-- Author: Krishna Solanki & AOCS Engineering Team",
    "-- ============================================================",
    ""
]

# 1. ROLES (5)
lines.append("-- 1. ROLES")
roles_list = ["ROLE_ADMIN", "ROLE_SUPERVISOR", "ROLE_GROUND_CREW", "ROLE_ATC", "ROLE_DISPATCH"]
for r in roles_list:
    lines.append(f"INSERT INTO roles (role_name) VALUES ('{r}') ON CONFLICT (role_name) DO NOTHING;")
lines.append("")

# 2. DEPARTMENTS (8)
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

# 3. USERS (150) & USER_PHONE_NUMBERS (150)
lines.append("-- 3. USERS (150)")
indian_first = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Dhruv", "Kabir", "Ananya", "Diya", "Pari", "Saanvi", "Riya", "Aadhya", "Neha", "Pooja", "Rajesh", "Suresh", "Vikram", "Sunil", "Amit", "Rahul", "Priya", "Sneha", "Karan", "Gaurav", "Manish", "Deepak", "Sanjay", "Alok", "Rohit", "Tarun", "Nikhil", "Kavita", "Swati", "Meena"]
indian_last = ["Sharma", "Verma", "Patel", "Singh", "Kumar", "Gupta", "Rao", "Joshi", "Mehta", "Shah", "Nair", "Iyer", "Chawla", "Deshmukh", "Reddy", "Solanki", "Modi", "Tripathi", "Tikku", "Agarwal", "Banerjee", "Chatterjee", "Bhattacharya", "Dutta", "Saha"]

intl_first = ["John", "Michael", "David", "James", "Robert", "Emily", "Sarah", "Jessica", "Daniel", "Matthew", "Alex", "Christopher", "Sophia", "Emma", "Olivia", "Liam", "Noah", "Lucas", "Ethan", "Oliver", "Benjamin", "William", "Henry", "Alexander", "Sebastian", "Jack", "Samuel", "Grace", "Chloe", "Ella"]
intl_last = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Wilson", "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez"]

users_data = []
# 90 National users (60%)
for i in range(1, 91):
    fname = indian_first[(i - 1) % len(indian_first)]
    lname = indian_last[(i - 1) % len(indian_last)]
    uname = f"{fname.lower()}.{lname.lower()}{i:03d}"
    fullname = f"{fname} {lname}"
    role_id = ((i - 1) % 5) + 1
    dept_id = ((i - 1) % 8) + 1
    phone = f"+9198{i:08d}"
    users_data.append((uname, fullname, role_id, dept_id, phone))

# 60 International users (40%)
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
# 60 National (VT-*)
for i in range(1, 61):
    code = f"VT-A{i:03d}"
    aircraft_list.append((i, code))

# 40 International (A6-*, G-*, 9V-*, N-*)
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
    if i <= 20:
        gn = f"A{i:02d}"
    elif i <= 40:
        gn = f"B{i-20:02d}"
    else:
        gn = f"C{i-40:02d}"
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
flights_data = []
# 120 National flights (AI, 6E, UK, QP, SG) -> aircraft_id 1 to 60
nat_carriers = ["AI", "6E", "UK", "QP", "SG"]
for i in range(1, 121):
    c = nat_carriers[(i - 1) % len(nat_carriers)]
    fnum = f"{c}{100 + i}"
    st = statuses[(i - 1) % len(statuses)]
    acid = ((i - 1) % 60) + 1  # 1 to 60
    gid = ((i - 1) % 60) + 1   # 1 to 60
    rwid = ((i - 1) % 12) + 1  # 1 to 12
    deptid = ((i - 1) % 8) + 1 # 1 to 8
    flights_data.append((i, fnum, st, acid, gid, rwid, deptid))

# 80 International flights (EK, BA, SQ, QR, LH, UA, DL) -> aircraft_id 61 to 100
intl_carriers = ["EK", "BA", "SQ", "QR", "LH", "UA", "DL"]
for i in range(121, 201):
    c = intl_carriers[(i - 121) % len(intl_carriers)]
    fnum = f"{c}{500 + i}"
    st = statuses[(i - 121) % len(statuses)]
    acid = 61 + ((i - 121) % 40) # 61 to 100
    gid = ((i - 1) % 60) + 1    # 1 to 60
    rwid = ((i - 1) % 12) + 1   # 1 to 12
    deptid = ((i - 1) % 8) + 1  # 1 to 8
    flights_data.append((i, fnum, st, acid, gid, rwid, deptid))

for fid, fnum, st, acid, gid, rwid, deptid in flights_data:
    lines.append(f"INSERT INTO flights (flight_id, flight_number, flight_status, aircraft_id, gate_id, runway_id, department_id) VALUES ({fid}, '{fnum}', '{st}', {acid}, {gid}, {rwid}, {deptid}) ON CONFLICT DO NOTHING;")
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
    # 3 sub-tasks per flight = 600 tasks
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
    tid = i  # valid task_id 1 to 150
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
    pid = i * 2 # 2, 4, ... 200 (all <= 300)
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

print(f"Successfully generated expanded seed file with 2,175+ records in {v2_path}")
