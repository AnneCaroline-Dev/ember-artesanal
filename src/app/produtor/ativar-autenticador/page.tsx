import type { Metadata } from "next";
import { Suspense } from "react";
import { ConteudoAtivarAutenticador } from "../_componentes/conteudos";
import { Carregando } from "../_componentes/carregando";
import { MolduraDeAcesso } from "../_componentes/moldura";

export const metadata: Metadata = { title: "Ativar autenticador · Ember Artesanal" };

export default function PaginaAtivarAutenticador() {
  return (
    <MolduraDeAcesso
      titulo="Ative a segunda confirmação"
      subtitulo="Assim ninguém entra no ateliê, mesmo que descubra sua senha."
    >
      <Suspense fallback={<Carregando />}>
        <ConteudoAtivarAutenticador />
      </Suspense>
    </MolduraDeAcesso>
  );
}
