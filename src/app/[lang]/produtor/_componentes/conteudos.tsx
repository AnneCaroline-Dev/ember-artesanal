import { garantirPasso } from "@/lib/auth/guarda";
import { dicionario } from "@/lib/idioma/dicionarios";
import type { Idioma } from "@/lib/idioma/idiomas";
import { ativarAutenticador, confirmarCodigo, criarSenha, entrar } from "../acoes";
import { BotaoSair } from "./botao-sair";
import {
  FormularioAtivarAutenticador,
  FormularioCodigo,
  FormularioCriarSenha,
  FormularioEntrar,
} from "./formularios";

// Partes das telas que dependem da sessão. Cada página as mostra dentro de um <Suspense>.
// G2: o idioma vai preso a cada ação, para os redirecionamentos continuarem nele.

type Props = { idioma: Idioma };

const textosDosFormularios = (idioma: Idioma) => dicionario(idioma).produtor.formularios;

export async function ConteudoEntrar({
  idioma,
  busca,
}: Props & { busca: Promise<{ erro?: string | string[] }> }) {
  await garantirPasso("entrar", idioma);
  const { erro } = await busca;
  return (
    <FormularioEntrar
      acao={entrar.bind(null, idioma)}
      textos={textosDosFormularios(idioma)}
      erroInicial={erro === "link" ? "link" : undefined}
    />
  );
}

export async function ConteudoCodigo({ idioma }: Props) {
  await garantirPasso("codigo", idioma);
  return (
    <FormularioCodigo
      acao={confirmarCodigo.bind(null, idioma)}
      textos={textosDosFormularios(idioma)}
    />
  );
}

export async function ConteudoCriarSenha({ idioma }: Props) {
  await garantirPasso("criar-senha", idioma);
  return (
    <FormularioCriarSenha
      acao={criarSenha.bind(null, idioma)}
      textos={textosDosFormularios(idioma)}
    />
  );
}

export async function ConteudoAtivarAutenticador({ idioma }: Props) {
  const supabase = await garantirPasso("ativar-autenticador", idioma);

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
        {dicionario(idioma).produtor.ativarAutenticador.erroAoPreparar}
      </p>
    );
  }

  return (
    <FormularioAtivarAutenticador
      acao={ativarAutenticador.bind(null, idioma)}
      textos={textosDosFormularios(idioma)}
      fatorId={data.id}
      qrCode={data.totp.qr_code}
      chave={data.totp.secret}
      uri={data.totp.uri}
    />
  );
}

export async function ConteudoInicio({ idioma }: Props) {
  await garantirPasso("inicio", idioma);
  return (
    <>
      <p className="text-base text-marrom">{dicionario(idioma).produtor.inicio.saudacao}</p>
      <BotaoSair idioma={idioma} />
    </>
  );
}
