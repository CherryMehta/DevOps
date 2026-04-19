# # from playwright.sync_api import sync_playwright
# # import time

# # BASE_URL = "https://www.magicbricks.com/property-for-rent/residential-real-estate?cityName=Indore"

# # MAX_PAGES = 25
# # SCROLLS_PER_PAGE = 7

# # all_links = set()

# # with sync_playwright() as p:
# #     browser = p.chromium.launch(headless=False)
# #     page = browser.new_page()

# #     for page_num in range(1, MAX_PAGES + 1):

# #         url = f"{BASE_URL}&page={page_num}"
# #         print(f"\nOpening Page {page_num}")

# #         page.goto(url, timeout=60000)
# #         page.wait_for_load_state("domcontentloaded")

# #         # 🔽 force lazy loading
# #         for _ in range(SCROLLS_PER_PAGE):
# #             page.mouse.wheel(0, 4000)
# #             time.sleep(1.5)

# #         # ✅ every listing container
# #         cards = page.locator("div.mb-srp__list").all()

# #         for card in cards:

# #             anchors = card.locator("a[href*='propertyDetails']").all()

# #             for a in anchors:
# #                 href = a.get_attribute("href")

# #                 if href:
# #                     if href.startswith("/"):
# #                         href = "https://www.magicbricks.com" + href

# #                     all_links.add(href)
# #                     break

# #         print("Links so far:", len(all_links))

# #     browser.close()

# # # 💾 SAVE FILE
# # with open("indore_rent_links.txt", "w") as f:
# #     for link in all_links:
# #         f.write(link + "\n")

# # print("\n✅ Rent property links saved:", len(all_links))

# from playwright.sync_api import sync_playwright, TimeoutError

# BASE_URL = "https://www.magicbricks.com/property-for-rent/residential-real-estate"
# MAX_PAGES = 25

# all_links = set()

# with sync_playwright() as p:
#     browser = p.chromium.launch(
#         headless=False,
#         args=["--disable-blink-features=AutomationControlled"]
#     )

#     page = browser.new_page()

#     for page_num in range(1, MAX_PAGES + 1):

#         url = f"{BASE_URL}?cityName=Indore&page={page_num}"
#         print(f"\nOpening Page {page_num}")

#         page.goto(url, timeout=60000)

#         try:
#             page.wait_for_selector("a[href*='propertyDetails']", timeout=8000)
#         except TimeoutError:
#             print("❌ No listings found → stopping pagination")
#             break   # ⛔ stop loop when pages finish

#         anchors = page.query_selector_all("a[href*='propertyDetails']")

#         page_links = 0

#         for a in anchors:
#             href = a.get_attribute("href")

#             if href:
#                 if href.startswith("/"):
#                     href = "https://www.magicbricks.com" + href

#                 if href not in all_links:
#                     page_links += 1

#                 all_links.add(href)

#         print(f"✅ New links this page: {page_links}")
#         print("🔗 Total links so far:", len(all_links))

#         # # 🧠 stop if no new data
#         # if page_links == 0:
#         #     print("⛔ No new links → last page reached")
#         #     break

#     browser.close()

# # 💾 SAVE
# with open("indore_rent_links.txt", "w") as f:
#     for link in all_links:
#         f.write(link + "\n")

# print("\n🎯 FINAL TOTAL RENT LINKS:", len(all_links))

from playwright.sync_api import sync_playwright

BASE_URL = "https://www.magicbricks.com/property-for-rent/residential-real-estate"
MAX_PAGES = 25

all_links = set()

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()

    for page_num in range(1, MAX_PAGES + 1):

        url = f"{BASE_URL}?cityName=Indore&page={page_num}"
        print(f"Opening Page {page_num}")

        page.goto(url, timeout=60000)
        page.wait_for_load_state("domcontentloaded")

        anchors = page.query_selector_all("a[href*='propertyDetails']")

        for a in anchors:
            href = a.get_attribute("href")

            if href:
                if href.startswith("/"):
                    href = "https://www.magicbricks.com" + href

                all_links.add(href)

        print("Total links so far:", len(all_links))

    browser.close()

# ✅ SAVE TO TXT
with open("indore_rent_links.txt", "w") as f:
    for link in all_links:
        f.write(link + "\n")

print("\n✅ All links saved to indore_rent_links.txt")
print("🎯 TOTAL LINKS:", len(all_links))