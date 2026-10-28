import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// "server-only" bloqueia o import fora do servidor; nos testes, todo módulo roda no Node.
vi.mock("server-only", () => ({}));
