import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import { getSupabaseClient, testSupabaseConnection } from "./src/lib/supabaseServer";

dotenv.config();

// Define local database schema fallback
interface FallbackData {
  posts: any[];
  comments: any[];
  reactions: any[];
  ads: any[];
  estudos: any[];
  dicionario: any[];
  historias: any[];
  teologia: any[];
  curso: any[];
  postagens: any[];
  configuracoes: any[];
  homens: any[];
  dispositivos: any[];
  livros: any[];
  suporte?: any[];
}

const FALLBACK_FILE = path.join(process.cwd(), "community_fallback.json");

function promiseWithTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutValue: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(timeoutValue), timeoutMs))
  ]);
}

function getFallbackData(): FallbackData {
  const defaultData: FallbackData = {
    posts: [],
    comments: [],
    reactions: [],
    ads: [
      {
        id: "inicial_ad_1",
        title: "Canal Oficial Escola da Fé - Inscreva-se para Novidades",
        image_url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
        link: "https://youtube.com/escoladafe",
        type: "native",
        active: true,
        created_at: new Date().toISOString()
      },
      {
        id: "inicial_ad_2",
        title: "Visite o nosso grupo exclusivo de WhatsApp de Intercessão",
        image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
        link: "https://chat.whatsapp.com/ExemploGrupo",
        type: "banner",
        active: true,
        created_at: new Date().toISOString()
      }
    ],
    estudos: [],
    dicionario: [],
    historias: [],
    teologia: [],
    curso: [],
    postagens: [],
    configuracoes: [],
    homens: [],
    dispositivos: [],
    livros: [],
    suporte: []
  };

  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      const content = fs.readFileSync(FALLBACK_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Erro ao ler arquivo de fallback:", err);
  }

  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(defaultData, null, 2), "utf-8");
  } catch (err) {
    console.error("Erro ao criar arquivo de fallback inicial:", err);
  }
  return defaultData;
}

function saveFallbackData(data: FallbackData) {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Erro ao salvar arquivo de fallback:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API routes
  app.post("/api/ask", async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "Você é um professor de teologia e estudos bíblicos, fornecendo informações precisas e espirituais em português.",
        },
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Falha ao processar a requisição AI" });
    }
  });

  // Supabase config endpoint for client-side connection
  app.get("/api/supabase-config", (req, res) => {
    res.json({
      url: process.env.VITE_SUPABASE_URL || "",
      anonKey: process.env.VITE_SUPABASE_ANON_KEY || ""
    });
  });

  // Supabase Status check
  app.get("/api/db/status", async (req, res) => {
    try {
      const status = await testSupabaseConnection();
      res.json(status);
    } catch (err: any) {
      res.json({ success: false, message: err.message || err });
    }
  });

  // Lightweight endpoint to load ONLY support messages (called frequently by polling)
  app.get("/api/db/suporte/load", async (req, res) => {
    const supabase = getSupabaseClient();
    const fallback = getFallbackData();

    try {
      if (!supabase) {
        return res.json({
          success: true,
          data: { suporte: fallback.suporte || [] }
        });
      }

      // Query with a 1500ms timeout to avoid event loop blocking if Supabase is unresponsive
      const queryPromise = supabase.from("suporte_mensagens").select("*");
      const result = await promiseWithTimeout(queryPromise, 1500, { data: null, error: { message: "Query timeout (1500ms)" } });

      if (result.error) {
        console.warn("[Suporte] Retornando fallback local devido a erro ou timeout:", result.error.message);
        return res.json({
          success: true,
          data: { suporte: fallback.suporte || [] }
        });
      }

      res.json({
        success: true,
        data: { suporte: result.data || [] }
      });
    } catch (error: any) {
      res.json({
        success: true,
        data: { suporte: fallback.suporte || [] }
      });
    }
  });

  // Load all data from DB (attempts Supabase first, falls back to local JSON on missing tables or errors)
  app.get("/api/db/load", async (req, res) => {
    const supabase = getSupabaseClient();
    const fallback = getFallbackData();

    try {
      // Safely query each table. If a table doesn't exist yet or has any error, load from JSON fallback.
      const safeQuery = async (tableName: string, fallbackKey: keyof FallbackData, defaultVal: any[] = []) => {
        if (!supabase) {
          return fallback[fallbackKey] || defaultVal;
        }
        try {
          // Utiliza tempo limite para não travar o loop de eventos caso o Supabase esteja fora do ar (erro 522 / timeouts)
          const queryPromise = supabase.from(tableName).select("*");
          const result = await promiseWithTimeout(queryPromise, 1500, { data: null, error: { message: "Query timeout (1500ms)" } });
          
          const { data, error } = result;
          if (error) {
            console.warn(`Alerta de tabela (${tableName}):`, error.message);
            const localData = fallback[fallbackKey];
            return (localData && localData.length > 0) ? localData : defaultVal;
          }
          if (!data || data.length === 0) {
            const localData = fallback[fallbackKey];
            if (localData && localData.length > 0) {
              return localData;
            }
          }
          return data || defaultVal;
        } catch (e: any) {
          console.warn(`Falha na consulta de ${tableName}:`, e.message || e);
          const localData = fallback[fallbackKey];
          return (localData && localData.length > 0) ? localData : defaultVal;
        }
      };

      const [
        estudos,
        dicionario,
        historias,
        teologia,
        curso,
        postagens,
        configuracoes,
        posts,
        comments,
        reactions,
        ads,
        homens,
        dispositivos,
        livros,
        suporte
      ] = await Promise.all([
        safeQuery("estudos_basicos", "estudos"),
        safeQuery("dicionario_biblico", "dicionario"),
        safeQuery("historias_biografias", "historias"),
        safeQuery("teologia_doutrinas", "teologia"),
        safeQuery("licoes_curso", "curso"),
        safeQuery("postagens", "postagens"),
        safeQuery("configuracoes_sociais", "configuracoes"),
        safeQuery("posts", "posts"),
        safeQuery("comments", "comments"),
        safeQuery("reactions", "reactions"),
        safeQuery("ads", "ads"),
        safeQuery("homens_de_deus", "homens"),
        safeQuery("dispositivos", "dispositivos"),
        safeQuery("livros", "livros"),
        safeQuery("suporte_mensagens", "suporte")
      ]);

      // Merges the loaded postagens with custom 'tipo' / 'type' saved locally in fallback to avoid missing database columns reverting them on load
      const mergedPostagens = (postagens || []).map((p: any) => {
        const localCopy = (fallback.postagens || []).find((local: any) => local.id === p.id);
        if (localCopy && (localCopy.tipo || localCopy.type)) {
          return { ...p, tipo: localCopy.tipo || localCopy.type };
        }
        return p;
      });

      res.json({
        success: true,
        data: {
          estudos,
          dicionario,
          historias,
          teologia,
          curso,
          postagens: mergedPostagens,
          configuracoes,
          posts,
          comments,
          reactions,
          ads,
          homens,
          dispositivos,
          livros,
          suporte
        }
      });
    } catch (error: any) {
      console.log("[Info] Sincronização dos dados (usando fallback local):", error.message || error);
      res.json({
        success: true, // We allow successful offline load from local fallback
        data: fallback
      });
    }
  });

  // Add or update an item in a specific table
  app.post("/api/db/:table/add", async (req, res) => {
    const supabase = getSupabaseClient();
    const { table } = req.params;
    const payload = req.body;

    let dbTable = "";
    let fallbackKey: keyof FallbackData | "" = "";

    if (table === "estudos") { dbTable = "estudos_basicos"; fallbackKey = "estudos"; }
    else if (table === "dicionario") { dbTable = "dicionario_biblico"; fallbackKey = "dicionario"; }
    else if (table === "historias") { dbTable = "historias_biografias"; fallbackKey = "historias"; }
    else if (table === "teologia") { dbTable = "teologia_doutrinas"; fallbackKey = "teologia"; }
    else if (table === "curso") { dbTable = "licoes_curso"; fallbackKey = "curso"; }
    else if (table === "comunicados" || table === "postagens") { dbTable = "postagens"; fallbackKey = "postagens"; }
    else if (table === "configuracoes") { dbTable = "configuracoes_sociais"; fallbackKey = "configuracoes"; }
    else if (table === "homens" || table === "homens_de_deus") { dbTable = "homens_de_deus"; fallbackKey = "homens" as any; }
    else if (table === "posts") { dbTable = "posts"; fallbackKey = "posts"; }
    else if (table === "comments") { dbTable = "comments"; fallbackKey = "comments"; }
    else if (table === "reactions") { dbTable = "reactions"; fallbackKey = "reactions"; }
    else if (table === "ads") { dbTable = "ads"; fallbackKey = "ads"; }
    else if (table === "dispositivos") { dbTable = "dispositivos"; fallbackKey = "dispositivos"; }
    else if (table === "livros") { dbTable = "livros"; fallbackKey = "livros"; }
    else if (table === "suporte") { dbTable = "suporte_mensagens"; fallbackKey = "suporte" as any; }

    if (!dbTable) return res.status(400).json({ error: "Tabela especificada não reconhecida." });

    // Ensure we write locally to community_fallback.json
    if (fallbackKey) {
      const fallback = getFallbackData();
      const currentList = fallback[fallbackKey] || [];
      const itemToSave = { ...payload };

      let fallbackKeyField = "id";
      if (fallbackKey === "dicionario") fallbackKeyField = "termo";
      else if (fallbackKey === "configuracoes") fallbackKeyField = "chave";

      const uniqueVal = itemToSave[fallbackKeyField] || itemToSave.id;

      const existingIdx = currentList.findIndex((item: any) => {
        const itemVal = item[fallbackKeyField] || item.id;
        return uniqueVal !== undefined && itemVal === uniqueVal;
      });

      if (existingIdx !== -1) {
        currentList[existingIdx] = { ...currentList[existingIdx], ...itemToSave };
      } else {
        currentList.push(itemToSave);
      }
      fallback[fallbackKey] = currentList;
      saveFallbackData(fallback);
    }

    if (!supabase) {
      return res.json({ success: true, message: "Salvo no banco de dados local." });
    }

    try {
      let supabasePayload = payload;
      if (dbTable === "postagens") {
        // Strip out 'tipo' or 'type' before upserting to Supabase so it does not fail due to missing schema column
        const { tipo, type, ...rest } = payload;
        supabasePayload = rest;
      }
      const { data, error } = await supabase.from(dbTable).upsert(supabasePayload);
      if (error) {
        console.log("[Supabase Sync Info] Fallback write to local database (missing remote schema or table):", error.message || error.code);
        if (error.code === "42P01" || error.code === "PGRST205") {
          return res.json({ success: true, message: "Salvo no banco de dados local" });
        }
        throw error;
      }
      res.json({ success: true, data });
    } catch (err: any) {
      console.log(`[Supabase Fallback] Salvo localmente na tabela ${dbTable} devido à restrição do banco remoto:`, err.message || err.code || err);
      // Supabase failed but we successfully wrote to local community_fallback.json at lines 241-259
      res.json({ success: true, message: "Salvo localmente com sucesso", localOnly: true });
    }
  });

  // Delete an item from a specific table
  app.delete("/api/db/:table/:id", async (req, res) => {
    const supabase = getSupabaseClient();
    const { table, id } = req.params;

    let dbTable = "";
    let idField = "id";
    let fallbackKey: keyof FallbackData | "" = "";

    if (table === "estudos") { dbTable = "estudos_basicos"; fallbackKey = "estudos"; }
    else if (table === "dicionario") { dbTable = "dicionario_biblico"; fallbackKey = "dicionario"; }
    else if (table === "historias") { dbTable = "historias_biografias"; fallbackKey = "historias"; }
    else if (table === "teologia") { dbTable = "teologia_doutrinas"; fallbackKey = "teologia"; }
    else if (table === "curso") { dbTable = "licoes_curso"; fallbackKey = "curso"; }
    else if (table === "comunicados" || table === "postagens") { dbTable = "postagens"; fallbackKey = "postagens"; }
    else if (table === "configuracoes") { dbTable = "configuracoes_sociais"; fallbackKey = "configuracoes"; }
    else if (table === "homens" || table === "homens_de_deus") { dbTable = "homens_de_deus"; fallbackKey = "homens" as any; }
    else if (table === "posts") { dbTable = "posts"; fallbackKey = "posts"; }
    else if (table === "comments") { dbTable = "comments"; fallbackKey = "comments"; }
    else if (table === "reactions") { dbTable = "reactions"; fallbackKey = "reactions"; }
    else if (table === "ads") { dbTable = "ads"; fallbackKey = "ads"; }
    else if (table === "dispositivos") { dbTable = "dispositivos"; fallbackKey = "dispositivos"; }
    else if (table === "livros") { dbTable = "livros"; fallbackKey = "livros"; }
    else if (table === "suporte") { dbTable = "suporte_mensagens"; fallbackKey = "suporte" as any; }

    if (!dbTable) return res.status(400).json({ error: "Tabela especificada não reconhecida." });

    // Remove from local fallback
    if (fallbackKey) {
      const fallback = getFallbackData();
      let currentList = fallback[fallbackKey] || [];
      let fallbackKeyField = "id";
      if (fallbackKey === "dicionario") fallbackKeyField = "termo";
      else if (fallbackKey === "configuracoes") fallbackKeyField = "chave";

      currentList = currentList.filter((item: any) => {
        const itemVal = item[fallbackKeyField] || item.id;
        return itemVal !== undefined ? (String(itemVal) !== String(id)) : (item.id !== id && String(item.id) !== String(id));
      });
      fallback[fallbackKey] = currentList;
      saveFallbackData(fallback);
    }

    if (!supabase) {
      return res.json({ success: true, message: "Excluído do banco de dados local." });
    }

    try {
      let query = supabase.from(dbTable).delete();

      if (dbTable === "licoes_curso" && String(id).indexOf("lesson_") === -1 && id.length < 5) {
        query = query.or(`id.eq.${id},lesson.eq.${id}`);
      } else if (dbTable === "dicionario_biblico") {
        if (isNaN(Number(id))) {
          query = query.eq("termo", id);
        } else {
          query = query.or(`id.eq.${id},termo.eq.${id}`);
        }
      } else {
        query = query.eq(idField, id);
      }

      const { error } = await query;
      if (error) {
        console.log("[Supabase Sync Info] Fallback delete from local database (missing remote schema or table):", error.message || error.code);
        if (error.code === "42P01" || error.code === "PGRST205") {
          return res.json({ success: true });
        }
        throw error;
      }
      res.json({ success: true });
    } catch (err: any) {
      console.log(`[Supabase Fallback] Removido localmente da tabela ${dbTable} devido à restrição do banco remoto:`, err.message || err.code || err);
      // Supabase failed but we successfully deleted from local community_fallback.json at lines 305-312
      res.json({ success: true, message: "Removido localmente com sucesso", localOnly: true });
    }
  });

  // Sync general settings config bulk
  app.post("/api/db/config/save", async (req, res) => {
    const supabase = getSupabaseClient();
    const configs = req.body; // Array de { chave: string, valor: string }

    // Save locally to fallback
    const fallback = getFallbackData();
    let currentConfiguracoes = fallback.configuracoes || [];
    configs.forEach((cfg: any) => {
      const idx = currentConfiguracoes.findIndex((c: any) => c.chave === cfg.chave);
      if (idx !== -1) {
        currentConfiguracoes[idx] = { ...currentConfiguracoes[idx], ...cfg };
      } else {
        currentConfiguracoes.push(cfg);
      }
    });
    fallback.configuracoes = currentConfiguracoes;
    saveFallbackData(fallback);

    if (!supabase) {
      return res.json({ success: true, message: "Salvo localmente." });
    }

    try {
      const { error } = await supabase.from("configuracoes_sociais").upsert(configs);
      if (error) {
        if (error.code === "42P01" || error.code === "PGRST205") {
          return res.json({ success: true });
        }
        throw error;
      }
      res.json({ success: true });
    } catch (err: any) {
      console.log("[Supabase Fallback] Configurações de redes salvas localmente devido à indisponibilidade do banco remoto:", err.message || err.code || err);
      res.json({ success: true, message: "Salvo localmente." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Serve index.html for all other GET requests in development to support client-side routing
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
