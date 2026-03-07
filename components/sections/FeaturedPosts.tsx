import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FeaturedPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  recommendation: string;
}

// Phase 2 接入 MDX 后替换为动态数据
const featuredPosts: FeaturedPost[] = [
  {
    slug: "vibe-coding-for-non-programmers",
    title: "一个非程序员如何用 AI 写出真实产品",
    excerpt:
      "我没有计算机学位，也不会写 Python。但在过去 6 个月里，我用 AI 从零构建了三款服务 26 万留学生的产品。",
    date: "2026-03-07",
    recommendation: "最受欢迎",
  },
  {
    slug: "ai-transform-international-education",
    title: "我们如何用 AI 把客服响应时间从 48h 降到 2h",
    excerpt:
      "异乡好居服务全球 27 个国家的留学生。当我们开始用 AI 重建客服系统时，发生了一些意想不到的事。",
    date: "2026-03-05",
    recommendation: "数据驱动",
  },
  {
    slug: "one-person-company",
    title: "白天当 VP，晚上当 CEO：我的双重身份生存指南",
    excerpt:
      "一个人也可以成为一个公司。但这条路上有很多没人告诉你的事。",
    date: "2026-03-03",
    recommendation: "个人故事",
  },
];

export function FeaturedPosts() {
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
                {post.recommendation}
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
