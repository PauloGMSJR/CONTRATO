import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContract } from '../context/ContractContext';
import { api } from '../services/api';
import '../styles/preview.css';

export default function PreviewDownload() {
  const navigate = useNavigate();
  const { contratoTipo, previewTexto, gerarPreview, parte1, parte2, clausulasAtivas, parametros } = useContract();

  useEffect(() => {
    if (!contratoTipo) return;
    gerarPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contratoTipo]);

  if (!contratoTipo) {
    return (
      <section>
        <p>Escolha um contrato para ver a pré-visualização.</p>
        <button className="btn" onClick={() => navigate('/selecionar')}>
          Voltar
        </button>
      </section>
    );
  }

  const exportar = async () => {
    const payload = { tipo: contratoTipo, parte1, parte2, parametros, clausulasAtivas };
    await api.exportPdf(payload);
    await api.post('/contratos/historico', { tipo: contratoTipo, visitante: true });
  };

  return (
    <section className="preview">
      <div className="preview__text" aria-live="polite">
        <h2>Passo 4 – Pré-visualização</h2>
        <pre>{previewTexto}</pre>
      </div>
      <div className="preview__actions">
        <button className="btn" onClick={() => navigate('/clausulas')}>
          Ajustar cláusulas
        </button>
        <button className="btn btn--primary" onClick={exportar}>
          Baixar PDF
        </button>
      </div>
    </section>
  );
}
