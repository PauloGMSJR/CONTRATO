import express from 'express';
import cors from 'cors';
import contractsRouter from './routes/contracts';
import authRouter from './routes/auth';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ mensagem: 'API Contratos Online ativa' });
});

app.use('/api/contratos', contractsRouter);
app.use('/api/auth', authRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Erro não tratado', err.message);
  res.status(500).json({ mensagem: 'Erro interno' });
});

app.listen(PORT, () => {
  console.log(`API Contratos Online rodando em http://localhost:${PORT}`);
});
