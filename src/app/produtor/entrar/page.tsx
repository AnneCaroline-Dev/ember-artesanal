import type { Metadata } from "next";
import { Suspense } from "react";
import { ConteudoEntrar } from "../_componentes/conteudos";
import { Carregando } from "../_componentes/carregando";
import { MolduraDeAcesso } from "../_componentes/moldura";

export const metadata: Metadata = { title: "Entrar · Ember Artesanal" };

export default function PaginaEntrar({ searchParams }: PageProps<"/produtor/entrar">) {
  return (
    <MolduraDeAcesso titulo="Acesso à oficina" subtitulo="Gerencie sua produção artesanal">
      <Suspense fallback={<Carregando />}>
        <ConteudoEntrar busca={searchParams} />
      </Suspense>
    </MolduraDeAcesso>
  );
}
