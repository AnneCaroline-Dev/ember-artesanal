// @vitest-environment node
import { NextRequest, NextResponse } from "next/server";
import { describe, expect, it, vi } from "vitest";

const atualizarSessao = vi.fn(async () => NextResponse.next());
vi.mock("@/lib/supabase/proxy", () => ({ atualizarSessao }));

const { proxy, config } = await import("./proxy");

describe("Proxy", () => {
  it("renova a sessão em cada pedido da área do produtor", async () => {
    const pedido = new NextRequest("http://localhost/produtor");
    await proxy(pedido);
    expect(atualizarSessao).toHaveBeenCalledWith(pedido);
  });

  it("não roda na vitrine da cliente", () => {
    expect(config.matcher).toEqual(["/produtor/:path*"]);
  });
});
