import { expect, test } from "@playwright/test";

test.describe("P1 · Entrar com segurança", () => {
  test("RF01 · sem login, o Início do produtor leva para a tela Entrar", async ({ page }) => {
    await page.goto("/produtor");
    await expect(page).toHaveURL(/\/produtor\/entrar$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Acesso à oficina");
    await expect(page.getByLabel("E-mail")).toBeVisible();
    await expect(page.getByLabel("Senha", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Mostrar senha" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
  });

  test("RF01 · sem login, a tela do código também leva para a tela Entrar", async ({ page }) => {
    await page.goto("/produtor/entrar/codigo");
    await expect(page).toHaveURL(/\/produtor\/entrar$/);
  });

  test("CA1 · um link de convite inválido avisa na tela Entrar", async ({ page }) => {
    await page.goto("/produtor/confirmar?type=invite");
    await expect(page).toHaveURL(/\/produtor\/entrar\?erro=link$/);
    await expect(page.getByRole("main").getByRole("alert")).toHaveText(
      "Este link expirou ou já foi usado. Peça um novo convite.",
    );
  });
});

test.describe("P1 · Entrar com segurança · e-mail padrão da Supabase", () => {
  test("CA1 · o convite que chega na página inicial vai para a área do produtor", async ({
    page,
  }) => {
    await page.goto("/#access_token=falso&refresh_token=falso&type=invite");
    await expect(page).toHaveURL(/\/produtor\/entrar\?erro=link$/);
    await expect(page.getByRole("main").getByRole("alert")).toHaveText(
      "Este link expirou ou já foi usado. Peça um novo convite.",
    );
  });

  test("CA1 · um convite vencido avisa na tela Entrar", async ({ page }) => {
    await page.goto("/#error=access_denied&error_code=otp_expired");
    await expect(page).toHaveURL(/\/produtor\/entrar\?erro=link$/);
  });
});
