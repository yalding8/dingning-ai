import Image from "next/image";
import { NewsletterForm } from "@/components/ui/NewsletterForm";

export function HeroSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* 形象照 */}
          <div className="shrink-0">
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] overflow-hidden">
              <Image
                src="/images/neil-ding-placeholder.svg"
                alt="Ning Ding"
                width={208}
                height={208}
                priority
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 文字内容 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--text-primary)] leading-tight tracking-tight">
              用 AI 重塑国际教育产业链
            </h1>
            <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
              Ning Ding · 异乡好居副总裁 · dingning.ai 创始人
              <br className="hidden md:block" />
              管理 3 万+合作伙伴，累计服务 40 万客户、交易 75 亿。
              <br className="hidden md:block" />
              我正在用 AI 改变这个行业的工作方式——从自己的团队开始。
            </p>

            {/* Newsletter */}
            <div className="w-full max-w-md">
              <p className="text-xs text-[var(--text-muted)] mb-2">
                每两周一封，分享 AI 在国际教育行业的真实实践
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
