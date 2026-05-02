from e2e.pages.base_page import BasePage

class LoginPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.email_input = page.get_by_placeholder("Informe seu Email: exemplo@gmail.com")
        self.password_input = page.get_by_placeholder("Informe sua Senha")
        self.login_button = page.get_by_role("button", name="Entrar")
        self.error_alert = page.locator("div[class*='alert'][class*='error']")

    def login(self, email, password):
        self.navigate("/login")
        self.page.wait_for_load_state("networkidle")
        
        # If redirected to /clientes, it means we're already logged in. Logout first.
        if "/clientes" in self.page.url:
            self.logout()
            self.navigate("/login")
            
        self.email_input.wait_for(state="visible")
        self.email_input.fill(email)
        self.password_input.fill(password)
        self.login_button.click()

    def get_error_message(self):
        return self.error_alert.inner_text()
