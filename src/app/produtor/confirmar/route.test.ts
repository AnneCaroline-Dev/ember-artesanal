// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { criarSupabaseFalso, type SupabaseFalso } from "@/test/supabase-falso";

let supabase: SupabaseFalso | null;
vi.mock("@/lib/supabase/server", () => ({ criarClienteSupabase: async () => supabase }));

const { GET } = await import("./route");

const pedir = (busca: string) =>
  GET(new NextRequest(`https://ember.test/produtor/confirmar${busca}`));

beforeEach(() => {
  supabase = criarSupabaseFalso();
});

describe("P1 · Entrar com segurança · link do e-mail", () => {
  it("CA1 · o link do convite confirma o e-mail e leva para criar a senha", async () => {
    const resposta = await pedir("?token_hash=abc&type=invite");
    expect(supabase!.auth.verifyOtp).toHaveBeenCalledWith({ type: "invite", token_hash: "abc" });
    expect(resposta.headers.get("location")).toBe("https://ember.test/produtor/criar-senha");
  });

  it("um link vencido volta para a tela Entrar com o aviso", async () => {
    supabase!.auth.verifyOtp.mockResolvedValueOnce({
      data: {},
      error: { code: "otp_expired" } as never,
    });
    const resposta = await pedir("?token_hash=abc&type=invite");
    expect(resposta.headers.get("location")).toBe("https://ember.test/produtor/entrar?erro=link");
  });

  it("um link sem token ou de outro tipo não é aceito", async () => {
    expect((await pedir("?type=invite")).headers.get("location")).toBe(
      "https://ember.test/produtor/entrar?erro=link",
    );
    expect((await pedir("?token_hash=abc&type=magiclink")).headers.get("location")).toBe(
      "https://ember.test/produtor/entrar?erro=link",
    );
    expect(supabase!.auth.verifyOtp).not.toHaveBeenCalled();
  });

  it("sem Supabase ligada, volta para a tela Entrar com o aviso", async () => {
    supabase = null;
    expect((await pedir("?token_hash=abc&type=invite")).headers.get("location")).toBe(
      "https://ember.test/produtor/entrar?erro=link",
    );
  });
});
