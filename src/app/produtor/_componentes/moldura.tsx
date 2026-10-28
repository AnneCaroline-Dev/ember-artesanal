import type { ReactNode } from "react";
import { LogoVela } from "@/app/_componentes/logo-vela";

// Moldura das telas de acesso do produtor, com as cores do alta fidelidade.
export function MolduraDeAcesso({
  titulo,
  subtitulo,
  children,
  rodape,
}: {
  titulo: string;
  subtitulo: string;
  children: ReactNode;
  rodape?: ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col items-center bg-gradient-to-b from-[#fbeee4] to-fundo px-5 py-12">
      <div className="flex w-full max-w-sm flex-col items-center gap-3 text-center">
        <span className="flex size-16 items-center justify-center rounded-full border border-[#eae8e5] bg-white shadow-sm">
          <LogoVela className="w-8" />
        </span>
        <p className="text-sm font-medium tracking-wide text-primario-escuro">Ember Artesanal</p>
        <h1 className="font-display text-2xl font-medium text-stone-900">{titulo}</h1>
        <p className="text-base text-marrom">{subtitulo}</p>
      </div>
      <div className="mt-8 w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg shadow-stone-900/5">
        {children}
      </div>
      {rodape ? <div className="mt-6 w-full max-w-sm text-center">{rodape}</div> : null}
    </main>
  );
}
