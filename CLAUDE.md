@AGENTS.md

# Ember Artesanal

- Language: UI copy, tests, commit messages and PR descriptions in Portuguese (pt-BR).
- Spec-driven: every feature implements a reviewed spec from "Ember Artesanal — Specs do MVP" (https://claude.ai/artifact/WMnm4frTFVz77Dyau5kJgz). Name tests after the spec and acceptance criterion they cover, e.g. `describe("P3 · Cadastrar velas")` / `it("CA1 · ...")`.
- TDD: write the failing test first. Unit tests live next to the code (`*.test.ts(x)`), E2E tests in `e2e/` run on a mobile viewport.
- Keep the cliente and produtor areas separate.
- All data is fictional. External services (Mercado Pago, Melhor Envio, NF-e, WhatsApp) run in sandbox or simulated mode; never commit keys.
- Before pushing: `npm run lint && npm run format:check && npm run typecheck && npm run test:coverage && npm run build`.
