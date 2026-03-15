import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "资源推荐",
  description: "我真正在用的 AI 工具和资源推荐。",
};

const resources = [
  {
    category: "AI 开发",
    items: [
      {
        name: "Claude Code",
        description: "我的核心开发工具。运行在终端里的 AI 编程助手，异乡人才、异乡点评、dingning.ai 全部用它构建。",
        slug: "recommend-claude-code",
      },
      {
        name: "OpenClaw",
        description: "开源 AI CLI 工具，前景很好，值得关注和探讨。",
        slug: "recommend-openclaw",
      },
    ],
  },
  {
    category: "知识管理",
    items: [
      {
        name: "Obsidian",
        description: "我的个人知识库。所有项目的规划文档、培训方案、文章草稿都写在这里，支持本地 Markdown、双向链接。",
        slug: "recommend-obsidian",
      },
      {
        name: "飞书",
        description: "身边朋友推荐最多的协作工具。文档、会议、审批一站式整合，口碑很好。",
        slug: "recommend-feishu",
      },
    ],
  },
  {
    category: "云服务",
    items: [
      {
        name: "DigitalOcean",
        description: "开发者友好的云服务器。异乡人才的后端跑在上面，简洁好用。",
        slug: "recommend-digitalocean",
      },
      {
        name: "阿里云",
        description: "异乡点评的生产服务器。ECS + 容器化部署，国内访问稳定。",
        slug: "recommend-aliyun",
      },
      {
        name: "腾讯云",
        description: "部分业务的备选云服务，微信生态对接时尤其方便。",
        slug: "recommend-tencent-cloud",
      },
    ],
  },
  {
    category: "开发与部署",
    items: [
      {
        name: "Vercel",
        description: "前端部署平台。push 代码自动上线，dingning.ai 就跑在上面。",
        slug: "recommend-vercel",
      },
      {
        name: "GitHub",
        description: "代码托管和 CI/CD。30+ 个仓库，所有项目的代码都在这里管理。",
        slug: "recommend-github",
      },
      {
        name: "Docker",
        description: "容器化部署。异乡点评用 Docker Compose 管理 PostgreSQL、Redis、NestJS、Nuxt 等多个服务。",
        slug: "recommend-docker",
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
                  <Link
                    key={item.name}
                    href={`/blog/${item.slug}`}
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
                    <ArrowRight
                      size={14}
                      className="shrink-0 mt-1 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors duration-200"
                    />
                  </Link>
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
