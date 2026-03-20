import { Github, Mail } from "lucide-react";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { WeChatCopyButton } from "@/components/ui/WeChatPopover";

export function ConnectSection() {
  return (
    <section className="py-16 md:py-24 bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-3">
            每两周，一封来自 AI 实验场的信
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8">
            不群发、不灌水、只分享真实实践
          </p>

          <div className="flex justify-center mb-12">
            <NewsletterForm />
          </div>

          {/* 社交链接 */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            <a
              href="https://github.com/yalding8"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200"
            >
              <Github size={20} />
              <span className="text-xs">GitHub</span>
            </a>
            <a
              href="mailto:ceo@dingning.ai"
              className="flex flex-col items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200"
            >
              <Mail size={20} />
              <span className="text-xs">Email</span>
            </a>
            <WeChatCopyButton />
          </div>
        </div>
      </div>
    </section>
  );
}
