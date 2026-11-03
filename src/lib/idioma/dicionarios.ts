import { en } from "./en";
import type { Idioma } from "./idiomas";
import { pt, type Dicionario } from "./pt";

export type { CodigoDeErro, Dicionario, TextosDosFormularios } from "./pt";

const dicionarios: Record<Idioma, Dicionario> = { pt, en };

// G2 · todos os textos vêm daqui; preços continuam em R$ e a marca não é traduzida.
export function dicionario(idioma: Idioma): Dicionario {
  return dicionarios[idioma];
}
