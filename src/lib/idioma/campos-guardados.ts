// G2 · CA2: trocar de idioma recarrega a página. Antes disso guardamos o que já foi
// digitado (menos senhas) e, na mesma tela do outro idioma, devolvemos aos campos.

const CHAVE = "ember:campos-guardados";
const TIPOS_IGNORADOS = new Set(["password", "hidden", "submit", "button", "file"]);

type Guardado = { caminho: string; campos: Record<string, string> };
type Campo = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

// Só campos dentro de formulários. O seletor vale também quando a raiz já é o formulário.
function camposDe(raiz: ParentNode): Campo[] {
  return Array.from(
    raiz.querySelectorAll<Campo>("form input[name], form textarea[name], form select[name]"),
  ).filter((campo) => !TIPOS_IGNORADOS.has(campo.type));
}

export function guardarCampos(caminho: string, raiz: ParentNode = document) {
  const campos: Record<string, string> = {};
  for (const campo of camposDe(raiz)) if (campo.value) campos[campo.name] = campo.value;
  if (Object.keys(campos).length === 0) return;
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify({ caminho, campos } satisfies Guardado));
  } catch {
    // Sem armazenamento (aba anônima, por exemplo): troca de idioma do mesmo jeito.
  }
}

function lerGuardado(): Guardado | null {
  try {
    const texto = sessionStorage.getItem(CHAVE);
    return texto ? (JSON.parse(texto) as Guardado) : null;
  } catch {
    return null;
  }
}

export function restaurarCampos(formulario: HTMLFormElement, caminho: string) {
  const guardado = lerGuardado();
  if (!guardado || guardado.caminho !== caminho) return;
  for (const campo of camposDe(formulario)) {
    const valor = guardado.campos[campo.name];
    if (valor !== undefined) campo.value = valor;
  }
  sessionStorage.removeItem(CHAVE);
}
