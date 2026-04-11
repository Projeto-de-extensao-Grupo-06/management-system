import pytest
from playwright.sync_api import sync_playwright
from e2e.config import Config
from e2e.pages.login_page import LoginPage

@pytest.fixture(scope="session")
def browser():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=Config.HEADLESS)
        yield browser
        browser.close()

@pytest.fixture
def context(browser):
    context = browser.new_context()
    yield context
    context.close()

@pytest.fixture
def page(context):
    page = context.new_page()
    yield page
    page.close()

@pytest.fixture
def authenticated_page(page):
    login_page = LoginPage(page)
    login_page.login(Config.TEST_USER_EMAIL, Config.TEST_USER_PASSWORD)
    page.wait_for_url("**/clientes")
    return page

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    if report.when == "call" and report.failed:
        page = item.funcargs.get("page") or item.funcargs.get("authenticated_page")
        if page:
            import os
            screenshot_dir = os.path.join("e2e", "reports", "screenshots")
            os.makedirs(screenshot_dir, exist_ok=True)
            
            name = item.nodeid.replace("::", "_").replace("/", "_")
            page.screenshot(path=os.path.join(screenshot_dir, f"{name}.png"))
