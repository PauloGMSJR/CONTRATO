import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { usuarios } from '../services/dataStore';
import { Usuario } from '../types';

const router = Router();

router.post('/cadastrar', (req, res) => {
  const { nome, email, senha } = req.body as { nome: string; email: string; senha: string };
  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Nome, e-mail e senha são obrigatórios.' });
  }

  const existente = usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existente) {
    return res.status(409).json({ mensagem: 'Usuário já cadastrado.' });
  }

  const novo: Usuario = { id: uuid(), nome, email, senhaHash: senha };
  usuarios.push(novo);
  return res.status(201).json({ usuario: { id: novo.id, nome: novo.nome, email: novo.email }, tokenBasico: novo.id });
});

router.post('/login', (req, res) => {
  const { email, senha } = req.body as { email: string; senha: string };
  const usuario = usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.senhaHash === senha);
  if (!usuario) {
    return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
  }
  return res.json({ usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }, tokenBasico: usuario.id });
});

router.get('/contratos/salvos', (_req, res) => {
  // Endpoint preparado para expansão futura: retornaria contratos salvos do usuário autenticado.
  return res.json({ contratos: [] });
});

router.post('/contratos/salvos', (req, res) => {
  // Estrutura pronta para receber contratos personalizados; hoje só confirma recebimento.
  const payload = req.body;
  return res.status(201).json({ recebido: payload, mensagem: 'Persistência real pode ser plugada aqui.' });
});

export default router;
