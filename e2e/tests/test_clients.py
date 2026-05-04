from e2e.pages.clients_page import ClientsPage
from faker import Faker
import pytest

fake = Faker("pt_BR")

def test_clients_crud_flow(authenticated_page):
    clients_page = ClientsPage(authenticated_page)
    clients_page.navigate("/clientes")
    
    test_first_name = fake.first_name()
    test_last_name = fake.last_name()
    test_email = fake.email()
    test_cpf = fake.cpf()
    # Generates 11 digits (Brazilian cell phone standard)
    test_phone = fake.bothify(text='###########')
    full_name = f"{test_first_name} {test_last_name}"

    clients_page.open_add_modal()
    clients_page.fill_basic_info(
        test_first_name, 
        test_last_name, 
        test_email, 
        test_phone, 
        test_cpf
    )
    
    # Fill address with ViaCEP support
    clients_page.fill_address("77423-480", "100")
    clients_page.submit_form()
    
    # Handle possible errors
    try:
        authenticated_page.wait_for_selector("text=Cliente cadastrado com sucesso!", timeout=5000)
    except Exception:
        errors = clients_page.get_validation_errors()
        pytest.fail(f"Falha na validação do formulário: {errors}")
    
    clients_page.search_input.fill(test_first_name)
    authenticated_page.locator("tr").filter(has_text=full_name).first.wait_for()
    assert authenticated_page.locator("tr").filter(has_text=full_name).is_visible()

    clients_page.delete_client_by_name(full_name)
    authenticated_page.wait_for_selector("text=Cliente removido com sucesso!")
    
    clients_page.search_input.fill(test_first_name)
    authenticated_page.wait_for_timeout(1000)
    assert authenticated_page.locator("text=Nenhum cliente encontrado.").is_visible()
