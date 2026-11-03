@AGENTS.md

# Ember Artesanal

## Process

- Language: UI copy, tests, commit messages and PR descriptions in Portuguese (pt-BR).
- Spec-driven: every feature implements a reviewed spec from "Ember Artesanal — Specs do MVP" (https://claude.ai/artifact/WMnm4frTFVz77Dyau5kJgz). Name tests after the spec and acceptance criterion they cover, e.g. `describe("P3 · Cadastrar velas")` / `it("CA1 · ...")`.
- TDD: write the failing test first. Unit tests live next to the code (`*.test.ts(x)`), E2E tests in `e2e/` run on a mobile viewport.
- Before pushing: `npm run lint && npm run format:check && npm run typecheck && npm run test:coverage && npm run build`.

## Product rules

- Keep the cliente and produtor areas separate.
- All data is fictional. External services (Mercado Pago, Melhor Envio, NF-e, WhatsApp) run in sandbox or simulated mode; never commit keys.
- Mobile first, but every screen must also work on desktop.
- Every user-facing text comes from the dictionaries in `src/lib/idioma/` (pt and en). The brand "Ember Artesanal" is never translated.
- Colors come from the theme tokens in `src/app/globals.css` (with G1 they will mirror the Figma `mapped` variables). Never hardcode a hex value in a new component.
- Prices are always in R$. Store money as integer cents. Show dates in the America/Sao_Paulo time zone with `formatarData`.
- Accessibility: WCAG 2.2 AA. Every field has a label, contrast is at least 4.5:1 for text, touch targets are at least 44px, and everything works with the keyboard.

## Coding practices

- TypeScript strict: no `any`; prefer type guards (like `ehIdioma`) to `as`.
- Names: descriptive and in Portuguese, matching the spec vocabulary (`pedido`, `vela`, `lote`). No abbreviations.
- Encapsulate volatility: each external service sits behind one module in `src/lib/` with a simulated version. Screens never call a provider directly.
- Modularity and separation of concerns:
  - Business rules are pure functions in `src/lib/` (easy to test).
  - Server Components and Server Actions fetch and save.
  - Client Components only handle interaction.
- Never trust the browser. Server Actions and Route Handlers validate every input and check the logged-in user's step again. Supabase tables use RLS.
- Favor idempotency: payment and shipping webhooks and Server Actions can run twice without charging, shipping or saving twice.
- Avoid mutations; prefer composition over inheritance (React components and plain functions, no classes).
- DRY with care: extract shared code on the third repetition, not the second.
- Small functions with clear names. When a comment would explain _what_ the code does, extract a named function or constant instead.
- Comments only explain _why_ or point to the spec (e.g. `// G2 · CA2: ...`). Exported functions in `src/lib/` may have a one-line JSDoc.
- Suggest a design pattern only when it solves a real problem in the current spec.
