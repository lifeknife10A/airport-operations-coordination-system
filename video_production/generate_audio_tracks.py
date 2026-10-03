#!/usr/bin/env python3
"""
Generate audio tracks for the 4-member Saphire AOCS video demonstration.
Uses macOS high-quality TTS voices and ffmpeg to export WAV/MP3 tracks.
"""

import os
import subprocess
import json

AUDIO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "audio"))
os.makedirs(AUDIO_DIR, exist_ok=True)

# Speaker Voice Mapping
# Krishna Solanki (I075): Rishi (en_IN)
# Anuvrat Tripathi (I080): Aman (en_IN)
# Chaitanya Tikku (I078): Daniel (en_GB)
# Anay Modi (I088): Reed (en_US) or Eddy (en_US)

SCRIPTS = [
    {
        "id": "seg01_krishna_boot",
        "speaker": "Krishna Solanki (I075)",
        "voice": "Rishi",
        "rate": 175,
        "text": (
            "Welcome to the final project demonstration of Saphire AOCS, the Airport Operations Coordination System. "
            "I am Krishna Solanki, Roll Number I075, Database and Integration Lead. "
            "We begin with a cold boot of the entire platform from the terminal. "
            "Executing our startup script boots our PostgreSQL 16 database, applies 17 sequential Flyway migrations across all 43 relational tables in strict Third Normal Form, "
            "initializes our Spring Boot 3.2.5 backend on port 8080, and launches our React 19 frontend on port 3000. "
            "Our Spring Actuator healthcheck confirms status UP. Every screen shown in this video is wired directly to our live PostgreSQL database with zero static mock fallbacks. "
            "I now hand over to Anuvrat for the public portal and departure control flow."
        )
    },
    {
        "id": "seg02_anuvrat_public",
        "speaker": "Anuvrat Tripathi (I080)",
        "voice": "Aman",
        "rate": 175,
        "text": (
            "I am Anuvrat Tripathi, Roll Number I080, leading Frontend UI and UX. "
            "On the Saphire Public Portal, passengers and ground personnel monitor real-time aerodrome telemetry. "
            "Navigating to our Flight Tracker, our custom interactive radar canvas plots live aircraft coordinates fetched dynamically from our backend REST endpoints. "
            "On our Flight Schedule page, travelers query real-time timetables with instant filtering across arrivals, departures, and flight statuses, fully synchronized with live AOCC dispatch operations."
        )
    },
    {
        "id": "seg03_anuvrat_dcs",
        "speaker": "Anuvrat Tripathi (I080)",
        "voice": "Aman",
        "rate": 175,
        "text": (
            "Next, we demonstrate our Departure Control System. Logging in as Check-in Agent Emma Verma, our RBAC gateway authenticates credentials and issues a signed JWT session. "
            "Searching seed PNR PNR00001 retrieves passenger booking records from our database. We open the live seat map, which prevents double-booking using optimistic database locking. "
            "Selecting seat 12A issues a verified boarding pass with automated barcode telemetry. "
            "Tagging checked baggage at 18.5 kilograms logs the tag against the passenger and updates the live flight manifest in real time. "
            "I now hand over to Chaitanya for Airside Operations."
        )
    },
    {
        "id": "seg04_chaitanya_airside",
        "speaker": "Chaitanya Tikku (I078)",
        "voice": "Daniel",
        "rate": 175,
        "text": (
            "I am Chaitanya Tikku, Roll Number I078, overseeing System Logic and Quality Assurance. "
            "In the Airside Operations Console, we manage gate allocations across Concourses A, B, and C. Saphire AOCS enforces hard mathematical safety constraints. "
            "When attempting to assign a widebody Boeing 777 with a 64.8-meter wingspan to Gate A1 with a 36-meter limit, our backend GateService triggers physical wingspan validation and rejects the transaction with an HTTP 409 Conflict exception. "
            "Reassigning to Gate B2 succeeds immediately, maintaining strict aerodrome safety compliance. I now hand over to Anay for turnaround coordination."
        )
    },
    {
        "id": "seg05_anay_aocc",
        "speaker": "Anay Modi (I088)",
        "voice": "Reed (English (US))",
        "rate": 175,
        "text": (
            "I am Anay Modi, Roll Number I088, leading Backend APIs and Logistics. "
            "In the AOCC Command Center, dispatchers monitor end-to-end turnaround lifecycles. Updating fueling milestones triggers reactive progress recalculation across ground teams. "
            "When disruptions occur, logging an IATA Delay Code 89 with operator telemetry updates flight records and alerts airside handlers in real time. "
            "In our Logistics desk, we dynamically assign baggage claim carousels, while our Billing engine calculates automated aeronautical tariffs based on aircraft Maximum Takeoff Weight and apron dwell time. "
            "I hand back to Krishna for security governance and test verification."
        )
    },
    {
        "id": "seg06_krishna_admin",
        "speaker": "Krishna Solanki (I075)",
        "voice": "Rishi",
        "rate": 175,
        "text": (
            "In the System Administration console, administrators manage fine-grained role-based access control. "
            "Our session engine tracks active UUID sessions in our auth_sessions table with real-time revocation. "
            "Every administrative, operational, and check-in event is permanently recorded in our tamper-evident audit trail."
        )
    },
    {
        "id": "seg07_chaitanya_tests",
        "speaker": "Chaitanya Tikku (I078)",
        "voice": "Daniel",
        "rate": 175,
        "text": (
            "To ensure system reliability, we execute our automated test suite. "
            "Spring Boot and Mockito execute 109 unit tests with zero failures, validating security boundaries, gate constraints, and tariff calculations."
        )
    },
    {
        "id": "seg08_conclusion_krishna",
        "speaker": "Krishna Solanki (I075)",
        "voice": "Rishi",
        "rate": 175,
        "text": (
            "Saphire AOCS bridges passenger services, airside safety, turnaround logistics, and aeronautical billing into a single, unified, resilient aerodrome platform."
        )
    },
    {
        "id": "seg09_conclusion_chaitanya",
        "speaker": "Chaitanya Tikku (I078)",
        "voice": "Daniel",
        "rate": 175,
        "text": (
            "Backed by rigorous UML modeling and 109 passing automated unit tests."
        )
    },
    {
        "id": "seg10_conclusion_anuvrat",
        "speaker": "Anuvrat Tripathi (I080)",
        "voice": "Aman",
        "rate": 175,
        "text": (
            "With zero static UI mocks and 100% database-driven reactivity."
        )
    },
    {
        "id": "seg11_conclusion_anay",
        "speaker": "Anay Modi (I088)",
        "voice": "Reed (English (US))",
        "rate": 175,
        "text": (
            "This concludes our live demonstration. Thank you for your evaluation."
        )
    }
]

def generate_audio():
    manifest = []
    for item in SCRIPTS:
        aiff_file = os.path.join(AUDIO_DIR, f"{item['id']}.aiff")
        wav_file = os.path.join(AUDIO_DIR, f"{item['id']}.wav")
        
        # Run macOS say command
        cmd_say = ["say", "-v", item["voice"], "-r", str(item["rate"]), "-o", aiff_file, item["text"]]
        print(f"Generating audio for {item['id']} ({item['speaker']}) using voice {item['voice']}...")
        subprocess.run(cmd_say, check=True)
        
        # Convert AIFF to clean WAV using ffmpeg
        cmd_ffmpeg = ["ffmpeg", "-y", "-i", aiff_file, "-af", "volume=1.2", wav_file]
        subprocess.run(cmd_ffmpeg, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        
        # Remove AIFF temp file
        if os.path.exists(aiff_file):
            os.remove(aiff_file)
            
        # Get duration using ffprobe
        cmd_probe = [
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", wav_file
        ]
        res = subprocess.run(cmd_probe, capture_output=True, text=True, check=True)
        duration = float(res.stdout.strip())
        
        manifest.append({
            "id": item["id"],
            "speaker": item["speaker"],
            "wav_file": wav_file,
            "duration": duration,
            "text": item["text"]
        })
        print(f"  -> Generated {wav_file} (Duration: {duration:.2f}s)")
        
    with open(os.path.join(AUDIO_DIR, "audio_manifest.json"), "w") as f:
        json.dump(manifest, f, indent=2)
        
    total_audio = sum(m["duration"] for m in manifest)
    print(f"\nAll audio clips generated successfully! Total spoken duration: {total_audio:.2f}s ({total_audio/60:.2f} mins)")

if __name__ == "__main__":
    generate_audio()
