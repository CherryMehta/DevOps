import re
import time
import random
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from playwright.sync_api import sync_playwright
from db.mongo_connection import insert_raw_property


# ================= RENT EXTRACTION (ACCURATE) =================

def extract_rent(page):

    try:
        # 🎯 Target the REAL rent field
        rent_section = page.locator("text=Rental Value").locator("xpath=..").inner_text()

        match = re.search(r"₹\s?([\d,]+)", rent_section)

        if match:
            return int(match.group(1).replace(",", ""))

    except:
        pass

    return None


# ================= DATA EXTRACTION =================

def extract_data(page, url):

    page.goto(url, timeout=60000)

    try:
        page.wait_for_selector("h1", timeout=15000)
    except:
        page.reload()
        page.wait_for_selector("h1", timeout=15000)

    title = page.locator("h1").inner_text().strip()

    project_name = title

    # ✅ LOCALITY FROM TITLE
    locality = "N/A"
    loc_match = re.search(r"in (.*?),\s*Indore", title, re.IGNORECASE)
    if loc_match:
        locality = loc_match.group(1).strip()

    # ✅ RENT (REAL FIELD)
    rent_value = extract_rent(page)

    if rent_value is None:
        print("⏭ Rent not found")
        return None

    # ✅ BHK
    bhk = None
    bhk_match = re.search(r"(\d+)\s*BHK", title, re.IGNORECASE)
    if bhk_match:
        bhk = int(bhk_match.group(1))

    # ✅ AREA
    area = None
    area_match = re.search(r"(\d+)\s*Sq[-\s]?ft", title, re.IGNORECASE)
    if area_match:
        area = int(area_match.group(1))

    time.sleep(random.uniform(2, 4))

    return {
        "project_name": project_name,
        "locality": locality,
        "city": "Indore",
        "rent_per_month": rent_value,
        "bhk": bhk,
        "area_sqft": area,
        "listing_type": "rent",
        "source": "magicbricks"
    }


# ================= MAIN =================

with sync_playwright() as p:

    browser = p.chromium.launch(headless=False, slow_mo=100)

    context = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
    )

    page = context.new_page()

    with open("indore_rent_links.txt") as f:
        links = f.readlines()

    for idx, link in enumerate(links):

        url = link.strip()

        print(f"\nScraping {idx+1} / {len(links)}")

        try:
            data = extract_data(page, url)

            if data:
                insert_raw_property(data)
                print("✅ Saved:", data["project_name"], "→ ₹", data["rent_per_month"])

        except Exception as e:
            print("❌ Failed:", e)

    browser.close()