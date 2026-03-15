import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { PostMeta } from "@/lib/mdx";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

import { BlogList } from "@/components/ui/BlogList";

const mockPosts: PostMeta[] = [
  {
    slug: "post-1",
    title: "Post One",
    date: "2026-03-15",
    excerpt: "First post excerpt",
    tags: ["AI", "教程"],
    published: true,
    featured: false,
    readingTime: "3 min read",
  },
  {
    slug: "post-2",
    title: "Post Two",
    date: "2026-03-14",
    excerpt: "Second post excerpt",
    tags: ["Vibe Coding"],
    published: true,
    featured: true,
    readingTime: "5 min read",
  },
  {
    slug: "post-3",
    title: "Post Three",
    date: "2026-03-13",
    excerpt: "Third post excerpt",
    tags: ["AI"],
    published: true,
    featured: false,
    readingTime: "2 min read",
  },
];

const allTags = ["AI", "Vibe Coding", "教程"];

// Helper to get filter buttons (they are in the first div with flex-wrap)
function getFilterButton(text: string) {
  const buttons = screen.getAllByRole("button");
  return buttons.find((btn) => btn.textContent === text)!;
}

describe("BlogList", () => {
  it("renders all posts initially", () => {
    render(<BlogList posts={mockPosts} allTags={allTags} />);
    expect(screen.getByText("Post One")).toBeInTheDocument();
    expect(screen.getByText("Post Two")).toBeInTheDocument();
    expect(screen.getByText("Post Three")).toBeInTheDocument();
  });

  it("renders tag filter buttons including '全部'", () => {
    render(<BlogList posts={mockPosts} allTags={allTags} />);
    const buttons = screen.getAllByRole("button");
    const labels = buttons.map((b) => b.textContent);
    expect(labels).toContain("全部");
    expect(labels).toContain("AI");
    expect(labels).toContain("Vibe Coding");
    expect(labels).toContain("教程");
  });

  it("filters posts by tag when clicked", () => {
    render(<BlogList posts={mockPosts} allTags={allTags} />);
    fireEvent.click(getFilterButton("Vibe Coding"));
    expect(screen.queryByText("Post One")).not.toBeInTheDocument();
    expect(screen.getByText("Post Two")).toBeInTheDocument();
    expect(screen.queryByText("Post Three")).not.toBeInTheDocument();
  });

  it("shows all posts after clicking active tag again (deselect)", () => {
    render(<BlogList posts={mockPosts} allTags={allTags} />);
    fireEvent.click(getFilterButton("Vibe Coding"));
    expect(screen.queryByText("Post One")).not.toBeInTheDocument();
    fireEvent.click(getFilterButton("Vibe Coding"));
    expect(screen.getByText("Post One")).toBeInTheDocument();
    expect(screen.getByText("Post Two")).toBeInTheDocument();
    expect(screen.getByText("Post Three")).toBeInTheDocument();
  });

  it("shows all posts when '全部' is clicked", () => {
    render(<BlogList posts={mockPosts} allTags={allTags} />);
    fireEvent.click(getFilterButton("AI"));
    expect(screen.queryByText("Post Two")).not.toBeInTheDocument();
    fireEvent.click(getFilterButton("全部"));
    expect(screen.getByText("Post One")).toBeInTheDocument();
    expect(screen.getByText("Post Two")).toBeInTheDocument();
    expect(screen.getByText("Post Three")).toBeInTheDocument();
  });

  it("shows empty state when no posts match tag", () => {
    render(<BlogList posts={mockPosts} allTags={[...allTags, "不存在的标签"]} />);
    fireEvent.click(getFilterButton("不存在的标签"));
    expect(screen.getByText("该标签下暂无文章")).toBeInTheDocument();
  });

  it("filters by AI tag and shows correct posts", () => {
    render(<BlogList posts={mockPosts} allTags={allTags} />);
    fireEvent.click(getFilterButton("AI"));
    expect(screen.getByText("Post One")).toBeInTheDocument();
    expect(screen.queryByText("Post Two")).not.toBeInTheDocument();
    expect(screen.getByText("Post Three")).toBeInTheDocument();
  });
});
