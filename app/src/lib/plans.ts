// CyliaTales pricing. Unlike ReadKidz's monthly-credit subscriptions
// (Personal/Pro/Mega/Max, $10-$99 EVERY month, credits expire unused),
// CyliaTales is paid once and keeps working: a monthly production
// allowance included for life, reset monthly, never billed again.
// The allowance is capped — not unlimited — because every page, narration
// and motion scene is generated individually, not templated; the cap is
// what keeps a single $89 payment sustainable to honor indefinitely while
// still comfortably covering how a family actually uses it (a book or two
// a month, not a print farm).

export type PlanFeature = {
  label: string;
  included: boolean;
};

export type Plan = {
  id: "free" | "lifetime";
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  cap: string;
  features: PlanFeature[];
  cta: string;
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Preview Studio",
    price: "$0",
    cadence: "no card required",
    tagline: "Write the story and see the art direction before you pay for anything.",
    cap: "1 illustrated preview page, watermarked",
    features: [
      { label: "Unlimited story drafting & character writing", included: true },
      { label: "Full art-direction picker, all style boards", included: true },
      { label: "World bible: cast, places & props", included: true },
      { label: "1 watermarked preview illustration per story", included: true },
      { label: "Full book illustration (every page)", included: false },
      { label: "Narration & motion scenes", included: false },
      { label: "Print-ready PDF export, no watermark", included: false },
    ],
    cta: "Start free",
  },
  {
    id: "lifetime",
    name: "CyliaTales Lifetime",
    price: "$89",
    cadence: "one time — pay once, keep every month, forever",
    tagline:
      "Not a subscription and not a single book: a standing monthly allowance, owned for life.",
    cap: "Every month, for life: 2 books, 2 narrations, 1 motion scene",
    features: [
      { label: "Everything in Preview Studio", included: true },
      { label: "2 full books per month, up to 20 pages, same cast throughout", included: true },
      { label: "2 narrated read-aloud tracks per month", included: true },
      { label: "1 signature animated motion scene per month", included: true },
      { label: "Print-ready, no-watermark PDF export on every book", included: true },
      { label: "Personal & family use, included", included: true },
      { label: "No recurring charge, ever, for the life of your account", included: true },
    ],
    cta: "Get lifetime access",
  },
];

export const COMMERCIAL_ADDON = {
  name: "Commercial Rights",
  price: "$49",
  cadence: "one time, per book",
  tagline:
    "Lifetime access covers reading it to your own kids and gifting it to family. Selling it, publishing it, or using it in a product is a different right — this adds that, book by book.",
  included: [
    "Resell, publish, or print-and-sell the specific book you apply it to",
    "Full commercial license for that book's text and illustrations",
    "No recurring fee — applies once, to that book, for good",
  ],
  excluded: [
    "Doesn't cover any photo, likeness, or file you uploaded yourself — that stays whoever's it already was",
    "Doesn't retroactively cover other books — apply it per book you intend to sell",
  ],
};
