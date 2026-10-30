"use server";

import { redirect } from "next/navigation";
import { lerEstadoDeAcesso } from "@/lib/auth/estado";
import { proximoPasso, rotaDoPasso } from "@/lib/auth/proximo-passo";
import { criarClienteSupabase } from "@/lib/supabase/server";

export type EstadoDoFormulario = { erro: string } | null;

const CODIGO_INVALIDO = "Código inválido. Confira o app autenticador";
const CREDENCIAIS_INVALIDAS = "E-mail ou senha incorretos.";

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
  _anterior: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const email = texto(dados, "email");
  const senha = bruto(dados, "senha");
  if (!email || !senha) return { erro: "Preencha o e-mail e a senha." };

  const supabase = await criarClienteSupabase();
  if (!supabase) return { erro: "Não foi possível entrar agora. Tente de novo em instantes." };

  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) return { erro: CREDENCIAIS_INVALIDAS };

  const estado = await lerEstadoDeAcesso(supabase);
  if (estado.logado && !estado.ehProdutor) {
    await supabase.auth.signOut();
    return { erro: CREDENCIAIS_INVALIDAS };
  }

  redirect(rotaDoPasso(proximoPasso(estado)));
}

// P1 · CA2 e CA3: código de 6 números do app autenticador.
export async function confirmarCodigo(
  _anterior: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const codigo = texto(dados, "codigo");
  if (!codigoValido(codigo)) return { erro: CODIGO_INVALIDO };

  const supabase = await criarClienteSupabase();
  if (!supabase) redirect(rotaDoPasso("entrar"));

  const { data } = await supabase.auth.mfa.listFactors();
  const fator = data?.totp[0];
  if (!fator) redirect(rotaDoPasso("ativar-autenticador"));

  const { error } = await supabase.auth.mfa.challengeAndVerify({
    factorId: fator.id,
    code: codigo,
  });
  if (error) return { erro: CODIGO_INVALIDO };

  redirect(rotaDoPasso("inicio"));
}

// P1 · CA1: primeiro acesso, depois de confirmar o e-mail.
export async function criarSenha(
  _anterior: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const senha = bruto(dados, "senha");
  const confirmacao = bruto(dados, "confirmacao");
  if (senha.length < 8) return { erro: "A senha precisa ter pelo menos 8 caracteres." };
  if (senha !== confirmacao) return { erro: "As senhas não são iguais." };

  const supabase = await criarClienteSupabase();
  if (!supabase) redirect(rotaDoPasso("entrar"));

  const { error } = await supabase.auth.updateUser({
    password: senha,
    data: { senha_criada: true },
  });
  if (error) return { erro: "Não foi possível salvar a senha. Tente de novo." };

  redirect(rotaDoPasso("ativar-autenticador"));
}

// P1 · CA1: o primeiro código confirma que o autenticador foi bem cadastrado.
export async function ativarAutenticador(
  _anterior: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const fatorId = texto(dados, "fatorId");
  const codigo = texto(dados, "codigo");
  if (!fatorId || !codigoValido(codigo)) return { erro: CODIGO_INVALIDO };

  const supabase = await criarClienteSupabase();
  if (!supabase) redirect(rotaDoPasso("entrar"));

  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: fatorId, code: codigo });
  if (error) return { erro: CODIGO_INVALIDO };

  redirect(rotaDoPasso("inicio"));
}

export async function sair() {
  const supabase = await criarClienteSupabase();
  await supabase?.auth.signOut();
  redirect(rotaDoPasso("entrar"));
}
