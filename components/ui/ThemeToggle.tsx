"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored === "dark" || (!stored && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "切换到亮色模式" : "切换到暗色模式"}
      className="relative w-9 h-9 flex items-center justify-center rounded-lg
                 text-[var(--text-secondary)] hover:text-[var(--accent)]
                 hover:bg-[var(--bg-tertiary)] transition-all duration-200"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
