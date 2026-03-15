import Link from "next/link";
import { Github, Mail } from "lucide-react";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/yalding8", icon: Github },
  { label: "Email", href: "mailto:ceo@dingning.ai", icon: Mail },
];

const siteLinks = [
  { label: "博客", href: "/blog" },
  { label: "服务", href: "/services" },
  { label: "项目", href: "/projects" },
  { label: "资源", href: "/resources" },
  { label: "关于", href: "/about" },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-lg font-semibold text-[var(--text-primary)]">
              Ning Ding
            </Link>
            <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
              用 AI 重塑国际教育产业链
            </p>
          </div>

          {/* Site links */}
          <div>
            <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">导航</h4>
            <nav className="flex flex-col gap-2">
              {siteLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">联系</h4>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:ceo@dingning.ai"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200"
              >
                ceo@dingning.ai
              </a>
              <div className="flex items-center gap-3 mt-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200"
                    aria-label={link.label}
                  >
                    <link.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-6">
          <div className="text-sm text-[var(--text-muted)] text-center">
            © {new Date().getFullYear()} Ning Ding · dingning.ai
          </div>
        </div>
      </div>
    </footer>
  );
}
