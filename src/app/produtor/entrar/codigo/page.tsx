import type { Metadata } from "next";
import { Suspense } from "react";
import { ConteudoCodigo } from "../../_componentes/conteudos";
import { BotaoSair } from "../../_componentes/botao-sair";
import { Carregando } from "../../_componentes/carregando";
import { MolduraDeAcesso } from "../../_componentes/moldura";

export const metadata: Metadata = { title: "Código · Ember Artesanal" };

export default function PaginaCodigo() {
  return (
    <MolduraDeAcesso
      titulo="Confirme que é você"
      subtitulo="Digite o código de 6 números do seu app autenticador."
      rodape={<BotaoSair texto="Entrar com outra conta" />}
    >
      <Suspense fallback={<Carregando />}>
        <ConteudoCodigo />
      </Suspense>
    </MolduraDeAcesso>
  );
}
