import { Github, Mail, BookOpen } from "lucide-react";
import { NewsletterForm } from "@/components/ui/NewsletterForm";

const socialLinks = [
  { label: "微信公众号", description: "深度内容", icon: BookOpen },
  { label: "GitHub", description: "开源项目", icon: Github, href: "https://github.com/yalding8" },
  { label: "Email", description: "商务合作", icon: Mail, href: "mailto:ceo@dingning.ai" },
];

export function ConnectSection() {
  return (
    <section className="py-16 md:py-24 bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-3">
            每两周，一封来自 AI 实验场的信
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8">
            不群发、不卖课、只分享真实实践
          </p>

          <div className="flex justify-center mb-12">
            <NewsletterForm />
          </div>

          {/* 社交链接 */}
          <div className="flex items-center justify-center gap-8">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href || "#"}
                target={link.href ? "_blank" : undefined}
                rel={link.href ? "noopener noreferrer" : undefined}
                className="flex flex-col items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200"
              >
                <link.icon size={20} />
                <span className="text-xs">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
