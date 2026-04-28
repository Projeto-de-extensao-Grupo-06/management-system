from playwright.sync_api import Page

class BasePage:
    def __init__(self, page: Page):
        self.page = page

    def navigate(self, path=""):
        from e2e.config import Config
        self.page.goto(f"{Config.BASE_URL}{path}")

    def wait_for_load(self):
        self.page.wait_for_load_state("networkidle")

    def logout(self):
        # Ensure sidebar is expanded if "Sair" is not visible
        logout_btn = self.page.get_by_role("button", name="Sair")
        if not logout_btn.is_visible():
            # Click the toggle button (desktopToggle or mobileToggle)
            self.page.locator("button[class*='toggleButton']").first.click()
            
        logout_btn.click()
        self.page.wait_for_url("**/login")
