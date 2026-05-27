import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis do Supabase não configuradas.');
}

const cleanUrl = supabaseUrl.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");

export const supabase = createClient(cleanUrl, supabaseAnonKey.trim(), {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
});

export async function getSupabaseClient() {
  return supabase;
}

export async function checkSupabaseConfigExists(): Promise<boolean> {
  return !(!supabaseUrl || !supabaseAnonKey);
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
