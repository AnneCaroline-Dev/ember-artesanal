"use client";

import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { guardarCampos } from "@/lib/idioma/campos-guardados";
import { comIdioma, IDIOMAS, separarIdioma, type Idioma } from "@/lib/idioma/idiomas";

// Cada idioma aparece com o próprio nome, para quem não lê o idioma atual achar o seu.
const NOMES: Record<Idioma, string> = { pt: "Português", en: "English" };

// G2 · CA2: troca o idioma na hora, na mesma tela, e o proxy lembra a escolha.
export function TrocarIdioma({
  idioma,
  rotulo,
  navegar = (url: string) => window.location.assign(url),
}: {
  idioma: Idioma;
  rotulo: string;
  navegar?: (url: string) => void;
}) {
  const caminho = usePathname();
  const resto = separarIdioma(caminho)?.resto ?? "/";

  function trocar(evento: MouseEvent<HTMLAnchorElement>, outro: Idioma) {
    evento.preventDefault();
    if (outro === idioma) return;
    guardarCampos(resto);
    navegar(`${comIdioma(outro, resto)}${window.location.search}`);
  }

  return (
    <nav
      aria-label={rotulo}
      className="flex rounded-full border border-borda bg-white/80 p-0.5 text-xs font-semibold"
    >
      {IDIOMAS.map((opcao) => (
        <a
          key={opcao}
          href={comIdioma(opcao, resto)}
          hrefLang={opcao}
          lang={opcao}
          aria-label={NOMES[opcao]}
          aria-current={opcao === idioma ? "true" : undefined}
          onClick={(evento) => trocar(evento, opcao)}
          className={`flex h-9 min-w-11 items-center justify-center rounded-full px-3 tracking-wide ${
            opcao === idioma
              ? "bg-primario-escuro text-white"
              : "text-marrom hover:text-primario-escuro"
          }`}
        >
          {opcao.toUpperCase()}
        </a>
      ))}
    </nav>
  );
}
