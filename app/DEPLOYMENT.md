# Deploying CyliaTales

The app builds through [Nitro](https://nitro.build) (via `@tanstack/react-start`), which
produces a different server bundle depending on where it's told it's running. Both paths
below were verified by inspecting real build output, not just by reading config.

## Vercel

No extra configuration needed. Nitro detects Vercel's own `VERCEL` build-time environment
variable automatically and targets it. Connect the repo, set the environment variables from
`.env.example`, and deploy as normal.

## Cloudflare Workers

Nitro doesn't auto-detect Cloudflare the way it does Vercel, so the preset has to be set
explicitly. On the Cloudflare project, add a **build environment variable**:

```
NITRO_PRESET=cloudflare-module
```

That's read by `nitro.config.ts` at the repo root. With it set, `npm run build` produces
`.output/server/wrangler.json` and `.wrangler/deploy/config.json` — a real, deployable
Cloudflare Workers bundle. Without it (or on any other platform), `nitro.config.ts` is a
no-op and the default Node-targeted build is produced instead.

## What makes this work

`vite.config.ts` registers Nitro as its own Vite plugin (`import { nitro } from "nitro/vite"`)
and points `tanstackStart` at the app's custom server entry:

```ts
tanstackStart({ server: { entry: "server" } });
```

That entry is `src/server.ts` — it wraps `@tanstack/react-start/server-entry` with the app's
own error capture/rendering (`src/lib/error-capture.ts`, `src/lib/error-page.ts`), so a
server-side crash renders a real error page instead of a blank response. Both pieces need to
be present for either deployment target to produce a working bundle; dropping either one
(e.g. during a future merge) will cause a build to silently fall back to a generic SSR bundle
with no `.output/nitro.json`.

## Required environment variables

See `.env.example` for the full list and inline documentation — Supabase (client + service
role), the AI gateway (OpenAI-compatible primary, with optional Cloudflare Workers AI / Groq
/ Pollinations fallbacks), and ElevenLabs for narration. All provider keys are server-side
only; nothing prefixed `VITE_` should ever hold a secret, since those values ship to the
browser.
