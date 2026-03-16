from playwright.sync_api import sync_playwright

def search_restaurant(name):

    with sync_playwright() as p:

        browser = p.chromium.launch(channel="chrome",headless=False)

        page = browser.new_page()

        page.goto("https://www.meituan.com")

        page.wait_for_timeout(3000)

        page.fill("input", name)

        page.keyboard.press("Enter")

        page.wait_for_timeout(5000)
def open_meituan():

    with sync_playwright() as p:

        browser = p.chromium.launch(headless=False)

        page = browser.new_page()

        page.goto("https://waimai.meituan.com")

        page.wait_for_timeout(5000)