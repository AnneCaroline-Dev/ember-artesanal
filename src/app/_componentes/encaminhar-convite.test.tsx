import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EncaminharConvite } from "./encaminhar-convite";

afterEach(() => window.history.replaceState(null, "", "/"));

describe("P1 · Entrar com segurança · convite que chega na página inicial", () => {
  it("CA1 · leva o convite do e-mail para a área do produtor, sem perder o código", () => {
    window.history.replaceState(null, "", "/#access_token=a&refresh_token=b&type=invite");
    const navegar = vi.fn();
    render(<EncaminharConvite navegar={navegar} />);
    expect(navegar).toHaveBeenCalledWith(
      "/produtor/convite#access_token=a&refresh_token=b&type=invite",
    );
  });

  it("não faz nada nas visitas normais da loja", () => {
    window.history.replaceState(null, "", "/#vitrine");
    const navegar = vi.fn();
    render(<EncaminharConvite navegar={navegar} />);
    expect(navegar).not.toHaveBeenCalled();
  });
});
