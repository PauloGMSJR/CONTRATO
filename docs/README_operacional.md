# Arquitetura operacional

## Visão geral
- **Frontend**: React + TypeScript via Vite, com React Router para os passos e CSS modular simples para layout e acessibilidade.
- **Backend**: Node.js + Express em TypeScript. Dados de modelos carregados de `backend/data/contratos_modelos.json` e histórico em
  `backend/data/historico.json`.
- **Geração de documentos**: PDF com `pdfkit`; função `prepararDocxBuffer` marca o ponto de extensão para DOCX.

## Fluxo dos passos
1. **/selecionar** – busca `/api/contratos/tipos` e grava o tipo no contexto global.
2. **/partes** – coleta dados das partes e avança.
3. **/clausulas** – carrega modelo pelo tipo e permite ativar/desativar e preencher parâmetros.
4. **/preview** – chama `/api/contratos/preview` para texto e `/api/contratos/exportar-pdf` para download.

## Endpoints e serviços
- `contractsRouter` (backend/src/routes/contracts.ts) centraliza tipos, modelos, preview, PDF e histórico.
- `authRouter` (backend/src/routes/auth.ts) oferece cadastro/login simples e endpoints preparados para contratos salvos.
- `contractService` (backend/src/services/contractService.ts) monta texto e gera PDF.
- `dataStore` (backend/src/services/dataStore.ts) lê/escreve JSON e mantém cache de usuários em memória.

## Evolução futura
- Substituir armazenamento JSON por banco relacional ou NoSQL.
- Implementar autenticação real (JWT) e associação de contratos a usuários.
- Integrar geração DOCX com templates ricos.
- Armazenar histórico/telemetria em fila ou base analítica.
