"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "订阅失败，请稍后重试。");
        setStatus("error");
      }
    } catch {
      setErrorMsg("网络错误，请稍后重试。");
      setStatus("error");
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-md">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === "loading"}
          className="flex-1 px-4 py-2.5 text-sm bg-white border border-[var(--border)] rounded-lg
                     text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                     focus:outline-none focus:border-[var(--accent)] transition-colors duration-200
                     disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2.5 text-sm font-medium text-white bg-[var(--accent)] rounded-lg
                     hover:bg-[var(--accent-light)] transition-colors duration-200
                     flex items-center gap-2 disabled:opacity-50"
        >
          {status === "loading" ? (
            <>
              <Loader2 size={14} className="animate-spin" />
            </>
          ) : (
            <>
              订阅
              <Send size={14} />
            </>
          )}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-[var(--error)]">{errorMsg}</p>
      )}
    </form>
  );
}
