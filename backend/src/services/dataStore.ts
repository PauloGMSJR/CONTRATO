import fs from 'fs';
import path from 'path';
import { ContratoModelo, HistoricoEntrada, Usuario } from '../types';

const dataDir = path.join(__dirname, '..', '..', 'data');
const modelosPath = path.join(dataDir, 'contratos_modelos.json');
const historicoPath = path.join(dataDir, 'historico.json');

function readJsonFile<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export const modelosCache: ContratoModelo[] = readJsonFile<ContratoModelo[]>(modelosPath);

export function saveHistorico(entry: HistoricoEntrada): void {
  const historico = readJsonFile<HistoricoEntrada[]>(historicoPath);
  historico.push(entry);
  writeJsonFile(historicoPath, historico);
}

export const usuarios: Usuario[] = [];
