import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:3001/api';

function App() {
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [authToken, setAuthToken] = useState('');
  const [user, setUser] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!authToken) {
      setTemplates([]);
      setSelectedId('');
      setEditorContent('');
      return;
    }

    fetch(`${API_BASE}/templates`, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Não foi possível carregar templates.');
        }
        return response.json();
      })
      .then((data) => {
        setTemplates(data.templates || []);
      })
      .catch((error) => setFeedback(error.message));
  }, [authToken]);

  const handleRegister = (event) => {
    event.preventDefault();
    setFeedback('');

    fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.message || 'Erro no cadastro.');
        }
        return payload;
      })
      .then((payload) => {
        setUser(payload.user);
        setAuthToken(payload.token);
        setFeedback('Cadastro realizado com sucesso!');
      })
      .catch((error) => setFeedback(error.message));
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setFeedback('');

    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.message || 'Erro ao autenticar.');
        }
        return payload;
      })
      .then((payload) => {
        setUser(payload.user);
        setAuthToken(payload.token);
        setFeedback('Login realizado com sucesso!');
      })
      .catch((error) => setFeedback(error.message));
  };

  const handleTemplateSelection = (templateId) => {
    setSelectedId(templateId);
    const selected = templates.find((template) => template.id === templateId);
    setEditorContent(selected?.content || '');
  };

  const handleSaveTemplate = () => {
    if (!selectedId) {
      setFeedback('Selecione um template para editar.');
      return;
    }

    fetch(`${API_BASE}/templates/${selectedId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ content: editorContent })
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.message || 'Erro ao salvar template.');
        }
        return payload;
      })
      .then((payload) => {
        const updatedTemplate = payload.template;
        setTemplates((prev) => prev.map((item) => (item.id === updatedTemplate.id ? updatedTemplate : item)));
        setFeedback('Template atualizado com sucesso!');
      })
      .catch((error) => setFeedback(error.message));
  };

  const isAuthenticated = Boolean(authToken);

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Plataforma de Contratos Online</p>
          <h1>Gerencie seus contratos com rapidez</h1>
          <p>Cadastre-se, autentique-se e personalize templates prontos para uso.</p>
        </div>
        {isAuthenticated && user ? (
          <div className="user-card">
            <p className="eyebrow">Usuário autenticado</p>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
        ) : null}
      </header>

      <main className="grid">
        <section className="card">
          <h2>Cadastro</h2>
          <form className="form" onSubmit={handleRegister}>
            <label>
              Nome
              <input
                type="text"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                required
              />
            </label>
            <label>
              E-mail
              <input
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
              />
            </label>
            <button type="submit">Criar conta</button>
          </form>
        </section>

        <section className="card">
          <h2>Login</h2>
          <form className="form" onSubmit={handleLogin}>
            <label>
              E-mail
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </label>
            <button type="submit">Entrar</button>
          </form>
        </section>
      </main>

      <section className="card full">
        <div className="section-header">
          <div>
            <p className="eyebrow">Área autenticada</p>
            <h2>Templates de contratos</h2>
            <p>Escolha um modelo para editar o texto conforme a necessidade.</p>
          </div>
          {isAuthenticated ? (
            <span className="status success">Sessão ativa</span>
          ) : (
            <span className="status">Faça login para acessar</span>
          )}
        </div>

        {isAuthenticated ? (
          <div className="templates">
            <aside className="list">
              {templates.map((template) => (
                <button
                  key={template.id}
                  className={`list-item ${selectedId === template.id ? 'selected' : ''}`}
                  onClick={() => handleTemplateSelection(template.id)}
                >
                  <strong>{template.name}</strong>
                  <span>{template.id}</span>
                </button>
              ))}
            </aside>

            <div className="editor">
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                placeholder="Selecione um template para editar"
              />
              <button className="primary" onClick={handleSaveTemplate} disabled={!selectedId}>
                Salvar alterações
              </button>
            </div>
          </div>
        ) : (
          <p>Realize o login para visualizar e editar os templates.</p>
        )}
      </section>

      {feedback ? <div className="feedback">{feedback}</div> : null}
    </div>
  );
}

export default App;
