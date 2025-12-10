import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContract } from '../context/ContractContext';
import { api } from '../services/api';
import '../styles/cards.css';

interface TipoContratoItem {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string;
}

export default function TipoContrato() {
  const navigate = useNavigate();
  const { setContratoTipo } = useContract();
  const [tipos, setTipos] = useState<TipoContratoItem[]>([]);

  useEffect(() => {
    api.get<{ tipos: TipoContratoItem[] }>('/contratos/tipos').then((res) => setTipos(res.tipos));
  }, []);

  return (
    <section>
      <h2>Passo 1 – Escolha o tipo de contrato</h2>
      <div className="cards-grid">
        {tipos.map((tipo) => (
          <button
            key={tipo.id}
            className="card"
            onClick={() => {
              setContratoTipo(tipo.tipo);
              navigate('/partes');
            }}
          >
            <h3>{tipo.titulo}</h3>
            <p>{tipo.descricao}</p>
            <span className="card__tag">{tipo.tipo}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
