from e2e.pages.base_page import BasePage

class ClientsPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.add_client_button = page.get_by_role("button", name="Cadastrar Cliente")
        self.search_input = page.get_by_placeholder("Buscar por Nome, CPF/CNPJ, E-mail ou Telefone")
        self.confirm_create_button = page.get_by_label("Confirmar cadastro")
        
        self.first_name_input = page.locator("#firstName")
        self.last_name_input = page.locator("#lastName")
        self.email_input = page.locator("#email")
        self.phone_input = page.locator("#phone")
        self.document_input = page.locator("#document")
        self.zip_code_input = page.locator("#zipCode")
        self.state_input = page.locator("#state")
        self.city_input = page.locator("#city")
        self.neighborhood_input = page.locator("#neighborhood")
        self.street_input = page.locator("#street")
        self.number_input = page.locator("#number")

    def open_add_modal(self):
        self.add_client_button.first.click()

    def fill_basic_info(self, first_name, last_name, email, phone, document):
        self.first_name_input.fill(first_name)
        self.last_name_input.fill(last_name)
        self.email_input.fill(email)
        self.phone_input.fill(phone)
        self.document_input.fill(document)

    def fill_address(self, zip_code, number):
        self.zip_code_input.fill(zip_code)
        # Wait for ViaCEP to populate fields - checking city as indicator
        self.page.wait_for_function(
            "id => document.getElementById(id).value !== ''", 
            arg="city", 
            timeout=10000
        )
        self.number_input.fill(number)

    def submit_form(self):
        self.confirm_create_button.click()

    def get_validation_errors(self):
        # Captures Zod errors and global Alert component errors
        errors = self.page.locator("span[class*='errorMessage']").all_text_contents()
        alerts = self.page.locator("div[class*='alert']").all_text_contents()
        return errors + alerts

    def delete_client_by_name(self, name):
        self.search_input.fill(name)
        # Wait for search debounce and table update
        self.page.locator("tr").filter(has_text=name).first.wait_for()
        row = self.page.locator("tr").filter(has_text=name).first
        row.get_by_label("Deletar").click()
        self.page.get_by_role("button", name="Confirmar").click()
