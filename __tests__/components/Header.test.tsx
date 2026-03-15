import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/blog",
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

import { Header } from "@/components/layout/Header";

describe("Header", () => {
  it("renders the brand name", () => {
    render(<Header />);
    expect(screen.getByText("Ning Ding")).toBeInTheDocument();
  });

  it("renders all navigation items", () => {
    render(<Header />);
    expect(screen.getAllByText("博客").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("服务").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("项目").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("资源").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("关于").length).toBeGreaterThanOrEqual(1);
  });

  it("renders CTA contact button", () => {
    render(<Header />);
    expect(screen.getByText("联系我")).toBeInTheDocument();
  });

  it("highlights the active nav item (blog)", () => {
    render(<Header />);
    // Desktop nav links for "博客" should have accent color class
    const blogLinks = screen.getAllByText("博客");
    const desktopBlogLink = blogLinks[0];
    expect(desktopBlogLink.className).toContain("text-[var(--accent)]");
    expect(desktopBlogLink.className).toContain("font-medium");
  });

  it("non-active nav items do not have active styling", () => {
    render(<Header />);
    const serviceLinks = screen.getAllByText("服务");
    const desktopServiceLink = serviceLinks[0];
    expect(desktopServiceLink.className).toContain("text-[var(--text-secondary)]");
    expect(desktopServiceLink.className).not.toContain("font-medium");
  });
});
