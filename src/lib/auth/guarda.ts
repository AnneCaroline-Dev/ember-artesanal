import "server-only";
import { redirect } from "next/navigation";
import { criarClienteSupabase, type ClienteSupabase } from "@/lib/supabase/server";
import { lerEstadoDeAcesso } from "./estado";
import { proximoPasso, rotaDoPasso, type Passo } from "./proximo-passo";

// Cada tela da área do produtor chama esta função antes de mostrar qualquer dado.
// Se o Rafael não estiver no passo daquela tela, vai para o passo certo.
export async function garantirPasso(esperado: "entrar"): Promise<ClienteSupabase | null>;
// Fora da tela Entrar sempre há sessão: sem ela, o passo seria "entrar".
export async function garantirPasso(esperado: Exclude<Passo, "entrar">): Promise<ClienteSupabase>;
export async function garantirPasso(esperado: Passo) {
  const supabase = await criarClienteSupabase();
  const passo = proximoPasso(await lerEstadoDeAcesso(supabase));
  if (passo !== esperado) redirect(rotaDoPasso(passo));
  return supabase;
}
