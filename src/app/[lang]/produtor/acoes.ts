"use server";

import { redirect } from "next/navigation";
import { lerEstadoDeAcesso } from "@/lib/auth/estado";
import { proximoPasso, rotaDoPasso } from "@/lib/auth/proximo-passo";
import type { CodigoDeErro } from "@/lib/idioma/dicionarios";
import { ehIdioma, type Idioma } from "@/lib/idioma/idiomas";
import { criarClienteSupabase } from "@/lib/supabase/server";

// G2 · CA3: as ações devolvem só o código do erro; o formulário mostra o texto no idioma da tela.
export type EstadoDoFormulario = { erro: CodigoDeErro } | null;

// O idioma vem preso à ação pela página; quem o alterar no navegador cai em português.
function idiomaSeguro(idioma: Idioma): Idioma {
  return ehIdioma(idioma) ? idioma : "pt";
}

function bruto(dados: FormData, campo: string) {
  const valor = dados.get(campo);
  return typeof valor === "string" ? valor : "";
}

// Senhas não são aparadas: um espaço no fim faz parte da senha.
function texto(dados: FormData, campo: string) {
  return bruto(dados, campo).trim();
}

function codigoValido(codigo: string) {
  return /^\d{6}$/.test(codigo);
}

// P1 · CA2: e-mail e senha.
export async function entrar(
  idiomaPedido: Idioma,
  _anterior: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const idioma = idiomaSeguro(idiomaPedido);
  const email = texto(dados, "email");
  const senha = bruto(dados, "senha");
  if (!email || !senha) return { erro: "preenchaEmailESenha" };

  const supabase = await criarClienteSupabase();
  if (!supabase) return { erro: "indisponivel" };

  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) return { erro: "credenciais" };

  const estado = await lerEstadoDeAcesso(supabase);
  if (estado.logado && !estado.ehProdutor) {
    await supabase.auth.signOut();
    return { erro: "credenciais" };
  }

  redirect(rotaDoPasso(proximoPasso(estado), idioma));
}

// P1 · CA2 e CA3: código de 6 números do app autenticador.
export async function confirmarCodigo(
  idiomaPedido: Idioma,
  _anterior: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const idioma = idiomaSeguro(idiomaPedido);
  const codigo = texto(dados, "codigo");
  if (!codigoValido(codigo)) return { erro: "codigo" };

  const supabase = await criarClienteSupabase();
  if (!supabase) redirect(rotaDoPasso("entrar", idioma));

  const { data } = await supabase.auth.mfa.listFactors();
  const fator = data?.totp[0];
  if (!fator) redirect(rotaDoPasso("ativar-autenticador", idioma));

  const { error } = await supabase.auth.mfa.challengeAndVerify({
    factorId: fator.id,
    code: codigo,
  });
  if (error) return { erro: "codigo" };

  redirect(rotaDoPasso("inicio", idioma));
}

// P1 · CA1: primeiro acesso, depois de confirmar o e-mail.
export async function criarSenha(
  idiomaPedido: Idioma,
  _anterior: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const idioma = idiomaSeguro(idiomaPedido);
  const senha = bruto(dados, "senha");
  const confirmacao = bruto(dados, "confirmacao");
  if (senha.length < 8) return { erro: "senhaCurta" };
  if (senha !== confirmacao) return { erro: "senhasDiferentes" };

  const supabase = await criarClienteSupabase();
  if (!supabase) redirect(rotaDoPasso("entrar", idioma));

  const { error } = await supabase.auth.updateUser({
    password: senha,
    data: { senha_criada: true },
  });
  if (error) return { erro: "salvarSenha" };

  redirect(rotaDoPasso("ativar-autenticador", idioma));
}

// P1 · CA1: o primeiro código confirma que o autenticador foi bem cadastrado.
export async function ativarAutenticador(
  idiomaPedido: Idioma,
  _anterior: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const idioma = idiomaSeguro(idiomaPedido);
  const fatorId = texto(dados, "fatorId");
  const codigo = texto(dados, "codigo");
  if (!fatorId || !codigoValido(codigo)) return { erro: "codigo" };

  const supabase = await criarClienteSupabase();
  if (!supabase) redirect(rotaDoPasso("entrar", idioma));

  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: fatorId, code: codigo });
  if (error) return { erro: "codigo" };

  redirect(rotaDoPasso("inicio", idioma));
}

export async function sair(idiomaPedido: Idioma) {
  const idioma = idiomaSeguro(idiomaPedido);
  const supabase = await criarClienteSupabase();
  await supabase?.auth.signOut();
  redirect(rotaDoPasso("entrar", idioma));
}
