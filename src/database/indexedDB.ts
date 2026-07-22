import { openDB, IDBPDatabase } from "idb";

export const DB_NAME = "escola_da_fe_offline_db";
export const DB_VERSION = 3;

export const STORES = {
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
  suporte: "suporte",
  favoritos: "favoritos",
  historico: "historico",
  anotacoes: "anotacoes",
  users: "users",
  cache_conteudo: "cache_conteudo",
  pending_sync: "pending_sync",
} as const;

export type StoreName = typeof STORES[keyof typeof STORES];

export interface PendingSyncItem {
  id: string;
  table: string;
  operation: "INSERT" | "UPDATE" | "DELETE";
  payload: any;
  timestamp: number;
  status: "pending" | "syncing" | "error";
  attempts: number;
  lastError?: string;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

/**
 * Opens or initializes the IndexedDB database
 */
export async function abrirBanco(): Promise<IDBPDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      console.log(`[IndexedDB] Migração e atualização do banco: v${oldVersion} -> v${newVersion}`);

      // Create object stores if missing
      Object.values(STORES).forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          console.log(`[IndexedDB] Criando objectStore: ${storeName}`);
          
          if (storeName === STORES.dicionario) {
            db.createObjectStore(storeName, { keyPath: "termo" });
          } else if (storeName === STORES.configuracoes) {
            db.createObjectStore(storeName, { keyPath: "chave" });
          } else {
            db.createObjectStore(storeName, { keyPath: "id" });
          }
        }
      });

      // Indexes for pending_sync
      if (db.objectStoreNames.contains(STORES.pending_sync)) {
        const syncStore = transaction.objectStore(STORES.pending_sync);
        if (!syncStore.indexNames.contains("by_status")) {
          syncStore.createIndex("by_status", "status");
        }
        if (!syncStore.indexNames.contains("by_table")) {
          syncStore.createIndex("by_table", "table");
        }
        if (!syncStore.indexNames.contains("by_timestamp")) {
          syncStore.createIndex("by_timestamp", "timestamp");
        }
      }
    },
    blocked() {
      console.warn("[IndexedDB] Abertura do banco bloqueada por outra aba aberta.");
    },
    blocking() {
      console.warn("[IndexedDB] Conexão bloqueando outra atualização. Fechando banco...");
      fecharBanco();
    },
    terminated() {
      console.error("[IndexedDB] Conexão terminada inesperadamente.");
      dbPromise = null;
    }
  });

  return dbPromise;
}

/**
 * Closes current DB connection
 */
export async function fecharBanco(): Promise<void> {
  if (dbPromise) {
    const db = await dbPromise;
    db.close();
    dbPromise = null;
    console.log("[IndexedDB] Conexão com banco fechada.");
  }
}

/**
 * Helper to get proper key field per store
 */
export function getKeyField(storeName: string): string {
  if (storeName === STORES.dicionario) return "termo";
  if (storeName === STORES.configuracoes) return "chave";
  return "id";
}

/**
 * Save an item in IndexedDB (Insert or Replace)
 */
export async function salvar<T = any>(storeName: StoreName, item: T): Promise<boolean> {
  try {
    const db = await abrirBanco();
    await db.put(storeName, item);
    return true;
  } catch (error) {
    console.error(`[IndexedDB] Erro ao salvar em [${storeName}]:`, error, item);
    return false;
  }
}

/**
 * Update an existing item in IndexedDB
 */
export async function atualizar<T = any>(storeName: StoreName, item: T): Promise<boolean> {
  try {
    const db = await abrirBanco();
    const keyField = getKeyField(storeName);
    const keyVal = (item as any)[keyField];

    if (!keyVal) {
      console.warn(`[IndexedDB] Item sem chave principal [${keyField}] ao atualizar em [${storeName}]`);
    }

    const existing = keyVal ? await db.get(storeName, keyVal) : null;
    const updated = existing ? { ...existing, ...item, _updatedLocally: Date.now() } : { ...(item as any), _updatedLocally: Date.now() };

    await db.put(storeName, updated);
    return true;
  } catch (error) {
    console.error(`[IndexedDB] Erro ao atualizar em [${storeName}]:`, error);
    return false;
  }
}

/**
 * Delete an item from IndexedDB by key/id
 */
export async function excluir(storeName: StoreName, id: string | number): Promise<boolean> {
  try {
    const db = await abrirBanco();
    await db.delete(storeName, id as any);
    return true;
  } catch (error) {
    console.error(`[IndexedDB] Erro ao excluir de [${storeName}] (id=${id}):`, error);
    return false;
  }
}

/**
 * List all items from a store
 */
export async function listar<T = any>(storeName: StoreName): Promise<T[]> {
  try {
    const db = await abrirBanco();
    const result = await db.getAll(storeName);
    return (result || []) as T[];
  } catch (error) {
    console.error(`[IndexedDB] Erro ao listar [${storeName}]:`, error);
    return [];
  }
}

/**
 * Find an item by ID / Key
 */
export async function buscarPorId<T = any>(storeName: StoreName, id: string | number): Promise<T | null> {
  try {
    const db = await abrirBanco();
    const result = await db.get(storeName, id as any);
    return (result || null) as T | null;
  } catch (error) {
    console.error(`[IndexedDB] Erro ao buscar por id [${storeName} -> ${id}]:`, error);
    return null;
  }
}

/**
 * Find items using an index
 */
export async function buscarPorIndice<T = any>(
  storeName: StoreName,
  indexName: string,
  key: IDBValidKey | IDBKeyRange
): Promise<T[]> {
  try {
    const db = await abrirBanco();
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    const result = await index.getAll(key);
    return (result || []) as T[];
  } catch (error) {
    console.error(`[IndexedDB] Erro ao buscar por índice [${storeName}.${indexName}]:`, error);
    return [];
  }
}

/**
 * Count total items in a store
 */
export async function contar(storeName: StoreName): Promise<number> {
  try {
    const db = await abrirBanco();
    return await db.count(storeName);
  } catch (error) {
    console.error(`[IndexedDB] Erro ao contar registros [${storeName}]:`, error);
    return 0;
  }
}

/**
 * Clear all items from a store
 */
export async function limpar(storeName: StoreName): Promise<boolean> {
  try {
    const db = await abrirBanco();
    await db.clear(storeName);
    console.log(`[IndexedDB] Store [${storeName}] limpa com sucesso.`);
    return true;
  } catch (error) {
    console.error(`[IndexedDB] Erro ao limpar store [${storeName}]:`, error);
    return false;
  }
}

/**
 * Check if a specific record exists in store
 */
export async function verificarExistencia(storeName: StoreName, id: string | number): Promise<boolean> {
  try {
    const db = await abrirBanco();
    const val = await db.get(storeName, id as any);
    return val !== undefined && val !== null;
  } catch (error) {
    console.error(`[IndexedDB] Erro ao verificar existência [${storeName} -> ${id}]:`, error);
    return false;
  }
}

/**
 * Create object stores dynamically if needed
 */
export async function criarObjectStores(storeNames: string[]): Promise<boolean> {
  try {
    const db = await abrirBanco();
    const missing = storeNames.filter((s) => !db.objectStoreNames.contains(s));
    if (missing.length === 0) return true;

    console.log("[IndexedDB] Novas stores solicitadas:", missing);
    await fecharBanco();
    
    // Increment version to trigger upgrade
    const newVer = DB_VERSION + 1;
    await openDB(DB_NAME, newVer, {
      upgrade(newDb) {
        missing.forEach((s) => {
          if (!newDb.objectStoreNames.contains(s)) {
            const keyPath = getKeyField(s);
            newDb.createObjectStore(s, { keyPath });
          }
        });
      }
    });

    return true;
  } catch (error) {
    console.error("[IndexedDB] Erro ao criar objectStores dinamicamente:", error);
    return false;
  }
}
