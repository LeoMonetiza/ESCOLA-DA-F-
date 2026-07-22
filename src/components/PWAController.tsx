import React, { useState, useEffect } from "react";
import { Download, WifiOff, RefreshCw, X, Sparkles, Check, CloudUpload } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { offlineService } from "../services/offlineService";

export default function PWAController() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstallTip, setShowIOSInstallTip] = useState(false);
  const isUpdatingRef = React.useRef(false);

  // Skip waiting, purge caches, register new version token, and hard reload
  const handleUpdateApp = async (reg?: ServiceWorkerRegistration | null) => {
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    try {
      console.log("[PWA] Executando renovação automática de código e cache...");

      // 1. Fetch current server version to update local registry
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.version) {
            localStorage.setItem("escola_da_fe_active_version", data.version);
          }
        }
      } catch (e) {
        console.warn("[PWA] Falha ao sintonizar chave de versão:", e);
      }

      // 2. Clear entire browser service worker Cache Storage structure
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
        console.log("[PWA] Caches obsoletos eliminados.");
      }

      // 3. Command service worker to skipWaiting
      const activeSw = reg || swRegistration;
      if (activeSw) {
        if (activeSw.waiting) {
          activeSw.waiting.postMessage({ type: "SKIP_WAITING" });
          return; // The 'controllerchange' listener will issue window.location.reload()
        }
        await activeSw.unregister();
      }

      // 4. Force hard reload with timestamp buster
      window.location.href = `/?refresh=${Date.now()}`;
    } catch (err) {
      console.error("[PWA] Falha na invalidação estrutural, recarregando padrão:", err);
      window.location.reload();
    }
  };

  useEffect(() => {
    // 1. Subscribe to network status and sync updates via offlineService
    const unsubNet = offlineService.onNetworkChange((online) => {
      setIsOffline(!online);
      if (online) {
        showToast("Você está online de volta! Sincronizando dados pendentes...");
      } else {
        showToast("Modo Offline Ativo. Leituras e alterações salvas localmente.");
      }
    });

    const unsubSync = offlineService.onSyncChange((status) => {
      setPendingSyncCount(status.pendingCount);
      setIsSyncing(status.isSyncing);
    });

    // 2. Identify if device is iOS and not in standalone mode
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone === true;
    
    setIsIOS(ios);
    if (ios && !standalone) {
      let dismissed = false;
      try {
        dismissed = localStorage.getItem("escola_da_fe_ios_install_dismissed") === "true";
      } catch (e) {
        console.warn("Could not read from localStorage on iOS install tip check:", e);
      }
      if (!dismissed) {
        setShowIOSInstallTip(true);
      }
    }

    // 3. Capture app installation prompt (standards based PWA support for Android/PC)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Track when app is installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      showToast("Escola da Fé instalado com sucesso!");
    });

    // Check if app is running in standalone mode (already installed & running)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // 4. Register service worker and monitor for background updates
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js")
        .then((registration) => {
          setSwRegistration(registration);
          console.log("[PWA] Service Worker registrado:", registration);

          // If there is already a waiting worker, automatically update & reload
          if (registration.waiting) {
            handleUpdateApp(registration);
          }

          // Register automatic update check
          registration.update().catch(() => {});

          // Listen for updates in background
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // A new update is ready & waiting - trigger automatic update
                  handleUpdateApp(registration);
                }
              });
            }
          });
        })
        .catch((err) => {
          console.error("[PWA] Erro ao registrar SW:", err);
        });

      // Handle controllerchange (when new sw takes control of page, trigger reload)
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    return () => {
      unsubNet();
      unsubSync();
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // 5. Dynamic Deploy Auto-Detection (Vercel Deploy Checker matching /version.json)
  useEffect(() => {
    const checkVercelDeploy = async () => {
      try {
        // Query the live deploy version checker with a cache buster timestamp
        const res = await fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const serverVersion = data.version;

        if (!serverVersion) return;

        let localVersion = null;
        try {
          localVersion = localStorage.getItem("escola_da_fe_active_version");
        } catch (e) {
          console.warn("Could not read localVersion from localStorage:", e);
        }

        // Initial setup on first run
        if (!localVersion) {
          try {
            localStorage.setItem("escola_da_fe_active_version", serverVersion);
          } catch (e) {
            console.warn("Could not write localVersion to localStorage:", e);
          }
          console.log("[PWA] Inicializado rastreador de versão:", serverVersion);
          return;
        }

        // If server version is greater/different than local, we have a new deploy! Trigger automatic update!
        if (localVersion !== serverVersion) {
          console.log(`[PWA] Diferença de versão encontrada! Local: ${localVersion} | Servidor: ${serverVersion}`);
          handleUpdateApp();
        }
      } catch (err) {
        console.warn("[PWA] Erro ao verificar a versão no servidor:", err);
      }
    };

    // Trigger check immediately at startup
    checkVercelDeploy();

    // Trigger check when app becomes visible or focused (PWA resumed from standby)
    const handleFocus = () => {
      checkVercelDeploy();
      if (swRegistration) {
        swRegistration.update().catch(() => {});
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkVercelDeploy();
        if (swRegistration) {
          swRegistration.update().catch(() => {});
        }
      }
    };

    const handleBackOnline = () => {
      checkVercelDeploy();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleBackOnline);

    // Dynamic Interval checking: Poll the static version JSON every 30 seconds
    const intervalId = setInterval(checkVercelDeploy, 30000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleBackOnline);
      clearInterval(intervalId);
    };
  }, [swRegistration]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Launch PWA Installation flow
  const handleInstallApp = async () => {
    if (!installPrompt) return;
    
    // Show native installation modal prompt
    installPrompt.prompt();
    
    // Wait for the user response on installing
    const { outcome } = await installPrompt.userChoice;
    console.log(`[PWA] Escolha de instalação do usuário: ${outcome}`);
    
    // Reset standard prompt variable
    setInstallPrompt(null);
  };

  // Fast animation transition presets for lightness and speed
  const fastTransition: any = { duration: 0.15, ease: "easeOut" };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[150] flex flex-col gap-3 pointer-events-none max-w-sm w-full font-sans px-4 sm:px-0">
        <AnimatePresence>
          {/* Simple Offline / Online Banner */}
          {isOffline && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={fastTransition}
              className="pointer-events-auto bg-red-950/95 text-white border border-red-900/30 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-4 backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <WifiOff size={16} className="text-red-400 animate-pulse shrink-0" />
                <div>
                  <span className="font-extrabold text-sm tracking-tight block">Modo Offline Ativo</span>
                  <span className="text-[10px] text-red-300 leading-none">
                    {pendingSyncCount > 0 ? `${pendingSyncCount} alteração(ões) pendente(s)` : "Estudos e dados salvos no IndexedDB"}
                  </span>
                </div>
              </div>
              <span className="text-[9px] bg-red-900/40 text-red-300 font-black tracking-widest uppercase px-2 py-0.5 rounded">
                IndexedDB
              </span>
            </motion.div>
          )}

          {/* Pending Syncing Indicator Banner */}
          {!isOffline && pendingSyncCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={fastTransition}
              className="pointer-events-auto bg-amber-950/95 text-amber-100 border border-amber-600/30 rounded-2xl p-3.5 shadow-xl flex items-center justify-between gap-4 backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <CloudUpload size={16} className={cn("text-amber-400 shrink-0", isSyncing && "animate-bounce")} />
                <div>
                  <span className="font-extrabold text-xs tracking-tight block">
                    {isSyncing ? "Sincronizando com o servidor..." : "Sincronização Pendente"}
                  </span>
                  <span className="text-[10px] text-amber-300/80 leading-none">
                    {pendingSyncCount} alteração(ões) salvas no IndexedDB
                  </span>
                </div>
              </div>
              <button
                onClick={() => offlineService.syncNow()}
                disabled={isSyncing}
                className="text-[9px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black tracking-wider uppercase px-2.5 py-1 rounded-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {isSyncing ? "Enviando..." : "Sincronizar"}
              </button>
            </motion.div>
          )}

          {/* Toast Notification */}
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={fastTransition}
              className="pointer-events-auto bg-[#0b132b] text-white py-3 px-5 rounded-2xl border border-white/5 shadow-xl text-xs font-bold text-center flex items-center gap-2.5 backdrop-blur-md self-center"
            >
              <Check size={14} className="text-accent" />
              <span>{toastMessage}</span>
            </motion.div>
          )}

          {/* Standard standalone floating Install trigger button (if app is installable!) */}
          {installPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={fastTransition}
              className="pointer-events-auto bg-gradient-to-tr from-[#16254a] to-[#0b132b] text-white border border-[#cfaf72]/30 p-4 rounded-3xl shadow-xl flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#cfaf72] flex items-center justify-center text-[#0b132b] font-black text-lg">
                  📖
                </div>
                <div className="text-left">
                  <span className="font-extrabold text-xs text-[#cfaf72] uppercase tracking-wider block">Escola da Fé</span>
                  <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">Instale agora no celular ou PC</p>
                </div>
              </div>
              <button
                onClick={handleInstallApp}
                className="py-2.5 px-4 bg-accent hover:bg-white text-secondary font-black text-[10px] rounded-xl tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                title="Instalar aplicativo de teologia"
              >
                <Download size={12} /> Instalar
              </button>
            </motion.div>
          )}

          {/* iOS Safari custom installation instructions */}
          {showIOSInstallTip && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={fastTransition}
              className="pointer-events-auto bg-gradient-to-tr from-[#16254a] to-[#0b132b] text-white border border-[#cfaf72]/30 p-4 rounded-3xl shadow-xl flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#cfaf72] flex items-center justify-center text-[#0b132b] font-black text-lg">
                    📱
                  </div>
                  <div className="text-left text-xs">
                    <span className="font-extrabold text-[#cfaf72] uppercase tracking-wider block">Instalar no iPhone</span>
                    <p className="text-[10px] text-slate-300 leading-none font-semibold">Escola da Fé na sua Tela de Início</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowIOSInstallTip(false);
                    try {
                      localStorage.setItem("escola_da_fe_ios_install_dismissed", "true");
                    } catch (e) {
                      console.warn("Could not save to localStorage:", e);
                    }
                  }}
                  className="p-1.5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="text-[10px] text-slate-300 bg-white/5 p-2.5 rounded-xl border border-white/5 leading-relaxed font-medium">
                Para instalar, toque no botão de <span className="font-bold text-accent">Compartilhar 📤</span> do Safari na barra inferior e selecione <span className="font-bold text-accent">"Adicionar à Tela de Início" ➕</span>.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
