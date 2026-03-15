import { describe, it, expect } from "vitest";
import { getAllPosts, getFeaturedPosts, getPostBySlug, getAdjacentPosts } from "@/lib/mdx";

describe("getAllPosts", () => {
  it("returns an array of published posts", () => {
    const posts = getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
    posts.forEach((post) => {
      expect(post.published).toBe(true);
    });
  });

  it("sorts posts by date descending (newest first)", () => {
    const posts = getAllPosts();
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(posts[i].date).getTime()
      );
    }
  });

  it("each post has required fields", () => {
    const posts = getAllPosts();
    posts.forEach((post) => {
      expect(post.slug).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.date).toBeTruthy();
      expect(post.excerpt).toBeTruthy();
      expect(Array.isArray(post.tags)).toBe(true);
      expect(post.readingTime).toBeTruthy();
    });
  });

  it("slugs are ASCII-only (no Chinese characters)", () => {
    const posts = getAllPosts();
    posts.forEach((post) => {
      // eslint-disable-next-line no-control-regex
      expect(post.slug).toMatch(/^[\x00-\x7F]+$/);
    });
  });
});

describe("getFeaturedPosts", () => {
  it("returns only featured posts", () => {
    const featured = getFeaturedPosts();
    featured.forEach((post) => {
      expect(post.featured).toBe(true);
    });
  });
});

describe("getPostBySlug", () => {
  it("returns a post when slug matches", () => {
    const posts = getAllPosts();
    if (posts.length === 0) return;
    const first = posts[0];
    const result = getPostBySlug(first.slug);
    expect(result).not.toBeNull();
    expect(result!.meta.slug).toBe(first.slug);
    expect(result!.content).toBeTruthy();
  });

  it("returns null for non-existent slug", () => {
    const result = getPostBySlug("this-slug-does-not-exist-12345");
    expect(result).toBeNull();
  });
});

describe("getAdjacentPosts", () => {
  it("returns prev and next posts for a middle post", () => {
    const posts = getAllPosts();
    if (posts.length < 3) return;
    const middleSlug = posts[1].slug;
    const { prev, next } = getAdjacentPosts(middleSlug);
    // prev = older post (index+1), next = newer post (index-1)
    expect(prev).not.toBeNull();
    expect(next).not.toBeNull();
    expect(prev!.slug).toBe(posts[2].slug);
    expect(next!.slug).toBe(posts[0].slug);
  });

  it("returns null for prev when at the last (oldest) post", () => {
    const posts = getAllPosts();
    if (posts.length === 0) return;
    const lastSlug = posts[posts.length - 1].slug;
    const { prev } = getAdjacentPosts(lastSlug);
    expect(prev).toBeNull();
  });

  it("returns null for next when at the first (newest) post", () => {
    const posts = getAllPosts();
    if (posts.length === 0) return;
    const firstSlug = posts[0].slug;
    const { next } = getAdjacentPosts(firstSlug);
    expect(next).toBeNull();
  });

  it("returns both null for non-existent slug", () => {
    const { prev, next } = getAdjacentPosts("non-existent-slug");
    expect(prev).toBeNull();
    expect(next).toBeNull();
  });
});
