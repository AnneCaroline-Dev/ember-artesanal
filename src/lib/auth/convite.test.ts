import { describe, expect, it, vi } from "vitest";
import { aceitarConvite, lerLinkDoEmail } from "./convite";

const hashDoConvite = "#access_token=acesso&expires_in=3600&refresh_token=renova&type=invite";

describe("P1 · Entrar com segurança · link do e-mail padrão da Supabase", () => {
  it("CA1 · reconhece o convite que chega no fim do endereço", () => {
    expect(lerLinkDoEmail(hashDoConvite)).toEqual({
      tipo: "convite",
      accessToken: "acesso",
      refreshToken: "renova",
    });
  });

  it("CA1 · trata como inválido o link vencido ou já usado", () => {
    expect(lerLinkDoEmail("#error=access_denied&error_code=otp_expired")).toEqual({
      tipo: "invalido",
    });
    expect(lerLinkDoEmail("#access_token=acesso&type=invite")).toEqual({ tipo: "invalido" });
  });

  it("ignora endereços que não vieram do e-mail", () => {
    expect(lerLinkDoEmail("")).toEqual({ tipo: "nenhum" });
    expect(lerLinkDoEmail("#vitrine")).toEqual({ tipo: "nenhum" });
    expect(lerLinkDoEmail("#access_token=a&refresh_token=b&type=recovery")).toEqual({
      tipo: "nenhum",
    });
  });

  it("CA1 · com o convite aceito, leva o Rafael para criar a senha", async () => {
    const definirSessao = vi.fn(async () => ({ error: null }));
    const rota = await aceitarConvite(lerLinkDoEmail(hashDoConvite), definirSessao);
    expect(definirSessao).toHaveBeenCalledWith({
      access_token: "acesso",
      refresh_token: "renova",
    });
    expect(rota).toBe("/produtor/criar-senha");
  });

  it("CA1 · com o convite recusado ou inválido, avisa na tela Entrar", async () => {
    const recusa = vi.fn(async () => ({ error: new Error("expirou") }));
    expect(await aceitarConvite(lerLinkDoEmail(hashDoConvite), recusa)).toBe(
      "/produtor/entrar?erro=link",
    );
    const nuncaChamada = vi.fn(async () => ({ error: null }));
    expect(await aceitarConvite({ tipo: "invalido" }, nuncaChamada)).toBe(
      "/produtor/entrar?erro=link",
    );
    expect(nuncaChamada).not.toHaveBeenCalled();
  });
});
