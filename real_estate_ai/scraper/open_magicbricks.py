from playwright.sync_api import sync_playwright

URL = "https://www.magicbricks.com/property-for-sale/residential-real-estate?cityName=Indore"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()

    page.goto(URL, timeout=60000)

    page.wait_for_timeout(5000)

    print("MagicBricks opened successfully ✅")

    browser.close()