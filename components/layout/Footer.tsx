import { Github, Mail } from "lucide-react";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/yalding8", icon: Github },
  { label: "Email", href: "mailto:ceo@dingning.ai", icon: Mail },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-[var(--text-muted)]">
            © {new Date().getFullYear()} Neil Ding · dingning.ai
          </div>

          <div className="flex items-center gap-4">
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
    </footer>
  );
}
