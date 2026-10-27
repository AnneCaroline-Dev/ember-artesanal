# Ember Artesanal

App de um ateliê de velas artesanais de cera de soja, com duas visões separadas: a da cliente (Mariana), que compra pelo celular, e a do produtor (Rafael), que cuida dos pedidos, da cura e do envio.

Case de portfólio de Anne Caroline. **Todos os dados são fictícios.** Pagamento, frete, nota fiscal e WhatsApp rodam em modo de teste.

## Como o projeto é feito

- **SDD (desenvolvimento guiado por spec):** nada é programado sem uma spec revisada. As specs ficam em [Specs do MVP](https://claude.ai/artifact/WMnm4frTFVz77Dyau5kJgz).
- **TDD:** cada critério de aceite vira um teste antes do código.
- **Quality Gate:** o SonarCloud barra o PR se o código novo tiver menos de 80% de cobertura, bugs ou vulnerabilidades novas.
- **CI/CD:** todo PR roda lint, tipos, testes unitários, build e testes E2E no GitHub Actions, e ganha um link de prévia na Vercel.

## Tecnologias

Next.js (App Router, PWA) · TypeScript · Tailwind CSS · Supabase · Vitest + Testing Library · Playwright · Vercel

## Rodando no computador

Precisa do Node.js 22 ou mais novo.

```bash
npm install
npm run dev          # abre em http://localhost:3000
npm run test:run     # testes unitários
npm run test:e2e     # testes E2E (precisa de npm run build antes)
```
