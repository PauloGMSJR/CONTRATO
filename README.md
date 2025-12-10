# CONTRATO

Plataforma demo para gerenciamento de contratos, com frontend React/Vite e backend Node.js/Express.

## Estrutura do projeto
- `frontend/`: aplicação React construída com Vite, com telas de cadastro, login e área autenticada para listar/editar templates de contratos.
- `backend/`: API Node.js (Express) com rotas básicas de autenticação e manipulação de templates em memória.

## Pré-requisitos
- Node.js 18+ e npm

## Como executar o backend
```bash
cd backend
npm install
npm run dev # ou npm start
```
A API será exposta em `http://localhost:3001`.

### Endpoints principais
- `POST /api/auth/register`: cadastro com corpo `{ name, email, password }`.
- `POST /api/auth/login`: autenticação com corpo `{ email, password }`.
- `GET /api/templates`: lista templates (requer header `Authorization: Bearer <token>`).
- `PUT /api/templates/:id`: atualiza o conteúdo do template selecionado (requer token e corpo `{ content }`).

## Como executar o frontend
```bash
cd frontend
npm install
npm run dev
```
O frontend executará, por padrão, em `http://localhost:5173` e faz chamadas ao backend em `http://localhost:3001/api`.

## Fluxo básico
1. Criar um usuário via formulário de cadastro ou endpoint de registro.
2. Realizar login para receber o token de sessão.
3. Acessar a área autenticada, escolher um template e editar o texto.
4. Salvar para persistir as alterações em memória durante a execução.
