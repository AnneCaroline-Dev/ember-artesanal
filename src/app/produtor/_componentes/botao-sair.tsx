import { sair } from "../acoes";

export function BotaoSair({ texto = "Sair" }: { texto?: string }) {
  return (
    <form action={sair}>
      <button type="submit" className="text-sm font-medium text-primario-escuro underline">
        {texto}
      </button>
    </form>
  );
}
