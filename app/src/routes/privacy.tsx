import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy — Cyliagen Story" }] }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-3xl items-center px-6 py-4">
          <Logo />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-8">
        <Link
          to="/"
          className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          ← Back
        </Link>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Privacy</h1>
        <p className="mt-3 rounded-lg border border-dashed bg-card/60 px-4 py-3 text-sm text-muted-foreground">
          Draft — written to match the product as built, pending review by qualified legal counsel
          for your jurisdiction (including children's-privacy rules such as COPPA or GDPR-K where
          they apply) before this is relied on as a compliance document.
        </p>

        <div className="mt-8 flex flex-col gap-6 text-sm leading-6 text-foreground/90">
          <section>
            <h2 className="text-base font-semibold">What we store, and why</h2>
            <p className="mt-2 text-muted-foreground">
              Your account profile, stories, characters, world items (places & props), voice
              profiles, and generated outputs are stored in your account so they're available across
              devices and sessions. Settings & Preferences (reading age, accessibility, production
              defaults, privacy choices) are stored the same way.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold">Who can see it</h2>
            <p className="mt-2 text-muted-foreground">
              By default, everything you create is private to your account. Nothing becomes visible
              on the public Explore shelf unless you explicitly publish it.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold">Children's data</h2>
            <p className="mt-2 text-muted-foreground">
              Cyliagen Story accounts belong to an adult. We don't knowingly collect personal
              information directly from children. Details a parent chooses to include about a child
              — a name used in a story, a reading age — are entered and controlled by the adult
              account holder.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold">Voice samples</h2>
            <p className="mt-2 text-muted-foreground">
              A voice sample is only stored after explicit recorded consent at upload. It's used to
              generate narration for your stories and isn't used to train shared models or exposed
              to other accounts.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold">Deleting your data</h2>
            <p className="mt-2 text-muted-foreground">
              You can delete individual stories, characters, voices, and world items from within the
              app. To close an account and remove the underlying data entirely, contact support.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
