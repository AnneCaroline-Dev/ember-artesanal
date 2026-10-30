import { afterEach, describe, expect, it, vi } from "vitest";
import { criarClienteNavegador } from "./navegador";

afterEach(() => vi.unstubAllEnvs());

describe("Cliente da Supabase no navegador", () => {
  it("devolve nada quando a Supabase não está ligada", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    expect(criarClienteNavegador()).toBeNull();
  });

  it("cria o cliente com a URL e a chave publicável", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://exemplo.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_teste");
    expect(criarClienteNavegador()?.auth).toBeDefined();
  });
});
