import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { COMMERCIAL_ADDON, PLANS } from "@/lib/plans";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Cyliagen Story" },
      {
        name: "description",
        content:
          "$89, once. A standing monthly allowance of books, narrations and motion scenes, owned for life — no subscription.",
      },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Logo />
          <Button variant="ghost" asChild>
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-8 lg:px-8">
        <Reveal>
          <h1 className="max-w-2xl text-5xl font-semibold tracking-tight">
            Pay once. Keep making books, every month, for life.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Most AI storybook tools sell you a monthly pool of credits that expires whether you use
            it or not. Cyliagen Story is the opposite of a subscription: one payment unlocks a standing
            monthly allowance that's yours for as long as your account exists.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {PLANS.map((plan, index) => (
            <Reveal key={plan.id} delay={index * 100}>
              <div
                className={`flex h-full flex-col rounded-2xl border p-8 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  plan.id === "lifetime" ? "border-primary bg-card" : "bg-card/60"
                }`}
              >
                {plan.id === "lifetime" && (
                  <Badge className="mb-4 w-fit" variant="default">
                    Most chosen
                  </Badge>
                )}
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.cadence}</span>
                </p>
                <p className="mt-3 text-sm text-muted-foreground">{plan.tagline}</p>

                <p className="mt-6 rounded-lg bg-secondary px-4 py-3 text-xs font-medium text-secondary-foreground">
                  {plan.cap}
                </p>

                <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature.label} className="flex items-start gap-2.5">
                      {feature.included ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground/70"}>
                        {feature.label}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="mt-8"
                  size="lg"
                  variant={plan.id === "lifetime" ? "default" : "outline"}
                >
                  <Link to="/auth">{plan.cta}</Link>
                </Button>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
          The monthly allowance resets each month and doesn't roll over or stack. It's sized for how
          families actually use Cyliagen Story — a book or two a month, read and re-read — not for bulk
          production, which is what keeps one $89 payment honorable indefinitely.
        </p>

        <Reveal className="mx-auto mt-16 max-w-3xl rounded-2xl border border-dashed bg-card/40 p-8">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <p className="text-sm font-semibold">Optional add-on</p>
          </div>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-semibold">{COMMERCIAL_ADDON.name}</h2>
            <p className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold tracking-tight">
                {COMMERCIAL_ADDON.price}
              </span>
              <span className="text-sm text-muted-foreground">{COMMERCIAL_ADDON.cadence}</span>
            </p>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{COMMERCIAL_ADDON.tagline}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <ul className="flex flex-col gap-2 text-sm">
              {COMMERCIAL_ADDON.included.map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-2 text-sm">
              {COMMERCIAL_ADDON.excluded.map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                  <span className="text-muted-foreground/80">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Applied per finished book, from that book's page in your studio once it's complete.
          </p>
        </Reveal>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground lg:px-8">
          <Logo />
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/terms" className="transition hover:text-foreground">
              Terms
            </Link>
            <Link to="/privacy" className="transition hover:text-foreground">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
