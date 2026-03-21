import { describe, it, expect } from "vitest";
import { rankFeaturedPosts } from "@/lib/ranking";

const makePost = (slug: string, date: string) => ({
  slug,
  date,
  title: slug,
  excerpt: "",
  published: true,
  featured: true,
  tags: [],
  readingTime: "3 min read",
});

describe("rankFeaturedPosts", () => {
  it("ranks posts with more views higher", () => {
    const posts = [
      makePost("low-views", "2026-03-01"),
      makePost("high-views", "2026-03-01"),
    ];
    const viewCounts: Record<string, number> = {
      "low-views": 10,
      "high-views": 100,
    };

    const ranked = rankFeaturedPosts(posts, viewCounts);
    expect(ranked[0].slug).toBe("high-views");
    expect(ranked[1].slug).toBe("low-views");
  });

  it("newer posts rank higher when views are equal", () => {
    const posts = [
      makePost("old-post", "2026-01-01"),
      makePost("new-post", "2026-03-20"),
    ];
    const viewCounts: Record<string, number> = {
      "old-post": 50,
      "new-post": 50,
    };

    const ranked = rankFeaturedPosts(posts, viewCounts);
    expect(ranked[0].slug).toBe("new-post");
  });

  it("high views can outrank recency", () => {
    const posts = [
      makePost("viral-old", "2026-01-01"),
      makePost("new-quiet", "2026-03-20"),
    ];
    const viewCounts: Record<string, number> = {
      "viral-old": 500,
      "new-quiet": 5,
    };

    const ranked = rankFeaturedPosts(posts, viewCounts);
    expect(ranked[0].slug).toBe("viral-old");
  });

  it("posts with no view data default to 0 views", () => {
    const posts = [
      makePost("tracked", "2026-03-01"),
      makePost("untracked", "2026-03-01"),
    ];
    const viewCounts: Record<string, number> = { tracked: 20 };

    const ranked = rankFeaturedPosts(posts, viewCounts);
    expect(ranked[0].slug).toBe("tracked");
  });
});
