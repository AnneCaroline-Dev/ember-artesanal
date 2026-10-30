"use client";

import { useActionState, type ReactNode } from "react";
import type { EstadoDoFormulario } from "../acoes";

type Acao = (anterior: EstadoDoFormulario, dados: FormData) => Promise<EstadoDoFormulario>;

function Campo({
  rotulo,
  nome,
  ...props
}: { rotulo: string; nome: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={nome} className="text-sm font-medium text-stone-800">
        {rotulo}
      </label>
      <input
        id={nome}
        name={nome}
        required
        className="h-12 rounded-xl border border-borda bg-campo px-4 text-base text-stone-900 outline-none focus:border-primario focus:ring-2 focus:ring-primario/30"
        {...props}
      />
    </div>
  );
}

function Botao({ children, pendente }: { children: ReactNode; pendente: boolean }) {
  return (
    <button
      type="submit"
      disabled={pendente}
      className="h-12 rounded-xl bg-primario text-lg font-bold text-white shadow-md shadow-primario/30 transition hover:bg-primario-escuro disabled:opacity-60"
    >
      {children}
    </button>
  );
}

function Erro({ mensagem }: { mensagem?: string }) {
  if (!mensagem) return null;
  return (
    <p role="alert" className="rounded-lg bg-erro/10 px-3 py-2 text-sm text-erro">
      {mensagem}
    </p>
  );
}

function CampoCodigo() {
  return (
    <Campo
      rotulo="Código de 6 números"
      nome="codigo"
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="[0-9]{6}"
      maxLength={6}
      placeholder="000000"
    />
  );
}

export function FormularioEntrar({ acao, erroInicial }: { acao: Acao; erroInicial?: string }) {
  const [estado, enviar, pendente] = useActionState(acao, null);
  return (
    <form action={enviar} className="flex flex-col gap-5">
      <Campo rotulo="E-mail" nome="email" type="email" autoComplete="email" />
      <Campo rotulo="Senha" nome="senha" type="password" autoComplete="current-password" />
      <Erro mensagem={estado?.erro ?? erroInicial} />
      <Botao pendente={pendente}>Entrar</Botao>
    </form>
  );
}

export function FormularioCodigo({ acao }: { acao: Acao }) {
  const [estado, enviar, pendente] = useActionState(acao, null);
  return (
    <form action={enviar} className="flex flex-col gap-5">
      <CampoCodigo />
      <Erro mensagem={estado?.erro} />
      <Botao pendente={pendente}>Confirmar</Botao>
    </form>
  );
}

export function FormularioCriarSenha({ acao }: { acao: Acao }) {
  const [estado, enviar, pendente] = useActionState(acao, null);
  return (
    <form action={enviar} className="flex flex-col gap-5">
      <Campo
        rotulo="Nova senha"
        nome="senha"
        type="password"
        autoComplete="new-password"
        minLength={8}
      />
      <Campo
        rotulo="Repita a senha"
        nome="confirmacao"
        type="password"
        autoComplete="new-password"
        minLength={8}
      />
      <p className="text-sm text-marrom">Use pelo menos 8 caracteres.</p>
      <Erro mensagem={estado?.erro} />
      <Botao pendente={pendente}>Criar senha</Botao>
    </form>
  );
}

export function FormularioAtivarAutenticador({
  acao,
  fatorId,
  qrCode,
  chave,
  uri,
}: {
  acao: Acao;
  fatorId: string;
  qrCode: string;
  chave: string;
  uri: string;
}) {
  const [estado, enviar, pendente] = useActionState(acao, null);
  return (
    <form action={enviar} className="flex flex-col gap-5">
      <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-marrom">
        <li>Instale um app autenticador, como Google Authenticator ou Microsoft Authenticator.</li>
        <li>
          No celular, toque em &quot;Abrir no app autenticador&quot;. Em outro aparelho, escaneie o
          QR code.
        </li>
        <li>Digite abaixo o código de 6 números que aparece no app.</li>
      </ol>
      <a
        href={uri}
        className="flex h-12 items-center justify-center rounded-xl border border-primario font-semibold text-primario-escuro"
      >
        Abrir no app autenticador
      </a>
      {/* O QR code vem da Supabase como SVG em data URL; não passa pelo otimizador de imagens. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={qrCode}
        alt="QR code para cadastrar o Ember Artesanal no app autenticador"
        className="mx-auto size-44 rounded-xl bg-white p-2"
      />
      <p className="text-center text-sm text-marrom">
        Ou digite esta chave no app:
        <br />
        <code className="font-mono text-base break-all text-stone-900">{chave}</code>
      </p>
      <input type="hidden" name="fatorId" value={fatorId} />
      <CampoCodigo />
      <Erro mensagem={estado?.erro} />
      <Botao pendente={pendente}>Ativar e entrar</Botao>
    </form>
  );
}
