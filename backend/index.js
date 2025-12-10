const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const users = [];
const sessions = new Map();

const templates = [
  {
    id: 'nda',
    name: 'Acordo de Confidencialidade (NDA)',
    content:
      'Este Acordo de Confidencialidade (NDA) é celebrado entre as partes para proteger informações sigilosas compartilhadas no âmbito do presente relacionamento comercial.'
  },
  {
    id: 'servicos',
    name: 'Contrato de Prestação de Serviços',
    content:
      'Este Contrato de Prestação de Serviços descreve os termos para execução das atividades contratadas, prazos, responsabilidades e forma de pagamento.'
  },
  {
    id: 'parceria',
    name: 'Acordo de Parceria',
    content:
      'As partes concordam em cooperar em iniciativas conjuntas conforme os termos estabelecidos neste Acordo de Parceria.'
  }
];

function findUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = authHeader.replace('Bearer ', '');
  const user = sessions.get(token);
  if (!user) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  req.user = user;
  req.token = token;
  return next();
}

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
  }

  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: 'Usuário já cadastrado.' });
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password
  };

  users.push(newUser);
  const token = uuidv4();
  sessions.set(token, newUser);

  return res.status(201).json({
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
    token
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const token = uuidv4();
  sessions.set(token, user);

  return res.json({
    user: { id: user.id, name: user.name, email: user.email },
    token
  });
});

app.get('/api/templates', authenticate, (req, res) => {
  return res.json({ templates });
});

app.put('/api/templates/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const template = templates.find((item) => item.id === id);
  if (!template) {
    return res.status(404).json({ message: 'Template não encontrado.' });
  }

  if (typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ message: 'Conteúdo inválido.' });
  }

  template.content = content;
  return res.json({ template });
});

app.listen(PORT, () => {
  console.log(`API executando em http://localhost:${PORT}`);
});
