import { Router } from 'express';
import { buscarModeloPorTipo, gerarPdfStream, gerarTextoContrato, listarTiposDisponiveis, montarPreview } from '../services/contractService';
import { saveHistorico } from '../services/dataStore';
import { DadosContratoEntrada } from '../types';

const router = Router();

router.get('/tipos', (_req, res) => {
  return res.json({ tipos: listarTiposDisponiveis() });
});

router.get('/modelos/:tipo', (req, res) => {
  const modelo = buscarModeloPorTipo(req.params.tipo);
  if (!modelo) {
    return res.status(404).json({ mensagem: 'Modelo não encontrado' });
  }
  return res.json({ modelo });
});

router.post('/preview', (req, res) => {
  try {
    const entrada = req.body as DadosContratoEntrada;
    const doc = montarPreview(entrada);
    const texto = gerarTextoContrato(doc);
    return res.json({ documento: doc, texto });
  } catch (error) {
    return res.status(400).json({ mensagem: (error as Error).message });
  }
});

router.post('/exportar-pdf', (req, res) => {
  try {
    const entrada = req.body as DadosContratoEntrada;
    const doc = montarPreview(entrada);
    const texto = gerarTextoContrato(doc);
    const pdf = gerarPdfStream(texto);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="contrato.pdf"');
    pdf.pipe(res);
  } catch (error) {
    res.status(400).json({ mensagem: (error as Error).message });
  }
});

router.post('/historico', (req, res) => {
  const entrada = req.body as { tipo: string; visitante?: boolean };
  const registro = {
    tipo: entrada.tipo,
    dataHora: new Date().toISOString(),
    visitante: entrada.visitante ?? true
  };
  saveHistorico(registro);
  return res.status(201).json({ registro });
});

export default router;
