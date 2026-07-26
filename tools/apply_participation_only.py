import re

file_path = "/Users/krish/Desktop/Software Engineering/Mini Project/db/AOCS ER Diagram.drawio.xml"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix cell 171 label if needed: value="Relationship" -> value="triggers_delay"
content = content.replace('value="Relationship"', 'value="triggers_delay"')

# Total Participation edges list:
# 1. cell 65 (FLIGHTS -> operates)
# 2. cell 39 (USERS -> has_role)
# 3. cell 49 (USERS -> employs)
# 4. cell 76 (FLIGHTS -> requires_turnaround)
# 5. cell 78 (TASKS -> requires_turnaround)
# 6. cell 90 (FUEL_LOGS -> refuels)
# 7. cell 100 (CARGO_MANIFESTS -> carries_cargo)
# 8. cell 110 (AUDIT_LOGS -> generates)
# 9. cell 120 (NOTIFICATIONS -> receives)
# 10. cell 144 (DELAY_LOGS -> triggers_delay)
# 11. cell 154 (PASSENGERS -> carries_pax)
# 12. cell 164 (LOUNGE_VISITS -> visits_lounge)

total_edges = ["65", "39", "49", "76", "78", "90", "100", "110", "120", "144", "154", "164"]

for edge_id in total_edges:
    pattern = rf'(<mxCell id="{edge_id}" edge="1"[^>]*style=")([^"]*)(")'
    def replace_style(match):
        prefix = match.group(1)
        style = match.group(2)
        suffix = match.group(3)
        if "double=1" not in style:
            style += ";double=1;strokeWidth=2;"
        elif "strokeWidth=2" not in style:
            style = style.replace("double=1;", "double=1;strokeWidth=2;")
        return f"{prefix}{style}{suffix}"
    content = re.sub(pattern, replace_style, content)

# Save back to AOCS ER Diagram.drawio.xml
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

# Also update ER-Diagram.xml with the exact same content
er_diagram_path = "/Users/krish/Desktop/Software Engineering/Mini Project/db/ER-Diagram.xml"
with open(er_diagram_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully applied participation line rules to {file_path} and synced to {er_diagram_path} with 0 coordinate changes!")
