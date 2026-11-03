import { describe, expect, it } from "vitest";
import { formatarData } from "./datas";

describe("G2 · Português e inglês · datas", () => {
  it("CA3 · cada idioma mostra a data do seu jeito", () => {
    const data = new Date("2026-10-30T15:00:00Z");
    expect(formatarData(data, "pt")).toBe("30/10/2026");
    expect(formatarData(data, "en")).toBe("Oct 30, 2026");
  });

  it("CA3 · usa o horário de Belo Horizonte para decidir o dia", () => {
    // 1h da manhã em UTC ainda é dia 29 em Belo Horizonte.
    expect(formatarData(new Date("2026-10-30T01:00:00Z"), "pt")).toBe("29/10/2026");
  });
});
