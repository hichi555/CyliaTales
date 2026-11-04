import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  BookOpen,
  Check,
  GitBranch,
  Lightbulb,
  LockKeyhole,
  ImagePlus,
  RefreshCw,
  Sparkles,
  Users,
  WandSparkles,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { generateImage, generateStoryBranches } from "@/lib/studio.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/branch-studio")({
  head: () => ({
    meta: [
      { title: "Branch Studio — CyliaTales" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content: "Direct meaningful interactive story choices with CyliaTales AI story direction.",
      },
    ],
  }),
  component: BranchStudio,
});

type Branch = {
  id: string;
  label: string;
  invitation: string;
  consequence: string;
  illustrationPrompt: string;
};

type BranchDraft = {
  sceneTitle: string;
  scene: string;
  branches: Branch[];
  continuityNote: string;
};

const STARTER: BranchDraft = {
  sceneTitle: "The lantern at the waterline",
  scene:
    "Mara and her fox companion reached the edge of the tideglass marsh just as the last blue light slipped behind the reeds. Their map showed one safe crossing, but the little lantern in Mara’s hands began to glow toward three different paths. Somewhere beyond the mist, a bell answered — once, then twice.",
  branches: [
    {
      id: "listen",
      label: "Follow the bell",
      invitation: "Mara cups her hand around the lantern and listens for the next note.",
      consequence: "The pair find a hidden waymarker, but must leave the bright path behind.",
      illustrationPrompt: "Mara and her small lantern fox listening beside blue reeds and tideglass water, warm gold lantern light, quiet suspense, consistent characters, no text",
    },
    {
      id: "help",
      label: "Answer the light",
      invitation: "Mara lifts the lantern high so whoever is waiting can see they are not alone.",
      consequence: "A stranded night moth joins the journey and reveals a safer crossing.",
      illustrationPrompt: "Mara raising a glowing lantern as a gentle night moth approaches over tideglass marsh, lantern fox at her side, hopeful blue and gold palette, no text",
    },
    {
      id: "map",
      label: "Trust the map",
      invitation: "Mara spreads the map on a flat stone and asks the fox to find the smallest mark.",
      consequence: "The map reveals an old promise from someone who crossed before them.",
      illustrationPrompt: "Mara and a lantern fox studying a hand-drawn map on a moonlit stone beside marsh water, intimate storybook composition, warm gold accents, no text",
    },
  ],
  continuityNote: "Starter scene only — generate a branch set to anchor the moment to your own story world.",
};

function BranchStudio() {
  const { user } = useAuth();
  const generate = useServerFn(generateStoryBranches);
  const generatePreview = useServerFn(generateImage);
  const [premise, setPremise] = useState(
    "A cautious child and their lantern fox reach a tideglass marsh. Three signals call from the mist, but only one path will keep their promise to bring a lost moth home.",
  );
  const [ageRange, setAgeRange] = useState("7-9");
  const [atmosphere, setAtmosphere] = useState("quiet wonder with a little suspense");
  const [draft, setDraft] = useState<BranchDraft>(STARTER);
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [previewBusy, setPreviewBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [collaborators, setCollaborators] = useState(1);

  useEffect(() => {
    const channel = supabase.channel("cylia-branch-studio", {
      config: { presence: { key: user?.id ?? "branch-guest" } },
    });
    channel
      .on("presence", { event: "sync" }, () => {
        setCollaborators(Object.keys(channel.presenceState()).length || 1);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") await channel.track({ surface: "branch-studio", at: Date.now() });
      });
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user?.id]);

  async function directBranches() {
    if (premise.trim().length < 3) {
      toast.error("Give the story director a little more to work with.");
      return;
    }
    setBusy(true);
    setSelected(null);
    try {
      const result = await generate({ data: { premise, ageRange, atmosphere } });
      setDraft(result);
      toast.success("Three story directions are ready for review.");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const chosen = draft.branches.find((branch) => branch.id === selected);

  async function generateScenePreview() {
    if (!chosen) return;
    setPreviewBusy(true);
    try {
      const result = await generatePreview({
        data: {
          prompt: `${chosen.illustrationPrompt}. Preserve the established story-world identity and avoid visual clichés; make the moment specific to the described consequence.`,
          style: "premium editorial gouache and colored pencil children's book illustration",
        },
      });
      setPreview(`data:image/png;base64,${result.b64}`);
      toast.success("Scene preview rendered for review.");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setPreviewBusy(false);
    }
  }

  return (
    <div className="max-w-7xl pb-12">
      <PageHeader
        eyebrow="Create / Branch Studio"
        title="Make the next moment matter."
        subtitle="Direct a meaningful choice, compare its consequences, and keep the branch that belongs in your world."
        actions={
          <Button onClick={directBranches} disabled={busy}>
            {busy ? <RefreshCw className="animate-spin" /> : <WandSparkles />}
            {busy ? "Directing…" : "Direct branches"}
          </Button>
        }
      />

      <section className="branch-hero rounded-[1.75rem] border bg-primary p-6 text-primary-foreground shadow-soft md:p-9">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              <GitBranch className="h-4 w-4" /> Interactive story direction
            </div>
            <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight md:text-5xl">
              Not a quiz. A story with consequences.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-primary-foreground/75 md:text-base">
              CyliaTales looks for choices that reveal character, preserve continuity, and change what
              the reader feels next — not three versions of the same safe answer.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-xs text-primary-foreground/70">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 px-3 py-2">
                <LockKeyhole className="h-3.5 w-3.5 text-accent" /> Age-aware
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 px-3 py-2">
                <BookOpen className="h-3.5 w-3.5 text-accent" /> Continuity-first
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 px-3 py-2">
                <Sparkles className="h-3.5 w-3.5 text-accent" /> Review before canon
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-primary-foreground/60">
              <span>Branch map</span>
              <span className="inline-flex items-center gap-2"><Users className="h-3.5 w-3.5" /> {collaborators} live</span>
            </div>
            <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="rounded-xl bg-primary-foreground/10 p-4 text-sm font-semibold">
                {draft.sceneTitle}
              </div>
              <GitBranch className="h-5 w-5 rotate-90 text-accent" />
              <div className="space-y-2">
                {draft.branches.map((branch) => (
                  <div key={branch.id} className="rounded-lg border border-primary-foreground/10 px-3 py-2 text-xs text-primary-foreground/80">
                    {branch.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
        <section className="rounded-2xl border bg-card p-6 shadow-soft" aria-labelledby="brief-title">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
              <Lightbulb className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Director brief</p>
              <h2 id="brief-title" className="mt-1 text-xl font-semibold">What is happening now?</h2>
            </div>
          </div>
          <Textarea
            className="mt-6 min-h-36 resize-y"
            value={premise}
            onChange={(event) => setPremise(event.target.value)}
            placeholder="Describe the current story moment, including the promise or tension that makes a choice meaningful."
          />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Reader age
              <select className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm font-normal" value={ageRange} onChange={(event) => setAgeRange(event.target.value)}>
                <option value="0-3">0–3 · read together</option>
                <option value="4-6">4–6 · early reader</option>
                <option value="7-9">7–9 · independent reader</option>
                <option value="10-12">10–12 · confident reader</option>
              </select>
            </label>
            <label className="text-sm font-semibold">
              Atmosphere
              <input className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm font-normal" value={atmosphere} onChange={(event) => setAtmosphere(event.target.value)} />
            </label>
          </div>
          <Button className="mt-6 w-full" onClick={directBranches} disabled={busy}>
            {busy ? <RefreshCw className="animate-spin" /> : <WandSparkles />}
            {busy ? "Finding meaningful consequences…" : "Generate a new choice set"}
          </Button>
        </section>

        <section aria-labelledby="scene-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Review the moment</p>
              <h2 id="scene-title" className="mt-1 text-2xl font-semibold">{draft.sceneTitle}</h2>
            </div>
            <span className="rounded-full border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">Draft · not canon</span>
          </div>
          <div className="mt-4 rounded-2xl border bg-card p-6 shadow-soft">
            <p className="font-display text-xl leading-8 text-foreground">{draft.scene}</p>
            <div className="mt-6 flex items-start gap-3 border-t pt-4 text-sm text-muted-foreground">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{draft.continuityNote}</span>
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {draft.branches.map((branch, index) => (
              <button
                type="button"
                key={branch.id}
                onClick={() => setSelected(branch.id)}
                className={cn(
                  "group w-full rounded-2xl border bg-card p-5 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-primary/50",
                  selected === branch.id && "border-primary bg-secondary/60 ring-2 ring-primary/15",
                )}
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-primary">
                    0{index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center justify-between gap-3">
                      <span className="font-semibold">{branch.label}</span>
                      <ArrowRight className="h-4 w-4 text-primary transition group-hover:translate-x-1" />
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-muted-foreground">{branch.invitation}</span>
                    <span className="mt-3 block border-l-2 border-accent pl-3 text-xs leading-5 text-muted-foreground">{branch.consequence}</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
          {chosen && (
            <div className="mt-4 rounded-2xl border border-primary/20 bg-secondary/45 p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                <Check className="h-4 w-4" /> Selected direction
              </div>
              <p className="mt-3 font-semibold">{chosen.label}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{chosen.illustrationPrompt}</p>
              <Button className="mt-4" variant="outline" onClick={() => toast.success("Direction marked for the next production pass.")}>
                Carry into production <ArrowRight />
              </Button>
              <Button className="mt-4 ml-2" onClick={generateScenePreview} disabled={previewBusy}>
                {previewBusy ? <RefreshCw className="animate-spin" /> : <ImagePlus />}
                {previewBusy ? "Rendering…" : "Render scene preview"}
              </Button>
            </div>
          )}
          {preview && (
            <figure className="mt-4 overflow-hidden rounded-2xl border bg-card shadow-soft">
              <img src={preview} alt={`Generated preview for ${chosen?.label ?? "selected story direction"}`} className="aspect-[3/2] w-full object-cover" />
              <figcaption className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-muted-foreground">
                <span>Live image preview · review before canon</span>
                <Sparkles className="h-4 w-4 text-primary" />
              </figcaption>
            </figure>
          )}
        </section>
      </div>
    </div>
  );
}
