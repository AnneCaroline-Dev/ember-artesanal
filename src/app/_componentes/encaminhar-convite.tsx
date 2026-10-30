"use client";

import { useEffect } from "react";
import { lerLinkDoEmail } from "@/lib/auth/convite";

const ROTA_DO_CONVITE = "/produtor/convite";

// O e-mail padrão da Supabase manda o convite para a página inicial (Site URL).
// Este componente só repassa o convite para a área do produtor; a loja não muda.
export function EncaminharConvite({
  navegar = (url: string) => window.location.replace(url),
}: {
  navegar?: (url: string) => void;
}) {
  useEffect(() => {
    const { hash, pathname } = window.location;
    if (pathname === ROTA_DO_CONVITE || lerLinkDoEmail(hash).tipo === "nenhum") return;
    navegar(`${ROTA_DO_CONVITE}${hash}`);
  }, [navegar]);
  return null;
}
