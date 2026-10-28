// P1 · Entrar com segurança: decide em que tela o Rafael precisa estar.

export type EstadoDeAcesso =
  | { logado: false }
  | {
      logado: true;
      ehProdutor: boolean;
      senhaCriada: boolean;
      nivelAtual: string | null;
      proximoNivel: string | null;
    };

export type Passo = "entrar" | "criar-senha" | "ativar-autenticador" | "codigo" | "inicio";

const rotas: Record<Passo, string> = {
  entrar: "/produtor/entrar",
  "criar-senha": "/produtor/criar-senha",
  "ativar-autenticador": "/produtor/ativar-autenticador",
  codigo: "/produtor/entrar/codigo",
  inicio: "/produtor",
};

export function proximoPasso(estado: EstadoDeAcesso): Passo {
  if (!estado.logado || !estado.ehProdutor) return "entrar";
  if (!estado.senhaCriada) return "criar-senha";
  if (estado.nivelAtual === "aal2") return "inicio";
  // aal2 como próximo nível quer dizer que já existe um autenticador ativado.
  if (estado.proximoNivel === "aal2") return "codigo";
  return "ativar-autenticador";
}

export function rotaDoPasso(passo: Passo): string {
  return rotas[passo];
}
