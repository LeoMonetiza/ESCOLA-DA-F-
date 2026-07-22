import * as idbTS from './indexedDB.ts';

export const DB_NAME = idbTS.DB_NAME;
export const DB_VERSION = idbTS.DB_VERSION;
export const STORES = idbTS.STORES;

export const abrirBanco = idbTS.abrirBanco;
export const fecharBanco = idbTS.fecharBanco;
export const salvar = idbTS.salvar;
export const atualizar = idbTS.atualizar;
export const excluir = idbTS.excluir;
export const listar = idbTS.listar;
export const buscarPorId = idbTS.buscarPorId;
export const buscarPorIndice = idbTS.buscarPorIndice;
export const contar = idbTS.contar;
export const limpar = idbTS.limpar;
export const getKeyField = idbTS.getKeyField;
export const verificarExistencia = idbTS.verificarExistencia;
export const criarObjectStores = idbTS.criarObjectStores;
