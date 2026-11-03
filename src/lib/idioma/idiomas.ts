// G2 · Português e inglês: idiomas do app e como escolher entre eles.

export const IDIOMAS = ["pt", "en"] as const;
export type Idioma = (typeof IDIOMAS)[number];

// Guarda a última escolha da pessoa (CA2).
export const COOKIE_IDIOMA = "idioma";

// Valor que vai no <html lang>.
export const IDIOMA_DO_HTML: Record<Idioma, string> = { pt: "pt-BR", en: "en" };

export function ehIdioma(valor: unknown): valor is Idioma {
  return IDIOMAS.includes(valor as Idioma);
}

// Lê o "Accept-Language" do navegador e devolve o idioma preferido, do maior peso para o menor.
function idiomaPreferido(acceptLanguage: string): string | undefined {
  return acceptLanguage
    .split(",")
    .map((parte, ordem) => {
      const [codigo, ...extras] = parte.trim().split(";");
      const peso = extras.map((e) => e.trim()).find((e) => e.startsWith("q="));
      return { codigo: codigo.trim().toLowerCase(), peso: peso ? Number(peso.slice(2)) : 1, ordem };
    })
    .filter((item) => item.codigo !== "" && !Number.isNaN(item.peso))
    .sort((a, b) => b.peso - a.peso || a.ordem - b.ordem)[0]?.codigo;
}

// CA1: inglês só quando o aparelho prefere inglês; em qualquer outro caso, português.
// CA2: a escolha feita antes no app vale mais que o idioma do aparelho.
export function escolherIdioma(
  cookie: string | undefined,
  acceptLanguage: string | null | undefined,
): Idioma {
  if (ehIdioma(cookie)) return cookie;
  const preferido = acceptLanguage ? idiomaPreferido(acceptLanguage) : undefined;
  return preferido?.startsWith("en") ? "en" : "pt";
}

export function separarIdioma(caminho: string): { idioma: Idioma; resto: string } | null {
  const [, primeiro, ...resto] = caminho.split("/");
  if (!ehIdioma(primeiro)) return null;
  return { idioma: primeiro, resto: `/${resto.join("/")}` };
}

export function comIdioma(idioma: Idioma, caminho: string): string {
  return caminho === "/" ? `/${idioma}` : `/${idioma}${caminho}`;
}
