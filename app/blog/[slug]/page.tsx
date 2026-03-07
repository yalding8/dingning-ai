import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { NewsletterForm } from "@/components/ui/NewsletterForm";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
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
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
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
          <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
            <span>Neil Ding</span>
            <span>·</span>
            <time dateTime={post.meta.date}>{post.meta.date}</time>
            <span>·</span>
            <span>{post.meta.readingTime}</span>
          </div>
        </header>

        {/* Content */}
        <div className="prose">
          <MDXRemote source={post.content} />
        </div>

        {/* Newsletter CTA */}
        <footer className="mt-16 pt-8 border-t border-[var(--border)]">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-6 md:p-8">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
              觉得有价值？
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              每两周一封，只分享真实实践。不群发、不卖课。
            </p>
            <NewsletterForm />
          </div>
        </footer>
      </div>
    </article>
  );
}
