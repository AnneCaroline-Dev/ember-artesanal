import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MolduraDeAcesso } from "./moldura";

describe("P1 · Entrar com segurança", () => {
  it("CA1 · a tela de acesso mostra o símbolo da vela acima do título", () => {
    const { container } = render(
      <MolduraDeAcesso titulo="Acesso à oficina" subtitulo="Gerencie sua produção artesanal">
        <p>formulário</p>
      </MolduraDeAcesso>,
    );
    expect(container.querySelector('img[src="/logo-vela.svg"]')).not.toBeNull();
    expect(screen.getByRole("heading", { level: 1, name: "Acesso à oficina" })).toBeInTheDocument();
  });
});
