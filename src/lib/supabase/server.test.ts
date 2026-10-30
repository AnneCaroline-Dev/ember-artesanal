import { afterEach, describe, expect, it, vi } from "vitest";

const cookieStore = { getAll: vi.fn(() => [{ name: "a", value: "1" }]), set: vi.fn() };
vi.mock("next/headers", () => ({ cookies: async () => cookieStore }));

type Opcoes = {
  cookies: {
    getAll: () => unknown;
    setAll: (c: { name: string; value: string; options: object }[]) => void;
  };
};
const createServerClient = vi.fn((_url: string, _chave: string, opcoes: Opcoes) => opcoes);
vi.mock("@supabase/ssr", () => ({ createServerClient }));

const { criarClienteSupabase } = await import("./server");

afterEach(() => {
  vi.unstubAllEnvs();
  cookieStore.set.mockReset();
});

describe("Cliente da Supabase no servidor", () => {
  it("devolve nada quando o ambiente não tem a Supabase ligada", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    expect(await criarClienteSupabase()).toBeNull();
  });

  it("usa os cookies do pedido para ler e gravar a sessão", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://exemplo.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_teste");
    const opcoes = (await criarClienteSupabase()) as unknown as Opcoes;
    expect(createServerClient.mock.calls[0][0]).toBe("https://exemplo.supabase.co");
    expect(opcoes.cookies.getAll()).toEqual([{ name: "a", value: "1" }]);
    opcoes.cookies.setAll([{ name: "sb", value: "x", options: {} }]);
    expect(cookieStore.set).toHaveBeenCalledWith("sb", "x", {});
  });

  it("ignora a gravação de cookies quando está num Server Component", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://exemplo.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_teste");
    cookieStore.set.mockImplementation(() => {
      throw new Error("Cookies can only be modified in a Server Action");
    });
    const opcoes = (await criarClienteSupabase()) as unknown as Opcoes;
    expect(() => opcoes.cookies.setAll([{ name: "sb", value: "x", options: {} }])).not.toThrow();
  });
});
