import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { ContratoModelo, DadosContratoEntrada, Parte } from '../types';
import { api } from '../services/api';

type ContractState = {
  contratoTipo: string | null;
  modeloSelecionado: ContratoModelo | null;
  parte1: Parte;
  parte2: Parte;
  parametros: Record<string, string>;
  clausulasAtivas: string[];
  previewTexto: string;
  setContratoTipo: (tipo: string) => void;
  atualizarParte: (id: 'parte1' | 'parte2', dados: Partial<Parte>) => void;
  atualizarParametro: (chave: string, valor: string) => void;
  toggleClausula: (id: string) => void;
  carregarModelo: (tipo: string) => Promise<void>;
  gerarPreview: () => Promise<void>;
};

const ContractContext = createContext<ContractState | undefined>(undefined);

const parteInicial: Parte = { nome: '', documento: '', endereco: '', email: '', telefone: '' };

export function ContractProvider({ children }: { children: React.ReactNode }) {
  const [contratoTipo, setContratoTipoState] = useState<string | null>(null);
  const [modeloSelecionado, setModeloSelecionado] = useState<ContratoModelo | null>(null);
  const [parte1, setParte1] = useState<Parte>(parteInicial);
  const [parte2, setParte2] = useState<Parte>(parteInicial);
  const [parametros, setParametros] = useState<Record<string, string>>({ foro: 'Comarca local' });
  const [clausulasAtivas, setClausulasAtivas] = useState<string[]>([]);
  const [previewTexto, setPreviewTexto] = useState('Preencha os dados para pré-visualizar o contrato.');

  const carregarModelo = useCallback(async (tipo: string) => {
    const response = await api.get<{ modelo: ContratoModelo }>(`/contratos/modelos/${tipo}`);
    const modelo = response.modelo as ContratoModelo;
    setModeloSelecionado(modelo);
    setClausulasAtivas(modelo.clausulas.map((c) => c.id));
  }, []);

  const gerarPreview = useCallback(async () => {
    if (!contratoTipo || !modeloSelecionado) return;
    const payload: DadosContratoEntrada = {
      tipo: contratoTipo,
      parte1,
      parte2,
      parametros,
      clausulasAtivas
    };
    const resposta = await api.post<{ texto: string }>('/contratos/preview', payload);
    setPreviewTexto(resposta.texto ?? '');
  }, [clausulasAtivas, contratoTipo, modeloSelecionado, parametros, parte1, parte2]);

  const setContratoTipo = useCallback((tipo: string) => {
    setContratoTipoState(tipo);
    setModeloSelecionado(null);
  }, []);

  const atualizarParte = useCallback((id: 'parte1' | 'parte2', dados: Partial<Parte>) => {
    if (id === 'parte1') setParte1((prev) => ({ ...prev, ...dados }));
    if (id === 'parte2') setParte2((prev) => ({ ...prev, ...dados }));
  }, []);

  const atualizarParametro = useCallback((chave: string, valor: string) => {
    setParametros((prev) => ({ ...prev, [chave]: valor }));
  }, []);

  const toggleClausula = useCallback((id: string) => {
    setClausulasAtivas((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }, []);

  useEffect(() => {
    if (contratoTipo && !modeloSelecionado) {
      carregarModelo(contratoTipo);
    }
  }, [carregarModelo, contratoTipo, modeloSelecionado]);

  useEffect(() => {
    if (!modeloSelecionado || !contratoTipo) return;
    gerarPreview();
  }, [clausulasAtivas, contratoTipo, gerarPreview, modeloSelecionado, parametros, parte1, parte2]);

  const value = useMemo(
    () => ({
      contratoTipo,
      modeloSelecionado,
      parte1,
      parte2,
      parametros,
      clausulasAtivas,
      previewTexto,
      setContratoTipo,
      atualizarParte,
      atualizarParametro,
      toggleClausula,
      carregarModelo,
      gerarPreview
    }),
    [clausulasAtivas, contratoTipo, modeloSelecionado, parametros, parte1, parte2, previewTexto, setContratoTipo, atualizarParte, atualizarParametro, toggleClausula, carregarModelo, gerarPreview]
  );

  return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>;
}

export function useContract() {
  const ctx = useContext(ContractContext);
  if (!ctx) {
    throw new Error('useContract deve ser usado dentro de ContractProvider');
  }
  return ctx;
}
