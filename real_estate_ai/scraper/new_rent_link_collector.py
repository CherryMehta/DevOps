from playwright.sync_api import sync_playwright

BASE_URL = "https://www.magicbricks.com/property-for-rent/residential-real-estate?cityName=Indore"

MAX_PAGES = 25

all_links = set()

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    for page_num in range(1, MAX_PAGES + 1):

        url = f"{BASE_URL}&page={page_num}"
        print(f"\nOpening Page {page_num}")

        try:
            page.goto(url, timeout=60000)
            page.wait_for_load_state("domcontentloaded")
            
            # ✅ wait for cards (most stable selector)
            try:
                page.wait_for_selector("div.mb-srp__card", timeout=60000)
            except:
                # Try alternative selector if primary fails
                print(f"⚠ Primary selector not found, trying alternatives...")
                page.wait_for_selector("div.property-card", timeout=30000)

            cards = page.locator("div.mb-srp__card, div.property-card").all()

            for card in cards:

                anchor = card.locator("a[href*='propertyDetails']").first

                if anchor:
                    href = anchor.get_attribute("href")

                    if href:
                        if href.startswith("/"):
                            href = "https://www.magicbricks.com" + href

                        all_links.add(href)

            print("Links so far:", len(all_links))
            
        except Exception as e:
            print(f"⚠ Error on page {page_num}: {e}")

    browser.close()

with open("indore_rent_links.txt", "w") as f:
    for link in all_links:
        f.write(link + "\n")

print("\n✅ Rent property links saved:", len(all_links))