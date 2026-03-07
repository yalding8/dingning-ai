import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description: "Neil Ding 的 AI 实践、Vibe Coding 实录与国际教育行业思考。",
};

// Phase 2 接入 MDX 后替换为动态数据
const posts = [
  {
    slug: "vibe-coding-for-non-programmers",
    title: "一个非程序员如何用 AI 写出真实产品",
    excerpt:
      "我没有计算机学位，也不会写 Python。但在过去 6 个月里，我用 AI 从零构建了三款服务 26 万留学生的产品。",
    date: "2026-03-07",
    tags: ["Vibe Coding", "AI"],
  },
  {
    slug: "ai-transform-international-education",
    title: "我们如何用 AI 把客服响应时间从 48h 降到 2h",
    excerpt:
      "异乡好居服务全球 27 个国家的留学生。当我们开始用 AI 重建客服系统时，发生了一些意想不到的事。",
    date: "2026-03-05",
    tags: ["AI", "国际教育"],
  },
  {
    slug: "one-person-company",
    title: "白天当 VP，晚上当 CEO：我的双重身份生存指南",
    excerpt:
      "一个人也可以成为一个公司。但这条路上有很多没人告诉你的事。",
    date: "2026-03-03",
    tags: ["Solopreneur", "个人故事"],
  },
];

export default function BlogPage() {
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
