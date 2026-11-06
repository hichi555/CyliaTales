import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowDownToLine,
  CheckCircle2,
  Clock3,
  Gauge,
  Layers3,
  RefreshCw,
  ServerCog,
  Sparkles,
  WandSparkles,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { BorderBeam } from "@/components/magicui/border-beam";
import { MagicCard } from "@/components/magicui/magic-card";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RangeKey = "7d" | "30d" | "90d";

type TelemetryRow = {
  created_at: string;
  status?: string | null;
  job_type?: string | null;
  provider?: string | null;
  kind?: string | null;
  title?: string | null;
  story_id?: string | null;
  completed_at?: string | null;
  image_url?: string | null;
  audio_url?: string | null;
  motion_url?: string | null;
  motion_status?: string | null;
};

type TelemetrySnapshot = {
  stories: TelemetryRow[];
  pages: TelemetryRow[];
  jobs: TelemetryRow[];
  outputs: TelemetryRow[];
  worldAnchors: number;
  fetchedAt: string;
};

const RANGE_DAYS: Record<RangeKey, number> = { "7d": 7, "30d": 30, "90d": 90 };
const RANGE_LABELS: Record<RangeKey, string> = { "7d": "7 days", "30d": "30 days", "90d": "90 days" };

function formatCompact(value: number) {
  return Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(value));
}

function titleCase(value: string) {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function fetchTelemetry(): Promise<TelemetrySnapshot> {
  const [stories, pages, jobs, outputs, anchors] = await Promise.all([
    supabase.from("stories").select("id,title,status,created_at,updated_at").limit(200),
    supabase
      .from("story_pages")
      .select("created_at,image_url,audio_url,motion_url,motion_status,story_id")
      .limit(500),
    supabase
      .from("story_generation_jobs")
      .select("created_at,status,job_type,provider,story_id,completed_at")
      .order("created_at", { ascending: false })
      .limit(300),
    supabase
      .from("story_outputs")
      .select("created_at,status,kind,title,story_id")
      .order("created_at", { ascending: false })
      .limit(300),
    supabase.from("world_items").select("id", { count: "exact", head: true }),
  ]);

  return {
    stories: stories.data ?? [],
    pages: pages.data ?? [],
    jobs: jobs.data ?? [],
    outputs: outputs.data ?? [],
    worldAnchors: anchors.count ?? 0,
    fetchedAt: new Date().toISOString(),
  };
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="grid h-56 place-items-center rounded-xl border border-dashed bg-background/45 text-center">
      <div>
        <Activity className="mx-auto h-5 w-5 text-muted-foreground/60" />
        <p className="mt-2 text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground/70">Create a story or production job to activate this signal.</p>
      </div>
    </div>
  );
}

export function TelemetryDashboard() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [telemetryEnabled, setTelemetryEnabled] = useState(true);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("cyliatales.preferences.v1");
      if (raw) setTelemetryEnabled((JSON.parse(raw) as { workspaceTelemetry?: boolean }).workspaceTelemetry !== false);
    } catch {
      setTelemetryEnabled(true);
    }
  }, []);
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["studio-telemetry"],
    queryFn: fetchTelemetry,
    staleTime: 60_000,
    enabled: telemetryEnabled,
  });

  const metrics = useMemo(() => {
    const snapshot = data ?? { stories: [], pages: [], jobs: [], outputs: [], worldAnchors: 0, fetchedAt: "" };
    const days = RANGE_DAYS[range];
    const cutoff = Date.now() - days * 86_400_000;
    const inRange = (row: TelemetryRow) => new Date(row.created_at).getTime() >= cutoff;
    const jobs = snapshot.jobs.filter(inRange);
    const pages = snapshot.pages.filter(inRange);
    const outputs = snapshot.outputs.filter(inRange);
    const stories = snapshot.stories.filter(inRange);
    const successfulJobs = jobs.filter((job) => ["completed", "complete", "succeeded", "success"].includes(job.status ?? ""));
    const failedJobs = jobs.filter((job) => ["failed", "error"].includes(job.status ?? ""));
    const deliveredPages = pages.filter((page) => page.image_url || page.audio_url || page.motion_url).length;
    const activeDays = new Set([...jobs, ...stories, ...outputs].map((row) => row.created_at.slice(0, 10))).size;
    const chart = Array.from({ length: Math.min(days, 30) }, (_, index) => {
      const date = new Date(Date.now() - (Math.min(days, 30) - 1 - index) * 86_400_000);
      const key = date.toISOString().slice(0, 10);
      return {
        label: new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(date),
        date: formatDate(key),
        stories: snapshot.stories.filter((row) => row.created_at.slice(0, 10) === key).length,
        jobs: snapshot.jobs.filter((row) => row.created_at.slice(0, 10) === key).length,
        outputs: snapshot.outputs.filter((row) => row.created_at.slice(0, 10) === key).length,
      };
    });
    const jobMix = Object.entries(jobs.reduce<Record<string, number>>((acc, job) => {
      const key = job.job_type || "other";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})).sort(([, a], [, b]) => b - a).slice(0, 5).map(([name, value]) => ({ name: titleCase(name), value }));
    const events = [
      ...snapshot.jobs.map((job) => ({ date: job.created_at, label: titleCase(job.job_type || "Production job"), detail: job.provider || "Cylia gateway", status: job.status || "queued" })),
      ...snapshot.outputs.map((output) => ({ date: output.created_at, label: output.title || titleCase(output.kind || "Output"), detail: "Delivery artifact", status: output.status || "queued" })),
      ...snapshot.stories.map((story) => ({ date: story.created_at, label: story.title || "Untitled story", detail: "Story workspace", status: story.status || "draft" })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);
    return {
      stories,
      jobs,
      pages,
      outputs,
      successfulJobs,
      failedJobs,
      deliveredPages,
      activeDays,
      chart,
      jobMix,
      events,
      successRate: jobs.length ? Math.round((successfulJobs.length / jobs.length) * 100) : 0,
      assetUtilization: pages.length ? Math.round((deliveredPages / pages.length) * 100) : 0,
      velocity: activeDays ? Math.round((stories.length + outputs.length) / activeDays * 10) / 10 : 0,
      worldAnchors: snapshot.worldAnchors,
      fetchedAt: snapshot.fetchedAt,
    };
  }, [data, range]);

  if (!telemetryEnabled) {
    return (
      <section className="mb-10 rounded-3xl border bg-card p-6 shadow-soft md:p-8" aria-labelledby="telemetry-disabled-title">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Workspace telemetry is off</p>
            <h2 id="telemetry-disabled-title" className="mt-2 text-2xl font-semibold">Your production data stays out of the dashboard.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Enable Workspace telemetry in Settings when you want private operational health, delivery velocity and production signals.</p>
          </div>
          <Button variant="outline" asChild><Link to="/settings">Open settings</Link></Button>
        </div>
      </section>
    );
  }

  function downloadSnapshot() {
    const payload = JSON.stringify({ range, exportedAt: new Date().toISOString(), metrics }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `cyliatales-telemetry-${range}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="studio-surface mb-10 rounded-3xl border bg-card p-6 shadow-soft md:p-8" aria-labelledby="telemetry-title">
      <BorderBeam size={120} duration={18} delay={3} colorFrom="var(--primary)" colorTo="var(--accent)" />
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Gauge className="h-4 w-4" /> Enterprise telemetry
          </div>
          <h2 id="telemetry-title" className="mt-3 text-2xl font-semibold">Production intelligence, without the fog.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            A decision layer built from your saved stories, pages, jobs and delivery artifacts. No vanity events—just the signals that show whether the world is moving toward finished work.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border bg-background/70 p-1" role="group" aria-label="Telemetry time range">
            {(Object.keys(RANGE_LABELS) as RangeKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setRange(key)}
                className={cn("rounded-md px-3 py-1.5 text-xs font-semibold transition-colors", range === key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                {RANGE_LABELS[key]}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={downloadSnapshot} disabled={isLoading}>
            <ArrowDownToLine /> Export
          </Button>
          <Button variant="ghost" size="icon" onClick={() => void refetch()} aria-label="Refresh telemetry" title="Refresh telemetry">
            <RefreshCw className={cn(isFetching && "animate-spin")} />
          </Button>
        </div>
      </div>
      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Delivery velocity", value: metrics.velocity, suffix: "/ active day", detail: `${metrics.stories.length + metrics.outputs.length} new decisions`, icon: WandSparkles, tone: "text-primary", decimals: 1 },
          { label: "Production success", value: metrics.successRate, suffix: "%", detail: `${metrics.successfulJobs.length} completed · ${metrics.failedJobs.length} failed`, icon: CheckCircle2, tone: "text-emerald-700", decimals: 0 },
          { label: "Asset utilization", value: metrics.assetUtilization, suffix: "%", detail: `${metrics.deliveredPages} pages have a delivery asset`, icon: Layers3, tone: "text-sky-700", decimals: 0 },
          { label: "Continuity footprint", value: metrics.worldAnchors, suffix: " anchors", detail: `${metrics.activeDays} active production days`, icon: ServerCog, tone: "text-amber-700", decimals: 0 },
        ].map(({ label, value, suffix, detail, icon: Icon, tone, decimals }) => (
          <MagicCard key={label} className="studio-kpi p-5 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
              <Icon className={cn("h-4 w-4", tone)} />
            </div>
            <p className="mt-5 text-2xl font-semibold tracking-[-0.03em]"><NumberTicker value={value} decimalPlaces={decimals} />{suffix}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
          </MagicCard>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)]">
        <div>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Production activity</p>
              <p className="mt-1 text-xs text-muted-foreground">Stories, generation jobs and outputs created in the selected window.</p>
            </div>
            <span className="text-xs font-medium text-muted-foreground">{isLoading ? "Loading signal…" : `Updated ${data ? formatDate(data.fetchedAt) : "—"}`}</span>
          </div>
          {isLoading || metrics.chart.every((point) => point.stories + point.jobs + point.outputs === 0) ? <EmptyChart label={isLoading ? "Reading workspace telemetry…" : "No activity in this window"} /> : (
            <div className="h-56 rounded-xl border bg-background/45 p-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.chart} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="telemetryStories" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.32} /><stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} /></linearGradient>
                    <linearGradient id="telemetryOutputs" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.28} /><stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <Tooltip labelFormatter={(_, payload) => payload?.[0]?.payload?.date ?? ""} contentStyle={{ borderRadius: 12, borderColor: "var(--border)", background: "var(--card)", fontSize: 12 }} />
                  <Area type="monotone" dataKey="stories" name="Stories" stroke="var(--chart-1)" fill="url(#telemetryStories)" strokeWidth={2} />
                  <Area type="monotone" dataKey="outputs" name="Outputs" stroke="var(--chart-2)" fill="url(#telemetryOutputs)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        <div>
          <div className="mb-3"><p className="text-sm font-semibold">Generation mix</p><p className="mt-1 text-xs text-muted-foreground">Where production effort is going.</p></div>
          {metrics.jobMix.length === 0 ? <EmptyChart label="No generation mix yet" /> : (
            <div className="h-56 rounded-xl border bg-background/45 p-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.jobMix} layout="vertical" margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} hide />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={92} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <Tooltip cursor={{ fill: "var(--secondary)" }} contentStyle={{ borderRadius: 12, borderColor: "var(--border)", background: "var(--card)", fontSize: 12 }} />
                  <Bar dataKey="value" name="Jobs" fill="var(--primary)" radius={[0, 6, 6, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)]">
        <div>
          <div className="mb-3 flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">Recent production events</p><p className="mt-1 text-xs text-muted-foreground">The latest decisions moving the workspace forward.</p></div><Clock3 className="h-4 w-4 text-muted-foreground" /></div>
          <div className="divide-y rounded-xl border bg-background/45">
            {metrics.events.length === 0 ? <p className="p-5 text-sm text-muted-foreground">No production events have been recorded yet.</p> : metrics.events.map((event, index) => (
              <div key={`${event.date}-${index}`} className="flex items-center justify-between gap-4 px-4 py-3.5">
                <div className="flex min-w-0 items-center gap-3"><span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", ["completed", "complete", "success"].includes(event.status) ? "bg-emerald-100 text-emerald-700" : ["failed", "error"].includes(event.status) ? "bg-red-100 text-red-700" : "bg-secondary text-primary")}>
                  {["failed", "error"].includes(event.status) ? <XCircle className="h-4 w-4" /> : ["completed", "complete", "success"].includes(event.status) ? <CheckCircle2 className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                </span><div className="min-w-0"><p className="truncate text-sm font-semibold">{event.label}</p><p className="truncate text-xs text-muted-foreground">{event.detail}</p></div></div>
                <div className="shrink-0 text-right"><p className="text-xs font-medium text-muted-foreground">{formatDate(event.date)}</p><p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">{titleCase(event.status)}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border bg-primary p-5 text-primary-foreground shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/70"><Sparkles className="h-4 w-4" /> Executive readout</div>
          <p className="mt-4 text-xl font-semibold">{metrics.successRate >= 85 ? "The production loop is healthy." : metrics.jobs.length ? "The loop has friction worth addressing." : "Your operating system is ready."}</p>
          <p className="mt-3 text-sm leading-6 text-primary-foreground/80">{metrics.jobs.length ? `${metrics.successRate}% of generation jobs completed successfully in the last ${RANGE_LABELS[range].replace(" days", " days")}. ${metrics.assetUtilization >= 70 ? "Delivery assets are being used well." : "A stronger handoff from pages to outputs is the next leverage point."}` : "Create the first story and Cyliagen Story will turn the saved production trail into an investor-grade operating view."}</p>
          <div className="mt-6 flex items-center gap-2 text-xs font-medium text-primary-foreground/75"><Activity className="h-3.5 w-3.5" /> Workspace telemetry is derived from persisted production records.</div>
        </div>
      </div>
    </section>
  );
}
