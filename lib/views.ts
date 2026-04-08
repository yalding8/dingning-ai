import { Redis } from "@upstash/redis";

type RedisLike = {
  incr: (key: string) => Promise<number>;
  get: (key: string) => Promise<number | null>;
  mget?: (...keys: string[]) => Promise<(number | null)[]>;
};

let defaultRedis: RedisLike | null = null;

function getDefaultRedis(): RedisLike {
  if (!defaultRedis) {
    defaultRedis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return defaultRedis;
}

function viewKey(slug: string) {
  return `views:${slug}`;
}

export async function incrementViews(
  slug: string,
  redis: RedisLike = getDefaultRedis()
): Promise<number> {
  return redis.incr(viewKey(slug));
}

export async function getViews(
  slug: string,
  redis: RedisLike = getDefaultRedis()
): Promise<number> {
  return (await redis.get(viewKey(slug))) ?? 0;
}

export async function getViewsMap(
  slugs: string[],
  redis: RedisLike = getDefaultRedis()
): Promise<Record<string, number>> {
  if (slugs.length === 0) return {};
  if (!process.env.UPSTASH_REDIS_REST_URL) return {};
  const keys = slugs.map(viewKey);
  const values = redis.mget
    ? await redis.mget(...keys)
    : await Promise.all(slugs.map((s) => redis.get(viewKey(s))));
  const out: Record<string, number> = {};
  slugs.forEach((slug, i) => {
    out[slug] = values[i] ?? 0;
  });
  return out;
}
