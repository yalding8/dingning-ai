import { describe, it, expect, vi, beforeEach } from "vitest";
import { incrementViews, getViews } from "@/lib/views";

function createMockRedis(store: Record<string, number> = {}) {
  return {
    incr: vi.fn(async (key: string) => {
      store[key] = (store[key] || 0) + 1;
      return store[key];
    }),
    get: vi.fn(async (key: string) => store[key] ?? null),
  };
}

describe("views", () => {
  let store: Record<string, number>;
  let redis: ReturnType<typeof createMockRedis>;

  beforeEach(() => {
    store = {};
    redis = createMockRedis(store);
  });

  it("incrementViews returns new count after increment", async () => {
    const count = await incrementViews("my-post", redis);
    expect(count).toBe(1);

    const count2 = await incrementViews("my-post", redis);
    expect(count2).toBe(2);
  });

  it("getViews returns 0 for unvisited post", async () => {
    const count = await getViews("never-seen", redis);
    expect(count).toBe(0);
  });

  it("getViews returns correct count after increments", async () => {
    await incrementViews("popular-post", redis);
    await incrementViews("popular-post", redis);
    await incrementViews("popular-post", redis);

    const count = await getViews("popular-post", redis);
    expect(count).toBe(3);
  });
});
