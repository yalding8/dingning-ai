import { describe, it, expect } from "vitest";
import config from "@/tailwind.config";

describe("font configuration", () => {
  it("font-family stack includes Inter, Noto Sans SC, and system fallbacks in correct order", () => {
    const sans = config.theme?.extend?.fontFamily?.sans as string[];
    expect(sans).toBeDefined();

    const interIndex = sans.findIndex((f) => f === "var(--font-inter)");
    const notoIndex = sans.findIndex((f) => f === "var(--font-noto-sans-sc)");

    expect(interIndex).toBeGreaterThanOrEqual(0);
    expect(notoIndex).toBeGreaterThan(interIndex);
    expect(sans).toContain("sans-serif");
  });
});
