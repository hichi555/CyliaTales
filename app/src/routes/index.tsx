import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  AudioLines,
  BookOpen,
  Check,
  Clapperboard,
  GraduationCap,
  Heart,
  LockKeyhole,
  PenLine,
  Play,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { BorderBeam } from "@/components/magicui/border-beam";
import { MagicCard } from "@/components/magicui/magic-card";
import { Button } from "@/components/ui/button";
import { ART_DIRECTION_BOARDS } from "@/lib/art-direction";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cyliagen Story — A story production studio for children" },
      {
        name: "description",
        content:
          "Create original children's books, consistent characters, narrated read-alouds and animated storyboards in one review-first studio.",
      },
      { property: "og:title", content: "Cyliagen Story — Stories with a production desk" },
      {
        property: "og:description",
        content: "Write, direct, illustrate, narrate and share original stories for children.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Cyliagen Story — Stories with a production desk" },
      {
        name: "twitter:description",
        content: "Write, direct, illustrate, narrate and share original stories for children.",
      },
    ],
  }),
  component: Landing,
});

const WORKSPACES = [
  {
    icon: PenLine,
    eyebrow: "01 · Write",
    title: "Shape the story before anything is rendered",
    body: "Start with a spark or bring a finished manuscript. Set the reader age, tone, length and cast, then review the story plan before making art.",
    link: "/stories/new" as const,
    cta: "Open story writer",
    tone: "gold",
  },
  {
    icon: UserRound,
    eyebrow: "02 · Direct",
    title: "Build characters that stay recognizable",
    body: "Define appearance, outfit, palette and personality. Add a private reference image or sketch, then reuse the approved character across every page and scene.",
    link: "/characters" as const,
    cta: "Open character atelier",
    tone: "blue",
  },
  {
    icon: BookOpen,
    eyebrow: "03 · Illustrate",
    title: "Make the page, not a pile of prompts",
    body: "Generate individual illustrations with your art direction and character references. Replace one page without rebuilding the rest of the book.",
    link: "/stories" as const,
    cta: "View story library",
    tone: "green",
  },
  {
    icon: Clapperboard,
    eyebrow: "04 · Move",
    title: "Turn approved pages into a storyboard",
    body: "Set the shot, camera movement, duration and action for each scene. Preview the sequence, animate selected scenes and export a shareable film.",
    link: "/labs" as const,
    cta: "Explore production",
    tone: "violet",
  },
];

const TRUST_POINTS = [
  { icon: LockKeyhole, label: "Private by default" },
  { icon: Sparkles, label: "Review before generation" },
  { icon: Heart, label: "Built for real family moments" },
  { icon: GraduationCap, label: "Useful in classrooms, too" },
];

const STORY_OUTPUTS = [
  {
    label: "Read-aloud book",
    detail: "Page turns, narration and a keepsake rhythm.",
    icon: BookOpen,
  },
  {
    label: "Moving scene",
    detail: "A planned shot with sound, motion and continuity.",
    icon: Clapperboard,
  },
  {
    label: "Learning extension",
    detail: "Gentle activities that follow the story’s real themes.",
    icon: GraduationCap,
  },
];

function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Logo />
          <nav aria-label="Main navigation" className="flex items-center gap-2">
            <a
              className="hidden px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground sm:inline-flex"
              href="#workflow"
            >
              How it works
            </a>
            <a
              className="hidden px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground sm:inline-flex"
              href="#workspaces"
            >
              Workspaces
            </a>
            <Link
              className="hidden px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground sm:inline-flex"
              to="/pricing"
            >
              Pricing
            </Link>
            <Button variant="ghost" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">
                Start creating <ArrowRight />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="bg-grain relative border-y border-border/70 bg-hero">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pb-28 lg:pt-20">
            <div className="relative z-10">
              <Reveal>
                <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> The AI studio for stories with a point of view
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-7 max-w-2xl text-5xl font-semibold leading-[0.98] tracking-[-0.03em] text-foreground md:text-7xl">
                  From one brave idea to a story people want to{" "}
                  <em className="font-display font-normal text-primary">revisit.</em>
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
                  Cyliagen Story turns a prompt, memory or sketch into a directed visual world — with
                  consistent characters, cinematic storyboards and a human checkpoint before anything
                  becomes final.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Button size="lg" className="shadow-[0_12px_28px_-16px_oklch(0.27_0.045_166/0.8)]" asChild>
                    <Link to="/auth">
                      Build your first world <ArrowRight />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                      <a href="#workflow">
                      <Play /> See how it works
                    </a>
                  </Button>
                </div>
              </Reveal>
              <Reveal delay={320}>
                <div className="mt-11 grid max-w-xl grid-cols-2 gap-x-5 gap-y-3 border-t border-border/70 pt-6 sm:grid-cols-4">
                  {TRUST_POINTS.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-start gap-2 text-xs leading-5 text-muted-foreground"
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {label}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            <Reveal delay={200} className="relative lg:pl-8">
              <div
                className="absolute -inset-6 rounded-[3rem] bg-accent/10 blur-3xl"
                aria-hidden="true"
              />
              <MagicCard className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-card p-2 shadow-[0_24px_80px_-28px_oklch(0.22_0.03_250/0.45)]">
                <figure>
                  <BorderBeam size={120} duration={11} colorFrom="var(--accent)" colorTo="var(--primary)" />
                    <img
                  src="/assets/cyliagen-story-hero.png"
                  alt="A luminous constellation of connected story worlds and narrative beats"
                  width={2560}
                  height={1440}
                  className="aspect-[4/3] w-full rounded-[1.25rem] object-cover"
                />
                <figcaption className="relative z-10 flex items-center justify-between gap-4 bg-card px-4 py-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      One brief · many finished forms
                    </p>
                    <p className="mt-1 font-display text-lg">Your world, with continuity built in</p>
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                    4 stages · 1 creative thread
                  </span>
                </figcaption>
                </figure>
              </MagicCard>
              <div className="absolute -top-5 -left-4 hidden rounded-2xl border border-border bg-card px-4 py-3 shadow-soft sm:block">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <AudioLines className="h-4 w-4" /> Narration ready
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Wren · warm and gentle</p>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="workspaces" className="mx-auto max-w-7xl scroll-mt-20 px-6 py-24 lg:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              One connected desk
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
              From first sentence to final scene.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              No black-box handoff. Each workspace has a clear job, a human checkpoint and a next
              step you can see.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {WORKSPACES.map(({ icon: Icon, eyebrow, title, body, link, cta, tone }, index) => (
              <Reveal key={title} delay={index * 90}>
                <article
                  className={`workspace-card workspace-${tone} group h-full rounded-2xl border bg-card p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lg`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="workspace-icon grid h-11 w-11 place-items-center rounded-xl">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {eyebrow}
                    </span>
                  </div>
                  <h3 className="mt-8 max-w-md text-2xl font-semibold leading-tight">{title}</h3>
                  <p className="mt-3 max-w-lg leading-7 text-muted-foreground">{body}</p>
                  <Link
                    to={link}
                    className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:gap-3"
                  >
                    {cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="workflow" className="scroll-mt-20 border-y border-border/70 bg-secondary/45">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                The production loop
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
                You decide what becomes real.
              </h2>
              <p className="mt-5 leading-7 text-muted-foreground">
                Cyliagen Story is designed around approval, not surprise. Draft the direction, inspect
                the result, then keep, refine or replace the part that needs work.
              </p>
              <Button className="mt-8" variant="outline" asChild>
                <Link to="/auth">
                  Enter the studio <ArrowRight />
                </Link>
              </Button>
            </Reveal>
            <ol className="grid gap-4 sm:grid-cols-2">
              {[
                { number: "01", title: "Brief", body: "Describe the idea, reader and feeling." },
                {
                  number: "02",
                  title: "Review",
                  body: "Edit the story plan, cast and art direction.",
                },
                {
                  number: "03",
                  title: "Produce",
                  body: "Generate pages, voices and scene motion.",
                },
                {
                  number: "04",
                  title: "Share",
                  body: "Read, play, print or export the finished work.",
                },
              ].map((step, index) => (
                <Reveal key={step.number} as="li" delay={index * 90}>
                  <div className="h-full rounded-2xl border bg-card p-6 transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <span className="font-mono text-xs font-semibold text-accent-foreground">
                      {step.number}
                    </span>
                    <h3 className="mt-8 text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <Reveal>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  The world layer
                </p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
                  One direction. Every finished form.
                </h2>
                <p className="mt-5 leading-7 text-muted-foreground">
                  Cyliagen Story keeps the visual language, cast and emotional center intact while you
                  move from a quiet page to a narrated read-aloud, a moving scene or a thoughtful
                  classroom extension.
                </p>
              </Reveal>
              <div className="mt-8 space-y-3">
                {STORY_OUTPUTS.map(({ label, detail, icon: Icon }, index) => (
                  <Reveal key={label} delay={120 + index * 90}>
                    <div className="flex gap-3 rounded-xl border bg-card p-4">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-semibold">{label}</p>
                        <p className="mt-1 text-sm leading-5 text-muted-foreground">{detail}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {ART_DIRECTION_BOARDS.slice(0, 3).map((board, index) => (
                <Reveal
                  key={board.id}
                  delay={index * 100}
                  className={index === 0 ? "sm:col-span-2" : ""}
                >
                  <article className="story-style-tile">
                    <img src={board.image} alt={`${board.name} art direction`} />
                    <div className="story-style-caption">
                      <div>
                        <p className="font-display text-xl">{board.name}</p>
                        <p className="text-xs uppercase tracking-[0.14em] opacity-80">
                          {board.medium}
                        </p>
                      </div>
                      <span>{board.palette}</span>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            <div className="mt-4 grid gap-4 sm:col-span-2 sm:grid-cols-2">
              <Reveal delay={180}>
                <figure className="showcase-tile">
                  <img
                    src="/assets/world-layer-showcase.jpg"
                    alt="A lantern fox and child connected to story-world locations by golden threads"
                    width={2176}
                    height={1632}
                    loading="lazy"
                  />
                  <figcaption>
                    <span className="font-semibold">World continuity</span>
                    <span>Cast, places and feeling held together.</span>
                  </figcaption>
                </figure>
              </Reveal>
              <Reveal delay={260}>
                <figure className="showcase-tile">
                  <img
                    src="/assets/motion-desk-showcase.jpg"
                    alt="A lantern fox crossing a glowing bridge with cinematic storyboard motifs"
                    width={2176}
                    height={1632}
                    loading="lazy"
                  />
                  <figcaption>
                    <span className="font-semibold">Motion direction</span>
                    <span>Turn an approved page into a scene.</span>
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <Reveal className="rounded-3xl bg-primary px-7 py-12 text-primary-foreground md:px-14 md:py-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
                  For the people who make stories
                </p>
                <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
                  A quieter way to make something children remember.
                </h2>
                <div className="mt-7 grid gap-3 text-sm text-primary-foreground/85 sm:grid-cols-2">
                  {[
                    "Original story and art direction",
                    "Private character references",
                    "Narration and scene planning",
                    "Classroom-ready activities",
                  ].map((item) => (
                    <span key={item} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/auth">
                  Start with an idea <ArrowRight />
                </Link>
              </Button>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground lg:px-8">
          <Logo />
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/pricing" className="transition hover:text-foreground">
              Pricing
            </Link>
            <Link to="/terms" className="transition hover:text-foreground">
              Terms
            </Link>
            <Link to="/privacy" className="transition hover:text-foreground">
              Privacy
            </Link>
          </nav>
          <p>
            © {new Date().getFullYear()} Cyliagen Story. Original stories, original art, original
            voices.
          </p>
        </div>
      </footer>
    </div>
  );
}
