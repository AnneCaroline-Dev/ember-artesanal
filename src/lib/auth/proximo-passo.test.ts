import { describe, expect, it } from "vitest";
import { proximoPasso, rotaDoPasso, type EstadoDeAcesso } from "./proximo-passo";

const rafael: EstadoDeAcesso = {
  logado: true,
  ehProdutor: true,
  senhaCriada: true,
  nivelAtual: "aal1",
  proximoNivel: "aal2",
};

describe("P1 · Entrar com segurança", () => {
  it("quem não entrou vai para a tela Entrar", () => {
    expect(proximoPasso({ logado: false })).toBe("entrar");
  });

  it("uma conta que não é de produtor não passa da tela Entrar", () => {
    expect(proximoPasso({ ...rafael, ehProdutor: false })).toBe("entrar");
  });

  it("CA1 · no primeiro acesso, depois de confirmar o e-mail, o Rafael cria a senha", () => {
    expect(
      proximoPasso({ ...rafael, senhaCriada: false, nivelAtual: "aal1", proximoNivel: "aal1" }),
    ).toBe("criar-senha");
  });

  it("CA1 · com a senha criada, o app pede para ativar o autenticador antes do painel", () => {
    expect(proximoPasso({ ...rafael, nivelAtual: "aal1", proximoNivel: "aal1" })).toBe(
      "ativar-autenticador",
    );
  });

  it("CA2 · com e-mail e senha corretos, o app pede o código de 6 números", () => {
    expect(proximoPasso(rafael)).toBe("codigo");
  });

  it("CA2 · com o código confirmado, o Rafael entra no Início", () => {
    expect(proximoPasso({ ...rafael, nivelAtual: "aal2" })).toBe("inicio");
  });

  it("cada passo tem a sua tela dentro da área do produtor", () => {
    expect(rotaDoPasso("entrar")).toBe("/produtor/entrar");
    expect(rotaDoPasso("criar-senha")).toBe("/produtor/criar-senha");
    expect(rotaDoPasso("ativar-autenticador")).toBe("/produtor/ativar-autenticador");
    expect(rotaDoPasso("codigo")).toBe("/produtor/entrar/codigo");
    expect(rotaDoPasso("inicio")).toBe("/produtor");
  });
});
