/**
 * OFFLINE SERVICE
 * Primary facade for Offline-First operations, monitoring, and state inspection.
 */

import { networkService } from "./networkService";
import { databaseService } from "./databaseService";
import { syncService } from "./syncService";
import { cacheService } from "./cacheService";
import { clearExpiredCache, recoverApplicationState, storageDiagnostics } from "../lib/indexedDb";

export class OfflineService {
  /**
   * Check if application is currently offline
   */
  public isOffline(): boolean {
    return !networkService.isOnline();
  }

  /**
   * Check if application is currently online
   */
  public isOnline(): boolean {
    return networkService.isOnline();
  }

  /**
   * Manually trigger connectivity verification
   */
  public async checkConnection(): Promise<boolean> {
    return await networkService.checkReachability();
  }

  /**
   * Manually trigger sync queue processing
   */
  public async syncNow(): Promise<boolean> {
    return await syncService.syncPendingData();
  }

  /**
   * Subscribe to network changes
   */
  public onNetworkChange(callback: (isOnline: boolean) => void) {
    return networkService.onNetworkChange(callback);
  }

  /**
   * Subscribe to sync state changes
   */
  public onSyncChange(callback: (status: any) => void) {
    return syncService.onSyncChange(callback);
  }

  /**
   * Access database service
   */
  public get db() {
    return databaseService;
  }

  /**
   * Access cache service
   */
  public get cache() {
    return cacheService;
  }

  /**
   * Access sync service
   */
  public get sync() {
    return syncService;
  }

  /**
   * Storage diagnostics overview
   */
  public async getDiagnostics() {
    return await storageDiagnostics();
  }

  /**
   * Self-recovery utility
   */
  public async selfRecover() {
    return await recoverApplicationState();
  }

  /**
   * Clean expired assets and old records
   */
  public async cleanExpiredData() {
    return await clearExpiredCache();
  }
}

export const offlineService = new OfflineService();
export default offlineService;
