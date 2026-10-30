import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Splash } from "./splash";

describe("Splash screen", () => {
  it("mostra só o símbolo da vela e o nome do ateliê", () => {
    const { container } = render(<Splash />);
    expect(container.querySelector("svg")).not.toBeNull();
    expect(screen.getByText("Ember Artesanal")).toBeInTheDocument();
    expect(container.textContent).toBe("Ember Artesanal");
  });

  it("separa a chama do resto da vela, para ela acender e se mexer sozinha", () => {
    const { container } = render(<Splash />);
    const chama = container.querySelector('[data-parte="chama"]');
    const vela = container.querySelector('[data-parte="vela"]');
    expect(chama).not.toBeNull();
    expect(vela).not.toBeNull();
    expect(chama?.getAttribute("class")).toContain("splash-chama");
  });

  it("começa no escuro e clareia enquanto a vela acende", () => {
    const { container } = render(<Splash />);
    expect((container.firstElementChild as HTMLElement).className).toContain("splash-fundo");
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
