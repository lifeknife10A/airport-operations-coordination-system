import os

mig_dir = "/Users/krish/Desktop/Software Engineering/Mini Project/db/migration"
v1_path = os.path.join(mig_dir, "V1__initial_schema.sql")
v2_path = os.path.join(mig_dir, "V2__seed_data.sql")

# 1. WRITE V1__initial_schema.sql (EXACT 38 COMPLETE 3NF/BCNF TABLES)
v1_sql = """-- ============================================================
-- AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
-- PostgreSQL 18 Initial Database Schema (Flyway V1 Migration)
-- Author: Krishna Solanki & AOCS Engineering Team
-- Complete 38-Table Production Architecture (Fully Audited & Un-bypassable Legal Retention)
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

-- 5. AIRLINES TABLE
CREATE TABLE IF NOT EXISTS airlines (
    airline_id BIGSERIAL PRIMARY KEY,
    iata_code VARCHAR(10) NOT NULL UNIQUE,
    icao_code VARCHAR(10) NOT NULL UNIQUE,
    airline_name VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL
);

-- 6. AIRPORTS TABLE
CREATE TABLE IF NOT EXISTS airports (
    airport_id BIGSERIAL PRIMARY KEY,
    iata_code VARCHAR(10) NOT NULL UNIQUE,
    icao_code VARCHAR(10) NOT NULL UNIQUE,
    airport_name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC'
);

-- 7. AIRCRAFT_TYPES TABLE (Master Aircraft Category & Physical Specs)
CREATE TABLE IF NOT EXISTS aircraft_types (
    type_id BIGSERIAL PRIMARY KEY,
    type_code VARCHAR(20) NOT NULL UNIQUE,
    manufacturer VARCHAR(50) NOT NULL,
    model_name VARCHAR(50) NOT NULL,
    wingspan_meters NUMERIC(5,2) NOT NULL CHECK (wingspan_meters > 0),
    mtow_kg NUMERIC(10,2) NOT NULL CHECK (mtow_kg > 0),
    max_passenger_capacity INT NOT NULL CHECK (max_passenger_capacity > 0)
);

-- 8. AIRCRAFT TABLE
CREATE TABLE IF NOT EXISTS aircraft (
    aircraft_id BIGSERIAL PRIMARY KEY,
    registration_number VARCHAR(20) NOT NULL UNIQUE,
    type_id BIGINT NOT NULL REFERENCES aircraft_types(type_id) ON DELETE RESTRICT,
    airline_id BIGINT NOT NULL REFERENCES airlines(airline_id) ON DELETE RESTRICT
);

-- 9. GATES TABLE
CREATE TABLE IF NOT EXISTS gates (
    gate_id BIGSERIAL PRIMARY KEY,
    gate_number VARCHAR(10) NOT NULL UNIQUE
);

-- 10. CHECKIN_COUNTERS TABLE
CREATE TABLE IF NOT EXISTS checkin_counters (
    counter_id BIGSERIAL PRIMARY KEY,
    counter_number VARCHAR(20) NOT NULL UNIQUE,
    terminal VARCHAR(10) NOT NULL,
    allocated_airline_id BIGINT REFERENCES airlines(airline_id) ON DELETE SET NULL
);

-- 11. STANDS TABLE
CREATE TABLE IF NOT EXISTS stands (
    stand_id BIGSERIAL PRIMARY KEY,
    stand_number VARCHAR(20) NOT NULL UNIQUE,
    is_remote BOOLEAN NOT NULL DEFAULT FALSE,
    has_jetbridge BOOLEAN NOT NULL DEFAULT TRUE,
    assigned_gate_id BIGINT REFERENCES gates(gate_id) ON DELETE SET NULL
);

-- 12. RUNWAYS TABLE
CREATE TABLE IF NOT EXISTS runways (
    runway_id BIGSERIAL PRIMARY KEY,
    runway_code VARCHAR(10) NOT NULL UNIQUE
);

-- 13. WEATHER_REPORTS TABLE
CREATE TABLE IF NOT EXISTS weather_reports (
    report_id BIGSERIAL PRIMARY KEY,
    visibility_meters INT NOT NULL CHECK (visibility_meters >= 0),
    wind_speed_knots INT NOT NULL CHECK (wind_speed_knots >= 0),
    temperature_celsius NUMERIC(4,1) NOT NULL,
    runway_condition VARCHAR(20) NOT NULL DEFAULT 'DRY' CHECK (runway_condition IN ('DRY', 'WET', 'FOG', 'HEAVY_RAIN')),
    observation_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 14. GATE_ASSIGNMENT_RULES TABLE (Strict 3NF: Only FK to AIRCRAFT_TYPES)
CREATE TABLE IF NOT EXISTS gate_assignment_rules (
    rule_id BIGSERIAL PRIMARY KEY,
    gate_id BIGINT NOT NULL REFERENCES gates(gate_id) ON DELETE CASCADE,
    type_id BIGINT NOT NULL REFERENCES aircraft_types(type_id) ON DELETE CASCADE,
    max_wingspan_meters NUMERIC(5,2) NOT NULL CHECK (max_wingspan_meters > 0),
    max_weight_mtow_kg NUMERIC(10,2) NOT NULL CHECK (max_weight_mtow_kg > 0)
);

-- 15. FLIGHTS TABLE
CREATE TABLE IF NOT EXISTS flights (
    flight_id BIGSERIAL PRIMARY KEY,
    flight_number VARCHAR(10) NOT NULL,
    flight_status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED' CHECK (flight_status IN ('SCHEDULED', 'BOARDING', 'AIRBORNE', 'LANDED', 'DELAYED', 'CANCELLED')),
    flight_type VARCHAR(15) NOT NULL DEFAULT 'DEPARTURE' CHECK (flight_type IN ('DEPARTURE', 'ARRIVAL')),
    origin_airport_id BIGINT NOT NULL REFERENCES airports(airport_id) ON DELETE RESTRICT,
    destination_airport_id BIGINT NOT NULL REFERENCES airports(airport_id) ON DELETE RESTRICT,
    airline_id BIGINT NOT NULL REFERENCES airlines(airline_id) ON DELETE RESTRICT,
    scheduled_departure_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actual_departure_time TIMESTAMPTZ,
    scheduled_arrival_time TIMESTAMPTZ NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '2 hours'),
    actual_arrival_time TIMESTAMPTZ,
    boarding_time TIMESTAMPTZ,
    aircraft_id BIGINT NOT NULL REFERENCES aircraft(aircraft_id) ON DELETE RESTRICT,
    gate_id BIGINT REFERENCES gates(gate_id) ON DELETE SET NULL,
    stand_id BIGINT REFERENCES stands(stand_id) ON DELETE SET NULL,
    runway_id BIGINT REFERENCES runways(runway_id) ON DELETE SET NULL,
    department_id BIGINT REFERENCES departments(department_id) ON DELETE SET NULL
);

-- 16. TASKS TABLE (Enhanced with SLA Timestamps)
CREATE TABLE IF NOT EXISTS tasks (
    task_id BIGSERIAL PRIMARY KEY,
    task_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED')),
    scheduled_start TIMESTAMPTZ,
    scheduled_end TIMESTAMPTZ,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE,
    assigned_user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL
);

-- 17. GROUND_EQUIPMENT TABLE
CREATE TABLE IF NOT EXISTS ground_equipment (
    equipment_id BIGSERIAL PRIMARY KEY,
    equipment_code VARCHAR(20) NOT NULL UNIQUE,
    equipment_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'IN_USE', 'MAINTENANCE'))
);

-- 18. EQUIPMENT_ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS equipment_assignments (
    assignment_id BIGSERIAL PRIMARY KEY,
    equipment_id BIGINT NOT NULL REFERENCES ground_equipment(equipment_id) ON DELETE CASCADE,
    task_id BIGINT NOT NULL REFERENCES tasks(task_id) ON DELETE CASCADE,
    assigned_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    released_timestamp TIMESTAMPTZ
);

-- 19. DELAY_CODES TABLE (Master IATA Delay Code Directory)
CREATE TABLE IF NOT EXISTS delay_codes (
    delay_code VARCHAR(10) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL
);

-- 20. DELAY_LOGS TABLE (Normalized with FK to DELAY_CODES)
CREATE TABLE IF NOT EXISTS delay_logs (
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE,
    delay_seq_no INT NOT NULL CHECK (delay_seq_no > 0),
    delay_code VARCHAR(10) NOT NULL REFERENCES delay_codes(delay_code) ON DELETE RESTRICT,
    delay_minutes INT NOT NULL CHECK (delay_minutes >= 0),
    PRIMARY KEY (flight_id, delay_seq_no)
);

-- 21. FUEL_LOGS TABLE
CREATE TABLE IF NOT EXISTS fuel_logs (
    fuel_log_id BIGSERIAL PRIMARY KEY,
    fuel_density NUMERIC(6,3) NOT NULL CHECK (fuel_density > 0),
    task_id BIGINT NOT NULL REFERENCES tasks(task_id) ON DELETE RESTRICT
);

-- 22. CARGO_MANIFESTS TABLE (Fixed: Direct FLIGHTS Link)
CREATE TABLE IF NOT EXISTS cargo_manifests (
    cargo_id BIGSERIAL PRIMARY KEY,
    container_id VARCHAR(30) NOT NULL,
    weight_kg NUMERIC(8,2) NOT NULL DEFAULT 500.00 CHECK (weight_kg > 0),
    cargo_type VARCHAR(20) NOT NULL DEFAULT 'CARGO' CHECK (cargo_type IN ('CARGO', 'MAIL', 'BAGGAGE')),
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE
);

-- 23. BAGGAGE_CAROUSELS TABLE
CREATE TABLE IF NOT EXISTS baggage_carousels (
    carousel_id BIGSERIAL PRIMARY KEY,
    terminal VARCHAR(10) NOT NULL,
    flight_id BIGINT REFERENCES flights(flight_id) ON DELETE SET NULL
);

-- 24. TRAVELERS TABLE (Master Traveler Entity - 3NF Person Level Uniqueness)
CREATE TABLE IF NOT EXISTS travelers (
    traveler_id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    passport_number VARCHAR(20) NOT NULL UNIQUE,
    nationality VARCHAR(50) NOT NULL DEFAULT 'IND',
    email VARCHAR(100),
    phone_number VARCHAR(30)
);

-- 25. PASSENGERS TABLE (Flight Segment Instance - Unique traveler_id + flight_id)
CREATE TABLE IF NOT EXISTS passengers (
    passenger_id BIGSERIAL PRIMARY KEY,
    traveler_id BIGINT NOT NULL REFERENCES travelers(traveler_id) ON DELETE RESTRICT,
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE RESTRICT,
    pnr_code VARCHAR(10) NOT NULL,
    is_transit_passenger BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (traveler_id, flight_id)
);

-- 26. BOARDING_PASSES TABLE
CREATE TABLE IF NOT EXISTS boarding_passes (
    boarding_pass_id BIGSERIAL PRIMARY KEY,
    barcode_data VARCHAR(255) NOT NULL UNIQUE,
    ticket_number VARCHAR(30) NOT NULL UNIQUE,
    seat_number VARCHAR(10) NOT NULL,
    cabin_class VARCHAR(20) NOT NULL DEFAULT 'ECONOMY' CHECK (cabin_class IN ('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST')),
    boarding_group VARCHAR(10) NOT NULL DEFAULT 'ZONE 1',
    sequence_number INT NOT NULL CHECK (sequence_number > 0),
    frequent_flyer_number VARCHAR(30),
    passenger_id BIGINT NOT NULL REFERENCES passengers(passenger_id) ON DELETE CASCADE,
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE
);

-- 27. BAG_TAGS TABLE
CREATE TABLE IF NOT EXISTS bag_tags (
    bag_tag_id BIGSERIAL PRIMARY KEY,
    tag_number VARCHAR(20) NOT NULL UNIQUE,
    passenger_id BIGINT NOT NULL REFERENCES passengers(passenger_id) ON DELETE CASCADE,
    flight_id BIGINT NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE,
    weight_kg NUMERIC(5,2) NOT NULL CHECK (weight_kg > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'CHECKED_IN' CHECK (status IN ('CHECKED_IN', 'SCREENED', 'LOADED', 'CLAIMED'))
);

-- 28. BAGGAGE_SCAN_EVENTS TABLE
CREATE TABLE IF NOT EXISTS baggage_scan_events (
    scan_id BIGSERIAL PRIMARY KEY,
    bag_tag_id BIGINT NOT NULL REFERENCES bag_tags(bag_tag_id) ON DELETE CASCADE,
    scan_location VARCHAR(100) NOT NULL,
    scan_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 29. MISHANDLED_BAGGAGE TABLE
CREATE TABLE IF NOT EXISTS mishandled_baggage (
    report_id BIGSERIAL PRIMARY KEY,
    claim_number VARCHAR(50) NOT NULL UNIQUE,
    incident_type VARCHAR(30) NOT NULL CHECK (incident_type IN ('LOST', 'DAMAGED', 'DELAYED', 'PILFERED')),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'LOCATED', 'IN_TRANSIT', 'RESOLVED')),
    bag_tag_id BIGINT NOT NULL REFERENCES bag_tags(bag_tag_id) ON DELETE CASCADE,
    passenger_id BIGINT NOT NULL REFERENCES passengers(passenger_id) ON DELETE CASCADE
);

-- 30. SECURITY_CHECKPOINTS TABLE
CREATE TABLE IF NOT EXISTS security_checkpoints (
    checkpoint_id BIGSERIAL PRIMARY KEY,
    checkpoint_name VARCHAR(100) NOT NULL UNIQUE,
    checkpoint_type VARCHAR(30) NOT NULL CHECK (checkpoint_type IN ('TERMINAL_ENTRY', 'SECURITY_SCREENING', 'IMMIGRATION_CONTROL', 'BOARDING_GATE')),
    terminal VARCHAR(10) NOT NULL
);

-- 31. PASSENGER_CLEARANCE_LOGS TABLE (Un-bypassable Legal Retention - RESTRICT on ALL edges)
CREATE TABLE IF NOT EXISTS passenger_clearance_logs (
    clearance_id BIGSERIAL PRIMARY KEY,
    scan_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    clearance_status VARCHAR(25) NOT NULL DEFAULT 'APPROVED' CHECK (clearance_status IN ('APPROVED', 'FLAGGED_SECURITY', 'DENIED', 'BOARDED')),
    denial_reason VARCHAR(100),
    verification_method VARCHAR(30) NOT NULL CHECK (verification_method IN ('BARCODE_SCANNER', 'BIOMETRIC_FACIAL', 'PASSPORT_CHIP_READER')),
    passenger_id BIGINT NOT NULL REFERENCES passengers(passenger_id) ON DELETE RESTRICT,
    boarding_pass_id BIGINT NOT NULL REFERENCES boarding_passes(boarding_pass_id) ON DELETE RESTRICT,
    checkpoint_id BIGINT NOT NULL REFERENCES security_checkpoints(checkpoint_id) ON DELETE RESTRICT
);

-- 32. IMMIGRATION_RECORDS TABLE (Un-bypassable Legal Border Retention - RESTRICT on Passenger)
CREATE TABLE IF NOT EXISTS immigration_records (
    immigration_id BIGSERIAL PRIMARY KEY,
    passport_number VARCHAR(20) NOT NULL,
    visa_type VARCHAR(30) NOT NULL DEFAULT 'TOURIST_VISA',
    stamp_number VARCHAR(50) NOT NULL UNIQUE,
    biometric_facial_matched BOOLEAN NOT NULL DEFAULT TRUE,
    clearance_type VARCHAR(30) NOT NULL CHECK (clearance_type IN ('DEPARTURE_EMIGRATION', 'ARRIVAL_IMMIGRATION')),
    passenger_id BIGINT NOT NULL REFERENCES passengers(passenger_id) ON DELETE RESTRICT
);

-- 33. LOUNGE_VISITS TABLE
CREATE TABLE IF NOT EXISTS lounge_visits (
    visit_id BIGSERIAL PRIMARY KEY,
    lounge_name VARCHAR(100) NOT NULL,
    passenger_id BIGINT NOT NULL REFERENCES passengers(passenger_id) ON DELETE CASCADE
);

-- 34. CUSTOMER_FEEDBACK_LOGS TABLE
CREATE TABLE IF NOT EXISTS customer_feedback_logs (
    feedback_id BIGSERIAL PRIMARY KEY,
    passenger_id BIGINT REFERENCES passengers(passenger_id) ON DELETE SET NULL,
    terminal VARCHAR(10) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    category VARCHAR(50) NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 35. AIRLINE_BILLING_INVOICES TABLE
CREATE TABLE IF NOT EXISTS airline_billing_invoices (
    invoice_id BIGSERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    airline_id BIGINT NOT NULL REFERENCES airlines(airline_id) ON DELETE RESTRICT,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    total_amount_usd NUMERIC(12,2) NOT NULL CHECK (total_amount_usd >= 0),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'UNPAID' CHECK (payment_status IN ('UNPAID', 'PAID', 'OVERDUE'))
);

-- 36. INVOICE_LINE_ITEMS TABLE
CREATE TABLE IF NOT EXISTS invoice_line_items (
    line_item_id BIGSERIAL PRIMARY KEY,
    invoice_id BIGINT NOT NULL REFERENCES airline_billing_invoices(invoice_id) ON DELETE CASCADE,
    charge_type VARCHAR(50) NOT NULL,
    amount_usd NUMERIC(10,2) NOT NULL CHECK (amount_usd >= 0)
);

-- 37. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
);

-- 38. AUDIT_LOGS TABLE (Immutable Security Trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id BIGSERIAL PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SQL VIEW FOR SOFT-COPY & HARDCOPY BOARDING PASS PRINTING
-- ============================================================
CREATE OR REPLACE VIEW vw_boarding_pass_print_details AS
SELECT 
    bp.boarding_pass_id,
    bp.ticket_number,
    p.pnr_code,
    (tr.last_name || ' / ' || tr.first_name) AS passenger_name,
    tr.passport_number,
    tr.nationality,
    p.is_transit_passenger,
    f.flight_number,
    al.airline_name,
    al.iata_code AS airline_iata,
    orig.city || ' (' || orig.iata_code || ')' AS origin_airport,
    dest.city || ' (' || dest.iata_code || ')' AS destination_airport,
    g.gate_number,
    st.stand_number,
    st.is_remote AS is_remote_stand,
    bp.seat_number,
    bp.cabin_class,
    bp.boarding_group,
    bp.sequence_number,
    bp.frequent_flyer_number,
    f.boarding_time,
    f.scheduled_departure_time,
    f.scheduled_arrival_time,
    ac.registration_number AS aircraft_tail_number,
    act.type_code AS aircraft_type,
    bp.barcode_data
FROM boarding_passes bp
JOIN passengers p ON bp.passenger_id = p.passenger_id
JOIN travelers tr ON p.traveler_id = tr.traveler_id
JOIN flights f ON bp.flight_id = f.flight_id
JOIN airlines al ON f.airline_id = al.airline_id
JOIN airports orig ON f.origin_airport_id = orig.airport_id
JOIN airports dest ON f.destination_airport_id = dest.airport_id
LEFT JOIN gates g ON f.gate_id = g.gate_id
LEFT JOIN stands st ON f.stand_id = st.stand_id
LEFT JOIN aircraft ac ON f.aircraft_id = ac.aircraft_id
LEFT JOIN aircraft_types act ON ac.type_id = act.type_id;

-- INDEXES FOR HIGH-THROUGHPUT PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_dept ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_aircraft_type ON aircraft(type_id);
CREATE INDEX IF NOT EXISTS idx_aircraft_airline ON aircraft(airline_id);
CREATE INDEX IF NOT EXISTS idx_flights_airline ON flights(airline_id);
CREATE INDEX IF NOT EXISTS idx_flights_airports ON flights(origin_airport_id, destination_airport_id);
CREATE INDEX IF NOT EXISTS idx_tasks_flight ON tasks(flight_id);
CREATE INDEX IF NOT EXISTS idx_passengers_traveler ON passengers(traveler_id);
CREATE INDEX IF NOT EXISTS idx_passengers_flight ON passengers(flight_id);
CREATE INDEX IF NOT EXISTS idx_passengers_pnr ON passengers(pnr_code);
CREATE INDEX IF NOT EXISTS idx_travelers_passport ON travelers(passport_number);
CREATE INDEX IF NOT EXISTS idx_boarding_passes_ticket ON boarding_passes(ticket_number);
CREATE INDEX IF NOT EXISTS idx_bag_tags_pass ON bag_tags(passenger_id);
CREATE INDEX IF NOT EXISTS idx_bag_scans_tag ON baggage_scan_events(bag_tag_id);
CREATE INDEX IF NOT EXISTS idx_cargo_flight ON cargo_manifests(flight_id);
CREATE INDEX IF NOT EXISTS idx_mishandled_bag_tag ON mishandled_baggage(bag_tag_id);
CREATE INDEX IF NOT EXISTS idx_invoices_airline ON airline_billing_invoices(airline_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
"""

with open(v1_path, "w", encoding="utf-8") as f:
    f.write(v1_sql)

print(f"Successfully updated {v1_path} with 38 normalized tables!")

# 2. GENERATE V2__seed_data.sql WITH 3,800+ UNIQUE RECORDS
lines = [
    "-- ============================================================",
    "-- AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)",
    "-- Complete 38-Table Master Hybrid Seed Dataset (3,800+ Unique Rows)",
    "-- Includes Un-bypassable Legal Retention (RESTRICT on ALL Security Edges)",
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

# 3. USERS (150) & USER_PHONE_NUMBERS (150)
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

# 5. AIRLINES (12)
lines.append("-- 5. AIRLINES (12)")
airlines_list = [
    (1, "AI", "AIC", "Air India", "India"),
    (2, "6E", "IGO", "IndiGo Airlines", "India"),
    (3, "UK", "VTI", "Vistara", "India"),
    (4, "QP", "AKJ", "Akasa Air", "India"),
    (5, "SG", "SEJ", "SpiceJet", "India"),
    (6, "EK", "UAE", "Emirates", "United Arab Emirates"),
    (7, "BA", "BAW", "British Airways", "United Kingdom"),
    (8, "SQ", "SIA", "Singapore Airlines", "Singapore"),
    (9, "QR", "QTR", "Qatar Airways", "Qatar"),
    (10, "LH", "DLH", "Lufthansa", "Germany"),
    (11, "UA", "UAL", "United Airlines", "United States"),
    (12, "DL", "DAL", "Delta Air Lines", "United States")
]
for al_id, iata, icao, aname, ctry in airlines_list:
    lines.append(f"INSERT INTO airlines (airline_id, iata_code, icao_code, airline_name, country) VALUES ({al_id}, '{iata}', '{icao}', '{aname}', '{ctry}') ON CONFLICT DO NOTHING;")
lines.append("")

# 6. AIRPORTS (12)
lines.append("-- 6. AIRPORTS (12)")
airports_list = [
    (1, "DEL", "VIDP", "Indira Gandhi International Airport", "New Delhi", "India", "Asia/Kolkata"),
    (2, "BOM", "VABB", "Chhatrapati Shivaji Maharaj International Airport", "Mumbai", "India", "Asia/Kolkata"),
    (3, "BLR", "VOBL", "Kempegowda International Airport", "Bengaluru", "India", "Asia/Kolkata"),
    (4, "MAA", "VOMM", "Chennai International Airport", "Chennai", "India", "Asia/Kolkata"),
    (5, "CCU", "VECC", "Netaji Subhash Chandra Bose International Airport", "Kolkata", "India", "Asia/Kolkata"),
    (6, "HYD", "VOHS", "Rajiv Gandhi International Airport", "Hyderabad", "India", "Asia/Kolkata"),
    (7, "DXB", "OMDB", "Dubai International Airport", "Dubai", "United Arab Emirates", "Asia/Dubai"),
    (8, "LHR", "EGLL", "London Heathrow Airport", "London", "United Kingdom", "Europe/London"),
    (9, "JFK", "KJFK", "John F. Kennedy International Airport", "New York", "United States", "America/New_York"),
    (10, "SIN", "WSSS", "Singapore Changi Airport", "Singapore", "Singapore", "Asia/Singapore"),
    (11, "FRA", "EDDF", "Frankfurt Airport", "Frankfurt", "Germany", "Europe/Berlin"),
    (12, "HND", "RJTT", "Tokyo Haneda Airport", "Tokyo", "Japan", "Asia/Tokyo")
]
for ap_id, iata, icao, apname, city, ctry, tz in airports_list:
    lines.append(f"INSERT INTO airports (airport_id, iata_code, icao_code, airport_name, city, country, timezone) VALUES ({ap_id}, '{iata}', '{icao}', '{apname}', '{city}', '{ctry}', '{tz}') ON CONFLICT DO NOTHING;")
lines.append("")

# 7. AIRCRAFT_TYPES (5)
lines.append("-- 7. AIRCRAFT_TYPES (5)")
act_list = [
    (1, "A320NEO", "Airbus", "A320neo", 35.80, 79000.00, 186),
    (2, "B737MAX8", "Boeing", "737 MAX 8", 35.90, 82200.00, 189),
    (3, "B777300ER", "Boeing", "777-300ER", 64.80, 351500.00, 396),
    (4, "A3501000", "Airbus", "A350-1000", 64.75, 319000.00, 410),
    (5, "A380800", "Airbus", "A380-800", 79.75, 575000.00, 615)
]
for tid, tcode, mfr, mname, wspan, mtow, cap in act_list:
    lines.append(f"INSERT INTO aircraft_types (type_id, type_code, manufacturer, model_name, wingspan_meters, mtow_kg, max_passenger_capacity) VALUES ({tid}, '{tcode}', '{mfr}', '{mname}', {wspan:.2f}, {mtow:.2f}, {cap}) ON CONFLICT DO NOTHING;")
lines.append("")

# 8. AIRCRAFT (100)
lines.append("-- 8. AIRCRAFT (100)")
aircraft_list = []
for i in range(1, 61):
    code = f"VT-A{i:03d}"
    tid = ((i - 1) % 5) + 1
    al_id = ((i - 1) % 5) + 1
    aircraft_list.append((i, code, tid, al_id))

intl_prefixes = ["A6-E", "G-X", "9V-S", "N7"]
for i in range(61, 101):
    pref = intl_prefixes[(i - 61) % len(intl_prefixes)]
    code = f"{pref}{i:03d}"
    tid = ((i - 1) % 5) + 1
    al_id = 6 + ((i - 61) % 7)
    aircraft_list.append((i, code, tid, al_id))

for aid, reg, tid, al_id in aircraft_list:
    lines.append(f"INSERT INTO aircraft (aircraft_id, registration_number, type_id, airline_id) VALUES ({aid}, '{reg}', {tid}, {al_id}) ON CONFLICT DO NOTHING;")
lines.append("")

# 9. GATES (60)
lines.append("-- 9. GATES (60)")
for i in range(1, 61):
    gn = f"A{i:02d}" if i <= 20 else (f"B{i-20:02d}" if i <= 40 else f"C{i-40:02d}")
    lines.append(f"INSERT INTO gates (gate_id, gate_number) VALUES ({i}, '{gn}') ON CONFLICT DO NOTHING;")
lines.append("")

# 10. CHECKIN_COUNTERS (40)
lines.append("-- 10. CHECKIN_COUNTERS (40)")
for i in range(1, 41):
    term = "T3" if i <= 20 else ("T2" if i <= 30 else "T1")
    cnum = f"{term}-CTR-{i:02d}"
    al_id = ((i - 1) % 12) + 1
    lines.append(f"INSERT INTO checkin_counters (counter_id, counter_number, terminal, allocated_airline_id) VALUES ({i}, '{cnum}', '{term}', {al_id}) ON CONFLICT DO NOTHING;")
lines.append("")

# 11. STANDS (60)
lines.append("-- 11. STANDS (60)")
for i in range(1, 61):
    snum = f"STAND-{i:02d}"
    is_rem = True if (i % 3 == 0) else False
    has_jb = False if is_rem else True
    gid = i
    lines.append(f"INSERT INTO stands (stand_id, stand_number, is_remote, has_jetbridge, assigned_gate_id) VALUES ({i}, '{snum}', {is_rem}, {has_jb}, {gid}) ON CONFLICT DO NOTHING;")
lines.append("")

# 12. RUNWAYS (12)
lines.append("-- 12. RUNWAYS (12)")
rw_codes = ["09L", "09R", "27L", "27R", "10L", "10R", "28L", "28R", "14L", "32R", "11L", "29R"]
for idx, rcode in enumerate(rw_codes, 1):
    lines.append(f"INSERT INTO runways (runway_id, runway_code) VALUES ({idx}, '{rcode}') ON CONFLICT DO NOTHING;")
lines.append("")

# 13. WEATHER_REPORTS (30)
lines.append("-- 13. WEATHER_REPORTS (30)")
r_conds = ["DRY", "WET", "FOG", "HEAVY_RAIN"]
for i in range(1, 31):
    vis = (i * 300) % 9000 + 1000
    wspd = (i * 3) % 25 + 5
    temp = 22.5 + (i % 10) * 0.8
    rcond = r_conds[(i - 1) % len(r_conds)]
    h = (i * 2) % 24
    lines.append(f"INSERT INTO weather_reports (report_id, visibility_meters, wind_speed_knots, temperature_celsius, runway_condition, observation_time) VALUES ({i}, {vis}, {wspd}, {temp:.1f}, '{rcond}', '2026-07-27 {h:02d}:00:00+05:30') ON CONFLICT DO NOTHING;")
lines.append("")

# 14. GATE_ASSIGNMENT_RULES (60)
lines.append("-- 14. GATE_ASSIGNMENT_RULES (60)")
for i in range(1, 61):
    gid = i
    tid = ((i - 1) % 5) + 1
    wingspan = 35.8 + (tid * 8.0)
    mtow = 79000.0 + (tid * 60000.0)
    lines.append(f"INSERT INTO gate_assignment_rules (rule_id, gate_id, type_id, max_wingspan_meters, max_weight_mtow_kg) VALUES ({i}, {gid}, {tid}, {wingspan:.2f}, {mtow:.2f}) ON CONFLICT DO NOTHING;")
lines.append("")

# 15. FLIGHTS (200)
lines.append("-- 15. FLIGHTS (200)")
statuses = ["SCHEDULED", "BOARDING", "AIRBORNE", "LANDED", "DELAYED", "CANCELLED"]

flights_data = []
nat_carriers = [1, 2, 3, 4, 5]
nat_f_prefixes = ["AI", "6E", "UK", "QP", "SG"]
for i in range(1, 121):
    c_idx = (i - 1) % 5
    al_id = nat_carriers[c_idx]
    fnum = f"{nat_f_prefixes[c_idx]}{100 + i}"
    st = statuses[(i - 1) % len(statuses)]
    ftype = "DEPARTURE" if (i % 2 == 1) else "ARRIVAL"
    orig_ap = 1 if ftype == "DEPARTURE" else (((i % 5) + 2))
    dest_ap = (((i % 5) + 2)) if ftype == "DEPARTURE" else 1
    
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
    stid = ((i - 1) % 60) + 1
    rwid = ((i - 1) % 12) + 1
    deptid = ((i - 1) % 8) + 1
    
    flights_data.append((i, fnum, st, ftype, orig_ap, dest_ap, al_id, sch_dep, act_dep, sch_arr, act_arr, brd_time, acid, gid, stid, rwid, deptid))

intl_carriers = [6, 7, 8, 9, 10, 11, 12]
intl_f_prefixes = ["EK", "BA", "SQ", "QR", "LH", "UA", "DL"]
for i in range(121, 201):
    c_idx = (i - 121) % 7
    al_id = intl_carriers[c_idx]
    fnum = f"{intl_f_prefixes[c_idx]}{500 + i}"
    st = statuses[(i - 121) % len(statuses)]
    ftype = "DEPARTURE" if (i % 2 == 1) else "ARRIVAL"
    orig_ap = 1 if ftype == "DEPARTURE" else (7 + ((i - 121) % 6))
    dest_ap = (7 + ((i - 121) % 6)) if ftype == "DEPARTURE" else 1
    
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
    stid = ((i - 1) % 60) + 1
    rwid = ((i - 1) % 12) + 1
    deptid = ((i - 1) % 8) + 1
    
    flights_data.append((i, fnum, st, ftype, orig_ap, dest_ap, al_id, sch_dep, act_dep, sch_arr, act_arr, brd_time, acid, gid, stid, rwid, deptid))

for fid, fnum, st, ftype, orig_ap, dest_ap, al_id, sch_dep, act_dep, sch_arr, act_arr, brd_time, acid, gid, stid, rwid, deptid in flights_data:
    act_dep_val = f"'{act_dep}'" if act_dep != "NULL" else "NULL"
    act_arr_val = f"'{act_arr}'" if act_arr != "NULL" else "NULL"
    lines.append(f"INSERT INTO flights (flight_id, flight_number, flight_status, flight_type, origin_airport_id, destination_airport_id, airline_id, scheduled_departure_time, actual_departure_time, scheduled_arrival_time, actual_arrival_time, boarding_time, aircraft_id, gate_id, stand_id, runway_id, department_id) VALUES ({fid}, '{fnum}', '{st}', '{ftype}', {orig_ap}, {dest_ap}, {al_id}, '{sch_dep}', {act_dep_val}, '{sch_arr}', {act_arr_val}, '{brd_time}', {acid}, {gid}, {stid}, {rwid}, {deptid}) ON CONFLICT DO NOTHING;")
lines.append("")

# 16. GROUND_EQUIPMENT (40)
lines.append("-- 16. GROUND_EQUIPMENT (40)")
eq_types = ["Pushback Tug", "Ground Power Unit (GPU)", "Pre-Conditioned Air (PCA)", "Baggage Belt Loader", "Airside Passenger Bus", "De-icing Rig"]
eq_stats = ["AVAILABLE", "IN_USE", "MAINTENANCE"]
for i in range(1, 41):
    eq_code = f"EQ-{100 + i}"
    eq_type = eq_types[(i - 1) % len(eq_types)]
    eq_stat = eq_stats[(i - 1) % len(eq_stats)]
    lines.append(f"INSERT INTO ground_equipment (equipment_id, equipment_code, equipment_type, status) VALUES ({i}, '{eq_code}', '{eq_type}', '{eq_stat}') ON CONFLICT DO NOTHING;")
lines.append("")

# 17. TASKS (600) WITH SLA TIMESTAMPS
lines.append("-- 17. TASKS (600)")
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
        h_st = (6 + (fid % 14)) % 24
        sch_st = f"2026-07-27 {h_st:02d}:00:00+05:30"
        sch_en = f"2026-07-27 {h_st:02d}:45:00+05:30"
        act_st = f"2026-07-27 {h_st:02d}:05:00+05:30" if tstat in ["IN_PROGRESS", "COMPLETED"] else "NULL"
        act_en = f"2026-07-27 {h_st:02d}:42:00+05:30" if tstat == "COMPLETED" else "NULL"
        
        act_st_val = f"'{act_st}'" if act_st != "NULL" else "NULL"
        act_en_val = f"'{act_en}'" if act_en != "NULL" else "NULL"
        
        lines.append(f"INSERT INTO tasks (task_id, task_name, status, scheduled_start, scheduled_end, actual_start, actual_end, flight_id, assigned_user_id) VALUES ({task_id_counter}, '{tname}', '{tstat}', '{sch_st}', '{sch_en}', {act_st_val}, {act_en_val}, {fid}, {uid}) ON CONFLICT DO NOTHING;")
        task_id_counter += 1
lines.append("")

# 18. EQUIPMENT_ASSIGNMENTS (200)
lines.append("-- 18. EQUIPMENT_ASSIGNMENTS (200)")
for i in range(1, 201):
    eqid = ((i - 1) % 40) + 1
    tid = i
    lines.append(f"INSERT INTO equipment_assignments (assignment_id, equipment_id, task_id) VALUES ({i}, {eqid}, {tid}) ON CONFLICT DO NOTHING;")
lines.append("")

# 19. DELAY_CODES (5)
lines.append("-- 19. DELAY_CODES (5)")
d_codes_list = [
    ("IATA-12", "LATE_CHECKIN", "Late Passenger Check-in Delays"),
    ("IATA-31", "REFUELING", "Aviation Jet A-1 Refueling Delay"),
    ("IATA-41", "BAGGAGE", "Baggage Sorting & Belt Loader Delay"),
    ("IATA-84", "WEATHER", "Adverse Airside Weather Conditions"),
    ("IATA-93", "ATC_RESTRICTION", "Air Traffic Control Ground Hold / Slot Delay")
]
for dcode, dcat, ddesc in d_codes_list:
    lines.append(f"INSERT INTO delay_codes (delay_code, category, description) VALUES ('{dcode}', '{dcat}', '{ddesc}') ON CONFLICT DO NOTHING;")
lines.append("")

# 20. DELAY_LOGS (100) WITH FK TO DELAY_CODES
lines.append("-- 20. DELAY_LOGS (100)")
d_codes_keys = ["IATA-12", "IATA-31", "IATA-41", "IATA-84", "IATA-93"]
for fid in range(1, 101):
    dm = (fid * 7) % 110 + 10
    dcode = d_codes_keys[(fid - 1) % len(d_codes_keys)]
    lines.append(f"INSERT INTO delay_logs (flight_id, delay_seq_no, delay_code, delay_minutes) VALUES ({fid}, 1, '{dcode}', {dm}) ON CONFLICT DO NOTHING;")
lines.append("")

# 21. FUEL_LOGS (150)
lines.append("-- 21. FUEL_LOGS (150)")
for i in range(1, 151):
    fd = 0.800 + ((i % 10) * 0.001)
    tid = i
    lines.append(f"INSERT INTO fuel_logs (fuel_log_id, fuel_density, task_id) VALUES ({i}, {fd:.3f}, {tid}) ON CONFLICT DO NOTHING;")
lines.append("")

# 22. CARGO_MANIFESTS (150)
lines.append("-- 22. CARGO_MANIFESTS (150)")
c_types = ["CARGO", "MAIL", "BAGGAGE"]
for i in range(1, 151):
    cid = f"AKN-{1000 + i:05d}-AOCS"
    fid = ((i - 1) % 200) + 1
    wkg = 450.0 + (i % 20) * 25.0
    ctype = c_types[(i - 1) % len(c_types)]
    lines.append(f"INSERT INTO cargo_manifests (cargo_id, container_id, weight_kg, cargo_type, flight_id) VALUES ({i}, '{cid}', {wkg:.2f}, '{ctype}', {fid}) ON CONFLICT DO NOTHING;")
lines.append("")

# 23. BAGGAGE_CAROUSELS (30)
lines.append("-- 23. BAGGAGE_CAROUSELS (30)")
for i in range(1, 31):
    term = "T1" if i <= 10 else ("T2" if i <= 20 else "T3")
    fid = (i * 6)
    lines.append(f"INSERT INTO baggage_carousels (carousel_id, terminal, flight_id) VALUES ({i}, '{term}', {fid}) ON CONFLICT DO NOTHING;")
lines.append("")

# 24. TRAVELERS (250) MASTER HUMAN PROFILES WITH UNIQUE PASSPORT
lines.append("-- 24. TRAVELERS (250)")
for i in range(1, 251):
    fn = indian_first[(i - 1) % len(indian_first)] if i <= 150 else intl_first[(i - 151) % len(intl_first)]
    ln = indian_last[(i - 1) % len(indian_last)] if i <= 150 else intl_last[(i - 151) % len(intl_last)]
    ppt = f"P{1000000 + i*1337:08d}"
    nat = "IND" if i <= 150 else "USA"
    email = f"{fn.lower()}.{ln.lower()}{i}@traveler.com"
    phone = f"+9198{i:08d}" if i <= 150 else f"+1415{i:07d}"
    lines.append(f"INSERT INTO travelers (traveler_id, first_name, last_name, passport_number, nationality, email, phone_number) VALUES ({i}, '{fn}', '{ln}', '{ppt}', '{nat}', '{email}', '{phone}') ON CONFLICT DO NOTHING;")
lines.append("")

# 25. PASSENGERS (300) FLIGHT SEGMENT INSTANCES (FK TO TRAVELERS)
lines.append("-- 25. PASSENGERS (300)")
pnr_chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
for i in range(1, 301):
    tr_id = ((i - 1) % 250) + 1
    pnr = f"{pnr_chars[i%32]}{pnr_chars[(i*3)%32]}{pnr_chars[(i*7)%32]}{pnr_chars[(i*11)%32]}{pnr_chars[(i*13)%32]}{pnr_chars[(i*17)%32]}"
    is_transit = True if (i % 4 == 0) else False
    fid = ((i - 1) % 200) + 1
    lines.append(f"INSERT INTO passengers (passenger_id, traveler_id, flight_id, pnr_code, is_transit_passenger) VALUES ({i}, {tr_id}, {fid}, '{pnr}', {is_transit}) ON CONFLICT DO NOTHING;")
lines.append("")

# 26. BOARDING_PASSES (300)
lines.append("-- 26. BOARDING_PASSES (300)")
classes = ["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"]
groups = ["ZONE 1", "ZONE 2", "ZONE 3", "PRIORITY"]
for i in range(1, 301):
    tr_id = ((i - 1) % 250) + 1
    fn = indian_first[(tr_id - 1) % len(indian_first)] if tr_id <= 150 else intl_first[(tr_id - 151) % len(intl_first)]
    ln = indian_last[(tr_id - 1) % len(indian_last)] if tr_id <= 150 else intl_last[(tr_id - 151) % len(intl_last)]
    pnr = f"{pnr_chars[i%32]}{pnr_chars[(i*3)%32]}{pnr_chars[(i*7)%32]}{pnr_chars[(i*11)%32]}{pnr_chars[(i*13)%32]}{pnr_chars[(i*17)%32]}"
    
    bcode = f"M1{ln}/{fn} E{pnr} DELDXBAI0101 208C012A{i:04d} 147>5180B"
    tnum = f"098-{2415981200 + i}"
    snum = f"{((i % 30) + 1):02d}{chr(65 + (i % 6))}"
    cclass = classes[(i - 1) % len(classes)]
    bgrp = groups[(i - 1) % len(groups)]
    seq = i
    ffnum = f"FF-AI-{900000 + i}"
    pid = i
    fid = ((i - 1) % 200) + 1
    lines.append(f"INSERT INTO boarding_passes (boarding_pass_id, barcode_data, ticket_number, seat_number, cabin_class, boarding_group, sequence_number, frequent_flyer_number, passenger_id, flight_id) VALUES ({i}, '{bcode}', '{tnum}', '{snum}', '{cclass}', '{bgrp}', {seq}, '{ffnum}', {pid}, {fid}) ON CONFLICT DO NOTHING;")
lines.append("")

# 27. BAG_TAGS (300)
lines.append("-- 27. BAG_TAGS (300)")
bag_stats = ["CHECKED_IN", "SCREENED", "LOADED", "CLAIMED"]
for i in range(1, 301):
    tnum = f"0125{100000 + i:06d}"
    pid = i
    fid = ((i - 1) % 200) + 1
    wkg = 15.0 + (i % 18) * 0.5
    bstat = bag_stats[(i - 1) % len(bag_stats)]
    lines.append(f"INSERT INTO bag_tags (bag_tag_id, tag_number, passenger_id, flight_id, weight_kg, status) VALUES ({i}, '{tnum}', {pid}, {fid}, {wkg:.2f}, '{bstat}') ON CONFLICT DO NOTHING;")
lines.append("")

# 28. BAGGAGE_SCAN_EVENTS (300)
lines.append("-- 28. BAGGAGE_SCAN_EVENTS (300)")
locations = ["Check-in Counter 04", "Sorting Belt Lateral 3", "HBS Level 1 X-Ray Screening", "Ramp ULD Loader", "Arrival Baggage Carousel"]
for i in range(1, 301):
    btid = i
    loc = locations[(i - 1) % len(locations)]
    h = (6 + (i % 16)) % 24
    lines.append(f"INSERT INTO baggage_scan_events (scan_id, bag_tag_id, scan_location, scan_timestamp) VALUES ({i}, {btid}, '{loc}', '2026-07-27 {h:02d}:15:00+05:30') ON CONFLICT DO NOTHING;")
lines.append("")

# 29. MISHANDLED_BAGGAGE (40)
lines.append("-- 29. MISHANDLED_BAGGAGE (40)")
inc_types = ["LOST", "DAMAGED", "DELAYED", "PILFERED"]
p_stats = ["OPEN", "LOCATED", "IN_TRANSIT", "RESOLVED"]
for i in range(1, 41):
    cnum = f"PIR-DEL-2026-{1000 + i}"
    itype = inc_types[(i - 1) % len(inc_types)]
    pstat = p_stats[(i - 1) % len(p_stats)]
    btid = i * 7
    pid = i * 7
    lines.append(f"INSERT INTO mishandled_baggage (report_id, claim_number, incident_type, status, bag_tag_id, passenger_id) VALUES ({i}, '{cnum}', '{itype}', '{pstat}', {btid}, {pid}) ON CONFLICT DO NOTHING;")
lines.append("")

# 30. SECURITY_CHECKPOINTS (20)
lines.append("-- 30. SECURITY_CHECKPOINTS (20)")
checkpoints_list = [
    ("Terminal 3 Main Entry E-Gate 01", "TERMINAL_ENTRY", "T3"),
    ("Terminal 3 Main Entry E-Gate 02", "TERMINAL_ENTRY", "T3"),
    ("Terminal 2 Entry Gate 01", "TERMINAL_ENTRY", "T2"),
    ("Terminal 1 Entry Gate 01", "TERMINAL_ENTRY", "T1"),
    ("T3 Central Security Screening Gate A", "SECURITY_SCREENING", "T3"),
    ("T3 Central Security Screening Gate B", "SECURITY_SCREENING", "T3"),
    ("T2 Security Screening Scanner 01", "SECURITY_SCREENING", "T2"),
    ("T1 Security Screening Scanner 01", "SECURITY_SCREENING", "T1"),
    ("International Immigration Desk 01", "IMMIGRATION_CONTROL", "T3"),
    ("International Immigration Desk 02", "IMMIGRATION_CONTROL", "T3"),
    ("International Immigration Desk 03", "IMMIGRATION_CONTROL", "T3"),
    ("International E-Gate Biometric Desk 04", "IMMIGRATION_CONTROL", "T3"),
    ("Gate A01 Boarding Scanner", "BOARDING_GATE", "T3"),
    ("Gate A02 Boarding Scanner", "BOARDING_GATE", "T3"),
    ("Gate A03 Boarding Scanner", "BOARDING_GATE", "T3"),
    ("Gate B01 Boarding Scanner", "BOARDING_GATE", "T2"),
    ("Gate B02 Boarding Scanner", "BOARDING_GATE", "T2"),
    ("Gate C01 Boarding Scanner", "BOARDING_GATE", "T1"),
    ("Gate C02 Boarding Scanner", "BOARDING_GATE", "T1"),
    ("Executive VIP Lounge E-Gate Scanner", "SECURITY_SCREENING", "T3")
]
for idx, (cname, ctype, cterm) in enumerate(checkpoints_list, 1):
    lines.append(f"INSERT INTO security_checkpoints (checkpoint_id, checkpoint_name, checkpoint_type, terminal) VALUES ({idx}, '{cname}', '{ctype}', '{cterm}') ON CONFLICT DO NOTHING;")
lines.append("")

# 31. PASSENGER_CLEARANCE_LOGS (300)
lines.append("-- 31. PASSENGER_CLEARANCE_LOGS (300)")
clear_statuses = ["APPROVED", "FLAGGED_SECURITY", "DENIED", "BOARDED"]
denial_reasons = ["INVALID_BARCODE", "PASSPORT_EXPIRED", "NO_FLY_WATCHLIST_MATCH", "MISSING_IMMIGRATION_STAMP"]
methods = ["BARCODE_SCANNER", "BIOMETRIC_FACIAL", "PASSPORT_CHIP_READER"]
for i in range(1, 301):
    st = clear_statuses[(i - 1) % len(clear_statuses)]
    dreason = f"'{denial_reasons[(i - 1) % len(denial_reasons)]}'" if st in ["FLAGGED_SECURITY", "DENIED"] else "NULL"
    m = methods[(i - 1) % len(methods)]
    pid = i
    bpid = i
    chkid = ((i - 1) % 20) + 1
    h = (7 + (i % 14)) % 24
    lines.append(f"INSERT INTO passenger_clearance_logs (clearance_id, scan_timestamp, clearance_status, denial_reason, verification_method, passenger_id, boarding_pass_id, checkpoint_id) VALUES ({i}, '2026-07-27 {h:02d}:{(i%60):02d}:00+05:30', '{st}', {dreason}, '{m}', {pid}, {bpid}, {chkid}) ON CONFLICT DO NOTHING;")
lines.append("")

# 32. IMMIGRATION_RECORDS (120)
lines.append("-- 32. IMMIGRATION_RECORDS (120)")
visas = ["TOURIST_VISA", "E_VISA", "VISA_EXEMPT", "DIPLOMATIC"]
for i in range(1, 121):
    pid = 180 + i
    ppt = f"P{1000000 + pid*1337:08d}"
    vtype = visas[(i - 1) % len(visas)]
    snum = f"DEL-IMM-2026-{1000 + i:04d}"
    ctype = "DEPARTURE_EMIGRATION" if (i % 2 == 1) else "ARRIVAL_IMMIGRATION"
    lines.append(f"INSERT INTO immigration_records (immigration_id, passport_number, visa_type, stamp_number, biometric_facial_matched, clearance_type, passenger_id) VALUES ({i}, '{ppt}', '{vtype}', '{snum}', TRUE, '{ctype}', {pid}) ON CONFLICT DO NOTHING;")
lines.append("")

# 33. LOUNGE_VISITS (100)
lines.append("-- 33. LOUNGE_VISITS (100)")
lounges = ["Encalm VIP Executive Lounge", "Emirates First Class Lounge", "Star Alliance Lounge", "Plaza Premium Executive Lounge", "Air India Maharaja Lounge"]
for i in range(1, 101):
    lname = lounges[(i - 1) % len(lounges)]
    pid = i * 2
    lines.append(f"INSERT INTO lounge_visits (visit_id, lounge_name, passenger_id) VALUES ({i}, '{lname}', {pid}) ON CONFLICT DO NOTHING;")
lines.append("")

# 34. CUSTOMER_FEEDBACK_LOGS (100)
lines.append("-- 34. CUSTOMER_FEEDBACK_LOGS (100)")
categories = ["SECURITY_SPEED", "GATE_CLEANLINESS", "FOOD_COURT_QUALITY", "STAFF_HELPFULNESS", "WIFI_SPEED"]
for i in range(1, 101):
    pid = i * 2
    term = "T3" if i <= 50 else ("T2" if i <= 80 else "T1")
    rating = (i % 5) + 1
    cat = categories[(i - 1) % len(categories)]
    lines.append(f"INSERT INTO customer_feedback_logs (feedback_id, passenger_id, terminal, rating, category) VALUES ({i}, {pid}, '{term}', {rating}, '{cat}') ON CONFLICT DO NOTHING;")
lines.append("")

# 35. AIRLINE_BILLING_INVOICES (24)
lines.append("-- 35. AIRLINE_BILLING_INVOICES (24)")
pay_stats = ["PAID", "UNPAID", "OVERDUE"]
for i in range(1, 25):
    inv_num = f"INV-2026-AOCS-{1000 + i}"
    al_id = ((i - 1) % 12) + 1
    amt = 15000.0 + (i * 2450.0)
    pstat = pay_stats[(i - 1) % len(pay_stats)]
    lines.append(f"INSERT INTO airline_billing_invoices (invoice_id, invoice_number, airline_id, billing_period_start, billing_period_end, total_amount_usd, payment_status) VALUES ({i}, '{inv_num}', {al_id}, '2026-07-01', '2026-07-31', {amt:.2f}, '{pstat}') ON CONFLICT DO NOTHING;")
lines.append("")

# 36. INVOICE_LINE_ITEMS (72)
lines.append("-- 36. INVOICE_LINE_ITEMS (72)")
charge_types = ["MTOW Landing Fee Tariff", "Gate Stand Parking Tariff", "Jet A-1 Refueling Uplift Charge", "Terminal Passenger Service Fee"]
for i in range(1, 73):
    invid = ((i - 1) % 24) + 1
    ctype = charge_types[(i - 1) % len(charge_types)]
    amt = 2500.0 + (i * 350.0)
    lines.append(f"INSERT INTO invoice_line_items (line_item_id, invoice_id, charge_type, amount_usd) VALUES ({i}, {invid}, '{ctype}', {amt:.2f}) ON CONFLICT DO NOTHING;")
lines.append("")

# 37. NOTIFICATIONS (150)
lines.append("-- 37. NOTIFICATIONS (150)")
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

# 38. AUDIT_LOGS (200)
lines.append("-- 38. AUDIT_LOGS (200)")
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

print(f"Successfully generated seed data with 38 normalized tables & 3,800+ records in {v2_path}")
