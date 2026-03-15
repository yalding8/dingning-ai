"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "博客", href: "/blog" },
  { label: "服务", href: "/services" },
  { label: "项目", href: "/projects" },
  { label: "资源", href: "/resources" },
  { label: "关于", href: "/about" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/blog") return pathname === "/blog" || pathname.startsWith("/blog/");
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-semibold text-[var(--text-primary)] tracking-tight"
          >
            Ning Ding
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm transition-colors duration-200",
                  isActive(item.href)
                    ? "text-[var(--accent)] font-medium"
                    : "text-[var(--text-secondary)] hover:text-[var(--accent)]"
                )}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="mailto:ceo@dingning.ai"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-[var(--cta)] hover:bg-[var(--cta-light)] px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Mail size={14} />
              联系我
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[var(--text-secondary)]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "关闭菜单" : "打开菜单"}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile nav */}
        <nav
          className={cn(
            "md:hidden overflow-hidden transition-all duration-200",
            isOpen ? "max-h-64 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm transition-colors duration-200",
                  isActive(item.href)
                    ? "text-[var(--accent)] font-medium"
                    : "text-[var(--text-secondary)] hover:text-[var(--accent)]"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
