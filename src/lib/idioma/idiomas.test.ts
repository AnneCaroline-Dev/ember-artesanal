import { describe, expect, it } from "vitest";
import { comIdioma, escolherIdioma, separarIdioma } from "./idiomas";

describe("G2 · Português e inglês · escolher o idioma", () => {
  it("CA1 · abre em inglês quando o aparelho está em inglês", () => {
    expect(escolherIdioma(undefined, "en-US,en;q=0.9,pt;q=0.5")).toBe("en");
    expect(escolherIdioma(undefined, "en-GB")).toBe("en");
  });

  it("CA1 · abre em português em qualquer outro idioma", () => {
    expect(escolherIdioma(undefined, "pt-BR,pt;q=0.9,en;q=0.8")).toBe("pt");
    expect(escolherIdioma(undefined, "es-ES,en;q=0.5")).toBe("pt");
    expect(escolherIdioma(undefined, "fr;q=0.4,en;q=0.9")).toBe("en");
    expect(escolherIdioma(undefined, null)).toBe("pt");
    expect(escolherIdioma(undefined, "")).toBe("pt");
  });

  it("CA2 · a escolha feita antes vale mais que o idioma do aparelho", () => {
    expect(escolherIdioma("pt", "en-US")).toBe("pt");
    expect(escolherIdioma("en", "pt-BR")).toBe("en");
    expect(escolherIdioma("de", "pt-BR")).toBe("pt");
  });

  it("separa o idioma do resto do endereço", () => {
    expect(separarIdioma("/en/produtor/entrar")).toEqual({
      idioma: "en",
      resto: "/produtor/entrar",
    });
    expect(separarIdioma("/pt")).toEqual({ idioma: "pt", resto: "/" });
    expect(separarIdioma("/produtor")).toBeNull();
    expect(separarIdioma("/entrar")).toBeNull();
  });

  it("monta o endereço no idioma escolhido", () => {
    expect(comIdioma("en", "/produtor/entrar")).toBe("/en/produtor/entrar");
    expect(comIdioma("pt", "/")).toBe("/pt");
  });
});
