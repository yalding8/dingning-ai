import { NextRequest, NextResponse } from "next/server";
import { getViewsMap } from "@/lib/views";

function dateSlugsBefore(days: number): string[] {
  const slugs: string[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    slugs.push(d.toISOString().slice(0, 10));
  }
  return slugs;
}

export async function GET(req: NextRequest) {
  const days = Math.min(
    parseInt(req.nextUrl.searchParams.get("days") ?? "8"),
    30
  );

  const dateSlugs = dateSlugsBefore(days);
  const viewsMap = await getViewsMap(dateSlugs.map((s) => `coffee:${s}`));

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const items = dateSlugs.map((slug) => ({
    slug,
    date: slug,
    views: viewsMap[`coffee:${slug}`] ?? 0,
  }));

  const weekItems = items.filter((i) => i.slug !== today).slice(-7);
  const weekly_avg =
    weekItems.length > 0
      ? Math.round(
          weekItems.reduce((s, i) => s + i.views, 0) / weekItems.length
        )
      : 0;

  const yesterdayItem = items.find((i) => i.slug === yesterday) ?? {
    slug: yesterday,
    date: yesterday,
    views: 0,
  };

  return NextResponse.json({ items, weekly_avg, yesterday: yesterdayItem });
}
