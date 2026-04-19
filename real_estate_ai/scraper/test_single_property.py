import re
from playwright.sync_api import sync_playwright
from real_estate_ai.db.mongo_connection import insert_property

# 👉 Paste ONE real property link here
URL = "https://www.magicbricks.com/shivashri-dham-kanadia-indore-pdpid-4d4235343234303537"


with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()

    page.goto(URL, timeout=60000)
    page.wait_for_load_state("networkidle")

    # =========================
    # TITLE
    # =========================
    title_text = page.locator("h1").inner_text()

    title_lines = title_text.split("\n")

    project_name = title_lines[0].strip()

    locality = "N/A"
    if len(title_lines) > 1:
        locality = title_lines[1].replace(", Indore", "").strip()

    # =========================
    # PRICE
    # =========================
    price = page.locator("text=₹").first.inner_text()

    # =========================
    # FULL PAGE TEXT (for BHK & AREA)
    # =========================
    full_text = page.locator("body").inner_text()

    # =========================
    # BHK EXTRACTION
    # =========================
    bhk = "N/A"
    for line in full_text.split("\n"):
        if "BHK" in line:
            bhk = line.strip()
            break

    bhk_value = int(re.search(r"\d+", bhk).group()) if bhk != "N/A" else None

    # =========================
    # AREA EXTRACTION (CLEAN)
    # =========================
    area = "N/A"

    for line in full_text.split("\n"):
        if "sq" in line.lower():
            match = re.search(r"(\d+\.?\d*)\s*sq", line.lower())
            if match:
                area = match.group(1)
                break

    area_value = int(float(area)) if area != "N/A" else None

    # =========================
    # FINAL STRUCTURED DATA
    # =========================
    data = {
        "project_name": project_name,
        "locality": locality,
        "city": "Indore",
        "price": price,
        "bhk": bhk_value,
        "area_sqft": area_value,
        "listing_type": "buy",
        "source": "magicbricks"
    }

    print("\n🏠 PROPERTY DATA\n")
    print(data)

    # =========================
    # INSERT INTO MONGODB
    # =========================
    insert_property(data)

    print("\n✅ DATA SAVED TO MONGODB")

    browser.close()