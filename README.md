# Contratos Online

Plataforma web educativa para gerar contratos personalizados em poucos passos. O projeto é um MVP pensado para extensão
universitária, com frontend em React + TypeScript e backend em Node.js + Express (TypeScript).

## Estrutura de pastas
- `frontend/` – aplicação React/Vite com React Router e CSS modules simples.
- `backend/` – API Express com geração de PDF, persistência em memória/JSON e endpoints para pré-visualização de contratos.
- `docs/README_operacional.md` – resumo de arquitetura e decisões.
- `package.json` (raiz) – scripts para facilitar o start de front/back.

## Requisitos atendidos (resumo)
- Seleção de tipos de contrato (locação, serviços, compra/venda, parceria).
- Coleta de dados das partes e parametrização de cláusulas guiadas.
- Pré-visualização em tempo real e exportação em PDF.
- Estrutura para histórico de geração e autenticação básica opcional.

## Pré-requisitos
- Node.js 18+ e npm

## Instalação
Na raiz, instale dependências de front e back:
```bash
npm install --prefix backend
npm install --prefix frontend
```

## Executando em desenvolvimento
Em terminais separados:
```bash
npm run dev:backend   # porta padrão 4000
npm run dev:frontend  # porta padrão 5173
```

A variável `VITE_API_URL` pode ser usada no frontend para apontar para outro host da API (padrão: http://localhost:4000/api).

## Build
```bash
npm run build:backend
npm run build:frontend
```

## Principais endpoints do backend
- `GET /api/contratos/tipos` – lista tipos disponíveis.
- `GET /api/contratos/modelos/:tipo` – traz modelo e cláusulas base.
- `POST /api/contratos/preview` – recebe dados das partes e parâmetros e retorna texto montado.
- `POST /api/contratos/exportar-pdf` – gera PDF do contrato e retorna para download.
- `POST /api/contratos/historico` – registra geração (anonimizado) em JSON.
- `POST /api/auth/cadastrar` e `POST /api/auth/login` – fluxo simples opcional.

## Observações
- Geração de DOCX está preparada via função placeholder no backend (`prepararDocxBuffer`); pode ser expandida com bibliotecas
  como `docx` ou `docxtemplater`.
- Persistência atual usa arquivos JSON e memória para facilitar evolução futura para um banco de dados.
