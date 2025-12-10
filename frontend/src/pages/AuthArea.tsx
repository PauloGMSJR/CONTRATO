import { FormEvent, useState } from 'react';
import { api } from '../services/api';
import '../styles/form.css';

export default function AuthArea() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('A autenticação é opcional e simplificada.');

  const enviar = async (e: FormEvent<HTMLFormElement>, endpoint: 'cadastrar' | 'login') => {
    e.preventDefault();
    try {
      const resultado = await api.post(`/auth/${endpoint}`, { nome, email, senha });
      setMensagem(`Tudo certo! Token básico: ${resultado.tokenBasico ?? 'n/d'}`);
    } catch (error) {
      setMensagem((error as Error).message);
    }
  };

  return (
    <section>
      <h2>Login / Cadastro</h2>
      <p>Use estes formulários para testar o fluxo básico de autenticação.</p>
      <div className="auth-grid">
        <form className="card" onSubmit={(e) => enviar(e, 'cadastrar')}>
          <h3>Cadastrar</h3>
          <label>
            Nome
            <input value={nome} onChange={(e) => setNome(e.target.value)} required />
          </label>
          <label>
            E-mail
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Senha
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </label>
          <button className="btn" type="submit">
            Cadastrar
          </button>
        </form>

        <form className="card" onSubmit={(e) => enviar(e, 'login')}>
          <h3>Login</h3>
          <label>
            E-mail
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Senha
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </label>
          <button className="btn" type="submit">
            Entrar
          </button>
        </form>
      </div>
      <p aria-live="polite" className="mensagem">
        {mensagem}
      </p>
    </section>
  );
}
