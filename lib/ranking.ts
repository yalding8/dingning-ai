import type { PostMeta } from "./mdx";

/**
 * Rank featured posts by a combined score of views (70%) and recency (30%).
 * Views are normalized against the max view count.
 * Recency decays linearly over 90 days from today.
 */
export function rankFeaturedPosts(
  posts: PostMeta[],
  viewCounts: Record<string, number>
): PostMeta[] {
  const now = Date.now();
  const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;

  const maxViews = Math.max(1, ...posts.map((p) => viewCounts[p.slug] ?? 0));

  return [...posts]
    .map((post) => {
      const views = viewCounts[post.slug] ?? 0;
      const viewScore = views / maxViews;

      const age = now - new Date(post.date).getTime();
      const recencyScore = Math.max(0, 1 - age / NINETY_DAYS);

      const score = viewScore * 0.7 + recencyScore * 0.3;
      return { post, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.post);
}
