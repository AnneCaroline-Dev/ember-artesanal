"use client";

import { useEffect, useRef } from "react";
import { aceitarConvite, lerLinkDoEmail, type DefinirSessao } from "@/lib/auth/convite";
import { criarClienteNavegador } from "@/lib/supabase/navegador";

const semSupabase: DefinirSessao = async () => ({ error: new Error("Supabase não configurada") });

// P1 · CA1: guarda a sessão que veio no link do convite e segue para criar a senha.
export function AceitarConvite({
  navegar = (url: string) => window.location.replace(url),
}: {
  navegar?: (url: string) => void;
}) {
  const jaAbriu = useRef(false);

  useEffect(() => {
    if (jaAbriu.current) return;
    jaAbriu.current = true;
    const supabase = criarClienteNavegador();
    const definirSessao: DefinirSessao = supabase
      ? (tokens) => supabase.auth.setSession(tokens)
      : semSupabase;
    void aceitarConvite(lerLinkDoEmail(window.location.hash), definirSessao).then(navegar);
  }, [navegar]);

  return <p role="status">Abrindo seu convite…</p>;
}
