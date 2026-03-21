import { describe, it, expect } from "vitest";
import { getShareUrl } from "@/lib/share";

const shareData = {
  url: "https://dingning.ai/blog/test-post",
  title: "测试文章标题",
  excerpt: "这是一段摘要",
};

describe("getShareUrl", () => {
  it("generates correct Twitter share URL", () => {
    const url = getShareUrl("twitter", shareData);
    expect(url).toContain("twitter.com/intent/tweet");
    expect(url).toContain(encodeURIComponent(shareData.url));
    expect(url).toContain(encodeURIComponent(shareData.title));
  });

  it("generates correct Weibo share URL", () => {
    const url = getShareUrl("weibo", shareData);
    expect(url).toContain("weibo.com/share");
    expect(url).toContain(encodeURIComponent(shareData.url));
    expect(url).toContain(encodeURIComponent(shareData.title));
  });

  it("generates correct LinkedIn share URL", () => {
    const url = getShareUrl("linkedin", shareData);
    expect(url).toContain("linkedin.com/sharing");
    expect(url).toContain(encodeURIComponent(shareData.url));
  });
});
