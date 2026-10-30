import type { NextRequest } from "next/server";
import { atualizarSessao } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return atualizarSessao(request);
}

// Só a área do produtor usa login; a vitrine da cliente fica de fora.
export const config = {
  matcher: ["/produtor/:path*"],
};
