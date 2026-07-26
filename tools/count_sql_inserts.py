v2_path = "/Users/krish/Desktop/Software Engineering/Mini Project/db/migration/V2__seed_data.sql"

with open(v2_path, "r", encoding="utf-8") as f:
    content = f.readlines()

inserts = [l for l in content if l.strip().startswith("INSERT INTO")]
print(f"Total SQL INSERT Statements in V2__seed_data.sql: {len(inserts)}")
