import { notFound } from "next/navigation";
import { ehIdioma, type Idioma } from "./idiomas";

// O proxy só deixa passar /pt e /en; qualquer outro idioma no endereço é página inexistente.
export function idiomaDaRota(lang: string): Idioma {
  return ehIdioma(lang) ? lang : notFound();
}
