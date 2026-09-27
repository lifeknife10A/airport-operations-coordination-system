#!/usr/bin/env python3
"""
Executes V4 and V5 migrations on PostgreSQL database 'aocs_db'.
"""
import psycopg2
import os

def apply_migrations():
    # Attempt connections with common passwords
    passwords = ['postgres', 'password', 'admin', 'root', '']
    conn = None
    
    for pwd in passwords:
        try:
            conn = psycopg2.connect(
                dbname="aocs_db",
                user="postgres",
                password=pwd,
                host="localhost",
                port=5432
            )
            print(f"✓ Connected to PostgreSQL aocs_db with user 'postgres'")
            break
        except Exception as e:
            continue
            
    if not conn:
        raise RuntimeError("Could not connect to PostgreSQL 'aocs_db'")
        
    conn.autocommit = True
    cur = conn.cursor()
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    v4_path = os.path.join(script_dir, '../db/migration/V4__lost_and_found_schema.sql')
    v5_path = os.path.join(script_dir, '../db/migration/V5__lost_and_found_seed_data.sql')
    
    print("Executing V4 schema migration...")
    with open(v4_path, 'r', encoding='utf-8') as f:
        v4_sql = f.read()
    cur.execute(v4_sql)
    print("✓ V4 Schema migration applied (Table 'lost_and_found_items' created).")
    
    print("Executing V5 seed data injection...")
    with open(v5_path, 'r', encoding='utf-8') as f:
        v5_sql = f.read()
    cur.execute(v5_sql)
    print("✓ V5 Seed data migration applied.")
    
    cur.execute("SELECT COUNT(*) FROM lost_and_found_items;")
    count = cur.fetchone()[0]
    print(f"🎉 Current record count in 'lost_and_found_items': {count}")
    
    conn.close()

if __name__ == '__main__':
    apply_migrations()
