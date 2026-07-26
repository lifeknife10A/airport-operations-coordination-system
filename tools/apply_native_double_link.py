import re

file_path = "/Users/krish/Desktop/Software Engineering/Mini Project/db/AOCS ER Diagram.drawio.xml"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Total Participation edges list:
# 65 (FLIGHTS -> operates)
# 39 (USERS -> has_role)
# 49 (USERS -> employs)
# 76 (FLIGHTS -> requires_turnaround)
# 78 (TASKS -> requires_turnaround)
# 90 (FUEL_LOGS -> refuels)
# 100 (CARGO_MANIFESTS -> carries_cargo)
# 110 (AUDIT_LOGS -> generates)
# 120 (NOTIFICATIONS -> receives)
# 144 (DELAY_LOGS -> triggers_delay)
# 154 (PASSENGERS -> carries_pax)
# 164 (LOUNGE_VISITS -> visits_lounge)

total_edges = ["65", "39", "49", "76", "78", "90", "100", "110", "120", "144", "154", "164"]

for edge_id in total_edges:
    pattern = rf'(<mxCell id="{edge_id}" edge="1"[^>]*style=")([^"]*)(")'
    def replace_style(match):
        prefix = match.group(1)
        style = match.group(2)
        suffix = match.group(3)
        # Remove any existing double=1, strokeWidth, shape=link to cleanly set shape=link;width=4;
        style = re.sub(r'double=1;?', '', style)
        style = re.sub(r'strokeWidth=\d+;?', '', style)
        style = re.sub(r'shape=link;?', '', style)
        style = re.sub(r'width=\d+;?', '', style)
        
        # Prepend shape=link;width=4;
        new_style = "shape=link;width=4;" + style
        return f"{prefix}{new_style}{suffix}"
    
    content = re.sub(pattern, replace_style, content)

# Save back to AOCS ER Diagram.drawio.xml
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

# Also sync to ER-Diagram.xml
er_diagram_path = "/Users/krish/Desktop/Software Engineering/Mini Project/db/ER-Diagram.xml"
with open(er_diagram_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully set shape=link;width=4; on all total participation edges in {file_path} and synced to {er_diagram_path}")
