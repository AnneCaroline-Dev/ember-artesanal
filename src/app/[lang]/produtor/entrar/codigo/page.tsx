import type { Metadata } from "next";
import { Suspense } from "react";
import { dicionario } from "@/lib/idioma/dicionarios";
import { idiomaDaRota } from "@/lib/idioma/rota";
import { BotaoSair } from "../../_componentes/botao-sair";
import { ConteudoCodigo } from "../../_componentes/conteudos";
import { Carregando } from "../../_componentes/carregando";
import { MolduraDeAcesso } from "../../_componentes/moldura";

type Props = PageProps<"/[lang]/produtor/entrar/codigo">;

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  return { title: dicionario(idiomaDaRota((await params).lang)).produtor.codigo.aba };
}

export default async function PaginaCodigo({ params }: Props) {
  const idioma = idiomaDaRota((await params).lang);
  const t = dicionario(idioma).produtor.codigo;
  return (
    <MolduraDeAcesso
      idioma={idioma}
      titulo={t.titulo}
      subtitulo={t.subtitulo}
      rodape={<BotaoSair idioma={idioma} texto={t.outraConta} />}
    >
      <Suspense fallback={<Carregando idioma={idioma} />}>
        <ConteudoCodigo idioma={idioma} />
      </Suspense>
    </MolduraDeAcesso>
  );
}
