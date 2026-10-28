import { describe, expect, it } from "vitest";
import { lerConfigSupabase } from "./config";

describe("Configuração da Supabase", () => {
  it("usa a URL e a chave publicável que a Vercel criou", () => {
    expect(
      lerConfigSupabase({
        NEXT_PUBLIC_SUPABASE_URL: "https://exemplo.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_teste",
      }),
    ).toEqual({ url: "https://exemplo.supabase.co", chave: "sb_publishable_teste" });
  });

  it("aceita a chave anon antiga quando a publicável não existe", () => {
    expect(
      lerConfigSupabase({
        NEXT_PUBLIC_SUPABASE_URL: "https://exemplo.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon_teste",
      }),
    ).toEqual({ url: "https://exemplo.supabase.co", chave: "anon_teste" });
  });

  it("devolve nada quando o ambiente não tem a Supabase ligada", () => {
    expect(lerConfigSupabase({})).toBeNull();
    expect(
      lerConfigSupabase({ NEXT_PUBLIC_SUPABASE_URL: "https://exemplo.supabase.co" }),
    ).toBeNull();
  });
});
