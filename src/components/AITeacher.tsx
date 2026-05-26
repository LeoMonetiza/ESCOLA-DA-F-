import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Send, X, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function AITeacher() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai", text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!prompt.trim() || isLoading) return;

    const userMsg = prompt;
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setPrompt("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: userMsg,
          systemInstruction: "Você é o 'Professor da Escola da Fé'. Responda a dúvidas bíblicas e teológicas com base na sã doutrina cristã, de forma acolhedora, didática e profunda. Use português de Portugal ou Brasil conforme o usuário, mas com tom respeitoso."
        })
      });

      const data = await res.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: "ai", text: data.text }]);
      } else {
        throw new Error("Resposta vazia");
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", text: "Desculpe, tive um problema ao buscar essa informação. Pode tentar novamente?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 lg:bottom-12 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="absolute bottom-20 right-0 w-[calc(100vw-3rem)] sm:w-[400px] max-w-[400px] h-[550px] bg-white dark:bg-card-dark rounded-[2rem] shadow-2xl border border-slate-200 dark:border-border-dark flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-secondary p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                  <Sparkles size={20} className="text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">Professor AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                    <span className="text-[10px] text-accent/80 font-medium">Pronto para ensinar</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-900/50">
              {messages.length === 0 && (
                <div className="text-center mt-12 text-slate-300 dark:text-slate-600">
                  <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                    <MessageCircle size={32} />
                  </div>
                  <p className="text-xs px-8 italic font-medium">"Pergunta e ser-te-á dado; busca e acharás."</p>
                  <p className="text-[10px] mt-2 opacity-70">Dúvidas sobre grego, hebraico ou temas bíblicos?</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={cn(
                  "max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm",
                  m.role === "user" 
                    ? "ml-auto bg-primary text-white rounded-tr-none" 
                    : "mr-auto bg-white dark:bg-card-dark border border-slate-100 dark:border-border-dark text-slate-800 dark:text-slate-200 rounded-tl-none font-medium"
                )}>
                  {m.text}
                </div>
              ))}
              {isLoading && (
                <div className="mr-auto bg-white dark:bg-card-dark border border-slate-100 dark:border-border-dark p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Consultando as Escrituras...</span>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-card-dark border-t border-slate-100 dark:border-border-dark flex gap-2">
              <input 
                type="text" 
                placeholder="Qual sua dúvida hoje?"
                className="flex-grow p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-border-dark rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-slate-900 dark:text-white"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !prompt.trim()}
                className="p-3 bg-primary text-white rounded-xl hover:bg-secondary disabled:opacity-50 transition-all flex items-center justify-center w-12 shadow-lg shadow-primary/20"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group"
      >
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full border-2 border-white flex items-center justify-center">
          <Sparkles size={10} className="text-secondary" />
        </div>
        <MessageCircle size={28} className={cn("transition-transform", isOpen && "rotate-90 scale-0")} />
        <X size={28} className={cn("absolute transition-transform", !isOpen && "rotate-90 scale-0")} />
      </button>
    </div>
  );
}
