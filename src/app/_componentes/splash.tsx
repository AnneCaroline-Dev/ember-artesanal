import { LogoVela } from "./logo-vela";

// Splash screen do Figma (nó 10:868). Só CSS: aparece ao abrir o app e some sozinha,
// sem atrasar o carregamento. Quem pediu menos movimento no aparelho não vê.
export function Splash() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 flex animate-splash flex-col items-center justify-center overflow-hidden bg-[#fbf9f6] px-8 motion-reduce:hidden"
    >
      <span className="absolute -top-24 -left-24 size-80 rounded-full bg-primario-escuro/[0.03] blur-3xl" />
      <span className="absolute -right-24 -bottom-24 size-96 rounded-full bg-[#fdc086]/5 blur-3xl" />

      <div className="relative flex flex-col items-center text-center">
        <span className="relative flex size-24 items-center justify-center rounded-full border border-[#eae8e5] bg-white shadow-[0_8px_24px_rgba(150,68,0,0.08)]">
          <span className="absolute inset-0 rounded-full bg-primario-escuro/10 blur-md" />
          <LogoVela className="relative" />
        </span>

        <p className="mt-8 font-display text-[26px] font-bold tracking-[-0.65px] text-[#1b1c1a]">
          Ember Artesanal
        </p>

        <div className="mt-3 flex items-center gap-3">
          <span className="h-px w-8 bg-[#dcc1b3]/50" />
          <p className="text-base text-marrom/80 italic">Desde 2024</p>
          <span className="h-px w-8 bg-[#dcc1b3]/50" />
        </div>

        <p className="mt-8 max-w-64 text-lg leading-[29.25px] font-light tracking-[0.45px] text-marrom">
          Iluminando seus momentos com essência artesanal
        </p>
      </div>

      <div className="absolute bottom-16 flex flex-col items-center gap-3">
        <div className="h-0.5 w-48 overflow-hidden rounded-full bg-[#eae8e5]">
          <div className="h-full animate-splash-barra bg-primario-escuro" />
        </div>
        <p className="text-xs tracking-[2.4px] text-[#707070] uppercase">Preparando o ateliê</p>
      </div>
    </div>
  );
}
