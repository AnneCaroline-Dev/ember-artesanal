import { createBrowserClient } from "@supabase/ssr";
import { lerConfigSupabase } from "./config";

// Cliente da Supabase para o navegador. As variáveis são lidas uma a uma porque
// o Next só copia para o navegador as NEXT_PUBLIC_ escritas por extenso.
export function criarClienteNavegador() {
  const config = lerConfigSupabase({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  if (!config) return null;
  // A sessão do convite é guardada à mão em AceitarConvite, então o cliente não lê o endereço sozinho.
  return createBrowserClient(config.url, config.chave, { auth: { detectSessionInUrl: false } });
}
