import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Blog",
  description: "Ning Ding 的 AI 实践、Vibe Coding 实录与国际教育行业思考。",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4">
          Blog
        </h1>
        <p className="text-base text-[var(--text-secondary)] mb-12">
          AI 实践、Vibe Coding 实录与行业思考
        </p>

        <div className="space-y-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block border-b border-[var(--border)] pb-8"
            >
              <div className="flex items-center gap-2 mb-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-[var(--accent)] font-medium"
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-xs text-[var(--text-muted)]">
                  · {post.date}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  · {post.readingTime}
                </span>
              </div>
              <h2 className="text-xl font-medium text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors duration-200">
                {post.title}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
