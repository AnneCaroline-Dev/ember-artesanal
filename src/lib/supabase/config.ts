type Ambiente = Record<string, string | undefined>;

export type ConfigSupabase = { url: string; chave: string };

// Lê as variáveis que a integração da Vercel com a Supabase cria.
export function lerConfigSupabase(ambiente: Ambiente = process.env): ConfigSupabase | null {
  const url = ambiente.NEXT_PUBLIC_SUPABASE_URL;
  const chave =
    ambiente.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ambiente.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !chave) return null;
  return { url, chave };
}
