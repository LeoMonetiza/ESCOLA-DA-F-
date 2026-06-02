import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Star, 
  Trash2, 
  Search, 
  BookOpen, 
  History, 
  Users, 
  Library, 
  GraduationCap, 
  Bookmark, 
  Heart,
  Quote,
  Eye,
  ArrowRight
} from "lucide-react";
import { cn } from "../lib/utils";

interface FavoriteItem {
  id: string;
  title: string;
  description: string;
  type: "estudo" | "dicionario" | "historia" | "homens-deus" | "teologia" | "curso";
  originalItem: any;
}

interface FavoritesViewProps {
  onSelectItem: (item: any) => void;
}

export default function FavoritesView({ onSelectItem }: FavoritesViewProps) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | FavoriteItem["type"]>("all");

  const loadFavorites = () => {
    try {
      const saved = localStorage.getItem("escola_da_fe_favorites");
      setFavorites(saved ? JSON.parse(saved) : []);
    } catch (e) {
      console.error("Erro ao carregar favoritos:", e);
      setFavorites([]);
    }
  };

  useEffect(() => {
    loadFavorites();
    // Re-sync favorites automatically on custom changes or deletions
    window.addEventListener("favorites-updated", loadFavorites);
    return () => {
      window.removeEventListener("favorites-updated", loadFavorites);
    };
  }, []);

  const handleRemoveFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const saved = localStorage.getItem("escola_da_fe_favorites");
      const current = saved ? JSON.parse(saved) : [];
      const updated = current.filter((f: any) => f.id !== id);
      localStorage.setItem("escola_da_fe_favorites", JSON.stringify(updated));
      setFavorites(updated);
      window.dispatchEvent(new CustomEvent("favorites-updated"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Deseja realmente limpar toda a sua lista de favoritos?")) {
      try {
        localStorage.setItem("escola_da_fe_favorites", JSON.stringify([]));
        setFavorites([]);
        window.dispatchEvent(new CustomEvent("favorites-updated"));
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Filter & Search Logic
  const filteredFavorites = useMemo(() => {
    return favorites.filter((fav) => {
      const matchesTab = activeTab === "all" ? true : fav.type === activeTab;
      const matchesSearch = 
        fav.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fav.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [favorites, searchTerm, activeTab]);

  // Tab configurations
  const tabs = [
    { id: "all", label: "Todos", count: favorites.length },
    { id: "estudo", label: "Estudos", count: favorites.filter(f => f.type === "estudo").length },
    { id: "teologia", label: "Teologia", count: favorites.filter(f => f.type === "teologia").length },
    { id: "curso", label: "Curso", count: favorites.filter(f => f.type === "curso").length },
    { id: "historia", label: "Histórias", count: favorites.filter(f => f.type === "historia").length },
    { id: "homens-deus", label: "Heróis da Fé", count: favorites.filter(f => f.type === "homens-deus").length },
    { id: "dicionario", label: "Dicionário", count: favorites.filter(f => f.type === "dicionario").length },
  ];

  // Helper to render responsive badges
  const getTypeBadge = (type: FavoriteItem["type"]) => {
    switch (type) {
      case "estudo":
        return {
          label: "Estudo",
          bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
          icon: <BookOpen size={12} />
        };
      case "teologia":
        return {
          label: "Teologia",
          bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
          icon: <Library size={12} />
        };
      case "curso":
        return {
          label: "Curso",
          bg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20",
          icon: <GraduationCap size={12} />
        };
      case "historia":
        return {
          label: "História",
          bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20",
          icon: <History size={12} />
        };
      case "homens-deus":
        return {
          label: "Herói da Fé",
          bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
          icon: <Users size={12} />
        };
      case "dicionario":
        return {
          label: "Dicionário",
          bg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20",
          icon: <Search size={12} />
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-10 pb-20 max-w-7xl mx-auto"
    >
      {/* Top Header details */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full border border-accent/25 animate-pulse">
          <Star size={14} className="text-accent fill-accent" />
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#cfaf72]">Os Seus Favoritos</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
          Minha Lista de Favoritos
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-bold">
          Guarde aqui tudo o que mais gostar no aplicativo de forma simples e fácil. Toque no ícone da Estrela ⭐ em qualquer conteúdo para ler e estudar as lições novamente onde quer que esteja!
        </p>
      </div>

      {/* Inspirational Quote */}
      <div className="p-5 sm:p-6 bg-gradient-to-tr from-[#16254a]/3 to-transparent dark:from-accent/3 dark:to-transparent rounded-2xl border border-slate-100 dark:border-white/5 max-w-2xl mx-auto text-center space-y-2">
        <Quote size={24} className="text-[#cfaf72]/30 mx-auto" />
        <p className="text-slate-600 dark:text-slate-350 italic font-bold text-xs sm:text-sm">
          "Pois onde estiver o seu tesouro, aí estará também o seu coração."
        </p>
        <p className="text-[10px] text-[#cfaf72] font-black uppercase tracking-widest">— Mateus 6:21</p>
      </div>

      {/* Main Container Workspace */}
      <div className="space-y-6">
        {/* Search Input and Global Cleanser */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 sm:p-6 bg-white dark:bg-[#1A237E]/10 rounded-3xl border border-slate-100 dark:border-white/5 shadow-md">
          <div className="relative w-full md:max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <Search size={18} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar nos seus favoritos..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 py-3.5 pl-11 pr-4 rounded-2xl focus:outline-none focus:border-accent font-semibold text-sm transition-all shadow-sm"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black uppercase text-slate-400 hover:text-red-400"
              >
                Limpar
              </button>
            )}
          </div>

          {favorites.length > 0 && (
            <button
              onClick={handleClearAll}
              className="w-full md:w-auto px-5 py-3 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-md shadow-red-500/5"
            >
              <Trash2 size={14} />
              Limpar Lista Favoritos
            </button>
          )}
        </div>

        {/* Tab Filter badging */}
        {favorites.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {tabs.map((tab) => {
              if (tab.count === 0 && tab.id !== "all") return null;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border",
                    isActive
                      ? "bg-accent border-accent text-secondary shadow-lg shadow-amber-500/10"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-350 hover:border-[#cfaf72]"
                  )}
                >
                  <span>{tab.label}</span>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-md font-sans",
                    isActive 
                      ? "bg-secondary/15 text-secondary" 
                      : "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400"
                  )}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* List Grid Layout */}
        <AnimatePresence mode="popLayoutContainer">
          {filteredFavorites.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredFavorites.map((fav) => {
                const badge = getTypeBadge(fav.type);
                return (
                  <motion.div
                    key={fav.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => onSelectItem(fav.originalItem || fav)}
                    className="group bg-white dark:bg-[#1C2541]/40 hover:bg-slate-50 dark:hover:bg-[#1C2541]/75 border border-slate-150/80 dark:border-white/5 rounded-3xl p-6 text-left relative flex flex-col justify-between overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer active:scale-98"
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#cfaf72]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    <div>
                      {/* Badge in top left */}
                      <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
                        <div className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5", badge.bg)}>
                          {badge.icon}
                          <span>{badge.label}</span>
                        </div>
                        
                        {/* Remove favorite button */}
                        <button
                          onClick={(e) => handleRemoveFavorite(fav.id, e)}
                          className="p-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/15 text-red-400 hover:text-red-500 transition-colors z-20 cursor-pointer border border-transparent hover:border-red-500/10"
                          title="Remover dos favoritos"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white leading-tight min-h-[2.5rem] group-hover:text-accent transition-colors">
                        {fav.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-normal mt-2 line-clamp-3 select-none">
                        {fav.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pointer-events-none border-t border-slate-100 dark:border-white/5 pt-4 mt-5">
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#cfaf72] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Estudar lição <ArrowRight size={12} />
                      </span>
                      <div className="text-slate-350 dark:text-slate-600 scale-90 group-hover:scale-100 transition-transform">
                        <Eye size={16} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 sm:py-24 bg-white dark:bg-[#1A237E]/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 space-y-5 px-6 max-w-xl mx-auto"
            >
              <div className="w-16 h-16 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-[#cfaf72] rounded-2xl flex items-center justify-center mx-auto scale-110 shadow-lg">
                <Star size={32} className="animate-spin duration-3000" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white">
                  {favorites.length === 0 ? "Nenhum favorito guardado!" : "Nenhum favorito encontrado!"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold max-w-md mx-auto leading-relaxed">
                  {favorites.length === 0 
                    ? "Abra qualquer lição de curso, estudo teológico, dicionário bíblico ou biografia e toque no botão da Estrela ⭐ no painel superior para guardá-la no seu Caderno de Favoritos."
                    : "Tente mudar os filtros ou reescrever a palavra pesquisada para encontrar o tema que quer estudar agora."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
