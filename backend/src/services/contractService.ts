import { v4 as uuid } from 'uuid';
import PDFDocument from 'pdfkit';
import { ContratoModelo, DadosContratoEntrada, DocumentoGerado } from '../types';
import { modelosCache } from './dataStore';

function fillTemplate(textoBase: string, parametros: Record<string, string>): string {
  return textoBase.replace(/{{(.*?)}}/g, (_, key) => parametros[key.trim()] || '____');
}

function normalizeClausulas(entrada: DadosContratoEntrada, modelo: ContratoModelo): Array<{ clausulaId: string; texto: string }> {
  const ativos = new Set(entrada.clausulasAtivas ?? modelo.clausulas.map((c) => c.id));
  return modelo.clausulas
    .filter((c) => ativos.has(c.id) || c.tipo === 'obrigatoria')
    .map((clausula) => ({
      clausulaId: clausula.id,
      texto: `${clausula.titulo}: ${fillTemplate(clausula.textoBase, entrada.parametros)}`
    }));
}

export function montarPreview(entrada: DadosContratoEntrada): DocumentoGerado {
  const modelo = modelosCache.find((m) => m.tipo === entrada.tipo);
  if (!modelo) {
    throw new Error('Modelo não encontrado para o tipo solicitado');
  }

  const clausulasResolvidas = normalizeClausulas(entrada, modelo);
  return {
    id: uuid(),
    contratoModeloId: modelo.id,
    dadosPartes: { parte1: entrada.parte1, parte2: entrada.parte2 },
    clausulasResolvidas,
    dataHora: new Date().toISOString()
  };
}

export function gerarTextoContrato(doc: DocumentoGerado): string {
  const cabecalho = `Contrato: ${doc.contratoModeloId}\nData: ${new Date(doc.dataHora).toLocaleString()}\n`;
  const partes = `Parte 1: ${doc.dadosPartes.parte1.nome} (${doc.dadosPartes.parte1.documento})\nParte 2: ${doc.dadosPartes.parte2.nome} (${doc.dadosPartes.parte2.documento})\n`;
  const clausulasTexto = doc.clausulasResolvidas.map((c, idx) => `${idx + 1}. ${c.texto}`).join('\n\n');
  return [cabecalho, partes, clausulasTexto].join('\n');
}

export function gerarPdfStream(textoContrato: string): PDFKit.PDFDocument {
  const pdf = new PDFDocument({ margin: 50 });
  pdf.fontSize(14).text('Contratos Online - Gerador de Contratos', { align: 'center' });
  pdf.moveDown();
  pdf.fontSize(11).text(textoContrato, { align: 'left' });
  pdf.end();
  return pdf;
}

// Placeholder para geração de DOCX
// Uma implementação real usaria libraries como docx ou Pizzip + docxtemplater para
// montar um documento baseado em templates. A função abaixo ilustra o ponto de
// integração para futuras evoluções.
export function prepararDocxBuffer(_textoContrato: string): Buffer {
  const comentario = 'Geração de DOCX pode ser feita com docx/docxtemplater aqui.';
  return Buffer.from(comentario, 'utf-8');
}

export function listarTiposDisponiveis(): Array<Pick<ContratoModelo, 'id' | 'tipo' | 'titulo' | 'descricao'>> {
  return modelosCache.map(({ id, tipo, titulo, descricao }) => ({ id, tipo, titulo, descricao }));
}

export function buscarModeloPorTipo(tipo: string): ContratoModelo | undefined {
  return modelosCache.find((m) => m.tipo === tipo);
}
