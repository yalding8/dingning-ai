"use client";

import { useState } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";

interface BlogListProps {
  posts: PostMeta[];
  allTags: string[];
}

export function BlogList({ posts, allTags }: BlogListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredPosts = activeTag
    ? posts.filter((post) => post.tags.includes(activeTag))
    : posts;

  return (
    <>
      {/* Tag filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActiveTag(null)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors duration-200 ${
            activeTag === null
              ? "bg-[var(--accent)] text-white border-[var(--accent)]"
              : "text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-strong)]"
          }`}
        >
          全部
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors duration-200 ${
              activeTag === tag
                ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                : "text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-strong)]"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Post list */}
      <div className="space-y-8">
        {filteredPosts.map((post) => (
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
        {filteredPosts.length === 0 && (
          <p className="text-sm text-[var(--text-muted)] text-center py-8">
            该标签下暂无文章
          </p>
        )}
      </div>
    </>
  );
}
