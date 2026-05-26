import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Play, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  BookOpen, 
  Compass, 
  CheckCircle, 
  Tv, 
  ExternalLink, 
  Clock,
  Coins,
  Shield,
  Star
} from "lucide-react";
import { cn } from "@/src/lib/utils";

// --- Types ---
export type AdType = "banner" | "discreet" | "footer" | "native-feed" | "native-module";

export interface AdTheme {
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  tag: string;
  icon: string;
  color: string;
}

// --- High Quality Simulated Biblical Ads Content ---
export const BIBLICAL_ADS_POOL: AdTheme[] = [
  {
    title: "Curso Avançado de Hebraico Bíblico",
    subtitle: "Alfa & Ômega Teologia",
    description: "Aprenda de uma vez por todas a ler e interpretar o Antigo Testamento no texto original com o método de gramática progressiva.",
    cta: "Matricular com 50% OFF",
    tag: "Patrocinado",
    icon: "📜",
    color: "from-amber-600 to-amber-900",
  },
  {
    title: "Bíblia Histórica com Notas Arqueológicas",
    subtitle: "Editora Geográfica Sagrada",
    description: "Centenas de fotos coloridas, mapas georreferenciados em 3D e notas que trazem o contexto cultural original direto dos manuscritos.",
    cta: "Garantir Exemplar",
    tag: "Sugestão da Editora",
    icon: "📖",
    color: "from-blue-600 to-indigo-950",
  },
  {
    title: "Bacharelado EAD em Teologia Sistemática",
    subtitle: "Seminário de Fé & Ciências",
    description: "Formação completa com diploma autorizado, focando em Hermenêutica, Apologética Cristianismo e História da Igreja Antiga.",
    cta: "Iniciar Aula Grátis",
    tag: "Curso Livre",
    icon: "🎓",
    color: "from-emerald-700 to-slate-900",
  },
  {
    title: "Caravana Judéia & Galileia 2026",
    subtitle: "Terra Santa Operadora",
    description: "Uma imersão geográfica e arqueológica incomparável. Viaje acompanhado por doutores em História Bíblica. Vagas abertas!",
    cta: "Solicitar Cronograma",
    tag: "Viagem Cultural",
    icon: "🐫",
    color: "from-purple-700 to-pink-900",
  },
  {
    title: "Remover Anúncios - Escola da Fé PRO",
    subtitle: "Apoie Nossa Obra",
    description: "Gostaria de uma experiência com foco absoluto e sem nenhuma distração de propaganda? Faça parte dos apoiadores por apenas R$ 4,90.",
    cta: "Seja Apoiador Pro",
    tag: "Escola da Fé PRO",
    icon: "✨",
    color: "from-yellow-500 to-orange-600",
  }
];

// --- Global Context / State Store for Ad Simulated Settings ---
// We use localStorage to track statistics and if the user unlocked "PRO" (which disables ads to make the app more magical)
export const getAdStats = () => {
  if (typeof window === "undefined") return { views: 0, revenue: 0, isPro: false };
  const views = Number(localStorage.getItem("sim_ad_views") || "0");
  const revenue = Number(localStorage.getItem("sim_ad_revenue") || "0");
  const isPro = localStorage.getItem("sim_ad_is_pro") === "true";
  return { views, revenue, isPro };
};

export const recordAdImpression = (revenueAmount = 0.05) => {
  if (typeof window === "undefined") return { views: 0, revenue: 0, isPro: false };
  const stats = getAdStats();
  const nextViews = stats.views + 1;
  const nextRevenue = Number((stats.revenue + revenueAmount).toFixed(4));
  localStorage.setItem("sim_ad_views", String(nextViews));
  localStorage.setItem("sim_ad_revenue", String(nextRevenue));
  
  // Dispatch a custom event to update other parts of the UI in real-time
  window.dispatchEvent(new Event("sim_ad_update"));
  return { views: nextViews, revenue: nextRevenue, isPro: stats.isPro };
};

export const setProStatus = (pro: boolean) => {
  localStorage.setItem("sim_ad_is_pro", String(pro));
  window.dispatchEvent(new Event("sim_ad_update"));
};

// --- AD COMPONENT 1: Small sticky or inline banner (For Footer / Top Page Header) ---
export function ThemeBanner({ 
  type, 
  onCtaClick 
}: { 
  type: "small" | "discreet" | "footer", 
  onCtaClick?: () => void 
}) {
  const [ad, setAd] = useState<AdTheme | null>(null);
  const [closed, setClosed] = useState(false);
  const [stats, setStats] = useState(getAdStats);

  useEffect(() => {
    // Pick an ad based on type or select a random one
    const index = type === "discreet" ? 1 : type === "footer" ? 0 : 2;
    setAd(BIBLICAL_ADS_POOL[index] || BIBLICAL_ADS_POOL[0]);

    const handleUpdate = () => setStats(getAdStats());
    window.addEventListener("sim_ad_update", handleUpdate);
    return () => window.removeEventListener("sim_ad_update", handleUpdate);
  }, [type]);

  // Record impression only once on load if not closed and not pro
  useEffect(() => {
    if (!closed && !stats.isPro) {
      recordAdImpression(type === "footer" ? 0.008 : 0.005);
    }
  }, [closed, stats.isPro]);

  if (stats.isPro || closed || !ad) return null;

  // Render style according to layout request
  if (type === "footer") {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-secondary/95 dark:bg-slate-900/98 border-t border-accent/20 backdrop-blur-md shadow-2xl flex items-center justify-between transition-all">
        <div className="max-w-[1920px] mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-3 text-white px-4 md:px-10">
          <div className="flex items-center gap-4">
            <span className="text-2xl hidden sm:inline">{ad.icon}</span>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-[9px] bg-accent text-secondary font-black uppercase px-2 py-0.5 rounded tracking-wider">{ad.tag}</span>
                <span className="text-xs font-black text-slate-100">{ad.title}</span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium line-clamp-1">{ad.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-center">
            <button 
              onClick={() => {
                alert(`[Simulação] Você clicou no anúncio de: ${ad.title}! Isso o guiaria para a página externa do patrocinador.`);
                onCtaClick?.();
              }}
              className="py-1.5 px-6 rounded-full bg-accent text-secondary hover:bg-white text-xs font-black transition-colors"
            >
              {ad.cta}
            </button>
            <button 
              onClick={() => setClosed(true)} 
              className="p-1 px-2.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-xs font-black flex items-center gap-1"
              title="Ocultar Anúncio"
            >
              <X size={12} /> <span className="text-[10px]">Ocultar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // "Discreet Banner" inside contents or at the bottom of a detailed view
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl p-5 border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm",
        type === "discreet" 
          ? "bg-slate-50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800/60" 
          : "bg-slate-100/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-border-dark"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-2xl shrink-0">
          {ad.icon}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[8px] bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black tracking-widest uppercase px-1.5 py-0.5 rounded">
              {ad.tag}
            </span>
            <h5 className="font-bold text-heading text-sm">{ad.title}</h5>
          </div>
          <p className="text-xs text-muted font-medium leading-relaxed max-w-xl">{ad.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <button 
          onClick={() => {
            alert(`[Simulação] Abrindo o link patrocinado para: ${ad.title}`);
            onCtaClick?.();
          }}
          className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-primary rounded-xl font-bold text-xs hover:opacity-90 transition-all shrink-0 active:scale-95 flex items-center gap-1.5"
        >
          {ad.cta} <ExternalLink size={12} />
        </button>
        <button 
          onClick={() => setClosed(true)} 
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          title="Ocultar anúncio"
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  );
}

// --- AD COMPONENT 2: Native Feed Ad (Styled elegantly as a Bento card item to inject between content feeds) ---
export function NativeFeedAd({ positionIndex }: { positionIndex: number }) {
  const [ad, setAd] = useState<AdTheme | null>(null);
  const [stats, setStats] = useState(getAdStats);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    // Select an advertising campaign from the pool
    setAd(BIBLICAL_ADS_POOL[positionIndex % BIBLICAL_ADS_POOL.length]);
    
    const handleUpdate = () => setStats(getAdStats());
    window.addEventListener("sim_ad_update", handleUpdate);
    return () => window.removeEventListener("sim_ad_update", handleUpdate);
  }, [positionIndex]);

  useEffect(() => {
    if (!closed && !stats.isPro) {
      recordAdImpression(0.012); // Native ads pay higher simulated CPM
    }
  }, [closed, stats.isPro]);

  if (stats.isPro || closed || !ad) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="col-span-1 rounded-[3rem] overflow-hidden bg-gradient-to-br from-slate-900 via-secondary to-slate-950 text-white p-8 md:p-10 shadow-2xl relative flex flex-col justify-between border border-white/5 active:scale-[0.99] transition-all group"
    >
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <span className="text-[8px] bg-white/15 backdrop-blur-sm tracking-widest uppercase font-black px-2 mt-0.5 py-1 rounded text-accent">
          {ad.tag}
        </span>
        <button 
          onClick={() => setClosed(true)} 
          className="p-1.5 bg-white/5 hover:bg-white/15 rounded-xl text-slate-300 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <div className="space-y-6 pt-6">
        <div className="w-16 h-16 rounded-[1.8rem] bg-white/10 flex items-center justify-center text-3xl shadow-inner rotate-3 group-hover:rotate-12 transition-transform">
          {ad.icon}
        </div>
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-[#cfaf72] mb-1 block">
            {ad.subtitle}
          </span>
          <h4 className="text-2xl font-black tracking-tight leading-tight group-hover:text-[#cfaf72] transition-colors mb-3">
            {ad.title}
          </h4>
          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            {ad.description}
          </p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between gap-4">
        <button 
          onClick={() => alert(`[Simulação] Abrindo: ${ad.title}`)}
          className="py-3 px-6 bg-accent text-secondary hover:bg-white text-xs font-black rounded-2xl tracking-wide transition-colors flex items-center gap-2"
        >
          {ad.cta} <ExternalLink size={12} />
        </button>
        <span className="text-[9px] text-slate-500 font-black tracking-widest uppercase">Parceria Escola</span>
      </div>
    </motion.div>
  );
}

// --- AD COMPONENT 3: Interstitial Full Screen Ad (Shows in Studies after 3 study clicks) ---
export function InterstitialAdModal({ 
  onClose 
}: { 
  onClose: () => void 
}) {
  const [ad, setAd] = useState<AdTheme | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [stats, setStats] = useState(getAdStats);
  const [isDismissable, setIsDismissable] = useState(false);

  useEffect(() => {
    // Select one specific ad designed for Interstitial
    setAd(BIBLICAL_ADS_POOL[2]); // Theology EAD Degree

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsDismissable(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!stats.isPro) {
      recordAdImpression(0.045); // Interstitial pays the highest premium revenue
    }
  }, [stats.isPro]);

  if (stats.isPro || !ad) {
    // Immediately close if PRO mode is active
    setTimeout(onClose, 0);
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-[200] flex items-center justify-center p-4 sm:p-6"
    >
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center text-white md:px-12">
        <div className="flex items-center gap-3">
          <Shield size={18} className="text-accent animate-pulse" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-accent">Anúncio de Patrocínio</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-slate-400">
            Apoie o app grátis assistindo os anúncios
          </span>
          {isDismissable ? (
            <button 
              onClick={onClose}
              className="py-2.5 px-6 rounded-2xl bg-white/10 hover:bg-white text-white hover:text-secondary font-black text-xs transition-all flex items-center gap-2 shadow-lg"
            >
              Fechar Anúncio <X size={14} />
            </button>
          ) : (
            <div className="py-2.5 px-6 rounded-2xl bg-black/50 text-slate-300 font-bold text-xs flex items-center gap-2 border border-white/5">
              Pular em {countdown}s... <Clock size={12} className="animate-spin text-accent" />
            </div>
          )}
        </div>
      </div>

      <motion.div 
        initial={{ scale: 0.92, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-4xl bg-secondary dark:bg-slate-900 border border-white/10 rounded-[3.5rem] overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-2xl text-white relative"
      >
        <div className="md:col-span-5 bg-gradient-to-tr from-[#cfaf72]/20 to-[#cfaf72]/5 px-10 py-16 md:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-20 h-20 bg-accent rounded-[2rem] flex items-center justify-center text-4xl mb-10 shadow-lg">
              {ad.icon}
            </div>
            <span className="text-xs bg-[#cfaf72] text-secondary px-3 py-1 font-black rounded uppercase tracking-wider">
              {ad.tag}
            </span>
            <p className="mt-4 text-xs font-black tracking-widest text-[#cfaf72] uppercase">{ad.subtitle}</p>
          </div>
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.25em] relative z-10 mt-12 md:mt-0">
            Escola da Fé Patrocinador
          </div>
        </div>

        <div className="md:col-span-7 p-6 sm:p-10 md:p-16 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-[#cfaf72] leading-none">
              {ad.title}
            </h3>
            <p className="text-slate-200 text-sm md:text-base leading-relaxed font-semibold">
              {ad.description}
            </p>
            <div className="space-y-3 bg-white/5 p-6 rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle size={14} className="text-[#cfaf72]" />
                <span>Certificado Teológico Válido Nacionalmente</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle size={14} className="text-[#cfaf72]" />
                <span>Formatos Mobile / Tablet & Web</span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
            <button 
              onClick={() => {
                alert(`[Simulação] Abrindo o link do parceiro: ${ad.title}`);
                onClose();
              }}
              className="w-full sm:w-auto px-10 py-5 bg-accent text-secondary hover:bg-white text-sm font-black rounded-2xl tracking-wide transition-colors flex items-center justify-center gap-3"
            >
              Iniciar Inscrição <ExternalLink size={16} />
            </button>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xs font-black transition-all flex items-center gap-1 uppercase tracking-widest"
            >
              Desejo Ler Meus Conteúdos
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- AD COMPONENT 4: Rewarded Optional Video Ad Simulator (For Advanced Teologia & Cursos) ---
export function RewardedVideoAdSimulator({ 
  courseTitle, 
  onAdCompleted, 
  onClose 
}: { 
  courseTitle: string; 
  onAdCompleted: () => void; 
  onClose: () => void; 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(5); // 5s simulation
  const [progress, setProgress] = useState(0);
  const [sound, setSound] = useState(false);
  const [stats, setStats] = useState(getAdStats);
  const [videoAdUnit, setVideoAdUnit] = useState<AdTheme | null>(null);

  useEffect(() => {
    // Pick the most gorgeous ad
    setVideoAdUnit(BIBLICAL_ADS_POOL[3]); // Camel / Terra Santa travel
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      const increment = 100 / (duration * 20); // updates every 50ms
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            if (!stats.isPro) {
              recordAdImpression(0.065); // Generous rewarded CPM
            }
            onAdCompleted();
            return 100;
          }
          return prev + increment;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, onAdCompleted, stats.isPro]);

  if (stats.isPro || !videoAdUnit) {
    setTimeout(onAdCompleted, 0);
    return null;
  }

  // Choose content representation
  const activeSecondsLeft = Math.ceil(duration - (progress * duration) / 100);

  return (
    <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-2xl z-[220] flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {!isPlaying && progress === 0 ? (
          // Pre-video Invitation
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg bg-secondary dark:bg-card-dark rounded-[3rem] p-8 md:p-12 text-white border border-white/10 text-center space-y-8 shadow-2xl"
          >
            <div className="w-20 h-20 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Tv size={36} className="animate-pulse" />
            </div>

            <div className="space-y-3">
              <span className="text-[10px] uppercase font-black tracking-widest bg-accent text-secondary px-3 py-1 rounded">Apoie a Escola</span>
              <h3 className="text-2xl font-black tracking-tight mt-3">Assistir Vídeo Recomendado</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                Este é um conteúdo teológico longo de alto nível: <strong>{courseTitle}</strong>. 
                Assista a um vídeo de 5s de nossos patrocinadores para desbloquear instantaneamente ou escolha ler diretamente.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setIsPlaying(true)}
                className="w-full py-4.5 bg-accent text-secondary hover:bg-white rounded-2xl font-black text-sm tracking-wide transition-colors flex items-center justify-center gap-3 shadow-xl shadow-accent/10 active:scale-95"
              >
                <Play size={16} className="fill-current" /> Assistir Comercial (5s)
              </button>
              <div className="flex justify-between gap-4">
                <button 
                  onClick={onAdCompleted} // Allows bypass for lovely user friendliness!
                  className="flex-1 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-bold text-xs transition-colors"
                >
                  Continuar Sem Assistir
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-bold text-xs transition-colors"
                >
                  Voltar
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          // Active Video Player simulator
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-2xl bg-black rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl relative"
          >
            {/* Elegant Cinematic Visual Background */}
            <div className="h-96 md:h-[400px] bg-gradient-to-tr from-[#cfaf72]/30 via-slate-950 to-purple-950 flex flex-col justify-between p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                <Compass size={600} className="animate-spin-slow" />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none z-0" />

              {/* Top Controls */}
              <div className="flex justify-between items-center relative z-10 text-white">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5">
                  <Star size={12} className="text-accent fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-accent">Sponsor Video</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSound(!sound)}
                    className="p-2 bg-black/40 backdrop-blur-md hover:bg-black/60 rounded-xl transition-colors"
                  >
                    {sound ? <Volume2 size={16} /> : <VolumeX size={16} className="text-slate-400" />}
                  </button>
                  <span className="text-[10px] font-black bg-black/60 px-3 py-1.5 rounded-xl border border-white/10">
                    O estudo abrirá em: {activeSecondsLeft}s
                  </span>
                </div>
              </div>

              {/* Main Ad Copy Area */}
              <div className="relative z-10 space-y-4 max-w-lg mt-auto text-white">
                <span className="text-[10px] text-accent font-black tracking-widest uppercase block">{videoAdUnit.subtitle}</span>
                <h4 className="text-3xl font-black tracking-tight leading-none text-[#cfaf72]">{videoAdUnit.title}</h4>
                <p className="text-xs text-slate-200 leading-relaxed font-medium line-clamp-3">{videoAdUnit.description}</p>
              </div>
            </div>

            {/* Video Progress Bar */}
            <div className="h-1.5 w-full bg-slate-800 relative z-20">
              <div 
                className="h-full bg-accent transition-all duration-50"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Bottom Panel */}
            <div className="bg-slate-900 px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 z-20 relative text-white">
              <div className="flex items-center gap-3 text-left">
                <span className="text-2xl">{videoAdUnit.icon}</span>
                <div>
                  <h5 className="text-xs font-black tracking-tight">{videoAdUnit.title}</h5>
                  <p className="text-[10px] text-slate-400">Patrocinador oficial do Escola da Fé</p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => alert(`[Simulação] Redirecionando para o link parceiro.`)}
                  className="w-fit ml-auto sm:ml-0 px-6 py-2.5 bg-white hover:bg-accent hover:text-[#0b132b] text-secondary font-black text-xs rounded-xl tracking-wide transition-colors flex items-center gap-2"
                >
                  Saber Mais <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- AD SETTINGS PANEL: An optional tiny bar showing metrics to developer/user to demo the ads ---
export function AdMetricsPanel() {
  const [stats, setStats] = useState(getAdStats);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleUpdate = () => setStats(getAdStats());
    window.addEventListener("sim_ad_update", handleUpdate);
    return () => window.removeEventListener("sim_ad_update", handleUpdate);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-3 left-3 z-[110] bg-secondary/95 dark:bg-slate-900/98 text-[11px] text-slate-300 px-4 py-3 rounded-2xl border border-accent/20 shadow-xl flex flex-col gap-2 max-w-sm backdrop-blur-md">
      <div className="flex items-center justify-between gap-6 border-b border-white/5 pb-1.5">
        <div className="flex items-center gap-2">
          <Coins size={12} className="text-accent animate-pulse" />
          <h6 className="font-black text-white hover:text-accent tracking-tight">Simulador de Monetização</h6>
        </div>
        <button 
          onClick={() => setVisible(false)} 
          className="p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white"
        >
          <X size={10} />
        </button>
      </div>

      <div className="space-y-1 text-[10px]">
        <div className="flex justify-between gap-4">
          <span>Visualizações de Anúncio:</span>
          <strong className="text-white">{stats.views} imps</strong>
        </div>
        <div className="flex justify-between gap-4">
          <span>Receita Teórica (Simulada CPM):</span>
          <strong className="text-amber-400">${stats.revenue.toFixed(3)} USD</strong>
        </div>
        <div className="flex justify-between gap-4 border-t border-white/5 pt-1.5 items-center">
          <span>Modo Apoiador PRO (Sem Ads):</span>
          <button 
            onClick={() => setProStatus(!stats.isPro)}
            className={cn(
              "px-2 py-0.5 text-[8px] font-black rounded tracking-widest uppercase transition-all duration-300",
              stats.isPro ? "bg-accent text-secondary" : "bg-slate-700 text-slate-300"
            )}
          >
            {stats.isPro ? "PRO: Ativo" : "PRO: Inativo"}
          </button>
        </div>
      </div>
      <div className="text-[8px] text-slate-400 italic text-center mt-0.5">
        "Isso simula o fluxo de anúncios de forma sutil."
      </div>
    </div>
  );
}
