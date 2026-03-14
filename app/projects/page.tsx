import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "项目",
  description: "Ning Ding 构建和推动的项目：异乡好居、异乡缴费、异乡人才。",
};

const projects = [
  {
    name: "异乡好居",
    role: "副总裁",
    description:
      "全球留学生海外住宿预订平台，累计服务超 40 万名客户，覆盖 27 个国家和地区。我负责留学渠道部，维护超过 3 万名合作伙伴，推动 AI 客服系统、智能推荐引擎和运营自动化。",
    tags: ["国际教育", "AI 落地", "平台"],
    url: "https://www.uhomes.com",
  },
  {
    name: "异乡缴费",
    role: "负责人",
    description:
      "留学生智能缴费比价平台。过去 5 年累计服务超 18 万名客户，交易金额超 75 亿。覆盖学费、房租、保险等全类型留学缴费。",
    tags: ["FinTech", "留学生服务"],
    url: "https://www.uhomespay.com",
  },
  {
    name: "异乡人才",
    role: "创建者",
    description:
      "留学生求职就业平台。AI 驱动的岗位推荐、简历优化和职业规划。用 Vibe Coding 从零构建。",
    tags: ["AI", "Vibe Coding", "求职"],
  },
  {
    name: "dingning.ai",
    role: "主理人",
    description:
      "你正在看的这个网站。一个人、一台电脑、一个 AI 助手，构建个人品牌和产品矩阵。",
    tags: ["Solopreneur", "Vibe Coding"],
    url: "https://dingning.ai",
  },
];

export default function ProjectsPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4">
          项目
        </h1>
        <p className="text-base text-[var(--text-secondary)] mb-12">
          我在做的事——不只是做了什么，更是在其中思考了什么
        </p>

        <div className="space-y-6">
          {projects.map((project) => (
            <div
              key={project.name}
              className="border border-[var(--border)] rounded-lg p-6 hover:border-[var(--border-strong)] transition-colors duration-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-lg font-medium text-[var(--text-primary)]">
                    {project.name}
                  </h2>
                  <span className="text-xs text-[var(--accent)] font-medium">
                    {project.role}
                  </span>
                </div>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
