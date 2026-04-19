import re
from playwright.sync_api import sync_playwright

URL = "PASTE_ONE_RENT_PROPERTY_LINK_HERE"


def extract_rent_data(page, url):

    page.goto(url, timeout=60000)
    page.wait_for_load_state("networkidle")

    # TITLE
    title_text = page.locator("h1").inner_text()
    title_lines = title_text.split("\n")

    project_name = title_lines[0].strip()

    locality = "N/A"
    if len(title_lines) > 1:
        locality = title_lines[1].replace(", Indore", "").strip()

    # 🔥 RENT PRICE DETECTION
    price = "N/A"
    rent_value = None

    price_candidates = page.locator("text=₹").all_inner_texts()

    for p in price_candidates:
        if "month" in p.lower():

            price = p.strip()

            match = re.search(r"\d[\d,]*", p)
            if match:
                rent_value = int(match.group().replace(",", ""))

            break

    # FULL TEXT
    full_text = page.locator("body").inner_text()

    # BHK
    bhk = None
    for line in full_text.split("\n"):
        if "BHK" in line:
            bhk = int(re.search(r"\d+", line).group())
            break

    # AREA
    area = None
    for line in full_text.split("\n"):
        if "sq" in line.lower():
            match = re.search(r"(\d+\.?\d*)\s*sq", line.lower())
            if match:
                area = int(float(match.group(1)))
                break

    return {
        "project_name": project_name,
        "locality": locality,
        "rent_text": price,
        "rent_per_month": rent_value,
        "bhk": bhk,
        "area_sqft": area
    }


with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()

    data = extract_rent_data(page, URL)

    print("\n🏠 RENT TEST RESULT\n")
    print(data)

    browser.close()