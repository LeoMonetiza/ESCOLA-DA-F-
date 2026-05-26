import React, { useState, useEffect } from "react";
import { Download, WifiOff, RefreshCw, X, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

export default function PWAController() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstallTip, setShowIOSInstallTip] = useState(false);

  useEffect(() => {
    // 1. Monitor online/offline state
    const handleOnline = () => {
      setIsOffline(false);
      showToast("Você está online de volta! Sincronização restabelecida.");
    };
    const handleOffline = () => {
      setIsOffline(true);
      showToast("Modo Offline Ativo. Leituras salvas prontas para acesso.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 2. Identify if device is iOS and not in standalone mode
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone === true;
    
    setIsIOS(ios);
    if (ios && !standalone) {
      const dismissed = localStorage.getItem("escola_da_fe_ios_install_dismissed") === "true";
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

          // Listen for updates in background
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // A new update is ready & waiting to be activated!
                  setUpdateAvailable(true);
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
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Skip waiting for update to take place
  const handleUpdateApp = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
    } else {
      // Fallback reload
      window.location.reload();
    }
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
  const fastTransition = { duration: 0.15, ease: "easeOut" };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[150] flex flex-col gap-3 pointer-events-none max-w-sm w-full font-sans px-4 sm:px-0">
        <AnimatePresence>
          {/* New App Version Detected Alert */}
          {updateAvailable && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={fastTransition}
              className="pointer-events-auto bg-slate-900 text-white border border-accent/30 rounded-2xl p-4 shadow-2xl flex flex-col gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-accent/20 rounded-xl text-accent shrink-0 mt-0.5">
                  <RefreshCw size={16} className="animate-spin" />
                </div>
                <div>
                  <h6 className="font-extrabold text-[#cfaf72] text-sm tracking-tight leading-tight">Escola da Fé Atualizado!</h6>
                  <p className="text-[11px] text-slate-300 font-medium leading-relaxed mt-1">Uma nova versão mais rápida e com melhorias de conteúdo foi carregada em segundo plano.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={handleUpdateApp}
                  className="flex-1 py-2 bg-accent hover:bg-white text-secondary font-black text-[11px] rounded-xl transition-colors tracking-wide uppercase cursor-pointer"
                >
                  Recarregar Agora
                </button>
                <button
                  onClick={() => setUpdateAvailable(false)}
                  className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          )}

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
                  <span className="text-[10px] text-red-300 leading-none">Estudos e dicionário salvos localmente</span>
                </div>
              </div>
              <span className="text-[9px] bg-red-900/40 text-red-300 font-black tracking-widest uppercase px-2 py-0.5 rounded">Cache Ok</span>
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
                    localStorage.setItem("escola_da_fe_ios_install_dismissed", "true");
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
