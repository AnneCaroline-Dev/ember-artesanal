import type { Idioma } from "./idiomas";

// O ateliê fica em Belo Horizonte, que segue o horário de Brasília.
const FUSO = "America/Sao_Paulo";

const formatos: Record<Idioma, Intl.DateTimeFormat> = {
  pt: new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: FUSO,
  }),
  en: new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: FUSO,
  }),
};

// G2 · CA3: 30/10/2026 em português, Oct 30, 2026 em inglês.
export function formatarData(data: Date, idioma: Idioma): string {
  return formatos[idioma].format(data);
}
