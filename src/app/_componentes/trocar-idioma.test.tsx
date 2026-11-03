import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

let caminho = "/pt/produtor/entrar";
vi.mock("next/navigation", () => ({ usePathname: () => caminho }));

const { TrocarIdioma } = await import("./trocar-idioma");

afterEach(() => {
  sessionStorage.clear();
  document.body.innerHTML = "";
  window.history.replaceState(null, "", "/");
  caminho = "/pt/produtor/entrar";
});

describe("G2 · Português e inglês · botão PT | EN", () => {
  it("CA2 · mostra os dois idiomas e marca o atual", () => {
    render(<TrocarIdioma idioma="pt" rotulo="Idioma" />);
    expect(screen.getByRole("navigation", { name: "Idioma" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Português" })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "href",
      "/en/produtor/entrar",
    );
  });

  it("CA2 · ao tocar em EN, abre a mesma tela em inglês sem perder o que foi digitado", async () => {
    window.history.replaceState(null, "", "/pt/produtor/entrar?erro=link");
    const navegar = vi.fn();
    render(
      <>
        <form>
          <input name="email" defaultValue="rafael@ember.test" />
          <input name="senha" type="password" defaultValue="segredo123" />
        </form>
        <TrocarIdioma idioma="pt" rotulo="Idioma" navegar={navegar} />
      </>,
    );
    await userEvent.click(screen.getByRole("link", { name: "English" }));
    expect(navegar).toHaveBeenCalledWith("/en/produtor/entrar?erro=link");
    const guardado = sessionStorage.getItem("ember:campos-guardados")!;
    expect(JSON.parse(guardado)).toEqual({
      caminho: "/produtor/entrar",
      campos: { email: "rafael@ember.test" },
    });
  });

  it("tocar no idioma atual não recarrega a página", async () => {
    caminho = "/en";
    const navegar = vi.fn();
    render(<TrocarIdioma idioma="en" rotulo="Language" navegar={navegar} />);
    await userEvent.click(screen.getByRole("link", { name: "English" }));
    expect(navegar).not.toHaveBeenCalled();
    expect(screen.getByRole("link", { name: "Português" })).toHaveAttribute("href", "/pt");
  });
});
