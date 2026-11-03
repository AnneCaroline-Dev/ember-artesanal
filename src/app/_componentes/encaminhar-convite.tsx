"use client";

import { useEffect } from "react";
import { lerLinkDoEmail } from "@/lib/auth/convite";
import { comIdioma, type Idioma } from "@/lib/idioma/idiomas";

// O e-mail padrão da Supabase manda o convite para a página inicial (Site URL).
// Este componente só repassa o convite para a área do produtor; a loja não muda.
export function EncaminharConvite({
  idioma,
  navegar = (url: string) => window.location.replace(url),
}: {
  idioma: Idioma;
  navegar?: (url: string) => void;
}) {
  useEffect(() => {
    const { hash, pathname } = window.location;
    const rotaDoConvite = comIdioma(idioma, "/produtor/convite");
    if (pathname === rotaDoConvite || lerLinkDoEmail(hash).tipo === "nenhum") return;
    navegar(`${rotaDoConvite}${hash}`);
  }, [idioma, navegar]);
  return null;
}
