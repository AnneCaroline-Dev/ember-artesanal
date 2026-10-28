import { expect, test } from "@playwright/test";

test.describe("P1 · Entrar com segurança", () => {
  test("RF01 · sem login, o Início do produtor leva para a tela Entrar", async ({ page }) => {
    await page.goto("/produtor");
    await expect(page).toHaveURL(/\/produtor\/entrar$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Acesso à oficina");
    await expect(page.getByLabel("E-mail")).toBeVisible();
    await expect(page.getByLabel("Senha")).toBeVisible();
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
