import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ShareMenu } from "@/components/ui/ShareMenu";

const props = {
  url: "https://dingning.ai/blog/test",
  title: "测试标题",
  excerpt: "测试摘要",
};

describe("ShareMenu", () => {
  it("renders share button that opens menu with all platforms", () => {
    render(<ShareMenu {...props} />);
    const trigger = screen.getByRole("button", { name: /分享/ });
    fireEvent.click(trigger);

    expect(screen.getByText("Twitter")).toBeInTheDocument();
    expect(screen.getByText("微博")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("微信")).toBeInTheDocument();
    expect(screen.getByText("小红书")).toBeInTheDocument();
    expect(screen.getByText("复制链接")).toBeInTheDocument();
  });

  it("opens new window with correct URL when clicking Twitter", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<ShareMenu {...props} />);

    fireEvent.click(screen.getByRole("button", { name: /分享/ }));
    fireEvent.click(screen.getByText("Twitter"));

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining("twitter.com/intent/tweet"),
      "_blank",
      "noopener,noreferrer"
    );
    openSpy.mockRestore();
  });

  it("opens share card when clicking WeChat", () => {
    render(<ShareMenu {...props} />);
    fireEvent.click(screen.getByRole("button", { name: /分享/ }));
    fireEvent.click(screen.getByText("微信"));

    expect(screen.getByText("长按或截图保存，分享到微信")).toBeInTheDocument();
    expect(screen.getByText(props.title)).toBeInTheDocument();
  });

  it("opens share card when clicking Xiaohongshu", () => {
    render(<ShareMenu {...props} />);
    fireEvent.click(screen.getByRole("button", { name: /分享/ }));
    fireEvent.click(screen.getByText("小红书"));

    expect(screen.getByText("长按或截图保存，分享到小红书")).toBeInTheDocument();
  });

  it("copies link and shows confirmation", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<ShareMenu {...props} />);
    fireEvent.click(screen.getByRole("button", { name: /分享/ }));
    fireEvent.click(screen.getByText("复制链接"));

    await waitFor(() => {
      expect(screen.getByText("已复制")).toBeInTheDocument();
    });
    expect(writeText).toHaveBeenCalledWith(props.url);
  });
});
