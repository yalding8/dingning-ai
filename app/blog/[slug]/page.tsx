import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllPosts, getPostBySlug, getAdjacentPosts } from "@/lib/mdx";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { ShareButton } from "@/components/ui/ShareButton";
import { mdxComponents } from "@/components/mdx/MdxComponents";
import { ViewCounter } from "@/components/ui/ViewCounter";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(decodeURIComponent(params.slug));
  if (!post) return {};

  return {
    title: post.meta.title,
    description: post.meta.excerpt,
    openGraph: {
      title: post.meta.title,
      description: post.meta.excerpt,
      type: "article",
      publishedTime: post.meta.date,
      url: `https://dingning.ai/blog/${params.slug}`,
    },
  };
}

export default function BlogPost({ params }: Props) {
  const slug = decodeURIComponent(params.slug);
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.meta.title,
    datePublished: post.meta.date,
    author: {
      "@type": "Person",
      name: "Ning Ding",
      url: "https://dingning.ai/about",
    },
    publisher: {
      "@type": "Organization",
      name: "dingning.ai",
      url: "https://dingning.ai",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200 mb-8"
        >
          <ArrowLeft size={14} />
          返回博客
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            {post.meta.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-[var(--accent)] bg-[var(--bg-secondary)] px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4 leading-tight">
            {post.meta.title}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
              <span>Ning Ding</span>
              <span>·</span>
              <time dateTime={post.meta.date}>{post.meta.date}</time>
              <span>·</span>
              <span>{post.meta.readingTime}</span>
              <span>·</span>
              <ViewCounter slug={slug} />
            </div>
            <ShareButton />
          </div>
        </header>

        {/* Content */}
        <div className="prose">
          <MDXRemote source={post.content} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </div>

        {/* Prev / Next navigation */}
        <nav className="mt-16 pt-8 border-t border-[var(--border)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="group flex flex-col gap-1 p-4 border border-[var(--border)] rounded-lg hover:border-[var(--border-strong)] transition-colors duration-200"
              >
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                  <ArrowLeft size={12} />
                  上一篇
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
                href={`/blog/${next.slug}`}
                className="group flex flex-col gap-1 p-4 border border-[var(--border)] rounded-lg hover:border-[var(--border-strong)] transition-colors duration-200 md:text-right"
              >
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 md:justify-end">
                  下一篇
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

        {/* Newsletter CTA */}
        <footer className="mt-8">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-6 md:p-8">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
              觉得有价值？
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              每两周一封，只分享真实实践。不群发、不灌水。
            </p>
            <NewsletterForm />
          </div>
        </footer>
      </div>
    </article>
    </>
  );
}
