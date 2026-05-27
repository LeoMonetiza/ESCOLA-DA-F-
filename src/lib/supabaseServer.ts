import { createClient } from "@supabase/supabase-js";

let supabase: any = null;

export function getSupabaseClient() {
  if (supabase) return supabase;

  const rawUrl = process.env.VITE_SUPABASE_URL?.replace(/^["']|["']$/g, "");
  const key = process.env.VITE_SUPABASE_ANON_KEY?.replace(/^["']|["']$/g, "");

  if (!rawUrl || !key) {
    return null;
  }

  // Remove trailing slashes and /rest/v1 to keep URL clean
  const url = rawUrl.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");

  try {
    supabase = createClient(url, key, {
      auth: {
        persistSession: false
      }
    });
    return supabase;
  } catch (error) {
    console.error("Erro ao inicializar cliente Supabase:", error);
    return null;
  }
}

/**
 * Utilitário para verificar conexão
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: "Credenciais do Supabase ausentes no arquivo .env. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY."
    };
  }

  try {
    // Tenta ler uma tabela de teste ou configurações de forma leve
    const { data, error } = await client.from("configuracoes_sociais").select("chave").limit(1);
    
    if (error) {
      // Se a tabela não existir, a conexão funcionou mas falta a tabela
      if (error.code === "P0001" || error.code === "42P01" || error.code === "PGRST205") {
        return {
          success: true,
          message: "Conectado com sucesso! Contudo, as tabelas SQL ainda não foram criadas no Supabase SQL Editor."
        };
      }
      return {
        success: false,
        message: `Conectado, mas retornou erro de consulta: ${error.message} (Código ${error.code})`
      };
    }

    return {
      success: true,
      message: "Conexão com o Supabase estabelecida com sucesso! Todas as tabelas prontas."
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Erro na conexão: ${err.message || err}`
    };
  }
}
