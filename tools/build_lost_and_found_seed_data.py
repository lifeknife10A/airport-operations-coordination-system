#!/usr/bin/env python3
"""
Saphire AOCS - Lost & Found Seed Data Generator
Generates 2,000 realistic, high-fidelity lost & found property records for PostgreSQL 18.
Outputs:
  - db/migration/V5__lost_and_found_seed_data.sql
  - backend/src/main/resources/db/migration/V5__lost_and_found_seed_data.sql
"""

import random
import os
from datetime import datetime, timedelta

NUM_RECORDS = 2000

ITEMS_CATALOG = [
    # ELECTRONICS
    ("ELECTRONICS", "Apple iPad Pro 11\" Space Grey", "Black magnetic folio cover, sticker of NASA on back casing"),
    ("ELECTRONICS", "Apple iPhone 15 Pro Max", "Natural Titanium, transparent Spigen case with magnetic ring"),
    ("ELECTRONICS", "MacBook Air 13\" (Midnight)", "In charcoal felt sleeve, charger cable wrapped neatly"),
    ("ELECTRONICS", "Bose QuietComfort 45 Headphones", "Triple Black, inside hard zipper carry case"),
    ("ELECTRONICS", "Sony WH-1000XM5 Wireless Headphones", "Silver/Platinum grey in original fabric case"),
    ("ELECTRONICS", "Kindle Paperwhite (11th Gen)", "Agave Green case, library sticker on interior flap"),
    ("ELECTRONICS", "AirPods Pro (2nd Gen)", "White charging case with engraving 'AR', braided lanyard attached"),
    ("ELECTRONICS", "Nintendo Switch OLED Model", "Neon Blue/Red Joy-Cons inside Mario themed zip case"),
    ("ELECTRONICS", "Anker 24,000mAh 140W Power Bank", "Space grey metallic cylinder with digital LCD display"),
    ("ELECTRONICS", "DJI Osmo Pocket 3 Gimbal Camera", "In black hard shell with wide-angle lens attachment"),
    ("ELECTRONICS", "Canon EOS R6 Mirrorless Camera", "Body with 24-105mm lens, red Peak Design camera strap"),
    ("ELECTRONICS", "Garmin Fenix 7 Sapphire Solar", "Titanium bezel with orange silicone sports band"),
    
    # DOCUMENTS
    ("DOCUMENTS", "Leather Passport Holder with Visa Documents", "Tan leather case holding Japanese passport and boarding stub"),
    ("DOCUMENTS", "Blue European Union Passport Wallet", "Navy leather organizer with German passport and Eurail pass"),
    ("DOCUMENTS", "Diplomatic Courier Pouch", "Black leather A4 folio with official wax seal stamp"),
    ("DOCUMENTS", "Travel Insurance & Medical Records Binder", "Clear plastic document folder with prescription slips"),
    ("DOCUMENTS", "International Driving Permit & Wallet", "Brown leather tri-fold with IDP booklet and foreign banknotes"),
    ("DOCUMENTS", "University Degree Certificate Tube", "Dark blue embossed cylinder holding graduation scroll"),
    
    # BAGGAGE
    ("BAGGAGE", "Samsonite Hard-Shell Carry-On (Navy)", "Luggage tag reads Harrison Sterling, gate check tag #0419"),
    ("BAGGAGE", "Tumi Alpha 3 Continental Dual Access 4-Wheeler", "Black ballistic nylon with monogram 'K.S.' on leather patch"),
    ("BAGGAGE", "Rimowa Essential Cabin Spinner", "Matte Black polycarbonate, baggage sticker from Frankfurt FRA"),
    ("BAGGAGE", "Longchamp Le Pliage Large Travel Tote", "Burgundy nylon with brown leather trim and shoulder strap"),
    ("BAGGAGE", "Osprey Farpoint 40 Travel Backpack", "Volcanic Grey with orange carabiner on top haul handle"),
    ("BAGGAGE", "Duty-Free Confectionery & Perfume Bag", "Large yellow sealed security tamper-evident bag from T2 Duty Free"),
    
    # VALUABLES & JEWELRY
    ("VALUABLES", "Montblanc Meisterstück Gold-Coated Fountain Pen", "Black precious resin with 14K gold nib, inside velvet box"),
    ("VALUABLES", "Rolex Submariner Date 41mm", "Oystersteel and yellow gold with black Cerachrom bezel"),
    ("VALUABLES", "Tiffany & Co. Sterling Silver Link Bracelet", "Signature heart tag engraved 'Return to Tiffany New York'"),
    ("VALUABLES", "Cartier Love Wedding Band (Rose Gold)", "18K rose gold band, size 54, inside red presentation pouch"),
    ("VALUABLES", "Ray-Ban Wayfarer Polarized Sunglasses", "Classic tortoiseshell frame in black leather snap case"),
    ("VALUABLES", "Gucci GG Marmont Leather Bifold Wallet", "Black calfskin with antique gold double G hardware"),
    
    # CLOTHING
    ("CLOTHING", "Burberry Kensington Heritage Trench Coat", "Honey beige weatherproof gabardine, size 40, check lining"),
    ("CLOTHING", "Nike Tech Fleece Full-Zip Windrunner", "Heather grey with black chevron tape, size L"),
    ("CLOTHING", "Cashmere Pashmina Shawl (Ivory)", "Handwoven pure Himalayan cashmere with hand-twisted fringes"),
    ("CLOTHING", "Barbour Beaufort Waxed Jacket", "Olive green with corduroy collar and tartan lining, size 42"),
    
    # KEYS
    ("KEYS", "BMW Display Key & Smart Fob", "With blue M-Sport leather key case and house key"),
    ("KEYS", "Mercedes-Benz AMG Key Fob", "Silver and black gloss fob with titanium carabiner"),
    ("KEYS", "Apartment Master Keychain Set", "5 brass Yale keys on brass ring with red Swiss Army knife"),
    
    # OTHER
    ("OTHER", "Cochlear Nucleus 7 Hearing Aid Sound Processor", "Silver grey casing inside moisture protection pouch"),
    ("OTHER", "Prada Prescription Glasses", "Cat-eye acetate frame in velvet hard case with cleaning cloth"),
    ("OTHER", "Child's Steiff Plush Teddy Bear", "Button-in-ear classic golden mohair bear with red ribbon"),
]

LOCATION_TYPES = [
    ('SECURITY_CHECKPOINT', 'Security Checkpoint B X-Ray Tray 4', 2),
    ('SECURITY_CHECKPOINT', 'Security Checkpoint A FastTrack Lane', 1),
    ('SECURITY_CHECKPOINT', 'Security Checkpoint D Biometric Screening', 2),
    ('GATE_SEATING', 'Gate A12 Seating Concourse Stand G12', 1),
    ('GATE_SEATING', 'Gate B04 Boarding Lounge Stand G08', 2),
    ('GATE_SEATING', 'Gate C10 Upper Deck Holding Area', 2),
    ('GATE_SEATING', 'Gate A02 Charging Kiosk Area', 1),
    ('DUTY_FREE', 'Terminal 2 World Duty Free Watch Boutique', 2),
    ('DUTY_FREE', 'Terminal 1 Concourse Perfume Plaza', 1),
    ('AIRCRAFT_CABIN', 'Overhead Locker Row 14 Aircraft Cabin', 1),
    ('AIRCRAFT_CABIN', 'Seat Pocket 2A Business Class Suite', 2),
    ('AIRCRAFT_CABIN', 'Seat Pocket 28C Economy Cabin', 1),
    ('BAGGAGE_RECLAIM', 'Arrival Carousel C04 Baggage Reclaim Belt', 2),
    ('BAGGAGE_RECLAIM', 'Arrival Carousel C01 Reclaim Hall', 1),
    ('LOUNGE', 'Saphire Royal First Class Lounge Quiet Room', 2),
    ('LOUNGE', 'Priority Pass Executive Dining Lounge', 1),
    ('CONCOURSE', 'Terminal 2 Central Atrium Fountain Plaza', 2),
    ('RESTROOM', 'Terminal 1 Departures Mezzanine Restroom', 1),
]

VAULT_LOCATIONS = [
    'Locker A-04', 'Locker A-12', 'Locker B-02', 'Locker B-14', 'Locker C-08',
    'Locker C-19', 'Locker D-05', 'Locker D-11', 'Locker E-03', 'Locker E-17',
    'Secure Vault A Shelf 3', 'Secure Vault B Shelf 1', 'Intake Desk Shelf 2',
    'High-Value Safe Box 04', 'High-Value Safe Box 08', 'Reclaim Hall Bureau Unit 3'
]

STATUSES = [
    ('ITEM_LOCATED_VAULTED', 0.40),
    ('READY_FOR_COLLECTION', 0.25),
    ('CLAIMED_RETURNED', 0.20),
    ('LOGGED_SECURITY_INTAKE', 0.10),
    ('DISPOSED_AUCTIONED', 0.05),
]

FINDER_TYPES = ['SECURITY_OFFICER', 'CABIN_CLEANER', 'GATE_AGENT', 'PASSENGER', 'GROUND_HANDLER', 'DUTY_FREE_STAFF']

FIRST_NAMES = ['Aarav', 'Vihaan', 'Aditya', 'Riya', 'Priya', 'Elena', 'Viktor', 'Chen', 'Mei', 'Carlos', 'Sofia', 'Mateo', 'Emma', 'David', 'James', 'Lucas', 'Oliver', 'Amelia', 'Sophie', 'Liam']
LAST_NAMES = ['Sharma', 'Patel', 'Singh', 'Gupta', 'Johnson', 'Smith', 'Williams', 'Wong', 'Li', 'Zhang', 'Tanaka', 'Silva', 'Santos', 'Kim', 'Park', 'Mueller', 'Davis', 'Rodriguez', 'Martinez', 'Jones']

def generate_seed_sql():
    records = []
    base_time = datetime(2026, 9, 21, 14, 0, 0)

    for i in range(1, NUM_RECORDS + 1):
        ref_code = f"LF-2026-{i:04d}"
        cat, item_name, desc = random.choice(ITEMS_CATALOG)
        loc_type, loc_detail, term_id = random.choice(LOCATION_TYPES)
        vault_loc = random.choice(VAULT_LOCATIONS)
        
        # Weighted status
        rand_val = random.random()
        cumulative = 0
        status = 'ITEM_LOCATED_VAULTED'
        for s, weight in STATUSES:
            cumulative += weight
            if rand_val <= cumulative:
                status = s
                break
        
        finder_type = random.choice(FINDER_TYPES)
        logged_by_user_id = random.randint(1, 50)
        
        # Associated flight & checkpoint (optional)
        flight_id = random.randint(1, 5000) if random.random() > 0.3 else "NULL"
        checkpoint_id = random.randint(1, 8) if loc_type == 'SECURITY_CHECKPOINT' else "NULL"
        
        # Time within last 30 days
        days_ago = random.randint(0, 30)
        hours_ago = random.randint(0, 23)
        mins_ago = random.randint(0, 59)
        created_time = base_time - timedelta(days=days_ago, hours=hours_ago, minutes=mins_ago)
        created_str = created_time.strftime('%Y-%m-%d %H:%M:%S+05:30')
        
        claimant_traveler_id = "NULL"
        claimant_name = "NULL"
        claimant_email = "NULL"
        claimant_phone = "NULL"
        claim_notes = "NULL"
        claimed_time_str = "NULL"
        released_by_user_id = "NULL"
        
        if status == 'CLAIMED_RETURNED':
            claimant_traveler_id = random.randint(1, 8000)
            c_first = random.choice(FIRST_NAMES)
            c_last = random.choice(LAST_NAMES)
            claimant_name = f"'{c_first} {c_last}'"
            claimant_email = f"'{c_first.lower()}.{c_last.lower()}@gmail.com'"
            claimant_phone = f"'+91 98{random.randint(10000000, 99999999)}'"
            claim_notes = f"'Presented government biometric photo ID and verified serial number / passcode unlock match at Central Bureau Desk.'"
            claimed_time = created_time + timedelta(hours=random.randint(2, 48))
            claimed_time_str = f"'{claimed_time.strftime('%Y-%m-%d %H:%M:%S+05:30')}'"
            released_by_user_id = random.randint(1, 10)

        # Sanitize single quotes
        item_name_sql = item_name.replace("'", "''")
        desc_sql = desc.replace("'", "''")
        loc_detail_sql = loc_detail.replace("'", "''")
        vault_loc_sql = vault_loc.replace("'", "''")

        record = f"  ({i}, '{ref_code}', '{item_name_sql}', '{cat}', '{desc_sql}', '{loc_type}', '{loc_detail_sql}', {term_id}, {flight_id}, {checkpoint_id}, '{vault_loc_sql}', '{status}', '{finder_type}', {logged_by_user_id}, '{created_str}', '{created_str}', {claimant_traveler_id}, {claimant_name}, {claimant_email}, {claimant_phone}, {claim_notes}, {claimed_time_str}, {released_by_user_id})"
        records.append(record)

    header = """-- ============================================================
-- AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
-- PostgreSQL 18 Database Migration (Flyway V5 Migration)
-- 2,000 High-Fidelity Lost & Found Seed Records
-- ============================================================

INSERT INTO lost_and_found_items (
    item_id, reference_code, item_name, category, color_and_description,
    found_location_type, found_location_detail, terminal_id, flight_id, checkpoint_id,
    storage_vault_location, status, finder_type, logged_by_user_id, created_at, updated_at,
    claimant_traveler_id, claimant_name, claimant_contact_email, claimant_contact_phone,
    claim_verification_notes, claimed_timestamp, released_by_user_id
) VALUES
"""
    footer = "\nON CONFLICT (item_id) DO NOTHING;\n\nSELECT setval('lost_and_found_items_item_id_seq', (SELECT COALESCE(MAX(item_id), 1) FROM lost_and_found_items));\n"
    
    full_sql = header + ",\n".join(records) + footer
    return full_sql

if __name__ == '__main__':
    sql_content = generate_seed_sql()
    
    output_paths = [
        os.path.abspath(os.path.join(os.path.dirname(__file__), '../db/migration/V5__lost_and_found_seed_data.sql')),
        os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend/src/main/resources/db/migration/V5__lost_and_found_seed_data.sql'))
    ]
    
    for path in output_paths:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(sql_content)
        print(f"✓ Generated {NUM_RECORDS} seed rows -> {path}")
