import type { Metadata } from "next";
import Image from "next/image";
import { Mail } from "lucide-react";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { WeChatCopyButton } from "@/components/ui/WeChatPopover";

export const metadata: Metadata = {
  title: "关于",
  description:
    "Ning Ding，异乡好居合伙人，国际教育产业链 AI 布道者。管理 3 万+合作伙伴，累计服务 40 万客户、交易 75 亿，正在用 AI 改变这个行业的工作方式。",
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
    title: "异乡好居合伙人",
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
      "以非程序员身份用 AI 构建异乡人才（10,645 个活跃岗位的留学生求职平台）、异乡点评等产品。跨项目累计 18,000+ 行代码、505 个测试用例，全部与 AI 协作完成。",
  },
];

export default function AboutPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
        {/* 头部 */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16">
          <div className="shrink-0">
            <div className="w-40 h-40 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] overflow-hidden">
              <Image
                src="/neil-ding.jpg"
                alt="Ning Ding"
                width={160}
                height={160}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAACKADAAQAAAABAAAACgAAAAD/wAARCAAKAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwACAgICAgIDAgIDBQMDAwUGBQUFBQYIBgYGBgYICggICAgICAoKCgoKCgoKDAwMDAwMDg4ODg4PDw8PDw8PDw8P/9sAQwECAgIEBAQHBAQHEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/90ABAAB/9oADAMBAAIRAxEAPwDyzwb4i1zxRpVp4QWT7H47uWaZllklgsmRVjKREjJRiikHjCuCuPmrvv8AhWv7QX9zR/8Awazf/G6+I28VeKLfwrE0GsXkZeK4YlbiRcsJ8gnDdQec+tcD/wAJ/wCO/wDoY9S/8DJv/iq+aVCndrlR+p43EwUkqcWlbvf57H//2Q=="
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4">
              Ning Ding
            </h1>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed">
              异乡好居合伙人，dingning.ai 主理人。负责留学渠道部，维护超过 3 万名合作伙伴；
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
        <div id="contact" className="border-t border-[var(--border)] pt-12">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
            保持联系
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            每两周一封，只分享真实实践
          </p>
          <NewsletterForm />
          <div className="flex flex-col sm:flex-row gap-6 items-start mt-6">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Mail size={14} />
              商务合作：
              <a
                href="mailto:ceo@dingning.ai"
                className="text-[var(--accent)] hover:text-[var(--accent-light)]"
              >
                ceo@dingning.ai
              </a>
            </div>
            <WeChatCopyButton />
          </div>
        </div>
      </div>
    </section>
  );
}
