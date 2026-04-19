from playwright.sync_api import sync_playwright

BASE_URL = "https://www.magicbricks.com/property-for-sale/residential-real-estate"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()

    all_links = []

    for page_num in range(1, 26):   #means 25 pages 

        url = f"{BASE_URL}?cityName=Indore&page={page_num}"

        print(f"\nOpening Page {page_num}")

        page.goto(url, timeout=60000)
        page.wait_for_load_state("networkidle")

        cards = page.query_selector_all("div.mb-srp__card")

        for card in cards:
            anchor = card.query_selector("a")
            if anchor:
                href = anchor.get_attribute("href")
                if href and "magicbricks.com" in href:
                    all_links.append(href)

        print("Links so far:", len(all_links))

    browser.close()

print("\n✅ FINAL TOTAL LINKS:", len(all_links))


with open("indore_buy_links.txt", "w") as f:
    for link in all_links:
        f.write(link + "\n")

print("✅ Links saved to indore_buy_links.txt")