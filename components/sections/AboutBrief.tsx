import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AboutBrief() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-6">
            关于我
          </h2>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-4">
            我是 Ning Ding，异乡好居副总裁，负责留学渠道部，维护超过
            <span className="font-medium text-[var(--text-primary)]"> 3 万</span>名合作伙伴。
            异乡好居累计服务超过
            <span className="font-medium text-[var(--text-primary)]"> 40 万</span>名客户，
            覆盖
            <span className="font-medium text-[var(--text-primary)]"> 27 个国家和地区</span>。
            同时负责异乡缴费，5 年累计服务
            <span className="font-medium text-[var(--text-primary)]"> 18 万</span>客户，
            交易金额超
            <span className="font-medium text-[var(--text-primary)]"> 75 亿</span>。
          </p>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-4">
            我正在做一件事：让国际教育产业链的从业者学会用 AI 提升工作效率。
            已经完成了第一期 Vibe Coding 实训——10 位主管，4 周 8 节课，
            佣金分析时间从 30 分钟降到 3 分钟。
          </p>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-6">
            这个网站记录我的实践与思考，也是我向行业布道 AI 的阵地。
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors duration-200"
          >
            了解更多
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
