import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Página inicial", () => {
  it("mostra o nome do ateliê", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1, name: "Ember Artesanal" })).toBeInTheDocument();
  });

  it("explica o que o ateliê vende", () => {
    render(<Home />);
    expect(
      screen.getByText("Velas artesanais de cera de soja, feitas à mão em Belo Horizonte."),
    ).toBeInTheDocument();
  });

  it("avisa que a loja ainda está em construção", () => {
    render(<Home />);
    expect(screen.getByText("Loja em construção")).toBeInTheDocument();
  });
});
