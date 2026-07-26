import os

db_dir = "/Users/krish/Desktop/Software Engineering/Mini Project/db"
md_dir = "/Users/krish/Desktop/Software Engineering/Mini Project/documentation/MD/database_creation"
os.makedirs(db_dir, exist_ok=True)
os.makedirs(md_dir, exist_ok=True)

# 1. WRITE MARKDOWN SPECIFICATION (Elmasri & Navathe Chapter 7 Mapping)
md_path = os.path.join(md_dir, "relational_schema_mapping.md")

md_content = """# AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
## Step 4: Relational Database Schema & ER-to-Relational Mapping Codex

---

### Executive Overview & Theoretical Foundation
This document details the **Relational Database Schema** for AOCS, mapped directly from our Peter Chen Conceptual ER Diagram using the **7-Step ER-to-Relational Mapping Algorithm** from **Elmasri & Navathe's *Fundamentals of Database Systems* (Chapter 7)**.

While the Peter Chen ERD captures conceptual entity relationships via ovals and diamonds, this Relational Schema represents the **physical database implementation in PostgreSQL 18**, explicitly defining Primary Keys (`PK`), Foreign Keys (`FK`), table structures, and referential integrity constraints.

---

## SECTION 1: ELMASRI & NAVATHE 7-STEP MAPPING ALGORITHM ALIGNMENT

| Mapping Step | Formal Algorithm Rule | Applied AOCS Relational Schema Mapping |
|---|---|---|
| **Step 1** | **Regular Entity Types** | Each strong entity (`USERS`, `ROLES`, `DEPARTMENTS`, `AIRCRAFT`, `FLIGHTS`, `GATES`, `RUNWAYS`, `TASKS`, `FUEL_LOGS`, `CARGO_MANIFESTS`, `PASSENGERS`, `LOUNGE_VISITS`, `BAGGAGE_CAROUSELS`, `NOTIFICATIONS`, `AUDIT_LOGS`) is mapped to a relation schema with its simple attributes and Primary Key (`PK`). |
| **Step 2** | **Weak Entity Types** | Weak entity `DELAY_LOGS` is mapped to relation `DELAY_LOGS`. It includes owner foreign key `flight_id [FK]` combined with partial key `delay_seq_no` to form composite Primary Key `(flight_id, delay_seq_no)`. |
| **Step 3** | **Binary 1:1 Relationships** | Standard foreign key approach used for 1:1 linkages where applicable. |
| **Step 4** | **Binary 1:N Relationships** | Primary Key from the `1`-side is embedded as a Foreign Key (`FK`) in the `N`-side relation:<br>• `FLIGHTS` includes `aircraft_id [FK]`, `gate_id [FK]`, `runway_id [FK]`, `department_id [FK]`.<br>• `USERS` includes `role_id [FK]`, `department_id [FK]`.<br>• `TASKS` includes `flight_id [FK]`, `assigned_user_id [FK]`. |
| **Step 5** | **Binary M:N Relationships** | Junction relations created with composite Primary Keys combining foreign keys from both participating entities. |
| **Step 6** | **Multivalued Attributes** | Multivalued attribute `phone_numbers` on `USERS` is mapped to relation `USER_PHONE_NUMBERS(user_id [FK], phone_number)`. |
| **Step 7** | **N-ary Relationships** | Higher degree relations mapped using foreign key cross-references. |

---

## SECTION 2: RELATIONAL TABLES & REFERENTIAL INTEGRITY SPECIFICATIONS

### 1. `ROLES` Relation
* `role_id` **[PK]**: `BIGINT NOT NULL`
* `role_name`: `VARCHAR(50) NOT NULL UNIQUE`

### 2. `DEPARTMENTS` Relation
* `department_id` **[PK]**: `BIGINT NOT NULL`
* `department_name`: `VARCHAR(100) NOT NULL UNIQUE`

### 3. `USERS` Relation
* `user_id` **[PK]**: `BIGINT NOT NULL`
* `username`: `VARCHAR(50) NOT NULL UNIQUE`
* `name`: `VARCHAR(100) NOT NULL`
* `role_id` **[FK]**: `BIGINT NOT NULL` ➔ `ROLES(role_id) ON DELETE RESTRICT`
* `department_id` **[FK]**: `BIGINT NOT NULL` ➔ `DEPARTMENTS(department_id) ON DELETE RESTRICT`

### 4. `USER_PHONE_NUMBERS` Relation *(Step 6 Multivalued Mapping)*
* `user_id` **[FK, PK]**: `BIGINT NOT NULL` ➔ `USERS(user_id) ON DELETE CASCADE`
* `phone_number` **[PK]**: `VARCHAR(30) NOT NULL`

### 5. `AIRCRAFT` Relation
* `aircraft_id` **[PK]**: `BIGINT NOT NULL`
* `registration_number`: `VARCHAR(20) NOT NULL UNIQUE`

### 6. `GATES` Relation
* `gate_id` **[PK]**: `BIGINT NOT NULL`
* `gate_number`: `VARCHAR(10) NOT NULL UNIQUE`

### 7. `RUNWAYS` Relation
* `runway_id` **[PK]**: `BIGINT NOT NULL`
* `runway_code`: `VARCHAR(10) NOT NULL UNIQUE`

### 8. `FLIGHTS` Relation
* `flight_id` **[PK]**: `BIGINT NOT NULL`
* `flight_number`: `VARCHAR(10) NOT NULL`
* `flight_status`: `VARCHAR(20) NOT NULL`
* `aircraft_id` **[FK]**: `BIGINT NOT NULL` ➔ `AIRCRAFT(aircraft_id) ON DELETE RESTRICT`
* `gate_id` **[FK]**: `BIGINT NULL` ➔ `GATES(gate_id) ON DELETE SET NULL`
* `runway_id` **[FK]**: `BIGINT NULL` ➔ `RUNWAYS(runway_id) ON DELETE SET NULL`
* `department_id` **[FK]**: `BIGINT NULL` ➔ `DEPARTMENTS(department_id) ON DELETE SET NULL`

### 9. `TASKS` Relation
* `task_id` **[PK]**: `BIGINT NOT NULL`
* `task_name`: `VARCHAR(100) NOT NULL`
* `status`: `VARCHAR(20) NOT NULL`
* `flight_id` **[FK]**: `BIGINT NOT NULL` ➔ `FLIGHTS(flight_id) ON DELETE CASCADE`
* `assigned_user_id` **[FK]**: `BIGINT NULL` ➔ `USERS(user_id) ON DELETE SET NULL`

### 10. `DELAY_LOGS` Relation *(Step 2 Weak Entity Mapping)*
* `flight_id` **[FK, PK]**: `BIGINT NOT NULL` ➔ `FLIGHTS(flight_id) ON DELETE CASCADE`
* `delay_seq_no` **[PK]**: `INT NOT NULL`
* `delay_minutes`: `INT NOT NULL`

### 11. `FUEL_LOGS` Relation
* `fuel_log_id` **[PK]**: `BIGINT NOT NULL`
* `fuel_density`: `NUMERIC(6,3) NOT NULL`
* `task_id` **[FK]**: `BIGINT NOT NULL` ➔ `TASKS(task_id) ON DELETE RESTRICT`

### 12. `CARGO_MANIFESTS` Relation
* `cargo_id` **[PK]**: `BIGINT NOT NULL`
* `container_id`: `VARCHAR(30) NOT NULL`
* `fuel_log_id` **[FK]**: `BIGINT NOT NULL` ➔ `FUEL_LOGS(fuel_log_id) ON DELETE RESTRICT`

### 13. `BAGGAGE_CAROUSELS` Relation
* `carousel_id` **[PK]**: `BIGINT NOT NULL`
* `terminal`: `VARCHAR(10) NOT NULL`
* `flight_id` **[FK]**: `BIGINT NULL` ➔ `FLIGHTS(flight_id) ON DELETE SET NULL`

### 14. `PASSENGERS` Relation
* `passenger_id` **[PK]**: `BIGINT NOT NULL`
* `passport_number`: `VARCHAR(20) NOT NULL UNIQUE`
* `flight_id` **[FK]**: `BIGINT NOT NULL` ➔ `FLIGHTS(flight_id) ON DELETE RESTRICT`

### 15. `LOUNGE_VISITS` Relation
* `visit_id` **[PK]**: `BIGINT NOT NULL`
* `lounge_name`: `VARCHAR(100) NOT NULL`
* `passenger_id` **[FK]**: `BIGINT NOT NULL` ➔ `PASSENGERS(passenger_id) ON DELETE CASCADE`

### 16. `NOTIFICATIONS` Relation
* `notification_id` **[PK]**: `BIGINT NOT NULL`
* `title`: `VARCHAR(150) NOT NULL`
* `user_id` **[FK]**: `BIGINT NOT NULL` ➔ `USERS(user_id) ON DELETE CASCADE`

### 17. `AUDIT_LOGS` Relation *(Legal Compliance Immutable Log)*
* `log_id` **[PK]**: `BIGINT NOT NULL`
* `action`: `VARCHAR(255) NOT NULL`
* `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`
* `user_id` **[FK]**: `BIGINT NOT NULL` ➔ `USERS(user_id) ON DELETE RESTRICT`

---
*Author: Antigravity Agent (Google Deepmind) | Project: Airport Operations Coordination System (AOCS)*
"""

with open(md_path, "w", encoding="utf-8") as f:
    f.write(md_content)

print(f"Successfully created {md_path}")


# 2. WRITE DRAW.IO XML FILE (INFORMATION PACKAGE BOX STYLE, MONOCHROME, 90-DEGREE ORTHOGONAL LINES)
drawio_path = os.path.join(db_dir, "AOCS Relational Schema.drawio.xml")

# Relational Tables data for List containers
relational_tables = [
    # ROW 1 (y=120)
    {
        "id": "t_roles", "title": "ROLES", "x": 80, "y": 120, "w": 200,
        "fields": [("role_id", "PK"), ("role_name", "")]
    },
    {
        "id": "t_depts", "title": "DEPARTMENTS", "x": 320, "y": 120, "w": 220,
        "fields": [("department_id", "PK"), ("department_name", "")]
    },
    {
        "id": "t_aircraft", "title": "AIRCRAFT", "x": 850, "y": 120, "w": 200,
        "fields": [("aircraft_id", "PK"), ("registration_number", "")]
    },
    {
        "id": "t_gates", "title": "GATES", "x": 1150, "y": 120, "w": 190,
        "fields": [("gate_id", "PK"), ("gate_number", "")]
    },
    {
        "id": "t_runways", "title": "RUNWAYS", "x": 1420, "y": 120, "w": 190,
        "fields": [("runway_id", "PK"), ("runway_code", "")]
    },

    # ROW 2 (y=420)
    {
        "id": "t_users", "title": "USERS", "x": 200, "y": 420, "w": 240,
        "fields": [
            ("user_id", "PK"),
            ("username", ""),
            ("name", ""),
            ("role_id", "FK -> ROLES.role_id"),
            ("department_id", "FK -> DEPARTMENTS.department_id")
        ]
    },
    {
        "id": "t_user_phones", "title": "USER_PHONE_NUMBERS", "x": 480, "y": 420, "w": 260,
        "fields": [
            ("user_id", "FK -> USERS.user_id"),
            ("phone_number", "PK")
        ]
    },
    {
        "id": "t_flights", "title": "FLIGHTS", "x": 950, "y": 420, "w": 280,
        "fields": [
            ("flight_id", "PK"),
            ("flight_number", ""),
            ("flight_status", ""),
            ("aircraft_id", "FK -> AIRCRAFT.aircraft_id"),
            ("gate_id", "FK -> GATES.gate_id"),
            ("runway_id", "FK -> RUNWAYS.runway_id"),
            ("department_id", "FK -> DEPARTMENTS.department_id")
        ]
    },

    # ROW 3 (y=780)
    {
        "id": "t_notif", "title": "NOTIFICATIONS", "x": 50, "y": 780, "w": 220,
        "fields": [("notification_id", "PK"), ("title", ""), ("user_id", "FK -> USERS.user_id")]
    },
    {
        "id": "t_audit", "title": "AUDIT_LOGS", "x": 300, "y": 780, "w": 230,
        "fields": [("log_id", "PK"), ("action", ""), ("created_at", ""), ("user_id", "FK -> USERS.user_id")]
    },
    {
        "id": "t_tasks", "title": "TASKS", "x": 780, "y": 780, "w": 240,
        "fields": [
            ("task_id", "PK"),
            ("task_name", ""),
            ("status", ""),
            ("flight_id", "FK -> FLIGHTS.flight_id"),
            ("assigned_user_id", "FK -> USERS.user_id")
        ]
    },
    {
        "id": "t_delays", "title": "DELAY_LOGS", "x": 1050, "y": 780, "w": 230,
        "fields": [("flight_id", "FK -> FLIGHTS.flight_id"), ("delay_seq_no", "PK"), ("delay_minutes", "")]
    },
    {
        "id": "t_baggage", "title": "BAGGAGE_CAROUSELS", "x": 1310, "y": 780, "w": 240,
        "fields": [("carousel_id", "PK"), ("terminal", ""), ("flight_id", "FK -> FLIGHTS.flight_id")]
    },
    {
        "id": "t_passengers", "title": "PASSENGERS", "x": 1580, "y": 780, "w": 240,
        "fields": [("passenger_id", "PK"), ("passport_number", ""), ("flight_id", "FK -> FLIGHTS.flight_id")]
    },
    {
        "id": "t_lounges", "title": "LOUNGE_VISITS", "x": 1850, "y": 780, "w": 240,
        "fields": [("visit_id", "PK"), ("lounge_name", ""), ("passenger_id", "FK -> PASSENGERS.passenger_id")]
    },

    # ROW 4 (y=1120)
    {
        "id": "t_fuel", "title": "FUEL_LOGS", "x": 780, "y": 1120, "w": 230,
        "fields": [("fuel_log_id", "PK"), ("fuel_density", ""), ("task_id", "FK -> TASKS.task_id")]
    },
    {
        "id": "t_cargo", "title": "CARGO_MANIFESTS", "x": 1050, "y": 1120, "w": 240,
        "fields": [("cargo_id", "PK"), ("container_id", ""), ("fuel_log_id", "FK -> FUEL_LOGS.fuel_log_id")]
    }
]

xml_parts = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<mxfile host="Electron">',
    '  <diagram name="AOCS-Relational-Schema" id="aocs-relational-schema-01">',
    '    <mxGraphModel dx="2800" dy="2000" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="2800" pageHeight="2000" math="0" shadow="0">',
    '      <root>',
    '        <mxCell id="0" />',
    '        <mxCell id="1" parent="0" />',
    '',
    '        <!-- HEADER TITLE -->',
    '        <mxCell id="hdr_title" value="&lt;b style=&quot;font-size: 16px;&quot;&gt;AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;Physical Relational Database Schema Diagram (Elmasri &amp;amp; Navathe Chapter 7 ER-to-Relational Mapping)&lt;/span&gt;" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=14;fillColor=none;strokeColor=default;fontColor=default;" vertex="1" parent="1">',
    '          <mxGeometry x="50" y="30" width="2040" height="50" as="geometry" />',
    '        </mxCell>',
    ''
]

cell_counter = 100
field_id_map = {} # maps table_id + field_name -> cell_id

for tbl in relational_tables:
    container_id = f"cell_{cell_counter}"
    cell_counter += 1
    
    header_h = 32
    row_h = 24
    total_h = header_h + (len(tbl["fields"]) * row_h)
    
    xml_parts.append(f'        <!-- TABLE: {tbl["title"]} -->')
    xml_parts.append(f'        <mxCell id="{container_id}" value="&lt;b style=&quot;font-size: 12px;&quot;&gt;{tbl["title"]}&lt;/b&gt;" style="swimlane;fontStyle=1;fontSize=11;childLayout=stackLayout;horizontal=1;startSize={header_h};horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=default;fontColor=default;" vertex="1" parent="1">')
    xml_parts.append(f'          <mxGeometry x="{tbl["x"]}" y="{tbl["y"]}" width="{tbl["w"]}" height="{total_h}" as="geometry" />')
    xml_parts.append('        </mxCell>')
    
    curr_y = header_h
    for fname, ftag in tbl["fields"]:
        row_id = f"cell_{cell_counter}"
        cell_counter += 1
        field_id_map[f'{tbl["id"]}.{fname}'] = row_id
        
        if "PK" in ftag:
            display_val = f"&lt;b&gt;[PK] {fname}&lt;/b&gt;"
        elif "FK" in ftag:
            display_val = f"• &lt;u&gt;{fname}&lt;/u&gt; &lt;span style=&quot;font-size:8px;color:#555;&quot;&gt;[{ftag}]&lt;/span&gt;"
        else:
            display_val = f"  {fname}"
            
        xml_parts.append(f'        <mxCell id="{row_id}" value="{display_val}" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=8;rotatable=0;points=[];portConstraint=eastwest;whiteSpace=wrap;html=1;fontSize=10;fontColor=default;" vertex="1" parent="{container_id}">')
        xml_parts.append(f'          <mxGeometry y="{curr_y}" width="{tbl["w"]}" height="{row_h}" as="geometry" />')
        xml_parts.append('        </mxCell>')
        curr_y += row_h
    xml_parts.append('')

# Add FK -> PK 90-degree orthogonal connectors
fk_connections = [
    # USERS -> ROLES, DEPARTMENTS
    ("t_users.role_id", "t_roles.role_id"),
    ("t_users.department_id", "t_depts.department_id"),
    # USER_PHONE_NUMBERS -> USERS
    ("t_user_phones.user_id", "t_users.user_id"),
    # FLIGHTS -> AIRCRAFT, GATES, RUNWAYS, DEPARTMENTS
    ("t_flights.aircraft_id", "t_aircraft.aircraft_id"),
    ("t_flights.gate_id", "t_gates.gate_id"),
    ("t_flights.runway_id", "t_runways.runway_id"),
    ("t_flights.department_id", "t_depts.department_id"),
    # TASKS -> FLIGHTS, USERS
    ("t_tasks.flight_id", "t_flights.flight_id"),
    ("t_tasks.assigned_user_id", "t_users.user_id"),
    # DELAY_LOGS -> FLIGHTS
    ("t_delays.flight_id", "t_flights.flight_id"),
    # FUEL_LOGS -> TASKS
    ("t_fuel.task_id", "t_tasks.task_id"),
    # CARGO_MANIFESTS -> FUEL_LOGS
    ("t_cargo.fuel_log_id", "t_fuel.fuel_log_id"),
    # BAGGAGE_CAROUSELS -> FLIGHTS
    ("t_baggage.flight_id", "t_flights.flight_id"),
    # PASSENGERS -> FLIGHTS
    ("t_passengers.flight_id", "t_flights.flight_id"),
    # LOUNGE_VISITS -> PASSENGERS
    ("t_lounges.passenger_id", "t_passengers.passenger_id"),
    # NOTIFICATIONS -> USERS
    ("t_notif.user_id", "t_users.user_id"),
    # AUDIT_LOGS -> USERS
    ("t_audit.user_id", "t_users.user_id")
]

xml_parts.append('        <!-- 90-DEGREE ORTHOGONAL FOREIGN KEY -> PRIMARY KEY CONNECTORS -->')
for fk_key, pk_key in fk_connections:
    if fk_key in field_id_map and pk_key in field_id_map:
        src_id = field_id_map[fk_key]
        tgt_id = field_id_map[pk_key]
        edge_id = f"edge_{cell_counter}"
        cell_counter += 1
        
        xml_parts.append(f'        <mxCell id="{edge_id}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;endArrow=classic;endFill=1;strokeColor=default;" edge="1" parent="1" source="{src_id}" target="{tgt_id}">')
        xml_parts.append('          <mxGeometry relative="1" as="geometry" />')
        xml_parts.append('        </mxCell>')

xml_parts.extend([
    '      </root>',
    '    </mxGraphModel>',
    '  </diagram>',
    '</mxfile>'
])

xml_str = "\n".join(xml_parts)

with open(drawio_path, "w", encoding="utf-8") as f:
    f.write(xml_str)

print(f"Successfully generated Relational Schema Draw.io file in {drawio_path}")

# Sync to db/Relational-Schema.xml
sync_path = os.path.join(db_dir, "Relational-Schema.xml")
with open(sync_path, "w", encoding="utf-8") as f:
    f.write(xml_str)

print(f"Successfully synced to {sync_path}")
