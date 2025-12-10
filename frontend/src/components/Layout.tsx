import { Link } from 'react-router-dom';
import '../styles/layout.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <header className="layout__header">
        <Link to="/" className="layout__logo" aria-label="Ir para página inicial">
          Contratos Online
        </Link>
        <nav className="layout__nav">
          <Link to="/selecionar">Passo 1 – Tipo</Link>
          <Link to="/partes">Passo 2 – Partes</Link>
          <Link to="/clausulas">Passo 3 – Cláusulas</Link>
          <Link to="/preview">Passo 4 – Pré-visualização</Link>
          <Link to="/auth">Login/Cadastro</Link>
        </nav>
      </header>
      <main className="layout__main">{children}</main>
      <footer className="layout__footer">Plataforma educativa – não substitui consulta jurídica profissional.</footer>
    </div>
  );
}
