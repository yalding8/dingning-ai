import { getAllPosts } from "./mdx";

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }
  // 用 localeCompare 而非默认码点排序，保证中文/大小写混排标签按字典序展示
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}
