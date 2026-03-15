"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200"
      title="复制链接"
    >
      {copied ? (
        <>
          <Check size={14} />
          已复制
        </>
      ) : (
        <>
          <Link2 size={14} />
          复制链接
        </>
      )}
    </button>
  );
}
