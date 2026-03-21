"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

export function PostViewCount({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/views/${slug}`)
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => setCount(null));
  }, [slug]);

  if (count === null) return null;

  return (
    <span className="inline-flex items-center gap-1">
      <Eye size={12} />
      {count}
    </span>
  );
}
