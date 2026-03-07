import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedPosts } from "@/lib/mdx";

export function FeaturedPosts() {
  const featuredPosts = getFeaturedPosts();
  return (
    <section className="py-16 md:py-24 bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-10">
          精选文章
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {featuredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-6
                         hover:border-[var(--border-strong)] transition-colors duration-200"
            >
              <span className="inline-block text-xs font-medium text-[var(--accent)] mb-3">
                {post.tags[0]}
              </span>
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors duration-200">
                {post.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                {post.excerpt}
              </p>
              <span className="text-xs text-[var(--text-muted)]">
                {post.date}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors duration-200"
          >
            查看全部文章
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
