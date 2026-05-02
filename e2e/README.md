# Framework de Testes E2E - SolarWay

Este diretório contém a automação de testes End-to-End (E2E) para o sistema de gestão, utilizando **Python**, **Playwright** e o padrão **Page Object Model (POM)**.

## Estrutura do Projeto

- `pages/`: Contém as classes Page Object que abstraem a lógica da UI (seletores e ações).
- `tests/`: Contém as suítes de testes automatizados.
- `conftest.py`: Configurações globais do Pytest, fixtures de navegador e hooks de erro (screenshots).
- `config.py`: Gerenciamento de variáveis de ambiente (`.env`).

## Configuração Local

### 1. Ambiente Virtual (Recomendado)

Crie e ative um ambiente virtual para isolar as dependências do projeto:

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Linux / macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalação

Com o ambiente virtual ativo, instale as dependências:

```bash
pip install -r requirements.txt
playwright install --with-deps
```

### 3. Variáveis de Ambiente

Crie um arquivo `.env` na pasta `e2e/` (baseado no `.env.example`) com as seguintes chaves:

```env
BASE_URL=http://localhost:5173
TEST_USER_EMAIL=seu_email@exemplo.com
TEST_USER_PASSWORD=sua_senha
HEADLESS=false
```

## Executando os Testes

Para rodar todos os testes na raiz do projeto (onde está o `pytest.ini`):

```bash
pytest
```

### Comandos Úteis

- `pytest -v`: Modo detalhado.
- `pytest --html=report.html`: Gera um relatório visual em HTML.
- `pytest -n auto`: Executa testes em paralelo (requer `pytest-xdist`).

## Características do Framework

- **Dados Dinâmicos**: Utilizamos a biblioteca **Faker** para gerar nomes, e-mails, CPFs e telefones aleatórios a cada execução, evitando colisões no banco de dados.
- **Robustez (ViaCEP)**: O script aguarda automaticamente o preenchimento dos campos de endereço após a inserção do CEP.
- **Debug Facilitado**: Em caso de falha, o framework tira um print automático da tela (`.png`) para facilitar a identificação de erros de UI ou validação.
- **Isolamento**: Cada teste roda em um contexto de navegador limpo, garantindo que o login de um teste não interfira no outro.
