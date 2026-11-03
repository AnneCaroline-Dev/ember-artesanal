import { describe, expect, it } from "vitest";
import { dicionario } from "./dicionarios";

function chaves(objeto: object, prefixo = ""): string[] {
  return Object.entries(objeto).flatMap(([chave, valor]) =>
    typeof valor === "object" && valor !== null
      ? chaves(valor, `${prefixo}${chave}.`)
      : [`${prefixo}${chave}`],
  );
}

function textos(objeto: object): string[] {
  return Object.values(objeto).flatMap((valor) =>
    typeof valor === "object" && valor !== null ? textos(valor) : [String(valor)],
  );
}

describe("G2 · Português e inglês · dicionários", () => {
  it("CA3 · todo texto em português tem a sua tradução em inglês", () => {
    expect(chaves(dicionario("en")).sort()).toEqual(chaves(dicionario("pt")).sort());
  });

  it("CA3 · nenhuma tradução fica vazia", () => {
    for (const idioma of ["pt", "en"] as const) {
      expect(textos(dicionario(idioma)).filter((t) => t.trim() === "")).toEqual([]);
    }
  });

  it("o nome da marca não é traduzido", () => {
    expect(dicionario("en").marca).toBe("Ember Artesanal");
    expect(dicionario("pt").marca).toBe("Ember Artesanal");
  });
});
