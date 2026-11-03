// Todos os textos do app em português. O inglês (en.ts) precisa ter as mesmas chaves.
export const pt = {
  marca: "Ember Artesanal",
  descricao: "Velas artesanais de cera de soja, feitas à mão em Belo Horizonte.",
  idioma: { rotulo: "Idioma" },
  loja: { emConstrucao: "Loja em construção" },
  produtor: {
    carregando: "Carregando…",
    sair: "Sair",
    entrar: {
      aba: "Entrar",
      titulo: "Acesso à oficina",
      subtitulo: "Gerencie sua produção artesanal",
    },
    codigo: {
      aba: "Código",
      titulo: "Confirme que é você",
      subtitulo: "Digite o código de 6 números do seu app autenticador.",
      outraConta: "Entrar com outra conta",
    },
    criarSenha: {
      aba: "Criar senha",
      titulo: "Crie sua senha",
      subtitulo: "Você vai entrar com ela e com um código do celular.",
    },
    ativarAutenticador: {
      aba: "Ativar autenticador",
      titulo: "Ative a segunda confirmação",
      subtitulo: "Assim ninguém entra no ateliê, mesmo que descubra sua senha.",
      erroAoPreparar: "Não foi possível preparar o autenticador. Recarregue a página.",
    },
    convite: {
      aba: "Convite",
      titulo: "Bem-vindo ao ateliê",
      subtitulo: "Estamos abrindo o seu convite",
      abrindo: "Abrindo seu convite…",
    },
    inicio: {
      aba: "Início",
      titulo: "Início",
      saudacao: "Olá, Rafael! O resumo do ateliê está em construção.",
    },
    formularios: {
      email: "E-mail",
      senha: "Senha",
      mostrarSenha: "Mostrar senha",
      esconderSenha: "Esconder senha",
      entrar: "Entrar",
      codigo: "Código de 6 números",
      confirmar: "Confirmar",
      novaSenha: "Nova senha",
      repitaSenha: "Repita a senha",
      dicaSenha: "Use pelo menos 8 caracteres.",
      criarSenha: "Criar senha",
      passo1: "Instale um app autenticador, como Google Authenticator ou Microsoft Authenticator.",
      passo2:
        "No celular, toque em “Abrir no app autenticador”. Em outro aparelho, escaneie o QR code.",
      passo3: "Digite abaixo o código de 6 números que aparece no app.",
      abrirNoApp: "Abrir no app autenticador",
      qrCode: "QR code para cadastrar o Ember Artesanal no app autenticador",
      ouDigiteAChave: "Ou digite esta chave no app:",
      ativarEEntrar: "Ativar e entrar",
      erros: {
        preenchaEmailESenha: "Preencha o e-mail e a senha.",
        indisponivel: "Não foi possível entrar agora. Tente de novo em instantes.",
        credenciais: "E-mail ou senha incorretos.",
        codigo: "Código inválido. Confira o app autenticador",
        senhaCurta: "A senha precisa ter pelo menos 8 caracteres.",
        senhasDiferentes: "As senhas não são iguais.",
        salvarSenha: "Não foi possível salvar a senha. Tente de novo.",
        link: "Este link expirou ou já foi usado. Peça um novo convite.",
      },
    },
  },
};

export type Dicionario = typeof pt;
export type TextosDosFormularios = Dicionario["produtor"]["formularios"];
export type CodigoDeErro = keyof TextosDosFormularios["erros"];
