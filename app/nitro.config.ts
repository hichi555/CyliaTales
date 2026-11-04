import { defineNitroConfig } from "nitro/config";

// Vercel sets its own VERCEL env var at build time, which Nitro detects on
// its own — no preset needed here for that case. Cloudflare deployment
// (Workers) isn't auto-detected the same way, so it's opted into explicitly:
// set NITRO_PRESET=cloudflare-module as a build-time environment variable on
// the Cloudflare project. Leave it unset anywhere else (Vercel, local builds)
// and this is a no-op.
export default defineNitroConfig({
  preset: process.env["NITRO_PRESET"] || undefined,
});
