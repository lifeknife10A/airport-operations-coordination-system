import os

db_dir = "/Users/krish/Desktop/Software Engineering/Mini Project/db"
os.makedirs(db_dir, exist_ok=True)
xml_path = os.path.join(db_dir, "AOCS Star Schema.drawio.xml")

# Table Definitions
dimensions_data = [
    {
        "id": "dim_time",
        "title": "DIM_TIME",
        "x": 120, "y": 140, "w": 230,
        "pk": "time_key [PK]",
        "attrs": ["full_date", "year", "quarter", "month", "week", "day_of_week", "shift_name", "is_holiday_flag"]
    },
    {
        "id": "dim_flight",
        "title": "DIM_FLIGHT",
        "x": 120, "y": 440, "w": 230,
        "pk": "flight_key [PK]",
        "attrs": ["flight_id", "flight_number", "carrier_code", "route_type", "flight_category", "flight_status"]
    },
    {
        "id": "dim_aircraft",
        "title": "DIM_AIRCRAFT",
        "x": 120, "y": 720, "w": 230,
        "pk": "aircraft_key [PK]",
        "attrs": ["aircraft_id", "registration_number", "manufacturer", "model_type", "seating_capacity"]
    },
    {
        "id": "dim_gate",
        "title": "DIM_GATE",
        "x": 450, "y": 140, "w": 230,
        "pk": "gate_key [PK]",
        "attrs": ["gate_id", "gate_number", "terminal_code", "concourse_zone", "gate_type"]
    },
    {
        "id": "dim_runway",
        "title": "DIM_RUNWAY",
        "x": 450, "y": 720, "w": 230,
        "pk": "runway_key [PK]",
        "attrs": ["runway_id", "runway_code", "airside_sector", "surface_type", "length_meters"]
    },
    {
        "id": "dim_user",
        "title": "DIM_USER",
        "x": 1720, "y": 140, "w": 230,
        "pk": "user_key [PK]",
        "attrs": ["user_id", "username", "full_name", "phone_number", "employment_status"]
    },
    {
        "id": "dim_dept",
        "title": "DIM_DEPARTMENT",
        "x": 1720, "y": 720, "w": 230,
        "pk": "department_key [PK]",
        "attrs": ["department_id", "department_name", "manager_name", "number_of_staff"]
    },
    {
        "id": "dim_role",
        "title": "DIM_ROLE",
        "x": 2050, "y": 140, "w": 230,
        "pk": "role_key [PK]",
        "attrs": ["role_id", "role_name", "access_tier", "clearance_level"]
    },
    {
        "id": "dim_passenger",
        "title": "DIM_PASSENGER",
        "x": 2050, "y": 440, "w": 230,
        "pk": "passenger_key [PK]",
        "attrs": ["passenger_id", "passport_number", "passport_country", "lounge_name", "vip_level"]
    },
    {
        "id": "dim_logistics",
        "title": "DIM_LOGISTICS",
        "x": 2050, "y": 720, "w": 230,
        "pk": "logistics_key [PK]",
        "attrs": ["logistics_id", "container_id", "fuel_density", "carousel_id", "resource_category"]
    }
]

fact_data = {
    "id": "fact_turnaround",
    "title": "FACT_FLIGHT_TURNAROUND",
    "x": 1000, "y": 180, "w": 400,
    "pk": "turnaround_fact_id [PK]",
    "fks": [
        "time_key [FK]",
        "flight_key [FK]",
        "aircraft_key [FK]",
        "gate_key [FK]",
        "runway_key [FK]",
        "user_key [FK]",
        "department_key [FK]",
        "role_key [FK]",
        "passenger_key [FK]",
        "logistics_key [FK]"
    ],
    "measures": [
        "planned_turnaround_mins",
        "actual_turnaround_mins",
        "turnaround_variance_mins",
        "turnaround_efficiency_pct",
        "total_delay_mins",
        "ground_delay_mins",
        "air_delay_mins",
        "delay_incident_count",
        "passenger_count",
        "lounge_visit_count",
        "baggage_units_processed",
        "cargo_weight_kg",
        "fuel_delivered_liters",
        "total_tasks_assigned",
        "tasks_completed_on_time",
        "task_delay_duration_mins"
    ]
}

xml_parts = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<mxfile host="Electron">',
    '  <diagram name="AOCS-Star-Schema-Model" id="aocs-star-schema-01">',
    '    <mxGraphModel dx="2600" dy="1800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="2600" pageHeight="1800" math="0" shadow="0">',
    '      <root>',
    '        <mxCell id="0" />',
    '        <mxCell id="1" parent="0" />',
    '',
    '        <!-- HEADER TITLE -->',
    '        <mxCell id="hdr_title" value="&lt;b style=&quot;font-size: 16px;&quot;&gt;AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;Data Warehouse Star Schema Diagram (1 Central Fact Table &amp;amp; 10 Conformed Dimension Tables)&lt;/span&gt;" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=14;fillColor=none;strokeColor=default;fontColor=default;" vertex="1" parent="1">',
    '          <mxGeometry x="120" y="30" width="2160" height="50" as="geometry" />',
    '        </mxCell>',
    ''
]

cell_counter = 100
fk_cell_map = {}
pk_cell_map = {}

# 1. BUILD CENTRAL FACT TABLE
fact_container_id = f"cell_{cell_counter}"
cell_counter += 1

row_h = 24
header_h = 35
total_fact_rows = 1 + len(fact_data["fks"]) + 1 + len(fact_data["measures"]) # PK + FKs + Separator + Measures
total_fact_height = header_h + (total_fact_rows * row_h)

xml_parts.append('        <!-- CENTRAL FACT TABLE -->')
xml_parts.append(f'        <mxCell id="{fact_container_id}" value="&lt;b style=&quot;font-size: 13px;&quot;&gt;{fact_data["title"]}&lt;/b&gt;" style="swimlane;fontStyle=1;fontSize=12;childLayout=stackLayout;horizontal=1;startSize={header_h};horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=default;fontColor=default;" vertex="1" parent="1">')
xml_parts.append(f'          <mxGeometry x="{fact_data["x"]}" y="{fact_data["y"]}" width="{fact_data["w"]}" height="{total_fact_height}" as="geometry" />')
xml_parts.append('        </mxCell>')

curr_y = header_h

# PK
pk_id = f"cell_{cell_counter}"
cell_counter += 1
xml_parts.append(f'        <mxCell id="{pk_id}" value="&lt;b&gt;{fact_data["pk"]}&lt;/b&gt;" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=10;rotatable=0;points=[];portConstraint=eastwest;whiteSpace=wrap;html=1;fontSize=10;fontColor=default;" vertex="1" parent="{fact_container_id}">')
xml_parts.append(f'          <mxGeometry y="{curr_y}" width="{fact_data["w"]}" height="{row_h}" as="geometry" />')
xml_parts.append('        </mxCell>')
curr_y += row_h

# FKs
for fk in fact_data["fks"]:
    fk_id = f"cell_{cell_counter}"
    cell_counter += 1
    fk_clean = fk.replace("[FK]", "").strip()
    fk_cell_map[fk_clean] = fk_id
    
    xml_parts.append(f'        <mxCell id="{fk_id}" value="• &lt;u&gt;{fk}&lt;/u&gt;" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=10;rotatable=0;points=[];portConstraint=eastwest;whiteSpace=wrap;html=1;fontSize=10;fontColor=default;" vertex="1" parent="{fact_container_id}">')
    xml_parts.append(f'          <mxGeometry y="{curr_y}" width="{fact_data["w"]}" height="{row_h}" as="geometry" />')
    xml_parts.append('        </mxCell>')
    curr_y += row_h

# Separator
sep_id = f"cell_{cell_counter}"
cell_counter += 1
xml_parts.append(f'        <mxCell id="{sep_id}" value="────── [FACT MEASURES &amp;amp; KPIS] ──────" style="text;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rotatable=0;points=[];portConstraint=eastwest;whiteSpace=wrap;html=1;fontSize=9;fontColor=#666666;" vertex="1" parent="{fact_container_id}">')
xml_parts.append(f'          <mxGeometry y="{curr_y}" width="{fact_data["w"]}" height="{row_h}" as="geometry" />')
xml_parts.append('        </mxCell>')
curr_y += row_h

# Measures
for m in fact_data["measures"]:
    m_id = f"cell_{cell_counter}"
    cell_counter += 1
    xml_parts.append(f'        <mxCell id="{m_id}" value="  {m}" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=10;rotatable=0;points=[];portConstraint=eastwest;whiteSpace=wrap;html=1;fontSize=10;fontColor=default;" vertex="1" parent="{fact_container_id}">')
    xml_parts.append(f'          <mxGeometry y="{curr_y}" width="{fact_data["w"]}" height="{row_h}" as="geometry" />')
    xml_parts.append('        </mxCell>')
    curr_y += row_h

xml_parts.append('')

# 2. BUILD 10 DIMENSION TABLES
for dim in dimensions_data:
    dim_container_id = f"cell_{cell_counter}"
    cell_counter += 1
    
    total_dim_rows = 1 + len(dim["attrs"]) # PK + Attrs
    total_dim_height = header_h + (total_dim_rows * row_h)
    
    xml_parts.append(f'        <!-- DIMENSION TABLE: {dim["title"]} -->')
    xml_parts.append(f'        <mxCell id="{dim_container_id}" value="&lt;b style=&quot;font-size: 12px;&quot;&gt;{dim["title"]}&lt;/b&gt;" style="swimlane;fontStyle=1;fontSize=11;childLayout=stackLayout;horizontal=1;startSize={header_h};horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=default;fontColor=default;" vertex="1" parent="1">')
    xml_parts.append(f'          <mxGeometry x="{dim["x"]}" y="{dim["y"]}" width="{dim["w"]}" height="{total_dim_height}" as="geometry" />')
    xml_parts.append('        </mxCell>')
    
    curr_y = header_h
    pk_id = f"cell_{cell_counter}"
    cell_counter += 1
    pk_clean = dim["pk"].replace("[PK]", "").strip()
    pk_cell_map[pk_clean] = dim_container_id
    
    xml_parts.append(f'        <mxCell id="{pk_id}" value="&lt;b&gt;• {dim["pk"]}&lt;/b&gt;" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=10;rotatable=0;points=[];portConstraint=eastwest;whiteSpace=wrap;html=1;fontSize=10;fontColor=default;" vertex="1" parent="{dim_container_id}">')
    xml_parts.append(f'          <mxGeometry y="{curr_y}" width="{dim["w"]}" height="{row_h}" as="geometry" />')
    xml_parts.append('        </mxCell>')
    curr_y += row_h
    
    for attr in dim["attrs"]:
        attr_id = f"cell_{cell_counter}"
        cell_counter += 1
        xml_parts.append(f'        <mxCell id="{attr_id}" value="  {attr}" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=10;rotatable=0;points=[];portConstraint=eastwest;whiteSpace=wrap;html=1;fontSize=10;fontColor=default;" vertex="1" parent="{dim_container_id}">')
        xml_parts.append(f'          <mxGeometry y="{curr_y}" width="{dim["w"]}" height="{row_h}" as="geometry" />')
        xml_parts.append('        </mxCell>')
        curr_y += row_h
    xml_parts.append('')

# 3. BUILD 10 ORTHOGONAL FK -> PK CONNECTORS
xml_parts.append('        <!-- 10 ORTHOGONAL RELATIONSHIP LINES (1:N STAR SCHEMA CONNECTORS) -->')

# Connector mapping: (FK Key Name, Dimension Table Container ID)
fk_dim_links = [
    ("time_key", "cell_127"),       # dim_time container
    ("flight_key", "cell_138"),     # dim_flight container
    ("aircraft_key", "cell_147"),   # dim_aircraft container
    ("gate_key", "cell_155"),       # dim_gate container
    ("runway_key", "cell_163"),     # dim_runway container
    ("user_key", "cell_171"),       # dim_user container
    ("department_key", "cell_179"), # dim_dept container
    ("role_key", "cell_186"),       # dim_role container
    ("passenger_key", "cell_193"),  # dim_passenger container
    ("logistics_key", "cell_201")   # dim_logistics container
]

for fk_name, fk_cell_id in fk_cell_map.items():
    # Find matching dimension container
    dim_target_id = None
    for dim_info in dimensions_data:
        if dim_info["pk"].startswith(fk_name):
            # match found
            for k, v in pk_cell_map.items():
                if k == fk_name:
                    dim_target_id = v
                    break
    
    if dim_target_id:
        edge_id = f"edge_{cell_counter}"
        cell_counter += 1
        xml_parts.append(f'        <mxCell id="{edge_id}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;endArrow=classic;endFill=1;strokeColor=default;" edge="1" parent="1" source="{fk_cell_id}" target="{dim_target_id}">')
        xml_parts.append('          <mxGeometry relative="1" as="geometry" />')
        xml_parts.append('        </mxCell>')

xml_parts.extend([
    '      </root>',
    '    </mxGraphModel>',
    '  </diagram>',
    '</mxfile>'
])

xml_str = "\n".join(xml_parts)

with open(xml_path, "w", encoding="utf-8") as f:
    f.write(xml_str)

print(f"Successfully generated clean monochrome Star Schema Draw.io file in {xml_path}")

# Also sync to db/Star-Schema.xml
sync_path = os.path.join(db_dir, "Star-Schema.xml")
with open(sync_path, "w", encoding="utf-8") as f:
    f.write(xml_str)

print(f"Successfully synced to {sync_path}")
