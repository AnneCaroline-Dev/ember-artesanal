import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EncaminharConvite } from "./encaminhar-convite";

afterEach(() => window.history.replaceState(null, "", "/"));

describe("P1 · Entrar com segurança · convite que chega na página inicial", () => {
  it("CA1 · leva o convite do e-mail para a área do produtor, sem perder o código", () => {
    window.history.replaceState(null, "", "/en#access_token=a&refresh_token=b&type=invite");
    const navegar = vi.fn();
    render(<EncaminharConvite idioma="en" navegar={navegar} />);
    expect(navegar).toHaveBeenCalledWith(
      "/en/produtor/convite#access_token=a&refresh_token=b&type=invite",
    );
  });

  it("não faz nada nas visitas normais da loja", () => {
    window.history.replaceState(null, "", "/pt#vitrine");
    const navegar = vi.fn();
    render(<EncaminharConvite idioma="pt" navegar={navegar} />);
    expect(navegar).not.toHaveBeenCalled();
  });

  it("não repete o encaminhamento quando já está na página do convite", () => {
    window.history.replaceState(
      null,
      "",
      "/pt/produtor/convite#access_token=a&refresh_token=b&type=invite",
    );
    const navegar = vi.fn();
    render(<EncaminharConvite idioma="pt" navegar={navegar} />);
    expect(navegar).not.toHaveBeenCalled();
  });
});
