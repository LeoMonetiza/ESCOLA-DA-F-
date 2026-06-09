/**
 * INDEXTEDDB PERSISTENCE LAYER & STORAGE ENGINE
 * "Escola da Fé" — Rearchitected storage system to solve quota exceeded errors.
 */

const DB_NAME = "escola_da_fe_db";
const DB_VERSION = 2; // Incremented for automatic migrations

export const OBJECT_STORES = {
  livros: "livros",
  estudos: "estudos",
  categorias: "categorias",
  favoritos: "favoritos",
  historico: "historico",
  anotacoes: "anotacoes",
  configuracoes: "configuracoes",
  cache_conteudo: "cache_conteudo",
};

/**
 * Open or upgrade the IndexedDB database
 */
export function initDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB não é suportado pelo seu navegador atual."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("[IndexedDB] Erro de abertura do banco:", request.error);
      reject(request.error || new Error("Erro desconhecido ao abrir o banco de dados."));
    };

    request.onsuccess = (event) => {
      const db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      console.log(`[IndexedDB] Upgrading schema: version ${event.oldVersion} -> ${event.newVersion}`);

      // Create all required stores defined in the requirements
      Object.values(OBJECT_STORES).forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          console.log(`[IndexedDB] Criando repositório de dados: ${storeName}`);
          db.createObjectStore(storeName, { keyPath: "id" });
        }
      });
    };
  });
}

/**
 * Retrieve an item from a specific store
 */
export async function dbGet<T = any>(storeName: string, id: string): Promise<T | null> {
  try {
    const db = await initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result ? (request.result.data ?? request.result) : null);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error(`[IndexedDB] Falha de leitura [${storeName} -> ${id}]:`, error);
    return null;
  }
}

/**
 * Save / Upsert an item in a specific store
 */
export async function dbPut(storeName: string, id: string, data: any): Promise<boolean> {
  try {
    const db = await initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      
      // Store under keyPath "id", wrap the payload to permit arbitrary formats
      const request = store.put({ id, data, updatedAt: Date.now() });

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error(`[IndexedDB] Falha de gravação [${storeName} -> ${id}]:`, error);
    return false;
  }
}

/**
 * Remove an item from a specific store
 */
export async function dbDelete(storeName: string, id: string): Promise<boolean> {
  try {
    const db = await initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error(`[IndexedDB] Falha de deleção [${storeName} -> ${id}]:`, error);
    return false;
  }
}

/**
 * Clear a specific store
 */
export async function dbClear(storeName: string): Promise<boolean> {
  try {
    const db = await initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error(`[IndexedDB] Falha ao limpar repositório [${storeName}]:`, error);
    return false;
  }
}

/**
 * Safe local storage write helper
 * Filters values to prevent localStorage quota overflow.
 * Only lightweight preferences can be written here.
 */
export function safeStorageWrite(key: string, value: string): boolean {
  const allowedKeys = [
    "theme",
    "idioma",
    "admin_logged",
    "escola_da_fe_device_id",
    "escola_da_fe_user_name",
    "escola_da_fe_tabs_config",
    "escola_da_fe_downloads",
    "completed_studies",
    "escola_da_fe_socials",
    "escola_da_fe_support_details",
    "escola_da_fe_privacy",
    "escola_da_fe_terms",
    "escola_da_fe_deleted_ids",
  ];

  if (!allowedKeys.includes(key)) {
    console.warn(`[SafeStorage] Chave não autorizada interceptada no LocalStorage: "${key}". Os dados serão tratados em IndexedDB.`);
    return false;
  }

  // Size limit of 15KB per item in LocalStorage to safeguard quota
  if (value && value.length > 15000) {
    console.warn(`[SafeStorage] Payloads volumosos bloqueados para LocalStorage na chave: "${key}" (${value.length} caracteres).`);
    return false;
  }

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`[SafeStorage] Erro ao gravar no LocalStorage para "${key}". Espaço insuficiente no navegador.`, error);
    return false;
  }
}

/**
 * Clears expired browser cache storage and old IndexedDB cache entries
 */
export async function clearExpiredCache(): Promise<boolean> {
  console.log("[CacheController] Iniciando faxina e controle de cache...");
  let clearedCount = 0;

  // 1. Clean old static assets caches in Browser Cache API
  try {
    if (window.caches) {
      const cacheKeys = await caches.keys();
      const activeVersion = "escola-da-fe-v6.0.0"; // Matches sw.js
      
      for (const cacheKey of cacheKeys) {
        if (!cacheKey.includes(activeVersion)) {
          console.log(`[CacheController] Removendo cache obsoleto: ${cacheKey}`);
          await caches.delete(cacheKey);
          clearedCount++;
        }
      }
    }
  } catch (e) {
    console.warn("[CacheController] Erro ao remover caches antigos do navegador:", e);
  }

  // 2. Clear old temporary cache_conteudo from IndexedDB
  try {
    const db = await initDb();
    const transaction = db.transaction(OBJECT_STORES.cache_conteudo, "readwrite");
    const store = transaction.objectStore(OBJECT_STORES.cache_conteudo);
    
    // Iterate over elements and prune older than 7 days
    const request = store.openCursor();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    request.onsuccess = (event: any) => {
      const cursor = event.target.result;
      if (cursor) {
        const record = cursor.value;
        if (record.updatedAt && record.updatedAt < sevenDaysAgo) {
          console.log(`[CacheController] Pruning expired cache entry: ${record.id}`);
          cursor.delete();
          clearedCount++;
        }
        cursor.continue();
      }
    };
  } catch (e) {
    console.warn("[CacheController] Erro ao purgar cache_conteudo do indexedDB:", e);
  }

  console.log(`[CacheController] Limpeza concluída. ${clearedCount} volumes obsoletos limpos.`);
  return true;
}

/**
 * System self-recovery: rebuilds, fixes corrupt store states
 */
export async function recoverApplicationState(): Promise<boolean> {
  console.warn("[SelfRecovery] Iniciando sistema de auto-recuperação do Escola da Fé...");
  try {
    // 1. Attempt to force-recreate IndexedDB stores
    const db = await initDb();
    
    // Prune entries that might cause JSON parse cracks
    for (const storeName of Object.values(OBJECT_STORES)) {
      try {
        const transaction = db.transaction(storeName, "readonly");
        transaction.onerror = () => {
          console.warn(`[SelfRecovery] Store ${storeName} presents connection errors. Clearing it completely to reconstruct.`);
          dbClear(storeName);
        };
      } catch (err) {
        // Fallback clear
        await dbClear(storeName);
      }
    }

    // 2. Perform expired cache sweep to release resources
    await clearExpiredCache();

    // 3. Keep vital small configs safe in localStorage
    const savedName = localStorage.getItem("escola_da_fe_user_name");
    const savedDeviceId = localStorage.getItem("escola_da_fe_device_id");
    const savedTheme = localStorage.getItem("theme");
    
    localStorage.clear();

    if (savedName) localStorage.setItem("escola_da_fe_user_name", savedName);
    if (savedDeviceId) localStorage.setItem("escola_da_fe_device_id", savedDeviceId);
    if (savedTheme) localStorage.setItem("theme", savedTheme);

    console.log("[SelfRecovery] Auto-recuperação efetuada com absoluto sucesso!");
    return true;
  } catch (error) {
    console.error("[SelfRecovery] Erro crítico catastrófico na auto-recuperação:", error);
    return false;
  }
}

/**
 * Storage diagnostics utility for telemetry dashboard
 */
export async function storageDiagnostics() {
  const result = {
    localStorageUsageChars: 0,
    localStorageUsageApproxBytes: 0,
    localStorageEntries: [] as { key: string; length: number }[],
    indexedDbStatus: "Iniciando",
    indexedDbObjects: {} as Record<string, number>,
    cacheStorageStatus: "Inoperante",
    cacheStorageNames: [] as string[],
    spaceQuotaBytes: 0,
    spaceUsageBytes: 0,
    spacePercentageUsed: 0,
    diagnosticLogs: [] as string[],
  };

  // 1. Evaluate LocalStorage
  try {
    let rawLength = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const val = localStorage.getItem(key) || "";
        const len = val.length;
        rawLength += key.length + len;
        result.localStorageEntries.push({ key, length: len });
      }
    }
    result.localStorageUsageChars = rawLength;
    result.localStorageUsageApproxBytes = rawLength * 2; // UTF-16 representation
  } catch (e: any) {
    result.diagnosticLogs.push(`Falha ao auditar LocalStorage: ${e.message}`);
  }

  // 2. Evaluate IndexedDB
  try {
    const db = await initDb();
    result.indexedDbStatus = `Conectado com sucesso (v${db.version})`;
    
    // Count objects in each store dynamically
    for (const storeName of Object.values(OBJECT_STORES)) {
      try {
        const count = await new Promise<number>((resolve, reject) => {
          const transaction = db.transaction(storeName, "readonly");
          const store = transaction.objectStore(storeName);
          const countRequest = store.count();
          countRequest.onsuccess = () => resolve(countRequest.result);
          countRequest.onerror = () => reject(countRequest.error);
        });
        result.indexedDbObjects[storeName] = count;
      } catch (err: any) {
        result.indexedDbObjects[storeName] = 0;
        result.diagnosticLogs.push(`Falha ao contar store "${storeName}": ${err.message}`);
      }
    }
  } catch (e: any) {
    result.indexedDbStatus = `Falha na conexão: ${e.message}`;
    result.diagnosticLogs.push(`Falha geral ao abrir IndexedDB: ${e.message}`);
  }

  // 3. Evaluate Cache Storage
  try {
    if (window.caches) {
      const cacheKeys = await caches.keys();
      result.cacheStorageNames = cacheKeys;
      result.cacheStorageStatus = `Ativo. Total de coleções: ${cacheKeys.length}`;
    } else {
      result.cacheStorageStatus = "Indisponível no navegador";
    }
  } catch (e: any) {
    result.cacheStorageStatus = `Erro de diagnóstico: ${e.message}`;
  }

  // 4. Estimate overall browser storage quota
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      result.spaceQuotaBytes = estimate.quota || 0;
      result.spaceUsageBytes = estimate.usage || 0;
      if (estimate.quota && estimate.quota > 0) {
        result.spacePercentageUsed = parseFloat(((estimate.usage || 0) / estimate.quota * 100).toFixed(4));
      }
    }
  } catch (e: any) {
    result.diagnosticLogs.push(`Falha ao estimar quota do sistema de arquivos: ${e.message}`);
  }

  return result;
}

// Bind self-recovery globally for admin triggers
if (typeof window !== "undefined") {
  (window as any).recoverApplicationState = recoverApplicationState;
  (window as any).storageDiagnostics = storageDiagnostics;
}
