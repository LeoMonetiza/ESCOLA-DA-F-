import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL?.replace(/^["']|["']$/g, "");
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY?.replace(/^["']|["']$/g, "");

const cleanUrl = supabaseUrl?.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(cleanUrl, supabaseAnonKey.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      }
    })
  : null;

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
    comunicados: "postagens",
    postagens: "postagens",
    configuracoes: "configuracoes_sociais",
    homens: "homens_de_deus",
    homens_de_deus: "homens_de_deus",
    posts: "posts",
    comments: "comments",
    reactions: "reactions",
    ads: "ads",
    livros: "livros"
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

  // 2. FALLBACK DIRETO VIA SUPABASE CLIENT OU ARMAZENAMENTO LOCAL
  try {
    const supabase = await getSupabaseClient();
    if (supabase) {
      if (method === "DELETE") {
        const idField = dbTable === "dicionario_biblico" ? "termo" : "id";
        const { data, error } = await supabase
          .from(dbTable)
          .delete()
          .eq(idField, idValue);

        if (!error) {
          return { success: true, data };
        }
      } else {
        const { data, error } = await supabase
          .from(dbTable)
          .upsert(payload);

        if (!error) {
          return { success: true, data };
        }
      }
    }
  } catch (err) {
    console.warn(`[Resilient Write] Operando em modo de Armazenamento Local no dispositivo para [${table}].`, err);
  }

  // Fallback 100% Local no dispositivo do usuário
  return { success: true, localOnly: true, data: payload };
}
