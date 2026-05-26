import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Download, 
  FileText, 
  FileDown, 
  Trash2, 
  Plus, 
  X, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Play, 
  ShieldAlert, 
  ExternalLink,
  Briefcase,
  Layers,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";
import { cn } from "@/src/lib/utils";

// --- Types ---
interface BookletItem {
  id: string;
  title: string;
  category: string;
  content: string;
}

// Custom event to communicate between components
export const addToBookletEvent = (item: { id: string; title: string; category?: string; content: string }) => {
  window.dispatchEvent(new CustomEvent("add-to-booklet", { 
    detail: {
      id: item.id,
      title: item.title,
      category: item.category || "Estudo Bíblico",
      content: item.content
    }
  }));
};

export default function LivretoManager() {
  const [booklet, setBooklet] = useState<BookletItem[]>(() => {
    try {
      const saved = localStorage.getItem("escola_da_fe_booklet");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Monetization & Download Counts
  const [downloadCount, setDownloadCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("escola_da_fe_downloads");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Forced Ad display
  const [showForcedAd, setShowForcedAd] = useState(false);
  const [adTimer, setAdTimer] = useState(5);
  const [isAdClosingAllowed, setIsAdClosingAllowed] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<"pdf" | "docx" | null>(null);

  // Synchronize booklet details
  useEffect(() => {
    localStorage.setItem("escola_da_fe_booklet", JSON.stringify(booklet));
    
    // Dispatch custom event to notify components that items changed (so their buttons update state)
    window.dispatchEvent(new CustomEvent("booklet-updated", { detail: booklet }));
  }, [booklet]);

  // Synchronize download metrics
  useEffect(() => {
    localStorage.setItem("escola_da_fe_downloads", downloadCount.toString());
  }, [downloadCount]);

  // Listener for dynamic Add To Booklet from other page views
  useEffect(() => {
    const handleAddEvent = (e: Event) => {
      const customEvent = e as CustomEvent<BookletItem>;
      if (!customEvent.detail) return;

      const newItem = customEvent.detail;
      
      setBooklet(prev => {
        // If already added, remove it (acts as toggle!)
        const exists = prev.some(item => item.id === newItem.id);
        if (exists) {
          showSuccess("Item removido do seu livreto de estudos.");
          return prev.filter(item => item.id !== newItem.id);
        }

        // Limit of max 2 items inside document
        if (prev.length >= 2) {
          showError("Limite atingido! Você só pode compilar no máximo 2 ensinos ou histórias em um único documento.");
          return prev;
        }

        showSuccess(`"${newItem.title}" adicionado ao seu livreto.`);
        return [...prev, newItem];
      });
    };

    window.addEventListener("add-to-booklet", handleAddEvent);
    return () => {
      window.removeEventListener("add-to-booklet", handleAddEvent);
    };
  }, []);

  // Timer logic for forced video or interstitial ad
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showForcedAd && adTimer > 0) {
      interval = setInterval(() => {
        setAdTimer(prev => {
          if (prev <= 1) {
            setIsAdClosingAllowed(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showForcedAd, adTimer]);

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 5000);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const removeItem = (id: string) => {
    setBooklet(prev => prev.filter(item => item.id !== id));
    showSuccess("Item removido do livreto.");
  };

  const handleCopyToClipboard = () => {
    if (booklet.length === 0) {
      showError("Seu livreto está vazio. Adicione ensinos ou histórias primeiro!");
      return;
    }
    try {
      const text = booklet
        .map((item, index) => {
          return `=== ${index + 1}. ${item.title.toUpperCase()} ===\nCategoria: ${item.category}\n\n${item.content}\n`;
        })
        .join("\n--------------------------------------------------\n\n");
      
      const fullTextWithQuote = `${text}\n\n"Lâmpada para os meus pés é tua palavra e luz, para o meu caminho." — Salmos 119:105\nGerado sob o aplicativo Escola da Fé.`;
      
      navigator.clipboard.writeText(fullTextWithQuote);
      showSuccess("Conteúdo do livreto copiado! Você pode colá-lo onde desejar.");
    } catch {
      showError("Não foi possível copiar automaticamente.");
    }
  };

  const triggerDownloadProcess = (format: "pdf" | "docx") => {
    if (booklet.length === 0) {
      showError("Seu livreto está vazio. Adicione ensinos ou histórias primeiro!");
      return;
    }

    // Increment download count
    const nextCount = downloadCount + 1;
    setDownloadCount(nextCount);

    // If this represents 2 downloads (e.g. multiple of 2), show forced monetization ad!
    if (nextCount > 0 && nextCount % 2 === 0) {
      setPendingFormat(format);
      setAdTimer(5);
      setIsAdClosingAllowed(false);
      setShowForcedAd(true);
    } else {
      // Direct instant download
      if (format === "pdf") {
        generateAndDownloadPDF();
      } else {
        generateAndDownloadDOCX();
      }
      showSuccess("Iniciando download! Bons estudos na fé.");
    }
  };

  // 1. Generate elegant PDF document via margins wrapper
  const generateAndDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    let currentY = 25;

    // Cover / Header Decoration
    doc.setFillColor(11, 19, 43); // #0b132b deep navy
    doc.rect(0, 0, pageWidth, 12, "F");

    // Banner Text
    doc.setTextColor(207, 175, 114); // #cfaf72 gold/amber
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("ESCOLA DA FÉ — COMPILADO DE ESTUDOS TEOLÓGICOS", pageWidth / 2, 8, { align: "center" });

    // Document Title
    currentY += 10;
    doc.setTextColor(11, 19, 43);
    doc.setFontSize(22);
    doc.text("Meu Livreto De Estudos", margin, currentY);
    
    currentY += 6;
    doc.setFillColor(207, 175, 114);
    doc.rect(margin, currentY, 40, 1.5, "F");

    // Metadata details
    currentY += 12;
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Compilado em: ${new Date().toLocaleDateString("pt-BR")} | Documento Oficial Escola da Fé`, margin, currentY);

    // Dynamic items render
    booklet.forEach((item, index) => {
      if (currentY > pageHeight - 50) {
        doc.addPage();
        currentY = 25;
      }

      currentY += 15;
      // Item Title Banner
      doc.setFillColor(248, 250, 252); // light slate background
      doc.rect(margin, currentY, contentWidth, 14, "F");
      
      doc.setTextColor(15, 23, 42); // dark slate
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${item.title.toUpperCase()}`, margin + 5, currentY + 9);
      
      currentY += 20;

      // Category Accent
      doc.setTextColor(207, 175, 114);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.text(`Tópico Teológico: ${item.category}`, margin, currentY);
      
      currentY += 8;

      // Text Content processing (handling lines overflowing A4 width)
      doc.setTextColor(51, 65, 85); // body text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);

      // Clean double carriage returns for paragraph spacings
      const normalizedContent = item.content.replace(/\r\n/g, "\n");
      const textLines = doc.splitTextToSize(normalizedContent, contentWidth);

      // Print lines, creating page breaks if text height exceeds page space
      textLines.forEach((line: string) => {
        if (currentY > pageHeight - 20) {
          doc.addPage();
          
          // Header on new pages
          doc.setFillColor(11, 19, 43);
          doc.rect(0, 0, pageWidth, 10, "F");
          doc.setTextColor(207, 175, 114);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.text("ESCOLA DA FÉ — CONTINUAÇÃO", pageWidth / 2, 7, { align: "center" });

          currentY = 25;
          doc.setTextColor(51, 65, 85);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10.5);
        }
        
        doc.text(line, margin, currentY);
        currentY += 6.5; // line height
      });

      // Add separator space between booklet items
      currentY += 10;
    });

    // Footer signature page ending
    if (currentY > pageHeight - 30) {
      doc.addPage();
      currentY = 25;
    }
    
    currentY += 10;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    
    currentY += 10;
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.text("''Guardei no coração a tua palavra para não pecar contra ti.'' — Salmos 119:11", pageWidth / 2, currentY, { align: "center" });

    doc.save(`Escola_da_Fe_Livreto_Personalizado_${Date.now()}.pdf`);
  };

  // 2. Generate and download DOCX compatible MHTML file that opens perfectly in MS Word or Google Docs
  const generateAndDownloadDOCX = () => {
    let docHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Escola da Fé - Compilação de Estudos</title>
        <style>
          body { 
            font-family: 'Calibri', 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #1e293b; 
            padding: 40px; 
          }
          .header-banner {
            background-color: #0b132b;
            color: #cfaf72;
            padding: 15px;
            text-align: center;
            font-weight: bold;
            font-size: 11pt;
            letter-spacing: 2px;
            margin-bottom: 40px;
          }
          h1 { 
            color: #0b132b; 
            border-bottom: 3px solid #cfaf72; 
            padding-bottom: 15px; 
            font-size: 24pt; 
            margin-bottom: 5px; 
            font-family: 'Georgia', 'Times New Roman', serif;
          }
          .subtitle {
            color: #64748b;
            font-size: 10pt;
            margin-bottom: 50px;
          }
          .study-box {
            margin-bottom: 50px;
            page-break-inside: avoid;
          }
          h2 { 
            color: #cfaf72; 
            font-size: 18pt; 
            font-weight: bold; 
            margin-top: 30px; 
            margin-bottom: 10px;
            border-left: 5px solid #0b132b;
            padding-left: 15px;
            font-family: 'Georgia', 'Times New Roman', serif;
          }
          .category {
            color: #94a3b8;
            font-size: 9pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 25px;
          }
          p { 
            font-size: 11.5pt; 
            text-align: justify; 
            margin-bottom: 15px; 
            text-indent: 30px; 
          }
          .footer { 
            text-align: center; 
            font-size: 9pt; 
            color: #94a3b8; 
            margin-top: 80px; 
            border-top: 1px solid #e2e8f0; 
            padding-top: 20px; 
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <div class="header-banner">
          ESCOLA DA FÉ — COMPILADO DE EXEGESE E ESTUDOS TEOLÓGICOS
        </div>

        <h1>Meu Livreto De Leituras</h1>
        <div class="subtitle">
          Documento exportado em ${new Date().toLocaleDateString("pt-BR")} | Escola da Fé Aplicativo PWA
        </div>
    `;

    booklet.forEach((item, index) => {
      docHtml += `
        <div class="study-box">
          <h2>${index + 1}. ${item.title}</h2>
          <div class="category">Categoria: ${item.category}</div>
          <div class="content-body">
            ${item.content.split("\n\n").map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join("")}
          </div>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;" />
      `;
    });

    docHtml += `
        <div class="footer">
          "Lâmpada para os meus pés é tua palavra e luz, para o meu caminho." — Salmos 119:105<br>
          Gerado sob o aplicativo Escola da Fé. Versão Offline Habilitada.
        </div>
      </body>
      </html>
    `;

    // Package as blob & download directly as Word Doc (.doc extension opens seamlessly in Word)
    const blob = new Blob(["\ufeff" + docHtml], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Escola_da_Fe_Livreto_Personalizado_${Date.now()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Close ad, trigger download and state
  const handleCloseAdAndDownload = () => {
    setShowForcedAd(false);
    if (pendingFormat === "pdf") {
      generateAndDownloadPDF();
    } else if (pendingFormat === "docx") {
      generateAndDownloadDOCX();
    }
    setPendingFormat(null);
  };

  return (
    <>
      {/* Floating Booklet Indicator bottom action button */}
      <div className="fixed bottom-24 right-4 z-[130] font-sans">
        <motion.button
          onClick={() => setIsOpen(true)}
          className={cn(
            "p-4 bg-[#0b132b] hover:bg-white text-white hover:text-secondary rounded-full shadow-2xl border-2 transition-all flex items-center justify-center gap-2",
            booklet.length > 0 
              ? "border-[#cfaf72] animate-pulse bg-gradient-to-r from-[#111e42] to-[#0b132b]" 
              : "border-slate-800"
          )}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          title="Ver meu livreto personalizado"
        >
          <div className="relative">
            <BookOpen size={22} />
            {booklet.length > 0 && (
              <span className="absolute -top-3 -right-3 px-2 py-0.5 rounded-full bg-accent text-secondary font-black text-[9px] border border-secondary leading-none">
                {booklet.length}
              </span>
            )}
          </div>
          {booklet.length > 0 && (
            <span className="text-xs font-black uppercase tracking-wider pr-1 hidden sm:inline">
              Livreto ({booklet.length}/2)
            </span>
          )}
        </motion.button>
      </div>

      {/* Notifications Portal */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-36 left-4 right-4 sm:left-auto sm:right-4 z-[140] w-full max-w-sm bg-emerald-950 text-emerald-100 border border-emerald-900/30 p-4 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur"
          >
            <Check size={18} className="text-emerald-400 shrink-0" />
            <span className="text-xs font-bold">{successMsg}</span>
          </motion.div>
        )}

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-36 left-4 right-4 sm:left-auto sm:right-4 z-[140] w-full max-w-sm bg-red-950 text-red-100 border border-red-900/30 p-4 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur"
          >
            <AlertCircle size={18} className="text-red-400 shrink-0" />
            <span className="text-xs font-bold">{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-over panel for booklet construction */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[140] bg-slate-950/75 backdrop-blur-sm flex justify-end">
            {/* Click-outside layer */}
            <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="relative w-full max-w-md h-full bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-100 dark:border-border-dark flex flex-col justify-between font-sans"
            >
              <div className="p-8 border-b border-slate-100 dark:border-border-dark flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#cfaf72]/15 text-[#cfaf72] flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-heading leading-none">Compilador de Textos</h4>
                    <span className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1 block">
                      Seu livreto personalizado ({booklet.length}/2)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-slate-100 dark:bg-slate-900 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Booklet scroll content */}
              <div className="flex-grow p-6 overflow-y-auto space-y-6">
                {booklet.length === 0 ? (
                  <div className="text-center py-16 px-4 space-y-4">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-400">
                      <Layers size={24} />
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-extrabold text-heading text-sm">Nenhum estudo adicionado</h5>
                      <p className="text-[11px] text-muted max-w-xs mx-auto leading-relaxed">
                        Navegue pelos estudos bíblicos, tópicos de teologia ou histórias de santos/homens de Deus e clique em <strong>"Adicionar ao Documento"</strong> para reuni-los e exportar.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#cfaf72]/5 border border-[#cfaf72]/15 text-[#cfaf72] rounded-2xl text-[11px] font-semibold leading-relaxed flex gap-2.5">
                      <Award size={18} className="shrink-0 mt-0.5" />
                      <span>Você pode selecionar no máximo 2 temas bíblicos para exportar em formato Word (DOCX) ou PDF real em um arquivo unificado.</span>
                    </div>

                    {booklet.map((item, index) => (
                      <motion.div
                        layout
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-border-dark rounded-2xl flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <span className="text-[9px] text-[#cfaf72] font-black uppercase tracking-wider">
                            Documento {index + 1} &bull; {item.category}
                          </span>
                          <h6 className="font-extrabold text-[#0b132b] dark:text-white text-sm line-clamp-1">
                            {item.title}
                          </h6>
                          <p className="text-[10px] text-muted line-clamp-2">
                            {item.content}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all shrink-0"
                          title="Remover do compilador"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Download CTA Panel footer */}
              <div className="p-6 border-t border-slate-100 dark:border-border-dark space-y-4 bg-slate-50 dark:bg-slate-950">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-muted">
                  <span>Downloads efetuados:</span>
                  <span className="text-secondary dark:text-accent font-black bg-accent/20 dark:bg-accent/10 px-2 py-0.5 rounded">
                    {downloadCount}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => triggerDownloadProcess("pdf")}
                    disabled={booklet.length === 0}
                    className="py-4 bg-[#0b132b] hover:bg-primary dark:bg-slate-900 dark:hover:bg-slate-800 text-white font-black text-[11px] rounded-xl uppercase tracking-wider transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FileDown size={14} /> Baixar PDF
                  </button>
                  <button
                    onClick={() => triggerDownloadProcess("docx")}
                    disabled={booklet.length === 0}
                    className="py-4 bg-[#cfaf72] hover:bg-white text-secondary hover:text-secondary font-black text-[11px] rounded-xl uppercase tracking-wider transition-all shadow-md shadow-accent/10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FileText size={14} /> Baixar DOC/Word
                  </button>
                </div>

                <button
                  onClick={handleCopyToClipboard}
                  disabled={booklet.length === 0}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-[11px] rounded-xl uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800"
                >
                  <Layers size={14} /> Copiar Texto Unificado (Backup)
                </button>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl text-[10px] leading-relaxed text-center font-bold">
                  ⚠️ ATENÇÃO: Se o download direto falhar dentro do painel do AI Studio (restrição de segurança do Chrome/iFrame), clique no botão "Abrir em nova aba" no canto superior ou use o botão "Copiar Texto" acima!
                </div>
                
                <p className="text-[9px] text-center text-slate-400 dark:text-slate-500 font-medium">
                  A cada 2 downloads compilados, um anúncio é veiculado para apoiar a manutenção do projeto Escola da Fé.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Forced Monetization Video Ad Gate Simulator */}
      <AnimatePresence>
        {showForcedAd && (
          <div className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border-2 border-[#cfaf72]/30 w-full max-w-xl rounded-3xl p-8 shadow-2xl flex flex-col gap-6 text-white text-center font-sans overflow-hidden relative"
            >
              {/* Abs decoration light */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />

              {/* Title of monetization sponsor */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] bg-[#cfaf72]/20 text-[#cfaf72] border border-[#cfaf72]/30 font-black tracking-widest uppercase px-3 py-1.5 rounded-xl flex items-center gap-1">
                  <Play size={10} className="fill-[#cfaf72] animate-pulse" /> AD PATROCINADO
                </span>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase">Escola da Fé</span>
              </div>

              {/* Video Simulated frame */}
              <div className="w-full h-56 rounded-2xl bg-gradient-to-tr from-slate-950 to-slate-800 border border-white/5 relative overflow-hidden flex items-center justify-center flex-col">
                <div className="absolute inset-0 bg-cover bg-center brightness-50 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=600')" }} />
                
                <div className="relative z-10 p-6 space-y-3">
                  <span className="w-16 h-16 rounded-full bg-[#cfaf72] flex items-center justify-center text-[#0b132b] text-xl font-bold shadow-lg mx-auto">
                    📖
                  </span>
                  <div>
                    <h5 className="font-extrabold text-heading text-slate-100 text-lg">Teologia Ao Seu Alcance</h5>
                    <p className="text-[10px] text-slate-300 max-w-xs mx-auto leading-relaxed">Assine o plano Escola Premium para remover anúncios em vídeo e ter downloads ilimitados de livros teológicos.</p>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Apoio a evangelização</span>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); alert("Obrigado pelo interesse! Simulação de inscrição processada."); }} 
                    className="px-3 py-1.5 bg-[#cfaf72] text-[#0b132b] text-[10px] font-black uppercase rounded-lg tracking-wider flex items-center gap-1 hover:bg-white transition-colors"
                  >
                    Saber Mais <ExternalLink size={10} />
                  </a>
                </div>
              </div>

              {/* Status and countdown info */}
              <div className="space-y-4">
                <h4 className="text-xl font-black text-slate-100 leading-tight">Obrigado por apoiar a Escola da Fé</h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto font-medium">
                  Seu livreto personalizado com 2 ensinos do Evangelho está pronto para ser baixado. Aguarde que seja liberado.
                </p>

                <div className="flex flex-col items-center justify-center mt-2">
                  {isAdClosingAllowed ? (
                    <button
                      onClick={handleCloseAdAndDownload}
                      className="w-full py-4 bg-accent hover:bg-white text-secondary font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg animate-bounce flex items-center justify-center gap-2"
                    >
                      <Check size={16} /> Liberar Meu Download
                    </button>
                  ) : (
                    <div className="w-full py-4 bg-slate-800 text-slate-400 font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 border border-white/5">
                      <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      <span>Liberando download em {adTimer} s...</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
