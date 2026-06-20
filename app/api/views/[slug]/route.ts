import { NextRequest, NextResponse } from "next/server";
import { incrementViews, getViews } from "@/lib/views";
import { allow, clientIp, getViewsLimiter } from "@/lib/ratelimit";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  if (!process.env.UPSTASH_REDIS_REST_URL) {
    console.log("[Views] Increment request (Upstash not configured)");
    return NextResponse.json({ count: 0 });
  }

  // 速率限制（按 IP + slug）——防止脚本无限 INCR 刷假浏览量 / 耗 Redis 配额。
  // 超限时不再自增，返回当前真实计数。
  if (!(await allow(getViewsLimiter(), `${clientIp(req)}:${slug}`))) {
    return NextResponse.json({ count: await getViews(slug) }, { status: 429 });
  }

  const count = await incrementViews(slug);
  return NextResponse.json({ count });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  if (!process.env.UPSTASH_REDIS_REST_URL) {
    return NextResponse.json({ count: 0 });
  }

  const count = await getViews(slug);
  return NextResponse.json({ count });
}
