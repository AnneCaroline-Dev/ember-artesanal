import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/pt" }));

const { default: Home } = await import("./page");

const abrir = async (lang: string) =>
  render(await Home({ params: Promise.resolve({ lang }), searchParams: Promise.resolve({}) }));

describe("Página inicial", () => {
  it("mostra o nome do ateliê", async () => {
    await abrir("pt");
    expect(screen.getByRole("heading", { level: 1, name: "Ember Artesanal" })).toBeInTheDocument();
  });

  it("explica o que o ateliê vende", async () => {
    await abrir("pt");
    expect(
      screen.getByText("Velas artesanais de cera de soja, feitas à mão em Belo Horizonte."),
    ).toBeInTheDocument();
  });

  it("avisa que a loja ainda está em construção", async () => {
    await abrir("pt");
    expect(screen.getByText("Loja em construção")).toBeInTheDocument();
  });
});

describe("G2 · Português e inglês · página inicial", () => {
  it("CA3 · em inglês, só a marca continua igual", async () => {
    await abrir("en");
    expect(screen.getByRole("heading", { level: 1, name: "Ember Artesanal" })).toBeInTheDocument();
    expect(screen.getByText("Shop under construction")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Language" })).toBeInTheDocument();
  });
});
