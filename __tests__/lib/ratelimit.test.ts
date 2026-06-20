import { describe, it, expect } from "vitest";
import { clientIp, allow } from "@/lib/ratelimit";
import { isValidEmail } from "@/lib/validation";

describe("isValidEmail", () => {
  it("accepts normal addresses", () => {
    expect(isValidEmail("a@b.com")).toBe(true);
    expect(isValidEmail("ning.ding@dingning.ai")).toBe(true);
    expect(isValidEmail("  trimmed@x.io  ")).toBe(true);
  });

  it("rejects non-strings and empty", () => {
    expect(isValidEmail(undefined)).toBe(false);
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(123)).toBe(false);
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("   ")).toBe(false);
  });

  it("rejects malformed addresses", () => {
    expect(isValidEmail("no-at-sign")).toBe(false);
    expect(isValidEmail("a@b")).toBe(false);
    expect(isValidEmail("a @b.com")).toBe(false);
    expect(isValidEmail("a@@b.com")).toBe(false);
  });

  it("rejects absurdly long input", () => {
    expect(isValidEmail("a".repeat(250) + "@b.com")).toBe(false);
  });
});

describe("clientIp", () => {
  const reqWith = (headers: Record<string, string>) =>
    new Request("https://x.test", { headers });

  it("takes the first x-forwarded-for entry", () => {
    expect(clientIp(reqWith({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }))).toBe(
      "1.2.3.4"
    );
  });

  it("falls back to x-real-ip", () => {
    expect(clientIp(reqWith({ "x-real-ip": "9.9.9.9" }))).toBe("9.9.9.9");
  });

  it("returns 'anonymous' when no IP headers present", () => {
    expect(clientIp(reqWith({}))).toBe("anonymous");
  });
});

describe("allow (fail-open)", () => {
  it("allows when limiter is null (Redis not configured)", async () => {
    expect(await allow(null, "any-id")).toBe(true);
  });

  it("delegates to the limiter when present", async () => {
    const fakeAllow = { limit: async () => ({ success: true }) } as never;
    const fakeDeny = { limit: async () => ({ success: false }) } as never;
    expect(await allow(fakeAllow, "id")).toBe(true);
    expect(await allow(fakeDeny, "id")).toBe(false);
  });
});
