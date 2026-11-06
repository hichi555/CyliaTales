import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
import { CyliagenStoryGraph } from "@/components/CyliagenStoryGraph";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/story-loom")({
  head: () => ({
    meta: [
      { title: "Cyliagen Studio — Cyliagen Story" },
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
  const { user } = useAuth();
  const [premise, setPremise] = useState(
    "A child finds a glowing seed inside a library book and follows it into a world that has forgotten how to come home.",
  );
  const [nodes, setNodes] = useState(starterNodes);
  const [activeId, setActiveId] = useState("origin");
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"loading" | "saving" | "saved" | "offline" | "error">("loading");
  const hydrated = useRef(false);
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!user) {
      setSaveState("offline");
      return;
    }
    const userId = user.id;
    let cancelled = false;
    async function loadDraft() {
      const { data, error } = await supabase
        .from("creation_projects")
        .select("id,brief,selected_models")
        .eq("user_id", userId)
        .eq("status", "planning")
        .order("updated_at", { ascending: false })
        .limit(12);
      if (cancelled) return;
      const draft = (data ?? []).find((item) => {
        const metadata = item.selected_models as { surface?: string } | null;
        return metadata?.surface === "cyliagen-studio";
      });
      if (draft) {
        const metadata = draft.selected_models as { nodes?: StoryNode[]; activeId?: string } | null;
        setProjectId(draft.id);
        if (draft.brief) setPremise(draft.brief);
        if (metadata?.nodes?.length) setNodes(metadata.nodes);
        if (metadata?.activeId) setActiveId(metadata.activeId);
      }
      hydrated.current = true;
      setSaveState(error ? "error" : "saved");
    }
    void loadDraft();
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!user || !hydrated.current) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    setSaveState("saving");
    saveTimer.current = window.setTimeout(async () => {
      const selectedModels = { surface: "cyliagen-studio", nodes, activeId };
      const payload = {
        title: premise.trim().slice(0, 72) || "Untitled Cyliagen story",
        brief: premise.trim() || "Untitled Cyliagen story",
        creation_mode: "ebook",
        selected_models: selectedModels,
        status: "planning",
        user_id: user.id,
      };
      const result = projectId
        ? await supabase.from("creation_projects").update(payload).eq("id", projectId).select("id").single()
        : await supabase.from("creation_projects").insert(payload).select("id").single();
      if (result.error) {
        setSaveState("error");
      } else {
        setProjectId(result.data.id);
        setSaveState("saved");
      }
    }, 850);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [activeId, nodes, premise, projectId, user]);

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
              <span className="loom-pulse" /> Cyliagen Studio · AI narrative direction
            </div>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-6xl">
              Start with a spark. Leave with a story you can direct.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              Cyliagen Story turns a loose premise into a living map of beats, choices, and visual handoffs. You stay in the loop; the machine does the heavy branching.
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
          <span className={`loom-status-dot ${saveState === "error" ? "loom-status-dot--error" : ""}`} />
          {saveState === "saving" ? "Saving to cloud…" : saveState === "saved" ? "Saved to cloud" : saveState === "offline" ? "Sign in to sync" : saveState === "error" ? "Cloud save needs attention" : "Loading cloud draft…"}
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
          <button type="button" className="loom-add-node" onClick={generatePath}><Plus /><span><strong>Ask Cyliagen</strong><small>Generate a connected next beat</small></span></button>
        </div>
      </section>

      <section className="cyliagen-graph-section mt-5 overflow-hidden rounded-3xl border shadow-soft" aria-labelledby="graph-title">
        <div className="cyliagen-graph-heading">
          <div>
            <p className="loom-label">Three-dimensional direction layer</p>
            <h2 id="graph-title" className="mt-2 text-2xl font-semibold tracking-[-0.03em]">See the story as a world, not a list.</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Orbit the narrative, inspect the emotional turns, and spot where a new branch strengthens the whole arc before you render a page.</p>
          </div>
          <div className="cyliagen-graph-badge"><span /> 3D continuity map</div>
        </div>
        <CyliagenStoryGraph />
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
