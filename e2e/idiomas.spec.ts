import { expect, test } from "@playwright/test";

test.describe("G2 · Português e inglês · celular em inglês", () => {
  test.use({ locale: "en-US" });

  test("CA1 · na primeira visita, o app abre em inglês", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ember Artesanal");
    await expect(page.getByText("Shop under construction")).toBeVisible();
  });

  test("CA3 · a área do produtor também aparece em inglês, inclusive o título da aba", async ({
    page,
  }) => {
    await page.goto("/produtor");
    await expect(page).toHaveURL(/\/en\/produtor\/entrar$/);
    await expect(page).toHaveTitle("Sign in · Ember Artesanal");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Workshop access");
    await expect(page.getByRole("button", { name: "Show password" })).toBeVisible();
  });
});

test.describe("G2 · Português e inglês · botão PT | EN", () => {
  test("CA2 · troca na hora, mantém o e-mail digitado e lembra a escolha", async ({ page }) => {
    await page.goto("/produtor/entrar");
    await expect(page).toHaveURL(/\/pt\/produtor\/entrar$/);
    await page.getByLabel("E-mail").fill("rafael@example.com");
    await page.getByLabel("Senha", { exact: true }).fill("segredo123");

    await page.getByRole("link", { name: "English" }).click();

    await expect(page).toHaveURL(/\/en\/produtor\/entrar$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Workshop access");
    await expect(page.getByLabel("Email")).toHaveValue("rafael@example.com");
    // A senha nunca é guardada fora do campo.
    await expect(page.getByLabel("Password", { exact: true })).toHaveValue("");

    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
  });
});
