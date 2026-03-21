import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ViewCounter } from "@/components/ui/ViewCounter";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("ViewCounter", () => {
  it("sends POST on mount and displays view count", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ count: 42 }), { status: 200 })
    );

    render(<ViewCounter slug="test-post" />);

    await waitFor(() => {
      expect(screen.getByText(/42/)).toBeInTheDocument();
    });

    expect(fetchSpy).toHaveBeenCalledWith("/api/views/test-post", {
      method: "POST",
    });
  });

  it("shows 0 when fetch fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("network"));

    render(<ViewCounter slug="broken-post" />);

    await waitFor(() => {
      expect(screen.getByText(/0/)).toBeInTheDocument();
    });
  });
});
