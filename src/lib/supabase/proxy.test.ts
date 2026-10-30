// @vitest-environment node
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const getClaims = vi.fn(async () => ({ data: null, error: null }));
const createServerClient = vi.fn((_url: string, _chave: string, opcoes: { cookies: never }) => {
  const { cookies } = opcoes as {
    cookies: { setAll: (c: { name: string; value: string; options: object }[], h: object) => void };
  };
  return {
    auth: {
      getClaims: async () => {
        cookies.setAll([{ name: "sb-teste-auth-token", value: "novo", options: {} }], {
          "Cache-Control": "private, no-store",
        });
        return getClaims();
      },
    },
  };
});
vi.mock("@supabase/ssr", () => ({ createServerClient }));

const { atualizarSessao } = await import("./proxy");

afterEach(() => {
  vi.unstubAllEnvs();
  createServerClient.mockClear();
});

describe("Sessão da área do produtor", () => {
  it("sem Supabase ligada, deixa a página seguir", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    const resposta = await atualizarSessao(new NextRequest("http://localhost/produtor"));
    expect(resposta.status).toBe(200);
    expect(createServerClient).not.toHaveBeenCalled();
  });

  it("renova a sessão e devolve o cookie novo para o navegador", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://exemplo.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_teste");
    const resposta = await atualizarSessao(new NextRequest("http://localhost/produtor"));
    expect(getClaims).toHaveBeenCalled();
    expect(resposta.cookies.get("sb-teste-auth-token")?.value).toBe("novo");
    expect(resposta.headers.get("Cache-Control")).toBe("private, no-store");
  });
});
