import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "资源推荐",
  description: "我真正在用的 AI 工具和资源推荐。",
};

const resources = [
  {
    category: "AI 助手",
    items: [
      {
        name: "Claude Pro",
        description: "我最常用的 AI 助手。深度思考、长文写作、代码开发，全靠它。",
        url: "https://claude.ai",
      },
    ],
  },
  {
    category: "开发工具",
    items: [
      {
        name: "Cursor",
        description: "AI 原生代码编辑器。Vibe Coding 的核心工具，让非程序员也能写出生产级代码。",
        url: "https://cursor.com",
      },
      {
        name: "Vercel",
        description: "前端部署平台。push 代码自动上线，这个网站就跑在 Vercel 上。",
        url: "https://vercel.com",
      },
    ],
  },
  {
    category: "云服务",
    items: [
      {
        name: "DigitalOcean",
        description: "开发者友好的云服务器。异乡人才的后端就跑在上面。",
        url: "https://www.digitalocean.com",
      },
    ],
  },
  {
    category: "知识管理",
    items: [
      {
        name: "Notion",
        description: "团队知识库和项目管理。异乡好居全公司在用。",
        url: "https://www.notion.so",
      },
      {
        name: "Obsidian",
        description: "个人知识管理。这个网站的规划文档就写在 Obsidian 里。",
        url: "https://obsidian.md",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4">
          资源推荐
        </h1>
        <p className="text-base text-[var(--text-secondary)] mb-12">
          我真正在用的工具和资源——不是广告，是实测
        </p>

        <div className="space-y-12">
          {resources.map((group) => (
            <div key={group.category}>
              <h2 className="text-lg font-medium text-[var(--text-primary)] mb-4">
                {group.category}
              </h2>
              <div className="space-y-4">
                {group.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between border border-[var(--border)] rounded-lg p-4
                               hover:border-[var(--border-strong)] transition-colors duration-200"
                  >
                    <div>
                      <h3 className="text-base font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-200">
                        {item.name}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">
                        {item.description}
                      </p>
                    </div>
                    <ExternalLink
                      size={14}
                      className="shrink-0 mt-1 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors duration-200"
                    />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-[var(--text-muted)] mt-12 text-center">
          部分链接为推荐链接，点击支持本站。所有推荐均基于真实使用体验。
        </p>
      </div>
    </section>
  );
}
