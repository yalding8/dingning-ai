import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NewsletterForm } from "@/components/ui/NewsletterForm";

describe("NewsletterForm", () => {
  it("renders email input and submit button", () => {
    render(<NewsletterForm />);
    expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument();
    expect(screen.getByText("订阅")).toBeInTheDocument();
  });

  it("email input is required", () => {
    render(<NewsletterForm />);
    const input = screen.getByPlaceholderText("your@email.com");
    expect(input).toHaveAttribute("required");
  });
});
