import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Library, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  BookOpen, 
  FileText, 
  Tag, 
  Building2, 
  Upload, 
  Globe, 
  ExternalLink,
  ChevronLeft,
  BookMarked,
  Save,
  Check,
  AlertCircle
} from "lucide-react";
import { cn } from "../lib/utils";
import { performResilientDbWrite } from "../lib/supabaseClient";

export interface Livro {
  id: string;
  titulo: string;
  autor: string;
  descricao: string;
  preco: string;
  paginas: number;
  editora: string;
  foto_capa: string;
  download_url: string;
  created_at?: string;
}

export const DEFAULT_LIVROS: Livro[] = [
  {
    id: "livro_institutos",
    titulo: "As Institutas da Religião Cristã",
    autor: "João Calvino",
    descricao: "Uma das obras teológicas mais influentes da história do Cristianismo. Esta magnum opus de João Calvino aborda de forma profunda e exaustiva a teologia bíblica e reformada, detalhando a soberania de Deus, a redenção de Cristo e o papel da Igreja na Terra.",
    preco: "Grátis",
    paginas: 650,
    editora: "Escola da Fé",
    foto_capa: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
    download_url: "https://www.monergismo.com/textos/institutas/As-Institutas_Calvino_Volume-1.pdf"
  },
  {
    id: "livro_ortodoxia",
    titulo: "Ortodoxia",
    autor: "G. K. Chesterton",
    descricao: "O célebre ensaio de G. K. Chesterton onde compartilha sua jornada intelectual e espiritual até constatar que os enigmas formulados pelo pensamento secular encontram sua resposta definitiva e majestosa no enigma divino da transcendência de Cristo.",
    preco: "Grátis",
    paginas: 190,
    editora: "Livros da Fé",
    foto_capa: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
    download_url: "http://www.gutenberg.org/files/130/130-h/130-h.htm"
  }
];

interface LivrosViewProps {
  isAdmin: boolean;
  livros: Livro[];
  setLivros: React.Dispatch<React.SetStateAction<Livro[]>>;
  triggerConfirm: (title: string, message: string, onConfirmAction: () => void) => void;
}

export default function LivrosView({ 
  isAdmin, 
  livros, 
  setLivros, 
  triggerConfirm 
}: LivrosViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLivro, setEditingLivro] = useState<Livro | null>(null);

  // Form states
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("Grátis");
  const [paginas, setPaginas] = useState<number>(0);
  const [editora, setEditora] = useState("Escola da Fé");
  
  // Image & Upload cover states
  const [fotoCapaType, setFotoCapaType] = useState<"url" | "upload">("url");
  const [fotoCapaUrl, setFotoCapaUrl] = useState("");
  const [fotoCapaBase64, setFotoCapaBase64] = useState("");
  
  // Download states
  const [downloadType, setDownloadType] = useState<"url" | "upload">("url");
  const [downloadUrlVal, setDownloadUrlVal] = useState("");
  const [downloadBase64, setDownloadBase64] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Download action states
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [finishedDownloads, setFinishedDownloads] = useState<string[]>([]);

  // Validation feedback
  const [formError, setFormError] = useState("");

  const openAddModal = () => {
    setEditingLivro(null);
    setTitulo("");
    setAutor("");
    setDescricao("");
    setPreco("Grátis");
    setPaginas(0);
    setEditora("Escola da Fé");
    setFotoCapaType("url");
    setFotoCapaUrl("");
    setFotoCapaBase64("");
    setDownloadType("url");
    setDownloadUrlVal("");
    setDownloadBase64("");
    setUploadedFileName("");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (livro: Livro) => {
    setEditingLivro(livro);
    setTitulo(livro.titulo);
    setAutor(livro.autor);
    setDescricao(livro.descricao);
    setPreco(livro.preco || "Grátis");
    setPaginas(livro.paginas || 0);
    setEditora(livro.editora || "Escola da Fé");
    
    if (livro.foto_capa && livro.foto_capa.startsWith("data:")) {
      setFotoCapaType("upload");
      setFotoCapaBase64(livro.foto_capa);
      setFotoCapaUrl("");
    } else {
      setFotoCapaType("url");
      setFotoCapaUrl(livro.foto_capa || "");
      setFotoCapaBase64("");
    }

    if (livro.download_url && livro.download_url.startsWith("data:")) {
      setDownloadType("upload");
      setDownloadBase64(livro.download_url);
      setDownloadUrlVal("");
      setUploadedFileName("livro_arquivo_salvo");
    } else {
      setDownloadType("url");
      setDownloadUrlVal(livro.download_url || "");
      setDownloadBase64("");
      setUploadedFileName("");
    }
    setFormError("");
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "cover" | "file") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      if (field === "cover") {
        setFotoCapaBase64(base64Data);
      } else {
        setDownloadBase64(base64Data);
        setUploadedFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !autor.trim() || !descricao.trim()) {
      setFormError("Por favor, preencha os campos obrigatórios (Título, Autor e Descrição).");
      return;
    }

    const finalFotoCapa = fotoCapaType === "url" ? fotoCapaUrl : fotoCapaBase64;
    const finalDownloadUrl = downloadType === "url" ? downloadUrlVal : downloadBase64;

    const bookId = editingLivro ? editingLivro.id : "book_" + Date.now();
    const newBook: Livro = {
      id: bookId,
      titulo,
      autor,
      descricao,
      preco: preco || "Grátis",
      paginas: Number(paginas) || 0,
      editora: editora || "Escola da Fé",
      foto_capa: finalFotoCapa || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400",
      download_url: finalDownloadUrl
    };

    try {
      const result = await performResilientDbWrite("livros", "POST", newBook);
      if (result && (result.success || result.localOnly)) {
        if (editingLivro) {
          setLivros(prev => prev.map(item => item.id === bookId ? newBook : item));
        } else {
          setLivros(prev => [newBook, ...prev]);
        }
        setIsModalOpen(false);
      } else {
        setFormError("Erro ao salvar livro no banco de dados.");
      }
    } catch (err) {
      console.error("[Livros Error] Falha ao salvar livro:", err);
      // Fallback local instantâneo
      if (editingLivro) {
        setLivros(prev => prev.map(item => item.id === bookId ? newBook : item));
      } else {
        setLivros(prev => [newBook, ...prev]);
      }
      setIsModalOpen(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    triggerConfirm(
      "Excluir Livro",
      `Tem certeza absoluta de que deseja excluir o livro "${name}" do acervo?`,
      async () => {
        try {
          const result = await performResilientDbWrite("livros", "DELETE", null, id);
          if (result && (result.success || result.localOnly)) {
            setLivros(prev => prev.filter(item => item.id !== id));
          }
        } catch (err) {
          console.error("Falha ao excluir livro remotamente:", err);
          // Fallback local
          setLivros(prev => prev.filter(item => item.id !== id));
        } finally {
          try {
            const saved = localStorage.getItem("escola_da_fe_deleted_ids") || "[]";
            const deletedIds = JSON.parse(saved);
            const list = Array.isArray(deletedIds) ? deletedIds : [];
            if (!list.includes(id)) {
              list.push(id);
              localStorage.setItem("escola_da_fe_deleted_ids", JSON.stringify(list));
            }
          } catch (storageErr) {
            console.warn("Falha ao salvar ID deletado localmente:", storageErr);
          }
        }
      }
    );
  };

  // Triggers free download of book file safely
  const triggerDownloadAction = (book: Livro) => {
    if (!book.download_url) {
      alert("Este livro não possui um arquivo ou link de download cadastrado.");
      return;
    }

    setDownloadingId(book.id);

    setTimeout(() => {
      try {
        const link = document.createElement("a");
        link.href = book.download_url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        // If Base64 string, offer direct download download attribute
        if (book.download_url.startsWith("data:")) {
          // Extract file type to format filename extension
          let ext = "pdf";
          if (book.download_url.includes("epub")) ext = "epub";
          else if (book.download_url.includes("msword")) ext = "doc";
          else if (book.download_url.includes("text/plain")) ext = "txt";

          const cleanTitle = book.titulo.toLowerCase().replace(/[^a-z0-9]/g, "_");
          link.download = `${cleanTitle}_livro_escoladafe.${ext}`;
        }

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setFinishedDownloads(prev => [...prev, book.id]);
      } catch (err) {
        console.error("Erro ao processar download do livro:", err);
      } finally {
        setDownloadingId(null);
      }
    }, 1500); // Elegant delay simulating processing
  };

  const filteredLivros = (livros || []).filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      item.titulo.toLowerCase().includes(term) ||
      item.autor.toLowerCase().includes(term) ||
      item.descricao.toLowerCase().includes(term) ||
      (item.editora && item.editora.toLowerCase().includes(term))
    );
  });

  return (
    <div className="max-w-7xl mx-auto py-4 px-2 select-none">
      
      {/* Visual Header */}
      <div className="text-center mb-12 relative">
        <span className="text-xs font-black tracking-widest text-[#cfaf72] uppercase bg-[#cfaf72]/10 px-4 py-2 rounded-full mb-3 inline-block">
          📚 Biblioteca Teológica Gratuita
        </span>
        <h1 className="text-3xl md:text-5xl font-sans font-black tracking-tight text-slate-800 dark:text-white mb-4">
          Livroteca Escola da Fé
        </h1>
        <p className="max-w-xl mx-auto text-sm md:text-base text-slate-500 dark:text-slate-400 font-sans font-medium">
          Edificação bíblica e amparo apologético ao seu alcance. Leia sinopses de obras reformadas canônicas e faça downloads grátis completos dos materiais de estudo.
        </p>
      </div>

      {/* Control panel & search bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-4 rounded-2xl mb-8 shadow-sm backdrop-blur-md">
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Pesquisar por livro, autor, sinopse ou editora..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-150 dark:border-white/10 rounded-xl text-slate-700 dark:text-white text-sm focus:outline-none focus:border-[#cfaf72] dark:focus:border-[#cfaf72]"
          />
        </div>

        {isAdmin && (
          <button
            onClick={openAddModal}
            className="w-full md:w-auto px-6 py-3 bg-[#cfaf72] hover:bg-neutral-800 dark:hover:bg-[#dfbf82] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#cfaf72]/20 cursor-pointer"
          >
            <Plus size={16} />
            Adicionar Novo Livro
          </button>
        )}
      </div>

      {/* Grid of Books */}
      {filteredLivros.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-3xl p-8 max-w-lg mx-auto shadow-sm">
          <BookMarked size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Nenhum livro localizado</h3>
          <p className="text-sm text-slate-400">
            {searchTerm ? "Tente usar outros termos ou verificar a ortografia da busca realizada." : "Não há livros cadastrados nesta secção no momento."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pb-10">
          {filteredLivros.map((item, index) => {
            const isDownloading = downloadingId === item.id;
            const hasDownloaded = finishedDownloads.includes(item.id);

            return (
              <motion.div
                key={"book_" + (item.id || "no_id") + "_" + index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
                className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-150/80 dark:border-white/5 hover:border-[#cfaf72]/45 dark:hover:border-[#cfaf72]/45 rounded-2xl hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                
                {/* Book Card Content */}
                <div className="p-5 flex flex-col sm:flex-row gap-5">
                  
                  {/* Book Cover Design */}
                  <div className="shrink-0 w-32 h-44 sm:w-28 sm:h-38 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-[4px_6px_12px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-300 mx-auto sm:mx-0 relative">
                    {item.foto_capa ? (
                      <img 
                        src={item.foto_capa} 
                        alt={item.titulo} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-slate-200 to-slate-100 dark:from-neutral-800 dark:to-neutral-900 text-slate-400 dark:text-neutral-500">
                        <Library size={24} className="mb-2" />
                        <span className="font-sans text-[9px] uppercase font-black tracking-wide">Sem Imagem</span>
                      </div>
                    )}
                    
                    {/* Badge Preço */}
                    <span className="absolute top-2 left-2 text-[8px] font-black tracking-wider uppercase text-white bg-slate-900/80 px-2 py-1 rounded-md backdrop-blur-xs">
                      {item.preco || "Grátis"}
                    </span>
                  </div>

                  {/* Book Text Info */}
                  <div className="flex-grow flex flex-col justify-start">
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-white leading-tight font-sans tracking-tight mb-1 group-hover:text-[#cfaf72] transition-colors line-clamp-2">
                      {item.titulo}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-400/80 uppercase tracking-wider mb-2">
                      {item.autor}
                    </p>
                    
                    {/* Clamped description */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed mb-3 line-clamp-3">
                      {item.descricao}
                    </p>

                    {/* Book Metadata List */}
                    <div className="mt-auto space-y-1 text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500">
                      {item.paginas && item.paginas > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <FileText size={12} className="text-[#cfaf72]" />
                          <span>{item.paginas} páginas</span>
                        </div>
                      ) : null}
                      {item.editora && (
                        <div className="flex items-center gap-1.5">
                          <Building2 size={12} className="text-[#cfaf72]" />
                          <span className="truncate max-w-[140px]">{item.editora}</span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Card footer buttons */}
                <div className="p-4 bg-slate-50/50 dark:bg-slate-950/30 border-t border-slate-150/50 dark:border-white/5 flex gap-2 items-center justify-between">
                  
                  {/* Download Action */}
                  <button
                    onClick={() => triggerDownloadAction(item)}
                    disabled={isDownloading}
                    className={cn(
                      "flex-grow flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-97 select-none shrink-0",
                      isDownloading 
                        ? "bg-slate-200 dark:bg-white/5 text-slate-500" 
                        : hasDownloaded 
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                          : "bg-slate-100 hover:bg-[#cfaf72] hover:text-white dark:bg-white/5 dark:hover:bg-[#cfaf72] text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-white/5"
                    )}
                  >
                    {isDownloading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></span>
                        Baixando...
                      </>
                    ) : hasDownloaded ? (
                      <>
                        <Check size={14} className="animate-bounce" />
                        Baixado
                      </>
                    ) : (
                      <>
                        <Download size={13} />
                        Baixar Grátis
                      </>
                    )}
                  </button>

                  {/* Actions configuration (Admin controls) */}
                  {isAdmin && (
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => openEditModal(item)}
                        title="Editar livro"
                        className="p-2.5 bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500/35 text-sky-600 dark:text-sky-400 rounded-xl transition-all cursor-pointer border border-sky-100 dark:border-sky-500/25"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.titulo)}
                        title="Deletar livro"
                        className="p-2.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-500 hover:text-white dark:hover:bg-red-500/35 text-red-600 dark:text-red-400 rounded-xl transition-all cursor-pointer border border-red-100 dark:border-red-500/25"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                  
                </div>

              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal Drawer */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-white uppercase font-sans">
                  {editingLivro ? "📝 Editar Dados do Livro" : "📚 Adicionar Livro ao Acervo"}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 px-2 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 rounded-lg cursor-pointer text-xs uppercase tracking-wider"
                >
                  Fechar
                </button>
              </div>

              {/* Form body, scrollable if needed */}
              <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-grow text-left">
                {formError && (
                  <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl border border-red-150/40 dark:border-red-500/20 text-xs font-medium flex items-center gap-2">
                    <AlertCircle size={15} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="col-span-1 md:col-span-2 space-y-1.5">
                    <label className="text-xs font-black tracking-widest uppercase text-slate-400 dark:text-slate-500">
                      Título do Livro *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: As Institutas da Religião Cristã"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#cfaf72] dark:text-white"
                    />
                  </div>

                  {/* Author */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black tracking-widest uppercase text-slate-400 dark:text-slate-500">
                      Autor do Livro *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: João Calvino"
                      value={autor}
                      onChange={(e) => setAutor(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#cfaf72] dark:text-white"
                    />
                  </div>

                  {/* Publisher */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black tracking-widest uppercase text-slate-400 dark:text-slate-500">
                      Editora
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Escola da Fé"
                      value={editora}
                      onChange={(e) => setEditora(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#cfaf72] dark:text-white"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black tracking-widest uppercase text-slate-400 dark:text-slate-500">
                      Preço / Informação de Custo
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Grátis (Físico: R$ 49.90)"
                      value={preco}
                      onChange={(e) => setPreco(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#cfaf72] dark:text-white"
                    />
                  </div>

                  {/* Pages */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black tracking-widest uppercase text-slate-400 dark:text-slate-500">
                      Páginas
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 350"
                      value={paginas || ""}
                      onChange={(e) => setPaginas(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#cfaf72] dark:text-white"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black tracking-widest uppercase text-slate-400 dark:text-slate-500">
                    Descrição / Sinopse Teológica *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Escreva um breve resumo da obra, focado em sua contribuição eclesiástica..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#cfaf72] dark:text-white resize-none"
                  />
                </div>

                {/* Foto da Capa section */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-150/70 dark:border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black tracking-widest uppercase text-[#cfaf72]">
                      Foto da Capa do Livro
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFotoCapaType("url")}
                        className={cn(
                          "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border",
                          fotoCapaType === "url"
                            ? "bg-[#cfaf72]/10 border-[#cfaf72]/30 text-[#cfaf72]"
                            : "border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500"
                        )}
                      >
                        Link URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setFotoCapaType("upload")}
                        className={cn(
                          "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border",
                          fotoCapaType === "upload"
                            ? "bg-[#cfaf72]/10 border-[#cfaf72]/30 text-[#cfaf72]"
                            : "border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500"
                        )}
                      >
                        Carregar Foto (Upload)
                      </button>
                    </div>
                  </div>

                  {fotoCapaType === "url" ? (
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={fotoCapaUrl}
                      onChange={(e) => setFotoCapaUrl(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-250 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#cfaf72] dark:text-white"
                    />
                  ) : (
                    <div className="relative">
                      <label 
                        className={cn(
                          "w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl cursor-pointer hover:border-[#cfaf72] text-slate-400 dark:text-slate-500 transition-colors bg-white dark:bg-slate-900"
                        )}
                      >
                        <Upload size={20} className="mb-2 text-[#cfaf72]" />
                        <span className="text-xs font-bold font-sans">
                          {fotoCapaBase64 ? "✓ Foto Carregada!" : "Selecionar Capa do Livro (.jpg, .png)"}
                        </span>
                        {fotoCapaBase64 && (
                          <span className="text-[10px] font-mono mt-1 text-emerald-500 break-all truncate max-w-xs block">
                            imagem_base64_computada
                          </span>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "cover")}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Download url / file upload section */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-150/70 dark:border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black tracking-widest uppercase text-[#cfaf72]">
                      Arquivo de Atendimento (Download do Livro)
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setDownloadType("url")}
                        className={cn(
                          "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border",
                          downloadType === "url"
                            ? "bg-[#cfaf72]/10 border-[#cfaf72]/30 text-[#cfaf72]"
                            : "border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500"
                        )}
                      >
                        Link URL Externo
                      </button>
                      <button
                        type="button"
                        onClick={() => setDownloadType("upload")}
                        className={cn(
                          "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border",
                          downloadType === "upload"
                            ? "bg-[#cfaf72]/10 border-[#cfaf72]/30 text-[#cfaf72]"
                            : "border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500"
                        )}
                      >
                        Subir Livro (Upload PDF/ePub)
                      </button>
                    </div>
                  </div>

                  {downloadType === "url" ? (
                    <input
                      type="text"
                      placeholder="Cole o link PDF (Ex: Google Drive, Dropbox, site reformado...)"
                      value={downloadUrlVal}
                      onChange={(e) => setDownloadUrlVal(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-250 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#cfaf72] dark:text-white"
                    />
                  ) : (
                    <div className="relative">
                      <label 
                        className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl cursor-pointer hover:border-[#cfaf72] text-slate-400 dark:text-slate-500 transition-colors bg-white dark:bg-slate-900"
                      >
                        <DocumentIcon size={20} className="mb-2 text-[#cfaf72]" />
                        <span className="text-xs font-bold font-sans text-center">
                          {uploadedFileName ? `✓ ${uploadedFileName}` : "Selecionar Arquivo do Livro (.pdf, .epub, .doc, .txt)"}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 max-w-[240px] text-center leading-tight">
                          O arquivo sofrerá conversão para armazenamento local ou Supabase de forma segura.
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.epub,.doc,.docx,.txt"
                          onChange={(e) => handleFileUpload(e, "file")}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Footer Modal controls */}
                <div className="pt-4 border-t border-slate-100 dark:border-white/15 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer active:scale-95 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#cfaf72] hover:bg-neutral-800 text-white dark:hover:bg-[#dfbf82] font-black text-xs uppercase tracking-widest rounded-xl cursor-pointer active:scale-95 transition-all shadow-md shadow-[#cfaf72]/15 flex items-center gap-1.5"
                  >
                    <Save size={14} />
                    Salvar Obras
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Icon fallbacks inside modal
function DocumentIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}
