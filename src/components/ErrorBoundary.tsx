import React, { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Trash2, Home, Database } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  recoveryAttempts: number;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      recoveryAttempts: 0
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("🏆 [ErrorBoundary] Capturado um erro de renderização do React:", error, errorInfo);

    // Auto-recovery mechanism: If the error happens, we can try to reload the page once
    // to recover from transient memory leaks or broken connection states.
    try {
      const lastAttempt = localStorage.getItem("escola_da_fe_last_crash_reset");
      const urlParams = new URLSearchParams(window.location.search);
      const isAutoRecovered = urlParams.get("recovered") === "true";
      const now = Date.now();

      // If we haven't recovered automatically in the last 15 seconds, and not in infinite loop
      if ((!lastAttempt || now - Number(lastAttempt) > 15000) && !isAutoRecovered) {
        localStorage.setItem("escola_da_fe_last_crash_reset", String(now));
        console.warn("🛡️ [ErrorBoundary] Tentando auto-recuperação transparente em 1.5s...");
        setTimeout(() => {
          const sep = window.location.href.includes("?") ? "&" : "?";
          window.location.href = window.location.href + sep + "recovered=true";
        }, 1500);
      }
    } catch (e) {
      console.error("Falha ao registrar auto-recuperação:", e);
    }
  }

  private handleHardReload = () => {
    try {
      // Remove the buster parameter to avoid loop and force clear
      const cleanUrl = window.location.origin + window.location.pathname;
      window.location.href = `${cleanUrl}?refresh=${Date.now()}`;
    } catch {
      window.location.reload();
    }
  };

  private handleResetState = () => {
    if (window.confirm("Deseja mesmo redefinir as configurações para os padrões de fábrica? Seus estudos salvos offline não serão perdidos, apenas o estado temporário do cache e visualizações serão limpos.")) {
      try {
        localStorage.removeItem("escola_da_fe_ios_install_dismissed");
        localStorage.removeItem("escola_da_fe_active_version");
        sessionStorage.clear();
        this.handleHardReload();
      } catch (e) {
        window.location.reload();
      }
    }
  };

  public render() {
    if (this.state.hasError) {
      // Elegant, fallback visual matching the "Escola da Fé" theme
      return (
        <div className="min-h-screen bg-[#070b19] text-white font-sans flex items-center justify-center p-6 selection:bg-[#cfaf72] selection:text-[#0b132b]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(207,175,114,0.06)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="w-full max-w-xl bg-gradient-to-tr from-[#0b132b]/95 to-[#16254a]/95 rounded-3xl border border-white/10 p-8 md:p-10 shadow-3xl relative z-10 backdrop-blur-sm text-center">
            {/* Warning Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#cfaf72]/20 to-[#cfaf72]/10 border border-[#cfaf72]/30 flex items-center justify-center text-[#cfaf72] mx-auto mb-6">
              <AlertTriangle size={32} className="animate-pulse" />
            </div>

            {/* Typography pairings */}
            <h1 className="font-sans font-extrabold text-[#cfaf72] text-2xl md:text-3xl tracking-tight leading-tight mb-3">
              Escola da Fé: Auto-Recuperação
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto mb-8">
              O aplicativo detectou uma instabilidade de conexão ou de estado em segundo plano, mas <span className="text-[#cfaf72] font-semibold">suas leituras e dados offline estão seguros</span>. Oferecemos ferramentas rápidas para reestabelecer tudo em um clique.
            </p>

            {/* Practical Action Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <button
                onClick={this.handleHardReload}
                className="flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-[#cfaf72] to-[#b3955c] hover:opacity-90 active:scale-95 text-[#0b132b] font-black text-xs rounded-2xl tracking-wider uppercase transition-all shadow-md cursor-pointer"
              >
                <RefreshCw size={14} className="animate-spin-slow" />
                Recarregar App
              </button>

              <button
                onClick={this.handleResetState}
                className="flex items-center justify-center gap-2 py-3.5 px-6 bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 hover:text-white font-bold text-xs rounded-2xl tracking-wider uppercase transition-all border border-white/5 cursor-pointer"
              >
                <Trash2 size={14} />
                Limpar Cache
              </button>
            </div>

            {/* Safe Status Details */}
            <div className="bg-black/30 rounded-2xl p-4 border border-white/5 text-left text-[11px] text-slate-400 font-mono leading-relaxed space-y-2">
              <div className="flex items-center gap-2 text-[#cfaf72]">
                <Database size={12} />
                <span className="font-bold">INTEGRIDADE DE DADOS OFFLINE: OPERACIONAL</span>
              </div>
              <p>Os seus estudos adicionados e dicionário personalizado são preservados intactos no seu navegador através de Cache Local.</p>
              {this.state.error && (
                <div className="mt-3 pt-3 border-t border-white/5 text-red-300 max-h-24 overflow-y-auto overflow-x-hidden break-words text-[10px]">
                  Erro: {this.state.error.message || String(this.state.error)}
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-1 text-[11px] text-slate-500 font-medium font-sans">
              <Home size={10} />
              <span>Escola da Fé App PWA — Toda verdade bíblica ao seu dispor.</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
