import React, { useState } from "react";
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Search, 
  Trash2, 
  RefreshCw, 
  Calendar, 
  Activity, 
  CheckCircle, 
  X,
  User,
  ShieldAlert
} from "lucide-react";
import { cn } from "../lib/utils";

function safeFormatDate(dateStr: string | undefined | null): string {
  try {
    if (!dateStr) return "---";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "---";
    return d.toLocaleDateString("pt-BR");
  } catch {
    return "---";
  }
}

function safeFormatTime(dateStr: string | undefined | null): string {
  try {
    if (!dateStr) return "---";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "---";
    return d.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
  } catch {
    return "---";
  }
}

interface Dispositivo {
  id: string;
  device_id: string;
  name: string;
  os: string;
  browser: string;
  is_pwa: boolean;
  device_type: string;
  installed_at: string;
  last_active_at: string;
}

export default function UsersView({ 
  isAdmin, 
  dispositivos, 
  onRefresh,
  triggerConfirm
}: { 
  isAdmin: boolean; 
  dispositivos: Dispositivo[]; 
  onRefresh: () => void;
  triggerConfirm: (title: string, message: string, onConfirm: () => void) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOS, setSelectedOS] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-red-500/20">
          <ShieldAlert size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">Acesso Proibido</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
          Esta área é restrita a administradores autorizados. Por favor, faça login com a senha master para obter permissão.
        </p>
      </div>
    );
  }

  // Handlers
  const handleDeleteItem = async (id: string, name: string) => {
    triggerConfirm(
      "Excluir Registro de Atividade",
      `Tem certeza que deseja remover o registro do dispositivo "${name}"? Esta ação é irreversível.`,
      async () => {
        try {
          const response = await fetch(`/api/db/dispositivos/${id}`, {
            method: "DELETE"
          });
          if (response.ok) {
            onRefresh();
          } else {
            alert("Erro ao excluir do servidor.");
          }
        } catch (err: any) {
          console.error("Erro crítico ao excluir dispositivo:", err.message);
        }
      }
    );
  };

  const handleClearAll = async () => {
    triggerConfirm(
      "Limpar Todos os Registros",
      "Tem certeza que deseja apagar os registros de TODOS os dispositivos inativos? Os dispositivos atualizarão os dados na próxima visita.",
      async () => {
        setIsDeletingAll(true);
        try {
          // Delete sequentially or via bulk
          const promises = dispositivos.map(dev => 
            fetch(`/api/db/dispositivos/${dev.id}`, { method: "DELETE" })
          );
          await Promise.all(promises);
          onRefresh();
        } catch (err) {
          console.error("Erro ao limpar registros:", err);
        } finally {
          setIsDeletingAll(false);
        }
      }
    );
  };

  // Filtered devices list
  const filteredDispositivos = dispositivos.filter(dev => {
    const matchesSearch = 
      (dev.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dev.device_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dev.os || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dev.browser || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOS = selectedOS === "all" || (dev.os || "").toLowerCase() === selectedOS.toLowerCase();
    const matchesType = selectedType === "all" || (dev.device_type || "").toLowerCase().includes(selectedType.toLowerCase());

    return matchesSearch && matchesOS && matchesType;
  });

  // Calculate Metrics
  const totalDispositivos = dispositivos.length;
  const pwaCount = dispositivos.filter(d => d.is_pwa).length;
  
  const mobileCount = dispositivos.filter(d => 
    (d.device_type || "").toLowerCase().includes("telem") || 
    (d.device_type || "").toLowerCase().includes("mobile") ||
    (d.device_type || "").toLowerCase().includes("phone")
  ).length;

  const desktopCount = totalDispositivos - mobileCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-[#1e293b] to-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest inline-block">
            Módulo Administrador Geral
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-[#cfaf72]">
            Monitor de Usuários e Instalações
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold max-w-xl leading-relaxed">
            Acompanhe o público que instalou a Escola da Fé em formato PWA nos seus telemóveis e computadores. Veja os sistemas operacionais, navegadores e carimbo de última atividade com sincronização contínua.
          </p>
        </div>
        
        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            className="flex items-center gap-2 px-5 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-xs font-black uppercase transition-all duration-300 cursor-pointer text-[#cfaf72]"
          >
            <RefreshCw size={14} className="animate-spin" style={{ animationDuration: "3s" }} />
            Atualizar Lista
          </button>
          
          <button
            type="button"
            onClick={handleClearAll}
            disabled={isDeletingAll || totalDispositivos === 0}
            className="flex items-center gap-2 px-5 py-3.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-400 rounded-2xl text-xs font-black uppercase transition-all duration-300 cursor-pointer disabled:opacity-40"
          >
            <Trash2 size={14} />
            Limpar Monitor
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6 rounded-[2rem] shadow-xl flex items-center gap-5">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center shrink-0 border border-amber-500/20">
            <Activity size={26} />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-heading leading-none block">{totalDispositivos}</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-muted">Audiência Total</span>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6 rounded-[2rem] shadow-xl flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/20">
            <CheckCircle size={26} />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-heading leading-none block">{pwaCount}</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-muted">Instalado PWA (App)</span>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6 rounded-[2rem] shadow-xl flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center shrink-0 border border-blue-500/20">
            <Smartphone size={26} />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-heading leading-none block">{mobileCount}</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-muted">Dispositivos Móveis</span>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6 rounded-[2rem] shadow-xl flex items-center gap-5">
          <div className="w-14 h-14 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center shrink-0 border border-purple-500/20">
            <Monitor size={26} />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-heading leading-none block">{desktopCount}</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-muted">Acessos Desktop</span>
          </div>
        </div>

      </div>

      {/* Filters Board */}
      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6 rounded-[2rem] shadow-xl space-y-4">
        <span className="block text-[10px] font-black uppercase tracking-widest text-[#cfaf72]">Filtros Rápidos e Pesquisa</span>
        
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome de participante, device ID, sistema operacional..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-accent text-slate-800 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={selectedOS}
              onChange={(e) => setSelectedOS(e.target.value)}
              className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-black uppercase tracking-wider focus:outline-none text-slate-700 dark:text-slate-300"
            >
              <option value="all">Sistemas (Todos)</option>
              <option value="windows">💡 Windows</option>
              <option value="macos">🍎 macOS</option>
              <option value="android">📱 Android</option>
              <option value="ios">🍎 iOS</option>
              <option value="linux">🐧 Linux</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-black uppercase tracking-wider focus:outline-none text-slate-700 dark:text-slate-300"
            >
              <option value="all">Tipo de Tela (Todos)</option>
              <option value="telemóvel">📱 Telemóveis</option>
              <option value="tablet">📂 Tablets</option>
              <option value="computador">💻 Computador</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table / Mobile List */}
      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-[2.5rem] shadow-xl overflow-hidden">
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 border-b border-border-light dark:border-border-dark">
                <th className="py-4.5 px-6 text-[10px] font-black uppercase tracking-wider text-muted">Usuário / Participante</th>
                <th className="py-4.5 px-6 text-[10px] font-black uppercase tracking-wider text-muted">Modo de Acesso</th>
                <th className="py-4.5 px-6 text-[10px] font-black uppercase tracking-wider text-muted">Sistema / Browser</th>
                <th className="py-4.5 px-6 text-[10px] font-black uppercase tracking-wider text-muted">Carimbo PWA</th>
                <th className="py-4.5 px-6 text-[10px] font-black uppercase tracking-wider text-muted">Último Acesso</th>
                <th className="py-4.5 px-6 text-[10px] font-black uppercase tracking-wider text-muted text-center w-24">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light/40 dark:divide-border-dark/40 font-semibold text-xs text-slate-700 dark:text-slate-300">
              {filteredDispositivos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted font-bold font-mono">
                    Nenhum dispositivo encontrado para os filtros configurados.
                  </td>
                </tr>
              ) : (
                filteredDispositivos.map((dev, dIdx) => (
                  <tr key={"tbl_dev_" + (dev.id || "no_id") + "_" + dIdx} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-accent/15 text-accent rounded-xl flex items-center justify-center shrink-0 border border-accent/20">
                          <User size={16} />
                        </div>
                        <div>
                          <span className="font-extrabold text-[#cfaf72] text-sm block">{dev.name || "Visitante Anónimo"}</span>
                          <span className="text-[10px] font-bold text-muted font-mono select-all uppercase">ID: {dev.device_id}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-5 px-6">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        (dev.device_type || "").toLowerCase().includes("telem") 
                          ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          : "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                      )}>
                        {(dev.device_type || "").toLowerCase().includes("telem") ? <Smartphone size={10} /> : <Monitor size={10} />}
                        {dev.device_type || "Computador (Desktop)"}
                      </span>
                    </td>
                    
                    <td className="py-5 px-6">
                      <div className="space-y-0.5">
                        <span className="font-bold text-heading">{dev.os || "Desconhecido"}</span>
                        <span className="block text-[10px] text-muted font-mono">{dev.browser || "Desconhecido"}</span>
                      </div>
                    </td>
                    
                    <td className="py-5 px-6">
                      {dev.is_pwa ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                          🛡️ PWA Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 border border-slate-200 dark:border-white/5 rounded-full text-[10px] font-bold uppercase">
                          🖥️ Navegador
                        </span>
                      )}
                    </td>
                    
                    <td className="py-5 px-6 text-muted font-mono">
                      <div className="space-y-0.5">
                        <span className="block font-bold">
                          {safeFormatDate(dev.last_active_at)}
                        </span>
                        <span className="block text-[10px]">
                          {safeFormatTime(dev.last_active_at)}
                        </span>
                      </div>
                    </td>

                    <td className="py-5 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(dev.id, dev.name)}
                        className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all cursor-pointer"
                        title="Remover Registro"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View Card List */}
        <div className="block md:hidden p-4 space-y-4">
          <span className="block text-[10px] font-black uppercase tracking-widest text-muted text-center mb-2">Relatório Compacto para Telemóvel</span>
          
          {filteredDispositivos.length === 0 ? (
            <div className="py-8 text-center text-muted font-semibold">
              Nenhum dispositivo encontrado.
            </div>
          ) : (
            filteredDispositivos.map((dev, dIdx) => (
              <div 
                key={"mob_dev_" + (dev.id || "no_id") + "_" + dIdx} 
                className="bg-slate-50/50 dark:bg-white/2 p-4 rounded-2xl border border-border-light dark:border-border-dark space-y-3 relative"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-accent/10 text-accent rounded-lg flex items-center justify-center shrink-0 border border-accent/10">
                    <User size={14} />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white text-sm block font-extrabold">{dev.name || "Visitante Anónimo"}</strong>
                    <span className="text-[9px] font-semibold text-muted font-mono block">ID: {dev.device_id}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                  <div>
                    <span className="text-muted block font-bold uppercase tracking-wider text-[8px]">Sist. Operacional</span>
                    <strong className="text-[#cfaf72] font-black">{dev.os || "Desconhecido"}</strong>
                  </div>
                  <div>
                    <span className="text-muted block font-bold uppercase tracking-wider text-[8px]">Acesso PWA</span>
                    <strong className={cn(dev.is_pwa ? "text-emerald-500 uppercase tracking-widest block font-black" : "text-slate-400 font-extrabold block ")}>
                      {dev.is_pwa ? "Instalado ✓" : "Navegador"}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border-light/40 dark:border-border-dark/40">
                  <div className="flex items-center gap-1 text-muted font-mono text-[9px]">
                    <Calendar size={10} />
                    <span>Alt: {safeFormatDate(dev.last_active_at)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteItem(dev.id, dev.name)}
                    className="p-1 px-3 bg-red-500/10 border border-red-500/15 text-red-500 rounded-lg text-[9px] font-extrabold uppercase transition-all cursor-pointer"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
