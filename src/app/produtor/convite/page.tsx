import type { Metadata } from "next";
import { AceitarConvite } from "../_componentes/aceitar-convite";
import { MolduraDeAcesso } from "../_componentes/moldura";

export const metadata: Metadata = { title: "Convite · Ember Artesanal" };

export default function PaginaConvite() {
  return (
    <MolduraDeAcesso titulo="Bem-vindo ao ateliê" subtitulo="Estamos abrindo o seu convite">
      <AceitarConvite />
    </MolduraDeAcesso>
  );
}
