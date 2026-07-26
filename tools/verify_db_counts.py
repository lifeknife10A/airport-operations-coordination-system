import psycopg2

conn = psycopg2.connect(
    dbname="airport_db",
    user="postgres",
    password="password",
    host="localhost",
    port=5432
)

cur = conn.cursor()

tables = [
    "roles", "departments", "users", "user_phone_numbers", "airlines", "airports",
    "aircraft_types", "aircraft", "gates", "checkin_counters", "stands", "runways",
    "weather_reports", "gate_assignment_rules", "flights", "tasks", "ground_equipment",
    "equipment_assignments", "delay_codes", "delay_logs", "fuel_logs", "cargo_manifests",
    "baggage_carousels", "travelers", "passengers", "boarding_passes", "bag_tags",
    "baggage_scan_events", "mishandled_baggage", "security_checkpoints",
    "passenger_clearance_logs", "immigration_records", "lounge_visits",
    "customer_feedback_logs", "airline_billing_invoices", "invoice_line_items",
    "notifications", "audit_logs"
]

total = 0
print("--- POSTGRESQL 18 RECORD COUNTS PER TABLE ---")
for t in tables:
    cur.execute(f"SELECT COUNT(*) FROM {t};")
    cnt = cur.fetchone()[0]
    total += cnt
    print(f"{t}: {cnt}")

print(f"\nTOTAL SYSTEM RECORDS: {total}")
conn.close()
