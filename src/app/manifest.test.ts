import { describe, expect, it } from "vitest";
import manifest from "./manifest";

describe("Manifesto do app (PWA)", () => {
  it("abre como app, em português, na página inicial", () => {
    const m = manifest();
    expect(m.name).toBe("Ember Artesanal");
    expect(m.display).toBe("standalone");
    expect(m.start_url).toBe("/");
    expect(m.lang).toBe("pt-BR");
  });
});
