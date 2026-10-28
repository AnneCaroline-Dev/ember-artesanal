import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { criarSupabaseFalso, type SupabaseFalso } from "@/test/supabase-falso";
import { MolduraDeAcesso } from "./moldura";
import { Carregando } from "./carregando";

let supabase: SupabaseFalso;
const garantirPasso = vi.fn<(passo: string) => Promise<SupabaseFalso>>(async () => supabase);

vi.mock("@/lib/auth/guarda", () => ({ garantirPasso: (passo: string) => garantirPasso(passo) }));
vi.mock("@/lib/supabase/server", () => ({ criarClienteSupabase: async () => supabase }));

const {
  ConteudoAtivarAutenticador,
  ConteudoCodigo,
  ConteudoCriarSenha,
  ConteudoEntrar,
  ConteudoInicio,
} = await import("./conteudos");

beforeEach(() => {
  supabase = criarSupabaseFalso();
  garantirPasso.mockClear();
});

describe("P1 · Entrar com segurança · telas", () => {
  it("a moldura mostra o nome do ateliê, o título e o rodapé", () => {
    render(
      <MolduraDeAcesso titulo="Acesso à oficina" subtitulo="Gerencie" rodape={<p>rodapé</p>}>
        <Carregando />
      </MolduraDeAcesso>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Acesso à oficina");
    expect(screen.getByText("Ember Artesanal")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Carregando…");
    expect(screen.getByText("rodapé")).toBeInTheDocument();
  });

  it("a tela Entrar confere o passo e mostra o formulário", async () => {
    render(await ConteudoEntrar({ busca: Promise.resolve({}) }));
    expect(garantirPasso).toHaveBeenCalledWith("entrar");
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("CA1 · a tela Entrar avisa quando o link do convite não vale mais", async () => {
    render(await ConteudoEntrar({ busca: Promise.resolve({ erro: "link" }) }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Este link expirou ou já foi usado. Peça um novo convite.",
    );
  });

  it("CA2 · a tela do código confere o passo e pede o código", async () => {
    render(await ConteudoCodigo());
    expect(garantirPasso).toHaveBeenCalledWith("codigo");
    expect(screen.getByLabelText("Código de 6 números")).toBeInTheDocument();
  });

  it("CA1 · a tela de criar senha confere o passo e pede a senha duas vezes", async () => {
    render(await ConteudoCriarSenha());
    expect(garantirPasso).toHaveBeenCalledWith("criar-senha");
    expect(screen.getByLabelText("Repita a senha")).toBeInTheDocument();
  });

  it("CA1 · a ativação descarta cadastros não confirmados e mostra o novo QR code", async () => {
    supabase = criarSupabaseFalso({
      fatores: [{ id: "abandonado", status: "unverified", factor_type: "totp" }],
    });
    render(await ConteudoAtivarAutenticador());
    expect(supabase.auth.mfa.unenroll).toHaveBeenCalledWith({ factorId: "abandonado" });
    expect(supabase.auth.mfa.enroll).toHaveBeenCalledWith({
      factorType: "totp",
      friendlyName: "Ember Artesanal",
    });
    expect(screen.getByText("SEGREDO123")).toBeInTheDocument();
  });

  it("CA1 · a ativação avisa quando não consegue preparar o autenticador", async () => {
    supabase.auth.mfa.enroll.mockResolvedValueOnce({ data: null, error: { code: "x" } } as never);
    render(await ConteudoAtivarAutenticador());
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Não foi possível preparar o autenticador. Recarregue a página.",
    );
  });

  it("CA2 · o Início confere o passo, cumprimenta o Rafael e oferece Sair", async () => {
    render(await ConteudoInicio());
    expect(garantirPasso).toHaveBeenCalledWith("inicio");
    expect(screen.getByText(/Olá, Rafael!/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sair" })).toBeInTheDocument();
  });
});
