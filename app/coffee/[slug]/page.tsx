import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllCoffee, getCoffeeBySlug, getAdjacentCoffee } from "@/lib/coffee";
import { mdxComponents } from "@/components/mdx/MdxComponents";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllCoffee().map((issue) => ({ slug: issue.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const issue = getCoffeeBySlug(decodeURIComponent(params.slug));
  if (!issue) return {};
  return {
    title: issue.meta.title,
    description: issue.meta.description,
    openGraph: {
      title: issue.meta.title,
      description: issue.meta.description,
      type: "article",
      publishedTime: issue.meta.date,
      url: `https://dingning.ai/coffee/${params.slug}`,
    },
  };
}

export default function CoffeeDetailPage({ params }: Props) {
  const slug = decodeURIComponent(params.slug);
  const issue = getCoffeeBySlug(slug);
  if (!issue) notFound();

  const { prev, next } = getAdjacentCoffee(slug);

  return (
    <article className="py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
        <Link
          href="/coffee"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200 mb-8"
        >
          <ArrowLeft size={14} />
          返回早咖啡
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4 leading-tight">
            {issue.meta.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
            <time dateTime={issue.meta.date}>{issue.meta.date}</time>
          </div>
        </header>

        <div className="prose">
          <MDXRemote
            source={issue.content}
            components={mdxComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>

        <nav className="mt-16 pt-8 border-t border-[var(--border)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prev ? (
              <Link
                href={`/coffee/${prev.slug}`}
                className="group flex flex-col gap-1 p-4 border border-[var(--border)] rounded-xl hover:border-[var(--accent)]/30 hover:shadow-[var(--card-shadow)] transition-all duration-300"
              >
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                  <ArrowLeft size={12} />
                  上一期
                </span>
                <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-200 line-clamp-1">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/coffee/${next.slug}`}
                className="group flex flex-col gap-1 p-4 border border-[var(--border)] rounded-xl hover:border-[var(--accent)]/30 hover:shadow-[var(--card-shadow)] transition-all duration-300 md:text-right"
              >
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 md:justify-end">
                  下一期
                  <ArrowRight size={12} />
                </span>
                <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-200 line-clamp-1">
                  {next.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </nav>

        <footer className="mt-12 pt-8 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            本页为新闻索引，每条仅含中文标题与简要事实摘要，所有内容版权归原媒体所有。
            如需 takedown，请联系{" "}
            <a
              href="mailto:ceo@dingning.ai"
              className="underline hover:text-[var(--accent)]"
            >
              ceo@dingning.ai
            </a>
            。
          </p>
        </footer>
      </div>
    </article>
  );
}
