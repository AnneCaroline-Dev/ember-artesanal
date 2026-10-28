import { NextResponse, type NextRequest } from "next/server";
import { rotaDoPasso } from "@/lib/auth/proximo-passo";
import { criarClienteSupabase } from "@/lib/supabase/server";

// P1 · CA1: o convite por e-mail traz o Rafael para cá; daqui ele vai criar a senha.
const tiposAceitos = ["invite", "email"] as const;
type TipoAceito = (typeof tiposAceitos)[number];

function ehTipoAceito(tipo: string | null): tipo is TipoAceito {
  return tiposAceitos.includes(tipo as TipoAceito);
}

export async function GET(request: NextRequest) {
  const busca = request.nextUrl.searchParams;
  const tokenHash = busca.get("token_hash");
  const tipo = busca.get("type");
  const linkInvalido = new URL(`${rotaDoPasso("entrar")}?erro=link`, request.url);

  if (!tokenHash || !ehTipoAceito(tipo)) return NextResponse.redirect(linkInvalido);

  const supabase = await criarClienteSupabase();
  if (!supabase) return NextResponse.redirect(linkInvalido);

  const { error } = await supabase.auth.verifyOtp({ type: tipo, token_hash: tokenHash });
  if (error) return NextResponse.redirect(linkInvalido);

  return NextResponse.redirect(new URL(rotaDoPasso("criar-senha"), request.url));
}
