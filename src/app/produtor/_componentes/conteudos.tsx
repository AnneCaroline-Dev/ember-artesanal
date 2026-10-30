import { garantirPasso } from "@/lib/auth/guarda";
import { ativarAutenticador, confirmarCodigo, criarSenha, entrar } from "../acoes";
import { BotaoSair } from "./botao-sair";
import {
  FormularioAtivarAutenticador,
  FormularioCodigo,
  FormularioCriarSenha,
  FormularioEntrar,
} from "./formularios";

// Partes das telas que dependem da sessão. Cada página as mostra dentro de um <Suspense>.

const LINK_INVALIDO = "Este link expirou ou já foi usado. Peça um novo convite.";

export async function ConteudoEntrar({ busca }: { busca: Promise<{ erro?: string | string[] }> }) {
  await garantirPasso("entrar");
  const { erro } = await busca;
  return (
    <FormularioEntrar acao={entrar} erroInicial={erro === "link" ? LINK_INVALIDO : undefined} />
  );
}

export async function ConteudoCodigo() {
  await garantirPasso("codigo");
  return <FormularioCodigo acao={confirmarCodigo} />;
}

export async function ConteudoCriarSenha() {
  await garantirPasso("criar-senha");
  return <FormularioCriarSenha acao={criarSenha} />;
}

export async function ConteudoAtivarAutenticador() {
  const supabase = await garantirPasso("ativar-autenticador");

  // Cada visita cria um cadastro novo; os que nunca foram confirmados são descartados.
  const { data: fatores } = await supabase.auth.mfa.listFactors();
  const pendentes = fatores?.all.filter((f) => f.status === "unverified") ?? [];
  await Promise.all(pendentes.map((f) => supabase.auth.mfa.unenroll({ factorId: f.id })));

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: "Ember Artesanal",
  });

  if (error || !data) {
    return (
      <p role="alert" className="text-sm text-erro">
        Não foi possível preparar o autenticador. Recarregue a página.
      </p>
    );
  }

  return (
    <FormularioAtivarAutenticador
      acao={ativarAutenticador}
      fatorId={data.id}
      qrCode={data.totp.qr_code}
      chave={data.totp.secret}
      uri={data.totp.uri}
    />
  );
}

export async function ConteudoInicio() {
  await garantirPasso("inicio");
  return (
    <>
      <p className="text-base text-marrom">Olá, Rafael! O resumo do ateliê está em construção.</p>
      <BotaoSair />
    </>
  );
}
