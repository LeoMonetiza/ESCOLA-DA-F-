/**
 * SYNC SERVICE
 * Responsible for queueing pending offline mutations (INSERT, UPDATE, DELETE)
 * and auto-synchronizing with Supabase and Express backend when online.
 */

import {
  STORES,
  salvar,
  listar,
  excluir,
  buscarPorId,
  PendingSyncItem
} from "../database/indexedDB";
import { networkService } from "./networkService";
import { performResilientDbWrite } from "../lib/supabaseClient";

type SyncCallback = (status: {
  isSyncing: boolean;
  pendingCount: number;
  lastSyncedAt: number | null;
  lastError: string | null;
}) => void;

class SyncService {
  private isSyncing: boolean = false;
  private lastSyncedAt: number | null = null;
  private lastError: string | null = null;
  private listeners: Set<SyncCallback> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      // Subscribe to network updates
      networkService.onNetworkChange((isOnline) => {
        if (isOnline) {
          console.log("[SyncService] Rede online restaurada! Iniciando sincronização automática de dados pendentes...");
          this.syncPendingData();
        }
      });
    }
  }

  /**
   * Queue a pending mutation for later sync
   */
  public async queueOperation(
    table: string,
    operation: "INSERT" | "UPDATE" | "DELETE",
    payload: any
  ): Promise<boolean> {
    try {
      const keyField = table === "dicionario" ? "termo" : table === "configuracoes" ? "chave" : "id";
      const recordId = payload[keyField] || payload.id || payload.termo || payload.chave || `temp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const syncId = `pending_${table}_${recordId}_${operation}`;

      const pendingItem: PendingSyncItem = {
        id: syncId,
        table,
        operation,
        payload,
        timestamp: Date.now(),
        status: "pending",
        attempts: 0
      };

      await salvar(STORES.pending_sync, pendingItem);
      console.log(`[SyncService] Operação [${operation}] em [${table}] enfileirada no IndexedDB para sincronização futura.`, syncId);

      this.notifyListeners();

      // If online right now, attempt immediate flush
      if (networkService.isOnline()) {
        this.syncPendingData();
      }

      return true;
    } catch (error) {
      console.error("[SyncService] Erro ao enfileirar operação de sincronização:", error);
      return false;
    }
  }

  /**
   * Process and flush all pending operations in the queue
   */
  public async syncPendingData(): Promise<boolean> {
    if (this.isSyncing) {
      console.log("[SyncService] Sincronização já em andamento. Aguarde término...");
      return false;
    }

    if (!networkService.isOnline()) {
      console.log("[SyncService] Não foi possível sincronizar: dispositivo está offline.");
      return false;
    }

    this.isSyncing = true;
    this.lastError = null;
    this.notifyListeners();

    try {
      const allPending = await listar<PendingSyncItem>(STORES.pending_sync);

      if (!allPending || allPending.length === 0) {
        console.log("[SyncService] Nenhuma alteração pendente para sincronizar.");
        this.isSyncing = false;
        this.lastSyncedAt = Date.now();
        this.notifyListeners();
        return true;
      }

      console.log(`[SyncService] Iniciando sincronização de ${allPending.length} itens pendentes...`);

      // Sort chronologically by timestamp to preserve execution order
      const sortedQueue = allPending.sort((a, b) => a.timestamp - b.timestamp);

      let successCount = 0;
      let failCount = 0;

      for (const item of sortedQueue) {
        try {
          // Update status to syncing
          item.status = "syncing";
          item.attempts += 1;
          await salvar(STORES.pending_sync, item);

          const method = item.operation === "DELETE" ? "DELETE" : "POST";
          const idValue = item.payload?.id || item.payload?.termo || item.payload?.chave;

          // Attempt write to backend / Supabase
          const result = await performResilientDbWrite(item.table, method, item.payload, idValue);

          if (result && (result.success || result.data)) {
            // Delete from pending sync queue on success
            await excluir(STORES.pending_sync, item.id);
            successCount++;
            console.log(`[SyncService] Item sincronizado com sucesso: [${item.table} -> ${item.operation}]`);
          } else {
            item.status = "error";
            item.lastError = "Resposta inválida do servidor";
            await salvar(STORES.pending_sync, item);
            failCount++;
          }
        } catch (itemErr: any) {
          console.warn(`[SyncService] Falha ao sincronizar item [${item.id}]:`, itemErr.message || itemErr);
          item.status = "error";
          item.lastError = itemErr.message || "Falha na requisição";
          await salvar(STORES.pending_sync, item);
          failCount++;
        }
      }

      console.log(`[SyncService] Sincronização concluída. Sucessos: ${successCount}, Falhas: ${failCount}.`);
      this.lastSyncedAt = Date.now();
      return failCount === 0;
    } catch (error: any) {
      console.error("[SyncService] Erro crítico na sincronização:", error);
      this.lastError = error.message || "Erro desconhecido na sincronização";
      return false;
    } finally {
      this.isSyncing = false;
      this.notifyListeners();
    }
  }

  /**
   * Get pending queue count
   */
  public async getPendingCount(): Promise<number> {
    try {
      const list = await listar<PendingSyncItem>(STORES.pending_sync);
      return list ? list.length : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Get sync status overview
   */
  public async getStatus() {
    const pendingCount = await this.getPendingCount();
    return {
      isSyncing: this.isSyncing,
      pendingCount,
      lastSyncedAt: this.lastSyncedAt,
      lastError: this.lastError
    };
  }

  /**
   * Register listener for sync state updates
   */
  public onSyncChange(callback: SyncCallback): () => void {
    this.listeners.add(callback);
    this.getStatus().then((status) => callback(status));

    return () => {
      this.listeners.delete(callback);
    };
  }

  private async notifyListeners() {
    const status = await this.getStatus();
    this.listeners.forEach((cb) => {
      try {
        cb(status);
      } catch (err) {
        console.error("[SyncService] Erro ao notificar listener:", err);
      }
    });
  }
}

export const syncService = new SyncService();
export default syncService;
