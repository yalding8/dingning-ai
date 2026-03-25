import Image from "next/image";
import { NewsletterForm } from "@/components/ui/NewsletterForm";

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-primary)] to-[var(--bg-secondary)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* 形象照 */}
          <div className="shrink-0">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--cta)] opacity-20 blur-md" />
              <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full bg-[var(--bg-tertiary)] border-2 border-[var(--border-strong)] overflow-hidden">
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
          </div>

          {/* 文字内容 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[var(--text-primary)] leading-[1.15] tracking-tight">
              用 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)]">AI</span> 重塑
              <br className="hidden md:block" />
              国际教育产业链
            </h1>
            <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
              Ning Ding · 异乡好居合伙人 · dingning.ai 主理人
            </p>

            {/* Key metrics */}
            <div className="flex flex-wrap gap-6 md:gap-8">
              <div>
                <div className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)]">3 万+</div>
                <div className="text-xs text-[var(--text-muted)]">合作伙伴</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)]">40 万</div>
                <div className="text-xs text-[var(--text-muted)]">累计服务客户</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)]">75 亿</div>
                <div className="text-xs text-[var(--text-muted)]">交易金额</div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-5">
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
