import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

const { idiomaDaRota } = await import("./rota");

describe("G2 · Português e inglês · idioma do endereço", () => {
  it("aceita /pt e /en", () => {
    expect(idiomaDaRota("pt")).toBe("pt");
    expect(idiomaDaRota("en")).toBe("en");
  });

  it("qualquer outro idioma vira página inexistente", () => {
    expect(() => idiomaDaRota("de")).toThrow("NEXT_NOT_FOUND");
  });
});
