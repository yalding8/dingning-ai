import { describe, it, expect } from "vitest";
import { getAllTags } from "@/lib/tags";

describe("getAllTags", () => {
  it("returns a sorted array of unique tags", () => {
    const tags = getAllTags();
    expect(Array.isArray(tags)).toBe(true);
    // check sorted
    for (let i = 1; i < tags.length; i++) {
      expect(tags[i - 1].localeCompare(tags[i])).toBeLessThanOrEqual(0);
    }
    // check unique
    const unique = new Set(tags);
    expect(unique.size).toBe(tags.length);
  });

  it("returns at least one tag", () => {
    const tags = getAllTags();
    expect(tags.length).toBeGreaterThan(0);
  });
});
