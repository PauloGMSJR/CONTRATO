import { useNavigate } from 'react-router-dom';
import { useContract } from '../context/ContractContext';
import '../styles/form.css';

function ParteForm({ id }: { id: 'parte1' | 'parte2' }) {
  const { parte1, parte2, atualizarParte } = useContract();
  const parte = id === 'parte1' ? parte1 : parte2;

  return (
    <div className="form-grid" aria-label={`Dados da ${id === 'parte1' ? 'Parte 1' : 'Parte 2'}`}>
      <label>
        Nome completo
        <input
          value={parte.nome}
          onChange={(e) => atualizarParte(id, { nome: e.target.value })}
          placeholder="Digite o nome completo"
          required
        />
      </label>
      <label>
        CPF/CNPJ
        <input value={parte.documento} onChange={(e) => atualizarParte(id, { documento: e.target.value })} />
      </label>
      <label>
        Endereço
        <input value={parte.endereco} onChange={(e) => atualizarParte(id, { endereco: e.target.value })} />
      </label>
      <label>
        E-mail
        <input type="email" value={parte.email} onChange={(e) => atualizarParte(id, { email: e.target.value })} />
      </label>
      <label>
        Telefone
        <input value={parte.telefone} onChange={(e) => atualizarParte(id, { telefone: e.target.value })} />
      </label>
    </div>
  );
}

export default function DadosPartes() {
  const navigate = useNavigate();
  const { contratoTipo } = useContract();

  return (
    <section>
      <h2>Passo 2 – Dados das partes</h2>
      {!contratoTipo && <p>Escolha um tipo de contrato antes de preencher.</p>}
      <div className="card">
        <h3>Parte 1</h3>
        <ParteForm id="parte1" />
      </div>
      <div className="card">
        <h3>Parte 2</h3>
        <ParteForm id="parte2" />
      </div>
      <div className="actions">
        <button className="btn" onClick={() => navigate('/clausulas')}>
          Avançar para cláusulas
        </button>
      </div>
    </section>
  );
}
