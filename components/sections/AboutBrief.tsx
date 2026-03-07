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
            我是 Neil Ding，异乡好居副总裁，同时也是 dingning.ai 的创始人。
            异乡好居服务全球
            <span className="font-medium text-[var(--text-primary)]"> 27 个国家</span>的留学生，
            累计交易规模超
            <span className="font-medium text-[var(--text-primary)]"> 70 亿</span>，
            服务超过
            <span className="font-medium text-[var(--text-primary)]"> 26 万</span>名留学生。
          </p>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-6">
            我相信一个人也可以成为一个公司。白天推动 AI 在国际教育行业的落地，
            晚上用 Vibe Coding 亲手构建产品。这个网站记录我的实践与思考。
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
