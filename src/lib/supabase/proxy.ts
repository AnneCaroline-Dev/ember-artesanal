import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { lerConfigSupabase } from "./config";

// Renova a sessão da Supabase antes da página rodar (Server Components não gravam cookies).
export async function atualizarSessao(request: NextRequest) {
  let resposta = NextResponse.next({ request });

  const config = lerConfigSupabase();
  if (!config) return resposta;

  const supabase = createServerClient(config.url, config.chave, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesParaGravar, cabecalhos) {
        cookiesParaGravar.forEach(({ name, value }) => request.cookies.set(name, value));
        resposta = NextResponse.next({ request });
        cookiesParaGravar.forEach(({ name, value, options }) =>
          resposta.cookies.set(name, value, options),
        );
        Object.entries(cabecalhos).forEach(([nome, valor]) => resposta.headers.set(nome, valor));
      },
    },
  });

  // Não colocar nada entre createServerClient e getClaims: é aqui que a sessão é renovada.
  await supabase.auth.getClaims();

  return resposta;
}
