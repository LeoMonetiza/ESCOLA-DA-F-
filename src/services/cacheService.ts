/**
 * CACHE SERVICE
 * Manages automatic data caching in IndexedDB for offline access.
 */

import {
  STORES,
  StoreName,
  salvar,
  listar,
  buscarPorId,
  excluir,
  limpar,
  contar,
  getKeyField
} from "../database/indexedDB";

export interface CacheOptions {
  ttlMs?: number; // Time to live in milliseconds
  forceRefresh?: boolean;
}

class CacheService {
  /**
   * Caches an array of records into IndexedDB for a given store/table.
   */
  public async cacheTable<T = any>(storeName: string, items: T[]): Promise<boolean> {
    if (!Array.isArray(items)) {
      console.warn(`[CacheService] Dados inválidos passados para cacheTable [${storeName}]:`, items);
      return false;
    }

    try {
      const storeKey = (STORES as any)[storeName] || storeName;
      const keyField = getKeyField(storeKey);

      for (const item of items) {
        if (!item || typeof item !== "object") continue;

        // Ensure key exists
        const keyVal = (item as any)[keyField] || (item as any).id || (item as any).termo || (item as any).chave;
        if (!keyVal) continue;

        const recordToSave = {
          ...item,
          [keyField]: keyVal,
          _cachedAt: Date.now()
        };

        await salvar(storeKey as StoreName, recordToSave);
      }

      console.log(`[CacheService] Cache atualizado para [${storeName}]: ${items.length} registros gravados no IndexedDB.`);
      return true;
    } catch (error) {
      console.error(`[CacheService] Erro ao salvar cache para [${storeName}]:`, error);
      return false;
    }
  }

  /**
   * Retrieves all cached records from IndexedDB for a store.
   */
  public async getCachedTable<T = any>(storeName: string): Promise<T[]> {
    try {
      const storeKey = (STORES as any)[storeName] || storeName;
      const items = await listar<T>(storeKey as StoreName);
      return items || [];
    } catch (error) {
      console.error(`[CacheService] Erro ao ler cache para [${storeName}]:`, error);
      return [];
    }
  }

  /**
   * Caches a single item in IndexedDB.
   */
  public async cacheItem<T = any>(storeName: string, item: T): Promise<boolean> {
    if (!item) return false;
    try {
      const storeKey = (STORES as any)[storeName] || storeName;
      const keyField = getKeyField(storeKey);
      const keyVal = (item as any)[keyField] || (item as any).id || (item as any).termo || (item as any).chave;

      if (!keyVal) {
        console.warn(`[CacheService] Item sem chave válida para cacheItem [${storeName}]`, item);
        return false;
      }

      const recordToSave = {
        ...item,
        [keyField]: keyVal,
        _cachedAt: Date.now()
      };

      return await salvar(storeKey as StoreName, recordToSave);
    } catch (error) {
      console.error(`[CacheService] Erro ao salvar item no cache [${storeName}]:`, error);
      return false;
    }
  }

  /**
   * Retrieves a single item from IndexedDB cache.
   */
  public async getCachedItem<T = any>(storeName: string, id: string | number): Promise<T | null> {
    try {
      const storeKey = (STORES as any)[storeName] || storeName;
      return await buscarPorId<T>(storeKey as StoreName, id);
    } catch (error) {
      console.error(`[CacheService] Erro ao carregar item [${storeName} -> ${id}]:`, error);
      return null;
    }
  }

  /**
   * Removes a single item from IndexedDB cache.
   */
  public async removeCachedItem(storeName: string, id: string | number): Promise<boolean> {
    try {
      const storeKey = (STORES as any)[storeName] || storeName;
      return await excluir(storeKey as StoreName, id);
    } catch (error) {
      console.error(`[CacheService] Erro ao remover item do cache [${storeName} -> ${id}]:`, error);
      return false;
    }
  }

  /**
   * Clears entire cache for a store.
   */
  public async clearCache(storeName: string): Promise<boolean> {
    try {
      const storeKey = (STORES as any)[storeName] || storeName;
      return await limpar(storeKey as StoreName);
    } catch (error) {
      console.error(`[CacheService] Erro ao limpar cache de [${storeName}]:`, error);
      return false;
    }
  }

  /**
   * Gets stats on cached records count across stores.
   */
  public async getCacheStats(): Promise<Record<string, number>> {
    const stats: Record<string, number> = {};
    for (const [key, storeName] of Object.entries(STORES)) {
      stats[key] = await contar(storeName as StoreName);
    }
    return stats;
  }
}

export const cacheService = new CacheService();
export default cacheService;
