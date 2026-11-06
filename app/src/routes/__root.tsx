import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { ArrowRight, RefreshCw } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

import appCss from "../styles.css?url";
import heroShareImage from "../assets/hero.jpg";
import { reportRuntimeError } from "../lib/runtime-error-reporting";

const configuredOrigin = (import.meta.env["VITE_APP_URL"] as string | undefined)?.replace(
  /\/$/,
  "",
);
const shareImageUrl = configuredOrigin ? `${configuredOrigin}${heroShareImage}` : heroShareImage;
const shareTitle = "Cyliagen Story — Make stories worth keeping";
const shareDescription =
  "A review-first story studio: writing, character direction, illustration, narration and motion, all in one calm workspace.";

function NotFoundComponent() {
  return (
    <div className="bg-grain relative flex min-h-screen flex-col items-center justify-center bg-hero px-4">
      <div className="absolute top-6 left-6">
        <Logo />
      </div>
      <div
        className="absolute -z-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative max-w-md text-center">
        <p className="font-display text-8xl text-primary">404</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-foreground">
          This page wandered off.
        </h1>
        <p className="mt-3 leading-6 text-muted-foreground">
          We couldn't find what you were looking for. It may have moved, or the link might be out of
          date.
        </p>
        <Button className="mt-8" asChild>
          <Link to="/">
            Back to Cyliagen Story <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportRuntimeError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="bg-grain relative flex min-h-screen flex-col items-center justify-center bg-hero px-4">
      <div className="absolute top-6 left-6">
        <Logo />
      </div>
      <div
        className="absolute -z-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative max-w-md text-center">
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-foreground">
          This page didn't load.
        </h1>
        <p className="mt-3 leading-6 text-muted-foreground">
          Something went wrong on our end. Your story and progress are safe — try again, or head
          back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            <RefreshCw /> Try again
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

const organizationJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cyliagen Story",
  description: shareDescription,
  ...(configuredOrigin
    ? { url: configuredOrigin, logo: `${configuredOrigin}/cylia-mark.svg` }
    : {}),
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    scripts: [{ type: "application/ld+json", children: organizationJsonLd }],
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#17484a" },
      { title: "Cyliagen Story — Children’s Story Studio" },
      {
        name: "description",
        content:
          "Create illustrated children’s books, comics, read-aloud stories, and animated scenes with Cyliagen Story.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Cyliagen Story" },
      { property: "og:title", content: shareTitle },
      { property: "og:description", content: shareDescription },
      { property: "og:image", content: shareImageUrl },
      { property: "og:image:width", content: "1536" },
      { property: "og:image:height", content: "1024" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: shareTitle },
      { name: "twitter:description", content: shareDescription },
      { name: "twitter:image", content: shareImageUrl },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/cylia-mark.svg?v=3", type: "image/svg+xml" },
      { rel: "shortcut icon", href: "/favicon.ico?v=3", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/cylia-mark.svg?v=3" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        queryClient.clear();
        void router.invalidate();
      } else if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        void router.invalidate();
        void queryClient.invalidateQueries();
      }
    });
    return () => data.subscription.unsubscribe();
  }, [queryClient, router]);
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
