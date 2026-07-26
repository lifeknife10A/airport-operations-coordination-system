import os

db_dir = "/Users/krish/Desktop/Software Engineering/Mini Project/db"
rel_path = os.path.join(db_dir, "AOCS Relational Schema.drawio.xml")

relational_tables_36 = [
    # ROW 1 (y=120) - MASTERS & IAM
    {"id": "t_roles", "title": "ROLES", "x": 50, "y": 120, "w": 200, "fields": [("role_id", "PK"), ("role_name", "")]},
    {"id": "t_depts", "title": "DEPARTMENTS", "x": 280, "y": 120, "w": 220, "fields": [("department_id", "PK"), ("department_name", "")]},
    {"id": "t_airlines", "title": "AIRLINES", "x": 530, "y": 120, "w": 220, "fields": [("airline_id", "PK"), ("iata_code", ""), ("icao_code", ""), ("airline_name", ""), ("country", "")]},
    {"id": "t_airports", "title": "AIRPORTS", "x": 780, "y": 120, "w": 220, "fields": [("airport_id", "PK"), ("iata_code", ""), ("icao_code", ""), ("airport_name", ""), ("city", "")]},
    {"id": "t_actypes", "title": "AIRCRAFT_TYPES", "x": 1030, "y": 120, "w": 240, "fields": [("type_id", "PK"), ("type_code", ""), ("wingspan_meters", ""), ("mtow_kg", ""), ("max_passenger_capacity", "")]},
    {"id": "t_aircraft", "title": "AIRCRAFT", "x": 1300, "y": 120, "w": 230, "fields": [("aircraft_id", "PK"), ("registration_number", ""), ("type_id", "FK -> AIRCRAFT_TYPES.type_id"), ("airline_id", "FK -> AIRLINES.airline_id")]},
    {"id": "t_gates", "title": "GATES", "x": 1560, "y": 120, "w": 190, "fields": [("gate_id", "PK"), ("gate_number", "")]},
    {"id": "t_counters", "title": "CHECKIN_COUNTERS", "x": 1780, "y": 120, "w": 240, "fields": [("counter_id", "PK"), ("counter_number", ""), ("terminal", ""), ("allocated_airline_id", "FK -> AIRLINES.airline_id")]},
    {"id": "t_stands", "title": "STANDS", "x": 2050, "y": 120, "w": 220, "fields": [("stand_id", "PK"), ("stand_number", ""), ("is_remote", ""), ("assigned_gate_id", "FK -> GATES.gate_id")]},
    {"id": "t_runways", "title": "RUNWAYS", "x": 2300, "y": 120, "w": 190, "fields": [("runway_id", "PK"), ("runway_code", "")]},

    # ROW 2 (y=450) - USERS & FLIGHTS
    {"id": "t_users", "title": "USERS", "x": 200, "y": 450, "w": 240, "fields": [("user_id", "PK"), ("username", ""), ("name", ""), ("role_id", "FK -> ROLES.role_id"), ("department_id", "FK -> DEPARTMENTS.department_id")]},
    {"id": "t_uphones", "title": "USER_PHONE_NUMBERS", "x": 480, "y": 450, "w": 260, "fields": [("user_id", "FK -> USERS.user_id"), ("phone_number", "PK")]},
    {"id": "t_weather", "title": "WEATHER_REPORTS", "x": 780, "y": 450, "w": 240, "fields": [("report_id", "PK"), ("visibility_meters", ""), ("wind_speed_knots", ""), ("runway_condition", "")]},
    {"id": "t_gaterules", "title": "GATE_ASSIGNMENT_RULES", "x": 1060, "y": 450, "w": 260, "fields": [("rule_id", "PK"), ("gate_id", "FK -> GATES.gate_id"), ("type_id", "FK -> AIRCRAFT_TYPES.type_id"), ("max_wingspan_meters", "")]},
    {"id": "t_flights", "title": "FLIGHTS", "x": 1360, "y": 450, "w": 300, "fields": [("flight_id", "PK"), ("flight_number", ""), ("flight_status", ""), ("origin_airport_id", "FK -> AIRPORTS.airport_id"), ("destination_airport_id", "FK -> AIRPORTS.airport_id"), ("airline_id", "FK -> AIRLINES.airline_id"), ("aircraft_id", "FK -> AIRCRAFT.aircraft_id"), ("gate_id", "FK -> GATES.gate_id"), ("stand_id", "FK -> STANDS.stand_id")]},

    # ROW 3 (y=880) - OPERATIONS & CARGO
    {"id": "t_equipment", "title": "GROUND_EQUIPMENT", "x": 50, "y": 880, "w": 230, "fields": [("equipment_id", "PK"), ("equipment_code", ""), ("equipment_type", ""), ("status", "")]},
    {"id": "t_tasks", "title": "TASKS", "x": 320, "y": 880, "w": 240, "fields": [("task_id", "PK"), ("task_name", ""), ("status", ""), ("scheduled_start", ""), ("flight_id", "FK -> FLIGHTS.flight_id"), ("assigned_user_id", "FK -> USERS.user_id")]},
    {"id": "t_eqassign", "title": "EQUIPMENT_ASSIGNMENTS", "x": 600, "y": 880, "w": 260, "fields": [("assignment_id", "PK"), ("equipment_id", "FK -> GROUND_EQUIPMENT.equipment_id"), ("task_id", "FK -> TASKS.task_id")]},
    {"id": "t_delays", "title": "DELAY_LOGS", "x": 890, "y": 880, "w": 230, "fields": [("flight_id", "FK -> FLIGHTS.flight_id"), ("delay_seq_no", "PK"), ("delay_code", ""), ("delay_minutes", "")]},
    {"id": "t_fuel", "title": "FUEL_LOGS", "x": 1160, "y": 880, "w": 230, "fields": [("fuel_log_id", "PK"), ("fuel_density", ""), ("task_id", "FK -> TASKS.task_id")]},
    {"id": "t_cargo", "title": "CARGO_MANIFESTS", "x": 1430, "y": 880, "w": 240, "fields": [("cargo_id", "PK"), ("container_id", ""), ("weight_kg", ""), ("cargo_type", ""), ("flight_id", "FK -> FLIGHTS.flight_id")]},
    {"id": "t_baggage", "title": "BAGGAGE_CAROUSELS", "x": 1700, "y": 880, "w": 240, "fields": [("carousel_id", "PK"), ("terminal", ""), ("flight_id", "FK -> FLIGHTS.flight_id")]},
    {"id": "t_passengers", "title": "PASSENGERS", "x": 1970, "y": 880, "w": 240, "fields": [("passenger_id", "PK"), ("passport_number", ""), ("pnr_code", ""), ("is_transit_passenger", ""), ("flight_id", "FK -> FLIGHTS.flight_id")]},

    # ROW 4 (y=1280) - PASSENGER CHECKPOINTS & MISHANDLED BAGGAGE
    {"id": "t_bpasses", "title": "BOARDING_PASSES", "x": 50, "y": 1280, "w": 250, "fields": [("boarding_pass_id", "PK"), ("barcode_data", ""), ("ticket_number", ""), ("seat_number", ""), ("passenger_id", "FK -> PASSENGERS.passenger_id"), ("flight_id", "FK -> FLIGHTS.flight_id")]},
    {"id": "t_bagtags", "title": "BAG_TAGS", "x": 340, "y": 1280, "w": 240, "fields": [("bag_tag_id", "PK"), ("tag_number", ""), ("weight_kg", ""), ("passenger_id", "FK -> PASSENGERS.passenger_id")]},
    {"id": "t_bagscans", "title": "BAGGAGE_SCAN_EVENTS", "x": 610, "y": 1280, "w": 260, "fields": [("scan_id", "PK"), ("bag_tag_id", "FK -> BAG_TAGS.bag_tag_id"), ("scan_location", ""), ("scan_timestamp", "")]},
    {"id": "t_mishandled", "title": "MISHANDLED_BAGGAGE", "x": 900, "y": 1280, "w": 260, "fields": [("report_id", "PK"), ("claim_number", ""), ("incident_type", ""), ("status", ""), ("bag_tag_id", "FK -> BAG_TAGS.bag_tag_id"), ("passenger_id", "FK -> PASSENGERS.passenger_id")]},
    {"id": "t_checkpoints", "title": "SECURITY_CHECKPOINTS", "x": 1190, "y": 1280, "w": 250, "fields": [("checkpoint_id", "PK"), ("checkpoint_name", ""), ("checkpoint_type", ""), ("terminal", "")]},
    {"id": "t_clearance", "title": "PASSENGER_CLEARANCE_LOGS", "x": 1470, "y": 1280, "w": 280, "fields": [("clearance_id", "PK"), ("scan_timestamp", ""), ("clearance_status", ""), ("denial_reason", ""), ("passenger_id", "FK -> PASSENGERS.passenger_id"), ("checkpoint_id", "FK -> SECURITY_CHECKPOINTS.checkpoint_id")]},
    {"id": "t_immigration", "title": "IMMIGRATION_RECORDS", "x": 1780, "y": 1280, "w": 260, "fields": [("immigration_id", "PK"), ("passport_number", ""), ("visa_type", ""), ("stamp_number", ""), ("passenger_id", "FK -> PASSENGERS.passenger_id")]},
    {"id": "t_lounges", "title": "LOUNGE_VISITS", "x": 2070, "y": 1280, "w": 240, "fields": [("visit_id", "PK"), ("lounge_name", ""), ("passenger_id", "FK -> PASSENGERS.passenger_id")]},

    # ROW 5 (y=1660) - FEEDBACK, BILLING & AUDIT
    {"id": "t_feedback", "title": "CUSTOMER_FEEDBACK_LOGS", "x": 50, "y": 1660, "w": 260, "fields": [("feedback_id", "PK"), ("rating", ""), ("category", ""), ("passenger_id", "FK -> PASSENGERS.passenger_id")]},
    {"id": "t_invoices", "title": "AIRLINE_BILLING_INVOICES", "x": 340, "y": 1660, "w": 270, "fields": [("invoice_id", "PK"), ("invoice_number", ""), ("total_amount_usd", ""), ("airline_id", "FK -> AIRLINES.airline_id")]},
    {"id": "t_lineitems", "title": "INVOICE_LINE_ITEMS", "x": 640, "y": 1660, "w": 260, "fields": [("line_item_id", "PK"), ("charge_type", ""), ("amount_usd", ""), ("invoice_id", "FK -> AIRLINE_BILLING_INVOICES.invoice_id")]},
    {"id": "t_notif", "title": "NOTIFICATIONS", "x": 930, "y": 1660, "w": 220, "fields": [("notification_id", "PK"), ("title", ""), ("user_id", "FK -> USERS.user_id")]},
    {"id": "t_audit", "title": "AUDIT_LOGS", "x": 1180, "y": 1660, "w": 230, "fields": [("log_id", "PK"), ("action", ""), ("created_at", ""), ("user_id", "FK -> USERS.user_id")]}
]

xml_parts = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<mxfile host="Electron">',
    '  <diagram name="AOCS-Relational-Schema" id="aocs-relational-schema-01">',
    '    <mxGraphModel dx="4000" dy="2800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="4000" pageHeight="2800" math="0" shadow="0">',
    '      <root>',
    '        <mxCell id="0" />',
    '        <mxCell id="1" parent="0" />',
    '',
    '        <!-- HEADER TITLE -->',
    '        <mxCell id="hdr_title" value="&lt;b style=&quot;font-size: 16px;&quot;&gt;AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;Complete 36-Table Master Hybrid Relational Schema (Peer-Reviewed &amp;amp; Audited Architecture)&lt;/span&gt;" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=14;fillColor=none;strokeColor=default;fontColor=default;" vertex="1" parent="1">',
    '          <mxGeometry x="50" y="30" width="3400" height="50" as="geometry" />',
    '        </mxCell>',
    ''
]

cell_counter = 100
field_id_map = {}

for tbl in relational_tables_36:
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
    ("t_aircraft.type_id", "t_actypes.type_id"),
    ("t_aircraft.airline_id", "t_airlines.airline_id"),
    ("t_counters.allocated_airline_id", "t_airlines.airline_id"),
    ("t_stands.assigned_gate_id", "t_gates.gate_id"),
    ("t_gaterules.gate_id", "t_gates.gate_id"),
    ("t_gaterules.type_id", "t_actypes.type_id"),
    ("t_flights.airline_id", "t_airlines.airline_id"),
    ("t_flights.origin_airport_id", "t_airports.airport_id"),
    ("t_flights.destination_airport_id", "t_airports.airport_id"),
    ("t_flights.aircraft_id", "t_aircraft.aircraft_id"),
    ("t_flights.gate_id", "t_gates.gate_id"),
    ("t_flights.stand_id", "t_stands.stand_id"),
    ("t_eqassign.equipment_id", "t_equipment.equipment_id"),
    ("t_eqassign.task_id", "t_tasks.task_id"),
    ("t_tasks.flight_id", "t_flights.flight_id"),
    ("t_tasks.assigned_user_id", "t_users.user_id"),
    ("t_delays.flight_id", "t_flights.flight_id"),
    ("t_fuel.task_id", "t_tasks.task_id"),
    ("t_cargo.flight_id", "t_flights.flight_id"),
    ("t_baggage.flight_id", "t_flights.flight_id"),
    ("t_passengers.flight_id", "t_flights.flight_id"),
    ("t_bpasses.passenger_id", "t_passengers.passenger_id"),
    ("t_bpasses.flight_id", "t_flights.flight_id"),
    ("t_bagtags.passenger_id", "t_passengers.passenger_id"),
    ("t_bagscans.bag_tag_id", "t_bagtags.bag_tag_id"),
    ("t_mishandled.bag_tag_id", "t_bagtags.bag_tag_id"),
    ("t_mishandled.passenger_id", "t_passengers.passenger_id"),
    ("t_clearance.passenger_id", "t_passengers.passenger_id"),
    ("t_clearance.checkpoint_id", "t_checkpoints.checkpoint_id"),
    ("t_immigration.passenger_id", "t_passengers.passenger_id"),
    ("t_lounges.passenger_id", "t_passengers.passenger_id"),
    ("t_feedback.passenger_id", "t_passengers.passenger_id"),
    ("t_invoices.airline_id", "t_airlines.airline_id"),
    ("t_lineitems.invoice_id", "t_invoices.invoice_id"),
    ("t_notif.user_id", "t_users.user_id"),
    ("t_audit.user_id", "t_users.user_id")
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

print("Successfully updated AOCS Relational Schema XML with 36 normalized tables!")
