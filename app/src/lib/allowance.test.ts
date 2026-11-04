import { describe, expect, it } from "vitest";
import {
  checkFreePreviewAllowance,
  checkMonthlyAllowance,
  currentAllowanceMonthKey,
  FREE_PREVIEW_ILLUSTRATIONS_PER_STORY,
  LIFETIME_MONTHLY_CAP,
} from "./allowance";

const ZERO_USAGE = { books: 0, narrations: 0, motionScenes: 0 };

describe("checkMonthlyAllowance", () => {
  it("blocks every monthly kind for the free plan, regardless of usage", () => {
    for (const kind of ["book", "narration", "motion_scene"] as const) {
      const result = checkMonthlyAllowance("free", kind, ZERO_USAGE);
      expect(result.allowed).toBe(false);
    }
  });

  it("allows a lifetime-plan generation when usage is below the cap", () => {
    expect(checkMonthlyAllowance("lifetime", "book", { ...ZERO_USAGE, books: 1 })).toEqual({
      allowed: true,
    });
    expect(
      checkMonthlyAllowance("lifetime", "narration", { ...ZERO_USAGE, narrations: 1 }),
    ).toEqual({ allowed: true });
    expect(checkMonthlyAllowance("lifetime", "motion_scene", ZERO_USAGE)).toEqual({
      allowed: true,
    });
  });

  it("blocks exactly at the cap, not just over it — the off-by-one case that matters most", () => {
    expect(
      checkMonthlyAllowance("lifetime", "book", {
        ...ZERO_USAGE,
        books: LIFETIME_MONTHLY_CAP.books,
      }).allowed,
    ).toBe(false);
    expect(
      checkMonthlyAllowance("lifetime", "narration", {
        ...ZERO_USAGE,
        narrations: LIFETIME_MONTHLY_CAP.narrations,
      }).allowed,
    ).toBe(false);
    expect(
      checkMonthlyAllowance("lifetime", "motion_scene", {
        ...ZERO_USAGE,
        motionScenes: LIFETIME_MONTHLY_CAP.motionScenes,
      }).allowed,
    ).toBe(false);
  });

  it("allows one less than the cap", () => {
    expect(
      checkMonthlyAllowance("lifetime", "book", {
        ...ZERO_USAGE,
        books: LIFETIME_MONTHLY_CAP.books - 1,
      }).allowed,
    ).toBe(true);
  });

  it("never allows past the cap even with wildly over-reported usage", () => {
    expect(
      checkMonthlyAllowance("lifetime", "book", { ...ZERO_USAGE, books: 999 }).allowed,
    ).toBe(false);
  });

  it("checking one kind's usage never leaks into another kind's result", () => {
    // 2 books used, 0 narrations used — narrations should still be allowed.
    const usage = { ...ZERO_USAGE, books: LIFETIME_MONTHLY_CAP.books };
    expect(checkMonthlyAllowance("lifetime", "book", usage).allowed).toBe(false);
    expect(checkMonthlyAllowance("lifetime", "narration", usage).allowed).toBe(true);
    expect(checkMonthlyAllowance("lifetime", "motion_scene", usage).allowed).toBe(true);
  });

  it("includes a human-readable reason whenever generation is blocked", () => {
    const result = checkMonthlyAllowance("lifetime", "book", {
      ...ZERO_USAGE,
      books: LIFETIME_MONTHLY_CAP.books,
    });
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.reason.length).toBeGreaterThan(0);
    }
  });
});

describe("checkFreePreviewAllowance", () => {
  it("allows the first preview illustration for a story", () => {
    expect(checkFreePreviewAllowance(0)).toEqual({ allowed: true });
  });

  it("blocks once the per-story cap is reached", () => {
    expect(checkFreePreviewAllowance(FREE_PREVIEW_ILLUSTRATIONS_PER_STORY).allowed).toBe(false);
  });

  it("blocks past the cap too", () => {
    expect(checkFreePreviewAllowance(FREE_PREVIEW_ILLUSTRATIONS_PER_STORY + 5).allowed).toBe(
      false,
    );
  });
});

describe("currentAllowanceMonthKey", () => {
  it("formats as YYYY-MM", () => {
    expect(currentAllowanceMonthKey(new Date("2026-03-15T12:00:00Z"))).toBe("2026-03");
  });

  it("pads single-digit months", () => {
    expect(currentAllowanceMonthKey(new Date("2026-01-01T00:00:00Z"))).toBe("2026-01");
  });

  it("uses UTC, not local time, for the month boundary", () => {
    // 11:30pm UTC on Dec 31 is still December in UTC even if it would
    // already be January in a positive-offset local timezone.
    expect(currentAllowanceMonthKey(new Date("2026-12-31T23:30:00Z"))).toBe("2026-12");
    // One hour later it's genuinely January, everywhere.
    expect(currentAllowanceMonthKey(new Date("2027-01-01T00:30:00Z"))).toBe("2027-01");
  });

  it("defaults to the current time when no date is given", () => {
    const key = currentAllowanceMonthKey();
    expect(key).toMatch(/^\d{4}-\d{2}$/);
  });
});
