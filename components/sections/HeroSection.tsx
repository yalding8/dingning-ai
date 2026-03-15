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
                src="/neil-ding.jpg"
                alt="Ning Ding"
                width={208}
                height={208}
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAACKADAAQAAAABAAAACgAAAAD/wAARCAAKAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwACAgICAgIDAgIDBQMDAwUGBQUFBQYIBgYGBgYICggICAgICAoKCgoKCgoKDAwMDAwMDg4ODg4PDw8PDw8PDw8P/9sAQwECAgIEBAQHBAQHEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/90ABAAB/9oADAMBAAIRAxEAPwDyzwb4i1zxRpVp4QWT7H47uWaZllklgsmRVjKREjJRiikHjCuCuPmrvv8AhWv7QX9zR/8Awazf/G6+I28VeKLfwrE0GsXkZeK4YlbiRcsJ8gnDdQec+tcD/wAJ/wCO/wDoY9S/8DJv/iq+aVCndrlR+p43EwUkqcWlbvf57H//2Q=="
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
              Ning Ding · 异乡好居合伙人 · dingning.ai 主理人
              <br className="hidden md:block" />
              管理 3 万+合作伙伴，累计服务 40 万客户、交易 75 亿。
              <br className="hidden md:block" />
              我正在用 AI 改变这个行业的工作方式——从自己的团队开始。
            </p>

            {/* Newsletter */}
            <div className="w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
              <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                订阅 AI 实践通讯
              </p>
              <p className="text-xs text-[var(--text-secondary)] mb-3">
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
