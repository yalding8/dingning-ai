"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 接入 ConvertKit API
    if (email) {
      setStatus("success");
      setEmail("");
    }
  };

  if (status === "success") {
    return (
      <p className="text-sm text-[var(--success)]">
        感谢订阅！请查看邮箱确认。
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 px-4 py-2.5 text-sm bg-white border border-[var(--border)] rounded-lg
                   text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                   focus:outline-none focus:border-[var(--accent)] transition-colors duration-200"
      />
      <button
        type="submit"
        className="px-4 py-2.5 text-sm font-medium text-white bg-[var(--accent)] rounded-lg
                   hover:bg-[var(--accent-light)] transition-colors duration-200
                   flex items-center gap-2"
      >
        订阅
        <Send size={14} />
      </button>
    </form>
  );
}
