export type ClausulaTipo = 'obrigatoria' | 'opcional';

export interface Clausula {
  id: string;
  titulo: string;
  textoBase: string;
  tipo: ClausulaTipo;
  parametros: string[];
}

export type ContratoTipo = 'locacao' | 'servico' | 'compra_venda' | 'parceria';

export interface ContratoModelo {
  id: string;
  tipo: ContratoTipo;
  titulo: string;
  descricao: string;
  clausulas: Clausula[];
}

export interface ExplicacaoClausula {
  id: string;
  clausulaId: string;
  textoExplicativo: string;
}

export interface Parte {
  nome: string;
  documento: string;
  endereco: string;
  email: string;
  telefone: string;
}

export interface DadosContratoEntrada {
  tipo: ContratoTipo;
  parte1: Parte;
  parte2: Parte;
  parametros: Record<string, string>;
  clausulasAtivas?: string[];
  visitante?: boolean;
}

export interface DocumentoGerado {
  id: string;
  usuarioId?: string;
  contratoModeloId: string;
  dadosPartes: { parte1: Parte; parte2: Parte };
  clausulasResolvidas: Array<{ clausulaId: string; texto: string }>;
  dataHora: string;
}

export interface HistoricoEntrada {
  tipo: ContratoTipo;
  dataHora: string;
  visitante: boolean;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senhaHash?: string;
}
