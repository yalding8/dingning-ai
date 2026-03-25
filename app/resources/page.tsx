import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "资源推荐",
  description:
    "AI 时代的工具推荐——按场景分类，无论是否有编程背景都能找到合适的工具。",
};

type Audience = "非程序员" | "有技术背景" | "通用";

interface ResourceItem {
  name: string;
  description: string;
  audience: Audience;
  difficulty: 1 | 2 | 3;
  slug?: string;
  url?: string;
  source?: string;
}

interface ResourceGroup {
  category: string;
  subtitle: string;
  items: ResourceItem[];
}

const resources: ResourceGroup[] = [
  {
    category: "从零构建产品（Vibe Coding）",
    subtitle: "从想法到可运行的产品，AI 让每个人都能上手",
    items: [
      {
        name: "Claude Code",
        description:
          "我的核心开发工具。运行在终端里的 AI 编程助手，异乡人才、异乡点评、dingning.ai 全部用它构建。",
        audience: "有技术背景",
        difficulty: 3,
        slug: "recommend-claude-code",
      },
      {
        name: "Cursor",
        description: "AI 驱动的代码编辑器，基于 VS Code，上手更直觉。",
        audience: "通用",
        difficulty: 2,
        url: "https://cursor.sh",
        source: "行业口碑",
      },
      {
        name: "v0",
        description: "Vercel 推出的 AI 前端生成工具，用自然语言描述即可生成界面。",
        audience: "非程序员",
        difficulty: 1,
        url: "https://v0.dev",
        source: "行业口碑",
      },
      {
        name: "Bolt",
        description:
          "自然语言直接生成全栈应用，支持一键部署。",
        audience: "非程序员",
        difficulty: 1,
        url: "https://bolt.new",
        source: "行业口碑",
      },
      {
        name: "Lovable",
        description: "对话式构建 Web 应用，适合快速验证产品想法。",
        audience: "非程序员",
        difficulty: 1,
        url: "https://lovable.dev",
        source: "行业口碑",
      },
    ],
  },
  {
    category: "内容与知识管理",
    subtitle: "整理想法、沉淀知识",
    items: [
      {
        name: "Obsidian",
        description:
          "我的个人知识库。所有项目的规划文档、培训方案、文章草稿都写在这里，支持本地 Markdown、双向链接。",
        audience: "通用",
        difficulty: 2,
        slug: "recommend-obsidian",
      },
    ],
  },
  {
    category: "部署与上线",
    subtitle: "让产品跑起来、被用户访问到",
    items: [
      {
        name: "Vercel",
        description:
          "前端一键部署平台。push 代码自动上线，dingning.ai 就跑在上面。",
        audience: "有技术背景",
        difficulty: 2,
        slug: "recommend-vercel",
      },
      {
        name: "GitHub",
        description:
          "代码托管和 CI/CD。30+ 个仓库，所有项目的代码都在这里管理。",
        audience: "有技术背景",
        difficulty: 2,
        slug: "recommend-github",
      },
      {
        name: "Docker",
        description:
          "容器化部署。异乡点评用 Docker Compose 管理 PostgreSQL、Redis、NestJS、Nuxt 等多个服务。",
        audience: "有技术背景",
        difficulty: 3,
        slug: "recommend-docker",
      },
    ],
  },
  {
    category: "云服务与基础设施",
    subtitle: "服务器、存储、网络——产品运行的底层支撑",
    items: [
      {
        name: "DigitalOcean",
        description:
          "开发者友好的云平台。异乡人才的后端跑在上面，简洁好用。",
        audience: "有技术背景",
        difficulty: 3,
        slug: "recommend-digitalocean",
      },
      {
        name: "阿里云",
        description:
          "异乡点评的生产服务器。ECS + 容器化部署，国内访问稳定。",
        audience: "有技术背景",
        difficulty: 3,
        slug: "recommend-aliyun",
      },
      {
        name: "腾讯云",
        description:
          "部分业务的备选云服务，微信生态对接时尤其方便。",
        audience: "有技术背景",
        difficulty: 3,
        slug: "recommend-tencent-cloud",
      },
    ],
  },
];

function DifficultyStars({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="text-xs text-[var(--text-muted)]" aria-label={`难度 ${level} 星`}>
      {"★".repeat(level)}{"☆".repeat(3 - level)}
    </span>
  );
}

function AudienceTag({ audience }: { audience: Audience }) {
  const colorMap: Record<Audience, string> = {
    "非程序员": "bg-emerald-50 text-emerald-700 border border-emerald-200",
    "有技术背景": "bg-sky-50 text-sky-700 border border-sky-200",
    "通用": "bg-amber-50 text-amber-700 border border-amber-200",
  };

  return (
    <span
      className={`inline-block text-[11px] leading-tight px-1.5 py-0.5 rounded ${colorMap[audience]}`}
    >
      {audience}
    </span>
  );
}

function ResourceCard({ item }: { item: ResourceItem }) {
  const isExternal = !!item.url;
  const href = item.slug ? `/blog/${item.slug}` : item.url!;

  const cardContent = (
    <>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-200">
            {item.name}
          </h3>
          <AudienceTag audience={item.audience} />
          <DifficultyStars level={item.difficulty} />
        </div>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {item.description}
        </p>
        {item.source && (
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            信息来源：{item.source}
          </p>
        )}
      </div>
      {isExternal ? (
        <ExternalLink
          size={14}
          className="shrink-0 mt-1 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors duration-200"
        />
      ) : (
        <ArrowRight
          size={14}
          className="shrink-0 mt-1 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors duration-200"
        />
      )}
    </>
  );

  const className =
    "group flex items-start justify-between border border-[var(--border)] rounded-xl p-4 hover:border-[var(--accent)]/30 hover:shadow-[var(--card-shadow)] transition-all duration-300";

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {cardContent}
    </Link>
  );
}

export default function ResourcesPage() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4">
          资源推荐
        </h1>
        <p className="text-base text-[var(--text-secondary)] mb-12">
          AI
          正在改变构建产品的方式。无论你是否有编程背景，这里的工具都能帮你把想法变成现实。
        </p>

        <div className="space-y-12">
          {resources.map((group) => (
            <div key={group.category}>
              <h2 className="text-lg font-medium text-[var(--text-primary)] mb-1">
                {group.category}
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                {group.subtitle}
              </p>
              <div className="space-y-4">
                {group.items.map((item) => (
                  <ResourceCard key={item.name} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-[var(--text-muted)] mt-12 text-center">
          部分链接为推荐链接，点击支持本站。所有推荐均基于真实使用体验或行业口碑。
        </p>
      </div>
    </section>
  );
}
