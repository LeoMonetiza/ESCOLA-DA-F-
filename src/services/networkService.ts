/**
 * NETWORK SERVICE
 * Detects online/offline states and active internet reachability.
 */

type NetworkCallback = (isOnline: boolean) => void;

class NetworkService {
  private isOnlineStatus: boolean = typeof navigator !== "undefined" ? navigator.onLine : true;
  private listeners: Set<NetworkCallback> = new Set();
  private pingInterval: any = null;

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => this.handleOnlineEvent());
      window.addEventListener("offline", () => this.handleOfflineEvent());

      // Periodic ping check every 30 seconds to confirm actual connectivity
      this.startPingCheck();
    }
  }

  private handleOnlineEvent() {
    console.log("[NetworkService] Conexão detectada (evento 'online'). Verificando conectividade real...");
    this.checkReachability().then((reachable) => {
      this.updateStatus(reachable);
    });
  }

  private handleOfflineEvent() {
    console.log("[NetworkService] Conexão perdida (evento 'offline'). Ativando Modo Offline...");
    this.updateStatus(false);
  }

  private updateStatus(newStatus: boolean) {
    if (this.isOnlineStatus !== newStatus) {
      this.isOnlineStatus = newStatus;
      console.log(`[NetworkService] Status de rede alterado: ${newStatus ? "ONLINE 🌐" : "OFFLINE 📴"}`);
      this.notifyListeners();
    }
  }

  /**
   * Verify actual internet reachability by pinging a lightweight API route
   */
  public async checkReachability(): Promise<boolean> {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const response = await fetch("/api/supabase-config", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const isOk = response.ok;
      this.updateStatus(isOk);
      return isOk;
    } catch {
      // Fallback: if Express backend endpoint is not reached, try a HEAD fetch to root
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        await fetch("/", { method: "HEAD", cache: "no-store", signal: controller.signal });
        clearTimeout(timeoutId);
        this.updateStatus(true);
        return true;
      } catch {
        this.updateStatus(false);
        return false;
      }
    }
  }

  /**
   * Returns current online status
   */
  public isOnline(): boolean {
    return this.isOnlineStatus;
  }

  /**
   * Register callback for network state changes
   */
  public onNetworkChange(callback: NetworkCallback): () => void {
    this.listeners.add(callback);
    // Trigger immediately with current status
    callback(this.isOnlineStatus);

    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback(this.isOnlineStatus);
      } catch (err) {
        console.error("[NetworkService] Erro ao notificar ouvinte de rede:", err);
      }
    });
  }

  private startPingCheck() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    this.pingInterval = setInterval(() => {
      this.checkReachability();
    }, 30000);
  }
}

export const networkService = new NetworkService();
export default networkService;
