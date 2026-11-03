import type { Metadata } from "next";
import { Suspense } from "react";
import { dicionario } from "@/lib/idioma/dicionarios";
import { idiomaDaRota } from "@/lib/idioma/rota";
import { ConteudoEntrar } from "../_componentes/conteudos";
import { Carregando } from "../_componentes/carregando";
import { MolduraDeAcesso } from "../_componentes/moldura";

type Props = PageProps<"/[lang]/produtor/entrar">;

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  return { title: dicionario(idiomaDaRota((await params).lang)).produtor.entrar.aba };
}

export default async function PaginaEntrar({ params, searchParams }: Props) {
  const idioma = idiomaDaRota((await params).lang);
  const t = dicionario(idioma).produtor.entrar;
  return (
    <MolduraDeAcesso idioma={idioma} titulo={t.titulo} subtitulo={t.subtitulo}>
      <Suspense fallback={<Carregando idioma={idioma} />}>
        <ConteudoEntrar idioma={idioma} busca={searchParams} />
      </Suspense>
    </MolduraDeAcesso>
  );
}
