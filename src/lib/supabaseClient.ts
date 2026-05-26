import { createClient } from "@supabase/supabase-js";

let clientInstance: any = null;
let clientPromise: Promise<any> | null = null;

/**
 * Retorna uma instância do cliente Supabase para ser usada no lado do cliente (React).
 * Ele prioriza as variáveis locais do cliente (carregadas no build do Netlify, se configuradas)
 * e faz fallback dinâmico para o Express caso não existam.
 */
export async function getSupabaseClient() {
  if (clientInstance) return clientInstance;

  // 1. Prioridade para variáveis estáticas injetadas via Vite (Ex: Netlify)
  let clientUrl = (import.meta as any).env.VITE_SUPABASE_URL;
  let clientKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

  // Compatibilidade com possíveis window-globals ou overrides
  if (!clientUrl || !clientKey) {
    clientUrl = (window as any).VITE_SUPABASE_URL || (window as any).SUPABASE_URL;
    clientKey = (window as any).VITE_SUPABASE_ANON_KEY || (window as any).SUPABASE_ANON_KEY;
  }

  if (clientUrl && clientKey && clientUrl !== "undefined" && clientKey !== "undefined") {
    const sanitizedUrl = clientUrl.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
    clientInstance = createClient(sanitizedUrl, clientKey.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      }
    });
    console.log("[Supabase Client] Inicializado com variáveis injetadas em tempo de build.");
    return clientInstance;
  }

  if (clientPromise) return clientPromise;

  // 2. Fallback para obter dinamicamente do servidor (Express / Cloud Run)
  clientPromise = fetch("/api/supabase-config")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Não foi possível carregar as configurações do Supabase.");
      }
      return res.json();
    })
    .then((config) => {
      if (!config.url || !config.anonKey) {
        console.warn("Configurações do Supabase vazias ou incompletas no servidor.");
        return null;
      }
      // Remove barras extras e espaços para garantir URL limpa
      const sanitizedUrl = config.url.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
      clientInstance = createClient(sanitizedUrl, config.anonKey.trim(), {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false
        }
      });
      console.log("[Supabase Client] Inicializado dinamicamente via backend Express.");
      return clientInstance;
    })
    .catch((err) => {
      console.error("Erro na inicialização dinâmica do cliente Supabase:", err);
      clientPromise = null;
      return null;
    });

  return clientPromise;
}

/**
 * Verifica se as variáveis do Supabase estão definidas.
 * Retorna falso se estiverem ausentes tanto na compilação do cliente quanto no retorno do Express.
 */
export async function checkSupabaseConfigExists(): Promise<boolean> {
  if (clientInstance) return true;

  const clientUrl = (import.meta as any).env.VITE_SUPABASE_URL || (window as any).VITE_SUPABASE_URL || (window as any).SUPABASE_URL;
  const clientKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || (window as any).VITE_SUPABASE_ANON_KEY || (window as any).SUPABASE_ANON_KEY;
  
  if (clientUrl && clientKey && clientUrl !== "undefined" && clientKey !== "undefined") {
    return true;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch("/api/supabase-config", { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const config = await res.json();
      return !!(config.url && config.anonKey);
    }
    // Se o status HTTP não for OK (ex: 502/504 temporário), assumimos optimisticamente true para tentar carregar fallbacks de dados
    return true;
  } catch (err) {
    console.warn("[checkSupabaseConfigExists] Erro ao buscar configuração dinamicamente:", err);
    // Em caso de erro de rede ou timeout, retornamos true de forma otimista
    // para que as rotas de apoio possam fazer o fallback local ao invés de travar a sincronização
    return true;
  }
}

/**
 * Executa uma requisição resiliente de banco de dados (inserção/atualização ou exclusão).
 * Primeiro tenta através de requisição HTTP para o backend do Express.
 * Caso falhe ou esteja em ambiente estático (como Netlify), faz fallback direto
 * executando a operação no cliente Supabase web.
 */
export async function performResilientDbWrite(
  table: string,
  method: "POST" | "DELETE",
  payload: any,
  idValue?: string | number
): Promise<any> {
  const tableMap: Record<string, string> = {
    estudos: "estudos_basicos",
    dicionario: "dicionario_biblico",
    historias: "historias_biografias",
    teologia: "teologia_doutrinas",
    curso: "licoes_curso",
    comunicados: "comunicados",
    configuracoes: "configuracoes_sociais",
    homens: "homens_de_deus",
    homens_de_deus: "homens_de_deus",
    posts: "posts",
    comments: "comments",
    reactions: "reactions",
    ads: "ads"
  };

  const dbTable = tableMap[table] || table;

  // 1. TENTATIVA VIA BACKEND EXPRESS PROXY
  try {
    const url = method === "DELETE" ? `/api/db/${table}/${idValue}` : `/api/db/${table}/add`;
    const options: RequestInit = {
      method: method,
      headers: { "Content-Type": "application/json" }
    };
    if (method === "POST") {
      options.body = JSON.stringify(payload);
    }

    const response = await fetch(url, options);
    if (response.ok) {
      const json = await response.json();
      if (json && json.success) {
        return json;
      }
    }
  } catch (err) {
    console.warn(`[Resilient Write] Falha na rota proxy para a tabela "${table}". Usando fallback direto do navegador...`, err);
  }

  // 2. FALLBACK DIRETO VIA SUPABASE CLIENT (No navegador)
  const supabase = await getSupabaseClient();
  if (!supabase) {
    throw new Error("Não foi possível conectar ao banco de dados (o Supabase não está configurado).");
  }

  if (method === "DELETE") {
    // Determina o nome do campo id (termo no caso de dicionário, senão id)
    const idField = dbTable === "dicionario_biblico" ? "termo" : "id";
    const { data, error } = await supabase
      .from(dbTable)
      .delete()
      .eq(idField, idValue);

    if (error) {
      throw new Error(`[Erro Supabase] Falha ao excluir registro direto da tabela ${dbTable}: ${error.message}`);
    }
    return { success: true, data };
  } else {
    // Para INSERT/UPDATE use upsert
    const { data, error } = await supabase
      .from(dbTable)
      .upsert(payload);

    if (error) {
      throw new Error(`[Erro Supabase] Falha ao upsertar registro na tabela ${dbTable}: ${error.message}`);
    }
    return { success: true, data };
  }
}
