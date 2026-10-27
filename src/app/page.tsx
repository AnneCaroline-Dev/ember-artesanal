export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="font-display text-4xl font-medium tracking-tight text-stone-900">
        Ember Artesanal
      </h1>
      <hr className="w-40 border-primario-escuro" />
      <p className="max-w-md text-lg text-marrom">
        Velas artesanais de cera de soja, feitas à mão em Belo Horizonte.
      </p>
      <p className="rounded-full bg-aviso px-4 py-1 text-sm font-medium text-primario-escuro">
        Loja em construção
      </p>
    </main>
  );
}
