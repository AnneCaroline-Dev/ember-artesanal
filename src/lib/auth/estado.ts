import type { ClienteSupabase } from "@/lib/supabase/server";
import type { EstadoDeAcesso } from "./proximo-passo";

export async function lerEstadoDeAcesso(supabase: ClienteSupabase | null): Promise<EstadoDeAcesso> {
  if (!supabase) return { logado: false };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { logado: false };

  const [{ data: produtor }, { data: nivel }] = await Promise.all([
    supabase.from("produtores").select("user_id").eq("user_id", user.id).maybeSingle(),
    supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
  ]);

  return {
    logado: true,
    ehProdutor: produtor !== null,
    senhaCriada: user.user_metadata?.senha_criada === true,
    nivelAtual: nivel?.currentLevel ?? null,
    proximoNivel: nivel?.nextLevel ?? null,
  };
}
