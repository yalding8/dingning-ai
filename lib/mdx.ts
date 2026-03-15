import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  coverImage?: string;
  readingTime: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map((filename) => {
      const filePath = path.join(CONTENT_DIR, filename);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);

      if (!data.published) return null;

      const slug = data.slug || filename.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.mdx$/, "");

      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        tags: data.tags || [],
        published: data.published,
        featured: data.featured || false,
        coverImage: data.coverImage,
        readingTime: readingTime(content).text,
      } as PostMeta;
    })
    .filter(Boolean) as PostMeta[];

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedPosts(): PostMeta[] {
  return getAllPosts().filter((p) => p.featured);
}

export function getPostBySlug(slug: string) {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  for (const filename of files) {
    const filePath = path.join(CONTENT_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const fileSlug = data.slug || filename.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.mdx$/, "");
    if (fileSlug !== slug) continue;

    return {
      meta: {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        tags: data.tags || [],
        published: data.published,
        featured: data.featured || false,
        coverImage: data.coverImage,
        readingTime: readingTime(content).text,
      } as PostMeta,
      content,
    };
  }

  return null;
}

export function getAdjacentPosts(slug: string): {
  prev: PostMeta | null;
  next: PostMeta | null;
} {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  };
}
