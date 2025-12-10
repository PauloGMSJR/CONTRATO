export type ClausulaTipo = 'obrigatoria' | 'opcional';

export interface Clausula {
  id: string;
  titulo: string;
  textoBase: string;
  tipo: ClausulaTipo;
  parametros: string[];
}

export interface ContratoModelo {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string;
  clausulas: Clausula[];
}

export interface Parte {
  nome: string;
  documento: string;
  endereco: string;
  email: string;
  telefone: string;
}

export interface DadosContratoEntrada {
  tipo: string;
  parte1: Parte;
  parte2: Parte;
  parametros: Record<string, string>;
  clausulasAtivas: string[];
}
