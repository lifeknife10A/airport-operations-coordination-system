import os

db_dir = "/Users/krish/Desktop/Software Engineering/Mini Project/db"
md_dir = "/Users/krish/Desktop/Software Engineering/Mini Project/documentation/MD/database_creation"

# 1. BUILD RELATIONAL SCHEMA XML (21 TABLES)
rel_path = os.path.join(db_dir, "AOCS Relational Schema.drawio.xml")

relational_tables = [
    # ROW 1 (y=120)
    {"id": "t_roles", "title": "ROLES", "x": 80, "y": 120, "w": 200, "fields": [("role_id", "PK"), ("role_name", "")]},
    {"id": "t_depts", "title": "DEPARTMENTS", "x": 320, "y": 120, "w": 220, "fields": [("department_id", "PK"), ("department_name", "")]},
    {"id": "t_aircraft", "title": "AIRCRAFT", "x": 850, "y": 120, "w": 200, "fields": [("aircraft_id", "PK"), ("registration_number", "")]},
    {"id": "t_gates", "title": "GATES", "x": 1150, "y": 120, "w": 190, "fields": [("gate_id", "PK"), ("gate_number", "")]},
    {"id": "t_runways", "title": "RUNWAYS", "x": 1420, "y": 120, "w": 190, "fields": [("runway_id", "PK"), ("runway_code", "")]},

    # ROW 2 (y=420)
    {"id": "t_users", "title": "USERS", "x": 200, "y": 420, "w": 240, "fields": [("user_id", "PK"), ("username", ""), ("name", ""), ("role_id", "FK -> ROLES.role_id"), ("department_id", "FK -> DEPARTMENTS.department_id")]},
    {"id": "t_uphones", "title": "USER_PHONE_NUMBERS", "x": 480, "y": 420, "w": 260, "fields": [("user_id", "FK -> USERS.user_id"), ("phone_number", "PK")]},
    {"id": "t_flights", "title": "FLIGHTS", "x": 950, "y": 420, "w": 300, "fields": [("flight_id", "PK"), ("flight_number", ""), ("flight_status", ""), ("flight_type", ""), ("origin_airport", ""), ("destination_airport", ""), ("scheduled_departure_time", ""), ("boarding_time", ""), ("aircraft_id", "FK -> AIRCRAFT.aircraft_id"), ("gate_id", "FK -> GATES.gate_id"), ("runway_id", "FK -> RUNWAYS.runway_id"), ("department_id", "FK -> DEPARTMENTS.department_id")]},

    # ROW 3 (y=840)
    {"id": "t_notif", "title": "NOTIFICATIONS", "x": 50, "y": 840, "w": 220, "fields": [("notification_id", "PK"), ("title", ""), ("user_id", "FK -> USERS.user_id")]},
    {"id": "t_audit", "title": "AUDIT_LOGS", "x": 300, "y": 840, "w": 230, "fields": [("log_id", "PK"), ("action", ""), ("created_at", ""), ("user_id", "FK -> USERS.user_id")]},
    {"id": "t_tasks", "title": "TASKS", "x": 780, "y": 840, "w": 240, "fields": [("task_id", "PK"), ("task_name", ""), ("status", ""), ("flight_id", "FK -> FLIGHTS.flight_id"), ("assigned_user_id", "FK -> USERS.user_id")]},
    {"id": "t_delays", "title": "DELAY_LOGS", "x": 1050, "y": 840, "w": 230, "fields": [("flight_id", "FK -> FLIGHTS.flight_id"), ("delay_seq_no", "PK"), ("delay_minutes", "")]},
    {"id": "t_baggage", "title": "BAGGAGE_CAROUSELS", "x": 1310, "y": 840, "w": 240, "fields": [("carousel_id", "PK"), ("terminal", ""), ("flight_id", "FK -> FLIGHTS.flight_id")]},
    {"id": "t_passengers", "title": "PASSENGERS", "x": 1580, "y": 840, "w": 240, "fields": [("passenger_id", "PK"), ("passport_number", ""), ("flight_id", "FK -> FLIGHTS.flight_id")]},
    {"id": "t_lounges", "title": "LOUNGE_VISITS", "x": 1850, "y": 840, "w": 240, "fields": [("visit_id", "PK"), ("lounge_name", ""), ("passenger_id", "FK -> PASSENGERS.passenger_id")]},

    # ROW 4 (y=1220) - LOGISTICS & PASSENGER CHECKPOINT JOURNEY
    {"id": "t_fuel", "title": "FUEL_LOGS", "x": 780, "y": 1220, "w": 230, "fields": [("fuel_log_id", "PK"), ("fuel_density", ""), ("task_id", "FK -> TASKS.task_id")]},
    {"id": "t_cargo", "title": "CARGO_MANIFESTS", "x": 1050, "y": 1220, "w": 240, "fields": [("cargo_id", "PK"), ("container_id", ""), ("fuel_log_id", "FK -> FUEL_LOGS.fuel_log_id")]},
    {"id": "t_bpasses", "title": "BOARDING_PASSES", "x": 1580, "y": 1220, "w": 250, "fields": [("boarding_pass_id", "PK"), ("barcode_data", ""), ("seat_number", ""), ("cabin_class", ""), ("passenger_id", "FK -> PASSENGERS.passenger_id"), ("flight_id", "FK -> FLIGHTS.flight_id")]},
    {"id": "t_checkpoints", "title": "SECURITY_CHECKPOINTS", "x": 1860, "y": 1220, "w": 250, "fields": [("checkpoint_id", "PK"), ("checkpoint_name", ""), ("checkpoint_type", ""), ("terminal", "")]},
    {"id": "t_clearance", "title": "PASSENGER_CLEARANCE_LOGS", "x": 2140, "y": 1220, "w": 280, "fields": [("clearance_id", "PK"), ("scan_timestamp", ""), ("clearance_status", ""), ("verification_method", ""), ("passenger_id", "FK -> PASSENGERS.passenger_id"), ("boarding_pass_id", "FK -> BOARDING_PASSES.boarding_pass_id"), ("checkpoint_id", "FK -> SECURITY_CHECKPOINTS.checkpoint_id")]},
    {"id": "t_immigration", "title": "IMMIGRATION_RECORDS", "x": 2450, "y": 1220, "w": 260, "fields": [("immigration_id", "PK"), ("passport_number", ""), ("visa_type", ""), ("stamp_number", ""), ("biometric_facial_matched", ""), ("clearance_type", ""), ("passenger_id", "FK -> PASSENGERS.passenger_id")]}
]

xml_parts = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<mxfile host="Electron">',
    '  <diagram name="AOCS-Relational-Schema" id="aocs-relational-schema-01">',
    '    <mxGraphModel dx="3200" dy="2200" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="3200" pageHeight="2200" math="0" shadow="0">',
    '      <root>',
    '        <mxCell id="0" />',
    '        <mxCell id="1" parent="0" />',
    '',
    '        <!-- HEADER TITLE -->',
    '        <mxCell id="hdr_title" value="&lt;b style=&quot;font-size: 16px;&quot;&gt;AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;Complete 21-Table Physical Relational Database Schema (Elmasri &amp;amp; Navathe Chapter 7 Mapping)&lt;/span&gt;" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=14;fillColor=none;strokeColor=default;fontColor=default;" vertex="1" parent="1">',
    '          <mxGeometry x="50" y="30" width="2660" height="50" as="geometry" />',
    '        </mxCell>',
    ''
]

cell_counter = 100
field_id_map = {}

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

# FK -> PK Connectors
fk_connections = [
    ("t_users.role_id", "t_roles.role_id"),
    ("t_users.department_id", "t_depts.department_id"),
    ("t_uphones.user_id", "t_users.user_id"),
    ("t_flights.aircraft_id", "t_aircraft.aircraft_id"),
    ("t_flights.gate_id", "t_gates.gate_id"),
    ("t_flights.runway_id", "t_runways.runway_code"),
    ("t_flights.department_id", "t_depts.department_id"),
    ("t_tasks.flight_id", "t_flights.flight_id"),
    ("t_tasks.assigned_user_id", "t_users.user_id"),
    ("t_delays.flight_id", "t_flights.flight_id"),
    ("t_fuel.task_id", "t_tasks.task_id"),
    ("t_cargo.fuel_log_id", "t_fuel.fuel_log_id"),
    ("t_baggage.flight_id", "t_flights.flight_id"),
    ("t_passengers.flight_id", "t_flights.flight_id"),
    ("t_lounges.passenger_id", "t_passengers.passenger_id"),
    ("t_notif.user_id", "t_users.user_id"),
    ("t_audit.user_id", "t_users.user_id"),
    ("t_bpasses.passenger_id", "t_passengers.passenger_id"),
    ("t_bpasses.flight_id", "t_flights.flight_id"),
    ("t_clearance.passenger_id", "t_passengers.passenger_id"),
    ("t_clearance.boarding_pass_id", "t_bpasses.boarding_pass_id"),
    ("t_clearance.checkpoint_id", "t_checkpoints.checkpoint_id"),
    ("t_immigration.passenger_id", "t_passengers.passenger_id")
]

xml_parts.append('        <!-- 90-DEGREE ORTHOGONAL CONNECTORS -->')
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

rel_xml_str = "\n".join(xml_parts)
with open(rel_path, "w", encoding="utf-8") as f:
    f.write(rel_xml_str)

# Sync Relational Schema XML
with open(os.path.join(db_dir, "Relational-Schema.xml"), "w", encoding="utf-8") as f:
    f.write(rel_xml_str)

print("Successfully updated AOCS Relational Schema XML with 21 tables!")
