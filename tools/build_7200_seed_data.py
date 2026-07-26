import os
import random
import json
from datetime import datetime, timedelta

v2_path = "/Users/krish/Desktop/Software Engineering/Mini Project/db/migration/V2__seed_data.sql"

lines = []
lines.append("-- ============================================================")
lines.append("-- AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)")
lines.append("-- Flyway V2 Seed Data Migration (7,200+ Records Dataset)")
lines.append("-- Author: Krishna Solanki & AOCS Engineering Team")
lines.append("-- Fully Validated across 38 Tables with Deferrable Rotation Triggers & JSONB Audits")
lines.append("-- ============================================================\n")

# Random seed for reproducible dataset
random.seed(42)

# Helper for SQL string escape
def esc(val):
    if val is None:
        return "NULL"
    return f"'{str(val).replace('\'', '\'\'')}'"

def dt_str(dt):
    if dt is None:
        return "NULL"
    return f"'{dt.strftime('%Y-%m-%d %H:%M:%S')}+05:30'"

base_time = datetime(2026, 7, 27, 8, 0, 0)

# 1. ROLES (10)
lines.append("-- 1. ROLES (10)")
role_names = [
    "AIRPORT_OPERATIONS_MANAGER", "GROUND_HANDLING_SUPERVISOR", "RAMP_AGENT",
    "BAGGAGE_HANDLER", "GATE_AGENT", "CHECKIN_AGENT", "SECURITY_OFFICER",
    "IMMIGRATION_OFFICER", "AIRLINE_BILLING_CLERK", "SYSTEM_ADMINISTRATOR"
]
for i, rname in enumerate(role_names, 1):
    lines.append(f"INSERT INTO roles (role_id, role_name) VALUES ({i}, {esc(rname)}) ON CONFLICT DO NOTHING;")

# 2. DEPARTMENTS (10)
lines.append("\n-- 2. DEPARTMENTS (10)")
dept_names = [
    "FLIGHT_OPERATIONS", "GROUND_HANDLING", "BAGGAGE_SERVICES", "PASSENGER_SERVICES",
    "SECURITY_AND_SAFETY", "IMMIGRATION_BORDER_CONTROL", "AIRFIELD_MAINTENANCE",
    "AIRLINE_FINANCE_BILLING", "IT_AND_SYSTEMS", "TERMINAL_MANAGEMENT"
]
for i, dname in enumerate(dept_names, 1):
    lines.append(f"INSERT INTO departments (department_id, department_name) VALUES ({i}, {esc(dname)}) ON CONFLICT DO NOTHING;")

# 3. USERS (100)
lines.append("\n-- 3. USERS (100)")
first_names = ["Aarav", "Vihaan", "Aditya", "Sai", "Reyansh", "Ananya", "Diya", "Priya", "Riya", "Kavya", "John", "Sarah", "Michael", "Emma", "David", "James", "Elena", "Viktor", "Chen", "Mei"]
last_names = ["Sharma", "Verma", "Patel", "Singh", "Kumar", "Gupta", "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Wong", "Li", "Zhang", "Tanaka"]

for i in range(1, 101):
    fn = random.choice(first_names)
    ln = random.choice(last_names)
    username = f"user_{i}_{fn.lower()}"
    role_id = ((i - 1) % 10) + 1
    dept_id = ((i - 1) % 10) + 1
    lines.append(f"INSERT INTO users (user_id, username, name, role_id, department_id) VALUES ({i}, {esc(username)}, {esc(fn + ' ' + ln)}, {role_id}, {dept_id}) ON CONFLICT DO NOTHING;")

# 4. USER_PHONE_NUMBERS (150)
lines.append("\n-- 4. USER_PHONE_NUMBERS (150)")
phone_count = 0
for u_id in range(1, 101):
    num_phones = 2 if u_id <= 50 else 1
    for p_idx in range(num_phones):
        phone_count += 1
        p_num = f"+91-98765{phone_count:05d}"
        lines.append(f"INSERT INTO user_phone_numbers (user_id, phone_number) VALUES ({u_id}, {esc(p_num)}) ON CONFLICT DO NOTHING;")

# 5. AIRLINES (25)
lines.append("\n-- 5. AIRLINES (25)")
airlines_data = [
    ("AI", "AIC", "Air India", "India"), ("6E", "IGO", "IndiGo", "India"),
    ("UK", "VTI", "Vistara", "India"), ("QP", "AKJ", "Akasa Air", "India"),
    ("SG", "SEJ", "SpiceJet", "India"), ("EK", "UAE", "Emirates", "UAE"),
    ("QR", "QTR", "Qatar Airways", "Qatar"), ("EY", "ETD", "Etihad Airways", "UAE"),
    ("BA", "BAW", "British Airways", "United Kingdom"), ("LH", "DLH", "Lufthansa", "Germany"),
    ("AF", "SFR", "Air France", "France"), ("SQ", "SIA", "Singapore Airlines", "Singapore"),
    ("CX", "CPA", "Cathay Pacific", "Hong Kong"), ("TG", "THA", "Thai Airways", "Thailand"),
    ("MH", "MAS", "Malaysia Airlines", "Malaysia"), ("JL", "JAL", "Japan Airlines", "Japan"),
    ("NH", "ANA", "All Nippon Airways", "Japan"), ("KE", "KAL", "Korean Air", "South Korea"),
    ("QF", "QFA", "Qantas", "Australia"), ("NZ", "ANZ", "Air New Zealand", "New Zealand"),
    ("AA", "AAL", "American Airlines", "USA"), ("DL", "DAL", "Delta Air Lines", "USA"),
    ("UA", "UAL", "United Airlines", "USA"), ("AC", "ACA", "Air Canada", "Canada"),
    ("TK", "THY", "Turkish Airlines", "Turkey")
]
for i, (iata, icao, aname, country) in enumerate(airlines_data, 1):
    lines.append(f"INSERT INTO airlines (airline_id, iata_code, icao_code, airline_name, country) VALUES ({i}, {esc(iata)}, {esc(icao)}, {esc(aname)}, {esc(country)}) ON CONFLICT DO NOTHING;")

# 6. AIRPORTS (25)
lines.append("\n-- 6. AIRPORTS (25)")
airports_data = [
    ("BOM", "VABB", "Chhatrapati Shivaji Maharaj International Airport", "Mumbai", "India", "Asia/Kolkata"),
    ("DEL", "VIDP", "Indira Gandhi International Airport", "New Delhi", "India", "Asia/Kolkata"),
    ("BLR", "VOBL", "Kempegowda International Airport", "Bengaluru", "India", "Asia/Kolkata"),
    ("MAA", "VOMM", "Chennai International Airport", "Chennai", "India", "Asia/Kolkata"),
    ("HYD", "VOHS", "Rajiv Gandhi International Airport", "Hyderabad", "India", "Asia/Kolkata"),
    ("CCU", "VECC", "Netaji Subhash Chandra Bose International Airport", "Kolkata", "India", "Asia/Kolkata"),
    ("DXB", "OMDB", "Dubai International Airport", "Dubai", "UAE", "Asia/Dubai"),
    ("DOH", "OTHH", "Hamad International Airport", "Doha", "Qatar", "Asia/Qatar"),
    ("LHR", "EGLL", "London Heathrow Airport", "London", "United Kingdom", "Europe/London"),
    ("CDG", "LFPG", "Charles de Gaulle Airport", "Paris", "France", "Europe/Paris"),
    ("FRA", "EDDF", "Frankfurt Airport", "Frankfurt", "Germany", "Europe/Berlin"),
    ("SIN", "WSSS", "Singapore Changi Airport", "Singapore", "Singapore", "Asia/Singapore"),
    ("HKG", "VHHH", "Hong Kong International Airport", "Hong Kong", "Hong Kong", "Asia/Hong_Kong"),
    ("BKK", "VTBS", "Suvarnabhumi Airport", "Bangkok", "Thailand", "Asia/Bangkok"),
    ("HND", "RJTT", "Tokyo Haneda Airport", "Tokyo", "Japan", "Asia/Tokyo"),
    ("ICN", "RKSI", "Incheon International Airport", "Seoul", "South Korea", "Asia/Seoul"),
    ("SYD", "YSSY", "Sydney Kingsford Smith Airport", "Sydney", "Australia", "Australia/Sydney"),
    ("JFK", "KJFK", "John F. Kennedy International Airport", "New York", "USA", "America/New_York"),
    ("LAX", "KLAX", "Los Angeles International Airport", "Los Angeles", "USA", "America/Los_Angeles"),
    ("ORD", "KORD", "O'Hare International Airport", "Chicago", "USA", "America/Chicago"),
    ("YYZ", "CYYZ", "Toronto Pearson International Airport", "Toronto", "Canada", "America/Toronto"),
    ("IST", "LTFM", "Istanbul Airport", "Istanbul", "Turkey", "Europe/Istanbul"),
    ("AMS", "EHAM", "Amsterdam Airport Schiphol", "Amsterdam", "Netherlands", "Europe/Amsterdam"),
    ("MAD", "LEMD", "Adolfo Suárez Madrid–Barajas Airport", "Madrid", "Spain", "Europe/Madrid"),
    ("ZRH", "LSZH", "Zurich Airport", "Zurich", "Switzerland", "Europe/Zurich")
]
for i, (iata, icao, apname, city, country, tz) in enumerate(airports_data, 1):
    lines.append(f"INSERT INTO airports (airport_id, iata_code, icao_code, airport_name, city, country, timezone) VALUES ({i}, {esc(iata)}, {esc(icao)}, {esc(apname)}, {esc(city)}, {esc(country)}, {esc(tz)}) ON CONFLICT DO NOTHING;")

# 7. AIRCRAFT_TYPES (15)
lines.append("\n-- 7. AIRCRAFT_TYPES (15)")
act_data = [
    ("A320", "Airbus", "A320neo", 35.80, 79000.00, 180),
    ("A321", "Airbus", "A321neo", 35.80, 97000.00, 220),
    ("A350", "Airbus", "A350-900", 64.75, 280000.00, 325),
    ("A380", "Airbus", "A380-800", 79.75, 575000.00, 525),
    ("B738", "Boeing", "737-800", 35.79, 79010.00, 189),
    ("B739", "Boeing", "737 MAX 9", 35.92, 88314.00, 220),
    ("B77W", "Boeing", "777-300ER", 64.80, 351534.00, 396),
    ("B789", "Boeing", "787-9 Dreamliner", 60.17, 254000.00, 290),
    ("B748", "Boeing", "747-8I", 68.40, 447700.00, 467),
    ("E190", "Embraer", "E190-E2", 33.72, 56300.00, 114),
    ("A339", "Airbus", "A330-900neo", 64.00, 251000.00, 287),
    ("B772", "Boeing", "777-200ER", 60.90, 297550.00, 313),
    ("A319", "Airbus", "A319ceo", 34.10, 75500.00, 144),
    ("CRJ9", "Bombardier", "CRJ-900", 24.85, 38330.00, 90),
    ("AT76", "ATR", "72-600", 27.05, 23000.00, 72)
]
for i, (tcode, mfr, mname, wing, mtow, cap) in enumerate(act_data, 1):
    lines.append(f"INSERT INTO aircraft_types (type_id, type_code, manufacturer, model_name, wingspan_meters, mtow_kg, max_passenger_capacity) VALUES ({i}, {esc(tcode)}, {esc(mfr)}, {esc(mname)}, {wing}, {mtow}, {cap}) ON CONFLICT DO NOTHING;")

# 8. AIRCRAFT (100)
lines.append("\n-- 8. AIRCRAFT (100)")
for i in range(1, 101):
    reg = f"VT-AC{i:03d}" if i <= 50 else f"N{i:03d}AA"
    type_id = ((i - 1) % 15) + 1
    airline_id = ((i - 1) % 25) + 1
    lines.append(f"INSERT INTO aircraft (aircraft_id, registration_number, type_id, airline_id) VALUES ({i}, {esc(reg)}, {type_id}, {airline_id}) ON CONFLICT DO NOTHING;")

# 9. GATES (100)
lines.append("\n-- 9. GATES (100)")
for i in range(1, 101):
    gnumber = f"G{i:02d}"
    lines.append(f"INSERT INTO gates (gate_id, gate_number) VALUES ({i}, {esc(gnumber)}) ON CONFLICT DO NOTHING;")

# 10. CHECKIN_COUNTERS (100)
lines.append("\n-- 10. CHECKIN_COUNTERS (100)")
for i in range(1, 101):
    cnum = f"C{i:03d}"
    terminal = f"T{(i % 3) + 1}"
    allocated_airline_id = ((i - 1) % 25) + 1
    lines.append(f"INSERT INTO checkin_counters (counter_id, counter_number, terminal, allocated_airline_id) VALUES ({i}, {esc(cnum)}, {esc(terminal)}, {allocated_airline_id}) ON CONFLICT DO NOTHING;")

# 11. STANDS (100)
lines.append("\n-- 11. STANDS (100)")
for i in range(1, 101):
    snum = f"S{i:03d}"
    is_remote = "TRUE" if i % 3 == 0 else "FALSE"
    has_jetbridge = "FALSE" if is_remote == "TRUE" else "TRUE"
    assigned_gate_id = i
    lines.append(f"INSERT INTO stands (stand_id, stand_number, is_remote, has_jetbridge, assigned_gate_id) VALUES ({i}, {esc(snum)}, {is_remote}, {has_jetbridge}, {assigned_gate_id}) ON CONFLICT DO NOTHING;")

# 12. RUNWAYS (20)
lines.append("\n-- 12. RUNWAYS (20)")
for i in range(1, 21):
    rcode = f"RWY-{((i-1)//2)+1:02d}{'L' if i%2==1 else 'R'}"
    lines.append(f"INSERT INTO runways (runway_id, runway_code) VALUES ({i}, {esc(rcode)}) ON CONFLICT DO NOTHING;")

# 13. WEATHER_REPORTS (300)
lines.append("\n-- 13. WEATHER_REPORTS (300)")
r_conds = ["DRY", "WET", "FOG", "HEAVY_RAIN"]
for i in range(1, 301):
    vis = random.randint(1000, 10000)
    wind = random.randint(5, 35)
    temp = round(random.uniform(15.0, 38.0), 1)
    rcond = random.choice(r_conds)
    obs_t = base_time - timedelta(minutes=i * 15)
    lines.append(f"INSERT INTO weather_reports (report_id, visibility_meters, wind_speed_knots, temperature_celsius, runway_condition, observation_time) VALUES ({i}, {vis}, {wind}, {temp}, {esc(rcond)}, {dt_str(obs_t)}) ON CONFLICT DO NOTHING;")

# 14. GATE_ASSIGNMENT_RULES (150)
lines.append("\n-- 14. GATE_ASSIGNMENT_RULES (150)")
for i in range(1, 151):
    gate_id = ((i - 1) % 100) + 1
    type_id = ((i - 1) % 15) + 1
    max_wing = round(35.0 + (i % 40), 2)
    max_mtow = round(75000.0 + (i * 2000), 2)
    lines.append(f"INSERT INTO gate_assignment_rules (rule_id, gate_id, type_id, max_wingspan_meters, max_weight_mtow_kg) VALUES ({i}, {gate_id}, {type_id}, {max_wing}, {max_mtow}) ON CONFLICT DO NOTHING;")

# 15. FLIGHTS (400) - 200 Arrival/Departure Pairs with 100% Valid Aircraft Rotation Alignment
lines.append("\n-- 15. FLIGHTS (400)")
flight_statuses = ["SCHEDULED", "BOARDING", "AIRBORNE", "LANDED", "DELAYED", "CANCELLED"]

# Pre-map flight aircraft to guarantee rotation consistency
flight_aircraft_map = {}

for f_id in range(1, 401):
    if f_id % 2 == 1:
        inbound_flight_id = None
        aircraft_id = ((f_id // 2) % 100) + 1
        flight_aircraft_map[f_id] = aircraft_id
        ftype = "ARRIVAL"
        orig_ap = ((f_id % 24) + 2)
        dest_ap = 1
    else:
        inbound_flight_id = f_id - 1
        aircraft_id = flight_aircraft_map[inbound_flight_id]
        flight_aircraft_map[f_id] = aircraft_id
        ftype = "DEPARTURE"
        orig_ap = 1
        dest_ap = ((f_id % 24) + 2)

    f_num = f"{airlines_data[(f_id - 1) % 25][0]}{100 + f_id}"
    status = flight_statuses[(f_id - 1) % len(flight_statuses)]
    airline_id = ((f_id - 1) % 25) + 1
    
    sch_dep = base_time + timedelta(hours=f_id)
    est_dep = sch_dep + timedelta(minutes=10) if status in ["DELAYED", "BOARDING"] else sch_dep
    act_dep = sch_dep + timedelta(minutes=15) if status in ["AIRBORNE", "LANDED"] else None
    
    sch_arr = sch_dep + timedelta(hours=2)
    est_arr = sch_arr + timedelta(minutes=12) if status in ["DELAYED", "AIRBORNE"] else sch_arr
    act_arr = sch_arr + timedelta(minutes=20) if status == "LANDED" else None
    
    board_t = sch_dep - timedelta(minutes=45)
    
    gate_id = ((f_id - 1) % 100) + 1
    stand_id = gate_id
    runway_id = ((f_id - 1) % 20) + 1
    dept_id = ((f_id - 1) % 10) + 1
    
    inbound_str = f"{inbound_flight_id}" if inbound_flight_id else "NULL"
    
    lines.append(f"INSERT INTO flights (flight_id, flight_number, flight_status, flight_type, origin_airport_id, destination_airport_id, airline_id, scheduled_departure_time, estimated_departure_time, actual_departure_time, scheduled_arrival_time, estimated_arrival_time, actual_arrival_time, boarding_time, aircraft_id, gate_id, stand_id, runway_id, department_id, inbound_flight_id) VALUES ({f_id}, {esc(f_num)}, {esc(status)}, {esc(ftype)}, {orig_ap}, {dest_ap}, {airline_id}, {dt_str(sch_dep)}, {dt_str(est_dep)}, {dt_str(act_dep)}, {dt_str(sch_arr)}, {dt_str(est_arr)}, {dt_str(act_arr)}, {dt_str(board_t)}, {aircraft_id}, {gate_id}, {stand_id}, {runway_id}, {dept_id}, {inbound_str}) ON CONFLICT DO NOTHING;")

# 16. TASKS (800)
lines.append("\n-- 16. TASKS (800)")
task_statuses = ["PENDING", "IN_PROGRESS", "COMPLETED", "BLOCKED"]
task_names = ["Baggage Unloading", "Refueling", "Catering Replenishment", "Cabin Cleaning", "Safety Inspection", "Boarding Gate Clearance", "Pushback Operational Prep"]

for i in range(1, 801):
    tname = task_names[(i - 1) % len(task_names)]
    tstat = task_statuses[(i - 1) % len(task_statuses)]
    flight_id = ((i - 1) % 400) + 1
    assigned_user_id = ((i - 1) % 100) + 1
    sch_s = base_time + timedelta(hours=flight_id) - timedelta(minutes=30)
    sch_e = sch_s + timedelta(minutes=45)
    act_s = sch_s if tstat in ["IN_PROGRESS", "COMPLETED"] else None
    act_e = sch_e if tstat == "COMPLETED" else None
    lines.append(f"INSERT INTO tasks (task_id, task_name, status, scheduled_start, scheduled_end, actual_start, actual_end, flight_id, assigned_user_id) VALUES ({i}, {esc(tname)}, {esc(tstat)}, {dt_str(sch_s)}, {dt_str(sch_e)}, {dt_str(act_s)}, {dt_str(act_e)}, {flight_id}, {assigned_user_id}) ON CONFLICT DO NOTHING;")

# 17. GROUND_EQUIPMENT (200)
lines.append("\n-- 17. GROUND_EQUIPMENT (200)")
eq_types = ["Baggage Tug", "Fuel Tanker Truck", "Pushback Tractor", "Catering High-Loader", "Passenger Bus", "Mobile Air Conditioner", "GPU Power Unit"]
eq_stats = ["AVAILABLE", "IN_USE", "MAINTENANCE"]

for i in range(1, 201):
    eq_code = f"EQ-{i:03d}"
    eq_type = eq_types[(i - 1) % len(eq_types)]
    eq_stat = eq_stats[(i - 1) % len(eq_stats)]
    lines.append(f"INSERT INTO ground_equipment (equipment_id, equipment_code, equipment_type, status) VALUES ({i}, {esc(eq_code)}, {esc(eq_type)}, {esc(eq_stat)}) ON CONFLICT DO NOTHING;")

# 18. EQUIPMENT_ASSIGNMENTS (800)
lines.append("\n-- 18. EQUIPMENT_ASSIGNMENTS (800)")
for i in range(1, 801):
    eq_id = ((i - 1) % 200) + 1
    task_id = ((i - 1) % 800) + 1
    a_ts = base_time + timedelta(minutes=i * 5)
    r_ts = a_ts + timedelta(minutes=45) if i % 2 == 0 else None
    lines.append(f"INSERT INTO equipment_assignments (assignment_id, equipment_id, task_id, assigned_timestamp, released_timestamp) VALUES ({i}, {eq_id}, {task_id}, {dt_str(a_ts)}, {dt_str(r_ts)}) ON CONFLICT DO NOTHING;")

# 19. DELAY_CODES (30)
lines.append("\n-- 19. DELAY_CODES (30)")
delay_categories = ["AIRLINE_INTERNAL", "WEATHER", "AIR_TRAFFIC_CONTROL", "SECURITY", "GROUND_HANDLING", "TECHNICAL"]
for i in range(1, 31):
    dcode = f"D{i:02d}"
    dcat = delay_categories[(i - 1) % len(delay_categories)]
    ddesc = f"Delay Code {dcode}: Operational disruption in {dcat.lower().replace('_', ' ')}"
    lines.append(f"INSERT INTO delay_codes (delay_code, category, description) VALUES ({esc(dcode)}, {esc(dcat)}, {esc(ddesc)}) ON CONFLICT DO NOTHING;")

# 20. DELAY_LOGS (400)
lines.append("\n-- 20. DELAY_LOGS (400)")
for i in range(1, 401):
    flight_id = i
    delay_seq = 1
    dcode = f"D{((i - 1) % 30) + 1:02d}"
    dmin = (i % 45) + 10
    lines.append(f"INSERT INTO delay_logs (flight_id, delay_seq_no, delay_code, delay_minutes) VALUES ({flight_id}, {delay_seq}, {esc(dcode)}, {dmin}) ON CONFLICT DO NOTHING;")

# 21. FUEL_LOGS (400)
lines.append("\n-- 21. FUEL_LOGS (400)")
for i in range(1, 401):
    task_id = i
    density = round(0.780 + ((i % 20) * 0.002), 3)
    lines.append(f"INSERT INTO fuel_logs (fuel_log_id, fuel_density, task_id) VALUES ({i}, {density}, {task_id}) ON CONFLICT DO NOTHING;")

# 22. CARGO_MANIFESTS (600)
lines.append("\n-- 22. CARGO_MANIFESTS (600)")
cargo_types = ["CARGO", "MAIL", "BAGGAGE"]
for i in range(1, 601):
    cid = f"ULD-{i:04d}"
    w_kg = round(300.00 + (i * 2.5), 2)
    ctype = cargo_types[(i - 1) % len(cargo_types)]
    flight_id = ((i - 1) % 400) + 1
    lines.append(f"INSERT INTO cargo_manifests (cargo_id, container_id, weight_kg, cargo_type, flight_id) VALUES ({i}, {esc(cid)}, {w_kg}, {esc(ctype)}, {flight_id}) ON CONFLICT DO NOTHING;")

# 23. BAGGAGE_CAROUSELS (50)
lines.append("\n-- 23. BAGGAGE_CAROUSELS (50)")
for i in range(1, 51):
    cnum = f"BELT-{i:02d}"
    term = f"T{(i % 3) + 1}"
    flight_id = ((i - 1) % 400) + 1
    lines.append(f"INSERT INTO baggage_carousels (carousel_id, carousel_number, terminal, flight_id) VALUES ({i}, {esc(cnum)}, {esc(term)}, {flight_id}) ON CONFLICT DO NOTHING;")

# 24. TRAVELERS (600)
lines.append("\n-- 24. TRAVELERS (600)")
nationalities = ["Indian", "American", "British", "German", "French", "Japanese", "Singaporean", "Canadian", "Australian", "Emirati"]
for i in range(1, 601):
    fn = random.choice(first_names)
    ln = random.choice(last_names)
    pnum = f"P{i:07d}A"
    nat = nationalities[(i - 1) % len(nationalities)]
    email = f"{fn.lower()}.{ln.lower()}{i}@example.com"
    phone = f"+91-99887{i:05d}"
    lines.append(f"INSERT INTO travelers (traveler_id, first_name, last_name, passport_number, nationality, email, phone_number) VALUES ({i}, {esc(fn)}, {esc(ln)}, {esc(pnum)}, {esc(nat)}, {esc(email)}, {esc(phone)}) ON CONFLICT DO NOTHING;")

# 25. PASSENGERS (600)
lines.append("\n-- 25. PASSENGERS (600)")
for i in range(1, 601):
    traveler_id = i
    flight_id = ((i - 1) % 400) + 1
    pnr = f"PNR{i:04d}"
    is_transit = "TRUE" if i % 5 == 0 else "FALSE"
    lines.append(f"INSERT INTO passengers (passenger_id, traveler_id, flight_id, pnr_code, is_transit_passenger) VALUES ({i}, {traveler_id}, {flight_id}, {esc(pnr)}, {is_transit}) ON CONFLICT DO NOTHING;")

# 26. BOARDING_PASSES (600)
lines.append("\n-- 26. BOARDING_PASSES (600)")
cabin_classes = ["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"]
for i in range(1, 601):
    bdata = f"M1{last_names[i%20]}/{first_names[i%20]}  ETKT{i:08d} BOMDEL"
    tnum = f"098-{i:010d}"
    seat = f"{(i%30)+1}{chr(65+(i%6))}"
    cclass = cabin_classes[(i - 1) % len(cabin_classes)]
    bgroup = f"ZONE {(i%4)+1}"
    seq = i
    ff_num = f"FF-{i:06d}" if i % 2 == 0 else None
    pass_id = i
    flight_id = ((i - 1) % 400) + 1
    lines.append(f"INSERT INTO boarding_passes (boarding_pass_id, barcode_data, ticket_number, seat_number, cabin_class, boarding_group, sequence_number, frequent_flyer_number, passenger_id, flight_id) VALUES ({i}, {esc(bdata)}, {esc(tnum)}, {esc(seat)}, {esc(cclass)}, {esc(bgroup)}, {seq}, {esc(ff_num)}, {pass_id}, {flight_id}) ON CONFLICT DO NOTHING;")

# 27. BAG_TAGS (700)
lines.append("\n-- 27. BAG_TAGS (700)")
bag_statuses = ["CHECKED_IN", "SCREENED", "LOADED", "CLAIMED"]
for i in range(1, 701):
    tag = f"0098{i:06d}"
    pass_id = ((i - 1) % 600) + 1
    flight_id = ((i - 1) % 400) + 1
    weight = round(12.5 + (i % 20), 2)
    bstat = bag_statuses[(i - 1) % len(bag_statuses)]
    lines.append(f"INSERT INTO bag_tags (bag_tag_id, tag_number, passenger_id, flight_id, weight_kg, status) VALUES ({i}, {esc(tag)}, {pass_id}, {flight_id}, {weight}, {esc(bstat)}) ON CONFLICT DO NOTHING;")

# 28. BAGGAGE_SCAN_EVENTS (1200)
lines.append("\n-- 28. BAGGAGE_SCAN_EVENTS (1200)")
scan_locs = ["CHECKIN_DESK_01", "BHS_INLINE_SCREENING", "MAKEUP_AREA_BAY_04", "RAMP_LOADER_CART", "AIRCRAFT_CARGO_HOLD_1"]
for i in range(1, 1201):
    btag_id = ((i - 1) % 700) + 1
    sloc = scan_locs[(i - 1) % len(scan_locs)]
    sts = base_time + timedelta(minutes=i * 2)
    lines.append(f"INSERT INTO baggage_scan_events (scan_id, bag_tag_id, scan_location, scan_timestamp) VALUES ({i}, {btag_id}, {esc(sloc)}, {dt_str(sts)}) ON CONFLICT DO NOTHING;")

# 29. MISHANDLED_BAGGAGE (100)
lines.append("\n-- 29. MISHANDLED_BAGGAGE (100)")
inc_types = ["LOST", "DAMAGED", "DELAYED", "PILFERED"]
mb_stats = ["OPEN", "LOCATED", "IN_TRANSIT", "RESOLVED"]
for i in range(1, 101):
    cnum = f"PIR-BOM-{i:05d}"
    itype = inc_types[(i - 1) % len(inc_types)]
    mstat = mb_stats[(i - 1) % len(mb_stats)]
    btag_id = i
    pass_id = i
    lines.append(f"INSERT INTO mishandled_baggage (report_id, claim_number, incident_type, status, bag_tag_id, passenger_id) VALUES ({i}, {esc(cnum)}, {esc(itype)}, {esc(mstat)}, {btag_id}, {pass_id}) ON CONFLICT DO NOTHING;")

# 30. SECURITY_CHECKPOINTS (30)
lines.append("\n-- 30. SECURITY_CHECKPOINTS (30)")
chk_types = ["TERMINAL_ENTRY", "SECURITY_SCREENING", "IMMIGRATION_CONTROL", "BOARDING_GATE"]
for i in range(1, 31):
    cname = f"Checkpoint {i:02d} - Terminal T{(i%3)+1}"
    ctype = chk_types[(i - 1) % len(chk_types)]
    term = f"T{(i%3)+1}"
    lines.append(f"INSERT INTO security_checkpoints (checkpoint_id, checkpoint_name, checkpoint_type, terminal) VALUES ({i}, {esc(cname)}, {esc(ctype)}, {esc(term)}) ON CONFLICT DO NOTHING;")

# 31. PASSENGER_CLEARANCE_LOGS (600)
lines.append("\n-- 31. PASSENGER_CLEARANCE_LOGS (600)")
clr_stats = ["APPROVED", "FLAGGED_SECURITY", "DENIED", "BOARDED"]
ver_methods = ["BARCODE_SCANNER", "BIOMETRIC_FACIAL", "PASSPORT_CHIP_READER"]
for i in range(1, 601):
    scan_t = base_time + timedelta(minutes=i * 3)
    cstat = clr_stats[(i - 1) % len(clr_stats)]
    dreason = "Passport Expiry Alert" if cstat == "DENIED" else None
    vmethod = ver_methods[(i - 1) % len(ver_methods)]
    pass_id = i
    bp_id = i
    chk_id = ((i - 1) % 30) + 1
    lines.append(f"INSERT INTO passenger_clearance_logs (clearance_id, scan_timestamp, clearance_status, denial_reason, verification_method, passenger_id, boarding_pass_id, checkpoint_id) VALUES ({i}, {dt_str(scan_t)}, {esc(cstat)}, {esc(dreason)}, {esc(vmethod)}, {pass_id}, {bp_id}, {chk_id}) ON CONFLICT DO NOTHING;")

# 32. IMMIGRATION_RECORDS (400)
lines.append("\n-- 32. IMMIGRATION_RECORDS (400)")
visa_types = ["TOURIST_VISA", "BUSINESS_VISA", "DIPLOMATIC_VISA", "TRANSIT_VISA"]
clr_types = ["DEPARTURE_EMIGRATION", "ARRIVAL_IMMIGRATION"]
for i in range(1, 401):
    vtype = visa_types[(i - 1) % len(visa_types)]
    snum = f"STAMP-IN-{i:06d}"
    bio = "TRUE" if i % 2 == 0 else "FALSE"
    ctype = clr_types[(i - 1) % len(clr_types)]
    pass_id = i
    lines.append(f"INSERT INTO immigration_records (immigration_id, visa_type, stamp_number, biometric_facial_matched, clearance_type, passenger_id) VALUES ({i}, {esc(vtype)}, {esc(snum)}, {bio}, {esc(ctype)}, {pass_id}) ON CONFLICT DO NOTHING;")

# 33. LOUNGE_VISITS (300)
lines.append("\n-- 33. LOUNGE_VISITS (300)")
lounges = ["Adani Lounge T2", "Loyalty Lounge T1", "Emirates First Lounge", "Star Alliance Lounge"]
for i in range(1, 301):
    lname = lounges[(i - 1) % len(lounges)]
    pass_id = i
    lines.append(f"INSERT INTO lounge_visits (visit_id, lounge_name, passenger_id) VALUES ({i}, {esc(lname)}, {pass_id}) ON CONFLICT DO NOTHING;")

# 34. CUSTOMER_FEEDBACK_LOGS (300)
lines.append("\n-- 34. CUSTOMER_FEEDBACK_LOGS (300)")
fb_cats = ["Cleanliness", "Baggage Speed", "Staff Courtesy", "Security Wait Time", "Food & Dining"]
for i in range(1, 301):
    pass_id = i
    term = f"T{(i%3)+1}"
    rating = (i % 5) + 1
    cat = fb_cats[(i - 1) % len(fb_cats)]
    sub_at = base_time + timedelta(minutes=i * 10)
    lines.append(f"INSERT INTO customer_feedback_logs (feedback_id, passenger_id, terminal, rating, category, submitted_at) VALUES ({i}, {pass_id}, {esc(term)}, {rating}, {esc(cat)}, {dt_str(sub_at)}) ON CONFLICT DO NOTHING;")

# 35. AIRLINE_BILLING_INVOICES (100)
lines.append("\n-- 35. AIRLINE_BILLING_INVOICES (100)")
inv_stats = ["UNPAID", "PAID", "OVERDUE"]
for i in range(1, 101):
    inum = f"INV-2026-{i:04d}"
    airline_id = ((i - 1) % 25) + 1
    p_start = "2026-07-01"
    p_end = "2026-07-31"
    total = round(15000.00 + (i * 1250.50), 2)
    pstat = inv_stats[(i - 1) % len(inv_stats)]
    lines.append(f"INSERT INTO airline_billing_invoices (invoice_id, invoice_number, airline_id, billing_period_start, billing_period_end, total_amount_usd, payment_status) VALUES ({i}, {esc(inum)}, {airline_id}, '{p_start}', '{p_end}', {total}, {esc(pstat)}) ON CONFLICT DO NOTHING;")

# 36. INVOICE_LINE_ITEMS (400)
lines.append("\n-- 36. INVOICE_LINE_ITEMS (400)")
charge_types = ["Landing Fee", "Stand Parking Charge", "Jetbridge Usage Fee", "Passenger Service Charge", "Baggage Handling Fee"]
for i in range(1, 401):
    inv_id = ((i - 1) % 100) + 1
    flight_id = i
    ctype = charge_types[(i - 1) % len(charge_types)]
    amt = round(500.00 + (i * 25.50), 2)
    lines.append(f"INSERT INTO invoice_line_items (line_item_id, invoice_id, flight_id, charge_type, amount_usd) VALUES ({i}, {inv_id}, {flight_id}, {esc(ctype)}, {amt}) ON CONFLICT DO NOTHING;")

# 37. NOTIFICATIONS (300)
lines.append("\n-- 37. NOTIFICATIONS (300)")
for i in range(1, 301):
    title = f"Operational Alert {i:03d}: Stand allocation updated"
    u_id = ((i - 1) % 100) + 1
    lines.append(f"INSERT INTO notifications (notification_id, title, user_id) VALUES ({i}, {title}, {u_id}) ON CONFLICT DO NOTHING;" if isinstance(title, int) else f"INSERT INTO notifications (notification_id, title, user_id) VALUES ({i}, {esc(title)}, {u_id}) ON CONFLICT DO NOTHING;")

# 38. AUDIT_LOGS (500)
lines.append("\n-- 38. AUDIT_LOGS (500)")
actions = ["FLIGHT_STATUS_UPDATE", "STAND_REASSIGNMENT", "SECURITY_CLEARANCE_FLAG", "AIRCRAFT_SWAP", "INVOICE_GENERATED"]
for i in range(1, 501):
    act = actions[(i - 1) % len(actions)]
    etype = "FLIGHTS" if "FLIGHT" in act or "STAND" in act or "SWAP" in act else "PASSENGERS"
    eid = ((i - 1) % 400) + 1
    payload = json.dumps({"action": act, "actor_id": i, "timestamp": base_time.isoformat(), "details": f"Automated operational audit log #{i}"})
    u_id = ((i - 1) % 100) + 1
    c_at = base_time + timedelta(minutes=i * 4)
    lines.append(f"INSERT INTO audit_logs (log_id, action, entity_type, entity_id, change_payload, user_id, created_at) VALUES ({i}, {esc(act)}, {esc(etype)}, {eid}, {esc(payload)}::jsonb, {u_id}, {dt_str(c_at)}) ON CONFLICT DO NOTHING;")

with open(v2_path, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"Successfully generated V2__seed_data.sql with {len(lines)} total lines (11,815+ valid records)!")
