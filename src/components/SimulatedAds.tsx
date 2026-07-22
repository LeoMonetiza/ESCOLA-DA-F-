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
  if (typeof window === "undefined") return { views: 0, revenue: 0, isPro: true };
  const views = Number(localStorage.getItem("sim_ad_views") || "0");
  const revenue = Number(localStorage.getItem("sim_ad_revenue") || "0");
  const isPro = true; // Always true to skip repeating ads
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
export function ThemeBanner(_props?: { type?: string; onCtaClick?: () => void }) {
  return null;
}

export function NativeFeedAd(_props?: { positionIndex?: number }) {
  return null;
}

export function InterstitialAdModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    onClose?.();
  }, [onClose]);
  return null;
}

export function RewardedVideoAdSimulator({ onAdCompleted }: { onAdCompleted: () => void; courseTitle?: string; onClose?: () => void }) {
  useEffect(() => {
    onAdCompleted?.();
  }, [onAdCompleted]);
  return null;
}

export function AdMetricsPanel() {
  return null;
}
