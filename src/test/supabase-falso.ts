import { vi } from "vitest";

type Fator = { id: string; status: "verified" | "unverified"; factor_type: "totp" };

export type OpcoesDoFalso = {
  usuario?: { id: string; user_metadata?: Record<string, unknown> } | null;
  ehProdutor?: boolean;
  nivelAtual?: "aal1" | "aal2" | null;
  proximoNivel?: "aal1" | "aal2" | null;
  fatores?: Fator[];
};

// Um cliente da Supabase de mentira, só com o que o login do produtor usa.
export function criarSupabaseFalso(opcoes: OpcoesDoFalso = {}) {
  const {
    usuario = { id: "rafael", user_metadata: { senha_criada: true } },
    ehProdutor = true,
    nivelAtual = "aal1",
    proximoNivel = "aal2",
    fatores = [{ id: "fator-totp", status: "verified", factor_type: "totp" }],
  } = opcoes;

  const maybeSingle = vi.fn(async () => ({
    data: ehProdutor && usuario ? { user_id: usuario.id } : null,
    error: null,
  }));

  return {
    from: vi.fn(() => ({
      select: vi.fn(() => ({ eq: vi.fn(() => ({ maybeSingle })) })),
    })),
    auth: {
      getUser: vi.fn(async () => ({ data: { user: usuario }, error: null })),
      signInWithPassword: vi.fn(async () => ({ data: {}, error: null })),
      signOut: vi.fn(async () => ({ error: null })),
      updateUser: vi.fn(async () => ({ data: {}, error: null })),
      verifyOtp: vi.fn(async () => ({ data: {}, error: null })),
      mfa: {
        getAuthenticatorAssuranceLevel: vi.fn(async () => ({
          data: { currentLevel: nivelAtual, nextLevel: proximoNivel },
          error: null,
        })),
        listFactors: vi.fn(async () => ({
          data: { all: fatores, totp: fatores.filter((f) => f.status === "verified") },
          error: null,
        })),
        challengeAndVerify: vi.fn(async () => ({ data: {}, error: null })),
        enroll: vi.fn(async () => ({
          data: {
            id: "fator-novo",
            totp: {
              qr_code: "data:image/svg+xml;utf-8,<svg/>",
              secret: "SEGREDO123",
              uri: "otpauth://x",
            },
          },
          error: null,
        })),
        unenroll: vi.fn(async () => ({ data: {}, error: null })),
      },
    },
  };
}

export type SupabaseFalso = ReturnType<typeof criarSupabaseFalso>;

// Imita o redirect do Next, que interrompe a função lançando um erro.
export class Redirecionou extends Error {
  constructor(public destino: string) {
    super(`redirect:${destino}`);
  }
}
