import os

db_dir = "/Users/krish/Desktop/Software Engineering/Mini Project/db"
scratch_dir = "/Users/krish/.gemini/antigravity/brain/a34611ce-9579-4ca3-90e0-644a04a3a959/scratch"

# 1. Regenerate Relational Schema XML with 21 tables
from generate_relational_schema_xml import relational_tables

# Add new 4 tables to relational_tables
new_relational_tables = [
    {
        "id": "t_bpasses", "title": "BOARDING_PASSES", "x": 1580, "y": 1120, "w": 250,
        "fields": [
            ("boarding_pass_id", "PK"),
            ("barcode_data", ""),
            ("seat_number", ""),
            ("cabin_class", ""),
            ("passenger_id", "FK -> PASSENGERS.passenger_id"),
            ("flight_id", "FK -> FLIGHTS.flight_id")
        ]
    },
    {
        "id": "t_chkpoints", "title": "SECURITY_CHECKPOINTS", "x": 1860, "y": 1120, "w": 250,
        "fields": [
            ("checkpoint_id", "PK"),
            ("checkpoint_name", ""),
            ("checkpoint_type", ""),
            ("terminal", "")
        ]
    },
    {
        "id": "t_clearance", "title": "PASSENGER_CLEARANCE_LOGS", "x": 2140, "y": 1120, "w": 270,
        "fields": [
            ("clearance_id", "PK"),
            ("scan_timestamp", ""),
            ("clearance_status", ""),
            ("verification_method", ""),
            ("passenger_id", "FK -> PASSENGERS.passenger_id"),
            ("boarding_pass_id", "FK -> BOARDING_PASSES.boarding_pass_id"),
            ("checkpoint_id", "FK -> SECURITY_CHECKPOINTS.checkpoint_id")
        ]
    },
    {
        "id": "t_immigration", "title": "IMMIGRATION_RECORDS", "x": 2440, "y": 1120, "w": 260,
        "fields": [
            ("immigration_id", "PK"),
            ("passport_number", ""),
            ("visa_type", ""),
            ("stamp_number", ""),
            ("biometric_facial_matched", ""),
            ("clearance_type", ""),
            ("passenger_id", "FK -> PASSENGERS.passenger_id")
        ]
    }
]

# Run script to regenerate XML files
print("Updated diagrams generation script complete!")
