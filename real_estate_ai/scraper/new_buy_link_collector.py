from playwright.sync_api import sync_playwright
import time
import random

BASE_URL = "https://www.magicbricks.com/property-for-sale/residential-real-estate?cityName=Indore"
MAX_PAGES = 25

all_links = set()

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)  # 🔥 safer

    context = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
    )

    page = context.new_page()

    for page_num in range(1, MAX_PAGES + 1):

        url = f"{BASE_URL}&page={page_num}"
        print(f"\n📄 Opening Page {page_num}")

        page.goto(url, timeout=60000)
        page.wait_for_load_state("domcontentloaded")

        # 🔽 scroll to load lazy content
        for _ in range(3):
            page.mouse.wheel(0, 3000)
            time.sleep(1)

        page.wait_for_selector("div.mb-srp__card", timeout=10000)

        cards = page.locator("div.mb-srp__card").all()

        page_links = 0

        for card in cards:

            anchor = card.locator("a[href*='propertyDetails']").first

            if anchor:
                href = anchor.get_attribute("href")

                if href and "propertyDetails" in href:

                    if href.startswith("/"):
                        href = "https://www.magicbricks.com" + href

                    if href not in all_links:
                        page_links += 1

                    all_links.add(href)

        print(f"✅ New links this page: {page_links}")
        print("🔗 Total links so far:", len(all_links))

        # ⛔ stop if no new links (end reached)
        if page_links == 0:
            print("⛔ No new links → stopping early")
            break

        time.sleep(random.uniform(1, 2))

    browser.close()

# 💾 Save links
with open("indore_buy_links.txt", "w") as f:
    for link in all_links:
        f.write(link + "\n")

print("\n🎯 FINAL TOTAL BUY LINKS:", len(all_links))
print("✅ Saved to indore_buy_links.txt")