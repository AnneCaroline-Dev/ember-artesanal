"use client";

import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { restaurarCampos } from "@/lib/idioma/campos-guardados";
import type { CodigoDeErro, TextosDosFormularios } from "@/lib/idioma/dicionarios";
import { separarIdioma } from "@/lib/idioma/idiomas";
import type { EstadoDoFormulario } from "../acoes";

type Acao = (anterior: EstadoDoFormulario, dados: FormData) => Promise<EstadoDoFormulario>;
type Textos = { textos: TextosDosFormularios };

// G2 · CA2: depois de trocar o idioma, devolve o que já estava digitado nesta tela.
function Formulario({ acao, children }: { acao: (dados: FormData) => void; children: ReactNode }) {
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const caminho = window.location.pathname;
    if (ref.current) restaurarCampos(ref.current, separarIdioma(caminho)?.resto ?? caminho);
  }, []);
  return (
    <form ref={ref} action={acao} className="flex flex-col gap-5">
      {children}
    </form>
  );
}

const estiloDoCampo =
  "h-12 w-full rounded-xl border border-borda bg-campo px-4 text-base text-stone-900 outline-none focus:border-primario focus:ring-2 focus:ring-primario/30";

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
      <input id={nome} name={nome} required className={estiloDoCampo} {...props} />
    </div>
  );
}

// Campo de senha com o "olhinho" para conferir o que foi digitado.
function CampoSenha({
  rotulo,
  nome,
  textos,
  ...props
}: { rotulo: string; nome: string } & Textos & React.InputHTMLAttributes<HTMLInputElement>) {
  const [visivel, setVisivel] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={nome} className="text-sm font-medium text-stone-800">
        {rotulo}
      </label>
      <div className="relative">
        <input
          id={nome}
          name={nome}
          required
          type={visivel ? "text" : "password"}
          className={`${estiloDoCampo} pr-12`}
          {...props}
        />
        <button
          type="button"
          aria-label={visivel ? textos.esconderSenha : textos.mostrarSenha}
          aria-controls={nome}
          onClick={() => setVisivel(!visivel)}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-marrom hover:text-primario-escuro focus-visible:outline-2 focus-visible:outline-primario"
        >
          <svg
            aria-hidden
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
            {visivel ? null : <path d="M4 4l16 16" />}
          </svg>
        </button>
      </div>
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

function Erro({ codigo, textos }: { codigo?: CodigoDeErro } & Textos) {
  if (!codigo) return null;
  return (
    <p role="alert" className="rounded-lg bg-erro/10 px-3 py-2 text-sm text-erro">
      {textos.erros[codigo]}
    </p>
  );
}

function CampoCodigo({ textos }: Textos) {
  return (
    <Campo
      rotulo={textos.codigo}
      nome="codigo"
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="[0-9]{6}"
      maxLength={6}
      placeholder="000000"
    />
  );
}

export function FormularioEntrar({
  acao,
  textos,
  erroInicial,
}: { acao: Acao; erroInicial?: CodigoDeErro } & Textos) {
  const [estado, enviar, pendente] = useActionState(acao, null);
  return (
    <Formulario acao={enviar}>
      <Campo rotulo={textos.email} nome="email" type="email" autoComplete="email" />
      <CampoSenha
        rotulo={textos.senha}
        nome="senha"
        autoComplete="current-password"
        textos={textos}
      />
      <Erro codigo={estado?.erro ?? erroInicial} textos={textos} />
      <Botao pendente={pendente}>{textos.entrar}</Botao>
    </Formulario>
  );
}

export function FormularioCodigo({ acao, textos }: { acao: Acao } & Textos) {
  const [estado, enviar, pendente] = useActionState(acao, null);
  return (
    <Formulario acao={enviar}>
      <CampoCodigo textos={textos} />
      <Erro codigo={estado?.erro} textos={textos} />
      <Botao pendente={pendente}>{textos.confirmar}</Botao>
    </Formulario>
  );
}

export function FormularioCriarSenha({ acao, textos }: { acao: Acao } & Textos) {
  const [estado, enviar, pendente] = useActionState(acao, null);
  return (
    <Formulario acao={enviar}>
      <CampoSenha
        rotulo={textos.novaSenha}
        nome="senha"
        autoComplete="new-password"
        minLength={8}
        textos={textos}
      />
      <CampoSenha
        rotulo={textos.repitaSenha}
        nome="confirmacao"
        autoComplete="new-password"
        minLength={8}
        textos={textos}
      />
      <p className="text-sm text-marrom">{textos.dicaSenha}</p>
      <Erro codigo={estado?.erro} textos={textos} />
      <Botao pendente={pendente}>{textos.criarSenha}</Botao>
    </Formulario>
  );
}

export function FormularioAtivarAutenticador({
  acao,
  textos,
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
} & Textos) {
  const [estado, enviar, pendente] = useActionState(acao, null);
  return (
    <Formulario acao={enviar}>
      <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-marrom">
        <li>{textos.passo1}</li>
        <li>{textos.passo2}</li>
        <li>{textos.passo3}</li>
      </ol>
      <a
        href={uri}
        className="flex h-12 items-center justify-center rounded-xl border border-primario font-semibold text-primario-escuro"
      >
        {textos.abrirNoApp}
      </a>
      {/* O QR code vem da Supabase como SVG em data URL; não passa pelo otimizador de imagens. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qrCode} alt={textos.qrCode} className="mx-auto size-44 rounded-xl bg-white p-2" />
      <p className="text-center text-sm text-marrom">
        {textos.ouDigiteAChave}
        <br />
        <code className="font-mono text-base break-all text-stone-900">{chave}</code>
      </p>
      <input type="hidden" name="fatorId" value={fatorId} />
      <CampoCodigo textos={textos} />
      <Erro codigo={estado?.erro} textos={textos} />
      <Botao pendente={pendente}>{textos.ativarEEntrar}</Botao>
    </Formulario>
  );
}
