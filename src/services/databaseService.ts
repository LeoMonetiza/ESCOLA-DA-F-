/**
 * DATABASE SERVICE
 * High-level data service that abstracts IndexedDB and Supabase/Express communication.
 * Components use this service to achieve full offline-first functionality.
 */

import { STORES, StoreName } from "../database/indexedDB";
import { cacheService } from "./cacheService";
import { syncService } from "./syncService";
import { networkService } from "./networkService";
import { performResilientDbWrite } from "../lib/supabaseClient";

class DatabaseService {
  /**
   * Load data for a table using Offline-First strategy:
   * 1. Returns IndexedDB cached data immediately if offline or available.
   * 2. If online, fetches fresh data from server and refreshes IndexedDB cache automatically.
   */
  public async loadAll<T = any>(tableName: string): Promise<T[]> {
    const isOnline = networkService.isOnline();
    const cachedData = await cacheService.getCachedTable<T>(tableName);

    // If offline, return local cache immediately
    if (!isOnline) {
      console.log(`[DatabaseService] Dispositivo offline. Retornando ${cachedData.length} itens do cache IndexedDB para [${tableName}].`);
      return cachedData;
    }

    // If online, fetch from backend and update IndexedDB cache
    try {
      const response = await fetch("/api/db/load");
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          const remoteList = json.data[tableName] || json.data[this.mapStoreToRemoteKey(tableName)] || [];
          if (Array.isArray(remoteList) && remoteList.length > 0) {
            // Update cache in background
            cacheService.cacheTable(tableName, remoteList);
            return remoteList;
          }
        }
      }
    } catch (err) {
      console.warn(`[DatabaseService] Falha na busca remota de [${tableName}]. Usando cache IndexedDB local:`, err);
    }

    return cachedData;
  }

  /**
   * Load an individual item by key
   */
  public async getItem<T = any>(tableName: string, id: string | number): Promise<T | null> {
    const cached = await cacheService.getCachedItem<T>(tableName, id);
    if (cached) return cached;

    // If missing from cache and online, attempt full load
    if (networkService.isOnline()) {
      const all = await this.loadAll<T>(tableName);
      const keyField = tableName === "dicionario" ? "termo" : tableName === "configuracoes" ? "chave" : "id";
      return all.find((it: any) => String(it[keyField] || it.id) === String(id)) || null;
    }

    return null;
  }

  /**
   * Insert item with Offline-First pipeline
   */
  public async addItem<T = any>(tableName: string, payload: T): Promise<{ success: boolean; localOnly?: boolean; data?: any }> {
    // 1. Save locally in IndexedDB first
    await cacheService.cacheItem(tableName, payload);

    const isOnline = networkService.isOnline();

    if (isOnline) {
      try {
        const res = await performResilientDbWrite(tableName, "POST", payload);
        if (res && res.success) {
          return { success: true, data: res.data || payload };
        }
      } catch (err) {
        console.warn(`[DatabaseService] Falha na gravação remota de [${tableName}]. Enfileirando sincronização offline:`, err);
      }
    }

    // 2. Offline fallback: Queue for sync
    await syncService.queueOperation(tableName, "INSERT", payload);
    return { success: true, localOnly: true, data: payload };
  }

  /**
   * Update item with Offline-First pipeline
   */
  public async updateItem<T = any>(tableName: string, payload: T): Promise<{ success: boolean; localOnly?: boolean; data?: any }> {
    // 1. Update locally in IndexedDB first
    await cacheService.cacheItem(tableName, payload);

    const isOnline = networkService.isOnline();

    if (isOnline) {
      try {
        const res = await performResilientDbWrite(tableName, "POST", payload);
        if (res && res.success) {
          return { success: true, data: res.data || payload };
        }
      } catch (err) {
        console.warn(`[DatabaseService] Falha ao atualizar remoto em [${tableName}]. Enfileirando sincronização:`, err);
      }
    }

    // 2. Offline fallback: Queue for sync
    await syncService.queueOperation(tableName, "UPDATE", payload);
    return { success: true, localOnly: true, data: payload };
  }

  /**
   * Delete item with Offline-First pipeline
   */
  public async deleteItem(tableName: string, id: string | number): Promise<{ success: boolean; localOnly?: boolean }> {
    // 1. Remove from local IndexedDB first
    await cacheService.removeCachedItem(tableName, id);

    const isOnline = networkService.isOnline();

    if (isOnline) {
      try {
        const res = await performResilientDbWrite(tableName, "DELETE", { id }, id);
        if (res && res.success) {
          return { success: true };
        }
      } catch (err) {
        console.warn(`[DatabaseService] Falha na remoção remota de [${tableName}]. Enfileirando sincronização:`, err);
      }
    }

    // 2. Offline fallback: Queue deletion for sync
    await syncService.queueOperation(tableName, "DELETE", { id });
    return { success: true, localOnly: true };
  }

  private mapStoreToRemoteKey(store: string): string {
    const map: Record<string, string> = {
      estudos: "estudos",
      dicionario: "dicionario",
      historias: "historias",
      teologia: "teologia",
      curso: "curso",
      postagens: "postagens",
      configuracoes: "configuracoes",
      posts: "posts",
      comments: "comments",
      reactions: "reactions",
      ads: "ads",
      homens: "homens",
      dispositivos: "dispositivos",
      livros: "livros",
      suporte: "suporte"
    };
    return map[store] || store;
  }
}

export const databaseService = new DatabaseService();
export default databaseService;
