import type { Metadata } from "next";
import Image from "next/image";
import { NewsletterForm } from "@/components/ui/NewsletterForm";

export const metadata: Metadata = {
  title: "关于",
  description:
    "Ning Ding，异乡好居副总裁，国际教育产业链 AI 布道者。管理 3 万+合作伙伴，累计服务 40 万客户、交易 75 亿，正在用 AI 改变这个行业的工作方式。",
};

const timeline = [
  {
    year: "至今",
    title: "国际教育 AI 布道者",
    description:
      "用 dingning.ai 记录 AI 在国际教育行业的实践，推动行业从业者拥抱 AI。完成第一期 Vibe Coding 实训，10 位主管交付 4 个实际业务工具。",
  },
  {
    year: "至今",
    title: "异乡好居副总裁",
    description:
      "负责留学渠道部，维护超过 3 万名合作伙伴。异乡好居服务全球留学生海外住宿预订，累计服务超 40 万名客户，覆盖 27 个国家和地区。",
  },
  {
    year: "5年+",
    title: "异乡缴费负责人",
    description:
      "累计服务超 18 万名客户留学缴费，交易金额超 75 亿。构建了中立的缴费比价平台，聚合全球 5,000+ 院校认可的官方收款渠道。",
  },
  {
    year: "实践",
    title: "Vibe Coding · AI 产品构建",
    description:
      "以非程序员身份用 AI 构建异乡人才（10,645 个活跃岗位的留学生求职平台）、异乡点评等产品。18,000+ 行代码，505 个测试用例，全部与 AI 协作完成。",
  },
];

export default function AboutPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
        {/* 头部 */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16">
          <div className="shrink-0">
            <div className="w-32 h-32 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] overflow-hidden">
              <Image
                src="/images/neil-ding-placeholder.svg"
                alt="Ning Ding"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4">
              Ning Ding
            </h1>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed">
              异乡好居副总裁，dingning.ai 创始人。负责留学渠道部，维护超过 3 万名合作伙伴；
              同时负责异乡缴费，5 年累计服务 18 万客户、交易 75 亿。
              我正在做一件事：帮助中国国际教育产业链的从业者学会运用 AI，
              从自己的团队开始，向整个行业布道。
            </p>
          </div>
        </div>

        {/* 时间线 */}
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-8">
          我的经历
        </h2>
        <div className="space-y-8 mb-16">
          {timeline.map((item, index) => (
            <div key={index} className="flex gap-6">
              <div className="shrink-0 w-16 text-right">
                <span className="text-xs font-medium text-[var(--accent)]">
                  {item.year}
                </span>
              </div>
              <div className="border-l border-[var(--border)] pl-6 pb-2">
                <h3 className="text-base font-medium text-[var(--text-primary)] mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 联系方式 */}
        <div className="border-t border-[var(--border)] pt-12">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
            保持联系
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            每两周一封，只分享真实实践
          </p>
          <NewsletterForm />
          <p className="text-xs text-[var(--text-muted)] mt-4">
            商务合作：
            <a
              href="mailto:ceo@dingning.ai"
              className="text-[var(--accent)] hover:text-[var(--accent-light)]"
            >
              ceo@dingning.ai
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
