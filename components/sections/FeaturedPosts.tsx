import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedPosts } from "@/lib/mdx";
import { PostViewCount } from "@/components/ui/PostViewCount";

export function FeaturedPosts() {
  const featuredPosts = getFeaturedPosts();
  return (
    <section className="py-20 md:py-28 bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)]">
            精选文章
          </h2>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors duration-200"
          >
            查看全部
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featuredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-6
                         hover:border-[var(--accent)]/30 hover:shadow-[var(--card-shadow)]
                         transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="inline-block text-xs font-medium text-[var(--accent)] bg-[var(--accent)]/8 px-2.5 py-1 rounded-md mb-4">
                {post.tags[0]}
              </span>
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors duration-200 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <span className="text-xs text-[var(--text-muted)] flex items-center gap-2">
                {post.date}
                <PostViewCount slug={post.slug} />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
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
