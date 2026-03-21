"use client";

import { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";
import { getShareUrl, type ShareData } from "@/lib/share";
import { ShareCard } from "./ShareCard";

type ShareMenuProps = ShareData;

export function ShareMenu({ url, title, excerpt }: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cardPlatform, setCardPlatform] = useState<"wechat" | "xiaohongshu" | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlatformShare = (platform: "twitter" | "weibo" | "linkedin") => {
    window.open(getShareUrl(platform, { url, title, excerpt }), "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const platformButtons = [
    { key: "twitter" as const, label: "Twitter", icon: "𝕏" },
    { key: "weibo" as const, label: "微博", icon: "微" },
    { key: "linkedin" as const, label: "LinkedIn", icon: "in" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="分享"
        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200"
      >
        <Share2 size={14} />
        分享
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg shadow-lg p-2 min-w-[160px]">
          {platformButtons.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => handlePlatformShare(key)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
            >
              <span className="w-5 text-center text-xs font-bold">{icon}</span>
              {label}
            </button>
          ))}

          <button
            onClick={() => { setCardPlatform("wechat"); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
          >
            <span className="w-5 text-center text-xs">💬</span>
            微信
          </button>

          <button
            onClick={() => { setCardPlatform("xiaohongshu"); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
          >
            <span className="w-5 text-center text-xs">📕</span>
            小红书
          </button>

          <div className="border-t border-[var(--border)] my-1" />

          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
          >
            {copied ? (
              <>
                <Check size={14} className="w-5" />
                已复制
              </>
            ) : (
              <>
                <Link2 size={14} className="w-5" />
                复制链接
              </>
            )}
          </button>
        </div>
      )}

      {cardPlatform && (
        <ShareCard
          url={url}
          title={title}
          excerpt={excerpt}
          platform={cardPlatform}
          onClose={() => setCardPlatform(null)}
        />
      )}
    </div>
  );
}
