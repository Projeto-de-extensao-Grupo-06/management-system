from e2e.pages.login_page import LoginPage
from e2e.config import Config

def test_successful_login(page):
    login_page = LoginPage(page)
    login_page.login(Config.TEST_USER_EMAIL, Config.TEST_USER_PASSWORD)
    
    # Wait for any valid dashboard route (resolves dynamic redirect based on mainModule)
    dashboard_pattern = r".*/(clientes|agenda|projetos|materiais|configuracoes).*"
    page.wait_for_url(dashboard_pattern)
    
    assert any(route in page.url for route in ["/clientes", "/agenda", "/projetos", "/materiais", "/configuracoes"])

def test_failed_login(page):
    login_page = LoginPage(page)
    login_page.login("wrong@email.com", "wrongpassword")
    login_page.error_alert.wait_for(state="visible", timeout=5000)
    assert login_page.error_alert.is_visible()
    assert "Credenciais inválidas" in login_page.get_error_message()
