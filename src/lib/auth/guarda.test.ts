import { beforeEach, describe, expect, it, vi } from "vitest";
import { criarSupabaseFalso, Redirecionou, type SupabaseFalso } from "@/test/supabase-falso";

let supabase: SupabaseFalso | null;

vi.mock("@/lib/supabase/server", () => ({ criarClienteSupabase: async () => supabase }));
vi.mock("next/navigation", () => ({
  redirect: (destino: string) => {
    throw new Redirecionou(destino);
  },
}));

const { garantirPasso } = await import("./guarda");

beforeEach(() => {
  supabase = criarSupabaseFalso();
});

describe("P1 · Entrar com segurança · proteção das telas", () => {
  it("RF01 · sem a segunda confirmação, o Início manda para a tela do código", async () => {
    await expect(garantirPasso("inicio")).rejects.toEqual(
      new Redirecionou("/produtor/entrar/codigo"),
    );
  });

  it("RF01 · sem sessão, o Início manda para a tela Entrar", async () => {
    supabase = null;
    await expect(garantirPasso("inicio")).rejects.toEqual(new Redirecionou("/produtor/entrar"));
  });

  it("quem está no passo certo continua na tela e recebe o cliente", async () => {
    supabase = criarSupabaseFalso({ nivelAtual: "aal2" });
    await expect(garantirPasso("inicio")).resolves.toBe(supabase);
  });
});
