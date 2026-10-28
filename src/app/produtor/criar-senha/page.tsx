import type { Metadata } from "next";
import { Suspense } from "react";
import { ConteudoCriarSenha } from "../_componentes/conteudos";
import { Carregando } from "../_componentes/carregando";
import { MolduraDeAcesso } from "../_componentes/moldura";

export const metadata: Metadata = { title: "Criar senha · Ember Artesanal" };

export default function PaginaCriarSenha() {
  return (
    <MolduraDeAcesso
      titulo="Crie sua senha"
      subtitulo="Você vai entrar com ela e com um código do celular."
    >
      <Suspense fallback={<Carregando />}>
        <ConteudoCriarSenha />
      </Suspense>
    </MolduraDeAcesso>
  );
}
