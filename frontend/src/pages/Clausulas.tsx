import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClauseCard } from '../components/ClauseCard';
import { useContract } from '../context/ContractContext';

export default function Clausulas() {
  const navigate = useNavigate();
  const { modeloSelecionado, contratoTipo, carregarModelo, toggleClausula, clausulasAtivas, atualizarParametro, parametros } =
    useContract();

  useEffect(() => {
    if (contratoTipo && !modeloSelecionado) {
      carregarModelo(contratoTipo);
    }
  }, [carregarModelo, contratoTipo, modeloSelecionado]);

  if (!contratoTipo) {
    return (
      <section>
        <p>Selecione um tipo de contrato para visualizar as cláusulas.</p>
        <button className="btn" onClick={() => navigate('/selecionar')}>
          Voltar
        </button>
      </section>
    );
  }

  return (
    <section>
      <h2>Passo 3 – Personalize as cláusulas</h2>
      <p>Ative ou desative itens opcionais e preencha os campos para ajustar o texto.</p>
      <div className="cards-grid">
        {modeloSelecionado?.clausulas.map((clausula) => (
          <ClauseCard
            key={clausula.id}
            clausula={clausula}
            ativo={clausulasAtivas.includes(clausula.id)}
            parametros={parametros}
            onToggle={() => toggleClausula(clausula.id)}
            onParametroChange={(campo, valor) => atualizarParametro(campo, valor)}
          />
        ))}
      </div>
      <div className="actions">
        <button className="btn" onClick={() => navigate('/preview')}>
          Avançar para pré-visualização
        </button>
      </div>
    </section>
  );
}
