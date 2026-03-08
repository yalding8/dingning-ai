import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "服务",
  description:
    "AI 赋能国际教育：Vibe Coding 企业实训、AI 落地咨询。基于异乡好居 3 万+合作伙伴的真实业务场景。",
};

const trainingModules = [
  {
    title: "小红书内容批量生成",
    difficulty: "入门",
    description:
      "从 Excel 读取主题，用 AI 为每个主题生成品牌内容。培训后内容生产效率提升 80%+。",
  },
  {
    title: "房源智能问答系统",
    difficulty: "基础",
    description:
      "基于知识库的自动回复工具。响应时间从 1 小时降到 5 分钟。",
  },
  {
    title: "佣金数据自动提取与分析",
    difficulty: "进阶",
    description:
      "自动登录系统、提取数据、生成报告。分析时间从 30 分钟降到 3 分钟。",
  },
  {
    title: "商机信息智能录入",
    difficulty: "综合",
    description:
      "端到端的自动化录入系统。录入时间减少 70%+。",
  },
];

const trainingResults = [
  { label: "全程参与率", value: "100%", detail: "10/10 人完成全部 8 节课" },
  { label: "工具实际使用率", value: "80%", detail: "至少 2 个工具在日常使用" },
  { label: "佣金分析时间", value: "30 分钟 → 3 分钟", detail: "" },
  { label: "房源问答响应", value: "1 小时 → 5 分钟", detail: "" },
];

export default function ServicesPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4">
          AI 赋能国际教育
        </h1>
        <p className="text-base text-[var(--text-secondary)] mb-12 leading-relaxed">
          我在异乡好居推动 AI 落地的过程中，积累了一套经过验证的方法论。
          现在，我把这些经验开放给行业同仁。
        </p>

        {/* 服务一：Vibe Coding 企业实训 */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
            Vibe Coding 企业实训
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
            4 周 8 节课，让零编程基础的业务主管用 AI 构建自己的工作工具。
            不教语法，教解决问题。每节课 2 小时，每次结束时学员手里都有一个可运行的工具。
          </p>

          <div className="space-y-3 mb-8">
            {trainingModules.map((mod) => (
              <div
                key={mod.title}
                className="border border-[var(--border)] rounded-lg p-4"
              >
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-base font-medium text-[var(--text-primary)]">
                    {mod.title}
                  </h3>
                  <span className="text-xs text-[var(--accent)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded">
                    {mod.difficulty}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  {mod.description}
                </p>
              </div>
            ))}
          </div>

          {/* 实训成果 */}
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
            第一期实训成果
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {trainingResults.map((result) => (
              <div
                key={result.label}
                className="bg-[var(--bg-secondary)] rounded-lg p-4"
              >
                <div className="text-lg font-semibold text-[var(--accent)] mb-1">
                  {result.value}
                </div>
                <div className="text-sm text-[var(--text-primary)]">
                  {result.label}
                </div>
                {result.detail && (
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">
                    {result.detail}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Link
            href="/blog/vibecoding-training"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors duration-200"
          >
            阅读完整实训复盘
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 服务二：AI 落地咨询 */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
            AI 落地咨询
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
            基于我在异乡好居的实践——管理 3 万+留学渠道合作伙伴、累计服务 40 万客户、
            交易 75 亿的业务经验，帮助国际教育机构找到 AI 落地的切入点。
          </p>

          <div className="space-y-4">
            <div className="border border-[var(--border)] rounded-lg p-4">
              <h3 className="text-base font-medium text-[var(--text-primary)] mb-1">
                业务场景诊断
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                梳理你的业务流程，识别哪些环节可以用 AI 提效。
                我在异乡好居已经实践过的场景包括：AI 客服、智能推荐引擎、内容自动生成、数据分析自动化。
              </p>
            </div>

            <div className="border border-[var(--border)] rounded-lg p-4">
              <h3 className="text-base font-medium text-[var(--text-primary)] mb-1">
                团队 AI 能力建设
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                不是教你的团队写代码，而是让他们具备「这件事可以自动化」的思维。
                第一期实训结束后，主管们已经开始主动发现新的自动化场景。
              </p>
            </div>

            <div className="border border-[var(--border)] rounded-lg p-4">
              <h3 className="text-base font-medium text-[var(--text-primary)] mb-1">
                产品方法论输出
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Gate-Review 评审方法论、Vibe Coding 开发方法——这些我在实际产品构建中
                验证过的方法，可以帮助你的团队少走弯路。
              </p>
            </div>
          </div>
        </div>

        {/* 我的行业背景 */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
            为什么是我
          </h2>
          <div className="bg-[var(--bg-secondary)] rounded-lg p-6">
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] mt-0.5 shrink-0">—</span>
                <span>
                  异乡好居副总裁，负责留学渠道部，维护超过 3 万名合作伙伴
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] mt-0.5 shrink-0">—</span>
                <span>
                  异乡缴费负责人，5 年累计服务 18 万客户，交易金额超 75 亿
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] mt-0.5 shrink-0">—</span>
                <span>
                  用 Vibe Coding 独立构建了异乡人才（AI 驱动的留学生求职平台，10,645 个活跃岗位）
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] mt-0.5 shrink-0">—</span>
                <span>
                  完成第一期 AI 实训：10 位主管，4 周 8 节课，每人交付 4 个可用工具
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] mt-0.5 shrink-0">—</span>
                <span>
                  以非程序员身份，用 AI 编写了 18,000+ 行代码和 505 个测试用例
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 联系方式 */}
        <div className="border-t border-[var(--border)] pt-12">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
            联系我
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            如果你是留学机构、渠道商或院校代表，想了解 AI 如何在你的业务中落地，欢迎联系。
          </p>
          <a
            href="mailto:ceo@dingning.ai"
            className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors duration-200"
          >
            <Mail size={16} />
            ceo@dingning.ai
          </a>
        </div>
      </div>
    </section>
  );
}
