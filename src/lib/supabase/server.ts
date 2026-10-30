import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { lerConfigSupabase } from "./config";

// Cliente da Supabase para Server Components e Server Functions.
// Devolve null quando o ambiente não tem a Supabase ligada (por exemplo, na CI).
export async function criarClienteSupabase() {
  // Lê os cookies antes de tudo, para a página ser sempre dinâmica, com ou sem Supabase.
  const cookieStore = await cookies();
  const config = lerConfigSupabase();
  if (!config) return null;

  return createServerClient(config.url, config.chave, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesParaGravar) {
        try {
          cookiesParaGravar.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components não gravam cookies; o proxy renova a sessão.
        }
      },
    },
  });
}

export type ClienteSupabase = NonNullable<Awaited<ReturnType<typeof criarClienteSupabase>>>;
