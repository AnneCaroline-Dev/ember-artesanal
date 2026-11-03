import { dicionario } from "@/lib/idioma/dicionarios";
import { idiomaDaRota } from "@/lib/idioma/rota";
import { TrocarIdioma } from "../_componentes/trocar-idioma";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const idioma = idiomaDaRota((await params).lang);
  const t = dicionario(idioma);
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <div className="absolute top-4 right-4">
        <TrocarIdioma idioma={idioma} rotulo={t.idioma.rotulo} />
      </div>
      <h1 className="font-display text-4xl font-medium tracking-tight text-stone-900">{t.marca}</h1>
      <hr className="w-40 border-primario-escuro" />
      <p className="max-w-md text-lg text-marrom">{t.descricao}</p>
      <p className="rounded-full bg-aviso px-4 py-1 text-sm font-medium text-primario-escuro">
        {t.loja.emConstrucao}
      </p>
    </main>
  );
}
