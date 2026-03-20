"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

// WeChat SVG icon matching lucide-react style (24x24, stroke-based)
function WeChatIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 4C5.36 4 2 6.69 2 10c0 1.89 1.08 3.57 2.78 4.72L4 17l2.5-1.5c.94.31 1.96.5 3 .5.17 0 .33 0 .5-.02" />
      <path d="M15 8c3.87 0 7 2.46 7 5.5 0 1.7-1.04 3.22-2.67 4.22L20 20l-2.28-1.14c-.85.26-1.77.4-2.72.4-3.87 0-7-2.46-7-5.5" />
      <circle cx="7" cy="10" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="11" cy="10" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="13" cy="13.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="17" cy="13.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WeChatPopover({ iconSize = 18 }: { iconSize?: number }) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200"
        aria-label="WeChat"
        type="button"
      >
        <WeChatIcon size={iconSize} />
      </button>
      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl shadow-lg p-3 flex flex-col items-center gap-2 animate-in fade-in">
          <Image
            src="/images/wechat-qr.png"
            alt="微信二维码"
            width={160}
            height={160}
            className="rounded-lg"
          />
          <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">微信扫码添加</span>
        </div>
      )}
    </div>
  );
}

export { WeChatIcon };
