import { afterEach, describe, expect, it, vi } from "vitest";
import { guardarCampos, restaurarCampos } from "./campos-guardados";

function montar(html: string) {
  document.body.innerHTML = html;
  return document.querySelector("form")!;
}

afterEach(() => {
  sessionStorage.clear();
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("G2 · Português e inglês · trocar de idioma sem perder o que foi digitado", () => {
  it("CA2 · guarda os campos preenchidos e devolve na mesma tela do outro idioma", () => {
    montar(`<form>
      <input name="email" value="rafael@ember.test" />
      <input name="codigo" value="" />
      <textarea name="descricao">Vela de lavanda</textarea>
    </form>`);
    guardarCampos("/produtor/entrar");

    const formulario = montar(`<form>
      <input name="email" /><input name="codigo" /><textarea name="descricao"></textarea>
    </form>`);
    restaurarCampos(formulario, "/produtor/entrar");

    expect(formulario.querySelector<HTMLInputElement>("[name=email]")!.value).toBe(
      "rafael@ember.test",
    );
    expect(formulario.querySelector<HTMLTextAreaElement>("[name=descricao]")!.value).toBe(
      "Vela de lavanda",
    );
    expect(sessionStorage.length).toBe(0);
  });

  it("CA2 · nunca guarda senhas nem campos escondidos", () => {
    montar(`<form>
      <input name="email" value="rafael@ember.test" />
      <input name="senha" type="password" value="segredo123" />
      <input name="fatorId" type="hidden" value="fator" />
    </form>`);
    guardarCampos("/produtor/entrar");
    const guardado = sessionStorage.getItem("ember:campos-guardados")!;
    expect(guardado).not.toContain("segredo123");
    expect(guardado).not.toContain("fator");
  });

  it("não preenche uma tela diferente da que foi guardada", () => {
    montar(`<form><input name="email" value="rafael@ember.test" /></form>`);
    guardarCampos("/produtor/entrar");
    const formulario = montar(`<form><input name="email" /></form>`);
    restaurarCampos(formulario, "/produtor/criar-senha");
    expect(formulario.querySelector<HTMLInputElement>("[name=email]")!.value).toBe("");
  });

  it("não guarda nada quando não há campos preenchidos", () => {
    montar(`<form><input name="email" value="" /></form>`);
    guardarCampos("/produtor/entrar");
    expect(sessionStorage.length).toBe(0);
  });

  it("continua funcionando quando o navegador bloqueia o armazenamento", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    const formulario = montar(`<form><input name="email" value="rafael@ember.test" /></form>`);
    expect(() => guardarCampos("/produtor/entrar")).not.toThrow();
    expect(() => restaurarCampos(formulario, "/produtor/entrar")).not.toThrow();
  });

  it("ignora o que estiver guardado num formato estranho", () => {
    sessionStorage.setItem("ember:campos-guardados", "{quebrado");
    const formulario = montar(`<form><input name="email" /></form>`);
    expect(() => restaurarCampos(formulario, "/produtor/entrar")).not.toThrow();
  });
});
