import type { Idioma } from "@/lib/idioma/idiomas";
import { rotaDoPasso } from "./proximo-passo";

// O e-mail padrão da Supabase devolve o convite no fim do endereço (depois do #),
// que só o navegador enxerga. Aqui lemos esse pedaço e decidimos para onde o Rafael vai.
export type LinkDoEmail =
  | { tipo: "convite"; accessToken: string; refreshToken: string }
  | { tipo: "invalido" }
  | { tipo: "nenhum" };

export type DefinirSessao = (tokens: {
  access_token: string;
  refresh_token: string;
}) => Promise<{ error: unknown }>;

export function rotaLinkInvalido(idioma: Idioma) {
  return `${rotaDoPasso("entrar", idioma)}?erro=link`;
}

export function lerLinkDoEmail(hash: string): LinkDoEmail {
  const dados = new URLSearchParams(hash.replace(/^#/, ""));
  if (dados.has("error_code")) return { tipo: "invalido" };
  if (dados.get("type") !== "invite") return { tipo: "nenhum" };

  const accessToken = dados.get("access_token");
  const refreshToken = dados.get("refresh_token");
  if (!accessToken || !refreshToken) return { tipo: "invalido" };
  return { tipo: "convite", accessToken, refreshToken };
}

export async function aceitarConvite(
  link: LinkDoEmail,
  definirSessao: DefinirSessao,
  idioma: Idioma,
) {
  if (link.tipo !== "convite") return rotaLinkInvalido(idioma);
  const { error } = await definirSessao({
    access_token: link.accessToken,
    refresh_token: link.refreshToken,
  });
  return error ? rotaLinkInvalido(idioma) : rotaDoPasso("criar-senha", idioma);
}
