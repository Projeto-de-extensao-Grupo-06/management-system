# Sistema de Gestão

Este é um projeto de sistema de gestão desenvolvido com tecnologias modernas de web.

## Tecnologias Utilizadas

- **React** (com TypeScript)
- **Vite** (Build tool e servidor de desenvolvimento)
- **Zustand** (Gerenciamento de estado)
- **Axios** (Requisições HTTP)
- **ApexCharts** (Visualização de dados/gráficos)
- **Vitest** (Testes automatizados)

## Como Rodar o Projeto

1. **Instalar dependências:**

   ```bash
   npm install
   ```

2. **Rodar em modo de desenvolvimento:**

   ```bash
   npm run dev
   ```

3. **Rodar os testes:**

   ```bash
   npm run test
   ```

4. **Build para produção:**

   ```bash
   npm run build
   ```

## Testes E2E (End-toEnd)

O projeto conta com uma suíte de testes E2E automatizados utilizando **Python** e **Playwright**.

1. **Navegar até a pasta de testes:**
   ```powershell
   cd e2e
   ```

2. **Configurar ambiente virtual (Recomendado):**
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1  # Windows
   source venv/bin/activate     # Linux/macOS
   ```

3. **Instalar dependências e navegadores:**
   ```powershell
   pip install -r requirements.txt
   playwright install
   ```

4. **Executar os testes:**
   ```powershell
   pytest
   ```

Para mais detalhes, consulte o [README de E2E](e2e/README.md).
