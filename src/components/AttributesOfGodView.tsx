import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Heart, Sparkles, Shield, Bookmark, ArrowLeft, BookOpen, Quote } from "lucide-react";
import { DIVINE_ATTRIBUTES, DivineAttribute } from "../data/attributesData";
import { cn } from "../lib/utils";

export default function AttributesOfGodView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<"All" | "Incomunicável" | "Comunicável">("All");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filteredAttributes = useMemo(() => {
    return DIVINE_ATTRIBUTES.filter((attr) => {
      const matchesSearch =
        attr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attr.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attr.longDescription.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === "All" ? true : attr.type === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType]);

  const activeAttribute = useMemo(() => {
    return DIVINE_ATTRIBUTES.find((a) => a.id === activeId) || null;
  }, [activeId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-24"
    >
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full border border-accent/25">
          <Sparkles size={14} className="text-accent animate-pulse" />
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-accent">Teologia Prática</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-[#1A237E] dark:text-white tracking-tighter">
          Os Atributos de Deus
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-bold max-w-2xl mx-auto">
          Um guia completo e aprofundado sobre o caráter imaculado do Altíssimo, organizado sistematicamente e fundamentado nas sólidas verdades das Escrituras Sagradas.
        </p>
      </div>

      {/* Theological Intro Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <div className="p-6 sm:p-8 bg-gradient-to-br from-indigo-50 to-amber-50/20 dark:from-[#111936] dark:to-secondary/50 rounded-3xl border border-indigo-100 dark:border-white/5 space-y-3 relative overflow-hidden group shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-all duration-500" />
          <div className="inline-flex p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl mb-2">
            <Shield size={22} />
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">Atributos Incomunicáveis</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            Qualidades absolutas e singulares que pertencem <span className="text-accent">exclusivamente a Deus</span>. Elas enfatizam a Sua transcendência indescritível e a diferença intransponível entre Ele, o Criador eterno, e nós, Suas criaturas falíveis e limitadas pela barreira física.
          </p>
        </div>

        <div className="p-6 sm:p-8 bg-gradient-to-br from-rose-50 to-amber-50/20 dark:from-[#1d1126] dark:to-secondary/50 rounded-3xl border border-rose-100 dark:border-white/5 space-y-3 relative overflow-hidden group shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl group-hover:bg-pink-500/10 transition-all duration-500" />
          <div className="inline-flex p-3 bg-pink-500/10 text-pink-500 rounded-2xl mb-2">
            <Heart size={22} />
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">Atributos Comunicáveis</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            Qualidades relacionais compartilhadas ou <span className="text-pink-500">comunicadas ao ser humano</span> em medida finita e imperfeita. Elas revelam a nossa herança espiritual como imagem e semelhança de Criador, chamando-nos ao amor, justiça, santidade e bondade diária.
          </p>
        </div>
      </div>

      {/* Main Interactive Workspace Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-[1400px] mx-auto pt-4">
        {/* Left Side: Filter, Search & Attributes Cards List (7 columns on large screen) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-4 sm:p-6 bg-white dark:bg-[#1A237E]/20 rounded-3xl border border-slate-100 dark:border-white/5 shadow-xl space-y-4">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"><Search size={18} /></span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, dom, versículo ou descrição..."
                className="w-full bg-slate-55 dark:bg-slate-900 border border-slate-205 dark:border-white/10 text-slate-800 dark:text-slate-100 py-3 px-11 rounded-2xl focus:outline-none focus:border-accent font-semibold text-sm transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black uppercase text-slate-400 hover:text-red-400 cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType("All")}
                className={cn(
                  "px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-95",
                  selectedType === "All"
                    ? "bg-accent text-secondary shadow-lg shadow-accent/20"
                    : "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                )}
              >
                Todos ({DIVINE_ATTRIBUTES.length})
              </button>
              <button
                onClick={() => setSelectedType("Incomunicável")}
                className={cn(
                  "px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-2",
                  selectedType === "Incomunicável"
                    ? "bg-indigo-600 dark:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
                    : "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                )}
              >
                <Shield size={12} />
                Incomunicáveis ({DIVINE_ATTRIBUTES.filter(a => a.type === "Incomunicável").length})
              </button>
              <button
                onClick={() => setSelectedType("Comunicável")}
                className={cn(
                  "px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-2",
                  selectedType === "Comunicável"
                    ? "bg-rose-500 dark:bg-rose-600 text-white shadow-lg shadow-rose-500/20"
                    : "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                )}
              >
                <Heart size={12} />
                Comunicáveis ({DIVINE_ATTRIBUTES.filter(a => a.type === "Comunicável").length})
              </button>
            </div>
          </div>

          {/* Cards List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredAttributes.map((attr, idx) => {
                const isActive = activeId === attr.id;
                return (
                  <motion.div
                    key={attr.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => setActiveId(attr.id)}
                    className={cn(
                      "p-5 sm:p-6 bg-white dark:bg-[#1A237E]/10 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden group shadow-md",
                      isActive
                        ? "border-[#cfaf72] dark:border-[#cfaf72] bg-gradient-to-b from-[#cfaf72]/5 to-[#cfaf72]/15 shadow-xl shadow-accent/5 ring-1 ring-accent"
                        : "border-transparent hover:border-slate-200 dark:hover:border-white/10"
                    )}
                  >
                    {/* Floating Glow Indicator based on type */}
                    <div className={cn(
                      "absolute top-0 right-0 w-2 h-full",
                      attr.type === "Incomunicável" ? "bg-indigo-500" : "bg-rose-500"
                    )} />

                    {/* Meta info */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border",
                          attr.type === "Incomunicável"
                            ? "bg-indigo-400/5 text-indigo-500 dark:text-indigo-400 border-indigo-400/20"
                            : "bg-rose-400/5 text-rose-500 dark:text-rose-400 border-rose-404/20"
                        )}>
                          {attr.type}
                        </span>
                        <Bookmark size={14} className={cn("text-slate-300", isActive && "text-accent animate-bounce")} />
                      </div>

                      {/* Title and Short description */}
                      <div className="space-y-1.5">
                        <h4 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-white group-hover:text-accent duration-150 leading-tight">
                          {attr.name}
                        </h4>
                        <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed font-semibold">
                          {attr.shortDescription}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action bar inside Card */}
                    <span className="inline-flex items-center gap-1.5 mt-5 text-[10px] uppercase font-black text-[#cfaf72] self-start border-b border-dashed border-[#cfaf72]/40 hover:border-[#cfaf72] transition-colors leading-none pb-0.5">
                      {isActive ? "Lendo Estudo ▲" : "Ler Passagens & Estudo ▼"}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredAttributes.length === 0 && (
              <div className="col-span-full py-16 text-center space-y-3 bg-white dark:bg-[#1A237E]/5 rounded-3xl border border-dashed border-slate-250 dark:border-white/10">
                <BookOpen size={48} className="mx-auto text-slate-300 dark:text-slate-600" />
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">Nenhum atributo correspondeu aos seus filtros.</p>
                <button
                  onClick={() => { setSearchTerm(""); setSelectedType("All"); }}
                  className="px-4 py-2 bg-accent hover:bg-white text-secondary text-xs uppercase font-black tracking-widest rounded-xl transition-all"
                >
                  Resetar Filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Detailed Reader Workspace (5 columns) */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <AnimatePresence mode="wait">
            {activeAttribute ? (
              <motion.div
                key={activeAttribute.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 sm:p-8 bg-white dark:bg-secondary rounded-3xl border border-slate-100 dark:border-white/5 shadow-2xl relative overflow-hidden space-y-6"
              >
                {/* Visual Header Indicator */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#cfaf72] tracking-widest block mb-1">
                      Estudo Doutrinário: {activeAttribute.type}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#1A237E] dark:text-white leading-tight">
                      {activeAttribute.name}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveId(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition"
                    title="Fechar estudo"
                  >
                    ✕
                  </button>
                </div>

                {/* Long description text */}
                <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-semibold whitespace-pre-line text-justify">
                  {activeAttribute.longDescription}
                </div>

                {/* Bible Verses Section */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
                  <h4 className="text-xs uppercase tracking-widest font-black text-accent flex items-center gap-2">
                    <Quote size={14} />
                    Fundamentos e Passagens Bíblicas:
                  </h4>
                  <div className="space-y-4">
                    {activeAttribute.verses.map((v, i) => (
                      <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900rounded-2xl border border-slate-100 dark:border-white/5 relative">
                        {/* Custom decorative Quote bracket */}
                        <div className="absolute top-3 left-3 opacity-15"><Quote size={36} className="text-accent" /></div>
                        
                        <div className="pl-6 space-y-2 relative">
                          <p className="text-[10px] font-black uppercase tracking-wider text-amber-500 dark:text-accent-orange">
                            {v.ref}
                          </p>
                          <p className="text-xs sm:text-xs text-slate-600 dark:text-slate-300 font-mono italic leading-relaxed text-left leading-normal">
                            &ldquo;{v.text}&rdquo;
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Encouraging Footer Note */}
                <div className="text-center p-4 bg-amber-50/20 dark:bg-amber-950/20 rounded-2xl text-[10px] sm:text-xs font-bold text-[#cfaf72] leading-normal border border-[#cfaf72]/10">
                  📖 Use estes versículos e significados teológicos para adoração privada, meditação bíblica e pregação sincera em sua paróquia ou lar.
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-10 text-center space-y-4 bg-slate-100/50 dark:bg-[#1A237E]/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/5"
              >
                <div className="w-16 h-16 bg-accent/10 text-[#cfaf72] rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <Bookmark size={28} />
                </div>
                <div className="space-y-1.5 max-w-xs mx-auto">
                  <h3 className="text-md sm:text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">Painel de Leitura</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                    Selecione qualquer atributo de Deus na lista lateral para abrir e examinar o estudo teológico detalhado correspondente e todas as suas passagens bíblicas sagradas de apoio.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
