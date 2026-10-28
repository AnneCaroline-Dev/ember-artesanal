import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Splash } from "./splash";

describe("Splash screen", () => {
  it("mostra o símbolo da vela, o nome e a frase do ateliê", () => {
    const { container } = render(<Splash />);
    expect(container.querySelector('img[src="/logo-vela.svg"]')).not.toBeNull();
    expect(screen.getByText("Ember Artesanal")).toBeInTheDocument();
    expect(screen.getByText("Desde 2024")).toBeInTheDocument();
    expect(screen.getByText("Iluminando seus momentos com essência artesanal")).toBeInTheDocument();
    expect(screen.getByText("Preparando o ateliê")).toBeInTheDocument();
  });

  it("fica fora do leitor de tela e não bloqueia toques enquanto some", () => {
    const { container } = render(<Splash />);
    const splash = container.firstElementChild as HTMLElement;
    expect(splash).toHaveAttribute("aria-hidden", "true");
    expect(splash.className).toContain("pointer-events-none");
  });

  it("não aparece para quem pediu menos movimento no aparelho", () => {
    const { container } = render(<Splash />);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "motion-reduce:hidden",
    );
  });
});
