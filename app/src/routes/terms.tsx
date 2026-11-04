import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Service — CyliaTales" }] }),
  component: Terms,
});

function Terms() {
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
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Terms of Service</h1>
        <p className="mt-3 rounded-lg border border-dashed bg-card/60 px-4 py-3 text-sm text-muted-foreground">
          Draft — written to match the product as built, pending review by qualified legal counsel
          in your jurisdiction before this is relied on as a binding agreement.
        </p>

        <div className="mt-8 flex flex-col gap-6 text-sm leading-6 text-foreground/90">
          <section>
            <h2 className="text-base font-semibold">1. Who this is for</h2>
            <p className="mt-2 text-muted-foreground">
              CyliaTales is intended for use by parents, guardians, and educators creating
              storybooks for children — not for direct, unsupervised use by children themselves. An
              account holder must be an adult.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold">2. Plans and billing</h2>
            <p className="mt-2 text-muted-foreground">
              Preview Studio is free. CyliaTales Lifetime is a single, one-time payment of $89 that
              is not billed again; it includes a monthly production allowance (currently 2 books, 2
              narrations, and 1 motion scene) that resets each month, does not roll over, and is not
              transferable between accounts. We may adjust the allowance for new purchases going
              forward, but will not reduce it for an account that has already paid. Commercial
              Rights is a separate, optional $49 one-time add-on applied per book; it does not apply
              retroactively or automatically to other books.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold">3. Ownership of what you make</h2>
            <p className="mt-2 text-muted-foreground">
              You own the stories, characters, and illustrations you create for personal and family
              use under any plan. Reselling, publishing, or otherwise commercially exploiting a
              specific book requires the Commercial Rights add-on for that book. Content you upload
              yourself (photos, reference art, voice samples) remains yours; we don't acquire
              ownership of it.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold">4. Voice cloning</h2>
            <p className="mt-2 text-muted-foreground">
              Creating a cloned voice requires your explicit, recorded consent at the time of
              upload. Don't upload a voice sample unless you have the right to do so — your own
              voice, or another person's with their clear permission.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold">5. Acceptable use</h2>
            <p className="mt-2 text-muted-foreground">
              CyliaTales is a children's storytelling tool. Don't use it to generate content that is
              sexual, violent, hateful, or otherwise inappropriate for a children's product. We may
              remove content or suspend accounts that violate this.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold">6. Changes</h2>
            <p className="mt-2 text-muted-foreground">
              We'll post changes to these terms on this page. Material changes affecting paid
              Lifetime accounts will be communicated directly, not just posted silently.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
