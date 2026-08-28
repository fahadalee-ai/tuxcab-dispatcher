import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppProvider } from "../lib/store";
import { AppShell } from "../components/AppShell";
import { asset } from "../lib/utils";


function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-black px-6">
      <div className="max-w-sm text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">TuxCab Dispatch</p>
        <h1 className="mt-3 text-6xl font-semibold tracking-tight text-white">404</h1>
        <h2 className="mt-3 text-xl font-semibold text-white">Screen not found</h2>
        <p className="mt-2 text-sm text-[#a5a5a5]">
          This dispatch view doesn’t exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/overview"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-gold px-5 text-sm font-semibold text-black"
          >
            Back to Overview
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-black px-6">
      <div className="max-w-sm text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">System</p>
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-white">This screen didn’t load</h1>
        <p className="mt-2 text-sm text-[#a5a5a5]">
          Dispatch hit an unexpected error. Try again or return to overview.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-gold px-5 text-sm font-semibold text-black"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#292929] bg-[#151515] px-5 text-sm font-semibold text-white"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { title: "TuxCab Dispatch" },
      {
        name: "description",
        content: "Internal dispatch operations portal for TuxCab — Greater Sacramento Area.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#000000" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: asset("/favicon.ico"), type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
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

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AppShell>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </AppShell>
      </AppProvider>
    </QueryClientProvider>
  );
}
