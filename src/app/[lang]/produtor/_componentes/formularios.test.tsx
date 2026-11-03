import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { dicionario } from "@/lib/idioma/dicionarios";
import {
  FormularioAtivarAutenticador,
  FormularioCodigo,
  FormularioCriarSenha,
  FormularioEntrar,
} from "./formularios";

const pt = dicionario("pt").produtor.formularios;
const en = dicionario("en").produtor.formularios;
const comErro = (erro: keyof typeof pt.erros) => vi.fn(async () => ({ erro }));

describe("P1 · Entrar com segurança · tela Entrar", () => {
  it("CA2 · pede e-mail e senha e envia para a ação", async () => {
    const acao = vi.fn<(anterior: unknown, dados: FormData) => Promise<null>>(async () => null);
    render(<FormularioEntrar textos={pt} acao={acao} />);

    await userEvent.type(screen.getByLabelText("E-mail"), "rafael@ember.test");
    await userEvent.type(screen.getByLabelText("Senha", { exact: true }), "segredo123");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(acao).toHaveBeenCalledOnce();
    const dados = acao.mock.calls[0][1] as FormData;
    expect(dados.get("email")).toBe("rafael@ember.test");
    expect(dados.get("senha")).toBe("segredo123");
  });

  it("mostra o erro que a ação devolveu", async () => {
    render(<FormularioEntrar textos={pt} acao={comErro("credenciais")} />);
    await userEvent.type(screen.getByLabelText("E-mail"), "rafael@ember.test");
    await userEvent.type(screen.getByLabelText("Senha", { exact: true }), "errada");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("E-mail ou senha incorretos.");
  });

  it("mostra o aviso de link vencido que veio pela URL", () => {
    render(<FormularioEntrar textos={pt} acao={vi.fn()} erroInicial="link" />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Este link expirou ou já foi usado. Peça um novo convite.",
    );
  });
});

describe("P1 · Entrar com segurança · tela do código", () => {
  it("CA2 · o campo aceita o código de 6 números do autenticador", () => {
    render(<FormularioCodigo textos={pt} acao={vi.fn()} />);
    const campo = screen.getByLabelText("Código de 6 números");
    expect(campo).toHaveAttribute("inputmode", "numeric");
    expect(campo).toHaveAttribute("autocomplete", "one-time-code");
    expect(campo).toHaveAttribute("maxlength", "6");
  });

  it("CA3 · com o código errado, mostra o aviso e continua na mesma tela", async () => {
    render(<FormularioCodigo textos={pt} acao={comErro("codigo")} />);
    await userEvent.type(screen.getByLabelText("Código de 6 números"), "000000");
    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Código inválido. Confira o app autenticador",
    );
    expect(screen.getByLabelText("Código de 6 números")).toBeInTheDocument();
  });
});

describe("P1 · Entrar com segurança · primeiro acesso", () => {
  it("CA1 · pede a senha duas vezes", async () => {
    const acao = vi.fn<(anterior: unknown, dados: FormData) => Promise<null>>(async () => null);
    render(<FormularioCriarSenha textos={pt} acao={acao} />);
    await userEvent.type(screen.getByLabelText("Nova senha"), "velas-de-soja");
    await userEvent.type(screen.getByLabelText("Repita a senha"), "velas-de-soja");
    await userEvent.click(screen.getByRole("button", { name: "Criar senha" }));
    const dados = acao.mock.calls[0][1] as FormData;
    expect(dados.get("senha")).toBe("velas-de-soja");
    expect(dados.get("confirmacao")).toBe("velas-de-soja");
  });

  it("CA1 · mostra o QR code, a chave e um atalho para o app autenticador no celular", () => {
    render(
      <FormularioAtivarAutenticador
        textos={pt}
        acao={vi.fn()}
        fatorId="fator-novo"
        qrCode="data:image/svg+xml;utf-8,<svg/>"
        chave="SEGREDO123"
        uri="otpauth://totp/Ember"
      />,
    );
    expect(screen.getByRole("img", { name: /QR code/ })).toBeInTheDocument();
    expect(screen.getByText("SEGREDO123")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Abrir no app autenticador" })).toHaveAttribute(
      "href",
      "otpauth://totp/Ember",
    );
  });

  it("CA1 · envia o primeiro código junto com o autenticador que está sendo ativado", async () => {
    const acao = vi.fn<(anterior: unknown, dados: FormData) => Promise<null>>(async () => null);
    render(
      <FormularioAtivarAutenticador
        textos={pt}
        acao={acao}
        fatorId="fator-novo"
        qrCode="data:image/svg+xml;utf-8,<svg/>"
        chave="SEGREDO123"
        uri="otpauth://totp/Ember"
      />,
    );
    await userEvent.type(screen.getByLabelText("Código de 6 números"), "654321");
    await userEvent.click(screen.getByRole("button", { name: "Ativar e entrar" }));
    const dados = acao.mock.calls[0][1] as FormData;
    expect(dados.get("fatorId")).toBe("fator-novo");
    expect(dados.get("codigo")).toBe("654321");
  });
});

describe("P1 · Entrar com segurança · ver a senha digitada", () => {
  it("CA2 · o olhinho mostra e esconde a senha na tela Entrar", async () => {
    render(<FormularioEntrar textos={pt} acao={vi.fn(async () => null)} />);
    const senha = screen.getByLabelText("Senha", { exact: true });
    await userEvent.type(senha, "segredo123");
    expect(senha).toHaveAttribute("type", "password");

    await userEvent.click(screen.getByRole("button", { name: "Mostrar senha" }));
    expect(senha).toHaveAttribute("type", "text");
    expect(senha).toHaveValue("segredo123");

    await userEvent.click(screen.getByRole("button", { name: "Esconder senha" }));
    expect(senha).toHaveAttribute("type", "password");
  });

  it("CA1 · cada campo da tela Crie sua senha tem o seu olhinho", async () => {
    render(<FormularioCriarSenha textos={pt} acao={vi.fn(async () => null)} />);
    const [primeiro, segundo] = screen.getAllByRole("button", { name: "Mostrar senha" });
    await userEvent.click(primeiro);
    expect(screen.getByLabelText("Nova senha")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Repita a senha")).toHaveAttribute("type", "password");
    await userEvent.click(segundo);
    expect(screen.getByLabelText("Repita a senha")).toHaveAttribute("type", "text");
  });
});

describe("G2 · Português e inglês · formulários", () => {
  afterEach(() => {
    sessionStorage.clear();
    window.history.replaceState(null, "", "/");
  });

  it("CA3 · a tela Entrar aparece toda em inglês, inclusive o olhinho", () => {
    render(<FormularioEntrar textos={en} acao={vi.fn()} />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password", { exact: true })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show password" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("CA3 · as mensagens de erro também mudam de idioma", async () => {
    render(<FormularioCodigo textos={en} acao={comErro("codigo")} />);
    await userEvent.type(screen.getByLabelText("6-digit code"), "000000");
    await userEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid code. Check your authenticator app",
    );
  });

  it("CA2 · ao trocar de idioma, o e-mail digitado volta preenchido", () => {
    window.history.replaceState(null, "", "/en/produtor/entrar");
    sessionStorage.setItem(
      "ember:campos-guardados",
      JSON.stringify({ caminho: "/produtor/entrar", campos: { email: "rafael@ember.test" } }),
    );
    render(<FormularioEntrar textos={en} acao={vi.fn()} />);
    expect(screen.getByLabelText("Email")).toHaveValue("rafael@ember.test");
  });
});
