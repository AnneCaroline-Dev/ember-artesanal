import { describe, expect, it } from "vitest";
import { criarSupabaseFalso } from "@/test/supabase-falso";
import { lerEstadoDeAcesso } from "./estado";

describe("P1 · Entrar com segurança · estado do acesso", () => {
  it("sem Supabase ligada, ninguém está logado", async () => {
    expect(await lerEstadoDeAcesso(null)).toEqual({ logado: false });
  });

  it("sem sessão, ninguém está logado", async () => {
    const supabase = criarSupabaseFalso({ usuario: null });
    expect(await lerEstadoDeAcesso(supabase as never)).toEqual({ logado: false });
  });

  it("lê se é produtor, se já criou a senha e o nível da confirmação", async () => {
    const supabase = criarSupabaseFalso();
    expect(await lerEstadoDeAcesso(supabase as never)).toEqual({
      logado: true,
      ehProdutor: true,
      senhaCriada: true,
      nivelAtual: "aal1",
      proximoNivel: "aal2",
    });
  });

  it("uma conta que não está na lista de produtores não é produtor", async () => {
    const supabase = criarSupabaseFalso({ ehProdutor: false, usuario: { id: "outra" } });
    expect(await lerEstadoDeAcesso(supabase as never)).toMatchObject({
      logado: true,
      ehProdutor: false,
      senhaCriada: false,
    });
  });
});
