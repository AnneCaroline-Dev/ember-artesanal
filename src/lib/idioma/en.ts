import type { Dicionario } from "./pt";

export const en: Dicionario = {
  marca: "Ember Artesanal",
  descricao: "Handmade soy wax candles, crafted in Belo Horizonte, Brazil.",
  idioma: { rotulo: "Language" },
  loja: { emConstrucao: "Shop under construction" },
  produtor: {
    carregando: "Loading…",
    sair: "Sign out",
    entrar: {
      aba: "Sign in",
      titulo: "Workshop access",
      subtitulo: "Manage your handmade production",
    },
    codigo: {
      aba: "Code",
      titulo: "Confirm it’s you",
      subtitulo: "Enter the 6-digit code from your authenticator app.",
      outraConta: "Sign in with another account",
    },
    criarSenha: {
      aba: "Create password",
      titulo: "Create your password",
      subtitulo: "You’ll sign in with it and a code from your phone.",
    },
    ativarAutenticador: {
      aba: "Set up authenticator",
      titulo: "Turn on two-step verification",
      subtitulo: "This way no one can get into the workshop, even if they find out your password.",
      erroAoPreparar: "We couldn’t set up the authenticator. Please reload the page.",
    },
    convite: {
      aba: "Invitation",
      titulo: "Welcome to the workshop",
      subtitulo: "We’re opening your invitation",
      abrindo: "Opening your invitation…",
    },
    inicio: {
      aba: "Home",
      titulo: "Home",
      saudacao: "Hi, Rafael! The workshop summary is under construction.",
    },
    formularios: {
      email: "Email",
      senha: "Password",
      mostrarSenha: "Show password",
      esconderSenha: "Hide password",
      entrar: "Sign in",
      codigo: "6-digit code",
      confirmar: "Confirm",
      novaSenha: "New password",
      repitaSenha: "Repeat password",
      dicaSenha: "Use at least 8 characters.",
      criarSenha: "Create password",
      passo1:
        "Install an authenticator app, such as Google Authenticator or Microsoft Authenticator.",
      passo2:
        "On your phone, tap “Open in authenticator app”. On another device, scan the QR code.",
      passo3: "Enter the 6-digit code shown in the app below.",
      abrirNoApp: "Open in authenticator app",
      qrCode: "QR code to add Ember Artesanal to your authenticator app",
      ouDigiteAChave: "Or enter this key in the app:",
      ativarEEntrar: "Turn on and sign in",
      erros: {
        preenchaEmailESenha: "Enter your email and password.",
        indisponivel: "We couldn’t sign you in right now. Please try again in a moment.",
        credenciais: "Incorrect email or password.",
        codigo: "Invalid code. Check your authenticator app",
        senhaCurta: "Your password must have at least 8 characters.",
        senhasDiferentes: "The passwords don’t match.",
        salvarSenha: "We couldn’t save your password. Please try again.",
        link: "This link has expired or was already used. Ask for a new invitation.",
      },
    },
  },
};
