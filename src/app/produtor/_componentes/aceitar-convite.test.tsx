import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const setSession = vi.fn(async () => ({ error: null as Error | null }));
let semSupabase = false;
vi.mock("@/lib/supabase/navegador", () => ({
  criarClienteNavegador: () => (semSupabase ? null : { auth: { setSession } }),
}));

const { AceitarConvite } = await import("./aceitar-convite");

afterEach(() => {
  window.history.replaceState(null, "", "/");
  semSupabase = false;
  setSession.mockClear();
});

describe("P1 · Entrar com segurança · abrir o convite", () => {
  it("CA1 · guarda a sessão do convite e leva para criar a senha", async () => {
    window.history.replaceState(
      null,
      "",
      "/produtor/convite#access_token=a&refresh_token=b&type=invite",
    );
    const navegar = vi.fn();
    render(<AceitarConvite navegar={navegar} />);
    expect(screen.getByRole("status")).toHaveTextContent("Abrindo seu convite…");
    await waitFor(() => expect(navegar).toHaveBeenCalledWith("/produtor/criar-senha"));
    expect(setSession).toHaveBeenCalledWith({ access_token: "a", refresh_token: "b" });
  });

  it("CA1 · sem a Supabase ligada, avisa que o link não vale", async () => {
    semSupabase = true;
    window.history.replaceState(
      null,
      "",
      "/produtor/convite#access_token=a&refresh_token=b&type=invite",
    );
    const navegar = vi.fn();
    render(<AceitarConvite navegar={navegar} />);
    await waitFor(() => expect(navegar).toHaveBeenCalledWith("/produtor/entrar?erro=link"));
  });
});
