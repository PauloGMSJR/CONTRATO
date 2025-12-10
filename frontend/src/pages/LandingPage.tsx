import { Link } from 'react-router-dom';
import '../styles/landing.css';

export default function LandingPage() {
  return (
    <section className="landing">
      <div className="landing__hero">
        <h1>Contratos Online</h1>
        <p>Gerador educativo e gratuito de contratos personalizados, pensado para projetos universitários.</p>
        <Link to="/selecionar" className="btn">
          Começar agora
        </Link>
      </div>
      <div className="landing__steps">
        <div>
          <span className="badge">1</span>
          Escolha o tipo de contrato
        </div>
        <div>
          <span className="badge">2</span>
          Informe dados das partes
        </div>
        <div>
          <span className="badge">3</span>
          Responda às perguntas das cláusulas
        </div>
        <div>
          <span className="badge">4</span>
          Pré-visualize e baixe em PDF
        </div>
      </div>
    </section>
  );
}
