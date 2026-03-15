import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

import { Footer } from "@/components/layout/Footer";

describe("Footer", () => {
  it("renders brand name and tagline", () => {
    render(<Footer />);
    expect(screen.getByText("Ning Ding")).toBeInTheDocument();
    expect(screen.getByText("用 AI 重塑国际教育产业链")).toBeInTheDocument();
  });

  it("renders navigation section with all site links", () => {
    render(<Footer />);
    expect(screen.getByText("导航")).toBeInTheDocument();
    expect(screen.getByText("博客")).toBeInTheDocument();
    expect(screen.getByText("服务")).toBeInTheDocument();
    expect(screen.getByText("项目")).toBeInTheDocument();
    expect(screen.getByText("资源")).toBeInTheDocument();
    expect(screen.getByText("关于")).toBeInTheDocument();
  });

  it("renders contact section with email", () => {
    render(<Footer />);
    expect(screen.getByText("联系")).toBeInTheDocument();
    expect(screen.getByText("ceo@dingning.ai")).toBeInTheDocument();
  });

  it("renders copyright with current year", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });
});
