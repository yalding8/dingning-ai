import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Color System (C-01)", () => {
  const cssContent = fs.readFileSync(
    path.join(process.cwd(), "app/globals.css"),
    "utf-8"
  );
  const tailwindConfig = fs.readFileSync(
    path.join(process.cwd(), "tailwind.config.ts"),
    "utf-8"
  );

  it("defines CTA color variables in globals.css", () => {
    expect(cssContent).toContain("--cta:");
    expect(cssContent).toContain("--cta-light:");
  });

  it("CTA color is different from accent color", () => {
    const accentMatch = cssContent.match(/--accent:\s*(#[0-9A-Fa-f]+)/);
    const ctaMatch = cssContent.match(/--cta:\s*(#[0-9A-Fa-f]+)/);
    expect(accentMatch).not.toBeNull();
    expect(ctaMatch).not.toBeNull();
    expect(accentMatch![1]).not.toBe(ctaMatch![1]);
  });

  it("tailwind config includes cta color mapping", () => {
    expect(tailwindConfig).toContain("cta:");
    expect(tailwindConfig).toContain("var(--cta)");
    expect(tailwindConfig).toContain("var(--cta-light)");
  });

  it("Newsletter button uses CTA color, not accent", () => {
    const formContent = fs.readFileSync(
      path.join(process.cwd(), "components/ui/NewsletterForm.tsx"),
      "utf-8"
    );
    expect(formContent).toContain("--cta");
    expect(formContent).not.toMatch(/bg-\[var\(--accent\)\]/);
  });

  it("Header CTA button uses CTA color, not accent", () => {
    const headerContent = fs.readFileSync(
      path.join(process.cwd(), "components/layout/Header.tsx"),
      "utf-8"
    );
    // The "联系我" button should use CTA color
    expect(headerContent).toContain("--cta");
  });

  it("Blog tag filters still use accent color (informational)", () => {
    const blogListContent = fs.readFileSync(
      path.join(process.cwd(), "components/ui/BlogList.tsx"),
      "utf-8"
    );
    expect(blogListContent).toContain("--accent");
    expect(blogListContent).not.toContain("--cta");
  });
});
