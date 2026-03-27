import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AboutBrief() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-6">
            关于我
          </h2>
          <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-4">
            我是 Ning Ding，异乡好居合伙人、异乡缴费负责人。
            在国际教育行业深耕多年，现在正做一件事：
            帮助这个行业的从业者学会用 AI 提升工作效率——从自己的团队开始。
          </p>
          <div className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] rounded-xl mb-6">
            <div className="w-1 h-12 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--cta)]" />
            <p className="text-base text-[var(--text-secondary)] leading-relaxed">
              第一期 Vibe Coding 实训已完成——<span className="text-[var(--text-primary)] font-medium">10 位主管，4 周 8 节课</span>，
              佣金分析时间从 <span className="text-[var(--text-primary)] font-medium">30 分钟降到 3 分钟</span>。
            </p>
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors duration-200 group"
          >
            了解完整经历
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </section>
  );
}
