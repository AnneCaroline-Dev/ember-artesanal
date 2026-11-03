import type { Metadata } from "next";
import { Suspense } from "react";
import { TrocarIdioma } from "@/app/_componentes/trocar-idioma";
import { dicionario } from "@/lib/idioma/dicionarios";
import { idiomaDaRota } from "@/lib/idioma/rota";
import { ConteudoInicio } from "./_componentes/conteudos";
import { Carregando } from "./_componentes/carregando";

type Props = PageProps<"/[lang]/produtor">;

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  return { title: dicionario(idiomaDaRota((await params).lang)).produtor.inicio.aba };
}

export default async function PaginaInicio({ params }: Props) {
  const idioma = idiomaDaRota((await params).lang);
  const t = dicionario(idioma);
  return (
    <main className="flex flex-1 flex-col items-start gap-4 px-5 py-10">
      <div className="flex w-full items-center justify-between gap-4">
        <p className="text-sm font-medium tracking-wide text-primario-escuro">{t.marca}</p>
        <TrocarIdioma idioma={idioma} rotulo={t.idioma.rotulo} />
      </div>
      <h1 className="font-display text-2xl font-medium text-stone-900">
        {t.produtor.inicio.titulo}
      </h1>
      <Suspense fallback={<Carregando idioma={idioma} />}>
        <ConteudoInicio idioma={idioma} />
      </Suspense>
    </main>
  );
}
