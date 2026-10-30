// Símbolo da vela do Figma (Splash Screen). Decorativo: o nome do ateliê sempre vem escrito ao lado.
export function LogoVela({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- SVG pequeno e fixo, não precisa do otimizador de imagens.
  return <img src="/logo-vela.svg" alt="" width={40} height={42} className={className} />;
}
