import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ShareButton } from "@/components/ui/ShareButton";

describe("ShareButton", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("renders copy link button", () => {
    render(<ShareButton />);
    expect(screen.getByText("复制链接")).toBeInTheDocument();
  });

  it("copies URL and shows confirmation", async () => {
    render(<ShareButton />);
    fireEvent.click(screen.getByText("复制链接"));
    await waitFor(() => {
      expect(screen.getByText("已复制")).toBeInTheDocument();
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      window.location.href
    );
  });
});
