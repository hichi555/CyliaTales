import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Activity, ArrowDownToLine, CheckCircle2, FileCheck2, LockKeyhole, ShieldCheck, UsersRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedList } from "@/components/magicui/animated-list";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

async function fetchAudit() {
  const [stories, jobs, outputs, characters] = await Promise.all([
    supabase.from("stories").select("id,title,status,visibility,created_at,updated_at").order("updated_at", { ascending: false }).limit(100),
    supabase.from("story_generation_jobs").select("id,job_type,status,provider,created_at,updated_at").order("created_at", { ascending: false }).limit(100),
    supabase.from("story_outputs").select("id,title,kind,status,created_at,updated_at").order("created_at", { ascending: false }).limit(100),
    supabase.from("characters").select("id,created_at").limit(100),
  ]);
  return { stories: stories.data ?? [], jobs: jobs.data ?? [], outputs: outputs.data ?? [], characters: characters.data ?? [] };
}

function stamp(value: string) { return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value)); }
function title(value: string) { return value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }

export function AuditCompliancePanel() {
  const [reportMode, setReportMode] = useState<"executive" | "control">("executive");
  const { data, isLoading } = useQuery({ queryKey: ["studio-audit-compliance"], queryFn: fetchAudit, staleTime: 60_000 });
  const audit = useMemo(() => {
    const snapshot = data ?? { stories: [], jobs: [], outputs: [], characters: [] };
    const events = [
      ...snapshot.stories.map((row) => ({ at: row.updated_at, label: row.title || "Untitled story", detail: `${title(row.status || "draft")} · ${title(row.visibility || "private")}`, tone: "story" })),
      ...snapshot.jobs.map((row) => ({ at: row.updated_at, label: title(row.job_type || "Production job"), detail: `${title(row.status || "queued")} · ${row.provider || "Cylia gateway"}`, tone: row.status === "failed" ? "risk" : "job" })),
      ...snapshot.outputs.map((row) => ({ at: row.updated_at, label: row.title || title(row.kind || "Output"), detail: `${title(row.status || "queued")} · delivery artifact`, tone: "output" })),
    ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 7);
    const privateStories = snapshot.stories.filter((story) => story.visibility !== "public").length;
    const failedJobs = snapshot.jobs.filter((job) => ["failed", "error"].includes(job.status || "")).length;
    return { ...snapshot, events, privateStories, failedJobs };
  }, [data]);

  function exportReport() {
    const blob = new Blob([JSON.stringify({ generatedAt: new Date().toISOString(), reportMode, compliance: { privateStories: audit.privateStories, totalStories: audit.stories.length, failedJobs: audit.failedJobs, characterReferences: audit.characters.length }, auditTrail: audit.events }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `cyliatales-${reportMode}-compliance-report.json`; link.click(); URL.revokeObjectURL(url);
  }

  return (
    <section className="studio-surface mb-10 rounded-3xl border bg-card p-6 shadow-soft md:p-8" aria-labelledby="audit-title">
      <BorderBeam size={110} duration={16} delay={4} colorFrom="var(--accent)" colorTo="var(--primary)" />
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary"><ShieldCheck className="h-4 w-4" /> Governance center</p><h2 id="audit-title" className="mt-3 text-2xl font-semibold">Trust is part of the product.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">An investor-ready audit trail for story changes, generation controls and delivery posture—grounded in the workspace records your team already creates.</p></div>
        <div className="flex flex-wrap items-center gap-2"><div className="flex rounded-lg border bg-background/70 p-1">{(["executive", "control"] as const).map((mode) => <button key={mode} type="button" onClick={() => setReportMode(mode)} className={cn("rounded-md px-3 py-1.5 text-xs font-semibold", reportMode === mode ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>{mode === "executive" ? "Executive view" : "Control view"}</button>)}</div><Button size="sm" variant="outline" onClick={exportReport}><ArrowDownToLine /> Export report</Button></div>
      </div>
      <BentoGrid className="mt-7">
        <BentoCard className="md:col-span-2"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Audit trail</p><h3 className="mt-2 text-lg font-semibold">Recent workspace activity</h3></div><Activity className="h-5 w-5 text-primary" /></div><div className="mt-5">{isLoading ? <p className="text-sm text-muted-foreground">Reading audit events…</p> : <AnimatedList>{audit.events.map((event) => <div key={`${event.at}-${event.label}`} className="flex items-center justify-between gap-4 rounded-xl border bg-background/55 px-3 py-2.5"><div className="flex min-w-0 items-center gap-3"><span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", event.tone === "risk" ? "bg-red-100 text-red-700" : "bg-secondary text-primary")}><CheckCircle2 className="h-4 w-4" /></span><div className="min-w-0"><p className="truncate text-sm font-semibold">{event.label}</p><p className="truncate text-xs text-muted-foreground">{event.detail}</p></div></div><time className="shrink-0 text-[11px] text-muted-foreground">{stamp(event.at)}</time></div>)}</AnimatedList>}</div></BentoCard>
        <BentoCard className="bg-primary text-primary-foreground"><LockKeyhole className="h-5 w-5 text-primary-foreground/80" /><p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/70">Privacy posture</p><p className="mt-2 text-3xl font-semibold">{audit.stories.length ? Math.round((audit.privateStories / audit.stories.length) * 100) : 100}%</p><p className="mt-1 text-sm text-primary-foreground/75">of stories are not public</p><p className="mt-6 text-xs leading-5 text-primary-foreground/70">Private-by-default is a product behavior, not a policy footnote.</p></BentoCard>
        <BentoCard><FileCheck2 className="h-5 w-5 text-emerald-700" /><p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Control coverage</p><p className="mt-2 text-3xl font-semibold">4 / 4</p><p className="mt-1 text-sm text-muted-foreground">core production domains tracked</p><div className="mt-5 space-y-2 text-xs text-muted-foreground"><p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" /> Story lifecycle</p><p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" /> Generation jobs</p><p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" /> Delivery artifacts</p></div></BentoCard>
        <BentoCard><UsersRound className="h-5 w-5 text-sky-700" /><p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Continuity governance</p><p className="mt-2 text-3xl font-semibold">{audit.characters.length}</p><p className="mt-1 text-sm text-muted-foreground">character references under control</p><Link to="/characters" className="mt-5 inline-flex text-sm font-semibold text-primary">Review atlas →</Link></BentoCard>
        <BentoCard><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Exceptions</p><p className="mt-2 text-3xl font-semibold">{audit.failedJobs}</p><p className="mt-1 text-sm text-muted-foreground">failed jobs requiring review</p><div className={cn("mt-5 rounded-lg px-3 py-2 text-xs font-semibold", audit.failedJobs ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800")}>{audit.failedJobs ? "Action recommended" : "No open exceptions"}</div></BentoCard>
      </BentoGrid>
    </section>
  );
}
