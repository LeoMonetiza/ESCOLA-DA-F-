import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Paperclip, 
  Smile, 
  FileText, 
  Image as ImageIcon, 
  Trash, 
  User, 
  Clock, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  RefreshCw, 
  LifeBuoy,
  X,
  Shield,
  FileDown,
  Search,
  Filter,
  Database,
  MessageSquare,
  ExternalLink
} from "lucide-react";
import { getSupabaseClient, performResilientDbWrite, checkSupabaseConfigExists } from "../lib/supabaseClient";

interface SupportMessage {
  id: string;
  dispositivo_id: string;
  nome_usuario: string;
  mensagem: string;
  midia_url?: string;
  midia_nome?: string;
  midia_tipo?: string; // "image" | "document"
  emoji?: string;
  enviado_por_admin: boolean;
  criado_em: string;
}

interface SupportViewProps {
  isAdmin: boolean;
  triggerConfirm?: (title: string, message: string, onConfirm: () => void) => void;
}

// Helper functions to prevent Uncaught RangeError on invalid dates
function tryFormatTime(dateStr: string | undefined | null): string {
  try {
    if (!dateStr) return "--:--";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "--:--";
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "--:--";
  }
}

function tryFormatDateTime(dateStr: string | undefined | null): string {
  try {
    if (!dateStr) return "--/--/---- --:--";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "--/--/---- --:--";
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  } catch {
    return "--/--/---- --:--";
  }
}

function safeGetTime(dateStr: string | undefined | null): number {
  try {
    if (!dateStr) return 0;
    const t = new Date(dateStr).getTime();
    return isNaN(t) ? 0 : t;
  } catch {
    return 0;
  }
}

const QUICK_EMOJIS = ["🙏", "🙌", "❤️", "📖", "🕊️", "⛪", "✨", "💡", "😁", "😭", "👍", "🔥"];

export default function SupportView({ isAdmin, triggerConfirm }: SupportViewProps) {
  const [messages, setMessages] = useState<SupportMessage[]>(() => {
    try {
      const savedLocal = localStorage.getItem("escola_da_fe_suporte_local");
      if (savedLocal) {
        const parsed = JSON.parse(savedLocal);
        if (Array.isArray(parsed)) {
          return parsed.filter(m => m && m.id && m.dispositivo_id);
        }
      }
    } catch {
      // ignore
    }
    return [];
  });
  const [loading, setLoading] = useState(() => {
    try {
      const savedLocal = localStorage.getItem("escola_da_fe_suporte_local");
      if (savedLocal) {
        const parsed = JSON.parse(savedLocal);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return false;
        }
      }
    } catch {}
    return true;
  });
  const [inputText, setInputText] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachment, setAttachment] = useState<{ name: string; type: "image" | "document"; dataUrl: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Table view state
  const [viewMode, setViewMode] = useState<"chat" | "table" | "users">("chat");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "user" | "admin" | "attachment" | "emoji">("all");
  
  // All Devices/Users from db (on-demand loading)
  const [dispositivos, setDispositivos] = useState<any[]>([]);
  const [loadingDispositivos, setLoadingDispositivos] = useState(false);
  
  // Client device ID & Name
  const [deviceId, setDeviceId] = useState(() => {
    try {
      let saved = localStorage.getItem("escola_da_fe_device_id");
      if (!saved) {
        saved = "device_" + Math.random().toString(36).substring(2, 11);
        localStorage.setItem("escola_da_fe_device_id", saved);
      }
      return saved;
    } catch {
      return "device_fallback_" + Date.now();
    }
  });

  const [userName, setUserName] = useState(() => {
    try {
      return localStorage.getItem("escola_da_fe_user_name") || "Anónimo / Visitante";
    } catch {
      return "Anónimo / Visitante";
    }
  });

  // Admin Active Session/Session Selected for replying
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedSessionId]);

  useEffect(() => {
    if (!isAdmin && viewMode !== "chat") {
      setViewMode("chat");
    }
  }, [isAdmin, viewMode]);

  // Load message list
  const loadMessages = async (isBackground = false) => {
    if (!isBackground && messages.length === 0) {
      setLoading(true);
    }
    try {
      // 1. Tenta carregar via API do backend Express de suporte (leve/otimizado)
      const res = await fetch("/api/db/suporte/load");
      if (res.ok) {
        const json = await res.json();
        if (json && json.success && json.data && json.data.suporte) {
          const loaded: SupportMessage[] = json.data.suporte;
          const validLoaded = (loaded || []).filter(m => m && m.id && m.dispositivo_id);
          // Sort chronologically safely
          validLoaded.sort((a, b) => safeGetTime(a.criado_em) - safeGetTime(b.criado_em));
          
          setMessages(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(validLoaded)) {
              return validLoaded;
            }
            return prev;
          });
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("[Suporte] Falha ao carregar via API Express proxy, tentando Supabase direto...", e);
    }

    // 2. Fallback direto cliente Supabase
    try {
      const configExists = await checkSupabaseConfigExists();
      if (configExists) {
        const supabase = await getSupabaseClient();
        if (supabase) {
          const { data, error } = await supabase
            .from("suporte_mensagens")
            .select("*");
          if (!error && data) {
            const loaded = data.map((d: any) => ({
              id: d?.id,
              dispositivo_id: d?.dispositivo_id,
              nome_usuario: d?.nome_usuario,
              mensagem: d?.mensagem,
              midia_url: d?.midia_url,
              midia_nome: d?.midia_nome,
              midia_tipo: d?.midia_tipo,
              emoji: d?.emoji,
              enviado_por_admin: !!d?.enviado_por_admin,
              criado_em: d?.criado_em
            })).filter((m: any) => m && m.id && m.dispositivo_id);
            loaded.sort((a: any, b: any) => safeGetTime(a.criado_em) - safeGetTime(b.criado_em));
            
            setMessages(prev => {
              if (JSON.stringify(prev) !== JSON.stringify(loaded)) {
                return loaded;
              }
              return prev;
            });
            setLoading(false);
            return;
          }
        }
      }
    } catch (die) {
      console.warn("[Suporte] Falha no fallback direto do cliente Supabase:", die);
    }

    // 3. Fallback LocalStorage (Múltiplos utilizadores offline ou apenas o próprio)
    try {
      const savedLocal = localStorage.getItem("escola_da_fe_suporte_local");
      if (savedLocal) {
        const parsed = JSON.parse(savedLocal);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(m => m && m.id && m.dispositivo_id);
          setMessages(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(filtered)) {
              return filtered;
            }
            return prev;
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const hasCache = messages.length > 0;
    loadMessages(hasCache);
    
    // Periodically fetch new messages (every 3 seconds) for a real-time experience
    const interval = setInterval(() => {
      loadMessages(true);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const loadDispositivos = async () => {
    if (!isAdmin) return;
    setLoadingDispositivos(true);
    try {
      const res = await fetch("/api/db/load");
      if (res.ok) {
        const json = await res.json();
        if (json && json.success && json.data && json.data.dispositivos) {
          setDispositivos(json.data.dispositivos || []);
        }
      }
    } catch (e) {
      console.warn("Erro ao carregar dispositivos em SupportView:", e);
    } finally {
      setLoadingDispositivos(false);
    }
  };

  useEffect(() => {
    if (isAdmin && viewMode === "users" && dispositivos.length === 0) {
      loadDispositivos();
    }
  }, [isAdmin, viewMode]);

  // Sync to localstorage for robustness
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem("escola_da_fe_suporte_local", JSON.stringify(messages));
      } catch (err) {
        console.warn("[Suporte] Erro ao salvar cache de suporte:", err);
      }
    }
  }, [messages]);

  // Handle Send File/Attaching documents or photos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Para garantir a rapidez do envio, por favor carregue ficheiros com menos de 8MB.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const isImg = file.type.startsWith("image/");
      setAttachment({
        name: file.name,
        type: isImg ? "image" : "document",
        dataUrl: reader.result as string
      });
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert("Erro ao ler o ficheiro.");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Delete message
  const handleDeleteMessage = async (id: string) => {
    const proceed = () => {
      setMessages(prev => prev.filter(m => m.id !== id));
      performResilientDbWrite("suporte", "DELETE", null, id).catch(e => {
        console.error("[Suporte onDelete] Falha de sincronização do delete:", e);
      });
    };

    if (triggerConfirm) {
      triggerConfirm(
        "Excluir Mensagem?",
        "Tem certeza que deseja apagar esta mensagem do histórico de suporte?",
        proceed
      );
    } else if (confirm("Apagar mensagem de suporte?")) {
      proceed();
    }
  };

  // Submit/Send Message handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachment && !selectedEmoji) return;

    // Determine destination target device ID
    // If Admin: reply to selected session device ID
    // If User: send from own device ID
    const targetDeviceId = isAdmin ? (selectedSessionId || "") : deviceId;
    const targetUserName = isAdmin ? "Suporte Escola da Fé" : userName;

    if (isAdmin && !selectedSessionId) {
      alert("Por favor, selecione uma sessão de utilizador que queira responder na barra esquerda.");
      return;
    }

    const newMessageId = "msg_sup_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    const newMsg: SupportMessage = {
      id: newMessageId,
      dispositivo_id: targetDeviceId,
      nome_usuario: targetUserName,
      mensagem: inputText.trim(),
      emoji: selectedEmoji || undefined,
      enviado_por_admin: isAdmin,
      criado_em: new Date().toISOString()
    };

    if (attachment) {
      newMsg.midia_url = attachment.dataUrl;
      newMsg.midia_nome = attachment.name;
      newMsg.midia_tipo = attachment.type;
    }

    // Save locally immediately
    setMessages(prev => [...prev, newMsg]);
    setInputText("");
    setSelectedEmoji("");
    setAttachment(null);
    setShowEmojiPicker(false);

    try {
      await performResilientDbWrite("suporte", "POST", {
        id: newMsg.id,
        dispositivo_id: newMsg.dispositivo_id,
        nome_usuario: newMsg.nome_usuario,
        mensagem: newMsg.mensagem,
        midia_url: newMsg.midia_url || null,
        midia_nome: newMsg.midia_nome || null,
        midia_tipo: newMsg.midia_tipo || null,
        emoji: newMsg.emoji || null,
        enviado_por_admin: newMsg.enviado_por_admin,
        criado_em: newMsg.criado_em
      });
    } catch (err: any) {
      console.warn("[Suporte] Falha ao sincronizar com banco remoto. Salvo localmente.", err.message);
    }
  };

  // Quick action: Tap emoji to append or select it
  const handleQuickEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setShowEmojiPicker(false);
  };

  // Group messages for Admin view
  // Each unique (dispositivo_id) represents a private conversation
  const sessionsMap: Record<string, { lastMsg: SupportMessage; userName: string; unreadCount: number }> = {};
  messages.forEach(m => {
    if (m && m.dispositivo_id && m.criado_em) {
      const prevEntry = sessionsMap[m.dispositivo_id];
      const isNewer = !prevEntry || safeGetTime(m.criado_em) > safeGetTime(prevEntry.lastMsg.criado_em);
      
      const sessionUserName = m.enviado_por_admin ? (prevEntry?.userName || "Utilizador Desconhecido") : (m.nome_usuario || "Utilizador");
      
      let isUnread = false;
      if (!m.enviado_por_admin && m.dispositivo_id !== selectedSessionId) {
        isUnread = true;
      }

      sessionsMap[m.dispositivo_id] = {
        lastMsg: isNewer ? m : (prevEntry?.lastMsg || m),
        userName: sessionUserName && sessionUserName !== "Suporte Escola da Fé" ? sessionUserName : (prevEntry?.userName || sessionUserName),
        unreadCount: (prevEntry?.unreadCount || 0) + (isUnread ? 1 : 0)
      };
    }
  });

  const sessions = Object.keys(sessionsMap).map(id => ({
    dispositivo_id: id,
    ...sessionsMap[id]
  })).sort((a, b) => {
    const timeA = safeGetTime(a.lastMsg?.criado_em);
    const timeB = safeGetTime(b.lastMsg?.criado_em);
    return timeB - timeA;
  });

  // Filter messages for current view active thread
  const activeThreadMessages = messages.filter(m => {
    if (m && m.dispositivo_id) {
      if (isAdmin) {
        return m.dispositivo_id === selectedSessionId;
      } else {
        return m.dispositivo_id === deviceId;
      }
    }
    return false;
  });

  // Automatically select first user session for admin if none is selected
  const firstSessionId = sessions.length > 0 ? sessions[0].dispositivo_id : null;
  useEffect(() => {
    if (isAdmin && firstSessionId && !selectedSessionId) {
      setSelectedSessionId(firstSessionId);
    }
  }, [isAdmin, firstSessionId, selectedSessionId]);  // Filter messages for the table view
  const tableFilteredMessages = messages.filter(m => {
    if (!isAdmin && m.dispositivo_id !== deviceId) {
      return false;
    }
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchText = (m.mensagem || "").toLowerCase().includes(q);
      const matchUser = (m.nome_usuario || "").toLowerCase().includes(q);
      const matchId = (m.dispositivo_id || "").toLowerCase().includes(q);
      if (!matchText && !matchUser && !matchId) return false;
    }
    if (filterType === "admin" && !m.enviado_por_admin) return false;
    if (filterType === "user" && m.enviado_por_admin) return false;
    if (filterType === "attachment" && !m.midia_url) return false;
    if (filterType === "emoji" && !m.emoji) return false;
    return true;
  });

  const exportToCSV = () => {
    try {
      const headers = ["ID", "Dispositivo ID", "Nome do Usuario", "Mensagem", "Reacao", "Enviado por Admin", "Data de Criacao"];
      const rows = tableFilteredMessages.map(m => [
        m.id,
        m.dispositivo_id,
        m.nome_usuario || "",
        (m.mensagem || "").replace(/"/g, '""'),
        m.emoji || "",
        m.enviado_por_admin ? "Sim" : "Nao",
        m.criado_em
      ]);
      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
        + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `escola_da_fe_suporte_mensagens_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
      alert("Erro ao exportar arquivo CSV.");
    }
  };

  const exportToJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tableFilteredMessages, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `escola_da_fe_suporte_mensagens_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error(e);
      alert("Erro ao exportar arquivo JSON.");
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Top Controls Layout Header */}
      <div id="suporte-controle-abas-bar" className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2rem] p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500/10 dark:bg-amber-500/10 text-[#cfaf72] rounded-2xl flex items-center justify-center shadow-inner">
            <LifeBuoy size={24} className="stroke-[#cfaf72] animate-bounce duration-3000" />
          </div>
          <div>
            <h2 className="text-xl font-black text-heading flex items-center gap-2">
              Suporte & Mensagens
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">
              {isAdmin 
                ? "Painel Gerencial de Atendimentos, Reações, Comprovativos e Histórico Legal."
                : "Seu Histórico de Dúvidas, Envio de Dízimos/Ofertas de Apoio."}
            </p>
          </div>
        </div>
        
        {/* Toggle Mode buttons */}
        {isAdmin && (
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 rounded-2xl p-1.5 border border-slate-150/40 dark:border-white/5 w-full md:w-auto overflow-hidden shadow-inner flex-wrap md:flex-nowrap">
            <button
              type="button"
              onClick={() => setViewMode("chat")}
              className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                viewMode === "chat"
                  ? "bg-[#cfaf72] text-slate-950 shadow-md transform scale-102 font-black"
                  : "text-slate-500 dark:text-slate-400 hover:text-[#cfaf72] dark:hover:text-amber-400 font-bold"
              }`}
            >
              <MessageSquare size={14} /> Atendimento (Chat)
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-[#cfaf72] text-slate-950 shadow-md transform scale-102 font-black"
                  : "text-slate-500 dark:text-slate-400 hover:text-[#cfaf72] dark:hover:text-amber-400 font-bold"
              }`}
            >
              <Database size={14} /> Tabela Gerencial
            </button>
            <button
              type="button"
              onClick={() => setViewMode("users")}
              className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                viewMode === "users"
                  ? "bg-[#cfaf72] text-slate-950 shadow-md transform scale-102 font-black"
                  : "text-slate-500 dark:text-slate-400 hover:text-[#cfaf72] dark:hover:text-amber-400 font-bold"
              }`}
            >
              <User size={14} /> Lista de Usuários
            </button>
          </div>
        )}
      </div>

      {viewMode === "chat" ? (
        <div id="suporte-aba-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[500px]">
          
          {/* LEFT COLUMN: Admin Session List (Only visible when isAdmin is true) */}
          {isAdmin && (
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2rem] p-6 shadow-xl flex flex-col h-[650px]">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <Shield size={14} className="text-emerald-400" />
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Moderação</span>
                  </div>
                  <h4 className="text-xl font-black text-heading">Conversas Ativas</h4>
                </div>
                <button 
                  onClick={() => loadMessages(false)}
                  className="p-2 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-slate-500 dark:text-slate-400 transition-all cursor-pointer"
                  title="Sincronizar"
                >
                  <RefreshCw size={15} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                {sessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 dark:text-slate-500 py-10">
                    <LifeBuoy size={40} className="stroke-slate-300 dark:stroke-slate-700 mb-3 animate-spin duration-3000" />
                    <p className="text-xs font-bold font-mono">Nenhuma mensagem enviada por utilizadores ainda.</p>
                  </div>
                ) : (
                  sessions.map(sess => {
                    const isActive = sess.dispositivo_id === selectedSessionId;
                    const formattedTime = tryFormatTime(sess.lastMsg.criado_em);
                    return (
                      <button
                        key={sess.dispositivo_id}
                        onClick={() => setSelectedSessionId(sess.dispositivo_id)}
                        className={`w-full text-left p-4 rounded-2xl flex items-start gap-4 transition-all duration-300 border cursor-pointer group active:scale-98 ${
                          isActive 
                            ? "bg-[#cfaf72] border-transparent text-slate-950 shadow-lg shadow-[#cfaf72]/20 font-black" 
                            : "bg-slate-50 dark:bg-white/5 border-slate-150/40 dark:border-transparent hover:border-[#cfaf72]/30 dark:hover:bg-white/10"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#cfaf72]/20 flex items-center justify-center shrink-0 rotate-2">
                          <User size={18} className="text-[#cfaf72] font-black" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs font-black truncate max-w-[120px] ${isActive ? "text-slate-950" : "text-slate-800 dark:text-white group-hover:text-[#cfaf72]"}`}>
                              {sess.userName || "Anônimo"}
                            </span>
                            <span className={`text-[9px] font-mono shrink-0 ${isActive ? "text-slate-950/60" : "text-slate-400 dark:text-slate-500"}`}>
                              {formattedTime}
                            </span>
                          </div>
                          <p className={`text-[11px] truncate leading-tight font-semibold ${isActive ? "text-slate-900" : "text-slate-500 dark:text-slate-400"}`}>
                            {sess.lastMsg.mensagem || (sess.lastMsg.midia_nome ? "📎 Documento / Foto" : "Mensagem rápida...")}
                          </p>
                        </div>
                        {sess.unreadCount > 0 && !isActive && (
                          <span className="shrink-0 w-4 h-4 bg-red-500 text-[9px] text-white rounded-full font-black flex items-center justify-center animate-bounce">
                            {sess.unreadCount}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* RIGHT COLUMN: Chat Window (Occupies full grid when user, or remaining columns when admin) */}
          <div className={`${isAdmin ? "lg:col-span-8" : "lg:col-span-12"} flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2rem] shadow-xl overflow-hidden h-[650px]`}>
            
            {/* Chat Header */}
            <div className="p-6 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#cfaf72]/15 rounded-xl flex items-center justify-center rotate-3 border border-[#cfaf72]/20 shadow-md">
                  <LifeBuoy size={20} className="text-[#cfaf72]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-heading leading-tight">
                    {isAdmin ? (
                      `Conversa com ${sessionsMap[selectedSessionId || ""]?.userName || "Atendimento"}`
                    ) : (
                      "Suporte à Missão & Ajuda"
                    )}
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                    Respostas rápidas da equipe
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isAdmin && (
                  <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border border-emerald-500/15">
                    <CheckCircle2 size={11} />
                    Dispositivo ID Registado
                  </div>
                )}
                <button 
                  onClick={() => loadMessages(false)}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 rounded-xl transition-all cursor-pointer"
                  title="Recarregar histórico"
                >
                  <RefreshCw size={14} className="hover:rotate-180 duration-500" />
                </button>
              </div>
            </div>

            {/* Current user info summary tag line */}
            {!isAdmin && (
              <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex items-center justify-between text-amber-500 text-[10px] font-bold">
                <span>Enviando como: <strong>{userName}</strong> (Identificado)</span>
                <button 
                  type="button"
                  onClick={() => {
                    const next = prompt("Como deseja se identificar no suporte?", userName);
                    if (next) {
                      localStorage.setItem("escola_da_fe_user_name", next);
                      setUserName(next);
                    }
                  }}
                  className="underline uppercase font-black"
                >
                  Alterar
                </button>
              </div>
            )}

            {/* Chat Messages Scrolling Window */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin bg-slate-50/40 dark:bg-[#0b132b]/20">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <RefreshCw size={24} className="text-[#cfaf72] animate-spin mb-3" />
                  <p className="text-xs text-muted font-bold font-mono">Buscando mensagens do servidor...</p>
                </div>
              ) : activeThreadMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto py-12">
                  <div className="w-16 h-16 rounded-full bg-[#cfaf72]/10 flex items-center justify-center mb-4">
                    <LifeBuoy size={28} className="text-[#cfaf72]" />
                  </div>
                  <p className="text-sm font-black text-heading mb-1.5">Olá, tudo bem? Em que podemos ajudar?</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                    Escreva a sua dúvida, envie comprovativos de apoio, envie sugestões, fotos ou documentos em anexo ou selecione emojis de reação! Nossa moderação responderá brevemente.
                  </p>
                </div>
              ) : (
                activeThreadMessages.map(msg => {
                  const isMine = (msg.enviado_por_admin && isAdmin) || (!msg.enviado_por_admin && !isAdmin);
                  const formattedTime = tryFormatTime(msg.criado_em);
                  const isImage = msg.midia_tipo === "image" || (msg.midia_url && msg.midia_url.startsWith("data:image/"));

                  return (
                    <div 
                      key={msg.id}
                      className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold font-mono">
                          {isMine ? "Eu" : msg.nome_usuario}
                        </span>
                        <span className="text-[9px] text-slate-450 dark:text-slate-600 font-mono">
                          {formattedTime}
                        </span>
                      </div>

                      <div className={`relative max-w-[82%] sm:max-w-[70%] p-3.5 sm:p-4 rounded-2xl shadow-sm text-xs sm:text-sm border ${
                        isMine 
                          ? "bg-[#1C2541] dark:bg-slate-800 text-white border-transparent rounded-tr-none" 
                          : "bg-white dark:bg-[#1C2541] text-slate-800 dark:text-slate-100 border-slate-150/40 dark:border-white/5 rounded-tl-none"
                      }`}>
                        {/* Optional Highlighted Emoji */}
                        {msg.emoji && (
                          <span className="text-2xl mr-2 block mb-2 float-left select-none animate-pulse">
                            {msg.emoji}
                          </span>
                        )}

                        {/* Text Message */}
                        {msg.mensagem && (
                          <p className="whitespace-pre-wrap leading-relaxed font-semibold">
                            {msg.mensagem}
                          </p>
                        )}

                        {/* Media File Preview or Download */}
                        {msg.midia_url && (
                          <div className="mt-3 border-t border-slate-100/10 pt-2.5 overflow-hidden">
                            {isImage ? (
                              <div className="relative group rounded-xl overflow-hidden border border-black/10 shadow-sm max-h-[220px]">
                                <img 
                                  src={msg.midia_url} 
                                  alt={msg.midia_nome || "Foto de suporte"} 
                                  className="max-w-full h-auto object-cover rounded-xl"
                                  referrerPolicy="no-referrer"
                                />
                                <a 
                                  href={msg.midia_url}
                                  download={msg.midia_nome || "suporte_foto.png"}
                                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs"
                                  referrerPolicy="no-referrer"
                                >
                                  <Download size={15} /> Baixar Foto
                                </a>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between gap-3 p-3 bg-slate-50/10 dark:bg-white/5 border border-white/5 rounded-xl">
                                <div className="flex items-center gap-2 min-w-0">
                                  <FileText size={20} className="text-[#cfaf72] shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-[11px] font-bold truncate text-heading leading-tight">{msg.midia_nome || "Documento"}</p>
                                    <p className="text-[9px] text-[#cfaf55] font-black uppercase tracking-wider font-mono">COMPROVANTE / LEGAL</p>
                                  </div>
                                </div>
                                <a 
                                  href={msg.midia_url} 
                                  download={msg.midia_nome || "documento_suporte.pdf"}
                                  className="p-1 px-3 bg-[#cfaf72] hover:bg-white rounded-lg text-slate-950 text-[10px] font-black uppercase flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                                  referrerPolicy="no-referrer"
                                >
                                  <FileDown size={11} /> Baixar
                                </a>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Delete trigger - ADMIN ONLY or Owner within 5 minutes */}
                        {isAdmin && (
                          <button 
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="absolute -bottom-2 -left-2 p-1.5 bg-red-100 hover:bg-red-200 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 text-red-500 rounded-full transition-all opacity-0 hover:opacity-100 group-hover:opacity-100 shadow-md"
                            title="Apagar mensagem"
                          >
                            <Trash size={10} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Selected Highlight Emojis / Preview Banner before dispatching */}
            {(selectedEmoji || attachment) && (
              <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  {selectedEmoji && (
                    <div className="flex items-center gap-1.5 bg-accent/20 text-accent px-3 py-1 rounded-xl text-xs font-bold border border-accent/25">
                      <span className="text-base select-none">{selectedEmoji}</span>
                      Reação Aplicada
                      <button onClick={() => setSelectedEmoji("")} className="text-slate-400 hover:text-red-500 ml-1">✕</button>
                    </div>
                  )}
                  {attachment && (
                    <div className="flex items-center gap-2 bg-[#cfaf72]/15 text-[#cfaf72] px-3 py-1 rounded-xl text-xs font-semibold border border-[#cfaf72]/20">
                      {attachment.type === "image" ? <ImageIcon size={13} /> : <FileText size={13} />}
                      <span className="max-w-[150px] truncate">{attachment.name}</span>
                      <button onClick={() => setAttachment(null)} className="text-slate-400 hover:text-red-500 ml-1">✕</button>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono font-bold uppercase">Pré-visualização pendente</span>
              </div>
            )}

            {/* Input Text Form & Send Bars */}
            <form onSubmit={handleSendMessage} className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5 flex flex-col gap-3 shrink-0">
              
              <div className="flex items-center gap-2">
                {/* Quick emoji ribbon */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none flex-1">
                  {QUICK_EMOJIS.map(emo => (
                    <button
                      type="button"
                      key={emo}
                      onClick={() => handleQuickEmojiSelect(emo)}
                      className={`text-base p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg active:scale-90 transition-all cursor-pointer select-none ${selectedEmoji === emo ? "bg-accent/20 scale-110" : ""}`}
                    >
                      {emo}
                    </button>
                  ))}
                </div>

                {/* Manual emoji drawer icon toggle */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`p-2 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-[#cfaf72] rounded-xl transition-all cursor-pointer ${showEmojiPicker ? "text-[#cfaf72] bg-slate-100 dark:bg-white/5" : ""}`}
                    title="Inserir Reação"
                  >
                    <Smile size={18} />
                  </button>
                  
                  <AnimatePresence>
                    {showEmojiPicker && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute bottom-full right-0 mb-2 p-3 bg-white dark:bg-[#1C2541] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-40 grid grid-cols-6 gap-2 w-48 text-center"
                      >
                        {QUICK_EMOJIS.map(emo => (
                          <button
                            type="button"
                            key={emo + "_dw"}
                            onClick={() => handleQuickEmojiSelect(emo)}
                            className="text-lg p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer select-none"
                          >
                            {emo}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Attachment inputs */}
                <div className="relative shrink-0">
                  <input
                    type="file"
                    id="support-file-input"
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="support-file-input"
                    className={`p-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-transparent hover:border-slate-300 dark:hover:border-white/10 text-slate-500 dark:text-slate-400 rounded-2xl transition-all cursor-pointer flex items-center justify-center relative ${isUploading ? "animate-pulse" : ""}`}
                    title="Anexar Comprovativo, Documento ou Imagem"
                  >
                    <Paperclip size={18} />
                    {isUploading && (
                      <span className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                        <RefreshCw size={11} className="text-white animate-spin" />
                      </span>
                    )}
                  </label>
                </div>

                {/* Input message text bar */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Digite sua mensagem de suporte..."
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-white rounded-2xl py-3.5 px-5 text-sm font-semibold focus:outline-none focus:border-accent"
                  maxLength={1500}
                />

                {/* Send trigger */}
                <button
                  type="submit"
                  className="p-3.5 bg-[#cfaf72] hover:bg-white text-slate-900 hover:text-slate-900 font-bold border border-[#cfaf72] rounded-2xl shadow-lg active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Mandar Mensagem"
                >
                  <Send size={18} />
                </button>
              </div>

            </form>
          </div>

        </div>
      ) : viewMode === "table" ? (
        /* TABLE INTERACTIVE VIEW */
        <div id="suporte-view-table-section" className="space-y-6">
          
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">Total de Mensagens</span>
              <p className="text-2xl font-black text-heading font-mono">{tableFilteredMessages.length}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">Conversas / Alunos</span>
              <p className="text-2xl font-black text-heading font-mono">
                {new Set(tableFilteredMessages.map(m => m.dispositivo_id)).size}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">Documentos & Comprovantes</span>
              <p className="text-2xl font-black text-[#cfaf72] font-mono">
                {tableFilteredMessages.filter(m => m.midia_url).length}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Reações / Emojis</span>
              <p className="text-2xl font-black text-amber-500 font-mono">
                {tableFilteredMessages.filter(m => m.emoji).length}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2rem] p-6 shadow-xl space-y-4">
            
            {/* Table Header Filter Options */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                {/* Search query box */}
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrar por nome, mensagem ou dispositivo..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-white rounded-xl py-2.5 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-accent"
                  />
                  {searchQuery && (
                    <button 
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 text-xs font-black"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Dropdown status filtration */}
                <div className="relative shrink-0 flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-1.5 text-xs">
                  <Filter size={13} className="text-[#cfaf72]" />
                  <select
                    value={filterType}
                    onChange={(e: any) => setFilterType(e.target.value)}
                    className="bg-transparent text-slate-700 dark:text-slate-300 font-bold focus:outline-none border-none py-1 cursor-pointer max-w-[150px]"
                  >
                    <option value="all" className="dark:bg-slate-800">Todas as Mensagens</option>
                    <option value="user" className="dark:bg-slate-800">Apenas Alunos</option>
                    <option value="admin" className="dark:bg-slate-800">Apenas Moderadores</option>
                    <option value="attachment" className="dark:bg-slate-800">Com Anexo/Mídia</option>
                    <option value="emoji" className="dark:bg-slate-800">Com Reações</option>
                  </select>
                </div>
              </div>

              {/* CSV & JSON Export actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={exportToCSV}
                  className="px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-black uppercase tracking-wider border border-emerald-500/15 flex items-center gap-2 transition-all cursor-pointer"
                  title="Exportar dados para Excel/CSV"
                >
                  <Download size={13} /> Exportar CSV
                </button>
                <button
                  type="button"
                  onClick={exportToJSON}
                  className="px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-[#cfaf72] rounded-xl text-xs font-black uppercase tracking-wider border border-white/5 flex items-center gap-2 transition-all cursor-pointer"
                  title="Exportar dados em formato JSON"
                >
                  <Database size={13} /> Exportar JSON
                </button>
              </div>
            </div>

            {/* Actual Table Body rendering */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-white/5">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-white/5">
                    <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Remetente</th>
                    <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Papel</th>
                    <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Mensagem</th>
                    <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Ficheiro/Anexo</th>
                    <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Reação</th>
                    <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Hora / Envio</th>
                    <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {tableFilteredMessages.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400 dark:text-slate-500">
                        <Database size={32} className="mx-auto mb-2 opacity-40 animate-pulse" />
                        <p className="text-xs font-black font-mono">Nenhuma mensagem atendeu os filtros informados.</p>
                      </td>
                    </tr>
                  ) : (
                    tableFilteredMessages.map((msg) => {
                      const formattedDate = tryFormatDateTime(msg.criado_em);

                      const isImage = msg.midia_tipo === "image" || (msg.midia_url && msg.midia_url.startsWith("data:image/"));

                      return (
                        <tr 
                          key={msg.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all text-xs"
                        >
                          {/* Sender User & Device info info */}
                          <td className="p-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-white/5 flex items-center justify-center text-slate-500 shrink-0">
                                <User size={14} />
                              </div>
                              <div className="min-w-0">
                                <p className="font-extrabold text-slate-850 dark:text-white truncate max-w-[150px]">
                                  {msg.nome_usuario || "Anónimo / Visitante"}
                                </p>
                                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold font-mono truncate max-w-[120px]">
                                  {msg.dispositivo_id}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Role Badge Aluno vs Atendimento */}
                          <td className="p-4">
                            {msg.enviado_por_admin ? (
                              <span className="p-1 px-2.5 bg-emerald-500/10 text-emerald-400 font-black tracking-wide uppercase text-[9px] rounded-lg border border-emerald-500/15">
                                Suporte
                              </span>
                            ) : (
                              <span className="p-1 px-2.5 bg-cyan-500/10 text-cyan-400 font-black tracking-wide uppercase text-[9px] rounded-lg border border-cyan-500/15">
                                Aluno
                              </span>
                            )}
                          </td>

                          {/* Message Content Body row */}
                          <td className="p-4 max-w-sm">
                            <p 
                              className="font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[280px]"
                              title={msg.mensagem}
                            >
                              {msg.mensagem || <span className="text-slate-400 italic font-medium">Sem texto (Apenas mídia)</span>}
                            </p>
                          </td>

                          {/* Document attachment column */}
                          <td className="p-4">
                            {msg.midia_url ? (
                              <div className="flex items-center gap-2">
                                {isImage ? (
                                  <ImageIcon size={13} className="text-emerald-400 shrink-0" />
                                ) : (
                                  <FileText size={13} className="text-[#cfaf72] shrink-0" />
                                )}
                                <a
                                  href={msg.midia_url}
                                  download={msg.midia_nome || "suporte_anexo"}
                                  className="text-[10px] font-black underline tracking-wide text-indigo-400 dark:text-amber-400 hover:text-white truncate max-w-[100px]"
                                  title={`Baixar ${msg.midia_nome || "anexo"}`}
                                  referrerPolicy="no-referrer"
                                >
                                  {msg.midia_nome || "Descarregar"}
                                </a>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-medium italic">-</span>
                            )}
                          </td>

                          {/* Reaction Emoji column */}
                          <td className="p-4 text-base font-bold">
                            {msg.emoji || "-"}
                          </td>

                          {/* DateTime output */}
                          <td className="p-4 text-slate-400 dark:text-slate-500 font-mono font-bold leading-none text-[10px]">
                            {formattedDate}
                          </td>

                          {/* Actions Panel */}
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Open current chat tab action trigger */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSessionId(msg.dispositivo_id);
                                  setViewMode("chat");
                                }}
                                className="p-2 bg-slate-50 dark:bg-white/5 hover:bg-[#cfaf72] hover:text-slate-950 border border-slate-200 dark:border-white/5 rounded-lg text-slate-650 dark:text-slate-300 transition-all font-black uppercase tracking-wide text-[10px] flex items-center gap-1 cursor-pointer"
                                title="Visualizar esta conversa no chat de atendimento"
                              >
                                <MessageSquare size={11} /> Chat
                              </button>

                              {/* Delete option */}
                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="p-2 bg-rose-500/10 hover:bg-rose-500 hover:text-white rounded-lg text-rose-500 transition-all cursor-pointer"
                                  title="Excluir mensagem permanente"
                                >
                                  <Trash size={11} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold font-mono text-center md:text-left mt-2 flex items-center justify-center md:justify-start gap-1">
              <Database size={11} /> Total filtrado: {tableFilteredMessages.length} linhas de interações encontradas.
            </div>

          </div>

        </div>
      ) : (
        /* LISTA DE TODOS OS USUÁRIOS */
        <div id="suporte-lista-usuarios-seccao" className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2rem] p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
              <div>
                <h3 className="text-xl font-black text-heading">Público Ativo & Dispositivos</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">Instalações registradas no banco de dados geral de alunos.</p>
              </div>
              <button
                type="button"
                onClick={loadDispositivos}
                className="px-4 py-2 bg-slate-50 dark:bg-white/5 hover:bg-[#cfaf72] hover:text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 border border-slate-150 dark:border-white/10 shrink-0 transition-all cursor-pointer"
                disabled={loadingDispositivos}
              >
                <RefreshCw size={13} className={loadingDispositivos ? "animate-spin" : ""} /> {loadingDispositivos ? "Carregando..." : "Sincronizar"}
              </button>
            </div>

            {loadingDispositivos ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <RefreshCw size={32} className="text-[#cfaf72] animate-spin mb-3" />
                <p className="text-xs text-slate-450 dark:text-slate-500 font-bold font-mono">Requisitando banco de dados geral...</p>
              </div>
            ) : dispositivos.length === 0 ? (
              <div className="text-center py-20 text-slate-400 dark:text-slate-500 space-y-2">
                <User size={40} className="mx-auto text-slate-300 dark:text-slate-700 animate-pulse" />
                <p className="text-sm font-bold font-mono">Nenhum dispositivo encontrado no servidor.</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">Os registros de dispositivos são gerados no momento em que os alunos acessam o aplicativo.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-white/5">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-white/5">
                      <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Nome / Identificação</th>
                      <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Sistema Operativo (OS)</th>
                      <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Navegador</th>
                      <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Instalação PWA</th>
                      <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Última Atividade</th>
                      <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 text-right">Contatos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {dispositivos.map((dev) => {
                      const installTime = tryFormatDateTime(dev.installed_at || dev.criado_em);
                      const activeTime = tryFormatDateTime(dev.last_active_at);

                      return (
                        <tr key={dev.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all text-xs">
                          <td className="p-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#cfaf72] flex items-center justify-center shrink-0">
                                <User size={14} />
                              </div>
                              <div className="min-w-0">
                                <p className="font-extrabold text-[#1C2541] dark:text-white truncate max-w-[150px]">
                                  {dev.name || "Visitante Anónimo"}
                                </p>
                                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono truncate max-w-[110px]">
                                  ID: {dev.device_id || dev.id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="p-1 px-2.5 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] rounded-lg">
                              {dev.os || "Desconhecido"}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-slate-500 dark:text-slate-400">{dev.browser || "Desconhecido"}</span>
                          </td>
                          <td className="p-4">
                            {dev.is_pwa || dev.is_pwa === 1 ? (
                              <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="p-4 text-slate-500 dark:text-slate-400 font-mono font-bold text-[10px]" title={`Registado em: ${installTime}`}>
                            {activeTime || installTime}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSessionId(dev.device_id || dev.id);
                                setViewMode("chat");
                              }}
                              className="p-1.5 px-3 bg-[#cfaf72] hover:bg-white rounded-lg text-slate-950 font-black uppercase text-[9px] transition-all cursor-pointer"
                            >
                              Iniciar Atendimento
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold font-mono text-center md:text-left mt-2 flex items-center justify-center md:justify-start gap-1">
              <User size={11} /> Total de dispositivos catalogados: {dispositivos.length} utilizadores ativos no banco.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
