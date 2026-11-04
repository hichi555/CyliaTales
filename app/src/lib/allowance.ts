// Enforces the production caps advertised on the pricing page (plans.ts).
// Kept deliberately separate from plans.ts: that file is UI display copy,
// this is the business rule itself, so the two can be tested and reasoned
// about independently even though they must stay in sync by hand today.
//
// This module is pure — no Supabase, no network, no clock side effects
// beyond an injectable `now` — so it's fully unit-testable without mocking
// a database, and safe to call from both server functions and, if ever
// useful, from UI code that wants to preview "would this be allowed?".

export type PlanId = "free" | "lifetime";

export type MonthlyGenerationKind = "book" | "narration" | "motion_scene";

export type MonthlyUsage = {
  books: number;
  narrations: number;
  motionScenes: number;
};

export type AllowanceResult = { allowed: true } | { allowed: false; reason: string };

/**
 * CyliaTales Lifetime's standing monthly allowance (plans.ts: "Every month,
 * for life: 2 books, 2 narrations, 1 motion scene"). Resets each calendar
 * month in UTC — see {@link currentAllowanceMonthKey} — with no rollover.
 */
export const LIFETIME_MONTHLY_CAP: Readonly<MonthlyUsage> = Object.freeze({
  books: 2,
  narrations: 2,
  motionScenes: 1,
});

/**
 * The free "Preview Studio" plan's only generation capability (plans.ts:
 * "1 watermarked preview illustration per story"). This cap is scoped to a
 * single story, not the calendar month, so it's checked separately from
 * {@link checkMonthlyAllowance}.
 */
export const FREE_PREVIEW_ILLUSTRATIONS_PER_STORY = 1;

const KIND_LABEL: Record<MonthlyGenerationKind, string> = {
  book: "books",
  narration: "narrations",
  motion_scene: "motion scenes",
};

function usedForKind(usage: MonthlyUsage, kind: MonthlyGenerationKind): number {
  switch (kind) {
    case "book":
      return usage.books;
    case "narration":
      return usage.narrations;
    case "motion_scene":
      return usage.motionScenes;
  }
}

/**
 * Checks whether a single generation action is covered by the person's
 * plan, given how much of their current calendar month's allowance they've
 * already used. Pass the caller's own fresh usage count — this function
 * does no reading or writing itself, so staleness/races are the caller's
 * responsibility (e.g. by counting inside the same transaction that will
 * record the new usage).
 */
export function checkMonthlyAllowance(
  planId: PlanId,
  kind: MonthlyGenerationKind,
  usageThisMonth: MonthlyUsage,
): AllowanceResult {
  if (planId === "free") {
    return {
      allowed: false,
      reason: `The free plan doesn't include ${KIND_LABEL[kind]}. Upgrade to CyliaTales Lifetime to unlock it.`,
    };
  }

  const used = usedForKind(usageThisMonth, kind);
  const limit = usedForKind(LIFETIME_MONTHLY_CAP, kind);

  if (used >= limit) {
    return {
      allowed: false,
      reason: `You've used ${used} of ${limit} ${KIND_LABEL[kind]} included this month. Your allowance resets at the start of next month — it doesn't roll over.`,
    };
  }

  return { allowed: true };
}

/**
 * Checks the free plan's per-story preview-illustration cap. Separate from
 * {@link checkMonthlyAllowance} because this one resets per story, not per
 * calendar month.
 */
export function checkFreePreviewAllowance(
  previewIllustrationsUsedForStory: number,
): AllowanceResult {
  if (previewIllustrationsUsedForStory >= FREE_PREVIEW_ILLUSTRATIONS_PER_STORY) {
    return {
      allowed: false,
      reason: `Each story gets ${FREE_PREVIEW_ILLUSTRATIONS_PER_STORY} free preview illustration. Upgrade to CyliaTales Lifetime for full book illustration.`,
    };
  }
  return { allowed: true };
}

/**
 * The calendar-month key a usage record falls into, e.g. "2026-10". Always
 * computed in UTC so the reset boundary is unambiguous regardless of the
 * server's local timezone — two servers in different regions must agree on
 * when a person's allowance rolls over.
 */
export function currentAllowanceMonthKey(now: Date = new Date()): string {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}
