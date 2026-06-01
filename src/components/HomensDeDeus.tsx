import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Lock, 
  Unlock, 
  X, 
  BookOpen, 
  User, 
  Calendar, 
  FileText, 
  Image as ImageIcon,
  CheckCircle, 
  ShieldAlert,
  Save,
  Clock,
  ExternalLink,
  Check,
  MessageCircle,
  Send,
  AlertCircle,
  Eye,
  EyeOff,
  Megaphone,
  Newspaper
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { ThemeBanner } from "./SimulatedAds";
import { getSupabaseClient, performResilientDbWrite } from "../lib/supabaseClient";

// --- Types ---
export interface HomemDeDeus {
  id: string;
  name: string;
  photoUrl: string; // fallback placeholder allowed
  era: string;      // e.g. "Reforma", "Século XIX"
  story: string;    // Story text (supports paragraphs)
  birthAndDeath: string; // e.g. "1834 - 1892"
  mainLegacy: string; 
  bibleVerse?: string; // Optional biblical text reference
}

export function getBibleVerseForMan(man: HomemDeDeus): { reference: string; text: string } {
  const nameLower = (man?.name || "").toLowerCase();
  const descLower = (man?.story || "").toLowerCase();

  // Highlight Abraham / Father of multitudes as specified across all sections
  if (
    nameLower.includes("abraão") || 
    nameLower.includes("abraao") || 
    descLower.includes("pai de multidões") || 
    descLower.includes("pai de multidoes")
  ) {
    return {
      reference: "Gênesis 17:5",
      text: "Não mais te chamarás Abrão, mas Abraão será o teu nome, pois por pai de uma multidão de nações te tenho posto."
    };
  }

  // Specific mappings for standard Men of God for exceptional concordance
  if (nameLower.includes("spurgeon")) {
    return { reference: "2 Timóteo 4:2", text: "Prega a palavra, insta, quer seja oportuno, quer não, corrige, repreende, exorta com toda a longanimidade." };
  }
  if (nameLower.includes("graham")) {
    return { reference: "2 Timóteo 4:5", text: "Tu, porém, sê sóbrio em tudo, sofre as aflições, faze a obra de um evangelista, cumpre o teu ministério." };
  }
  if (nameLower.includes("lutero")) {
    return { reference: "Romanos 1:17", text: "Visto que a justiça de Deus se revela no evangelho, de fé em fé, como está escrito: O justo viverá de fé." };
  }
  if (nameLower.includes("wesley")) {
    return { reference: "Gálatas 5:6", text: "Porque, em Jesus Cristo, nem a circuncisão nem a incircuncisão têm valor algum, mas sim a fé que opera pelo amor." };
  }

  const defaultVerse = {
    reference: "Hebreus 13:7",
    text: "Lembrai-vos dos vossos guias, os quais vos falaram a palavra de Deus, e, atentando para o resultado da sua vida, imitai a sua fé."
  };

  if (!man || !man.bibleVerse) {
    return defaultVerse;
  }

  // Support splitting by common delimiters
  const splitters = [" — ", " - ", " – "];
  for (const splitter of splitters) {
    if (man.bibleVerse.includes(splitter)) {
      const parts = man.bibleVerse.split(splitter);
      return {
        reference: parts[0].trim(),
        text: parts.slice(1).join(splitter).trim()
      };
    }
  }

  return {
    reference: "Referência Bíblica",
    text: man.bibleVerse
  };
}

const EXCLUDED_IDS = ["spurgeon", "billy_graham", "lutero", "john_wesley"];

export const isMockedItem = (item: HomemDeDeus) => {
  if (!item) return true;
  const idLower = (item.id || "").toLowerCase();
  const nameLower = (item.name || "").toLowerCase();
  if (EXCLUDED_IDS.includes(idLower)) return true;
  if (nameLower.includes("spurgeon")) return true;
  if (nameLower.includes("billy graham") || nameLower.includes("billy_graham")) return true;
  if (nameLower.includes("lutero") || nameLower.includes("luther")) return true;
  if (nameLower.includes("wesley")) return true;
  return false;
};

export default function HomensDeDeusView({ 
  isAdmin: propIsAdmin,
  triggerConfirm
}: { 
  isAdmin?: boolean;
  triggerConfirm?: (title: string, message: string, onConfirm: () => void) => void;
}) {
  const [items, setItems] = useState<HomemDeDeus[]>(() => {
    try {
      const saved = localStorage.getItem("escola_mural_homens");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(() => {
    try {
      const saved = localStorage.getItem("escola_mural_homens");
      return saved ? JSON.parse(saved).length === 0 : true;
    } catch {
      return true;
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedEra, setSelectedEra] = useState<string>("todos");
  const [selectedMan, setSelectedMan] = useState<HomemDeDeus | null>(null);

  const [isInBooklet, setIsInBooklet] = useState(false);
  const [hiddenIds, setHiddenIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("escola_da_fe_hidden_men_ids");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Device ID for tracking offline reactions & commenting
  const [deviceId, setDeviceId] = useState<string>(() => {
    const saved = localStorage.getItem("escola_da_fe_device_id");
    if (saved) return saved;
    const newId = "dev_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("escola_da_fe_device_id", newId);
    return newId;
  });

  const [comments, setComments] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("escola_mural_comments");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [reactions, setReactions] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("escola_mural_reactions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [commentNames, setCommentNames] = useState<Record<string, string>>({});
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  // Comments editing states
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>("");
  const lastCommentTime = React.useRef<number>(0);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    localStorage.setItem("escola_mural_homens", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("escola_mural_comments", JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem("escola_mural_reactions", JSON.stringify(reactions));
  }, [reactions]);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Helper functions for commentary and reactions
  const getCommentsCount = (manId: string) => {
    return comments.filter((c) => c.post_id === manId).length;
  };

  const getBiographyComments = (manId: string) => {
    return comments
      .filter((c) => c.post_id === manId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  };

  const getReactionsCount = (manId: string, type: string) => {
    return reactions.filter((r) => r.post_id === manId && r.type === type).length;
  };

  const getMyReaction = (manId: string) => {
    return reactions.find((r) => r.post_id === manId && r.device_id === deviceId)?.type;
  };

  const isCommentOwner = (com: any) => {
    if (isAdmin) return true;
    if (!com) return false;
    if (com.device_id === deviceId) return true;
    try {
      const myIds = JSON.parse(localStorage.getItem("escola_mural_my_comment_ids") || "[]");
      return myIds.includes(com.id);
    } catch {
      return false;
    }
  };

  const handleToggleReaction = async (manId: string, reactionType: string) => {
    const existingReaction = reactions.find(
      (r) => r.post_id === manId && r.device_id === deviceId
    );

    let updatedReactions: any[] = [...reactions];
    const newId = "react_" + manId + "_" + deviceId;

    if (existingReaction) {
      if (existingReaction.type === reactionType) {
        // Toggle off
        updatedReactions = updatedReactions.filter((r) => r.id !== existingReaction.id);
        setReactions(updatedReactions);
        localStorage.setItem("escola_mural_reactions", JSON.stringify(updatedReactions));

        try {
          await fetch(`/api/db/reactions/${existingReaction.id}`, { method: "DELETE" });
        } catch (e) {
          console.warn("Offline cache update used.", e);
        }
      } else {
        // Change reaction type
        updatedReactions = updatedReactions.map((r) => {
          if (r.id === existingReaction.id) {
            return { ...r, type: reactionType };
          }
          return r;
        });
        setReactions(updatedReactions);
        localStorage.setItem("escola_mural_reactions", JSON.stringify(updatedReactions));

        try {
          await fetch("/api/db/reactions/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: existingReaction.id,
              post_id: manId,
              type: reactionType,
              device_id: deviceId
            })
          });
        } catch (e) {
          console.warn(e);
        }
      }
    } else {
      // New reaction
      const newReaction = {
        id: newId,
        post_id: manId,
        type: reactionType,
        device_id: deviceId,
        created_at: new Date().toISOString()
      };
      updatedReactions.push(newReaction);
      setReactions(updatedReactions);
      localStorage.setItem("escola_mural_reactions", JSON.stringify(updatedReactions));

      try {
        await fetch("/api/db/reactions/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReaction)
        });
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleAddComment = async (manId: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentTexts[manId]?.trim();
    const authorName = commentNames[manId]?.trim() || "Anónimo";

    if (!commentText) return;

    const now = Date.now();
    if (now - lastCommentTime.current < 3000) {
      showToast("Por favor, guarde 3 segundos entre comentários.", "error");
      return;
    }
    lastCommentTime.current = now;

    const newCommentId = "comment_" + Date.now() + "_" + Math.random().toString(36).substring(2, 5);
    const newCommentObj = {
      id: newCommentId,
      post_id: manId,
      name: authorName,
      comment: commentText,
      device_id: deviceId,
      created_at: new Date().toISOString()
    };

    const updatedComments = [...comments, newCommentObj];
    setComments(updatedComments);
    localStorage.setItem("escola_mural_comments", JSON.stringify(updatedComments));
    try {
      const myIds = JSON.parse(localStorage.getItem("escola_mural_my_comment_ids") || "[]");
      myIds.push(newCommentId);
      localStorage.setItem("escola_mural_my_comment_ids", JSON.stringify(myIds));
    } catch (err) {
      console.warn(err);
    }
    setCommentTexts(prev => ({ ...prev, [manId]: "" }));
    showToast("Comentário publicado!");

    try {
      const response = await fetch("/api/db/comments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCommentObj)
      });
      if (!response.ok) throw new Error("Sync failure");
    } catch {
      console.warn("Comentário salvo em cache local devido à fraca rede.");
    }
  };

  const askConfirm = (title: string, message: string, onConfirm: () => void) => {
    if (triggerConfirm) {
      triggerConfirm(title, message, onConfirm);
    } else {
      if (window.confirm(message)) {
        onConfirm();
      }
    }
  };

  const handleDeleteComment = (commentId: string) => {
    askConfirm(
      "Confirmar Exclusão de Comentário",
      "Deseja realmente apagar permanentemente este comentário?",
      async () => {
        const remaining = comments.filter(c => c.id !== commentId);
        setComments(remaining);
        localStorage.setItem("escola_mural_comments", JSON.stringify(remaining));

        try {
          await fetch(`/api/db/comments/${commentId}`, { method: "DELETE" });
          showToast("Comentário excluído!");
        } catch (e) {
          console.warn(e);
        }
      }
    );
  };

  const handleUpdateComment = async (commentId: string, updatedText: string) => {
    if (!updatedText.trim()) return;

    const updatedComments = comments.map(c => 
      c.id === commentId ? { ...c, comment: updatedText.trim() } : c
    );
    setComments(updatedComments);
    localStorage.setItem("escola_mural_comments", JSON.stringify(updatedComments));

    setEditingCommentId(null);
    setEditingCommentText("");
    showToast("Comentário atualizado!");

    const targetComment = updatedComments.find(c => c.id === commentId);
    if (targetComment) {
      try {
        await fetch("/api/db/comments/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(targetComment)
        });
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleClearReactions = (manId: string) => {
    askConfirm(
      "Confirmar Remoção de Reações",
      "Deseja realmente remover todas as reações desta biografia?",
      async () => {
        const reactionsToRemove = reactions.filter(r => r.post_id === manId);
        const remaining = reactions.filter(r => r.post_id !== manId);
        setReactions(remaining);
        localStorage.setItem("escola_mural_reactions", JSON.stringify(remaining));

        try {
          for (const r of reactionsToRemove) {
            await fetch(`/api/db/reactions/${r.id}`, { method: "DELETE" });
          }
          showToast("Reações limpas!");
        } catch (e) {
          console.warn(e);
        }
      }
    );
  };

  const handleToggleHide = async (id: string) => {
    let nextHidden: string[] = [];
    setHiddenIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      nextHidden = next;
      localStorage.setItem("escola_da_fe_hidden_men_ids", JSON.stringify(next));
      return next;
    });

    // Check pre-update status to show exact prompt
    const wasHidden = hiddenIds.includes(id);
    showToast(wasHidden ? "Biografia agora está visível para todos!" : "Biografia ocultada de alunos!");

    try {
      await performResilientDbWrite("configuracoes", "POST", {
        chave: "hidden_men_ids",
        valor: JSON.stringify(nextHidden)
      });
    } catch (err) {
      console.warn("Falha ao salvar no banco remoto de configuracoes:", err);
    }
  };

  const handleShareAsAnnouncementOrPublication = async (man: HomemDeDeus, type: "comunicado" | "publicacao") => {
    const isAnnouncement = type === "comunicado";
    const prefix = isAnnouncement ? "📢 COMUNICADO" : "📖 PUBLICAÇÃO";
    const descPrefix = isAnnouncement 
      ? `Partilhamos este importante comunicado sobre a vida de ${man.name} (${man.birthAndDeath}).`
      : `Nova publicação de estudo biográfico de ${man.name} (${man.birthAndDeath}).`;

    const newPostId = "anuncio_" + Date.now();
    const dateStr = new Date().toLocaleDateString("pt-BR");
    
    const payload = {
      id: newPostId,
      titulo: `${prefix}: ${man.name}`,
      data_publicacao: dateStr,
      mensagem: `${descPrefix}\n\nLegado Principal: ${man.mainLegacy}\n\n${man.story}`,
      autor: "Lemos Faya de Arcanjo",
      imagem_url: man.photoUrl || ""
    };

    try {
      const res = await fetch("/api/db/postagens/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        window.dispatchEvent(new CustomEvent("refresh-announcements"));
        showToast("Partilhado com sucesso no Mural de Postagens!");
      } else {
        showToast("Erro ao partilhar no Mural.", "error");
      }
    } catch (err) {
      console.warn(err);
      window.dispatchEvent(new CustomEvent("refresh-announcements"));
      showToast("Partilhado e salvo em cache local.", "success");
    }
  };

  // Inicializa o cliente do Supabase no frontend e estabelece a sincronização em tempo real
  useEffect(() => {
    let activeChannel: any = null;
    let isMounted = true;
    let reconnectTimeoutId: any = null;
    let retryDelay = 3000;

    async function setupLiveSync() {
      try {
        const supabase = await getSupabaseClient();
        if (!isMounted) return;

        if (activeChannel) {
          console.log("[Homens Realtime] Removendo canal anterior antes de restabelecer...");
          await supabase.removeChannel(activeChannel);
        }

        if (!supabase) {
          console.warn("Cliente Supabase indisponível no momento. Exibindo dados de fallback.");
          try {
            const res = await fetch("/api/db/load");
            const result = await res.json();
            if (result.success && result.data && isMounted) {
              const fetchedComments = result.data.comments || [];
              const fetchedReactions = result.data.reactions || [];
              setComments(fetchedComments);
              setReactions(fetchedReactions);
              localStorage.setItem("escola_mural_comments", JSON.stringify(fetchedComments));
              localStorage.setItem("escola_mural_reactions", JSON.stringify(fetchedReactions));

              const fetchedConfig = result.data.configuracoes || [];
              const hiddenConf = fetchedConfig.find((c: any) => c.chave === "hidden_men_ids");
              if (hiddenConf) {
                try {
                  const remoteHidden = JSON.parse(hiddenConf.valor);
                  if (Array.isArray(remoteHidden)) {
                    setHiddenIds(remoteHidden);
                    localStorage.setItem("escola_da_fe_hidden_men_ids", JSON.stringify(remoteHidden));
                  }
                } catch (e) {
                  console.warn("Erro ao fazer parse de hidden_men_ids local:", e);
                }
              }

              const fetchedHomens = result.data.homens || [];
              if (fetchedHomens.length > 0) {
                const mapped: HomemDeDeus[] = fetchedHomens
                  .map((row: any) => ({
                    id: row.id,
                    name: row.nome || "",
                    story: row.descricao || "",
                    photoUrl: row.imagem || "",
                    era: row.era || "Contemporâneo",
                    birthAndDeath: row.birth_and_death || "Biografia viva",
                    mainLegacy: row.main_legacy || "Servo de Deus",
                    bibleVerse: row.bible_verse || ""
                  }))
                  .filter((it: HomemDeDeus) => !isMockedItem(it));
                setItems(mapped);

                const presentMocked = fetchedHomens.filter((row: any) => isMockedItem({ id: row.id, name: row.nome || "" } as any));
                if (presentMocked.length > 0) {
                  for (const item of presentMocked) {
                    fetch(`/api/db/homens/${item.id}`, { method: "DELETE" }).catch(() => {});
                  }
                }
              }
            }
          } catch (err) {
            console.warn("Erro ao buscar dados locais de comments/reactions/homens:", err);
          }
          setIsLoading(false);
          return;
        }

        // 1. Busca os dados iniciais do Supabase usando select("*")
        const { data, error } = await supabase
          .from("homens_de_deus")
          .select("*")
          .order("created_at", { ascending: false });

        // Busca comentários e reações
        const { data: commentsData } = await supabase
          .from("comments")
          .select("*");
        if (commentsData && isMounted) {
          setComments(commentsData);
          localStorage.setItem("escola_mural_comments", JSON.stringify(commentsData));
        }

        const { data: reactionsData } = await supabase
          .from("reactions")
          .select("*");
        if (reactionsData && isMounted) {
          setReactions(reactionsData);
          localStorage.setItem("escola_mural_reactions", JSON.stringify(reactionsData));
        }

        const { data: configData } = await supabase
          .from("configuracoes_sociais")
          .select("*")
          .eq("chave", "hidden_men_ids");
        if (configData && configData.length > 0 && isMounted) {
          try {
            const remoteHidden = JSON.parse(configData[0].valor);
            if (Array.isArray(remoteHidden)) {
              setHiddenIds(remoteHidden);
              localStorage.setItem("escola_da_fe_hidden_men_ids", JSON.stringify(remoteHidden));
            }
          } catch (e) {
            console.warn("Erro ao fazer parse de hidden_men_ids da nuvem:", e);
          }
        }

        if (!isMounted) return;

        if (error) {
          console.error("Erro ao buscar dados do Supabase:", error);
        } else if (data && data.length > 0) {
          const mapped: HomemDeDeus[] = data
            .map((row: any) => ({
              id: row.id,
              name: row.nome || "",
              story: row.descricao || "",
              photoUrl: row.imagem || "",
              era: row.era || "Contemporâneo",
              birthAndDeath: row.birth_and_death || "Biografia viva",
              mainLegacy: row.main_legacy || "Servo de Deus",
              bibleVerse: row.bible_verse || ""
            }))
            .filter((it: HomemDeDeus) => !isMockedItem(it));
          setItems(mapped);

          const presentMocked = data.filter((row: any) => isMockedItem({ id: row.id, name: row.nome || "" } as any));
          if (presentMocked.length > 0) {
            for (const item of presentMocked) {
              supabase.from("homens_de_deus").delete().eq("id", item.id).then(({ error: delErr }) => {
                if (!delErr) console.log(`Removido com sucesso do banco de dados remoto: ${item.id}`);
              });
              fetch(`/api/db/homens/${item.id}`, { method: "DELETE" }).catch(() => {});
            }
          }
        }

        setIsLoading(false);

        // 2. Registra o canal Realtime para alterações instantâneas (INSERT, UPDATE, DELETE)
        // Usamos um sufixo único para evitar colisões e erros em montagens concorrentes (como no React Strict Mode)
        const uniqueChannelId = `realtime-homens-de-deus-${Math.random().toString(36).substring(2, 10)}`;
        const channel = supabase.channel(uniqueChannelId);
        activeChannel = channel;

        channel
          .on(
            "postgres_changes",
            {
              event: "*", // Escuta todos os eventos em tempo real
              schema: "public",
              table: "homens_de_deus"
            },
            (payload: any) => {
              if (!isMounted) return;
              console.log("Recebido evento em tempo real do Supabase:", payload);
              const eventType = payload.eventType;

              if (eventType === "INSERT") {
                const row = payload.new;
                const newItem: HomemDeDeus = {
                  id: row.id,
                  name: row.nome || "",
                  story: row.descricao || "",
                  photoUrl: row.imagem || "",
                  era: row.era || "Contemporâneo",
                  birthAndDeath: row.birth_and_death || "Biografia viva",
                  mainLegacy: row.main_legacy || "Servo de Deus",
                  bibleVerse: row.bible_verse || ""
                };
                if (!isMockedItem(newItem)) {
                  setItems((prev) => {
                    if (prev.some((it) => it.id === newItem.id)) return prev;
                    return [newItem, ...prev];
                  });
                }
              } else if (eventType === "UPDATE") {
                const row = payload.new;
                const updatedItem: HomemDeDeus = {
                  id: row.id,
                  name: row.nome || "",
                  story: row.descricao || "",
                  photoUrl: row.imagem || "",
                  era: row.era || "Contemporâneo",
                  birthAndDeath: row.birth_and_death || "Biografia viva",
                  mainLegacy: row.main_legacy || "Servo de Deus",
                  bibleVerse: row.bible_verse || ""
                };
                if (isMockedItem(updatedItem)) {
                  setItems((prev) => prev.filter((it) => it.id !== updatedItem.id));
                  setSelectedMan((curr) => curr && curr.id === updatedItem.id ? null : curr);
                } else {
                  setItems((prev) =>
                    prev.map((it) => (it.id === updatedItem.id ? updatedItem : it))
                  );
                  setSelectedMan((curr) =>
                    curr && curr.id === updatedItem.id ? updatedItem : curr
                  );
                }
              } else if (eventType === "DELETE") {
                const oldId = payload.old.id;
                setItems((prev) => prev.filter((it) => it.id !== oldId));
                setSelectedMan((curr) => (curr && curr.id === oldId ? null : curr));
              }
            }
          )
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "comments"
            },
            (payload: any) => {
              if (!isMounted) return;
              if (payload.eventType === "INSERT") {
                setComments(prev => {
                  if (prev.some(c => c.id === payload.new.id)) return prev;
                  return [...prev, payload.new];
                });
              } else if (payload.eventType === "UPDATE") {
                setComments(prev => prev.map(c => c.id === payload.new.id ? payload.new : c));
              } else if (payload.eventType === "DELETE") {
                setComments(prev => prev.filter(c => c.id !== payload.old.id));
              }
            }
          )
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "reactions"
            },
            (payload: any) => {
              if (!isMounted) return;
              if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
                setReactions(prev => {
                  const filtered = prev.filter(r => r.id !== payload.new.id);
                  return [...filtered, payload.new];
                });
              } else if (payload.eventType === "DELETE") {
                setReactions(prev => prev.filter(r => r.id !== payload.old.id));
              }
            }
          );

        if (!isMounted) {
          supabase.removeChannel(channel);
          return;
        }

        channel.subscribe((status: string, err?: any) => {
          console.log(`[Homens Realtime] Status de inscrição do canal (${uniqueChannelId}): ${status}`, err || "");
          if (status === "SUBSCRIBED") {
            retryDelay = 3000; // Reset delay on successful subscription
          } else if (status === "CHANNEL_ERROR" || status === "CLOSED" || status === "TIMED_OUT") {
            console.warn(`[Homens Realtime] Canal desconectado (${status}). Agendando reconexão em ${retryDelay / 1000}s...`);
            if (reconnectTimeoutId) clearTimeout(reconnectTimeoutId);
            reconnectTimeoutId = setTimeout(() => {
              if (isMounted) {
                setupLiveSync();
                // Escalona as retentativas: 3s -> 5s -> 10s
                retryDelay = retryDelay === 3000 ? 5000 : (retryDelay === 5000 ? 10000 : 10000);
              }
            }, retryDelay);
          }
        });

      } catch (err) {
        console.error("Falha ao configurar sincronização em tempo real do Supabase:", err);
        if (isMounted) setIsLoading(false);
      }
    }

    setupLiveSync();

    return () => {
      isMounted = false;
      if (reconnectTimeoutId) clearTimeout(reconnectTimeoutId);
      if (activeChannel) {
        getSupabaseClient().then((sb) => sb?.removeChannel(activeChannel));
      }
    };
  }, []);

  useEffect(() => {
    const checkState = () => {
      if (!selectedMan) {
        setIsInBooklet(false);
        return;
      }
      try {
        const saved = localStorage.getItem("escola_da_fe_booklet");
        const booklet = saved ? JSON.parse(saved) : [];
        setIsInBooklet(booklet.some((bi: any) => bi.id === selectedMan.id));
      } catch {
        setIsInBooklet(false);
      }
    };
    checkState();

    window.addEventListener("booklet-updated", checkState);
    return () => window.removeEventListener("booklet-updated", checkState);
  }, [selectedMan]);

  // Admin Section State
  const [inputCode, setInputCode] = useState("");
  const [localIsAdmin, setLocalIsAdmin] = useState(() => {
    return localStorage.getItem("admin_logged") === "true";
  });
  
  // Combine both prop and local values, so if either is true, the user is an Admin
  const isAdmin = !!(propIsAdmin || localIsAdmin);

  useEffect(() => {
    const handleGlobalAdminChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail !== undefined) {
        setLocalIsAdmin(customEvent.detail);
      }
    };
    window.addEventListener("admin-state-changed", handleGlobalAdminChange);
    return () => window.removeEventListener("admin-state-changed", handleGlobalAdminChange);
  }, []);

  const [adminError, setAdminError] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingItem, setEditingItem] = useState<HomemDeDeus | null>(null);

  // New Homem Form Fields
  const [fieldName, setFieldName] = useState("");
  const [fieldEra, setFieldEra] = useState("");
  const [fieldBirth, setFieldBirth] = useState("");
  const [fieldLegacy, setFieldLegacy] = useState("");
  const [fieldPhoto, setFieldPhoto] = useState("");
  const [fieldStory, setFieldStory] = useState("");
  const [fieldBibleVerse, setFieldBibleVerse] = useState("");

  // Available Era Filters
  const uniqueEras = Array.from(new Set(items.map(item => item.era)));

  // Filter and Search items
  const filtered = items.filter(item => {
    if (!isAdmin && hiddenIds.includes(item.id)) {
      return false;
    }

    const term = search.toLowerCase();
    const matchesSearch = 
      item.name.toLowerCase().includes(term) || 
      item.story.toLowerCase().includes(term) || 
      item.mainLegacy.toLowerCase().includes(term);

    const matchesEra = selectedEra === "todos" || item.era === selectedEra;

    return matchesSearch && matchesEra;
  });

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim() === "ardente94") {
      setLocalIsAdmin(true);
      localStorage.setItem("admin_logged", "true");
      setAdminError("");
      setInputCode("");
      window.dispatchEvent(new CustomEvent("sync-admin-status", { detail: true }));
    } else {
      setAdminError("Código administrativo incorreto. Tente novamente.");
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // RLS & Admin check to prevent illegal modifications
    if (!isAdmin) {
      setAdminError("Operação não permitida. Apenas administradores podem alterar as biografias.");
      return;
    }

    if (!fieldName || !fieldStory) {
      alert("Por favor, preencha pelo menos o Nome e a História.");
      return;
    }

    setIsSaving(true);
    const itemID = editingItem ? editingItem.id : "homem_" + Date.now();
    
    const payload = {
      id: itemID,
      nome: fieldName,
      descricao: fieldStory,
      imagem: fieldPhoto.trim() || `https://images.unsplash.com/photo-${[
        "1544005313-94ddf0286df2",
        "1507003211169-0a1dd7228f2d",
        "1500648767791-00dcc994a43e",
        "1472099645785-5658abf4ff4e"
      ][Math.floor(Math.random() * 4)]}?auto=format&fit=crop&q=80&w=300`,
      era: fieldEra || "Contemporâneo",
      birth_and_death: fieldBirth || "Biografia viva",
      main_legacy: fieldLegacy || "Servo de Deus",
      bible_verse: fieldBibleVerse
    };

    const savedItem: HomemDeDeus = {
      id: itemID,
      name: fieldName,
      story: fieldStory,
      photoUrl: payload.imagem,
      era: payload.era,
      birthAndDeath: payload.birth_and_death,
      mainLegacy: payload.main_legacy,
      bibleVerse: payload.bible_verse
    };

    try {
      // Use helper resiliente que tenta Express proxy e faz fallback automático para Supabase direto no cliente
      await performResilientDbWrite("homens", "POST", payload);

      // Atualização imediata do estado local defensivo
      setItems((prev) => {
        const idx = prev.findIndex((item) => item.id === itemID);
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = savedItem;
          return next;
        } else {
          return [savedItem, ...prev];
        }
      });
      setSelectedMan((curr) => {
        if (curr && curr.id === itemID) {
          return savedItem;
        }
        return curr;
      });

      resetForm();
      setIsAddingNew(false);
    } catch (err: any) {
      console.error("Falha ao salvar no Supabase:", err);
      alert("Erro ao salvar dados biográficos: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFieldName("");
    setFieldEra("");
    setFieldBirth("");
    setFieldLegacy("");
    setFieldPhoto("");
    setFieldStory("");
    setFieldBibleVerse("");
    setEditingItem(null);
  };

  const handleStartEdit = (item: HomemDeDeus, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setFieldName(item.name);
    setFieldEra(item.era);
    setFieldBirth(item.birthAndDeath);
    setFieldLegacy(item.mainLegacy);
    setFieldPhoto(item.photoUrl);
    setFieldStory(item.story);
    setFieldBibleVerse(item.bibleVerse || "");
    setIsAddingNew(true);
  };

  const handleDeleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAdmin) {
      setAdminError("Ação não permitida. Apenas administradores podem apagar dados.");
      return;
    }

    const startDeletion = async () => {
      try {
        // Use helper resiliente que tenta Express proxy e faz fallback automático para Supabase direto no cliente
        await performResilientDbWrite("homens", "DELETE", null, id);

        // Atualização imediata do estado local
        setItems((prev) => prev.filter((it) => it.id !== id));
        setSelectedMan((curr) => (curr && curr.id === id ? null : curr));
      } catch (err: any) {
        console.error("Erro deletando:", err);
        alert("Erro ao excluir biografia do servidor: " + err.message);
      }
    };

    if (triggerConfirm) {
      triggerConfirm(
        "Excluir Homem de Deus",
        "Você tem certeza de que deseja remover permanentemente este Homem de Deus e todo o seu precioso legado histórico?",
        startDeletion
      );
    } else if (window.confirm("Deseja realmente excluir a história deste Homem de Deus?")) {
      startDeletion();
    }
  };

  const handleEditFromModal = () => {
    if (!selectedMan) return;
    setEditingItem(selectedMan);
    setFieldName(selectedMan.name);
    setFieldEra(selectedMan.era);
    setFieldBirth(selectedMan.birthAndDeath);
    setFieldLegacy(selectedMan.mainLegacy);
    setFieldPhoto(selectedMan.photoUrl);
    setFieldStory(selectedMan.story);
    setFieldBibleVerse(selectedMan.bibleVerse || "");
    setIsAddingNew(true);
    setSelectedMan(null); // Close the modal
    // Scroll to the edit form smoothly
    setTimeout(() => {
      const el = document.getElementById("homem-form-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 400, behavior: "smooth" });
      }
    }, 150);
  };

  const handleDeleteFromModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedMan) return;
    handleDeleteItem(selectedMan.id, e);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="space-y-12"
    >
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#cfaf72]/15 text-[#cfaf72] rounded-2xl flex items-center justify-center shadow-sm">
            <Users size={24} />
          </div>
          <div>
            <span className="text-xs font-black text-[#cfaf72] tracking-[0.2em] uppercase">Hagiografia & Biografias</span>
            <h2 className="text-4xl lg:text-5xl font-black text-heading tracking-tight mt-1 leading-none">Homens de Deus</h2>
          </div>
        </div>
        <p className="text-muted text-xl leading-relaxed font-medium max-w-4xl">
          Conheça o testemunho pioneiro, a perseverança de fé e as preciosas obras literárias de homens marcados pelo fogo divino e chamados para guiar nações. O testemunho deles é faísca viva para nossa geração.
        </p>
      </div>

      {/* Theme banner simulation */}
      <ThemeBanner type="discreet" />

      {/* Control Actions (Search, Filters, Admin Entry) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 p-6 md:p-8 bg-white dark:bg-card-dark rounded-[2.5rem] border border-slate-100 dark:border-border-dark shadow-sm">
        
        {/* Search */}
        <div className="relative flex-grow max-w-xl">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Pesquisar histórias, percurso, herança..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900/60 pl-16 pr-6 py-4 rounded-2xl text-sm font-semibold border border-transparent focus:border-[#cfaf72]/30 focus:outline-none dark:text-white transition-all shadow-inner"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSelectedEra("todos")}
            className={cn(
              "px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors",
              selectedEra === "todos" 
                ? "bg-primary text-white shadow-md" 
                : "bg-slate-50 dark:bg-slate-800 text-muted hover:bg-slate-100 dark:hover:bg-slate-700"
            )}
          >
            Todos
          </button>
          {uniqueEras.map(era => (
            <button
              key={era}
              onClick={() => setSelectedEra(era)}
              className={cn(
                "px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors",
                selectedEra === era 
                  ? "bg-primary text-white shadow-md" 
                  : "bg-slate-50 dark:bg-slate-800 text-muted hover:bg-slate-100 dark:hover:bg-slate-700"
              )}
            >
              {era}
            </button>
          ))}
        </div>

        {/* Admin Unlock Area */}
        <div className="border-t xl:border-t-0 xl:border-l border-slate-100 dark:border-border-dark pt-4 xl:pt-0 xl:pl-6 shrink-0 flex items-center justify-end gap-3">
          {isAdmin ? (
            <div className="flex items-center gap-3">
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-black uppercase tracking-wider flex items-center gap-1">
                <Unlock size={12} /> Admin Liberado
              </span>
              <button
                onClick={() => {
                  setIsAddingNew(true);
                  resetForm();
                }}
                className="p-3 bg-accent hover:bg-white text-secondary font-black text-xs rounded-xl transition-all shadow-md shadow-accent/10 flex items-center gap-2"
                title="Cadastrar Novo Homem de Deus"
              >
                <Plus size={16} /> Novo Homem
              </button>
              <button
                onClick={() => {
                  setLocalIsAdmin(false);
                  localStorage.setItem("admin_logged", "false");
                  window.dispatchEvent(new CustomEvent("sync-admin-status", { detail: false }));
                }}
                className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all text-xs font-bold"
                title="Sair do Administrador"
              >
                Sair
              </button>
            </div>
          ) : (
            <form onSubmit={handleAdminVerify} className="flex items-center gap-2">
              <input
                type="password"
                placeholder="Código admin..."
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-36 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-border-dark px-4 py-3 rounded-xl text-xs font-bold focus:outline-none focus:border-[#cfaf72]/30 dark:text-white"
              />
              <button
                type="submit"
                className="py-3 px-4 bg-secondary dark:bg-slate-800 text-white font-black text-xs rounded-xl tracking-wider uppercase hover:bg-primary transition-colors flex items-center gap-1"
                title="Acessar painel de edição"
              >
                <Lock size={12} /> Entrar
              </button>
            </form>
          )}
        </div>
      </div>

      {adminError && (
        <div className="p-4 bg-red-500/5 text-red-500 border border-red-500/10 rounded-2xl flex items-center gap-2.5 text-xs font-semibold">
          <ShieldAlert size={16} />
          {adminError}
        </div>
      )}

      {/* Form modal or section for Adding/Editing */}
      {isAddingNew && (
        <motion.div 
          id="homem-form-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 sm:p-8 bg-gradient-to-tr from-[#16254a]/10 to-transparent dark:from-accent/5 dark:to-transparent rounded-[2.5rem] border border-[#cfaf72]/20 shadow-md space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-border-dark pb-4">
            <h4 className="text-xl font-black text-heading flex items-center gap-2">
              <BookOpen size={20} className="text-[#cfaf72]" />
              {editingItem ? "Editar Perfil de Homem de Deus" : "Cadastrar Novo Perfil de Homem de Deus"}
            </h4>
            <button 
              onClick={() => {
                setIsAddingNew(false);
                resetForm();
              }}
              className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSaveItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-heading uppercase tracking-wider block">Nome Completo</label>
              <input
                type="text"
                placeholder="Ex: Charles Spurgeon"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                className="w-full bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark p-4 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#cfaf72]/30 text-heading"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-heading uppercase tracking-wider block">Época / Era</label>
                <input
                  type="text"
                  placeholder="Ex: Século XIX"
                  value={fieldEra}
                  onChange={(e) => setFieldEra(e.target.value)}
                  className="w-full bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark p-4 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#cfaf72]/30 text-heading"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-heading uppercase tracking-wider block">Anos (Nasc - Morte)</label>
                <input
                  type="text"
                  placeholder="Ex: 1834 – 1892"
                  value={fieldBirth}
                  onChange={(e) => setFieldBirth(e.target.value)}
                  className="w-full bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark p-4 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#cfaf72]/30 text-heading"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-heading uppercase tracking-wider block">Legado Principal</label>
              <input
                type="text"
                placeholder="Ex: O Príncipe dos Pregadores"
                value={fieldLegacy}
                onChange={(e) => setFieldLegacy(e.target.value)}
                className="w-full bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark p-4 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#cfaf72]/30 text-heading"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-heading uppercase tracking-wider block">Foto (Carregar arquivo local ou usar Link)</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... ou link direto da imagem"
                  value={fieldPhoto}
                  onChange={(e) => setFieldPhoto(e.target.value)}
                  className="flex-grow bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark p-4 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#cfaf72]/30 text-heading"
                />
                <label className="cursor-pointer bg-[#0b132b] dark:bg-slate-800 hover:bg-primary text-white border border-transparent px-5 py-4 rounded-xl font-bold text-xs uppercase tracking-wider text-center shrink-0 flex items-center justify-center gap-1.5 transition-all">
                  <ImageIcon size={14} className="text-[#cfaf72]" />
                  Carregar Foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === "string") {
                            setFieldPhoto(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              {fieldPhoto && fieldPhoto.startsWith("data:") && (
                <p className="text-[10px] text-emerald-500 font-extrabold uppercase">✓ Imagem local carregada por completo com sucesso!</p>
              )}
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black text-heading uppercase tracking-wider block">Texto Bíblico / Versículo de Referência Especial</label>
              <input
                type="text"
                placeholder="Exemplo: Hebreus 13:7 - Lembrai-vos dos vossos guias..."
                value={fieldBibleVerse}
                onChange={(e) => setFieldBibleVerse(e.target.value)}
                className="w-full bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark p-4 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#cfaf72]/30 text-heading"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black text-heading uppercase tracking-wider block">Trajetória e História (Estilo Exposição Detalhada)</label>
              <textarea
                placeholder="Escreva extensamente sobre a vida, arrependimento, lições de ministério, livros célebres e o chamado de Deus sobre ele..."
                value={fieldStory}
                onChange={(e) => setFieldStory(e.target.value)}
                rows={8}
                className="w-full bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark p-4 rounded-xl text-sm font-medium focus:outline-none focus:border-[#cfaf72]/30 text-heading leading-relaxed"
                required
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  resetForm();
                }}
                className="px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-muted font-black text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-8 py-3.5 bg-primary text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-secondary transition-all shadow-md flex items-center gap-2"
              >
                <Save size={16} /> Salvar Perfil
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Grid of Men of God - Cohesive Bento Style Layout */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4 bg-white dark:bg-card-dark rounded-[2.5rem] border border-slate-100 dark:border-border-dark shadow-sm">
          <div className="w-12 h-12 border-4 border-[#cfaf72] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-black text-[#cfaf72] tracking-wider uppercase animate-pulse text-center">
            Carregando biografias reais...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center p-16 bg-white dark:bg-card-dark rounded-[2.5rem] border border-slate-100 dark:border-border-dark">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Users size={32} />
          </div>
          <h5 className="font-extrabold text-heading text-lg">Nenhum resultado encontrado</h5>
          <p className="text-xs text-muted font-medium mt-1">Busque por outros nomes ou adicione novos registros liberando o painel administrativo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-8">
          {filtered.map((item, index) => (
            <motion.div
              layout
              key={item.id}
              onClick={() => setSelectedMan(item)}
              className="group cursor-pointer bg-white dark:bg-card-dark border-2 border-transparent hover:border-[#cfaf72]/40 rounded-3xl p-3 sm:p-5 shadow-xl hover:-translate-y-2 transition-all flex flex-col items-center text-center md:flex-row md:items-stretch md:text-left gap-3 sm:gap-6 overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              {/* Photo or dynamic initials */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-32 md:h-40 rounded-full md:rounded-2xl overflow-hidden relative bg-slate-100 dark:bg-slate-800 shrink-0 shadow-inner">
                {item.photoUrl ? (
                  <img 
                    src={item.photoUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // fallback representation
                      (e.target as any).style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                
                {/* Visual Accent representation of initial */}
                <div className="absolute inset-0 flex items-center justify-center font-black text-lg sm:text-2xl md:text-4xl text-slate-200/20 dark:text-slate-700/30">
                  {item.name[0]}
                </div>

                <div className="absolute bottom-0.5 md:bottom-2.5 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-2.5 bg-secondary/80 text-white backdrop-blur-sm px-1 py-0.2 md:px-2 md:py-0.5 rounded-md text-[5px] md:text-[8px] font-black uppercase tracking-wider whitespace-nowrap">
                  {item.era}
                </div>
              </div>

              {/* Text Fields */}
              <div className="flex-grow flex flex-col justify-between py-0.5 w-full">
                <div>
                  <div className="flex items-center justify-center md:justify-between gap-1 sm:gap-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[7px] sm:text-[9px] text-accent font-black uppercase tracking-widest bg-accent/10 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full leading-none">
                        {item.birthAndDeath}
                      </span>
                      {hiddenIds.includes(item.id) && (
                        <span className="text-[7px] sm:text-[9px] text-rose-500 font-black uppercase tracking-widest bg-rose-500/10 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full leading-none flex items-center gap-0.5">
                          <EyeOff size={9} className="shrink-0" /> Ocultado
                        </span>
                      )}
                    </div>
                    
                    {/* Admin Action triggers */}
                    {isAdmin && (
                      <div className="hidden md:flex items-center gap-1">
                        <button
                          onClick={(e) => handleStartEdit(item, e)}
                          className="p-1 sm:p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-accent rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit3 size={11} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteItem(item.id, e)}
                          className="p-1 sm:p-1.5 hover:bg-red-500/10 text-red-400 hover:text-red-500 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    )}
                  </div>

                  <h4 className="text-[11px] sm:text-xs md:text-lg font-black text-heading mt-1 sm:mt-1.5 mb-0.5 tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-[8px] sm:text-[9px] text-[#cfaf72] font-extrabold italic uppercase tracking-wider mb-1 line-clamp-1">
                    {item.mainLegacy}
                  </p>
                  
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-muted leading-relaxed font-semibold line-clamp-2 md:line-clamp-3">
                    {item.story}
                  </p>
                </div>

                <div className="mt-1.5 sm:mt-3 pt-1 sm:pt-2 border-t border-slate-100 dark:border-border-dark flex items-center justify-between text-[6px] sm:text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">
                  <span className="flex items-center gap-0.5 sm:gap-2 leading-none">
                    <span className="flex items-center gap-0.5">
                      <Clock size={8} className="sm:w-2.5 sm:h-2.5" /> <span className="hidden xs:inline">Biografia</span><span className="xs:hidden">Ver</span>
                    </span>
                    {getCommentsCount(item.id) > 0 && (
                      <span className="flex items-center gap-0.5 text-[#cfaf72]">
                        <MessageCircle size={8} className="sm:w-2.5 sm:h-2.5" /> {getCommentsCount(item.id)}
                      </span>
                    )}
                    {reactions.filter(r => r.post_id === item.id).length > 0 && (
                      <span className="flex items-center gap-0.5 text-[#cfaf72]">
                        👍 {reactions.filter(r => r.post_id === item.id).length}
                      </span>
                    )}
                  </span>
                  <ExternalLink size={8} className="text-[#cfaf72] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal with Premium reading layout */}
      <AnimatePresence>
        {selectedMan && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[140] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedMan(null);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.98, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 10, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="bg-white dark:bg-card-dark w-full h-full sm:h-[90vh] sm:max-h-[90vh] sm:max-w-4xl sm:rounded-[2rem] shadow-2xl border-none overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image banner details */}
              <div className="relative bg-[#0b132b] px-5 py-6 sm:px-8 sm:py-8 text-white shrink-0 flex items-center gap-4 sm:gap-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#cfaf72]/10 to-transparent pointer-events-none" />
                
                {selectedMan.photoUrl ? (
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-slate-800 overflow-hidden shrink-0 border-none">
                    <img 
                      src={selectedMan.photoUrl} 
                      alt={selectedMan.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-[#cfaf72] text-[#0b132b] flex items-center justify-center font-black text-xl sm:text-3xl shrink-0">
                    {selectedMan.name[0]}
                  </div>
                )}

                <div className="flex-grow pr-2">
                  <span className="text-[9px] text-accent font-black tracking-widest uppercase block mb-0.5 sm:mb-1">
                    {selectedMan.birthAndDeath} &bull; {selectedMan.era}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-heading tracking-tight text-white leading-tight">
                    {selectedMan.name}
                  </h3>
                  <p className="text-[10px] text-accent/80 font-black tracking-wider uppercase mt-0.5">
                    {selectedMan.mainLegacy}
                  </p>
                </div>

                <button 
                  onClick={() => setSelectedMan(null)}
                  className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl transition-colors z-10 shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Story content */}
              <div className="flex-grow p-4 sm:p-8 md:p-10 overflow-y-auto space-y-6 scrollbar-hide">
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-secondary dark:text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-border-dark pb-2">
                    <FileText size={14} className="text-amber-500 dark:text-amber-400 shrink-0" />
                    Biografia & Trajetória Registrada
                  </h4>
                  <div className="text-slate-700 dark:text-slate-200 leading-relaxed space-y-4 text-[13.5px] sm:text-[14.5px] md:text-[15.5px] text-left">
                    {/* Referência Bíblica integrada na Biografia & Trajetória Registrada */}
                    {(() => {
                      const verse = getBibleVerseForMan(selectedMan);
                      if (!verse.text || verse.text === "N/A") return null;
                      return (
                        <div className="p-4 sm:p-5 bg-amber-500/[0.04] dark:bg-amber-500/[0.02] border-l-4 border-[#cfaf72] rounded-r-2xl mb-5 space-y-1">
                          <p className="text-xs sm:text-sm md:text-base text-slate-800 dark:text-slate-200 italic font-bold leading-relaxed">
                            "{verse.text}"
                          </p>
                          <p className="text-xs text-[#cfaf72] font-black text-right">
                            — {verse.reference}
                          </p>
                        </div>
                      );
                    })()}

                    <div className="whitespace-pre-wrap font-normal">
                      {selectedMan.story}
                    </div>
                  </div>
                </div>

                {/* Libreto compilation action */}
                {selectedMan.story && (
                  <div className="p-4 bg-gradient-to-tr from-[#16254a]/3 to-transparent dark:from-accent/3 dark:to-transparent rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-5 my-1.5">
                    <div className="text-left w-full sm:w-auto">
                      <h5 className="font-extrabold text-[#cfaf72] text-xs sm:text-sm leading-tight flex items-center gap-1.5">
                        <FileText size={16} />
                        Compilar para PDF / Word
                      </h5>
                      <p className="text-[10px] sm:text-xs text-muted font-medium mt-0.5">Reúna até 2 ensinos ou histórias para baixar em documento unificado livremente.</p>
                    </div>
                    <button
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent("add-to-booklet", {
                          detail: {
                            id: selectedMan.id,
                            title: selectedMan.name,
                            category: "Biografia - " + selectedMan.mainLegacy,
                            content: selectedMan.story
                          }
                        }));
                      }}
                      className={cn(
                        "w-full sm:w-auto px-5 py-2.5 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all active:scale-95 shrink-0 flex items-center justify-center gap-1.5",
                        isInBooklet 
                          ? "bg-slate-200 dark:bg-slate-800 text-secondary dark:text-accent" 
                          : "bg-[#0b132b] text-white hover:bg-primary"
                      )}
                    >
                      {isInBooklet ? (
                        <>
                          <Check size={12} className="text-accent" /> Remover do Livreto
                        </>
                      ) : (
                        <>
                          <Plus size={12} /> Adicionar ao Livreto
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Admin controls panel requested by user */}
                {isAdmin && (
                  <div className="p-4 sm:p-5 mt-4 bg-rose-500/5 dark:bg-rose-950/10 border border-rose-500/20 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center gap-2 border-b border-rose-500/15 pb-2">
                      <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                      <h4 className="text-[11px] sm:text-xs font-black text-heading uppercase tracking-wider text-rose-600 dark:text-rose-400">
                        Painel de Controle do Administrador
                      </h4>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
                      {/* Left actions on biography: Editar, Ocultar, Excluir */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            handleEditFromModal();
                          }}
                          className="h-[44px] px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 border border-slate-200 dark:border-slate-700"
                          title="Editar biografia"
                        >
                          <Edit3 size={14} className="text-blue-500" />
                          Editar
                        </button>

                        <button
                          onClick={() => {
                            handleToggleHide(selectedMan.id);
                          }}
                          className={cn(
                            "h-[44px] px-4 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 border",
                            hiddenIds.includes(selectedMan.id)
                              ? "bg-rose-100 hover:bg-rose-200 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900"
                              : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                          )}
                          title={hiddenIds.includes(selectedMan.id) ? "Tornar Visível para Alunos" : "Ocultar de Alunos"}
                        >
                          {hiddenIds.includes(selectedMan.id) ? (
                            <>
                              <Eye size={14} className="text-emerald-500" />
                              Desocultar
                            </>
                          ) : (
                            <>
                              <EyeOff size={14} className="text-orange-500" />
                              Ocultar
                            </>
                          )}
                        </button>

                        <button
                          onClick={(e) => {
                            handleDeleteFromModal(e);
                          }}
                          className="h-[44px] px-4 bg-red-50/10 hover:bg-red-500 text-rose-600 hover:text-white dark:text-red-400 dark:hover:bg-red-950/50 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 border border-red-500/20"
                          title="Excluir biografia permanentemente"
                        >
                          <Trash2 size={13} />
                          Excluir
                        </button>
                      </div>

                      {/* Right actions: Partilhar no mural como Publicação ou Comunicado */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            handleShareAsAnnouncementOrPublication(selectedMan, "publicacao");
                          }}
                          className="h-[44px] px-4 bg-gradient-to-r from-teal-500/10 to-teal-600/10 hover:from-teal-500 hover:to-teal-600 text-teal-600 hover:text-white dark:text-teal-400 dark:hover:text-emerald-500 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 border border-teal-500/25"
                          title="Compartilhar no Mural como Publicação de estudo"
                        >
                          <Newspaper size={14} />
                          Mural: Estudo
                        </button>

                        <button
                          onClick={() => {
                            handleShareAsAnnouncementOrPublication(selectedMan, "comunicado");
                          }}
                          className="h-[44px] px-4 bg-gradient-to-r from-amber-500/10 to-amber-600/10 hover:from-amber-500 hover:to-amber-600 text-amber-600 hover:text-white dark:text-amber-440 dark:hover:text-amber-500 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 border border-amber-500/25"
                          title="Compartilhar no Mural como Comunicado Importante"
                        >
                          <Megaphone size={14} />
                          Mural: Comunicado
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Simulated inline banner */}
                <div className="my-4">
                  <ThemeBanner type="discreet" />
                </div>

                {/* Comentários e Reações de Fé */}
                <div className="border-t border-slate-100 dark:border-border-dark pt-8 space-y-6">
                  {/* Feedback Toast Banner */}
                  <AnimatePresence>
                    {feedback && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-4.5 py-2.5 rounded-xl shadow-lg border border-white/5 font-bold text-xs bg-secondary"
                      >
                        {feedback.type === "success" ? (
                          <CheckCircle size={14} className="text-emerald-400" />
                        ) : (
                          <AlertCircle size={14} className="text-rose-400" />
                        )}
                        <span className="text-white ml-2">{feedback.text}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h4 className="text-xs sm:text-sm font-black text-secondary dark:text-amber-400 uppercase tracking-widest flex items-center gap-2">
                      <MessageCircle size={14} className="text-amber-500" />
                      Reações e Debates ({getCommentsCount(selectedMan.id)})
                    </h4>
                    
                    {/* Reactions Toolbar inside biography detail */}
                    <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-xl border border-slate-100 dark:border-white/5 w-fit">
                      {[
                        { type: "like", emoji: "👍", label: "Gostei" },
                        { type: "love", emoji: "❤️", label: "Excelente" },
                        { type: "wow", emoji: "😮", label: "Impressionado" },
                        { type: "sad", emoji: "😢", label: "Triste" },
                        { type: "fire", emoji: "🔥", label: "Unção" }
                      ].map((rType) => {
                        const myReact = getMyReaction(selectedMan.id);
                        const count = getReactionsCount(selectedMan.id, rType.type);
                        return (
                          <button
                            key={rType.type}
                            onClick={() => handleToggleReaction(selectedMan.id, rType.type)}
                            className={cn(
                              "p-1.5 h-7 gap-1 rounded-lg flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/5 active:scale-90 transition cursor-pointer text-[11px] font-bold",
                              myReact === rType.type ? "bg-accent/10 text-[#cfaf72] scale-105" : "text-slate-400"
                            )}
                            title={rType.label}
                          >
                            <span>{rType.emoji}</span>
                            {count > 0 && <span className="text-2xs font-mono">{count}</span>}
                          </button>
                        );
                      })}
                      {isAdmin && (
                        <button
                          onClick={() => handleClearReactions(selectedMan.id)}
                          className="p-1 px-2.5 ml-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-extrabold text-[9px] uppercase tracking-wider rounded-lg transition active:scale-95 cursor-pointer animate-fade-in"
                          title="Limpar todas as reações alheias"
                        >
                          Limpar Reações
                        </button>
                      )}
                    </div>
                  </div>

                  {/* List of comments */}
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {getBiographyComments(selectedMan.id).length === 0 ? (
                      <p className="text-xs text-center text-muted py-6 font-semibold">Nenhuma reflexão bíblica registrada ainda. Deixe sua palavra de edificação!</p>
                    ) : (
                      getBiographyComments(selectedMan.id).map((com) => (
                        <div 
                          key={com.id} 
                          className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 p-4 rounded-2xl flex items-start gap-3"
                        >
                          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center font-black shrink-0 text-[#cfaf72] text-xs uppercase text-left">
                            {(com.name || "Anônimo").charAt(0)}
                          </div>
                          <div className="space-y-1 text-left flex-grow">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-black text-slate-800 dark:text-white leading-none">
                                {com.name || "Anônimo"}
                              </span>
                              {(com.device_id === deviceId || (isCommentOwner(com) && !isAdmin)) && (
                                <span className="text-[9px] bg-amber-500/10 text-accent rounded-lg px-2 py-0.5 uppercase tracking-wide font-black">Você</span>
                              )}
                              <span className="text-[10px] text-muted font-mono ml-auto">
                                {new Date(com.created_at).toLocaleDateString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            {editingCommentId === com.id ? (
                              <div className="flex gap-2 mt-1.5 w-full items-center">
                                <input
                                  type="text"
                                  value={editingCommentText}
                                  onChange={(e) => setEditingCommentText(e.target.value)}
                                  className="flex-grow bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-xs py-1 px-2 rounded-lg focus:outline-none focus:border-accent font-semibold"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={() => handleUpdateComment(com.id, editingCommentText)}
                                  className="p-1 px-2.5 bg-accent hover:bg-accent-light text-secondary rounded-lg text-[10px] font-extrabold uppercase shrink-0 transition cursor-pointer"
                                >
                                  Salvar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCommentId(null);
                                    setEditingCommentText("");
                                  }}
                                  className="p-1 px-2.5 hover:bg-slate-150 dark:hover:bg-white/5 text-slate-500 rounded-lg text-[10px] font-extrabold uppercase shrink-0 transition cursor-pointer"
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                                  {com.comment}
                                </p>
                                {isCommentOwner(com) && (
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingCommentId(com.id);
                                        setEditingCommentText(com.comment);
                                      }}
                                      className="text-[9px] text-slate-400 hover:text-accent font-black uppercase tracking-wider flex items-center gap-1 transition active:scale-95 cursor-pointer"
                                    >
                                      <Edit3 size={8} /> Editar
                                    </button>
                                    <span className="text-slate-200 dark:text-white/10 text-xs leading-none">•</span>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteComment(com.id)}
                                      className="text-[9px] text-slate-400 hover:text-red-400 font-black uppercase tracking-wider flex items-center gap-1 transition active:scale-95 cursor-pointer"
                                    >
                                      <Trash2 size={8} /> Excluir
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Comment submit form */}
                  <form onSubmit={(e) => handleAddComment(selectedMan.id, e)} className="space-y-2 border-t border-slate-100 dark:border-white/5 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Seu nome (Opcional)"
                        value={commentNames[selectedMan.id] || ""}
                        onChange={(e) => setCommentNames(prev => ({ ...prev, [selectedMan.id]: e.target.value }))}
                        className="sm:col-span-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-xs py-2 px-3 rounded-xl focus:outline-none focus:border-accent font-semibold"
                      />
                      <div className="sm:col-span-2 flex gap-1.5 items-center font-semibold">
                        <input
                          type="text"
                          required
                          placeholder="Edifique com seu comentário bíblico..."
                          value={commentTexts[selectedMan.id] || ""}
                          onChange={(e) => setCommentTexts(prev => ({ ...prev, [selectedMan.id]: e.target.value }))}
                          className="flex-grow bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-xs py-2 px-3 focus:outline-none focus:border-accent rounded-xl font-semibold"
                        />
                        <button
                          type="submit"
                          className="bg-accent hover:bg-accent-light text-secondary font-black text-xs py-2 px-3.5 rounded-xl transition flex items-center justify-center shrink-0 cursor-pointer h-9 w-9"
                          title="Publicar comentário"
                        >
                          <Send size={15} />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Closing quote */}
                <div className="mt-8 p-4 sm:p-6 bg-slate-50/30 dark:bg-slate-800/10 rounded-xl italic text-muted text-[11px] sm:text-xs text-center">
                  "Lembrai-vos dos vossos guias, os quais vos falaram a palavra de Deus, e, atentando para o resultado da sua vida, imitai a sua fé." - Hebreus 13:7
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
