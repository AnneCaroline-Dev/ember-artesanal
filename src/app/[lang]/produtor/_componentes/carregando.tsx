import { dicionario } from "@/lib/idioma/dicionarios";
import type { Idioma } from "@/lib/idioma/idiomas";

export function Carregando({ idioma }: { idioma: Idioma }) {
  return (
    <p role="status" className="py-6 text-center text-sm text-marrom">
      {dicionario(idioma).produtor.carregando}
    </p>
  );
}
