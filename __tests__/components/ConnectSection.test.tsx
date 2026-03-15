import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConnectSection } from "@/components/sections/ConnectSection";

describe("ConnectSection", () => {
  it("renders updated tagline without '不卖课'", () => {
    render(<ConnectSection />);
    expect(screen.getByText("不群发、不灌水、只分享真实实践")).toBeInTheDocument();
  });

  it("renders section heading", () => {
    render(<ConnectSection />);
    expect(screen.getByText("每两周，一封来自 AI 实验场的信")).toBeInTheDocument();
  });

  it("WeChat link is not an anchor with href='#'", () => {
    render(<ConnectSection />);
    const wechat = screen.getByText("微信公众号");
    // Should be a span, not an anchor with href="#"
    const parent = wechat.closest("span, a");
    if (parent?.tagName === "A") {
      expect(parent.getAttribute("href")).not.toBe("#");
    }
  });
});
