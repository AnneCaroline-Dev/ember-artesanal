import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_IDIOMA, comIdioma, escolherIdioma, separarIdioma } from "@/lib/idioma/idiomas";
import { atualizarSessao } from "@/lib/supabase/proxy";

const UM_ANO = 60 * 60 * 24 * 365;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const separado = separarIdioma(pathname);

  // G2 · CA1 e CA2: todo endereço começa com /pt ou /en. Sem idioma, escolhemos um.
  // O navegador mantém o que vem depois do # (o convite da Supabase) no redirecionamento.
  if (!separado) {
    const idioma = escolherIdioma(
      request.cookies.get(COOKIE_IDIOMA)?.value,
      request.headers.get("accept-language"),
    );
    const destino = request.nextUrl.clone();
    destino.pathname = comIdioma(idioma, pathname);
    return NextResponse.redirect(destino);
  }

  // Só a área do produtor usa login; a vitrine da cliente fica de fora.
  const ehProdutor = separado.resto === "/produtor" || separado.resto.startsWith("/produtor/");
  const resposta = ehProdutor ? await atualizarSessao(request) : NextResponse.next();

  if (request.cookies.get(COOKIE_IDIOMA)?.value !== separado.idioma) {
    resposta.cookies.set(COOKIE_IDIOMA, separado.idioma, {
      path: "/",
      maxAge: UM_ANO,
      sameSite: "lax",
    });
  }
  return resposta;
}

export const config = {
  // Tudo, menos os arquivos internos do Next e os arquivos com extensão (imagens, manifesto).
  matcher: ["/((?!_next/|.*\\.[^/]*$).*)"],
};
