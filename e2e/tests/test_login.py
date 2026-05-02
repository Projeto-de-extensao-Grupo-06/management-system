from e2e.pages.login_page import LoginPage
from e2e.config import Config

def test_successful_login(page):
    login_page = LoginPage(page)
    login_page.login(Config.TEST_USER_EMAIL, Config.TEST_USER_PASSWORD)
    page.wait_for_url("**/clientes")
    assert "/clientes" in page.url
    
    # Optional: Logoff validation
    login_page.logout()
    assert "/login" in page.url

def test_failed_login(page):
    login_page = LoginPage(page)
    login_page.login("wrong@email.com", "wrongpassword")
    login_page.error_alert.wait_for(state="visible", timeout=5000)
    assert login_page.error_alert.is_visible()
    assert "Credenciais inválidas" in login_page.get_error_message()
