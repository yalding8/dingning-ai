import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

import { AboutBrief } from "@/components/sections/AboutBrief";

describe("AboutBrief (A-03 dedup)", () => {
  it("does NOT contain raw business numbers that belong on About page", () => {
    render(<AboutBrief />);
    const html = document.body.innerHTML;
    // These specific numbers should only appear on About page, not homepage
    expect(html).not.toContain("40 万");
    expect(html).not.toContain("75 亿");
    expect(html).not.toContain("27 个国家");
    expect(html).not.toContain("18 万");
  });

  it("focuses on positioning and mission", () => {
    render(<AboutBrief />);
    expect(screen.getByText(/AI 提升工作效率/)).toBeInTheDocument();
  });

  it("links to about page", () => {
    render(<AboutBrief />);
    const link = screen.getByText("了解完整经历");
    expect(link.closest("a")).toHaveAttribute("href", "/about");
  });
});
