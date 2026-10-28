import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/test/**",
        "src/app/layout.tsx",
        // Páginas da área do produtor só montam a moldura e o <Suspense>; o E2E cobre essas telas.
        "src/app/produtor/**/page.tsx",
      ],
      // Mesmo piso do Quality Gate: 80% de cobertura.
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
});
