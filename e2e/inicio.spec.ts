import { expect, test } from "@playwright/test";

test("a página inicial abre no celular com o nome do ateliê", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Ember Artesanal");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ember Artesanal");
  await expect(page.getByText("Loja em construção")).toBeVisible();
});

test("o app tem um manifesto para ser usado como PWA", async ({ request }) => {
  const resposta = await request.get("/manifest.webmanifest");
  expect(resposta.ok()).toBe(true);
  const manifesto = await resposta.json();
  expect(manifesto.name).toBe("Ember Artesanal");
});
