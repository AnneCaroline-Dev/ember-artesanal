import type { Metadata } from "next";
import { Suspense } from "react";
import { dicionario } from "@/lib/idioma/dicionarios";
import { idiomaDaRota } from "@/lib/idioma/rota";
import { ConteudoCriarSenha } from "../_componentes/conteudos";
import { Carregando } from "../_componentes/carregando";
import { MolduraDeAcesso } from "../_componentes/moldura";

type Props = PageProps<"/[lang]/produtor/criar-senha">;

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  return { title: dicionario(idiomaDaRota((await params).lang)).produtor.criarSenha.aba };
}

export default async function PaginaCriarSenha({ params }: Props) {
  const idioma = idiomaDaRota((await params).lang);
  const t = dicionario(idioma).produtor.criarSenha;
  return (
    <MolduraDeAcesso idioma={idioma} titulo={t.titulo} subtitulo={t.subtitulo}>
      <Suspense fallback={<Carregando idioma={idioma} />}>
        <ConteudoCriarSenha idioma={idioma} />
      </Suspense>
    </MolduraDeAcesso>
  );
}
