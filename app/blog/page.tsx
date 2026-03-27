import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { getAllTags } from "@/lib/tags";
import { BlogList } from "@/components/ui/BlogList";

export const metadata: Metadata = {
  title: "博客",
  description: "Ning Ding 的 AI 实践、Vibe Coding 实录与国际教育行业思考。",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const allTags = getAllTags();

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4">
          博客
        </h1>
        <p className="text-base text-[var(--text-secondary)] mb-8">
          AI 实践、Vibe Coding 实录与行业思考
        </p>

        <BlogList posts={posts} allTags={allTags} />
      </div>
    </section>
  );
}
