import re
from playwright.sync_api import sync_playwright


def extract_rent_data(page, url):

    page.goto(url, timeout=60000)
    page.wait_for_load_state("networkidle")

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

    return rent_value


# 🔥 GET FIRST 2 VALID RENT LINKS AUTOMATICALLY
with open("indore_rent_links.txt") as f:
    links = [l.strip() for l in f if "/propertyDetails/" in l]


test_links = links[:2]


with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()

    for url in test_links:

        print("\nTesting:", url)

        rent = extract_rent_data(page, url)

        if rent:
            print("✅ VALID RENT FOUND →", rent)
        else:
            print("❌ NOT A RENT LISTING")

    browser.close()
    