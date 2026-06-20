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

  it("renders WeChat contact as text, not a dead anchor", () => {
    render(<ConnectSection />);
    // 微信现以 "微信：<id>" 文本 + 复制按钮渲染（WeChatCopyButton），不再是公众号链接
    const wechat = screen.getByText(/微信：dingningdocai/);
    expect(wechat).toBeInTheDocument();
    // 不应是死链 <a href="#">
    expect(wechat.closest("a")).toBeNull();
  });
});
