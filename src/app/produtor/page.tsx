import type { Metadata } from "next";
import { Suspense } from "react";
import { ConteudoInicio } from "./_componentes/conteudos";
import { Carregando } from "./_componentes/carregando";

export const metadata: Metadata = { title: "Início · Ember Artesanal" };

export default function PaginaInicio() {
  return (
    <main className="flex flex-1 flex-col items-start gap-4 px-5 py-10">
      <p className="text-sm font-medium tracking-wide text-primario-escuro">Ember Artesanal</p>
      <h1 className="font-display text-2xl font-medium text-stone-900">Início</h1>
      <Suspense fallback={<Carregando />}>
        <ConteudoInicio />
      </Suspense>
    </main>
  );
}
