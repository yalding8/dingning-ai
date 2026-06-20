import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Shared rate limiting backed by Upstash Redis.
 *
 * Design: fail-open. When Upstash isn't configured (or unreachable), requests
 * are allowed rather than rejected — this is a personal site, and a Redis
 * outage must not take down newsletter signups or page views. The limiter
 * activates automatically once UPSTASH_REDIS_REST_URL/TOKEN are present.
 */

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

// `undefined` = not yet initialized; `null` = Redis not configured (fail-open).
let newsletterLimiter: Ratelimit | null | undefined;
let viewsLimiter: Ratelimit | null | undefined;

export function getNewsletterLimiter(): Ratelimit | null {
  if (newsletterLimiter === undefined) {
    const redis = getRedis();
    newsletterLimiter = redis
      ? new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(5, "1 h"),
          prefix: "rl:newsletter",
          analytics: false,
        })
      : null;
  }
  return newsletterLimiter;
}

export function getViewsLimiter(): Ratelimit | null {
  if (viewsLimiter === undefined) {
    const redis = getRedis();
    viewsLimiter = redis
      ? new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(10, "1 m"),
          prefix: "rl:views",
          analytics: false,
        })
      : null;
  }
  return viewsLimiter;
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0].trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || "anonymous";
}

/**
 * Returns true if the request is allowed. Fail-open: a null limiter (Redis not
 * configured) always allows.
 */
export async function allow(
  limiter: Ratelimit | null,
  identifier: string
): Promise<boolean> {
  if (!limiter) return true;
  const { success } = await limiter.limit(identifier);
  return success;
}
