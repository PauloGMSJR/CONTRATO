import { useState } from 'react';
import { Clausula } from '../types';
import '../styles/clause-card.css';

interface Props {
  clausula: Clausula;
  ativo: boolean;
  onToggle: () => void;
  onParametroChange: (campo: string, valor: string) => void;
  parametros: Record<string, string>;
}

export function ClauseCard({ clausula, ativo, onToggle, onParametroChange, parametros }: Props) {
  const [mostrarAjuda, setMostrarAjuda] = useState(false);

  return (
    <div className={`clause-card ${ativo ? 'clause-card--ativo' : ''}`}>
      <div className="clause-card__header">
        <div>
          <label className="clause-card__titulo">
            <input
              type="checkbox"
              checked={ativo}
              onChange={onToggle}
              aria-label={`Ativar ou desativar cláusula ${clausula.titulo}`}
            />
            {clausula.titulo}
          </label>
          <span className="clause-card__tipo">{clausula.tipo === 'obrigatoria' ? 'Obrigatória' : 'Opcional'}</span>
        </div>
        <button className="clause-card__help" onClick={() => setMostrarAjuda(!mostrarAjuda)} aria-label="Ver explicação">
          ?
        </button>
      </div>
      {mostrarAjuda && (
        <p className="clause-card__explicacao">
          Esta cláusula explica, em linguagem simples, por que este ponto é importante. Ajuste os campos abaixo para
          personalizar o texto.
        </p>
      )}
      <p className="clause-card__texto">{clausula.textoBase}</p>
      {clausula.parametros.length > 0 && (
        <div className="clause-card__parametros">
          {clausula.parametros.map((p) => (
            <label key={p} className="clause-card__campo">
              {p}
              <input
                type="text"
                value={parametros[p] ?? ''}
                placeholder={`Defina ${p}`}
                onChange={(e) => onParametroChange(p, e.target.value)}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
