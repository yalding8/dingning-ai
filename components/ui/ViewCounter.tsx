"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

export function ViewCounter({ slug }: { slug: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(`/api/views/${slug}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => setCount(0));
  }, [slug]);

  return (
    <span className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)]">
      <Eye size={14} />
      {count}
    </span>
  );
}
