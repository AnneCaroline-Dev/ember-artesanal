import type { Metadata } from "next";
import { dicionario } from "@/lib/idioma/dicionarios";
import { idiomaDaRota } from "@/lib/idioma/rota";
import { AceitarConvite } from "../_componentes/aceitar-convite";
import { MolduraDeAcesso } from "../_componentes/moldura";

type Props = PageProps<"/[lang]/produtor/convite">;

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  return { title: dicionario(idiomaDaRota((await params).lang)).produtor.convite.aba };
}

export default async function PaginaConvite({ params }: Props) {
  const idioma = idiomaDaRota((await params).lang);
  const t = dicionario(idioma).produtor.convite;
  return (
    <MolduraDeAcesso idioma={idioma} titulo={t.titulo} subtitulo={t.subtitulo}>
      <AceitarConvite idioma={idioma} texto={t.abrindo} />
    </MolduraDeAcesso>
  );
}
