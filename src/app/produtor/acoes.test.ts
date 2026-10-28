import { beforeEach, describe, expect, it, vi } from "vitest";
import { criarSupabaseFalso, Redirecionou, type SupabaseFalso } from "@/test/supabase-falso";

let supabase: SupabaseFalso | null;

vi.mock("@/lib/supabase/server", () => ({
  criarClienteSupabase: async () => supabase,
}));

vi.mock("next/navigation", () => ({
  redirect: (destino: string) => {
    throw new Redirecionou(destino);
  },
}));

const { entrar, confirmarCodigo, criarSenha, ativarAutenticador, sair } = await import("./acoes");

function formulario(campos: Record<string, string>) {
  const dados = new FormData();
  for (const [nome, valor] of Object.entries(campos)) dados.set(nome, valor);
  return dados;
}

async function destinoDe(promessa: Promise<unknown>) {
  try {
    await promessa;
  } catch (erro) {
    if (erro instanceof Redirecionou) return erro.destino;
    throw erro;
  }
  return null;
}

beforeEach(() => {
  supabase = criarSupabaseFalso();
});

describe("P1 · Entrar com segurança · entrar", () => {
  it("pede e-mail e senha quando algum está vazio", async () => {
    const estado = await entrar(null, formulario({ email: "rafael@ember.test", senha: "" }));
    expect(estado).toEqual({ erro: "Preencha o e-mail e a senha." });
  });

  it("avisa quando o serviço de login não está disponível", async () => {
    supabase = null;
    const estado = await entrar(
      null,
      formulario({ email: "rafael@ember.test", senha: "segredo123" }),
    );
    expect(estado).toEqual({ erro: "Não foi possível entrar agora. Tente de novo em instantes." });
  });

  it("não diz qual dos dois está errado quando e-mail ou senha não conferem", async () => {
    supabase!.auth.signInWithPassword.mockResolvedValueOnce({
      data: {},
      error: { code: "invalid_credentials" } as never,
    });
    const estado = await entrar(null, formulario({ email: "rafael@ember.test", senha: "errada" }));
    expect(estado).toEqual({ erro: "E-mail ou senha incorretos." });
  });

  it("uma conta que não é de produtor sai e recebe a mesma mensagem", async () => {
    supabase = criarSupabaseFalso({ ehProdutor: false });
    const estado = await entrar(
      null,
      formulario({ email: "mariana@ember.test", senha: "segredo123" }),
    );
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(estado).toEqual({ erro: "E-mail ou senha incorretos." });
  });

  it("CA2 · com e-mail e senha corretos, leva para a tela do código", async () => {
    const destino = await destinoDe(
      entrar(null, formulario({ email: "rafael@ember.test", senha: "segredo123" })),
    );
    expect(supabase!.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "rafael@ember.test",
      password: "segredo123",
    });
    expect(destino).toBe("/produtor/entrar/codigo");
  });

  it("CA1 · sem autenticador ativado, leva para a ativação", async () => {
    supabase = criarSupabaseFalso({ proximoNivel: "aal1", fatores: [] });
    const destino = await destinoDe(
      entrar(null, formulario({ email: "rafael@ember.test", senha: "segredo123" })),
    );
    expect(destino).toBe("/produtor/ativar-autenticador");
  });
});

describe("P1 · Entrar com segurança · código do autenticador", () => {
  it("CA2 · com o código certo, entra no Início", async () => {
    const destino = await destinoDe(confirmarCodigo(null, formulario({ codigo: "123456" })));
    expect(supabase!.auth.mfa.challengeAndVerify).toHaveBeenCalledWith({
      factorId: "fator-totp",
      code: "123456",
    });
    expect(destino).toBe("/produtor");
  });

  it("CA3 · com o código errado ou expirado, mostra o aviso e fica na mesma tela", async () => {
    supabase!.auth.mfa.challengeAndVerify.mockResolvedValueOnce({
      data: {},
      error: { code: "mfa_verification_failed" } as never,
    });
    const estado = await confirmarCodigo(null, formulario({ codigo: "000000" }));
    expect(estado).toEqual({ erro: "Código inválido. Confira o app autenticador" });
  });

  it("CA3 · um código que não tem 6 números nem chega a ser enviado", async () => {
    const estado = await confirmarCodigo(null, formulario({ codigo: "12a4" }));
    expect(estado).toEqual({ erro: "Código inválido. Confira o app autenticador" });
    expect(supabase!.auth.mfa.challengeAndVerify).not.toHaveBeenCalled();
  });

  it("sem autenticador ativado, leva para a ativação", async () => {
    supabase = criarSupabaseFalso({ fatores: [] });
    const destino = await destinoDe(confirmarCodigo(null, formulario({ codigo: "123456" })));
    expect(destino).toBe("/produtor/ativar-autenticador");
  });

  it("sem sessão, volta para a tela Entrar", async () => {
    supabase = null;
    const destino = await destinoDe(confirmarCodigo(null, formulario({ codigo: "123456" })));
    expect(destino).toBe("/produtor/entrar");
  });
});

describe("P1 · Entrar com segurança · primeiro acesso", () => {
  it("CA1 · a senha precisa ter pelo menos 8 caracteres", async () => {
    const estado = await criarSenha(null, formulario({ senha: "curta", confirmacao: "curta" }));
    expect(estado).toEqual({ erro: "A senha precisa ter pelo menos 8 caracteres." });
  });

  it("CA1 · as duas senhas precisam ser iguais", async () => {
    const estado = await criarSenha(
      null,
      formulario({ senha: "velas-de-soja", confirmacao: "velas-de-cera" }),
    );
    expect(estado).toEqual({ erro: "As senhas não são iguais." });
  });

  it("CA1 · com a senha criada, segue para ativar o autenticador", async () => {
    const destino = await destinoDe(
      criarSenha(null, formulario({ senha: "velas-de-soja", confirmacao: "velas-de-soja" })),
    );
    expect(supabase!.auth.updateUser).toHaveBeenCalledWith({
      password: "velas-de-soja",
      data: { senha_criada: true },
    });
    expect(destino).toBe("/produtor/ativar-autenticador");
  });

  it("CA1 · avisa quando não consegue salvar a senha", async () => {
    supabase!.auth.updateUser.mockResolvedValueOnce({ data: {}, error: { code: "x" } as never });
    const estado = await criarSenha(
      null,
      formulario({ senha: "velas-de-soja", confirmacao: "velas-de-soja" }),
    );
    expect(estado).toEqual({ erro: "Não foi possível salvar a senha. Tente de novo." });
  });

  it("sem sessão, volta para a tela Entrar", async () => {
    supabase = null;
    const destino = await destinoDe(
      criarSenha(null, formulario({ senha: "velas-de-soja", confirmacao: "velas-de-soja" })),
    );
    expect(destino).toBe("/produtor/entrar");
  });

  it("CA1 · com o primeiro código do autenticador, libera o painel", async () => {
    const destino = await destinoDe(
      ativarAutenticador(null, formulario({ fatorId: "fator-novo", codigo: "654321" })),
    );
    expect(supabase!.auth.mfa.challengeAndVerify).toHaveBeenCalledWith({
      factorId: "fator-novo",
      code: "654321",
    });
    expect(destino).toBe("/produtor");
  });

  it("CA3 · na ativação, um código errado mostra o mesmo aviso", async () => {
    supabase!.auth.mfa.challengeAndVerify.mockResolvedValueOnce({
      data: {},
      error: { code: "mfa_verification_failed" } as never,
    });
    const estado = await ativarAutenticador(
      null,
      formulario({ fatorId: "fator-novo", codigo: "000000" }),
    );
    expect(estado).toEqual({ erro: "Código inválido. Confira o app autenticador" });
  });

  it("na ativação, sem sessão volta para a tela Entrar", async () => {
    supabase = null;
    const destino = await destinoDe(
      ativarAutenticador(null, formulario({ fatorId: "fator-novo", codigo: "654321" })),
    );
    expect(destino).toBe("/produtor/entrar");
  });
});

describe("P1 · Entrar com segurança · sair", () => {
  it("encerra a sessão e volta para a tela Entrar", async () => {
    const destino = await destinoDe(sair());
    expect(supabase!.auth.signOut).toHaveBeenCalled();
    expect(destino).toBe("/produtor/entrar");
  });
});
