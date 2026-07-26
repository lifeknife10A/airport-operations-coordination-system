import os

xml_content = """<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="Electron" agent="Mozilla/5.0">
  <diagram name="AOCS-Chen-ERD-ExactScreenshot" id="aocs-chen-erd-ss">
    <mxGraphModel dx="2400" dy="1800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="2400" pageHeight="1800" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />

        <!-- ============================================================ -->
        <!-- DIAGRAM HEADER                                               -->
        <!-- ============================================================ -->
        <mxCell id="hdr_title" value="&lt;b style=&quot;font-size: 16px;&quot;&gt;AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size: 12px; color: #555555;&quot;&gt;Conceptual Entity-Relationship Model (Peter Chen 1976 Standard - 16 Entities)&lt;/span&gt;" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;" vertex="1" parent="1">
          <mxGeometry x="850" y="30" width="600" height="40" as="geometry" />
        </mxCell>

        <!-- ============================================================ -->
        <!-- CENTER HUB: FLIGHTS (x=960, y=550)                           -->
        <!-- ============================================================ -->
        <mxCell id="ent_flights" value="FLIGHTS" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=13;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="960" y="550" width="130" height="45" as="geometry" />
        </mxCell>

        <!-- FLIGHTS Attributes (flight_number & flight_status positioned right above FLIGHTS) -->
        <mxCell id="a_f1" value="&lt;u&gt;flight_id&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="880" y="475" width="70" height="28" as="geometry" /></mxCell>
        <mxCell id="e_f1" style="endArrow=none;html=1;exitX=0.15;exitY=0;entryX=0.5;entryY=1;" edge="1" parent="1" source="ent_flights" target="a_f1"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="a_f2" value="flight_number" style="ellipse;whiteSpace=wrap;html=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="960" y="475" width="75" height="28" as="geometry" /></mxCell>
        <mxCell id="e_f2" style="endArrow=none;html=1;exitX=0.4;exitY=0;entryX=0.5;entryY=1;" edge="1" parent="1" source="ent_flights" target="a_f2"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="a_f3" value="flight_status" style="ellipse;whiteSpace=wrap;html=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="1045" y="475" width="75" height="28" as="geometry" /></mxCell>
        <mxCell id="e_f3" style="endArrow=none;html=1;exitX=0.75;exitY=0;entryX=0.5;entryY=1;" edge="1" parent="1" source="ent_flights" target="a_f3"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="a_f6" value="turnaround_duration" style="ellipse;whiteSpace=wrap;html=1;dashed=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="1110" y="630" width="115" height="30" as="geometry" /></mxCell>
        <mxCell id="e_f6" style="endArrow=none;html=1;exitX=0.85;exitY=1;entryX=0.3;entryY=0;" edge="1" parent="1" source="ent_flights" target="a_f6"><mxGeometry relative="1" as="geometry" /></mxCell>


        <!-- ============================================================ -->
        <!-- TOP INFRASTRUCTURE ROW: AIRCRAFT, GATES, RUNWAYS             -->
        <!-- ============================================================ -->

        <!-- 4. AIRCRAFT -->
        <mxCell id="ent_aircraft" value="AIRCRAFT" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=12;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="300" y="250" width="110" height="40" as="geometry" />
        </mxCell>
        <mxCell id="a_ac1" value="&lt;u&gt;aircraft_id&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="230" y="190" width="75" height="28" as="geometry" /></mxCell>
        <mxCell id="e_ac1" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_aircraft" target="a_ac1"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="a_ac2" value="&lt;u&gt;registration_number&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="315" y="190" width="115" height="28" as="geometry" /></mxCell>
        <mxCell id="e_ac2" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_aircraft" target="a_ac2"><mxGeometry relative="1" as="geometry" /></mxCell>

        <!-- R4: AIRCRAFT - FLIGHTS (operates) -->
        <mxCell id="rel_operates" value="operates" style="rhombus;whiteSpace=wrap;html=1;fontSize=10;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="480" y="380" width="85" height="45" as="geometry" />
        </mxCell>
        <mxCell id="edge_ac_op" style="endArrow=none;html=1;exitX=0.5;exitY=1;entryX=0;entryY=0.5;" edge="1" parent="1" source="ent_aircraft" target="rel_operates"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_ac1" value="1" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="445" y="365" width="20" height="20" as="geometry" /></mxCell>
        <mxCell id="edge_fl_op" style="endArrow=none;html=1;double=1;exitX=0;exitY=0.25;entryX=1;entryY=0.5;" edge="1" parent="1" source="ent_flights" target="rel_operates"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_fl1" value="N" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="575" y="395" width="20" height="20" as="geometry" /></mxCell>


        <!-- 5. GATES (Top Center: x=975, y=100) -->
        <mxCell id="ent_gates" value="GATES" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=12;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="970" y="100" width="110" height="40" as="geometry" />
        </mxCell>
        <mxCell id="a_g1" value="&lt;u&gt;gate_id&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="920" y="40" width="65" height="28" as="geometry" /></mxCell>
        <mxCell id="e_g1" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_gates" target="a_g1"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="a_g2" value="&lt;u&gt;gate_number&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="995" y="40" width="80" height="28" as="geometry" /></mxCell>
        <mxCell id="e_g2" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_gates" target="a_g2"><mxGeometry relative="1" as="geometry" /></mxCell>

        <!-- R5: GATES - FLIGHTS (assigned_gate: straight vertical line above FLIGHTS as in screenshot) -->
        <mxCell id="rel_assigned_gate" value="assigned_gate" style="rhombus;whiteSpace=wrap;html=1;fontSize=10;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="975" y="240" width="100" height="45" as="geometry" />
        </mxCell>
        <mxCell id="edge_gt_ag" style="endArrow=none;html=1;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="ent_gates" target="rel_assigned_gate"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_gt1" value="1" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="1000" y="210" width="20" height="20" as="geometry" /></mxCell>
        <mxCell id="edge_fl_ag" style="endArrow=none;html=1;exitX=0.5;exitY=0;entryX=0.5;entryY=1;" edge="1" parent="1" source="ent_flights" target="rel_assigned_gate"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_fl2" value="N" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="1000" y="300" width="20" height="20" as="geometry" /></mxCell>


        <!-- 6. RUNWAYS (Top Right: x=1750, y=250) -->
        <mxCell id="ent_runways" value="RUNWAYS" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=12;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="1750" y="250" width="110" height="40" as="geometry" />
        </mxCell>
        <mxCell id="a_rw1" value="&lt;u&gt;runway_id&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="1700" y="190" width="75" height="28" as="geometry" /></mxCell>
        <mxCell id="e_rw1" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_runways" target="a_rw1"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="a_rw2" value="&lt;u&gt;runway_code&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="1785" y="190" width="85" height="28" as="geometry" /></mxCell>
        <mxCell id="e_rw2" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_runways" target="a_rw2"><mxGeometry relative="1" as="geometry" /></mxCell>

        <!-- R6: RUNWAYS - FLIGHTS (assigned_runway: EXACT ORTHOGONAL STEPPED LINE ROUTING FROM SCREENSHOT) -->
        <mxCell id="rel_assigned_rw" value="assigned_runway" style="rhombus;whiteSpace=wrap;html=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="1500" y="360" width="115" height="45" as="geometry" />
        </mxCell>
        <mxCell id="edge_rw_arw" style="endArrow=none;html=1;exitX=0;exitY=0.5;entryX=1;entryY=0.5;" edge="1" parent="1" source="ent_runways" target="rel_assigned_rw"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_rw1" value="1" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="1630" y="345" width="20" height="20" as="geometry" /></mxCell>
        
        <!-- STEPPED ORTHOGONAL LINE FROM FLIGHTS TO ASSIGNED_RUNWAY (as shown in screenshot) -->
        <mxCell id="edge_fl_arw" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=none;exitX=1;exitY=0.3;entryX=0;entryY=0.5;" edge="1" parent="1" source="ent_flights" target="rel_assigned_rw">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="1200" y="563.5" />
              <mxPoint x="1200" y="382.5" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="lbl_card_fl3" value="N" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="1475" y="385" width="20" height="20" as="geometry" /></mxCell>


        <!-- ============================================================ -->
        <!-- LEFT ADMINISTRATION ROW                                      -->
        <!-- ============================================================ -->

        <!-- 1. ROLES -->
        <mxCell id="ent_roles" value="ROLES" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=12;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="100" y="550" width="100" height="40" as="geometry" />
        </mxCell>
        <mxCell id="a_r1" value="&lt;u&gt;role_id&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="40" y="490" width="65" height="28" as="geometry" /></mxCell>
        <mxCell id="e_r1" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_roles" target="a_r1"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="a_r2" value="&lt;u&gt;role_name&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="115" y="490" width="75" height="28" as="geometry" /></mxCell>
        <mxCell id="e_r2" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_roles" target="a_r2"><mxGeometry relative="1" as="geometry" /></mxCell>

        <!-- R1: ROLES - USERS (has_role) -->
        <mxCell id="rel_has_role" value="has_role" style="rhombus;whiteSpace=wrap;html=1;fontSize=10;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="230" y="547" width="85" height="45" as="geometry" />
        </mxCell>
        <mxCell id="edge_r_has" style="endArrow=none;html=1;exitX=1;exitY=0.5;entryX=0;entryY=0.5;" edge="1" parent="1" source="ent_roles" target="rel_has_role"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_r1" value="1" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="205" y="555" width="20" height="20" as="geometry" /></mxCell>
        <mxCell id="edge_u_has" style="endArrow=none;html=1;double=1;exitX=0;exitY=0.5;entryX=1;entryY=0.5;" edge="1" parent="1" source="ent_users" target="rel_has_role"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_u1" value="N" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="320" y="555" width="20" height="20" as="geometry" /></mxCell>

        <!-- 2. USERS -->
        <mxCell id="ent_users" value="USERS" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=12;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="350" y="550" width="110" height="40" as="geometry" />
        </mxCell>
        <mxCell id="a_u1" value="&lt;u&gt;user_id&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="300" y="490" width="65" height="28" as="geometry" /></mxCell>
        <mxCell id="e_u1" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_users" target="a_u1"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="a_u2" value="&lt;u&gt;username&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="375" y="490" width="70" height="28" as="geometry" /></mxCell>
        <mxCell id="e_u2" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_users" target="a_u2"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="a_u6" value="phone_numbers" style="ellipse;whiteSpace=wrap;html=1;shape=doubleEllipse;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="460" y="615" width="90" height="30" as="geometry" /></mxCell>
        <mxCell id="e_u6" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_users" target="a_u6"><mxGeometry relative="1" as="geometry" /></mxCell>

        <!-- R2: USERS - DEPARTMENTS (employs) -->
        <mxCell id="rel_employs" value="employs" style="rhombus;whiteSpace=wrap;html=1;fontSize=10;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="490" y="547" width="85" height="45" as="geometry" />
        </mxCell>
        <mxCell id="edge_u_emp" style="endArrow=none;html=1;double=1;exitX=1;exitY=0.5;entryX=0;entryY=0.5;" edge="1" parent="1" source="ent_users" target="rel_employs"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_u2" value="N" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="465" y="555" width="20" height="20" as="geometry" /></mxCell>
        <mxCell id="edge_d_emp" style="endArrow=none;html=1;exitX=0;exitY=0.5;entryX=1;entryY=0.5;" edge="1" parent="1" source="ent_departments" target="rel_employs"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_d1" value="1" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="580" y="555" width="20" height="20" as="geometry" /></mxCell>

        <!-- 3. DEPARTMENTS -->
        <mxCell id="ent_departments" value="DEPARTMENTS" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=12;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="600" y="550" width="120" height="40" as="geometry" />
        </mxCell>
        <mxCell id="a_d1" value="&lt;u&gt;department_id&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="560" y="490" width="85" height="28" as="geometry" /></mxCell>
        <mxCell id="e_d1" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_departments" target="a_d1"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="a_d2" value="department_name" style="ellipse;whiteSpace=wrap;html=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="650" y="490" width="90" height="28" as="geometry" /></mxCell>
        <mxCell id="e_d2" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_departments" target="a_d2"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="a_d5" value="number_of_staff" style="ellipse;whiteSpace=wrap;html=1;dashed=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="615" y="615" width="90" height="30" as="geometry" /></mxCell>
        <mxCell id="e_d5" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_departments" target="a_d5"><mxGeometry relative="1" as="geometry" /></mxCell>

        <!-- R17: DEPARTMENTS - FLIGHTS (coordinates) -->
        <mxCell id="rel_coordinates" value="coordinates" style="rhombus;whiteSpace=wrap;html=1;fontSize=10;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="780" y="547" width="95" height="45" as="geometry" />
        </mxCell>
        <mxCell id="edge_d_coord" style="endArrow=none;html=1;exitX=1;exitY=0.5;entryX=0;entryY=0.5;" edge="1" parent="1" source="ent_departments" target="rel_coordinates"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_d_coord" value="M" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="735" y="555" width="20" height="20" as="geometry" /></mxCell>
        <mxCell id="edge_f_coord" style="endArrow=none;html=1;exitX=0;exitY=0.5;entryX=1;entryY=0.5;" edge="1" parent="1" source="ent_flights" target="rel_coordinates"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_f_coord" value="N" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="895" y="555" width="20" height="20" as="geometry" /></mxCell

        <!-- R15: USERS - NOTIFICATIONS (receives) -->
        <mxCell id="rel_notif" value="receives" style="rhombus;whiteSpace=wrap;html=1;fontSize=10;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="360" y="680" width="85" height="45" as="geometry" />
        </mxCell>
        <mxCell id="edge_u_not" style="endArrow=none;html=1;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="ent_users" target="rel_notif"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_u3" value="1" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="390" y="650" width="20" height="20" as="geometry" /></mxCell>
        <mxCell id="edge_n_not" style="endArrow=none;html=1;double=1;exitX=0.5;exitY=0;entryX=0.5;entryY=1;" edge="1" parent="1" source="ent_notif" target="rel_notif"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_n1" value="N" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="390" y="730" width="20" height="20" as="geometry" /></mxCell>

        <!-- 16. NOTIFICATIONS -->
        <mxCell id="ent_notif" value="NOTIFICATIONS" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=12;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="340" y="770" width="120" height="40" as="geometry" />
        </mxCell>
        <mxCell id="a_nt1" value="&lt;u&gt;notification_id&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="300" y="830" width="85" height="28" as="geometry" /></mxCell>
        <mxCell id="e_nt1" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_notif" target="a_nt1"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="a_nt2" value="title" style="ellipse;whiteSpace=wrap;html=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="395" y="830" width="60" height="28" as="geometry" /></mxCell>
        <mxCell id="e_nt2" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_notif" target="a_nt2"><mxGeometry relative="1" as="geometry" /></mxCell>

        <!-- R16: USERS - AUDIT_LOGS (generates) -->
        <mxCell id="rel_audit" value="generates" style="rhombus;whiteSpace=wrap;html=1;fontSize=10;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="210" y="680" width="85" height="45" as="geometry" />
        </mxCell>
        <mxCell id="edge_u_aud" style="endArrow=none;html=1;exitX=0.25;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="ent_users" target="rel_audit"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_u4" value="1" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="260" y="650" width="20" height="20" as="geometry" /></mxCell>
        <mxCell id="edge_a_aud" style="endArrow=none;html=1;double=1;exitX=0.5;exitY=0;entryX=0.5;entryY=1;" edge="1" parent="1" source="ent_audit" target="rel_audit"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_a1" value="N" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="210" y="730" width="20" height="20" as="geometry" /></mxCell>

        <!-- 15. AUDIT_LOGS -->
        <mxCell id="ent_audit" value="AUDIT_LOGS" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=12;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="195" y="770" width="110" height="40" as="geometry" />
        </mxCell>
        <mxCell id="a_al1" value="&lt;u&gt;log_id&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="160" y="830" width="65" height="28" as="geometry" /></mxCell>
        <mxCell id="e_al1" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_audit" target="a_al1"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="a_al2" value="action" style="ellipse;whiteSpace=wrap;html=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="235" y="830" width="60" height="28" as="geometry" /></mxCell>
        <mxCell id="e_al2" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_audit" target="a_al2"><mxGeometry relative="1" as="geometry" /></mxCell>


        <!-- ============================================================ -->
        <!-- RIGHT LOGISTICS ROW (EXACT SCREENSHOT LAYOUT)                 -->
        <!-- ============================================================ -->

        <!-- R7: FLIGHTS - TASKS (requires_turnaround: straight horizontal line) -->
        <mxCell id="rel_requires_t" value="requires_turnaround" style="rhombus;whiteSpace=wrap;html=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="1220" y="547" width="125" height="45" as="geometry" />
        </mxCell>
        <mxCell id="edge_f_req" style="endArrow=none;html=1;double=1;exitX=1;exitY=0.5;entryX=0;entryY=0.5;" edge="1" parent="1" source="ent_flights" target="rel_requires_t"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_fl4" value="1" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="1185" y="555" width="20" height="20" as="geometry" /></mxCell>
        <mxCell id="edge_t_req" style="endArrow=none;html=1;double=1;exitX=0;exitY=0.5;entryX=1;entryY=0.5;" edge="1" parent="1" source="ent_tasks" target="rel_requires_t"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_tk1" value="N" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="1355" y="555" width="20" height="20" as="geometry" /></mxCell>

        <!-- 8. TASKS (x=1380, y=550) -->
        <mxCell id="ent_tasks" value="TASKS" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=12;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="1380" y="550" width="115" height="45" as="geometry" />
        </mxCell>
        <!-- TASKS Attributes: task_id & task_name above TASKS (as in screenshot) -->
        <mxCell id="a_t1" value="&lt;u&gt;task_id&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="1335" y="485" width="65" height="28" as="geometry" /></mxCell>
        <mxCell id="e_t1" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_tasks" target="a_t1"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="a_t2" value="task_name" style="ellipse;whiteSpace=wrap;html=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="1415" y="485" width="75" height="28" as="geometry" /></mxCell>
        <mxCell id="e_t2" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_tasks" target="a_t2"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="a_t5" value="elapsed_time" style="ellipse;whiteSpace=wrap;html=1;dashed=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="1392" y="615" width="90" height="30" as="geometry" /></mxCell>
        <mxCell id="e_t5" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_tasks" target="a_t5"><mxGeometry relative="1" as="geometry" /></mxCell>

        <!-- R10: TASKS - FUEL_LOGS (refuels: to the right of TASKS as in screenshot) -->
        <mxCell id="rel_refuels" value="refuels" style="rhombus;whiteSpace=wrap;html=1;fontSize=10;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="1540" y="547" width="85" height="45" as="geometry" />
        </mxCell>
        <mxCell id="edge_f_rf" style="endArrow=none;html=1;exitX=1;exitY=0.5;entryX=0;entryY=0.5;" edge="1" parent="1" source="ent_tasks" target="rel_refuels"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_fl6" value="1" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="1505" y="555" width="20" height="20" as="geometry" /></mxCell>
        <mxCell id="edge_fl_rf" style="endArrow=none;html=1;double=1;exitX=0;exitY=0.5;entryX=1;entryY=0.5;" edge="1" parent="1" source="ent_fuel_logs" target="rel_refuels"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_fue1" value="1" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="1630" y="555" width="20" height="20" as="geometry" /></mxCell>

        <!-- 10. FUEL_LOGS -->
        <mxCell id="ent_fuel_logs" value="FUEL_LOGS" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=12;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="1665" y="550" width="105" height="45" as="geometry" />
        </mxCell>
        <mxCell id="a_flg1" value="&lt;u&gt;fuel_log_id&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="1625" y="485" width="75" height="28" as="geometry" /></mxCell>
        <mxCell id="e_flg1" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_fuel_logs" target="a_flg1"><mxGeometry relative="1" as="geometry" /></mxCell>

        <!-- R11: FUEL_LOGS - CARGO_MANIFESTS (carries_cargo) -->
        <mxCell id="rel_cargo" value="carries_cargo" style="rhombus;whiteSpace=wrap;html=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="1805" y="547" width="100" height="45" as="geometry" />
        </mxCell>
        <mxCell id="edge_f_cg" style="endArrow=none;html=1;exitX=1;exitY=0.5;entryX=0;entryY=0.5;" edge="1" parent="1" source="ent_fuel_logs" target="rel_cargo"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_fl7" value="1" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="1775" y="555" width="20" height="20" as="geometry" /></mxCell>
        <mxCell id="edge_c_cg" style="endArrow=none;html=1;double=1;exitX=0;exitY=0.5;entryX=1;entryY=0.5;" edge="1" parent="1" source="ent_cargo" target="rel_cargo"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_cg1" value="N" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="1910" y="555" width="20" height="20" as="geometry" /></mxCell>

        <!-- 11. CARGO_MANIFESTS -->
        <mxCell id="ent_cargo" value="CARGO_MANIFESTS" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=12;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="1935" y="550" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="a_cr1" value="&lt;u&gt;cargo_id&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="1905" y="485" width="70" height="28" as="geometry" /></mxCell>
        <mxCell id="e_cr1" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_cargo" target="a_cr1"><mxGeometry relative="1" as="geometry" /></mxCell>


        <!-- ============================================================ -->
        <!-- BOTTOM PASSENGER & BAGGAGE ROW                               -->
        <!-- ============================================================ -->

        <!-- R12: FLIGHTS - PASSENGERS (carries_pax) -->
        <mxCell id="rel_pax" value="carries_pax" style="rhombus;whiteSpace=wrap;html=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="1068" y="700" width="95" height="45" as="geometry" />
        </mxCell>
        <mxCell id="edge_f_px" style="endArrow=none;html=1;exitX=0.6;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="ent_flights" target="rel_pax"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_fl8" value="1" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="1115" y="670" width="20" height="20" as="geometry" /></mxCell>
        <mxCell id="edge_p_px" style="endArrow=none;html=1;double=1;exitX=0.5;exitY=0;entryX=0.5;entryY=1;" edge="1" parent="1" source="ent_passengers" target="rel_pax"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_px1" value="N" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="1115" y="755" width="20" height="20" as="geometry" /></mxCell>

        <!-- 12. PASSENGERS -->
        <mxCell id="ent_passengers" value="PASSENGERS" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=12;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="1055" y="790" width="120" height="40" as="geometry" />
        </mxCell>
        <mxCell id="a_px1" value="&lt;u&gt;passenger_id&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="1020" y="850" width="80" height="28" as="geometry" /></mxCell>
        <mxCell id="e_px1" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_passengers" target="a_px1"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="a_px2" value="passport_number" style="ellipse;whiteSpace=wrap;html=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="1110" y="850" width="95" height="28" as="geometry" /></mxCell>
        <mxCell id="e_px2" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_passengers" target="a_px2"><mxGeometry relative="1" as="geometry" /></mxCell>

        <!-- R13: PASSENGERS - LOUNGE_VISITS (visits_lounge) -->
        <mxCell id="rel_lounge" value="visits_lounge" style="rhombus;whiteSpace=wrap;html=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="1220" y="787" width="95" height="45" as="geometry" />
        </mxCell>
        <mxCell id="edge_p_lg" style="endArrow=none;html=1;exitX=1;exitY=0.5;entryX=0;entryY=0.5;" edge="1" parent="1" source="ent_passengers" target="rel_lounge"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_px2" value="1" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="1185" y="795" width="20" height="20" as="geometry" /></mxCell>
        <mxCell id="edge_l_lg" style="endArrow=none;html=1;double=1;exitX=0;exitY=0.5;entryX=1;entryY=0.5;" edge="1" parent="1" source="ent_lounge" target="rel_lounge"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_lg1" value="N" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="1325" y="795" width="20" height="20" as="geometry" /></mxCell>

        <!-- 13. LOUNGE_VISITS -->
        <mxCell id="ent_lounge" value="LOUNGE_VISITS" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=12;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="1350" y="790" width="130" height="40" as="geometry" />
        </mxCell>
        <mxCell id="a_lg1" value="&lt;u&gt;visit_id&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="1330" y="850" width="65" height="28" as="geometry" /></mxCell>
        <mxCell id="e_lg1" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_lounge" target="a_lg1"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="a_lg2" value="lounge_name" style="ellipse;whiteSpace=wrap;html=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="1405" y="850" width="75" height="28" as="geometry" /></mxCell>
        <mxCell id="e_lg2" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_lounge" target="a_lg2"><mxGeometry relative="1" as="geometry" /></mxCell>

        <!-- R14: FLIGHTS - BAGGAGE_CAROUSELS (claims_baggage) -->
        <mxCell id="rel_car" value="claims_baggage" style="rhombus;whiteSpace=wrap;html=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="830" y="787" width="105" height="45" as="geometry" />
        </mxCell>
        <mxCell id="edge_f_car" style="endArrow=none;html=1;exitX=0.15;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="ent_flights" target="rel_car"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_fl9" value="1" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="930" y="750" width="20" height="20" as="geometry" /></mxCell>
        <mxCell id="edge_b_car" style="endArrow=none;html=1;exitX=1;exitY=0.5;entryX=0;entryY=0.5;" edge="1" parent="1" source="ent_carousel" target="rel_car"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_car1" value="1" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="805" y="795" width="20" height="20" as="geometry" /></mxCell>

        <!-- 14. BAGGAGE_CAROUSELS -->
        <mxCell id="ent_carousel" value="BAGGAGE_CAROUSELS" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=12;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="640" y="790" width="150" height="40" as="geometry" />
        </mxCell>
        <mxCell id="a_c1" value="&lt;u&gt;carousel_id&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="630" y="850" width="75" height="28" as="geometry" /></mxCell>
        <mxCell id="e_c1" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_carousel" target="a_c1"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="a_c2" value="terminal" style="ellipse;whiteSpace=wrap;html=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="715" y="850" width="60" height="28" as="geometry" /></mxCell>
        <mxCell id="e_c2" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_carousel" target="a_c2"><mxGeometry relative="1" as="geometry" /></mxCell>

        <!-- R9: IDENTIFYING RELATIONSHIP: FLIGHTS - DELAY_LOGS (triggers_delay) -->
        <mxCell id="rel_triggers_delay" value="triggers_delay" style="rhombus;whiteSpace=wrap;html=1;shape=ext;double=1;fontSize=9;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="945" y="680" width="95" height="45" as="geometry" />
        </mxCell>
        <mxCell id="edge_f_del" style="endArrow=none;html=1;exitX=0.35;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="ent_flights" target="rel_triggers_delay"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_fl5" value="1" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="985" y="650" width="20" height="20" as="geometry" /></mxCell>
        <mxCell id="edge_d_del" style="endArrow=none;html=1;double=1;exitX=0.5;exitY=0;entryX=0.5;entryY=1;" edge="1" parent="1" source="ent_delay_logs" target="rel_triggers_delay"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="lbl_card_dl1" value="N" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="945" y="730" width="20" height="20" as="geometry" /></mxCell>

        <!-- 9. DELAY_LOGS -->
        <mxCell id="ent_delay_logs" value="DELAY_LOGS" style="rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=12;shape=ext;double=1;fillColor=none;strokeColor=default;" vertex="1" parent="1">
          <mxGeometry x="930" y="790" width="110" height="40" as="geometry" />
        </mxCell>
        <mxCell id="a_dl1" value="&lt;u style=&quot;border-bottom: 1px dashed;&quot;&gt;delay_seq_no&lt;/u&gt;" style="ellipse;whiteSpace=wrap;html=1;fontStyle=1;fontSize=8;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="885" y="850" width="90" height="28" as="geometry" /></mxCell>
        <mxCell id="e_dl1" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_delay_logs" target="a_dl1"><mxGeometry relative="1" as="geometry" /></mxCell>
        <mxCell id="a_dl2" value="delay_minutes" style="ellipse;whiteSpace=wrap;html=1;fontSize=8;fillColor=none;strokeColor=default;" vertex="1" parent="1"><mxGeometry x="980" y="850" width="75" height="28" as="geometry" /></mxCell>
        <mxCell id="e_dl2" style="endArrow=none;html=1;" edge="1" parent="1" source="ent_delay_logs" target="a_dl2"><mxGeometry relative="1" as="geometry" /></mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
"""

target_path = "/Users/krish/Desktop/Software Engineering/Mini Project/db/ER-Diagram.xml"
with open(target_path, "w", encoding="utf-8") as f:
    f.write(xml_content)

print(f"Successfully generated screenshot-exact Draw.io ER-Diagram.xml in {target_path}")
