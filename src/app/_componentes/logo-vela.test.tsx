import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LogoVela } from "./logo-vela";

describe("Símbolo da vela", () => {
  it("usa o desenho do Figma como imagem decorativa", () => {
    const { container } = render(<LogoVela />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "/logo-vela.svg");
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("width", "40");
    expect(img).toHaveAttribute("height", "42");
  });
});
