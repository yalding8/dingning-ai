import type { Metadata } from "next";
import Image from "next/image";
import { NewsletterForm } from "@/components/ui/NewsletterForm";

export const metadata: Metadata = {
  title: "关于我",
  description:
    "Neil Ding，异乡好居 VP，dingning.ai CEO。白天推动 AI 在国际教育行业的落地，晚上用 Vibe Coding 亲手构建产品。",
};

const timeline = [
  {
    year: "至今",
    title: "dingning.ai CEO",
    description: "一个人也可以成为一个公司。用 AI 构建个人产品矩阵。",
  },
  {
    year: "至今",
    title: "异乡好居 VP",
    description:
      "管理业务线，推动 AI 在留学生服务中的落地。服务 27 国、70 亿交易规模、26 万留学生。",
  },
  {
    year: "延伸",
    title: "异乡缴费 · 异乡人才",
    description:
      "留学生海外账单支付服务、留学生求职就业平台。基于异乡好居生态延伸。",
  },
  {
    year: "探索",
    title: "Vibe Coding · AI 培训",
    description:
      "以非程序员身份用 AI 构建真实产品。在公司内部推动管理干部 AI 赋能计划。",
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
                alt="Neil Ding"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4">
              Neil Ding
            </h1>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed">
              异乡好居副总裁，dingning.ai 创始人。白天在异乡好居推动 AI
              在国际教育行业的落地；晚上用 Vibe Coding 亲手构建产品。
              我相信一个人也可以成为一个公司。
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
