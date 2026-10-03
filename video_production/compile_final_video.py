#!/usr/bin/env python3
"""
Compile the final Master Video for Saphire AOCS.
Merges Playwright raw video with synchronized audio tracks.
"""

import os
import glob
import json
import shutil
import subprocess

PROD_DIR = os.path.abspath(os.path.dirname(__file__))
AUDIO_DIR = os.path.join(PROD_DIR, "audio")
RAW_VIDEO_DIR = os.path.join(PROD_DIR, "raw_video")
OUTPUT_VIDEO = os.path.join(PROD_DIR, "I075_I078_I080_I088_Saphire_AOCS_Video_Demo.mp4")

TARGET_DESTINATIONS = [
    os.path.abspath(os.path.join(PROD_DIR, "..", "presentation", "I075_I078_I080_I088_Saphire_AOCS_Video_Demo.mp4")),
    os.path.abspath(os.path.join(PROD_DIR, "..", "..", "Final Submission Deliverables", "I075_I078_I080_I088_Saphire_AOCS_Video_Demo.mp4")),
    os.path.abspath(os.path.join(PROD_DIR, "..", "..", "Submission Guidelines", "I075_I078_I080_I088_Saphire_AOCS_Video_Demo.mp4")),
]

def compile_video():
    print("=== Step 1: Merging Audio Tracks ===")
    with open(os.path.join(AUDIO_DIR, "audio_manifest.json")) as f:
        manifest = json.load(f)
        
    concat_list_path = os.path.join(AUDIO_DIR, "concat_list.txt")
    with open(concat_list_path, "w") as f:
        for item in manifest:
            # Add file to concat list
            f.write(f"file '{item['wav_file']}'\n")
            
    master_audio_wav = os.path.join(AUDIO_DIR, "master_narration.wav")
    cmd_concat_audio = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", concat_list_path, "-c", "copy", master_audio_wav
    ]
    subprocess.run(cmd_concat_audio, check=True)
    print(f"Master narration audio created: {master_audio_wav}")

    print("\n=== Step 2: Finding Raw Playwright Video ===")
    raw_videos = glob.glob(os.path.join(RAW_VIDEO_DIR, "*.webm"))
    if not raw_videos:
        raise FileNotFoundError("No raw webm videos found in raw_video directory.")
    latest_raw = max(raw_videos, key=os.path.getctime)
    print(f"Using raw video: {latest_raw}")

    print("\n=== Step 3: Encoding Master MP4 Video (1080p H.264 / AAC) ===")
    cmd_encode = [
        "ffmpeg", "-y",
        "-i", latest_raw,
        "-i", master_audio_wav,
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "20",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        OUTPUT_VIDEO
    ]
    subprocess.run(cmd_encode, check=True)
    print(f"\nMaster Video compiled successfully: {OUTPUT_VIDEO}")
    
    # Get video stats
    cmd_probe = [
        "ffprobe", "-v", "error", "-show_entries", "format=duration,size",
        "-of", "json", OUTPUT_VIDEO
    ]
    res = subprocess.run(cmd_probe, capture_output=True, text=True, check=True)
    meta = json.loads(res.stdout)["format"]
    duration = float(meta["duration"])
    size_mb = int(meta["size"]) / (1024 * 1024)
    print(f"Duration: {duration:.2f} seconds ({duration/60:.2f} mins) | File Size: {size_mb:.2f} MB")

    print("\n=== Step 4: Copying to Deliverables Directories ===")
    for dest in TARGET_DESTINATIONS:
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.copy2(OUTPUT_VIDEO, dest)
        print(f"  -> Copied to: {dest}")

if __name__ == "__main__":
    compile_video()
