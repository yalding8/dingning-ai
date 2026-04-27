import type { Metadata } from "next";
import Link from "next/link";
import { getAllCoffee } from "@/lib/coffee";

export const metadata: Metadata = {
  title: "异乡早咖啡",
  description: "国际教育每日要闻 · AI 辅助生成 · 每日更新",
  openGraph: {
    title: "异乡早咖啡",
    description: "国际教育每日要闻 · AI 辅助生成 · 每日更新",
    type: "website",
    url: "https://dingning.ai/coffee",
  },
};

export default function CoffeeIndexPage() {
  const issues = getAllCoffee();

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4">
          异乡早咖啡
        </h1>
        <p className="text-base text-[var(--text-secondary)] mb-10">
          国际教育每日要闻 · AI 辅助生成 · 每日早 7:00 推送至社群
        </p>

        {issues.length === 0 ? (
          <div className="border border-dashed border-[var(--border)] rounded-xl p-8 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              暂无内容，每日早 7:00 自动更新。
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {issues.map((issue) => (
              <li key={issue.slug}>
                <Link
                  href={`/coffee/${issue.slug}`}
                  className="block p-4 md:p-5 border border-[var(--border)] rounded-xl hover:border-[var(--accent)]/30 hover:shadow-[var(--card-shadow)] transition-all duration-300"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-base md:text-lg font-medium text-[var(--text-primary)]">
                      {issue.title}
                    </h2>
                    <time
                      dateTime={issue.date}
                      className="text-xs text-[var(--text-muted)] whitespace-nowrap"
                    >
                      {issue.date}
                    </time>
                  </div>
                  {issue.description && (
                    <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2">
                      {issue.description}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
