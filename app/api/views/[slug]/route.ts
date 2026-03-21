import { NextRequest, NextResponse } from "next/server";
import { incrementViews, getViews } from "@/lib/views";

export async function POST(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  if (!process.env.UPSTASH_REDIS_REST_URL) {
    console.log(`[Views] Increment request: ${slug} (Upstash not configured)`);
    return NextResponse.json({ count: 0 });
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
