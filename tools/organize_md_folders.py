import os
import shutil

base_md_dir = "/Users/krish/Desktop/Software Engineering/Mini Project/documentation/MD"
proj_disc_dir = os.path.join(base_md_dir, "project_discussion")
db_creat_dir = os.path.join(base_md_dir, "database_creation")

os.makedirs(proj_disc_dir, exist_ok=True)
os.makedirs(db_creat_dir, exist_ok=True)

# 1. Move project discussion / brainstorming files into project_discussion/
proj_files = [
    "AOCS_Master_Handbook.md",
    "airport_usage_features.md",
    "instruction.md",
    "project_development_roadmap.md",
    "project_vision.md",
    "roles.MD",
    "team_assignments.md",
    "user_making_group_A_C.md",
    "user_making_group_B_E.md",
    "user_making_group_D_F.md",
    "user_requirements_combined.md",
    "assemble_handbook.py"
]

for fname in proj_files:
    src = os.path.join(base_md_dir, fname)
    if os.path.exists(src):
        dst = os.path.join(proj_disc_dir, fname)
        shutil.move(src, dst)
        print(f"Moved {fname} -> project_discussion/")

# 2. Move database & ERD files into database_creation/
db_files = [
    "ER_Diagram_Design.md"
]

for fname in db_files:
    src = os.path.join(base_md_dir, fname)
    if os.path.exists(src):
        dst = os.path.join(db_creat_dir, fname)
        shutil.move(src, dst)
        print(f"Moved {fname} -> database_creation/")

# Also copy ER_Diagram_Codex_and_Coordinate_Map.md from db/ into database_creation/
codex_src = "/Users/krish/Desktop/Software Engineering/Mini Project/db/ER_Diagram_Codex_and_Coordinate_Map.md"
if os.path.exists(codex_src):
    shutil.copy(codex_src, os.path.join(db_creat_dir, "ER_Diagram_Codex_and_Coordinate_Map.md"))
    print("Copied ER_Diagram_Codex_and_Coordinate_Map.md -> database_creation/")

# Also copy architectural docs from artifacts into database_creation/
artifact_dir = "/Users/krish/.gemini/antigravity/brain/a34611ce-9579-4ca3-90e0-644a04a3a959"
artifacts_to_copy = [
    ("chen_er_diagram_and_operational_flow.md", "chen_er_diagram_and_operational_flow.md"),
    ("information_package_diagram.md", "information_package_diagram.md"),
    ("analytics_star_schema.md", "analytics_star_schema.md")
]

for art_name, dest_name in artifacts_to_copy:
    art_path = os.path.join(artifact_dir, art_name)
    if os.path.exists(art_path):
        shutil.copy(art_path, os.path.join(db_creat_dir, dest_name))
        print(f"Copied artifact {art_name} -> database_creation/")

print("\nDocumentation folder reorganization complete!")
