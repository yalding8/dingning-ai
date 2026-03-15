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
            我是 Ning Ding，异乡好居副总裁、异乡缴费负责人。
            在国际教育行业深耕多年，现在正做一件事：
            帮助这个行业的从业者学会用 AI 提升工作效率——从自己的团队开始。
          </p>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-4">
            第一期 Vibe Coding 实训已完成——10 位主管，4 周 8 节课，
            佣金分析时间从 30 分钟降到 3 分钟。
            这个网站记录我的实践与思考。
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors duration-200"
          >
            了解完整经历
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
