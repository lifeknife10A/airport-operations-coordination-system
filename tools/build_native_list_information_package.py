import os

db_dir = "/Users/krish/Desktop/Software Engineering/Mini Project/db"
os.makedirs(db_dir, exist_ok=True)
drawio_path = os.path.join(db_dir, "AOCS Information Package.drawio.xml")

# 10 Dimensions & their List items:
dimensions = [
    {
        "id": "dim_time",
        "title": "DIM_TIME (Calendar & Shift)",
        "x": 50,
        "items": [
            "Year",
            "  └── Quarter",
            "      └── Month / Week",
            "          └── Date",
            "              └── Shift (Morn/Aft)",
            "                  └── Peak Hour",
            "──────────────────────",
            "[Keys & Attributes]",
            "• time_key (PK)",
            "• full_date",
            "• day_of_week",
            "• is_holiday_flag"
        ]
    },
    {
        "id": "dim_flight",
        "title": "DIM_FLIGHT (FLIGHTS)",
        "x": 260,
        "items": [
            "Airline / Carrier",
            "  └── Flight Category (Pax/Cargo)",
            "      └── Route Type (Dom/Intl)",
            "          └── Flight Number",
            "              └── Flight ID",
            "──────────────────────",
            "[Keys & Attributes]",
            "• flight_key (PK)",
            "• flight_number",
            "• carrier_code",
            "• flight_status"
        ]
    },
    {
        "id": "dim_aircraft",
        "title": "DIM_AIRCRAFT (AIRCRAFT)",
        "x": 470,
        "items": [
            "Manufacturer (Boeing/Airbus)",
            "  └── Aircraft Model Series",
            "      └── Registration Number",
            "          └── Aircraft ID",
            "──────────────────────",
            "[Keys & Attributes]",
            "• aircraft_key (PK)",
            "• registration_number",
            "• model_type",
            "• seating_capacity"
        ]
    },
    {
        "id": "dim_gate",
        "title": "DIM_GATE (GATES)",
        "x": 680,
        "items": [
            "Airport Terminal",
            "  └── Concourse / Zone",
            "      └── Gate Type (Contact/Rem)",
            "          └── Gate Number",
            "              └── Gate ID",
            "──────────────────────",
            "[Keys & Attributes]",
            "• gate_key (PK)",
            "• gate_number",
            "• terminal_code",
            "• concourse_zone"
        ]
    },
    {
        "id": "dim_runway",
        "title": "DIM_RUNWAY (RUNWAYS)",
        "x": 890,
        "items": [
            "Airside Sector",
            "  └── Surface Type",
            "      └── Length Category",
            "          └── Runway Code",
            "              └── Runway ID",
            "──────────────────────",
            "[Keys & Attributes]",
            "• runway_key (PK)",
            "• runway_code",
            "• length_meters",
            "• surface_type"
        ]
    },
    {
        "id": "dim_user",
        "title": "DIM_USER (USERS)",
        "x": 1100,
        "items": [
            "Employment Status",
            "  └── Staff Full Name",
            "      └── Username",
            "          └── User ID",
            "──────────────────────",
            "[Keys & Attributes]",
            "• user_key (PK)",
            "• username",
            "• full_name",
            "• phone_number"
        ]
    },
    {
        "id": "dim_dept",
        "title": "DIM_DEPARTMENT (DEPARTMENTS)",
        "x": 1310,
        "items": [
            "Department Category",
            "  └── Department Name",
            "      └── Manager / Supervisor",
            "          └── Department ID",
            "──────────────────────",
            "[Keys & Attributes]",
            "• department_key (PK)",
            "• department_name",
            "• manager_name",
            "• number_of_staff"
        ]
    },
    {
        "id": "dim_role",
        "title": "DIM_ROLE (ROLES)",
        "x": 1520,
        "items": [
            "Access Security Tier",
            "  └── Operational Clearance",
            "      └── Role Name",
            "          └── Role ID",
            "──────────────────────",
            "[Keys & Attributes]",
            "• role_key (PK)",
            "• role_name",
            "• clearance_level"
        ]
    },
    {
        "id": "dim_passenger",
        "title": "DIM_PASSENGER (PASSENGERS)",
        "x": 1730,
        "items": [
            "Passport Country",
            "  └── VIP Tier Level",
            "      └── Executive Lounge Used",
            "          └── Passport Number",
            "              └── Passenger ID",
            "──────────────────────",
            "[Keys & Attributes]",
            "• passenger_key (PK)",
            "• passport_number",
            "• lounge_name",
            "• vip_level"
        ]
    },
    {
        "id": "dim_logistics",
        "title": "DIM_LOGISTICS (LOGISTICS)",
        "x": 1940,
        "items": [
            "Logistics Category",
            "  ├── Fuel Grade / Density",
            "  ├── Cargo Container Type",
            "  └── Carousel Terminal",
            "──────────────────────",
            "[Keys & Attributes]",
            "• logistics_key (PK)",
            "• container_id",
            "• fuel_density",
            "• carousel_id"
        ]
    }
]

# Fact list categories
fact_categories = [
    {
        "id": "fact_turnaround",
        "title": " Turnaround Duration",
        "x": 50,
        "w": 505,
        "items": [
            "• planned_turnaround_mins",
            "• actual_turnaround_mins",
            "• turnaround_variance_mins",
            "• turnaround_efficiency_pct"
        ]
    },
    {
        "id": "fact_delay",
        "title": " Delay & Bottlenecks",
        "x": 575,
        "w": 505,
        "items": [
            "• total_delay_mins",
            "• ground_delay_mins",
            "• air_delay_mins",
            "• delay_incident_count"
        ]
    },
    {
        "id": "fact_logistics",
        "title": " Logistics & Resource Volume",
        "x": 1100,
        "w": 505,
        "items": [
            "• passenger_count (Boarded)",
            "• lounge_visit_count",
            "• baggage_units_processed",
            "• cargo_weight_kg",
            "• fuel_delivered_liters"
        ]
    },
    {
        "id": "fact_staff",
        "title": " Staff & Task Performance",
        "x": 1625,
        "w": 510,
        "items": [
            "• total_tasks_assigned",
            "• tasks_completed_on_time",
            "• task_delay_duration_mins",
            "• staff_productivity_rate"
        ]
    }
]

xml_parts = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<mxfile host="Electron">',
    '  <diagram name="AOCS-Information-Package-Matrix" id="aocs-ipm-list">',
    '    <mxGraphModel dx="2400" dy="1600" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="2400" pageHeight="1600" math="0" shadow="0">',
    '      <root>',
    '        <mxCell id="0" />',
    '        <mxCell id="1" parent="0" />',
    '',
    '        <!-- HEADER TITLE BLOCK -->',
    '        <mxCell id="hdr_title" value="&lt;b style=&quot;font-size: 16px;&quot;&gt;AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;Information Package Diagram (Data Warehouse Dimensional Analytics Matrix)&lt;/span&gt;" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=14;fillColor=none;strokeColor=default;fontColor=default;" vertex="1" parent="1">',
    '          <mxGeometry x="50" y="30" width="2085" height="50" as="geometry" />',
    '        </mxCell>',
    '',
    '        <!-- SUBJECT AREA BANNER -->',
    '        <mxCell id="hdr_subject" value="&lt;b&gt;BUSINESS SUBJECT AREA:&lt;/b&gt; Flight Turnaround &amp;amp; Operational Performance Analytics &amp;nbsp;&amp;nbsp;&amp;nbsp;|&amp;nbsp;&amp;nbsp;&amp;nbsp; &lt;b&gt;GRAIN:&lt;/b&gt; Atomic — One record per individual flight turnaround event" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=0;fontSize=11;fillColor=none;strokeColor=default;fontColor=default;" vertex="1" parent="1">',
    '          <mxGeometry x="50" y="90" width="2085" height="35" as="geometry" />',
    '        </mxCell>',
    ''
]

# Add Dimension List shapes
cell_counter = 100
for dim in dimensions:
    container_id = f"cell_{cell_counter}"
    cell_counter += 1
    
    # Calculate container height based on items
    item_height = 24
    header_height = 35
    total_height = header_height + (len(dim["items"]) * item_height)
    
    # Container cell (Native Draw.io List / Swimlane component shape)
    xml_parts.append(f'        <!-- {dim["title"]} LIST CONTAINER -->')
    xml_parts.append(f'        <mxCell id="{container_id}" value="{dim["title"]}" style="swimlane;fontStyle=1;fontSize=11;childLayout=stackLayout;horizontal=1;startSize={header_height};horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=default;fontColor=default;" vertex="1" parent="1">')
    xml_parts.append(f'          <mxGeometry x="{dim["x"]}" y="135" width="195" height="{total_height}" as="geometry" />')
    xml_parts.append(f'        </mxCell>')
    
    # Add child items inside container
    curr_y = header_height
    for idx, item in enumerate(dim["items"]):
        item_id = f"cell_{cell_counter}"
        cell_counter += 1
        escaped_item = item.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        
        # Style for divider vs item
        if "──────" in item:
            item_style = "text;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rotatable=0;points=[];portConstraint=eastwest;whiteSpace=wrap;html=1;fontSize=9;fontColor=#666666;"
        elif "[Keys" in item:
            item_style = "text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=8;fontStyle=1;rotatable=0;points=[];portConstraint=eastwest;whiteSpace=wrap;html=1;fontSize=10;fontColor=default;"
        else:
            item_style = "text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=8;rotatable=0;points=[];portConstraint=eastwest;whiteSpace=wrap;html=1;fontSize=10;fontColor=default;"
            
        xml_parts.append(f'        <mxCell id="{item_id}" value="{escaped_item}" style="{item_style}" vertex="1" parent="{container_id}">')
        xml_parts.append(f'          <mxGeometry y="{curr_y}" width="195" height="{item_height}" as="geometry" />')
        xml_parts.append(f'        </mxCell>')
        curr_y += item_height
    xml_parts.append('')

# Add Fact Header Banner
xml_parts.append('        <!-- FACT METRICS HEADER BANNER -->')
xml_parts.append('        <mxCell id="hdr_fact" value="&lt;b style=&quot;font-size: 13px;&quot;&gt;FACT METRICS &amp;amp; MEASURES (QUANTITATIVE ANALYTICAL KPIS - FACT_FLIGHT_TURNAROUND)&lt;/b&gt;" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=12;fillColor=none;strokeColor=default;fontColor=default;" vertex="1" parent="1">')
xml_parts.append('          <mxGeometry x="50" y="535" width="2085" height="35" as="geometry" />')
xml_parts.append('        </mxCell>')
xml_parts.append('')

# Add Fact Category List shapes
for fc in fact_categories:
    container_id = f"cell_{cell_counter}"
    cell_counter += 1
    
    item_height = 24
    header_height = 30
    total_height = header_height + (len(fc["items"]) * item_height)
    
    xml_parts.append(f'        <!-- {fc["title"]} LIST CONTAINER -->')
    xml_parts.append(f'        <mxCell id="{container_id}" value="{fc["title"]}" style="swimlane;fontStyle=1;fontSize=11;childLayout=stackLayout;horizontal=1;startSize={header_height};horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=default;fontColor=default;" vertex="1" parent="1">')
    xml_parts.append(f'          <mxGeometry x="{fc["x"]}" y="580" width="{fc["w"]}" height="{total_height}" as="geometry" />')
    xml_parts.append(f'        </mxCell>')
    
    curr_y = header_height
    for item in fc["items"]:
        item_id = f"cell_{cell_counter}"
        cell_counter += 1
        escaped_item = item.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        item_style = "text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=10;rotatable=0;points=[];portConstraint=eastwest;whiteSpace=wrap;html=1;fontSize=10;fontColor=default;"
        
        xml_parts.append(f'        <mxCell id="{item_id}" value="{escaped_item}" style="{item_style}" vertex="1" parent="{container_id}">')
        xml_parts.append(f'          <mxGeometry y="{curr_y}" width="{fc["w"]}" height="{item_height}" as="geometry" />')
        xml_parts.append(f'        </mxCell>')
        curr_y += item_height
    xml_parts.append('')

xml_parts.extend([
    '      </root>',
    '    </mxGraphModel>',
    '  </diagram>',
    '</mxfile>'
])

xml_str = "\n".join(xml_parts)

with open(drawio_path, "w", encoding="utf-8") as f:
    f.write(xml_str)

print(f"Successfully generated native List container diagram in {drawio_path}")

# Sync to db/Information-Package.xml
sync_path = os.path.join(db_dir, "Information-Package.xml")
with open(sync_path, "w", encoding="utf-8") as f:
    f.write(xml_str)

print(f"Successfully synced to {sync_path}")
