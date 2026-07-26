import os
import re

# Emojis regex
emoji_pattern = re.compile("[\U00010000-\U0010ffff\u2600-\u26FF\u2700-\u27BF\uFE0F\u2300-\u23FF\u200D]+", re.UNICODE)

files_to_clean = [
    "/Users/krish/Desktop/Software Engineering/Mini Project/db/AOCS Information Package.drawio.xml",
    "/Users/krish/Desktop/Software Engineering/Mini Project/db/Information-Package.xml",
    "/Users/krish/Desktop/Software Engineering/Mini Project/documentation/MD/database_creation/information_package_matrix.md"
]

for filepath in files_to_clean:
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Strip emojis and double spaces
        cleaned = emoji_pattern.sub("", content)
        cleaned = cleaned.replace("  ", " ").replace("Turnaround Duration", "Turnaround Duration").strip()
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(cleaned)
        
        print(f"Cleaned all emojis from {filepath}")

# Also update build_native_list_information_package.py to prevent any future emojis
script_path = "/Users/krish/.gemini/antigravity/brain/a34611ce-9579-4ca3-90e0-644a04a3a959/scratch/build_native_list_information_package.py"
if os.path.exists(script_path):
    with open(script_path, "r", encoding="utf-8") as f:
        s_content = f.read()
    s_cleaned = emoji_pattern.sub("", s_content)
    with open(script_path, "w", encoding="utf-8") as f:
        f.write(s_cleaned)
    print("Updated script build_native_list_information_package.py")
