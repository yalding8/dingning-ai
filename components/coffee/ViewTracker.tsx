"use client";

import { useEffect } from "react";

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.hostname !== "localhost"
    ) {
      fetch(`/api/views/coffee:${slug}`, { method: "POST" }).catch(() => {});
    }
  }, [slug]);

  return null;
}
