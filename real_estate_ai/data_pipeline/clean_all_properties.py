import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db.mongo_connection import db

raw = db["raw_properties"]
clean = db["properties"]

inserted = 0
skipped = 0

for doc in raw.find():

    # ❌ skip bad rent
    if doc.get("listing_type") == "rent":
        if not doc.get("rent_per_month") or doc["rent_per_month"] < 1000:
            skipped += 1
            continue

    # ❌ skip bad buy
    if doc.get("listing_type") == "buy":
        if not doc.get("price"):
            skipped += 1
            continue

    # ❌ skip missing locality
    if doc.get("locality") in [None, "N/A"]:
        skipped += 1
        continue

    # avoid duplicates
    duplicate = clean.find_one({
        "project_name": doc.get("project_name"),
        "locality": doc.get("locality"),
        "listing_type": doc.get("listing_type")
    })

    if duplicate:
        continue

    clean.insert_one(doc)
    inserted += 1

print("✅ Inserted:", inserted)
print("⏭ Skipped:", skipped)