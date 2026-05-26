import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageCircle, 
  ThumbsUp, 
  Heart, 
  Smile, 
  Plus, 
  Trash2, 
  Pencil, 
  Send, 
  Radio, 
  Megaphone,
  User,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Flame,
  Frown,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { getSupabaseClient as getClientClient } from "../lib/supabaseClient";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url: string;
  author: string;
  created_at: string;
}

interface Comment {
  id: string;
  post_id: string;
  name: string;
  comment: string;
  device_id: string;
  created_at: string;
}

interface Reaction {
  id: string;
  post_id: string;
  type: string;
  device_id: string;
  created_at: string;
}

interface Ad {
  id: string;
  title: string;
  image_url: string;
  link: string;
  type: string; // 'banner' | 'native'
  active: boolean;
  created_at: string;
}

export default function Community({ 
  isAdmin, 
  triggerConfirm 
}: { 
  isAdmin: boolean;
  triggerConfirm: (title: string, message: string, onConfirm: () => void) => void;
}) {
  // Device ID for tracking offline reactions & commenting
  const [deviceId, setDeviceId] = useState<string>(() => {
    const saved = localStorage.getItem("escola_da_fe_device_id");
    if (saved) return saved;
    const newId = "dev_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("escola_da_fe_device_id", newId);
    return newId;
  });

  // State Management (with initial cache values for instant loading on poor networks)
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem("escola_mural_posts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const saved = localStorage.getItem("escola_mural_comments");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reactions, setReactions] = useState<Reaction[]>(() => {
    try {
      const saved = localStorage.getItem("escola_mural_reactions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [ads, setAds] = useState<Ad[]>(() => {
    try {
      const saved = localStorage.getItem("escola_mural_ads");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("todas"); // filter by category
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Expanded content tracking
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  // Comments input visibility tracking
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);

  // Form states for Admin Creating/Editing
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState("ensinos");
  const [postImageUrl, setPostImageUrl] = useState("");
  const [postAuthor, setPostAuthor] = useState("Lemos Faya de Arcanjo");

  // Form states for Admin Ads Creation
  const [isAdFormOpen, setIsAdFormOpen] = useState(false);
  const [adTitle, setAdTitle] = useState("");
  const [adImageUrl, setAdImageUrl] = useState("");
  const [adLink, setAdLink] = useState("");
  const [adType, setAdType] = useState("native");

  // Comment input fields
  const [commentNames, setCommentNames] = useState<Record<string, string>>({});
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const lastCommentTime = useRef<number>(0);

  // Category translations and colors Map
  const categoriesMap: Record<string, { label: string; color: string; bg: string }> = {
    ensinos: { label: "Ensino Teológico", color: "text-amber-500", bg: "bg-amber-500/10" },
    noticias: { label: "Avisos & Notícias", color: "text-blue-500", bg: "bg-blue-500/10" },
    mensagens: { label: "Mensagem do Dia", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    estudos: { label: "Estudo Bíblico", color: "text-purple-500", bg: "bg-purple-500/10" },
    curso: { label: "Aula do Curso", color: "text-pink-500", bg: "bg-pink-500/10" },
    homens: { label: "Biografia Sagrada", color: "text-cyan-500", bg: "bg-cyan-500/10" }
  };

  // Cache updater helper
  const updateCache = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn("Storage limits reached", e);
    }
  };

  // Helper to trigger brief clean toast messages
  const showToast = (text: string, type: "success" | "error" = "success") => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 3000);
  };

  // 1. Fetch data from Server & Local synchronization setup
  const loadCommunityData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/db/load");
      const result = await res.json();
      
      if (result.success && result.data) {
        const fetchedPosts = result.data.posts || [];
        const fetchedComments = result.data.comments || [];
        const fetchedReactions = result.data.reactions || [];
        const fetchedAds = result.data.ads || [];

        setPosts(fetchedPosts);
        setComments(fetchedComments);
        setReactions(fetchedReactions);
        setAds(fetchedAds);

        updateCache("escola_mural_posts", fetchedPosts);
        updateCache("escola_mural_comments", fetchedComments);
        updateCache("escola_mural_reactions", fetchedReactions);
        updateCache("escola_mural_ads", fetchedAds);
      }
    } catch (e) {
      console.warn("Fraca conexão de rede. Executando com dados locais.", e);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Realtime client integration
  useEffect(() => {
    loadCommunityData();

    // Listen on real-time channel if Supabase configured
    let subscription: any = null;
    let reconnectTimeoutId: any = null;
    let isComponentMounted = true;
    let retryDelay = 3000;

    const initializeRealtime = async () => {
      try {
        const supabase = await getClientClient();
        if (!supabase) return;

        if (subscription) {
          console.log("[Community Realtime] Removendo canal anterior antes de restabelecer...");
          await supabase.removeChannel(subscription);
        }

        console.log("[Community Realtime] Conectando ao canal de atualizações em tempo real...");
        // Single channel to capture changes of comments, reactions, posts, ads in real time
        subscription = supabase
          .channel("realtime-mural-feed")
          .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => {
            console.log("[Community Realtime] Mudança detectada na tabela 'posts', recarregando mural...");
            loadCommunityData();
          })
          .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, () => {
            console.log("[Community Realtime] Mudança detectada na tabela 'comments', recarregando mural...");
            loadCommunityData();
          })
          .on("postgres_changes", { event: "*", schema: "public", table: "reactions" }, () => {
            console.log("[Community Realtime] Mudança detectada na tabela 'reactions', recarregando mural...");
            loadCommunityData();
          })
          .on("postgres_changes", { event: "*", schema: "public", table: "ads" }, () => {
            console.log("[Community Realtime] Mudança de anúncios detectada, atualizando feeds...");
            loadCommunityData();
          });

        subscription.subscribe((status: string, err?: any) => {
          console.log(`[Community Realtime] Inscrição: ${status}`, err ? err : "");
          if (status === "SUBSCRIBED") {
            retryDelay = 3000; // Reset delay upon successful subscription
            if (reconnectTimeoutId) clearTimeout(reconnectTimeoutId);
          } else if (status === "CHANNEL_ERROR" || status === "CLOSED" || status === "TIMED_OUT") {
            console.warn(`[Community Realtime] Conexão interrompida (${status}). Agendando reconexão em ${retryDelay / 1000}s...`);
            if (reconnectTimeoutId) clearTimeout(reconnectTimeoutId);
            reconnectTimeoutId = setTimeout(() => {
              if (isComponentMounted) {
                initializeRealtime();
                // Escalona as retentativas: 3s -> 5s -> 10s
                retryDelay = retryDelay === 3000 ? 5000 : (retryDelay === 5000 ? 10000 : 10000);
              }
            }, retryDelay);
          }
        });
      } catch (err) {
        console.error("[Community Realtime] Erro ao instanciar canal:", err);
      }
    };

    initializeRealtime();

    return () => {
      isComponentMounted = false;
      if (reconnectTimeoutId) clearTimeout(reconnectTimeoutId);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // 3. User Reactions Logic (Toggle likes / values per device ID)
  const handleToggleReaction = async (postId: string, reactionType: string) => {
    // Optimistic UI updates
    const existingReaction = reactions.find(
      (r) => r.post_id === postId && r.device_id === deviceId
    );

    let updatedReactions: Reaction[] = [...reactions];
    const newId = "react_" + postId + "_" + deviceId;

    if (existingReaction) {
      if (existingReaction.type === reactionType) {
        // Toggle off if same clicked again
        updatedReactions = updatedReactions.filter((r) => r.id !== existingReaction.id);
        setReactions(updatedReactions);
        updateCache("escola_mural_reactions", updatedReactions);

        // API DELETE
        try {
          await fetch(`/api/db/reactions/${existingReaction.id}`, { method: "DELETE" });
        } catch (e) {
          console.warn("Erro ao registrar no Supabase, mantendo cache offline.", e);
        }
      } else {
        // Edit category
        updatedReactions = updatedReactions.map((r) => {
          if (r.id === existingReaction.id) {
            return { ...r, type: reactionType };
          }
          return r;
        });
        setReactions(updatedReactions);
        updateCache("escola_mural_reactions", updatedReactions);

        // API UPDATE (POST Upsert)
        try {
          await fetch("/api/db/reactions/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: existingReaction.id,
              post_id: postId,
              type: reactionType,
              device_id: deviceId
            })
          });
        } catch (e) {
          console.warn(e);
        }
      }
    } else {
      // New Reaction
      const newReaction: Reaction = {
        id: newId,
        post_id: postId,
        type: reactionType,
        device_id: deviceId,
        created_at: new Date().toISOString()
      };
      updatedReactions.push(newReaction);
      setReactions(updatedReactions);
      updateCache("escola_mural_reactions", updatedReactions);

      // API Insert
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

  // 4. Comment Adding Logic (Saves on Supabase with Anti-Spam protection)
  const handleAddComment = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentTexts[postId]?.trim();
    const authorName = commentNames[postId]?.trim() || "Anónimo";

    if (!commentText) return;

    // Anti-spam 3-second checkpoint
    const now = Date.now();
    if (now - lastCommentTime.current < 3000) {
      showToast("Por favor, guarde 3 segundos entre comentários.", "error");
      return;
    }
    lastCommentTime.current = now;

    const newCommentId = "comment_" + Date.now() + "_" + Math.random().toString(36).substring(2, 5);
    const newCommentObj: Comment = {
      id: newCommentId,
      post_id: postId,
      name: authorName,
      comment: commentText,
      device_id: deviceId,
      created_at: new Date().toISOString()
    };

    // Client optimistic update
    const updatedComments = [...comments, newCommentObj];
    setComments(updatedComments);
    updateCache("escola_mural_comments", updatedComments);

    // Clear input
    setCommentTexts(prev => ({ ...prev, [postId]: "" }));
    showToast("Comentário publicado!");

    // Server-sync
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

  // 5. Admin Post Manager handlers
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postContent) {
      alert("Por favor preencha os campos obrigatórios");
      return;
    }

    const targetId = editingPostId || "post_" + Date.now();
    const finalPost: Post = {
      id: targetId,
      title: postTitle,
      content: postContent,
      category: postCategory,
      image_url: postImageUrl || "https://images.unsplash.com/photo-1504051771394-dd2e66b2e08f?auto=format&fit=crop&q=80&w=400",
      author: postAuthor || "Lemos Faya de Arcanjo",
      created_at: editingPostId ? (posts.find(p => p.id === editingPostId)?.created_at || new Date().toISOString()) : new Date().toISOString()
    };

    // Optimistic save
    const updatedPosts = editingPostId 
      ? posts.map(p => p.id === editingPostId ? finalPost : p)
      : [finalPost, ...posts];

    setPosts(updatedPosts);
    updateCache("escola_mural_posts", updatedPosts);

    // Close and Clear
    setIsPostFormOpen(false);
    setEditingPostId(null);
    setPostTitle("");
    setPostContent("");
    setPostImageUrl("");

    showToast(editingPostId ? "Publicação atualizada!" : "Publicação adicionada!");

    // Server-sync
    try {
      await fetch("/api/db/posts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPost)
      });
    } catch (err) {
      console.warn("Salvo localmente. Sincronizará quando a rede estiver estável.", err);
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPostId(post.id);
    setPostTitle(post.title);
    setPostContent(post.content);
    setPostCategory(post.category);
    setPostImageUrl(post.image_url);
    setPostAuthor(post.author);
    setIsPostFormOpen(true);
  };

  const handleDeletePost = (postId: string) => {
    triggerConfirm(
      "Confirmar Exclusão",
      "Deseja realmente apagar permanentemente esta publicação do mural e todos os seus comentários?",
      async () => {
        const remaining = posts.filter(p => p.id !== postId);
        setPosts(remaining);
        updateCache("escola_mural_posts", remaining);

        try {
          await fetch(`/api/db/posts/${postId}`, { method: "DELETE" });
          showToast("Publicação deletada!");
        } catch (e) {
          console.warn(e);
        }
      }
    );
  };

  // 6. Admin Ads logic
  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle || !adImageUrl || !adLink) {
      alert("Preencha todos os campos do anúncio");
      return;
    }

    const newAd: Ad = {
      id: "ad_" + Date.now(),
      title: adTitle,
      image_url: adImageUrl,
      link: adLink,
      type: adType,
      active: true,
      created_at: new Date().toISOString()
    };

    const updatedAds = [newAd, ...ads];
    setAds(updatedAds);
    updateCache("escola_mural_ads", updatedAds);

    setIsAdFormOpen(false);
    setAdTitle("");
    setAdImageUrl("");
    setAdLink("");

    showToast("Anúncio patrocinado criado!");

    try {
      await fetch("/api/db/ads/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAd)
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleToggleAdStatus = async (adId: string, currentStatus: boolean) => {
    const updated = ads.map(a => a.id === adId ? { ...a, active: !currentStatus } : a);
    setAds(updated);
    updateCache("escola_mural_ads", updated);

    const targetAd = updated.find(a => a.id === adId);
    if (targetAd) {
      try {
        await fetch("/api/db/ads/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(targetAd)
        });
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleDeleteAd = (adId: string) => {
    triggerConfirm(
      "Remover Anúncio",
      "Deseja apagar permanentemente este patrocinador do feed de publicações?",
      async () => {
        const remaining = ads.filter(a => a.id !== adId);
        setAds(remaining);
        updateCache("escola_mural_ads", remaining);

        try {
          await fetch(`/api/db/ads/${adId}`, { method: "DELETE" });
          showToast("Patrocinador removido!");
        } catch (err) {
          console.warn(err);
        }
      }
    );
  };

  // Reusable utility calculations
  const getReactionsCount = (postId: string, type: string) => {
    return reactions.filter((r) => r.post_id === postId && r.type === type).length;
  };

  const getMyReaction = (postId: string) => {
    return reactions.find((r) => r.post_id === postId && r.device_id === deviceId)?.type;
  };

  const getCommentsCount = (postId: string) => {
    return comments.filter((c) => c.post_id === postId).length;
  };

  const getPostComments = (postId: string) => {
    return comments
      .filter((c) => c.post_id === postId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  };

  // Filter posts
  const filteredPosts = posts
    .filter((p) => activeTab === "todas" || p.category === activeTab)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Ads currently active
  const activeAds = ads.filter((a) => a.active);

  // Advanced Algorithm to interleave Post -> Post -> Ad -> Post -> Post -> Ad...
  const feedItems: Array<{ type: "post" | "ad"; data: any }> = [];
  let adCursor = 0;

  filteredPosts.forEach((post, index) => {
    feedItems.push({ type: "post", data: post });
    // Interleave active banner/native ads every 2 posts
    if ((index + 1) % 2 === 0 && activeAds.length > 0) {
      feedItems.push({ type: "ad", data: activeAds[adCursor % activeAds.length] });
      adCursor++;
    }
  });

  return (
    <div className="space-y-8">
      {/* Toast Feedback Messages */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-6 py-3.5 rounded-2xl shadow-xl border font-bold text-sm bg-secondary border-white/5"
          >
            {feedback.type === "success" ? (
              <CheckCircle size={18} className="text-emerald-400" />
            ) : (
              <AlertCircle size={18} className="text-rose-400" />
            )}
            <span className="text-white">{feedback.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-white/5 pb-6">
        <div className="max-w-xl">
          <h2 className="text-5xl font-black text-heading mb-4 tracking-tight leading-tight">Mural Comunidade</h2>
          <p className="text-muted text-lg leading-relaxed font-semibold">
            Partilhe ensinos, interaja, exponha reações e faça discussões bíblicas em tempo real direto de Angola para o mundo!
          </p>
        </div>

        {/* Action Triggers for Admin */}
        {isAdmin && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                setEditingPostId(null);
                setPostTitle("");
                setPostContent("");
                setPostImageUrl("");
                setIsPostFormOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-3 bg-accent hover:bg-accent-light text-secondary font-black rounded-xl transition shadow-lg shadow-accent/20 cursor-pointer text-sm"
            >
              <Plus size={16} /> Nova Publicação
            </button>

            <button
              onClick={() => setIsAdFormOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-secondary hover:bg-secondary/85 text-white font-black rounded-xl transition border border-white/10 cursor-pointer text-sm"
            >
              <Megaphone size={16} className="text-[#cfaf72]" /> Novo Patrocinador
            </button>
          </div>
        )}
      </div>

      {/* Admin Creating/Editing Publications Modal */}
      {isAdmin && isPostFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-secondary border border-slate-100 dark:border-white/10 rounded-3xl p-6 w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-black mb-4 dark:text-white">
              {editingPostId ? "📝 Editar Publicação" : "💡 Criar Nova Publicação"}
            </h3>
            <form onSubmit={handleSavePost} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-black tracking-wider text-muted mb-1.5">Título da Matéria *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 5 Chaves fundamentais para entender Romanos 8"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl py-3 px-4 focus:outline-none focus:border-accent font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-black tracking-wider text-muted mb-1.5">Categoria</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl py-3 px-4 focus:outline-none focus:border-accent font-semibold"
                  >
                    <option value="ensinos">Teologia Básica</option>
                    <option value="estudos">Estudos Bíblicos</option>
                    <option value="noticias">Avisos e Notícias</option>
                    <option value="mensagens">Mensagens de Fé</option>
                    <option value="curso">Matérias do Curso</option>
                    <option value="homens">Biografias Grandes Servos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-black tracking-wider text-muted mb-1.5">Autor</label>
                  <input
                    type="text"
                    required
                    value={postAuthor}
                    onChange={(e) => setPostAuthor(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl py-3 px-4 focus:outline-none focus:border-accent font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-black tracking-wider text-muted mb-1.5">Link da Imagem Ilustrativa (Opcional)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={postImageUrl}
                  onChange={(e) => setPostImageUrl(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl py-3 px-4 focus:outline-none focus:border-accent font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-black tracking-wider text-muted mb-1.5">Conteúdo Principal (Suporta quebra de linha) *</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Escreva a mensagem teológica ou aviso pastoral completo..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl py-3 px-4 focus:outline-none focus:border-accent font-semibold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPostFormOpen(false)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-accent hover:bg-accent-light text-secondary font-black rounded-xl transition"
                >
                  Salvar Publicação
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Admin Creating Patrocinador Ads Modal */}
      {isAdmin && isAdFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-secondary border border-slate-100 dark:border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl"
          >
            <h3 className="text-2xl font-black mb-4 dark:text-white">🌐 Adicionar Patrocinador</h3>
            <form onSubmit={handleSaveAd} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-black tracking-wider text-muted mb-1.5">Título / Chamada do Anúncio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Inscreva-se em nosso canal de Teologia Geral"
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl py-3 px-4 focus:outline-none focus:border-accent font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-black tracking-wider text-muted mb-1.5">URL da Imagem de Fundo *</label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={adImageUrl}
                  onChange={(e) => setAdImageUrl(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl py-3 px-4 focus:outline-none focus:border-accent font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-black tracking-wider text-muted mb-1.5">Link de Redirecionamento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: https://wa.me/936386566"
                  value={adLink}
                  onChange={(e) => setAdLink(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl py-3 px-4 focus:outline-none focus:border-accent font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-black tracking-wider text-muted mb-1.5">Formato Visual</label>
                <select
                  value={adType}
                  onChange={(e) => setAdType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl py-3 px-4 focus:outline-none focus:border-accent font-semibold"
                >
                  <option value="native">Anúncio Nativo Incorporado (Visual Elegante)</option>
                  <option value="banner">Banner Patrocinado Discreto</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdFormOpen(false)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-accent hover:bg-accent-light text-secondary font-black rounded-xl transition"
                >
                  Criar Anúncio
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Category Tabs for Fast Offline Sorting */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab("todas")}
          className={cn(
            "px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap cursor-pointer",
            activeTab === "todas"
              ? "bg-secondary dark:bg-white text-white dark:text-secondary shadow-md"
              : "text-slate-500 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-white/5"
          )}
        >
          Ver Todas ({posts.length})
        </button>

        {Object.entries(categoriesMap).map(([key, config]) => {
          const categoryPostsCount = posts.filter(p => p.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5",
                activeTab === key
                  ? "bg-secondary dark:bg-white text-white dark:text-secondary shadow-md"
                  : "text-slate-500 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-white/5"
              )}
            >
              <span>{config.label}</span>
              <span className="text-[10px] bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded-full text-slate-600 dark:text-slate-200">
                {categoryPostsCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Feed Panel */}
      <div className="space-y-6">
        {feedItems.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-secondary/20 border border-slate-100 dark:border-white/5 rounded-3xl">
            <Radio size={40} className="text-[#cfaf72] mx-auto mb-4 animate-pulse" />
            <h4 className="text-xl font-bold dark:text-white">Mural limpo no momento</h4>
            <p className="text-muted text-sm mt-1 max-w-sm mx-auto font-medium">As postagens dos pastores e administradores aparecerão instantaneamente aqui em tempo real.</p>
          </div>
        ) : (
          feedItems.map((item, index) => {
            if (item.type === "ad") {
              const ad = item.data;
              const adComments = getPostComments(ad.id);
              const myReact = getMyReaction(ad.id);
              return (
                <motion.div
                  key={"ad_" + ad.id + "_" + index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-secondary border border-slate-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-xl relative group"
                >
                  {ad.type === "native" ? (
                    <>
                      {/* Background banner */}
                      <div className="h-44 bg-slate-900 relative overflow-hidden">
                        <img
                          referrerPolicy="no-referrer"
                          src={ad.image_url}
                          alt={ad.title}
                          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        <div className="absolute top-4 left-4 bg-amber-500 text-secondary text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg">
                          Patrocinado
                        </div>
                      </div>
                      <div className="p-6 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                        <div className="space-y-1 text-left">
                          <h4 className="text-lg font-black tracking-tight leading-tight dark:text-white">{ad.title}</h4>
                          <p className="text-xs text-[#cfaf72] font-black tracking-wider uppercase">Contribuição Escola da Fé</p>
                        </div>
                        <a
                          href={ad.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 flex items-center gap-1.5 px-4.5 py-2.5 bg-secondary dark:bg-white text-white dark:text-secondary font-black rounded-xl hover:scale-[1.03] active:scale-[0.97] transition-all text-xs border border-white/10"
                        >
                          Acessar <ExternalLink size={12} />
                        </a>
                      </div>
                    </>
                  ) : (
                    // Discretionary Banner
                    <div className="flex items-center justify-between gap-6 w-full flex-wrap sm:flex-nowrap py-4 px-6 text-left">
                      <div className="flex items-center gap-3">
                        <Megaphone size={18} className="text-amber-500 shrink-0" />
                        <div>
                          <p className="text-xs uppercase font-black tracking-widest text-[#cfaf72]">Anúncio Incorporado</p>
                          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">{ad.title}</h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {isAdmin && (
                          <button
                            onClick={() => handleToggleAdStatus(ad.id, ad.active)}
                            className="p-1 px-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-lg text-2xs transition"
                            title="Desativar anúncio temporariamente"
                          >
                            Ocultar
                          </button>
                        )}
                        <a
                          href={ad.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 bg-amber-500 text-secondary font-black rounded-lg text-xs hover:scale-105 active:scale-95 transition-all shrink-0"
                        >
                          Visitar
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Admin Deletes action */}
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteAd(ad.id)}
                      className="absolute top-4 right-4 p-2 bg-red-500/90 text-white rounded-xl hover:bg-red-600 transition shadow z-15"
                      title="Excluir patrocinador"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  {/* Added Toolbar: Reactions & Comments for Ad */}
                  <div className="px-5 py-3 sm:px-6 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between gap-4 flex-wrap border-t border-b border-slate-100 dark:border-white/5">
                    {/* Reactions dock */}
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-1.5 rounded-2xl border border-slate-100 dark:border-white/5">
                      {/* Like */}
                      <button
                        onClick={() => handleToggleReaction(ad.id, "like")}
                        className={cn(
                          "p-1.5 h-8 gap-1 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 active:scale-90 transition cursor-pointer text-xs font-bold",
                          myReact === "like" ? "text-blue-500 scale-105 bg-blue-500/5" : "text-slate-400"
                        )}
                        title="Gostei"
                      >
                        <span>👍</span>
                        {getReactionsCount(ad.id, "like") > 0 && (
                          <span className="text-2xs font-mono">{getReactionsCount(ad.id, "like")}</span>
                        )}
                      </button>

                      {/* Love */}
                      <button
                        onClick={() => handleToggleReaction(ad.id, "love")}
                        className={cn(
                          "p-1.5 h-8 gap-1 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 active:scale-90 transition cursor-pointer text-xs font-bold",
                          myReact === "love" ? "text-red-500 scale-105 bg-red-500/5" : "text-slate-400"
                        )}
                        title="Excelente"
                      >
                        <span>❤️</span>
                        {getReactionsCount(ad.id, "love") > 0 && (
                          <span className="text-2xs font-mono">{getReactionsCount(ad.id, "love")}</span>
                        )}
                      </button>

                      {/* Wow */}
                      <button
                        onClick={() => handleToggleReaction(ad.id, "wow")}
                        className={cn(
                          "p-1.5 h-8 gap-1 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 active:scale-90 transition cursor-pointer text-xs font-bold",
                          myReact === "wow" ? "text-amber-500 scale-105 bg-amber-500/5" : "text-slate-400"
                        )}
                        title="Impressionado"
                      >
                        <span>😮</span>
                        {getReactionsCount(ad.id, "wow") > 0 && (
                          <span className="text-2xs font-mono">{getReactionsCount(ad.id, "wow")}</span>
                        )}
                      </button>

                      {/* Sad */}
                      <button
                        onClick={() => handleToggleReaction(ad.id, "sad")}
                        className={cn(
                          "p-1.5 h-8 gap-1 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 active:scale-90 transition cursor-pointer text-xs font-bold",
                          myReact === "sad" ? "text-violet-500 scale-105 bg-violet-500/5" : "text-slate-400"
                        )}
                        title="Triste"
                      >
                        <span>😢</span>
                        {getReactionsCount(ad.id, "sad") > 0 && (
                          <span className="text-2xs font-mono">{getReactionsCount(ad.id, "sad")}</span>
                        )}
                      </button>

                      {/* Fire */}
                      <button
                        onClick={() => handleToggleReaction(ad.id, "fire")}
                        className={cn(
                          "p-1.5 h-8 gap-1 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 active:scale-90 transition cursor-pointer text-xs font-bold",
                          myReact === "fire" ? "text-orange-500 scale-105 bg-orange-500/5" : "text-slate-400"
                        )}
                        title="Unção / Glória"
                      >
                        <span>🔥</span>
                        {getReactionsCount(ad.id, "fire") > 0 && (
                          <span className="text-2xs font-mono">{getReactionsCount(ad.id, "fire")}</span>
                        )}
                      </button>
                    </div>

                    {/* Comments Toggle */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveCommentPostId(activeCommentPostId === ad.id ? null : ad.id)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all select-none cursor-pointer",
                          activeCommentPostId === ad.id 
                            ? "bg-accent text-secondary" 
                            : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                        )}
                      >
                        <MessageCircle size={14} />
                        Comentários ({getCommentsCount(ad.id)})
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Ad Comments and editor */}
                  {activeCommentPostId === ad.id && (
                    <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-white/5 space-y-4">
                      {/* Existing comments */}
                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {adComments.length === 0 ? (
                          <p className="text-xs text-center text-muted py-4 font-semibold">Nenhum debate registrado ainda. Seja o primeiro a comentar!</p>
                        ) : (
                          adComments.map((com) => (
                            <div 
                              key={com.id} 
                              className="bg-white dark:bg-secondary border border-slate-100 dark:border-white/5 p-3 rounded-2xl flex items-start gap-3"
                            >
                              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center font-black shrink-0 text-[#cfaf72] text-xs uppercase text-left">
                                {(com.name || "Anônimo").charAt(0)}
                              </div>
                              <div className="space-y-1 text-left">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-black text-slate-800 dark:text-white leading-none">
                                    {com.name || "Anônimo"}
                                  </span>
                                  {com.device_id === deviceId && (
                                    <span className="text-[9px] bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-300 rounded-lg px-2 py-0.5 uppercase tracking-wide font-black">Você</span>
                                  )}
                                  <span className="text-[10px] text-muted font-mono ml-auto">
                                    {new Date(com.created_at).toLocaleDateString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                                  {com.comment}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Writing comment form */}
                      <form onSubmit={(e) => handleAddComment(ad.id, e)} className="space-y-2 border-t border-slate-200/50 dark:border-white/5 pt-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Seu nome (Opcional)"
                            value={commentNames[ad.id] || ""}
                            onChange={(e) => setCommentNames(prev => ({ ...prev, [ad.id]: e.target.value }))}
                            className="sm:col-span-1 bg-white dark:bg-secondary border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-xs py-2 px-3 rounded-xl focus:outline-none focus:border-accent font-semibold"
                          />
                          <div className="sm:col-span-2 flex gap-1.5 items-center">
                            <input
                              type="text"
                              required
                              placeholder="Escreva sua colocação bíblica..."
                              value={commentTexts[ad.id] || ""}
                              onChange={(e) => setCommentTexts(prev => ({ ...prev, [ad.id]: e.target.value }))}
                              className="flex-grow bg-white dark:bg-secondary border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-xs py-2 px-3 focus:outline-none focus:border-accent rounded-xl font-semibold"
                            />
                            <button
                              type="submit"
                              className="bg-accent hover:bg-accent-light text-secondary font-black text-xs py-2 px-3.5 rounded-xl transition flex items-center justify-center shrink-0 cursor-pointer h-9 w-9"
                              title="Publicar comentário"
                            >
                              <Send size={12} />
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                </motion.div>
              );
            }

            // Post Node View
            const post: Post = item.data;
            const meta = categoriesMap[post.category] || { label: "Mural", color: "text-amber-500", bg: "bg-amber-500/10" };
            const postComments = getPostComments(post.id);
            const myReact = getMyReaction(post.id);
            const isExpanded = expandedPosts[post.id] || false;

            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-secondary border border-slate-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-xl"
              >
                {/* Header Information */}
                <div className="p-5 sm:p-6 pb-4">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className={cn("px-3 py-1.5 rounded-xl font-black text-2xs uppercase tracking-wider", meta.bg, meta.color)}>
                      {meta.label}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-muted font-bold font-mono">
                      <Clock size={12} />
                      {new Date(post.created_at).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "short"
                      })}
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-heading tracking-tight mb-3 hover:text-accent duration-200">
                    {post.title}
                  </h3>

                  <div className="flex items-center gap-2.5 text-xs font-bold text-muted border-t border-slate-50 dark:border-white/5 pt-3">
                    <div className="w-5 h-5 rounded-full bg-accent text-secondary flex items-center justify-center font-black">
                      <User size={10} />
                    </div>
                    <span>Escrito por: <span className="text-slate-800 dark:text-slate-200">{post.author}</span></span>
                  </div>
                </div>

                {/* Illustrated Image (Optimized lazy selection) */}
                {post.image_url && (
                  <div className="h-56 sm:h-72 w-full bg-slate-100 relative overflow-hidden">
                    <img
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-[1.01] duration-300"
                    />
                  </div>
                )}

                {/* Content body with expandable toggle */}
                <div className="p-5 sm:p-6 py-4 border-b border-separate dark:border-white/5">
                  <p className={cn(
                    "text-slate-700 dark:text-slate-300 font-medium text-sm sm:text-base leading-relaxed whitespace-pre-line",
                    !isExpanded && "line-clamp-4"
                  )}>
                    {post.content}
                  </p>

                  {post.content.length > 250 && (
                    <button
                      onClick={() => setExpandedPosts(prev => ({ ...prev, [post.id]: !isExpanded }))}
                      className="flex items-center gap-1.5 text-accent font-black text-xs sm:text-sm mt-3.5 hover:underline uppercase tracking-wider cursor-pointer"
                    >
                      {isExpanded ? (
                        <>Ver Menos <ChevronUp size={14} /></>
                      ) : (
                        <>Ler Todo o Conteúdo <ChevronDown size={14} /></>
                      )}
                    </button>
                  )}
                </div>

                {/* Social Actions (Reactions 👍 ❤️ 😮 😢 🔥 & Comments toggle) */}
                <div className="px-5 py-3 sm:px-6 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between gap-4 flex-wrap border-b border-slate-100 dark:border-white/5">
                  
                  {/* Reactions dock */}
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-1.5 rounded-2xl border border-slate-100 dark:border-white/5">
                    {/* Like */}
                    <button
                      onClick={() => handleToggleReaction(post.id, "like")}
                      className={cn(
                        "p-1.5 h-8 gap-1 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 active:scale-90 transition cursor-pointer text-xs font-bold",
                        myReact === "like" ? "text-blue-500 scale-105 bg-blue-500/5" : "text-slate-400"
                      )}
                      title="Gostei"
                    >
                      <span>👍</span>
                      {getReactionsCount(post.id, "like") > 0 && (
                        <span className="text-2xs font-mono">{getReactionsCount(post.id, "like")}</span>
                      )}
                    </button>

                    {/* Love */}
                    <button
                      onClick={() => handleToggleReaction(post.id, "love")}
                      className={cn(
                        "p-1.5 h-8 gap-1 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 active:scale-90 transition cursor-pointer text-xs font-bold",
                        myReact === "love" ? "text-red-500 scale-105 bg-red-500/5" : "text-slate-400"
                      )}
                      title="Excelente"
                    >
                      <span>❤️</span>
                      {getReactionsCount(post.id, "love") > 0 && (
                        <span className="text-2xs font-mono">{getReactionsCount(post.id, "love")}</span>
                      )}
                    </button>

                    {/* Wow */}
                    <button
                      onClick={() => handleToggleReaction(post.id, "wow")}
                      className={cn(
                        "p-1.5 h-8 gap-1 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 active:scale-90 transition cursor-pointer text-xs font-bold",
                        myReact === "wow" ? "text-amber-500 scale-105 bg-amber-500/5" : "text-slate-400"
                      )}
                      title="Impressionado"
                    >
                      <span>😮</span>
                      {getReactionsCount(post.id, "wow") > 0 && (
                        <span className="text-2xs font-mono">{getReactionsCount(post.id, "wow")}</span>
                      )}
                    </button>

                    {/* Sad */}
                    <button
                      onClick={() => handleToggleReaction(post.id, "sad")}
                      className={cn(
                        "p-1.5 h-8 gap-1 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 active:scale-90 transition cursor-pointer text-xs font-bold",
                        myReact === "sad" ? "text-violet-500 scale-105 bg-violet-500/5" : "text-slate-400"
                      )}
                      title="Triste"
                    >
                      <span>😢</span>
                      {getReactionsCount(post.id, "sad") > 0 && (
                        <span className="text-2xs font-mono">{getReactionsCount(post.id, "sad")}</span>
                      )}
                    </button>

                    {/* Fire */}
                    <button
                      onClick={() => handleToggleReaction(post.id, "fire")}
                      className={cn(
                        "p-1.5 h-8 gap-1 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 active:scale-90 transition cursor-pointer text-xs font-bold",
                        myReact === "fire" ? "text-orange-500 scale-105 bg-orange-500/5" : "text-slate-400"
                      )}
                      title="Unção / Glória"
                    >
                      <span>🔥</span>
                      {getReactionsCount(post.id, "fire") > 0 && (
                        <span className="text-2xs font-mono">{getReactionsCount(post.id, "fire")}</span>
                      )}
                    </button>
                  </div>

                  {/* Comments Expand Button */}
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <div className="flex items-center gap-1 border-r border-slate-200 dark:border-white/10 pr-2 mr-1">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="p-1.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[#cfaf72] rounded-xl transition"
                          title="Editar publicação"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition"
                          title="Excluir publicação"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all select-none cursor-pointer",
                        activeCommentPostId === post.id 
                          ? "bg-accent text-secondary" 
                          : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                      )}
                    >
                      <MessageCircle size={14} />
                      Comentários ({getCommentsCount(post.id)})
                    </button>
                  </div>
                </div>

                {/* Sub-Panel: Collapsible Comments and Comment Editor */}
                {activeCommentPostId === post.id && (
                  <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-white/5 space-y-4">
                    
                    {/* Existing comments */}
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {postComments.length === 0 ? (
                        <p className="text-xs text-center text-muted py-4 font-semibold">Nenhum debate registrado ainda. Seja o primeiro a comentar!</p>
                      ) : (
                        postComments.map((com) => (
                          <div 
                            key={com.id} 
                            className="bg-white dark:bg-secondary border border-slate-100 dark:border-white/5 p-3 rounded-2xl flex items-start gap-3"
                          >
                            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center font-black shrink-0 text-[#cfaf72] text-xs uppercase">
                              {(com.name || "Anônimo").charAt(0)}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-black text-slate-800 dark:text-white leading-none">
                                  {com.name || "Anônimo"}
                                </span>
                                {com.device_id === deviceId && (
                                  <span className="text-[9px] bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-300 rounded-lg px-2 py-0.5 uppercase tracking-wide font-black">Você</span>
                                )}
                                <span className="text-[10px] text-muted font-mono ml-auto">
                                  {new Date(com.created_at).toLocaleDateString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                                {com.comment}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Writing comment form */}
                    <form onSubmit={(e) => handleAddComment(post.id, e)} className="space-y-2 border-t border-slate-200/50 dark:border-white/5 pt-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Seu nome (Opcional)"
                          value={commentNames[post.id] || ""}
                          onChange={(e) => setCommentNames(prev => ({ ...prev, [post.id]: e.target.value }))}
                          className="sm:col-span-1 bg-white dark:bg-secondary border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-xs py-2 px-3 rounded-xl focus:outline-none focus:border-accent font-semibold"
                        />
                        <div className="sm:col-span-2 flex gap-1.5 items-center">
                          <input
                            type="text"
                            required
                            placeholder="Escreva sua colocação bíblica..."
                            value={commentTexts[post.id] || ""}
                            onChange={(e) => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                            className="flex-grow bg-white dark:bg-secondary border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-xs py-2 px-3 focus:outline-none focus:border-accent rounded-xl font-semibold"
                          />
                          <button
                            type="submit"
                            className="bg-accent hover:bg-accent-light text-secondary font-black text-xs py-2 px-3.5 rounded-xl transition flex items-center justify-center shrink-0 cursor-pointer h-9 w-9"
                            title="Publicar comentário"
                          >
                            <Send size={12} />
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </motion.article>
            );
          })
        )}
      </div>
    </div>
  );
}
