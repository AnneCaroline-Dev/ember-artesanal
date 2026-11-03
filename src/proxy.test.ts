// @vitest-environment node
import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const atualizarSessao = vi.fn(async () => NextResponse.next());
vi.mock("@/lib/supabase/proxy", () => ({ atualizarSessao }));

const { proxy, config } = await import("./proxy");

function pedido(caminho: string, cabecalhos: Record<string, string> = {}) {
  return new NextRequest(`http://localhost${caminho}`, { headers: cabecalhos });
}

describe("G2 · Português e inglês · proxy", () => {
  beforeEach(() => atualizarSessao.mockClear());

  it("CA1 · sem idioma no endereço, abre em português por padrão", async () => {
    const resposta = await proxy(pedido("/produtor/entrar?erro=link"));
    expect(resposta.status).toBe(307);
    expect(resposta.headers.get("location")).toBe("http://localhost/pt/produtor/entrar?erro=link");
  });

  it("CA1 · com o aparelho em inglês, abre em inglês", async () => {
    const resposta = await proxy(pedido("/", { "accept-language": "en-US,en;q=0.9" }));
    expect(resposta.headers.get("location")).toBe("http://localhost/en");
  });

  it("CA2 · lembra o idioma escolhido antes", async () => {
    const resposta = await proxy(
      pedido("/produtor", { "accept-language": "pt-BR", cookie: "idioma=en" }),
    );
    expect(resposta.headers.get("location")).toBe("http://localhost/en/produtor");
  });

  it("CA2 · guarda o idioma de cada página aberta", async () => {
    const resposta = await proxy(pedido("/en"));
    expect(resposta.cookies.get("idioma")).toMatchObject({ value: "en", path: "/" });
  });

  it("não regrava o idioma quando ele não mudou", async () => {
    const resposta = await proxy(pedido("/pt", { cookie: "idioma=pt" }));
    expect(resposta.cookies.get("idioma")).toBeUndefined();
  });

  it("renova a sessão em cada pedido da área do produtor", async () => {
    const pedidoDoProdutor = pedido("/en/produtor/entrar");
    const resposta = await proxy(pedidoDoProdutor);
    expect(atualizarSessao).toHaveBeenCalledWith(pedidoDoProdutor);
    expect(resposta.cookies.get("idioma")?.value).toBe("en");
  });

  it("não mexe na sessão na vitrine da cliente", async () => {
    await proxy(pedido("/pt"));
    await proxy(pedido("/pt/produtos"));
    expect(atualizarSessao).not.toHaveBeenCalled();
  });

  it("deixa de fora os arquivos do Next e as imagens", () => {
    const [padrao] = config.matcher;
    const regex = new RegExp(`^${padrao}$`);
    expect(regex.test("/produtor/entrar")).toBe(true);
    expect(regex.test("/")).toBe(true);
    expect(regex.test("/_next/static/chunk.js")).toBe(false);
    expect(regex.test("/logo-vela.svg")).toBe(false);
    expect(regex.test("/manifest.webmanifest")).toBe(false);
  });
});
