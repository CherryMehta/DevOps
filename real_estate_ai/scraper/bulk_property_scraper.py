import re
import sys
import os
from playwright.sync_api import sync_playwright

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from real_estate_ai.db.mongo_connection import insert_raw_property


def extract_data(page, url):

    page.goto(url, timeout=60000)
    page.wait_for_load_state("domcontentloaded")

    page.wait_for_selector("h1")

    title_text = page.locator("h1").inner_text()
    title_lines = title_text.split("\n")

    project_name = title_lines[0].strip()
    locality = title_lines[1].replace(", Indore", "").strip() if len(title_lines) > 1 else "N/A"

    full_text = page.locator("body").inner_text()

    # 💰 PRICE
    price_match = re.search(r"₹[\d,.]+\s*(Cr|Crore|Lakh|L|Lacs)", full_text, re.I)
    price_value = price_match.group(0) if price_match else "N/A"

    # 🏠 BHK
    bhk_match = re.search(r"(\d+)\s*BHK", full_text)
    bhk_value = int(bhk_match.group(1)) if bhk_match else None

    # 📐 AREA
    area_match = re.search(r"(\d+\.?\d*)\s*sq", full_text.lower())
    area_value = int(float(area_match.group(1))) if area_match else None

    return {
        "project_name": project_name,
        "locality": locality,
        "city": "Indore",
        "price": price_value,
        "bhk": bhk_value,
        "area_sqft": area_value,
        "listing_type": "buy",
        "source": "magicbricks"
    }


with sync_playwright() as p:

    browser = p.chromium.launch(headless=False)
    page = browser.new_page()

    with open("indore_buy_links.txt") as f:
        links = [link.strip() for link in f if link.strip()]

    for idx, url in enumerate(links):

        print(f"\nScraping {idx+1} / {len(links)}")

        try:
            data = extract_data(page, url)
            insert_raw_property(data)
            print("✅ Saved:", data["project_name"])

        except Exception as e:
            print("❌ Failed:", url, e)

    browser.close()