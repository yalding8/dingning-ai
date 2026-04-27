import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface CoffeeMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  published: boolean;
}

const CONTENT_DIR = path.join(process.cwd(), "content/coffee");

function readIssues(): Array<{ filename: string; data: matter.GrayMatterFile<string>["data"]; content: string }> {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  return files.map((filename) => {
    const filePath = path.join(CONTENT_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    return { filename, data, content };
  });
}

function toMeta(filename: string, data: matter.GrayMatterFile<string>["data"]): CoffeeMeta {
  const slug = data.slug || filename.replace(/\.mdx$/, "");
  return {
    slug,
    title: data.title,
    date: data.date,
    description: data.description || "",
    published: data.published !== false,
  };
}

export function getAllCoffee(): CoffeeMeta[] {
  return readIssues()
    .map(({ filename, data }) => toMeta(filename, data))
    .filter((m) => m.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getCoffeeBySlug(slug: string): { meta: CoffeeMeta; content: string } | null {
  for (const { filename, data, content } of readIssues()) {
    const meta = toMeta(filename, data);
    if (meta.slug === slug) return { meta, content };
  }
  return null;
}

export function getAdjacentCoffee(slug: string): { prev: CoffeeMeta | null; next: CoffeeMeta | null } {
  const issues = getAllCoffee();
  const idx = issues.findIndex((i) => i.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx < issues.length - 1 ? issues[idx + 1] : null,
    next: idx > 0 ? issues[idx - 1] : null,
  };
}
