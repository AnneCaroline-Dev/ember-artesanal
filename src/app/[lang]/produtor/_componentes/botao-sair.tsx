import { dicionario } from "@/lib/idioma/dicionarios";
import type { Idioma } from "@/lib/idioma/idiomas";
import { sair } from "../acoes";

export function BotaoSair({ idioma, texto }: { idioma: Idioma; texto?: string }) {
  return (
    <form action={sair.bind(null, idioma)}>
      <button type="submit" className="text-sm font-medium text-primario-escuro underline">
        {texto ?? dicionario(idioma).produtor.sair}
      </button>
    </form>
  );
}
