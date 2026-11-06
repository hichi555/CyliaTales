import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleDot,
  GitBranch,
  Layers3,
  Play,
  Plus,
  RefreshCcw,
  Sparkles,
  SlidersHorizontal,
  WandSparkles,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { MagicCard } from "@/components/magicui/magic-card";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/story-loom")({
  head: () => ({
    meta: [
      { title: "Story Loom — CyliaTales" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content: "Turn a premise into a visual story map with connected beats, choices, and production-ready direction.",
      },
    ],
  }),
  component: StoryLoom,
});

type StoryNode = {
  id: string;
  kind: "origin" | "beat" | "choice" | "turn";
  eyebrow: string;
  title: string;
  body: string;
  tone: string;
};

const starterNodes: StoryNode[] = [
  {
    id: "origin",
    kind: "origin",
    eyebrow: "Origin · 01",
    title: "The seed arrives",
    body: "Mara finds a warm green seed inside a library book that has never been checked out.",
    tone: "loom-node--lime",
  },
  {
    id: "beat-1",
    kind: "beat",
    eyebrow: "Beat · 02",
    title: "A map under the floor",
    body: "The seed projects a map of three islands. Each one is missing a single piece of its name.",
    tone: "loom-node--paper",
  },
  {
    id: "choice-1",
    kind: "choice",
    eyebrow: "Choice · 03",
    title: "Follow the sound or the light?",
    body: "The story branches around a quiet decision. Let the reader choose what Mara trusts first.",
    tone: "loom-node--ink",
  },
];

const generatedNodes: StoryNode[] = [
  {
    id: "turn-1",
    kind: "turn",
    eyebrow: "Turn · 04",
    title: "The island that remembers",
    body: "A paper forest repeats Mara's last kind act back to her, revealing the missing word: home.",
    tone: "loom-node--coral",
  },
  {
    id: "beat-2",
    kind: "beat",
    eyebrow: "Beat · 05",
    title: "A promise with a pulse",
    body: "The seed opens only when Mara says what she will carry back for someone else.",
    tone: "loom-node--paper",
  },
  {
    id: "choice-2",
    kind: "choice",
    eyebrow: "Choice · 06",
    title: "Keep the light or share it",
    body: "A final reader choice changes the last image without breaking the story's emotional center.",
    tone: "loom-node--ink",
  },
];

function StoryLoom() {
  const [premise, setPremise] = useState(
    "A child finds a glowing seed inside a library book and follows it into a world that has forgotten how to come home.",
  );
  const [nodes, setNodes] = useState(starterNodes);
  const [activeId, setActiveId] = useState("origin");
  const [isGenerating, setIsGenerating] = useState(false);

  function generatePath() {
    if (isGenerating) return;
    setIsGenerating(true);
    window.setTimeout(() => {
      setNodes((current) => [...current, ...generatedNodes.filter((node) => !current.some((item) => item.id === node.id))]);
      setActiveId("turn-1");
      setIsGenerating(false);
    }, 700);
  }

  function resetPath() {
    setNodes(starterNodes);
    setActiveId("origin");
  }

  const activeNode: StoryNode = nodes.find((node) => node.id === activeId) ?? nodes[0] ?? starterNodes[0]!;

  return (
    <div className="story-loom-page">
      <section className="loom-hero relative overflow-hidden rounded-3xl border bg-card shadow-soft">
        <DotPattern dotColor="var(--primary)" />
        <BorderBeam size={110} duration={12} colorFrom="var(--accent)" colorTo="var(--primary)" />
        <div className="relative z-10 grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-9">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="loom-pulse" /> Story Loom · AI narrative direction
            </div>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-6xl">
              Start with a spark. Leave with a story you can direct.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              CyliaTales turns a loose premise into a living map of beats, choices, and visual handoffs. You stay in the loop; the machine does the heavy branching.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button onClick={generatePath} disabled={isGenerating} size="lg">
                <WandSparkles /> {isGenerating ? "Growing the path…" : "Generate next path"}
              </Button>
              <Button variant="outline" size="lg" onClick={resetPath}>
                <RefreshCcw /> Reset map
              </Button>
            </div>
          </div>
          <MagicCard className="loom-brief-card self-end p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Source brief</p>
                <p className="mt-1 text-sm font-semibold">The emotional center stays yours.</p>
              </div>
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <Textarea value={premise} onChange={(event) => setPremise(event.target.value)} className="loom-brief-input mt-5 min-h-32 resize-none" aria-label="Story premise" />
            <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Continuity lock · on</span>
              <span>{premise.length}/240</span>
            </div>
          </MagicCard>
        </div>
      </section>

      <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">The narrative canvas</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">A map you can actually make decisions inside.</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="loom-status-dot" /> Autosaving direction
          <span className="px-1 text-border">/</span>
          {nodes.length} story nodes
        </div>
      </div>

      <section className="loom-canvas mt-5 rounded-3xl border bg-card p-4 shadow-soft md:p-6" aria-label="Interactive story node canvas">
        <div className="loom-canvas-toolbar">
          <div className="flex items-center gap-2 text-sm font-semibold"><Layers3 className="h-4 w-4 text-primary" /> {activeNode?.eyebrow}</div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm"><SlidersHorizontal /> Direction</Button>
            <Button variant="outline" size="sm" onClick={generatePath}><Plus /> Add node</Button>
          </div>
        </div>
        <div className="loom-map" role="list">
          {nodes.map((node, index) => (
            <div key={node.id} className="loom-map-item" role="listitem">
              <button type="button" className={`loom-node ${node.tone} ${activeId === node.id ? "is-active" : ""}`} onClick={() => setActiveId(node.id)} aria-pressed={activeId === node.id}>
                <span className="loom-node-number">0{index + 1}</span>
                <span className="loom-node-copy"><span className="loom-node-eyebrow">{node.eyebrow}</span><strong>{node.title}</strong><span>{node.body}</span></span>
                <ChevronRight className="loom-node-arrow" />
              </button>
              {index < nodes.length - 1 && <div className="loom-connector" aria-hidden="true"><span /></div>}
            </div>
          ))}
          <button type="button" className="loom-add-node" onClick={generatePath}><Plus /><span><strong>Ask the Loom</strong><small>Generate a connected next beat</small></span></button>
        </div>
      </section>

      <BentoGrid className="mt-5">
        <BentoCard className="md:col-span-2 loom-insight-card">
          <div className="relative z-10 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <div><p className="loom-label">Selected direction</p><h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{activeNode.title}</h3><p className="mt-2 max-w-xl leading-7 text-muted-foreground">{activeNode.body} Keep this beat, ask for three alternatives, or turn it into a scene brief with the character and visual continuity already attached.</p></div>
            <Button><Play /> Open beat brief</Button>
          </div>
        </BentoCard>
        <BentoCard className="loom-metrics-card">
          <p className="loom-label">Continuity signal</p>
          <div className="mt-3 flex items-end gap-2"><span className="text-4xl font-semibold">94</span><span className="mb-1 text-sm text-muted-foreground">/ 100</span></div>
          <div className="loom-meter mt-4"><span /></div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">Character, place, and emotional promise are aligned.</p>
        </BentoCard>
      </BentoGrid>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><CircleDot className="h-4 w-4 text-primary" /> Built for writers who want authorship, not prompt roulette.</div>
        <Link to="/stories/new" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3">Turn this map into a book <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </div>
  );
}
